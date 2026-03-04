# Test Folder Structure - Handoff Document

**Date:** February 27, 2026  
**Status:** ✅ Complete - Integration tests implemented, future folders placeholders ready  
**Purpose:** Quick context recovery in case of rate limiting interruptions

---

## Quick Context

### What We Built

Refactored the content library with **clean architecture** principles:

- **6-layer server-first architecture** (Schema → Content Builder → Repository → View Models → Legacy API → Route Manifest)
- **Content types:** Articles, Tutorials, Case Studies, Guides
- **Tech stack:** Next.js 16, TypeScript, Zod validation, Strapi 5 (future), Atomic Design, Feature-based structure
- **SEO:** Comprehensive meta tags, sitemap generation, canonical URLs
- **Testing:** Mock-based integration tests for repository layer

### Key Architectural Documents (DO NOT READ ALL AT ONCE - RATE LIMIT RISK)

Read these strategically when needed:

1. `ARCHITECTURE.md` - Overall system architecture (566 lines)
2. `CONTENT_LIBRARY_ARCHITECTURE.md` - 6-layer content architecture (562 lines)
3. `TEST_STRATEGY_SUMMARY.md` - Testing philosophy (290 lines)
4. `TEST_SUITE_ORGANIZATION.md` - Test structure details (210 lines)

---

## Current Test Folder Structure

### ✅ IMPLEMENTED - Integration Tests

```
__tests__/
├── integration-test/                    # ✅ Integration tests (real repo behavior)
│   └── content-library/
│       ├── article-repository.test.ts   # ✅ 18 tests (list, slugs, getBySlug, filter by category/level)
│       ├── case-study-repository.test.ts # ✅ 18 tests (mirrors article structure)
│       ├── tutorial-repository.test.ts  # ✅ 18 tests (mirrors article structure)
│       └── guide-repository.test.ts     # ✅ 18 tests (mirrors article structure)
│
└── mocks/
    ├── server-only.ts                   # ✅ Mock for Next.js "server-only" package
    └── integration/                     # ✅ Mock data for integration tests
        └── content-library/
            ├── article-data.ts          # ✅ mockArticles (3) + mockArticleContent
            ├── case-study-data.ts       # ✅ mockCaseStudies (3) + mockCaseStudyContent
            ├── tutorial-data.ts         # ✅ mockTutorials (3) + mockTutorialContent
            └── guide-data.ts            # ✅ mockGuides (3) + mockGuideContent
```

**Test Count:** 72 tests total (18 per content type × 4 types)  
**All tests passing:** ✅ Validated as of Feb 27, 2026

---

### 🔮 PLACEHOLDER - Future Test Folders

```
__tests__/
├── unit/                               # 🔮 PLACEHOLDER - Pure logic tests (not implemented)
│   └── README.md                       # See future structure
│
├── e2e/                                # 🔮 PLACEHOLDER - End-to-end tests (not implemented)
│   └── README.md                       # See future structure
│
└── mocks/
    ├── unit/                           # 🔮 PLACEHOLDER - Unit test fixtures
    │   └── README.md
    └── e2e/                            # 🔮 PLACEHOLDER - E2E test fixtures
        └── README.md
```

---

## Test Philosophy Summary

### Integration Tests (Current Implementation)

**What they test:**

- Repository public API contracts
- Data filtering logic (by category, level)
- Null handling for non-existent slugs
- Data structure validation

**What they DON'T test:**

- File system operations
- JSON parsing internals
- Implementation details

**Mock Strategy:**

- Small dataset (3 items per type)
- Predictable categories/levels for filtering
- Fast in-memory execution

### Unit Tests (Future)

**Planned focus:**

- Pure functions (transformations, calculations)
- View model mappers
- Schema validation edge cases
- Utility functions
- Component render logic

### E2E Tests (Future)

**Planned focus:**

- User navigation journeys
- SEO tag rendering validation
- Accessibility compliance
- Cross-page interactions

---

## Running Tests

```bash
# Run all tests
pnpm test

# Run integration tests only
pnpm test __tests__/integration-test

# Run specific test file
pnpm test article-repository.test.ts

# Run with coverage
pnpm test:coverage
```

---

## Content Library File Structure

Quick reference to avoid searching:

```
lib/strapi/dashboard/content-library/
├── articles/
│   ├── article-schema.ts              # Zod validation schema
│   ├── article-content-builder.ts     # Import & validate JSON
│   ├── article-content.ts             # Export validated registry
│   ├── article-repository.ts          # Server-only data access layer
│   └── article-view-models.ts         # UI transformation
│
├── tutorials/                         # Same structure as articles
├── case-studies/                      # Same structure as articles
├── guides/                            # Same structure as articles
│
└── content-route-manifest.ts         # Unified route inventory for sitemap
```

---

## Key Locations

### Test Files

- Integration tests: `__tests__/integration-test/content-library/*.test.ts`
- Mock data: `__tests__/mocks/integration/content-library/*-data.ts`

### Content Data (JSON)

- Articles: `data/content-library/articles/*.json` (29 files)
- Tutorials: `data/content-library/tutorials/*.json` (15 files)
- Case Studies: `data/content-library/case-studies/*.json` (20 files)
- Guides: `data/content-library/guides/*.json` (3 files)

### Type Definitions

- Content types: `types/content-library.ts`
- Strapi types: `types/strapi.ts`

### Validation Scripts

- Content link validation: `scripts/validate-content-links.mjs` (prebuild gate)

---

## If Rate Limited - Safe Context Recovery

**DO NOT read all files in root at once!**

### Safe Approach:

1. **Read this document first** - You're here ✅
2. **Check specific files only when needed:**
   - Architecture overview? → Read first 150 lines of `ARCHITECTURE.md`
   - Content layer details? → Read first 150 lines of `CONTENT_LIBRARY_ARCHITECTURE.md`
   - Test details? → Read `TEST_STRATEGY_SUMMARY.md`
3. **Use targeted searches:**
   - `grep_search` for specific keywords in specific folders
   - `semantic_search` for concepts
   - `file_search` for exact file patterns

### What You'll Need to Know:

**Current state:**

- ✅ Integration tests complete (72 tests, all passing)
- ✅ Mock data structure complete
- ✅ Placeholder folders created for future unit/e2e tests
- ✅ Documentation up to date

**Recent work:**

- Created test folder structure matching requirements
- Implemented mock-based integration tests for all 4 content types
- Tests validate repository behavior without file system dependencies

---

## Next Steps (If Continuing)

Typical next tasks might be:

1. **Add more test coverage:**
   - Edge cases in existing integration tests
   - Error handling scenarios
   - Empty result set tests

2. **Implement unit tests:**
   - Schema validation tests
   - View model transformation tests
   - Utility function tests

3. **E2E tests:**
   - Set up Playwright/Cypress
   - Create user journey tests
   - SEO validation tests

4. **Performance:**
   - Add test performance benchmarks
   - Optimize mock data generation

---

## Test Commands Reference

```bash
# Install dependencies (if needed)
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test article-repository

# Run tests for specific describe block
pnpm test -t "listArticles"

# Build project (includes prebuild validation)
pnpm build

# Run content validation script
node scripts/validate-content-links.mjs
```

---

## Critical Notes

### DO NOT:

- ❌ Read all .md files in root at once (rate limit risk)
- ❌ Read all JSON content files (67 total files)
- ❌ List all files recursively without purpose
- ❌ Run broad searches without constraints

### DO:

- ✅ Use this handoff document as primary context
- ✅ Read specific sections of architecture docs as needed
- ✅ Use targeted file/grep searches
- ✅ Reference test files directly when debugging
- ✅ Check specific test or mock files when investigating issues

---

## Contact Points

### Key Files for Common Tasks

**Need to understand architecture?**

- This document (you're here)
- `ARCHITECTURE.md` lines 1-150 (overview)
- `CONTENT_LIBRARY_ARCHITECTURE.md` lines 1-150 (content layer)

**Need to modify tests?**

- Integration tests: `__tests__/integration-test/content-library/*.test.ts`
- Mock data: `__tests__/mocks/integration/content-library/*-data.ts`
- Test strategy: `TEST_STRATEGY_SUMMARY.md`

**Need to add new content type?**

- Follow pattern in `lib/strapi/dashboard/content-library/articles/`
- Create schema → content-builder → repository → view-models
- Add tests following `article-repository.test.ts` pattern
- Create mock data following `article-data.ts` pattern

**Need SEO/sitemap changes?**

- Route manifest: `lib/strapi/dashboard/content-library/content-route-manifest.ts`
- Sitemap route: `app/sitemap.ts`
- Validation: `scripts/validate-content-links.mjs`

---

**End of Handoff Document**  
_Last Updated: February 27, 2026_  
_Test Structure Status: Complete ✅_
