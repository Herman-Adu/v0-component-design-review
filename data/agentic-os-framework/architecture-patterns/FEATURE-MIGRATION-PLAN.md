# Feature-Based Architecture Migration Plan
# Created: 2026-02-13
# Status: Analysis Complete - Ready for Implementation

---

## DISCOVERED FEATURES (From Current Codebase)

### **Feature 1: Contact Forms** (Priority: HIGH)
**Current Location:**
- `/app/contact/page.tsx`
- `/components/organisms/contact-form-container.tsx`
- `/components/organisms/contact-steps/*` (5 files)
- `/lib/actions/contact-request.ts`
- `/lib/validation/contact-schemas.ts`
- `/lib/store/use-contact-store.ts`
- `/lib/email/services/contact-email-service.ts`

**Target:** `/features/contact/`

---

### **Feature 2: Quotation Forms** (Priority: HIGH)
**Current Location:**
- `/app/quotation/page.tsx`
- `/components/organisms/quotation-form-container.tsx`
- `/components/organisms/quotation-steps/*` (5 files)
- `/lib/actions/quotation-request.ts`
- `/lib/validation/quotation-schemas.ts`
- `/lib/store/use-quotation-store.ts`
- `/lib/email/services/quotation-email-service.ts`

**Target:** `/features/quotation/`

---

### **Feature 3: Multi-Step Forms** (Priority: MEDIUM - Shared Infrastructure)
**Current Location:**
- `/components/organisms/multi-step-form-container.tsx`
- `/components/organisms/multi-step-form-wrapper.tsx`
- `/components/organisms/shared-steps/*` (3 files)
- `/components/molecules/form-navigation.tsx`
- `/components/molecules/form-progress-indicator.tsx`
- `/components/molecules/form-step-container.tsx`
- `/components/molecules/step-indicator.tsx`
- `/lib/store/create-form-store.ts`
- `/lib/store/use-form-store.ts`

**Target:** `/features/forms/` (shared form infrastructure)

---

### **Feature 4: Email System** (Priority: HIGH - Admin Feature)
**Current Location:**
- `/app/dashboard/admin/email/*` (14 pages)
- `/app/dashboard/admin/email-jobs/*` (2 pages)
- `/lib/email/services/*` (13 files)
- `/lib/email/templates/*` (10 files)
- `/lib/email/config/*`
- `/lib/actions/email-admin.tsx`
- `/lib/actions/render-email.ts`

**Target:** `/features/email-management/`

---

### **Feature 5: Content Library** (Priority: MEDIUM)
**Current Location:**
- `/app/dashboard/content-library/*` (11 pages)
- `/components/articles/*` (30 files)
- `/components/case-studies/*` (16 files)
- `/components/tutorials/*` (15 files)
- `/components/guides/*` (3 files)
- `/data/content-library/*` (4 files)
- `/components/molecules/article-components.tsx`
- `/components/molecules/content-card.tsx`

**Target:** `/features/content-library/`

---

### **Feature 6: Documentation System** (Priority: MEDIUM)
**Current Location:**
- `/app/dashboard/documentation/*` (25 pages)
- `/components/molecules/doc-page-layout.tsx`
- `/components/molecules/doc-page.tsx`
- `/components/molecules/docs-sidebar.tsx`
- `/data/doc-manifest.ts`
- `/data/content-gap-registry.ts`

**Target:** `/features/documentation/`

---

### **Feature 7: Admin Dashboard** (Priority: LOW - Keep as app routes)
**Current Location:**
- `/app/dashboard/admin/*`
- Admin-specific pages (doc-system, request-management, etc.)

**Action:** Keep in `/app/dashboard/admin/` - these are route-based, not feature components

---

## IDENTIFIED DUPLICATIONS

### **CRITICAL: Theme Provider Duplication**
```
❌ /components/providers/theme-provider.tsx
❌ /components/theme-provider.tsx
```
**Action:** Keep `/components/providers/theme-provider.tsx`, delete `/components/theme-provider.tsx`
**Reason:** Atomic design places providers in `/providers/` folder

### **CRITICAL: Toast Hook Duplication**
```
❌ /components/ui/use-toast.ts
❌ /hooks/use-toast.ts
```
**Action:** Keep `/hooks/use-toast.ts` (standard React hook location), delete from `/components/ui/`

### **Mobile Hook Duplication**
```
❌ /components/ui/use-mobile.tsx
❌ /hooks/use-mobile.ts
```
**Action:** Keep `/hooks/use-mobile.ts`, delete `/components/ui/use-mobile.tsx`
**Reason:** Hooks belong in `/hooks/`, not `/components/ui/`

---

## MIGRATION STRATEGY

### **Phase 1: Fix Duplications (Do First)**
1. Verify no imports reference duplicated files
2. Update imports if needed
3. Delete duplicates
4. Test build

### **Phase 2: Create Feature Infrastructure**
1. Create `/features/` folder
2. Create first feature: `contact` (smallest, most isolated)
3. Validate structure works
4. Document pattern for team

### **Phase 3: Migrate Features (One at a Time)**
**Order:**
1. Contact Forms (isolated, clear boundaries)
2. Quotation Forms (similar to contact)
3. Forms Infrastructure (shared between contact/quotation)
4. Email Management (admin feature, large but isolated)
5. Content Library (many components, but clear feature)
6. Documentation System (last, most integrated)

### **Phase 4: Validation**
1. All imports resolve correctly
2. No circular dependencies
3. Tests pass
4. Build succeeds
5. Update documentation

---

## FEATURE STRUCTURE TEMPLATE

```
/features/{feature-name}/
  /components/       - Feature-specific atomic components
    /atoms/
    /molecules/
    /organisms/
  /hooks/           - Feature-specific React hooks
  /schemas/         - Validation schemas (Zod)
  /api/             - API calls and data fetching
  /types/           - TypeScript types
  /utils/           - Feature-specific utilities
  index.ts          - Public API (only export what's needed externally)
```

---

## BENEFITS OF THIS MIGRATION

1. **Prevents Bloat:** Components organized by feature, not dumped in one folder
2. **Co-location:** Feature logic, components, schemas, and API calls together
3. **Clear Boundaries:** Easy to see what belongs to which feature
4. **Scalability:** New features are self-contained modules
5. **Team Collaboration:** Multiple developers can work on different features without conflicts
6. **Testing:** Feature-level testing is easier with clear boundaries

---

## NEXT STEP

**Start with Phase 1: Fix Duplications**
- Low risk
- Immediate cleanup
- Validates our build process before big refactor
