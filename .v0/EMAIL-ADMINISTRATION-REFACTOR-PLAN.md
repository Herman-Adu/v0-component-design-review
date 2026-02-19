# Email Administration Refactor Plan (Session 8)

**Status:** PLAN ONLY (Execute Session 8)  
**Created:** Session 7  
**Scope:** URL structure consolidation + page reorganization  
**Complexity:** High (15-20 files affected)  
**Estimated Ops:** 8-10 (Session 8 budget allows)  
**Risk Level:** Medium (requires careful route migration + cache cleanup)  

---

## 1. SCOPE CLARITY

### What We're Doing
Restructuring Email Management from flat admin routes to a nested, documented-style hierarchy:
- Create new nested directory structure under `/admin/email-administration/`
- Map all 14 existing email pages to nested routes
- Add 2 new pages: Email Administration Overview + Getting Started
- Delete all old flat routes (no duplication = no caching issues)
- Update nav-data.ts to reflect new structure

### What We're NOT Doing
- Changing any page content or functionality (migrate as-is)
- Adding new features (migration only)
- Implementing permission checks (deferred to auth phase)
- Adding visual dividers (deferred to UI polish phase)

---

## 2. DIRECTORY STRUCTURE (Target)

### New Nested Structure
```
/app/dashboard/admin/email-administration/
├── layout.tsx (shared layout with breadcrumbs + nav)
├── page.tsx (Email Administration Overview)
├── getting-started/
│   └── page.tsx (Email Administration Getting Started)
├── request-management/
│   ├── layout.tsx
│   ├── page.tsx (Request Management Overview)
│   ├── email-dashboard/
│   │   └── page.tsx
│   └── testing-and-ops-guide/
│       └── page.tsx
├── configuration/
│   ├── layout.tsx
│   ├── page.tsx (Template Configuration Overview)
│   ├── template-and-brand/
│   │   └── page.tsx
│   ├── email-preview/
│   │   └── page.tsx
│   ├── ab-subject-lines/
│   │   └── page.tsx
│   ├── recipient-groups/
│   │   └── page.tsx
│   └── email-scheduling/
│       └── page.tsx
└── infrastructure/
    ├── layout.tsx
    ├── page.tsx (Email Infrastructure Overview)
    ├── send-configuration/
    │   └── page.tsx
    ├── delivery-logs/
    │   └── page.tsx
    ├── version-history/
    │   └── page.tsx
    └── security-audit/
        └── page.tsx
```

### Files to DELETE (avoid caching issues)
```
/app/dashboard/admin/request-management/page.tsx
/app/dashboard/admin/email/page.tsx
/app/dashboard/admin/email-jobs/page.tsx
/app/dashboard/admin/email-jobs/testing-guide/page.tsx
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

## 3. FILE MAPPING (Old → New)

| Old Route | New Route | Page Type | Action |
|-----------|-----------|-----------|--------|
| `/admin/request-management` | `/admin/email-administration` | Overview | Create (new) |
| - | `/admin/email-administration/getting-started` | Getting Started | Create (new) |
| - | `/admin/email-administration/request-management` | Category Overview | Create (new) |
| `/admin/email-jobs` | `/admin/email-administration/request-management/email-dashboard` | Detail | Migrate + Delete |
| `/admin/email-jobs/testing-guide` | `/admin/email-administration/request-management/testing-and-ops-guide` | Detail | Migrate + Delete |
| - | `/admin/email-administration/configuration` | Category Overview | Create (new) |
| `/admin/email` | `/admin/email-administration/configuration/overview` | (duplicate, remove) | Delete |
| `/admin/email-templates` | `/admin/email-administration/configuration/template-and-brand` | Detail | Migrate + Delete |
| `/admin/email-preview` | `/admin/email-administration/configuration/email-preview` | Detail | Migrate + Delete |
| `/admin/email-subjects` | `/admin/email-administration/configuration/ab-subject-lines` | Detail | Migrate + Delete |
| `/admin/email-recipients` | `/admin/email-administration/configuration/recipient-groups` | Detail | Migrate + Delete |
| `/admin/email-scheduling` | `/admin/email-administration/configuration/email-scheduling` | Detail | Migrate + Delete |
| - | `/admin/email-administration/infrastructure` | Category Overview | Create (new) |
| `/admin/email-infrastructure` | `/admin/email-administration/infrastructure/overview` | (duplicate, remove) | Delete |
| `/admin/email-send` | `/admin/email-administration/infrastructure/send-configuration` | Detail | Migrate + Delete |
| `/admin/email-logs` | `/admin/email-administration/infrastructure/delivery-logs` | Detail | Migrate + Delete |
| `/admin/email-versions` | `/admin/email-administration/infrastructure/version-history` | Detail | Migrate + Delete |
| `/admin/email-security` | `/admin/email-administration/infrastructure/security-audit` | Detail | Migrate + Delete |

---

## 4. PAGE CONTENT DECISIONS

### Email Administration Overview (NEW)
- Consolidates concepts from current "Request Management" overview
- Introduces all three categories with brief descriptions
- Provides entry points to each category + getting started

### Email Administration Getting Started (NEW)
- Follows documentation/strategic-overview/getting-started pattern
- Step-by-step guide: Which category to visit based on role
- Links to each category overview

### Request Management Overview (NEW)
- Extracted from current request-management/page.tsx
- Focus: Day-to-day request handling
- Links: Email Dashboard, Testing & Ops Guide

### Template Configuration Overview (NEW)
- Replaces current `/admin/email` overview
- Focus: Email branding, templates, scheduling
- Links: All 5 configuration pages

### Email Infrastructure Overview (NEW)
- Replaces current `/admin/email-infrastructure` overview
- Focus: Technical health, security, delivery
- Links: All 5 infrastructure pages

---

## 5. NAV DATA STRUCTURE (Updated)

### New emailAdministrationSection Export
```typescript
export const emailAdministrationSection: NavSection = {
  title: "Email Administration",
  icon: Mail,
  items: [
    { href: "/dashboard/admin/email-administration", label: "Overview", icon: Mail },
    { href: "/dashboard/admin/email-administration/getting-started", label: "Getting Started", icon: BookOpen },
    {
      href: "/dashboard/admin/email-administration/request-management",
      label: "Request Management",
      icon: Briefcase,
      children: [
        { href: "/dashboard/admin/email-administration/request-management", label: "Overview", icon: Inbox },
        { href: "/dashboard/admin/email-administration/request-management/email-dashboard", label: "Email Dashboard", icon: LayoutGrid },
        { href: "/dashboard/admin/email-administration/request-management/testing-and-ops-guide", label: "Testing & Ops Guide", icon: ClipboardCheck },
      ],
    },
    {
      href: "/dashboard/admin/email-administration/configuration",
      label: "Template Configuration",
      icon: Palette,
      children: [
        { href: "/dashboard/admin/email-administration/configuration", label: "Overview", icon: Settings },
        { href: "/dashboard/admin/email-administration/configuration/template-and-brand", label: "Template & Brand", icon: Palette },
        { href: "/dashboard/admin/email-administration/configuration/email-preview", label: "Email Preview", icon: Eye },
        { href: "/dashboard/admin/email-administration/configuration/ab-subject-lines", label: "A/B Subject Lines", icon: Zap },
        { href: "/dashboard/admin/email-administration/configuration/recipient-groups", label: "Recipient Groups", icon: Users },
        { href: "/dashboard/admin/email-administration/configuration/email-scheduling", label: "Email Scheduling", icon: Clock },
      ],
    },
    {
      href: "/dashboard/admin/email-administration/infrastructure",
      label: "Email Infrastructure",
      icon: HardDrive,
      children: [
        { href: "/dashboard/admin/email-administration/infrastructure", label: "Overview", icon: HardDrive },
        { href: "/dashboard/admin/email-administration/infrastructure/send-configuration", label: "Send Configuration", icon: Send },
        { href: "/dashboard/admin/email-administration/infrastructure/delivery-logs", label: "Delivery Logs", icon: Activity },
        { href: "/dashboard/admin/email-administration/infrastructure/version-history", label: "Version History", icon: History },
        { href: "/dashboard/admin/email-administration/infrastructure/security-audit", label: "Security Audit", icon: ShieldCheck },
      ],
    },
  ],
}

// Backward compatibility during transition (if needed)
export const emailManagementSection = emailAdministrationSection
```

---

## 6. IMPLEMENTATION TASKS (Session 8)

### Task 1: Directory Structure Setup
- Create `/admin/email-administration/` directory tree (no files yet)
- Create layout files for email-administration, request-management, configuration, infrastructure
- **Ops:** 1

### Task 2: Page Content Migration
- Migrate all 14 existing page files to new locations
- Update imports/paths within pages
- Delete old page files after verification
- **Ops:** 4-5

### Task 3: New Pages Creation
- Create Email Administration Overview page
- Create Email Administration Getting Started page
- Create 3 Category Overview pages (Request Management, Configuration, Infrastructure)
- **Ops:** 3

### Task 4: Nav Data Update
- Replace emailManagementSection with emailAdministrationSection in nav-data.ts
- Update docs-sidebar.tsx import/usage
- Update project-state.ts NAV_ARCHITECTURE
- **Ops:** 1

### Task 5: Validation & Cleanup
- Verify all 19 routes exist and render correctly
- Check breadcrumb navigation works
- Spot-check links from overview pages
- Confirm no broken imports
- Delete any remaining old files/directories
- **Ops:** 1

**Total Estimated Ops: 10 (buffer: -2, but tight execution possible)**

---

## 7. VALIDATION CHECKLIST (Session 8)

### Pre-Execution
- [ ] Confirm all current pages load without errors
- [ ] Screenshot current navigation for reference
- [ ] Verify old routes still work

### Post-Execution
- [ ] All 19 new routes render (no 404s)
- [ ] Sidebar displays "Email Administration" with 3 collapsible subsections
- [ ] Overview pages link correctly to category pages
- [ ] Getting Started page links to all 3 categories
- [ ] No console errors in preview
- [ ] Breadcrumbs display correctly (if implemented)
- [ ] All old routes deleted (confirm with Glob search)
- [ ] No TypeScript errors in nav-data.ts or sidebar component

---

## 8. ROLLBACK PLAN

If errors occur during execution:
1. Revert nav-data.ts changes (swap emailAdministrationSection back to emailManagementSection)
2. Keep new directory structure (doesn't break anything)
3. Restore old pages from deletion if needed (they're still in git history)
4. Update sidebar back to old section references

---

## 9. FILES TO CREATE/MODIFY

### Data Files (.ts, no JSX)
- `data/email-administration-structure.ts` (optional: define category metadata if needed for dynamic menus)

### Component Files (.tsx)
- `/app/dashboard/admin/email-administration/page.tsx` (NEW Overview)
- `/app/dashboard/admin/email-administration/getting-started/page.tsx` (NEW Getting Started)
- `/app/dashboard/admin/email-administration/layout.tsx` (shared layout)
- `/app/dashboard/admin/email-administration/request-management/layout.tsx`
- `/app/dashboard/admin/email-administration/request-management/page.tsx` (NEW Overview)
- `/app/dashboard/admin/email-administration/request-management/email-dashboard/page.tsx` (MIGRATED)
- `/app/dashboard/admin/email-administration/request-management/testing-and-ops-guide/page.tsx` (MIGRATED)
- (Same pattern for configuration/ and infrastructure/ categories)

### Config Files
- `/data/nav-data.ts` (MODIFY: replace emailManagementSection)
- `/components/molecules/docs-sidebar.tsx` (MODIFY: update import/usage)
- `/data/project-state.ts` (MODIFY: update NAV_ARCHITECTURE)

---

## 10. DEFERRED (NOT THIS SESSION)

- Permission checks for Infrastructure section (requires auth implementation)
- Visual dividers in sidebar (UI polish phase)
- Analytics/monitoring for navigation patterns (post-launch)
- Route redirects from old → new URLs (optional, for external links)

---

## EXECUTIVE SUMMARY

This refactor consolidates Email Management from 3 separate sidebar sections into 1 unified "Email Administration" section with 3 nested category pages, mirroring the documentation structure. All 14 existing pages migrate to new nested routes, plus 5 new overview/getting-started pages. Old pages are deleted to avoid caching issues. Expected execution: 10 ops, 1 session (tight but feasible). Quality gates: zero broken routes, correct breadcrumbs, clean navigation hierarchy.
