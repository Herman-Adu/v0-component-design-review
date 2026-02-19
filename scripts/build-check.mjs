import { execSync } from 'child_process';

console.log('=== BUILD CHECK START ===');
console.log('Running: npx next build');
console.log('');

try {
  const output = execSync('npx next build', {
    cwd: '/vercel/share/v0-project',
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
    env: { ...process.env, NODE_ENV: 'production', NEXT_TELEMETRY_DISABLED: '1' },
    timeout: 300000, // 5 min timeout
  });
  console.log(output);
  console.log('');
  console.log('=== BUILD CHECK RESULT: SUCCESS ===');
} catch (err) {
  console.log('=== STDOUT ===');
  console.log(err.stdout || '(empty)');
  console.log('');
  console.log('=== STDERR ===');
  console.log(err.stderr || '(empty)');
  console.log('');
  console.log('=== BUILD CHECK RESULT: FAILED (exit code ' + err.status + ') ===');
}
