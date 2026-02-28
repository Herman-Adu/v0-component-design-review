# Test Organization — Final Structure & Rationale

**Updated:** February 28, 2026  
**Status:** ✅ Organized for consistency across all modules

---

## Final Folder Structure

### Unit Tests (With the Code)

```
lib/strapi/documentation/strategic/
├── __tests__/
│   └── repository.test.ts          ← UNIT TESTS
│       • Tests individual functions
│       • ~30 test cases
│       • Tests repository methods
│       • Tests view models
│       • Tests transformers
│
├── schema.ts                        (Zod validation)
├── content-builder.ts               (Load + validate JSON)
├── repository.ts                    (Data access interface)
├── view-models.ts                   (Domain → UI transform)
└── index.ts                         (Public API facade)
```

**Why here?**

- Tight coupling between code and tests
- Easy to refactor (finding all usages)
- Single responsibility = single test file
- Mirrors content-library pattern for articles/tutorials/etc.

---

### Integration Tests (Cross-Module, at Root)

```
__tests__/
├── integration-test/
│   ├── content-library/             (EXISTING - 4 domains)
│   │   ├── article-repository.test.ts
│   │   ├── case-study-repository.test.ts
│   │   ├── guide-repository.test.ts
│   │   └── tutorial-repository.test.ts
│   │
│   └── documentation/               (NEW - parallel structure)
│       └── strategic-repository.test.ts
│           • Tests full data flow
│           • ~50 test cases
│           • Tests JSON → Content Builder → Repository → View Models
│           • Tests queries + transformations together
│           • Tests data integrity across layers
```

**Why here?**

- Tests cross-module data flows
- Can run independently from unit tests
- Parallel to content-library structure (consistency!)
- Integration tests are NOT tied to single files
- Allows testing repository behavior in context

---

### E2E Tests (Playwright, Later)

```
__tests__/
├── e2e/
│   ├── documentation/               (FUTURE)
│   │   └── strategic.spec.ts
│   │       • Route rendering
│   │       • Navigation
│   │       • User interactions
│   │       (Created in Phase 3.5 or Session 4)
│   │
│   └── content-library/             (EXISTING - 4 domains)
```

---

## Test Command Mapping

```bash
# Unit tests ONLY (all modules, with code)
pnpm run test -- lib/strapi

# Integration tests ONLY (cross-module, root folder)
pnpm run test -- __tests__/integration-test

# E2E tests with Playwright
pnpm run test:e2e

# Specific module's unit tests
pnpm run test -- lib/strapi/documentation

# Specific integration test
pnpm run test -- __tests__/integration-test/documentation

# All tests
pnpm run test
```

---

## Documentation Folder Comparison

### Structure Alignment

**Content Library (Existing):**

```
Sources:
  • lib/strapi/dashboard/content-library/{articles,tutorials,case-studies,guides}
  • Each domain has __tests__/repository.test.ts (UNIT)

Tests:
  • __tests__/integration-test/content-library/ (INTEGRATION)
    - article-repository.test.ts
    - tutorial-repository.test.ts
    - case-study-repository.test.ts
    - guide-repository.test.ts
```

**Documentation (New - SAME PATTERN):**

```
Sources:
  • lib/strapi/documentation/strategic
  • Has __tests__/repository.test.ts (UNIT)

Tests:
  • __tests__/integration-test/documentation/ (INTEGRATION)
    - strategic-repository.test.ts
```

✅ **Perfectly parallel** — Same structure, different module

---

## Test Pyramid for Strategic Documentation

```
                  /\
                 /  \
                / E2E \              (5-10 tests)
               /______ \             Routes, navigation, page rendering
              /          \
             / Integration\          (50+ tests)
            /________________\       Full data flows, cross-layer tests
           /                  \
          /     Unit Tests     \     (30+ tests)
         /______________________\    Individual functions, methods
```

---

## Why This Organization?

### ✅ Consistency Across All Modules

| Module               | Unit Tests Location                                        | Integration Tests Location                    |
| -------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| **Content Library**  | `lib/strapi/dashboard/content-library/{domain}/__tests__/` | `__tests__/integration-test/content-library/` |
| **Documentation**    | `lib/strapi/documentation/strategic/__tests__/`            | `__tests__/integration-test/documentation/`   |
| **Future (CMS Ref)** | `lib/strapi/documentation/cms-reference/__tests__/`        | `__tests__/integration-test/documentation/`   |
| **Future (App Ref)** | `lib/strapi/documentation/app-reference/__tests__/`        | `__tests__/integration-test/documentation/`   |
| **Future (Infra)**   | `lib/strapi/documentation/infrastructure/__tests__/`       | `__tests__/integration-test/documentation/`   |

**All follow the same pattern.** No exceptions.

### ✅ Clear Responsibility Boundaries

| Layer           | Location         | Purpose                   | Coverage |
| --------------- | ---------------- | ------------------------- | -------- |
| **Unit**        | With code        | Function-level validation | >90%     |
| **Integration** | Root `__tests__` | Cross-module data flows   | >85%     |
| **E2E**         | Root `__tests__` | Route-level user flows    | >80%     |

---

## Files Organized

### Created/Updated This Session

✅ **`TESTING_ARCHITECTURE.md`**

- Documents best practices
- Explains why each layer lives where
- Provides command reference

✅ **`lib/strapi/documentation/strategic/__tests__/repository.test.ts`**

- UNIT TESTS (with the code)
- 30+ test cases
- Tests functions in isolation
- Lives with the code it tests

✅ **`__tests__/integration-test/documentation/strategic-repository.test.ts`**

- INTEGRATION TESTS (cross-module)
- 50+ test cases
- Tests full data flow
- Parallel to content-library structure

---

## Next Steps for Consistency

### Current (Just Done)

- ✅ Documentation unit tests in lib/strapi/documentation/strategic/**tests**/
- ✅ Documentation integration tests in **tests**/integration-test/documentation/
- ✅ Parallel to content-library structure

### Phase 3.5 or Session 4 (E2E Routes)

- Create `__tests__/e2e/documentation/strategic.spec.ts`
- Test routes with Playwright
- Use existing Playwright configuration

### Batches 2-4 (CMS Ref, App Ref, Infrastructure)

- Each domain gets same structure:
  - `lib/strapi/documentation/[domain]/__tests__/repository.test.ts`
  - `__tests__/integration-test/documentation/[domain]-repository.test.ts`
- All follow exact same pattern

---

## Validation

Run these commands to verify structure:

```bash
# Verify unit tests exist with code
ls lib/strapi/documentation/strategic/__tests__/

# Verify integration tests in root
ls __tests__/integration-test/documentation/

# Run all documentation tests
pnpm run test -- lib/strapi/documentation
pnpm run test -- __tests__/integration-test/documentation
```

---

## Summary

**Organization is now consistent and follows best practices:**

✅ Unit tests colocated with code  
✅ Integration tests at root level (parallel to content-library)  
✅ E2E tests ready for future implementation  
✅ All modules follow exact same structure  
✅ Clear responsibility boundaries  
✅ Professional test pyramid

**Status: Ready for consistent scaling to Batches 2-4** ✅
