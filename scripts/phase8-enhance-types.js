#!/usr/bin/env node

/**
 * Phase 8 Enhanced: Dynamic Zones Type Generation
 *
 * This script:
 * 1. Analyzes ALL block structures from JSON data
 * 2. Generates discriminated union types for blocks
 * 3. Creates complete typed interfaces matching STRAPI_DYNAMIC_ZONES_AUTHORITY
 * 4. Outputs: types/strapi-mock-blocks.ts (block definitions)
 *            types/strapi-mock-complete.ts (full document types with blocks)
 */

const fs = require("fs");
const path = require("path");

// Recursively find all JSON files
function findJsonFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      results = results.concat(findJsonFiles(fullPath));
    } else if (item.endsWith(".json")) {
      results.push(fullPath);
    }
  }
  return results;
}

// Analyze block structures
function analyzeBlocks(jsonFiles) {
  const blockTypes = new Map(); // type -> { props, examples }

  for (const file of jsonFiles) {
    try {
      const content = JSON.parse(fs.readFileSync(file, "utf-8"));

      // Check if this file has blocks
      if (!content.blocks || !Array.isArray(content.blocks)) continue;

      // Analyze each block
      for (const block of content.blocks) {
        if (!block.type) continue;

        const key = block.type;
        if (!blockTypes.has(key)) {
          blockTypes.set(key, {
            examples: [],
            props: new Set(),
          });
        }

        const entry = blockTypes.get(key);
        entry.examples.push({
          file: path.relative(process.cwd(), file),
          block,
        });

        // Extract prop keys
        if (block.props && typeof block.props === "object") {
          for (const propKey of Object.keys(block.props)) {
            entry.props.add(propKey);
          }
        }
      }
    } catch (e) {
      // Skip files that can't be parsed
    }
  }

  return blockTypes;
}

// Generate TypeScript interfaces for blocks
function generateBlockTypes(blockTypes) {
  const lines = [];

  lines.push("/**");
  lines.push(" * Auto-generated Block Type Definitions");
  lines.push(" * Generated from actual JSON structure analysis");
  lines.push(" * Extends: STRAPI_DYNAMIC_ZONES_AUTHORITY.md");
  lines.push(" */\n");

  // Base block interface
  lines.push(
    "// Base block interface - all blocks must have type & atomicLevel",
  );
  lines.push("export interface BaseBlock {");
  lines.push(
    '  type: string;                    // Discriminator (e.g., "molecule.infoBox")',
  );
  lines.push(
    '  atomicLevel?: "atom" | "molecule" | "organism";  // Atomic design level',
  );
  lines.push("  id?: string;                     // Optional anchor ID");
  lines.push("}\n");

  // Generate individual block types
  lines.push(
    "// Specific block type definitions (discriminated union members)",
  );
  const sortedTypes = Array.from(blockTypes.entries()).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );

  for (const [blockType, info] of sortedTypes) {
    const interfaceName = blockTypeToInterface(blockType);
    const props = Array.from(info.props).sort();

    lines.push("");
    lines.push(`export interface ${interfaceName} extends BaseBlock {`);
    lines.push(`  type: "${blockType}";`);

    if (props.length > 0) {
      lines.push("  props: {");
      for (const prop of props) {
        lines.push(`    ${prop}?: unknown;  // Inferred from data`);
      }
      lines.push("  };");
    } else {
      lines.push("  props?: Record<string, unknown>;");
    }

    lines.push("}");
  }

  // Generate the discriminated union type
  lines.push("\n// Discriminated union of all block types");
  lines.push("export type Block =");
  const blockInterfaces = sortedTypes.map(([type]) =>
    blockTypeToInterface(type),
  );
  for (let i = 0; i < blockInterfaces.length; i++) {
    const prefix = i === 0 ? "" : "| ";
    const suffix = i === blockInterfaces.length - 1 ? ";" : "";
    lines.push(`  ${prefix}${blockInterfaces[i]}${suffix}`);
  }

  lines.push("\n// Helper: Type-safe block discriminator");
  lines.push("export function isBlockType<T extends Block>(");
  lines.push("  block: Block,");
  lines.push('  type: T["type"]');
  lines.push("): block is T {");
  lines.push("  return block.type === type;");
  lines.push("}\n");

  return lines.join("\n");
}

// Convert block type to interface name (e.g., "molecule.infoBox" -> "MoleculeInfoBox")
function blockTypeToInterface(blockType) {
  return blockType
    .split(/[.\-_]/) // Split on dot, hyphen, or underscore
    .filter((part) => part.length > 0) // Remove empty parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // PascalCase
    .join(""); // No separators
}

// Generate complete document types
function generateCompleteTypes(blockTypes) {
  const lines = [];

  lines.push("/**");
  lines.push(" * Complete Document Type Definitions");
  lines.push(" * Includes: Meta, SEO, Route, Access, TOC, Blocks");
  lines.push(
    " * Aligned with: STRAPI_DYNAMIC_ZONES_AUTHORITY.md canonical contract",
  );
  lines.push(" */\n");

  lines.push("import * as Blocks from './strapi-mock-blocks';\n");

  // Meta interface
  lines.push("export interface DocumentMeta {");
  lines.push("  slug: string;");
  lines.push("  title: string;");
  lines.push("  excerpt: string;");
  lines.push("  category?: string;");
  lines.push('  level?: "beginner" | "intermediate" | "advanced";');
  lines.push("  readTime?: string;");
  lines.push("  publishedAt: string;");
  lines.push("  tags?: string[];");
  lines.push("}\n");

  // SEO interface
  lines.push("export interface DocumentSEO {");
  lines.push("  metaTitle?: string;");
  lines.push("  metaDescription?: string;");
  lines.push("  keywords?: string;");
  lines.push("  canonicalUrl?: string;");
  lines.push("  metaImage?: string | { url: string; alt?: string };");
  lines.push("  metaSocial?: Array<{");
  lines.push('    socialNetwork: "Facebook" | "Twitter";');
  lines.push("    title?: string;");
  lines.push("    description?: string;");
  lines.push("    image?: string | { url: string; alt?: string };");
  lines.push("  }>;");
  lines.push("  robots?: string | { index?: boolean; follow?: boolean };");
  lines.push("  preventIndexing?: boolean;");
  lines.push("}\n");

  // Route interface
  lines.push("export interface DocumentRoute {");
  lines.push("  pattern: string;");
  lines.push("  params: Record<string, string>;");
  lines.push("}\n");

  // Access interface
  lines.push("export interface DocumentAccess {");
  lines.push("  requiresAuth?: boolean;");
  lines.push("  requiredRoles?: string[];");
  lines.push("  visibleToPublic?: boolean;");
  lines.push("}\n");

  // TOC interface
  lines.push("export interface DocumentTOCItem {");
  lines.push("  id?: string;");
  lines.push("  title: string;");
  lines.push("  level: number;");
  lines.push("  children?: DocumentTOCItem[];");
  lines.push("}\n");

  // Complete document interface
  lines.push("export interface ContentDocument {");
  lines.push("  meta: DocumentMeta;");
  lines.push("  seo?: DocumentSEO;");
  lines.push("  route?: DocumentRoute;");
  lines.push("  access?: DocumentAccess;");
  lines.push("  toc?: DocumentTOCItem[];");
  lines.push("  blocks: Blocks.Block[];");
  lines.push(
    "  [key: string]: unknown;  // Allow additional domain-specific fields",
  );
  lines.push("}\n");

  return lines.join("\n");
}

console.log("Phase 8 Enhanced: Dynamic Zones Type Generation");
console.log("=".repeat(60));
console.log("");

// Analyze blocks
const dataDir = path.resolve("data/strapi-mock");
const jsonFiles = findJsonFiles(dataDir);
console.log(`Found ${jsonFiles.length} JSON files\n`);

const blockTypes = analyzeBlocks(jsonFiles);
console.log(`Identified ${blockTypes.size} unique block types\n`);

// Show block type summary
console.log("Block Type Summary:");
const sortedTypes = Array.from(blockTypes.entries()).sort((a, b) => {
  const aCount = a[1].examples.length;
  const bCount = b[1].examples.length;
  return bCount - aCount;
});

for (const [type, info] of sortedTypes.slice(0, 15)) {
  console.log(
    `  ${type} (${info.examples.length} examples, ${info.props.size} props)`,
  );
}

if (sortedTypes.length > 15) {
  console.log(`  ... and ${sortedTypes.length - 15} more`);
}

console.log("");

// Generate type files
const blockTypesCode = generateBlockTypes(blockTypes);
const completeTypesCode = generateCompleteTypes(blockTypes);

// Write files
fs.writeFileSync("types/strapi-mock-blocks.ts", blockTypesCode, "utf-8");
console.log("✓ Generated: types/strapi-mock-blocks.ts");

fs.writeFileSync("types/strapi-mock-complete.ts", completeTypesCode, "utf-8");
console.log("✓ Generated: types/strapi-mock-complete.ts");

// Generate index export
const indexCode = `/**
 * Strapi Mock Types - Main Entry Point
 * Exports all type definitions in one place
 */

export * from './strapi-mock-blocks';
export * from './strapi-mock-complete';

// Re-export commonly used types for convenience
export type { ContentDocument, DocumentMeta, DocumentSEO } from './strapi-mock-complete';
export type { Block } from './strapi-mock-blocks';
`;

fs.writeFileSync("types/strapi-mock.ts", indexCode, "utf-8");
console.log("✓ Updated: types/strapi-mock.ts (index)");

console.log("");
console.log("✓ Type generation complete!");
console.log("");
console.log("Next steps:");
console.log("  1. Review types/strapi-mock-blocks.ts for block definitions");
console.log("  2. Verify discriminated union coverage");
console.log("  3. Run: pnpm run build");
console.log("  4. If types look good, commit and move to Phase 8B");
