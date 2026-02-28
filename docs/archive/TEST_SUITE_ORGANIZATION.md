# Test Suite Organization - Final Structure

**Date:** February 27, 2026  
**Status:** ✅ Complete - Organized with consistent folder structure  

---

## Folder Structure

### Complete Test Organization

```
__tests__/
├── mocks/
│   ├── server-only.ts                    # Next.js server-only package mock
│   ├── content-library/                  # Content library mock data (mirrors lib structure)
│   │   ├── article-data.ts              # Article mock fixtures (3 test articles)
│   │   ├── case-study-data.ts           # Case study mock fixtures (3 test studies)
│   │   ├── tutorial-data.ts             # Tutorial mock fixtures (3 test tutorials)
│   │   └── guide-data.ts                # Guide mock fixtures (3 test guides)
│   │
│   └── [future: integration-fixtures/]  # Real data for integration tests (placeholder)
│
└── content-library/                      # Unit test files (mirrors lib structure)
    ├── article-repository.test.ts        # 18 tests - Article repository behavior
    ├── case-study-repository.test.ts     # 18 tests - Case study repository behavior
    ├── tutorial-repository.test.ts       # 18 tests - Tutorial repository behavior
    └── guide-repository.test.ts          # 18 tests - Guide repository behavior

[future: integration/]                    # Integration tests with real data
  └── content-library/
      ├── articles.integration.ts
      ├── tutorials.integration.ts
      ├── case-studies.integration.ts
      └── guides.integration.ts
```

### Mirrors Library Structure

**Library structure:**
```
lib/strapi/dashboard/content-library/
├── articles/
│   ├── article-content-builder.ts
│   ├── article-content.ts
│   ├── article-repository.ts
│   ├── article-schema.ts
│   └── article-view-models.ts
├── tutorials/
├── case-studies/
└── guides/
```

**Test structure now mirrors library:**
```
__tests__/
├── content-library/              # Matches lib structure
│   ├── article-repository.test.ts
│   ├── tutorial-repository.test.ts
│   ├── case-study-repository.test.ts
│   └── guide-repository.test.ts
└── mocks/
    └── content-library/          # Mock data organized by section
        ├── article-data.ts
        ├── tutorial-data.ts
        ├── case-study-data.ts
        └── guide-data.ts
```

---

## Mock Data Organization

### Location & Naming

```
__tests__/mocks/content-library/
├── article-data.ts              # mockArticles + mockArticleContent
├── case-study-data.ts           # mockCaseStudies + mockCaseStudyContent
├── tutorial-data.ts             # mockTutorials + mockTutorialContent
└── guide-data.ts                # mockGuides + mockGuideContent
```

### Import Pattern

In each test file:
```typescript
// Consistent import path reflects folder structure
import { mockArticles, mockArticleContent } from "../mocks/content-library/article-data";

// Then mock the content layer
vi.mock("@/lib/strapi/dashboard/content-library/articles/article-content", () => ({
  getArticleList: vi.fn(() => mockArticles),
  getArticleContentDocument: vi.fn((slug: string) => {
    const article = mockArticles.find((a) => a.slug === slug);
    return article ? mockArticleContent : null;
  }),
}));
```

---

## Test Coverage Summary

### 4 Repository Test Suites

| Repository | Test File | Fixtures | Tests | Coverage |
|------------|-----------|----------|-------|----------|
| Articles | `article-repository.test.ts` | `article-data.ts` | 18 | listArticles, listArticleSlugs, getBySlug, getByCategory, getByLevel, content validation |
| Tutorials | `tutorial-repository.test.ts` | `tutorial-data.ts` | 18 | Same pattern as articles |
| Case Studies | `case-study-repository.test.ts` | `case-study-data.ts` | 18 | Same pattern as articles |
| Guides | `guide-repository.test.ts` | `guide-data.ts` | 18 | Same pattern as articles |

**Total:** 72 unit tests with mock data

---

## Design Principles Achieved

### 1. **Structural Consistency**
- Test files mirror library files
- Mock data organized same as library  
- Same naming conventions across all sections

### 2. **Scalability**
- New sections (documentation, etc.) follow identical pattern
- Clear template for adding tests:
  1. Create mock data file: `__tests__/mocks/content-library/${section}-data.ts`
  2. Create test file: `__tests__/content-library/${section}-repository.test.ts`
  3. Use same test structure as articles/tutorials/case-studies/guides

### 3. **Clean Separation**
- Unit tests with mocks: `__tests__/content-library/` + `__tests__/mocks/content-library/`
- Integration tests (future): `__tests__/integration/` + `__tests__/mocks/integration-fixtures/`
- Real data isolated from unit tests

### 4. **Maintainability**
- Find test: Look in `__tests__/content-library/`
- Find fixtures: Look in `__tests__/mocks/content-library/`
- Same structure throughout codebase

---

## Running Tests

### Command Line
```bash
# Run all unit tests with mocks
pnpm test -- --run

# Watch mode (re-run on save)
pnpm test

# Run specific suite
pnpm test article-repository

# Interactive UI
pnpm test:ui
```

### VS Code
1. Install Vitest Explorer extension
2. Open Testing sidebar (flask icon)
3. See all 4 test suites
4. Click play button to run individual tests

---

## Future: Integration Tests Structure

When ready to add integration tests with real data:

```
__tests__/
├── content-library/              # Unit tests with mocks
│   ├── article-repository.test.ts
│   ├── tutorial-repository.test.ts
│   ├── case-study-repository.test.ts
│   └── guide-repository.test.ts
│
├── integration/                  # Integration tests with real data
│   └── content-library/
│       ├── articles.integration.test.ts    # Tests actual JSON files
│       ├── tutorials.integration.test.ts
│       ├── case-studies.integration.test.ts
│       └── guides.integration.test.ts
│
└── mocks/
    ├── content-library/          # Unit test fixtures
    │   ├── article-data.ts
    │   ├── tutorial-data.ts
    │   ├── case-study-data.ts
    │   └── guide-data.ts
    │
    └── integration-fixtures/     # Integration test data
        └── [shared test data]
```

---

## Summary

✅ **Organized:** Test files and mock data in consistent, mirrored structure  
✅ **Scalable:** Clear pattern for documentation and future sections  
✅ **Maintainable:** Find tests, mocks, and fixtures easily  
✅ **Unit-focused:** Mocks isolate behavior testing  
✅ **Ready for integration:** Structure supports future real-data tests  

**Status:** Ready to implement additional sections (documentation, etc.) following same pattern.
