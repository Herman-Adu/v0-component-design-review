#!/usr/bin/env node

/**
 * Vercel Ignore Build Script
 *
 * Controls when Vercel should build the project to optimize build minutes.
 *
 * ONLY build for:
 * - main branch (production)
 *
 * Skip builds for:
 * - All other branches (review, staging, develop, etc.)
 * - Draft PRs
 * - v0/* branches (work-in-progress)
 */

const branch = process.env.VERCEL_GIT_COMMIT_REF || "";
const isDraft = process.env.VERCEL_GIT_PR_DRAFT === "1";

console.log("[Vercel Build Check]");
console.log(`Branch: ${branch}`);
console.log(`Is Draft PR: ${isDraft}`);

// ONLY build for main branch
if (branch === "main") {
  console.log("✅ Proceeding with build (main branch - production)");
  process.exit(1);
}

// Skip everything else
console.log(`❌ Skipping build: "${branch}" is not main branch`);
if (isDraft) {
  console.log("   (Also: Draft PR detected)");
}
if (branch.startsWith("v0/")) {
  console.log("   (Also: v0 work-in-progress branch)");
}
process.exit(0);
