# Content Library Refactoring Implementation Guide

## Pattern Replication for Articles, Case-Studies, and Guides

**Created:** February 27, 2026
**Pattern Reference:** Tutorials Refactor (Completed)

---

## Overview

This guide provides detailed implementation notes for replicating the completed **tutorials refactor pattern** to three remaining sections: **articles**, **case-studies**, and **guides**.

The tutorials refactor successfully eliminated dependency on `data/content-library/` legacy exports and established a build-time validated, content-builder pattern that:

- Validates all JSON content at server startup via Zod schemas
- Generates typed content lists from JSON metadata
- Provides type-safe document retrieval functions
- Separates server-side concerns from client-side rendering

---

## Pattern Architecture Overview

```
JSON Files (data/strapi-mock/dashboard/content-library/{section}/)
    ↓ (static imports)
{section}-content-builder.ts
    ├─ Validates documents via Zod schema
    ├─ Exports generateContentList() → generates list from metadata
    ├─ Exports getContentDocument(slug) → retrieves document
    ├─ Exports all types (Section, SectionLevel, SectionCategory, etc.)
    ↓
{section}-content.ts (re-exports from builder)
    ↓
{section}-repository.ts (uses builder functions for queries)
    ├─ listSections() → calls getContentList()
    ├─ getSectionBySlug(slug) → finds in list
    ├─ getSectionRecordBySlug(slug) → combines list + content
    ↓
{section}.ts (server-only functions)
    ├─ getAllSections() → calls listSections()
    ├─ getSectionsByLevel()
    ├─ getSectionsByCategory()
    ├─ getAllSectionSlugs()
    ↓
app/(dashboard)/dashboard/content-library/{section}/page.tsx (async server)
    ├─ Calls getAll{Sections}() from {section}.ts
    ├─ Passes data to {section}-client.tsx
    ↓
app/(dashboard)/dashboard/content-library/{section}/{section}-client.tsx
    └─ Client component with 'use client' directive
        └─ Handles all UI logic and interactions
```

---

## Key Patterns to Replicate

### 1. Content Builder Pattern (`{section}-content-builder.ts`)

**Purpose:** Single source of truth for all content validation and list generation.

**Key Components:**

- `import "server-only"` directive (prevents client-side bundle inclusion)
- Static imports of ALL JSON files at top of file
- Content registry object mapping slugs to raw JSON documents
- **Validation at startup:** `Object.fromEntries(Object.entries(registry).map(([slug, doc]) => { validate or throw }))`
- Caching mechanism for list generation
- Exported functions:
  - `get{Section}List(): Section[]` - generates list with id, slug, and all metadata
  - `get{Section}ContentDocument(slug): {Section}ContentDocument | null` - direct document lookup
  - `getAll{Section}ContentSlugs(): string[]` - for static generation

**List Generation Logic:**

```typescript
function generate{Section}List(): {Section}[] {
  return Object.entries(validatedContentRegistry)
    .map(([slug, document], index) => ({
      id: String(index + 1),
      slug: document.meta.slug,
      title: document.meta.title,
      description: document.meta.description,
      // ... all other metadata fields from document.meta
      // Include full content blocks or steps if needed
    }))
    .sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}
```

**Caching Pattern:**

```typescript
let cached{Section}List: {Section}[] | null = null;

export function get{Section}List(): {Section}[] {
  if (!cached{Section}List) {
    cached{Section}List = generate{Section}List();
  }
  return cached{Section}List;
}
```

---

### 2. Content Re-export File (`{section}-content.ts`)

**Purpose:** Simplified re-export interface that abstracts builder implementation.

**Changes Required:**

- Remove legacy imports from `@/data/content-library/{section}`
- Remove the registry and validation logic
- Replace with re-exports from `{section}-content-builder.ts`

**Pattern:**

```typescript
import "server-only";

export {
  get{Section}List,
  get{Section}ContentDocument,
  getAll{Section}ContentSlugs,
  type {Section}Level,
  type {Section}Category,
  type {Section},
  type {Section}ContentStep,
  type {Section}ContentMeta,
  type {Section}ContentDocument,
  type {Section}ContentBlock,
  type {Section}BlockType,
  type {Section}BlockLevel,
  // ... all exported types
} from "@/lib/strapi/dashboard/content-library/{section}/{section}-content-builder";
```

**Current Situation:**

- `article-content.ts` (147 lines) - imports JSON files directly, contains registry
- `case-study-content.ts` (147 lines) - imports JSON files directly, contains registry
- `guide-content.ts` (30 lines) - simple structure with basic registry

---

### 3. Repository Pattern (`{section}-repository.ts`)

**Purpose:** Query/access layer for sections. Combines list operations with content retrieval.

**Key Changes:**

- Update imports from `{section}-content.ts` instead of legacy `@/data/content-library/`
- Use new builder functions: `get{Section}List()` instead of hardcoded arrays
- Maintain same function signatures and return types

**Pattern:**

```typescript
import "server-only";

import {
  get{Section}List,
  get{Section}ContentDocument,
  type {Section},
  type {Section}ContentDocument,
} from "@/lib/strapi/dashboard/content-library/{section}/{section}-content";

export interface {Section}Record {
  {section}: {Section};
  content: {Section}ContentDocument;
}

export function list{Sections}(): {Section}[] {
  return get{Section}List();
}

export function list{Section}Slugs(): string[] {
  return get{Section}List().map(({section}) => {section}.slug);
}

export function get{Section}RecordBySlug(slug: string): {Section}Record | null {
  const {section} = get{Section}List().find(item => item.slug === slug);
  if (!{section}) return null;

  const content = get{Section}ContentDocument(slug);
  if (!content) return null;

  return { {section}, content };
}
```

**Current State:**

- `article-repository.ts` (34 lines) - already imports from articles.ts
- `case-study-repository.ts` - exists, needs update
- `guides-repository.ts` - exists, needs update

---

### 4. Main Export File (`{section}.ts`)

**Purpose:** Server-only public API for the section. Provides typed query functions.

**Key Changes:**

- Update imports to use builder via `{section}-content.ts`
- Re-export types
- Provide convenience functions

**Pattern:**

```typescript
import "server-only";

import {
  get{Section}List,
  type {Section},
  type {Section}Category,
  type {Section}Level,
} from "@/lib/strapi/dashboard/content-library/{section}/{section}-content";

export type { {Section}, {Section}Category, {Section}Level };

export function getAll{Sections}(): {Section}[] {
  return get{Section}List();
}

export function get{Section}BySlug(slug: string): {Section} | undefined {
  return get{Section}List().find(({section}) => {section}.slug === slug);
}

export function get{Section}sByLevel(level: {Section}Level): {Section}[] {
  return get{Section}List().filter(({section}) => {section}.level === level);
}

export function get{Section}sByCategory(category: {Section}Category): {Section}[] {
  return get{Section}List().filter(({section}) => {section}.category === category);
}

export function getAll{Section}Slugs(): string[] {
  return get{Section}List().map(({section}) => {section}.slug);
}
```

**Current State:**

- `articles.ts` (31 lines) - imports from `@/data/content-library/articles` (NEEDS UPDATE)
- `case-studies.ts` (exists) - check import source
- `guides.ts` (exists) - check import source

---

### 5. View Models (`{section}-view-models.ts`)

**Purpose:** Transform rich domain models into display-optimized view models.

**Key Changes:**

- Update import path from `{section}` module to match new builder exports
- Maintain same transformation logic

**Pattern:**

```typescript
import type { {Section} } from "@/lib/strapi/dashboard/content-library/{section}/{section}-content";

export interface {Section}DetailViewModel {
  id: string;
  slug: string;
  title: string;
  description: string; // or excerpt for articles
  level: {Section}["level"];
  category: {Section}["category"];
  publishedAt: string;
  tags: string[];
  // ... other view-specific fields
}

export function to{Section}DetailViewModel(
  {section}: {Section},
): {Section}DetailViewModel {
  return {
    id: {section}.id,
    slug: {section}.slug,
    title: {section}.title,
    // ... map all fields
  };
}
```

**Current State:**

- `article-view-models.ts` (34 lines) - imports from articles.ts ✓
- `case-study-view-models.ts` - needs check
- `guide-view-models.ts` - needs check

---

## Section-Specific Implementation Details

### ARTICLES Section

**Files to Create:**

1. **[article-content-builder.ts](lib/strapi/dashboard/content-library/articles/article-content-builder.ts)** (NEW)
   - Pattern: Tutorials content-builder.ts
   - Imports: ~30 JSON files from `data/strapi-mock/dashboard/content-library/articles/`
   - Types to export:
     - `ArticleLevel` = "beginner" | "intermediate" | "advanced"
     - `ArticleCategory` = "architecture" | "security" | "forms" | "performance" | "best-practices" | "rendering" | "business" | "accessibility" | "testing" | "devops" | "ai-tooling"
     - `ArticleBlockType` (already in article-content.ts - move to builder)
     - `ArticleBlockLevel` = "atom" | "molecule" | "organism"
     - `ArticleContentBlock` interface
     - `ArticleContentMeta` interface
     - `ArticleContentDocument` interface with meta + layout + toc + blocks
     - `Article` interface (list item with id, slug, and all metadata fields)
   - Functions to export:
     - `getArticleList(): Article[]`
     - `getArticleContentDocument(slug): ArticleContentDocument | null`
     - `getAllArticleContentSlugs(): string[]`
   - Schema validation: Use existing `articleContentDocumentSchema` from article-schema.ts

**Files to Modify:**

1. **[article-content.ts](lib/strapi/dashboard/content-library/articles/article-content.ts)**
   - Remove: JSON imports, registry, validation logic, getArticleContentDocument() function
   - Keep: Type exports (temporarily, re-export from builder)
   - Add: Re-exports from article-content-builder.ts
   - Result: 10-15 lines (down from ~147)

2. **[articles.ts](lib/strapi/dashboard/content-library/articles/articles.ts)**
   - Change import source: from `@/data/content-library/articles` → `@/lib/strapi/dashboard/content-library/articles/article-content`
   - Keep: Function signatures, logic remains identical
   - Affected functions: getAllArticles(), getArticleBySlug(), getArticlesByLevel(), getArticlesByCategory(), getAllArticleSlugs()

3. **[article-repository.ts](lib/strapi/dashboard/content-library/articles/article-repository.ts)**
   - Already correctly imports from articles.ts ✓
   - No changes needed if articles.ts is updated correctly

4. **[article-view-models.ts](lib/strapi/dashboard/content-library/articles/article-view-models.ts)**
   - Already imports from articles.ts ✓
   - No changes needed if articles.ts is updated correctly

5. **[article-schema.ts](lib/strapi/dashboard/content-library/articles/article-schema.ts)**
   - Keep as-is (already contains `articleContentDocumentSchema`)
   - No changes needed

**UI Layer Changes:**

1. **[app/(dashboard)/dashboard/content-library/articles/page.tsx](<app/(dashboard)/dashboard/content-library/articles/page.tsx>)**
   - Convert to: `export default async function ArticlesPage() { ... }`
   - Import: `getAllArticles` from articles.ts
   - Fetch: `const articles = getAllArticles();`
   - Render: `<ArticlesPageClient articles={articles} />`

2. **[app/(dashboard)/dashboard/content-library/articles/articles-client.tsx](<app/(dashboard)/dashboard/content-library/articles/articles-client.tsx>)** (NEW)
   - Add: `'use client'` directive
   - Extract: All UI logic and interactivity from articles/page.tsx
   - Props: `{ articles: Article[] }`

---

### CASE-STUDIES Section

**Files to Create:**

1. **[case-study-content-builder.ts](lib/strapi/dashboard/content-library/case-studies/case-study-content-builder.ts)** (NEW)
   - Pattern: Identical to articles builder
   - Imports: ~16 JSON files from `data/strapi-mock/dashboard/content-library/case-studies/`
   - Types:
     - `CaseStudyLevel` = "beginner" | "intermediate" | "advanced"
     - `CaseStudyCategory` = "refactoring" | "performance" | "security" | "architecture" | "forms" | "cms" | "business" | "rendering" | "infrastructure"
     - `CaseStudyBlockType`, `CaseStudyBlockLevel`, `CaseStudyContentBlock`
     - `CaseStudyContentMeta`, `CaseStudyContentDocument`
     - `CaseStudy` (list item interface)
   - Functions: getCaseStudyList(), getCaseStudyContentDocument(), getAllCaseStudyContentSlugs()

**Files to Modify:**

1. **[case-study-content.ts](lib/strapi/dashboard/content-library/case-studies/case-study-content.ts)**
   - Same pattern as article-content.ts
   - Remove registry/validation, re-export from builder
   - Result: ~10-15 lines

2. **[case-studies.ts](lib/strapi/dashboard/content-library/case-studies/case-studies.ts)**
   - Check current import source
   - Update if importing from legacy data/content-library
   - Change to import from case-study-content.ts
   - Keep same function signatures

3. **[case-study-repository.ts](lib/strapi/dashboard/content-library/case-studies/case-study-repository.ts)**
   - Update imports from case-study-content.ts
   - Use getCaseStudyList() and getCaseStudyContentDocument()

4. **[case-study-view-models.ts](lib/strapi/dashboard/content-library/case-studies/case-study-view-models.ts)**
   - Update import source to case-study-content.ts if needed

5. **[case-study-schema.ts](lib/strapi/dashboard/content-library/case-studies/case-study-schema.ts)**
   - Keep as-is (already has validation schema)

**UI Layer Changes:**

1. **[app/(dashboard)/dashboard/content-library/case-studies/page.tsx](<app/(dashboard)/dashboard/content-library/case-studies/page.tsx>)**
   - Convert to async server component
   - Import from case-studies.ts
   - Delegate UI to case-studies-client.tsx

2. **[app/(dashboard)/dashboard/content-library/case-studies/case-studies-client.tsx](<app/(dashboard)/dashboard/content-library/case-studies/case-studies-client.tsx>)** (NEW)
   - Extract UI logic from case-studies/page.tsx
   - 'use client' directive

---

### GUIDES Section

**Files to Create:**

1. **[guide-content-builder.ts](lib/strapi/dashboard/content-library/guides/guide-content-builder.ts)** (NEW)
   - Pattern: Same as others
   - Imports: ~3 JSON files from `data/strapi-mock/dashboard/content-library/guides/`
   - Current guide-content.ts is very basic (30 lines) - simpler structure
   - Types:
     - `GuideLevel` (if applicable)
     - `GuideCategory` (if applicable)
     - `GuideContentBlock` (if applicable)
     - `Guide` interface
   - Functions: getGuideList(), getGuideContentDocument(), getAllGuideContentSlugs()

**Files to Modify:**

1. **[guide-content.ts](lib/strapi/dashboard/content-library/guides/guide-content.ts)**
   - Current structure is minimal - replace with builder re-exports
   - Result: ~10 lines

2. **[guides.ts](lib/strapi/dashboard/content-library/guides/guides.ts)**
   - Check current import source (likely imports from guide-content.ts)
   - Update if needed, maintain same API

3. **[guides-repository.ts](lib/strapi/dashboard/content-library/guides/guides-repository.ts)**
   - Update imports from guide-content.ts
   - Use getGuideList() and getGuideContentDocument()

4. **[guide-view-models.ts](lib/strapi/dashboard/content-library/guides/guide-view-models.ts)**
   - Update import source if needed

5. **[guide-schema.ts](lib/strapi/dashboard/content-library/guides/guide-schema.ts)**
   - Keep as-is

**UI Layer Changes:**

1. **[app/(dashboard)/dashboard/content-library/guides/page.tsx](<app/(dashboard)/dashboard/content-library/guides/page.tsx>)**
   - Convert to async server component
   - Fetch guides and pass to guides-client.tsx

2. **[app/(dashboard)/dashboard/content-library/guides/guides-client.tsx](<app/(dashboard)/dashboard/content-library/guides/guides-client.tsx>)** (NEW)
   - Extract UI logic, add 'use client'

---

## Implementation Order (Recommended)

### Phase 1: Prepare Content Builders

1. Create `article-content-builder.ts` with full pattern
2. Create `case-study-content-builder.ts`
3. Create `guide-content-builder.ts`
4. **Validate:** Each builder should export all types and functions

### Phase 2: Update Content Files

1. Update `article-content.ts` to re-export from builder
2. Update `case-study-content.ts` to re-export from builder
3. Update `guide-content.ts` to re-export from builder
4. **Validate:** No runtime changes to public API

### Phase 3: Update Server Layer

1. Update `articles.ts` import source (data/content-library → article-content)
2. Update `case-studies.ts` import source if needed
3. Update `guides.ts` import source if needed
4. Check all repository and view-model files for correct imports
5. **Validate:** All functions still work identically

### Phase 4: Update UI Components

1. Convert `articles/page.tsx` to async server component + articles-client.tsx
2. Convert `case-studies/page.tsx` to async server component + case-studies-client.tsx
3. Convert `guides/page.tsx` to async server component + guides-client.tsx
4. **Validate:** UI renders correctly, data flows from server → client

### Phase 5: Verification

1. Run type checker for all modified files
2. Test each section's list and detail pages
3. Verify no `data/content-library/` imports remain in lib/strapi
4. Verify all exports from builders are used correctly

---

## Type Mappings by Section

### Articles Types

| Type                     | Location (After Refactor)  | Origin                                              |
| ------------------------ | -------------------------- | --------------------------------------------------- |
| `Article`                | article-content-builder.ts | generated list item                                 |
| `ArticleLevel`           | article-content-builder.ts | "beginner" \| "intermediate" \| "advanced"          |
| `ArticleCategory`        | article-content-builder.ts | 11 defined categories                               |
| `ArticleBlockType`       | article-content-builder.ts | 30+ block type strings                              |
| `ArticleContentBlock`    | article-content-builder.ts | type + atomicLevel + props                          |
| `ArticleContentMeta`     | article-content-builder.ts | slug + title + description + level + category + ... |
| `ArticleContentDocument` | article-content-builder.ts | meta + layout + toc + blocks                        |
| Re-exported in           | article-content.ts         | for convenience                                     |

### Case-Studies Types

| Type                       | Location (After Refactor)     | Notes                                     |
| -------------------------- | ----------------------------- | ----------------------------------------- |
| `CaseStudy`                | case-study-content-builder.ts | generated list item                       |
| `CaseStudyLevel`           | case-study-content-builder.ts | 3 levels                                  |
| `CaseStudyCategory`        | case-study-content-builder.ts | 9 defined categories                      |
| `CaseStudyBlockType`       | case-study-content-builder.ts | similar to articles                       |
| `CaseStudyContentBlock`    | case-study-content-builder.ts | same structure as articles                |
| `CaseStudyContentMeta`     | case-study-content-builder.ts | similar to articles                       |
| `CaseStudyContentDocument` | case-study-content-builder.ts | meta + blocks (might not have layout/toc) |

### Guides Types

| Type              | Location (After Refactor) | Notes                                |
| ----------------- | ------------------------- | ------------------------------------ |
| `Guide`           | guide-content-builder.ts  | generated list item                  |
| Simpler structure | -                         | Only 3 guides, check existing schema |

---

## Key Patterns to Remember

### 1. Server-Only Directive

```typescript
import "server-only"; // At top of every server-side lib file
```

### 2. Validation at Startup

```typescript
const validatedRegistry = Object.fromEntries(
  Object.entries(registry).map(([slug, doc]) => {
    const result = schema.safeParse(doc);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      throw new Error(`Invalid for "${slug}": ${issues}`);
    }
    return [slug, result.data];
  }),
);
```

### 3. Caching Pattern

```typescript
let cachedList: Item[] | null = null;

export function getList(): Item[] {
  if (!cachedList) {
    cachedList = generateList();
  }
  return cachedList;
}
```

### 4. List Generation

- Map registry entries to list items
- Include generated `id` field (String(index + 1))
- Include all metadata fields from JSON
- Sort by `publishedAt` (descending)

### 5. Async Server Component Pattern

```typescript
// app/(dashboard)/dashboard/content-library/{section}/page.tsx
import Client from "./{section}-client";
import { getAll{Sections} } from "@/lib/strapi/dashboard/content-library/{section}/{section}";

export default async function {Section}Page() {
  const items = getAll{Sections}();
  return <Client items={items} />;
}
```

### 6. Client Component Pattern

```typescript
// app/(dashboard)/dashboard/content-library/{section}/{section}-client.tsx
'use client';

import type { {Section} } from "@/lib/strapi/dashboard/content-library/{section}/{section}-content";

interface Props {
  items: {Section}[];
}

export default function {Section}Client({ items }: Props) {
  // All UI logic and hooks here
}
```

---

## Validation Checklist

After each section is complete, verify:

- [ ] All JSON files in `data/strapi-mock/dashboard/content-library/{section}/` are imported in builder
- [ ] Zod schema validation runs at startup (errors if invalid JSON)
- [ ] `get{Section}List()` returns array sorted by publishedAt (descending)
- [ ] `get{Section}ContentDocument(slug)` returns correct document
- [ ] No imports from `@/data/content-library/{section}` remain in lib/strapi
- [ ] All types are exported from builder via content.ts
- [ ] Repository functions work correctly (list, getBySlug, getSlugs)
- [ ] Server-only functions in {section}.ts are server-only
- [ ] Page components are async and import from server API
- [ ] Client components have 'use client' directive
- [ ] Types flow correctly: builder → content → repo → viewmodels → components
- [ ] No type errors in entire section

---

## Notes on Specific Challenges

### Articles

- Most complex: ~30 JSON files, 11 categories, complex block structure
- Has layout + TOC support - ensure maintained in builder
- Many block types - validate all in schema

### Case-Studies

- Medium complexity: ~16 JSON files
- Similar block structure to articles
- May not need layout/TOC - verify current schema

### Guides

- Simplest: Only 3 JSON files
- Basic structure - may not need all the ceremony
- Follow same pattern but structure will be simpler

---

## Success Indicators

Refactoring is complete when:

1. All three sections follow identical architectural pattern
2. No legacy `data/content-library` imports in lib/strapi
3. All sections have builder → content → repo → server API → async page → client component flow
4. All content validated at server startup with helpful error messages
5. All types properly exported and used
6. No runtime behavior changes (same data, same functions, same results)
