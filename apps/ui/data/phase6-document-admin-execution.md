# PHASE 6: Document Administration Extraction — Execution Guide

## Overview
Phase 6 extracts hardcoded data from 10 document-administration pages into JSON mock files. This follows the same pattern as Phase 5 with improved script coverage and QA tools optimization.

## Scope
- **Pages:** 10 (Overview, Getting Started, Documentation Health, Gap Analysis, 5x Quality Engineering)
- **Arrays:** 5 main data structures (sections, highlights, journeys, qaTools, quickChecklist)
- **JSON Files:** 4 new mock files
- **Refactored Pages:** 3 pages (Overview, Getting Started, QE Overview)

## Execution Steps

### Step 1: Run Extraction Script
```bash
node scripts/phase6-extract-document-admin-data.js
```

**What it does:**
- Scans all 10 document-administration pages
- Identifies hardcoded arrays (sections, highlights, journeys, etc.)
- Generates extraction report at `data/phase6-extraction-report.md`

**Expected output:**
```
✅ page.tsx (sections, highlights)
✅ getting-started/page.tsx (journeys, quickChecklist)
✅ quality-engineering/page.tsx (qaTools)
⏭️  quality-engineering/* (complex logic, skip)
```

### Step 2: Review Extraction Report
```bash
cat data/phase6-extraction-report.md
```

Verify:
- All 10 pages scanned
- 5 arrays identified
- Correct mapping of data to JSON files

### Step 3: Run Refactor Script
```bash
node scripts/phase6-refactor-document-admin-pages.js
```

**What it does:**
- Adds imports for extracted data to the top of pages
- Removes hardcoded const declarations
- Generates refactor report at `data/phase6-refactor-report.md`

**Example transformation:**
```tsx
// Before
const sections = [...]

// After
import { sections, highlights } from '@/data/strapi-mock/document-administration/overview'
```

### Step 4: Verify Build
```bash
pnpm build
```

**Success criteria:**
- No TypeScript errors
- All 160 static pages compile
- Import paths resolve correctly

### Step 5: Test in Preview
```bash
pnpm dev
```

Visit these pages to verify rendering:
- `/dashboard/admin/document-administration`
- `/dashboard/admin/document-administration/getting-started`
- `/dashboard/admin/document-administration/quality-engineering`

### Step 6: Commit & Push
```bash
git add -A
git commit -m "phase-6: extract document-admin data"
git push origin v0-component-debug
```

## JSON Files Created

### 1. `document-administration/overview/sections.json`
- Sections array (2 items: Documentation Health, Quality Engineering)
- Usage: Overview page navigation

### 2. `document-administration/overview/highlights.json`
- Feature highlights array (6 items)
- Usage: Overview page features grid

### 3. `document-administration/getting-started/journeys.json`
- Role-based journey data (2 journeys with 8 total steps)
- Usage: Getting Started page workflow cards

### 4. `document-administration/getting-started/quick-checklist.json`
- Quick checklist array (6 items)
- Usage: Getting Started quick reference

### 5. `document-administration/quality-engineering/qa-tools.json`
- QA tools array (5 items)
- Usage: Quality Engineering overview grid

## Pages Refactored
1. ✅ `document-administration/page.tsx`
2. ✅ `document-administration/getting-started/page.tsx`
3. ✅ `document-administration/quality-engineering/page.tsx`

## Pages Skipped
- `documentation-health/page.tsx` (imports from external data sources)
- `documentation-health/gap-analysis/page.tsx` (imports from external data sources)
- 5x `quality-engineering/*` pages (complex validation logic, not suitable for extraction)

## Validation Checklist
- [ ] Extraction report generated
- [ ] Refactor report generated
- [ ] All JSON files created in correct folders
- [ ] TypeScript build passes
- [ ] Pages render correctly in preview
- [ ] Icon mapping working (sections/highlights use icon strings)
- [ ] All imports resolve successfully

## Troubleshooting

### "Cannot find module" errors
Check that JSON import paths match:
```tsx
import { sections } from '@/data/strapi-mock/document-administration/overview'
```

### Build fails with TypeScript errors
Ensure icon names in JSON match lucide-react exports:
- `HeartPulse`, `FlaskConical`, `SearchCheck`, etc.

### Pages still show hardcoded data
Verify refactor script ran successfully:
```bash
grep -r "const sections = " app/(dashboard)/dashboard/admin/document-administration/
# Should return: (no results)
```

## Next Phase
Phase 7 will extract the remaining administration pages (Content Library, Miscellaneous).

---
Created: Phase 6 | Scope: 10 pages, 5 arrays, 4 JSON files | Pattern: Extraction → Refactor → Validate
