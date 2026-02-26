# PHASE 9 CONTENT MODEL MAP (Blueprint)

**Date:** 2026-02-25  
**Status:** Draft v1 (to be refined during migration)  
**Purpose:** Canonical content contract for Strapi alignment and UI consistency

---

## 1) Global Content Principles (Non‑Negotiable)

- Every page maps to a **Strapi entity** (single type or collection type).
- Every page renders **sections** composed of **blocks**.
- Every block maps 1:1 to a **shared UI component** (organism-level).
- No raw CMS data in JSX. Data must flow: **CMS → Adapter → Typed Props → UI**.

---

## 2) Core Entity Types

### A) Single Types (Static Pages)

Used for marketing and static content pages.

**Common Fields**

- `title` (string)
- `description` (string)
- `hero` (HeroBlock)
- `sections` (SectionBlock[])
- `seo` (SeoMeta)

### B) Collection Types (Content Library + Documentation)

Used for repeatable content entries.

**Common Fields**

- `title` (string)
- `slug` (string)
- `summary` (string)
- `category` (Category)
- `tags` (Tag[])
- `body` (RichText | Blocks)
- `seo` (SeoMeta)

### C) Taxonomy Types

- `Category`: name, slug, description
- `Tag`: name, slug

### D) Shared Blocks (UI Contract)

Blocks are **reusable** and must map directly to shared components.

- `HeroBlock`
- `FeatureGridBlock`
- `ChecklistBlock`
- `TimelineBlock`
- `CTAGroupBlock`
- `MetricsBlock`
- `CardGridBlock`
- `FAQBlock`

---

## 3) Page Family Mapping

### Marketing (Single Types)

- `/` (marketing home)
- `/services`
- `/quotation`
- `/contact`

**Default Block Pattern**

- HeroBlock
- FeatureGridBlock
- CTAGroupBlock
- FAQBlock (optional)

---

### Dashboard – Admin (Single Types + Structured Blocks)

Admin pages map to **structured sections** with block arrays.

**Default Block Pattern**

- HeroBlock (or PageHeader)
- Section Blocks (Features, Capabilities, Journeys, Metrics)

---

### Content Library (Collections)

- `/dashboard/content-library/*`

**Default Block Pattern**

- ListPage (collection view)
- DetailPage (slug view)

---

### Documentation (Collections)

- `/dashboard/documentation/*`

**Default Block Pattern**

- DocListPage
- DocDetailPage

---

## 4) Adapter Requirements

Every page must have a local adapter:

```
CMS Payload → mapPageData() → Typed UI Props → Page Component
```

Adapters enforce:

- Default values
- Field normalization
- Type conformance

---

## 5) TypeScript Rules for Phase 9

- Use `satisfies` to validate data shape
- Prefer `unknown` + guards over `any`
- Introduce generics for collection structures
- Resolve duplicate interface names with domain prefixes

---

## 6) Migration Checklist (Per Page)

1. Define Strapi entity + relations
2. Create mock JSON (aligned to entity)
3. Add TypeScript interface
4. Build adapter → typed props
5. Replace direct data usage in JSX
6. Validate: `tsc` + `build`

---

**Owner:** Senior Architecture Discipline  
**Status:** Ready for Batch A migration planning
