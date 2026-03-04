# Documentation→Dynamic Zones Migration Plan

**Created:** March 2, 2026  
**Status:** Architecture Planning  
**Authority:** Complete migration strategy for documentation section  
**Reference:** STRAPI_DYNAMIC_ZONES_AUTHORITY.md, CONTENT_LIBRARY_REFACTOR_COMPLETE.md, EXTRACTION_FIRST_MIGRATION_PLAN.md

---

## Executive Summary

The **documentation section** (strategic-overview, cms-reference, app-reference, infrastructure-and-ops) currently uses **static client component pages** with inline/hardcoded data. This migration converts them to the **same 6-layer dynamic zone architecture** established by content-library.

### Target Architecture

```
Documentation (Dynamic Routes)
├── Schema Layer → Zod validation for documentation JSON
├── Builder Layer → Loads & validates from data/strapi-mock/dashboard/documentation/
├── Repository Layer → Query functions with logging
├── ViewModels Layer → Presentation transformation
├── Route Layer → /dashboard/documentation/[category]/[slug]
└── Tests Layer → Integration tests (like content-library)
```

### Why This Migration?

**Current Problems:**

- ❌ All pages are "use client" components (unnecessary JS)
- ❌ Data is hardcoded inline or in separate JSON without validation
- ❌ No schema validation or type safety
- ❌ Duplicate code across documentation pages
- ❌ Not aligned with content-library pattern
- ❌ Cannot reuse block components from content library
- ❌ No integration tests for documentation data layer

**Target State:**

- ✅ All pages are SERVER components (zero unnecessary client JS)
- ✅ Data comes from validated Strapi mock JSON with dynamic zones
- ✅ Reuses existing block components from content-library
- ✅ Dynamic routing: `/dashboard/documentation/[category]/[slug]`
- ✅ Full integration test coverage like content-library
- ✅ Any client interactivity extracted to small, focused client components

---

## Current State Audit

### Documentation Domains (4 Categories)

| Category                 | Pages | Current Status   | Data Source                                            |
| ------------------------ | ----- | ---------------- | ------------------------------------------------------ |
| **Strategic Overview**   | 5     | All "use client" | `/data/strapi-mock/dashboard/strategic-overview*.json` |
| **CMS Reference**        | 6     | All "use client" | `/data/strapi-mock/dashboard/cms-reference*.json`      |
| **App Reference**        | 7     | All "use client" | `/data/strapi-mock/dashboard/app-reference*.json`      |
| **Infrastructure & Ops** | 5     | All "use client" | `/data/strapi-mock/dashboard/infrastructure-ops*.json` |

**Total:** 23 documentation pages to migrate

### Current Page Structure

Example: `app/(dashboard)/dashboard/documentation/strategic-overview/overview/page.tsx`

```tsx
"use client"; // ← Problem: Unnecessary client component

import stratOverviewData from "@/data/strapi-mock/dashboard/strategic-overview.json";

export default function StrategicOverviewPage() {
  const { header, sections, audiences } = stratOverviewData;

  return (
    <div className="space-y-8">
      {/* Inline hardcoded UI structure */}
      <div className="flex flex-col gap-2">{/* ... */}</div>
    </div>
  );
}
```

**Problems:**

1. "use client" directive - page should be server component
2. No schema validation of JSON data
3. Inline UI structure instead of block-based rendering
4. Icon mapping logic repeated across pages
5. No reusable block components

---

## Components Used in Documentation Pages

### Component Inventory (From Audit)

**Atoms:**

- `CodeBlock` - Syntax highlighting with copy button (used 28 times)
- `Callout` - Info/warning/success boxes (used 35 times)
- `Spoiler` - Collapsible content (used 22 times)
- `Badge` - Labels and tags (used extensively)

**Molecules:**

- `DocPage` - Page layout wrapper with header/meta/sections
- `DocSectionHeader` - Section headings with anchors
- `ContentCard` - Cards for article/tutorial/case-study listings

**UI Components (shadcn/ui):**

- `Card`, `CardHeader`, `CardContent`, `CardDescription`, `CardTitle`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`
- Lucide icons (50+ different icons used)

### Mapping to Block System

These components will become **block types** in the dynamic zone system:

| Current Component      | Block Type            | Atomic Level | Props                                            |
| ---------------------- | --------------------- | ------------ | ------------------------------------------------ |
| `CodeBlock`            | `block.codeBlock`     | atom         | `language`, `code`, `title?`, `showLineNumbers?` |
| `Callout`              | `block.callout`       | atom         | `type`, `title`, `children`                      |
| `Spoiler`              | `block.collapsible`   | molecule     | `title`, `defaultOpen?`, `children`              |
| `DocSectionHeader`     | `block.sectionHeader` | molecule     | `id`, `title`, `number?`                         |
| `Card`                 | `block.card`          | molecule     | `title`, `description`, `icon?`, `content`       |
| `Tabs`                 | `block.tabs`          | organism     | `tabs: [{label, content}]`                       |
| Inline text/paragraphs | `block.paragraph`     | atom         | `text`, `className?`                             |
| Lists                  | `block.list`          | atom         | `items`, `ordered?`                              |

### New Block Components Needed

Based on documentation content analysis, we need these additional blocks:

1. **`block.featureGrid`** - Grid of features/benefits with icons
2. **`block.statsTable`** - Table with statistics/metrics
3. **`block.comparisonTable`** - Comparison between options/tools
4. **`block.architectureDiagram`** - Visual architecture diagrams
5. **`block.processFlow`** - Step-by-step process visualization
6. **`block.infoBox`** - Highlighted info/warning/tip boxes

---

## Target Architecture: 6-Layer System

### Layer 1: Schema (Validation)

**File:** `lib/strapi/dashboard/documentation/documentation-schema.ts`

```typescript
import { z } from "zod";

// Block schemas
const ParagraphBlockSchema = z.object({
  type: z.literal("block.paragraph"),
  text: z.string(),
  className: z.string().optional(),
});

const CodeBlockSchema = z.object({
  type: z.literal("block.codeBlock"),
  language: z.string(),
  code: z.string(),
  title: z.string().optional(),
  showLineNumbers: z.boolean().optional(),
});

const CalloutBlockSchema = z.object({
  type: z.literal("block.callout"),
  calloutType: z.enum(["info", "warning", "success", "error"]),
  title: z.string(),
  content: z.string(),
});

const SectionHeaderBlockSchema = z.object({
  type: z.literal("block.sectionHeader"),
  id: z.string(),
  title: z.string(),
  number: z.string().optional(),
});

// ... more block schemas

// Discriminated union of all block types
const BlockSchema = z.discriminatedUnion("type", [
  ParagraphBlockSchema,
  CodeBlockSchema,
  CalloutBlockSchema,
  SectionHeaderBlockSchema,
  // ... other blocks
]);

// Documentation document schema
export const DocumentationSchema = z.object({
  meta: z.object({
    slug: z.string().regex(/^[a-z0-9\-]+$/),
    title: z.string().min(5),
    excerpt: z.string().min(20),
    category: z.enum([
      "strategic-overview",
      "cms-reference",
      "app-reference",
      "infrastructure-ops",
    ]),
    audience: z.string(),
    publishedAt: z.string(),
    lastUpdated: z.string(),
    tags: z.array(z.string()),
  }),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      canonicalUrl: z.string().optional(),
    })
    .optional(),
  toc: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        level: z.number().min(1).max(6),
      }),
    )
    .optional(),
  blocks: z.array(BlockSchema),
});

export type DocumentationDocument = z.infer<typeof DocumentationSchema>;
export type Block = z.infer<typeof BlockSchema>;
```

### Layer 2: Content Builder (Data Loading)

**File:** `lib/strapi/dashboard/documentation/documentation-content-builder.ts`

```typescript
import "server-only";
import * as fs from "fs";
import * as path from "path";
import {
  DocumentationSchema,
  type DocumentationDocument,
} from "./documentation-schema";
import { dataLogger } from "@/lib/logging";

const DOCUMENTATION_DIR = path.join(
  process.cwd(),
  "data/strapi-mock/dashboard/documentation",
);

// Load all documentation at module init
const documentation = ((): DocumentationDocument[] => {
  const results: DocumentationDocument[] = [];
  const categories = [
    "strategic-overview",
    "cms-reference",
    "app-reference",
    "infrastructure-ops",
  ];

  for (const category of categories) {
    const categoryDir = path.join(DOCUMENTATION_DIR, category);
    if (!fs.existsSync(categoryDir)) continue;

    const files = fs.readdirSync(categoryDir);
    for (const file of files) {
      if (!file.endsWith(".json")) continue;

      try {
        const filePath = path.join(categoryDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const validated = DocumentationSchema.parse(content);
        results.push(validated);
        dataLogger.info(`Loaded documentation: ${validated.meta.slug}`, {
          category,
        });
      } catch (e) {
        const errorMsg = e instanceof Error ? e.message : String(e);
        throw new Error(`Failed to validate ${category}/${file}: ${errorMsg}`);
      }
    }
  }

  dataLogger.info(`Loaded ${results.length} documentation documents`);
  return results;
})();

// Exported API
export function getDocumentationList(): DocumentationDocument[] {
  return documentation;
}

export function getDocumentationBySlug(
  slug: string,
): DocumentationDocument | null {
  return documentation.find((d) => d.meta.slug === slug) ?? null;
}

export function getDocumentationByCategory(
  category: string,
): DocumentationDocument[] {
  return documentation.filter((d) => d.meta.category === category);
}

export function getAllDocumentationSlugs(): string[] {
  return documentation.map((d) => d.meta.slug);
}
```

### Layer 3: Repository (Data Access)

**File:** `lib/strapi/dashboard/documentation/documentation-repository.ts`

```typescript
import "server-only";
import {
  getDocumentationList,
  getDocumentationBySlug as getBySlug,
  getDocumentationByCategory as getByCategory,
  getAllDocumentationSlugs,
} from "./documentation-content-builder";
import { repoLogger } from "@/lib/logging";
import type { DocumentationDocument } from "./documentation-schema";

export interface DocumentationRecord {
  document: DocumentationDocument;
  content: DocumentationDocument; // Full content with blocks
}

export function listDocumentation(): DocumentationDocument[] {
  repoLogger.info("ListDocumentation");
  return getDocumentationList();
}

export function getDocumentationRecordBySlug(
  slug: string,
): DocumentationRecord | null {
  repoLogger.info("GetDocumentationBySlug", { slug });
  const document = getBySlug(slug);
  if (!document) {
    repoLogger.warn("DocumentationNotFound", { slug });
    return null;
  }
  return { document, content: document };
}

export function listDocumentationByCategory(
  category: string,
): DocumentationDocument[] {
  repoLogger.info("ListDocumentationByCategory", { category });
  return getByCategory(category);
}

export function listDocumentationSlugs(): string[] {
  repoLogger.info("ListDocumentationSlugs");
  return getAllDocumentationSlugs();
}
```

### Layer 4: ViewModels (Presentation)

**File:** `lib/strapi/dashboard/documentation/documentation-view-models.ts`

```typescript
import { format } from "date-fns";
import type { DocumentationDocument } from "./documentation-schema";

export interface DocumentationDetailViewModel {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  audience: string;
  formattedDate: string;
  formattedUpdated: string;
  tags: string[];
  toc?: Array<{ id: string; title: string; level: number }>;
  blocks: DocumentationDocument["blocks"];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
  };
}

export function toDocumentationDetailViewModel(
  doc: DocumentationDocument,
): DocumentationDetailViewModel {
  return {
    slug: doc.meta.slug,
    title: doc.meta.title,
    excerpt: doc.meta.excerpt,
    category: doc.meta.category,
    audience: doc.meta.audience,
    formattedDate: format(new Date(doc.meta.publishedAt), "MMMM d, yyyy"),
    formattedUpdated: format(new Date(doc.meta.lastUpdated), "MMMM d, yyyy"),
    tags: doc.meta.tags,
    toc: doc.toc,
    blocks: doc.blocks,
    seo: {
      metaTitle: doc.seo?.metaTitle ?? doc.meta.title,
      metaDescription: doc.seo?.metaDescription ?? doc.meta.excerpt,
      canonicalUrl: doc.seo?.canonicalUrl,
    },
  };
}
```

### Layer 5: Dynamic Routes

**File:** `app/(dashboard)/dashboard/documentation/[category]/[slug]/page.tsx`

```typescript
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import {
  getDocumentationRecordBySlug,
  listDocumentation,
  listDocumentationSlugs,
} from "@/lib/strapi/dashboard/documentation/documentation-repository";
import { toDocumentationDetailViewModel } from "@/lib/strapi/dashboard/documentation/documentation-view-models";
import { DocumentationBlockRenderer } from "@/components/organisms/documentation-block-renderer";
import { pageLogger } from "@/lib/logging";

export async function generateStaticParams() {
  return listDocumentation().map((doc) => ({
    category: doc.meta.category,
    slug: doc.meta.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = getDocumentationRecordBySlug(slug);

  if (!record) {
    return {
      title: "Documentation Not Found",
      robots: { index: false, follow: false },
    };
  }

  const vm = toDocumentationDetailViewModel(record.document);
  const canonicalPath = `/dashboard/documentation/${vm.category}/${vm.slug}`;

  return {
    title: vm.seo.metaTitle,
    description: vm.seo.metaDescription,
    alternates: { canonical: vm.seo.canonicalUrl ?? canonicalPath },
    openGraph: {
      type: "article",
      title: vm.seo.metaTitle,
      description: vm.seo.metaDescription,
      url: canonicalPath,
    },
  };
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  pageLogger.render(`/dashboard/documentation/${category}/${slug}`);

  const record = getDocumentationRecordBySlug(slug);

  if (!record) {
    notFound();
  }

  // Redirect if category doesn't match
  if (record.document.meta.category !== category) {
    redirect(`/dashboard/documentation/${record.document.meta.category}/${slug}`);
  }

  const vm = toDocumentationDetailViewModel(record.document);

  return (
    <div className="space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold text-foreground">{vm.title}</h1>
        <p className="text-xl text-muted-foreground">{vm.excerpt}</p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Audience: {vm.audience}</span>
          <span>Updated: {vm.formattedUpdated}</span>
        </div>
      </header>

      <article className="border-t border-border pt-8">
        <DocumentationBlockRenderer blocks={vm.blocks} toc={vm.toc} />
      </article>
    </div>
  );
}
```

### Layer 6: Block Renderer

**File:** `components/organisms/documentation-block-renderer.tsx`

```typescript
import { CodeBlock } from "@/components/atoms/code-block";
import { Callout } from "@/components/atoms/callout";
import { Spoiler } from "@/components/atoms/spoiler";
import { DocSectionHeader } from "@/components/molecules/doc-page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Block } from "@/lib/strapi/dashboard/documentation/documentation-schema";

interface Props {
  blocks: Block[];
  toc?: Array<{ id: string; title: string; level: number }>;
}

export function DocumentationBlockRenderer({ blocks, toc }: Props) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => (
        <BlockComponent key={index} block={block} />
      ))}
    </div>
  );
}

function BlockComponent({ block }: { block: Block }) {
  switch (block.type) {
    case "block.paragraph":
      return <p className={block.className}>{block.text}</p>;

    case "block.codeBlock":
      return (
        <CodeBlock
          language={block.language}
          code={block.code}
          title={block.title}
          showLineNumbers={block.showLineNumbers}
        />
      );

    case "block.callout":
      return (
        <Callout type={block.calloutType} title={block.title}>
          {block.content}
        </Callout>
      );

    case "block.sectionHeader":
      return <DocSectionHeader id={block.id}>{block.title}</DocSectionHeader>;

    // ... other block types

    default:
      console.warn(`Unknown block type:`, block);
      return null;
  }
}
```

---

## Migration Execution Plan

### Phase 1: Preparation & Discovery ✅ (Current)

**Tasks:**

1. ✅ Audit current documentation pages and components
2. ✅ Map components to block types
3. ✅ Review content-library implementation as reference
4. ✅ Read architecture documents (STRAPI_DYNAMIC_ZONES_AUTHORITY, EXTRACTION_FIRST_MIGRATION_PLAN)
5. ✅ Create migration plan document (this file)

### Phase 2: Schema & Block Design

**Tasks:**

1. Create `documentation-schema.ts` with all block types
2. Create Zod schemas for each block variant
3. Map existing components to block discriminators
4. Design JSON structure for 2-3 example documentation pages
5. Validate schemas against example JSON

**Deliverables:**

- `lib/strapi/dashboard/documentation/documentation-schema.ts`
- `data/strapi-mock/dashboard/documentation/strategic-overview/system-vision.json` (example)
- Schema validation tests

### Phase 3: 6-Layer Architecture Implementation

**Tasks:**

1. Create content builder (loads and validates JSON at module init)
2. Create repository layer (query functions with logging)
3. Create view models layer (transform to presentation shapes)
4. Create dynamic route: `app/(dashboard)/dashboard/documentation/[category]/[slug]/page.tsx`
5. Create block renderer component

**Deliverables:**

- 6-layer architecture complete
- Dynamic route rendering first test page successfully

### Phase 4: Block Component Library

**Tasks:**

1. Audit existing block components from content-library
2. Create missing block components (FeatureGrid, StatsTable, etc.)
3. Ensure all blocks are SERVER components (extract client logic if needed)
4. Test each block component in isolation
5. Create block component documentation

**Deliverables:**

- Complete block component library
- All blocks tested and documented

### Phase 5: Content Migration (Batch Processing)

**Tasks:**

1. **Batch 1:** Strategic Overview (5 pages) → Convert to dynamic zone JSON
2. **Batch 2:** CMS Reference (6 pages) → Convert to dynamic zone JSON
3. **Batch 3:** App Reference (7 pages) → Convert to dynamic zone JSON
4. **Batch 4:** Infrastructure & Ops (5 pages) → Convert to dynamic zone JSON

**Per-Batch Process:**

1. Extract content from existing TSX page
2. Map to block types in JSON structure
3. Validate against schema
4. Test rendering with dynamic route
5. Archive old client page (don't delete yet)

**Deliverables:**

- 23 documentation pages migrated to JSON
- All pages rendering via dynamic route

### Phase 6: Integration Testing

**Tasks:**

1. Create documentation repository integration tests  
   (similar to `__tests__/integration-test/content-library/article-repository.test.ts`)
2. Test data loading and validation
3. Test query functions (listByCategory, getBySlug, etc.)
4. Test view model transformations
5. Ensure 100% test coverage for repository layer

**Deliverables:**

- `__tests__/integration-test/documentation/documentation-repository.test.ts`
- All tests passing

### Phase 7: Cleanup & Final Validation

**Tasks:**

1. Delete old client component pages from `app/(dashboard)/dashboard/documentation/`
2. Update navigation links to use dynamic routes
3. Run full TypeScript validation (`pnpm tsc --noEmit`)
4. Run full build (`pnpm build`)
5. Verify all 23 pages render correctly
6. Check performance (Lighthouse scores)

**Deliverables:**

- Old pages removed
- Build passing
- All documentation pages live on dynamic routes

---

## Critical Success Factors

### ✅ Server-First Architecture

- Every page MUST be a server component unless absolutely requires client state
- Any client interactivity (accordion, tabs, theme toggle) extracted to small client components
- No "use client" at page level

### ✅ Reuse-First Discipline

- Reuse existing block components from content-library wherever possible
- Only create new block types if NO existing component matches (80% match is acceptable)
- Document justification for any new block type

### ✅ Schema Validation Gates

- Every documentation JSON must pass Zod validation at build time
- Build fails if any JSON is invalid
- Validation logs must show which documents loaded successfully

### ✅ Integration Test Coverage

- Repository layer must have 100% test coverage
- Tests must verify data loading, validation, queries, and transformations
- Tests structured same as content-library tests

### ✅ Zero Breaking Changes

- Old pages stay until new routes proven working
- Navigation updated only after successful migration
- Rollback plan: keep old pages in archive folder

---

## Questions for User

Before proceeding with implementation, we need to clarify:

1. **Priority:** Which documentation category should we migrate first?
   - Strategic Overview (5 pages, executive-focused)
   - CMS Reference (6 pages, technical)
   - App Reference (7 pages, developer-focused)
   - Infrastructure & Ops (5 pages, ops-focused)

2. **Existing JSON:** Should we reuse data from `data/strapi-mock/dashboard/*-overview.json` files or start fresh?

3. **Block Granularity:** How granular should blocks be?
   - Fine-grained: Each paragraph is a separate block
   - Coarse-grained: Entire sections are single blocks

4. **Testing Priority:** Should we write integration tests:
   - Before content migration (TDD approach)
   - After content migration (validation approach)

5. **Rate Limiting:** Given your rate limiting concerns, should we:
   - Focus on ONE documentation category end-to-end first
   - Build all infrastructure then migrate content in batches

---

## Next Actions

**Recommended Sequence:**

1. User reviews this plan and answers questions above
2. Create documentation schema with block types (Phase 2)
3. Implement 6-layer architecture (Phase 3)
4. Migrate ONE documentation page as proof of concept
5. If successful, batch-migrate remaining pages

**Estimated Token Budget:**

- Phase 2 (Schema): ~15k tokens
- Phase 3 (6-Layer): ~20k tokens
- Phase 4 (Block components): ~15k tokens
- Phase 5 (Content migration): ~10k tokens per batch (40k total)
- Phase 6 (Tests): ~10k tokens
- **Total:** ~100k tokens for complete migration

**Timeline:** 3-4 focused sessions to complete all phases.
