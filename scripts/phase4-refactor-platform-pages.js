#!/usr/bin/env node

/**
 * Phase 4: Refactor Platform Pages
 *
 * Purpose: Update LinkedIn, Facebook, Twitter pages to use extracted mock data
 * Replaces: Hardcoded arrays with dynamic imports from data/strapi-mock/platforms/
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

const platforms = ["linkedin", "facebook", "twitter"];

console.log("[Phase 4] Starting platform page refactoring...\n");

async function refactorPlatformPages() {
  const results = {
    refactored: [],
    skipped: [],
    errors: [],
  };

  for (const platform of platforms) {
    const pagePath = path.join(
      projectRoot,
      "app",
      "(dashboard)",
      "dashboard",
      "admin",
      "digital-marketing",
      platform,
      "page.tsx",
    );

    if (!fs.existsSync(pagePath)) {
      console.warn(`[Phase 4] Skipping: ${platform} page not found`);
      results.skipped.push(platform);
      continue;
    }

    try {
      console.log(`[Phase 4] Refactoring ${platform.toUpperCase()} page...`);

      let content = fs.readFileSync(pagePath, "utf-8");
      let modified = false;

      // Replace tools array with static import from JSON file
      if (content.includes("const tools = [")) {
        // Match the complete tools array from "const tools = [" to the closing "]"
        // Handle both \n and \r\n line endings
        const toolsRegex =
          /const\s+tools\s*=\s*\[([\s\S]*?)\]\s*\r?\n\r?\nconst strategy/;
        if (toolsRegex.test(content)) {
          content = content.replace(
            toolsRegex,
            `import toolsData from '@/data/strapi-mock/platforms/${platform}-tools.json'\nconst tools = toolsData.tools || []\n\nconst strategy`,
          );
          modified = true;
          console.log(`  ✓ Refactored tools array`);
        } else {
          console.log(`  ⚠ Tools regex did not match`);
        }
      }

      // Replace strategy array with static import from JSON file
      if (content.includes("const strategy = [")) {
        // Match the complete strategy array from "const strategy = [" to the closing "]"
        const strategyRegex =
          /const\s+strategy\s*=\s*\[([\s\S]*?)\]\s*\r?\n\r?\nexport/;
        if (strategyRegex.test(content)) {
          content = content.replace(
            strategyRegex,
            `import strategyData from '@/data/strapi-mock/platforms/${platform}-strategy.json'\nconst strategy = strategyData.strategy || []\n\nexport`,
          );
          modified = true;
          console.log(`  ✓ Refactored strategy array`);
        } else {
          console.log(`  ⚠ Strategy regex did not match`);
        }
      }

      if (modified) {
        fs.writeFileSync(pagePath, content);
        results.refactored.push(platform);
      } else {
        console.log(`  ℹ No hardcoded arrays found to refactor`);
        results.skipped.push(platform);
      }
    } catch (error) {
      console.error(`  ✗ Error refactoring ${platform}: ${error.message}`);
      results.errors.push({ platform, error: error.message });
    }
  }

  return results;
}

// Main execution
async function main() {
  try {
    const results = await refactorPlatformPages();

    console.log(`\n[Phase 4] Refactoring complete!\n`);
    console.log(`Refactored: ${results.refactored.length} pages`);
    console.log(`Skipped: ${results.skipped.length} pages`);
    console.log(`Errors: ${results.errors.length}\n`);

    if (results.refactored.length > 0) {
      console.log("Refactored pages:");
      results.refactored.forEach((p) => console.log(`  ✓ ${p}`));
    }

    if (results.errors.length > 0) {
      console.log("\nErrors:");
      results.errors.forEach((e) =>
        console.log(`  ✗ ${e.platform}: ${e.error}`),
      );
    }

    // Create summary report
    const reportPath = path.join(
      projectRoot,
      "data",
      "phase4-refactor-report.md",
    );
    const report = `# Phase 4: Platform Page Refactoring Report

Generated: ${new Date().toISOString()}

## Summary
- Pages refactored: ${results.refactored.length}
- Pages skipped: ${results.skipped.length}
- Errors encountered: ${results.errors.length}

## Refactored Pages
${
  results.refactored.length > 0
    ? results.refactored.map((p) => `- ${p}`).join("\n")
    : "None"
}

## Skipped Pages
${
  results.skipped.length > 0
    ? results.skipped.map((p) => `- ${p}`).join("\n")
    : "None"
}

## Changes Made
- Replaced hardcoded \`const tools = [...]\` with dynamic import from strapi-mock
- Replaced hardcoded \`const strategy = [...]\` with dynamic import from strapi-mock
- Pages now load data from JSON files instead of embedded arrays
- Component rendering logic remains unchanged

## Next Steps
1. Test build: pnpm build
2. Verify pages render correctly with imported mock data
3. Check that all page functionality works as expected
4. Commit changes to v0/herman-adu-799e4ffb branch
`;

    fs.writeFileSync(reportPath, report);
    console.log(`Report saved to data/phase4-refactor-report.md\n`);

    process.exit(results.errors.length > 0 ? 1 : 0);
  } catch (error) {
    console.error("[Phase 4] Fatal error:", error.message);
    process.exit(1);
  }
}

main();
