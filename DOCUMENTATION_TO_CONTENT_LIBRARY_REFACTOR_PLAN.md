# Documentation → Content Library Refactor Plan

**Date**: March 2, 2026  
**Status**: Ready for execution  
**Purpose**: Apply all patterns, lessons, and architecture from documentation refactor to content-library system  
**Critical**: Zero content loss, full pattern replication, production-ready quality

---

## Executive Summary

### Documentation Refactor Achievements (Baseline)

**Architecture Score**: 9.2/10 → 9.7/10 (+0.5)

**Completed Work**:

- ✅ P2/P3 optimizations (eliminated 140+ lines of duplication)
- ✅ Helper module pattern (`documentation-helpers.ts` - 219 lines)
- ✅ Union type pattern for type safety
- ✅ TOC pattern fix (navigation hubs vs. detail pages)
- ✅ URL policy integration
- ✅ Cache headers optimization
- ✅ Dynamic route consolidation (29 files → 1 dynamic route)
- ✅ Build validation: 166 static pages, 29 documentation routes, TypeScript clean
- ✅ Test validation: 77 integration tests passing

**Key Patterns Established**:

1. **Helper Module Pattern**: Single source of truth for category-specific logic
2. **Union Type Pattern**: Type-safe category dispatch without type assertions
3. **Conditional TOC Rendering**: Navigation hubs (no TOC) vs. detail pages (with TOC)
4. **Dynamic Zone Architecture**: Strapi → Content Builder → Repository → View Model → Route
5. **SSG Strategy**: `generateStaticParams()` for all routes at build time

---

## Content Library Current State Analysis

### System Architecture

```
Content Library Structure:
├── articles/
│   ├── page.tsx (list page - 241 lines)
│   └── [category]/
│       └── [slug]/
│           └── page.tsx (detail page - 232 lines)
├── guides/
│   ├── page.tsx (list page)
│   └── [category]/
│       └── [slug]/
│           └── page.tsx (detail page)
├── tutorials/
│   ├── page.tsx (list page)
│   └── [category]/
│       └── [slug]/
│           └── page.tsx (detail page)
├── case-studies/
│   ├── page.tsx (list page)
│   └── [category]/
│       └── [slug]/
│           └── page.tsx (detail page)
└── social/ (special case)
    └── page.tsx (SSR rendering - dynamic)
```

### Key Differences from Documentation

| Feature         | Documentation | Content Library              | Action Required    |
| --------------- | ------------- | ---------------------------- | ------------------ |
| **Nesting**     | Single level  | 2 levels ([category]/[slug]) | Preserve nesting   |
| **List Pages**  | No list pages | 4 list pages                 | Keep list pages    |
| **Rendering**   | SSG only      | SSG + SSR (social page)      | Preserve SSR       |
| **TOC Usage**   | Conditional   | Always used                  | Review TOC pattern |
| **Helpers**     | Centralized   | Duplicated                   | Extract to helpers |
| **Duplication** | Eliminated    | ~20+ getCategoryColor()      | Fix DRY violations |

### Identified Issues (From P2/P3 Analysis)

1. **~20+ instances of `getCategoryColor()` duplication** across 7 page files
2. **~15+ instances of `getLevelColor()` duplication** across article pages
3. **Multiple switch statements** for category/level dispatch
4. **No centralized helper module** (unlike documentation)
5. **URL policy not fully integrated** (some hardcoded paths remain)
6. **Cache headers missing** for static content pages

---

## Critical Lessons Learned

### ⚠️ CONTENT PRESERVATION (Critical)

**Mistake Made**: During documentation refactor, content was lost and had to be recreated from git history.

**Root Cause**:

- Old static route files were deleted before verifying content migration
- Git history had to be used: `git show da61bff:'app/(dashboard)/dashboard/documentation/...'`
- Manual recreation was time-consuming and error-prone

**Prevention Strategy for Content Library**:

1. **NEVER delete old files until new system is validated**
2. **Content migration checklist**:

   ```
   ✅ Extract all content from old files to JSON
   ✅ Verify JSON contains ALL content (not just structure)
   ✅ Validate Zod schemas pass
   ✅ Build and render new dynamic routes
   ✅ Visual comparison: old page vs. new page (side-by-side)
   ✅ Test all links, TOC, and navigation
   ✅ Archive old files (don't delete immediately)
   ✅ Commit new system
   ✅ ONLY THEN delete old files in separate commit
   ```

3. **Content audit script** (create before starting):
   ```powershell
   # content-library-audit.ps1
   # Compare old static routes vs. new JSON data
   # Ensure no content loss
   ```

### 🎯 Architecture Wins (Replicate These)

1. **Union Types > Generic Interfaces**
   - Preserves specific block types per category
   - No type assertions needed
   - Full TypeScript inference

2. **Helper Module Pattern**
   - Single source of truth
   - Eliminates 140+ lines of duplication
   - Easy to extend (add new categories)

3. **Conditional TOC Pattern**
   - Navigation hubs: no TOC (linear reading)
   - Detail pages: with TOC (deep-dive navigation)
   - Template handles both cases automatically

4. **Dynamic Route Consolidation**
   - 29 static files → 1 dynamic route
   - Still SSG (generateStaticParams)
   - Easier to maintain

5. **URL Policy Integration**
   - Canonical URLs from single function
   - Consistent across sitemap, navigation, metadata

---

## Content Library Refactor Strategy

### Phase 1: Pre-Flight Checks (Content Preservation)

**Goal**: Ensure zero content loss

**Tasks**:

1. **Content Inventory**

   ```powershell
   # List all existing content library pages
   Get-ChildItem -Path "app/(dashboard)/dashboard/content-library" -Recurse -Filter "page.tsx" |
     Select-Object FullName, Length, LastWriteTime
   ```

2. **Create Content Archive**

   ```powershell
   # Archive existing pages before refactor
   New-Item -ItemType Directory -Path "archive/content-library-pre-refactor"
   Copy-Item -Path "app/(dashboard)/dashboard/content-library" -Destination "archive/content-library-pre-refactor" -Recurse
   ```

3. **Content Extraction Verification**
   - For each article/guide/tutorial/case-study:
     - ✅ Verify JSON has full content (not placeholders)
     - ✅ Verify code blocks preserved
     - ✅ Verify all metadata (tags, publishedAt, etc.)
     - ✅ Verify block ordering matches original

4. **Create Content Comparison Script**
   ```javascript
   // scripts/compare-content-library-migration.mjs
   // Compare old routes vs. new JSON
   // Report any missing content
   ```

### Phase 2: Data Layer (JSON Files)

**Goal**: Migrate all content to JSON with dynamic zones

**Pattern** (from documentation):

```
data/strapi-mock/dashboard/content-library/
├── articles/
│   ├── architecture/
│   │   ├── component-architecture.json
│   │   └── state-management.json
│   ├── security/
│   │   └── xss-prevention.json
│   └── articles-list.json
├── guides/
│   ├── deployment/
│   │   └── vercel-deployment.json
│   └── guides-list.json
├── tutorials/
│   └── tutorials-list.json
└── case-studies/
    └── case-studies-list.json
```

**JSON Structure** (consistent with documentation):

```json
{
  "meta": {
    "slug": "component-architecture",
    "title": "Component Architecture Principles",
    "excerpt": "...",
    "category": "architecture",
    "level": "intermediate",
    "readTime": "12 min",
    "publishedAt": "2026-01-15",
    "tags": ["architecture", "components", "react"]
  },
  "seo": {
    "metaTitle": "Component Architecture Principles",
    "metaDescription": "...",
    "canonicalUrl": null
  },
  "toc": [
    { "id": "atomic-design", "title": "Atomic Design Pattern", "level": 2 },
    { "id": "composition", "title": "Composition Strategies", "level": 2 }
  ],
  "blocks": [
    { "type": "block.paragraph", "content": "..." },
    {
      "type": "block.sectionHeader",
      "id": "atomic-design",
      "title": "Atomic Design Pattern",
      "number": "01"
    },
    { "type": "block.codeBlock", "language": "typescript", "code": "..." }
  ]
}
```

**Content Migration Checklist (Per File)**:

- [ ] Extract meta fields (slug, title, excerpt, category, level, readTime, publishedAt, tags)
- [ ] Extract SEO fields (metaTitle, metaDescription, canonicalUrl if exists)
- [ ] Extract TOC structure (IMPORTANT: only for detail pages, not list pages)
- [ ] Extract all content blocks (paragraphs, code, lists, callouts, feature grids, etc.)
- [ ] Validate against Zod schema
- [ ] Visual comparison: render old vs. new side-by-side
- [ ] Test all internal links

### Phase 3: Schema Layer (Zod Validation)

**Goal**: Type-safe schemas for all content types

**Pattern** (from documentation):

```typescript
// lib/strapi/dashboard/content-library/articles/article-schema.ts
import { z } from "zod";
import * as Blocks from "@/types/strapi-mock-blocks";

const ArticleMetaSchema = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  category: z.enum(["architecture", "security", "forms", "performance", ...]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  readTime: z.string(),
  publishedAt: z.string(),
  tags: z.array(z.string()),
});

const ArticleSEOSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().optional().nullable(),
});

const ArticleTOCItemSchema: z.ZodType<any> = z.lazy(() =>
  z.object({
    id: z.string(),
    title: z.string(),
    level: z.number(),
    children: z.array(ArticleTOCItemSchema).optional(),
  })
);

export const ArticleSchema = z.object({
  meta: ArticleMetaSchema,
  seo: ArticleSEOSchema.optional(),
  toc: z.array(ArticleTOCItemSchema).optional(),
  blocks: z.array(Blocks.BlockSchema),
});

export type ArticleDocument = z.infer<typeof ArticleSchema>;
```

**Apply Same Pattern To**:

- [ ] `article-schema.ts` (articles with 11 categories + level field)
- [ ] `guide-schema.ts` (guides with nested categories)
- [ ] `tutorial-schema.ts` (tutorials)
- [ ] `case-study-schema.ts` (case studies)

### Phase 4: Content Builder Layer

**Goal**: Load and validate all JSON at module init

**Pattern** (from documentation):

```typescript
// lib/strapi/dashboard/content-library/articles/article-content-builder.ts
import { ArticleSchema, type ArticleDocument } from "./article-schema";

// Import all JSON files
import article1 from "@/data/strapi-mock/.../article1.json";
import article2 from "@/data/strapi-mock/.../article2.json";
// ... all files

const rawDocuments = [
  article1,
  article2,
  // ... all files
] as const;

// Validate at module init (fail fast)
export const articleDocuments = rawDocuments.map((doc, index) => {
  try {
    return ArticleSchema.parse(doc);
  } catch (error) {
    console.error(`Failed to parse article document at index ${index}:`, error);
    throw error;
  }
});

// Export typed array
export type Article = ArticleDocument;
export const articles: readonly Article[] = articleDocuments;
```

**Apply to All Content Types**:

- [ ] `article-content-builder.ts` - Articles (all categories)
- [ ] `guide-content-builder.ts` - Guides
- [ ] `tutorial-content-builder.ts` - Tutorials
- [ ] `case-study-content-builder.ts` - Case Studies

### Phase 5: Repository Layer

**Goal**: Query interface for content retrieval

**Pattern** (from documentation):

```typescript
// lib/strapi/dashboard/content-library/articles/article-repository.ts
import { articles, type Article } from "./article-content-builder";

export function listArticles(): Article[] {
  return [...articles];
}

export function listArticlesByCategory(
  category: Article["category"],
): Article[] {
  return articles.filter((a) => a.meta.category === category);
}

export function listArticlesByLevel(level: Article["level"]): Article[] {
  return articles.filter((a) => a.meta.level === level);
}

export function getArticleBySlug(slug: string): Article | null {
  return articles.find((a) => a.meta.slug === slug) ?? null;
}

export function getArticleRecordBySlug(
  slug: string,
): { article: Article; content: ArticleDocument } | null {
  const article = getArticleBySlug(slug);
  if (!article) return null;

  // For articles, article and content are the same
  // (Unlike documentation where we have separate document structure)
  return { article, content: article };
}
```

**Apply to All Content Types**:

- [ ] `article-repository.ts`
- [ ] `guide-repository.ts`
- [ ] `tutorial-repository.ts`
- [ ] `case-study-repository.ts`

### Phase 6: View Model Layer

**Goal**: Transform to UI-optimized shapes

**Pattern** (from documentation):

```typescript
// lib/strapi/dashboard/content-library/articles/article-view-models.ts
import type { Article } from "./article-schema";

export interface ArticleDetailViewModel {
  slug: string;
  title: string;
  excerpt: string;
  category: Article["category"];
  level: Article["level"];
  readTime: string;
  publishedAt: string;
  tags: string[];
  blocks: Article["blocks"];
  toc?: Article["toc"];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
  };
}

export function toArticleDetailViewModel(
  article: Article,
): ArticleDetailViewModel {
  return {
    slug: article.meta.slug,
    title: article.meta.title,
    excerpt: article.meta.excerpt,
    category: article.meta.category,
    level: article.meta.level,
    readTime: article.meta.readTime,
    publishedAt: article.meta.publishedAt,
    tags: article.meta.tags,
    blocks: article.blocks,
    toc: article.toc,
    seo: {
      metaTitle: article.seo?.metaTitle ?? article.meta.title,
      metaDescription: article.seo?.metaDescription ?? article.meta.excerpt,
      canonicalUrl: article.seo?.canonicalUrl ?? undefined,
    },
  };
}
```

**Apply to All Content Types**:

- [ ] `article-view-models.ts`
- [ ] `guide-view-models.ts`
- [ ] `tutorial-view-models.ts`
- [ ] `case-study-view-models.ts`

### Phase 7: Helper Module (P2 Refactor - Critical)

**Goal**: Eliminate 20+ instances of duplication

**Create** `lib/strapi/dashboard/content-library/content-library-helpers.ts`:

```typescript
import type { Article } from "./articles/article-schema";
import type { Guide } from "./guides/guide-schema";
import type { Tutorial } from "./tutorials/tutorial-schema";
import type { CaseStudy } from "./case-studies/case-study-schema";
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
 * Single source of truth for content type dispatch
 * Eliminates duplicated switch statements across pages
 */
export function getContentLibraryViewModel(
  contentType: "articles" | "guides" | "tutorials" | "case-studies",
  slug: string,
): ContentLibraryDetailViewModel | null {
  switch (contentType) {
    case "articles": {
      const record = getArticleRecordBySlug(slug);
      return record ? toArticleDetailViewModel(record.article) : null;
    }
    case "guides": {
      const record = getGuideRecordBySlug(slug);
      return record ? toGuideDetailViewModel(record.guide) : null;
    }
    case "tutorials": {
      const record = getTutorialRecordBySlug(slug);
      return record ? toTutorialDetailViewModel(record.tutorial) : null;
    }
    case "case-studies": {
      const record = getCaseStudyRecordBySlug(slug);
      return record ? toCaseStudyDetailViewModel(record.caseStudy) : null;
    }
    default:
      return null;
  }
}

/**
 * Category color mapping (articles)
 * Single source of truth - eliminates 20+ duplications
 */
export function getArticleCategoryColor(category: Article["category"]): string {
  switch (category) {
    case "architecture":
      return "bg-blue-500/10 text-blue-500";
    case "security":
      return "bg-red-500/10 text-red-500";
    case "forms":
      return "bg-purple-500/10 text-purple-500";
    case "performance":
      return "bg-green-500/10 text-green-500";
    case "best-practices":
      return "bg-accent/10 text-accent";
    case "rendering":
      return "bg-cyan-500/10 text-cyan-500";
    case "business":
      return "bg-emerald-500/10 text-emerald-500";
    case "accessibility":
      return "bg-indigo-500/10 text-indigo-500";
    case "testing":
      return "bg-orange-500/10 text-orange-500";
    case "devops":
      return "bg-pink-500/10 text-pink-500";
    case "ai-tooling":
      return "bg-violet-500/10 text-violet-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

/**
 * Level color mapping
 * Single source of truth - eliminates 15+ duplications
 */
export function getLevelColor(level: Article["level"]): string {
  switch (level) {
    case "beginner":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

/**
 * Category label mapping (guides)
 */
export function getGuideCategoryLabel(category: Guide["category"]): string {
  // Implementation based on guide categories
  return (
    category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " ")
  );
}

// Add similar helpers for tutorials, case studies as needed
```

**Benefits**:

- Eliminates ~35+ instances of duplication
- Single edit point for color changes
- Type-safe with full autocomplete
- Consistent with documentation pattern

### Phase 8: Dynamic Routes (Preserve Nesting)

**Goal**: Consolidate routes while preserving nested structure

**Articles Route**: `app/(dashboard)/dashboard/content-library/articles/[category]/[slug]/page.tsx`

```typescript
import { getContentLibraryViewModel, getArticleCategoryColor, getLevelColor } from "@/lib/strapi/dashboard/content-library/content-library-helpers";
import { listArticles } from "@/lib/strapi/dashboard/content-library/articles/article-repository";
import { getContentDetailPath } from "@/lib/content-library/url-policy";
import { TableOfContents } from "@/components/molecules/article-components";
import { ContentBlockRenderer } from "@/components/organisms/content-block-renderer";

export async function generateStaticParams() {
  return listArticles().map((article) => ({
    category: article.meta.category,
    slug: article.meta.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params;
  const viewModel = getContentLibraryViewModel("articles", slug);

  if (!viewModel) {
    return { title: "Article Not Found", robots: { index: false, follow: false } };
  }

  const canonicalUrl = viewModel.seo.canonicalUrl ?? getContentDetailPath("articles", viewModel.category, viewModel.slug);

  return {
    title: viewModel.seo.metaTitle,
    description: viewModel.seo.metaDescription,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      title: viewModel.seo.metaTitle,
      description: viewModel.seo.metaDescription,
      url: canonicalUrl,
      publishedTime: viewModel.publishedAt,
      tags: viewModel.tags,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const viewModel = getContentLibraryViewModel("articles", slug);

  if (!viewModel) notFound();
  if (viewModel.category !== category) {
    redirect(getContentDetailPath("articles", viewModel.category, viewModel.slug));
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelColor(viewModel.level)}`}>
            {viewModel.level}
          </span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getArticleCategoryColor(viewModel.category)}`}>
            {viewModel.category}
          </span>
        </div>
        <h1 className="text-4xl font-bold">{viewModel.title}</h1>
        <p className="text-lg text-muted-foreground">{viewModel.excerpt}</p>
      </header>

      {/* Content */}
      <article className="border-t pt-8">
        {viewModel.toc && viewModel.toc.length > 0 ? (
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              <ContentBlockRenderer blocks={viewModel.blocks} />
            </div>
            <aside className="hidden lg:block w-64 shrink-0">
              <TableOfContents items={viewModel.toc} />
            </aside>
          </div>
        ) : (
          <ContentBlockRenderer blocks={viewModel.blocks} />
        )}
      </article>
    </div>
  );
}
```

**Key Points**:

- ✅ Uses helper module (no duplication)
- ✅ Type-safe with union types
- ✅ Conditional TOC rendering
- ✅ URL policy integration
- ✅ Proper redirects for category mismatches
- ✅ SSG with generateStaticParams
- ✅ Preserves nested route structure

**Repeat Pattern for**:

- [ ] Guides: `guides/[category]/[slug]/page.tsx`
- [ ] Tutorials: `tutorials/[category]/[slug]/page.tsx`
- [ ] Case Studies: `case-studies/[category]/[slug]/page.tsx`

### Phase 9: List Pages (Preserve Existing)

**Goal**: Update list pages to use helpers, preserve functionality

**Pattern** (update, don't recreate):

```typescript
// app/(dashboard)/dashboard/content-library/articles/page.tsx
import { listArticles } from "@/lib/strapi/dashboard/content-library/articles/article-repository";
import { getArticleCategoryColor, getLevelColor } from "@/lib/strapi/dashboard/content-library/content-library-helpers";
import articlesListData from "@/data/strapi-mock/dashboard/content-library/articles/articles-list.json";

export default function ArticlesPage() {
  const articles = listArticles();
  const { header, stats } = articlesListData;

  const beginnerArticles = articles.filter((a) => a.meta.level === "beginner");
  const intermediateArticles = articles.filter((a) => a.meta.level === "intermediate");
  const advancedArticles = articles.filter((a) => a.meta.level === "advanced");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">{header.title}</h1>
        <p className="text-lg text-muted-foreground">{header.description}</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.level} className={/* ... */}>
            {/* Stats display */}
          </div>
        ))}
      </div>

      {/* Article lists by level */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Beginner</h2>
        <div className="grid gap-4">
          {beginnerArticles.map((article) => (
            <Link key={article.meta.slug} href={getContentDetailPath("articles", article.meta.category, article.meta.slug)}>
              <div className="border rounded-lg p-6 hover:border-accent">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs rounded ${getArticleCategoryColor(article.meta.category)}`}>
                        {article.meta.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold">{article.meta.title}</h3>
                    <p className="text-muted-foreground mt-2">{article.meta.excerpt}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Repeat for intermediate and advanced */}
    </div>
  );
}
```

**Apply to All List Pages**:

- [ ] `articles/page.tsx` - Update to use helpers
- [ ] `guides/page.tsx` - Update to use helpers
- [ ] `tutorials/page.tsx` - Update to use helpers
- [ ] `case-studies/page.tsx` - Update to use helpers

### Phase 10: Social Page (Preserve SSR)

**Goal**: Keep SSR rendering, update to use helpers if applicable

**Critical**: Social page uses SSR (dynamic rendering), not SSG. This is intentional and should be preserved.

```typescript
// app/(dashboard)/dashboard/content-library/social/page.tsx
// Keep existing implementation
// This page is dynamically rendered (SSR) - do not change to SSG
export const dynamic = "force-dynamic";

export default async function SocialPage() {
  // Existing implementation - DO NOT CHANGE RENDERING STRATEGY
}
```

### Phase 11: Cache Headers (P3 Optimization)

**Goal**: Add explicit cache headers for static content

**Add to** `next.config.mjs`:

```javascript
{
  source: "/dashboard/content-library/articles/:category/:slug",
  headers: [
    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    { key: "Vary", value: "Accept-Encoding" },
  ],
},
{
  source: "/dashboard/content-library/guides/:category/:slug",
  headers: [
    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    { key: "Vary", value: "Accept-Encoding" },
  ],
},
{
  source: "/dashboard/content-library/tutorials/:category/:slug",
  headers: [
    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    { key: "Vary", value: "Accept-Encoding" },
  ],
},
{
  source: "/dashboard/content-library/case-studies/:category/:slug",
  headers: [
    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
    { key: "Vary", value: "Accept-Encoding" },
  ],
},
```

---

## Testing Strategy

### Unit Tests

**Pattern** (from documentation):

```typescript
// __tests__/unit/content-library/article-repository.test.ts
import { describe, it, expect } from "vitest";
import {
  listArticles,
  getArticleBySlug,
} from "@/lib/strapi/dashboard/content-library/articles/article-repository";

describe("Article Repository", () => {
  it("should list all articles", () => {
    const articles = listArticles();
    expect(articles.length).toBeGreaterThan(0);
  });

  it("should get article by slug", () => {
    const article = getArticleBySlug("component-architecture");
    expect(article).toBeTruthy();
    expect(article?.meta.slug).toBe("component-architecture");
  });

  it("should return null for non-existent slug", () => {
    const article = getArticleBySlug("non-existent");
    expect(article).toBeNull();
  });
});
```

**Create Tests For**:

- [ ] Article repository
- [ ] Guide repository
- [ ] Tutorial repository
- [ ] Case study repository
- [ ] Content library helpers
- [ ] View model transformations

### Integration Tests

**Pattern** (from documentation):

```typescript
// __tests__/integration-test/content-library/articles/[category]/[slug]/page.test.tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import ArticlePage, {
  generateStaticParams,
  generateMetadata,
} from "@/app/(dashboard)/dashboard/content-library/articles/[category]/[slug]/page";

describe("Articles Detail Page", () => {
  it("should generate static params for all articles", async () => {
    const params = await generateStaticParams();
    expect(params.length).toBeGreaterThan(0);
    expect(params[0]).toHaveProperty("category");
    expect(params[0]).toHaveProperty("slug");
  });

  it("should generate metadata for valid article", async () => {
    const metadata = await generateMetadata({
      params: Promise.resolve({
        category: "architecture",
        slug: "component-architecture",
      }),
    });
    expect(metadata.title).toBeTruthy();
    expect(metadata.description).toBeTruthy();
  });

  it("should render article page", async () => {
    const params = Promise.resolve({
      category: "architecture",
      slug: "component-architecture",
    });
    const { container } = render(await ArticlePage({ params }));
    expect(container).toBeTruthy();
  });
});
```

**Create Tests For**:

- [ ] Articles detail page
- [ ] Guides detail page
- [ ] Tutorials detail page
- [ ] Case studies detail page
- [ ] Articles list page
- [ ] Guides list page
- [ ] Tutorials list page
- [ ] Case studies list page

---

## Validation Checklist

### Pre-Refactor Validation

- [ ] Content audit complete (all existing content cataloged)
- [ ] Archive created (`archive/content-library-pre-refactor/`)
- [ ] Comparison script ready (`scripts/compare-content-library-migration.mjs`)
- [ ] Test suite baseline established (all existing tests passing)

### During Refactor Validation

- [ ] Each JSON file validated against Zod schema
- [ ] Visual comparison: old page vs. new page (side-by-side)
- [ ] All links working (internal navigation)
- [ ] TOC links scrolling correctly
- [ ] Code blocks rendering with syntax highlighting
- [ ] Images loading correctly
- [ ] Metadata complete (tags, publishedAt, readTime, etc.)

### Post-Refactor Validation

- [ ] Build passes: `npm run build` (0 errors)
- [ ] TypeScript clean: No type errors
- [ ] All tests passing: `npm run test`
- [ ] All routes accessible (manual browser check)
- [ ] All list pages working (filtering, sorting)
- [ ] Social page still SSR (not converted to SSG)
- [ ] TOC rendering correctly (detail pages only)
- [ ] URL policy consistent (sitemap, navigation, canonical)
- [ ] Cache headers applied (check Network tab)
- [ ] No content loss (comparison script passes)

### Architecture Validation

- [ ] Helper module created (content-library-helpers.ts)
- [ ] No duplication (getCategoryColor, getLevelColor extracted)
- [ ] Union types used (type-safe category dispatch)
- [ ] Conditional TOC pattern applied
- [ ] URL policy integration complete
- [ ] Cache headers added
- [ ] Consistent with documentation pattern
- [ ] Code quality: 9.7/10 or higher

---

## Script Development

### Content Comparison Script

```javascript
// scripts/compare-content-library-migration.mjs
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

/**
 * Compare old static routes vs. new JSON data
 * Ensure no content loss during migration
 */

const OLD_ROUTES_PATH =
  "archive/content-library-pre-refactor/app/(dashboard)/dashboard/content-library";
const NEW_JSON_PATH = "data/strapi-mock/dashboard/content-library";

function extractContentFromOldRoute(filePath) {
  // Parse old page.tsx files
  // Extract all text content, code blocks, etc.
  // Return normalized content object
}

function extractContentFromJSON(filePath) {
  // Parse JSON file
  // Extract all block content
  // Return normalized content object
}

function compareContent(oldContent, newContent) {
  // Deep comparison
  // Report missing sections, code blocks, etc.
}

// Main comparison logic
const results = {
  matched: [],
  missingContent: [],
  errors: [],
};

// Compare all articles
// Compare all guides
// Compare all tutorials
// Compare all case studies

// Output report
console.log("\n=== Content Migration Comparison ===\n");
console.log(`✅ Matched: ${results.matched.length}`);
console.log(`⚠️  Missing Content: ${results.missingContent.length}`);
console.log(`❌ Errors: ${results.errors.length}`);

if (results.missingContent.length > 0) {
  console.log("\n=== Missing Content Details ===\n");
  results.missingContent.forEach((item) => {
    console.log(`- ${item.file}: ${item.description}`);
  });
  process.exit(1);
}

process.exit(0);
```

### Bulk Migration Script

```javascript
// scripts/migrate-content-library.mjs
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

/**
 * Bulk migrate content from old routes to new JSON format
 * DRY RUN first, then actual migration
 */

const DRY_RUN = process.argv.includes("--dry-run");

function migrateArticle(oldFilePath, category, slug) {
  // Extract content from old page.tsx
  // Transform to JSON structure
  // Validate against Zod schema
  // Write JSON file (if not dry run)
}

// Process all content types
const articlesToMigrate = [
  // List all articles with their categories and slugs
];

articlesToMigrate.forEach(({ category, slug }) => {
  const oldPath = `app/(dashboard)/dashboard/content-library/articles/${category}/${slug}/page.tsx`;
  const newPath = `data/strapi-mock/dashboard/content-library/articles/${category}/${slug}.json`;

  try {
    migrateArticle(oldPath, category, slug);
    console.log(`✅ ${category}/${slug}`);
  } catch (error) {
    console.error(`❌ ${category}/${slug}:`, error.message);
  }
});

console.log(`\n${DRY_RUN ? "[DRY RUN]" : "[ACTUAL]"} Migration complete`);
```

---

## Risk Mitigation

### High-Risk Areas

1. **Content Loss** (Critical)
   - **Mitigation**: Archive old files, comparison script, visual validation
   - **Rollback**: Git history, archived files

2. **SSR to SSG Conversion** (Social page)
   - **Mitigation**: Keep social page as SSR explicitly
   - **Validation**: Check `export const dynamic = 'force-dynamic'` preserved

3. **Nested Route Structure** (Breaking URLs)
   - **Mitigation**: Preserve exact route structure `[category]/[slug]`
   - **Validation**: URL policy tests, sitemap tests

4. **List Page Functionality** (Filtering, sorting)
   - **Mitigation**: Update carefully, preserve logic
   - **Validation**: Manual testing, integration tests

5. **TOC Pattern** (Over-applying)
   - **Mitigation**: Follow documentation pattern (conditional rendering)
   - **Validation**: List pages should NOT have TOC

### Medium-Risk Areas

1. **Helper Module Integration**
   - **Mitigation**: Gradual rollout, test after each page update
   - **Validation**: Build passes, no duplication remains

2. **Type Safety** (Union types)
   - **Mitigation**: Follow documentation pattern exactly
   - **Validation**: TypeScript compilation clean

3. **Cache Headers** (Over-caching dynamic content)
   - **Mitigation**: Only apply to static detail pages
   - **Validation**: Social page excluded, list pages excluded

---

## Success Criteria

### Definition of Done

**Data Layer**:

- [ ] All articles migrated to JSON (no content loss)
- [ ] All guides migrated to JSON (no content loss)
- [ ] All tutorials migrated to JSON (no content loss)
- [ ] All case studies migrated to JSON (no content loss)
- [ ] All JSON files validate against Zod schemas

**Code Layer**:

- [ ] Helper module created (content-library-helpers.ts)
- [ ] All detail pages use helper module (0 duplication)
- [ ] All list pages updated to use helpers
- [ ] Union types implemented (type-safe dispatch)
- [ ] Conditional TOC rendering applied

**Quality Layer**:

- [ ] Build passes (0 errors, 0 warnings)
- [ ] TypeScript clean (full type safety)
- [ ] All tests passing (100% pass rate)
- [ ] Comparison script passes (0 content loss)
- [ ] Architecture score: 9.7/10 or higher

**Operational Layer**:

- [ ] All routes accessible (manual verification)
- [ ] All links working (navigation, TOC, external)
- [ ] SSR preserved where intended (social page)
- [ ] Cache headers applied correctly
- [ ] URL policy consistent (sitemap, canonical)

---

## Commit Strategy

### Phase Commits

**Commit 1**: Pre-refactor checkpoint

```
content-library: archive and baseline before refactor

- Created archive/content-library-pre-refactor/
- All existing content preserved
- Test baseline established
- Comparison script created
```

**Commit 2**: Data layer migration

```
content-library: migrate all content to JSON with dynamic zones

- Migrated articles to data/strapi-mock/.../articles/
- Migrated guides to data/strapi-mock/.../guides/
- Migrated tutorials to data/strapi-mock/.../tutorials/
- Migrated case studies to data/strapi-mock/.../case-studies/
- All Zod schemas passing
- Comparison script passing (0 content loss)
```

**Commit 3**: Helper module (P2 refactor)

```
content-library: extract helper module, eliminate duplication

- Created lib/strapi/dashboard/content-library/content-library-helpers.ts
- Eliminated 35+ instances of duplication
- Union type pattern for type safety
- Single source of truth for category/level colors
```

**Commit 4**: Dynamic routes

```
content-library: consolidate to dynamic routes

- Updated articles/[category]/[slug]/page.tsx
- Updated guides/[category]/[slug]/page.tsx
- Updated tutorials/[category]/[slug]/page.tsx
- Updated case-studies/[category]/[slug]/page.tsx
- All routes use helper module
- Conditional TOC rendering
- SSG with generateStaticParams
```

**Commit 5**: List pages and optimizations

```
content-library: update list pages and add cache headers

- Updated all list pages to use helpers
- Added cache headers to next.config.mjs
- URL policy integration complete
- Social page SSR preserved
```

**Commit 6**: Testing and validation

```
content-library: comprehensive test suite

- Unit tests for repositories
- Integration tests for all pages
- Validation passing (build, TypeScript, tests)
- Architecture score: 9.7/10
```

**Commit 7**: Cleanup

```
content-library: remove old static routes

- Removed app/(dashboard)/dashboard/content-library/articles/[old-routes]
- Removed app/(dashboard)/dashboard/content-library/guides/[old-routes]
- Removed app/(dashboard)/dashboard/content-library/tutorials/[old-routes]
- Removed app/(dashboard)/dashboard/content-library/case-studies/[old-routes]
- Archive preserved for reference
```

---

## Timeline Estimate

**Total Effort**: 12-16 hours (focused work)

**Phase Breakdown**:

1. Pre-flight checks (2 hours)
2. Data layer migration (4 hours)
3. Schema/builder/repository layers (2 hours)
4. Helper module creation (1 hour)
5. Dynamic routes (3 hours)
6. List pages update (2 hours)
7. Testing and validation (2 hours)
8. Documentation and cleanup (2 hours)

**Recommended Approach**: 3-4 focused sessions

---

## Documentation to Maintain

**Update After Refactor**:

- [ ] ARCHITECTURE_REVIEW_3AXIS.md (new score)
- [ ] DOCUMENTATION_COMPLETION_HANDOFF.md (content-library status)
- [ ] README.md (architecture overview)
- [ ] TESTING_ARCHITECTURE.md (new tests)
- [ ] This document (mark as complete)

**Create New**:

- [ ] CONTENT_LIBRARY_REFACTOR_COMPLETE.md (summary like P2_P3_OPTIMIZATION_COMPLETE.md)
- [ ] CONTENT_LIBRARY_ARCHITECTURE.md (detailed architecture doc)

---

## Final Checklist Before Starting

- [ ] **CRITICAL**: I have read and understood the content preservation strategy
- [ ] **CRITICAL**: I have created the archive folder
- [ ] **CRITICAL**: I have the comparison script ready
- [ ] I understand the documentation pattern and can replicate it
- [ ] I understand the helper module pattern
- [ ] I understand the union type pattern
- [ ] I understand the conditional TOC pattern
- [ ] I understand the SSR vs. SSG distinction (social page must stay SSR)
- [ ] I understand the nested route structure must be preserved
- [ ] I have the timeline and can commit to focused execution
- [ ] I am ready to execute systematically with zero shortcuts

---

_Document Version: 1.0_  
_Status: Ready for Execution_  
_Next Action: Review, commit documentation refactor, merge to main, create feature branch, begin content-library refactor_
