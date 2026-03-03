# CLAUDE.md — AI Assistant Context File

> **Claude Code persistent context for this project.**
> Read this at the start of every session. Keep it concise — link to detailed docs for depth.

---

## Project Identity

**Name:** Document Administration / v0-component-design-review
**Stack:** Next.js 16 (App Router) + TypeScript strict + Zod + Tailwind + shadcn/ui
**CMS (planned):** Strapi 5 (not yet live — mocked with JSON files in `data/strapi-mock/`)
**API layer (planned):** oRPC (end-to-end type safety with chaining)
**Testing:** Vitest (unit/integration) + Playwright (E2E)
**Package manager:** pnpm
**Deploy:** Vercel (live at https://vercel.com/hermanadus-projects/v0-component-design-review)

---

## Architecture — The Non-Negotiables

### 6-Layer Data Architecture (ALL modules, NO exceptions)

```
JSON Data → Content Builder → Repository → View Models → Facade → Routes/Pages
```

- **Schema** (`*-schema.ts`) — Zod validation, PascalCase exports e.g. `ArticleContentDocumentSchema`
- **Content Builder** (`*-content-builder.ts`) — static load + validate + register, `import "server-only"`
- **Repository** (`*-repository.ts`) — server-only queries with `repoLogger`, `import "server-only"`
- **View Models** (`*-view-models.ts`) — domain → UI transform, computed properties, NO repo calls
- **Facade** (`articles.ts` etc.) — thin public re-export API
- **Route Manifest** (`content-route-manifest.ts`) — sitemap/SEO single source of truth

### Atomic Block Format (SSOT)

All blocks use `atom.*`, `molecule.*`, `organism.*` format.
All 8 content types import `BLOCK_TYPE_ALIASES` and `atomicLevelSchema` from:
`lib/strapi/dashboard/_shared/block-schema.ts` (540 lines, 39 block type aliases, discriminated unions)

**Never duplicate block definitions in individual schema files.**

### Shared Module (`lib/strapi/dashboard/_shared/`)

| File | Purpose |
|------|---------|
| `block-schema.ts` | SSOT — block type aliases, atomicLevelSchema, discriminated blockSchema |
| `base-view-model.ts` | Base interfaces: BaseDetailViewModel, BaseListItemViewModel + extensions |
| `content-meta-schema.ts` | Unified ContentMetaSchema (WIP — Session 2 task) |

### Module Structure

```
lib/strapi/dashboard/
├── _shared/                         # Single source of truth for shared patterns
├── content-library/
│   ├── articles/                    # article-schema.ts, article-content-builder.ts,
│   ├── tutorials/                   # article-repository.ts, article-view-models.ts
│   ├── case-studies/                # (same 4-file pattern for each)
│   └── guides/
└── documentation/
    ├── strategic-overview/          # strategic-overview-schema.ts, etc.
    ├── cms-reference/
    ├── app-reference/
    └── infrastructure-ops/

data/strapi-mock/                    # Mocked JSON content (replaces live Strapi for now)
__tests__/
├── integration-test/content-library/   # Repository integration tests
├── integration-test/documentation/     # (content-builder + repo + viewmodel pipeline)
└── e2e/                                # Playwright
```

---

## Current Work — March 3, 2026

**Branch:** `feature/repository-viewmodel-standardization`

**What is done:**
- All 8 content types migrated to atomic block format ✅
- `_shared/block-schema.ts` created (SSOT) ✅
- `_shared/base-view-model.ts` created ✅ (new file, not yet committed)
- Build: 166/166 pages SSG ✅, 39 integration tests passing ✅

**Session 2 Architecture Alignment tasks** (from `ARCHITECTURE_ALIGNMENT_SESSION2_HANDOFF.md`):
1. Rename schema exports → PascalCase across all 8 schemas
2. Create unified `ContentMetaSchema` in `_shared/content-meta-schema.ts`
3. Standardize type exports per schema (Document, Meta, Block, TocItem, Level, Category)
4. Adopt strict shared blockSchema across ALL content types (remove permissive local blockSchemas)
5. Add authority reference file headers to all schema files
6. Extract `TocItemSchema` to `_shared/toc-schema.ts`

**Key reading before doing schema work:**
- `ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md` — 8 findings with exact code templates
- `ARCHITECTURE_ALIGNMENT_SESSION2_HANDOFF.md` — task list for current session

---

## Coding Standards

- **TypeScript strict** — zero `any`, zero `as unknown as X`
- **Schema exports** — PascalCase always: `ArticleContentDocumentSchema`, `GuideContentDocumentSchema`
- **Type exports** — always export: `${Type}Document`, `${Type}Meta`, `${Type}Block`, `${Type}TocItem`, `${Type}Level`, `${Type}Category`
- **server-only** — ALL content builders and repositories must `import "server-only"` at top
- **No inline MetaSchema** — import from `_shared/content-meta-schema.ts`
- **No inline TocItemSchema** — import from `_shared/toc-schema.ts`
- **No drift** — if you add a method to one repository, add it to all equivalent repositories
- **No new block types** without the formal proposal process in `STRAPI_DYNAMIC_ZONES_AUTHORITY.md`
- **Authority headers** — every schema file references `STRAPI_DYNAMIC_ZONES_AUTHORITY.md`
- **Reuse-first** — check existing components/blocks before creating new ones

---

## Commands

```bash
pnpm dev                                          # Dev server :3000
pnpm build                                        # Runs prebuild validation + Next.js build
pnpm exec tsc --noEmit                            # TypeScript type check
pnpm test                                         # Vitest all tests
pnpm test -- __tests__/integration-test/documentation  # Single module
pnpm lint                                         # ESLint
```

**Build pass criteria:** 166/166 pages, zero TypeScript errors, zero Zod validation errors.

---

## Key Authority Documents

| File | Purpose |
|------|---------|
| `STRAPI_DYNAMIC_ZONES_AUTHORITY.md` | Governance lock — canonical contract, block registry, 5 validation gates |
| `ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md` | 8 architectural findings to fix (Session 2) |
| `ARCHITECTURE_ALIGNMENT_SESSION2_HANDOFF.md` | Current session task list with code templates |
| `ARCHITECTURE.md` | Full system architecture reference |
| `ROADMAP.md` | Phase roadmap — currently Phase 2 (data layer), Phase 3 = oRPC, Phase 5 = MCP |
| `INFRASTRUCTURE.md` | Docker Compose, DB schema, caching layers, CI/CD |
| `STRAPI_BUILDER_PATTERN.md` | Strapi collection type patterns |
| `STRAPI_COLLECTION_TYPE_SCHEMAS.md` | Full Strapi field definitions for 4 documentation domains |
| `HANDOFF_SESSION_SUMMARY.md` | March 2 session handoff — atomic migration complete |

---

## Strapi Status (NOT Yet Live)

Strapi 5 is **planned but not implemented**. All content is currently:
- JSON files in `data/strapi-mock/` structured to match future Strapi API responses
- Content builders load JSON statically at module init (build-time)
- The repository pattern is backend-agnostic — swapping JSON → Strapi REST changes ONLY the content builder

**When Strapi goes live:** use `STRAPI_COLLECTION_TYPE_SCHEMAS.md` for collection type setup.
Install `strapi-plugin-seo`. Update content builders to call Strapi REST API.
Pages, view models, and routes do NOT change (the abstraction works).

---

## SEO Policy (Effective Now)

Every content document must include a `seo` object, even if values fall back to `meta`:
- `seo.metaTitle` → falls back to `meta.title`
- `seo.metaDescription` → falls back to `meta.excerpt`
- `preventIndexing: true` enforces `noindex,nofollow`

---

## Testing Standards

- Repository tests are ALWAYS **integration tests** (content builder + repo + view model)
- Location: `__tests__/integration-test/[module]/[domain]-repository.test.ts`
- Mocks: `__tests__/mocks/integration/[module]/` — never mock `fs` or Zod directly
- Do NOT create `__tests__/` folders inside `lib/strapi/` — not yet (future)

---

## What NOT To Do

- Do NOT modify `STRAPI_DYNAMIC_ZONES_AUTHORITY.md` without reading it fully first
- Do NOT add `props: z.record(z.unknown())` — use strict shared `blockSchema`
- Do NOT define `MetaSchema` or `TocItemSchema` inline — use shared modules
- Do NOT use camelCase for schema const exports
- Do NOT skip `import "server-only"` on builders/repositories
- Do NOT let content-library and documentation drift apart in naming, methods, or patterns
- Do NOT commit without running `pnpm build` first (build validates all content)
- Do NOT create new files unless absolutely necessary — edit existing patterns

---

## MCP Servers & Tooling

See `.claude/mcp-config.md` for MCP server setup (Strapi MCP, Docker MCP Toolkit, filesystem, git).

Current AI setup: Claude Code (VS Code extension) + GitHub Copilot
Rate limiting on Copilot — use Claude Code for primary coding, Copilot for autocomplete.

---

*Last updated: March 3, 2026 | Branch: feature/repository-viewmodel-standardization*
