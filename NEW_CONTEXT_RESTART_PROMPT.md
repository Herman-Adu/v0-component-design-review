# New Context Restart Prompt

## Paste This Into a New Chat

You are continuing work in `c:\Users\herma\source\repository\v0-component-design-review`.

Current branch: `feature/import-refactor-2026-03-02`  
Checkpoint commit: `5b42e2c`

Primary objective:

1. Keep documentation migration to dynamic route architecture stable (`/dashboard/documentation/[category]/[slug]`).
2. Continue from the current checkpoint where build is clean.
3. Implement the remaining integration tests for documentation repositories:
   - `cms-reference`
   - `app-reference`
   - `infrastructure-ops`

Rules for this continuation:

- Do not revert unrelated in-progress changes.
- Keep implementation aligned with existing strategic-overview repository test style.
- Prefer minimal, surgical edits.
- Run focused tests first, then broader validation.

Immediate first actions:

1. Confirm git status and current HEAD.
2. Run targeted integration tests in `__tests__/integration-test/documentation`.
3. Add missing 3 repository integration suites and mock data files if absent.
4. Re-run tests and `pnpm build`.

## Current Status Snapshot

- Dynamic documentation route exists: `app/(dashboard)/dashboard/documentation/[category]/[slug]/page.tsx`
- Documentation route manifest wired for 4 categories: strategic-overview, cms-reference, app-reference, infrastructure-ops.
- Repository/schema/builder/view-model stacks exist under:
  - `lib/strapi/dashboard/documentation/strategic-overview/`
  - `lib/strapi/dashboard/documentation/cms-reference/`
  - `lib/strapi/dashboard/documentation/app-reference/`
  - `lib/strapi/dashboard/documentation/infrastructure-ops/`
- Build verification: `pnpm build` passes in current state.

## Critical Files To Open First

- Dynamic route page:
  - `app/(dashboard)/dashboard/documentation/[category]/[slug]/page.tsx`
- Manifest:
  - `lib/strapi/dashboard/documentation/documentation-route-manifest.ts`
- Existing repository integration test reference:
  - `__tests__/integration-test/documentation/strategic-overview-repository.test.ts`
- Existing mock reference:
  - `__tests__/mocks/integration/documentation/strategic-overview-data.ts`
- Category repositories to mirror in tests:
  - `lib/strapi/dashboard/documentation/cms-reference/cms-reference-repository.ts`
  - `lib/strapi/dashboard/documentation/app-reference/app-reference-repository.ts`
  - `lib/strapi/dashboard/documentation/infrastructure-ops/infrastructure-ops-repository.ts`

## Validation Commands

- Build:
  - `pnpm build`
- Targeted tests (adjust file list as needed):
  - `pnpm vitest __tests__/integration-test/documentation`

## Handoff Note

This checkpoint is intended for safe context-window reset and rapid continuation. If anything appears inconsistent, trust current filesystem state + latest commit history on branch over older narrative logs.
