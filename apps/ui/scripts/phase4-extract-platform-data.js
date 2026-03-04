#!/usr/bin/env node

/**
 * Phase 4: Extract Platform Data
 *
 * Purpose: Extract hardcoded arrays (tools, strategy) from LinkedIn, Facebook, Twitter pages
 * Output: JSON files in data/strapi-mock/platforms/
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import vm from "vm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, "..");

// Platform configuration
const platforms = ["linkedin", "facebook", "twitter"];
const outputDir = path.join(projectRoot, "data", "strapi-mock", "platforms");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log("[Phase 4] Starting platform data extraction...\n");

// Extract arrays from page.tsx files using a simplified extraction method
async function extractPlatformData() {
  const results = {
    platforms: {},
    totalArraysExtracted: 0,
    filesCreated: [],
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
      console.warn(`[Phase 4] Warning: Page not found at ${pagePath}`);
      continue;
    }

    console.log(`[Phase 4] Processing ${platform.toUpperCase()} platform...`);
    const content = fs.readFileSync(pagePath, "utf-8");

    // Extract tools array using simpler greedy matching
    let tools = [];
    const toolsStart = content.indexOf("const tools = [");
    if (toolsStart !== -1) {
      const toolsEnd = content.indexOf("]", toolsStart) + 1;
      const toolsStr = content.substring(toolsStart, toolsEnd);
      tools = extractArrayFromCode(toolsStr, "tools", platform);
    }

    // Extract strategy array
    let strategy = [];
    const strategyStart = content.indexOf("const strategy = [");
    if (strategyStart !== -1) {
      const strategyEnd = content.indexOf("]", strategyStart) + 1;
      const strategyStr = content.substring(strategyStart, strategyEnd);
      strategy = extractArrayFromCode(strategyStr, "strategy", platform);
    }

    // Save tools data
    if (tools.length > 0) {
      const toolsFile = path.join(outputDir, `${platform}-tools.json`);
      fs.writeFileSync(toolsFile, JSON.stringify({ tools }, null, 2));
      results.filesCreated.push(toolsFile);
      results.totalArraysExtracted++;
      console.log(`  ✓ Extracted ${tools.length} tools`);
    }

    // Save strategy data
    if (strategy.length > 0) {
      const strategyFile = path.join(outputDir, `${platform}-strategy.json`);
      fs.writeFileSync(strategyFile, JSON.stringify({ strategy }, null, 2));
      results.filesCreated.push(strategyFile);
      results.totalArraysExtracted++;
      console.log(`  ✓ Extracted ${strategy.length} strategy phases`);
    }

    results.platforms[platform] = {
      toolsCount: tools.length,
      strategyCount: strategy.length,
    };
  }

  return results;
}

// Extract array from extracted code string
function extractArrayFromCode(codeStr, varName, platform) {
  try {
    // Convert template literals to regular strings
    let sanitized = codeStr
      .replace(/`\$\{([^}]+)\}`/g, (match, expr) => {
        // For FB/LI/TW variables, just use the path component
        if (expr.includes("/")) {
          const parts = expr.split("/");
          return `"${parts[parts.length - 1]}"`;
        }
        return '"dynamic-value"';
      })
      .replace(/icon:\s*\w+/g, 'icon: "DynamicIcon"'); // Replace icon references with strings

    // Try to extract just the array content
    const arrayMatch = sanitized.match(/const\s+\w+\s*=\s*(\[[\s\S]*\])\s*$/m);
    if (!arrayMatch) {
      console.warn(`  ⚠ Could not extract array for ${varName}`);
      return [];
    }

    const arrayStr = arrayMatch[1];

    // Split by object and reconstruct as JSON
    const objects = [];
    let depth = 0;
    let current = "";
    let inString = false;
    let stringChar = "";

    for (let i = 0; i < arrayStr.length; i++) {
      const char = arrayStr[i];
      const prevChar = i > 0 ? arrayStr[i - 1] : "";

      if ((char === '"' || char === "'") && prevChar !== "\\") {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }

      if (!inString) {
        if (char === "{") {
          if (depth === 0) current = "";
          current += char;
          depth++;
          continue;
        } else if (char === "}") {
          depth--;
          current += char;
          if (depth === 0 && current.trim()) {
            try {
              const obj = parseJSObject(current);
              if (obj) objects.push(obj);
            } catch (e) {
              // Skip malformed
            }
            current = "";
          }
          continue;
        }
      }

      if (depth > 0) {
        current += char;
      }
    }

    return objects;
  } catch (e) {
    console.warn(`  ⚠ Error extracting ${varName}: ${e.message}`);
    return [];
  }
}

// Parse JavaScript object to JSON-compatible object
function parseJSObject(objStr) {
  try {
    // Quote unquoted keys and convert single quotes to double
    let jsonStr = objStr
      .replace(/(\w+)\s*:/g, '"$1":') // Quote property names
      .replace(/'/g, '"') // Single to double quotes
      .replace(/,\s*}/g, "}") // Remove trailing commas
      .replace(/,\s*]/g, "]"); // Remove trailing commas in arrays

    return JSON.parse(jsonStr);
  } catch (e) {
    // Return null for unparseable objects
    return null;
  }
}

// Parse JavaScript object array by converting template literals and property names to JSON
function parseJSObjectArray(arrayContent) {
  try {
    // Convert JavaScript object syntax to JSON
    let jsonStr = arrayContent
      // Remove template string markers (`${...}` becomes literal)
      .replace(/`\$\{([^}]+)\}`/g, (match, p1) => {
        // For string concatenations like `${FB}/page-management`, convert to plain string
        return `"${p1.split("/").pop()}-value"`;
      })
      // Convert property shorthand and unquoted keys to quoted keys
      .replace(/(\w+):/g, '"$1":')
      // Convert unquoted strings with special chars
      .replace(/:\s*"([^"]*(?:\n[^"]*)*?)"/g, ': "$1"')
      // Remove trailing commas before closing braces
      .replace(/,(\s*[}\]])/g, "$1")
      // Handle multi-line content
      .trim();

    // Wrap in brackets if not already
    if (!jsonStr.trim().startsWith("[")) {
      jsonStr = "[" + jsonStr.trim() + "]";
    }

    // Parse and validate
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (e) {
    // Fallback: manually extract objects
    console.warn(`  ⚠ Parser warning: ${e.message}`);
    return extractObjectsManually(arrayContent);
  }
}

// Fallback manual extraction of objects
function extractObjectsManually(content) {
  const objects = [];
  let depth = 0;
  let current = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const prevChar = i > 0 ? content[i - 1] : "";

    // Track string boundaries
    if ((char === '"' || char === "'" || char === "`") && prevChar !== "\\") {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }

    if (!inString) {
      if (char === "{") {
        if (depth === 0) current = "";
        depth++;
      } else if (char === "}") {
        depth--;
        current += char;
        if (depth === 0 && current.trim()) {
          try {
            // Attempt to parse this object
            let objStr = current
              .replace(/(\w+):/g, '"$1":')
              .replace(/'/g, '"')
              .replace(/,\s*}/g, "}");
            const obj = JSON.parse(objStr);
            objects.push(obj);
          } catch {
            // Skip malformed objects
          }
          current = "";
        }
        continue;
      }
    }

    current += char;
  }

  return objects;
}

// Main execution
async function main() {
  try {
    const results = await extractPlatformData();

    console.log(`\n[Phase 4] Extraction complete!\n`);
    console.log(`Platform Summary:`);
    for (const [platform, stats] of Object.entries(results.platforms)) {
      console.log(
        `  ${platform}: ${stats.toolsCount} tools, ${stats.strategyCount} strategy phases`,
      );
    }

    console.log(`\nFiles created: ${results.filesCreated.length}`);
    console.log(`Total arrays extracted: ${results.totalArraysExtracted}\n`);

    // Create summary report
    const reportPath = path.join(
      projectRoot,
      "data",
      "phase4-extraction-report.md",
    );
    const report = `# Phase 4: Platform Data Extraction Report

Generated: ${new Date().toISOString()}

## Summary
- Total platforms processed: ${platforms.length}
- Total arrays extracted: ${results.totalArraysExtracted}
- Files created: ${results.filesCreated.length}

## Platform Details
${Object.entries(results.platforms)
  .map(
    ([platform, stats]) =>
      `- **${platform.toUpperCase()}**: ${stats.toolsCount} tools, ${stats.strategyCount} strategy phases`,
  )
  .join("\n")}

## Output Files
${results.filesCreated.map((f) => `- ${path.relative(projectRoot, f)}`).join("\n")}

## Next Steps
1. Review extracted data in data/strapi-mock/platforms/
2. Run phase4-refactor-platform-pages.js to update pages
3. Test build: pnpm build
4. Verify pages still render correctly with mock data
`;

    fs.writeFileSync(reportPath, report);
    console.log(`Report saved to data/phase4-extraction-report.md\n`);

    process.exit(0);
  } catch (error) {
    console.error("[Phase 4] Error during extraction:", error.message);
    process.exit(1);
  }
}

main();
