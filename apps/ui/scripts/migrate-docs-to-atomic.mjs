#!/usr/bin/env node
/**
 * Documentation Format Migration Script
 *
 * Migrates all documentation from old block.* format to modern atomic format
 * (molecule.*, atom.*, organism.*)
 *
 * Mapping:
 *   block.paragraph         → atom.paragraph
 *   block.sectionHeader     → molecule.sectionHeader
 *   block.callout           → molecule.infoBox
 *   block.codeBlock         → molecule.codeBlock
 *   block.featureGrid       → organism.featureGrid
 *   block.statsTable        → organism.statsTable
 *   block.list              → (inline paragraphs or convert to feature items)
 *   block.card              → organism.featureGrid item
 *   block.collapsible       → (keep structure, mark for future step-flow)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsPath = path.join(
  __dirname,
  "../data/strapi-mock/dashboard/documentation",
);

// Mapping old → new with transformation logic
const blockTypeMapping = {
  "block.paragraph": "atom.paragraph",
  "block.sectionHeader": "molecule.sectionHeader",
  "block.callout": "molecule.infoBox",
  "block.codeBlock": "molecule.codeBlock",
  "block.featureGrid": "organism.featureGrid",
  "block.statsTable": "organism.statsTable",
  "block.list": "atom.paragraph",
  "block.card": "organism.featureGrid",
  "block.collapsible": "molecule.infoBox",
  "block.linkCard": "organism.relatedArticles",
};

// Transform block from old format to new atomic format
function transformBlock(block) {
  const oldType = block.type;
  const newType = blockTypeMapping[oldType];

  if (!newType) {
    console.warn(`⚠️  Unknown block type: ${oldType}, skipping...`);
    return block;
  }

  const atomicLevel = newType.split(".")[0]; // "molecule" from "molecule.sectionHeader"

  // Handle specific transformations
  switch (oldType) {
    case "block.paragraph":
      return {
        type: newType,
        atomicLevel: atomicLevel,
        props: {
          text: block.content || block.text || "",
        },
      };

    case "block.sectionHeader":
      return {
        type: newType,
        atomicLevel: atomicLevel,
        props: {
          number: block.number || "",
          title: block.title || "",
          id: block.id || "",
        },
      };

    case "block.callout":
      return {
        type: "molecule.infoBox",
        atomicLevel: "molecule",
        props: {
          variant: block.calloutType || "info",
          title: block.title || null,
          body: block.content || "",
        },
      };

    case "block.codeBlock":
      return {
        type: newType,
        atomicLevel: atomicLevel,
        props: {
          language: block.language || "typescript",
          code: block.code || "",
          title: block.title || null,
          showLineNumbers: block.showLineNumbers || false,
        },
      };

    case "block.featureGrid":
      return {
        type: newType,
        atomicLevel: atomicLevel,
        props: {
          columns: block.columns || 2,
          features: block.features || [],
        },
      };

    case "block.statsTable":
      return {
        type: "organism.statsTable",
        atomicLevel: "organism",
        props: {
          headers: block.headers || ["Metric", "Value"],
          rows: block.stats || block.rows || [],
        },
      };

    case "block.list":
      // Convert list to info box with items
      return {
        type: "molecule.infoBox",
        atomicLevel: "molecule",
        props: {
          variant: "info",
          title: null,
          body: (block.items || []).join("\n• "),
        },
      };

    case "block.collapsible":
      // Keep as info box for now (could be improved to step-flow later)
      return {
        type: "molecule.infoBox",
        atomicLevel: "molecule",
        props: {
          variant: "info",
          title: block.title || null,
          body: block.content || "",
        },
      };

    case "block.linkCard":
      return {
        type: "organism.relatedArticles",
        atomicLevel: "organism",
        props: {
          title: block.title || null,
          links: [
            {
              href: block.href || "#",
              title: block.title || "",
              description: block.description || "",
              icon: block.icon || "link",
            },
          ],
        },
      };

    default:
      return {
        ...block,
        atomicLevel: atomicLevel,
      };
  }
}

// Walk and migrate files
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith(".json")) {
      callback(fullPath);
    }
  });
}

console.log("🔄 DOCUMENTATION FORMAT MIGRATION\n");
console.log("Migrating all files from block.* to atomic format...\n");

const results = {
  success: [],
  skipped: [],
  error: [],
};

walkDir(docsPath, (filePath) => {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Skip if no blocks (rare case)
    if (!content.blocks || content.blocks.length === 0) {
      results.skipped.push(filePath);
      return;
    }

    // Check if already migrated (has atomicLevel)
    const alreadyMigrated = content.blocks.some((b) => b.atomicLevel);
    if (
      alreadyMigrated &&
      !content.blocks.some((b) => b.type?.startsWith("block."))
    ) {
      results.skipped.push(filePath);
      return;
    }

    // Transform blocks
    const originalBlockCount = content.blocks.length;
    content.blocks = content.blocks.map((block) => transformBlock(block));

    // Remove TOC from simple pages (less than 10 blocks)
    if (content.toc && content.blocks.length < 10) {
      content.toc = undefined;
    }

    // Write back
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + "\n", "utf8");

    results.success.push({
      path: filePath,
      blocks: originalBlockCount,
    });
  } catch (error) {
    results.error.push({
      path: filePath,
      error: error.message,
    });
  }
});

// Print results
console.log("✅ MIGRATION COMPLETE\n");
console.log(`Success:  ${results.success.length} files migrated`);
console.log(`Skipped:  ${results.skipped.length} files (already modern)`);
console.log(`Errors:   ${results.error.length} files\n`);

if (results.success.length > 0) {
  console.log("Migrated files:");
  results.success.forEach(({ path: filePath, blocks }) => {
    const fileName = filePath.split("\\").pop();
    console.log(`  ✅ ${fileName} (${blocks} blocks)`);
  });
  console.log();
}

if (results.error.length > 0) {
  console.log("Errors:");
  results.error.forEach(({ path: filePath, error }) => {
    const fileName = filePath.split("\\").pop();
    console.log(`  ❌ ${fileName}: ${error}`);
  });
  console.log();
}

console.log("🎯 Next Steps:");
console.log("  1. Run npm run build to test with new format");
console.log("  2. Update strategic-overview-schema.ts to accept atomic blocks");
console.log("  3. Remove old block.* types from schema (clean API)\n");
