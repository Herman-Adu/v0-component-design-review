# Article Migration: Quick Reference

**Use this guide for rapid article conversion from TSX → JSON**

---

## Pre-Flight Checklist

- [ ] Read existing TSX file: `features/dashboard/content-library/articles/[name]-article.tsx`
- [ ] Identify article metadata: slug, title, category, level
- [ ] Note all component types used
- [ ] Check if TOC is needed (long article = yes)
- [ ] Batch size target: 3–4 articles per run (avoid >4)

---

## Block Type Quick Map

| Component in TSX       | Block Type                 | Atomic Level | Required Props                 |
| ---------------------- | -------------------------- | ------------ | ------------------------------ |
| `<p>` or text          | `atom.paragraph`           | atom         | `text`                         |
| `<InfoBox type="tip">` | `molecule.infoBox`         | molecule     | `variant`, `body`, `title?`    |
| `<SectionHeader>`      | `molecule.sectionHeader`   | molecule     | `number`, `title`, `id`        |
| `<CodeBlock>`          | `molecule.codeBlock`       | molecule     | `filename`, `code`             |
| `<KeyTakeaway>`        | `molecule.keyTakeaway`     | molecule     | `body`                         |
| `<MetricsGrid>`        | `organism.metricsGrid`     | organism     | `metrics[]`                    |
| `<FeatureGrid>`        | `organism.featureGrid`     | organism     | `columns`, `features[]`        |
| `<ComparisonCards>`    | `organism.comparisonCards` | organism     | `idealFor[]`, `notIdealFor[]`  |
| `<ProcessFlow>`        | `organism.processFlow`     | organism     | `title`, `steps[]`             |
| `<StatsTable>`         | `organism.statsTable`      | organism     | `title`, `headers[]`, `rows[]` |
| `<RelatedArticles>`    | `organism.relatedArticles` | organism     | `articles[]`                   |

---

## JSON Template

```json
{
  "meta": {
    "slug": "article-slug-here",
    "title": "Article Title",
    "excerpt": "Brief 1-2 sentence description",
    "level": "beginner|intermediate|advanced",
    "category": "architecture|security|forms|performance|best-practices|rendering|business|accessibility|testing|devops|ai-tooling",
    "readTime": "X min",
    "publishedAt": "2026-02-XX",
    "tags": ["tag1", "tag2", "tag3"]
  },
  "layout": "content-with-toc",
  "toc": [{ "id": "section-id", "title": "Section Title", "level": 2 }],
  "blocks": []
}
```

---

## Common Patterns

### InfoBox Variants

```json
{
  "type": "molecule.infoBox",
  "atomicLevel": "molecule",
  "props": {
    "variant": "tip|warning|important",
    "title": "Optional Title",
    "body": "Content here"
  }
}
```

### Section Headers (with TOC)

```json
// In TOC array:
{ "id": "my-section", "title": "My Section", "level": 2 }

// In blocks array:
{
  "type": "molecule.sectionHeader",
  "atomicLevel": "molecule",
  "props": {
    "number": "01",
    "title": "My Section",
    "id": "my-section"
  }
}
```

### Code Blocks

```json
{
  "type": "molecule.codeBlock",
  "atomicLevel": "molecule",
  "props": {
    "filename": "components/example.tsx",
    "code": "const example = () => {\n  return <div>Hello</div>\n}"
  }
}
```

**Critical:** Use `\n` for line breaks, keep everything in one JSON string!

### Feature Grid with Icons

```json
{
  "type": "organism.featureGrid",
  "atomicLevel": "organism",
  "props": {
    "columns": 2,
    "features": [
      {
        "icon": "shield",
        "title": "Feature Title",
        "description": "Feature description"
      }
    ]
  }
}
```

**Available icons:** shield, check, alertTriangle, zap, circle, info, lock, users, etc.

---

## Conversion Workflow

### Batch Size Guidance

- **Recommended:** 3–4 articles per batch
- **Avoid:** >4 in one batch (higher error rate on JSON strings/registry)
- **Validation:** One `npx tsc --noEmit` and one `pnpm run build` per batch

### Step 1: Create JSON File

```bash
# Path format:
data/strapi-mock/dashboard/articles/[category]/[slug].json
```

### Step 2: Register in Repository

```typescript
// lib/strapi/article-content.ts

// Add import
import newArticle from "@/data/strapi-mock/dashboard/articles/[category]/[slug].json";

// Add to registry
const articleContentRegistry: Record<string, ArticleContentDocument> = {
  // ... existing articles
  "[slug]": newArticle as ArticleContentDocument,
};
```

### Step 3: Validate

```bash
pnpm run build
# Look for: ✓ Compiled successfully
```

### Step 4: Test

```bash
pnpm run dev
# Navigate to: /dashboard/content-library/articles/[category]/[slug]
# Check: All sections render, no console errors
```

### Step 5: Clean Up (after validation)

```bash
# Delete TSX file
rm features/dashboard/content-library/articles/[name]-article.tsx

# Remove from richArticleComponents map in page.tsx
```

---

## Troubleshooting

### Error: "Unexpected end of string"

**Cause:** Line break in JSON string outside quotes
**Fix:** Keep all line breaks as `\n` inside string

### Error: "Type 'number' not assignable to '2 | 3 | 4'"

**Cause:** FeatureGrid columns prop
**Fix:** Already handled in render logic with `as 2 | 3 | 4`

### Icons Not Rendering

**Cause:** Icon name not in resolver map
**Fix:** Check `resolveArticleIcon()` function, add missing icon

### TOC Not Working

**Cause:** TOC `id` doesn't match section header `id`
**Fix:** Ensure exact match between TOC and sectionHeader props

### Build Fails

**Cause:** JSON syntax error or missing registry entry
**Fix:** Validate JSON, check import statement, check registry key

---

## Next 5 Articles to Migrate

1. **atomic-design-article.tsx** → `architecture/atomic-design-principles.json`
2. **planning-article.tsx** → `architecture/react-project-planning.json`
3. **zod-validation-article.tsx** → `forms/zod-validation-guide.json`
4. **multi-step-form-article.tsx** → `forms/multi-step-form-architecture.json`
5. **security-article.tsx** → `security/security-architecture-deep-dive.json`

---

## Quick Commands

```bash
# Validate build
pnpm run build 2>&1 | Select-Object -First 30

# Check specific file errors
# (use VS Code Problems panel)

# Run dev server
pnpm run dev

# Search for component usage
rg "FeatureGrid" features/dashboard/content-library/articles/

# Count remaining TSX articles
ls features/dashboard/content-library/articles/*.tsx | Measure-Object
```

---

**Remember:**

- ✅ Validate JSON syntax immediately after creation
- ✅ Test in browser before deleting TSX
- ✅ Keep atomic design levels accurate
- ✅ Match TOC IDs to section header IDs
- ✅ Use `\n` for line breaks in code blocks

**Status:** 1/30 complete | Pattern established | Ready to scale
