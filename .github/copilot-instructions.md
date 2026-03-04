# GitHub Copilot Instructions

## Project: Document Administration (Next.js 16 + Strapi 5 planned)

## Tech Stack

- **Framework:** Next.js 16 App Router, React Server Components (RSC-first, SSG)
- **Language:** TypeScript 5 strict mode — zero `any`, zero `as unknown as X`
- **Validation:** Zod (runtime schema validation, hand-crafted — do NOT auto-generate)
- **Styling:** Tailwind CSS + shadcn/ui + Radix UI
- **CMS:** Strapi 5 (planned — currently mocked with JSON in `data/strapi-mock/`)
- **API layer (planned):** oRPC v1 (contract-first, connects to real Strapi when live)
- **Package manager:** pnpm only
- **Testing:** Vitest (unit/integration), Playwright (E2E)

---

## Architecture — The 6-Layer Pattern

Every content module follows this exact layer structure. No exceptions.

```
[type]-schema.ts          → Zod schema (PascalCase export, imports from _shared/)
[type]-content-builder.ts → Static load + validate (import "server-only", safeParse)
[type]-repository.ts      → Data access queries (import "server-only", repoLogger)
[type]-view-models.ts     → Domain → UI transform (extends _shared/base-view-model.ts)
[type].ts                 → Facade (thin re-exports only)
app/.../page.tsx          → Server component (calls repo, passes ViewModel to component)
```

## Content Types (8 total, all follow the same pattern)

**content-library:** articles, tutorials, case-studies, guides
**documentation:** strategic-overview, cms-reference, app-reference, infrastructure-ops

---

## Shared Modules — Single Source of Truth

| File | Purpose |
|------|---------|
| `lib/strapi/dashboard/_shared/block-schema.ts` | SSOT — 39 block type aliases, atomicLevelSchema, discriminated blockSchema |
| `lib/strapi/dashboard/_shared/base-view-model.ts` | Base interfaces — ContentLibraryDetailViewModel, DocumentationDetailViewModel, etc. |
| `lib/strapi/dashboard/_shared/content-meta-schema.ts` | Unified ContentMetaSchema for all 4 content-library types |
| `lib/strapi/dashboard/_shared/documentation-meta-schema.ts` | DocumentationMetaBaseSchema for all 4 documentation types |
| `lib/strapi/dashboard/_shared/toc-schema.ts` | TocItemSchema |
| `lib/strapi/dashboard/_shared/seo-schema.ts` | SEO schema with preventIndexing |

---

## Critical Rules — DO NOT Violate

1. **Schema exports are PascalCase:**
   ```typescript
   export const ArticleContentDocumentSchema = z.object({...})  // ✅
   export const articleContentDocumentSchema = z.object({...})  // ❌
   ```

2. **Always `import "server-only"` as the FIRST import in builders and repositories**

3. **Never define MetaSchema inline** — import from `_shared/content-meta-schema.ts`
   or `_shared/documentation-meta-schema.ts`

4. **Never define TocItemSchema inline** — import from `_shared/toc-schema.ts`

5. **Block schema comes from shared module — never redefine:**
   ```typescript
   import { blockSchema, BLOCK_TYPE_ALIASES } from "../../_shared/block-schema"  // ✅
   const blockSchema = z.object({ type: z.string(), props: z.record(z.unknown()) })  // ❌
   ```

6. **All blocks use atomic format:** `atom.paragraph`, `molecule.infoBox`, `organism.featureGrid`
   Valid types are in `BLOCK_TYPE_ALIASES` — check the registry before using any type string.

7. **Type exports — every schema must export:**
   ```typescript
   export type ArticleContentDocument = z.infer<typeof ArticleContentDocumentSchema>
   export type ArticleContentMeta = z.infer<typeof ArticleMetaSchema>
   export type ArticleContentBlock = z.infer<typeof blockSchema>
   export type ArticleContentTocItem = z.infer<typeof TocItemSchema>
   export type ArticleLevel = (typeof ARTICLE_LEVELS)[number]
   export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]
   ```

8. **Authority header on every schema file:**
   ```typescript
   /**
    * [Type] Content Schema
    * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
    * Shared schemas: _shared/block-schema.ts, _shared/toc-schema.ts, _shared/content-meta-schema.ts
    */
   ```

9. **Repository methods use repoLogger:**
   ```typescript
   export function listArticles(): Article[] {
     repoLogger.info("ListArticles")
     return getArticleList()
   }
   ```

10. **View models extend base interfaces — never defined from scratch:**
    ```typescript
    import type { ContentLibraryDetailViewModel } from "../../_shared/base-view-model"
    export interface ArticleDetailViewModel
      extends Omit<ContentLibraryDetailViewModel, "category" | "level"> {
      category: ArticleCategory;
      level: ArticleLevel;
    }
    ```

11. **View models DO NOT call repositories** — they receive data and transform it

12. **Builders use `safeParse`, not `parse`** — and extract slug as `doc.meta.slug` (no `as any`)

---

## Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Schema const | PascalCase | `ArticleContentDocumentSchema` |
| Schema type | PascalCase | `ArticleContentDocument` |
| Repository functions | camelCase | `listArticles()`, `getArticleRecordBySlug()` |
| View model interfaces | PascalCase | `ArticleDetailViewModel` |
| View model functions | camelCase `to*` | `toArticleDetailViewModel()` |
| JSON data files | kebab-case | `atomic-design-principles.json` |

---

## Strapi Dynamic Zones

Blocks are atomic: atom / molecule / organism hierarchy.
Block types are in `BLOCK_TYPE_ALIASES` in `lib/strapi/dashboard/_shared/block-schema.ts`.
**Do NOT invent new block types** without the formal proposal process in `STRAPI_DYNAMIC_ZONES_AUTHORITY.md`.
**Do NOT add `props: z.record(z.unknown())`** — all block props must use the strict shared blockSchema.

---

## Testing

- Repository tests = **integration tests** (test content builder + repo + view model together)
- Location: `__tests__/integration-test/[module]/[type]-repository.test.ts`
- Use `vi.mock()` targeting the **content builder** (not the facade) — repos import from builders
- Use `BLOCK_TYPE_ALIASES.includes(block.type)` assertions (not regex) — some aliases have no atomic prefix
- Never put `__tests__/` folders inside `lib/strapi/`

---

## Agent Roles

**Claude Code handles:**
- Multi-file refactors (schema changes, builder migration, facade updates)
- New content type scaffolding
- Architecture reviews and drift detection
- MCP server orchestration
- Any change touching more than 2 files

**Copilot handles:**
- Within-file completions following established patterns
- View model transform function body
- Test assertion completion
- Single-component changes

---

## Current Phase: Docker + Strapi + MCP Setup

**Status:** Strapi is NOT yet live. JSON mock layer is SEALED — no new JSON files.
**Next:** Get Docker + Strapi running locally, then migrate content builders one at a time.
**docker-compose.yml** exists at project root — run `docker-compose up -d` for Postgres + Redis.

---

## What Copilot MUST NOT Generate

- Inline `MetaSchema` or `TocItemSchema` definitions
- `props: z.record(z.unknown())` — too permissive, defeats type safety
- camelCase schema const exports
- `useGetProduct`-style hooks with `useState`/`useEffect` for data fetching — we use RSC + SSG
- Auto-generated Zod from OpenAPI — our schemas are hand-crafted with discriminated unions
- Direct JSON imports in repository files (must go through content builder)
- Client-side data fetching for content that already exists as server-only SSG
- `getServerSession()` without middleware protection (auth not yet implemented)
- `z.string().length(24)` for Strapi documentId — use `z.string().min(1)` (CUID2 length varies)
