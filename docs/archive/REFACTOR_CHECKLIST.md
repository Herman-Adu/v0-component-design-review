# Content Library Refactor - Quick Reference Checklist

## Implementation Phases

### PHASE 1: ARTICLES Section

#### 1.1 Create Builders

- [ ] Create `lib/strapi/dashboard/content-library/articles/article-content-builder.ts`
  - [ ] Import all 30 JSON files from `data/strapi-mock/dashboard/content-library/articles/`
  - [ ] Organize imports by subdirectory (best-practices, architecture, forms, security, business, testing, devops, rendering, performance, ai-tooling)
  - [ ] Create articleContentRegistry with all 30 entries
  - [ ] Add Zod validation using `articleContentDocumentSchema` from article-schema.ts
  - [ ] Implement `generateArticleList()` function
  - [ ] Implement caching pattern with `cachedArticleList`
  - [ ] Export: `getArticleList()`, `getArticleContentDocument()`, `getAllArticleContentSlugs()`
  - [ ] Export all types: `ArticleLevel`, `ArticleCategory`, `Article`, `ArticleContentBlock`, etc.

#### 1.2 Update Content Layer

- [ ] Update `lib/strapi/dashboard/content-library/articles/article-content.ts`
  - [ ] Remove all JSON imports (30+ lines)
  - [ ] Remove articleContentRegistry
  - [ ] Remove validatedArticleContentRegistry
  - [ ] Remove getArticleContentDocument() function
  - [ ] Add re-exports from article-content-builder.ts
  - [ ] Keep TOCItem type if still needed elsewhere
  - [ ] Result: ~20-30 lines (down from ~147)

#### 1.3 Update Server API

- [ ] Update `lib/strapi/dashboard/content-library/articles/articles.ts`
  - [ ] Change import: `@/data/content-library/articles` → `./article-content`
  - [ ] Update `getAllArticles()` to return `getArticleList()`
  - [ ] Keep all other functions identical (signatures unchanged)

#### 1.4 Verify Surrounding Files

- [ ] Verify `lib/strapi/dashboard/content-library/articles/article-repository.ts`
  - [ ] Should import from `articles.ts` ✓
  - [ ] Should use `getAllArticles()` ✓
  - [ ] No changes needed if articles.ts is updated correctly
- [ ] Verify `lib/strapi/dashboard/content-library/articles/article-view-models.ts`
  - [ ] Should import from `articles.ts` ✓
  - [ ] No changes needed if articles.ts is updated correctly

- [ ] Verify `lib/strapi/dashboard/content-library/articles/article-schema.ts`
  - [ ] Keep as-is ✓
  - [ ] Contains `articleContentDocumentSchema`

#### 1.5 Update UI Layer

- [ ] Update `app/(dashboard)/dashboard/content-library/articles/page.tsx`
  - [ ] Make it async: `export default async function ArticlesPage()`
  - [ ] Import: `getAllArticles` from articles.ts
  - [ ] Call: `const articles = getAllArticles();`
  - [ ] Render: `<ArticlesPageClient articles={articles} />`

- [ ] Create `app/(dashboard)/dashboard/content-library/articles/articles-client.tsx`
  - [ ] Add `'use client'` directive
  - [ ] Extract UI logic from articles/page.tsx
  - [ ] Accept props: `{ articles: Article[] }`
  - [ ] Return JSX with all interactivity

#### 1.6 Testing & Validation

- [ ] Type check: `npm run build` succeeds
- [ ] No TypeScript errors in articles files
- [ ] Articles list page renders correctly
- [ ] Article detail page works
- [ ] Verify no imports from `@/data/content-library/articles` remain in lib/

---

### PHASE 2: CASE-STUDIES Section

#### 2.1 Create Builders

- [ ] Create `lib/strapi/dashboard/content-library/case-studies/case-study-content-builder.ts`
  - [ ] Import all 16 JSON files from `data/strapi-mock/dashboard/content-library/case-studies/`
  - [ ] Organize imports by subdirectory (performance, security, architecture, forms, rendering, business, cms, refactoring, infrastructure)
  - [ ] Create caseStudyContentRegistry with all 16 entries
  - [ ] Add Zod validation using `caseStudyContentDocumentSchema`
  - [ ] Implement `generateCaseStudyList()` function
  - [ ] Implement caching pattern
  - [ ] Export: `getCaseStudyList()`, `getCaseStudyContentDocument()`, `getAllCaseStudyContentSlugs()`
  - [ ] Export all types: `CaseStudyLevel`, `CaseStudyCategory`, `CaseStudy`, `CaseStudyContentBlock`, etc.

#### 2.2 Update Content Layer

- [ ] Update `lib/strapi/dashboard/content-library/case-studies/case-study-content.ts`
  - [ ] Remove all JSON imports (16+ lines)
  - [ ] Remove registry and validation
  - [ ] Add re-exports from case-study-content-builder.ts
  - [ ] Keep TOCItem type if needed
  - [ ] Result: ~20-30 lines (down from ~147)

#### 2.3 Update Server API

- [ ] Update `lib/strapi/dashboard/content-library/case-studies/case-studies.ts`
  - [ ] Verify current import source
  - [ ] Change import to use case-study-content.ts if needed
  - [ ] Update functions to use `getCaseStudyList()`
  - [ ] Implement: `getAllCaseStudies()`, `getCaseStudyBySlug()`, `getCaseStudiesByLevel()`, `getCaseStudiesByCategory()`, `getAllCaseStudySlugs()`

#### 2.4 Verify Surrounding Files

- [ ] Verify `lib/strapi/dashboard/content-library/case-studies/case-study-repository.ts`
  - [ ] Update imports to use case-study-content.ts
  - [ ] Use `getCaseStudyList()` and `getCaseStudyContentDocument()`

- [ ] Verify `lib/strapi/dashboard/content-library/case-studies/case-study-view-models.ts`
  - [ ] Update import source if needed

- [ ] Verify `lib/strapi/dashboard/content-library/case-studies/case-study-schema.ts`
  - [ ] Keep as-is ✓

#### 2.5 Update UI Layer

- [ ] Update `app/(dashboard)/dashboard/content-library/case-studies/page.tsx`
  - [ ] Make async
  - [ ] Import getAllCaseStudies
  - [ ] Render CaseStudiesPageClient

- [ ] Create `app/(dashboard)/dashboard/content-library/case-studies/case-studies-client.tsx`
  - [ ] Add 'use client'
  - [ ] Extract UI logic
  - [ ] Accept: `{ caseStudies: CaseStudy[] }`

#### 2.6 Testing & Validation

- [ ] Type check: `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] Case-studies list and detail pages work
- [ ] No legacy imports remain

---

### PHASE 3: GUIDES Section

#### 3.1 Create Builders

- [ ] Create `lib/strapi/dashboard/content-library/guides/guide-content-builder.ts`
  - [ ] Import all 3 JSON files from `data/strapi-mock/dashboard/content-library/guides/`
  - [ ] Create guideContentRegistry
  - [ ] Add Zod validation using `guideSchema`
  - [ ] Implement `generateGuideList()` function
  - [ ] Implement caching pattern
  - [ ] Export: `getGuideList()`, `getGuideContentDocument()`, `getAllGuideContentSlugs()`
  - [ ] Export: `Guide` type

#### 3.2 Update Content Layer

- [ ] Update `lib/strapi/dashboard/content-library/guides/guide-content.ts`
  - [ ] Remove JSON imports (3 lines)
  - [ ] Remove registry
  - [ ] Add re-exports from guide-content-builder.ts
  - [ ] Result: ~10 lines

#### 3.3 Update Server API

- [ ] Update `lib/strapi/dashboard/content-library/guides/guides.ts`
  - [ ] Verify current import source
  - [ ] Change import if needed
  - [ ] Update functions to use `getGuideList()`
  - [ ] Implement: `getAllGuides()`, `getGuideBySlug()`, `getAllGuideSlugs()`

#### 3.4 Verify Surrounding Files

- [ ] Verify `lib/strapi/dashboard/content-library/guides/guides-repository.ts`
  - [ ] Update imports and use new functions

- [ ] Verify `lib/strapi/dashboard/content-library/guides/guide-view-models.ts`
  - [ ] Update import source if needed

- [ ] Verify `lib/strapi/dashboard/content-library/guides/guide-schema.ts`
  - [ ] Keep as-is ✓

#### 3.5 Update UI Layer

- [ ] Update `app/(dashboard)/dashboard/content-library/guides/page.tsx`
  - [ ] Make async
  - [ ] Import getAllGuides
  - [ ] Render GuidesPageClient

- [ ] Create `app/(dashboard)/dashboard/content-library/guides/guides-client.tsx`
  - [ ] Add 'use client'
  - [ ] Extract UI logic
  - [ ] Accept: `{ guides: Guide[] }`

#### 3.6 Testing & Validation

- [ ] Type check: `npm run build` succeeds
- [ ] Guides list and detail pages work
- [ ] No legacy imports remain

---

## Cross-Section Validation

After completing all three sections:

- [ ] No `import` statements from `@/data/content-library/` in any lib/strapi files
- [ ] All builder files follow identical pattern
- [ ] All content files are re-export-only (~10-30 lines each)
- [ ] All server-only files use same function naming convention
- [ ] All list pages are async and delegate to client components
- [ ] All client components have 'use client' directive
- [ ] All three sections can independently:
  - [ ] List items with filtering (by category, level, etc.)
  - [ ] Retrieve individual items by slug
  - [ ] Retrieve complete content documents
  - [ ] Generate static paths for detail pages
- [ ] Type safety maintained throughout all layers
- [ ] No runtime behavior changes
- [ ] All tests pass
- [ ] Build completes without errors

---

## File Statistics

### Articles Section (30 JSON files)

| File                       | Before | After | Change                                                      |
| -------------------------- | ------ | ----- | ----------------------------------------------------------- |
| article-content-builder.ts | NEW    | ~180  | +180                                                        |
| article-content.ts         | ~147   | ~20   | -127                                                        |
| articles.ts                | ~31    | ~31   | 0 (import path change only)                                 |
| article-repository.ts      | ~34    | ~34   | 0 (no change)                                               |
| article-view-models.ts     | ~34    | ~34   | 0 (no change)                                               |
| articles/page.tsx          | ?      | ~10   | async + delegate                                            |
| articles-client.tsx        | NEW    | ?     | extracted UI                                                |
| **Total**                  |        |       | **Consolidates 147 lines of imports/registry into builder** |

### Case-Studies Section (16 JSON files)

| File                          | Before | After | Change                                         |
| ----------------------------- | ------ | ----- | ---------------------------------------------- |
| case-study-content-builder.ts | NEW    | ~120  | +120                                           |
| case-study-content.ts         | ~147   | ~15   | -132                                           |
| case-studies.ts               | ?      | ?     | import path change                             |
| case-study-repository.ts      | ?      | ?     | verify imports                                 |
| case-study-view-models.ts     | ?      | ?     | verify imports                                 |
| case-studies/page.tsx         | ?      | ~10   | async + delegate                               |
| case-studies-client.tsx       | NEW    | ?     | extracted UI                                   |
| **Total**                     |        |       | **Consolidates imports/registry into builder** |

### Guides Section (3 JSON files)

| File                     | Before | After | Change                              |
| ------------------------ | ------ | ----- | ----------------------------------- |
| guide-content-builder.ts | NEW    | ~60   | +60                                 |
| guide-content.ts         | ~30    | ~10   | -20                                 |
| guides.ts                | ?      | ?     | import path change                  |
| guides-repository.ts     | ?      | ?     | verify imports                      |
| guide-view-models.ts     | ?      | ?     | verify imports                      |
| guides/page.tsx          | ?      | ~10   | async + delegate                    |
| guides-client.tsx        | NEW    | ?     | extracted UI                        |
| **Total**                |        |       | **Simplest builder (only 3 files)** |

---

## Key Patterns (Copy-Paste Reference)

### Content Builder Export Template

```typescript
export function get{Section}List(): {Section}[] {
  if (!cached{Section}List) {
    cached{Section}List = generate{Section}List();
  }
  return cached{Section}List;
}

export function get{Section}ContentDocument(slug: string): {Section}ContentDocument | null {
  return validated{Section}ContentRegistry[slug] ?? null;
}

export function getAll{Section}ContentSlugs(): string[] {
  return Object.keys(validated{Section}ContentRegistry);
}
```

### Content Re-export Template

```typescript
import "server-only";

export {
  get{Section}List,
  get{Section}ContentDocument,
  getAll{Section}ContentSlugs,
  type {Section},
  type {Section}Level,
  type {Section}Category,
} from "@/lib/strapi/dashboard/content-library/{section}/{section}-content-builder";
```

### Server API Template

```typescript
export function getAll{Sections}(): {Section}[] {
  return get{Section}List();
}

export function get{Section}BySlug(slug: string): {Section} | undefined {
  return get{Section}List().find(({section}) => {section}.slug === slug);
}
```

### Async Page Template

```typescript
export default async function {Section}Page() {
  const items = getAll{Sections}();
  return <{Section}PageClient items={items} />;
}
```

### Client Component Template

```typescript
'use client';

interface Props {
  items: {Section}[];
}

export default function {Section}PageClient({ items }: Props) {
  // UI logic here
}
```

---

## Expected Outcomes

✅ **After Complete Refactor:**

- All three sections follow identical architectural pattern
- Content validation happens at server startup (catches JSON errors immediately)
- Types flow safely from builder → content → server API → client components
- No hardcoded data lists in legacy `data/content-library/` directory
- Zero runtime performance impact (same data, same algorithms)
- Async server components with data fetching at page level
- Client components focused on UI/interaction only
- Easy to add new content: just add JSON file and update import list
- Easy to modify structure: update schema in one place
