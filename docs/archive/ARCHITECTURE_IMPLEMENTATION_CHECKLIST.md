# Architecture Implementation Checklist — Phase Gates & Success Criteria

**Status:** Execution Checklist (Feb 28, 2026)  
**Authority:** Canonical gate definitions for all 5 validation phases  
**Extends:** STRAPI_DYNAMIC_ZONES_AUTHORITY.md, SPRINT_PLAN.md  
**Last Updated:** 2026-02-28

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [5-Gate Sequence Overview](#5-gate-sequence-overview)
3. [Gate 1: Schema Validation](#gate-1-schema-validation)
4. [Gate 2: Data Integrity](#gate-2-data-integrity)
5. [Gate 3: Route & Metadata](#gate-3-route--metadata)
6. [Gate 4: Quality & Accessibility](#gate-4-quality--accessibility)
7. [Gate 5: Build & Deploy](#gate-5-build--deploy)
8. [Reporting & Sign-Off](#reporting--sign-off)

---

## Executive Summary

All code migration follows a **5-gate validation sequence**. Each gate must **100% pass before proceeding to the next**. No exceptions.

### Gate Summary

| Gate       | Focus                                              | Blocker? | On Failure                    |
| ---------- | -------------------------------------------------- | -------- | ----------------------------- |
| **Gate 1** | Schema validation (Zod, JSON compliance)           | YES      | Block data layer + routes     |
| **Gate 2** | Data layer correctness (repo queries, null safety) | YES      | Block route migration + tests |
| **Gate 3** | Route rendering + metadata generation              | YES      | Block quality checks + PR     |
| **Gate 4** | Quality + accessibility (tests, a11y, performance) | YES      | Block merge to main           |
| **Gate 5** | Build success + sitemap generation                 | YES      | Block deploy to production    |

**Principle:** Gates prevent broken deployments. Each gate catches a different class of failures.

---

## 5-Gate Sequence Overview

```
Manual Content Extraction (JSON files, markdown breakdown)
           ↓
      GATE 1: Schema Validation
      ✓ All JSON valid against Zod
      ✓ Block types recognized
      ✓ Zero validation errors
           ↓
      BUILDS DATA LAYER CODE
      (builder → repository → viewmodels → facade)
           ↓
      GATE 2: Data Integrity
      ✓ Repository queries work
      ✓ zero null returns
      ✓ All test pass
           ↓
      BUILDS ROUTE CODE
      (pages, generateStaticParams, generateMetadata)
           ↓
      GATE 3: Routes & Metadata
      ✓ Pages render without error
      ✓ Static params complete
      ✓ Metadata includes all fields
      ✓ Sitemap includes routes
           ↓
      RUN QA TESTS
      (accessibility, performance, security)
           ↓
      GATE 4: Quality & Accessibility
      ✓ Accessibility score >95
      ✓ Performance score >90
      ✓ Security scan clean
      ✓ Manual smoke tests pass
           ↓
      FULL BUILD TEST
      (pnpm build, no warnings)
           ↓
      GATE 5: Build & Deploy
      ✓ Build succeeds zero warnings
      ✓ Sitemap generated
      ✓ No TypeScript errors
           ↓
      MERGE TO MAIN + DEPLOY
```

---

## Gate 1: Schema Validation

**Timing:** After content extraction to JSON  
**Owner:** Senior Architect + Frontend Lead  
**Time Estimate:** 30 minutes  
**Blocker:** YES (Cannot proceed to data layer without passing)

### Pre-Gate Checklist (Before Running Validation)

- [ ] All content extracted from markdown to JSON files
- [ ] JSON files location: `data/documentation-[domain]/`
- [ ] All files follow content contract (meta + seo + route + access + toc + blocks)
- [ ] All block types match core registry (text, heading, code, etc.)
- [ ] Schema file exists: `lib/strapi/schemas/documentation-[domain]-schema.ts`

### Validation Steps

#### Step 1.1: Run Zod Schema Validation

```bash
# Validate Strategic domain
npx zod validate \
  --schema lib/strapi/schemas/documentation-strategic-schema.ts \
  --data data/documentation-strategic/*.json \
  --output validation-report-strategic.json

# Repeat for all 4 domains
```

**Expected Output:**

```json
{
  "domain": "strategic",
  "totalFiles": 8,
  "validFiles": 8,
  "invalidFiles": 0,
  "errors": [],
  "warnings": [],
  "timestamp": "2026-03-01T10:00:00Z"
}
```

#### Step 1.2: Check for Missing Required Fields

```bash
# Script to audit all JSON files
node scripts/audit-content-completeness.mjs --domain strategic
```

**Checklist:**

- [ ] All files have `meta.slug` (unique identifier)
- [ ] All files have `meta.title` (primary heading)
- [ ] All files have `meta.excerpt` (SEO fallback)
- [ ] All files have `meta.publishedAt` (ISO datetime)
- [ ] All files have `seo` object (even if fields are empty, object must exist)
- [ ] All files have at least 1 block in `blocks[]`
- [ ] All block `type` values match core registry
- [ ] All code blocks have valid `language` enum values

#### Step 1.3: Validate Block References

```bash
# Check all block types are recognized
node scripts/validate-block-types.mjs --domain strategic
```

**Checklist:**

- [ ] No unknown block types in dynamic zones
- [ ] All code block languages are supported (typescript, javascript, python, bash, yaml, etc.)
- [ ] All alert types are valid (info, warning, error, success)
- [ ] All image blocks have `alt` text (accessibility requirement)
- [ ] All video blocks have valid videoType (youtube, vimeo)

### Gate 1 Success Criteria

**MUST HAVE ALL:**

1. ✅ All JSON files parse without syntax errors
2. ✅ All files validate against Zod schema
3. ✅ Zero validation errors, zero critical warnings
4. ✅ All required fields populated
5. ✅ All block types recognized
6. ✅ All enums valid (language, alertType, videoType)
7. ✅ No orphaned references (links to missing content)

### Gate 1 Failure Handling

If validation fails:

1. **Create validation report:**

```markdown
# [Domain] Schema Validation Failure Report

**Date:** [Timestamp]  
**Domain:** [strategic|cms-reference|app-reference|infrastructure]  
**Status:** ❌ FAILED

## Errors (Blocking)

| File           | Error                           | Severity | Fix                 |
| -------------- | ------------------------------- | -------- | ------------------- |
| article-1.json | Missing meta.slug               | Critical | Add unique slug     |
| article-2.json | Unknown block type "custom-foo" | Critical | Use core block type |

## Warnings (Non-Blocking)

| File           | Warning                | Recommendation          |
| -------------- | ---------------------- | ----------------------- |
| article-3.json | No SEO metaDescription | Add description for SEO |

## Action Items

1. [ ] Fix critical errors (blocking)
2. [ ] Rerun validation
3. [ ] Address warnings (best practice)
4. [ ] Rerun validation report
5. [ ] Resubmit for Gate 1 approval
```

2. **Fix errors** per priority (blocking first)
3. **Rerun validation** until all pass
4. **Get senior architect sign-off** before retrying gate

### Gate 1 Sign-Off

```
GATE 1: SCHEMA VALIDATION — [PASS/FAIL]

Domain: Strategic Overview
Files Validated: 8
Validation Timestamp: 2026-03-01T10:00:00Z
Approved By: [Senior Architect]
Date: [Date]

✅ All JSON validates
✅ All required fields populated
✅ All block types recognized
✅ Zero critical errors

PROCEED TO DATA LAYER IMPLEMENTATION
```

---

## Gate 2: Data Integrity

**Timing:** After data layer code written (builder, repository, viewmodels, facade)  
**Owner:** Frontend Lead + QA  
**Time Estimate:** 40 minutes  
**Blocker:** YES (Cannot proceed to routes without passing)

### Pre-Gate Checklist

- [ ] Content builder file created (`documentation-[domain]-content-builder.ts`)
- [ ] Repository file created (`documentation-[domain]-repository.ts`)
- [ ] View model file created (`documentation-[domain]-view-models.ts`)
- [ ] Facade file created (`documentation-[domain].ts`)
- [ ] Unit tests written (vitest) for all layers
- [ ] All tests passing locally

### Validation Steps

#### Step 2.1: Run Data Layer Unit Tests

```bash
# Run tests for specific domain
pnpm run test -- documentation-strategic

# Expected output
✓ documentation-strategic-content-builder.test.ts (4 tests)
✓ documentation-strategic-repository.test.ts (6 tests)
✓ documentation-strategic-view-models.test.ts (3 tests)

✅ 13 tests passed, 0 failed
```

**Checklist:**

- [ ] Builder loads all JSON files without errors
- [ ] All files validated during builder init
- [ ] Repository list methods return expected counts
- [ ] Repository getBySlug methods return correct document
- [ ] No null returns on valid slugs
- [ ] Viewmodels format dates correctly
- [ ] Viewmodels add computed properties (readTime, wordCount)
- [ ] Facade exports work correctly

#### Step 2.2: Code Coverage Analysis

```bash
# Generate coverage report
pnpm run test -- --coverage documentation-strategic
```

**Success Criteria:**

- [ ] Overall coverage >90%
- [ ] Branches >85%
- [ ] Functions 100%
- [ ] Lines >90%

#### Step 2.3: Data Integrity Spot Check

```bash
# Run manual queries
node scripts/test-documentation-queries.mjs --domain strategic
```

**Checklist:**

- [ ] All slugs are unique
- [ ] No duplicate documents
- [ ] All dates are valid ISO strings
- [ ] All categories are enumerated values
- [ ] No broken cross-references

### Gate 2 Success Criteria

**MUST HAVE ALL:**

1. ✅ All unit tests pass (>90% coverage)
2. ✅ Repository queries return correct data
3. ✅ No null returns on valid inputs
4. ✅ View models transform data correctly
5. ✅ Facade API works without errors
6. ✅ No console errors or warnings
7. ✅ All data types match TypeScript interfaces

### Gate 2 Failure Handling

If any tests fail:

1. **Identify failing test**
2. **Review code** for bug or incomplete implementation
3. **Fix** the issue
4. **Rerun tests** until all pass
5. **Get frontend lead sign-off** before retrying gate

### Gate 2 Sign-Off

```
GATE 2: DATA INTEGRITY — [PASS/FAIL]

Domain: Strategic Overview
Unit Tests: 13 passed, 0 failed
Coverage: 94%
Query Manual Test: ✅ PASS
Approved By: [Frontend Lead]
Date: [Date]

✅ All tests passing
✅ Coverage >90%
✅ Queries return correct data

PROCEED TO ROUTE IMPLEMENTATION
```

---

## Gate 3: Route & Metadata

**Timing:** After route pages created (list + detail pages)  
**Owner:** Frontend Lead + SEO  
**Time Estimate:** 40 minutes  
**Blocker:** YES (Cannot proceed to QA without passing)

### Pre-Gate Checklist

- [ ] List page created: `/app/documentation/[domain]/page.tsx`
- [ ] Detail page created: `/app/documentation/[domain]/[slug]/page.tsx`
- [ ] `generateStaticParams()` returns all slugs
- [ ] `generateMetadata()` returns complete metadata
- [ ] Routes tested locally (no console errors)
- [ ] Sitemap integration tested

### Validation Steps

#### Step 3.1: Verify Static Params Generation

```bash
# Test static params generation
node scripts/test-static-params.mjs --domain strategic
```

**Output:**

```json
{
  "domain": "strategic",
  "staticParams": [
    { "domain": "strategic", "slug": "system-vision" },
    { "domain": "strategic", "slug": "phase-1-foundation" },
    ...
  ],
  "totalParams": 8,
  "missingParams": []
}
```

**Checklist:**

- [ ] All content slugs represented in static params
- [ ] No duplicate slugs
- [ ] No missing slugs

#### Step 3.2: Verify Metadata Generation

```bash
# Test metadata generation
node scripts/test-metadata.mjs --domain strategic --slug system-vision
```

**Expected Output:**

```json
{
  "slug": "system-vision",
  "title": "System Vision..."  // SEO or meta title as fallback
  "description": "...",        // SEO or meta excerpt as fallback
  "canonical": "https://app.com/docs/strategic/system-vision",
  "robots": "index, follow",
  "metaImage": "...",
  "twitter": { "card": "summary_large_image", ... }
}
```

**Checklist:**

- [ ] Title field populated (seo.metaTitle OR meta.title)
- [ ] Description field populated (seo.metaDescription OR meta.excerpt)
- [ ] Canonical URL correct and absolute
- [ ] Robots policy set (index/noindex)
- [ ] OpenGraph tags included (og:title, og:description, og:image)
- [ ] Twitter card tags included
- [ ] All required SEO fields present

#### Step 3.3: Verify Sitemap Integration

```bash
# Generate sitemap
pnpm run build

# Check sitemap
cat .next/static/sitemap.xml | grep "strategic"
```

**Output:**

```xml
<url>
  <loc>https://app.com/dashboard/documentation/strategic/system-vision</loc>
  <lastmod>2026-02-28</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

**Checklist:**

- [ ] All strategic domain routes in sitemap
- [ ] lastmod matches publishedAt date
- [ ] Priority between 0.5-1.0
- [ ] No sitemap errors

### Gate 3 Success Criteria

**MUST HAVE ALL:**

1. ✅ `generateStaticParams()` returns all slugs
2. ✅ `generateMetadata()` returns complete metadata
3. ✅ No null metadata fields
4. ✅ Canonical URLs correct
5. ✅ SEO fallback chain working
6. ✅ Sitemap includes all routes
7. ✅ Pages render without console errors

### Gate 3 Failure Handling

If metadata missing or routes broken:

1. **Check route files** for missing generateMetadata()
2. **Check fallback logic** for nulls or undefined
3. **Fix** the issue
4. **Rerun metadata tests** until all pass
5. **Get frontend lead + SEO sign-off**

### Gate 3 Sign-Off

```
GATE 3: ROUTES & METADATA — [PASS/FAIL]

Domain: Strategic Overview
Static Params: 8 routes
Metadata Generation: ✅ PASS
Sitemap Routes: 8 entries
Approved By: [Frontend Lead + SEO]
Date: [Date]

✅ All routes render
✅ All metadata complete
✅ Sitemap generated correctly

PROCEED TO QUALITY CHECKS
```

---

## Gate 4: Quality & Accessibility

**Timing:** After QA tests run  
**Owner:** QA + Frontend Lead  
**Time Estimate:** 30 minutes  
**Blocker:** YES (Cannot merge without passing)

### Pre-Gate Checklist

- [ ] All pages tested in Chrome, Firefox, Safari
- [ ] All pages responsive (desktop, tablet, mobile)
- [ ] Accessibility tests run (a11y-testing-library)
- [ ] Performance audit run (Lighthouse)
- [ ] Security scan run (OWASP ZAP or similar)

### Validation Steps

#### Step 4.1: Accessibility Audit

```bash
# Run accessibility tests
pnpm run test:a11y -- documentation-strategic
```

**Checklist:**

- [ ] No WCAG 2.1 AA violations
- [ ] All images have alt text
- [ ] All links have descriptive text (not "click here")
- [ ] Color contrast ratio >4.5:1
- [ ] Form inputs have associated labels
- [ ] Headings in logical order (h1 → h2 → h3)
- [ ] Keyboard navigation works (Tab, Enter)

#### Step 4.2: Performance Audit

```bash
# Run Lighthouse performance audit
pnpm run lighthouse -- /dashboard/documentation/strategic/system-vision
```

**Expected Scores:**

- [ ] Performance: >90
- [ ] Accessibility: >95
- [ ] Best Practices: >90
- [ ] SEO: >95

#### Step 4.3: Manual Smoke Tests

```
- [ ] List page loads and displays all items
- [ ] Detail pages load and render blocks correctly
- [ ] Links to other docs work
- [ ] TOC navigation works (if present)
- [ ] Code blocks display with correct syntax highlighting
- [ ] Images load correctly
- [ ] Videos embed properly
- [ ] Tables display correctly on mobile
```

### Gate 4 Success Criteria

**MUST HAVE ALL:**

1. ✅ No WCAG violations
2. ✅ Accessibility score >90
3. ✅ Performance score >85
4. ✅ No security vulnerabilities
5. ✅ All manual smoke tests pass
6. ✅ Responsive on all breakpoints
7. ✅ No console errors or warnings

### Gate 4 Failure Handling

If accessibility or performance issues found:

1. **Identify issue** (accessibility error, performance bottleneck)
2. **Create bug fix** (add alt text, optimize image, reduce bundle)
3. **Rerun tests** until all pass
4. **Get QA sign-off**

### Gate 4 Sign-Off

```
GATE 4: QUALITY & ACCESSIBILITY — [PASS/FAIL]

Domain: Strategic Overview
Accessibility Score: 96/100
Performance Score: 92/100
Security Scan: ✅ PASS (no vulnerabilities)
Manual Tests: ✅ PASS
Approved By: [QA Lead]
Date: [Date]

✅ All quality thresholds met

PROCEED TO BUILD & DEPLOY
```

---

## Gate 5: Build & Deploy

**Timing:** Before merge to main  
**Owner:** DevOps + Frontend Lead  
**Time Estimate:** 20 minutes  
**Blocker:** YES (Cannot deploy without passing)

### Pre-Gate Checklist

- [ ] All code committed and ready
- [ ] All prior gates (1-4) passed and signed off
- [ ] PR created with all changes
- [ ] Code reviewed by another developer

### Validation Steps

#### Step 5.1: Full Production Build

```bash
# Full clean build (production)
pnpm run build

# Expected output
✅ Creating an optimized production build...
✅ Compiled successfully
✅ Linting and checking validity of types
✅ Generated .next/sitemap.xml (8 routes)
✅ Export complete
```

**Checklist:**

- [ ] Zero build errors
- [ ] Zero warnings
- [ ] No TypeScript errors (`pnpm run type-check`)
- [ ] No lint errors (`pnpm run lint`)

#### Step 5.2: Verify Output

```bash
# Check sitemap was generated
ls -la .next/static/sitemap.xml

# Check sitemap contents
wc -l .next/static/sitemap.xml  # Should include all routes
```

**Checklist:**

- [ ] Sitemap file exists
- [ ] Sitemap valid XML
- [ ] All routes present
- [ ] No duplicate entries

#### Step 5.3: Dry Run Deployment

```bash
# Test deployment without going live
vercel deploy --prebuilt --confirm=false
```

**Checklist:**

- [ ] Deployment preview succeeds
- [ ] Pages render in preview
- [ ] Links work in preview
- [ ] Metadata appears correct

### Gate 5 Success Criteria

**MUST HAVE ALL:**

1. ✅ Build succeeds with zero errors
2. ✅ Build succeeds with zero warnings
3. ✅ No TypeScript errors
4. ✅ No lint errors
5. ✅ Sitemap generated correctly
6. ✅ All routes in output
7. ✅ Dry run deployment succeeds

### Gate 5 Failure Handling

If build fails:

1. **Check error log** (`pnpm run build` output)
2. **Fix build error** (TypeScript error, missing import, etc.)
3. **Rerun build** until succeeds
4. **Get DevOps sign-off**

### Gate 5 Sign-Off

```
GATE 5: BUILD & DEPLOY — [PASS/FAIL]

Domain: Strategic Overview
Build Status: ✅ SUCCESS
Build Time: 34 seconds
Warnings: 0
Sitemap Routes: 8
Dry Run: ✅ PASSED
Approved By: [DevOps Lead]
Date: [Date]

✅ Ready for production deployment

PROCEED TO MERGE & DEPLOY TO MAIN
```

---

## Reporting & Sign-Off

### Per-Batch Completion Report

After all 5 gates pass, create:

```markdown
# [Domain] Batch Completion Report

**Date:** [Date]  
**Domain:** [strategic|cms-reference|app-reference|infrastructure]

## Gate Summary

| Gate            | Status  | Approved By         | Date       |
| --------------- | ------- | ------------------- | ---------- |
| Gate 1: Schema  | ✅ PASS | Senior Architect    | 2026-03-01 |
| Gate 2: Data    | ✅ PASS | Frontend Lead       | 2026-03-02 |
| Gate 3: Routes  | ✅ PASS | Frontend Lead + SEO | 2026-03-03 |
| Gate 4: Quality | ✅ PASS | QA Lead             | 2026-03-04 |
| Gate 5: Build   | ✅ PASS | DevOps Lead         | 2026-03-05 |

## Metrics

- Files Processed: 8
- Routes Created: 8
- Test Coverage: 94%
- Accessibility Score: 96
- Performance Score: 92

## Approvals

- Senior Architect: ****\_**** Date: **\_\_\_**
- Frontend Lead: ****\_**** Date: **\_\_\_**
- QA Lead: ****\_**** Date: **\_\_\_**
- DevOps Lead: ****\_**** Date: **\_\_\_**

**Status:** ✅ APPROVED FOR MERGE & PRODUCTION DEPLOYMENT
```

### Final Handoff

After all batches complete, create:

```markdown
# All Domains Batch Completion Summary

**Total Domains:** 4 (Strategic, CMS-Ref, App-Ref, Infrastructure)  
**Total Routes:** 32  
**Total Files:** 32  
**Build Time:** ~2 hours

**Status:** ✅ ALL GATES PASSED, READY FOR MAIN DEPLOYMENT
```

---

**Status:** Locked. Gate criteria cannot be waived.
