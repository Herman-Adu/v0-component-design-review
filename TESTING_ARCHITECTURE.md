# Testing Architecture — Best Practices & Organization

**Updated:** February 28, 2026  
**Pattern:** Consistent across all strapi modules (content-library, documentation, future modules)

---

## Best Practices for Test Organization

### 1. **Unit Tests** → Live WITH the Code (Module-Level)

**Location:** `lib/strapi/[module]/[domain]/__tests__/[feature].test.ts`

**Purpose:** Test single functions/classes in isolation  
**Scope:** Repository methods, View models, Transformers  
**Dependencies:** Mock, test individually  
**Run:** `pnpm run test -- lib/strapi`

**Example Structure:**

```
lib/strapi/documentation/strategic/
├── __tests__/
│   └── repository.test.ts     ← Unit tests for THIS module
├── schema.ts
├── content-builder.ts
├── repository.ts
└── view-models.ts
```

### 2. **Integration Tests** → Live at Root Level (Cross-Module)

**Location:** `__tests__/integration-test/[module]/[feature]-repository.test.ts`

**Purpose:** Test data layer + business logic together  
**Scope:** Repository + Content Builder + View Models working together  
**Dependencies:** Real data fixtures, not mocked  
**Run:** `pnpm run test -- __tests__/integration-test`

**Example Structure:**

```
__tests__/
├── integration-test/
│   ├── content-library/
│   │   ├── article-repository.test.ts
│   │   ├── case-study-repository.test.ts
│   │   ├── guide-repository.test.ts
│   │   └── tutorial-repository.test.ts
│   └── documentation/              ← NEW (parallel to content-library)
│       └── strategic-repository.test.ts
└── e2e/
    └── documentation/              ← Route E2E tests (Playwright)
```

### 3. **E2E Tests** → Live at Root Level (Route-Level)

**Location:** `__tests__/e2e/[module]/[route].spec.ts`

**Purpose:** Test full user flows through routes  
**Scope:** Route rendering, navigation, interactions  
**Framework:** Playwright (configured with plugin)  
**Run:** `pnpm run test:e2e`

---

## Rationale for This Structure

| Layer           | Location                               | Why                                                      | Example                                               |
| --------------- | -------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------- |
| **Unit**        | `lib/strapi/[module]/__tests__/`       | Colocated with code → Easy refactoring + imports         | `repository.test.ts` tests `repository.ts`            |
| **Integration** | `__tests__/integration-test/[module]/` | Cross-module tests → Separate from unit → Can run alone  | Test full data flow without routes                    |
| **E2E**         | `__tests__/e2e/[module]/`              | Route-level tests → Playwright → Full browser experience | Test `/documentation/strategic/[slug]` page rendering |

---

## Test Pyramid

```
        /\
       /  \
      / E2E \          Integration tests (routes + page rendering)
     /________ \      ~10 tests per module
    /          \
   / Integration \    Cross-module data layer validation
  /____________\    ~15 tests per module (like content-library)
 /              \
/   Unit Tests   \   Single function validation
/______________\   ~30+ tests per module (most coverage here)
```

---

## Running Tests by Layer

```bash
# Unit tests only (with code)
pnpm run test -- lib/strapi

# Integration tests only (root folder)
pnpm run test -- __tests__/integration-test

# E2E tests with Playwright
pnpm run test:e2e

# All tests
pnpm run test

# Watch mode for development
pnpm run test -- --watch lib/strapi/documentation
```

---

## Coverage Targets

| Layer           | Target | Tools                |
| --------------- | ------ | -------------------- |
| **Unit**        | >90%   | Vitest (with code)   |
| **Integration** | >85%   | Vitest (root folder) |
| **E2E**         | >80%   | Playwright           |

---

## Implementation Pattern (Exact Replication Across Modules)

### For Content Library (Already Done)

```
lib/strapi/dashboard/content-library/
├── articles/
│   ├── repository.ts
│   ├── __tests__/
│   │   └── repository.test.ts    ← UNIT TESTS
│   └── ...
├── tutorials/
│   ├── __tests__/
│   │   └── repository.test.ts    ← UNIT TESTS
│   └── ...
└── ...

__tests__/integration-test/content-library/
├── article-repository.test.ts    ← INTEGRATION TESTS
├── tutorial-repository.test.ts   ← INTEGRATION TESTS
└── ...
```

### For Documentation (NEW - Apply Same Pattern)

```
lib/strapi/documentation/strategic/
├── repository.ts
├── __tests__/
│   └── repository.test.ts        ← UNIT TESTS
└── ...

__tests__/integration-test/documentation/
└── strategic-repository.test.ts  ← INTEGRATION TESTS
```

---

## Key Principles

1. ✅ **Unit tests colocated with code** → `lib/strapi/[module]/__tests__/`
2. ✅ **Integration tests in root folder** → `__tests__/integration-test/[module]/`
3. ✅ **Same structure across ALL modules** → No exceptions, always follow pattern
4. ✅ **Clear naming:** Always `[feature]-repository.test.ts`
5. ✅ **Test pyramid:** Most tests at unit level, fewer at integration, few at E2E
6. ✅ **Playwright configuration:** Already active in root `__tests__/e2e/`

---

## Next Steps

1. Keep unit tests in `lib/strapi/documentation/strategic/__tests__/repository.test.ts`
2. Create integration test in `__tests__/integration-test/documentation/strategic-repository.test.ts`
3. Create parallel E2E tests in `__tests__/e2e/documentation/strategic.spec.ts`
4. Verify this structure matches content-library exactly

---

**Standard:** All new modules must follow this structure. No exceptions.
