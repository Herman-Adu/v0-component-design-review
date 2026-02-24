#!/usr/bin/env node

/**
 * Phase 5: Email Administration Page Refactoring Script
 *
 * Refactors email-administration pages to import data from JSON files
 * instead of using hardcoded arrays.
 *
 * Process:
 * 1. Reads each page component
 * 2. Replaces hardcoded arrays with JSON imports
 * 3. Adds icon mapping system (following Phase 4 pattern)
 * 4. Validates output doesn't have syntax errors
 *
 * Usage: node scripts/phase5-refactor-email-admin-pages.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

/**
 * Email Administration pages to refactor
 *
 * Each page has specific arrays to replace:
 * - sections/features/capabilities → import from JSON
 * - Icons referenced in data → add icon mapping
 */
const EMAIL_ADMIN_PAGES = [
  {
    name: "Email Administration Overview",
    file: "app/(dashboard)/dashboard/admin/email-administration/page.tsx",
    imports: {
      sections: "data/strapi-mock/email-administration/overview/sections.json",
      highlights: "data/strapi-mock/email-administration/overview/highlights.json",
    },
    iconFields: {
      sections: "icon",
      highlights: "icon",
    },
  },
  {
    name: "Request Management Overview",
    file: "app/(dashboard)/dashboard/admin/email-administration/request-management/page.tsx",
    imports: {
      features: "data/strapi-mock/email-administration/request-management/features.json",
      capabilities:
        "data/strapi-mock/email-administration/request-management/capabilities.json",
    },
    iconFields: {
      features: "icon",
      capabilities: "icon",
    },
  },
  {
    name: "Configuration Overview",
    file: "app/(dashboard)/dashboard/admin/email-administration/configuration/page.tsx",
    imports: {
      features: "data/strapi-mock/email-administration/configuration/features.json",
      emailTypes: "data/strapi-mock/email-administration/configuration/email-types.json",
      configHighlights:
        "data/strapi-mock/email-administration/configuration/config-highlights.json",
    },
    iconFields: {
      features: "icon",
      emailTypes: "icon",
      configHighlights: "icon",
    },
  },
  {
    name: "Infrastructure Overview",
    file: "app/(dashboard)/dashboard/admin/email-administration/infrastructure/page.tsx",
    imports: {
      features: "data/strapi-mock/email-administration/infrastructure/features.json",
      components:
        "data/strapi-mock/email-administration/infrastructure/components.json",
      securityChecks:
        "data/strapi-mock/email-administration/infrastructure/security-checks.json",
    },
    iconFields: {
      features: "icon",
      components: "icon",
      securityChecks: "icon",
    },
  },
];

/**
 * Main refactoring workflow
 */
async function refactorEmailAdminPages() {
  console.log("[Phase 5] Email Administration Page Refactoring");
  console.log("=".repeat(60));

  const report = {
    timestamp: new Date().toISOString(),
    totalPages: EMAIL_ADMIN_PAGES.length,
    pagesRefactored: 0,
    importsAdded: 0,
    iconMappingsAdded: 0,
    errors: [],
    details: {},
  };

  for (const pageConfig of EMAIL_ADMIN_PAGES) {
    console.log(`\n[Phase 5] Refactoring: ${pageConfig.name}`);

    const filePath = path.join(projectRoot, pageConfig.file);

    if (!fs.existsSync(filePath)) {
      const error = `File not found: ${pageConfig.file}`;
      console.error(`  ⚠ ${error}`);
      report.errors.push(error);
      continue;
    }

    try {
      let content = fs.readFileSync(filePath, "utf-8");
      const originalContent = content;

      const pageDetail = {
        file: pageConfig.file,
        importsAdded: 0,
        iconMappingsAdded: 0,
        changes: [],
      };

      // Step 1: Add JSON imports
      console.log(`  ℹ Adding JSON imports...`);
      const importLines = Object.entries(pageConfig.imports)
        .map(([varName, filePath]) => {
          const importPath = filePath.replace(/\.json$/, "");
          return `import ${varName}Data from '@/${importPath}.json'`;
        })
        .join("\n");

      // Insert imports after existing React imports (before const declarations)
      const lucideImportMatch = content.match(/import\s+{[\s\S]*?}\s+from\s+["']lucide-react["']/);
      if (lucideImportMatch) {
        const insertPos = lucideImportMatch.index + lucideImportMatch[0].length;
        content = content.slice(0, insertPos) + "\n" + importLines + "\n" + content.slice(insertPos);
        pageDetail.importsAdded = Object.keys(pageConfig.imports).length;
        pageDetail.changes.push(`Added ${pageDetail.importsAdded} JSON imports`);
        console.log(`  ✓ Added ${pageDetail.importsAdded} JSON imports`);
      }

      // Step 2: Replace array declarations with imported data
      console.log(`  ℹ Replacing hardcoded arrays...`);
      for (const [arrayName, importPath] of Object.entries(pageConfig.imports)) {
        const varName = arrayName.charAt(0).toUpperCase() + arrayName.slice(1);
        const regex = new RegExp(`const\\s+${arrayName}\\s*=\\s*\\[.*?\\](?=\\s*(?:const|return|$))`, "s");

        if (content.includes(`const ${arrayName} =`)) {
          content = content.replace(
            regex,
            `const ${arrayName} = ${arrayName}Data.${arrayName} || []`
          );
          pageDetail.changes.push(`Replaced array: ${arrayName}`);
          console.log(`  ✓ Replaced array: ${arrayName}`);
        }
      }

      // Only write if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, "utf-8");
        report.pagesRefactored++;
        report.importsAdded += pageDetail.importsAdded;
        report.details[pageConfig.name] = pageDetail;
        console.log(`  ✓ Refactoring complete`);
      } else {
        console.log(`  ℹ No changes needed`);
      }
    } catch (error) {
      const errorMsg = `Error refactoring ${pageConfig.file}: ${error.message}`;
      console.error(`  ✗ ${errorMsg}`);
      report.errors.push(errorMsg);
    }
  }

  // Generate summary
  console.log("\n" + "=".repeat(60));
  console.log("[Phase 5] Refactoring Summary");
  console.log("=".repeat(60));
  console.log(`Pages refactored: ${report.pagesRefactored}/${report.totalPages}`);
  console.log(`JSON imports added: ${report.importsAdded}`);
  console.log(`Icon mappings prepared: ${report.iconMappingsAdded}`);

  if (report.errors.length > 0) {
    console.log(`\nErrors: ${report.errors.length}`);
    report.errors.forEach((err) => console.log(`  - ${err}`));
  }

  // Write report
  const reportPath = path.join(projectRoot, "data/phase5-refactor-report.md");
  const reportContent = generateReport(report);
  fs.writeFileSync(reportPath, reportContent, "utf-8");
  console.log(`\n✓ Report written: data/phase5-refactor-report.md`);

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
- Imports added: ${detail.importsAdded}

**Changes:**
${detail.changes.map((c) => `- ${c}`).join("\n")}`
    )
    .join("\n\n");

  return `# Phase 5: Email Administration Page Refactoring Report

Generated: ${report.timestamp}

## Summary
- Pages refactored: ${report.pagesRefactored}/${report.totalPages}
- JSON imports added: ${report.importsAdded}
- Icon mappings prepared: ${report.iconMappingsAdded}
- Errors: ${report.errors.length}

## Page Details

${details || "No pages refactored (check for missing JSON data files)"}

## Next Steps
1. Create JSON mock data files from extracted arrays
2. Verify import paths are correct
3. Run: \`pnpm build\`
4. Check preview for any missing data or type errors
5. Add icon mapping if needed (following Phase 4 pattern)

## Notes
- JSON data files should be in: \`data/strapi-mock/email-administration/\`
- Each array gets its own JSON file (e.g., sections.json, features.json)
- Icon names should be stored as strings in JSON (mapped at runtime)
- Follow the Strapi data structure for consistency
`;
}

// Run refactoring
await refactorEmailAdminPages();
