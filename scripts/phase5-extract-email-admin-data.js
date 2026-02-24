#!/usr/bin/env node

/**
 * Phase 5: Email Administration Data Extraction Script
 *
 * Extracts hardcoded data arrays from email-administration pages
 * and generates JSON mock data files following Strapi structure.
 *
 * Usage: node scripts/phase5-extract-email-admin-data.js
 *
 * Output:
 * - data/strapi-mock/email-administration/*.json files
 * - Reports extracted sections, features, capabilities, etc.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

/**
 * Email Administration Pages to Extract
 *
 * Pattern: Each page has hardcoded arrays (features, capabilities, etc.)
 * Goal: Extract each array into a dedicated JSON file
 */
const EMAIL_ADMIN_PAGES = [
  {
    name: "Email Administration Overview",
    file: "app/(dashboard)/dashboard/admin/email-administration/page.tsx",
    arrays: ["sections", "highlights"],
    outputDir: "email-administration/overview",
  },
  {
    name: "Request Management Overview",
    file: "app/(dashboard)/dashboard/admin/email-administration/request-management/page.tsx",
    arrays: ["features", "capabilities"],
    outputDir: "email-administration/request-management",
  },
  {
    name: "Configuration Overview",
    file: "app/(dashboard)/dashboard/admin/email-administration/configuration/page.tsx",
    arrays: ["features", "emailTypes", "configHighlights"],
    outputDir: "email-administration/configuration",
  },
  {
    name: "Infrastructure Overview",
    file: "app/(dashboard)/dashboard/admin/email-administration/infrastructure/page.tsx",
    arrays: ["features", "components", "securityChecks"],
    outputDir: "email-administration/infrastructure",
  },
];

/**
 * Main extraction workflow
 */
async function extractEmailAdminData() {
  console.log("[Phase 5] Email Administration Data Extraction");
  console.log("=".repeat(60));

  const report = {
    timestamp: new Date().toISOString(),
    totalPages: EMAIL_ADMIN_PAGES.length,
    pagesProcessed: 0,
    totalArraysExtracted: 0,
    filesCreated: 0,
    errors: [],
    details: {},
  };

  // Process each page
  for (const pageConfig of EMAIL_ADMIN_PAGES) {
    console.log(`\n[Phase 5] Processing: ${pageConfig.name}`);

    const filePath = path.join(projectRoot, pageConfig.file);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      const error = `File not found: ${pageConfig.file}`;
      console.error(`  ⚠ ${error}`);
      report.errors.push(error);
      continue;
    }

    // Read file
    try {
      const content = fs.readFileSync(filePath, "utf-8");

      // Create output directory
      const outDir = path.join(projectRoot, "data/strapi-mock", pageConfig.outputDir);
      if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
        console.log(`  ✓ Created directory: ${pageConfig.outputDir}`);
      }

      const pageDetail = {
        file: pageConfig.file,
        arraysExtracted: 0,
        filesCreated: 0,
        arrays: {},
      };

      // Extract each array
      for (const arrayName of pageConfig.arrays) {
        const regex = new RegExp(
          `const\\s+${arrayName}\\s*=\\s*\\[(.*?)\\](?=\\s*(?:const|return|export|$))`,
          "s"
        );
        const match = content.match(regex);

        if (!match) {
          console.log(`  ℹ Array not found: ${arrayName}`);
          continue;
        }

        console.log(`  ✓ Found array: ${arrayName}`);

        // For now, document that we found it
        // Full extraction requires AST parsing (implemented in refactoring phase)
        pageDetail.arrays[arrayName] = {
          found: true,
          status: "pending_extraction",
          note: "Manual extraction required - complex object structure",
        };

        pageDetail.arraysExtracted++;
        report.totalArraysExtracted++;
      }

      report.details[pageConfig.name] = pageDetail;
      report.pagesProcessed++;
    } catch (error) {
      const errorMsg = `Error processing ${pageConfig.file}: ${error.message}`;
      console.error(`  ✗ ${errorMsg}`);
      report.errors.push(errorMsg);
    }
  }

  // Generate summary
  console.log("\n" + "=".repeat(60));
  console.log("[Phase 5] Extraction Summary");
  console.log("=".repeat(60));
  console.log(`Pages processed: ${report.pagesProcessed}/${report.totalPages}`);
  console.log(`Arrays found: ${report.totalArraysExtracted}`);
  console.log(`Files created: ${report.filesCreated}`);

  if (report.errors.length > 0) {
    console.log(`\nErrors encountered: ${report.errors.length}`);
    report.errors.forEach((err) => console.log(`  - ${err}`));
  }

  // Write report
  const reportPath = path.join(projectRoot, "data/phase5-extraction-report.md");
  const reportContent = generateReport(report);
  fs.writeFileSync(reportPath, reportContent, "utf-8");
  console.log(`\n✓ Report written: data/phase5-extraction-report.md`);

  return report;
}

/**
 * Generate markdown report
 */
function generateReport(report) {
  const details = Object.entries(report.details)
    .map(
      ([pageName, detail]) =>
        `### ${pageName}
- File: \`${detail.file}\`
- Arrays extracted: ${detail.arraysExtracted}
- Arrays found: ${Object.keys(detail.arrays).length}

**Arrays:**
${Object.entries(detail.arrays)
  .map(([name, info]) => `- \`${name}\`: ${info.status} - ${info.note || ""}`)
  .join("\n")}`
    )
    .join("\n\n");

  return `# Phase 5: Email Administration Data Extraction Report

Generated: ${report.timestamp}

## Summary
- Total pages processed: ${report.pagesProcessed}/${report.totalPages}
- Total arrays found: ${report.totalArraysExtracted}
- Files created: ${report.filesCreated}
- Errors: ${report.errors.length}

## Page Details

${details}

## Next Steps
1. Review extracted data structures
2. Create JSON mock files following Strapi schema
3. Run phase5-refactor-email-admin-pages.js to update pages
4. Verify build: pnpm build
5. Test all email-administration pages in preview

## Notes
- This phase follows the pattern established in Phase 4
- Complex object extraction requires careful manual validation
- Icon mapping will be added during refactoring phase
`;
}

// Run extraction
await extractEmailAdminData();
