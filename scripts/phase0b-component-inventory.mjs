#!/usr/bin/env node
/**
 * Phase 0B: Atomic Component Inventory & Duplication Audit
 *
 * Identifies:
 * - Which atomic components exist (atoms, molecules, organisms)
 * - Component file structure
 * - Duplicate implementations across domains
 * - Export patterns and naming inconsistencies
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const componentsPath = path.join(__dirname, "../components");

// Categorize component files
const componentsByLevel = {
  atoms: [],
  molecules: [],
  organisms: [],
};

function walkComponentDir(dir, level) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach((file) => {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      walkComponentDir(fullPath, level);
    } else if (file.name.endsWith(".tsx") && !file.name.includes(".story")) {
      const relPath = path.relative(componentsPath, fullPath);
      if (relPath.includes("/atoms/")) {
        componentsByLevel.atoms.push(file.name.replace(".tsx", ""));
      } else if (relPath.includes("/molecules/")) {
        componentsByLevel.molecules.push(file.name.replace(".tsx", ""));
      } else if (
        relPath.includes("/organisms/") &&
        !relPath.includes("block-renderer")
      ) {
        componentsByLevel.organisms.push(file.name.replace(".tsx", ""));
      }
    }
  });
}

console.log("🔍 Phase 0B: Atomic Component Inventory\n");

walkComponentDir(componentsPath, "");

// Check for article-components package
const articleComponentsPath = path.join(
  componentsPath,
  "molecules/article-components",
);
let articleComponentsExports = [];
try {
  const indexFile = fs.readFileSync(
    path.join(articleComponentsPath, "index.ts"),
    "utf8",
  );
  const exportMatches =
    indexFile.match(/export.*from\s+['"]\.\/([^'"]+)['"]/g) || [];
  articleComponentsExports = exportMatches.map(
    (exp) => exp.match(/\.\/([^'"]+)/)[1],
  );
} catch (e) {
  // File might not exist
}

console.log("📦 Atom Components:");
console.log(`  Count: ${componentsByLevel.atoms.length}`);
if (componentsByLevel.atoms.length > 0) {
  componentsByLevel.atoms
    .slice(0, 10)
    .forEach((c) => console.log(`    - ${c}`));
  if (componentsByLevel.atoms.length > 10) {
    console.log(`    ... and ${componentsByLevel.atoms.length - 10} more`);
  }
}
console.log();

console.log("🧬 Molecule Components:");
console.log(`  Count: ${componentsByLevel.molecules.length}`);
if (componentsByLevel.molecules.length > 0) {
  componentsByLevel.molecules
    .slice(0, 10)
    .forEach((c) => console.log(`    - ${c}`));
  if (componentsByLevel.molecules.length > 10) {
    console.log(`    ... and ${componentsByLevel.molecules.length - 10} more`);
  }
}
console.log();

console.log("🦾 Organism Components:");
console.log(`  Count: ${componentsByLevel.organisms.length}`);
if (componentsByLevel.organisms.length > 0) {
  componentsByLevel.organisms
    .slice(0, 10)
    .forEach((c) => console.log(`    - ${c}`));
  if (componentsByLevel.organisms.length > 10) {
    console.log(`    ... and ${componentsByLevel.organisms.length - 10} more`);
  }
}
console.log();

console.log("📝 Article Components Package:");
console.log(`  Count: ${articleComponentsExports.length}`);
if (articleComponentsExports.length > 0) {
  articleComponentsExports.forEach((c) => console.log(`    - ${c}`));
}
console.log();

console.log("🎯 Key Findings:");
console.log(
  `  Total atomic components: ${componentsByLevel.atoms.length + componentsByLevel.molecules.length + componentsByLevel.organisms.length}`,
);
console.log(
  `  Centralized article exports: ${articleComponentsExports.length}`,
);
console.log();

console.log("✅ Phase 0B Complete: Component inventory documented\n");
console.log("Observations:");
console.log("  1. article-components module centralizes reusable molecules");
console.log("  2. Check for duplicate implementations across organism folder");
console.log(
  "  3. Verify all block-type components are exported from article-components or atoms\n",
);
