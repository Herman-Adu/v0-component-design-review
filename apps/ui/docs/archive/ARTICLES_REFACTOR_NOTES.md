# Articles Section Refactor - Specific Implementation Notes

## Overview

Refactor articles section to match tutorials pattern. Currently articles.ts imports from legacy `@/data/content-library/articles`.

## Files to Create

### 1. lib/strapi/dashboard/content-library/articles/article-content-builder.ts (NEW)

**Purpose:** Central builder that validates all article JSON files and generates typed list

**Structure:**

```typescript
import "server-only";
import { articleContentDocumentSchema } from "./article-schema";

// Import all article JSON files (see list below)
import accessibilityArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/building-accessible-web-applications.json";
// ... 29 more imports

// Type exports (move from article-content.ts)
export type ArticleLevel = "beginner" | "intermediate" | "advanced";
export type ArticleCategory = "architecture" | "security" | "forms" | "performance" | "best-practices" | "rendering" | "business" | "accessibility" | "testing" | "devops" | "ai-tooling";
export type ArticleBlockType = /* existing type */;
export type ArticleBlockLevel = "atom" | "molecule" | "organism";
export interface ArticleContentBlock { /* existing interface */ }
export interface ArticleContentMeta { /* from meta object */ }
export interface ArticleContentDocument { /* existing interface */ }
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: ArticleLevel;
  category: ArticleCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
  // All fields needed for list display
}

// Registry
const articleContentRegistry: Record<string, ArticleContentDocument> = {
  "building-accessible-web-applications": accessibilityArticle as ArticleContentDocument,
  "refactoring-for-maintainability": refactoringArticle as ArticleContentDocument,
  // ... 28 more entries
};

// Validation at startup
const validatedArticleContentRegistry = Object.fromEntries(
  Object.entries(articleContentRegistry).map(([slug, document]) => {
    const result = articleContentDocumentSchema.safeParse(document);
    if (!result.success) {
      const issues = result.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join(" | ");
      throw new Error(`Invalid article content for "${slug}": ${issues}`);
    }
    return [slug, result.data as ArticleContentDocument];
  }),
) as Record<string, ArticleContentDocument>;

// List generation
function generateArticleList(): Article[] {
  return Object.entries(validatedArticleContentRegistry)
    .map(([slug, document], index) => ({
      id: String(index + 1),
      slug: document.meta.slug,
      title: document.meta.title,
      excerpt: document.meta.excerpt,
      level: document.meta.level,
      category: document.meta.category,
      readTime: document.meta.readTime,
      publishedAt: document.meta.publishedAt,
      tags: document.meta.tags,
    }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Caching
let cachedArticleList: Article[] | null = null;

export function getArticleList(): Article[] {
  if (!cachedArticleList) {
    cachedArticleList = generateArticleList();
  }
  return cachedArticleList;
}

export function getArticleContentDocument(slug: string): ArticleContentDocument | null {
  return validatedArticleContentRegistry[slug] ?? null;
}

export function getAllArticleContentSlugs(): string[] {
  return Object.keys(validatedArticleContentRegistry);
}
```

**JSON Files to Import (30 total):**

```typescript
// best-practices/ (4 files)
import accessibilityArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/building-accessible-web-applications.json";
import refactoringArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/refactoring-for-maintainability.json";
import documentationArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/documentation-as-architecture.json";
import guardPatternArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/guard-pattern-architecture.json";
import threeAxisReviewArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/three-axis-quality-review-system.json";

// architecture/ (6 files)
import atomicDesignArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/atomic-design-principles.json";
import planningArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/planning-full-stack-application.json";
import emailSystemArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/email-system-architecture.json";
import hydrationArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/why-react-hydration-breaks.json";
import hydrationMismatchesArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/hydration-mismatches-use-client-layouts.json";
import serverClientBoundariesArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/server-client-boundaries.json";
import serviceRequestLifecycleArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/service-request-lifecycle.json";
import managingContentStrapiArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/managing-content-in-strapi.json";
import duplicateProvidersArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/duplicate-providers-architectural-cost.json";

// forms/ (3 files)
import zodValidationArticle from "@/data/strapi-mock/dashboard/content-library/articles/forms/typescript-zod-validation.json";
import multiStepFormArticle from "@/data/strapi-mock/dashboard/content-library/articles/forms/multi-step-form-architecture.json";
import zustandArticle from "@/data/strapi-mock/dashboard/content-library/articles/forms/zustand-form-state-management.json";

// security/ (2 files)
import securityArticle from "@/data/strapi-mock/dashboard/content-library/articles/security/security-architecture-deep-dive.json";
import serverActionsArticle from "@/data/strapi-mock/dashboard/content-library/articles/security/server-actions-deep-dive.json";

// business/ (2 files)
import roiArticle from "@/data/strapi-mock/dashboard/content-library/articles/business/roi-modern-web-architecture.json";
import techStackArticle from "@/data/strapi-mock/dashboard/content-library/articles/business/tech-stack-decision-framework.json";

// testing/ (1 file)
import testingArticle from "@/data/strapi-mock/dashboard/content-library/articles/testing/testing-strategy-modern-applications.json";

// devops/ (1 file)
import cicdArticle from "@/data/strapi-mock/dashboard/content-library/articles/devops/cicd-deployment-pipelines.json";

// rendering/ (4 files)
import ssgArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/static-site-generation-ssg.json";
import ssrArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/server-side-rendering-ssr.json";
import isrArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/incremental-static-regeneration-isr.json";
import pprArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/partial-prerendering-ppr.json";

// performance/ (1 file)
import performanceBudgetsArticle from "@/data/strapi-mock/dashboard/content-library/articles/performance/performance-budgets-for-nextjs.json";

// ai-tooling/ (1 file)
import aiSessionArticle from "@/data/strapi-mock/dashboard/content-library/articles/ai-tooling/ai-session-management-quality-gates.json";
```

---

## Files to Modify

### 2. lib/strapi/dashboard/content-library/articles/article-content.ts

**Change From:** 147+ lines with JSON imports and registry
**Change To:** 20-30 lines of re-exports

```typescript
import "server-only";

// Re-export everything from the content builder
export {
  getArticleList,
  getArticleContentDocument,
  getAllArticleContentSlugs,
  type ArticleLevel,
  type ArticleCategory,
  type Article,
  type ArticleContentStep,
  type ArticleContentMeta,
  type ArticleContentDocument,
  type ArticleContentBlock,
  type ArticleBlockType,
  type ArticleBlockLevel,
} from "@/lib/strapi/dashboard/content-library/articles/article-content-builder";

export type TOCItem = /* define or re-export from existing location */;
```

**What to Remove:**

- All JSON imports (30 lines)
- articleContentRegistry (30 lines)
- validatedArticleContentRegistry (10 lines)
- Type definitions that move to builder
- getArticleContentDocument() function

**What to Keep:**

- TOCItem type if it's still needed

---

### 3. lib/strapi/dashboard/content-library/articles/articles.ts

**Current Import:**

```typescript
import {
  articles,
  type Article,
  type ArticleCategory,
  type ArticleLevel,
} from "@/data/content-library/articles";
```

**Change To:**

```typescript
import {
  getArticleList,
  type Article,
  type ArticleCategory,
  type ArticleLevel,
} from "@/lib/strapi/dashboard/content-library/articles/article-content";
```

**Update Function Body:**

```typescript
// Change from:
export function getAllArticles(): Article[] {
  return articles;
}

// To:
export function getAllArticles(): Article[] {
  return getArticleList();
}

// Same pattern for other functions that use articles array
```

---

### 4. lib/strapi/dashboard/content-library/articles/article-repository.ts

**Status:** Already imports from articles.ts ✓

**Verify:**

- Imports are from articles.ts (not legacy data/)
- Uses getAllArticles() which now calls getArticleList()
- No other changes needed

---

### 5. lib/strapi/dashboard/content-library/articles/article-view-models.ts

**Status:** Already imports from articles.ts ✓

**Verify:**

- No changes needed if articles.ts is updated

---

### 6. lib/strapi/dashboard/content-library/articles/article-schema.ts

**Status:** Keep as-is ✓

No changes needed - it already contains `articleContentDocumentSchema`

---

## UI Layer Changes

### 7. app/(dashboard)/dashboard/content-library/articles/page.tsx

**Current State:** Likely a client component or has different structure

**Change To:**

```typescript
import { getAllArticles } from "@/lib/strapi/dashboard/content-library/articles/articles";
import ArticlesPageClient from "./articles-client";

export default async function ArticlesPage() {
  const articles = getAllArticles();
  return <ArticlesPageClient articles={articles} />;
}
```

---

### 8. app/(dashboard)/dashboard/content-library/articles/articles-client.tsx (NEW)

**Create New File:**

```typescript
"use client";

import type { Article } from "@/lib/strapi/dashboard/content-library/articles/article-content";

interface Props {
  articles: Article[];
}

export default function ArticlesPageClient({ articles }: Props) {
  // Move all existing client-side logic from articles/page.tsx here
  // Handle state, effects, interactions
  // Return JSX
}
```

---

## Implementation Steps

1. **Create article-content-builder.ts**
   - Copy tutorials pattern
   - Add all 30 JSON imports
   - Create registry with all entries
   - Add validation
   - Export 3 functions and all types
   - **Test:** `npm run build` should succeed with no validation errors

2. **Update article-content.ts**
   - Remove JSON imports
   - Remove registry
   - Remove old getArticleContentDocument()
   - Add re-exports from builder
   - **Test:** Run type check, no errors

3. **Update articles.ts**
   - Change import from `@/data/content-library/articles` to `./article-content`
   - Update getAllArticles() to call getArticleList()
   - **Test:** Functions still work, same results

4. **Verify article-repository.ts**
   - Confirm imports from articles.ts
   - Run type check
   - **Test:** listArticles() works

5. **Verify article-view-models.ts**
   - Run type check
   - No changes needed

6. **Create articles-client.tsx**
   - Extract UI logic from current page.tsx
   - Add 'use client' directive

7. **Update articles/page.tsx**
   - Make async
   - Import getAllArticles
   - Call it
   - Render articles-client.tsx
   - **Test:** Page still renders, data displays

8. **Validation**
   - Type check all files
   - Build project
   - Verify articles list and detail pages work
   - Check no legacy imports remain

---

## Key Points for Articles

- **30 JSON files** to import - organize in import list
- **Layout + TOC support** - ensure ArticleContentDocument maintains these
- **ArticleContentBlock** has complex type structure - preserve exactly
- **11 categories** - all must be in schema
- **Sorting** - by publishedAt descending
- **No breaking changes** - all functions have same signatures
