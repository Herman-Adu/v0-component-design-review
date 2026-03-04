#!/usr/bin/env node
/**
 * Grid Migration Script - Zone B (Admin + Content Library)
 * 
 * Replaces hardcoded Tailwind grid breakpoints with responsive-grid-* utilities.
 * Run: node scripts/migrate-grids-zone-b.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const migrations = [
  // 4-column grids
  { from: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-4', to: 'responsive-grid-4' },
  { from: 'grid gap-3 sm:grid-cols-2 lg:grid-cols-4', to: 'responsive-grid-4' },
  { from: 'grid gap-4 md:grid-cols-4', to: 'responsive-grid-4' },
  { from: 'grid grid-cols-2 md:grid-cols-4 gap-4', to: 'responsive-grid-icon-2-4' },
  { from: 'grid gap-4 grid-cols-2 lg:grid-cols-4', to: 'responsive-grid-icon-2-4' },
  
  // 3-column grids
  { from: 'grid gap-4 md:grid-cols-2 lg:grid-cols-3', to: 'responsive-grid-3' },
  { from: 'grid gap-4 md:grid-cols-3', to: 'responsive-grid-3' },
  { from: 'grid gap-3 md:grid-cols-3', to: 'responsive-grid-3' },
  { from: 'grid gap-6 md:grid-cols-3', to: 'responsive-grid-3' },
  { from: 'grid gap-4 sm:grid-cols-3', to: 'responsive-grid-3' },
  { from: 'grid md:grid-cols-3 gap-4', to: 'responsive-grid-3' },
  { from: 'grid gap-3 grid-cols-2 lg:grid-cols-3', to: 'responsive-grid-3' },
  { from: 'grid gap-3 md:grid-cols-2 lg:grid-cols-3', to: 'responsive-grid-3' },
  { from: 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3', to: 'responsive-grid-3' },
  { from: 'grid gap-4 md:grid-cols-3 mb-8', to: 'responsive-grid-3 mb-8' },
  { from: 'grid gap-3 sm:grid-cols-3', to: 'responsive-grid-3' },
  { from: 'grid gap-3 grid-cols-2 lg:grid-cols-3', to: 'responsive-grid-3' },
  
  // 2-column grids
  { from: 'grid gap-4 md:grid-cols-2', to: 'responsive-grid-2' },
  { from: 'grid gap-6 lg:grid-cols-2', to: 'responsive-grid-2' },
  { from: 'grid gap-3 md:grid-cols-2', to: 'responsive-grid-2' },
  { from: 'grid gap-3 sm:grid-cols-2', to: 'responsive-grid-2' },
  { from: 'grid gap-4 grid-cols-2', to: 'responsive-grid-2' },
  
  // Special patterns
  { from: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3', to: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3' }, // Keep 6-col as-is
  { from: 'grid grid-cols-2 md:grid-cols-5 gap-4', to: 'responsive-grid-5' },
  { from: 'grid gap-4 grid-cols-2 lg:grid-cols-5', to: 'responsive-grid-5' },
  { from: 'grid grid-cols-2 sm:grid-cols-5 gap-3', to: 'responsive-grid-5' },
  { from: 'grid grid-cols-3 gap-4', to: 'responsive-grid-3' },
];

async function migrateFiles() {
  const adminFiles = await glob('app/dashboard/admin/**/*.tsx', { cwd: '/vercel/share/v0-project' });
  const contentLibFiles = await glob('app/dashboard/content-library/**/*.tsx', { cwd: '/vercel/share/v0-project' });
  const allFiles = [...adminFiles, ...contentLibFiles];

  console.log(`Found ${allFiles.length} files to migrate`);

  let totalChanges = 0;

  for (const filePath of allFiles) {
    const fullPath = `/vercel/share/v0-project/${filePath}`;
    let content = readFileSync(fullPath, 'utf-8');
    let fileChanged = false;

    for (const { from, to } of migrations) {
      const regex = new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, to);
        fileChanged = true;
        totalChanges += matches.length;
      }
    }

    if (fileChanged) {
      writeFileSync(fullPath, content, 'utf-8');
      console.log(`✓ ${filePath}`);
    }
  }

  console.log(`\nMigration complete: ${totalChanges} patterns replaced across ${allFiles.length} files`);
}

migrateFiles().catch(console.error);
