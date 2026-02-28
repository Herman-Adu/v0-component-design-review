#!/usr/bin/env node

/**
 * Phase 8: Analyze JSON Structures
 * Scans all 29 JSON files in /data/strapi-mock/
 * Extracts unique structure patterns and groups similar structures
 * Output: structure-mapping.json
 */

const fs = require("fs");
const path = require("path");

const STRAPI_MOCK_DIR = path.join(process.cwd(), "data", "strapi-mock");
const OUTPUT_FILE = "structure-mapping.json";

console.log("✓ Scanning 29 JSON files...");

// Recursively find all JSON files
function findJsonFiles(dir) {
  let files = [];
  if (!fs.existsSync(dir)) {
    console.error(`✗ Directory not found: ${dir}`);
    process.exit(1);
  }
  
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(findJsonFiles(fullPath));
    } else if (item.endsWith(".json")) {
      files.push(fullPath);
    }
  }
  return files;
}

// Extract structure from JSON
function analyzeStructure(jsonContent, filePath) {
  try {
    const data = JSON.parse(jsonContent);
    return {
      fields: Object.keys(data),
      types: Object.entries(data).map(([k, v]) => ({
        field: k,
        type: typeof v,
        isArray: Array.isArray(v),
        isObject: typeof v === "object" && v !== null && !Array.isArray(v),
      })),
      filePath,
    };
  } catch (e) {
    console.error(`✗ Parse error in ${filePath}: ${e.message}`);
    return null;
  }
}

// Group similar structures
function groupStructures(structures) {
  const groups = {};
  
  structures.forEach((struct) => {
    if (!struct) return;
    const key = struct.fields.sort().join("|");
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(struct);
  });
  
  return groups;
}

// Main execution
const jsonFiles = findJsonFiles(STRAPI_MOCK_DIR);
console.log(`✓ Found ${jsonFiles.length} JSON files`);

const structures = jsonFiles.map((file) => {
  const content = fs.readFileSync(file, "utf-8");
  return analyzeStructure(content, file);
});

const groups = groupStructures(structures);
const uniqueCount = Object.keys(groups).length;

console.log(`✓ Analyzing structure patterns...`);
console.log(`✓ Found ${uniqueCount} unique structure types`);

const report = {
  timestamp: new Date().toISOString(),
  totalFiles: jsonFiles.length,
  uniqueStructures: uniqueCount,
  structures: groups,
  summary: {
    filesScanned: jsonFiles.length,
    uniqueTypes: uniqueCount,
    reusableInterfaces: uniqueCount,
  },
};

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(report, null, 2));
console.log(`✓ Generated: ${OUTPUT_FILE}`);
console.log(`✓ Analysis complete - ${uniqueCount} unique structure types found`);
process.exit(0);
