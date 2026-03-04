# Case-Studies Section Refactor - Specific Implementation Notes

## Overview

Refactor case-studies section to match tutorials pattern. Currently imports from legacy sources (verify in case-studies.ts).

## Files to Create

### 1. lib/strapi/dashboard/content-library/case-studies/case-study-content-builder.ts (NEW)

**Purpose:** Central builder that validates all case-study JSON files and generates typed list

**Structure:**

```typescript
import "server-only";
import { caseStudyContentDocumentSchema } from "./case-study-schema";

// Import all case-study JSON files (see list below)
import clientToServerArticle from "@/data/strapi-mock/dashboard/content-library/case-studies/performance/client-to-server-components.json";
// ... 15 more imports

// Type exports
export type CaseStudyLevel = "beginner" | "intermediate" | "advanced";
export type CaseStudyCategory = "refactoring" | "performance" | "security" | "architecture" | "forms" | "cms" | "business" | "rendering" | "infrastructure";
export type CaseStudyBlockType = /* existing type */;
export type CaseStudyBlockLevel = "atom" | "molecule" | "organism";
export interface CaseStudyContentBlock { /* existing interface */ }
export interface CaseStudyContentMeta { /* from meta object */ }
export interface CaseStudyContentDocument { /* existing interface */ }
export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: CaseStudyLevel;
  category: CaseStudyCategory;
  publishedAt: string;
  tags: string[];
  // All fields needed for list display
}

// Registry
const caseStudyContentRegistry: Record<string, CaseStudyContentDocument> = {
  "client-to-server-components": clientToServerArticle as CaseStudyContentDocument,
  "form-validation-refactor": formValidationArticle as CaseStudyContentDocument,
  // ... 14 more entries
};

// Validation at startup
const validatedCaseStudyContentRegistry = Object.fromEntries(
  Object.entries(caseStudyContentRegistry).map(([slug, document]) => {
    const result = caseStudyContentDocumentSchema.safeParse(document);
    if (!result.success) {
      const issues = result.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join(" | ");
      throw new Error(`Invalid case study content for "${slug}": ${issues}`);
    }
    return [slug, result.data as CaseStudyContentDocument];
  }),
) as Record<string, CaseStudyContentDocument>;

// List generation
function generateCaseStudyList(): CaseStudy[] {
  return Object.entries(validatedCaseStudyContentRegistry)
    .map(([slug, document], index) => ({
      id: String(index + 1),
      slug: document.meta.slug,
      title: document.meta.title,
      excerpt: document.meta.excerpt,
      level: document.meta.level,
      category: document.meta.category,
      publishedAt: document.meta.publishedAt,
      tags: document.meta.tags,
    }))
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Caching
let cachedCaseStudyList: CaseStudy[] | null = null;

export function getCaseStudyList(): CaseStudy[] {
  if (!cachedCaseStudyList) {
    cachedCaseStudyList = generateCaseStudyList();
  }
  return cachedCaseStudyList;
}

export function getCaseStudyContentDocument(slug: string): CaseStudyContentDocument | null {
  return validatedCaseStudyContentRegistry[slug] ?? null;
}

export function getAllCaseStudyContentSlugs(): string[] {
  return Object.keys(validatedCaseStudyContentRegistry);
}
```

**JSON Files to Import (16 total):**

```typescript
// performance/ (1 file)
import clientToServerArticle from "@/data/strapi-mock/dashboard/content-library/case-studies/performance/client-to-server-components.json";

// security/ (3 files)
import formValidationArticle from "@/data/strapi-mock/dashboard/content-library/case-studies/security/form-validation-refactor.json";
import securityLayerCaseStudy from "@/data/strapi-mock/dashboard/content-library/case-studies/security/security-layer-implementation.json";
import rateLimitingBypass from "@/data/strapi-mock/dashboard/content-library/case-studies/security/rate-limiting-bypass-to-production.json";

// architecture/ (4 files)
import stateManagementArticle from "@/data/strapi-mock/dashboard/content-library/case-studies/architecture/state-management-evolution.json";
import emailConsolidationCaseStudy from "@/data/strapi-mock/dashboard/content-library/case-studies/architecture/email-system-consolidation.json";
import hydrationGuardPattern from "@/data/strapi-mock/dashboard/content-library/case-studies/architecture/hydration-guard-pattern.json";
import documentationEvolution from "@/data/strapi-mock/dashboard/content-library/case-studies/architecture/documentation-evolution.json";

// forms/ (1 file)
import multiStepFormCaseStudy from "@/data/strapi-mock/dashboard/content-library/case-studies/forms/multi-step-form-prototype-to-production.json";

// rendering/ (1 file)
import edgeCacheRolloutCaseStudy from "@/data/strapi-mock/dashboard/content-library/case-studies/rendering/choosing-rendering-strategy-per-page.json";

// business/ (3 files)
import enterpriseCmsMigration from "@/data/strapi-mock/dashboard/content-library/case-studies/business/enterprise-cms-migration.json";
import costReductionArchitecture from "@/data/strapi-mock/dashboard/content-library/case-studies/business/cost-reduction-architecture.json";
import developerProductivity from "@/data/strapi-mock/dashboard/content-library/case-studies/business/developer-productivity-gains.json";

// cms/ (1 file)
import strapiMultiSite from "@/data/strapi-mock/dashboard/content-library/case-studies/cms/strapi-multi-site-architecture.json";

// refactoring/ (1 file)
import sidebarRefactor from "@/data/strapi-mock/dashboard/content-library/case-studies/refactoring/sidebar-refactor-430-lines-to-data-driven.json";

// infrastructure/ (1 file)
import tarballDuplicate from "@/data/strapi-mock/dashboard/content-library/case-studies/infrastructure/tarball-duplicate-entry-build-failure.json";
```

---

## Files to Modify

### 2. lib/strapi/dashboard/content-library/case-studies/case-study-content.ts

**Change From:** ~147 lines with JSON imports and registry
**Change To:** 20-30 lines of re-exports

```typescript
import "server-only";

// Re-export everything from the content builder
export {
  getCaseStudyList,
  getCaseStudyContentDocument,
  getAllCaseStudyContentSlugs,
  type CaseStudyLevel,
  type CaseStudyCategory,
  type CaseStudy,
  type CaseStudyContentMeta,
  type CaseStudyContentDocument,
  type CaseStudyContentBlock,
  type CaseStudyBlockType,
  type CaseStudyBlockLevel,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content-builder";

export type TOCItem = /* define or re-export from existing location */;
```

**What to Remove:**

- All JSON imports (16 lines)
- caseStudyContentRegistry
- validatedCaseStudyContentRegistry
- Type definitions that move to builder
- getCaseStudyContentDocument() function

---

### 3. lib/strapi/dashboard/content-library/case-studies/case-studies.ts

**Current Import Source:** Need to verify - likely from case-study-content.ts OR legacy data

**Change To:**

```typescript
import "server-only";

import {
  getCaseStudyList,
  type CaseStudy,
  type CaseStudyCategory,
  type CaseStudyLevel,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content";

export type { CaseStudy, CaseStudyCategory, CaseStudyLevel };

export function getAllCaseStudies(): CaseStudy[] {
  return getCaseStudyList();
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return getCaseStudyList().find((study) => study.slug === slug);
}

export function getCaseStudiesByLevel(level: CaseStudyLevel): CaseStudy[] {
  return getCaseStudyList().filter((study) => study.level === level);
}

export function getCaseStudiesByCategory(
  category: CaseStudyCategory,
): CaseStudy[] {
  return getCaseStudyList().filter((study) => study.category === category);
}

export function getAllCaseStudySlugs(): string[] {
  return getCaseStudyList().map((study) => study.slug);
}
```

---

### 4. lib/strapi/dashboard/content-library/case-studies/case-study-repository.ts

**Verify Current State:**

- Check if imports from case-study-content.ts or legacy source
- Update if needed to use getCaseStudyList()

**Pattern:**

```typescript
import "server-only";

import {
  getCaseStudyList,
  getCaseStudyContentDocument,
  type CaseStudy,
  type CaseStudyContentDocument,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content";

export interface CaseStudyRecord {
  study: CaseStudy;
  content: CaseStudyContentDocument;
}

export function listCaseStudies(): CaseStudy[] {
  return getCaseStudyList();
}

export function listCaseStudySlugs(): string[] {
  return getCaseStudyList().map((study) => study.slug);
}

export function getCaseStudyRecordBySlug(slug: string): CaseStudyRecord | null {
  const study = getCaseStudyList().find((item) => item.slug === slug);
  if (!study) {
    return null;
  }

  const content = getCaseStudyContentDocument(slug);
  if (!content) {
    return null;
  }

  return { study, content };
}
```

---

### 5. lib/strapi/dashboard/content-library/case-studies/case-study-view-models.ts

**Verify:**

- Check import source
- Update to import from case-study-content if needed
- Transformation logic should remain unchanged

---

### 6. lib/strapi/dashboard/content-library/case-studies/case-study-schema.ts

**Status:** Keep as-is ✓

No changes needed - contains `caseStudyContentDocumentSchema`

---

## UI Layer Changes

### 7. app/(dashboard)/dashboard/content-library/case-studies/page.tsx

**Current State:** Likely existing component (check if it's async)

**Change To:**

```typescript
import { getAllCaseStudies } from "@/lib/strapi/dashboard/content-library/case-studies/case-studies";
import CaseStudiesPageClient from "./case-studies-client";

export default async function CaseStudiesPage() {
  const caseStudies = getAllCaseStudies();
  return <CaseStudiesPageClient caseStudies={caseStudies} />;
}
```

---

### 8. app/(dashboard)/dashboard/content-library/case-studies/case-studies-client.tsx (NEW)

**Create New File:**

```typescript
"use client";

import type { CaseStudy } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content";

interface Props {
  caseStudies: CaseStudy[];
}

export default function CaseStudiesPageClient({ caseStudies }: Props) {
  // Move all existing client-side logic from case-studies/page.tsx here
  // Handle state, effects, interactions
  // Return JSX
}
```

---

## Implementation Steps

1. **Create case-study-content-builder.ts**
   - Copy tutorials pattern
   - Add all 16 JSON imports
   - Create registry with all entries
   - Add validation
   - Export 3 functions and all types
   - **Test:** `npm run build` succeeds

2. **Update case-study-content.ts**
   - Remove JSON imports
   - Remove registry
   - Remove getCaseStudyContentDocument()
   - Add re-exports from builder
   - **Test:** Type check passes

3. **Update case-studies.ts**
   - Verify/change import source
   - Update getAllCaseStudies() to call getCaseStudyList()
   - **Test:** Functions work

4. **Verify case-study-repository.ts**
   - Confirm imports from case-study-content
   - **Test:** listCaseStudies() works

5. **Verify case-study-view-models.ts**
   - Run type check

6. **Create case-studies-client.tsx**
   - Extract UI logic from current page.tsx
   - Add 'use client'

7. **Update case-studies/page.tsx**
   - Make async
   - Import getAllCaseStudies
   - Render case-studies-client.tsx
   - **Test:** Page renders, data displays

8. **Validation**
   - Type check all files
   - Build project
   - Verify case-studies work

---

## Key Points for Case-Studies

- **16 JSON files** organized in 9 subdirectories
- **9 categories** (fewer than articles) - all in schema
- **Block structure** similar to articles - preserve exactly
- **May not need layout/TOC** - verify if CaseStudyContentDocument includes these
- **Sorting** - by publishedAt descending
- **Same pattern as articles** - consistency
