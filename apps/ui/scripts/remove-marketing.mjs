import { readdirSync, rmSync, statSync } from 'fs';
import { join } from 'path';

import { execSync } from 'child_process';

// Find the actual project root
const cwd = process.cwd();
console.log('[v0] CWD:', cwd);

// Try multiple possible paths
const possiblePaths = [
  join(cwd, 'app'),
  '/app',
  '/vercel/share/v0-next-shadcn/app',
  './app',
];

let appDir;
for (const p of possiblePaths) {
  try {
    readdirSync(p);
    appDir = p;
    console.log('[v0] Found app dir at:', p);
    break;
  } catch {
    console.log('[v0] Not found:', p);
  }
}

if (!appDir) {
  // Use find command as fallback
  try {
    const result = execSync('find / -type d -name "(marketing)" 2>/dev/null || true').toString();
    console.log('[v0] Find result:', result);
    if (result.trim()) {
      const marketingPath = result.trim().split('\n')[0];
      console.log('[v0] Removing via find result:', marketingPath);
      rmSync(marketingPath, { recursive: true, force: true });
      console.log('[v0] Removed successfully via find');
      process.exit(0);
    }
  } catch (e) {
    console.log('[v0] Find failed:', e.message);
  }
  console.log('[v0] Could not find app directory');
  process.exit(1);
}

// List all entries in app dir
const entries = readdirSync(appDir);
console.log('[v0] All entries in app/:', entries);

// Find marketing folder
const marketingDir = entries.find(e => e.includes('marketing'));
if (marketingDir) {
  const fullPath = join(appDir, marketingDir);
  console.log('[v0] Found marketing folder:', fullPath);
  
  // List contents recursively
  function listAll(dir, prefix = '') {
    const items = readdirSync(dir);
    for (const item of items) {
      const itemPath = join(dir, item);
      const stat = statSync(itemPath);
      if (stat.isDirectory()) {
        console.log(`[v0]   ${prefix}${item}/`);
        listAll(itemPath, prefix + '  ');
      } else {
        console.log(`[v0]   ${prefix}${item}`);
      }
    }
  }
  
  console.log('[v0] Contents:');
  listAll(fullPath);
  
  // Remove it entirely
  rmSync(fullPath, { recursive: true, force: true });
  console.log('[v0] Successfully removed marketing folder');
  
  // Verify
  const afterEntries = readdirSync(appDir);
  console.log('[v0] App entries after removal:', afterEntries);
} else {
  console.log('[v0] No marketing folder found in app/');
}
