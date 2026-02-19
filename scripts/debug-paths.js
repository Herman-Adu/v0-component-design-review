const path = require('path');
const fs = require('fs');

console.log('__dirname:', __dirname);
console.log('__filename:', __filename);
console.log('process.cwd():', process.cwd());

const project = path.resolve(__dirname, '..');
console.log('Resolved project root:', project);

try {
  const entries = fs.readdirSync(project);
  console.log('Root entries:', entries.join(', '));
} catch (e) {
  console.log('Cannot read project root:', e.message);
}

// Check if node_modules exists
const nm = path.join(project, 'node_modules');
try {
  fs.statSync(nm);
  console.log('node_modules exists');
  // Check for next and tsc binaries
  const nextBin = path.join(nm, '.bin', 'next');
  const tscBin = path.join(nm, '.bin', 'tsc');
  console.log('next binary exists:', fs.existsSync(nextBin));
  console.log('tsc binary exists:', fs.existsSync(tscBin));
} catch (e) {
  console.log('node_modules not found:', e.message);
}

// Check for app directory
const appDir = path.join(project, 'app');
try {
  const appEntries = fs.readdirSync(appDir);
  console.log('app/ entries:', appEntries.slice(0, 10).join(', '));
} catch (e) {
  console.log('Cannot read app/:', e.message);
}
