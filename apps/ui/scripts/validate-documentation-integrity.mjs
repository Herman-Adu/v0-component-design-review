#!/usr/bin/env node
/**
 * Documentation Integrity Validator
 *
 * Validates documentation JSON files for:
 * - TOC/Block ID consistency
 * - Content completeness (minimum sections)
 * - Section header presence for each TOC entry
 * - JSON structure integrity
 * - Block type validation
 *
 * Usage: node scripts/validate-documentation-integrity.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_ROOT = path.join(
  __dirname,
  "..",
  "data",
  "strapi-mock",
  "dashboard",
  "documentation",
);

const CATEGORIES = [
  "strategic-overview",
  "cms-reference",
  "app-reference",
  "infrastructure-ops",
];

// Minimum sections expected for content completeness
const MIN_SECTIONS = {
  overview: 3,
  "getting-started": 3,
  default: 2, // minimum for other types
};

const REQUIRED_BLOCK_TYPES = [
  "block.paragraph",
  "block.sectionHeader",
  "block.list",
  "block.callout",
  "block.codeBlock",
  "block.featureGrid",
  "block.statsTable",
  "block.card",
  "block.collapsible",
  "block.linkCard",
];

const issues = [];
const warnings = [];
let filesChecked = 0;
let totalIssues = 0;
let totalWarnings = 0;

function log(level, category, file, issue) {
  const entry = { level, category, file, issue };
  if (level === "ERROR") {
    issues.push(entry);
    totalIssues++;
  } else {
    warnings.push(entry);
    totalWarnings++;
  }
}

function validateFile(filePath, category) {
  const fileName = path.basename(filePath);
  filesChecked++;

  let content;
  try {
    content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (e) {
    log("ERROR", category, fileName, `JSON parse error: ${e.message}`);
    return;
  }

  // Validate required top-level fields
  if (!content.meta) {
    log("ERROR", category, fileName, 'Missing "meta" field');
  }
  if (!content.seo) {
    log("ERROR", category, fileName, 'Missing "seo" field');
  }
  if (!content.toc) {
    log("ERROR", category, fileName, 'Missing "toc" field');
  }
  if (!content.blocks) {
    log("ERROR", category, fileName, 'Missing "blocks" field');
  }

  if (!content.toc || !content.blocks) {
    return; // Cannot continue validation without these
  }

  // Check TOC array is not empty
  if (content.toc.length === 0) {
    log(
      "WARNING",
      category,
      fileName,
      "TOC is empty - document has no sections",
    );
  }

  // Check blocks array is not empty
  if (content.blocks.length === 0) {
    log(
      "ERROR",
      category,
      fileName,
      "Blocks array is empty - document has no content",
    );
    return;
  }

  // Extract section headers from blocks
  const sectionHeaders = content.blocks
    .filter((block) => block.type === "block.sectionHeader")
    .map((block) => ({
      id: block.id,
      title: block.title,
      number: block.number,
    }));

  // Check minimum section count
  const slug = content.meta?.slug || "";
  let minRequired = MIN_SECTIONS.default;
  if (slug.includes("overview")) {
    minRequired = MIN_SECTIONS.overview;
  } else if (slug.includes("getting-started")) {
    minRequired = MIN_SECTIONS["getting-started"];
  }

  if (sectionHeaders.length < minRequired) {
    log(
      "WARNING",
      category,
      fileName,
      `Content is sparse: only ${sectionHeaders.length} sections (expected at least ${minRequired})`,
    );
  }

  // Validate TOC entries have corresponding section headers
  const sectionHeaderIds = new Set(sectionHeaders.map((h) => h.id));
  const tocIds = content.toc.map((t) => t.id);

  for (const tocItem of content.toc) {
    if (!sectionHeaderIds.has(tocItem.id)) {
      log(
        "ERROR",
        category,
        fileName,
        `TOC entry "${tocItem.title}" (id: ${tocItem.id}) has no corresponding section header in blocks`,
      );
    }

    // Validate level is reasonable
    if (tocItem.level !== 2 && tocItem.level !== 3) {
      log(
        "WARNING",
        category,
        fileName,
        `TOC entry "${tocItem.title}" has unusual level: ${tocItem.level} (expected 2 or 3)`,
      );
    }
  }

  // Validate section headers have TOC entries
  const tocIdSet = new Set(tocIds);
  for (const header of sectionHeaders) {
    if (!tocIdSet.has(header.id)) {
      log(
        "WARNING",
        category,
        fileName,
        `Section header "${header.title}" (id: ${header.id}) has no TOC entry`,
      );
    }

    // Check if section header has an ID
    if (!header.id) {
      log(
        "ERROR",
        category,
        fileName,
        `Section header "${header.title}" is missing an id attribute`,
      );
    }
  }

  // Validate block types
  for (let i = 0; i < content.blocks.length; i++) {
    const block = content.blocks[i];

    if (!block.type) {
      log(
        "ERROR",
        category,
        fileName,
        `Block at index ${i} is missing "type" field`,
      );
      continue;
    }

    if (!REQUIRED_BLOCK_TYPES.includes(block.type)) {
      log(
        "ERROR",
        category,
        fileName,
        `Block at index ${i} has invalid type: "${block.type}"`,
      );
    }

    // Type-specific validation
    switch (block.type) {
      case "block.sectionHeader":
        if (!block.title) {
          log(
            "ERROR",
            category,
            fileName,
            `Section header at index ${i} is missing "title" field`,
          );
        }
        if (!block.number) {
          log(
            "WARNING",
            category,
            fileName,
            `Section header "${block.title}" at index ${i} is missing "number" field`,
          );
        }
        break;

      case "block.paragraph":
        if (!block.content) {
          log(
            "ERROR",
            category,
            fileName,
            `Paragraph at index ${i} is missing "content" field`,
          );
        }
        break;

      case "block.list":
        if (block.ordered === undefined) {
          log(
            "ERROR",
            category,
            fileName,
            `List at index ${i} is missing "ordered" field`,
          );
        }
        if (!block.items || !Array.isArray(block.items)) {
          log(
            "ERROR",
            category,
            fileName,
            `List at index ${i} is missing or has invalid "items" array`,
          );
        }
        break;

      case "block.codeBlock":
        if (!block.language) {
          log(
            "WARNING",
            category,
            fileName,
            `Code block at index ${i} is missing "language" field`,
          );
        }
        if (!block.code) {
          log(
            "ERROR",
            category,
            fileName,
            `Code block at index ${i} is missing "code" field`,
          );
        }
        break;

      case "block.callout":
        if (!block.calloutType) {
          log(
            "WARNING",
            category,
            fileName,
            `Callout at index ${i} is missing "calloutType" field`,
          );
        }
        if (!block.content) {
          log(
            "ERROR",
            category,
            fileName,
            `Callout at index ${i} is missing "content" field`,
          );
        }
        break;

      case "block.featureGrid":
        if (!block.features || !Array.isArray(block.features)) {
          log(
            "ERROR",
            category,
            fileName,
            `Feature grid at index ${i} is missing or has invalid "features" array`,
          );
        }
        break;

      case "block.card":
        if (!block.title && !block.content) {
          log(
            "WARNING",
            category,
            fileName,
            `Card at index ${i} has neither "title" nor "content"`,
          );
        }
        break;
    }
  }

  // Check for content richness markers
  const hasCodeBlocks = content.blocks.some(
    (b) => b.type === "block.codeBlock",
  );
  const hasCallouts = content.blocks.some((b) => b.type === "block.callout");
  const hasFeatureGrids = content.blocks.some(
    (b) => b.type === "block.featureGrid",
  );

  if (!hasCodeBlocks && slug.includes("getting-started")) {
    log(
      "WARNING",
      category,
      fileName,
      "Getting started guide should include code examples (block.codeBlock)",
    );
  }

  if (!hasCallouts) {
    log(
      "WARNING",
      category,
      fileName,
      "Document lacks callouts - consider adding important notes or warnings",
    );
  }

  // Check total blocks count for richness
  if (content.blocks.length < 8) {
    log(
      "WARNING",
      category,
      fileName,
      `Content is minimal: only ${content.blocks.length} blocks (consider expanding)`,
    );
  }
}

function validateCategory(category) {
  const categoryPath = path.join(DOCS_ROOT, category);

  if (!fs.existsSync(categoryPath)) {
    console.error(`❌ Category directory not found: ${category}`);
    return;
  }

  const files = fs
    .readdirSync(categoryPath)
    .filter((f) => f.endsWith(".json") && !f.includes("-schema"));

  for (const file of files) {
    validateFile(path.join(categoryPath, file), category);
  }
}

function printReport() {
  console.log("\n" + "=".repeat(80));
  console.log("📋 DOCUMENTATION INTEGRITY VALIDATION REPORT");
  console.log("=".repeat(80));
  console.log(`\n✓ Files checked: ${filesChecked}`);
  console.log(`❌ Issues found: ${totalIssues}`);
  console.log(`⚠️  Warnings: ${totalWarnings}`);

  if (issues.length > 0) {
    console.log("\n" + "─".repeat(80));
    console.log("🚨 ERRORS (must fix):");
    console.log("─".repeat(80));

    for (const issue of issues) {
      console.log(`\n❌ ${issue.category}/${issue.file}`);
      console.log(`   ${issue.issue}`);
    }
  }

  if (warnings.length > 0) {
    console.log("\n" + "─".repeat(80));
    console.log("⚠️  WARNINGS (should review):");
    console.log("─".repeat(80));

    for (const warning of warnings) {
      console.log(`\n⚠️  ${warning.category}/${warning.file}`);
      console.log(`   ${warning.issue}`);
    }
  }

  if (totalIssues === 0 && totalWarnings === 0) {
    console.log("\n✅ All documentation files passed validation!");
  }

  console.log("\n" + "=".repeat(80));

  // Exit with error code if issues found
  if (totalIssues > 0) {
    console.log("❌ Validation failed - please fix errors before building");
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log(
      "⚠️  Validation passed with warnings - consider addressing them",
    );
    process.exit(0);
  } else {
    console.log("✅ Validation passed successfully");
    process.exit(0);
  }
}

// Main execution
console.log("🔍 Starting documentation integrity validation...\n");

for (const category of CATEGORIES) {
  validateCategory(category);
}

printReport();
