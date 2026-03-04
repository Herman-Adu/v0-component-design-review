#!/usr/bin/env node

/**
 * Phase 8: Generate TypeScript Interfaces
 * Reads structure-mapping.json from analyze script
 * Generates TypeScript interfaces for each unique structure
 * Output: /types/strapi-mock.ts
 */

const fs = require("fs");
const path = require("path");

const MAPPING_FILE = "structure-mapping.json";
const OUTPUT_DIR = "types";
const OUTPUT_FILE = path.join(OUTPUT_DIR, "strapi-mock.ts");

if (!fs.existsSync(MAPPING_FILE)) {
  console.error(`✗ Missing ${MAPPING_FILE} - run phase8-analyze-json-structures.js first`);
  process.exit(1);
}

console.log("✓ Reading structure-mapping.json...");

const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, "utf-8"));
const structures = mapping.structures;

// Generate TypeScript interface from structure
function generateInterface(groupKey, files) {
  const fields = groupKey.split("|");
  const interfaceName = generateInterfaceName(files[0].filePath);
  
  let interfaceCode = `/**\n`;
  interfaceCode += ` * ${interfaceName}\n`;
  interfaceCode += ` * Auto-generated from: ${files.map((f) => f.filePath).join(", ")}\n`;
  interfaceCode += ` */\n`;
  interfaceCode += `export interface ${interfaceName} {\n`;
  
  files[0].types.forEach(({ field, type, isArray, isObject }) => {
    let fieldType = type;
    if (isArray) fieldType = `${type}[]`;
    if (isObject) fieldType = "Record<string, unknown>";
    
    interfaceCode += `  ${field}${type === "undefined" ? "?" : ""}: ${fieldType};\n`;
  });
  
  interfaceCode += `}\n\n`;
  return { name: interfaceName, code: interfaceCode };
}

// Generate interface name from file path
function generateInterfaceName(filePath) {
  const filename = path.basename(filePath, ".json");
  return filename
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log("✓ Generating TypeScript interfaces...");

let typeScriptFile = `/**\n * Auto-generated TypeScript interfaces for Strapi mock data\n * Generated at: ${new Date().toISOString()}\n */\n\n`;

const interfaces = [];
Object.entries(structures).forEach(([groupKey, files]) => {
  const { name, code } = generateInterface(groupKey, files);
  interfaces.push(name);
  typeScriptFile += code;
});

// Add exports
typeScriptFile += `// Export all interfaces\nexport type AllTypes = ${interfaces.join(" | ")};\n`;

fs.writeFileSync(OUTPUT_FILE, typeScriptFile);
console.log(`✓ Writing ${OUTPUT_FILE} (${interfaces.length} interfaces)`);
console.log(`✓ Type generation complete!`);
console.log(`✓ Exports: ${interfaces.length} interfaces organized by structure`);
process.exit(0);
