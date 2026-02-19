# Email Administration Refactor Plan (Session 8+)

**Status:** Plan only (Option B) — Execute next session  
**Complexity:** High (directory reorganization + 15+ files)  
**Token Budget Estimate:** 10-12 ops + careful token management  
**Date Created:** Session 7  

---

## CURRENT STATE

```
Flat structure with 14 routes directly under /admin/

/dashboard/admin/
├── request-management/page.tsx (Email Management overview)
├── email-jobs/page.tsx (Request Dashboard)
├── email-jobs/testing-guide/page.tsx (Testing & Ops)
├── email/page.tsx (Email Configuration overview)
├── email-templates/page.tsx (Template & Brand)
├── email-preview/page.tsx (Email Preview)
├── email-subjects/page.tsx (A/B Subject Lines)
├── email-recipients/page.tsx (Recipient Groups)
├── email-scheduling/page.tsx (Email Scheduling)
├── email-infrastructure/page.tsx (Infrastructure overview)
├── email-send/page.tsx (Send Configuration)
├── email-logs/page.tsx (Delivery Logs)
├── email-versions/page.tsx (Version History)
└── email-security/page.tsx (Security Audit)

Nav Data Structure: emailManagementSection (3 subsections flattened into nav)
```

---

## TARGET STATE

```
Nested structure following documentation pattern:

/dashboard/admin/email-administration/
├── page.tsx (Email Administration overview)
├── getting-started/page.tsx
├── request-management/
│   ├── page.tsx (category page for Request Management)
│   ├── overview/page.tsx
│   ├── email-dashboard/page.tsx
│   └── testing-and-ops-guide/page.tsx
├── configuration/
│   ├── page.tsx (category page for Template Configuration)
│   ├── overview/page.tsx
│   ├── template-and-brand/page.tsx
│   ├── email-preview/page.tsx
│   ├── ab-subject-lines/page.tsx
│   ├── recipient-groups/page.tsx
│   └── email-scheduling/page.tsx
└── infrastructure/
    ├── page.tsx (category page for Email Infrastructure)
    ├── overview/page.tsx
    ├── send-configuration/page.tsx
    ├── delivery-logs/page.tsx
    ├── version-history/page.tsx
    └── security-audit/page.tsx

Nav Data Structure: emailAdministrationSection (proper 3-level nesting)
```

---

## DETAILED MIGRATION MAP

### Email Administration (Top Level)

| Current URL | Target URL | Type | Action |
|---|---|---|---|
| `/dashboard/admin/request-management` | `/dashboard/admin/email-administration` | Overview | Migrate + rename to Email Administration overview |
| N/A | `/dashboard/admin/email-administration/getting-started` | New | Create new getting-started page |

### Request Management Category

| Current URL | Target URL | Type | Action |
|---|---|---|---|
| `/dashboard/admin/request-management` | `/dashboard/admin/email-administration/request-management/overview` | Overview | Extract from email-management page, create dedicated |
| `/dashboard/admin/email-jobs` | `/dashboard/admin/email-administration/request-management/email-dashboard` | Dashboard | Move + rename |
| `/dashboard/admin/email-jobs/testing-guide` | `/dashboard/admin/email-administration/request-management/testing-and-ops-guide` | Guide | Move + rename |
| N/A | `/dashboard/admin/email-administration/request-management` | Category | Create category landing page |

### Template Configuration Category

| Current URL | Target URL | Type | Action |
|---|---|---|---|
| `/dashboard/admin/email` | `/dashboard/admin/email-administration/configuration/overview` | Overview | Move + rename |
| `/dashboard/admin/email-templates` | `/dashboard/admin/email-administration/configuration/template-and-brand` | Feature | Move |
| `/dashboard/admin/email-preview` | `/dashboard/admin/email-administration/configuration/email-preview` | Feature | Move |
| `/dashboard/admin/email-subjects` | `/dashboard/admin/email-administration/configuration/ab-subject-lines` | Feature | Move |
| `/dashboard/admin/email-recipients` | `/dashboard/admin/email-administration/configuration/recipient-groups` | Feature | Move |
| `/dashboard/admin/email-scheduling` | `/dashboard/admin/email-administration/configuration/email-scheduling` | Feature | Move |
| N/A | `/dashboard/admin/email-administration/configuration` | Category | Create category landing page |

### Email Infrastructure Category

| Current URL | Target URL | Type | Action |
|---|---|---|---|
| `/dashboard/admin/email-infrastructure` | `/dashboard/admin/email-administration/infrastructure/overview` | Overview | Move + rename |
| `/dashboard/admin/email-send` | `/dashboard/admin/email-administration/infrastructure/send-configuration` | Feature | Move |
| `/dashboard/admin/email-logs` | `/dashboard/admin/email-administration/infrastructure/delivery-logs` | Feature | Move |
| `/dashboard/admin/email-versions` | `/dashboard/admin/email-administration/infrastructure/version-history` | Feature | Move |
| `/dashboard/admin/email-security` | `/dashboard/admin/email-administration/infrastructure/security-audit` | Feature | Move |
| N/A | `/dashboard/admin/email-administration/infrastructure` | Category | Create category landing page |

---

## FILES TO CREATE (New)

### Category Landing Pages (Template-based)

```
/app/dashboard/admin/email-administration/request-management/page.tsx
/app/dashboard/admin/email-administration/configuration/page.tsx
/app/dashboard/admin/email-administration/infrastructure/page.tsx
/app/dashboard/admin/email-administration/getting-started/page.tsx
```

**Template Pattern:** Each category page should:
- Display category title and icon
- List 3-5 sub-pages with descriptions
- Link to each sub-page
- Show role/permission badges
- Provide quick-start guidance

### Navigation Data Files

```
/data/nav/email-administration-nav.ts (NEW)
```

Structure:
```typescript
export const emailAdministrationNav = {
  title: "Email Administration",
  icon: Mail,
  href: "/dashboard/admin/email-administration",
  items: [
    {
      title: "Request Management",
      href: "/dashboard/admin/email-administration/request-management",
      icon: Briefcase,
      children: [...]
    },
    {
      title: "Template Configuration",
      href: "/dashboard/admin/email-administration/configuration",
      icon: Palette,
      children: [...]
    },
    {
      title: "Email Infrastructure",
      href: "/dashboard/admin/email-administration/infrastructure",
      icon: HardDrive,
      children: [...]
    }
  ]
}
```

---

## FILES TO UPDATE

### Navigation Data

**File:** `/data/nav-data.ts`

Changes:
- Remove `emailManagementSection`
- Add import: `import { emailAdministrationNav } from "@/data/nav/email-administration-nav"`
- Replace 3 section references with single `emailAdministrationNav`
- Keep backward compat exports if needed

### Sidebar Component

**File:** `/components/molecules/docs-sidebar.tsx`

Changes:
- Update imports to use `emailAdministrationNav` instead of `emailManagementSection`
- Verify nested rendering works correctly with new structure

### Project State

**File:** `/data/project-state.ts`

Changes:
- Update NAV_ARCHITECTURE section to reflect Email Administration nested structure

---

## FILES TO DELETE (Remove Old Pages)

**Critical:** Delete old pages to avoid cache/routing conflicts

```
REMOVE:
/app/dashboard/admin/request-management/page.tsx
/app/dashboard/admin/email-jobs/page.tsx
/app/dashboard/admin/email-jobs/testing-guide/page.tsx
/app/dashboard/admin/email/page.tsx
/app/dashboard/admin/email-templates/page.tsx
/app/dashboard/admin/email-preview/page.tsx
/app/dashboard/admin/email-subjects/page.tsx
/app/dashboard/admin/email-recipients/page.tsx
/app/dashboard/admin/email-scheduling/page.tsx
/app/dashboard/admin/email-infrastructure/page.tsx
/app/dashboard/admin/email-send/page.tsx
/app/dashboard/admin/email-logs/page.tsx
/app/dashboard/admin/email-versions/page.tsx
/app/dashboard/admin/email-security/page.tsx
```

---

## EXECUTION SEQUENCE (Next Session - MUST FOLLOW ORDER)

### Phase 1: Foundation (2-3 ops)
1. Create `/data/nav/email-administration-nav.ts` with complete navigation structure
2. Create `/app/dashboard/admin/email-administration/` root directory structure
3. Create Email Administration overview page (`/app/dashboard/admin/email-administration/page.tsx`)

### Phase 2: Category Pages (3-4 ops)
4. Create `/app/dashboard/admin/email-administration/getting-started/page.tsx`
5. Create Request Management category page + 3 sub-pages (overview, email-dashboard, testing-and-ops-guide)
6. Create Template Configuration category page + 6 sub-pages
7. Create Email Infrastructure category page + 5 sub-pages

### Phase 3: Migration (2-3 ops)
8. Update `/data/nav-data.ts` imports and structure
9. Update `/components/molecules/docs-sidebar.tsx` to use new nav
10. Update `/data/project-state.ts` to reflect new architecture

### Phase 4: Cleanup & Validation (2-3 ops)
11. Delete all 14 old pages from `/app/dashboard/admin/`
12. Delete empty directories from old structure
13. Verify all routes work in preview
14. Spot-check sidebar rendering with new structure
15. Test navigation between all pages

---

## VALIDATION CHECKLIST (Post-Execution)

- [ ] Email Administration overview loads correctly
- [ ] Getting-started page displays properly
- [ ] All 3 category pages render with correct sub-page links
- [ ] All 14 feature pages load without errors
- [ ] Sidebar shows nested structure correctly
- [ ] Breadcrumbs work (if implemented)
- [ ] Nested URLs match target pattern exactly
- [ ] No 404 errors on any page
- [ ] No console errors
- [ ] Old routes return 404 (no residual pages)
- [ ] Type safety maintained (no TS errors)

---

## CONTENT REFERENCE (For Page Creation)

### Email Administration Overview
- Title: "Email Administration"
- Subtitle: "Manage requests, configure templates, and monitor infrastructure"
- Show 3 category cards with descriptions and icons
- Link to each category

### Getting-Started Page
- Step-by-step guide for first-time users
- Explain the 3 domains (Request Management, Template Configuration, Infrastructure)
- Recommend role-based starting points
- Link to common tasks

### Request Management Category Page
- Title: "Request Management"
- Description: "Handle client requests end-to-end"
- 3 sub-pages: Overview, Email Dashboard, Testing & Ops Guide
- Show capability summary

### Template Configuration Category Page
- Title: "Template Configuration"
- Description: "Brand identity, email templates, scheduling"
- 6 sub-pages: Overview, Template & Brand, Email Preview, A/B Subject Lines, Recipient Groups, Email Scheduling
- Show capability summary

### Email Infrastructure Category Page
- Title: "Email Infrastructure"
- Description: "API health, security, delivery logs, versioning"
- 5 sub-pages: Overview, Send Configuration, Delivery Logs, Version History, Security Audit
- Show capability summary (may require permission check for non-admins)

---

## NOTES & CONSIDERATIONS

1. **Backward Compatibility:** Old flat routes (/admin/email-jobs, etc.) will return 404. This is intentional to avoid caching confusion. Update any bookmarks or documentation.

2. **Permission Check (Future):** Infrastructure category should eventually require admin-only access (deferred to auth phase).

3. **Category Pages:** Each category page (request-management, configuration, infrastructure) is a landing page that explains the domain and links to feature pages.

4. **Data Files:** Navigation data (`email-administration-nav.ts`) uses `.ts` (not `.tsx`) since it's pure configuration.

5. **No Caching Issues:** By removing old pages entirely, there are no orphaned routes or cache conflicts to deal with.

6. **Token Efficiency:** This refactor should take 10-12 ops if executed systematically. Batch deletions at the end to minimize file operations.

---

## SUCCESS CRITERIA (Session 8+)

✅ All 16 pages created and accessible  
✅ Navigation structure reflects 3-level nesting  
✅ All old pages removed (no residual files)  
✅ Type safety maintained  
✅ Zero 404 errors  
✅ Sidebar renders correctly with nested categories  
✅ URL structure matches target pattern exactly  

---

**Plan Owner:** Architect  
**Status:** Ready for execution  
**Next Action:** Execute this plan in Session 8+
