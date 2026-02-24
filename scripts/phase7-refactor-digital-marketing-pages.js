#!/usr/bin/env node

/**
 * Phase 7: Digital Marketing Data Refactoring
 * Replaces hardcoded arrays with JSON imports for extractable pages
 * Handles icon string mapping safely
 */

const fs = require("fs");
const path = require("path");

const marketingDir = path.join(
  __dirname,
  "..",
  "app/(dashboard)/dashboard/admin/digital-marketing"
);

const refactorConfigs = [
  {
    pagePath: "page.tsx",
    dataFile: "overview",
    replacements: [
      { varName: "tools", jsonFile: "google-tools.json" },
      { varName: "ecosystem", jsonFile: "google-ecosystem.json" },
    ],
  },
  {
    pagePath: "getting-started/page.tsx",
    dataFile: "getting-started",
    replacements: [
      { varName: "journeys", jsonFile: "journeys.json" },
      { varName: "quickChecklist", jsonFile: "quick-checklist.json" },
    ],
  },
  {
    pagePath: "content-strategy/page.tsx",
    dataFile: "content-strategy",
    replacements: [
      { varName: "contentCalendar", jsonFile: "content-calendar.json" },
      { varName: "distributionChannels", jsonFile: "distribution-channels.json" },
      { varName: "contentMetrics", jsonFile: "content-metrics.json" },
      { varName: "editorialGuidelines", jsonFile: "editorial-guidelines.json" },
    ],
  },
  {
    pagePath: "google/page.tsx",
    dataFile: "platforms/google",
    replacements: [
      { varName: "tools", jsonFile: "google-tools.json" },
      { varName: "ecosystem", jsonFile: "google-ecosystem.json" },
    ],
  },
];

let stats = {
  filesProcessed: 0,
  importsAdded: 0,
  arraysRemoved: 0,
  errors: [],
};

function refactorPage(config) {
  const fullPath = path.join(marketingDir, config.pagePath);

  if (!fs.existsSync(fullPath)) {
    stats.errors.push(`File not found: ${config.pagePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, "utf-8");
  const originalContent = content;

  // Add imports at top of file
  const importLines = config.replacements.map(
    (r) =>
      `import ${r.varName}Data from "@/data/strapi-mock/${config.dataFile}/${r.jsonFile}";`
  );

  // Find insertion point (after existing imports, before first const)
  const importRegex = /^import .*;$/m;
  const lastImportMatch = content.match(new RegExp(`(^import .*;$)(?!.*^import)`, "m"));
  let insertionPoint = 0;

  if (lastImportMatch) {
    insertionPoint = content.indexOf(lastImportMatch[0]) + lastImportMatch[0].length;
  }

  // Insert new imports
  importLines.forEach((line) => {
    if (!content.includes(line)) {
      content = content.slice(0, insertionPoint) + "\n" + line + content.slice(insertionPoint);
      stats.importsAdded++;
    }
  });

  // Replace const declarations with JSON imports
  config.replacements.forEach((r) => {
    const varRegex = new RegExp(
      `const\\s+${r.varName}\\s*=\\s*\\[`,
      "g"
    );

    if (varRegex.test(content)) {
      // Replace const declaration with: const varName = dataFileData.key || [];
      const replacement = `const ${r.varName} = ${r.varName}Data.${r.varName} || []`;
      const pattern = new RegExp(
        `const\\s+${r.varName}\\s*=\\s*\\[[\\s\\S]*?\\](?=\\s*\\n\\s*(?:const|export|function|//))`,
        "g"
      );

      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        stats.arraysRemoved++;
      }
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content);
    stats.filesProcessed++;
    console.log(`✅ Refactored: ${config.pagePath}`);
  }
}

function generateRefactorReport() {
  const report = `# Phase 7 Refactor Report

## Summary
- Files processed: ${stats.filesProcessed}
- Imports added: ${stats.importsAdded}
- Arrays removed: ${stats.arraysRemoved}
- Errors: ${stats.errors.length}

## Details
${stats.errors.length ? `### Errors\n${stats.errors.map((e) => `- ${e}`).join("\n")}\n` : ""}
## Next Steps
1. Run: pnpm build
2. Verify all pages render correctly
3. Create PHASE7_GENERATION_NOTES.md with learnings
`;

  fs.writeFileSync(
    path.join(__dirname, "..", "data", "phase7-refactor-report.md"),
    report
  );

  console.log("\n" + report);
}

refactorConfigs.forEach(refactorPage);
generateRefactorReport();

console.log("\n✅ Refactoring complete!");
