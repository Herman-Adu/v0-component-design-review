#!/usr/bin/env node
/**
 * Phase 1: JSON Data Standardization
 *
 * Converts all content-library JSON files from mixed naming formats
 * to unified atomic-level format (molecule.*, atom.*, organism.*)
 *
 * Mapping:
 *   section-header       → molecule.sectionHeader
 *   paragraph             → atom.paragraph
 *   code-block           → molecule.codeBlock
 *   sub-section-header   → molecule.subSectionHeader
 *   info-box             → molecule.infoBox
 *   key-takeaway         → molecule.keyTakeaway
 *   stats-table          → organism.statsTable
 *   feature-grid         → organism.featureGrid
 *   metrics-grid         → organism.metricsGrid
 *   vertical-flow        → organism.verticalFlow
 *   comparison-cards     → organism.comparisonCards
 *   step-flow            → organism.stepFlow
 *   data-flow-diagram    → organism.dataFlowDiagram
 *   architecture-diagram → organism.architectureDiagram
 *   before-after-comparison → organism.beforeAfterComparison
 *   process-flow         → organism.processFlow
 *   related-articles     → organism.relatedArticles
 *   decision-tree        → organism.decisionTree
 *   file-tree            → organism.fileTree
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentLibraryPath = path.join(
  __dirname,
  "../data/strapi-mock/dashboard/content-library",
);

// Mapping table: legacy format → atomic format
const legacyToAtomicMapping = {
  "section-header": "molecule.sectionHeader",
  paragraph: "atom.paragraph",
  "code-block": "molecule.codeBlock",
  "sub-section-header": "molecule.subSectionHeader",
  "info-box": "molecule.infoBox",
  "key-takeaway": "molecule.keyTakeaway",
  "stats-table": "organism.statsTable",
  "feature-grid": "organism.featureGrid",
  "metrics-grid": "organism.metricsGrid",
  "vertical-flow": "organism.verticalFlow",
  "comparison-cards": "organism.comparisonCards",
  "step-flow": "organism.stepFlow",
  "data-flow-diagram": "organism.dataFlowDiagram",
  "architecture-diagram": "organism.architectureDiagram",
  "before-after-comparison": "organism.beforeAfterComparison",
  "process-flow": "organism.processFlow",
  "related-articles": "organism.relatedArticles",
  "decision-tree": "organism.decisionTree",
  "file-tree": "organism.fileTree",
};

// Extract atomic level from atomic format name
function getAtomicLevel(atomicTypeName) {
  return atomicTypeName.split(".")[0]; // "molecule.sectionHeader" → "molecule"
}

// Walk through all JSON files
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

// Standardize a single file
function standardizeFile(filePath) {
  try {
    let content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    let hasChanges = false;

    if (content.blocks && Array.isArray(content.blocks)) {
      content.blocks = content.blocks.map((block) => {
        const blockType = block.type;

        // Check if this block uses legacy format
        if (legacyToAtomicMapping[blockType]) {
          const atomicType = legacyToAtomicMapping[blockType];
          const atomicLevel = getAtomicLevel(atomicType);

          hasChanges = true;

          // Only update type and atomicLevel, preserve EVERYTHING else (especially props)
          return {
            ...block,
            type: atomicType,
            atomicLevel: atomicLevel,
          };
        }

        // If already in atomic format, ensure atomicLevel is set
        if (blockType && blockType.includes(".") && !block.atomicLevel) {
          hasChanges = true;
          const atomicLevel = getAtomicLevel(blockType);
          return {
            ...block,
            atomicLevel: atomicLevel,
          };
        }

        // Unknown or already correct - leave as is
        return block;
      });
    }

    // Write back if changed
    if (hasChanges) {
      fs.writeFileSync(
        filePath,
        JSON.stringify(content, null, 2) + "\n",
        "utf8",
      );
      return { status: "updated", filePath };
    }

    return { status: "unchanged", filePath };
  } catch (error) {
    return { status: "error", filePath, error: error.message };
  }
}

// Main execution
console.log("🔧 Phase 1: JSON Data Standardization\n");
console.log("Converting legacy block format to atomic-level format...\n");

const results = {
  updated: [],
  unchanged: [],
  errors: [],
};

walkDir(contentLibraryPath, (filePath) => {
  const result = standardizeFile(filePath);
  results[result.status].push(result);
});

// Display results
console.log("📊 Standardization Results:\n");
console.log(`  ✅ Updated files:   ${results.updated.length}`);
console.log(`  ℹ️  Unchanged files: ${results.unchanged.length}`);
console.log(`  ❌ Errors:          ${results.errors.length}\n`);

if (results.errors.length > 0) {
  console.log("❌ Errors encountered:");
  results.errors.forEach(({ filePath, error }) => {
    console.log(`    ${filePath}: ${error}`);
  });
  console.log();
}

console.log("✅ Phase 1 Complete: JSON standardization finished\n");
console.log("Next steps:");
console.log("  1. Run Phase 0C validation script to verify 100% atomic format");
console.log("  2. Run npm run build to ensure all pages still render");
console.log(
  "  3. Commit changes with message: 'Phase 1: Standardize content-library to atomic block format'\n",
);
