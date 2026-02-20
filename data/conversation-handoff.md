# Session 14 Handoff -- TypeScript Contract Fix + Architecture Refactor
**Last Session:** S13 (partial fixes, build still broken)
**Current Session:** S14
**Date:** 2026-02-20

## Model Selection Protocol (MANDATORY)
v0 CANNOT change the model -- the user MUST select it manually in the v0 UI dropdown.
Before starting each task, v0 MUST:
1. State which model is needed for the upcoming task
2. STOP and wait for user confirmation that the model has been switched
3. Only proceed after user confirms

**Model assignments:**
- **v0 Max** -- architecture planning, multi-file refactors, complex debugging, cross-cutting type fixes, review/audit work
- **v0 (default)** -- standard implementation, single-feature builds, component creation
- **v0 Mini** -- single-file styling edits, copy changes, doc updates, simple prop fixes

**For Session 14:** Start on v0 Max (audit + batch type fix). Switch to v0 Mini for individual file edits once the plan is clear. Switch back to v0 Max for architecture refactor.

## Quick Recovery
Paste into new v0 chat:
> Continuing Electrical Services project. Read /data/conversation-handoff.md for context.
> Rules auto-load from .v0/rules.md.
> Session 14: TypeScript contract fix for clean build, then architecture refactor.
> FIRST: Read article-components.tsx fully. Audit every component interface.
> Then grep every consumer file for prop mismatches. Fix ALL in one batch.
> Verify build locally BEFORE any push.
> Announce model needed for each task and STOP for me to switch.

---

## BUILD STATUS: BROKEN

### The Problem (systemic, not isolated)
`components/molecules/article-components.tsx` (1045 lines, 20+ component definitions) has strict TypeScript interfaces. 80+ consumer files across articles/, tutorials/, case-studies/, guides/ pass props that don't match. `next build` stops at the FIRST error, so fixing one reveals the next. One-by-one patching does not work.

### Error Class: "Object literal may only specify known properties"
Every error is the same pattern: a consumer passes a prop name or shape the component interface doesn't accept.

### Fixes Applied in S12-S13 (verified committed)
| Component | Fix | Status |
|---|---|---|
| `CodeBlock` | Added `title?: string`, unified display via `label = filename \|\| title` | DONE |
| `StepFlow` | `number` made optional, accepts `string \| number` | DONE (S12) |
| `MetricsGrid` | Added `description?: string` | DONE (S12) |
| `DataFlowDiagram` | Added `id?`, `connections?`, `flow?`, `items?` | DONE (S12) |
| `KeyTakeaway` | Added `title?`, `points?: string[]` | DONE (S12) |
| `RelatedArticles` | Added `slug?` with href fallback | DONE (S12) |
| `InfoBox` | Added `"danger"` to type union | DONE (S12) |
| `FileTreeItem` | Added `indent?`, `description?` | DONE (S12) |
| `FeatureGrid` | Added `items?: string[]`, made `icon` optional | DONE (S12) |
| `ComparisonCards` | Fixed 8 consumers: leftData->leftItems, rightData->rightItems, removed title+items object shape, removed cards= | DONE (S13) |
| `BeforeAfterComparison` | Fixed 2 consumers: title+items -> beforeTitle/afterTitle+improvements, label->metric | DONE (S13) |
| `InfoBox` | Fixed 5 consumers: items={[...]} -> children JSX; fixed 1 type="success" -> type="tip" | DONE (S13) |
| `FileTree` | Fixed 4 consumers: label -> description | DONE (S13) |

### Known REMAINING Errors (not yet fixed)
These are the same class -- more consumers with prop mismatches we haven't reached yet because `next build` stops at the first error. The systematic fix is:

**Step 1:** Read the FULL `article-components.tsx` file. Document every component's exact interface.
**Step 2:** Grep all 80+ consumer files for every prop they pass to each component.
**Step 3:** For each mismatch, decide: add the prop to the interface (if it makes sense) OR fix the consumer.
**Step 4:** Apply ALL fixes in one batch. Verify build. Push once.

### Missing Modules (all resolved in S13)
| Module | Status |
|---|---|
| `lib/email/config/email-config.tsx` | Already existed as .tsx (deleted erroneous .ts duplicate) |
| `hooks/use-hydration.tsx` | Already existed as .tsx (deleted erroneous .ts duplicate) |
| `lib/utils/date-utils.ts` | Created in S13 (exports minDate, formatDateUK) |

---

## ARCHITECTURE ASSESSMENT

### Current State
```
features/                 (3 features properly structured)
  contact/                components/ hooks/ schemas/ api/ types/ index.ts
  quotation/              components/ hooks/ schemas/ api/ types/ index.ts
  service-request/        components/ hooks/ schemas/ api/ types/ index.ts

components/               (mixed: shared UI + domain content -- PROBLEM)
  atoms/                  ~10 files (form-input, date-picker, theme-toggle)
  molecules/              ~10 files (article-components.tsx = 1045 lines, 20+ components)
  organisms/              ~5 files (shared-steps)
  ui/                     ~45 files (shadcn primitives)
  animations/             3 files
  providers/              2 files
  articles/               32 files -- SHOULD BE in features/
  tutorials/              16 files -- SHOULD BE in features/
  case-studies/           17 files -- SHOULD BE in features/
  guides/                 4 files -- SHOULD BE in features/
  admin/                  5 files -- SHOULD BE in features/

lib/                      (mixed: shared + domain-specific)
  email/                  config/ services/ templates/
  actions/                email-admin, render-email, security-audit
  security/               csrf, rate-limiter
  sanitize/               input-sanitizer
  store/                  Zustand global store
  utils/                  date-utils
  validation/             validation schemas
  forms/                  form types
  patterns/               hydration-patterns

data/                     content-library/ doc-manifest/ nav-data
app/                      ~95 page.tsx route files
```

### Target State
```
features/
  contact/                (DONE)
  quotation/              (DONE)
  service-request/        (DONE)
  dashboard/
    admin/                components/ lib/ types/
    content-library/      components/ (4 data-driven renderers) lib/ types/
    documentation/        components/ lib/ types/

components/               (GLOBAL SHARED ONLY)
  atoms/  molecules/  organisms/  ui/  providers/  animations/

lib/                      (GLOBAL SHARED ONLY)
  email/  security/  sanitize/  validation/  store/  utils/

types/                    (shared interfaces only)
```

### Key Insight: 60+ Content Components Are Bespoke Wrappers
Each article/tutorial/case-study/guide component is essentially the same layout (SectionHeader + InfoBox + CodeBlock + ComparisonCards etc.) with different data. They should be ~4 data-driven renderers consuming content data from `data/content-library/`.

---

## WHAT IS COMPLETE (Sessions 1-11)

### Public Pages (4)
Home, Services, Get a Quote, Contact Us

### Multi-Step Forms (3)
Service Request (6 steps), Quotation (7 steps), Contact (5 steps) -- all with Zustand + Resend

### Dashboard (75+ pages)
- Documentation: Strategic Overview (6), CMS Reference (7), App Reference (9), Infra & Ops (6)
- Content Library: Articles (26), Case Studies (18), Tutorials (15), Guides (3), Social
- Admin: Document Admin (10), Email Admin (15), Digital Marketing (28), Overview

---

## TECH STACK
Next.js 16, React 19, TypeScript strict, TailwindCSS v4, shadcn/ui, Zustand, Zod v3, Framer Motion, GSAP, Resend, pnpm

## KEY FILES
- `components/molecules/article-components.tsx` -- THE molecule library (1045 lines, 20+ components). This is ground zero for type errors.
- `data/content-library/articles.tsx` -- Article content data (contains real imports AND code example strings -- must distinguish)
- `lib/email/config/email-config.tsx` -- Email config (NOTE: .tsx extension)
- `hooks/use-hydration.tsx` -- Hydration hook (NOTE: .tsx extension)

## SESSION MANAGEMENT PROTOCOL
- **Token budget:** Monitor context window. At ~70% usage, STOP work, summarise progress, update this handoff, and tell user to start a new session.
- **Op budget:** 15 ops per session. Announce op count at session start and after each major action.
- **Model switching:** STOP and ask user to switch model before each task phase. Never assume model is correct.
- **Timeout prevention:** Keep responses concise. Use parallel tool calls. Avoid re-reading files already in context.
- **Handoff discipline:** Update this file BEFORE session ends, not after. Include: what was done, what failed, what's next, exact file paths.

## RULES / LESSONS LEARNED
- Always check BOTH .ts and .tsx extensions before creating files
- Biome autofix converts named imports to default. Use `dangerously_disable_autofix: true` for import edits.
- v0 script sandbox CANNOT run next build or tsc -- isolated environment without project source access
- v0 CANNOT change the model -- user must select in UI dropdown. v0 must STOP and request switch.
- After every refactor: 3-axis review -> fix -> build verify -> fix -> visual verify
- data/content-library/*.tsx files contain import statements inside template literal strings -- these are NOT real imports
- `next build` stops at the FIRST TypeScript error -- must fix ALL before pushing
- Do NOT create files without first verifying both .ts and .tsx variants don't already exist
- Content component files (articles/, tutorials/, case-studies/, guides/) all follow the same pattern -- fix the molecule interface once rather than fixing 80+ consumers
