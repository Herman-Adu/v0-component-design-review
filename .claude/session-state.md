# Session State — v0-component-design-review

> **Git-tracked sprint state. Update this file at the end of every session / PR merge.**
> This is the single source of truth for what's in flight. CLAUDE.md holds stable architecture context.

---

## Current Sprint — March 6, 2026

**Active branch:** starting `feature/email-preview-wiring`
**Build:** 165/165 pages ✅ | 148/148 tests ✅ | 0 TS errors ✅

---

## Recently Merged

| PR | Branch | Summary |
|----|--------|---------|
| #22 | feature/email-template-ct | email-template CT + 6-layer module + page + derive-map elimination + schema hardening |
| #21 | feature/email-config-strapi-backing | 4 × 6-layer email config modules wired to Strapi |
| #20 | — | Sidebar nav async RSC + manifest-driven |
| #19 | — | Phase 5 email config admin self-service + ColorPicker |

---

## In Progress

### `feature/email-preview-wiring`
- **Goal:** Wire existing `email-preview` page off `renderEmailPreview` server action to proper Strapi-backed template data
- **Page:** `apps/ui/app/(dashboard)/dashboard/admin/email-management/configuration/email-preview/page.tsx`
- **Current state:** Page exists as pure client component using `renderEmailPreview` from `lib/actions/render-email`
- **Required:** Understand `renderEmailPreview` + `action.types.ts`, wire to `listEmailTemplates` from repository

---

## Backlog (ordered)

1. **email-preview page wiring** ← current
2. Facebook / LinkedIn / Twitter platform landing pages
3. oRPC API layer (Phase 3)
4. Request management hardening (inbound email via Resend)
5. `recipient-group` + `ab-subject-line` page hardening

---

## Deferred (needs dedicated session)

- email-preview full Resend integration (complex — rendering pipeline)
- Playwright E2E for email config pages

---

## Key Decisions This Sprint

- `mcp__MCP_DOCKER__*` confirmed working with PAT (full write access) — no more `gh` CLI
- Memory migrated from local `~/.claude/` to git-tracked `CLAUDE.md` + this file
- `push_files` via MCP used for docs-only commits (bypasses pre-push hook intentionally for non-code changes)

---

## PR Checklist (every PR)

- [ ] `pnpm build` passes locally (165/165 pages, 0 TS errors)
- [ ] `pnpm test` passes (148/148)
- [ ] Update this file (`session-state.md`) — move completed items to Recently Merged
- [ ] Update `CLAUDE.md` Current State section if build numbers change
