#!/usr/bin/env node

/**
 * Vercel Ignore Build Script
 * 
 * Controls when Vercel should build the project to optimize build minutes.
 * 
 * Skip builds for:
 * - v0/* branches (work-in-progress)
 * - Draft PRs (validation in progress)
 * 
 * Build for:
 * - main branch (production)
 * - Ready PRs (validated and approved)
 */

const branch = process.env.VERCEL_GIT_COMMIT_REF || '';
const isDraft = process.env.VERCEL_GIT_PR_DRAFT === '1';

console.log('[Vercel Build Check]');
console.log(`Branch: ${branch}`);
console.log(`Is Draft PR: ${isDraft}`);

// Skip builds for v0/* branches
if (branch.startsWith('v0/')) {
  console.log('❌ Skipping build: v0 work-in-progress branch');
  process.exit(0);
}

// Skip builds for draft PRs
if (isDraft) {
  console.log('❌ Skipping build: Draft PR (not ready for review)');
  process.exit(0);
}

// Build for main and ready PRs
console.log('✅ Proceeding with build');
process.exit(1);
