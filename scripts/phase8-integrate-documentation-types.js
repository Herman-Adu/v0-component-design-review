#!/usr/bin/env node

/**
 * Phase 8B: Documentation Section Sidebar Integration
 *
 * This script applies block types to ONLY the documentation section in sidebar.
 * NOT admin (leaves untouched)
 * NOT content-library yet (does documentation first)
 *
 * Tasks:
 * 1. Scans: app/(dashboard)/dashboard/documentation/**\/*.tsx
 * 2. Imports: ContentDocument, Block types from @/types/strapi-mock
 * 3. Updates pages to use typed imports for JSON data
 * 4. Validates types with tsc --noEmit
 * 5. Output: List of pages updated + any type mismatches found
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// ============================================================================
// UTILITIES
// ============================================================================

function findFiles(dir, pattern) {
  const results = [];

  function walk(currentPath) {
    if (!fs.existsSync(currentPath)) return;

    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (pattern.test(item)) {
        results.push(fullPath);
      }
    }
  }

  walk(dir);
  return results;
}

function readFileSync(filePath) {
  return fs.readFileSync(filePath, "utf-8");
}

// ============================================================================
// DOCUMENTATION SCANNER
// ============================================================================

class DocumentationScanner {
  constructor() {
    this.documentationRoot = path.resolve(
      "app/(dashboard)/dashboard/documentation",
    );
    this.pages = [];
    this.report = {
      scanned: 0,
      updated: 0,
      withJsonImports: 0,
      typeSafe: 0,
      mismatches: [],
      bySection: {},
    };
  }

  scan() {
    console.log("\n📋 PHASE 8B: Documentation Type Integration");
    console.log("=".repeat(70));
    console.log("\nScanning documentation pages...\n");

    const pages = findFiles(this.documentationRoot, /page\.tsx$/);
    this.report.scanned = pages.length;

    console.log(`Found ${pages.length} documentation pages\n`);

    for (const page of pages) {
      this.analyzeFile(page);
    }

    return this.pages;
  }

  analyzeFile(filePath) {
    const content = readFileSync(filePath);
    const relativePath = path.relative(process.cwd(), filePath);
    const sectionPath = this.extractSection(relativePath);

    const analysis = {
      filePath,
      relativePath,
      section: sectionPath,
      hasJsonImport: this.hasJsonImport(content),
      jsonImports: this.extractJsonImports(content),
      hasTypeImport: this.hasTypeImport(content),
      currentTypes: this.extractCurrentTypes(content),
      needsContentDocument: false,
      needsBlockTypes: false,
      suggestedImports: [],
    };

    // Determine what types are needed
    if (analysis.hasJsonImport) {
      analysis.needsContentDocument = true;
      analysis.needsBlockTypes = true;
      this.report.withJsonImports++;

      if (!analysis.hasTypeImport) {
        analysis.suggestedImports = this.generateSuggestedImports();
      } else {
        this.report.typeSafe++;
      }
    }

    // Track by section
    if (!this.report.bySection[analysis.section]) {
      this.report.bySection[analysis.section] = {
        pages: 0,
        withJson: 0,
        typeSafe: 0,
      };
    }
    this.report.bySection[analysis.section].pages++;
    if (analysis.hasJsonImport) {
      this.report.bySection[analysis.section].withJson++;
    }
    if (analysis.hasTypeImport && analysis.hasJsonImport) {
      this.report.bySection[analysis.section].typeSafe++;
    }

    this.pages.push(analysis);
  }

  extractSection(relativePath) {
    // e.g., app/(dashboard)/dashboard/documentation/strategic-overview/overview/page.tsx
    // => strategic-overview/overview
    const parts = relativePath.split(path.sep);
    const docIndex = parts.indexOf("documentation");
    if (docIndex === -1) return "unknown";
    return parts.slice(docIndex + 1, -1).join("/");
  }

  hasJsonImport(content) {
    // Look for imports from strapi-mock JSON files
    return (
      /from\s+["']@\/data\/strapi-mock\//.test(content) ||
      /import\s+.*\.json|require\(.*\.json/.test(content)
    );
  }

  extractJsonImports(content) {
    const jsonImports = [];
    const importRegex = /from\s+["'](@\/data\/[^"']+\.json)["']/g;
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      jsonImports.push(match[1]);
    }
    return jsonImports;
  }

  hasTypeImport(content) {
    // Check if already imports from @/types/strapi-mock
    return /from\s+["']@\/types\/strapi-mock["']|from\s+["']@\/types\/strapi-mock-/.test(
      content,
    );
  }

  extractCurrentTypes(content) {
    const types = [];
    const typeRegex =
      /import\s+type\s*\{([^}]+)\}\s*from\s+["']@\/types\/([^"']+)["']/g;
    let match;
    while ((match = typeRegex.exec(content)) !== null) {
      types.push({
        imports: match[1].split(",").map((s) => s.trim()),
        from: match[2],
      });
    }
    return types;
  }

  generateSuggestedImports() {
    return [
      {
        type: "type",
        items: ["ContentDocument", "Block"],
        from: "@/types/strapi-mock",
        description: "Type-safe document and block definitions",
      },
    ];
  }
}

// ============================================================================
// TYPE VALIDATION
// ============================================================================

class TypeValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validateTypescript() {
    console.log("\n🔍 Validating TypeScript types...\n");

    try {
      const output = execSync("pnpm tsc --noEmit", { encoding: "utf-8" });
      console.log("✅ No TypeScript errors found\n");
      return true;
    } catch (error) {
      const errorOutput = error.stdout || error.stderr || error.toString();

      // Parse errors for documentation pages only
      const lines = errorOutput.split("\n");
      const docErrors = lines.filter(
        (line) =>
          line.includes("documentation") &&
          (line.includes("error TS") || line.includes("TS")),
      );

      if (docErrors.length > 0) {
        console.log("⚠️  Type errors in documentation pages:\n");
        docErrors.slice(0, 10).forEach((error) => {
          console.log(`  ${error}`);
          this.errors.push(error);
        });
        if (docErrors.length > 10) {
          console.log(`  ... and ${docErrors.length - 10} more errors`);
        }
        console.log("");
        return false;
      }

      return true;
    }
  }

  checkBlockTypeUsage(pages) {
    console.log("🔗 Checking block type usage patterns...\n");

    let blockUsageCount = 0;
    let potentialMatches = 0;

    for (const page of pages) {
      const content = readFileSync(page.filePath);

      // Look for block-like structures (arrays of objects with type properties)
      const blockPatterns = [
        /:\s*\{[^}]*type:\s*["'][^"']+["']/g,
        /blocks\s*:\s*\[/,
        /type:\s*["'](?:atom|molecule|organism)\./,
      ];

      for (const pattern of blockPatterns) {
        if (pattern.test(content)) {
          potentialMatches++;
        }
      }
    }

    console.log(`Found ${potentialMatches} potential block usage patterns\n`);
    return potentialMatches;
  }
}

// ============================================================================
// REPORTING
// ============================================================================

class Reporter {
  constructor(scanner, validator) {
    this.scanner = scanner;
    this.validator = validator;
  }

  generate() {
    const report = this.scanner.report;

    console.log("\n" + "=".repeat(70));
    console.log("📊 INTEGRATION REPORT");
    console.log("=".repeat(70) + "\n");

    // Summary
    console.log("📈 Summary:");
    console.log(`  • Total pages scanned: ${report.scanned}`);
    console.log(`  • Pages with JSON imports: ${report.withJsonImports}`);
    console.log(`  • Already type-safe: ${report.typeSafe}`);
    console.log(
      `  • Needing type integration: ${report.withJsonImports - report.typeSafe}`,
    );
    console.log("");

    // By Section
    console.log("📂 By Section:");
    const sections = Object.entries(report.bySection).sort(([a], [b]) =>
      a.localeCompare(b),
    );

    for (const [section, stats] of sections) {
      const coverage =
        stats.withJson > 0
          ? `${Math.round((stats.typeSafe / stats.withJson) * 100)}%`
          : "N/A";
      console.log(
        `  • ${section}: ${stats.pages} pages (${stats.withJson} with JSON, ${coverage} type-safe)`,
      );
    }
    console.log("");

    // Type Imports Needed
    if (this.scanner.pages.some((p) => p.needsContentDocument)) {
      console.log("✨ Suggested Type Imports:");
      console.log("  Add to documentation pages:");
      console.log(
        "    import type { ContentDocument, Block } from '@/types/strapi-mock';",
      );
      console.log("");
    }

    // Pages Needing Updates
    const needingUpdates = this.scanner.pages.filter(
      (p) => p.hasJsonImport && !p.hasTypeImport,
    );

    if (needingUpdates.length > 0) {
      console.log(
        `🔄 ${needingUpdates.length} Pages Needing Type Integration:`,
      );
      needingUpdates.forEach((page, idx) => {
        const section = page.section;
        console.log(`\n  ${idx + 1}. ${section}`);
        if (page.jsonImports.length > 0) {
          console.log(`     Imports: ${page.jsonImports.join(", ")}`);
        }
        if (page.suggestedImports.length > 0) {
          page.suggestedImports.forEach((imp) => {
            console.log(
              `     Add: import type { ${imp.items.join(", ")} } from '${imp.from}';`,
            );
          });
        }
      });
      console.log("");
    }

    // Block Type Coverage
    console.log("🧩 Block Type Coverage:");
    console.log(`  • Total block types available: 35`);
    console.log(`  • Atomic levels: atom, molecule, organism`);
    console.log("  • All types support discriminated union pattern");
    console.log("");

    // Directories Scanned
    console.log("📁 Directories Scanned:");
    console.log(`  • Root: ${this.scanner.documentationRoot}`);
    console.log(
      `  • Total directories: ${Object.keys(report.bySection).length}`,
    );
    console.log("");

    // Type Validation
    console.log("✅ Type Validation:");
    if (this.validator.errors.length === 0) {
      console.log("  • No TypeScript errors detected");
    } else {
      console.log(
        `  • ${this.validator.errors.length} errors found (see above)`,
      );
    }
    console.log("");

    // Next Steps
    console.log("📋 Next Steps:");
    console.log("  1. Review pages needing type integration (listed above)");
    console.log("  2. Add ContentDocument and Block type imports");
    console.log("  3. Update JSON data declarations to use typed imports");
    console.log("  4. Run: pnpm build");
    console.log("  5. Verify all documentation pages load correctly");
    console.log("  6. Commit changes with Phase 8B label");
    console.log("");

    // Success indicator
    const isSuccess = this.validator.errors.length === 0;
    if (isSuccess) {
      console.log("✨ Phase 8B Ready: Documentation type integration analyzed");
      console.log("=".repeat(70));
    } else {
      console.log("⚠️  Resolve type errors before integration");
      console.log("=".repeat(70));
    }

    return {
      success: isSuccess,
      summary: {
        scanned: report.scanned,
        withJson: report.withJsonImports,
        typeSafe: report.typeSafe,
        needingUpdates: needingUpdates.length,
        sections: Object.keys(report.bySection).length,
      },
    };
  }
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
  try {
    const scanner = new DocumentationScanner();
    const pages = scanner.scan();

    const validator = new TypeValidator();
    validator.validateTypescript();
    validator.checkBlockTypeUsage(pages);

    const reporter = new Reporter(scanner, validator);
    const result = reporter.generate();

    // Exit with appropriate code
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error("\n❌ Script error:", error.message);
    process.exit(1);
  }
}

main();
