# Content Library Refactor - Pitfalls, Troubleshooting & Tips

**Date:** February 27, 2026

---

## Common Pitfalls & How to Avoid Them

### Pitfall 1: Forgetting `import "server-only"`

**Problem:**

```typescript
// ❌ WRONG - Builder exported to client-side code
export function getArticleList(): Article[] { ... }
```

**Solution:**

```typescript
// ✅ CORRECT - Marked as server-only
import "server-only";

export function getArticleList(): Article[] { ... }
```

**Impact:** Can accidentally expose Zod schemas or validation logic to client bundle

**Prevention:** Add `import "server-only"` as the first line of every builder, content, and API file

---

### Pitfall 2: Missing JSON Imports

**Problem:**

```typescript
// ❌ Missing import
const articleContentRegistry: Record<string, ArticleContentDocument> = {
  "my-article": someUndefinedVariable as ArticleContentDocument, // Error!
};
```

**Solution:**

```typescript
// ✅ All JSON files imported
import myArticle from "@/data/strapi-mock/dashboard/content-library/articles/...";

const articleContentRegistry: Record<string, ArticleContentDocument> = {
  "my-article": myArticle as ArticleContentDocument,
};
```

**Impact:** Build fails or article silently missing from registry

**Prevention:** List all JSON files before creating registry, check folder structure for completeness

---

### Pitfall 3: Incorrect Schema Validation

**Problem:**

```typescript
// ❌ Not passing correct schema
const result = articleSchema.safeParse(document); // Wrong schema!
```

**Solution:**

```typescript
// ✅ Using correct schema
const result = articleContentDocumentSchema.safeParse(document);
```

**Impact:** Build passes but validation doesn't catch invalid JSON

**Prevention:** Use schema name that matches document structure (e.g., `articleContentDocumentSchema` for `ArticleContentDocument`)

---

### Pitfall 4: Breaking Registry Key Mapping

**Problem:**

```typescript
const articleContentRegistry: Record<string, ArticleContentDocument> = {
  "building-atomic-component": refactoringArticle, // ❌ Wrong article for slug!
};
```

**Solution:**

```typescript
const articleContentRegistry: Record<string, ArticleContentDocument> = {
  "building-atomic-component": buildingAtomicComponentArticle, // ✅ Correct mapping
};
```

**Impact:** Wrong document returned for slug, breaks detail pages

**Prevention:** Double-check each import variable name matches the slug key

---

### Pitfall 5: Forgetting to Cache the List

**Problem:**

```typescript
// ❌ No caching - regenerates list every call
export function getArticleList(): Article[] {
  return generateArticleList(); // Creates new array every time!
}
```

**Solution:**

```typescript
// ✅ With caching
let cachedArticleList: Article[] | null = null;

export function getArticleList(): Article[] {
  if (!cachedArticleList) {
    cachedArticleList = generateArticleList();
  }
  return cachedArticleList;
}
```

**Impact:** Performance degradation (minor but unnecessary), inconsistent object references

**Prevention:** Always implement caching for generated lists

---

### Pitfall 6: Wrong Import in articles.ts

**Problem:**

```typescript
// ❌ Still importing from legacy source
import { articles } from "@/data/content-library/articles";
```

**Solution:**

```typescript
// ✅ Import from new builder via content
import { getArticleList } from "@/lib/strapi/dashboard/content-library/articles/article-content";
```

**Impact:** Build fails (if legacy removed) or uses old data, defeating purpose of refactor

**Prevention:** Update all import statements when moving sources

---

### Pitfall 7: Not Updating Function Calls

**Problem:**

```typescript
// ❌ Old function call
export function getAllArticles(): Article[] {
  return articles; // 'articles' is no longer defined!
}
```

**Solution:**

```typescript
// ✅ New function call
export function getAllArticles(): Article[] {
  return getArticleList(); // Call builder function
}
```

**Impact:** Runtime error when articles.ts is called

**Prevention:** Replace all array references with function calls

---

### Pitfall 8: Forgetting 'use client' in Page Client

**Problem:**

```typescript
// ❌ Missing use client directive
export default function ArticlesPageClient({ articles }: Props) {
  const [filtered, setFiltered] = useState(articles); // Error! useState in server component
}
```

**Solution:**

```typescript
// ✅ Proper client component
"use client";

export default function ArticlesPageClient({ articles }: Props) {
  const [filtered, setFiltered] = useState(articles); // ✓ Works
}
```

**Impact:** Build error - can't use hooks in server components

**Prevention:** Always add 'use client' as first line of \*-client.tsx files

---

### Pitfall 9: Not Making Page Component Async

**Problem:**

```typescript
// ❌ Synchronous page
export default function ArticlesPage() {
  const articles = getAllArticles();  // Can't call server function!
  return <ArticlesPageClient articles={articles} />;
}
```

**Solution:**

```typescript
// ✅ Async page
export default async function ArticlesPage() {
  const articles = getAllArticles();  // ✓ Can call server function
  return <ArticlesPageClient articles={articles} />;
}
```

**Impact:** Build error - can't call server-only functions from sync component

**Prevention:** Always make pages async when they call server API functions

---

### Pitfall 10: Mixing Old and New Imports

**Problem:**

```typescript
// ❌ Importing from both old and new sources
import { getArticleList } from "./article-content"; // New builder
import { articles } from "@/data/content-library/articles"; // Old source

export function getAllArticles(): Article[] {
  return articles; // Still using old!
}
```

**Solution:**

```typescript
// ✅ Single source of truth
import { getArticleList } from "./article-content"; // Only new source

export function getAllArticles(): Article[] {
  return getArticleList();
}
```

**Impact:** Confusion about which source is authoritative, potential bugs

**Prevention:** Complete each file's refactoring before moving to next file

---

## Troubleshooting Guide

### Issue: Build fails with "Cannot find module" error

**Symptom:**

```
error TS2307: Cannot find module '@/data/strapi-mock/dashboard/content-library/articles/best-practices/my-article.json'
```

**Causes:**

1. JSON file doesn't exist at path
2. File path typo in import
3. File was moved/renamed

**Solutions:**

- [ ] Verify JSON file exists at exact path
- [ ] Check for typos in import path
- [ ] List directory: `ls /data/strapi-mock/dashboard/content-library/articles/best-practices/`
- [ ] Search for file: `find . -name "my-article.json"`

---

### Issue: Build fails with validation error

**Symptom:**

```
Error: Invalid article content for "my-article": meta.title: String must be non-empty
```

**Causes:**

1. JSON file missing required field (e.g., meta.title is empty)
2. Field type mismatch (e.g., level is not a valid enum value)
3. Schema definition too strict

**Solutions:**

- [ ] Check JSON file structure matches schema
- [ ] Fix missing/invalid fields in JSON
- [ ] Verify enum values are correct (e.g., level: "beginner" not "Beginner")
- [ ] Compare with working JSON file in same section
- [ ] Update schema if JSON structure changed intentionally

---

### Issue: Types don't match after refactoring

**Symptom:**

```
error TS2322: Type 'Article | undefined' is not assignable to type 'Article'
```

**Causes:**

1. Function signature changed
2. Missing null check
3. Type export missing

**Solutions:**

- [ ] Verify function returns correct type (Article[] not Article | undefined)
- [ ] Add null checks where function can return undefined
- [ ] Ensure type is exported from builder
- [ ] Check re-exports in content.ts are correct

---

### Issue: Page doesn't render data

**Symptom:**

```
Articles page loads but shows empty list
```

**Causes:**

1. Registry is empty (no JSON imports)
2. Validation failed silently (unlikely if build passed)
3. Client component not receiving props
4. List filtering removes all items

**Solutions:**

- [ ] Log in builder: `console.log(Object.keys(validatedArticleContentRegistry));`
- [ ] Verify JSON files are imported
- [ ] Check async page is calling `getAll{Section}s()`
- [ ] Verify `<{Section}PageClient items={items} />` passes items
- [ ] Check client component receives props and renders them

---

### Issue: Detail page shows wrong article

**Symptom:**

```
Clicking article in list goes to wrong detail page
Slug "building-atomic-component" shows "refactoring-for-maintainability" content
```

**Causes:**

1. Registry has wrong slug → document mapping
2. JSON import assigned to wrong variable
3. Slug mismatch between list and content document

**Solutions:**

- [ ] Verify each JSON import variable matches the slug
- [ ] Double-check registry entries: `"building-atomic-component": buildingAtomicComponent,`
- [ ] Ensure JSON file's internal slug matches registry key
- [ ] Trace through: slug → registry lookup → document retrieval

---

### Issue: TypeScript type errors in client component

**Symptom:**

```
error TS2339: Property 'slug' does not exist on type 'Article'
```

**Causes:**

1. Type not exported from builder
2. Client component importing wrong type
3. Type definition incomplete in builder

**Solutions:**

- [ ] Verify Article type is exported from content-builder.ts
- [ ] Check content.ts re-exports Article
- [ ] Verify type has all expected fields (slug, title, etc.)
- [ ] Run type check: `npm run build`

---

### Issue: Build passes but articles missing from list

**Symptom:**

```
Build succeeds, getAllArticles() returns 29 items instead of 30
"my-article" is missing
```

**Causes:**

1. JSON file not imported in builder
2. Invalid JSON document (validation failed during build but didn't cause error)
3. Validation succeeded but not added to cache

**Solutions:**

- [ ] Verify JSON file is in import list in builder
- [ ] Check JSON file is valid (compare with working file)
- [ ] Look for validation errors in build output (may not be obvious)
- [ ] Manually add import if somehow skipped

---

### Issue: Async page throws error

**Symptom:**

```
Error: "server-only" module cannot be imported in client-side code
OR
Error: Cannot use async in non-async function
```

**Causes:**

1. Page not marked as async
2. Importing server-only module in client component
3. Calling server function from client without Server Action

**Solutions:**

- [ ] Make page async: `export default async function ArticlesPage()`
- [ ] Don't import {section}.ts in client components (only use props)
- [ ] Use Server Actions if client needs to call server functions

---

## Tips & Best Practices

### Tip 1: Organize JSON Imports by Directory

```typescript
// ✅ GOOD - Organized by directory
// best-practices/ (5 files)
import accessibilityArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/building-accessible-web-applications.json";
import refactoringArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/refactoring-for-maintainability.json";

// architecture/ (6 files)
import atomicDesignArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/atomic-design-principles.json";
```

This makes it easy to see coverage and verify all files are imported.

---

### Tip 2: Use Consistent Naming Patterns

```typescript
// ✅ GOOD - Consistent variable names
// Variable name derived from JSON file name
import buildingAccessibilityArticle from "...building-accessible-web-applications.json";
import refactoringForMaintainabilityArticle from "...refactoring-for-maintainability.json";

// Registry key matches JSON slug
const articleContentRegistry = {
  "building-accessible-web-applications": buildingAccessibilityArticle,
  "refactoring-for-maintainability": refactoringForMaintainabilityArticle,
};
```

This prevents slug/variable mismatches.

---

### Tip 3: Validate Early and Often

```typescript
// After creating builder, immediately test:
// 1. Build succeeds without validation errors
npm run build

// 2. Type check passes
npm run type-check

// 3. Import the functions in a test file
const articles = getArticleList();
console.log(articles.length);  // Should be 30
```

Catch issues early before moving to next file.

---

### Tip 4: Keep Registry and List Generation Separate

```typescript
// ✅ GOOD - Separate concerns
const articleContentRegistry = { ... };  // Raw data

function generateArticleList(): Article[] {
  return Object.entries(validatedArticleContentRegistry)
    .map(([slug, doc]) => ({ id, slug, title, ... }));
}

// NOT:
// ❌ Mixing registry and transformation logic
```

Makes it easier to debug and modify formatting.

---

### Tip 5: Use Exact Enum Values

```typescript
// ✅ CORRECT - Match schema exactly
const ARTICLE_LEVELS = ["beginner", "intermediate", "advanced"] as const;

// In JSON:
"level": "beginner"  // Must match exactly (lowercase)

// NOT:
// ❌ "level": "Beginner"  (uppercase)
// ❌ "level": "Beginner Level"  (extra text)
```

Prevents validation failures.

---

### Tip 6: Test Each Section Independently

```typescript
// Complete ARTICLES first:
✅ Article builder working
✅ Article list functional
✅ Article pages rendering

// THEN start CASE-STUDIES
// (Not before articles is fully done)

// Benefits:
// - Can test articles in isolation
// - Can adjust pattern if needed before repeating
// - Easier to debug if issues arise
```

---

### Tip 7: Document Registry Coverage

```typescript
// Add comment showing coverage
const articleContentRegistry: Record<string, ArticleContentDocument> = {
  // best-practices/ (5/5)
  "building-accessible-web-applications": accessibilityArticle,
  "refactoring-for-maintainability": refactoringArticle,
  // ... more

  // architecture/ (9/9)
  "atomic-design-principles": atomicDesignArticle,
  // ... more

  // Total: 30/30 ✓
};
```

Easy to verify all files are imported.

---

### Tip 8: Create a Validation Checklist

Before completing each section, run through:

```typescript
// 1. All JSON files imported? (Count: 30 for articles)
Object.keys(validatedArticleContentRegistry).length === 30;

// 2. All valid? (No validation errors during build)
// Check build output

// 3. List generated? (Count matches JSON count)
getArticleList().length === 30;

// 4. Correct sorting? (Most recent first)
getArticleList()[0].publishedAt > getArticleList()[1].publishedAt;

// 5. Document retrieval works?
getArticleContentDocument("building-atomic-component") !== null;

// 6. All functions exported?
// Re-exports work in other files
```

---

### Tip 9: Use Search/Replace Carefully

When updating articles.ts → case-studies.ts, use find/replace but verify:

```typescript
// ❌ DON'T blindly replace
// Article → CaseStudy (would create CasArticle → CaseStudyCaseStudy)

// ✅ DO use context-aware replacement
// Replace: "getArticle" → "getCaseStudy"
// Replace: "Article" → "CaseStudy"
// But verify each change manually
```

---

### Tip 10: Keep Git Commits Organized

```bash
# Good commit sequence:
git add ARTICLES_REFACTOR_NOTES.md
git commit -m "docs: add articles refactor notes"

git add lib/.../articles/article-content-builder.ts
git commit -m "refactor(articles): create content builder"

git add lib/.../articles/article-content.ts lib/.../articles/articles.ts
git commit -m "refactor(articles): update content and api layers"

git add app/.../articles/
git commit -m "refactor(articles): convert page to async server component"

# Then do same for case-studies, then guides
```

Makes history clear and rollback easier if needed.

---

## Quick Sanity Checks

Run these checks to verify correctness:

```typescript
// In a test or console:

// 1. Check builder returns correct count
console.assert(getArticleList().length === 30, "Articles count wrong");

// 2. Check caching works
const list1 = getArticleList();
const list2 = getArticleList();
console.assert(list1 === list2, "Caching not working");

// 3. Check document retrieval
const doc = getArticleContentDocument("building-atomic-component");
console.assert(doc !== null, "Document not found");

// 4. Check sorting
const list = getArticleList();
for (let i = 0; i < list.length - 1; i++) {
  const current = new Date(list[i].publishedAt);
  const next = new Date(list[i + 1].publishedAt);
  console.assert(current >= next, "Sorting incorrect");
}

// 5. Check no undefined in list
console.assert(
  list.every((item) => item.slug && item.title && item.id),
  "Missing required fields",
);

// 6. Check all functions exported
console.assert(typeof getArticleList === "function");
console.assert(typeof getArticleContentDocument === "function");
console.assert(typeof getAllArticleContentSlugs === "function");
```

---

## Performance Considerations

### Why This Approach is Efficient

1. **Build-time validation** - Errors caught immediately, not at runtime
2. **Caching** - List generated once, subsequent calls O(1)
3. **No database** - All content in memory, instant access
4. **Static imports** - Tree-shakeable, only used JSON included
5. **No redundant processing** - Filtering/searching happens client-side

### Potential Issues

1. **Large bundle** - Many JSON files = larger bundle (mitigated by `server-only`)
2. **Memory usage** - All content in memory (acceptable for modest content size)
3. **Search performance** - Client-side filtering on large list (add indexes if needed)

---

## When to Adjust the Pattern

### Add Filtering if List is Large

```typescript
// If articles > 100, implement server-side filtering
// Add search parameters to getArticleList(query: string)
```

### Add Pagination

```typescript
// If rendering many items, paginate on client
// Server returns all, client paginates in UI
```

### Add Revalidation

```typescript
// If content updates frequently, use revalidateTag()
// But current implementation assumes build-time static content
```

---

That covers the major pitfalls, troubleshooting, and best practices for the refactoring!
