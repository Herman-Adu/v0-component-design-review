# Morning Context Prompt - March 3, 2026

## Session Objective

Review **documentation** and **content-library** sections for consistency and standards alignment, then finalize **guides section** refactor direction based on validated patterns.

---

## Current State Summary

### ✅ COMPLETED: Two Sections Refactored

**Documentation (29 files)** + **Content-Library (71 files)**

- All migrated to atomic format (molecule._, atom._, organism.\*)
- Unified renderer: `content-block-renderer.tsx` handles both sections
- 25 major atomic components available
- Build: **166 pages rendering successfully**

### ✅ TODAY'S TASK: Consistency Review Completed

**Validated:**

1. Shared renderer and atomic format are working across Doc + Content-Library
2. Data format quality is clean (no legacy `block.*` in docs/articles/guides)
3. Schema drift points identified and documented below
4. Gold standard for guides established as a phased hardening + enrichment plan

### 🔵 NEXT SECTION: Guides (Partially Modernized)

- **Status:** Atomic type names are present, but schema is still permissive (`type: z.string()`, `props: z.record(z.unknown())`)
- **Action:** Harden guides schema to shared atomic contract, then enrich guide content blocks
- **Decision:** Use phased rollout (schema hardening first, enrichment second)

---

## Key Files to Review This Morning

**Documentation:**

- [strategic-overview-schema.ts](lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-schema.ts)
- [app-overview.json](data/strapi-mock/dashboard/documentation/strategic-overview/app-overview.json) - Example enriched file
- [system-vision.json](data/strapi-mock/dashboard/documentation/strategic-overview/system-vision.json) - Example enriched file

**Content-Library:**

- [article-schema.ts](lib/strapi/content-library/articles/article-schema.ts)
- [1-featured.json](data/strapi-mock/content-library/articles/featured/1-featured.json) - Example

**Unified Renderer:**

- [content-block-renderer.tsx](components/organisms/content-block-renderer.tsx) - 698 lines, handles ALL blocks

---

## Consistency Checklist

### Block Types Coverage

- [x] Documentation has modern atomic block coverage required for current docs
- [ ] Props structure matches across schemas _(drift found: article schema allows legacy aliases + broader props)_
- [ ] Enum values (variants, etc.) are consistent _(drift found: docs use `info|warning|important`; article allows `tip|danger` too)_
- [ ] Guard functions work identically _(drift found: article has stronger prop refinement; docs/guides less strict)_

### Component Usage

- [ ] Rich components (grids, tables, flows) used similarly _(drift found: docs and guides currently use fewer organism patterns than articles)_
- [ ] Callout/infoBox variants mapped consistently _(schema drift remains)_
- [x] statsTable row format matches where used (`string[][]`)
- [x] featureGrid columns match where used

### Data Quality

- [x] No lingering old `block.*` formats
- [x] All `atomicLevel` properties present (docs)
- [x] No invalid enum values in documentation data

---

## Consistency Findings (March 3, 2026)

### Build + Validation

- ✅ `npm run build` passes
- ✅ `validate:content-links` passes
- ✅ 166 static pages generated

### What Is Consistent

- Unified renderer is active for both sections
- Documentation schemas share the same strict atomic pattern
- Documentation data quality is clean after migration

### Drift That Still Exists

1. **Schema strictness drift:**
   - Documentation schemas use explicit discriminated unions with typed props
   - `article-schema.ts` still supports legacy aliases (`paragraph`, `info-box`, etc.) and broader compatibility props
2. **Variant drift:**
   - Documentation `infoBox` variants: `info | warning | important`
   - Article schema variants: `info | warning | tip | important | danger`
3. **Guides schema drift:**
   - Guides content uses atomic block names
   - `guide-schema.ts` is permissive and not aligned with strict article/documentation contracts

---

## Guides Section - Key Context

**Current state:** Partially modernized data, not contract-hardened  
**Size:** 3 guide documents + guides list JSON  
**Decision points:**

1. Full hardening now vs phased rollout?
2. Enrich guides with rich organism components like Doc/Content-Library?
3. Shared schema extraction approach?
4. Timeline/batch strategy?

### Recommended Direction (Gold Standard)

1. **Phase 1: Schema hardening (high priority)**
   - Replace permissive `guide-schema.ts` block contract with shared discriminated union used by docs/articles
   - Standardize variants and prop requirements
2. **Phase 2: Data normalization**
   - Ensure guides use canonical atomic names only
   - Normalize optional prop names to shared conventions
3. **Phase 3: Enrichment**
   - Add high-value organisms to guides (`featureGrid`, `statsTable`, `processFlow`, `keyTakeaway`) where content benefits
4. **Phase 4: Lock and validate**
   - Build + content validation
   - Add regression audit script for schema drift

---

## Execution Plan (Next Working Block)

### Phase 1: Schema Alignment (60-90 min)

1. Extract shared atomic block schema to reusable module
2. Update `guide-schema.ts` to use shared schema
3. Decide target variant enum strategy (`strict docs` vs `article-compatible`)

### Phase 2: Guides Data Pass (30-60 min)

1. Normalize guide block props to shared structure
2. Spot enrich at least one guide as reference pattern

### Phase 3: Validation + Lock (30 min)

1. Run build + validation scripts
2. Spot-check guide routes
3. Document final standard in handoff

### Phase 4: Full Guides Rollout Plan (30 min)

1. Apply same pattern to remaining guides/categories
2. Batch migration plan with checkpoints

---

## Quick Reference: Component Categories Available

**Atoms (5):**

- paragraph, heading variants

**Molecules (6):**

- sectionHeader, subSectionHeader, infoBox, codeBlock, keyTakeaway

**Organisms (13):**

- featureGrid, metricsGrid, statsTable, verticalFlow, stepFlow, processFlow
- architectureDiagram, dataFlowDiagram
- beforeAfterComparison, comparisonCards, fileTree, decisionTree
- relatedArticles

---

## Success Criteria

✅ **Completed Today:**

- Both sections reviewed
- Gaps documented with concrete drift points
- No blocking build/runtime issues found

✅ **Ready for guides implementation:**

- Clear phased approach selected
- Implementation plan documented
- Confidence in reusing renderer and atomic components is high

---

**Next action:** Implement Phase 1 schema alignment for guides, then run full validation.
