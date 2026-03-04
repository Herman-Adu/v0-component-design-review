# Test Strategy Summary - Content Library

**Date:** February 27, 2026  
**Status:** ✅ Complete & Validated  
**Approach:** Mock-based unit testing for behavior verification  

---

## Testing Philosophy

### Principle: Test Behavior, Not Implementation

Our tests focus on **what** the repository layer does, not **how** it does it. We test:
- ✅ Public API contracts (function signatures, return types)
- ✅ Data transformation logic (filtering, mapping)
- ✅ Error handling behavior (null returns, empty arrays)
- ✅ Business rules (required fields, date formats, uniqueness)

We do **NOT** test:
- ❌ File system operations
- ❌ JSON parsing internals
- ❌ Implementation details like cache strategies

---

## Mock Data Strategy

### Location
```
__tests__/
├── mocks/
│   ├── server-only.ts       # Mock for Next.js server-only package
│   └── article-data.ts      # Mock article test fixtures
└── content-library/
    ├── article-repository.test.ts
    ├── tutorial-repository.test.ts
    ├── case-study-repository.test.ts
    └── guide-repository.test.ts
```

### Mock Structure

**Mock Data:** `article-data.ts`
```typescript
export const mockArticles: Article[] = [
  {
    id: "1",
    slug: "test-article-security",
    title: "Test Security Article",
    // ... minimal, predictable data
  },
  // 3 articles covering: 2 categories × 3 levels
];
```

**Key Characteristics:**
- **Small:** 3 articles (not 29 production articles)
- **Predictable:** Known categories (security, performance), levels (beginner, intermediate, advanced)
- **Focused:** Tests specific filtering behaviors (2 security, 1 performance)
- **Fast:** No file I/O, instant execution

### Why Mocks?

| Aspect | Integration Tests (Real Data) | Unit Tests (Mocks) |
|--------|-------------------------------|---------------------|
| **Speed** | Slow (file reads, parsing) | Fast (in-memory) |
| **Reliability** | Flaky (depends on content changes) | Stable (controlled fixtures) |
| **Focus** | Tests content + code | Tests code only |
| **Debugging** | Hard (29 articles to trace) | Easy (3 articles, known state) |
| **CI/CD** | Requires data fixtures | Self-contained |

---

## Test Coverage

### Current Implementation: Article Repository

**File:** `__tests__/content-library/article-repository.test.ts`

#### Test Suites (6 total)

**1. listArticles()**
- ✅ Returns array
- ✅ Has required fields (id, slug, title, excerpt, level, category, readTime, publishedAt, tags)
- ✅ All slugs are unique

**2. listArticleSlugs()**
- ✅ Returns array of strings
- ✅ Count matches articles list

**3. getArticleRecordBySlug()**
- ✅ Returns record for valid slug
- ✅ Returns null for non-existent slug
- ✅ Content document has required structure (blocks, toc, layout, meta)

**4. getArticlesByCategory()**
- ✅ Filters correctly for "security" (2 articles)
- ✅ Filters correctly for "performance" (1 article)
- ✅ Returns empty array for non-existent category

**5. getArticlesByLevel()**
- ✅ Filters correctly for "beginner" (1 article)
- ✅ Filters correctly for "intermediate" (1 article)
- ✅ Filters correctly for "advanced" (1 article)

**6. Content Validation - Behavior Tests**
- ✅ All dates are valid ISO format (YYYY-MM-DD)
- ✅ All excerpts are non-empty
- ✅ All articles have at least one tag
- ✅ Content documents have required structure

**Total:** 18 test cases

---

## Vitest Configuration

### Setup Files

**vitest.config.ts:**
```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "server-only": path.resolve(__dirname, "./__tests__/mocks/server-only.ts"),
    },
  },
});
```

**Key Features:**
- Global test APIs (describe, it, expect)
- Node environment (no jsdom overhead)
- Path alias support (@/ for imports)
- "server-only" mocked for test environment

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

---

## Mocking Strategy: Vitest `vi.mock()`

### How It Works

```typescript
// 1. Define mock data
import { mockArticles, mockArticleContent } from "../mocks/article-data";

// 2. Mock the content layer BEFORE importing repository
vi.mock("@/lib/strapi/dashboard/content-library/articles/article-content", () => ({
  getArticleList: vi.fn(() => mockArticles),
  getArticleContentDocument: vi.fn((slug: string) => {
    const article = mockArticles.find((a) => a.slug === slug);
    return article ? mockArticleContent : null;
  }),
}));

// 3. NOW import repository (uses mocked content layer)
import {
  listArticles,
  getArticleRecordBySlug,
  // ...
} from "@/lib/strapi/dashboard/content-library/articles/article-repository";
```

**Result:** Repository logic runs with controlled mock data, no file system access.

---

## Benefits Achieved

### 1. Fast Execution

```bash
pnpm test
# Article Repository tests: 18 passed in 33ms
```

No file I/O = subsecond test runs.

### 2. Isolated Testing

Each test validates **one behavior**:
- Filtering by category → tests `.filter()` logic
- Null handling → tests edge case behavior
- Field validation → tests data contract

### 3. Predictable Assertions

```typescript
// ✅ GOOD: Explicit, deterministic
expect(filtered.length).toBe(2); // Mock has exactly 2 security articles

// ❌ BAD: Vague, breaks when content changes
expect(filtered.length).toBeGreaterThan(0); // Could be 1, 5, 20...
```

### 4. Easy Maintenance

**When adding a new repository function:**
1. Add test with mock data
2. Implement function
3. Run test (instant feedback)

**When real content changes:** Tests still pass (decoupled).

---

## Running Tests

### Command Line

```bash
# Run all tests once
pnpm test -- --run

# Watch mode (auto-rerun on save)
pnpm test

# Run specific file
pnpm test article-repository

# UI mode (interactive browser UI)
pnpm test:ui
```

### VS Code Integration

1. **Extension:** Vitest Explorer (`vitest.explorer`)
2. **Location:** Testing sidebar (flask icon)
3. **Features:**
   - See all tests in tree view
   - Run individual tests with play button
   - Debug with breakpoints
   - See pass/fail status inline

---

## Next Steps

### Apply Same Pattern to Other Sections

**Tutorial Repository:**
```bash
cp __tests__/mocks/article-data.ts __tests__/mocks/tutorial-data.ts
# Update types: Article → Tutorial
# Adapt test file: copy article-repository.test.ts structure
```

**Case Study Repository:** Same pattern  
**Guide Repository:** Same pattern

### Future Enhancements

1. **Snapshot Testing:** Compare rendered output structures
2. **Property-Based Testing:** Generate random valid data
3. **Performance Benchmarks:** Track query timing
4. **Coverage Reports:** `vitest --coverage`

---

## Summary: What Was Achieved

✅ **Mock-based unit testing** - Tests behavior, not implementation  
✅ **Fast execution** - 18 tests in 33ms  
✅ **Isolated from content changes** - Tests don't break when JSON files change  
✅ **Vitest configured** - IDE integration, watch mode, path aliases  
✅ **Type-safe mocks** - Full TypeScript compliance  
✅ **Build validated** - All tests pass, production build succeeds  

**Status:** Ready for parallel implementation across tutorials, case-studies, guides.
