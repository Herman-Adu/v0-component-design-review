# Implementation Guide Summary

**Created:** February 27, 2026  
**Task:** Replicate tutorials refactor pattern to Articles, Case-Studies, and Guides sections  
**Status:** Documentation Complete - Ready for Implementation

---

## Documentation Files Created

### 1. **REFACTOR_IMPLEMENTATION_GUIDE.md** (Primary Reference)

- Complete pattern architecture overview with visual flow diagrams
- Detailed explanation of each file's purpose in the refactoring
- Section-by-section implementation details for all 3 sections
- Type mappings and structure for each section
- Key patterns to remember (server-only, validation, caching, etc.)
- Validation checklist for ensuring correctness
- Success indicators for completion

### 2. **ARTICLES_REFACTOR_NOTES.md** (Articles-Specific)

- Detailed file-by-file changes needed for articles
- Complete list of 30 JSON files to import with categorization
- Exact code snippets for each file modification
- Implementation steps for articles only
- Current import dependencies and required changes

### 3. **CASE_STUDIES_REFACTOR_NOTES.md** (Case-Studies-Specific)

- Detailed file-by-file changes needed for case-studies
- Complete list of 16 JSON files to import with categorization
- Exact code snippets and modifications
- Implementation steps for case-studies
- Similar pattern to articles with 9 categories

### 4. **GUIDES_REFACTOR_NOTES.md** (Guides-Specific)

- Detailed file-by-file changes for guides
- List of 3 JSON files (simplest section)
- Guidance on handling guide-specific structure
- Important verification questions before implementation
- Simplest implementation pattern (fewest files, fewest JSON imports)

### 5. **REFACTOR_CHECKLIST.md** (Actionable Checklist)

- Phase-by-phase checklist for each section
- Organized by implementation steps (create, update, verify, test)
- Cross-section validation requirements
- File statistics before/after refactoring
- Copy-paste ready code templates for each file type
- Expected outcomes and success criteria

---

## Pattern Overview (Not Code - Just Notes)

### The Three-Layer Server Architecture

**Layer 1: Content Builder** (`{section}-content-builder.ts`)

- Imports all JSON files from `data/strapi-mock/dashboard/content-library/{section}/`
- Validates using Zod schema at server startup
- Generates typed list from document metadata
- Provides document retrieval by slug
- **Result:** 3 core functions + type exports

**Layer 2: Content Re-export** (`{section}-content.ts`)

- Simple re-exports from builder
- Abstracts builder implementation details
- **Result:** Clean, minimal file (~20-30 lines)

**Layer 3: Server API** (`{section}.ts`)

- Provides convenience functions (getBySlug, getByCategory, getByLevel, getAllSlugs)
- Uses builder functions internally
- Marked as `server-only`
- **Result:** Public API for server components

**Layer 4: Repository** (`{section}-repository.ts`)

- Combines list operations with content retrieval
- Provides `{Section}Record` interface (item + content)
- **Result:** Query layer abstraction

**Layer 5: View Models** (`{section}-view-models.ts`)

- Transforms domain models to display models
- Maintains transformation logic unchanged
- **Result:** UI-optimized data structures

**Layer 6: Async Page** (`app/.../page.tsx`)

- Async server component
- Fetches data using server API
- Passes data to client component
- **Result:** Data at page level, no hydration mismatch

**Layer 7: Client Component** (`{section}-client.tsx`)

- Has `'use client'` directive
- Handles all UI logic and interactivity
- Receives data as props
- **Result:** Clean separation of server/client concerns

---

## Key Implementation Principles

### 1. No Code Generation

- Uses static imports (not dynamic requires)
- Build-time validation (catches JSON errors immediately)
- All registries are plain objects mapped in code

### 2. Validation at Startup

- Every JSON file validated by Zod schema
- Throws helpful error immediately if invalid
- No runtime validation needed

### 3. Caching

- List generated once and cached
- Subsequent calls return cached copy
- Zero overhead after first access

### 4. Type Safety

- All types exported from builder
- Re-exported through content.ts
- Flows cleanly through all layers
- TypeScript catches import errors

### 5. Sorting

- Articles, Case-Studies: sorted by `publishedAt` (descending)
- Guides: simple structure, may have different sort logic
- Applied consistently across all sections

### 6. Function Naming

- `get{Section}List()` - returns all items (builder)
- `get{Section}ContentDocument(slug)` - returns document (builder)
- `getAll{Section}s()` - returns all (server API)
- `get{Section}BySlug(slug)` - returns one (server API)
- `get{Section}sByLevel()` - returns filtered (server API)
- `get{Section}sByCategory()` - returns filtered (server API)

### 7. No Breaking Changes

- All public functions maintain identical signatures
- All return types remain the same
- All filtering and sorting logic unchanged
- Only internal implementation changes

---

## Section-Specific Differences

| Aspect              | Articles   | Case-Studies | Guides     |
| ------------------- | ---------- | ------------ | ---------- |
| JSON Files          | 30         | 16           | 3          |
| Categories          | 11         | 9            | ?          |
| Has Levels          | Yes        | Yes          | ?          |
| Has Layout/TOC      | Yes        | Possibly     | No         |
| Block Types         | 30+        | Similar      | N/A        |
| Complexity          | High       | Medium       | Low        |
| Implementation Time | ~3-4 hours | ~2-3 hours   | ~1-2 hours |

---

## Implementation Order Recommendations

**Option 1: Sequential by Section (Recommended)**

1. Complete ARTICLES fully (builder + content + API + UI)
2. Then CASE-STUDIES (can copy patterns from articles)
3. Then GUIDES (simplest, can follow proven patterns)

- **Advantage:** Less context switching, patterns proven early
- **Advantage:** Can adjust if issues discovered
- **Time:** ~6-8 hours total

**Option 2: All Builders First**

1. Create all 3 builders
2. Create all 3 content files
3. Update all 3 server APIs
4. Update all 3 UI layers

- **Advantage:** Parallel structure understanding
- **Advantage:** All validation happens first
- **Time:** ~8-10 hours total

**Option 3: Layer-by-Layer**

1. Create all 3 builders
2. Update all content files
3. Update all server APIs
4. Update all repositories
5. Update all view models
6. Update all UI layers

- **Advantage:** Horizontal consistency
- **Time:** ~10-12 hours total

---

## Validation Flow

```
Create Builder
    ↓
[Run Build]
    ├─ JSON Validation: Any errors caught here
    └─ Success: Cache generated, ready to use
    ↓
Update Content
    ↓
[Type Check]
    ├─ Re-exports correct: No errors
    └─ Ready for next layer
    ↓
Update Server API
    ↓
[Type Check]
    ├─ Functions use builder correctly
    └─ Public API correct
    ↓
Update UI Layer
    ↓
[Full Build + Manual Test]
    ├─ Page renders async
    ├─ Data flows to client
    ├─ UI displays correctly
    └─ All interactions work
    ↓
Cross-Section Validation
    ├─ No legacy imports remain
    ├─ All 3 sections follow same pattern
    ├─ All type checking passes
    └─ All tests pass
    ↓
✅ COMPLETE
```

---

## Key Questions Before Starting

1. **Has the tutorials pattern been fully tested in production?**
   - If yes: safe to replicate exactly
   - If no: may need adjustments

2. **Are there any category/level filtering variations between sections?**
   - Articles: definite filtering needed
   - Case-Studies: definite filtering needed
   - Guides: unclear, may not need filtering

3. **Do all sections have async page components already?**
   - If no: may need to check for existing client components

4. **Are there any dynamic routes?**
   - Check for `/[slug]/` or `/[category]/` nested routes
   - May need similar async refactoring there too

5. **Is there any caching/revalidation strategy needed?**
   - Current implementation doesn't use `revalidatePath` or `revalidateTag`
   - Might be needed if content changes frequently

---

## Copy-Paste Safety Notes

All code snippets in the detailed notes are **pattern-based**, meaning:

- They show the structure and logic
- Variable/function names follow the `{Section}` pattern
- Need to be customized for each section (Articles, CaseStudy, Guide)
- Should be combined with actual types from your schema files
- Must list all actual JSON files from your data directory

**Do NOT copy-paste directly without substitution.**

---

## Success Criteria

Refactoring is successful when:

1. **Build passes:** `npm run build` with no errors
2. **Types pass:** Full TypeScript check with no errors
3. **Functionality unchanged:** Same list, same filtering, same sorting
4. **Data accessible:** All 3 sections have working list + detail pages
5. **No legacy imports:** Zero imports from `@/data/content-library/` in lib/strapi
6. **Async rendering:** All section pages are async server components
7. **Client separation:** All UI logic in client components only
8. **Tests passing:** All existing tests still pass
9. **Manual verification:** Click through list → detail for each section
10. **Performance:** No degradation from original implementation

---

## Expected Questions During Implementation

**Q: Can I mix patterns between sections?**
A: No. Keep all 3 sections identical for consistency and maintainability.

**Q: What if a JSON file has validation errors?**
A: Build will fail with a helpful error message. Fix the JSON or the schema, don't skip validation.

**Q: Do I need to update category/[category]/page.tsx routes?**
A: Check if they exist and follow same pattern (async page + client component).

**Q: What if guides don't have categories/levels?**
A: Remove those filtering functions from guides.ts. Keep the core pattern identical.

**Q: Can I do this incrementally?**
A: Yes, do one section at a time. Complete all 7 layers for that section before moving to next.

**Q: What about error boundaries and loading states?**
A: Keep existing implementations. Async pages may show loading.tsx while fetching (if it exists).

---

## Next Steps

1. **Review** REFACTOR_IMPLEMENTATION_GUIDE.md for complete understanding
2. **Choose** implementation order from recommendations above
3. **Start** with ARTICLES using ARTICLES_REFACTOR_NOTES.md
4. **Use** REFACTOR_CHECKLIST.md to track progress
5. **Follow** exact patterns from tutorials section for consistency
6. **Validate** each step before moving to next section
7. **Complete** all 3 sections following identical patterns

---

## Support Materials

All files created on February 27, 2026:

- ✅ REFACTOR_IMPLEMENTATION_GUIDE.md - Read first for full understanding
- ✅ ARTICLES_REFACTOR_NOTES.md - Reference during articles implementation
- ✅ CASE_STUDIES_REFACTOR_NOTES.md - Reference during case-studies implementation
- ✅ GUIDES_REFACTOR_NOTES.md - Reference during guides implementation
- ✅ REFACTOR_CHECKLIST.md - Use during implementation to track progress
- ✅ This summary document - Quick reference for overview

---

## Questions or Issues?

If questions arise during implementation:

1. **Check** REFACTOR_IMPLEMENTATION_GUIDE.md for pattern details
2. **Check** section-specific notes for that section
3. **Reference** tutorials implementation as the proven pattern
4. **Validate** using REFACTOR_CHECKLIST.md
5. **Type check** frequently with `npm run build`

All documentation is self-contained and cross-referenced.

---

**Ready to begin implementation. All necessary details provided.**
