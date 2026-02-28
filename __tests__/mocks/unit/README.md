# Unit Test Mock Data (Future)

**Status:** Placeholder - Not implemented yet  
**Purpose:** Mock fixtures for unit tests

---

## Planned Structure

```
unit/
├── content-library/
│   ├── schema-fixtures.ts         # Invalid/edge case data for schema tests
│   ├── view-model-fixtures.ts     # Test data for view model transformations
│   └── ...
├── components/
│   └── props-fixtures.ts          # Component prop fixtures
└── utils/
    └── test-data.ts               # Utility test data
```

---

## Mock Data Characteristics

**Unit test mocks are different from integration test mocks:**

- **Minimal:** Only fields needed for specific test
- **Edge cases:** Invalid data, boundary conditions, null/undefined
- **Focused:** Single purpose per fixture
- **Fast:** No complex objects, just primitive data

---

## Example Pattern

```typescript
// schema-fixtures.ts
export const invalidArticle = {
  slug: "", // Invalid: empty slug
  title: "Test",
  // Missing required fields
};

export const edgeCaseArticle = {
  slug: "a".repeat(300), // Edge: very long slug
  title: "Test",
  publishedAt: "invalid-date", // Edge: invalid date format
};
```

---

## Related

- **Unit Tests:** `__tests__/unit/` - Tests using these mocks
- **Integration Mocks:** `__tests__/mocks/integration/` - Full valid data fixtures
