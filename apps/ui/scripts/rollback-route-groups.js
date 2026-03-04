#!/usr/bin/env node

/**
 * Route Group Rollback Script
 * 
 * This script reverses the route group restructuring if something goes wrong.
 * Run: node scripts/rollback-route-groups.js
 */

const fs = require('fs');
const path = require('path');

const appDir = path.join(__dirname, '..', 'app');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
    log(`✓ Removed: ${dirPath}`, 'green');
  }
}

function moveDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    log(`✗ Source not found: ${src}`, 'yellow');
    return false;
  }
  
  if (fs.existsSync(dest)) {
    log(`✗ Destination already exists: ${dest}`, 'red');
    return false;
  }
  
  fs.renameSync(src, dest);
  log(`✓ Moved: ${src} → ${dest}`, 'green');
  return true;
}

log('\n⏪ Starting Route Group Rollback...\n', 'blue');

// Step 1: Move dashboard back to original location
log('Step 1: Restoring dashboard to original location...', 'yellow');
const dashboardInGroup = path.join(appDir, '(dashboard)', 'dashboard');
const originalDashboard = path.join(appDir, 'dashboard');

if (moveDirectory(dashboardInGroup, originalDashboard)) {
  log('✓ Dashboard restored to /app/dashboard', 'green');
}

// Step 2: Move homepage back to root
log('\nStep 2: Restoring homepage to root...', 'yellow');
const marketingHome = path.join(appDir, '(marketing)', 'page.tsx');
const rootHome = path.join(appDir, 'page.tsx');

if (fs.existsSync(marketingHome)) {
  fs.renameSync(marketingHome, rootHome);
  log('✓ Homepage restored to /app/page.tsx', 'green');
}

// Step 3: Remove route group directories
log('\nStep 3: Removing route group directories...', 'yellow');
removeDir(path.join(appDir, '(marketing)'));
removeDir(path.join(appDir, '(dashboard)'));
removeDir(path.join(appDir, '(auth)'));

// Step 4: Remove documentation
const docsFile = path.join(appDir, 'ROUTE_GROUPS.md');
if (fs.existsSync(docsFile)) {
  fs.unlinkSync(docsFile);
  log('✓ Removed ROUTE_GROUPS.md', 'green');
}

log('\n✅ Rollback Complete!\n', 'green');
log('Structure restored to original state.\n', 'yellow');
