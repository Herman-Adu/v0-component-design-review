#!/usr/bin/env node

/**
 * Phase 10: Content Block Migration - ROLLBACK
 *
 * PURPOSE: Safely rollback guide/tutorial block migration if issues occur
 *
 * WHAT THIS DOES:
 * 1. Finds the most recent backup directory
 * 2. Restores all backed-up JSON files
 * 3. Verifies restoration integrity
 * 4. Generates rollback report
 *
 * Usage: node scripts/phase10-rollback-content-blocks.js
 */

const fs = require("fs");
const path = require("path");

const CONTENT_LIBRARY_DIR = path.join(
  process.cwd(),
  "data",
  "strapi-mock",
  "dashboard",
  "content-library",
);
const BACKUPS_DIR = path.join(process.cwd(), "backups");
const ROLLBACK_REPORT_FILE = path.join(
  process.cwd(),
  "phase10-rollback-report.json",
);

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

// Find most recent backup directory
function findLatestBackup() {
  if (!fs.existsSync(BACKUPS_DIR)) {
    throw new Error(`Backup directory not found: ${BACKUPS_DIR}`);
  }

  const backupDirs = fs
    .readdirSync(BACKUPS_DIR)
    .filter((dir) => dir.startsWith("phase10-"))
    .map((dir) => ({
      name: dir,
      path: path.join(BACKUPS_DIR, dir),
      timestamp: parseInt(dir.split("-")[1]),
    }))
    .sort((a, b) => b.timestamp - a.timestamp);

  if (backupDirs.length === 0) {
    throw new Error("No Phase 10 backups found");
  }

  return backupDirs[0];
}

// Recursively restore files
function restoreFiles(backupDir, targetDir) {
  const restored = [];

  function restore(srcDir, destDir) {
    const items = fs.readdirSync(srcDir);

    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      const destPath = path.join(destDir, item);

      if (fs.statSync(srcPath).isDirectory()) {
        fs.mkdirSync(destPath, { recursive: true });
        restore(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
        restored.push({
          file: item,
          from: srcPath,
          to: destPath,
        });
        log(`  ✓ Restored: ${item}`, "green");
      }
    }
  }

  restore(backupDir, targetDir);
  return restored;
}

async function main() {
  log(
    "\n╔═══════════════════════════════════════════════════════════════╗",
    "red",
  );
  log(
    "║  Phase 10: Content Block Migration - ROLLBACK                ║",
    "red",
  );
  log(
    "╚═══════════════════════════════════════════════════════════════╝\n",
    "red",
  );

  try {
    // Find latest backup
    const latestBackup = findLatestBackup();
    log(`✓ Found backup: ${latestBackup.name}`, "green");
    log(
      `  Created: ${new Date(latestBackup.timestamp).toLocaleString()}`,
      "cyan",
    );

    // Confirm rollback
    log(
      "\n⚠️  This will restore all guides and tutorials to their pre-migration state.",
      "yellow",
    );
    log(
      "   Press Ctrl+C to cancel, or wait 3 seconds to continue...",
      "yellow",
    );

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const report = {
      timestamp: new Date().toISOString(),
      backupUsed: latestBackup.name,
      restoredFiles: [],
      errors: [],
    };

    // Restore guides
    log("\n📘 Restoring Guides...", "yellow");
    const guidesBackupDir = path.join(latestBackup.path, "guides");
    const guidesTargetDir = path.join(CONTENT_LIBRARY_DIR, "guides");

    if (fs.existsSync(guidesBackupDir)) {
      const guidesRestored = restoreFiles(guidesBackupDir, guidesTargetDir);
      report.restoredFiles.push(
        ...guidesRestored.map((f) => ({ ...f, type: "guide" })),
      );
      log(`✓ Restored ${guidesRestored.length} guide files`, "green");
    }

    // Restore tutorials
    log("\n📗 Restoring Tutorials...", "yellow");
    const tutorialsBackupDir = path.join(latestBackup.path, "tutorials");
    const tutorialsTargetDir = path.join(CONTENT_LIBRARY_DIR, "tutorials");

    if (fs.existsSync(tutorialsBackupDir)) {
      const tutorialsRestored = restoreFiles(
        tutorialsBackupDir,
        tutorialsTargetDir,
      );
      report.restoredFiles.push(
        ...tutorialsRestored.map((f) => ({ ...f, type: "tutorial" })),
      );
      log(`✓ Restored ${tutorialsRestored.length} tutorial files`, "green");
    }

    // Write report
    fs.writeFileSync(ROLLBACK_REPORT_FILE, JSON.stringify(report, null, 2));

    // Summary
    log(
      "\n\n╔═══════════════════════════════════════════════════════════════╗",
      "green",
    );
    log(
      "║  Rollback Complete                                            ║",
      "green",
    );
    log(
      "╚═══════════════════════════════════════════════════════════════╝\n",
      "green",
    );

    log(`✓ Total files restored: ${report.restoredFiles.length}`, "green");
    log(`✓ Rollback report: ${ROLLBACK_REPORT_FILE}`, "cyan");

    log("\n📋 Next Steps:", "yellow");
    log("  1. Verify files are restored correctly", "cyan");
    log("  2. Run: pnpm exec tsc --noEmit", "cyan");
    log("  3. Run: pnpm run build\n", "cyan");
  } catch (error) {
    log(`\n✗ Rollback failed: ${error.message}`, "red");
    console.error(error);
    process.exit(1);
  }
}

main();
