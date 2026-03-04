# Phase 10: Content Block Migration - Execution Guide

**Date**: February 27, 2026  
**Architect**: Senior Full-Stack Engineer  
**Discipline**: Zero shortcuts, proper validation, test-build-verify cycle

---

## 🎯 Objective

Convert **guides** (section-based) and **tutorials** (step-based) to **block-based atomic architecture** matching articles/case-studies pattern.

### Architectural Principle

```
┌─────────────────────────────────────────────────────┐
│          STRAPI CMS (Single Source of Truth)        │
│                                                     │
│  All Content Types → Block-Based Collections        │
│  Rich Text Editor → Markdown Blocks                 │
│  Atomic Architecture → Atoms/Molecules/Organisms    │
└─────────────────────────────────────────────────────┘
                           ↓
        ┌──────────────────┴──────────────────┐
        │                                     │
    Articles         Case Studies      Guides        Tutorials
    ✅ blocks        ✅ blocks         ✅ blocks     ✅ blocks
```

---

## 📋 Pre-Flight Checklist

### 1. Ensure Clean State

```powershell
# Verify no uncommitted changes
git status

# Commit or stash current work
git add .
git commit -m "Pre-Phase 10: Checkpoint before content block migration"

# Verify build passes
pnpm exec tsc --noEmit
pnpm run build
```

### 2. Review Current Structure

```powershell
# Check guides structure (should have "sections")
Get-Content "data/strapi-mock/dashboard/content-library/guides/deployment-guide.json" | Select-Object -First 30

# Check tutorials structure (should have "steps")
Get-Content "data/strapi-mock/dashboard/content-library/tutorials/getting-started/your-first-nextjs-app.json" | Select-Object -First 30
```

Expected:

- ❌ Guides have `sections` array
- ❌ Tutorials have `steps` array
- ⚠️ Both need conversion to `blocks` array

---

## 🚀 Execution Steps

### Step 1: Run Migration Script

```powershell
# Execute block migration
node scripts/phase10-migrate-content-blocks.js
```

**What happens:**

1. Creates timestamped backup in `backups/phase10-{timestamp}/`
2. Converts guide sections → blocks
3. Converts tutorial steps → blocks
4. Generates `phase10-migration-report.json`

**Expected Output:**

```
✓ Guides migrated: 3/3
✓ Tutorials migrated: 15/15
✓ Backups saved to: backups/phase10-xxxxx
✓ Report saved to: phase10-migration-report.json
```

---

### Step 2: Verify Migration

```powershell
# Run comprehensive validation
node scripts/phase10-verify-content-blocks.js
```

**Validation Checks:**

- ✅ Valid JSON structure
- ✅ Required fields (meta, layout, toc, blocks)
- ✅ Block atomic levels (atom/molecule/organism)
- ✅ Block types match article patterns
- ✅ Props properly structured
- ✅ TOC entries match section headers
- ✅ No orphaned sections/steps

**Expected Output:**

```
✓ ALL VALIDATIONS PASSED
Total files: 18
Passed: 18
Failed: 0
Warnings: 0
```

**If validation fails:**

```powershell
# Review detailed report
Get-Content phase10-verification-report.json

# Rollback if needed
node scripts/phase10-rollback-content-blocks.js
```

---

### Step 3: Update Schemas

Now that JSON files are block-based, update TypeScript schemas:

#### 3a. Update Guide Schema

**File**: `lib/strapi/dashboard/content-library/guides/guide-schema.ts`

**Change from:**

```typescript
export const guideSchema = z.object({
  // ... meta fields
  sections: z.array(guideSectionSchema), // ❌ OLD
});
```

**Change to:**

```typescript
import { articleBlockSchema } from "../articles/article-schema"; // ✅ Reuse

export const guideSchema = z.object({
  meta: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    level: z.enum(["intermediate", "advanced"]),
    category: z.enum(["security", "devops", "testing"]),
    readTime: z.string().min(1),
    publishedAt: z.string().min(1),
    tags: z.array(z.string()).min(1),
  }),
  layout: z.enum(["content-with-toc", "content-only"]),
  toc: z.array(tocItemSchema).optional(),
  blocks: z.array(articleBlockSchema).min(1), // ✅ NEW - Shared block schema
});
```

#### 3b. Update Tutorial Schema

**File**: `lib/strapi/dashboard/content-library/tutorials/tutorial-schema.ts`

**Change from:**

```typescript
export const tutorialContentDocumentSchema = z.object({
  meta: { ... },
  steps: z.array(tutorialStepSchema).min(1), // ❌ OLD
});
```

**Change to:**

```typescript
import { articleBlockSchema } from "../articles/article-schema"; // ✅ Reuse

export const tutorialContentDocumentSchema = z.object({
  meta: {
    slug: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().min(1), // Changed from 'description'
    level: z.enum(TUTORIAL_LEVELS),
    category: z.enum(TUTORIAL_CATEGORIES),
    readTime: z.string().min(1), // Changed from 'duration'
    publishedAt: z.string().min(1),
    tags: z.array(z.string()).min(1),
  },
  layout: z.enum(["content-with-toc", "content-only"]),
  toc: z.array(tocItemSchema).optional(),
  blocks: z.array(articleBlockSchema).min(1), // ✅ NEW - Shared block schema
});
```

---

### Step 4: Update Content Builders

Update content builders to work with new block structure:

#### 4a. Update Guide Content Builder

**File**: `lib/strapi/dashboard/content-library/guides/guide-content-builder.ts`

Create similar to tutorial-content-builder pattern:

- Import all guide JSON files
- Generate Guide list from metadata
- Validate against new schema
- Cache list on server startup

#### 4b. Tutorial Content Builder Already Exists

**File**: `lib/strapi/dashboard/content-library/tutorials/tutorial-content-builder.ts`

✅ Already follows pattern - just needs schema update

---

### Step 5: Type Check

```powershell
# Verify TypeScript compilation
pnpm exec tsc --noEmit
```

**Expected**: ✅ No errors

**If errors occur:**

- Review schema changes
- Check imports
- Verify block type definitions match

---

### Step 6: Build Verification

```powershell
# Full production build
pnpm run build
```

**Expected**: ✅ 160+ pages prerendered

**If build fails:**

- Review build errors
- Check for missing imports
- Verify JSON structure matches schemas

---

### Step 7: Runtime Testing

```powershell
# Start dev server
pnpm run dev
```

**Manual Tests:**

1. **Guides Page**: `/dashboard/content-library/guides`
   - ✅ Lists all guides
   - ✅ Can click into guide detail pages
   - ✅ Blocks render correctly

2. **Guide Detail**: `/dashboard/content-library/guides/{slug}`
   - ✅ TOC renders
   - ✅ Content blocks display
   - ✅ Code blocks have syntax highlighting
   - ✅ Info boxes styled correctly

3. **Tutorials Page**: `/dashboard/content-library/tutorials`
   - ✅ Lists all tutorials by level
   - ✅ Can filter by category
   - ✅ Step counts displayed

4. **Tutorial Detail**: `/dashboard/content-library/tutorials/{category}/{slug}`
   - ✅ TOC renders
   - ✅ Step blocks display in sequence
   - ✅ Code/hint/solution blocks render
   - ✅ Navigation works

---

### Step 8: Update Renderers

Ensure all content types use `ContentBlockRenderer`:

**Files to check:**

- `app/(dashboard)/dashboard/content-library/guides/[slug]/page.tsx`
- `app/(dashboard)/dashboard/content-library/tutorials/[category]/[slug]/page.tsx`

**Expected pattern:**

```typescript
import { ContentBlockRenderer } from "@/components/organisms/content-block-renderer";

// In page component
<ContentBlockRenderer blocks={content.blocks} />
```

---

## 🔄 Rollback Procedure

If critical issues occur:

```powershell
# Execute rollback
node scripts/phase10-rollback-content-blocks.js

# Verify rollback
pnpm exec tsc --noEmit
pnpm run build

# Review what was restored
Get-Content phase10-rollback-report.json
```

---

## ✅ Success Criteria

### JSON Structure

- ✅ All guides have `blocks` array (no `sections`)
- ✅ All tutorials have `blocks` array (no `steps`)
- ✅ Meta fields consistent across all content types
- ✅ TOC generated from block headers

### Schemas

- ✅ guide-schema.ts uses block validation
- ✅ tutorial-schema.ts uses block validation
- ✅ Both reuse article block schema definitions

### Build

- ✅ TypeScript: No errors
- ✅ Build: 160+ pages prerendered
- ✅ No runtime errors

### Architecture

- ✅ Single `ContentBlockRenderer` for ALL content
- ✅ Strapi mock JSON = single source of truth
- ✅ N-tier pattern maintained (DTO → Mapper → Repository)
- ✅ No architectural drift

---

## 📊 Monitoring & Validation

### Post-Migration Checks

```powershell
# 1. Content file counts
$guides = (Get-ChildItem "data/strapi-mock/dashboard/content-library/guides" -Filter "*.json" | Where-Object { $_.Name -ne "guides-list.json" }).Count
$tutorials = (Get-ChildItem "data/strapi-mock/dashboard/content-library/tutorials" -Recurse -Filter "*.json" | Where-Object { $_.Name -ne "tutorials-list.json" }).Count

Write-Host "Guides: $guides (expected: 3)"
Write-Host "Tutorials: $tutorials (expected: 15)"

# 2. Verify no old structure remnants
Select-String -Path "data/strapi-mock/dashboard/content-library/**/*.json" -Pattern '"sections"' -List
Select-String -Path "data/strapi-mock/dashboard/content-library/**/*.json" -Pattern '"steps"' -List

# Expected: No matches (if matches found, migration incomplete)

# 3. Verify block structure
$sampleGuide = Get-Content "data/strapi-mock/dashboard/content-library/guides/deployment-guide.json" | ConvertFrom-Json
Write-Host "Guide blocks count: $($sampleGuide.blocks.Count)"

$sampleTutorial = Get-Content "data/strapi-mock/dashboard/content-library/tutorials/getting-started/your-first-nextjs-app.json" | ConvertFrom-Json
Write-Host "Tutorial blocks count: $($sampleTutorial.blocks.Count)"
```

### Health Check Commands

```powershell
# Build health
pnpm run build 2>&1 | Select-String -Pattern "Error|Warning" -Context 2

# Type health
pnpm exec tsc --noEmit 2>&1 | Select-String -Pattern "error TS"

# Content health
node scripts/phase10-verify-content-blocks.js
```

---

## 🎓 Lessons Learned

### Why This Matters

1. **Architectural Consistency**: All content uses same atomic block system
2. **Maintainability**: Single renderer = single source of truth for rendering logic
3. **Strapi Alignment**: Matches real Strapi CMS block architecture patterns
4. **Type Safety**: Zod validation ensures data integrity at build time
5. **Developer Experience**: Clear patterns, no confusion about which renderer to use

### Anti-Patterns Avoided

❌ **Multiple renderers for similar content**  
✅ Single `ContentBlockRenderer` for all block-based content

❌ **Inconsistent data structures**  
✅ All content follows same meta/layout/toc/blocks pattern

❌ **Manual migrations without backups**  
✅ Automated scripts with timestamped backups

❌ **No validation**  
✅ Comprehensive verification before proceeding

---

## 📞 Support

If issues occur:

1. **Check reports**: `phase10-migration-report.json`, `phase10-verification-report.json`
2. **Review backups**: `backups/phase10-{timestamp}/`
3. **Rollback if needed**: `node scripts/phase10-rollback-content-blocks.js`
4. **Re-run migration**: Fix issues → re-run migration script

---

## 🎯 Next Phase

After successful migration:

1. ✅ Complete data/content-library cleanup (delete legacy files)
2. ✅ Update admin pages to use repositories
3. ✅ Implement N-tier DTO/Mapper architecture
4. ✅ Create features layer
5. ✅ Implement error boundaries

---

**Remember**: Senior architect discipline = proper planning, automated scripts, comprehensive validation, and safe rollback procedures. No shortcuts.
