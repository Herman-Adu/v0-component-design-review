# Article Content Migration: Technical Learnings

**Date:** 2026-02-25  
**Scope:** Converting article content from TSX components to Strapi-aligned JSON documents  
**Status:** Pattern Established (9/30 articles complete)

---

## Overview

This document captures the technical learnings from migrating rich article content from React components (`features/dashboard/content-library/articles/*.tsx`) to JSON-based content documents (`data/strapi-mock/dashboard/articles/[category]/[slug].json`).

The migration establishes a **server-first, CMS-alignable architecture** where content structure mirrors Strapi's component model with explicit atomic design hierarchy.

---

## Architecture Pattern

### File Structure

```
app/(dashboard)/dashboard/content-library/articles/[category]/[slug]/page.tsx
  ↓ fetches from
lib/strapi/article-content.ts (server-only repository)
  ↓ reads from
data/strapi-mock/dashboard/articles/[category]/[slug].json
  ↓ renders with
components/molecules/article-components.tsx (atomic components)
```

### JSON Document Structure

```json
{
  "meta": {
    "slug": "article-slug",
    "title": "Article Title",
    "excerpt": "Brief description",
    "level": "intermediate",
    "category": "best-practices",
    "readTime": "14 min",
    "publishedAt": "2026-02-05",
    "tags": ["tag1", "tag2"]
  },
  "layout": "content-with-toc",
  "toc": [{ "id": "section-1", "title": "Section Title", "level": 2 }],
  "blocks": [
    {
      "type": "molecule.infoBox",
      "atomicLevel": "molecule",
      "props": {
        "variant": "important",
        "title": "Note Title",
        "body": "Content here"
      }
    }
  ]
}
```

---

## Critical Learnings

### 0. Batch Size & Throughput

**Current best batch size:** 3–4 articles per run.

**Why:**

- 2 is safe but slower.
- 3–4 keeps quality high while reducing context switches.
- > 4 increases risk of JSON string escaping mistakes and missed registry updates.

**Workflow (repeat per batch):**

1. Convert 3–4 TSX articles to JSON.
2. Update `lib/strapi/article-content.ts` registry once per batch.
3. Run `npx tsc --noEmit` and a single `pnpm run build`.

**Signal to reduce batch size:**

- JSON parse errors
- mismatched TOC IDs
- missing icons or registry entries

### 1. JSON String Escaping and Multi-Line Content

**Issue:** Code blocks in JSON props can have syntax errors when spanning multiple lines.

**Example of Error:**

```json
{
  "props": {
    "code": "const result = await fetch()\n    .then(res => res.json())
    .catch(err => console.log(err))"
  }
}
```

**Problem:** Line break between `.then()` and `.catch()` is **outside the string**, breaking JSON syntax.

**Correct Format:**

```json
{
  "props": {
    "code": "const result = await fetch()\n    .then(res => res.json())\n    .catch(err => console.log(err))"
  }
}
```

**TypeScript Error:**

```
Unexpected end of string at line 276
Expected comma at line 277
```

**Solution:**

- Keep all line breaks **inside** the string using `\n`
- Validate JSON with a linter immediately after creation
- Use proper JSON editor with syntax validation

**Automation Opportunity:** Create validation script to catch these during conversion.

---

### 2. Union Type Props and Runtime Type Assertions

**Issue:** JSON provides generic `number`, but component signature expects literal union type `2 | 3 | 4`.

**Component Signature:**

```typescript
// components/molecules/article-components.tsx
export function FeatureGrid({
  features,
  columns = 3,
}: {
  features: { icon?: ReactNode; title: string; description: string }[];
  columns?: 2 | 3 | 4; // ← Union of literal types
});
```

**JSON Provides:**

```json
{
  "type": "organism.featureGrid",
  "props": {
    "columns": 2,  // ← Plain number
    "features": [...]
  }
}
```

**TypeScript Error:**

```
Type 'number' is not assignable to type '3 | 2 | 4 | undefined'.
```

**Solution in Render Logic:**

```typescript
case "organism.featureGrid": {
  const { columns, features } = block.props as {
    columns: number;  // ← Accept as number
    features: Array<{ icon: string; title: string; description: string }>;
  };
  return (
    <FeatureGrid
      key={index}
      columns={columns as 2 | 3 | 4}  // ← Type assertion
      features={features.map(f => ({
        ...f,
        icon: resolveArticleIcon(f.icon),
      }))}
    />
  );
}
```

**General Pattern:**

1. Cast `block.props` to shape with generic types (e.g., `number`, `string`)
2. Add type assertion when passing to component with union/literal types
3. Consider runtime validation for production safety

**Alternative Solution (Stricter):**

```typescript
// In type definitions
export interface FeatureGridBlock {
  type: "organism.featureGrid";
  atomicLevel: "organism";
  props: {
    columns: 2 | 3 | 4;  // ← Explicit in type
    features: Array<{ icon: string; title: string; description: string }>;
  };
}

// In JSON Schema validation
{
  "columns": {
    "type": "integer",
    "enum": [2, 3, 4]  // ← Schema enforces valid values
  }
}
```

---

### 3. Icon Resolution: Strings to React Components

**Challenge:** JSON stores icon names as strings, but components need `ReactNode`.

**JSON Content:**

```json
{
  "features": [
    {
      "icon": "shield",
      "title": "Security Feature",
      "description": "Secure by default"
    },
    {
      "icon": "check",
      "title": "Validated",
      "description": "Fully tested"
    }
  ]
}
```

**Icon Resolution Function:**

```typescript
// In page.tsx
function resolveArticleIcon(iconName: string): ReactNode {
  const iconMap: Record<string, ReactNode> = {
    shield: <ArticleIcons.Shield className="h-6 w-6" />,
    check: <ArticleIcons.Check className="h-6 w-6" />,
    alertTriangle: <ArticleIcons.AlertTriangle className="h-6 w-6" />,
    zap: <ArticleIcons.Zap className="h-6 w-6" />,
    // ... all article icons
  };

  return iconMap[iconName] || <Circle className="h-6 w-6" />;  // Fallback
}
```

**Usage in Render:**

```typescript
case "organism.featureGrid": {
  const { features } = block.props as {
    features: Array<{ icon: string; title: string; description: string }>;
  };
  return (
    <FeatureGrid
      features={features.map((feature) => ({
        ...feature,
        icon: resolveArticleIcon(feature.icon),  // string → ReactNode
      }))}
    />
  );
}
```

**Best Practices:**

1. **Centralize icon mapping** - single resolver function per route or globally
2. **Provide fallback** - unknown icon names get default Circle icon
3. **Type safety** - create `type ArticleIconName = "shield" | "check" | ...` for validation
4. **Icon documentation** - maintain list of available icon names for content editors

**Future Enhancement (Strapi):**
In real Strapi CMS, icons would be:

- Enum field in content type: `iconName: "shield" | "check" | ...`
- Or media library icons with URL: `iconUrl: string`
- Resolver would handle both: `resolveIcon(iconName || iconUrl)`

---

### 4. Block-Based Rendering with Type Safety

**Pattern:** Switch statement on `block.type` with per-case type assertions.

**Implementation:**

```typescript
function renderArticleBlocks(blocks: ArticleContentBlock[]) {
  return blocks.map((block, index) => {
    switch (block.type) {
      // ATOM LEVEL
      case "atom.paragraph": {
        const { text } = block.props as { text: string };
        return <p key={index} className="text-base leading-relaxed">{text}</p>;
      }

      // MOLECULE LEVEL
      case "molecule.infoBox": {
        const { variant, title, body } = block.props as {
          variant: "tip" | "warning" | "important";
          title: string | null;
          body: string;
        };
        return (
          <InfoBox
            key={index}
            type={variant}
            title={title ?? undefined}
          >
            {body}
          </InfoBox>
        );
      }

      case "molecule.sectionHeader": {
        const { number, title, id } = block.props as {
          number: string;
          title: string;
          id: string;
        };
        return <SectionHeader key={index} number={number} title={title} id={id} />;
      }

      // ORGANISM LEVEL
      case "organism.metricsGrid": {
        const { metrics } = block.props as {
          metrics: Array<{
            label: string;
            value: string;
            change: string;
            positive: boolean;
          }>;
        };
        return <MetricsGrid key={index} metrics={metrics} />;
      }

      case "organism.featureGrid": {
        const { columns, features } = block.props as {
          columns: number;
          features: Array<{ icon: string; title: string; description: string }>;
        };
        return (
          <FeatureGrid
            key={index}
            columns={columns as 2 | 3 | 4}
            features={features.map(f => ({
              ...f,
              icon: resolveArticleIcon(f.icon),
            }))}
          />
        );
      }

      default:
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  });
}
```

**Type Safety Levels:**

1. **Block Type:** `ArticleBlockType` union ensures valid `block.type` strings
2. **Props Shape:** Per-case type assertion documents expected structure
3. **Runtime Fallback:** Default case handles unknown block types gracefully

**Atomic Level Metadata:**

- Each block includes `atomicLevel: "atom" | "molecule" | "organism"`
- **Not used in rendering** (yet), but critical for:
  - Strapi CMS component categorization
  - Content editor guidance (complexity indication)
  - Analytics (track which complexity levels get used)
  - Future filtering/search

---

### 5. Layout System with Table of Contents

**Two Layout Modes:**

```typescript
export interface ArticleContentDocument {
  meta: ArticleContentMeta;
  layout: "content-with-toc" | "content-only"; // ← Layout mode
  toc?: TOCItem[]; // ← Required for content-with-toc
  blocks: ArticleContentBlock[];
}
```

**Rendering Logic:**

```typescript
{contentDocument ? (
  contentDocument.layout === "content-with-toc" ? (
    // Two-column layout: content + TOC sidebar
    <div className="flex gap-8">
      <div className="flex-1">
        {renderArticleBlocks(contentDocument.blocks)}
      </div>
      <aside className="hidden xl:block w-64 flex-shrink-0 sticky top-24 self-start">
        <TableOfContents items={contentDocument.toc || []} />
      </aside>
    </div>
  ) : (
    // Single column: content only
    <div className="max-w-3xl">
      {renderArticleBlocks(contentDocument.blocks)}
    </div>
  )
) : (
  // Fallback for articles not yet migrated
  RichContentComponent ? <RichContentComponent /> : formatContent(markdown)
)}
```

**TOC Structure:**

```json
{
  "layout": "content-with-toc",
  "toc": [
    { "id": "business-case", "title": "The Business Case", "level": 2 },
    { "id": "semantic-html", "title": "Semantic HTML Foundation", "level": 2 },
    { "id": "focus-management", "title": "Focus Management", "level": 2 }
  ]
}
```

**Important:** TOC items must match `id` attributes in section headers:

```json
{
  "type": "molecule.sectionHeader",
  "props": {
    "number": "01",
    "title": "The Business Case",
    "id": "business-case" // ← Matches TOC item id
  }
}
```

---

### 6. Content Rendering Priority Cascade

**Three-Tier Fallback System:**

```typescript
const contentDocument = getArticleContentDocument(article.slug);  // JSON
const RichContentComponent = richArticleComponents[article.slug];  // TSX
const markdown = article.content;  // Markdown string

return (
  <article>
    {contentDocument ? (
      // Priority 1: JSON content document (NEW)
      renderWithLayout(contentDocument)
    ) : RichContentComponent ? (
      // Priority 2: Rich TSX component (LEGACY)
      <RichContentComponent />
    ) : (
      // Priority 3: Basic markdown (FALLBACK)
      <div className="prose">{formatContent(markdown)}</div>
    )}
  </article>
);
```

**Migration States:**

1. **Not Started:** Only markdown exists
2. **In Progress:** JSON document created, TSX still exists
3. **Complete:** JSON document renders, TSX component deleted
4. **Cleanup:** Remove TSX from richArticleComponents map

**Benefits:**

- Zero downtime during migration
- Can test JSON rendering before removing TSX
- Gradual rollout (A/B test JSON vs TSX if needed)
- Safe rollback (restore TSX if JSON has issues)

---

## Block Type Reference

### Atoms (1 type)

- `atom.paragraph` - Simple text paragraph

### Molecules (4 types)

- `molecule.infoBox` - Colored callout boxes (tip, warning, important)
- `molecule.sectionHeader` - Numbered section headers with anchor IDs
- `molecule.codeBlock` - Syntax-highlighted code with filename
- `molecule.keyTakeaway` - Special callout for main takeaway

### Organisms (6 types)

- `organism.metricsGrid` - Grid of metrics with labels/values/changes
- `organism.featureGrid` - Grid of features with icons/titles/descriptions
- `organism.comparisonCards` - Ideal vs Not Ideal comparison lists
- `organism.processFlow` - Numbered process steps with labels/sublabels
- `organism.statsTable` - Data table with headers and rows
- `organism.relatedArticles` - Links to related articles with levels

**Total:** 11 block types across 3 atomic levels

---

## Server-Only Pattern

**Critical:** Article content fetching must be server-side only.

**Enforcement:**

```typescript
// lib/strapi/article-content.ts
import "server-only"; // ← Prevents client-side imports

export function getArticleContentDocument(
  slug: string,
): ArticleContentDocument | null {
  return articleContentRegistry[slug] ?? null;
}
```

**Why Server-Only:**

1. **Bundle Size:** Don't ship all JSON content to client
2. **Security:** Content may have unpublished drafts in registry
3. **Performance:** Fetch only needed content per page
4. **SEO:** Content rendered server-side for crawlers
5. **ISR/SSG:** Static generation requires server data access

**Client-Side Alternative (Bad):**

```typescript
// ❌ DON'T DO THIS
"use client";
import allArticles from "@/data/articles.json";  // Entire file to client!

export default function ArticlePage({ slug }) {
  const article = allArticles.find(a => a.slug === slug);  // Client-side filter
  return <div>{article.content}</div>;
}
```

**Server-Side (Correct):**

```typescript
// ✅ DO THIS
import { getArticleContentDocument } from "@/lib/strapi/article-content";  // Server-only

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const contentDocument = getArticleContentDocument(params.slug);  // Server fetch
  return <article>{renderArticleBlocks(contentDocument.blocks)}</article>;
}
```

---

## Migration Workflow

### Per-Article Checklist

1. **Read** existing TSX article component
   - Location: `features/dashboard/content-library/articles/[name]-article.tsx`
   - Identify all atomic components used
   - Note: InfoBox variants, FeatureGrid columns, icon names, etc.

2. **Map** components to block types
   - `<InfoBox type="tip">` → `{ type: "molecule.infoBox", props: { variant: "tip" } }`
   - `<MetricsGrid>` → `{ type: "organism.metricsGrid", props: { metrics: [...] } }`
   - Preserve all prop values exactly

3. **Create** JSON document
   - Path: `data/strapi-mock/dashboard/articles/[category]/[slug].json`
   - Include: meta, layout, toc (if needed), blocks
   - Validate JSON syntax immediately

4. **Register** in content repository

   ```typescript
   // lib/strapi/article-content.ts
   import newArticle from "@/data/strapi-mock/dashboard/articles/[category]/[slug].json";

   const articleContentRegistry: Record<string, ArticleContentDocument> = {
     "existing-article": existingArticle as ArticleContentDocument,
     "[slug]": newArticle as ArticleContentDocument, // ← Add here
   };
   ```

5. **Validate** TypeScript compilation

   ```bash
   pnpm run build
   # Must show: ✓ Compiled successfully
   # Must show: ✓ Running TypeScript ... (0 errors)
   ```

6. **Test** rendering in dev server

   ```bash
   pnpm run dev
   # Navigate to: /dashboard/content-library/articles/[category]/[slug]
   # Verify: All sections render, icons appear, TOC works, no console errors
   ```

7. **Delete** TSX component (after validation passes)

   ```bash
   rm features/dashboard/content-library/articles/[name]-article.tsx
   ```

8. **Remove** from legacy map
   ```typescript
   // app/.../[slug]/page.tsx
   const richArticleComponents: Record<string, () => JSX.Element> = {
     // "article-slug": ArticleComponent,  // ← Remove this line
   };
   ```

### Batch Strategy

**Phase 1: Establish Pattern (Next 5 articles)**

- Migrate manually to refine process
- Document any new block types needed
- Identify automation opportunities

**Phase 2: Accelerate (Remaining ~24 articles)**

- Semi-automated: Script extracts component usage, generates JSON scaffold
- Manual: Fill in prop values, validate, test
- Parallel: Multiple articles simultaneously

**Phase 3: Cleanup**

- Delete all TSX article components
- Remove richArticleComponents map entirely
- Update tests to use JSON content

---

## Automation Opportunities

### 1. JSON Validation Script

```typescript
// scripts/validate-article-json.ts
import { articleContentRegistry } from "@/lib/strapi/article-content";

function validateArticleContent() {
  for (const [slug, doc] of Object.entries(articleContentRegistry)) {
    // Validate meta fields
    if (!doc.meta.slug || !doc.meta.title) {
      throw new Error(`${slug}: Missing required meta fields`);
    }

    // Validate TOC matches section headers
    if (doc.layout === "content-with-toc" && !doc.toc?.length) {
      throw new Error(`${slug}: Layout requires TOC but none provided`);
    }

    // Validate block structure
    for (const block of doc.blocks) {
      if (!block.type || !block.atomicLevel || !block.props) {
        throw new Error(`${slug}: Invalid block structure`);
      }
    }
  }

  console.log("✓ All article content validated");
}
```

### 2. Component Usage Extraction

```typescript
// scripts/extract-article-components.ts
import { parse } from "@babel/parser";
import traverse from "@babel/traverse";

function extractComponentUsage(tsxFilePath: string) {
  const ast = parse(readFileSync(tsxFilePath, "utf-8"), {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  const components: Array<{ type: string; props: Record<string, any> }> = [];

  traverse(ast, {
    JSXElement(path) {
      const name = path.node.openingElement.name;
      if (name.type === "JSXIdentifier") {
        const props = extractProps(path.node.openingElement.attributes);
        components.push({ type: name.name, props });
      }
    },
  });

  return components;
}
```

### 3. JSON Scaffold Generator

```typescript
// scripts/generate-article-scaffold.ts
function generateArticleScaffold(
  slug: string,
  components: Array<{ type: string; props: any }>,
) {
  const blocks = components.map((comp) => ({
    type: mapComponentToBlockType(comp.type),
    atomicLevel: getAtomicLevel(comp.type),
    props: comp.props,
  }));

  return {
    meta: {
      slug,
      title: "TODO: Add title",
      excerpt: "TODO: Add excerpt",
      // ... other meta fields with placeholders
    },
    layout: "content-with-toc", // Default
    toc: [], // TODO: Extract from SectionHeader components
    blocks,
  };
}
```

---

## Testing Strategy

### Type Safety Tests

```typescript
// Already enforced by TypeScript compilation
// No explicit tests needed if build passes
```

### Content Rendering Tests

```typescript
// tests/article-content.test.tsx
describe("Article Content Rendering", () => {
  it("renders all block types without errors", () => {
    const mockBlocks: ArticleContentBlock[] = [
      {
        type: "molecule.infoBox",
        atomicLevel: "molecule",
        props: { variant: "tip", title: "Test", body: "Content" },
      },
      // ... one of each block type
    ];

    const { container } = render(<>{renderArticleBlocks(mockBlocks)}</>);

    expect(container.querySelector(".info-box")).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });

  it("resolves all icon names", () => {
    const iconNames = ["shield", "check", "alertTriangle", "zap"];

    iconNames.forEach((name) => {
      const icon = resolveArticleIcon(name);
      expect(icon).toBeTruthy();
      expect(React.isValidElement(icon)).toBe(true);
    });
  });
});
```

### Integration Tests (Playwright)

```typescript
// e2e/article-pages.spec.ts
test("article page renders from JSON", async ({ page }) => {
  await page.goto(
    "/dashboard/content-library/articles/best-practices/building-accessible-web-applications",
  );

  // Verify meta content
  await expect(page.locator("h1")).toContainText(
    "Building Accessible Web Applications",
  );

  // Verify TOC renders
  await expect(page.locator("aside nav")).toBeVisible();

  // Verify blocks render
  await expect(page.locator(".info-box")).toHaveCount(3);
  await expect(page.locator(".metrics-grid")).toBeVisible();

  // Verify icons render
  await expect(page.locator("svg[class*='lucide']")).toHaveCount(10);
});
```

---

## Common Pitfalls

### ❌ Mistake 1: Forgetting Type Assertion

```typescript
// Will cause TypeScript error
columns = { columns }; // Type 'number' not assignable to '2 | 3 | 4'
```

**Fix:** `columns={columns as 2 | 3 | 4}`

### ❌ Mistake 2: Line Breaks in JSON Strings

```json
{
  "code": "line1\n
    line2"  // ← Syntax error
}
```

**Fix:** `"code": "line1\n    line2"`

### ❌ Mistake 3: Missing Icon Resolution

```typescript
// Will pass string to component expecting ReactNode
icon: feature.icon; // ❌ string, not ReactNode
```

**Fix:** `icon: resolveArticleIcon(feature.icon)`

### ❌ Mistake 4: TOC ID Mismatch

```json
{
  "toc": [{ "id": "section-one", "title": "Section One", "level": 2 }],
  "blocks": [
    {
      "type": "molecule.sectionHeader",
      "props": { "id": "section-1", "title": "Section One" } // ❌ Mismatch
    }
  ]
}
```

**Fix:** Ensure `toc[].id === sectionHeader.props.id`

### ❌ Mistake 5: Missing Null Handling

```typescript
// Component expects title?: string (optional)
// JSON provides title: null
title = { title }; // ❌ Passes null, component may break
```

**Fix:** `title={title ?? undefined}`

---

## Future Enhancements

### 1. JSON Schema Validation

- Generate JSON Schema from TypeScript types
- Validate all JSON files at build time
- VS Code intellisense for JSON editing

### 2. Content Preview in Strapi

- Create Strapi component models matching block types
- Enable visual content editing
- Preview articles before publish

### 3. Dynamic Block Loading

- Code-split large block components
- Lazy load organism-level components
- Improve initial page load performance

### 4. Content Search Index

- Index article blocks for full-text search
- Search by atomic level (find all "infoBox" usage)
- Content analytics (most-used block types)

### 5. A/B Testing Framework

- Test JSON content vs TSX rendering
- Measure performance differences
- Content variation experiments

---

## Summary

**Key Achievements:**

- ✅ Established server-first, JSON-based content pattern
- ✅ 11 block types covering all article content needs
- ✅ Explicit atomic design hierarchy in content layer
- ✅ Type-safe rendering with graceful fallbacks
- ✅ Zero TypeScript errors after fixes
- ✅ Build successful (160/160 pages)

**Migration Progress:**

- 1/30 articles converted (building-accessible-web-applications)
- 61 content blocks in first article
- Pattern proven, ready to scale

**Next Steps:**

1. Migrate next 5 articles manually (refine process)
2. Build automation scripts (extraction + scaffold generation)
3. Batch convert remaining 24 articles
4. Clean up TSX components and legacy code
5. Update documentation for content editors

---

**Status:** ✅ Pattern Established | 🔄 Migration In Progress | → Ready to Scale
