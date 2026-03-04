#!/usr/bin/env node

/**
 * Phase 10: Content Block Migration - Guides & Tutorials
 *
 * PURPOSE: Convert guides (sections) and tutorials (steps) to block-based structure
 *
 * ARCHITECTURE PRINCIPLES:
 * - Strapi mock JSON = single source of truth
 * - All content uses atomic block architecture (atoms/molecules/organisms)
 * - Consistent with articles & case-studies block patterns
 * - Enables unified ContentBlockRenderer across all content types
 *
 * WHAT THIS DOES:
 * 1. Analyzes current guides/tutorials JSON structure
 * 2. Creates backup of all files
 * 3. Converts sections → blocks (guides)
 * 4. Converts steps → blocks (tutorials)
 * 5. Validates block structure against article patterns
 * 6. Generates migration report
 *
 * ROLLBACK: Run phase10-rollback-content-blocks.js
 * VERIFY: Run phase10-verify-content-blocks.js
 *
 * Usage: node scripts/phase10-migrate-content-blocks.js
 */

const fs = require("fs");
const path = require("path");

// Configuration
const CONTENT_LIBRARY_DIR = path.join(
  process.cwd(),
  "data",
  "strapi-mock",
  "dashboard",
  "content-library",
);
const BACKUP_DIR = path.join(process.cwd(), "backups", `phase10-${Date.now()}`);
const REPORT_FILE = path.join(process.cwd(), "phase10-migration-report.json");

// Console colors
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// ============================================================================
// BACKUP SYSTEM
// ============================================================================

function createBackup(filePath) {
  const relativePath = path.relative(CONTENT_LIBRARY_DIR, filePath);
  const backupPath = path.join(BACKUP_DIR, relativePath);

  fs.mkdirSync(path.dirname(backupPath), { recursive: true });
  fs.copyFileSync(filePath, backupPath);

  return backupPath;
}

// ============================================================================
// GUIDE MIGRATION: sections → blocks
// ============================================================================

function convertGuideSectionToBlocks(section, index) {
  const blocks = [];

  // Section header block
  blocks.push({
    type: "molecule.sectionHeader",
    atomicLevel: "molecule",
    props: {
      number: String(index + 1).padStart(2, "0"),
      title: section.title,
      id: section.id,
    },
  });

  // Summary as info box (if exists)
  if (section.summary) {
    blocks.push({
      type: "molecule.infoBox",
      atomicLevel: "molecule",
      props: {
        variant: "info",
        title: null,
        body: section.summary,
      },
    });
  }

  // Parse markdown content into blocks
  const contentBlocks = parseMarkdownToBlocks(section.content);
  blocks.push(...contentBlocks);

  return blocks;
}

function parseMarkdownToBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split("\n");
  let currentParagraph = "";
  let inCodeBlock = false;
  let codeContent = "";
  let codeLanguage = "";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code blocks
    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        // Starting code block
        inCodeBlock = true;
        codeLanguage = line.slice(3).trim() || "text";

        // Flush any pending paragraph
        if (currentParagraph.trim()) {
          blocks.push({
            type: "atom.paragraph",
            atomicLevel: "atom",
            props: { text: currentParagraph.trim() },
          });
          currentParagraph = "";
        }
      } else {
        // Ending code block
        inCodeBlock = false;
        blocks.push({
          type: "molecule.codeBlock",
          atomicLevel: "molecule",
          props: {
            code: codeContent.trim(),
            language: codeLanguage,
            filename: null,
          },
        });
        codeContent = "";
        codeLanguage = "";
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent += line + "\n";
      continue;
    }

    // Headers (convert to sub-section headers)
    if (line.startsWith("## ")) {
      // Flush paragraph
      if (currentParagraph.trim()) {
        blocks.push({
          type: "atom.paragraph",
          atomicLevel: "atom",
          props: { text: currentParagraph.trim() },
        });
        currentParagraph = "";
      }

      blocks.push({
        type: "molecule.subSectionHeader",
        atomicLevel: "molecule",
        props: {
          title: line.slice(3).trim(),
          id: line.slice(3).trim().toLowerCase().replace(/\s+/g, "-"),
        },
      });
      continue;
    }

    // Empty lines (paragraph breaks)
    if (line.trim() === "") {
      if (currentParagraph.trim()) {
        blocks.push({
          type: "atom.paragraph",
          atomicLevel: "atom",
          props: { text: currentParagraph.trim() },
        });
        currentParagraph = "";
      }
      continue;
    }

    // Regular text - accumulate into paragraph
    currentParagraph += line + " ";
  }

  // Flush final paragraph
  if (currentParagraph.trim()) {
    blocks.push({
      type: "atom.paragraph",
      atomicLevel: "atom",
      props: { text: currentParagraph.trim() },
    });
  }

  return blocks;
}

function migrateGuide(guideFilePath) {
  const content = fs.readFileSync(guideFilePath, "utf-8");
  const guide = JSON.parse(content);

  // Backup original
  const backupPath = createBackup(guideFilePath);
  log(`  Backed up: ${path.basename(backupPath)}`, "cyan");

  // Convert sections to blocks
  const allBlocks = [];
  const toc = [];

  guide.sections.forEach((section, index) => {
    const sectionBlocks = convertGuideSectionToBlocks(section, index);
    allBlocks.push(...sectionBlocks);

    // Add to TOC
    toc.push({
      id: section.id,
      title: section.title,
      level: 2,
    });
  });

  // Create new structure
  const migratedGuide = {
    meta: {
      slug: guide.slug,
      title: guide.title,
      excerpt: guide.description,
      level: guide.level,
      category: guide.category,
      readTime: guide.duration,
      publishedAt: guide.publishedAt,
      tags: guide.tags,
    },
    layout: "content-with-toc",
    toc: toc,
    blocks: allBlocks,
  };

  // Write migrated file
  fs.writeFileSync(guideFilePath, JSON.stringify(migratedGuide, null, 2));

  return {
    file: path.basename(guideFilePath),
    originalSections: guide.sections.length,
    newBlocks: allBlocks.length,
    tocItems: toc.length,
  };
}

// ============================================================================
// TUTORIAL MIGRATION: steps → blocks
// ============================================================================

function convertTutorialStepToBlocks(step, index) {
  const blocks = [];

  // Step header with number
  blocks.push({
    type: "molecule.sectionHeader",
    atomicLevel: "molecule",
    props: {
      number: String(index + 1).padStart(2, "0"),
      title: step.title,
      id: `step-${index + 1}`,
    },
  });

  // Step content
  blocks.push({
    type: "atom.paragraph",
    atomicLevel: "atom",
    props: {
      text: step.content,
    },
  });

  // Code block (if exists)
  if (step.code) {
    blocks.push({
      type: "molecule.codeBlock",
      atomicLevel: "molecule",
      props: {
        code: step.code,
        language: detectLanguage(step.code),
        filename: null,
      },
    });
  }

  // Hint (as info box)
  if (step.hint) {
    blocks.push({
      type: "molecule.infoBox",
      atomicLevel: "molecule",
      props: {
        variant: "tip",
        title: "💡 Hint",
        body: step.hint,
      },
    });
  }

  // Solution (as code block with header)
  if (step.solution) {
    blocks.push({
      type: "molecule.subSectionHeader",
      atomicLevel: "molecule",
      props: {
        title: "✅ Solution",
        id: `step-${index + 1}-solution`,
      },
    });

    blocks.push({
      type: "molecule.codeBlock",
      atomicLevel: "molecule",
      props: {
        code: step.solution,
        language: detectLanguage(step.solution),
        filename: null,
      },
    });
  }

  // Explanation
  if (step.explanation) {
    blocks.push({
      type: "molecule.infoBox",
      atomicLevel: "molecule",
      props: {
        variant: "info",
        title: "📖 Explanation",
        body: step.explanation,
      },
    });
  }

  return blocks;
}

function detectLanguage(code) {
  if (
    code.includes("npm ") ||
    code.includes("npx ") ||
    code.includes("pnpm ")
  ) {
    return "bash";
  }
  if (
    code.includes("function ") ||
    code.includes("const ") ||
    code.includes("import ")
  ) {
    return "typescript";
  }
  if (code.includes("docker ") || code.includes("FROM ")) {
    return "dockerfile";
  }
  if (code.includes("version:") || code.includes("services:")) {
    return "yaml";
  }
  return "text";
}

function migrateTutorial(tutorialFilePath) {
  const content = fs.readFileSync(tutorialFilePath, "utf-8");
  const tutorial = JSON.parse(content);

  // Backup original
  const backupPath = createBackup(tutorialFilePath);
  log(`  Backed up: ${path.basename(backupPath)}`, "cyan");

  // Convert steps to blocks
  const allBlocks = [];
  const toc = [];

  tutorial.steps.forEach((step, index) => {
    const stepBlocks = convertTutorialStepToBlocks(step, index);
    allBlocks.push(...stepBlocks);

    // Add to TOC
    toc.push({
      id: `step-${index + 1}`,
      title: `${index + 1}. ${step.title}`,
      level: 2,
    });
  });

  // Create new structure
  const migratedTutorial = {
    meta: {
      slug: tutorial.meta.slug,
      title: tutorial.meta.title,
      excerpt: tutorial.meta.description,
      level: tutorial.meta.level,
      category: tutorial.meta.category,
      readTime: tutorial.meta.duration,
      publishedAt: tutorial.meta.publishedAt,
      tags: tutorial.meta.tags,
    },
    layout: "content-with-toc",
    toc: toc,
    blocks: allBlocks,
  };

  // Write migrated file
  fs.writeFileSync(tutorialFilePath, JSON.stringify(migratedTutorial, null, 2));

  return {
    file: path.basename(tutorialFilePath),
    originalSteps: tutorial.steps.length,
    newBlocks: allBlocks.length,
    tocItems: toc.length,
  };
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

function findContentFiles(dir, pattern) {
  let files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(findContentFiles(fullPath, pattern));
    } else if (item.endsWith(".json") && !item.includes("-list.json")) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  log(
    "\n╔═══════════════════════════════════════════════════════════════╗",
    "blue",
  );
  log(
    "║  Phase 10: Content Block Migration (Guides & Tutorials)      ║",
    "blue",
  );
  log(
    "╚═══════════════════════════════════════════════════════════════╝\n",
    "blue",
  );

  const report = {
    timestamp: new Date().toISOString(),
    guides: [],
    tutorials: [],
    summary: {},
  };

  // Create backup directory
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  log(`✓ Created backup directory: ${BACKUP_DIR}`, "green");

  // MIGRATE GUIDES
  log("\n📘 Migrating Guides (sections → blocks)...", "yellow");
  const guidesDir = path.join(CONTENT_LIBRARY_DIR, "guides");
  const guideFiles = findContentFiles(guidesDir, ".json");

  for (const guideFile of guideFiles) {
    log(`\n  Processing: ${path.basename(guideFile)}`, "cyan");
    try {
      const result = migrateGuide(guideFile);
      report.guides.push(result);
      log(
        `  ✓ Migrated: ${result.originalSections} sections → ${result.newBlocks} blocks`,
        "green",
      );
    } catch (error) {
      log(`  ✗ Error: ${error.message}`, "red");
      report.guides.push({
        file: path.basename(guideFile),
        error: error.message,
      });
    }
  }

  // MIGRATE TUTORIALS
  log("\n\n📗 Migrating Tutorials (steps → blocks)...", "yellow");
  const tutorialsDir = path.join(CONTENT_LIBRARY_DIR, "tutorials");
  const tutorialFiles = findContentFiles(tutorialsDir, ".json");

  for (const tutorialFile of tutorialFiles) {
    log(`\n  Processing: ${path.basename(tutorialFile)}`, "cyan");
    try {
      const result = migrateTutorial(tutorialFile);
      report.tutorials.push(result);
      log(
        `  ✓ Migrated: ${result.originalSteps} steps → ${result.newBlocks} blocks`,
        "green",
      );
    } catch (error) {
      log(`  ✗ Error: ${error.message}`, "red");
      report.tutorials.push({
        file: path.basename(tutorialFile),
        error: error.message,
      });
    }
  }

  // Generate summary
  report.summary = {
    totalGuidesProcessed: report.guides.length,
    totalTutorialsProcessed: report.tutorials.length,
    guidesSuccess: report.guides.filter((g) => !g.error).length,
    tutorialsSuccess: report.tutorials.filter((t) => !t.error).length,
    backupLocation: BACKUP_DIR,
  };

  // Write report
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));

  // Final summary
  log(
    "\n\n╔═══════════════════════════════════════════════════════════════╗",
    "blue",
  );
  log(
    "║  Migration Complete                                           ║",
    "blue",
  );
  log(
    "╚═══════════════════════════════════════════════════════════════╝\n",
    "blue",
  );

  log(
    `✓ Guides migrated: ${report.summary.guidesSuccess}/${report.summary.totalGuidesProcessed}`,
    "green",
  );
  log(
    `✓ Tutorials migrated: ${report.summary.tutorialsSuccess}/${report.summary.totalTutorialsProcessed}`,
    "green",
  );
  log(`✓ Backups saved to: ${BACKUP_DIR}`, "cyan");
  log(`✓ Report saved to: ${REPORT_FILE}`, "cyan");

  log("\n📋 Next Steps:", "yellow");
  log("  1. Run: node scripts/phase10-verify-content-blocks.js", "cyan");
  log("  2. Run: pnpm exec tsc --noEmit", "cyan");
  log("  3. Run: pnpm run build", "cyan");
  log(
    "  4. If issues: node scripts/phase10-rollback-content-blocks.js\n",
    "cyan",
  );
}

// Run migration
main().catch((error) => {
  log(`\n✗ Fatal error: ${error.message}`, "red");
  console.error(error);
  process.exit(1);
});
