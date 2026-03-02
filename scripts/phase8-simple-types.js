#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const TYPE_MAPPING = {
  "admin-overview.json": "AdminOverview",
  "app-reference-overview.json": "AppReferenceOverview",
  "app-reference-pages.json": "AppReferencePages",
  "cms-reference-overview.json": "AppReferenceOverview",
  "cms-reference-pages.json": "AppReferencePages",
  "infrastructure-ops-pages.json": "AppReferencePages",
  "strategic-overview-pages.json": "AppReferencePages",
  "articles-list.json": "ArticlesList",
  "case-studies-list.json": "ArticlesList",
  "guides-list.json": "ArticlesList",
  "tutorials-list.json": "ArticlesList",
  "content-library-overview.json": "ContentLibraryOverview",
  "dashboard-getting-started.json": "DashboardGettingStarted",
  "digital-marketing-overview.json": "DigitalMarketingOverview",
  "document-administration-overview.json": "DocumentAdministrationOverview",
  "email-administration-overview.json": "DocumentAdministrationOverview",
  "infrastructure-ops-overview.json": "InfrastructureOpsOverview",
  "strategic-overview.json": "StrategicOverview",
  "content-strategy-overview.json": "ContentStrategyOverview",
  "content-calendar.json": "ContentCalendar",
  "content-metrics.json": "ContentMetrics",
  "distribution-channels.json": "DistributionChannels",
  "editorial-guidelines.json": "EditorialGuidelines",
  "dm-getting-started.json": "DmGettingStarted",
  "journeys.json": "Journeys",
  "quick-checklist.json": "QuickChecklist",
  "documentation-health-overview.json": "DocumentationHealthOverview",
  "quality-engineering-overview.json": "QualityEngineeringOverview",
  "config-highlights.json": "ConfigHighlights",
  "email-types.json": "EmailTypes",
  "email-configuration-overview.json": "EmailConfigurationOverview",
  "email-infrastructure-overview.json": "EmailInfrastructureOverview",
  "features.json": "Features",
  "system-checks.json": "SystemChecks",
  "qa-tools.json": "QaTools",
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

function getPageFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (file !== "node_modules" && !file.startsWith(".")) {
        results = results.concat(getPageFiles(fullPath));
      }
    } else if (file === "page.tsx" && fullPath.includes("admin")) {
      results.push(fullPath);
    }
  }

  return results;
}

console.log("Phase 8: Add Type Imports to Pages");
console.log("=".repeat(50));

const appDir = path.resolve("app");
const files = getPageFiles(appDir).filter((f) => f.includes("admin"));

console.log(`Found ${files.length} admin pages\n`);

let updated = 0;
let skipped = 0;

for (const filePath of files) {
  const content = fs.readFileSync(filePath, "utf-8");

  // Skip if already has types
  if (content.includes("@/types/strapi-mock")) {
    skipped++;
    continue;
  }

  // Find all JSON imports
  const types = new Set();

  // Match: import name from "@/data/strapi-mock/.../file.json"
  const lines = content.split("\n");
  const foundFiles = [];
  for (const line of lines) {
    if (line.includes("@/data/strapi-mock") && line.includes(".json")) {
      // Extract filename from path - handle hyphenated filenames
      let match = line.match(/\/([a-z0-9-]+\.json)["';]/i);
      if (match) {
        const filename = match[1];
        foundFiles.push(filename);
        const typeName = TYPE_MAPPING[filename];
        if (typeName) {
          types.add(typeName);
        }
      }
    }
  }

  if (foundFiles.length > 0 && types.size === 0) {
    console.log(
      `WARN: ${path.basename(filePath)} found files but no types: ${foundFiles.join(", ")}`,
    );
  }

  if (types.size === 0) {
    skipped++;
    continue;
  }

  // Build type import statement
  const sortedTypes = Array.from(types).sort();
  const typeImport = `import type { ${sortedTypes.join(", ")} } from "@/types/strapi-mock";`;

  // Find insertion point
  const newLines = [];
  let inserted = false;

  for (const line of lines) {
    // After "use client"
    if (!inserted && line.includes('"use client')) {
      newLines.push(line);
      newLines.push(typeImport);
      inserted = true;
      continue;
    }

    // Before first data import
    if (!inserted && line.includes("@/data/strapi-mock")) {
      newLines.push(typeImport);
      newLines.push(line);
      inserted = true;
      continue;
    }

    newLines.push(line);
  }

  // Write back
  fs.writeFileSync(filePath, newLines.join("\n"), "utf-8");

  const relPath = path.relative(process.cwd(), filePath);
  console.log(`UPDT: ${relPath}`);
  updated++;
}

console.log("");
console.log(`Done: ${updated} updated, ${skipped} skipped`);
