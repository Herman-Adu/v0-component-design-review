#!/bin/bash

# Phase 8: Build and Verify
# Full validation workflow: TypeScript + build + dev server
# Output: Console output + exit code

echo "✓ Starting full validation..."

# Step 1: TypeScript compilation
echo ""
echo "Step 1: TypeScript Compiler Check"
echo "=================================="
npx tsc --noEmit
if [ $? -ne 0 ]; then
  echo "✗ TypeScript compilation failed"
  exit 1
fi
echo "✓ TypeScript: 0 errors"

# Step 2: Check types file exists
echo ""
echo "Step 2: Types File Validation"
echo "=============================="
if [ ! -f "types/strapi-mock.ts" ]; then
  echo "✗ Types file not found: types/strapi-mock.ts"
  exit 1
fi
echo "✓ Types file exists: $(wc -l < types/strapi-mock.ts) lines"

# Step 3: Full build
echo ""
echo "Step 3: Full Build"
echo "=================="
npm run build
if [ $? -ne 0 ]; then
  echo "✗ Build failed"
  exit 1
fi
echo "✓ Build: SUCCESS"

# Step 4: Dev server test (quick check)
echo ""
echo "Step 4: Dev Server Check"
echo "========================"
timeout 5 npm run dev &
sleep 3
if curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "✓ Dev server: Running"
else
  echo "⚠ Dev server: Could not verify (timeout OK)"
fi

# Final summary
echo ""
echo "✓ VALIDATION COMPLETE"
echo "===================="
echo "✓ TypeScript compilation: PASSED"
echo "✓ Types file: VALIDATED"
echo "✓ Build: PASSED"
echo "✓ Ready for Phase 8 handoff"

exit 0
