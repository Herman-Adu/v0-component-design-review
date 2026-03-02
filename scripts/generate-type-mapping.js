#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

// Read types file to extract interface definitions
const typesContent = fs.readFileSync("types/strapi-mock.ts", "utf-8");

// Extract all interface names and their source files
const interfaceMatches = [
  ...typesContent.matchAll(
    /export interface (\w+) \{(?:\s|\S)*?(?:Auto-generated from: (.*?)(?:\n|$))?/g,
  ),
];

const typeMapping = {};

// Collect all JSON files
function collectJsonFiles(dir) {
  let result = {};
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      Object.assign(result, collectJsonFiles(fullPath));
    } else if (item.endsWith(".json")) {
      result[item] = fullPath;
    }
  }

  return result;
}

const jsonFiles = collectJsonFiles("data/strapi-mock");

// Build inverse mapping: filenames from comments to types
for (const match of interfaceMatches) {
  const typeName = match[1];
  const filePaths = match[2]?.trim() || "";

  // Extract filenames
  if (filePaths) {
    const files = filePaths
      .split(",")
      .map((f) => {
        const m = f.match(/\\([^\\]*\.json)$/);
        return m ? m[1] : null;
      })
      .filter((f) => f);

    files.forEach((f) => {
      if (!typeMapping[f]) {
        typeMapping[f] = typeName;
      }
    });
  }
}

// Output as JavaScript object literal
console.log("const TYPE_MAPPING = {");
const sortedFiles = Object.keys(typeMapping).sort();
for (const file of sortedFiles) {
  console.log(`  "${file}": "${typeMapping[file]}",`);
}
console.log("};");
