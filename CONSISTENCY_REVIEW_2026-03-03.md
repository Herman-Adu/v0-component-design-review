# Schema Consolidation & Consistency Review - March 3, 2026

## Executive Summary

**Status:** ⚠️ PARTIALLY COMPLETE - Content-Library Consolidated, Documentation Pending Consolidation

Successfully consolidated block schema definitions across content-library content types (articles, case-studies, guides, tutorials) to eliminate drift and establish single source of truth. Documentation section (4 category schemas) still maintains independent block definitions and requires alignment.

## Critical Finding: Documentation vs Content-Library Drift

**Alignment Gap Identified:**

- ✅ **Content-Library** (4 types): All importing from shared `/lib/strapi/dashboard/_shared/block-schema.ts`
- ❌ **Documentation** (4 categories): Each maintains independent ~300-line block schema definitions
- **Result:** Dual block type systems, inconsistent prop validation, maintenance burden

Both sections claim to use "ATOMIC BLOCK FORMAT" but:

- Content-library: Uses consistent `molecule.infoBox`, `atom.paragraph`, `organism.metricsGrid` format
- Documentation: Uses mixed format with different variant enums (info|warning|important vs info|warning|tip|danger|important)

## Problem Statement

**Schema Drift Across Content Types**

- Five content types (articles, case-studies, guides, tutorials, documentation) each maintained independent block definitions
- Validation rigor varied wildly:
  - **Articles**: Strict discriminated unions with exhaustive prop validation
  - **Case-Studies**: Permissive `z.string()` type + `z.record(z.unknown())` props
  - **Guides**: Originally permissive string type, later aligned to explicit enum
  - **Tutorials**: Most permissive with no type validation
- Resulted in data quality inconsistency and maintenance burden

## Solution: Shared Block Schema Module

### Created `/lib/strapi/dashboard/_shared/block-schema.ts` (540 lines)

**Single Source of Truth Exports:**

- `BLOCK_TYPE_ALIASES` - Canonical list of 39 allowed block type identifiers:
  - Atomic notation: `atom.paragraph`, `molecule.infoBox`, `organism.metricsGrid`, etc.
  - Kebab-case aliases: `paragraph`, `info-box`, `metrics-grid`, etc.
  - Compound types: `organism.beforeAfterComparison`, `before-after-comparison`

- `atomicLevelSchema` - Shared enum: `"atom" | "molecule" | "organism"`

- `blockSchema` - Discriminated union of 20 block types with full prop validation:
  - Includes all 19 prop schemas with `superRefine` constraints
  - Maintains backward compatibility with legacy block names
  - Enforces strong type contracts at runtime

- `Block` TypeScript type - Exported for type-safe block handling

### Consolidation Pattern

**Articles** (Strict Validation)

- Imports: `blockSchema` from shared module
- Behavior: Uses discriminated union with exact prop requirements
- Data Quality: ✅ High (enforces all block prop contracts)

**Case-Studies** (Permissive Validation)

- Imports: `BLOCK_TYPE_ALIASES` + `atomicLevelSchema` from shared
- Defines: Local `blockSchema` with permissive prop validation
- Behavior: `z.object({ type: z.enum(BLOCK_TYPE_ALIASES), atomicLevel: atomicLevelSchema, props: z.record(z.unknown()).optional() })`
- Data Quality: 🟡 Medium (enforces type enum + atomic level, allows flexible props)

**Guides** (Permissive Validation)

- Imports: `BLOCK_TYPE_ALIASES` + `atomicLevelSchema` from shared
- Defines: Local `blockSchema` with permissive prop validation
- Behavior: Same pattern as case-studies
- Data Quality: 🟡 Medium (enforces type enum + atomic level, allows flexible props)

**Tutorials** (Permissive Validation)

- Imports: `BLOCK_TYPE_ALIASES` + `atomicLevelSchema` from shared
- Defines: Local `blockSchema` with permissive prop validation
- Behavior: Same pattern as case-studies (required props, not optional)
- Data Quality: 🟡 Medium (enforces type enum + atomic level, allows flexible props)

## Deep Review: Documentation & Content-Library Schema Alignment

### Issue Discovered During Consistency Review

**Two Different Block Type Systems Exist:**

**Content-Library (✅ Now Aligned)**

- Uses atomic block format: `atom.paragraph`, `molecule.infoBox`, `organism.metricsGrid`
- All 4 content types import from single shared module
- Includes `atomicLevel` property on every block
- Full-featured block schema with detailed prop validation

**Documentation (❌ Not Yet Aligned)**

- Uses simpler `block.*` format: `block.paragraph`, `block.sectionHeader`, `block.infoBox`
- Each of 4 category schemas maintains ~300-line duplicate block definitions
- NO `atomicLevel` property on blocks
- Smaller subset of block types, coarser-grained structure

### Technical Drift Details

| Comparison              | Content-Library                                           | Documentation                      |
| ----------------------- | --------------------------------------------------------- | ---------------------------------- |
| **Format**              | `atom.paragraph`, `molecule.infoBox`                      | `block.paragraph`, `block.infoBox` |
| **Atomic Levels**       | ✅ atom \| molecule \| organism                           | ❌ No atomicLevel field            |
| **Block Schema Module** | ✅ Shared `/lib/strapi/dashboard/_shared/block-schema.ts` | ❌ 4 separate duplicate files      |
| **InfoBox Variants**    | info, warning, **tip**, important, **danger**             | info, warning, important (subset)  |
| **Lines of Code**       | ~540 lines (shared)                                       | ~1,200 lines (4 × ~300)            |

### Impact

- Rendering system (`content-block-renderer.tsx`) must handle both formats
- Adding new block types requires updates in 5+ places (shared + docs)
- Data migration between documentation and content-library requires format conversion
- Future tooling cannot assume unified block contract

## Implementation Details

### Block Type Aliases Standardization

All content types now share unified type enum that includes:

- **Atomic Types**: `atom.paragraph`, `paragraph`
- **Molecule Types**: `molecule.infoBox`, `info-box`, `molecule.sectionHeader`, `section-header`, etc. (9 types)
- **Organism Types**: `organism.metricsGrid`, `metrics-grid`, `organism.architectureDiagram`, `architecture-diagram`, etc. (8 types)
- **Compound Types**: `organism.beforeAfterComparison`, `before-after-comparison`, `numbered-list` (3 types)

### Build Verification

✅ **All 166 Pages Pass**

```
✓ Collected page data in 1994.9ms
✓ Generated static pages in 1707.1ms
- Articles: 30 pages
- Case-Studies: 20 pages
- Guides: 3 pages
- Tutorials: 15 pages
- Documentation: 29 pages
- Other routes: 69 pages
```

## Key Design Decisions

### 1. Hybrid Validation Approach

**Why not make all content types use strict blockSchema?**

- Case-studies, guides, tutorials have custom block prop structures that don't fit article schema
- Attempting strict import caused validation failures (e.g., `featureGrid` with `title` prop not in schema)
- Solution: Share type enforcement (aliases + atomic level) while allowing prop flexibility

### 2. Shared Type Enforcement

**Why enforce type enum for all content types?**

- Prevents typos and invalid block types across codebase
- Enables unified type system for rendering and tooling
- Supports future schema hardening without data migration
- `BLOCK_TYPE_ALIASES` serves as contract between content and renderer

### 3. Atomic Level Consistency

**Why require atomicLevel on all blocks?**

- Enables semantic understanding of component hierarchy
- Supports future component library integration
- Maintains consistent naming convention across all content
- Used by `content-block-renderer.tsx` for conditional rendering

## Files Modified

**Created:**

- `/lib/strapi/dashboard/_shared/block-schema.ts` (540 lines)
  - Contains: BLOCK_TYPE_ALIASES, atomicLevelSchema, blockSchema, Block type
  - Imports: zod only
  - Authority: Single source of truth

**Updated:**

- `/lib/strapi/dashboard/content-library/articles/article-schema.ts`
  - Before: 547 lines (inline definitions)
  - After: 46 lines (imports blockSchema from shared)
  - Reduction: ~91% reduction via consolidation
- `/lib/strapi/dashboard/content-library/case-studies/case-study-schema.ts`
  - Before: Imported blockSchema (permissive)
  - After: Imports BLOCK_TYPE_ALIASES + atomicLevelSchema, defines local permissive blockSchema
- `/lib/strapi/dashboard/content-library/guides/guide-schema.ts`
  - Before: Imported blockSchema (permissive)
  - After: Imports BLOCK_TYPE_ALIASES + atomicLevelSchema, defines local permissive blockSchema
- `/lib/strapi/dashboard/content-library/tutorials/tutorial-schema.ts`
  - Before: Imported blockSchema (permissive)
  - After: Imports BLOCK_TYPE_ALIASES + atomicLevelSchema, defines local permissive blockSchema

## Data Quality Results

**BLOCK_TYPE_ALIASES Coverage** ✅

- All 39 canonical/alias type names exported from single module
- Used by articles, case-studies, guides, tutorials for type validation
- Prevents invalid block types across all content

**Atomic Level Consistency** ✅

- `atomicLevelSchema` shared across all content types
- Guarantees `"atom" | "molecule" | "organism"` enforcement
- No content type allows invalid atomic levels

**Schema Maintainability** ✅

- Single source of truth eliminates duplicate definitions
- Future block type additions require single update to BLOCK_TYPE_ALIASES
- Prop schema updates centralized to `/lib/strapi/dashboard/_shared/block-schema.ts`
- Reduces risk of drift through manual maintenance

## Validation Gates Met

- [x] BLOCK_TYPE_ALIASES exported from shared module
- [x] atomicLevelSchema exported from shared module
- [x] Articles import strict blockSchema from shared
- [x] Case-studies use shared type enum + permissive props
- [x] Guides use shared type enum + permissive props
- [x] Tutorials use shared type enum + permissive props
- [x] Build passes with 166 pages
- [x] No TypeScript errors
- [x] No Zod validation regressions

## Recommendations for Complete Alignment

### OPTION A: Minimal (Content-Library Focus)

**Keep documentation using `block.*` format, expand shared module support**

- ✅ Pros: Least disruptive, documentation unchanged
- ❌ Cons: Maintains dual system, harder to consolidate

### OPTION B: Comprehensive (Full Unification)

**Migrate documentation to atomic format, consolidate to shared module**

**Steps:**

1. Add `atomicLevel` field to documentation block data files (needs migration)
2. Update `block.paragraph` → `atom.paragraph`, etc. in data files
3. Update 4 documentation schema files to import from `_shared/block-schema.ts`
4. Remove ~600 lines of duplicate block definitions from documentation schemas
5. Update `content-block-renderer.tsx` to standardize handling

**Code Reduction:** ~600 lines of duplicate schemas
**Consistency:** Single block type system globally
**Maintenance:** Single point of truth for all 8 content types (articles, case-studies, guides, tutorials, strategic-overview, infrastructure-ops, cms-reference, app-reference)

- ✅ Pros: Complete consistency, reduced maintenance
- ⚠️ Cons: Requires data migration in 29 documentation files

## Session Summary

**Started:** Consistency review to validate documentation migration completion and schema alignment  
**Discovered:**

- ✅ Content-library fully aligned (articles, case-studies, guides, tutorials)
- ❌ Documentation using separate `block.*` format without atomicLevel
- ❌ ~1,200 lines of duplicate block definitions across 4 documentation schemas

**Resolved:**

- ✅ Content-library consolidated to single `/lib/strapi/dashboard/_shared/block-schema.ts` module
- ⚠️ Documentation drift identified but not yet consolidated (requires format decision first)

## Session Summary

**Started:** Consistency review to validate documentation migration completion  
**Discovered:** Schema drift across two major sections (content-library & documentation) with different block type systems  
**Resolved:** Consolidated content-library (articles, case-studies, guides, tutorials) to single shared block-schema module  
**Remaining:** Documentation section (4 category schemas) still requires alignment to use shared types

## Alignment Recommendations

### Priority 1: Consolidate Documentation Category Schemas

Update these 4 files to import from shared block-schema module:

- `/lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-schema.ts`
- `/lib/strapi/dashboard/documentation/infrastructure-ops/infrastructure-ops-schema.ts`
- `/lib/strapi/dashboard/documentation/cms-reference/cms-reference-schema.ts`
- `/lib/strapi/dashboard/documentation/app-reference/app-reference-schema.ts`

**Action:**
Replace inline block definitions with import `{ BLOCK_TYPE_ALIASES, atomicLevelSchema }` from shared module

### Priority 2: Standardize Block Type Formats (Documentation & Content-Library)

Documentation currently uses different type format:

- Documentation: `block.paragraph`, `block.sectionHeader`
- Content-Library: `atom.paragraph`, `molecule.sectionHeader`

**Decision Required:**

- Option A: Migrate documentation data to content-library atomic format
- Option B: Add legacy documentation format to BLOCK_TYPE_ALIASES and support both

Recommend: Option A (single format globally)

### Priority 3: InfoBox Variant Standardization

Unify infoBox variant enums:

- Current Content-Library: `"info" | "warning" | "tip" | "important" | "danger"`
- Current Documentation: `"info" | "warning" | "important"`

**Decision:** Adopt content-library set as standard (includes all documentation variants)
