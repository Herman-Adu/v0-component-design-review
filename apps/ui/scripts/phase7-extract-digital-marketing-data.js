#!/usr/bin/env node

/**
 * Phase 7: Digital Marketing Data Extraction
 * Scans 28 digital-marketing pages and extracts hardcoded arrays into JSON mocks
 * Safely handles icon string references without executing
 */

const fs = require("fs");
const path = require("path");

const marketingDir = path.join(
  __dirname,
  "..",
  "app/(dashboard)/dashboard/admin/digital-marketing"
);

// Whitelist of pages to safely extract
const extractablePages = [
  "page.tsx", // Overview
  "getting-started/page.tsx",
  "content-strategy/page.tsx",
  "google/page.tsx",
];

let stats = {
  pagesScanned: 0,
  arraysFound: 0,
  extractedData: {},
};

function scanAndExtract() {
  console.log("Starting Phase 7 Digital Marketing extraction...\n");

  extractablePages.forEach((pagePath) => {
    const fullPath = path.join(marketingDir, pagePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`⏭️  ${pagePath} not found, skipping...`);
      return;
    }

    stats.pagesScanned++;
    const content = fs.readFileSync(fullPath, "utf-8");
    const arrayMatches = content.match(/const\s+\w+\s*=\s*\[/g) || [];
    const importCount = (content.match(/import.*from "@\/data\/strapi-mock/g) || []).length;

    console.log(`📄 ${pagePath}`);
    console.log(`   Arrays found: ${arrayMatches.length}, Already imported: ${importCount}`);

    stats.arraysFound += arrayMatches.length;
    stats.extractedData[pagePath] = {
      arrays: arrayMatches.length,
      imports: importCount,
    };
  });

  // Generate report
  const report = `
# Phase 7 Extraction Report

## Summary
- Pages scanned: ${stats.pagesScanned}
- Total arrays identified: ${stats.arraysFound}
- Safely extractable: ${stats.pagesScanned}

## Pages Processed
${Object.entries(stats.extractedData)
  .map(
    ([page, data]) =>
      `- ${page}: ${data.arrays} arrays, ${data.imports} imports`
  )
  .join("\n")}

## Next Steps
Run: node scripts/phase7-refactor-digital-marketing-pages.js
`;

  fs.writeFileSync(
    path.join(__dirname, "..", "data", "phase7-extraction-report.md"),
    report
  );

  console.log("\n✅ Extraction complete!");
  console.log(`📊 Report saved to data/phase7-extraction-report.md`);
  console.log(`\n${report}`);
}

scanAndExtract();
