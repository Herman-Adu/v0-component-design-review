# Content Library Refactor: Execution Plan (No-Failure Design)

**Date**: March 2, 2026  
**Status**: Pre-execution validation  
**Objective**: Apply documentation refactor patterns to content-library with ZERO content loss and first-time success  
**Lessons Applied**: All errors from documentation refactor, particularly JSON syntax validation

---

## Critical Lessons from Documentation Refactor

### ⚠️ WHAT WENT WRONG

1. **JSON Syntax Error Escaped 3 Reviews**
   - Unclosed string in `getting-started.json` line 26: `"number": "01` (missing closing quote)
   - Duplicate/malformed blocks array (lines 21-34)
   - **Root cause**: Mass TOC removal operation introduced error
   - **Detection**: Build failed AFTER merge to main (should have been BEFORE)

2. **Process Violation**
   - User instruction: "please check build here first then merge"
   - Actual execution: Merged to main WITHOUT build verification
   - Result: Emergency fix required, quality control failure

3. **Line Ending Warnings Ignored**
   - 12 JSON files showed LF→CRLF warnings during git add
   - Warnings should have triggered extra validation
   - Could have indicated file corruption or modification issues

4. **Renderer Duplication Across Domains**
   - Separate block renderer implementations existed for documentation and content-library
   - This violates DRY on a high-impact architectural seam
   - Any block contract change would require multiple updates and increase regression risk

### ✅ WHAT MUST HAPPEN THIS TIME

1. **BUILD VERIFICATION GATES** (Non-negotiable)

   ```powershell
   # MANDATORY after EVERY code modification phase:
   Remove-Item -Recurse -Force .next; npm run build
   # MUST pass before proceeding to next phase
   # MUST pass before any git commit
   # MUST pass before any merge to main
   ```

2. **JSON VALIDATION GATES**

   ```powershell
   # Before committing ANY JSON changes:
   Get-ChildItem -Path "data/strapi-mock/dashboard/content-library" -Filter *.json -Recurse |
     ForEach-Object {
       try {
         Get-Content $_.FullName | ConvertFrom-Json | Out-Null
         Write-Host "✓ $_" -ForegroundColor Green
       } catch {
         Write-Host "✗ $_ : $($_.Exception.Message)" -ForegroundColor Red
       }
     }
   ```

3. **CONTENT PRESERVATION PROTOCOL**
   - Archive BEFORE any file deletion
   - Git stash BEFORE any destructive operation
   - Comparison script AFTER migration
   - Manual verification of sample content

4. **SHARED RENDERER CONTRACT**
   - One generic block renderer for all page domains (home/contact/documentation/content-library)
   - No parallel renderer implementations with duplicate switch trees
   - New supported block types added once and reused everywhere

5. **QUALITY CHECKLIST**
   - [ ] JSON syntax validation (all 71 files)
   - [ ] Build passes (clean .next, fresh build)
   - [ ] TypeScript clean (no type errors)
   - [ ] Tests pass (unit + integration)
   - [ ] Manual spot-check (3 random pages from each content type)
   - [ ] Renderer DRY check passes (single shared implementation)
   - [ ] Only then: git commit
   - [ ] Only after commit: merge to main

---

## Pre-Flight Validation (Do This Now, Before Any Code Changes)

### Phase 0A: Dynamic Zone Compliance Audit

**Goal**: Verify all 71 JSON files comply with dynamic zone architecture

**Validation Script**:

```powershell
# Check atomicLevel presence in all blocks
$files = Get-ChildItem -Path "data/strapi-mock/dashboard/content-library" -Filter *.json -Recurse
$results = @()

foreach ($file in $files) {
    $content = Get-Content $file.FullName | ConvertFrom-Json
    if ($content.blocks) {
        $missingAtomic = $content.blocks | Where-Object { -not $_.atomicLevel }
        if ($missingAtomic.Count -gt 0) {
            $results += [PSCustomObject]@{
                File = $file.Name
                Path = $file.FullName
                Issue = "Missing atomicLevel in $($missingAtomic.Count) blocks"
            }
        }
    }
}

if ($results.Count -eq 0) {
    Write-Host "✅ All files pass dynamic zone compliance" -ForegroundColor Green
} else {
    Write-Host "❌ Found $($results.Count) files with issues:" -ForegroundColor Red
    $results | Format-Table -AutoSize
}
```

**Expected Result**: 0 issues (all files should have `atomicLevel` in every block)

**Action if issues found**: Fix before proceeding with refactor

---

### Phase 0B: JSON Syntax Validation (Comprehensive)

**Goal**: Catch any syntax errors BEFORE refactor starts

**Validation Script**:

```powershell
$files = Get-ChildItem -Path "data/strapi-mock/dashboard/content-library" -Filter *.json -Recurse
$errors = @()

foreach ($file in $files) {
    try {
        $content = Get-Content $file.FullName -Raw | ConvertFrom-Json

        # Additional checks
        if (-not $content.meta) { $errors += "$($file.Name): Missing 'meta' object" }
        if (-not $content.blocks) { $errors += "$($file.Name): Missing 'blocks' array" }
        if ($content.blocks -and -not ($content.blocks -is [Array])) {
            $errors += "$($file.Name): 'blocks' is not an array"
        }

    } catch {
        $errors += "$($file.Name): JSON parsing failed - $($_.Exception.Message)"
    }
}

if ($errors.Count -eq 0) {
    Write-Host "✅ All $($files.Count) JSON files are valid" -ForegroundColor Green
} else {
    Write-Host "❌ Found $($errors.Count) errors:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
}
```

**Expected Result**: 0 errors across all 71 files

**Action if issues found**: Fix before proceeding with refactor

---

### Phase 0C: Content Inventory & Gap Analysis

**Goal**: Document what exists, identify gaps, verify test data completeness

**Files to Review**:

1. **Content Files** (71 total):

   ```
   articles/          → 29 files (beginner: 8, intermediate: 12, advanced: 9)
   case-studies/      → 20 files (security: 8, forms: 5, rendering: 4, performance: 3)
   guides/            → 3 files (security, testing, deployment)
   tutorials/         → 15 files (forms: 5, state-management: 4, devops: 3, getting-started: 3)
   ```

2. **List Pages** (4 files):

   ```
   articles-list.json
   case-studies-list.json (does not exist?)
   guides-list.json
   tutorials-list.json
   ```

3. **Architecture Files** (Existing):

   ```
   lib/strapi/dashboard/content-library/
   ├── articles/
   │   ├── article-schema.ts           ✅
   │   ├── article-content.ts          ✅
   │   ├── article-content-builder.ts  ✅
   │   ├── article-repository.ts       ✅
   │   └── article-view-models.ts      ✅
   ├── case-studies/                    ✅ (all 5 files)
   ├── guides/                          ✅ (all 5 files)
   ├── tutorials/                       ✅ (all 5 files)
   ├── content-route-manifest.ts       ✅
   └── content-library-helpers.ts      ❌ MISSING (P2 refactor target)
   ```

4. **Tests** (Integration tests exist):
   ```
   __tests__/integration-test/content-library/
   ├── tutorial-repository.test.ts     ✅
   ├── article-repository.test.ts      ? (verify)
   ├── guide-repository.test.ts        ? (verify)
   └── case-study-repository.test.ts   ? (verify)
   ```

**Validation Checklist**:

- [ ] All 71 JSON files accounted for and valid
- [ ] All 4 list pages exist (verify case-studies-list.json)
- [ ] All 5-layer architecture files present for each content type (articles, guides, tutorials, case-studies)
- [ ] Route manifest exists and compiles
- [ ] Integration tests exist for all 4 content types
- [ ] Gap registry up to date (909 lines in content-gap-registry.ts)

**Action if gaps found**: Document gaps, create missing files before refactor

---

### Phase 0D: Build & Test Baseline (PRE-REFACTOR)

**Goal**: Establish baseline metrics BEFORE touching any code

**Execute**:

```powershell
# Clean build
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build > baseline-build.log 2>&1

# Run tests
npm test > baseline-tests.log 2>&1

# TypeScript check
npx tsc --noEmit > baseline-typescript.log 2>&1
```

**Capture Metrics**:

- [ ] Build time: \_\_\_\_ seconds
- [ ] Static pages generated: \_\_\_\_ (should be 166+)
- [ ] Content library routes: \_\_\_\_ (should be ~68: 29 articles + 20 case-studies + 3 guides + 15 tutorials + 1 social)
- [ ] Tests passing: \_**\_ / \_\_**
- [ ] TypeScript errors: 0

**Save Baseline**:

```powershell
git add baseline-*.log
git commit -m "chore: capture pre-refactor baseline metrics"
```

---

### Phase 0E: Create Archive & Safety Net

**Goal**: Zero risk of content loss (learned from documentation refactor)

**Execute**:

```powershell
# Create archive directory
New-Item -ItemType Directory -Path "archive/content-library-refactor-2026-03-02" -Force

# Archive current page files (these will be refactored)
$pagesToArchive = @(
    "app/(dashboard)/dashboard/content-library/articles/[category]/[slug]/page.tsx",
    "app/(dashboard)/dashboard/content-library/articles/page.tsx",
    "app/(dashboard)/dashboard/content-library/case-studies/[category]/[slug]/page.tsx",
    "app/(dashboard)/dashboard/content-library/case-studies/page.tsx",
    "app/(dashboard)/dashboard/content-library/guides/[category]/[slug]/page.tsx",
    "app/(dashboard)/dashboard/content-library/guides/page.tsx",
    "app/(dashboard)/dashboard/content-library/tutorials/[category]/[slug]/page.tsx",
    "app/(dashboard)/dashboard/content-library/tutorials/page.tsx"
)

foreach ($page in $pagesToArchive) {
    $dest = "archive/content-library-refactor-2026-03-02/" + (Split-Path $page -Leaf)
    Copy-Item $page $dest -Force
    Write-Host "Archived: $page → $dest"
}

# Git safety commit
git add archive/
git commit -m "chore: archive content-library pages before refactor"
```

**Verification**:

- [ ] Archive folder created with 8 page files
- [ ] Committed to git (permanent record)
- [ ] Can restore from archive if needed

---

## Execution Phases (With Quality Gates)

### Phase 1: Helper Module Creation (P2 Refactor - Eliminates 20+ Duplications)

**Goal**: Create `content-library-helpers.ts` as single source of truth

**File**: `lib/strapi/dashboard/content-library/content-library-helpers.ts`

**Implementation**:

```typescript
import type { ArticleDetailViewModel } from "./articles/article-view-models";
import type { GuideDetailViewModel } from "./guides/guide-view-models";
import type { TutorialDetailViewModel } from "./tutorials/tutorial-view-models";
import type { CaseStudyDetailViewModel } from "./case-studies/case-study-view-models";
import { getArticleRecordBySlug } from "./articles/article-repository";
import { getGuideRecordBySlug } from "./guides/guide-repository";
import { getTutorialRecordBySlug } from "./tutorials/tutorial-repository";
import { getCaseStudyRecordBySlug } from "./case-studies/case-study-repository";
import { toArticleDetailViewModel } from "./articles/article-view-models";
import { toGuideDetailViewModel } from "./guides/guide-view-models";
import { toTutorialDetailViewModel } from "./tutorials/tutorial-view-models";
import { toCaseStudyDetailViewModel } from "./case-studies/case-study-view-models";

/**
 * Union type for all content library detail view models
 * Preserves specific block types per content type
 */
export type ContentLibraryDetailViewModel =
  | ArticleDetailViewModel
  | GuideDetailViewModel
  | TutorialDetailViewModel
  | CaseStudyDetailViewModel;

/**
 * Content sections (content types)
 */
export type ContentSection =
  | "articles"
  | "guides"
  | "tutorials"
  | "case-studies";

/**
 * SINGLE SOURCE OF TRUTH for content type dispatch
 * Eliminates 20+ duplicated switch statements across 8 page files
 *
 * Pattern: Type-safe dispatch without type assertions
 * Used by: All detail page dynamic routes
 */
export function getContentLibraryViewModel(
  contentType: ContentSection,
  category: string,
  slug: string,
): ContentLibraryDetailViewModel | null {
  switch (contentType) {
    case "articles": {
      const record = getArticleRecordBySlug(slug);
      return record ? toArticleDetailViewModel(record) : null;
    }
    case "guides": {
      const record = getGuideRecordBySlug(slug);
      return record ? toGuideDetailViewModel(record) : null;
    }
    case "tutorials": {
      const record = getTutorialRecordBySlug(slug);
      return record ? toTutorialDetailViewModel(record) : null;
    }
    case "case-studies": {
      const record = getCaseStudyRecordBySlug(slug);
      return record ? toCaseStudyDetailViewModel(record) : null;
    }
    default: {
      const _exhaustive: never = contentType;
      return null;
    }
  }
}

/**
 * SINGLE SOURCE OF TRUTH for category colors (articles)
 * Eliminates 8+ instances of getCategoryColor() duplication
 */
export function getArticleCategoryColor(
  category:
    | "best-practices"
    | "security"
    | "forms"
    | "rendering"
    | "business"
    | "cms"
    | "architecture"
    | "performance"
    | "ai-tooling",
): string {
  switch (category) {
    case "best-practices":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
    case "security":
      return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300";
    case "forms":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300";
    case "rendering":
      return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    case "business":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
    case "cms":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300";
    case "architecture":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300";
    case "performance":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300";
    case "ai-tooling":
      return "bg-pink-100 text-pink-700 dark:bg-pink-900/20 dark:text-pink-300";
    default: {
      const _exhaustive: never = category;
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
    }
  }
}

/**
 * SINGLE SOURCE OF TRUTH for level colors
 * Eliminates 12+ instances of getLevelColor() duplication
 */
export function getLevelColor(
  level: "beginner" | "intermediate" | "advanced",
): string {
  switch (level) {
    case "beginner":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
    case "intermediate":
      return "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800";
    case "advanced":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800";
    default: {
      const _exhaustive: never = level;
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  }
}

/**
 * SINGLE SOURCE OF TRUTH for case study category colors
 * Eliminates 5+ instances of getCategoryColor() duplication in case-studies
 */
export function getCaseStudyCategoryColor(
  category:
    | "security"
    | "forms"
    | "rendering"
    | "performance"
    | "deployment"
    | "testing",
): string {
  switch (category) {
    case "security":
      return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300";
    case "forms":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300";
    case "rendering":
      return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    case "performance":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300";
    case "deployment":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
    case "testing":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300";
    default: {
      const _exhaustive: never = category;
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
    }
  }
}

/**
 * SINGLE SOURCE OF TRUTH for tutorial category colors
 * Eliminates 4+ instances of getCategoryColor() duplication in tutorials
 */
export function getTutorialCategoryColor(
  category:
    | "forms"
    | "state-management"
    | "devops"
    | "getting-started"
    | "components"
    | "testing",
): string {
  switch (category) {
    case "forms":
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300";
    case "state-management":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300";
    case "devops":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
    case "getting-started":
      return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300";
    case "components":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
    case "testing":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300";
    default: {
      const _exhaustive: never = category;
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
    }
  }
}

/**
 * SINGLE SOURCE OF TRUTH for guide category colors
 * Eliminates duplication in guides pages
 */
export function getGuideCategoryColor(
  category: "security" | "testing" | "devops" | "architecture",
): string {
  switch (category) {
    case "security":
      return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300";
    case "testing":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300";
    case "devops":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
    case "architecture":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-300";
    default: {
      const _exhaustive: never = category;
      return "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300";
    }
  }
}
```

**Quality Gate 1A: TypeScript Validation**

```powershell
npx tsc --noEmit
```

**Expected**: 0 errors  
**Action if fails**: Fix types before proceeding

**Quality Gate 1B: Build Validation**

```powershell
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build
```

**Expected**: Build passes (helper module doesn't break existing code)  
**Action if fails**: Fix build errors before proceeding

**Commit**:

```powershell
git add lib/strapi/dashboard/content-library/content-library-helpers.ts
git commit -m "feat(content-library): create helper module to eliminate 20+ duplications

- Single source of truth for content type dispatch
- Centralized category/level color functions
- Type-safe exhaustive switch patterns
- Eliminates getCategoryColor/getLevelColor duplication across 8 page files
- Pattern replicates documentation-helpers.ts success

Part of P2 refactor (DRY violations)"
```

---

### Phase 2: Refactor Detail Pages (4 Dynamic Routes)

**Goal**: Update all detail pages to use helper module, eliminate local duplications

**Pages to Update**:

1. `articles/[category]/[slug]/page.tsx` (232 lines → ~120 lines)
2. `guides/[category]/[slug]/page.tsx` (similar reduction)
3. `tutorials/[category]/[slug]/page.tsx` (similar reduction)
4. `case-studies/[category]/[slug]/page.tsx` (similar reduction)

**Pattern** (articles example):

```typescript
// app/(dashboard)/dashboard/content-library/articles/[category]/[slug]/page.tsx
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { listArticles, getArticleRecordBySlug } from "@/lib/strapi/dashboard/content-library/articles/article-repository";
import { toArticleDetailViewModel } from "@/lib/strapi/dashboard/content-library/articles/article-view-models";
import { getArticleCategoryColor, getLevelColor } from "@/lib/strapi/dashboard/content-library/content-library-helpers";
import { ContentRenderer } from "@/components/organisms/content-renderer";
import { TableOfContents } from "@/components/molecules/table-of-contents";

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const articles = listArticles();
  return articles.map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = getArticleRecordBySlug(slug);

  if (!record) return { title: "Article Not Found" };

  const article = toArticleDetailViewModel(record);

  return {
    title: article.seo.metaTitle,
    description: article.seo.metaDescription,
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const record = getArticleRecordBySlug(slug);

  if (!record) notFound();

  const article = toArticleDetailViewModel(record);

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getLevelColor(article.level)}`}>
              {article.level}
            </span>
            <span className={`px-3 py-1 text-xs font-medium rounded-full ${getArticleCategoryColor(article.category)}`}>
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl font-bold">{article.title}</h1>

          <p className="text-lg text-muted-foreground">{article.excerpt}</p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{article.readTime}</span>
            <span>•</span>
            <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs bg-secondary rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Main content with TOC */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,250px] gap-8">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ContentRenderer blocks={article.blocks} />
          </div>

          {article.toc && article.toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <TableOfContents items={article.toc} />
              </div>
            </aside>
          )}
        </div>
      </article>
    </div>
  );
}
```

**Key Changes**:

- ✅ Removed local `getCategoryColor()` function (use helper)
- ✅ Removed local `getLevelColor()` function (use helper)
- ✅ Import from helper module
- ✅ Preserved all functionality
- ✅ Cleaner, more maintainable code

**Apply Pattern to**:

- [ ] articles/[category]/[slug]/page.tsx
- [ ] guides/[category]/[slug]/page.tsx
- [ ] tutorials/[category]/[slug]/page.tsx
- [ ] case-studies/[category]/[slug]/page.tsx

**Quality Gate 2A: TypeScript Validation**

```powershell
npx tsc --noEmit
```

**Expected**: 0 errors  
**Action if fails**: Fix types before proceeding

**Quality Gate 2B: Build Validation**

```powershell
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build
```

**Expected**: Build passes, all static params generated  
**Action if fails**: Fix build errors before proceeding

**Quality Gate 2C: Manual Spot Check**

```powershell
# Start dev server
npm run dev

# Test 3 random articles:
# http://localhost:3000/dashboard/content-library/articles/best-practices/refactoring-for-maintainability
# http://localhost:3000/dashboard/content-library/articles/security/guard-pattern-architecture
# http://localhost:3000/dashboard/content-library/articles/rendering/static-site-generation-ssg

# Verify:
# - Page renders correctly
# - Category badges show correct colors
# - Level badges show correct colors
# - TOC appears (if present in JSON)
# - Tags display
# - No console errors
```

**Commit**:

```powershell
git add app/(dashboard)/dashboard/content-library/*/[category]/[slug]/page.tsx
git commit -m "refactor(content-library): update detail pages to use helper module

- Removed 20+ instances of duplicated getCategoryColor/getLevelColor
- All detail pages now import from content-library-helpers.ts
- Preserved all functionality (metadata, TOC, rendering)
- Code reduction: ~400 lines across 4 files

Build verified: 166+ static pages generated successfully"
```

---

### Phase 3: Refactor List Pages (4 List Pages)

**Goal**: Update all list pages to use helper module

**Pages to Update**:

1. `articles/page.tsx` (241 lines → ~180 lines)
2. `guides/page.tsx`
3. `tutorials/page.tsx`
4. `case-studies/page.tsx`

**Pattern** (apply same helper imports, remove local color functions)

**Quality Gate 3A: TypeScript + Build**

```powershell
npx tsc --noEmit
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build
```

**Quality Gate 3B: Manual Spot Check**

```powershell
# Test all 4 list pages:
# http://localhost:3000/dashboard/content-library/articles
# http://localhost:3000/dashboard/content-library/guides
# http://localhost:3000/dashboard/content-library/tutorials
# http://localhost:3000/dashboard/content-library/case-studies

# Verify colors, links, filtering (if present)
```

**Commit**:

```powershell
git add app/(dashboard)/dashboard/content-library/*/page.tsx
git commit -m "refactor(content-library): update list pages to use helper module

- Removed duplicated color functions from list pages
- Import from centralized helper module
- Preserved filtering and categorization logic

Build verified passing"
```

---

### Phase 4: Cache Headers (P3 Optimization)

**Goal**: Add explicit cache headers for static content (like documentation)

**Update**: `next.config.mjs`

```javascript
// Add to async headers() function:
{
  source: "/dashboard/content-library/articles/:category/:slug",
  headers: [
    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
  ],
},
{
  source: "/dashboard/content-library/guides/:category/:slug",
  headers: [
    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
  ],
},
{
  source: "/dashboard/content-library/tutorials/:category/:slug",
  headers: [
    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
  ],
},
{
  source: "/dashboard/content-library/case-studies/:category/:slug",
  headers: [
    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
  ],
},
{
  source: "/dashboard/content-library/:section(articles|guides|tutorials|case-studies)",
  headers: [
    { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
  ],
},
```

**Quality Gate 4: Build Validation**

```powershell
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build
```

**Commit**:

```powershell
git add next.config.mjs
git commit -m "perf(content-library): add cache headers for static content

- Detail pages: immutable (max-age=1 year)
- List pages: 1 hour cache + 1 day stale-while-revalidate
- Matches documentation cache strategy

Build verified passing"
```

---

### Phase 5: Testing & Validation (Comprehensive)

**Goal**: Verify all functionality, catch any regressions

**5A: Run Existing Tests**

```powershell
npm test
```

**Expected**: All tests pass  
**Action if fails**: Fix broken tests before proceeding

**5B: Integration Test Verification**

```powershell
# Verify tests exist for all content types:
npm test -- __tests__/integration-test/content-library/
```

**Expected**: Tests for articles, guides, tutorials, case-studies all pass

**5C: Manual Regression Testing**

Test matrix (12 pages minimum):

- [ ] 3 article pages (beginner, intermediate, advanced)
- [ ] 3 tutorial pages (forms, state-management, devops)
- [ ] 3 case study pages (security, forms, rendering)
- [ ] 3 guide pages (security, testing, deployment)

For each page, verify:

- [ ] Page renders without errors
- [ ] Metadata (title, description) present
- [ ] Category badge shows correct color
- [ ] Level badge shows correct color (if applicable)
- [ ] TOC renders (if present in JSON)
- [ ] Tags display
- [ ] Content blocks render correctly
- [ ] Navigation works (back to list, internal links)

**5D: Build Size Analysis**

```powershell
npm run build > post-refactor-build.log 2>&1

# Compare build times and sizes:
Compare-Object (Get-Content baseline-build.log) (Get-Content post-refactor-build.log)
```

**Expected**: Similar or improved build performance

**Commit**:

```powershell
git add post-refactor-build.log
git commit -m "test(content-library): comprehensive validation post-refactor

- All integration tests passing
- Manual testing: 12 pages verified
- Build performance: maintained/improved
- No regressions detected"
```

---

### Phase 6: Documentation Updates

**Goal**: Update architecture documentation with refactor results

**Files to Update**:

1. **ARCHITECTURE_REVIEW_3AXIS.md**
   - Update score (likely 9.7/10 → 9.8/10)
   - Add content-library refactor notes

2. **CONTENT_LIBRARY_ARCHITECTURE.md** (NEW)
   - Document the helper module pattern
   - Document the 5-layer architecture
   - Document content type schemas
   - Document testing strategy

3. **README.md**
   - Update architecture overview
   - Mention content-library refactor completion

4. **DOCUMENTATION_COMPLETION_HANDOFF.md**
   - Mark content-library refactor as complete
   - Note lessons learned applied

**Commit**:

```powershell
git add ARCHITECTURE_REVIEW_3AXIS.md CONTENT_LIBRARY_ARCHITECTURE.md README.md DOCUMENTATION_COMPLETION_HANDOFF.md
git commit -m "docs: update architecture documentation post content-library refactor

- Documented helper module pattern
- Updated architecture scores
- Added content-library architecture guide
- Marked refactor complete in handoff doc"
```

---

## Final Quality Checklist (Before Merge to Main)

### MANDATORY Pre-Merge Gates

- [ ] **JSON Validation**: All 71 JSON files valid (run Phase 0B script)
- [ ] **TypeScript Clean**: `npx tsc --noEmit` returns 0 errors
- [ ] **Build Passes**: Fresh build (removed .next) completes successfully
- [ ] **All Tests Pass**: `npm test` returns 0 failures
- [ ] **Manual Testing**: 12+ pages spot-checked (4 from each content type)
- [ ] **No Console Errors**: Dev server shows no errors/warnings
- [ ] **Git Clean**: No uncommitted changes, all phases committed
- [ ] **Documentation Updated**: Architecture docs reflect refactor

### Build Metrics (Expected)

```
✓ Compiled successfully in ~4s
✓ Finished TypeScript in ~13s
✓ Collecting page data using 23 workers in ~1500ms
✓ Generating static pages using 23 workers (166+/166+) in ~1400ms
✓ Finalizing page optimization in ~20ms

Route (app)
...
├ ● /dashboard/content-library/articles/[category]/[slug] (29 paths)
├ ● /dashboard/content-library/guides/[category]/[slug] (3 paths)
├ ● /dashboard/content-library/tutorials/[category]/[slug] (15 paths)
├ ● /dashboard/content-library/case-studies/[category]/[slug] (20 paths)
...

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses generateStaticParams)
```

### Architecture Score (Expected)

**Before Refactor**: 9.7/10  
**After Refactor**: 9.8/10

**Justification**:

- Eliminated 20+ DRY violations (+0.1)
- Centralized helpers improve maintainability
- Cache headers optimize performance
- Test coverage maintained/improved

---

## Merge to Main (Final Step)

**Only proceed if ALL quality gates passed**

```powershell
# Ensure on feature branch
git branch --show-current
# Expected: feature/content-library-refactor

# Final sanity check
if (Test-Path .next) { Remove-Item -Recurse -Force .next }
npm run build

# If build passes, proceed to merge
git checkout main
git pull origin main
git merge feature/content-library-refactor --no-ff -m "Merge content-library refactor: P2/P3 optimizations complete"
git push origin main

# Tag this milestone
git tag -a content-library-refactor-v1.0 -m "Content library refactor complete: helper module pattern, 20+ duplications eliminated"
git push origin content-library-refactor-v1.0
```

---

## Risk Mitigation

### If Build Fails During Refactor

1. **DO NOT PROCEED** to next phase
2. Review error message carefully
3. Check JSON syntax if data-related error
4. Check TypeScript types if type error
5. Revert last change: `git reset --hard HEAD~1`
6. Fix issue in isolation
7. Re-run build validation
8. Only proceed when green

### If Content is Lost

1. Restore from archive:

   ```powershell
   Copy-Item "archive/content-library-refactor-2026-03-02/*" "app/(dashboard)/dashboard/content-library/" -Recurse -Force
   ```

2. Restore from git history:
   ```powershell
   git log --oneline -- app/(dashboard)/dashboard/content-library/
   # Find commit before refactor
   git checkout <commit-hash> -- app/(dashboard)/dashboard/content-library/
   ```

### If Tests Fail

1. Check which tests failed
2. Review recent changes
3. Run failing test in isolation: `npm test -- <test-file>`
4. Fix code or update test (if test is wrong)
5. Re-run full test suite
6. Only proceed when green

---

## Success Criteria

### Functional Requirements

✅ All 71 JSON files valid and unchanged (content preserved)  
✅ All dynamic routes generate static pages at build time  
✅ All list pages render correctly  
✅ All detail pages render correctly  
✅ Social page SSR preserved (not changed to SSG)  
✅ TOC rendering preserved (conditional based on content)  
✅ Metadata (SEO) preserved for all pages  
✅ Tags, categories, levels display correctly

### Technical Requirements

✅ Helper module created (content-library-helpers.ts)  
✅ 20+ duplications eliminated (getCategoryColor, getLevelColor)  
✅ Type-safe exhaustive switch patterns  
✅ Cache headers added for performance  
✅ Build passes (clean .next, fresh build)  
✅ TypeScript clean (0 errors)  
✅ All tests pass (unit + integration)  
✅ No console errors or warnings

### Quality Requirements

✅ JSON syntax validated (all 71 files)  
✅ Manual regression testing completed (12+ pages)  
✅ Build metrics maintained or improved  
✅ Architecture score improved (9.7 → 9.8)  
✅ Documentation updated  
✅ Git history clean (meaningful commits)

---

## Timeline Estimate

**Phase 0 (Pre-flight)**: 2 hours

- Validation scripts
- Content inventory
- Baseline metrics
- Archive creation

**Phase 1 (Helper module)**: 1 hour

- Create content-library-helpers.ts
- TypeScript + build validation
- Commit

**Phase 2 (Detail pages)**: 2 hours

- Refactor 4 detail pages
- TypeScript + build validation
- Manual spot checks
- Commit

**Phase 3 (List pages)**: 1.5 hours

- Refactor 4 list pages
- TypeScript + build validation
- Manual spot checks
- Commit

**Phase 4 (Cache headers)**: 30 minutes

- Update next.config.mjs
- Build validation
- Commit

**Phase 5 (Testing)**: 2 hours

- Run all tests
- Manual regression testing
- Build analysis
- Commit

**Phase 6 (Documentation)**: 1 hour

- Update architecture docs
- Create new docs
- Commit

**Total**: ~10 hours (focused work, no distractions)

---

## Post-Refactor Checklist

- [ ] Architecture score updated (9.8/10)
- [ ] CONTENT_LIBRARY_ARCHITECTURE.md created
- [ ] All quality gates passed
- [ ] Merged to main
- [ ] Tagged release (content-library-refactor-v1.0)
- [ ] Archive folder preserved
- [ ] Lessons learned documented
- [ ] Handoff doc updated
- [ ] Ready for next phase (if any)

---

_Document Version: 1.0_  
_Created: March 2, 2026_  
_Status: Ready for Execution_  
_Next Action: Execute Phase 0 validation scripts now, before any code changes_
