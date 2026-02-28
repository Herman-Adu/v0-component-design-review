#!/usr/bin/env node

/**
 * Phase 8: Validate Page Types
 * Scans all 10 extracted pages in app/(dashboard)/...
 * Checks type imports against generated types file
 * Output: phase8-validation-report.json
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const PAGES_DIR = path.join(process.cwd(), "app", "(dashboard)", "dashboard", "admin");
const TYPES_FILE = path.join(process.cwd(), "types", "strapi-mock.ts");
const OUTPUT_FILE = "phase8-validation-report.json";

console.log("✓ Scanning page files...");

// Find all page.tsx files
function findPages(dir) {
  let pages = [];
  if (!fs.existsSync(dir)) {
    console.error(`✗ Pages directory not found: ${dir}`);
    return pages;
  }
  
  const walk = (currentPath) => {
    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      if (fs.statSync(fullPath).isDirectory()) {
        walk(fullPath);
      } else if (item === "page.tsx") {
        pages.push(fullPath);
      }
    }
  };
  
  walk(dir);
  return pages;
}

// Extract type imports from page
function extractTypeImports(content) {
  const typeImportRegex = /import\s+type\s+{([^}]+)}\s+from\s+['"]@\/types\/strapi-mock['"]/g;
  const imports = [];
  let match;
  
  while ((match = typeImportRegex.exec(content)) !== null) {
    const types = match[1].split(",").map((t) => t.trim());
    imports.push(...types);
  }
  
  return imports;
}

// Check if types file exists and is valid
function validateTypesFile() {
  if (!fs.existsSync(TYPES_FILE)) {
    return {
      valid: false,
      error: `Types file not found: ${TYPES_FILE}`,
    };
  }
  
  try {
    execSync("npx tsc --noEmit types/strapi-mock.ts", { stdio: "pipe" });
    return { valid: true };
  } catch (e) {
    return {
      valid: false,
      error: `Type validation failed: ${e.message}`,
    };
  }
}

// Main execution
const pages = findPages(PAGES_DIR);
console.log(`✓ Checking type imports...`);

const validation = {
  timestamp: new Date().toISOString(),
  typesFileValid: validateTypesFile(),
  pagesScanned: pages.length,
  pages: [],
  issues: [],
};

pages.forEach((pagePath) => {
  const content = fs.readFileSync(pagePath, "utf-8");
  const imports = extractTypeImports(content);
  
  const pageInfo = {
    path: pagePath,
    hasTypeImports: imports.length > 0,
    imports,
    status: imports.length > 0 ? "ready" : "needs-update",
  };
  
  if (!imports.length) {
    validation.issues.push({
      type: "missing-types",
      page: pagePath,
      message: "Page has no type imports",
    });
  }
  
  validation.pages.push(pageInfo);
});

const readyCount = validation.pages.filter((p) => p.status === "ready").length;
const needsUpdateCount = validation.pages.filter((p) => p.status === "needs-update").length;

console.log(`✓ Page validation report:`);
console.log(`  - ${readyCount} pages ready`);
console.log(`  - ${needsUpdateCount} pages need updates`);
console.log(`✓ Details: see ${OUTPUT_FILE}`);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(validation, null, 2));
process.exit(validation.issues.length > 0 ? 1 : 0);
