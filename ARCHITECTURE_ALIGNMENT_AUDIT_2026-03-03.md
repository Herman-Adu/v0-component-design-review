# Architecture Alignment Audit — Content-Library vs Documentation

**Date:** March 3, 2026  
**Status:** ✅ Migration Complete (Atomic Block Format)  
**Build Status:** ✅ 166/166 Pages Passing  
**Review Discipline:** Senior Architect

---

## Executive Summary

### Current State

- **Content-Library:** 4 content types (Articles, Case-Studies, Guides, Tutorials)
- **Documentation:** 4 category schemas (Strategic-Overview, CMS-Reference, App-Reference, Infrastructure-Ops)
- **Shared Block Schema:** Unified atomic format (`atom/molecule/organism`)
- **Build:** All 166 pages passing with SSG/Static prerendering

### Critical Findings

Both sections now use atomic format blocks and shared `block-schema.ts` ✅  
However, **7 architectural inconsistencies** remain that violate DRY and senior architect principles.

---

## FINDING #1: Schema Naming Inconsistency 🔴

### Problem

Inconsistent schema export naming across content types prevents pattern recognition and increases cognitive load.

| Section                            | File                           | Export Name                       | Pattern             |
| ---------------------------------- | ------------------------------ | --------------------------------- | ------------------- |
| Content-Library (Articles)         | `article-schema.ts`            | `articleContentDocumentSchema`    | camelCase           |
| Content-Library (Tutorials)        | `tutorial-schema.ts`           | `tutorialContentDocumentSchema`   | camelCase           |
| Content-Library (Case-Studies)     | `case-study-schema.ts`         | `caseStudyContentDocumentSchema`  | camelCase           |
| Content-Library (Guides)           | `guide-schema.ts`              | `guideSchema`                     | camelCase (SHORTER) |
| Documentation (Strategic-Overview) | `strategic-overview-schema.ts` | `StrategicOverviewDocumentSchema` | PascalCase          |
| Documentation (CMS-Reference)      | `cms-reference-schema.ts`      | `CmsReferenceDocumentSchema`      | PascalCase          |
| Documentation (App-Reference)      | `app-reference-schema.ts`      | `AppReferenceDocumentSchema`      | PascalCase          |
| Documentation (Infrastructure-Ops) | `infrastructure-ops-schema.ts` | `InfrastructureOpsDocumentSchema` | PascalCase          |

### Impact

- **Cognitive Friction:** Developers must remember which export name to use for each type
- **IDE Autocomplete:** Inconsistent naming reduces autocomplete effectiveness
- **Grep/Search:** Finding all schema exports requires multiple search patterns
- **Consistency Violation:** Breaks the "same way one place" principle

### Recommendation (MUST FIX)

All schema exports must follow **PascalCase** convention (matches TypeScript type naming):

```typescript
// Content-Library articles
export const ArticleContentDocumentSchema = z.object({ ... });

// Content-Library guides
export const GuideContentDocumentSchema = z.object({ ... });

// Documentation strategic-overview
export const StrategicOverviewDocumentSchema = z.object({ ... });
```

---

## FINDING #2: Meta Schema Structure Divergence 🔴

### Problem

Content-Library and Documentation use different meta field definitions:

#### Content-Library Meta (Articles, Tutorials, Case-Studies, Guides)

```typescript
meta: {
  slug: string;
  title: string;
  excerpt: string;
  level: "beginner" | "intermediate" | "advanced";    // ← Always include
  category: enum(CONTENT_CATEGORIES);                 // ← Dynamic enum
  readTime: string;                                   // ← Content-specific
  publishedAt: string;                                // ← Simple date string
  tags: string[];                                     // ← Array
  // NO: audience, lastUpdated, seo
}
```

#### Documentation Meta (All categories)

```typescript
meta: {
  slug: string;
  title: string;
  excerpt: string;
  category: z.literal("category-name");              // ← Fixed literal
  audience: string;                                   // ← Required, missing in articles
  publishedAt: string;
  lastUpdated: string;                                // ← Missing in articles
  tags: string[];
  // SEPARATE: seo object (not in meta)
}
```

### Structural Differences

| Feature                 | Content-Library | Documentation      | Reconcile?              |
| ----------------------- | --------------- | ------------------ | ----------------------- |
| `level` field           | ✅ Always       | ❌ Never           | Need canonical approach |
| `audience`              | ❌ Never        | ✅ Always          | Need unified field      |
| `readTime`              | ✅ In meta      | ❌ Calculated?     | Where should go?        |
| `lastUpdated`           | ❌ Missing      | ✅ In meta         | Should be everywhere    |
| `seo`                   | ❌ In meta      | ✅ Separate object | Inconsistent structure  |
| `publishedAt` precision | Simple string   | DateTime or regex  | Different validation    |

### Impact

- **Field Mismatch:** QueryLists must handle optional/required differently per section
- **Data Access Layer:** Repositories can't use unified interface
- **Type Safety Loss:** TypeScript can't guarantee meta shape across sections
- **View Models:** Must have 2+ patterns instead of 1

### Recommendation (MUST FIX)

Create unified `ContentMetaSchema` in shared module:

```typescript
// lib/strapi/dashboard/_shared/content-meta-schema.ts
export const ContentMetaSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.string().min(1),
  audience: z.string().optional(), // Optional for content-library
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  readTime: z.string().optional(),
  publishedAt: z.string().min(1),
  lastUpdated: z.string().optional(),
  tags: z.array(z.string().min(1)).min(1),
});
```

All schemas inherit from this base.

---

## FINDING #3: Block Validation Pattern Inconsistency 🟡

### Problem

Different content types validate blocks differently:

#### Content-Library

Articles:

```typescript
import { blockSchema } from "../../_shared/block-schema";
// Use STRICT shared schema
blocks: z.array(blockSchema).min(1),
```

Case-Studies, Guides, Tutorials:

```typescript
import {
  BLOCK_TYPE_ALIASES,
  atomicLevelSchema,
} from "../../_shared/block-schema";
// Define LOCAL blockSchema with PERMISSIVE props
const blockSchema = z.object({
  type: z.enum(BLOCK_TYPE_ALIASES),
  atomicLevel: atomicLevelSchema,
  props: z.record(z.unknown()).optional(), // ← Allows ANY props
});
```

#### Documentation

All categories:

```typescript
import { blockSchema } from "../../_shared/block-schema";
// Use STRICT shared schema
blocks: z.array(blockSchema).min(1),
```

### Questions This Raises

1. **Why do Case-Studies allow arbitrary `props`?** Is this intentionally more permissive?
2. **Why is Articles strict but Tutorials permissive?** What's the architectural reason?
3. **Is the shared `blockSchema` strict or permissive?** (Currently strict)
4. **If permissive is needed, shouldn't all use it?** Or none at all?

### Impact

- **Inconsistent Validation:** Different sections validate same data differently
- **Maintenance Risk:** Easy to introduce bugs by using wrong schema
- **Documentation Gap:** No explanation for divergence
- **Data Quality:** Some sections might accept invalid props

### Recommendation (MUST CLARIFY)

**Option A (Recommended - Strict):**
All sections use strict `blockSchema` from shared module. Props must match defined block type.

**Option B (Permissive):**
Update shared `blockSchema` to allow flexible props for ALL sections that need it.

Decision must be documented in [STRAPI_DYNAMIC_ZONES_AUTHORITY.md](STRAPI_DYNAMIC_ZONES_AUTHORITY.md) with rationale.

---

## FINDING #4: Type Export Inconsistency 🔴

### Problem

Different sections export different type combinations:

#### Content-Library (Articles)

```typescript
export type ArticleContentDocumentInput = z.infer<
  typeof articleContentDocumentSchema
>;
export const allowedBlockTypes = BLOCK_TYPE_ALIASES;
// NO individual type exports for Meta, TocItem, etc.
```

#### Content-Library (Tutorials, Case-Studies, Guides)

```typescript
export type Tutorial = z.infer<typeof tutorialContentDocumentSchema>;
export type TutorialLevel = ...
export type TutorialCategory = ...
// NO Meta, TocItem, Block type exports
```

#### Documentation (All)

```typescript
export type StrategicOverviewDocument = z.infer<
  typeof StrategicOverviewDocumentSchema
>;
export type Block = z.infer<typeof blockSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type TocItem = z.infer<typeof TocItemSchema>;
// ✅ COMPREHENSIVE
```

### Impact

- **IDE Discoverability:** Can't autocomplete types in different sections
- **Consistency:** Developers don't know what to import
- **Refactoring:** Changing shared types requires updating different files per section
- **Documentation:** "What types exist?" has different answers per section

### Recommendation (MUST FIX)

Unified export pattern for ALL schemas:

```typescript
// Pattern: $PREFIX$Document, $PREFIX$Meta, $PREFIX$TocItem, $PREFIX$Block, $PREFIX$Level, $PREFIX$Category

export type ArticleContentDocument = z.infer<
  typeof articleContentDocumentSchema
>;
export type ArticleContentMeta = z.infer<typeof MetaSchema>;
export type ArticleContentBlock = z.infer<typeof blockSchema>;
export type ArticleLevel = (typeof ARTICLE_LEVELS)[number];
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export type TutorialContentDocument = z.infer<
  typeof tutorialContentDocumentSchema
>;
export type TutorialContentMeta = z.infer<typeof MetaSchema>;
// ... etc
```

---

## FINDING #5: Repository Pattern Inconsistency 🟡

### Problem

Repositories implement different levels of functionality:

#### Content-Library Repositories

All follow same pattern with queryStart/queryComplete logging:

```typescript
export function listArticles(): Article[] { ... }
export function listArticleSlugs(): string[] { ... }
export function getArticleRecordBySlug(slug: string): ArticleRecord | null { ... }
export function getArticlesByCategory(category): Article[] { ... }
export function getArticlesByLevel(level): Article[] { ... }
```

#### Documentation Repositories

Minimal pattern:

```typescript
export function listStrategicOverview(): StrategicOverviewDocument[] { ... }
export function listStrategicOverviewSlugs(): string[] { ... }
export function getStrategicOverviewRecordBySlug(slug: string): StrategicOverviewRecord | null { ... }
// MISSING: getByAudience(), getByTag(), etc.
```

### Impact

- **Feature Parity:** Documentation doesn't support filtering by audience
- **Maintenance:** Adding feature to articles requires 4 updates (4 types), but documentation needs different work
- **Single Responsibility:** Some repos cluster too many filters vs others

### Recommendation (SHOULD STANDARDIZE)

Add consistent filtering methods to documentation repositories:

```typescript
export function listStrategicOverviewByAudience(audience: string): StrategicOverviewDocument[] { ... }
export function listStrategicOverviewByTag(tag: string): StrategicOverviewDocument[] { ... }
```

---

## FINDING #6: SEO Schema Handling Divergence 🟡

### Problem

Content-Library and Documentation handle SEO differently:

#### Content-Library

```typescript
// NOT in schema at all
// SEO metadata is NOT validated/stored per content type
// Falls back to meta.excerpt for metaDescription
```

#### Documentation

```typescript
const SeoSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  keywords: z.string().optional(),
  preventIndexing: z.boolean().optional(),
});

export const StrategicOverviewDocumentSchema = z.object({
  meta: MetaSchema,
  seo: SeoSchema.optional(), // ← Separate, explicit
  // ...
});
```

### Questions & Implications

1. **Are SEO fields validated for content-library?** No explicit schema.
2. **Where is content-library SEO stored?** Unclear—fallback chain in view models?
3. **Why does documentation have explicit optional fields?** More complete?
4. **Should both sections have SEO validation?** For consistency, yes.

### Current Workaround (Found in View Models)

```typescript
// Documentation view model
seo: {
  metaTitle: document.seo?.metaTitle ?? document.meta.title,
  metaDescription: document.seo?.metaDescription ?? document.meta.excerpt,
},
```

### Recommendation (SHOULD ALIGN)

**Option A:** Add optional `seo` object to all content types (documentation style)
**Option B:** Use only meta fields for SEO (content-library style) with explicit fallbacks documented

Document chosen approach in STRAPI_DYNAMIC_ZONES_AUTHORITY.md with fallback chain.

---

## FINDING #7: View Model Naming & Structure Mismatch 🟡

### Problem

View models have inconsistent naming and structure across sections:

#### Content-Library View Models

```typescript
// articles-view-models.ts
export interface ArticleDetailViewModel {
  id: string;
  slug: string;
  title: string;
  // ... includes 'id' field?
}

export function toArticleDetailViewModel(article: Article): ArticleDetailViewModel { ... }
```

#### Documentation View Models

```typescript
// strategic-overview-view-models.ts
export interface StrategicOverviewDetailViewModel {
  slug: string;
  title: string;
  // ... no 'id' field
  seo: { ... };  // ← Explicit SEO object
}

export function toStrategicOverviewDetailViewModel(document): ViewModelType { ... }
```

### Structure Inconsistencies

| Feature              | Content-Library      | Documentation              | Reconcile?         |
| -------------------- | -------------------- | -------------------------- | ------------------ |
| `id` field           | ✅ Yes               | ❌ No                      | Needed?            |
| SEO object           | ❌ Fallback          | ✅ Explicit                | How to normalize?  |
| List vs Detail       | Different types      | List + Detail types        | Consistent?        |
| Function naming      | `to${Type}ViewModel` | `to${Type}DetailViewModel` | Both or one?       |
| Transformation logic | Direct mapping       | Fallback chains            | Where should live? |

### Impact

- **Reusability:** Can't create generic ViewModel transformer
- **Testing:** Different test patterns per section
- **Documentation:** Value of each field undefined
- **Maintenance:** Changing ViewModel shape requires different refactoring per section

### Recommendation (NICE-TO-HAVE)

Create base ViewModel interfaces in shared module:

```typescript
// lib/strapi/dashboard/_shared/view-models.ts
export interface BaseDetailViewModel {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  blocks: Block[];
  toc?: TocItem[];
}

export interface ContentLibraryDetailViewModel extends BaseDetailViewModel {
  level: Level;
  readTime: string;
}

export interface DocumentationDetailViewModel extends BaseDetailViewModel {
  audience: string;
  lastUpdated: string;
  seo: { ... };
}
```

---

## FINDING #8: Documentation & Authority Reference 🟡

### Problem

Documentation patterns are inconsistent:

#### Content-Library Files

- **Minimal comments** in schema/builder files
- No authority references
- Assumption: patterns are "obvious"
- Example: `article-schema.ts` has 1-line header comment

#### Documentation Files

- **Comprehensive documentation** with authority references
- Example: `strategic-overview-schema.ts` has 20-line header with authority
- References STRAPI_DYNAMIC_ZONES_AUTHORITY.md
- Explains "why" alongside "what"

### Questions This Creates

1. **Should all schemas have authority references?** Yes, for senior architect discipline.
2. **Why does documentation code explain more than content-library code?** Different standards?
3. **Is there a shared authority doc?** Yes, STRAPI_DYNAMIC_ZONES_AUTHORITY.md exists.
4. **Should it reference both sections?** Yes, if patterns are unified.

### Impact

- **Onboarding:** New developers confused about "the way things work"
- **Maintenance:** Hard to understand why code is structured this way
- **Consistency:** Different sections appear unrelated
- **Authority:** No single source of truth for architecture decisions

### Recommendation (MUST FIX)

All schema files must have consistent documentation header:

```typescript
/**
 * [Type] Content Schema
 *
 * Defines the structure for [section] [type] documents.
 * Uses atomic-format blocks (atom/molecule/organism) for consistency
 * across all content types.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 * Pattern: Consolidated with all content types via shared block-schema.ts
 */
```

Update STRAPI_DYNAMIC_ZONES_AUTHORITY.md to cover BOTH sections with unified rules.

---

## DRY VIOLATIONS - Code Duplication Analysis

### Violation #1: TocItem Schema Duplication

**Files:** 8 different schema files  
**Lines:** 3-4 lines per file × 8 = ~32 lines  
**Fix:** Extract to shared module

```typescript
// lib/strapi/dashboard/_shared/content-schema-base.ts
export const TocItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9\-]+$/),
  title: z.string().min(1),
  level: z.number().int().min(1).max(6),
});
```

### Violation #2: Level & Category Constants

**Files:** 4 in content-library (separate per type)  
**Lines:** 10-15 per file  
**Issue:** Could use shared enums or constants  
**Keep Separate:** Makes sense as each has different categories

### Violation #3: Block Validation Logic

**Status:** ✅ Already consolidated in `block-schema.ts` (single source of truth)

### Violation #4: Builder Pattern (Load + Validate)

**Files:** 5 builder files (articles, tutorials, case-studies, guides, strategic-overview, etc.)  
**Status:** ⚠️ Pattern is consistent but code could be abstracted

```typescript
// Could create generic builder factory
// Current: 5 × ~80-150 lines
// Potential: 1 × 50 lines + 5 × 15 lines
```

---

## SINGLE SOURCE OF TRUTH - What's Centralized vs Distributed

### ✅ Centralized (Good)

- **Block Schema:** `lib/strapi/dashboard/_shared/block-schema.ts` (SSOT for all block types)
- **Atomic Levels:** In shared block-schema
- **Block Type Aliases:** `BLOCK_TYPE_ALIASES` array (39 types + aliases)

### ⚠️ Partially Centralized (Could Improve)

- **Meta Schema:** Each type defines own, should be base template
- **TocItem Schema:** Duplicated 8 times, should be shared
- **SEO Schema:** Only documentation has it, could be optional in shared
- **Builder Pattern:** Logic is duplicated across 5 builders

### ❌ Distributed (Single Source Violation)

- **Schema Export Naming:** 8 different patterns
- **Type Export Patterns:** 4+ different export sets per type
- **Repository Filter Methods:** Different per section
- **View Model Naming:** Inconsistent across sections
- **Documentation Standards:** No unified comment/authority pattern

---

## DRIFT GUARDS - Current State

### ✅ Existing Guards

1. **Zod Validation:** All JSON validated at build time (dataLogger integration)
2. **TypeScript Strict Mode:** Type checking catches schema drift
3. **Tests:** Test mocks validate against live schemas
4. **Build Failure:** Invalid data causes build to fail

### ❌ Missing Guards

1. **Schema Diff Detection:** No tool to compare naming across types
2. **Pattern Enforcement:** ESLint/linting doesn't catch naming inconsistencies
3. **Documentation Sync:** Authority docs not auto-checked against code
4. **Naming Convention:** No rule preventing `articleContentDocumentSchema` vs `guideSchema` mixing

### Recommendation: Add Drift Guard

```bash
# lib/scripts/validate-schema-consistency.mjs
# Should verify:
# - All schema exports use PascalCase
# - All meta schemas import from shared base
# - All TocItem schemas import from shared
# - All builder files use same pattern
```

---

## SUMMARY TABLE: Consistency Status

| Category         | Content-Library           | Documentation      | Aligned? | Priority        |
| ---------------- | ------------------------- | ------------------ | -------- | --------------- |
| Block Schema     | Shared SSOT               | Shared SSOT        | ✅       | —               |
| Meta Schema      | Varied                    | Varied             | ❌       | 🔴 MUST         |
| Schema Naming    | Inconsistent              | Inconsistent       | ❌       | 🔴 MUST         |
| Type Exports     | Incomplete                | Complete           | ⚠️       | 🔴 MUST         |
| Builders         | Consistent Pattern        | Consistent Pattern | ✅       | —               |
| Repositories     | Full Methods              | Minimal Methods    | ⚠️       | 🟡 SHOULD       |
| View Models      | No SEO handling           | Explicit SEO       | ⚠️       | 🟡 SHOULD       |
| Documentation    | Minimal                   | Comprehensive      | ⚠️       | 🟡 SHOULD       |
| Block Validation | Mixed (Strict/Permissive) | Strict             | ❌       | 🟡 MUST CLARIFY |

---

## IMPLEMENTATION ROADMAP

### Phase 1: CRITICAL FIX (2-3 hours)

- [ ] **Fix #1:** Rename all schema exports to PascalCase
- [ ] **Fix #2:** Create unified `ContentMetaSchema` in shared module
- [ ] **Fix #3:** Update all schemas to import meta base schema
- [ ] **Fix #4:** Standardize all type exports using template pattern
- [ ] **Fix #5:** Clarify block validation approach (strict vs permissive)

### Phase 2: DOCUMENTATION (1 hour)

- [ ] Add consistent documentation headers to all schemas
- [ ] Update STRAPI_DYNAMIC_ZONES_AUTHORITY.md with unified rules
- [ ] Document SEO handling strategy
- [ ] Document block validation strategy

### Phase 3: NICE-TO-HAVE (2-3 hours)

- [ ] Standardize repository filter methods
- [ ] Extract TocItem schema to shared module
- [ ] Create base ViewModel interfaces
- [ ] Consider builder pattern abstraction
- [ ] Add drift guard validation script

---

## VERIFICATION CHECKLIST

After implementing fixes, verify:

- [ ] All schema files export with consistent naming (PascalCase)
- [ ] All schemas import meta base from shared module
- [ ] TocItem imported from shared, not duplicated
- [ ] All sections export same type set (Document, Meta, Block, Level, Category)
- [ ] STRAPI_DYNAMIC_ZONES_AUTHORITY.md documents all decisions
- [ ] npm run build passes with all 166 pages
- [ ] TypeScript `npx tsc --noEmit` shows ZERO errors
- [ ] No grep finds duplicate TocItem schema definitions
- [ ] Each schema file has authority reference comment
- [ ] Block validation approach documented and consistent

---

## CONCLUSION

The migration to atomic block format ✅ and SSG prerendering ✅ was successful. However, **schema-level architectural inconsistencies** remain that should be addressed to achieve **"pure consistency across documentation and content library"** as stated in the original goal.

**Key Takeaways:**

1. Block schema is properly unified (SSOT) ✅
2. Meta schema needs unification (base template) 🔴
3. Schema naming needs standardization (PascalCase) 🔴
4. Type exports need template (Document, Meta, Block, Level, Category) 🔴
5. Documentation must match code precision (authority references) 🟡

**Estimated Effort for Phase 1 (Critical):** 2-3 hours  
**Business Impact:** High (developer productivity, maintainability, onboarding)  
**Technical Risk:** Low (changes are localized, build validates everything)

---

**Prepared by:** Architecture Review System  
**Date:** March 3, 2026  
**Next Review:** After Phase 1 implementation
