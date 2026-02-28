# Extraction-First Documentation Migration Plan

**Status:** Architecture Plan (Feb 28, 2026)  
**Authority:** Canonical guidance for migrating documentation markdown to 6-layer architecture  
**Reference Docs:** STRAPI_DYNAMIC_ZONES_AUTHORITY.md, CONTENT_LIBRARY_ARCHITECTURE.md  
**Last Updated:** 2026-02-28

---

## Table of Contents

1. [Executive Summary & Principles](#executive-summary--principles)
2. [Documentation Domains](#documentation-domains)
3. [Content Library as Baseline Pattern](#content-library-as-baseline-pattern)
4. [Extraction-First Workflow](#extraction-first-workflow)
5. [Per-Domain Migration Strategy](#per-domain-migration-strategy)
6. [Reusable Component Mapping](#reusable-component-mapping)
7. [Batch Schedule & Gates](#batch-schedule--gates)
8. [Risks & Mitigation](#risks--mitigation)

---

## Executive Summary & Principles

### Why Extraction-First?

Current state:

- ✗ Documentation is scattered across markdown files in `/docs/` and root
- ✗ No canonical content structure or schema
- ✗ No server-side rendering or static generation
- ✗ No SEO metadata or sitemap integration
- ✗ Not aligned with content library block pattern

Desired state:

- ✅ All documentation in 6-layer architecture (schema → builder → repository → viewmodels → facade → manifest)
- ✅ Single canonical contract (meta + seo + route + access + toc + blocks)
- ✅ Content extracted to JSON, validated, then migrated to routes
- ✅ Full SEO integration with metadata and sitemap
- ✅ Reusable block components across all documentation domains

### Extraction-First Principle

> **Extract content from markdown to JSON schema BEFORE writing any code to render it.**

**Why:**

1. Forces schema clarity and consistency
2. Validates content against contract early
3. Prevents routing/metadata bugs
4. Enables content validation gates
5. Clean data layer before building presentation

**Workflow:**

```
Markdown → Extract → JSON Schema → Validate → Build → Repository → Route
  Input      (Manual)    (Audit)   (Zod Gate)   (Code)    (Code)    (Code)
```

---

## Documentation Domains

Four distinct domains will be migrated in sequence, each with specific content patterns.

### Domain 1: Strategic Overview

**Purpose:** High-level system vision, roadmap, and decision rationale  
**Current Location:** `ROADMAP.md`, `ARCHITECTURE.md` (top sections)  
**Content Type:** Essays with diagrams, rarely changing  
**Audience:** Tech leads, architects, product managers  
**SEO Priority:** Medium (internal/educational)  
**Route Pattern:** `/dashboard/documentation/strategic/*`

**Content Characteristics:**

- Narrative-driven with visual diagrams
- 3000-8000 words per article
- Table of contents essential
- Cross-references to other domains
- Versioned (old roadmaps archived)

**Example Sections:**

- System Vision & Principles
- Platform Roadmap (current + future phases)
- Technical Decision Records (why we chose Next.js, Strapi, etc.)
- Architecture Decisions (6-layer pattern rationale)
- Team Roles & Responsibilities

### Domain 2: CMS Reference

**Purpose:** Strapi schema documentation, block definitions, content governance  
**Current Location:** `STRAPI_DYNAMIC_ZONES_AUTHORITY.md`, `CONTENT_LIBRARY_ARCHITECTURE.md` (schema sections)  
**Content Type:** Reference documentation with code examples  
**Audience:** Backend engineers, content architects, Strapi admins  
**SEO Priority:** High (searchable reference)  
**Route Pattern:** `/dashboard/documentation/cms-reference/*`

**Content Characteristics:**

- Technical reference, frequently updated
- 1000-4000 words per article
- Code blocks with syntax highlighting
- Schema diagrams and tables
- Links to actual Strapi collection types

**Example Sections:**

- Block Registry & Types
- Content Contract (meta, seo, route, access, toc, blocks)
- Schema Extension Rules
- Validation Rules & Gates
- Migration Path (to live Strapi)
- Content Governance Policies

### Domain 3: App Reference

**Purpose:** Application architecture, layers, patterns, and developer guides  
**Current Location:** `ARCHITECTURE.md`, scattered feature docs  
**Content Type:** Developer guide with code patterns  
**Audience:** Frontend engineers, full-stack developers, new team members  
**SEO Priority:** High (technical onboarding)  
**Route Pattern:** `/dashboard/documentation/app-reference/*`

**Content Characteristics:**

- Implementation-focused, frequently updated
- 1500-5000 words per article
- Code examples (snippets and full files)
- Before/after comparisons
- Links to actual codebase files

**Example Sections:**

- 6-Layer Architecture Explained (schema → builder → repository → viewmodels → facade → manifest)
- Server Components & Rendering Strategies (SSG/SSR/ISR/PPR)
- Form Architecture & Validation
- Error Handling Patterns
- Testing Strategies
- Performance Optimization
- Security Best Practices

### Domain 4: Infrastructure & Ops

**Purpose:** Deployment, CI/CD, monitoring, observability, and operational guides  
**Current Location:** `INFRASTRUCTURE.md`, deployment docs  
**Content Type:** Operations guide with scripts and checklists  
**Audience:** DevOps engineers, release managers, platform engineers  
**SEO Priority:** Medium (operational docs)  
**Route Pattern:** `/dashboard/documentation/infrastructure-and-ops/*`

**Content Characteristics:**

- Procedures and checklists, frequently changing
- 800-3000 words per article
- Procedural steps with clear decisions
- Environment config examples
- Links to actual infrastructure code

**Example Sections:**

- Deployment Pipeline (Vercel configuration)
- Environment Management (.env variables, secrets)
- Monitoring & Alerts (logging, error tracking)
- Database Migrations
- Backup & Recovery Procedures
- Performance Budgets
- Security Checklist

---

## Content Library as Baseline Pattern

The Content Library (Articles, Tutorials, Case Studies, Guides) is **the baseline pattern to follow exactly** for documentation migration. Study how it works to replicate the pattern for documentation domains.

### Content Library Pattern (Reference)

```
Data Layer (Immutable)
├── data/articles/
│   ├── architecture/ddd.json (content)
│   ├── security/validation.json
│   └── ...
├── lib/strapi/content-library/articles/
│   ├── article-schema.ts (Zod validation)
│   ├── article-content-builder.ts (load + register)
│   ├── article-repository.ts (server-only queries)
│   ├── article-view-models.ts (format for UI)
│   └── articles.ts (public facade)
└── lib/strapi/content-library/content-route-manifest.ts (sitemap)

Rendering Layer
└── app/(dashboard)/dashboard/content-library/
    ├── articles/
    │   ├── page.tsx (list all)
    │   ├── [category]/
    │   │   └── [slug]/
    │   │       ├── page.tsx (detail + metadata)
    │   │       └── layout.tsx
    │   └── layout.tsx
    └── ... (tutorials, case-studies, guides same pattern)
```

### What Makes Content Library Work

1. ✅ **Single schema** per domain validates all content
2. ✅ **No dynamic categories** — categories are enumerated (architecture, security, etc.)
3. ✅ **Static generation** — all routes use `generateStaticParams()`
4. ✅ **View models** format content for display (formattedDate, readTimeLabel, etc.)
5. ✅ **Facade API** provides stable import path
6. ✅ **Manifest** integrates with sitemap generation
7. ✅ **Blocks only** — no custom rendering per article, just block components

### Key Differences for Documentation

Documentation will follow the same pattern with these adjustments:

| Aspect            | Content Library               | Documentation                              |
| ----------------- | ----------------------------- | ------------------------------------------ |
| **Domains**       | Single domain (articles)      | 4 domains (strategic, cms, app, infra)     |
| **Categories**    | Fixed list per domain         | Hierarchical (domain → section)            |
| **Frequency**     | Monthly updates               | Weekly-monthly updates                     |
| **Versioning**    | Latest only                   | Multiple versions? (TBD)                   |
| **Blocks**        | Core blocks only              | Core + custom? (TBD after extraction)      |
| **TOC**           | Optional                      | Required (long docs)                       |
| **Route Pattern** | `/articles/[category]/[slug]` | `/documentation/[domain]/[section]/[slug]` |

---

## Extraction-First Workflow

This section defines the step-by-step process for extracting markdown documentation into the 6-layer architecture.

### Phase 1: Content Audit & Extraction (THIS SESSION)

**Goal:** Identify which markdown should migrate, extract to JSON structure, define schemas

**Per-Domain Process (Repeat 4x):**

#### Step 1a: Content Inventory

List all current documentation for this domain:

```markdown
## Strategic Overview Domain

### Current Markdown Files

- ROADMAP.md (sections: Vision, Phases, Technical Debt)
- ARCHITECTURE.md (sections: Overview, Principles, Patterns)
- START_HERE_TOMORROW.md (duplicate, archive)
- [others...]

### Articles to Extract

1. "System Vision & Principles" ← from ARCHITECTURE.md, sections 1-2
2. "Platform Roadmap (2026)" ← from ROADMAP.md, sections 2-4
3. "Technical Decisions" ← from ARCHITECTURE.md, notes throughout
4. [...]

### Analysis

- Total content: ~20,000 words
- Articles needed: ~8-10
- Estimated extraction time: 4-6 hours
- Risk: Cross-references between domains
```

#### Step 1b: Content Extraction

For each article to extract:

1. **Copy markdown section** to temp file
2. **Analyze content structure:**
   - What are the main concepts?
   - What audience is this for?
   - What are the prerequisites?
   - Are there diagrams? (describe for blocks)
3. **Break into blocks:**
   - Headings → heading blocks (with anchor ids)
   - Paragraphs → text blocks
   - Code samples → code blocks (with language)
   - Diagrams (ASCII/Mermaid) → description in text + link to actual diagram
   - Tables → table blocks
   - Lists → list blocks (ordered/unordered)
   - Quotes/important notes → quote or alert blocks
   - Key points → callout blocks

**Example Extraction:**

```markdown
### Original Markdown (ROADMAP.md)

# Phase 1: Foundation (Complete)

Our first priority was establishing core patterns:

- Server-only data access
- Type-safe contracts
- Error isolation

We completed:

- Content Model schema
- Repository pattern
- View model transformations
- Initial test infrastructure

[Diagram showing data flow]

### Extracted JSON Structure

{
"meta": {
"slug": "phase-1-foundation",
"title": "Phase 1: Foundation (Complete)",
"excerpt": "Core patterns established: server-only data access, type-safe contracts, error isolation",
"category": "phases",
"level": "intermediate",
"publishedAt": "2024-01-15"
},
"toc": [
{ "level": 2, "title": "Our Priority", "anchor": "our-priority" },
{ "level": 2, "title": "Completed", "anchor": "completed" }
],
"blocks": [
{
"type": "text",
"content": "Our first priority was establishing core patterns:"
},
{
"type": "list",
"ordered": false,
"items": [
"Server-only data access",
"Type-safe contracts",
"Error isolation"
]
},
{
"type": "heading",
"level": 2,
"content": "We completed:"
},
{
"type": "list",
"ordered": false,
"items": [
"Content Model schema",
"Repository pattern",
"View model transformations",
"Initial test infrastructure"
]
},
{
"type": "callout",
"type_name": "diagram-reference",
"title": "Data Flow Architecture",
"content": "[See diagram: /images/diagrams/data-flow-phase-1.svg]"
}
]
}
```

#### Step 1c: Schema Definition

Group extracted articles and define domain schema:

```typescript
// documentation-schema-strategic.ts
import { z } from "zod";
import { BaseContentSchema } from "@/lib/strapi/shared/schema";

export const StrategicDocumentationSchema = BaseContentSchema.extend({
  meta: BaseContentSchema.shape.meta.extend({
    category: z.enum(["vision", "roadmap", "decisions", "principles", "team"]),
    level: z
      .enum(["beginner", "intermediate", "advanced"])
      .default("intermediate"),
  }),
  blocks: z.array(
    z.discriminatedUnion("type", [
      z.object({ type: z.literal("text"), content: z.string() }),
      z.object({
        type: z.literal("heading"),
        level: z.number(),
        content: z.string(),
      }),
      z.object({
        type: z.literal("code"),
        language: z.string(),
        content: z.string(),
      }),
      z.object({
        type: z.literal("callout"),
        type_name: z.string(),
        title: z.string(),
        content: z.string(),
      }),
      // ... other blocks
    ]),
  ),
});

export type StrategicDocumentation = z.infer<
  typeof StrategicDocumentationSchema
>;
```

#### Step 1d: Content Validation

Validate extracted JSON against schema:

```bash
node scripts/validate-documentation-schema.mjs --domain strategic
```

**Pass Criteria:**

- ✅ All JSON files parse
- ✅ All files validate against schema
- ✅ No validation warnings
- ✅ All block types are registered
- ✅ All cross-references exist

### Phase 2: Data Layer Code (Repository, ViewModel, Facade)

**Goal:** Build 6-layer data access for extracted content  
**Input:** Validated JSON files + schemas  
**Output:** repository, viewmodel, facade ready for routes  
**Timeline:** ~2 hours per domain

**Steps (repeat per domain):**

1. Create `documentation-<domain>-content-builder.ts`
   - Load all JSON files
   - Validate against schema
   - Export registry API
2. Create `documentation-<domain>-repository.ts`
   - Server-only queries (list, getBySlug, filters)
   - Logging
3. Create `documentation-<domain>-view-models.ts`
   - Format dates, times
   - Add computed fields
   - Format blocks for rendering
4. Create `documentation-<domain>.ts` (facade)
   - Public API export
   - Re-exports from repository

**Code Pattern (from Content Library):**

```typescript
// documentation-cms-ref-content-builder.ts
import "server-only";
import * as fs from "fs";
import {
  StrategicDocumentationSchema,
  type StrategicDocumentation,
} from "./documentation-schema-strategic";

const docs = ((): StrategicDocumentation[] => {
  const dir = "data/documentation/strategic";
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  return files.map((f) => {
    const content = JSON.parse(fs.readFileSync(`${dir}/${f}`, "utf-8"));
    return StrategicDocumentationSchema.parse(content);
  });
})();

export function getStrategicDocList(): StrategicDocumentation[] {
  return docs;
}

export function getStrategicDocBySlug(
  slug: string,
): StrategicDocumentation | null {
  return docs.find((d) => d.meta.slug === slug) ?? null;
}

export function getAllStrategicDocSlugs(): string[] {
  return docs.map((d) => d.meta.slug);
}
```

### Phase 3: Route Migration (Rendering)

**Goal:** Create server components that render migrated content  
**Input:** Data layer code  
**Output:** Static pages with SEO metadata and sitemap integration  
**Timeline:** ~1 hour per domain

**Steps (repeat per domain):**

1. Create `/app/(dashboard)/dashboard/documentation/<domain>/`
   - `page.tsx` — list all articles
   - `[slug]/page.tsx` — detail page
   - `[slug]/layout.tsx` — article layout
2. Implement `generateStaticParams()` for static generation
3. Implement `generateMetadata()` for SEO
4. Integrate route into content-route-manifest

**Code Pattern:**

```typescript
// app/(dashboard)/dashboard/documentation/strategic/[slug]/page.tsx
import "server-only";
import { getStrategicDocBySlug, getAllStrategicDocSlugs } from "@/lib/strapi/documentation/strategic/documentation-content-builder";
import { toStrategicDocDetailViewModel } from "@/lib/strapi/documentation/strategic/documentation-view-models";
import { StrategicDocView } from "@/components/documentation/StrategicDocView";

export async function generateStaticParams() {
  return getAllStrategicDocSlugs().map(slug => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const doc = getStrategicDocBySlug(slug);
  if (!doc) return { title: "Not Found" };

  return {
    title: doc.seo?.metaTitle ?? doc.meta.title,
    description: doc.seo?.metaDescription ?? doc.meta.excerpt,
    canonical: doc.seo?.canonicalUrl ?? `/documentation/strategic/${slug}`,
    robots: doc.seo?.robots ?? "index,follow",
  };
}

export default async function StrategicDocPage({ params }) {
  const { slug } = await params;
  const doc = getStrategicDocBySlug(slug);
  if (!doc) return <NotFound />;

  const vm = toStrategicDocDetailViewModel(doc);
  return <StrategicDocView {...vm} />;
}
```

### Phase 4: Validation Gates (Full Batch)

**Goal:** Ensure all 4 domains pass validation gates before merge  
**Input:** All migrated code + tests  
**Output:** Approved for production deployment

**Gates (same as content library):**

1. **Schema Gate** ✅ All JSON validates
2. **Data Gate** ✅ Repository tests pass
3. **Route Gate** ✅ Static params + metadata tests pass
4. **Quality Gate** ✅ Visual inspection + accessibility
5. **Build Gate** ✅ TypeScript + build + tests

**Commands:**

```bash
# Schema validation
node scripts/validate-documentation-schema.mjs

# Data layer tests
pnpm run test:documentation:data

# Route tests
pnpm run test:documentation:routes

# Build & quality
pnpm exec tsc --noEmit
pnpm run build
pnpm run test
```

---

## Per-Domain Migration Strategy

### Strapi Collection Type Alignment

**Critical:** Each domain migration must align with corresponding Strapi collection type defined in **STRAPI_BUILDER_PATTERN.md**.

| Domain             | Strapi Collection Type         | Schema File                              | Collection Fields                                     |
| ------------------ | ------------------------------ | ---------------------------------------- | ----------------------------------------------------- |
| Strategic Overview | `documentation-strategic`      | `documentation-schema-strategic.ts`      | meta, seo, route, access, toc, blocks, sourceMarkdown |
| CMS Reference      | `documentation-cms-reference`  | `documentation-schema-cms-reference.ts`  | (same as above)                                       |
| App Reference      | `documentation-app-reference`  | `documentation-schema-app-reference.ts`  | (same as above)                                       |
| Infrastructure     | `documentation-infrastructure` | `documentation-schema-infrastructure.ts` | (same as above)                                       |

**JSON files extracted per domain map directly to Strapi entries.** Each JSON file becomes one Strapi document with:

- `meta` → Strapi metadata fields
- `seo` → Strapi SEO plugin fields (metaTitle, metaDescription, canonicalUrl, robots, etc.)
- `blocks` → Strapi dynamic zone (11 core block components)

See [STRAPI_BUILDER_PATTERN.md](STRAPI_BUILDER_PATTERN.md) for complete field definitions and validation rules.

---

### Domain 1: Strategic Overview

**Current Files to Extract:**

- ROADMAP.md (sections: Phases, Technical Debt)
- ARCHITECTURE.md (sections: Principles, Decisions)
- INFRASTRUCTURE.md (strategy sections)

**Proposed Articles (~8):**

1. "System Vision & Principles"
2. "Platform Roadmap 2026"
3. "Technical Decision Records"
4. "Architecture Evolution"
5. "Team Roles & Responsibilities"
6. "Development Values"
7. "Long-Term Technical Debt"
8. "Performance Budgets"

**Schema Extensions:**

- `category: "vision" | "roadmap" | "decisions" | "principles" | "team" | "values" | "debt" | "budgets"`
- `level: "beginner" | "intermediate" | "advanced"`
- Add `version?: string` for roadmap evolution tracking

**Route Pattern:**

```
/dashboard/documentation/strategic/
├── page.tsx (list all)
└── [slug]/
    ├── page.tsx (detail + metadata)
    └── layout.tsx
```

**Effort:** 8-10 hours (audit → extraction → schema → code → tests → gates)

### Domain 2: CMS Reference

**Current Files to Extract:**

- STRAPI_DYNAMIC_ZONES_AUTHORITY.md (sections: Contract, Blocks, Rules)
- CONTENT_LIBRARY_ARCHITECTURE.md (sections: Schema, Layers)

**Proposed Articles (~10):**

1. "Content Contract Explained"
2. "Block Registry & Types" (11 core types)
3. "Schema Extension Rules"
4. "Reuse-First Discipline"
5. "Validation Gates & Testing"
6. "Layer 1: Schema Definition"
7. "Layer 2: Content Builder"
8. "Layer 3: Repository"
9. "Layer 4: View Models"
10. "Migration to Live Strapi"

**Schema Extensions:**

- `category: "contract" | "blocks" | "rules" | "patterns" | "validation" | "migration"`
- `includes_code: boolean` (marks articles with code examples)
- Custom block: `code-example` (syntax-highlighted with test-ability)

**Route Pattern:**

```
/dashboard/documentation/cms-reference/
├── page.tsx (list all)
└── [slug]/
    ├── page.tsx (detail + metadata)
    └── layout.tsx
```

**Effort:** 12-15 hours (detailed extraction → code examples → schema → tests)

### Domain 3: App Reference

**Current Files to Extract:**

- ARCHITECTURE.md (sections: Data Layer, Features, Patterns)
- Scattered feature docs (forms, security, rendering, etc.)

**Proposed Articles (~12):**

1. "6-Layer Architecture Walkthrough"
2. "Server Components & Rendering Strategies"
3. "Client Components & Hydration"
4. "Error Handling Patterns"
5. "Form Architecture & Validation"
6. "Security Best Practices"
7. "Testing Strategies"
8. "Performance Optimization"
9. "Type Safety & Contracts"
10. "Logging & Observability"
11. "Authentication Ready"
12. "Common Pitfalls & Solutions"

**Schema Extensions:**

- `category: "architecture" | "rendering" | "forms" | "security" | "testing" | "performance" | "types" | "logging" | "pitfalls"`
- `related_articles: string[]` (slugs of related articles)
- Custom block: `before-after` (side-by-side code comparison)

**Route Pattern:**

```
/dashboard/documentation/app-reference/
├── page.tsx (list all)
└── [slug]/
    ├── page.tsx (detail + metadata)
    └── layout.tsx
```

**Effort:** 15-18 hours (extensive code examples → deep technical extraction)

### Domain 4: Infrastructure & Ops

**Current Files to Extract:**

- INFRASTRUCTURE.md (sections: Logging, Error Handling, Observability)
- Deployment guides (Vercel config, environment, CI/CD)

**Proposed Articles (~8):**

1. "Deployment Pipeline & Vercel"
2. "Environment Management"
3. "Monitoring & Alerts"
4. "Logging Strategy"
5. "Error Tracking & Recovery"
6. "Database Migrations"
7. "Backup & Disaster Recovery"
8. "Performance Budgets & Monitoring"

**Schema Extensions:**

- `category: "deployment" | "environments" | "monitoring" | "logging" | "errors" | "database" | "backup" | "performance"`
- `procedure: boolean` (marks step-by-step guides)
- Custom block: `checklist` (interactive checklist items)
- Custom block: `environment-config` (syntax-highlighted env examples)

**Route Pattern:**

```
/dashboard/documentation/infrastructure-and-ops/
├── page.tsx (list all)
└── [slug]/
    ├── page.tsx (detail + metadata)
    └── layout.tsx
```

**Effort:** 10-12 hours (procedural extraction → validation → ops team review)

---

## Reusable Component Mapping

This section maps existing components to documentation blocks to maximize reuse.

### Core Blocks (Shared with Content Library)

| Block     | Component      | Location             | Reusable |
| --------- | -------------- | -------------------- | -------- |
| `text`    | `TextBlock`    | `components/blocks/` | ✅ Yes   |
| `heading` | `HeadingBlock` | `components/blocks/` | ✅ Yes   |
| `code`    | `CodeBlock`    | `components/blocks/` | ✅ Yes   |
| `quote`   | `QuoteBlock`   | `components/blocks/` | ✅ Yes   |
| `alert`   | `AlertBlock`   | `components/blocks/` | ✅ Yes   |
| `list`    | `ListBlock`    | `components/blocks/` | ✅ Yes   |
| `table`   | `TableBlock`   | `components/blocks/` | ✅ Yes   |
| `image`   | `ImageBlock`   | `components/blocks/` | ✅ Yes   |
| `divider` | `DividerBlock` | `components/blocks/` | ✅ Yes   |

### Documentation-Specific Blocks (Proposed)

These blocks are ONLY created if no existing block can handle them.

| New Block                                | Use Case                   | Why New?                         | Alternative?                          |
| ---------------------------------------- | -------------------------- | -------------------------------- | ------------------------------------- |
| `code-example` (code + description)      | Show code with explanation | `code` block alone is not enough | Combine `code` + `text` blocks?       |
| `before-after` (side-by-side comparison) | Refactoring guides         | No existing block matches        | Use 2x `code` blocks + CSS?           |
| `checklist` (interactive steps)          | Deployment procedures      | Content-driven, stateful         | Use `list` with custom styling?       |
| `environment-config` (env var showcase)  | Infrastructure docs        | Specialized syntax               | Use `code` block with language="env"? |
| `diagram-reference` (link to diagram)    | Architecture diagrams      | Can't embed Mermaid in JSON      | Use `image` block or `callout`?       |

**REUSE-FIRST DECISION PROCESS:**

Before creating any new block:

1. **Can existing blocks + view model formatting solve this?** → Use existing (✅ CHOICE)
2. **Can existing blocks + CSS custom class solve this?** → Use existing
3. **Must we create new block?** → Propose formally with BLOCK*PROPOSAL*<NAME>.md

**Recommendation:** Use only core blocks for initial migration, add custom blocks only if content truly requires it.

### Reusable Component Inventory

These components from content library can serve documentation:

| Component         | Location                                     | Used By             | Reusable For Docs?     |
| ----------------- | -------------------------------------------- | ------------------- | ---------------------- |
| `TextBlock`       | components/blocks/TextBlock.tsx              | Articles            | ✅ Yes                 |
| `CodeBlock`       | components/blocks/CodeBlock.tsx              | Tutorials, Articles | ✅ Yes                 |
| `AlertBlock`      | components/blocks/AlertBlock.tsx             | Case Studies        | ✅ Yes                 |
| `TableBlock`      | components/blocks/TableBlock.tsx             | Reference           | ✅ Yes                 |
| `HeadingBlock`    | components/blocks/HeadingBlock.tsx           | All                 | ✅ Yes                 |
| `ListBlock`       | components/blocks/ListBlock.tsx              | All                 | ✅ Yes (with ordering) |
| `ImageBlock`      | components/blocks/ImageBlock.tsx             | Articles            | ✅ Yes                 |
| `QuoteBlock`      | components/blocks/QuoteBlock.tsx             | Case Studies        | ✅ Yes                 |
| `DividerBlock`    | components/blocks/DividerBlock.tsx           | All                 | ✅ Yes                 |
| `VideoBlock`      | components/blocks/VideoBlock.tsx             | Tutorials           | ✅ Rarely (docs)       |
| `TableOfContents` | components/documentation/TableOfContents.tsx | Content Library     | ✅ Yes (reuse!)        |
| `Breadcrumbs`     | components/navigation/Breadcrumbs.tsx        | All pages           | ✅ Yes                 |

---

## Batch Schedule & Gates

### Batch 1: Strategic Overview Domain (Week 1)

**Timeline:** ~10 hours  
**Work:**

1. Extract content from ROADMAP.md + ARCHITECTURE.md
2. Define strategic-documentation-schema.ts
3. Create content-builder, repository, view-models, facade
4. Create routes + metadata generation
5. Write tests for all layers

**Validation Gates:**

- ✅ Schema validation (node script)
- ✅ Data layer tests (vitest)
- ✅ Route generation tests (vitest)
- ✅ Quality review (visual inspection)
- ✅ Build gate (tsc + build + tests)

**Merge Criteria:** All 5 gates pass, Team review approved

---

### Batch 2: CMS Reference Domain (Week 2)

**Timeline:** ~15 hours  
**Work:**

1. Extract content from STRAPI_DYNAMIC_ZONES_AUTHORITY.md + CONTENT_LIBRARY_ARCHITECTURE.md
2. Define cms-reference-documentation-schema.ts
3. Create all layers (builder, repository, viewmodels, facade)
4. Create routes + metadata
5. Write tests

**Validation Gates:**

- ✅ Schema validation (including code block examples)
- ✅ Data layer tests
- ✅ Route generation tests
- ✅ Cross-domain reference validation (links to strategic domain)
- ✅ Build gate

**Merge Criteria:** All gates pass, Architect review approved

---

### Batch 3: App Reference Domain (Week 3-4)

**Timeline:** ~18 hours (longest, most complex)  
**Work:**

1. Extract content from ARCHITECTURE.md + feature docs
2. Define app-reference-documentation-schema.ts
3. Create all layers with code example handling
4. Create routes + metadata
5. Write tests (including code examples)

**Validation Gates:**

- ✅ Schema validation (code examples must be real)
- ✅ Data layer tests
- ✅ Route generation tests
- ✅ Code example validation (must be valid syntax for declared language)
- ✅ Cross-domain links validation
- ✅ Build gate

**Merge Criteria:** All gates pass, Senior architect + tech lead review

---

### Batch 4: Infrastructure & Ops Domain (Week 4)

**Timeline:** ~12 hours  
**Work:**

1. Extract content from INFRASTRUCTURE.md + ops guides
2. Define infrastructure-documentation-schema.ts
3. Create all layers with procedure/checklist handling
4. Create routes + metadata
5. Write tests

**Validation Gates:**

- ✅ Schema validation
- ✅ Data layer tests
- ✅ Route generation tests
- ✅ Procedure validation (steps are clear + complete)
- ✅ Team ops review (correctness of procedures)
- ✅ Build gate

**Merge Criteria:** All gates pass, DevOps review approved

---

## Risks & Mitigation

### Risk 1: Schema Creep (New Blocks Every Domain)

**Risk:** Each domain proposes new block types, violating reuse-first discipline

**Mitigation:**

- Enforce reuse-first checklist before any new block
- Require BLOCK*PROPOSAL*<NAME>.md for justification
- Senior architect must approve before adding to schema
- Limit new blocks to max 2-3 for documentation migration

---

### Risk 2: Content Extraction Quality

**Risk:** Manual markdown → JSON extraction introduces errors (typos, structure loss, missing fields)

**Mitigation:**

- Create extraction checklist (headings → anchors, code blocks → language, etc.)
- Peer review all extracted JSON before schema validation
- Validate JSON against schema early (catches structural errors)
- Compare rendered output against original markdown (visual regression check)

---

### Risk 3: Cross-Domain References Break

**Risk:** Articles reference other domains (strategic → cms → app → infra), links break if migrations happen out of order

**Mitigation:**

- Use route-agnostic slugs (slugs are stable, routes can change)
- Define slug naming convention (e.g., `app-reference/6-layer-architecture`)
- Update route pattern only after all domains finalized
- Create redirect mapping if routes change

---

### Risk 4: SEO Metadata Incomplete

**Risk:** Documentation routes generate incomplete metadata, breaking OpenGraph/Twitter cards

**Mitigation:**

- Require `seo` field in all extracted content
- Validate metadata completeness in schema
- Test metadata generation in integration tests
- Include images in migration (required for OG+Twitter)

---

### Risk 5: Static Generation Costs

**Risk:** Generating static pages for 30+ documentation articles slows build time

**Mitigation:**

- Monitor build time after each batch
- Use ISR for frequently-updated docs (infrastructure domain)
- Consider parallel static generation if needed
- Document build time impact in ROADMAP.md

---

## Success Criteria

Extraction-first documentation migration is **complete** when:

- ✅ All 4 domains extracted to JSON and validated
- ✅ All 6-layer code written (schema → builder → repository → viewmodels → facade → manifest)
- ✅ All routes migrated to server components with static generation
- ✅ All 5 validation gates passing for all domains
- ✅ Documentation updated for new content structure
- ✅ Old markdown docs archived in `/backups/`
- ✅ New docs searchable via `/dashboard/documentation/` route
- ✅ SEO metadata + sitemap integration complete
- ✅ Build time within acceptable threshold
- ✅ Zero broken links (internal + external)

---

## Related Documentation

- [Strapi Dynamic Zones Authority](STRAPI_DYNAMIC_ZONES_AUTHORITY.md) — Governance lock
- [Content Library Architecture](CONTENT_LIBRARY_ARCHITECTURE.md) — Production pattern
- [Markdown Cleanup Matrix](MARKDOWN_CLEANUP_MATRIX.md) — Archive strategy
- [Architecture Overview](ARCHITECTURE.md) — System patterns
- [Infrastructure Documentation](INFRASTRUCTURE.md) — Ops patterns

---

**Status:** 📋 Architecture Plan (Ready for Implementation)  
**Next Step:** Implement Batch 1 (Strategic Overview) in next session  
**Approval Gate:** Senior architect review before coding begins  
**Questions?** Review STRAPI_DYNAMIC_ZONES_AUTHORITY.md for governance rules
