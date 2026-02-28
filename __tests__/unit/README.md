# Unit Tests (Future)

**Status:** Placeholder - Not implemented yet  
**Purpose:** Pure logic tests with complete mocking

---

## Planned Structure

```
unit/
├── content-library/
│   ├── article-schema.test.ts      # Zod schema validation tests
│   ├── article-view-models.test.ts # View model transformation tests
│   └── ...
├── components/
│   ├── ui/                         # UI component logic tests
│   └── content-library/            # Content component tests
└── lib/
    └── utils/                      # Utility function tests
```

---

## Testing Philosophy

**Unit tests** focus on isolated logic without any external dependencies:

- ✅ Pure functions (transformations, calculations)
- ✅ View model mappers
- ✅ Schema validation logic
- ✅ Utility functions
- ✅ Component render logic (React Testing Library)

**What to mock:**

- All file system operations
- All API calls
- All external modules
- Date/time functions

**What NOT to test here:**

- Real data loading (use integration tests)
- Full user flows (use e2e tests)
- External service integration

---

## Related

- **Integration Tests:** `__tests__/integration-test/` - Tests with real data
- **E2E Tests:** `__tests__/e2e/` - Full user journey tests
- **Mock Data:** `__tests__/mocks/unit/` - Mock fixtures for unit tests
