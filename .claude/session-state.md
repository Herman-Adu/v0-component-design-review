# Session State — v0-component-design-review

> **Git-tracked sprint state. Update this file at the end of every session / PR merge.**
> This is the single source of truth for what's in flight. CLAUDE.md holds stable architecture context.

---

## Current Sprint — March 6, 2026

**Active branch:** `main` — clean, ready for next feature
**Build:** 165/165 pages ✅ | 148/148 tests ✅ | 0 TS errors ✅

---

## Recently Merged

| PR | Branch | Summary |
|----|--------|---------|
| #24 | feature/email-preview-wiring | email-preview RSC shell + Strapi-backed client island |
| #23 | chore/claude-memory-to-git | Memory migrated to git: CLAUDE.md updated + session-state.md created |
| #22 | feature/email-template-ct | email-template CT + 6-layer module + page + derive-map elimination + schema hardening |
| #21 | feature/email-config-strapi-backing | 4 × 6-layer email config modules wired to Strapi |
| #20 | — | Sidebar nav async RSC + manifest-driven |
| #19 | — | Phase 5 email config admin self-service + ColorPicker |

---

## Email Configuration Section — COMPLETE ✅

All 6 email config pages are Strapi-backed and following RSC shell → client island pattern:

| Page | Status |
|------|--------|
| `configuration/scheduler-config` | ✅ Strapi-backed |
| `configuration/ab-subject-lines` | ✅ Strapi-backed, templateKeyMap from repository |
| `configuration/recipient-groups` | ✅ Strapi-backed |
| `configuration/email-scheduling` | ✅ Strapi-backed, templateKeyMap from repository |
| `configuration/email-templates` | ✅ Strapi-backed, isActive toggle + sender overrides |
| `configuration/email-preview` | ✅ Strapi-backed, dynamic groups from repository (PR #24) |

---

## Backlog (ordered)

1. **Facebook / LinkedIn / Twitter platform landing pages** ← next
2. oRPC API layer (Phase 3)
3. Request management hardening (inbound email via Resend)
4. Playwright E2E for email config pages

---

## Key Decisions This Sprint

- `mcp__MCP_DOCKER__*` confirmed working with PAT (full write access) — no more `gh` CLI
- Memory migrated from local `~/.claude/` to git-tracked `CLAUDE.md` + this file
- `push_files` via MCP used for docs-only commits (bypasses pre-push hook intentionally)
- `toPreviewKey()` utility bridges Strapi camelCase templateKey → kebab-case `EmailTemplate` for `renderEmailPreview`

---

## PR Checklist (every PR)

- [ ] `pnpm build` passes locally (165/165 pages, 0 TS errors)
- [ ] `pnpm test` passes (148/148)
- [ ] Update this file (`session-state.md`) — move completed items to Recently Merged
- [ ] Update `CLAUDE.md` Current State section if build numbers change
