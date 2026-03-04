# Content Library Architecture

**Last Updated:** 2026-02-27  
**Status:** Production-ready, SEO-aligned

---

## Executive Summary

The Content Library implements a strict **6-layer server-first architecture** for managing structured content (Articles, Tutorials, Case Studies, Guides). All layers enforce **zero client-side data fetching** and **build-time validation** to prevent runtime errors and ensure SEO integrity.

**Key Principles:**

- **Server-Only Data Access:** All content operations use `"server-only"` imports
- **Type-Safe at Build Time:** Zod schemas validate all JSON content during import
- **SEO-First:** Integrated with Strapi SEO Plugin conventions (metaTitle, metaDescription, canonicalUrl, metaImage, metaSocial, preventIndexing)
- **Static Generation Priority:** All content routes use `generateStaticParams` for pre-rendering
- **URL Canonical Policy:** Enforced via prebuild governance script

---

## Architecture Layers

### Layer 1: Schema (Validation)

**Files:** `*-schema.ts`  
**Purpose:** Zod schemas define the exact shape of content JSON documents

**Current State:**

- ✅ Articles: `article-schema.ts` (547 lines, comprehensive block validation)
- ✅ Tutorials: `tutorial-schema.ts` (simplified block validation)
- ✅ Case Studies: `case-study-schema.ts` (matches article structure)
- ✅ Guides: `guide-schema.ts` (simplified structure)

**Schema Fields (Standardized):**

```typescript
meta: {
  slug: string;           // URL-safe identifier
  title: string;          // Primary heading
  excerpt: string;        // Summary (fallback for metaDescription)
  level: Level;           // beginner | intermediate | advanced
  category: Category;     // Section-specific taxonomy
  readTime: string;       // "25 min"
  publishedAt: string;    // ISO date string
  tags: string[];         // Topic tags
}
layout: "content-with-toc" | "content-only";
toc?: TocItem[];          // Table of contents
blocks: Block[];          // Atomic design content blocks
```

**SEO Extension (Future Strapi Migration):**

```typescript
seo?: {
  metaTitle?: string;           // Overrides meta.title for <title>
  metaDescription?: string;     // Overrides meta.excerpt
  keywords?: string;            // Comma-separated keywords
  canonicalUrl?: string;        // Canonical URL (root-relative or absolute)
  metaImage?: string | {        // OG/Twitter image
    url: string;
    alt?: string;
  };
  metaSocial?: Array<{          // Facebook/Twitter overrides
    socialNetwork: "Facebook" | "Twitter";
    title?: string;
    description?: string;
    image?: string | { url: string; alt?: string };
  }>;
  preventIndexing?: boolean;    // Sets noindex/nofollow
}
```

---

### Layer 2: Content Builder (Data Loading)

**Files:** `*-content-builder.ts`  
**Purpose:** Import, validate, and expose content JSON as type-safe structures

**Current State:**

- ✅ Articles: 29 imports, validated registry
- ✅ Tutorials: 15 imports, validated registry
- ✅ Case Studies: 20 imports, validated registry
- ✅ Guides: 3 imports, validated registry

**API Pattern:**

```typescript
// Builder exports
export function getArticleList(): Article[]
export function getArticleContentDocument(slug: string): ArticleContentDocument | null
export function getAllArticleContentSlugs(): string[]

// Types exported
export type Article = { ... }
export type ArticleContentDocument = { ... }
```

**Validation Flow:**

1. Import all JSON files statically
2. Validate each against Zod schema on module load
3. Log validation results via `dataLogger`
4. Throw on validation failure (fails build immediately)
5. Return validated, type-safe registry

---

### Layer 3: Repository (Data Access)

**Files:** `*-repository.ts`  
**Purpose:** Server-only data access layer with query logging

**Current State:**

- ✅ Articles: `article-repository.ts`
- ✅ Tutorials: `tutorial-repository.ts`
- ✅ Case Studies: `case-study-repository.ts`
- ✅ Guides: `guides-repository.ts`

**API Pattern:**

```typescript
// List operations
export function listArticles(): Article[];
export function listArticleSlugs(): string[];

// Detail operations
export interface ArticleRecord {
  article: Article;
  content: ArticleContentDocument;
}
export function getArticleRecordBySlug(slug: string): ArticleRecord | null;

// Filter operations
export function getArticlesByCategory(category: ArticleCategory): Article[];
export function getArticlesByLevel(level: ArticleLevel): Article[];
```

**Logging:**

- All queries log start/completion via `repoLogger`
- Logs include operation name, params, and result count

---

### Layer 4: View Models (Presentation)

**Files:** `*-view-models.ts`  
**Purpose:** Transform domain models into UI-specific view models

**Current State:**

- ✅ Articles: `article-view-models.ts`
- ✅ Tutorials: `tutorial-view-models.ts`
- ✅ Case Studies: `case-study-view-models.ts`
- ✅ Guides: `guide-view-models.ts`

**Transformation Pattern:**

```typescript
export interface ArticleDetailViewModel {
  slug: string;
  title: string;
  excerpt: string;
  level: ArticleLevel;
  category: ArticleCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export function toArticleDetailViewModel(article: Article): ArticleDetailViewModel {
  return { ... }
}
```

**Purpose:**

- Decouple domain model from UI requirements
- Allow schema evolution without breaking pages
- Enable A/B testing of presentation formats

---

### Layer 5: Legacy API Facade

**Files:** `articles.ts`, `tutorials.ts`, `case-studies.ts`, `guides.ts` (partial)  
**Purpose:** Backward-compatible API for existing pages during migration

**Current State:**

- ✅ Articles: `articles.ts` (complete)
- ✅ Tutorials: `tutorials.ts` (complete)
- ✅ Case Studies: `case-studies.ts` (complete)
- ⚠️ **Guides: MISSING** `guides.ts` (needs creation)

**API Pattern:**

```typescript
import "server-only";

export function getAllArticles(): Article[];
export function getArticleBySlug(slug: string): Article | null;
export function getArticlesByLevel(level: ArticleLevel): Article[];
export function getArticlesByCategory(category: ArticleCategory): Article[];
export function getAllArticleSlugs(): string[];
```

**Missing Implementation:**

- **guides.ts** does not exist
- Pattern established for other sections should be replicated

---

### Layer 6: Route Manifest (SEO/Sitemap)

**File:** `content-route-manifest.ts`  
**Purpose:** Unified inventory of all content routes for sitemap generation

**Current State:**

- ✅ Implemented for articles, tutorials, case-studies, guides
- ✅ Returns canonical URLs for all detail pages
- ✅ Used by `/sitemap.xml` route

**API:**

```typescript
export interface ContentRouteEntry {
  url: string; // Full canonical URL
  lastModified: Date; // From publishedAt
  changeFrequency: string; // "monthly"
  priority: number; // 0.7
}

export function getContentRouteManifest(): ContentRouteEntry[];
```

---

## Content Governance

### Prebuild Validation Script

**File:** `scripts/validate-content-links.mjs`  
**Purpose:** Build-time gate that enforces content integrity rules

**Validation Rules:**

**1. URL Integrity**

- All `href` fields match real content routes
- Category/slug pairs exist in content registry
- No extra path segments
- No category mismatches

**2. SEO Completeness**

- Required: `metaTitle` or `meta.title`
- Required: `metaDescription` or `meta.description` or `meta.excerpt`
- Optional but validated: `canonicalUrl`, `keywords`, `metaImage`, `metaSocial[]`, `robots`, `preventIndexing`

**3. Robots Policy**

- String format: `"index,follow"`, `"noindex,nofollow"`, etc.
- Object format: `{ index: boolean, follow: boolean, ...extended }`
- Consistency: `preventIndexing: true` requires `noindex` semantics

**4. Image Policy**

- String: root-relative (`/images/...`) or absolute (`https://...`)
- Object: `{ url: string, alt?: string }`
- Social images follow same rules

**5. Social Meta Validation**

- `metaSocial[]` entries require `socialNetwork: "Facebook" | "Twitter"`
- Optional title/description must be non-empty when provided
- Images validated via same policy

**Failure Behavior:**

- Prints all errors with file paths and suggestions
- Exits with code 1 (fails CI/CD build)
- Prevents deployment of broken content

**Run:**

```bash
node scripts/validate-content-links.mjs
```

---

## Content Taxonomy

### Articles (29 total)

**Categories:**

- `architecture` (9) — System design, patterns, boundaries
- `best-practices` (5) — Quality, refactoring, guard patterns
- `forms` (3) — Form architecture, validation, state
- `security` (2) — Server actions, security architecture
- `rendering` (4) — SSR, SSG, ISR, PPR
- `performance` (1) — Performance budgets
- `business` (2) — ROI, tech stack decisions
- `testing` (1) — Testing strategy
- `devops` (1) — CI/CD pipelines
- `ai-tooling` (1) — AI session management

**Levels:** beginner | intermediate | advanced

### Tutorials (15 total)

**Categories:**

- `getting-started` (3) — First Next.js app, hydration, error boundaries
- `components` (2) — Atomic design, hydration-safe patterns
- `forms` (1) — Multi-step forms
- `security` (2) — Validation, rate limiting
- `state-management` (1) — Zustand
- `cms` (2) — Strapi setup, Next.js connection
- `testing` (2) — Vitest, Playwright
- `devops` (1) — Vercel deployment
- `email` (1) — React Email templates

**Levels:** beginner | intermediate | advanced

### Case Studies (20 total)

**Categories:**

- `architecture` (4) — State management, email consolidation, hydration, documentation
- `security` (4) — Validation refactor, security layer, rate limiting
- `business` (3) — CMS migration, cost reduction, productivity
- `forms` (2) — Multi-step form evolution
- `performance` (1) — Client to server components
- `rendering` (2) — Edge cache, rendering strategy
- `cms` (1) — Multi-site architecture
- `refactoring` (1) — Sidebar refactor
- `infrastructure` (2) — Tarball issues, email consolidation

**Levels:** beginner | intermediate | advanced

### Guides (3 total)

**Categories:**

- `security` (1) — Security architecture
- `devops` (1) — Deployment guide
- `testing` (1) — Testing strategy

**Levels:** intermediate | advanced only

---

## Page Route Structure

### Content Library Index

**Route:** `/dashboard/content-library`  
**Component:** Server Component  
**Data Source:** All section list APIs

### Section List Pages

**Routes:**

- `/dashboard/content-library/articles`
- `/dashboard/content-library/tutorials`
- `/dashboard/content-library/case-studies`
- `/dashboard/content-library/guides`

**Component:** Server Component  
**Data Source:** Repository `list*()` functions  
**Static Generation:** Yes (no params)

### Content Detail Pages

**Routes:**

- `/dashboard/content-library/articles/[category]/[slug]`
- `/dashboard/content-library/tutorials/[category]/[slug]`
- `/dashboard/content-library/case-studies/[category]/[slug]`
- `/dashboard/content-library/guides/[category]/[slug]`

**Component:** Server Component  
**Data Source:** Repository `get*RecordBySlug(slug)`  
**Static Generation:** Yes via `generateStaticParams()`

**Metadata Generation:**

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const record = getArticleRecordBySlug(slug);

  if (!record) return { title: "Not Found" };

  return {
    title: record.article.title,
    description: record.article.excerpt,
    // ... canonicalUrl, openGraph, twitter, robots
  };
}
```

---

## Future Strapi Migration Path

### Phase 1: SEO Fields (Current)

- Add `seo?: SeoComponent` to content JSON files
- Validator already enforces SEO plugin field shapes
- Pages can read from `seo.metaTitle || meta.title` fallback chain

### Phase 2: Strapi REST API

- Replace JSON imports with Strapi REST client
- Keep content-builder API unchanged
- Repository layer calls Strapi instead of registry
- Schemas validate API responses

### Phase 3: Strapi SDK

- Migrate to `@strapi/sdk` for type-safe queries
- Remove manual schema validation (Strapi types)
- Keep view model transformations

### Phase 4: Real-Time Updates

- Add ISR or on-demand revalidation
- Webhook from Strapi triggers revalidation
- Static generation remains primary strategy

---

## Architecture Gaps (Identified 2026-02-27)

### ❌ Missing: guides.ts Legacy API

**Location:** `lib/strapi/dashboard/content-library/guides/guides.ts`  
**Impact:** Pages importing from old API path will break  
**Fix Required:** Create facade matching articles/tutorials/case-studies pattern

### ✅ Complete: All Other Layers

- Schemas: 4/4 sections
- Content Builders: 4/4 sections
- Repositories: 4/4 sections
- View Models: 4/4 sections
- Legacy APIs: 3/4 sections (guides missing)
- Route Manifest: Complete
- Prebuild Governance: Complete

---

## Testing Strategy

### Unit Tests (Not Yet Implemented)

**Target:** Content builders, repositories, view models  
**Tool:** Vitest  
**Coverage Goals:**

- Schema validation edge cases
- Repository query filtering
- View model transformations
- Error handling for missing content

### Integration Tests (Not Yet Implemented)

**Target:** Full data layer + metadata generation  
**Tool:** Vitest + MSW (if needed for future Strapi)  
**Coverage Goals:**

- `generateMetadata()` produces correct SEO tags
- `generateStaticParams()` returns all valid slugs
- Canonical URL generation follows policy

### E2E Tests (Not Yet Implemented)

**Target:** Full content detail page rendering  
**Tool:** Playwright  
**Coverage Goals:**

- All detail pages render without errors
- Metadata appears in `<head>`
- Content blocks render correctly
- Navigation works between sections

### Build-Time Tests (Implemented)

**Tool:** `scripts/validate-content-links.mjs`  
**Coverage:**

- ✅ All content JSON validated against schemas
- ✅ All hrefs resolve to real routes
- ✅ SEO fields validated
- ✅ Category/slug pairs consistent

---

## Next Steps for Full Implementation

### 1. Create Missing guides.ts

- Copy pattern from articles.ts
- Re-export functions from guide-content-builder
- Add "server-only" directive
- Verify pages using old import path

### 2. Create Test Suite

- Create `__tests__/content-library/` directory
- Unit tests for each section's data layer
- Integration tests for metadata generation
- E2E smoke tests for sample routes

### 3. Document Migration Guide

- How to add new content sections
- How to extend schemas for new fields
- How to add new validation rules
- How to migrate to Strapi (future)

### 4. Performance Baseline

- Measure build time for all static params
- Measure schema validation overhead
- Benchmark content-builder load time
- Document acceptable thresholds

---

## Related Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Infrastructure Documentation](INFRASTRUCTURE.md)
- [Phase Reports](PHASE*.md)
- [Session Summaries](SESSION_*.md)

---

## Change Log

**2026-02-27:** Initial comprehensive architecture documentation

- Documented 6-layer architecture
- Identified guides.ts gap
- Integrated Strapi SEO Plugin alignment
- Defined testing strategy
- Mapped future migration path
