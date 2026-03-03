# GitHub Copilot Instructions

## Project: Document Administration (Next.js 16 + Strapi 5 planned)

## Tech Stack

- **Framework:** Next.js 16 App Router, React Server Components
- **Language:** TypeScript 5 strict mode — zero `any`, zero `as unknown as X`
- **Validation:** Zod (runtime schema validation at build time)
- **Styling:** Tailwind CSS + shadcn/ui + Radix UI
- **CMS:** Strapi 5 (planned — currently mocked with JSON in `data/strapi-mock/`)
- **Package manager:** pnpm only

---

## Architecture — The 6-Layer Pattern

Every content module follows this exact layer structure:

```
[type]-schema.ts          → Zod schema (PascalCase export)
[type]-content-builder.ts → Static load + validate (import "server-only")
[type]-repository.ts      → Data access queries (import "server-only")
[type]-view-models.ts     → Domain → UI transform (no repo calls)
[type].ts                 → Facade (thin re-exports)
app/.../page.tsx          → Server component (calls repo, passes to component)
```

## Content Types (8 total, all follow the same pattern)

**content-library:** articles, tutorials, case-studies, guides
**documentation:** strategic-overview, cms-reference, app-reference, infrastructure-ops

---

## Critical Rules — DO NOT Violate

1. **Schema exports are PascalCase:**
   ```typescript
   // ✅ Correct
   export const ArticleContentDocumentSchema = z.object({...})
   // ❌ Wrong
   export const articleContentDocumentSchema = z.object({...})
   ```

2. **Always `import "server-only"` in builders and repositories**

3. **Never define MetaSchema inline** — import from `lib/strapi/dashboard/_shared/content-meta-schema.ts`

4. **Never define TocItemSchema inline** — import from `lib/strapi/dashboard/_shared/toc-schema.ts`

5. **Block schema comes from shared module:**
   ```typescript
   // ✅ Correct
   import { blockSchema, BLOCK_TYPE_ALIASES } from "../../_shared/block-schema"
   // ❌ Wrong
   const blockSchema = z.object({ type: z.string(), props: z.record(z.unknown()) })
   ```

6. **All blocks use atomic format:** `atom.paragraph`, `molecule.infoBox`, `organism.featureGrid`

7. **Type exports — every schema must export these:**
   ```typescript
   export type ArticleContentDocument = z.infer<typeof ArticleContentDocumentSchema>
   export type ArticleContentMeta = z.infer<typeof ContentMetaSchema>
   export type ArticleContentBlock = z.infer<typeof blockSchema>
   export type ArticleLevel = (typeof ARTICLE_LEVELS)[number]
   export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]
   ```

8. **Every schema file needs this authority header:**
   ```typescript
   /**
    * [Type] Content Schema
    * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
    * Pattern: Consolidated with all content types via shared block-schema.ts
    */
   ```

9. **Repository methods use repoLogger:**
   ```typescript
   export function listArticles(): Article[] {
     repoLogger.info("ListArticles")
     return getArticleList()
   }
   ```

10. **View models DO NOT call repositories** — they receive data and transform it

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
Block types are defined in `BLOCK_TYPE_ALIASES` in `lib/strapi/dashboard/_shared/block-schema.ts`.
Do NOT invent new block types without checking the registry.

---

## Testing

- Repository tests = **integration tests** (test content builder + repo + view model together)
- Location: `__tests__/integration-test/[module]/[type]-repository.test.ts`
- Use `vi.mock()` to mock the content builder, test repo methods
- Never put `__tests__/` folders inside `lib/strapi/`

---

## What Copilot Should NOT Generate

- Inline `MetaSchema` definitions
- Inline `TocItemSchema` definitions
- `props: z.record(z.unknown())` — too permissive
- camelCase schema const exports
- Direct JSON imports in repository files (must go through content builder)
- `getServerSession()` without middleware protection (auth not yet implemented)
