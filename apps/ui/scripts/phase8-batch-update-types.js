#!/usr/bin/env node

/**
 * Phase 8: Batch Update Pages with Type Imports
 * Reads validation report and updates pages with proper type imports
 */

const fs = require("fs");
const path = require("path");

const VALIDATION_REPORT = "phase8-validation-report.json";
const TYPE_MAPPING = {
  "content-calendar.json": "ContentCalendar",
  "content-metrics.json": "ContentMetrics",
  "distribution-channels.json": "DistributionChannels",
  "editorial-guidelines.json": "EditorialGuidelines",
  "journeys.json": "Journeys",
  "quick-checklist.json": "QuickChecklist",
  "qa-tools.json": "QaTools",
  "config-highlights.json": "ConfigHighlights",
  "email-types.json": "EmailTypes",
  "features.json": "Features",
  "system-checks.json": "SystemChecks",
  "highlights.json": "Highlights",
  "sections.json": "Sections",
  "capabilities.json": "Capabilities",
  "facebook-strategy.json": "FacebookStrategy",
  "facebook-tools.json": "FacebookTools",
  "google-ecosystem.json": "GoogleEcosystem",
  "google-tools.json": "GoogleTools",
  "linkedin-strategy.json": "LinkedinStrategy",
  "linkedin-tools.json": "LinkedinTools",
  "twitter-strategy.json": "TwitterStrategy",
  "twitter-tools.json": "TwitterTools",
};

console.log("Phase 8: Batch Update Pages with Type Imports");
console.log("=".repeat(50));
console.log("");

let report;
try {
  const reportContent = fs.readFileSync(VALIDATION_REPORT, "utf-8");
  report = JSON.parse(reportContent);
} catch (e) {
  console.error("Error reading validation report:", e.message);
  process.exit(1);
}

const pagesToUpdate = report.pages.filter((p) => p.status === "needs-update");
console.log(`Found ${pagesToUpdate.length} pages to update`);
console.log(`First page: ${pagesToUpdate[0]?.path}`);
console.log("");

let updatedCount = 0;
let skippedCount = 0;

for (const page of pagesToUpdate) {
  const pagePath = page.path;

  // Read page content
  let content;
  try {
    content = fs.readFileSync(pagePath, "utf-8");
  } catch (e) {
    console.log(`SKIP: ${path.basename(pagePath)} - read error`);
    skippedCount++;
    continue;
  }

  // Skip if already has type imports
  if (content.includes("@/types/strapi-mock")) {
    skippedCount++;
    continue;
  }

  // Extract JSON imports - handle both direct imports and pattern matching
  let types = new Set();

  // Pattern 1: import Name from "@/data/strapi-mock/.../file.json"
  const jsonFileRegex =
    /import\s+\w+\s+from\s+['"]@\/data\/strapi-mock\/[^'"]*\/(\w+\.json)['"]/g;
  let match;
  let hasJsonImports = false;
  while ((match = jsonFileRegex.exec(content)) !== null) {
    hasJsonImports = true;
    const jsonFile = match[1];
    if (TYPE_MAPPING[jsonFile]) {
      types.add(TYPE_MAPPING[jsonFile]);
    }
  }

  if (!hasJsonImports) {
    skippedCount++;
    continue;
  }

  // Create type import statement
  const sortedTypes = Array.from(types).sort();
  const typeImportLine = `import type { ${sortedTypes.join(", ")} } from "@/types/strapi-mock";`;

  // Find insertion point after "use client" or before first import
  const lines = content.split("\n");
  const newLines = [];
  let inserted = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Insert after "use client"
    if (!inserted && line.includes('"use client')) {
      newLines.push(line);
      newLines.push(typeImportLine);
      inserted = true;
      continue;
    }

    // Insert before first import if no "use client"
    if (!inserted && line.match(/^import\s+/)) {
      newLines.push(typeImportLine);
      inserted = true;
    }

    newLines.push(line);
  }

  // If not inserted (no imports and no "use client"), add at top
  if (!inserted) {
    newLines.unshift(typeImportLine);
  }

  // Write back
  try {
    fs.writeFileSync(pagePath, newLines.join("\n"), "utf-8");
    console.log(`UPDT: ${path.basename(pagePath)}`);
    updatedCount++;
  } catch (e) {
    console.log(`FAIL: ${path.basename(pagePath)} - ${e.message}`);
  }
}

console.log("");
console.log(`DONE: ${updatedCount} updated, ${skippedCount} skipped`);
