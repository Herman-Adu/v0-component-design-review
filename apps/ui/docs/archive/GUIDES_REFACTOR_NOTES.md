# Guides Section Refactor - Specific Implementation Notes

## Overview

Refactor guides section to match tutorials pattern. Guides have a much simpler structure (currently only 3 guides).

## Files to Create

### 1. lib/strapi/dashboard/content-library/guides/guide-content-builder.ts (NEW)

**Purpose:** Central builder for guides (simplest of the three sections)

**Structure:**

```typescript
import "server-only";
import { guideSchema } from "./guide-schema";

// Import all guide JSON files
import securityArchitectureData from "@/data/strapi-mock/dashboard/content-library/guides/security-architecture.json";
import deploymentGuideData from "@/data/strapi-mock/dashboard/content-library/guides/deployment-guide.json";
import testingStrategyData from "@/data/strapi-mock/dashboard/content-library/guides/testing-strategy.json";

// Type exports
export type Guide = ReturnType<typeof guideSchema.parse>;

// Or if Guide type exists in schema, import it:
export type Guide = /* from guideSchema */;

// Registry
const guideContentRegistry: Record<string, Guide> = {
  "security-architecture": securityArchitectureData as Guide,
  "deployment-guide": deploymentGuideData as Guide,
  "testing-strategy": testingStrategyData as Guide,
};

// Validation at startup
const validatedGuideRegistry = Object.fromEntries(
  Object.entries(guideContentRegistry).map(([slug, document]) => {
    const result = guideSchema.safeParse(document);
    if (!result.success) {
      const issues = result.error.issues.map(issue => `${issue.path.join(".")}: ${issue.message}`).join(" | ");
      throw new Error(`Invalid guide for "${slug}": ${issues}`);
    }
    return [slug, result.data as Guide];
  }),
) as Record<string, Guide>;

// List generation (simpler for guides)
function generateGuideList(): Guide[] {
  return Object.entries(validatedGuideRegistry)
    .map(([slug, document]) => ({
      ...document,
      // Ensure slug is present for all
    }))
    .sort((a, b) => {
      // Adjust sort if guides have publishedAt
      if (a.publishedAt && b.publishedAt) {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return 0;
    });
}

// Caching
let cachedGuideList: Guide[] | null = null;

export function getGuideList(): Guide[] {
  if (!cachedGuideList) {
    cachedGuideList = generateGuideList();
  }
  return cachedGuideList;
}

export function getGuideContentDocument(slug: string): Guide | null {
  return validatedGuideRegistry[slug] ?? null;
}

export function getAllGuideContentSlugs(): string[] {
  return Object.keys(validatedGuideRegistry);
}
```

---

## Files to Modify

### 2. lib/strapi/dashboard/content-library/guides/guide-content.ts

**Current State:** Very simple (30 lines) with guideRegistry

**Change To:** Re-export from builder

```typescript
import "server-only";

export {
  getGuideList,
  getGuideContentDocument,
  getAllGuideContentSlugs,
  type Guide,
} from "@/lib/strapi/dashboard/content-library/guides/guide-content-builder";
```

**What to Remove:**

- Import statements for JSON files
- guideRegistry
- guideSlugs export (can be generated from getAllGuideContentSlugs())

---

### 3. lib/strapi/dashboard/content-library/guides/guides.ts

**Current Import Source:** Verify - likely from guide-content.ts or legacy

**Change To:**

```typescript
import "server-only";

import {
  getGuideList,
  type Guide,
} from "@/lib/strapi/dashboard/content-library/guides/guide-content";

export type { Guide };

export function getAllGuides(): Guide[] {
  return getGuideList();
}

export function getGuideBySlug(slug: string): Guide | undefined {
  return getGuideList().find((guide) => guide.slug === slug);
}

export function getAllGuideSlugs(): string[] {
  return getGuideList().map((guide) => guide.slug);
}
```

**Note:** Guides may not have level/category filtering like articles and case-studies. Adjust functions based on actual Guide type structure.

---

### 4. lib/strapi/dashboard/content-library/guides/guides-repository.ts

**Verify Current State:**

- Check if imports from guide-content.ts
- Update if needed

**Pattern:**

```typescript
import "server-only";

import {
  getGuideList,
  getGuideContentDocument,
  type Guide,
} from "@/lib/strapi/dashboard/content-library/guides/guide-content";

export interface GuideRecord {
  guide: Guide;
  content: Guide;
}

export function listGuides(): Guide[] {
  return getGuideList();
}

export function listGuideSlugs(): string[] {
  return getGuideList().map((guide) => guide.slug);
}

export function getGuideRecordBySlug(slug: string): GuideRecord | null {
  const guide = getGuideList().find((item) => item.slug === slug);
  if (!guide) {
    return null;
  }

  const content = getGuideContentDocument(slug);
  if (!content) {
    return null;
  }

  return { guide, content };
}
```

**Note:** For guides, the document and list item may be the same object, so GuideRecord might need adjustment.

---

### 5. lib/strapi/dashboard/content-library/guides/guide-view-models.ts

**Verify:**

- Check import source
- Update if needed
- Transformation logic typically remains same

---

### 6. lib/strapi/dashboard/content-library/guides/guide-schema.ts

**Status:** Keep as-is ✓

No changes needed - contains guide validation schema

---

## UI Layer Changes

### 7. app/(dashboard)/dashboard/content-library/guides/page.tsx

**Current State:** Check existing implementation

**Change To:**

```typescript
import { getAllGuides } from "@/lib/strapi/dashboard/content-library/guides/guides";
import GuidesPageClient from "./guides-client";

export default async function GuidesPage() {
  const guides = getAllGuides();
  return <GuidesPageClient guides={guides} />;
}
```

---

### 8. app/(dashboard)/dashboard/content-library/guides/guides-client.tsx (NEW)

**Create New File:**

```typescript
"use client";

import type { Guide } from "@/lib/strapi/dashboard/content-library/guides/guide-content";

interface Props {
  guides: Guide[];
}

export default function GuidesPageClient({ guides }: Props) {
  // Move all existing client-side logic from guides/page.tsx here
  // Handle state, effects, interactions
  // Return JSX
}
```

---

## Implementation Steps

1. **Create guide-content-builder.ts**
   - Simpler than articles/case-studies (only 3 files)
   - Import 3 JSON files
   - Create simple registry
   - Add validation
   - Export functions and types
   - **Test:** Build succeeds

2. **Update guide-content.ts**
   - Remove JSON imports and registry
   - Add re-exports from builder
   - **Test:** Type check passes

3. **Update guides.ts**
   - Verify/change import source
   - Update getAllGuides() to call getGuideList()
   - Adjust filtering functions based on Guide structure
   - **Test:** Functions work

4. **Verify guides-repository.ts**
   - Confirm imports from guide-content
   - Adjust GuideRecord if needed

5. **Verify guide-view-models.ts**
   - Run type check

6. **Create guides-client.tsx**
   - Extract UI logic from current page.tsx
   - Add 'use client'

7. **Update guides/page.tsx**
   - Make async
   - Import getAllGuides
   - Render guides-client.tsx
   - **Test:** Page renders

8. **Validation**
   - Type check all files
   - Build project

---

## Key Points for Guides

- **Only 3 JSON files** - simplest section
- **Simpler structure** than articles/case-studies
- **May not have level/category** - check existing schema
- **Same validation pattern** at startup
- **Same caching pattern**
- **Consistency** with articles/case-studies even though simpler

---

## Important Verification Needed

Before implementing guides section, verify:

1. **What does current guide-content.ts export?**
   - Are there any exports besides the registry and slugs?

2. **What is the Guide type structure?**
   - Check guide-schema.ts for exact interface
   - Does it have: slug, title, description, publishedAt?
   - Does it have: level, category, tags?

3. **How is guide-content.ts used?**
   - Check guides.ts and guides-repository.ts imports

4. **Does guides/page.tsx exist?**
   - Check app/(dashboard)/dashboard/content-library/guides/
   - What structure does it have?

5. **Are there [category] subdirectories?**
   - If guides have categories, there might be nested routing
   - Check if there's a guides/[category]/page.tsx

These details will affect the exact implementation, but the overall pattern remains identical to articles and case-studies.
