# Test Organization Consistency Lock

**Status:** 🔒 LOCKED GOVERNANCE - PREVENTS FUTURE DRIFT  
**Date:** February 28, 2026 (Session 3 - Corrected After Drift)  
**Severity:** CRITICAL - Test organization must be 100% consistent across all modules

---

## THE RULE (No Exceptions)

### Repository Tests = INTEGRATION Tests (NOT Unit Tests)

Repository tests are **always** integration tests because they test:

✅ Content Builder loads + validates JSON  
✅ Repository provides correct queries  
✅ View Models transform correctly  
✅ Full data flow in combination

**This is NOT unit testing.** Unit testing is testing functions in isolation. Repository tests require data, so they're integration tests.

---

## Pattern Mandate (Immutable, Applies Everywhere)

### Content Library (Established Reference)

```
lib/strapi/dashboard/content-library/
├── articles/
│   ├── article-repository.ts
│   ├── article-content.ts
│   ├── view-models.ts
│   └── (NO __tests__ folder here)
│
├── tutorials/
│   └── ... (same pattern)
│
├── case-studies/
│   └── ... (same pattern)
│
└── guides/
    └── ... (same pattern)

__tests__/
└── integration-test/content-library/
    ├── article-repository.test.ts           ✅ INTEGRATION
    ├── tutorial-repository.test.ts          ✅ INTEGRATION
    ├── case-study-repository.test.ts        ✅ INTEGRATION
    └── guide-repository.test.ts             ✅ INTEGRATION
```

### Documentation (New Module - MUST Match Content Library)

```
lib/strapi/documentation/
├── strategic/
│   ├── repository.ts
│   ├── content-builder.ts
│   ├── view-models.ts
│   └── (NO __tests__ folder here)
│
├── cms-reference/
│   └── ... (same pattern)
│
├── app-reference/
│   └── ... (same pattern)
│
└── infrastructure/
    └── ... (same pattern)

__tests__/
└── integration-test/documentation/
    ├── strategic-repository.test.ts         ✅ INTEGRATION
    ├── cms-reference-repository.test.ts     ✅ INTEGRATION (future)
    ├── app-reference-repository.test.ts     ✅ INTEGRATION (future)
    └── infrastructure-repository.test.ts    ✅ INTEGRATION (future)
```

**Format Rule:** `[domain]-repository.test.ts`  
**Location Rule:** `__tests__/integration-test/[module]/`  
**Category:** INTEGRATION (always)

---

## Why This Is The Only Way

### What Repository Tests Actually Do

```typescript
// From strategic-repository.test.ts
describe("End-to-End Data Flow", () => {
  it("should load articles from JSON at module init", async () => {
    // 1. Content Builder loads JSON ← requires filesystem
    // 2. Content Builder validates with Zod schema ← requires schema
    // 3. Repository queries the loaded data ← requires repository
    // 4. Returns domain model ← requires business logic
    const articles = await repository.listAll();
    expect(articles.length).toBeGreaterThanOrEqual(5);
  });

  it("should retrieve specific article by slug and transform to view model", async () => {
    // Full integration: JSON → Builder → Repository → View Model
    const article = await repository.getBySlug("system-vision-and-principles");
    const vm = toStrategicArticleListItemViewModel(article!);
    // All layers tested together
    expect(vm.slug).toBe("system-vision-and-principles");
    expect(vm.readTime).toBeDefined(); // computed property
  });
});
```

**This is integration testing:** Multiple layers (builder + repo + viewmodel) tested together.

### What Unit Tests Actually Are

Unit tests test **single functions in isolation**:

```typescript
// HYPOTHETICAL unit test (if we had one)
describe("computeReadTime", () => {
  it("should calculate read time from word count", () => {
    const readTime = computeReadTime(5000); // ← isolated function
    expect(readTime).toBe("25 min read");
  });
});

// This would go in __tests__/unit/documentation/ IF it tested
// a pure function with NO external data dependency.
// Repository tests are NOT pure functions - they load data.
```

---

## Current State (Corrected)

### ✅ CORRECT Structure

```
lib/strapi/documentation/strategic/
├── schema.ts
├── content-builder.ts
├── repository.ts
├── view-models.ts
└── index.ts
(NO __tests__ folder)

__tests__/
└── integration-test/documentation/
    └── strategic-repository.test.ts  ← Only one repository test file
```

**All repository testing happens in ONE location:**  
`__tests__/integration-test/[module]/[domain]-repository.test.ts`

**No duplicate repository tests in multiple locations.**

---

## How This Aligns with Content Library

| Item                         | Content Library                                                         | Documentation                                                           | Match? |
| ---------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------ |
| **Module location**          | `lib/strapi/dashboard/content-library/`                                 | `lib/strapi/documentation/`                                             | ✅     |
| **Domain folders**           | articles/ tutorials/ case-studies/ guides/                              | strategic/ cms-ref / app-ref/ infra/                                    | ✅     |
| **Data layer files**         | article-repository.ts, view-models.ts, etc.                             | repository.ts, view-models.ts, etc.                                     | ✅     |
| **Tests in code folder**     | NO                                                                      | NO                                                                      | ✅     |
| **Repository test location** | `__tests__/integration-test/content-library/article-repository.test.ts` | `__tests__/integration-test/documentation/strategic-repository.test.ts` | ✅     |
| **Repository test type**     | INTEGRATION                                                             | INTEGRATION                                                             | ✅     |
| **Repository test counts**   | 4 files (one per domain)                                                | 1 file (strategic), +3 future                                           | ✅     |

**Pattern: IDENTICAL across all modules.**

---

## The Drift That Happened (Why)

### Mistake 1: "Unit tests colocated with code"

I incorrectly assumed: "tests go in `__tests__/` subfolder of the code"

**Wrong logic:** This works for UNIT tests (single-function tests), but repository tests are INTEGRATION tests.

### Mistake 2: Misclassified repository tests as "unit"

I created: `__tests__/unit/documentation/strategic-repository.test.ts`

**Wrong assumption:** Repository tests are "unit testing the repository"

**Correct understanding:** Repository tests are "integration testing the full data layer"

### Mistake 3: Didn't verify against content-library pattern

I should have asked: "Where are article-repository.test.ts tests for content-library?"

**Answer:** `__tests__/integration-test/content-library/article-repository.test.ts` (INTEGRATION)

**Should've done:** Match that pattern exactly for documentation.

### Why It Matters

Inconsistency creates:

- ❌ Confusion about where tests live
- ❌ Tests split across multiple locations
- ❌ Difficult to run "all repository tests" with one command
- ❌ Onboarding nightmare (which pattern do I follow?)

---

## Prevention (Going Forward - Batches 2-4)

### Pre-Flight Checklist for Each New Domain

Before writing ANY test code, verify:

- [ ] Module location: `lib/strapi/documentation/[domain]/`
- [ ] Data layer files: schema.ts, content-builder.ts, repository.ts, view-models.ts, index.ts
- [ ] **NO **tests** folder in lib/strapi/** ← CRITICAL
- [ ] Repository test location: `__tests__/integration-test/documentation/[domain]-repository.test.ts`
- [ ] Repository test type: INTEGRATION (not unit)
- [ ] Pattern name: `[domain]-repository.test.ts` (singular domain, -repository suffix)
- [ ] Compare structure to: `__tests__/integration-test/content-library/article-repository.test.ts`

### Commands to Verify Consistency

```bash
# Should find only ONE repository test per domain
ls __tests__/integration-test/documentation/
# Expected: strategic-repository.test.ts

# Should find NO tests in lib folder
find lib/strapi -name "*.test.ts"
# Expected: (empty result)

# Should find all repository tests at root level
ls __tests__/integration-test/
# Expected: content-library/ (with 4 test files), documentation/ (with 4 test files)
```

---

## This Lock Prevents Future Drift

### 🔒 Immutable Rules

1. **Repository tests are ALWAYS integration tests**
2. **Tests are NEVER in lib/strapi/ folders**
3. **Repository test location: `__tests__/integration-test/[module]/[domain]-repository.test.ts`**
4. **Content Library = Reference Pattern (match exactly)**
5. **All modules follow identical structure**

### 🚨 If You Violate This

- You're breaking consistency with content-library
- You're making the codebase harder to onboard/maintain
- Fix immediately and document the correction

### ✅ How to Know You're Correct

1. Run: `ls __tests__/integration-test/content-library/`
2. Count the structure: `article/ tutorial/ case-study/ guide/` (4 domains, 4 test files)
3. Copy that structure to documentation: `strategic/ cms-ref/ app-ref/ infra/` (4 domains, 4 test files)
4. Every repository test file is at root level, never nested in code

---

## Current Inventory (Session 3 Corrected)

**Content Library (Reference):**

- ✅ 4 domains (articles, tutorials, case-studies, guides)
- ✅ 4 integration test files in `__tests__/integration-test/content-library/`
- ✅ NO tests in lib/strapi/dashboard/content-library/ folders
- ✅ Pattern: LOCKED & CONSISTENT

**Documentation (New - Now Aligned):**

- ✅ 1 domain complete (strategic)
- ✅ 1 integration test file in `__tests__/integration-test/documentation/`
- ✅ NO tests in lib/strapi/documentation/strategic/ folder
- ✅ Pattern: LOCKED & CONSISTENT WITH CONTENT LIBRARY

---

## Summary

**Before Correction:**

```
❌ Unit tests: __tests__/unit/documentation/strategic-repository.test.ts
❌ Tests in lib: lib/strapi/documentation/strategic/__tests__/repository.test.ts
❌ Integration tests (correct): __tests__/integration-test/documentation/strategic-repository.test.ts
= INCONSISTENT, DUPLICATE, CONFUSING
```

**After Correction:**

```
✅ Integration tests ONLY: __tests__/integration-test/documentation/strategic-repository.test.ts
✅ Matches content-library exactly
✅ No tests in lib/strapi/
✅ Single source of truth per domain
= CONSISTENT, CLEAR, MAINTAINABLE
```

**Status:** 🔒 **LOCK ENGAGED - NO MORE DRIFT ON TEST ORGANIZATION**
