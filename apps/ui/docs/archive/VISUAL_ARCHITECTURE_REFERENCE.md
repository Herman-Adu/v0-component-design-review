# Content Library Refactor - Visual Architecture Reference

## End-to-End Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       DATA SOURCE LAYER                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  /data/strapi-mock/dashboard/content-library/{section}/              │
│                                                                       │
│  Articles/     ├─ best-practices/                                    │
│                ├─ architecture/                                      │
│                ├─ forms/                                             │
│                ├─ security/                                          │
│                ├─ business/                                          │
│                ├─ testing/                                           │
│                ├─ devops/                                            │
│                ├─ rendering/                                         │
│                ├─ performance/                                       │
│                └─ ai-tooling/                                        │
│  (30 JSON files)                                                     │
│                                                                       │
│  Case-Studies/ ├─ performance/                                       │
│                ├─ security/                                          │
│                ├─ architecture/                                      │
│                ├─ forms/                                             │
│                ├─ rendering/                                         │
│                ├─ business/                                          │
│                ├─ cms/                                               │
│                ├─ refactoring/                                       │
│                └─ infrastructure/                                    │
│  (16 JSON files)                                                     │
│                                                                       │
│  Guides/       ├─ security-architecture.json                         │
│                ├─ deployment-guide.json                              │
│                └─ testing-strategy.json                              │
│  (3 JSON files)                                                      │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
                    [Static Imports at Build Time]
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BUILDER LAYER (NEW)                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  lib/strapi/dashboard/content-library/{section}/                    │
│  {section}-content-builder.ts                                        │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Input: Raw JSON documents from imports                        │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Registry: Maps slugs → raw JSON documents                     │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Validation: Zod schema validates each document at startup     │  │
│  │ (Throws error if invalid - catches bugs immediately)         │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Generation: Transforms metadata into typed list items         │  │
│  │ - Extract: slug, title, description, level, category, etc.   │  │
│  │ - Sort: by publishedAt (descending)                           │  │
│  │ - Add: generated id (String(index + 1))                       │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Caching: List cached after first generation                   │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Exports:                                                      │  │
│  │ - get{Section}List(): {Section}[]                            │  │
│  │ - get{Section}ContentDocument(slug): Document | null         │  │
│  │ - getAll{Section}ContentSlugs(): string[]                    │  │
│  │ - Types: {Section}, {Section}Level, {Section}Category, ...   │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  CONTENT RE-EXPORT LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  lib/strapi/dashboard/content-library/{section}/                    │
│  {section}-content.ts                                                │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Input: Exports from builder                                   │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Function: Re-export everything from builder                   │  │
│  │ (Abstracts builder implementation)                            │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Result: ~20-30 lines (all re-exports)                         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│               SERVER API LAYER (Public Interface)                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  lib/strapi/dashboard/content-library/{section}/                    │
│  {section}.ts (marked with 'import "server-only"')                  │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Input: get{Section}List() from content.ts                    │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Functions:                                                    │  │
│  │ - getAll{Sections}(): {Section}[] ────────┐                  │  │
│  │ - get{Section}BySlug(slug): {Section}     │                  │  │
│  │ - get{Section}sByLevel(level): {Section}[]│ All call          │  │
│  │ - get{Section}sByCategory(cat): {Section}[]│ get{Section}List()  │
│  │ - getAll{Section}Slugs(): string[]        │ under the hood   │  │
│  └────────────────────────────────────────────┘                  │  │
│                                                                       │
│  Type Exports: {Section}, {Section}Level, {Section}Category         │  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│              REPOSITORY & VIEW MODELS LAYERS                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  lib/strapi/dashboard/content-library/{section}/                    │
│  {section}-repository.ts                                             │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Input: Functions from {section}.ts                            │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Functions:                                                    │  │
│  │ - list{Sections}()                                            │  │
│  │ - list{Section}Slugs()                                        │  │
│  │ - get{Section}RecordBySlug(slug): {Section}Record             │  │
│  │   (Contains: {section} + content)                             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  {section}-view-models.ts                                            │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Input: {Section} from {section}.ts                            │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Function: to{Section}DetailViewModel(item): ViewModel         │  │
│  │ (Transforms domain model to UI-optimized model)               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                  ASYNC SERVER PAGE LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  app/(dashboard)/dashboard/content-library/{section}/                │
│  page.tsx                                                             │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Signature: async function {Section}Page()                     │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ 1. Import: getAll{Sections} from {section}.ts                │  │
│  │ 2. Fetch:  const items = getAll{Sections}()                  │  │
│  │ 3. Pass:   <{Section}PageClient items={items} />             │  │
│  │                                                               │  │
│  │ Result: Data fetched server-side, no hydration issues         │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                 ↓
┌─────────────────────────────────────────────────────────────────────┐
│                CLIENT COMPONENT RENDERING LAYER                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  app/(dashboard)/dashboard/content-library/{section}/                │
│  {section}-client.tsx                                                │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │ Directive: 'use client'                                       │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Props: {{ items: {Section}[] }}                               │  │
│  ├───────────────────────────────────────────────────────────────┤  │
│  │ Contains: All UI logic, state, hooks, interactivity           │  │
│  │                                                               │  │
│  │ ├─ useState() for client state                                │  │
│  │ ├─ useEffect() for side effects                               │  │
│  │ ├─ Filtering, sorting UI                                      │  │
│  │ ├─ Search functionality                                       │  │
│  │ ├─ Pagination controls                                        │  │
│  │ └─ Component rendering JSX                                    │  │
│  │                                                               │  │
│  │ No server calls, no data fetching (data in props)             │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│                   🖥️  RENDERED HTML IN BROWSER 🖥️                  │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Type Flow Diagram

```
{section}-content-builder.ts (SOURCE OF TRUTH)
│
├─ Defines: {Section}Level (union of literal strings)
├─ Defines: {Section}Category (union of literal strings)
├─ Defines: {Section}ContentMeta (interface with slug, title, etc.)
├─ Defines: {Section}ContentDocument (interface with meta + blocks/steps)
├─ Defines: {Section}ContentBlock (interface for content structure)
└─ Defines: {Section} (interface for list items)
    │
    └─→ {section}-content.ts (RE-EXPORT)
         │
         ├─→ {section}.ts (API FUNCTIONS)
         │   │
         │   ├─→ {section}-repository.ts (QUERY LAYER)
         │   │   │
         │   │   └─→ {section}-view-models.ts (TRANSFORMATION)
         │   │       │
         │   │       └─→ app/{section}/page.tsx (SERVER)
         │   │           │
         │   │           └─→ {section}-client.tsx (CLIENT UI)
         │   │
         │   └─→ app/{section}/page.tsx (SERVER)
         │       │
         │       └─→ {section}-client.tsx (CLIENT UI)
         │
         └─→ Components (receive {Section}[] via props)
             │
             └─→ Browser (rendered HTML)
```

---

## Validation & Error Flow

```
BUILD TIME (npm run build)
│
├─→ Import all JSON files (static imports)
├─→ Validate each with Zod schema
│   │
│   ├─ Valid ✓ → Store in validatedRegistry
│   │
│   └─ Invalid ✗ → THROW ERROR
│       │
│       └─ Message: "Invalid {section} content for "{slug}": {path}: {message}"
│          (Example: Invalid article for "my-article": meta.title: String must be non-empty)
│
├─→ Generate list from validated registry
├─→ Cache list for runtime
│
└─→ BUILD COMPLETES SUCCESSFULLY ✓

RUNTIME (app loads)
│
├─→ Server components call get{Section}List()
│   │
│   └─→ Returns cached list (pre-generated at build time)
│
├─→ getAll{Sections}() filters list if needed
├─→ Pass data to async page
├─→ Async page passes to client component
│
└─→ CLIENT RENDERS (no validation needed, data already safe)
```

---

## File Organization Visual

```
lib/strapi/dashboard/content-library/
│
├─ articles/
│  ├─ article-content-builder.ts      [NEW - 180 lines]
│  ├─ article-content.ts              [CHANGED - 20 lines, was 147]
│  ├─ articles.ts                     [CHANGED - import path]
│  ├─ article-repository.ts           [NO CHANGE]
│  ├─ article-view-models.ts          [NO CHANGE]
│  └─ article-schema.ts               [NO CHANGE]
│
├─ case-studies/
│  ├─ case-study-content-builder.ts   [NEW - 120 lines]
│  ├─ case-study-content.ts           [CHANGED - 15 lines, was 147]
│  ├─ case-studies.ts                 [CHANGED - import path]
│  ├─ case-study-repository.ts        [CHANGED - verify imports]
│  ├─ case-study-view-models.ts       [CHANGED - verify imports]
│  └─ case-study-schema.ts            [NO CHANGE]
│
└─ guides/
   ├─ guide-content-builder.ts        [NEW - 60 lines]
   ├─ guide-content.ts                [CHANGED - 10 lines, was 30]
   ├─ guides.ts                       [CHANGED - import path]
   ├─ guides-repository.ts            [CHANGED - verify imports]
   ├─ guide-view-models.ts            [CHANGED - verify imports]
   └─ guide-schema.ts                 [NO CHANGE]

app/(dashboard)/dashboard/content-library/
│
├─ articles/
│  ├─ page.tsx                        [CHANGED - async + delegate]
│  ├─ articles-client.tsx             [NEW - UI logic]
│  └─ [category]/...
│
├─ case-studies/
│  ├─ page.tsx                        [CHANGED - async + delegate]
│  ├─ case-studies-client.tsx         [NEW - UI logic]
│  └─ [category]/...
│
└─ guides/
   ├─ page.tsx                        [CHANGED - async + delegate]
   ├─ guides-client.tsx               [NEW - UI logic]
   └─ [category]/...
```

---

## Legend

```
[NEW]     = New file created
[CHANGED] = Existing file modified
[NO CHANGE] = Existing file unaffected

Lines in brackets = Approximate line count after refactor
```

---

## Quick Pattern Reference

| Layer      | File                           | Pattern               | Key Function                                 |
| ---------- | ------------------------------ | --------------------- | -------------------------------------------- |
| Data       | `{section}.json`               | JSON document         | Contains meta + content blocks               |
| Builder    | `{section}-content-builder.ts` | Registry + Validation | `get{Section}List()`                         |
| Content    | `{section}-content.ts`         | Re-exports            | Simple pass-through                          |
| API        | `{section}.ts`                 | Query functions       | `getAll{Sections}()`, `get{Section}BySlug()` |
| Repository | `{section}-repository.ts`      | Combined query        | `get{Section}RecordBySlug()`                 |
| ViewModel  | `{section}-view-models.ts`     | Transform             | `to{Section}DetailViewModel()`               |
| Server     | `page.tsx`                     | Async fetch           | Calls server API                             |
| Client     | `{section}-client.tsx`         | Interactive UI        | Renders data + handles state                 |

---

## Success Checklist Visual

```
PHASE 1: ARTICLES (30 JSON files)
├─ ✅ article-content-builder.ts created
├─ ✅ article-content.ts updated
├─ ✅ articles.ts import changed
├─ ✅ Type check passes
├─ ✅ Build passes
├─ ✅ articles/page.tsx async
├─ ✅ articles-client.tsx created
├─ ✅ UI renders and works
└─ ✅ No legacy imports

PHASE 2: CASE-STUDIES (16 JSON files)
├─ ✅ case-study-content-builder.ts created
├─ ✅ case-study-content.ts updated
├─ ✅ case-studies.ts import changed
├─ ✅ Repositories verified
├─ ✅ Type check passes
├─ ✅ Build passes
├─ ✅ case-studies/page.tsx async
├─ ✅ case-studies-client.tsx created
├─ ✅ UI renders and works
└─ ✅ No legacy imports

PHASE 3: GUIDES (3 JSON files)
├─ ✅ guide-content-builder.ts created
├─ ✅ guide-content.ts updated
├─ ✅ guides.ts import changed
├─ ✅ Type check passes
├─ ✅ Build passes
├─ ✅ guides/page.tsx async
├─ ✅ guides-client.tsx created
├─ ✅ UI renders and works
└─ ✅ No legacy imports

CROSS-SECTION VALIDATION
├─ ✅ All 3 sections follow identical pattern
├─ ✅ Type checking passes
├─ ✅ Full build passes
├─ ✅ All pages render
├─ ✅ All filtering works
├─ ✅ No legacy imports in lib/
└─ ✅ Ready for production
```

---

This visual reference summarizes the complete architectural transformation from legacy data structure to modern builder pattern across all three content sections.
