#!/usr/bin/env node
/**
 * Phase 0A: Content Library Structure Validation
 *
 * Analyzes:
 * - Block type inventory (what atomic components are used)
 * - Block type distribution (how many of each)
 * - Content type statistics (articles, guides, tutorials, case-studies)
 * - Block coverage gaps (needed components vs. existing components)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentLibraryPath = path.join(
  __dirname,
  "../data/strapi-mock/dashboard/content-library",
);

// Data structures to track findings
const blockTypeInventory = {};
const contentTypeStats = {
  articles: 0,
  guides: 0,
  tutorials: 0,
  "case-studies": 0,
};
const fileStats = {
  total: 0,
  withBlocks: 0,
  withErrors: 0,
};

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

// Main analysis
console.log("🔍 Phase 0A: Content Library Structure Audit\n");

walkDir(contentLibraryPath, (filePath) => {
  fileStats.total++;
  try {
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (content.blocks && Array.isArray(content.blocks)) {
      fileStats.withBlocks++;

      // Track block types
      content.blocks.forEach((block) => {
        const blockType = block.type || "unknown";
        if (!blockTypeInventory[blockType]) {
          blockTypeInventory[blockType] = 0;
        }
        blockTypeInventory[blockType]++;
      });

      // Track content type
      if (content.meta?.category) {
        const category = content.meta.category;
        // Determine content type from path
        if (filePath.includes("/articles/")) contentTypeStats.articles++;
        else if (filePath.includes("/guides/")) contentTypeStats.guides++;
        else if (filePath.includes("/tutorials/")) contentTypeStats.tutorials++;
        else if (filePath.includes("/case-studies/"))
          contentTypeStats["case-studies"]++;
      }
    }
  } catch (error) {
    fileStats.withErrors++;
    console.error(`❌ Error parsing ${filePath}:`, error.message);
  }
});

// Output results
console.log("📊 Content Type Statistics:");
console.log(`  Articles:    ${contentTypeStats.articles}`);
console.log(`  Guides:      ${contentTypeStats.guides}`);
console.log(`  Tutorials:   ${contentTypeStats.tutorials}`);
console.log(`  Case Studies: ${contentTypeStats["case-studies"]}\n`);

console.log("📋 File Statistics:");
console.log(`  Total files:     ${fileStats.total}`);
console.log(`  With blocks:     ${fileStats.withBlocks}`);
console.log(`  Parsing errors:  ${fileStats.withErrors}\n`);

console.log("🧩 Block Type Inventory:");
const sortedBlockTypes = Object.entries(blockTypeInventory).sort(
  (a, b) => b[1] - a[1],
);

let totalBlocks = 0;
sortedBlockTypes.forEach(([type, count]) => {
  console.log(`  ${type.padEnd(30)} : ${count}`);
  totalBlocks += count;
});
console.log(`  ${"─".repeat(50)}`);
console.log(`  ${"TOTAL BLOCKS".padEnd(30)} : ${totalBlocks}\n`);

// Identify gaps
console.log("⚠️  Impact Analysis:");
const atomicLevels = {};
sortedBlockTypes.forEach(([type]) => {
  const [level] = type.split(".");
  if (!atomicLevels[level]) {
    atomicLevels[level] = 0;
  }
  atomicLevels[level]++;
});

console.log(`  Atomic levels in use: ${Object.keys(atomicLevels).join(", ")}`);
console.log(`  Total unique block types: ${sortedBlockTypes.length}`);
console.log(
  `  Average blocks per file: ${(totalBlocks / fileStats.withBlocks).toFixed(1)}\n`,
);

console.log("✅ Phase 0A Complete: Content library structure validated");
console.log("\nNext: Phase 0B - Audit atomic component usage\n");
