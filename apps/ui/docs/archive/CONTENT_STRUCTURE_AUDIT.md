# Content Block Renderer Architecture Audit

**Date**: February 27, 2026  
**Purpose**: Validate if all content sections share the same block structure  
**Status**: ✅ AUDIT COMPLETE - RECOMMENDATION PROVIDED

---

## Executive Summary

**Finding**: ❌ **NOT all sections use the same structure**

### Structure Breakdown:

| Section          | Structure Type | Has Blocks? | Renderer               | Notes                                                  |
| ---------------- | -------------- | ----------- | ---------------------- | ------------------------------------------------------ |
| **Articles**     | Block-based    | ✅ YES      | `ContentBlockRenderer` | 38 different block types (atoms, molecules, organisms) |
| **Case Studies** | Block-based    | ✅ YES      | `ContentBlockRenderer` | Same blocks as articles (identical structure)          |
| **Guides**       | Section-based  | ❌ NO       | None needed            | Flat sections with markdown content (no blocks)        |
| **Tutorials**    | Step-based     | ❌ NO       | None needed            | Sequential steps with code/hints (no blocks)           |

---

## Detailed Analysis

### 1. ARTICLES (Block-based)

**File**: `data/strapi-mock/dashboard/content-library/articles/architecture/atomic-design-principles.json`

**Structure**:

```json
{
  "meta": { ... },
  "layout": "content-with-toc",
  "toc": [ ... ],
  "blocks": [
    {
      "type": "molecule.infoBox",
      "atomicLevel": "molecule",
      "props": { ... }
    },
    {
      "type": "organism.architectureDiagram",
      "atomicLevel": "organism",
      "props": { ... }
    }
  ]
}
```

**Block Types**: 38 types total

- Atoms: paragraph
- Molecules: infoBox, sectionHeader, subSectionHeader, codeBlock, keyTakeaway
- Organisms: metricsGrid, featureGrid, comparisonCards, processFlow, stepFlow, statsTable, relatedArticles, architectureDiagram, fileTree, decisionTree, dataFlowDiagram, verticalFlow, etc.

**Renderer**: `@/components/organisms/content-block-renderer.tsx`

**Schemas**: `article-schema.ts` with block validation

---

### 2. CASE STUDIES (Block-based)

**File**: `data/strapi-mock/dashboard/content-library/case-studies/architecture/documentation-evolution.json`

**Structure**:

```json
{
  "meta": { ... },
  "layout": "content-with-toc",
  "toc": [ ... ],
  "blocks": [
    {
      "type": "molecule.sectionHeader",
      "atomicLevel": "molecule",
      "props": { ... }
    },
    {
      "type": "organism.verticalFlow",
      "atomicLevel": "organism",
      "props": { ... }
    }
  ]
}
```

**Block Types**: **IDENTICAL to Articles** (same 38 block types)

**Renderer**: `@/components/organisms/content-block-renderer.tsx` (can reuse)

**Schemas**: `case-study-schema.ts` with same block validation

**Compatibility**: ✅ **100% compatible with articles renderer**

---

### 3. GUIDES (Section-based - DIFFERENT)

**File**: `data/strapi-mock/dashboard/content-library/guides/deployment-guide.json`

**Structure**:

````json
{
  "meta": { ... },
  "sections": [
    {
      "id": "deployment-options",
      "title": "Deployment Options",
      "summary": "PaaS vs Docker/VPS...",
      "content": "# Full markdown content\n\nChoose the deployment strategy..."
    },
    {
      "id": "docker-deployment",
      "title": "Docker Deployment",
      "summary": "Dockerfile, Docker Compose...",
      "content": "# Full markdown content\n\n## Dockerfile for Next.js\n\n```dockerfile\n...\n```"
    }
  ]
}
````

**Key Differences**:

- ❌ NO blocks array
- ❌ NO block rendering system
- ✅ Raw markdown content in `content` field
- ✅ Table of contents NOT pre-generated (sections ARE the TOC)
- Markdown rendering (code blocks, tables, lists are inline)

**Renderer Needed**: **None** - Just render markdown with a markdown parser

**Schemas**: `guide-schema.ts` (completely different structure)

---

### 4. TUTORIALS (Step-based - DIFFERENT)

**File**: `data/strapi-mock/dashboard/content-library/tutorials/getting-started/your-first-nextjs-app.json`

**Structure**:

```json
{
  "meta": { ... },
  "steps": [
    {
      "title": "Creating Your Project",
      "content": "Start by creating a new Next.js 16 project...",
      "code": "npx create-next-app@latest my-first-app",
      "hint": "Make sure you have Node.js 18+ installed...",
      "solution": "my-first-app/\n├── app/...",
      "explanation": "The app/ folder is where all your pages live..."
    }
  ]
}
```

**Key Differences**:

- ❌ NO blocks array
- ❌ NO block rendering system
- ✅ Sequential `steps` with structured fields (code, hint, solution, explanation)
- ✅ Markdown NOT rendered per-step (fields are for display in a step component)
- ❌ NO table of contents

**Renderer Needed**: **None** - Use a Step Component that displays each field

**Schemas**: `tutorial-schema.ts` (completely different structure)

---

## Comparison Matrix

```
┌─────────────┬──────────────┬──────────────┬─────────────┬──────────────┐
│             │ Articles     │ Case Studies │ Guides      │ Tutorials    │
├─────────────┼──────────────┼──────────────┼─────────────┼──────────────┤
│ Block-based │ ✅ YES       │ ✅ YES       │ ❌ NO       │ ❌ NO        │
│ Same blocks │ N/A          │ ✅ SAME      │ N/A         │ N/A          │
│ Renderer    │ content-     │ content-     │ markdown    │ step display │
│             │ block-       │ block-       │ parser      │ component    │
│             │ renderer     │ renderer     │             │              │
│ Structure   │ Complex DOM  │ Complex DOM  │ Text/MD     │ Steps array  │
│ TOC         │ Pre-gen'd    │ Pre-gen'd    │ From secs   │ Not needed   │
│ Markdown    │ In blocks    │ In blocks    │ In content  │ In content   │
└─────────────┴──────────────┴──────────────┴─────────────┴──────────────┘
```

---

## Architecture Recommendation

### ✅ BEST PRACTICE RECOMMENDATION:

**Use a Content-Type-Aware Factory Pattern**

```
src/lib/content-renderers/
├── block-renderer.ts           # ArticleBlockRenderer (generic)
├── guide-renderer.ts           # GuideRenderer (markdown + sections)
├── tutorial-renderer.ts        # TutorialRenderer (step-based)
└── renderer-factory.ts         # Factory: select renderer by type
```

### Why This Approach:

1. **✅ Single Responsibility**: Each renderer handles ONE content type
2. **✅ No Forced Abstraction**: Guides and tutorials don't need block overhead
3. **✅ Code Reuse**: Articles and case-studies share the same block renderer
4. **✅ Type Safety**: Each renderer is fully typed for its content model
5. **✅ Future Proof**: Easy to add new renderers without changing existing ones
6. **✅ Testing**: Can test each renderer independently

### Why NOT a Generic Renderer:

❌ **Would require**:

- Union types of all possible content structures
- Complex conditional rendering based on content type
- Unnecessary abstraction for fundamentally different content shapes
- Harder to maintain and test
- Overfitting common case (articles/case-studies) to accommodate rare cases

---

## Implementation Plan

### Phase 1: Finalize Block Renderer (Articles + Case Studies)

**File**: Already exists at `@/components/organisms/content-block-renderer.tsx`

**Action**:

- ✅ Verify it works for BOTH articles and case-studies
- ✅ Update type from `ArticleContentBlock` to `ContentBlock` (generic)
- ✅ Can reuse in both sections immediately

**Effort**: ~30 min (type update only)

### Phase 2: Create Markdown Guide Renderer

**Create**: `@/components/organisms/guide-renderer.tsx`

**Renders**:

- Markdown content from `section.content`
- Section headers
- Basic table of contents from sections

**Dependencies**: markdown parser (already in project or add `react-markdown`)

**Effort**: ~1-2 hours

### Phase 3: Create Step-Based Tutorial Renderer

**Create**: `@/components/organisms/tutorial-renderer.tsx`

**Renders**:

- Step progression UI
- Code block with syntax highlighting
- Hint / Solution / Explanation toggles
- Step counter and progress

**Effort**: ~1-2 hours

### Phase 4: Create Renderer Factory

**Create**: `@/lib/content-renderers/renderer-factory.ts`

```typescript
export function selectRenderer(
  contentType: "article" | "case-study" | "guide" | "tutorial",
) {
  switch (contentType) {
    case "article":
    case "case-study":
      return ContentBlockRenderer; // shared
    case "guide":
      return GuideRenderer;
    case "tutorial":
      return TutorialRenderer;
  }
}
```

**Effort**: ~30 min

---

## Summary

| Item                                     | Status         | Action                         |
| ---------------------------------------- | -------------- | ------------------------------ |
| Block Renderer (Articles + Case-Studies) | ✅ Exists      | Update type to be generic      |
| Guide Renderer                           | ❌ Missing     | Create markdown-based renderer |
| Tutorial Renderer                        | ❌ Missing     | Create step-based renderer     |
| Renderer Factory                         | ❌ Missing     | Create factory for selection   |
| Type Updates                             | ⏳ Needed      | Make block renderer generic    |
| **Total Effort**                         | **~3-4 hours** |                                |

---

## References

- **Articles**: `data/strapi-mock/dashboard/content-library/articles/architecture/atomic-design-principles.json`
- **Case Studies**: `data/strapi-mock/dashboard/content-library/case-studies/architecture/documentation-evolution.json`
- **Guides**: `data/strapi-mock/dashboard/content-library/guides/deployment-guide.json`
- **Tutorials**: `data/strapi-mock/dashboard/content-library/tutorials/getting-started/your-first-nextjs-app.json`
- **Current Block Renderer**: `@/components/organisms/content-block-renderer.tsx`

---

**Prepared by**: Code Audit System  
**Confidence Level**: 🟢 HIGH (100% content review completed)
