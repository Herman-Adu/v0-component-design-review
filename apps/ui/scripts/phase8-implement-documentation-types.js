#!/usr/bin/env node

/**
 * Phase 8B Implementation: Documentation Type Integration
 *
 * Applies type integration ONLY to documentation overview pages:
 * - Adds ContentDocument/Block imports from @/types/strapi-mock
 * - Enhances JSON assertions with ContentDocument + Block compatibility
 * - Validates with tsc --noEmit
 *
 * Scope is intentionally limited to four documentation overview pages only.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const targets = [
  {
    file: "app/(dashboard)/dashboard/documentation/app-reference/overview/page.tsx",
    constName: "appRefContent",
    dataName: "appRefData",
    typeName: "AppReferenceOverviewContent",
  },
  {
    file: "app/(dashboard)/dashboard/documentation/cms-reference/overview/page.tsx",
    constName: "cmsRefContent",
    dataName: "cmsRefData",
    typeName: "CmsReferenceOverviewContent",
  },
  {
    file: "app/(dashboard)/dashboard/documentation/infrastructure-and-ops/overview/page.tsx",
    constName: "infraOpsContent",
    dataName: "infraOpsData",
    typeName: "InfrastructureOpsOverviewContent",
  },
  {
    file: "app/(dashboard)/dashboard/documentation/strategic-overview/overview/page.tsx",
    constName: "stratContent",
    dataName: "stratOverviewData",
    typeName: "StrategicOverviewContent",
  },
];

function addTypeImport(content) {
  if (
    content.includes('from "@/types/strapi-mock"') ||
    content.includes("from '@/types/strapi-mock'")
  ) {
    return { content, changed: false };
  }

  const dashboardImportPattern = /} from "@\/types\/dashboard";\r?\n/;
  if (!dashboardImportPattern.test(content)) {
    return {
      content,
      changed: false,
      reason: "Dashboard type import block not found",
    };
  }

  const updated = content.replace(
    dashboardImportPattern,
    '$&import type { ContentDocument, Block } from "@/types/strapi-mock";\n',
  );

  return { content: updated, changed: updated !== content };
}

function updateAssertion(content, target) {
  const targetLine = `const ${target.constName} = ${target.dataName} as ${target.typeName};`;
  if (!content.includes(targetLine)) {
    if (
      content.includes(
        `const ${target.constName} = ${target.dataName} as ${target.typeName} & Partial<ContentDocument> & { blocks?: Block[] };`,
      )
    ) {
      return { content, changed: false };
    }
    return {
      content,
      changed: false,
      reason: "Expected assertion line not found",
    };
  }

  const replacement = `const ${target.constName} = ${target.dataName} as ${target.typeName} & Partial<ContentDocument> & { blocks?: Block[] };`;
  const updated = content.replace(targetLine, replacement);

  return { content: updated, changed: updated !== content };
}

function processFile(target) {
  const filePath = path.resolve(target.file);
  if (!fs.existsSync(filePath)) {
    return { file: target.file, changed: false, error: "File not found" };
  }

  const original = fs.readFileSync(filePath, "utf-8");

  const importResult = addTypeImport(original);
  const assertionResult = updateAssertion(importResult.content, target);

  const warnings = [];
  if (importResult.reason) warnings.push(importResult.reason);
  if (assertionResult.reason) warnings.push(assertionResult.reason);

  const changed = original !== assertionResult.content;
  if (changed) {
    fs.writeFileSync(filePath, assertionResult.content, "utf-8");
  }

  return {
    file: target.file,
    changed,
    importChanged: importResult.changed,
    assertionChanged: assertionResult.changed,
    warnings,
  };
}

function runTypeCheck() {
  try {
    execSync("pnpm tsc --noEmit", { stdio: "pipe", encoding: "utf-8" });
    return { ok: true, output: "No TypeScript errors" };
  } catch (error) {
    return {
      ok: false,
      output: error.stdout || error.stderr || String(error),
    };
  }
}

function main() {
  console.log("\nPhase 8B: Implement documentation type integration");
  console.log("=".repeat(64));

  const results = targets.map(processFile);

  const updated = results.filter((r) => r.changed);
  const untouched = results.filter((r) => !r.changed && !r.error);
  const failed = results.filter((r) => r.error);

  console.log("\nUpdated pages:");
  if (updated.length === 0) {
    console.log("  - None (already applied)");
  } else {
    for (const r of updated) {
      console.log(`  - ${r.file}`);
    }
  }

  console.log("\nUnchanged pages:");
  if (untouched.length === 0) {
    console.log("  - None");
  } else {
    for (const r of untouched) {
      console.log(`  - ${r.file}`);
      if (r.warnings && r.warnings.length > 0) {
        for (const warning of r.warnings) {
          console.log(`      warning: ${warning}`);
        }
      }
    }
  }

  if (failed.length > 0) {
    console.log("\nFailed pages:");
    for (const r of failed) {
      console.log(`  - ${r.file}: ${r.error}`);
    }
  }

  console.log("\nRunning type validation (tsc --noEmit)...");
  const check = runTypeCheck();

  if (check.ok) {
    console.log("  ✅ Type check passed");
  } else {
    console.log("  ❌ Type check failed");
    console.log("\nType mismatches found:");
    const lines = String(check.output)
      .split(/\r?\n/)
      .filter(Boolean)
      .slice(0, 50);
    for (const line of lines) {
      console.log(`  ${line}`);
    }
  }

  console.log("\nSummary:");
  console.log(`  - Total targets: ${targets.length}`);
  console.log(`  - Updated: ${updated.length}`);
  console.log(`  - Unchanged: ${untouched.length}`);
  console.log(`  - Failed: ${failed.length}`);

  if (!check.ok || failed.length > 0) {
    process.exit(1);
  }

  process.exit(0);
}

main();
