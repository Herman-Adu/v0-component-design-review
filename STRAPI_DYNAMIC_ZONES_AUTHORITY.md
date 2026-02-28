# STRAPI Dynamic Zones Architecture Authority

**Status:** Governance Lock (Feb 28, 2026)  
**Authority:** Canonical reference for all dynamic zones and block architecture decisions  
**Scope:** Content Library, Documentation Sidebar, and any future dynamic content  
**Last Updated:** 2026-02-28

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Canonical Contract](#canonical-contract)
3. [Architecture Layers](#architecture-layers)
4. [Block Registry & Taxonomy](#block-registry--taxonomy)
5. [Schema Extension Rules](#schema-extension-rules)
6. [Reuse First Discipline](#reuse-first-discipline)
7. [Validation Gates](#validation-gates)
8. [Migration Strategy](#migration-strategy)

---

## Executive Summary

All dynamic content in this system follows a unified **block-based architecture** inspired by Strapi's dynamic zones pattern. This ensures:

- ✅ **Single canonical contract** for all content domains (meta + seo + route + access + toc + blocks)
- ✅ **Strict 6-layer architecture** applied consistently (schema → builder → repository → viewmodels → facade → manifest)
- ✅ **Atomic reuse first** — no new components unless existing ones cannot represent the requirement
- ✅ **Build-time validation gates** that prevent migration/deployment without schema + data + route + quality + build gates passing
- ✅ **No drift** — decisions locked in this document, changes require explicit review

**Non-negotiables:**

- Code migration begins ONLY after this authority doc and block registry are reviewed and approved
- New block types may only be added via formal proposal with reuse-first justification
- All content JSON must validate against Zod schemas before build
- All routes must pass metadata/sitemap integration tests before merge
- SEO is first-class now: every content document must include Strapi SEO plugin-compatible fields before publish

---

## Canonical Contract

All content in dynamic zones must conform to this contract. Variations are allowed per domain but must extend (not replace) this base shape.

```typescript
// Base contract: Every top-level content document
export interface ContentDocument {
  // Required: Metadata tier
  meta: {
    slug: string;                // URL-safe identifier
    title: string;               // Primary heading for <h1>
    excerpt: string;             // Summary fallback for metaDescription
    category?: string;           // Section-specific taxonomy
    level?: Level;               // beginner | intermediate | advanced
    readTime?: string;           // "25 min"
    publishedAt: string;         // ISO date string
    tags?: string[];             // Topic classification
  };

  // Required: SEO tier (Strapi SEO plugin-ready now)
  seo: {
    metaTitle?: string;          // <title> override (fallback: meta.title)
    metaDescription?: string;    // Meta description override (fallback: meta.excerpt)
    keywords?: string;           // Comma-separated keywords
    canonicalUrl?: string;       // Root-relative or absolute URL
    metaImage?: string | {       // OG/Twitter image
      url: string;
      alt?: string;
    };
    metaSocial?: Array<{         // Facebook/Twitter overrides
      socialNetwork: "Facebook" | "Twitter";
      title?: string;
      description?: string;
      image?: string | { url: string; alt?: string };
    }>;
    robots?: string | {          // Robots meta tag policy
      index?: boolean;
      follow?: boolean;
      noarchive?: boolean;
      max_snippet?: number;
    };
    preventIndexing?: boolean;   // Sets noindex,nofollow
  };

  // Required: Route metadata tier (for dynamic routes)
  route?: {
    pattern: string;             // e.g., "/dashboard/articles/[category]/[slug]"
    params: Record<string, string>; // e.g., { category: "architecture", slug: "ddd" }
  };

  // Optional: Access control tier (for future authorization)
  access?: {
    requiresAuth: boolean;       // Default: false
    requiredRoles?: string[];    // ["admin", "editor"]
    visibleToPublic?: boolean;   // Default: true
  };

  // Optional: Table of contents (for long content)
  toc?: Array<{
    level: number;              // 1-6 header depth
    title: string;              // Section title
    anchor: string;             // HTML id for anchor link
    children?: Array<...>;       // Nested items
  }>;

  // Required: Content blocks tier (dynamic zones)
  blocks: Block[];              // Type-safe polymorphic blocks
}

// Polymorphic block union
export type Block =
  | TextBlock
  | CodeBlock
  | ImageBlock
  | QuoteBlock
  | AlertBlock
  | CalloutBlock
  | TableBlock
  | ListBlock
  | VideoBlock
  | HeadingBlock
  | DividerBlock
  | CustomBlock;  // Extensible

// Base block interface
export interface BaseBlock {
  type: string;                 // Discriminator: "text", "code", etc.
  id?: string;                  // Optional unique identifier for deep linking
}
```

**Rationale:**

- `meta` is always present and provides fallback values
- `seo` is required now and mirrors Strapi SEO Plugin shape to prevent SEO debt during migration
- `route` enables static route manifest and sitemap generation
- `access` prepares authorization without breaking current pages
- `toc` is optional but standard when content exceeds 2000 words
- `blocks` is the atomic rendering unit (extensible without schema changes)

### SEO Readiness Policy (Effective Immediately)

- Every document must include a `seo` object in source JSON, even when values intentionally fall back to `meta`
- Publishable documents must satisfy: title, description, canonical URL, and robots policy
- Fallback chain remains valid and explicit:
  - title: `seo.metaTitle` → `meta.title`
  - description: `seo.metaDescription` → `meta.excerpt`
- `metaSocial` and `metaImage` are strongly recommended for all public content and required for campaign/landing content
- `preventIndexing: true` must enforce `noindex` semantics consistently in metadata generation

---

## Architecture Layers

All content follows strict 6-layer architecture. Each layer has a specific responsibility and file naming convention.

### Layer 1: Schema (Validation)

**Files:** `*-schema.ts`  
**Responsibility:** Define Zod schemas that validate raw JSON/API data

**Rules:**

- One schema file per content domain (e.g., `article-schema.ts`, `guide-schema.ts`)
- Must validate all required and optional fields
- Must validate block type discriminators (prevent invalid blocks)
- Must validate nested objects (toc, seo, metaSocial)
- Must fail build if schema changes break existing content
- Must log validation results at module load time

**Example Pattern:**

```typescript
// article-schema.ts
import { z } from "zod";

const BlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("text"), content: z.string() }),
  z.object({ type: z.literal("code"), language: z.string(), content: z.string() }),
  // ... other blocks
]);

export const ArticleSchema = z.object({
  meta: z.object({
    slug: z.string().regex(/^[a-z0-9\-]+$/),
    title: z.string().min(5),
    excerpt: z.string().min(20),
    category: z.enum(["architecture", "forms", "security", ...]),
    level: z.enum(["beginner", "intermediate", "advanced"]),
    publishedAt: z.string().parse(z.coerce.date()),
  }),
  seo: SeoSchema.optional(),
  route: RouteSchema.optional(),
  access: AccessSchema.optional(),
  toc: z.array(TocItemSchema).optional(),
  blocks: z.array(BlockSchema),
});

export type Article = z.infer<typeof ArticleSchema>;
```

**Validation at Load:**

```typescript
const content = readJsonFileSync("articles/architecture/ddd.json");
const validated = ArticleSchema.parse(content); // Throws if invalid
dataLogger.info(`Validated article: ${validated.meta.slug}`);
```

### Layer 2: Content Builder (Data Loading)

**Files:** `*-content-builder.ts`  
**Responsibility:** Import, validate, and registry all content as type-safe structures

**Rules:**

- One builder file per content domain
- Load ALL content files statically at module init
- Validate each file against schema during import
- Export type-safe registry functions
- Must not perform async operations (static only)
- Must be server-only
- Must cache validated results

**Example Pattern:**

```typescript
// article-content-builder.ts
import "server-only";
import * as fs from "fs";
import { ArticleSchema, type Article } from "./article-schema";

// Load all articles at module init
const articles = ((): Article[] => {
  const articlesDir = "data/articles";
  const files = fs.readdirSync(articlesDir);
  const results: Article[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    try {
      const content = JSON.parse(
        fs.readFileSync(`${articlesDir}/${file}`, "utf-8"),
      );
      results.push(ArticleSchema.parse(content));
    } catch (e) {
      throw new Error(`Failed to validate ${file}: ${e.message}`);
    }
  }
  return results;
})();

// Exported registry API
export function getArticleList(): Article[] {
  return articles;
}

export function getArticleContentDocument(slug: string): Article | null {
  return articles.find((a) => a.meta.slug === slug) ?? null;
}

export function getAllArticleContentSlugs(): string[] {
  return articles.map((a) => a.meta.slug);
}
```

### Layer 3: Repository (Data Access)

**Files:** `*-repository.ts`  
**Responsibility:** Server-only data access with query logging and caching

**Rules:**

- One repository per content domain
- Must import from content-builder (not JSON directly)
- Must mark as `"server-only"`
- Must log all queries via `repoLogger`
- Must return consistent types
- Query methods: `list*()`, `get*BySlug()`, `get*ByCategory()`, etc.

**Example Pattern:**

```typescript
// article-repository.ts
import "server-only";
import {
  getArticleList,
  getArticleContentDocument,
} from "./article-content-builder";
import { repoLogger } from "@/lib/logging";

export interface ArticleRecord {
  article: Article;
  content: Article; // Full content document
}

export function listArticles(): Article[] {
  repoLogger.info("ListArticles");
  return getArticleList();
}

export function getArticleRecordBySlug(slug: string): ArticleRecord | null {
  repoLogger.info("GetArticleBySlug", { slug });
  const article = getArticleContentDocument(slug);
  if (!article) {
    repoLogger.warn("NotFound", { slug });
    return null;
  }
  return { article, content: article };
}

export function getArticlesByCategory(category: string): Article[] {
  repoLogger.info("GetArticlesByCategory", { category });
  return getArticleList().filter((a) => a.meta.category === category);
}
```

### Layer 4: View Models (Presentation)

**Files:** `*-view-models.ts`  
**Responsibility:** Transform domain models into UI-specific shapes for React components

**Rules:**

- One view model file per content domain
- Transform repository output (Article) → view model (ArticleDetailViewModel)
- Add computed/formatted properties (e.g., `formattedDate`, `readTimeLabel`)
- Fetch related data if needed (e.g., `relatedArticles`)
- Keep view models simple (prefer component-level logic in pages, not here)
- Do NOT call repository directly (called by pages/facades)

**Example Pattern:**

```typescript
// article-view-models.ts
import { format } from "date-fns";
import type { Article } from "./article-schema";

export interface ArticleDetailViewModel {
  slug: string;
  title: string;
  excerpt: string;
  formattedDate: string;  // "February 28, 2026"
  readTimeLabel: string;  // "8 min read"
  level: string;
  category: string;
  tags: string[];
  toc?: Array<...>;
  blocks: Block[];
}

export function toArticleDetailViewModel(article: Article): ArticleDetailViewModel {
  return {
    slug: article.meta.slug,
    title: article.meta.title,
    excerpt: article.meta.excerpt,
    formattedDate: format(new Date(article.meta.publishedAt), "MMMM d, yyyy"),
    readTimeLabel: article.meta.readTime + " read",
    level: article.meta.level ?? "beginner",
    category: article.meta.category ?? "uncategorized",
    tags: article.meta.tags ?? [],
    toc: article.toc,
    blocks: article.blocks,
  };
}
```

### Layer 5: Facade (Backward Compatibility)

**Files:** `articles.ts`, `guides.ts`, `tutorials.ts`, `case-studies.ts`  
**Responsibility:** Public API for pages, wraps repository + view model calls

**Rules:**

- One facade file per content domain
- Must be server-only
- Must be simple re-exports or thin wrappers
- Provides stable API during migration (pages import from here)
- Can be deprecated after all pages migrate to direct imports

**Example Pattern:**

```typescript
// articles.ts (Facade)
import "server-only";
import { getArticleRecordBySlug, listArticles } from "./article-repository";
import { toArticleDetailViewModel } from "./article-view-models";
import type { Article } from "./article-schema";

export type { Article };

export function getAllArticles(): Article[] {
  return listArticles();
}

export function getArticleBySlug(slug: string): Article | null {
  const record = getArticleRecordBySlug(slug);
  return record?.article ?? null;
}

export function getArticleDetailViewModel(slug: string) {
  const record = getArticleRecordBySlug(slug);
  if (!record) return null;
  return toArticleDetailViewModel(record.article);
}
```

### Layer 6: Route Manifest (SEO/Sitemap)

**File:** `content-route-manifest.ts` (single source of truth for all routes)  
**Responsibility:** Generate canonical route inventory for sitemap and metadata

**Rules:**

- One manifest file for all domains
- Must export `getContentRouteManifest(): ContentRouteEntry[]`
- Must include all detail routes (pattern + params filled in)
- Must provide canonical URLs
- Must provide `lastModified` from `publishedAt`
- Used by `/app/sitemap.ts` and `/app/robots.ts`

**Example Pattern:**

```typescript
// content-route-manifest.ts
import {
  listArticles,
  listTutorials,
  listCaseStudies,
  listGuides,
} from "./all-repositories";

export interface ContentRouteEntry {
  url: string; // Canonical URL
  lastModified: Date; // From publishedAt
  changeFrequency: "weekly" | "monthly" | "yearly";
  priority: number; // 0.5 - 1.0
}

export function getContentRouteManifest(): ContentRouteEntry[] {
  const routes: ContentRouteEntry[] = [];

  // Article routes
  listArticles().forEach((article) => {
    routes.push({
      url: `/dashboard/content-library/articles/${article.meta.category}/${article.meta.slug}`,
      lastModified: new Date(article.meta.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  // Repeat for tutorials, case-studies, guides
  // ...

  return routes;
}
```

---

## Block Registry & Taxonomy

This section defines the standard block types available across all domains and the process for adding new blocks.

### Core Block Types (Immutable)

These blocks are available in all domains. Do NOT create variation per domain.

| Block Type | Purpose                | Props                                                    | Component      | Status        |
| ---------- | ---------------------- | -------------------------------------------------------- | -------------- | ------------- |
| `text`     | Paragraph text         | `content: string`                                        | `TextBlock`    | ✅ Production |
| `heading`  | Section heading        | `level: 1-6, content: string`                            | `HeadingBlock` | ✅ Production |
| `code`     | Code snippet           | `language: string, content: string, title?: string`      | `CodeBlock`    | ✅ Production |
| `image`    | Embedded image         | `url: string, alt: string, caption?: string`             | `ImageBlock`   | ✅ Production |
| `quote`    | Block quote            | `content: string, author?: string`                       | `QuoteBlock`   | ✅ Production |
| `alert`    | Info/warning/error box | `type: "info"\|"warning"\|"error", content: string`      | `AlertBlock`   | ✅ Production |
| `callout`  | Highlighted callout    | `type: string, title: string, content: string`           | `CalloutBlock` | ✅ Production |
| `list`     | Ordered/unordered list | `ordered: boolean, items: string[]`                      | `ListBlock`    | ✅ Production |
| `table`    | Data table             | `headers: string[], rows: string[][]`                    | `TableBlock`   | ✅ Production |
| `divider`  | Visual separator       | (none)                                                   | `DividerBlock` | ✅ Production |
| `video`    | Embedded video         | `url: string, type: "youtube"\|"vimeo", aspect?: string` | `VideoBlock`   | ✅ Production |

### Block Extension Registry

Domain-specific blocks must be registered here with reuse-first justification.

**Current Registered Extensions:**

- **Content Library:** None (uses only core blocks)
- **Documentation Sidebar:** (TBD after extraction-first analysis)

**How to Add a Block:**

1. **Reuse-First Checklist:** Can an existing core block + custom styling achieve this?
   - Text + CSS? → Use `text` with class
   - Code + custom syntax highlighting? → Use `code` with renderer plugin
   - Custom component? → Propose block
2. **Proposal Document:**
   - Block name and type discriminator
   - JSON shape (TypeScript interface)
   - Required props vs optional
   - Zod schema
   - React component
   - Fallback rendering (what if component is missing)
3. **Registry Entry:**
   - Add to `BlockRegistry` in this doc
   - Update all relevant schema files
   - Update block renderer component registry
   - Add test cases
   - Document in migration guide
4. **Review Gate:** Must be approved by senior architect before adding to schema

---

## Schema Extension Rules

New fields or blocks can extend the canonical contract, but only by these rules.

### Rule 1: Additive Only

All extensions must be **optional** fields appended to the contract. Do NOT remove or rename existing fields.

```typescript
// ✅ ALLOWED: Adding optional field
meta: {
  slug: string;
  title: string;
  excerpt: string;
  customField?: string;  // ← New, optional
}

// ❌ NOT ALLOWED: Removing existing field
meta: {
  slug: string;
  title: string;
  // excerpt removed ← breaks existing content
}

// ❌ NOT ALLOWED: Renaming existing field
meta: {
  slug: string;
  title: string;
  description?: string;  // ← Should still be 'excerpt'
}
```

### Rule 2: Versioned Schemas

If breaking changes are absolutely necessary, create a new version:

```typescript
// article-schema-v1.ts (deprecated)
export const ArticleSchemaV1 = z.object({ ... });

// article-schema-v2.ts (new)
export const ArticleSchemaV2 = z.object({ ... });

// article-schema.ts (union with migration)
export const ArticleSchema = z.union([
  ArticleSchemaV1,
  ArticleSchemaV2,
]).transform(doc => {
  if (doc.version === 1) return migrateV1ToV2(doc);
  return doc;
});
```

### Rule 3: Domain Overrides

Domains can override optional fields but must document why:

```typescript
// Content Library: Uses 'level: beginner | intermediate | advanced'
// Documentation: Uses 'complexity: novice | intermediate | expert'

// Pattern: Create domain-specific constant
export const ARTICLE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export const DOCUMENTATION_COMPLEXITIES = [
  "novice",
  "intermediate",
  "expert",
] as const;

// Schema validates against domain-specific enum
export const ArticleSchema = z.object({
  meta: z.object({
    level: z.enum(ARTICLE_LEVELS),
  }),
});

export const DocumentationSchema = z.object({
  meta: z.object({
    complexity: z.enum(DOCUMENTATION_COMPLEXITIES),
  }),
});
```

### Rule 4: Block Schemas are Immutable

Core block types cannot be modified per domain. Use `customProps?: Record<string, unknown>` for domain-specific metadata:

```typescript
// ❌ NOT ALLOWED: Different code block per domain
// Content Library CodeBlock vs Documentation CodeBlock

// ✅ ALLOWED: Add domain-specific metadata
export interface CodeBlock extends BaseBlock {
  type: "code";
  language: string;
  content: string;
  customProps?: {
    highlightLines?: number[]; // Documentation-specific
    copyrightNotice?: string; // Content Library-specific
  };
}
```

---

## Reuse First Discipline

This is the primary tool for preventing architecture drift and component duplication.

### Component Reuse Checklist

Before creating a NEW block type or component:

- [ ] Does an existing block + CSS solve this? (✅ = use existing)
- [ ] Does an existing component with different data shape solve this? (✅ = create view model)
- [ ] Does an existing atom/molecule/organism + composition solve this? (✅ = use existing)
- [ ] Have I searched the codebase for similar blocks? (✅ = reuse)
- [ ] Is there a content library example of this pattern? (✅ = replicate)
- [ ] Is this truly domain-specific and not reusable? → Propose new block

### Proof Point: Content Library

Content library uses ONLY core blocks:

- ✅ No custom block types
- ✅ All content renders with standard block components
- ✅ Domain-specific formatting via view models (formattedDate, readTimeLabel, etc.)
- ✅ SEO extension added to schema without new blocks

**This is the model to follow for documentation migration.**

### Required Documentation for New Blocks

If new block is justified, create `BLOCK_PROPOSAL_<NAME>.md`:

````markdown
# Block Proposal: <Block Name>

## Executive Summary

Why this block is necessary and cannot be achieved with existing blocks.

## Content Examples

3-5 examples from target domain showing why existing blocks don't work.

## JSON Shape

```typescript
interface <BlockName>Block extends BaseBlock {
  type: "<blockname>";
  ...props
}
```
````

```

## Zod Schema
(Full schema with validation rules)

## React Component
(Implementation sketch, not full code)

## Fallback (No-JS rendering)
How does this gracefully degrade if component is missing?

## Affected Domains
Which domains use this block? Is it reusable across domains?

## Migration Cost
What schema versions need updating? What content needs migration?

## Approval Checklist
- [ ] Senior architect review
- [ ] Content library pattern analysis
- [ ] Reuse-first justification
- [ ] Test cases defined
- [ ] Migration plan documented
```

---

## Validation Gates

Strict validation gates must pass before each batch of content migrations can proceed.

### Gate 1: Schema Validation

**When:** Before committing any content JSON  
**Tool:** Zod + custom script  
**Command:** `node scripts/validate-content-schema.mjs`  
**Pass Criteria:**

- ✅ All JSON files parse without syntax errors
- ✅ All files validate against domain schema
- ✅ All block types are in core registry or registered extensions
- ✅ All nested objects (seo, toc, access) are valid
- ✅ Every document includes `seo` object with Strapi-compatible field shape
- ✅ Every document has a valid title/description via explicit SEO value or approved fallback chain
- ✅ Public routes define canonical URL policy (explicit or deterministic generation rule)
- ✅ Zero validation errors reported

**Failure:** Blocks batch from merging until all schemas pass.

### Gate 2: Data Integrity

**When:** After schema validation passes  
**Tool:** Integration tests  
**Command:** `pnpm run test:data`  
**Pass Criteria:**

- ✅ All repository `list*()` functions return expected counts
- ✅ All `get*BySlug()` queries find correct documents by slug
- ✅ All category/filter functions return accurate subsets
- ✅ View model transformations produce correct shapes
- ✅ No null/undefined returned for valid queries
- ✅ All test cases pass

**Failure:** Blocks batch from further migration until data tests pass.

### Gate 3: Route & Metadata

**When:** After data integrity tests pass  
**Tool:** Integration tests + manual checks  
**Command:** `pnpm run test:routes && pnpm run test:metadata`  
**Pass Criteria:**

- ✅ `generateStaticParams()` returns all valid slug combinations
- ✅ `generateMetadata()` returns complete metadata objects
- ✅ Metadata includes title, description, canonical URL, robots
- ✅ Metadata mapping aligns with Strapi SEO plugin conventions (`metaTitle`, `metaDescription`, `metaImage`, `metaSocial`, `preventIndexing`)
- ✅ Content route manifest includes all routes
- ✅ Sitemap generation includes all routes with lastModified
- ✅ No 404s for valid slug combinations

**Failure:** Blocks batch from further migration until route/metadata tests pass.

### Gate 4: Quality & Accessibility

**When:** After routes pass  
**Tool:** Visual inspection + accessibility checks  
**Command:** `pnpm run test:a11y`  
**Pass Criteria:**

- ✅ Pages render without visual errors
- ✅ Block renderers produce valid HTML structure
- ✅ All links are valid (internal + external)
- ✅ TOC navigation works (if present)
- ✅ Images have alt text
- ✅ Blocks are accessible (semantic HTML, ARIA roles)
- ✅ Code blocks are readable and formatted
- ✅ No accessibility violations

**Failure:** Blocks batch from further migration until quality issues resolved.

### Gate 5: Build & Production

**When:** All other gates pass  
**Tool:** TypeScript compiler + Next.js build  
**Command:** `pnpm exec tsc --noEmit && pnpm run build && pnpm run test`  
**Pass Criteria:**

- ✅ TypeScript compilation succeeds (no type errors)
- ✅ Next.js build succeeds (no build errors)
- ✅ All tests pass (unit + integration + E2E)
- ✅ No build warnings for new code
- ✅ Vercel or deployment preview builds successfully
- ✅ Performance budget maintained (build time, bundle size)

**Failure:** Blocks batch from merge/deployment until build succeeds.

### Gate Sequence (Per Batch)

```
Schema Validation ✓
    ↓
Data Integrity ✓
    ↓
Route & Metadata ✓
    ↓
Quality & Accessibility ✓
    ↓
Build & Production ✓
    ↓
BATCH APPROVED FOR MERGE
```

All gates must pass in sequence. No batch proceeds to next gate until current gate passes completely.

---

## Migration Strategy

This section outlines how the governance lock accelerates content migration work.

### Phase 1: Governance Foundation (THIS SESSION)

- ✅ Strapi Dynamic Zones Authority doc (this file)
- ✅ Block Registry definition
- ✅ Schema Extension Rules
- ✅ Validation Gates specification
- ⏳ (Task 2) Markdown cleanup policy
- ⏳ (Task 3) Documentation extraction-first plan

**Output:** Single canonical architecture doc + cleanup matrix + migration plan  
**Gate:** New chat has complete governance before any code migration

### Phase 2: Documentation Extraction (NEXT SESSION)

**Input:** Markdown cleanup matrix + extraction-first plan  
**Process:**

1. Identify documentation domains (strategic-overview, cms-reference, app-reference, infrastructure-and-ops)
2. Extract Markdown content to Strapi-mock JSON using canonical contract
3. Create schema files per domain (documentation-schema.ts, etc.)
4. Validate all JSON against schemas (Gate 1)
5. Create content builders, repositories, view models
6. Create facade API for backward compatibility
7. Test all layers (Gate 2-4)
8. Build and verify (Gate 5)

**Output:** Fully migrated documentation pages using 6-layer architecture

### Phase 3: Route Migration (AFTER PHASE 2)

**Input:** Verified migrated content from Phase 2  
**Process:**

1. Create new server components using view models
2. Implement generateStaticParams() for all routes
3. Implement generateMetadata() with SEO fields
4. Add content to route manifest
5. Integrate with sitemap.xml and robots.txt
6. Deploy to preview
7. Verify via integration tests

**Output:** Documentation pages fully migrated to 6-layer architecture

### Phase 4: Real-Time Updates (FUTURE)

**Input:** Production Strapi instance  
**Process:**

1. Migrate schemas to Strapi (create collection types + components)
2. Import content JSON to Strapi via script
3. Update repositories to call Strapi REST API
4. Add ISR/revalidation webhooks from Strapi
5. Update content builders to handle API responses
6. Keep view models and routes unchanged (abstraction win)

**Output:** Live content management via Strapi, zero code changes in pages

---

## Authority & Changes

### Who Can Make Changes to This Doc?

- ✅ **Senior Architect:** Can add rules and tighten constraints
- ✅ **Tech Lead:** Can propose new blocks or schema extensions
- ⚠️ **Individual Contributors:** Can propose via ticket with full justification
- ❌ **No one:** Can remove rules or loosen constraints without discussion

### Change Process

1. **Proposed Change:** File GitHub issue or document in ticket
2. **Justification:** Explain why rule change is necessary
3. **Impact Analysis:** Show what code/content affected
4. **Review:** Senior architect + team lead review
5. **Documentation:** Update this file with explicit change notes
6. **Announcement:** Post in team channel so next session picks it up
7. **Retroactive Compliance:** Update existing code/content to match

### Change Log

**2026-02-28:** SEO-first governance update

- Promoted `seo` from future-optional to required canonical contract tier
- Locked Strapi SEO plugin-ready field shape for all content documents
- Added explicit SEO readiness policy (publish minima + fallback chain)
- Strengthened Gate 1 and Gate 3 SEO validation criteria

**2026-02-28:** Initial governance lock

- Established canonical contract (meta + seo + route + access + toc + blocks)
- Defined 6-layer architecture (schema → builder → repository → viewmodels → facade → manifest)
- Defined core block registry (11 immutable types)
- Defined schema extension rules (additive only, versioned for breaking changes)
- Defined reuse-first discipline with content library as model
- Defined validation gates (schema → data → route → quality → build)
- Locked migration strategy (governance → extraction → route → real-time phases)

---

## Related Documentation

- [Content Library Architecture](CONTENT_LIBRARY_ARCHITECTURE.md) — Production example of governance
- [Architecture Overview](ARCHITECTURE.md) — System-wide patterns
- [Session Handoff](SESSION_DYNAMIC_ZONES_HANDOFF.md) — Previous session decisions
- [Documentation Index](DOCUMENTATION_INDEX.md) — Markdown inventory (subject of Phase 1 Task 2)

---

**Status:** 🔒 LOCKED  
**Next Review:** Upon completion of Phase 2 extraction  
**Questions?** Consult [ARCHITECTURE.md](ARCHITECTURE.md) or [CONTENT_LIBRARY_ARCHITECTURE.md](CONTENT_LIBRARY_ARCHITECTURE.md)
