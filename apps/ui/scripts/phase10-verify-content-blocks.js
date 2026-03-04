#!/usr/bin/env node

/**
 * Phase 10: Content Block Migration - VERIFICATION
 *
 * PURPOSE: Validate migrated guides/tutorials follow article block patterns
 *
 * VALIDATION CHECKS:
 * 1. ✓ All files have valid JSON structure
 * 2. ✓ Required fields exist (meta, layout, toc, blocks)
 * 3. ✓ Blocks follow atomic architecture (atom/molecule/organism)
 * 4. ✓ Block types match article block type patterns
 * 5. ✓ Props are properly structured
 * 6. ✓ TOC entries match section headers in blocks
 * 7. ✓ No orphaned sections/steps remain
 *
 * EXITS WITH:
 * - Code 0: All validations passed
 * - Code 1: Validation failures found
 *
 * Usage: node scripts/phase10-verify-content-blocks.js
 */

const fs = require("fs");
const path = require("path");

const CONTENT_LIBRARY_DIR = path.join(
  process.cwd(),
  "data",
  "strapi-mock",
  "dashboard",
  "content-library",
);
const VERIFICATION_REPORT = path.join(
  process.cwd(),
  "phase10-verification-report.json",
);

// Valid block types (from articles/case-studies)
const VALID_BLOCK_TYPES = [
  "atom.paragraph",
  "molecule.infoBox",
  "molecule.sectionHeader",
  "molecule.subSectionHeader",
  "molecule.codeBlock",
  "molecule.keyTakeaway",
  "organism.metricsGrid",
  "organism.featureGrid",
  "organism.comparisonCards",
  "organism.processFlow",
  "organism.stepFlow",
  "organism.statsTable",
  "organism.relatedArticles",
  "organism.architectureDiagram",
  "organism.fileTree",
  "organism.decisionTree",
  "organism.dataFlowDiagram",
  "organism.verticalFlow",
  "organism.beforeAfterComparison",
  "organism.numberedList",
];

const VALID_ATOMIC_LEVELS = ["atom", "molecule", "organism"];

// Console colors
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

function validateJSONStructure(filePath) {
  const errors = [];

  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(content);

    // Required top-level fields
    const requiredFields = ["meta", "layout", "blocks"];
    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      }
    }

    // Meta validation
    if (data.meta) {
      const requiredMetaFields = [
        "slug",
        "title",
        "excerpt",
        "level",
        "category",
        "readTime",
        "publishedAt",
        "tags",
      ];
      for (const field of requiredMetaFields) {
        if (!data.meta[field]) {
          errors.push(`Missing meta.${field}`);
        }
      }
    }

    // Layout validation
    if (
      data.layout &&
      !["content-with-toc", "content-only"].includes(data.layout)
    ) {
      errors.push(`Invalid layout: ${data.layout}`);
    }

    // Blocks validation
    if (data.blocks) {
      if (!Array.isArray(data.blocks)) {
        errors.push("blocks must be an array");
      } else if (data.blocks.length === 0) {
        errors.push("blocks array is empty");
      }
    }

    return { valid: errors.length === 0, errors, data };
  } catch (error) {
    return {
      valid: false,
      errors: [`JSON parse error: ${error.message}`],
      data: null,
    };
  }
}

function validateBlocks(blocks, filePath) {
  const errors = [];
  const warnings = [];

  blocks.forEach((block, index) => {
    const blockId = `Block ${index + 1}`;

    // Required block fields
    if (!block.type) {
      errors.push(`${blockId}: Missing 'type' field`);
    }

    if (!block.atomicLevel) {
      errors.push(`${blockId}: Missing 'atomicLevel' field`);
    } else if (!VALID_ATOMIC_LEVELS.includes(block.atomicLevel)) {
      errors.push(`${blockId}: Invalid atomicLevel '${block.atomicLevel}'`);
    }

    // Validate block type
    if (block.type && !VALID_BLOCK_TYPES.includes(block.type)) {
      warnings.push(
        `${blockId}: Non-standard block type '${block.type}' (may need to add to renderer)`,
      );
    }

    // Validate props exist (even if empty)
    if (!block.hasOwnProperty("props")) {
      errors.push(`${blockId}: Missing 'props' field`);
    }

    // Type-specific validations
    if (block.type === "molecule.codeBlock") {
      if (!block.props?.code) {
        errors.push(`${blockId}: codeBlock missing props.code`);
      }
    }

    if (block.type === "molecule.sectionHeader") {
      if (!block.props?.title) {
        errors.push(`${blockId}: sectionHeader missing props.title`);
      }
      if (!block.props?.id) {
        warnings.push(
          `${blockId}: sectionHeader missing props.id (helpful for TOC)`,
        );
      }
    }

    if (block.type === "atom.paragraph") {
      if (!block.props?.text) {
        errors.push(`${blockId}: paragraph missing props.text`);
      }
    }
  });

  return { errors, warnings };
}

function validateTOC(toc, blocks) {
  const errors = [];
  const warnings = [];

  if (!toc || toc.length === 0) {
    warnings.push(
      "TOC is empty (consider generating from sectionHeader blocks)",
    );
    return { errors, warnings };
  }

  // Extract section IDs from blocks
  const sectionBlocks = blocks.filter(
    (b) => b.type === "molecule.sectionHeader",
  );
  const sectionIds = sectionBlocks.map((b) => b.props?.id).filter(Boolean);

  // Check TOC entries match sections
  toc.forEach((entry, index) => {
    if (!entry.id) {
      errors.push(`TOC entry ${index + 1}: Missing 'id' field`);
    }
    if (!entry.title) {
      errors.push(`TOC entry ${index + 1}: Missing 'title' field`);
    }
    if (!entry.level || typeof entry.level !== "number") {
      errors.push(`TOC entry ${index + 1}: Invalid or missing 'level' field`);
    }

    // Check if TOC ID exists in blocks
    if (entry.id && !sectionIds.includes(entry.id)) {
      warnings.push(
        `TOC entry '${entry.title}' (id: ${entry.id}) has no matching sectionHeader in blocks`,
      );
    }
  });

  return { errors, warnings };
}

function checkForOrphanedContent(data) {
  const warnings = [];

  // Check for old structure remnants
  if (data.sections) {
    warnings.push(
      '⚠️  CRITICAL: Old "sections" array still exists - migration incomplete',
    );
  }
  if (data.steps) {
    warnings.push(
      '⚠️  CRITICAL: Old "steps" array still exists - migration incomplete',
    );
  }

  return warnings;
}

// ============================================================================
// FILE SCANNING
// ============================================================================

function findContentFiles(dir) {
  let files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(findContentFiles(fullPath));
    } else if (item.endsWith(".json") && !item.includes("-list.json")) {
      files.push(fullPath);
    }
  }

  return files;
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  log(
    "\n╔═══════════════════════════════════════════════════════════════╗",
    "blue",
  );
  log(
    "║  Phase 10: Content Block Verification                        ║",
    "blue",
  );
  log(
    "╚═══════════════════════════════════════════════════════════════╝\n",
    "blue",
  );

  const report = {
    timestamp: new Date().toISOString(),
    guides: [],
    tutorials: [],
    summary: {
      totalFiles: 0,
      passed: 0,
      failed: 0,
      warnings: 0,
    },
  };

  let hasErrors = false;

  // VALIDATE GUIDES
  log("📘 Validating Guides...", "yellow");
  const guidesDir = path.join(CONTENT_LIBRARY_DIR, "guides");
  const guideFiles = findContentFiles(guidesDir);

  for (const guideFile of guideFiles) {
    const fileName = path.basename(guideFile);
    log(`\n  Checking: ${fileName}`, "cyan");

    const fileReport = {
      file: fileName,
      path: guideFile,
      errors: [],
      warnings: [],
    };

    // Validate structure
    const structureCheck = validateJSONStructure(guideFile);
    if (!structureCheck.valid) {
      fileReport.errors.push(...structureCheck.errors);
      log(`    ✗ Structure validation failed`, "red");
      hasErrors = true;
    } else {
      log(`    ✓ Structure valid`, "green");

      // Validate blocks
      const blocksCheck = validateBlocks(structureCheck.data.blocks, guideFile);
      fileReport.errors.push(...blocksCheck.errors);
      fileReport.warnings.push(...blocksCheck.warnings);

      if (blocksCheck.errors.length > 0) {
        log(
          `    ✗ Block validation failed (${blocksCheck.errors.length} errors)`,
          "red",
        );
        hasErrors = true;
      } else {
        log(
          `    ✓ Blocks valid (${structureCheck.data.blocks.length} blocks)`,
          "green",
        );
      }

      if (blocksCheck.warnings.length > 0) {
        log(`    ⚠ ${blocksCheck.warnings.length} warnings`, "yellow");
      }

      // Validate TOC
      const tocCheck = validateTOC(
        structureCheck.data.toc,
        structureCheck.data.blocks,
      );
      fileReport.errors.push(...tocCheck.errors);
      fileReport.warnings.push(...tocCheck.warnings);

      if (tocCheck.errors.length > 0) {
        log(`    ✗ TOC validation failed`, "red");
        hasErrors = true;
      } else {
        log(`    ✓ TOC valid`, "green");
      }

      // Check for orphaned content
      const orphanWarnings = checkForOrphanedContent(structureCheck.data);
      fileReport.warnings.push(...orphanWarnings);

      if (orphanWarnings.length > 0) {
        orphanWarnings.forEach((w) => log(`    ${w}`, "red"));
        hasErrors = true;
      }
    }

    report.guides.push(fileReport);
    report.summary.totalFiles++;
    if (fileReport.errors.length === 0) {
      report.summary.passed++;
    } else {
      report.summary.failed++;
    }
    report.summary.warnings += fileReport.warnings.length;
  }

  // VALIDATE TUTORIALS
  log("\n\n📗 Validating Tutorials...", "yellow");
  const tutorialsDir = path.join(CONTENT_LIBRARY_DIR, "tutorials");
  const tutorialFiles = findContentFiles(tutorialsDir);

  for (const tutorialFile of tutorialFiles) {
    const fileName = path.basename(tutorialFile);
    log(`\n  Checking: ${fileName}`, "cyan");

    const fileReport = {
      file: fileName,
      path: tutorialFile,
      errors: [],
      warnings: [],
    };

    // Validate structure
    const structureCheck = validateJSONStructure(tutorialFile);
    if (!structureCheck.valid) {
      fileReport.errors.push(...structureCheck.errors);
      log(`    ✗ Structure validation failed`, "red");
      hasErrors = true;
    } else {
      log(`    ✓ Structure valid`, "green");

      // Validate blocks
      const blocksCheck = validateBlocks(
        structureCheck.data.blocks,
        tutorialFile,
      );
      fileReport.errors.push(...blocksCheck.errors);
      fileReport.warnings.push(...blocksCheck.warnings);

      if (blocksCheck.errors.length > 0) {
        log(
          `    ✗ Block validation failed (${blocksCheck.errors.length} errors)`,
          "red",
        );
        hasErrors = true;
      } else {
        log(
          `    ✓ Blocks valid (${structureCheck.data.blocks.length} blocks)`,
          "green",
        );
      }

      if (blocksCheck.warnings.length > 0) {
        log(`    ⚠ ${blocksCheck.warnings.length} warnings`, "yellow");
      }

      // Validate TOC
      const tocCheck = validateTOC(
        structureCheck.data.toc,
        structureCheck.data.blocks,
      );
      fileReport.errors.push(...tocCheck.errors);
      fileReport.warnings.push(...tocCheck.warnings);

      if (tocCheck.errors.length > 0) {
        log(`    ✗ TOC validation failed`, "red");
        hasErrors = true;
      } else {
        log(`    ✓ TOC valid`, "green");
      }

      // Check for orphaned content
      const orphanWarnings = checkForOrphanedContent(structureCheck.data);
      fileReport.warnings.push(...orphanWarnings);

      if (orphanWarnings.length > 0) {
        orphanWarnings.forEach((w) => log(`    ${w}`, "red"));
        hasErrors = true;
      }
    }

    report.tutorials.push(fileReport);
    report.summary.totalFiles++;
    if (fileReport.errors.length === 0) {
      report.summary.passed++;
    } else {
      report.summary.failed++;
    }
    report.summary.warnings += fileReport.warnings.length;
  }

  // Write report
  fs.writeFileSync(VERIFICATION_REPORT, JSON.stringify(report, null, 2));

  // Final summary
  log(
    "\n\n╔═══════════════════════════════════════════════════════════════╗",
    "blue",
  );
  log(
    "║  Verification Complete                                        ║",
    "blue",
  );
  log(
    "╚═══════════════════════════════════════════════════════════════╝\n",
    "blue",
  );

  log(`📊 Summary:`, "cyan");
  log(`  Total files: ${report.summary.totalFiles}`, "cyan");
  log(
    `  Passed: ${report.summary.passed}`,
    report.summary.passed > 0 ? "green" : "reset",
  );
  log(
    `  Failed: ${report.summary.failed}`,
    report.summary.failed > 0 ? "red" : "green",
  );
  log(
    `  Warnings: ${report.summary.warnings}`,
    report.summary.warnings > 0 ? "yellow" : "reset",
  );

  log(`\n✓ Report saved: ${VERIFICATION_REPORT}`, "cyan");

  if (hasErrors) {
    log("\n✗ VERIFICATION FAILED - See report for details", "red");
    log(
      "  Fix errors or run rollback: node scripts/phase10-rollback-content-blocks.js\n",
      "yellow",
    );
    process.exit(1);
  } else {
    log("\n✓ ALL VALIDATIONS PASSED", "green");
    log("\n📋 Next Steps:", "yellow");
    log("  1. Update schemas: guides/tutorials to use block structure", "cyan");
    log("  2. Run: pnpm exec tsc --noEmit", "cyan");
    log("  3. Run: pnpm run build\n", "cyan");
    process.exit(0);
  }
}

main().catch((error) => {
  log(`\n✗ Fatal error: ${error.message}`, "red");
  console.error(error);
  process.exit(1);
});
