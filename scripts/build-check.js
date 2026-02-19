const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Strategy: Check files in batches to avoid OOM
const PROJECT = path.resolve(__dirname, '..');

function findFiles(dir, ext, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name === '.git') continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) findFiles(full, ext, results);
    else if (e.name.endsWith(ext)) results.push(full);
  }
  return results;
}

const tsxFiles = findFiles(PROJECT, '.tsx');
const tsFiles = findFiles(PROJECT, '.ts');
console.log('Total .tsx files:', tsxFiles.length);
console.log('Total .ts files:', tsFiles.length);
console.log('');

// Try tsc with reduced scope - just type-check without full program
const tscBin = path.resolve(PROJECT + '/node_modules/.bin/tsc');

try {
  const output = execFileSync(tscBin, [
    '--noEmit',
    '--pretty',
    '--skipLibCheck',
    '--incremental', 'false',
  ], {
    cwd: PROJECT,
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024,
    timeout: 180000,
    env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=2048' },
  });
  console.log(output || '(no errors)');
  console.log('');
  console.log('=== TSC CHECK RESULT: SUCCESS ===');
} catch (err) {
  if (err.status !== null) {
    // tsc completed but found errors
    const combined = (err.stdout || '') + '\n' + (err.stderr || '');
    console.log(combined);
    console.log('');
    console.log('=== TSC EXIT CODE:', err.status, '===');
  } else {
    // OOM / signal kill
    console.log('TSC was killed (OOM). Trying grep-based error detection...');
    console.log('');
  }
}
