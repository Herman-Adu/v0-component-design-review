# Session Handoff — Dynamic Zones Lockdown (Feb 28, 2026)

## Why this handoff exists

Token window is near limit. This handoff locks architecture decisions so the next session starts without drift.

---

## Locked Decisions (Do Not Re-open)

1. **Dynamic zones / block model is mandatory** across documentation sidebar sections and reusable for normal pages when needed.
2. **Single canonical content contract** for sidebar domains:
   - `meta + seo + route + access + toc + blocks`
3. **Atomic reuse first**:
   - Reuse existing atoms/molecules/organisms and existing block renderers wherever possible.
   - Add new block types only when no existing component can represent the requirement.
4. **No shortcut migration**:
   - Extraction-first workflow, then validation, then route migration.
5. **6-layer architecture remains required**:
   - `schema → builder → repository → viewmodels → facade → manifest`
6. **Validation discipline after each batch**:
   - Zod schema pass, integration tests pass, metadata/sitemap checks pass, build/tests pass.

---

## Confirmed Current State

- Content library already uses a block-style model (meta/layout/toc/blocks) and should be treated as the baseline pattern.
- Documentation pages in `app/(dashboard)/dashboard/documentation/**` are still mostly large client-heavy pages and need migration.
- Documentation/architecture markdown is fragmented; there is no single active Strapi dynamic-zones authority doc.
- Markdown sprawl is significant (tracked markdown files are high, especially under `data/`).

---

## Immediate Next Work (Priority Order)

### A) Governance lock (first)

Create/refresh one canonical architecture authority covering:

- Strapi dynamic zones strategy
- Shared block taxonomy and registry
- Schema contract and extension rules
- Reuse rules (no new component unless necessary)
- Validation gates per batch

### B) Documentation cleanup policy (second)

Define keep/archive rules before deleting anything:

- Keep: canonical architecture docs, active README/index, current execution guides
- Archive: old phase notes, session summaries, superseded checkpoints
- Add explicit `superseded-by` mapping where needed

### C) Migration execution (third)

Extraction-first for documentation pages:

1. Extract page content to Strapi-mock JSON using canonical block contract
2. Validate with Zod
3. Implement repository/view-model/facade/manifest wiring
4. Replace legacy app route pages with server-first SSG/SSR pages
5. Run full validation gates

---

## Required Technical Constraints

- Server-only data access for repositories
- Integration tests with high confidence (target complete coverage for new paths)
- SEO metadata + sitemap integration for migrated routes
- Authorization-ready server boundaries
- oRPC-ready contracts
- Logging at data/query/page layers for observability/testing

---

## Suggested Batch Gates (Must pass before next batch)

1. **Schema Gate**: all extracted JSON validates with no warnings
2. **Data Gate**: repository + viewmodel tests green
3. **Route Gate**: static params + metadata + route manifest checks green
4. **Quality Gate**: targeted visual checks + toc/link integrity
5. **Build Gate**: `pnpm exec tsc --noEmit` + `pnpm run build` + tests pass

---

## Risk Controls

- Drift risk: prevented by single canonical architecture authority doc
- Duplication risk: prevented by block registry + reuse-first rule
- Regression risk: prevented by per-batch validation gates
- Documentation entropy risk: prevented by keep/archive policy and index ownership

---

## Starting Point for New Chat

Primary context file:

- `SESSION_DYNAMIC_ZONES_HANDOFF.md`

Secondary references:

- `ARCHITECTURE.md`
- `CONTENT_LIBRARY_ARCHITECTURE.md`
- `DOCUMENTATION_INDEX.md`

---

## Non-Negotiables for the next session

- Do **not** begin code migration before governance lock is written/updated.
- Do **not** create new UI components when existing ones can be reused.
- Do **not** proceed batch-to-batch without passing all validation gates.

---

**Status at handoff:** Architecture direction aligned. Ready to execute governance lock + cleanup policy + extraction-first migration.
