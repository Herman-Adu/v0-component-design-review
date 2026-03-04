# PHASE 8 HANDOFF - TypeScript Types + Dashboard Reorganization

## SESSION CONTEXT
- **Session**: 25 (Phase 8A-8D)
- **Branch**: v0-component-debug-phase8 (new)
- **Model**: v0-mini (TIER 1)
- **Focus**: Type safety layer + architectural reorganization (NO extraction yet)
- **Duration**: 1 session, 4 sub-phases

## STATE CHECKPOINT
```json
{
  "previous_phases": "1-7 complete",
  "pages_extracted": 14,
  "pages_remaining": 37,
  "json_mocks": 29,
  "type_safety": "ZERO - all JSON as any",
  "dashboard_org": "FLAT - needs features/ restructure",
  "rendering_strategies": "UNDECLARED",
  "build_status": "passing",
  "tokens_used": "110k/200k",
  "op_budget": "5/15"
}
```

## 29 JSON STRUCTURES TO TYPE

### Email Administration (10 JSON files)
- overview/sections.json → array of section objects
- overview/highlights.json → array of feature objects
- request-management/features.json → array of feature objects
- request-management/capabilities.json → array of capability objects
- configuration/features.json → array of config feature objects
- configuration/email-types.json → array of email type objects
- configuration/config-highlights.json → array of highlight objects
- infrastructure/features.json → array of infrastructure features
- infrastructure/system-checks.json → array of system check objects
- getting-started/journeys.json → array of journey objects with steps, icon, color

### Document Administration (5 JSON files)
- overview/sections.json → array of section objects
- overview/highlights.json → array of highlight objects
- getting-started/journeys.json → array of journey objects
- getting-started/quick-checklist.json → array of checklist items
- quality-engineering/qa-tools.json → array of QA tool objects

### Digital Marketing (8 JSON files)
- platforms/google-tools.json → array of tool objects
- platforms/google-ecosystem.json → array of ecosystem objects
- digital-marketing/getting-started/journeys.json → array of journey objects
- digital-marketing/getting-started/quick-checklist.json → array of checklist items
- digital-marketing/content-strategy/content-calendar.json → array of calendar entries
- digital-marketing/content-strategy/distribution-channels.json → array of channel objects
- digital-marketing/content-strategy/content-metrics.json → array of metric objects
- digital-marketing/content-strategy/editorial-guidelines.json → array of guideline objects

### Content Library & Documentation (6 JSON files - reference only)
- These sections already import JSON and use inline filtering
- May already have types elsewhere
- Don't need extraction, only validation

## PHASE 8A: TYPESCRIPT TYPES

### Deliverable: `/types/strapi-mock.ts`
Create unified interface file with:
- All 29 JSON structure types
- Icon type as `keyof typeof iconMap`
- Validation patterns for each structure
- Export for use in pages with `satisfies`

### Updated Pages (10 pages):
1. app/(dashboard)/dashboard/admin/email-administration/page.tsx
2. app/(dashboard)/dashboard/admin/email-administration/request-management/page.tsx
3. app/(dashboard)/dashboard/admin/email-administration/configuration/page.tsx
4. app/(dashboard)/dashboard/admin/email-administration/infrastructure/page.tsx
5. app/(dashboard)/dashboard/admin/email-administration/getting-started/page.tsx
6. app/(dashboard)/dashboard/admin/document-administration/page.tsx
7. app/(dashboard)/dashboard/admin/document-administration/getting-started/page.tsx
8. app/(dashboard)/dashboard/admin/digital-marketing/page.tsx
9. app/(dashboard)/dashboard/admin/digital-marketing/getting-started/page.tsx
10. app/(dashboard)/dashboard/admin/digital-marketing/content-strategy/page.tsx

Each page should have: `import type { ... } from "@/types/strapi-mock"`

### Success Criteria:
- `pnpm build` passes with zero errors
- `pnpm tsc --noEmit` passes (strict type checking)
- All 10 pages use `satisfies` for type validation

## PHASE 8B: DASHBOARD REORGANIZATION

### Folder Structure (PLANNED)
```
/features/dashboard/
  /admin/
    /email-administration/
    /document-administration/
    /digital-marketing/
  /content-library/
  /documentation/
```

### Implementation
1. Create `/features/dashboard/admin/` directory structure
2. Move admin feature logic (if any) into features
3. Update imports in `/app/(dashboard)/dashboard/` pages
4. Verify build passes

### Note
Pages stay in `/app/(dashboard)/dashboard/` — we're just organizing supporting code into features.

## PHASE 8C: RENDERING STRATEGY DECLARATIONS

### Add to All 113 Pages
Classify each page and add exports:

**Static (SSG):**
```ts
export const revalidate = 86400  // 24 hours
```

**Incremental (ISR):**
```ts
export const revalidate = 3600   // 1 hour
```

**Dynamic (SSR):**
```ts
export const dynamicParams = true
```

**Partial Pre-Render (Next.js 15+):**
```ts
export const experimental_ppr = true
```

### Audit Classification
- Static: All admin overviews, templates, static documentation pages (80%)
- ISR: Admin configuration pages (10%)
- SSR: Dynamic routes like documentation/[category]/[slug] (8%)
- PPR: Reserved for personalized pages (coming) (2%)

## PHASE 8D: DATA REGISTRY + VALIDATION SCRIPTS

### Deliverable 1: `/data/registry.json`
Catalog all 29 JSON mocks with metadata:
- File paths
- Icons used
- Status (extracted, pending, complete)
- Coverage % by section

### Deliverable 2: Three Scripts
1. `/scripts/validate-strapi-icons.js` — verify all icons exist in iconMap
2. `/scripts/coverage-report.js` — show extraction % by admin section
3. `/scripts/generate-schema.js` — auto-generate TypeScript from JSON

### Integration
Update `pnpm build` to run `validate-strapi-icons.js` first (fail if invalid icons).

## IMPORTANT FILES TO READ (on new branch)

**For Type Definitions:**
- `/data/strapi-mock/email-administration/getting-started/journeys.json` (sample complex)
- `/data/strapi-mock/digital-marketing/content-strategy/editorial-guidelines.json` (sample simple)
- `/lib/utils.ts` (for iconMap reference)

**For Page Structure:**
- `/app/(dashboard)/dashboard/admin/email-administration/page.tsx` (current, needs type update)
- `/app/(dashboard)/dashboard/admin/digital-marketing/page.tsx` (current, needs type update)

**For Dashboard Org:**
- `/app/(dashboard)/layout.tsx` (dashboard shell)
- `/app/(dashboard)/dashboard/admin/` (folder to reorganize)

## EFFICIENCY RULES (v0-mini session)

1. Read only the 5 sample JSON files (not all 29)
2. Grep for `import.*strapi-mock` to find pages to update
3. Use batch type generation (create interfaces once, use everywhere)
4. Don't re-read PHASE*_GENERATION_NOTES.md files
5. Parallel tool calls for multiple file reads

## TOKENS & BUDGET

```
Starting: 110k/200k (45% available)
Phase 8A estimate: 12k
Phase 8B estimate: 8k
Phase 8C estimate: 10k
Phase 8D estimate: 10k
Total estimate: 40k
Remaining after: ~50k (25% buffer for Phase 9)
OP BUDGET: 5/15 used, 10 remaining (3-4 per phase)
```

## HANDOFF COMPLETE

All context ready. Proceed with Phase 8A immediately after initialization.
