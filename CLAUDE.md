# CLAUDE.md — AI Assistant Context File

> **Claude Code persistent context for this project.**
> Read this at the start of every session. Keep it concise — link to detailed docs for depth.

---

## Project Identity

**Name:** Document Administration / v0-component-design-review
**Stack:** Next.js 16 (App Router) + TypeScript strict + Zod + Tailwind + shadcn/ui
**CMS:** Strapi 5 — running locally via Docker; JSON mock fallback for Vercel/CI
**API layer (planned):** oRPC (end-to-end type safety with chaining)
**Testing:** Vitest (unit/integration) + Playwright (E2E)
**Package manager:** pnpm
**Deploy:** Vercel (live at https://vercel.com/hermanadus-projects/v0-component-design-review)
**Repository:** Public — https://github.com/Herman-Adu/v0-component-design-review

---

## Architecture — The Non-Negotiables

### 6-Layer Data Architecture (ALL modules, NO exceptions)

```
JSON/Strapi Data → Content Builder → Repository → View Models → Facade → Routes/Pages
```

- **Schema** (`*-schema.ts`) — Zod validation, PascalCase exports e.g. `ArticleContentDocumentSchema`
- **Content Builder** (`*-content-builder.ts`) — load + validate + register, `import "server-only"`, wrapped in React `cache()`
- **Repository** (`*-repository.ts`) — server-only queries with `repoLogger`, `import "server-only"`
- **View Models** (`*-view-models.ts`) — domain → UI transform, computed properties, NO repo calls
- **Facade** (`articles.ts` etc.) — thin public re-export API
- **Route Manifest** (`content-route-manifest.ts`) — sitemap/SEO single source of truth, wrapped in React `cache()`

### Dual-Environment Data Flow

| Environment | Data source | Behaviour |
|-------------|-------------|-----------|
| Local + Docker Strapi running | Live Strapi REST API | Full read/write |
| Vercel production (no STRAPI_URL) | JSON files in `data/strapi-mock/` | Read-only fallback, Save disabled |
| CI | JSON files in `data/strapi-mock/` | Read-only, build validates all content |

**Strapi null handling:** All optional Strapi fields use `.nullish()` in Zod schemas (NOT `.optional()`).
Strapi returns `null` for empty optional fields; `.optional()` only accepts `undefined`.

### Atomic Block Format (SSOT)

All blocks use `atom.*`, `molecule.*`, `organism.*` format.
All 8 content types import `BLOCK_TYPE_ALIASES` and `atomicLevelSchema` from:
`lib/strapi/dashboard/_shared/block-schema.ts` (540 lines, 39 block type aliases, discriminated unions)

**Never duplicate block definitions in individual schema files.**

### Shared Module (`lib/strapi/dashboard/_shared/`)

| File | Purpose |
|------|----------|
| `block-schema.ts` | SSOT — block type aliases, atomicLevelSchema, discriminated blockSchema |
| `base-view-model.ts` | Base interfaces: BaseDetailViewModel, BaseListItemViewModel + extensions |
| `strapi-dto-transformer.ts` | Transformer SSOT — shared Strapi → domain mapping logic |

### Module Structure

```
lib/strapi/dashboard/
├── _shared/                         # Single source of truth for shared patterns
├── content-library/
│   ├── articles/                    # article-schema.ts, article-content-builder.ts,
│   ├── tutorials/                   # article-repository.ts, article-view-models.ts
│   ├── case-studies/                # (same 4-file pattern for each)
│   └── guides/
├── management/
│   ├── admin-overview/              # Admin dashboard overview
│   ├── digital-marketing/           # Digital marketing management page
│   ├── document-health/             # Document health management page
│   └── email-management/            # Email management page
└── documentation/
    ├── strategic-overview/
    ├── cms-reference/
    ├── app-reference/
    └── infrastructure-ops/

data/strapi-mock/                    # Mirrors sidebar structure; fallback JSON for Vercel/CI
data/nav-data/                       # Per-section nav definitions (barrel: data/nav-data.ts)
__tests__/
├── integration-test/content-library/   # Repository integration tests
├── integration-test/documentation/
└── e2e/                                # Playwright
```

---

## Current State — March 6, 2026

**Branch:** `main` — clean, all work merged
**Build:** 165/165 pages SSG ✅ | 148/148 tests ✅ | 0 TS errors ✅

**Completed (all on main):**
- All 8 content types — 6-layer architecture, atomic blocks, JSON + Strapi dual-source ✅
- All 4 management sections — admin-overview, document-health, email-management, digital-marketing ✅
- Global config — company-setting + email-setting Single Types, 6-layer in `lib/strapi/global/` ✅
- Phase 5 — Email config admin self-service + ColorPicker + JSON mock fallbacks (PR #19) ✅
- Sidebar nav — async RSC, manifest-driven, `data/content-library/` deleted (PR #20) ✅
- Schema hardening — `.nullish()` across all management schemas, `cache()` on all builders ✅
- `nav-data.ts` modularised — 792 lines → 20-line barrel + `data/nav-data/` per-section files ✅
- **PR #21** — Email config Strapi backing: 4 × 6-layer modules (ab-subject-variant, recipient-group, scheduler-config, scheduled-email); 3 pages wired RSC → client island; dead in-memory services deleted ✅
- **PR #22** — email-template CT + 6-layer module + page + derive-map elimination + schema hardening ✅

**Next up (see `.claude/session-state.md` for sprint detail):**
- `email-preview` page wiring — feature/email-preview-wiring
- Facebook / LinkedIn / Twitter platform landing pages
- oRPC API layer (Phase 3)

---

## Coding Standards

- **TypeScript strict** — zero `any`, zero `as unknown as X`
- **Schema exports** — PascalCase always: `ArticleContentDocumentSchema`, `GuideContentDocumentSchema`
- **Type exports** — always export: `${Type}Document`, `${Type}Meta`, `${Type}Block`, `${Type}TocItem`, `${Type}Level`, `${Type}Category`
- **server-only** — ALL content builders and repositories must `import "server-only"` at top
- **React cache()** — ALL content builders AND `getContentRouteManifest` must be wrapped in `cache()`
- **Zod nullish** — ALL optional Strapi fields use `.nullish()` not `.optional()`
- **No inline MetaSchema** — import from `_shared/content-meta-schema.ts`
- **No inline TocItemSchema** — import from `_shared/toc-schema.ts`
- **No drift** — if you add a method to one repository, add it to all equivalent repositories
- **No new block types** without the formal proposal process in `STRAPI_DYNAMIC_ZONES_AUTHORITY.md`
- **Authority headers** — every schema file references `STRAPI_DYNAMIC_ZONES_AUTHORITY.md`
- **Reuse-first** — check existing components/blocks before creating new ones
- **Nav sections** — add new sections in `data/nav-data/` sub-files, not in `data/nav-data.ts` barrel

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

**Build pass criteria:** 165/165 pages, zero TypeScript errors, zero Zod validation errors.

---

## Key Authority Documents

| File | Purpose |
|------|----------|
| `STRAPI_DYNAMIC_ZONES_AUTHORITY.md` | Governance lock — canonical contract, block registry, 5 validation gates |
| `ARCHITECTURE.md` | Full system architecture reference |
| `ROADMAP.md` | Phase roadmap — Phase 2 complete, Phase 3 = oRPC, Phase 5 = MCP |
| `INFRASTRUCTURE.md` | Docker Compose, DB schema, caching layers, CI/CD |
| `STRAPI_BUILDER_PATTERN.md` | Strapi collection type patterns |
| `STRAPI_COLLECTION_TYPE_SCHEMAS.md` | Full Strapi field definitions for 4 documentation domains |
| `TESTING_ARCHITECTURE.md` | Test organization, colocation rules, integration test patterns |
| `.claude/session-state.md` | Current sprint state, active branch, next actions |

*Note: Session handoffs and refactor plans are in `docs/archive/` — historical reference only.*

---

## Strapi Status

Strapi 5 is **running locally via Docker** and fully connected on local dev.
All 4 management sections + 8 content types + global config are live.
Email config: 5 collection types fully Strapi-backed (ab-subject-variant, recipient-group, scheduler-config, scheduled-email, email-template).

- **Local dev:** Content builders call Strapi REST API; full read/write via server actions
- **Vercel/CI:** Falls back to `data/strapi-mock/` JSON files; Save buttons disabled
- **Swap boundary:** Only the content builder changes when switching JSON ↔ Strapi. Pages, view models, and routes do NOT change.

**When adding new Strapi collection types:** use `STRAPI_COLLECTION_TYPE_SCHEMAS.md`.
Install `strapi-plugin-seo`. Update content builder only.

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
- Do NOT skip `cache()` on content builders or `getContentRouteManifest`
- Do NOT use `.optional()` for Strapi optional fields — use `.nullish()`
- Do NOT let content-library and documentation drift apart in naming, methods, or patterns
- Do NOT commit without running `pnpm build` first (build validates all content)
- Do NOT create new files unless absolutely necessary — edit existing patterns
- Do NOT add nav section data directly to `data/nav-data.ts` — use the per-section files
- Do NOT use `gh` CLI — use `mcp__MCP_DOCKER__*` GitHub tools for all GitHub operations
- Do NOT expose secret values in chat — reference env var names only, never values

---

## MCP Servers & Tooling

See `.claude/mcp-config.md` for full MCP server setup.

**Active MCP servers (Docker MCP Toolkit) — PAT authenticated, full write access:**

| Operation | Tool |
|-----------|------|
| Create PR | `mcp__MCP_DOCKER__create_pull_request` |
| Merge PR | `mcp__MCP_DOCKER__merge_pull_request` |
| Create branch | `mcp__MCP_DOCKER__create_branch` |
| Read PR / CI status | `mcp__MCP_DOCKER__pull_request_read` |
| List branches | `mcp__MCP_DOCKER__list_branches` |
| Push files (docs/config) | `mcp__MCP_DOCKER__push_files` |
| Strapi container ops | `mcp__MCP_DOCKER__mcp-exec` |

**Rules:**
- ALWAYS use `mcp__MCP_DOCKER__*` for GitHub — never `gh` CLI
- Load tools with `ToolSearch` before first use each session
- Secrets stay in containers — never pipe through host shell

Current AI setup: Claude Code (VS Code extension) + GitHub Copilot
Rate limiting on Copilot — use Claude Code for primary coding, Copilot for autocomplete.

---

*Last updated: March 6, 2026 | Branch: main | Build: 165/165 ✅ | PRs merged: #19 #20 #21 #22*
