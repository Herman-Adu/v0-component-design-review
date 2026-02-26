# PHASE 9 BATCH PLAN (Consistency Migration)

**Date:** 2026-02-25  
**Status:** Ready for execution  
**Goal:** Migrate all pages to Strapi-aligned, adapter-driven, typed patterns

---

## Batch A — Simple Pages (Low Risk)

**Focus:** Static layouts and top-level pages. Establish the reference pattern.

**Pages:**

- app/(marketing)/page.tsx
- app/services/page.tsx
- app/quotation/page.tsx
- app/contact/page.tsx
- app/(dashboard)/dashboard/page.tsx
- app/(dashboard)/dashboard/admin/page.tsx
- app/(dashboard)/dashboard/admin/digital-marketing/page.tsx
- app/(dashboard)/dashboard/admin/document-administration/page.tsx
- app/(dashboard)/dashboard/admin/email-administration/page.tsx
- app/(dashboard)/dashboard/content-library/page.tsx
- app/(dashboard)/dashboard/documentation/app-reference/overview/page.tsx
- app/(dashboard)/dashboard/documentation/cms-reference/overview/page.tsx
- app/(dashboard)/dashboard/documentation/infrastructure-and-ops/overview/page.tsx
- app/(dashboard)/dashboard/documentation/strategic-overview/overview/page.tsx

**Exit Criteria:**

- All pages use adapter + typed props
- `npx tsc --noEmit` clean
- `npm run build` clean

---

## Batch B — Medium Pages (Moderate Risk)

**Focus:** Nested admin pages and documentation/content library list pages.

**Pages:**

- app/(dashboard)/dashboard/admin/digital-marketing/content-strategy/page.tsx
- app/(dashboard)/dashboard/admin/digital-marketing/getting-started/page.tsx
- app/(dashboard)/dashboard/admin/digital-marketing/facebook/\*/page.tsx
- app/(dashboard)/dashboard/admin/digital-marketing/google/\*/page.tsx
- app/(dashboard)/dashboard/admin/digital-marketing/linkedin/\*/page.tsx
- app/(dashboard)/dashboard/admin/digital-marketing/twitter/\*/page.tsx
- app/(dashboard)/dashboard/admin/document-administration/getting-started/page.tsx
- app/(dashboard)/dashboard/admin/document-administration/documentation-health/\*/page.tsx
- app/(dashboard)/dashboard/admin/document-administration/quality-engineering/\*/page.tsx
- app/(dashboard)/dashboard/admin/email-administration/getting-started/page.tsx
- app/(dashboard)/dashboard/admin/email-administration/configuration/\*/page.tsx
- app/(dashboard)/dashboard/admin/email-administration/infrastructure/\*/page.tsx
- app/(dashboard)/dashboard/admin/email-administration/request-management/\*/page.tsx
- app/(dashboard)/dashboard/content-library/articles/page.tsx
- app/(dashboard)/dashboard/content-library/case-studies/page.tsx
- app/(dashboard)/dashboard/content-library/guides/page.tsx
- app/(dashboard)/dashboard/content-library/social/page.tsx
- app/(dashboard)/dashboard/content-library/tutorials/page.tsx
- app/(dashboard)/dashboard/documentation/app-reference/\*/page.tsx
- app/(dashboard)/dashboard/documentation/cms-reference/\*/page.tsx
- app/(dashboard)/dashboard/documentation/infrastructure-and-ops/\*/page.tsx
- app/(dashboard)/dashboard/documentation/strategic-overview/\*/page.tsx

**Exit Criteria:**

- All pages use adapter + typed props
- `npx tsc --noEmit` clean
- `npm run build` clean

---

## Batch C — Complex Pages (High Risk)

**Focus:** Dynamic routes with relations and collection detail views.

**Pages:**

- app/(dashboard)/dashboard/content-library/articles/[category]/[slug]/page.tsx
- app/(dashboard)/dashboard/content-library/case-studies/[category]/[slug]/page.tsx
- app/(dashboard)/dashboard/content-library/guides/[category]/[slug]/page.tsx
- app/(dashboard)/dashboard/content-library/tutorials/[category]/[slug]/page.tsx

**Exit Criteria:**

- All pages use adapter + typed props
- All relations validated (category/slug)
- `npx tsc --noEmit` clean
- `npm run build` clean

---

## Validation Steps (After Every Batch)

1. `npx tsc --noEmit`
2. `npm run build`
3. Smoke render test for updated routes
4. Update PHASE9_GENERATION_NOTES.md

---

**Owner:** Senior Architecture Discipline  
**Status:** Ready to begin Batch A
