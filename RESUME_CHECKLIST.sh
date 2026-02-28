#!/bin/bash
# RESUME CHECKLIST — Git-native, no state files
# Run this tomorrow morning to sync and continue
# Estimated time: 5 mins

echo "=== RESUME CHECKLIST — Tomorrow Morning ==="
echo ""

# 1. Sync local main to latest remote
echo "1. Syncing main..."
git fetch origin
git switch main
git pull --ff-only origin main
echo "   ✓ main synced"

# 2. Verify baseline tag exists locally
echo ""
echo "2. Checking baseline..."
git tag -l recovery-baseline-2026-02-28 && echo "   ✓ baseline tag confirmed" || echo "   ✗ baseline tag missing"

# 3. Create feature branch for today's refactor phase
echo ""
echo "3. Creating feature branch..."
BRANCH="feature/import-refactor-$(date +%Y-%m-%d)"
git switch -c "$BRANCH" || echo "   (branch may exist; skipping creation)"
echo "   ✓ on branch: $BRANCH"

# 4. Verify build and tests are green
echo ""
echo "4. Running build + integration tests..."
pnpm run build && echo "   ✓ build green" || { echo "   ✗ build failed"; exit 1; }
pnpm run test __tests__/integration-test && echo "   ✓ tests green" || { echo "   ✗ tests failed"; exit 1; }

# 5. Show what you merged yesterday
echo ""
echo "5. Yesterday's recovery baseline:"
git log --oneline recovery-baseline-2026-02-28^..recovery-baseline-2026-02-28
echo ""
echo "=== Ready to continue. Your branch: $BRANCH ==="
echo ""
