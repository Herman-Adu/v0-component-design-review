# E2E Test Mock Data (Future)

**Status:** Placeholder - Not implemented yet  
**Purpose:** Test fixtures for end-to-end tests

---

## Planned Structure

```
e2e/
├── content-library/
│   ├── seed-articles.ts           # Full article dataset for e2e
│   ├── seed-tutorials.ts          # Tutorial dataset for navigation tests
│   └── ...
├── user-scenarios/
│   └── test-users.ts              # User persona data
└── api-responses/
    └── mock-responses.ts          # API mock responses for offline e2e
```

---

## Mock Data Characteristics

**E2E test mocks simulate real production-like data:**

- **Complete:** Full valid content documents
- **Realistic:** Production-like scenarios
- **Stable:** Predictable for test automation
- **Versioned:** Tied to test specs

---

## Example Pattern

```typescript
// seed-articles.ts
export const e2eArticleDataset = {
  articles: [
    {
      slug: "e2e-test-article-1",
      title: "E2E Test Article for Navigation",
      category: "security",
      level: "beginner",
      // ... complete valid article
    },
    // 10-20 articles covering all categories/levels
  ],
};
```

---

## Related

- **E2E Tests:** `__tests__/e2e/` - Tests using these fixtures
- **Integration Mocks:** `__tests__/mocks/integration/` - Repository test mocks
