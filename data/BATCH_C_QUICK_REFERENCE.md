# Batch C + Global Infrastructure — Quick Reference Guide

## Executive Summary

**Objective:** Complete Phase 9 migration while establishing global infrastructure for Phase 10+

**Two Parallel Work Streams:**

1. **Batch C (4 Pages):** Complex dynamic detail pages with relations
   - Articles, Case Studies, Guides, Tutorials
   - 8-12 hours to execute
   - Establishes relation validation pattern

2. **Global Infrastructure (3 Parts):** Reusable systems for entire app
   - Generic DataTable<T> component
   - Global settings entity (single source of truth)
   - Email configuration refactoring

**Timeline:** Both can be done in parallel, expected 4 weeks total

---

## Batch C — Quick Start

### 4 Pages to Migrate

| Page         | Route                                                       | Pattern       | Priority |
| ------------ | ----------------------------------------------------------- | ------------- | -------- |
| Articles     | `/dashboard/content-library/articles/[category]/[slug]`     | List → Detail | 1        |
| Case Studies | `/dashboard/content-library/case-studies/[category]/[slug]` | List → Detail | 2        |
| Guides       | `/dashboard/content-library/guides/[category]/[slug]`       | List → Detail | 3        |
| Tutorials    | `/dashboard/content-library/tutorials/[category]/[slug]`    | List → Detail | 4        |

### Implementation Checklist (Per Page)

```
ARTICLES
├── [ ] Create /data/strapi-mock/dashboard/articles/metadata.json
├── [ ] Create /data/strapi-mock/dashboard/articles/[category]/[slug].json files
├── [ ] Add ArticleDetailContent type to types/dashboard.ts
├── [ ] Create article-detail.tsx component
├── [ ] Update [category]/[slug]/page.tsx
├── [ ] Add generateStaticParams() for all combinations
├── [ ] Validate type safety: pnpm exec tsc --noEmit
└── [ ] Validate build: pnpm run build

CASE STUDIES
├── [ ] Create /data/strapi-mock/dashboard/case-studies/metadata.json
├── [ ] Create /data/strapi-mock/dashboard/case-studies/[category]/[slug].json files
├── [ ] Add CaseStudyDetailContent type
├── [ ] Create case-study-detail.tsx component
├── [ ] Update [category]/[slug]/page.tsx
├── [ ] Add generateStaticParams()
├── [ ] Validate: tsc --noEmit
└── [ ] Validate: build

[Repeat for Guides and Tutorials]
```

### Key Files to Create

```
data/strapi-mock/dashboard/
├── articles/
│   ├── metadata.json
│   └── [category]/
│       └── [slug].json (multiple per category)
├── case-studies/
│   ├── metadata.json
│   └── [category]/
│       └── [slug].json
├── guides/
│   ├── metadata.json
│   └── [category]/
│       └── [slug].json
└── tutorials/
    ├── metadata.json
    └── [category]/
        └── [slug].json
```

### Type Pattern

```typescript
// For each page type, add to types/dashboard.ts:

export interface ArticleDetailContent {
  article: {
    slug: string;
    title: string;
    category: string;
    author: string;
    date: string;
    readTime: number;
    excerpt: string;
    content: string;
    tags: string[];
    relatedArticles: RelatedContent[];
  };
}

export interface RelatedContent {
  slug: string;
  title: string;
  category: string;
}

// Use same pattern for CaseStudyDetailContent, GuideDetailContent, TutorialDetailContent
```

### Page Component Pattern

```typescript
import { notFound } from "next/navigation"
import metadata from "@/data/strapi-mock/dashboard/articles/metadata.json"
import articleData from "@/data/strapi-mock/dashboard/articles/[DYNAMIC]/[SLUG].json"
import type { ArticleDetailContent } from "@/types/dashboard"

export async function generateStaticParams() {
  return Object.entries(metadata.categories).flatMap(([category, data]) =>
    data.slugs.map(slug => ({ category, slug }))
  )
}

export default function ArticleDetailPage({
  params: { category, slug },
}: {
  params: { category: string; slug: string }
}) {
  // Validate
  const categoryData = metadata.categories[category]
  if (!categoryData?.slugs.includes(slug)) {
    notFound()
  }

  // Type assertion
  const article = articleData as ArticleDetailContent

  // Render
  return (
    <article>
      <h1>{article.article.title}</h1>
      {/* ... */}
    </article>
  )
}
```

---

## Global Infrastructure — Quick Start

### 3 Components to Build

#### 1. Generic DataTable<T>

**Location:** `components/ui/generic-data-table.tsx`

**What It Does:**

- Accepts any data type `T` and column definitions
- Provides filtering, sorting, pagination, selection
- Uses TanStack Table (react-table) under the hood

**Usage:**

```typescript
<DataTable<Job>
  data={jobsData}
  columns={createEmailJobColumns({ onStatusChange, onAssign })}
  enableSelection
  enableFiltering
  pageSize={10}
/>
```

**Impact:**

- Email dashboard: Email jobs table
- Future: Analytics table, Financial table, Users table

#### 2. Global Settings Entity

**Location:** `data/strapi-mock/global/settings.json` + `types/global-settings.ts`

**What It Contains:**

- Branding (logo, colors, company name)
- Email templates (6+ templates with variables)
- SEO defaults (title, description, OG image)
- Contact form settings
- Social media links
- Analytics tracking config

**Who Uses It:**

- Footer component
- Email configuration pages
- Contact form handler
- SEO metadata generation
- Email template rendering

**Single Source of Truth For:**

- Company name, logo, colors
- Support email, phone
- Email templates (subject, from, reply-to)
- Legal page URLs
- Social media links

#### 3. Email Configuration Refactoring

**Current Problem:** Config scattered across multiple files

**Proposed Solution:**

1. Create `types/email-admin.ts` with EmailAdminConfig
2. Create `data/strapi-mock/email-administration/configuration.json`
3. Reference global settings for shared data
4. Update all email config pages to use new structure

**What Changes:**

```
BEFORE:
- Hardcoded template names in component
- Branding settings in one file, SLA in another
- Email addresses duplicated

AFTER:
- All templates in global.settings.emailTemplates
- All SLA settings in email-admin.configuration.slaSettings
- Single branding config (used by email + footer + header)
```

### Implementation Checklist

```
GENERIC DATA TABLE
├── [ ] Extract from jobs-data-table.tsx
├── [ ] Create components/ui/generic-data-table.tsx
├── [ ] Add types/table.ts for generics
├── [ ] Create column factories in lib/table-columns/
├── [ ] Update email jobs table to use generic version
├── [ ] Test with email dashboard
├── [ ] Zero regressions: pnpm run build
└── [ ] Validate: all 160 pages build

GLOBAL SETTINGS
├── [ ] Create types/global-settings.ts
├── [ ] Create data/strapi-mock/global/settings.json
├── [ ] Update footer component to use settings
├── [ ] Update contact form handler
├── [ ] Update metadata generation
├── [ ] Test email templates in config page
├── [ ] Validate: tsc --noEmit
└── [ ] Validate: build

EMAIL CONFIG REFACTORING
├── [ ] Create types/email-admin.ts
├── [ ] Create data/strapi-mock/email-administration/configuration.json
├── [ ] Update /configuration/page.tsx to use both global + email-admin config
├── [ ] Update /configuration/template-management/page.tsx
├── [ ] Update /configuration/ab-testing/page.tsx
├── [ ] Update /infrastructure/send-configuration/page.tsx
├── [ ] Validate no breaking changes
├── [ ] Validate: tsc --noEmit
└── [ ] Validate: build
```

### File Structure

```
types/
├── global-settings.ts (NEW)
├── email-admin.ts (NEW)
├── table.ts (NEW)
└── dashboard.ts (existing)

data/strapi-mock/
├── global/ (NEW)
│   └── settings.json
└── email-administration/
    ├── configuration.json (NEW)
    └── (other files)

components/
├── ui/
│   └── generic-data-table.tsx (NEW)
└── admin/
    ├── email/
    │   └── email-jobs-table.tsx (UPDATED - uses generic)
    └── (other components)

lib/
└── table-columns/ (NEW)
    ├── factories.ts
    ├── email-jobs.ts
    ├── analytics.ts (future)
    └── financial.ts (future)
```

---

## Parallel Execution Strategy

### Week 1

- [ ] Start Generic DataTable extraction (2 days)
- [ ] Start Batch C Phase 1: Create articles mock files (2 days)
- [ ] Pair when dependencies emerge

### Week 2

- [ ] Complete Generic DataTable + validate (1 day)
- [ ] Complete Global Settings entity (2 days)
- [ ] Continue Batch C with types + page components (2 days)

### Week 2-3

- [ ] Email config refactoring (2-3 days)
- [ ] Complete Batch C types + pages (2-3 days)

### Week 3-4

- [ ] Final validation across both work streams
- [ ] Analytics/Financial column factories (future prep)
- [ ] Documentation + handoff

---

## Success Metrics

### Build Validation

✅ `pnpm exec tsc --noEmit` — 0 errors
✅ `pnpm run build` — 160/160 pages generated
✅ No TypeScript errors in output
✅ All routes accessible

### Type Safety

✅ No `any` types in new code
✅ All generics properly constrained
✅ All interfaces exported from types/
✅ Strict mode passes

### Functionality

✅ Batch C pages render correctly
✅ Related articles/case-studies link properly
✅ Generic data table works with email jobs
✅ Global settings used across 5+ components
✅ Email config pages load without errors

### Code Quality

✅ No breaking changes to existing pages
✅ No duplication of configuration
✅ Single source of truth for global config
✅ Reusable patterns for future features

---

## Risk Mitigation

| Risk                                     | Mitigation                                                       |
| ---------------------------------------- | ---------------------------------------------------------------- |
| Batch C complexity                       | Start with articles (simplest), validate before moving to others |
| DataTable generics difficult             | Create type-safe factories, test with email jobs first           |
| Email config migration breaks            | Keep old files as fallback, migrate gradually                    |
| Circular dependencies in global settings | No circular imports, all one-way references                      |
| Too much work in parallel                | Weekly sync-ups, clear handoff points between streams            |

---

## Command Quick Reference

```bash
# Validate TypeScript
pnpm exec tsc --noEmit

# Run full build
pnpm run build

# Watch for changes (development)
pnpm run dev

# Check specific file for errors
pnpm exec tsc --noEmit src/path/to/file.tsx

# View type errors
pnpm exec tsc --noEmit 2>&1 | grep -i error
```

---

## Key Learnings from Batch A/B

1. **Consistent Pattern Works:** Same JSON → Type → Component pattern scales
2. **Batch Approach Efficient:** 10 pages in 4 hours because pattern was reusable
3. **Type Safety Prevents Errors:** Zero errors in build after TypeScript validation
4. **Icon System Extensible:** Added 16 icons to 59-icon union, no regressions
5. **Build Validation Essential:** Always run full build after changes to catch issues early

**Applying to Batch C:**

- Use same pattern for detail pages
- Expect 8-12 hours for 4 page groups
- Run full build after each page type is complete
- All metadata validation required for static generation

---

## Next Steps

1. **Review & Approval:** Stakeholder sign-off on architecture
2. **Prepare Environment:** Create feature branch for Batch C + infrastructure
3. **Start Week 1:**
   - Task 1: Extract generic DataTable component (2 days)
   - Task 2: Create Batch C articles metadata + mocks (2 days)
4. **Daily:** 15-min standup on progress, blockers, dependency needs
5. **Weekly:** Full validation (tsc + build), documentation update

---

**Status:** ✅ Planning Complete | → Ready for Implementation  
**Owner:** Senior Architecture Discipline  
**Date:** 2026-02-25
