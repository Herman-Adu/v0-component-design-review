# Content Library Refactor: Quick Start Checklist

**Date**: March 2, 2026  
**Before you start**: Read CONTENT_LIBRARY_REFACTOR_EXECUTION_PLAN.md for full details

---

## ⚠️ CRITICAL RULES (NO EXCEPTIONS)

1. **BUILD AFTER EVERY PHASE**: `Remove-Item -Recurse -Force .next; npm run build`
2. **JSON VALIDATION BEFORE COMMITS**: Run Phase 0B script
3. **NEVER MERGE WITHOUT BUILD PASSING**: No exceptions, learned this the hard way
4. **ARCHIVE FIRST, DELETE LATER**: Content preservation is #1 priority
5. **ONE GENERIC BLOCK RENDERER ONLY**: No duplicated renderer implementations by section/domain

---

## Phase 0: Pre-Flight (Run These Scripts NOW)

### 0A: Dynamic Zone Compliance Audit

```powershell
# Check all 71 JSON files have atomicLevel in blocks
$files = Get-ChildItem -Path "data/strapi-mock/dashboard/content-library" -Filter *.json -Recurse
$results = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName | ConvertFrom-Json
    if ($content.blocks) {
        $missingAtomic = $content.blocks | Where-Object { -not $_.atomicLevel }
        if ($missingAtomic.Count -gt 0) {
            $results += [PSCustomObject]@{
                File = $file.Name
                Issue = "Missing atomicLevel in $($missingAtomic.Count) blocks"
            }
        }
    }
}

if ($results.Count -eq 0) {
    Write-Host "✅ All files pass dynamic zone compliance" -ForegroundColor Green
} else {
    Write-Host "❌ Found issues:" -ForegroundColor Red
    $results | Format-Table -AutoSize
}
```

**Expected**: ✅ All files pass  
**If fails**: Fix JSON files before proceeding

---

### 0B: JSON Syntax Validation

```powershell
# Validate all 71 JSON files for syntax errors
$files = Get-ChildItem -Path "data/strapi-mock/dashboard/content-library" -Filter *.json -Recurse
$errors = @()

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw | ConvertFrom-Json
        if (-not $content.meta) { $errors += "$($file.Name): Missing 'meta'" }
        if (-not $content.blocks) { $errors += "$($file.Name): Missing 'blocks'" }
    } catch {
        $errors += "$($file.Name): $($_.Exception.Message)"
    }
}

if ($errors.Count -eq 0) {
    Write-Host "✅ All $($files.Count) JSON files valid" -ForegroundColor Green
} else {
    Write-Host "❌ Found $($errors.Count) errors:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
}
```

**Expected**: ✅ All 71 files valid  
**If fails**: Fix before proceeding

---

### 0C: Build Baseline

```powershell
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build > baseline-build.log 2>&1

# Capture key metrics
Get-Content baseline-build.log | Select-String "Generating static pages"
Get-Content baseline-build.log | Select-String "Route \(app\)"
```

**Expected**: ~166 static pages, no errors  
**Save**: `git add baseline-build.log; git commit -m "chore: baseline metrics"`

---

### 0D: Create Archive

```powershell
# Archive current page files
New-Item -ItemType Directory -Path "archive/content-library-refactor-2026-03-02" -Force

$pages = @(
    "app/(dashboard)/dashboard/content-library/articles/[category]/[slug]/page.tsx",
    "app/(dashboard)/dashboard/content-library/articles/page.tsx",
    "app/(dashboard)/dashboard/content-library/case-studies/[category]/[slug]/page.tsx",
    "app/(dashboard)/dashboard/content-library/case-studies/page.tsx",
    "app/(dashboard)/dashboard/content-library/guides/[category]/[slug]/page.tsx",
    "app/(dashboard)/dashboard/content-library/guides/page.tsx",
    "app/(dashboard)/dashboard/content-library/tutorials/[category]/[slug]/page.tsx",
    "app/(dashboard)/dashboard/content-library/tutorials/page.tsx"
)

foreach ($page in $pages) {
    Copy-Item $page "archive/content-library-refactor-2026-03-02/$(Split-Path $page -Leaf)" -Force
}

git add archive/
git commit -m "chore: archive content-library pages before refactor"
```

**Expected**: 8 files archived and committed

---

### 0E: Renderer DRY Audit (Senior Architect Gate)

```powershell
# Must return only the shared generic renderer + thin aliases/wrappers
Get-ChildItem -Path "components/organisms" -Filter "*block-renderer*.tsx" |
  Select-Object -ExpandProperty FullName

# Verify no duplicate switch trees exist
Get-ChildItem -Path "components/organisms" -Filter "*block-renderer*.tsx" |
  ForEach-Object {
    $match = Select-String -Path $_.FullName -Pattern "switch \(.*block.*type|case \"block\.|case \"molecule\.|case \"atom\."
    if ($match) {
      Write-Host "Renderer switch found in: $($_.FullName)" -ForegroundColor Yellow
    }
  }
```

**Expected**: Single generic renderer owns block switch logic  
**If fails**: Consolidate to shared renderer before proceeding

---

## ✅ Phase 0 Complete Checklist

Before proceeding to Phase 1:

- [ ] Dynamic zone compliance: ✅ Pass
- [ ] JSON syntax validation: ✅ All 71 files valid
- [ ] Baseline build: ✅ Passes, metrics captured
- [ ] Archive created: ✅ 8 files backed up, committed to git
- [ ] Renderer DRY audit: ✅ Single generic block renderer contract confirmed
- [ ] I have read the full execution plan
- [ ] I understand the quality gates
- [ ] I commit to BUILD AFTER EVERY PHASE

---

## Phase 1: Helper Module Creation

### 1A: Create Helper File

```powershell
# File is ready in execution plan
# Copy content from CONTENT_LIBRARY_REFACTOR_EXECUTION_PLAN.md
# Phase 1: Helper Module Creation section

# Create: lib/strapi/dashboard/content-library/content-library-helpers.ts
```

### 1B: Validate

```powershell
npx tsc --noEmit
```

**Expected**: 0 errors

### 1C: Build

```powershell
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build
```

**Expected**: ✅ Build passes

### 1D: Commit

```powershell
git add lib/strapi/dashboard/content-library/content-library-helpers.ts
git commit -m "feat(content-library): create helper module to eliminate 20+ duplications"
```

---

## Phase 2: Refactor Detail Pages

### 2A: Update Pages

Files to modify:

- [ ] `articles/[category]/[slug]/page.tsx`
- [ ] `guides/[category]/[slug]/page.tsx`
- [ ] `tutorials/[category]/[slug]/page.tsx`
- [ ] `case-studies/[category]/[slug]/page.tsx`

**Pattern**: Import helpers, remove local functions

### 2B: Validate

```powershell
npx tsc --noEmit
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build
```

**Expected**: ✅ Build passes, all static params generated

### 2C: Manual Test

```powershell
npm run dev

# Test 3 pages from each type (12 total):
# Articles: /dashboard/content-library/articles/best-practices/refactoring-for-maintainability
# Tutorials: /dashboard/content-library/tutorials/forms/building-multi-step-forms-with-server-actions
# Case Studies: /dashboard/content-library/case-studies/security/rate-limiting-bypass-to-production
# Guides: /dashboard/content-library/guides/security/security-architecture
```

**Verify**: Colors correct, TOC renders, no console errors

### 2D: Commit

```powershell
git add app/(dashboard)/dashboard/content-library/*/[category]/[slug]/page.tsx
git commit -m "refactor(content-library): update detail pages to use helper module"
```

---

## Phase 3: Refactor List Pages

### 3A: Update Pages

Files to modify:

- [ ] `articles/page.tsx`
- [ ] `guides/page.tsx`
- [ ] `tutorials/page.tsx`
- [ ] `case-studies/page.tsx`

### 3B: Validate & Build

```powershell
npx tsc --noEmit
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build
```

### 3C: Manual Test

```powershell
npm run dev

# Test all 4 list pages:
# /dashboard/content-library/articles
# /dashboard/content-library/guides
# /dashboard/content-library/tutorials
# /dashboard/content-library/case-studies
```

### 3D: Commit

```powershell
git add app/(dashboard)/dashboard/content-library/*/page.tsx
git commit -m "refactor(content-library): update list pages to use helper module"
```

---

## Phase 4: Cache Headers

### 4A: Update next.config.mjs

Add cache headers (pattern in execution plan)

### 4B: Build

```powershell
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build
```

### 4C: Commit

```powershell
git add next.config.mjs
git commit -m "perf(content-library): add cache headers for static content"
```

---

## Phase 5: Testing & Validation

### 5A: Run Tests

```powershell
npm test
```

**Expected**: All tests pass

### 5B: Build Analysis

```powershell
npm run build > post-refactor-build.log 2>&1
Compare-Object (Get-Content baseline-build.log) (Get-Content post-refactor-build.log)
```

### 5C: Manual Regression (12 pages minimum)

Test matrix:

- [ ] 3 articles (beginner, intermediate, advanced)
- [ ] 3 tutorials (different categories)
- [ ] 3 case studies (different categories)
- [ ] 3 guides (all 3 guides)

For each, check:

- [ ] Renders without errors
- [ ] Metadata present
- [ ] Badge colors correct
- [ ] TOC renders (if present)
- [ ] Tags display
- [ ] Content renders

### 5D: Commit

```powershell
git add post-refactor-build.log
git commit -m "test(content-library): comprehensive validation post-refactor"
```

---

## Phase 6: Documentation

### 6A: Update Files

- [ ] ARCHITECTURE_REVIEW_3AXIS.md (update score)
- [ ] CONTENT_LIBRARY_ARCHITECTURE.md (create new)
- [ ] README.md (update overview)
- [ ] DOCUMENTATION_COMPLETION_HANDOFF.md (mark complete)

### 6B: Commit

```powershell
git add ARCHITECTURE_*.md README.md DOCUMENTATION_*.md
git commit -m "docs: update architecture documentation post content-library refactor"
```

---

## FINAL: Pre-Merge Checklist

**DO NOT MERGE WITHOUT ALL GREEN**:

- [ ] JSON validation: ✅ All 71 files valid (re-run Phase 0B)
- [ ] TypeScript: ✅ `npx tsc --noEmit` = 0 errors
- [ ] Build: ✅ Fresh build passes
- [ ] Tests: ✅ `npm test` all pass
- [ ] Manual: ✅ 12+ pages tested
- [ ] Console: ✅ No errors in dev server
- [ ] Git: ✅ All changes committed
- [ ] Docs: ✅ Architecture docs updated

---

## Merge to Main

```powershell
# Final build check
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build

# If passing:
git checkout main
git pull origin main
git merge feature/content-library-refactor --no-ff -m "Merge content-library refactor"
git push origin main

# Tag
git tag -a content-library-refactor-v1.0 -m "Content library refactor complete"
git push origin content-library-refactor-v1.0
```

---

## Recovery Commands (If Something Goes Wrong)

### Restore from Archive

```powershell
Copy-Item "archive/content-library-refactor-2026-03-02/*" "app/(dashboard)/dashboard/content-library/" -Recurse -Force
```

### Restore from Git

```powershell
git log --oneline -- app/(dashboard)/dashboard/content-library/
git checkout <commit-hash> -- app/(dashboard)/dashboard/content-library/
```

### Revert Last Commit

```powershell
git reset --hard HEAD~1
```

---

## Success Metrics

**Before**: 9.7/10 architecture score, 20+ duplications  
**After**: 9.8/10 architecture score, 0 duplications

**Lines Reduced**: ~400 lines across 8 page files  
**Helper Module**: 1 file, ~350 lines (eliminates 20+ functions)  
**Build Time**: Maintained or improved  
**Content**: 71 JSON files preserved, 0 lost

---

_Last Updated: March 2, 2026_  
_Status: Ready for Execution_
