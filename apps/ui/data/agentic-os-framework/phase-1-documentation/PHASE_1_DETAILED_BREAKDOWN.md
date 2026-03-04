# Phase 1: Responsive Foundation - Detailed Task Breakdown

## Overview
Transform all documentation components from hardcoded widths/spacing to fully dynamic, responsive system using CSS variables, container queries, and Tailwind's responsive utilities.

---

## Task 1.1: Audit & Manifest ✅ COMPLETE
**Status:** DONE
**Deliverables:**
- DOCUMENTATION_COMPONENT_MANIFEST.md created with:
  - All 22 documentation pages listed
  - Core components identified
  - Hardcoded values catalogued
  - Priority matrix established

---

## Task 1.2: Global CSS Infrastructure
**Status:** TO DO
**Objective:** Create CSS variable foundation for all responsive behavior
**Deliverable:** Updated `app/globals.css`

**Variables to Add:**

```css
/* Sidebar Responsive Widths */
--sidebar-width-sm: responsive value for mobile
--sidebar-width-md: responsive value for tablet
--sidebar-width-lg: responsive value for desktop
--sidebar-width-max: 400px (future dragging constraint)

/* Content Area Gaps */
--content-gap-sm: 1rem (mobile)
--content-gap-md: 1.5rem (tablet)
--content-gap-lg: 2.5rem (desktop)

/* Padding & Spacing */
--doc-padding-x-sm: 1rem
--doc-padding-x-md: 1.5rem
--doc-padding-x-lg: 2rem
--doc-padding-y-sm: 2rem
--doc-padding-y-md: 3rem
--doc-padding-y-lg: 3rem

/* Typography */
--font-size-body: responsive with clamp()
--font-size-heading: responsive with clamp()
--line-height-normal: 1.5

/* Layout Constraints */
--max-content-width: 100% (no hardcoding max-w-7xl)
--scroll-offset: 6rem (for anchor scrolling)

/* Container Query Breakpoints */
@container (min-width: 400px) { /* tablet-capable */ }
@container (min-width: 768px) { /* tablet */ }
@container (min-width: 1024px) { /* desktop */ }
@container (min-width: 1280px) { /* ultra-wide */ }
```

**Subtasks:**
- [ ] Define all CSS variables in globals.css `:root`
- [ ] Create media query rules that update variables at breakpoints
- [ ] Add container query declarations
- [ ] Document all variables with comments
- [ ] Add fallback values

**Expected Output:** globals.css with complete CSS variable system

---

## Task 1.3: Refactor Documentation Layout
**Status:** TO DO
**File:** `app/dashboard/documentation/layout.tsx`
**Objective:** Make layout responsive without hardcoded max-width

**Changes Needed:**

```tsx
// Before:
<div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">

// After:
<div className="w-full" style={{ "--doc-padding-x": "var(--doc-padding-x-sm)" }}>
  <div className="mx-auto w-full" style={{ "max-width": "calc(100vw - 2 * var(--doc-padding-x))" }}>
```

Or use Tailwind with CSS variables:
```tsx
<div className="w-screen max-w-[--max-content-width] mx-auto px-[--doc-padding-x]">
```

**Subtasks:**
- [ ] Remove max-w-7xl hardcoding
- [ ] Use CSS variables for all padding
- [ ] Ensure responsive on all viewport sizes
- [ ] Test layout at 320px, 768px, 1024px, 1400px
- [ ] Verify content doesn't overflow

**Expected Output:** Layout wrapper that scales fluidly without hardcoded constraints

---

## Task 1.4: Refactor DocPage Component
**Status:** TO DO
**File:** `components/molecules/doc-page.tsx`
**Objective:** Make TOC sidebar and content area fully responsive

**Critical Changes:**

1. **TOC Sidebar Widths (Line 87)**
```tsx
// Before:
className="hidden md:block sticky top-24 w-40 lg:w-56 shrink-0 self-start"

// After:
className="hidden md:block sticky top-[--scroll-offset] w-[--sidebar-width-md] lg:w-[--sidebar-width-lg] shrink-0 self-start"
```

2. **Flex Gap (Line 143)**
```tsx
// Before:
className="w-full flex gap-6 lg:gap-10"

// After:
className="w-full flex gap-[--content-gap-md] lg:gap-[--content-gap-lg]"
```

3. **Responsive Icon Size (Line 169)**
```tsx
// Before:
className="h-10 w-10"

// After:
className="h-8 w-8 md:h-10 md:w-10"
```

4. **Responsive Typography (Lines 170, 173)**
```tsx
// Before:
<h1 className="text-4xl font-bold">
<p className="text-xl text-muted-foreground">

// After:
<h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
<p className="text-base sm:text-lg md:text-xl text-muted-foreground">
```

**Subtasks:**
- [ ] Replace all hardcoded widths with CSS variables
- [ ] Replace all hardcoded gaps with CSS variables
- [ ] Add responsive font size scaling
- [ ] Test TOC visibility at different breakpoints
- [ ] Verify sticky positioning works on all devices
- [ ] Ensure content flows properly without TOC on mobile

**Expected Output:** DocPage that adapts seamlessly across all screen sizes

---

## Task 1.5: Refactor CodeBlock Component
**Status:** TO DO
**File:** `components/atoms/code-block.tsx`
**Objective:** Make code blocks responsive and overflow-aware

**Changes Needed:**

```tsx
// Replace hardcoded overflow with container-aware approach
// Before:
<div className="relative rounded-lg border border-border bg-muted/30 overflow-hidden">
  <pre className="overflow-x-auto p-4 text-sm leading-relaxed">

// After:
<div className="relative rounded-lg border border-border bg-muted/30 w-full">
  <div className="overflow-x-auto">
    <pre className="p-[--doc-padding-x-sm] sm:p-[--doc-padding-x-md] text-xs sm:text-sm leading-relaxed">
```

**Subtasks:**
- [ ] Make padding responsive (p-2 sm:p-4)
- [ ] Make font size responsive (text-xs sm:text-sm)
- [ ] Make button positioning responsive
- [ ] Use container queries to detect available width
- [ ] Test at various code block widths
- [ ] Verify copy button doesn't overlap on mobile

**Expected Output:** CodeBlock that scales content to fit container

---

## Task 1.6: Refactor Docs Sidebar
**Status:** TO DO
**File:** `components/molecules/docs-sidebar.tsx`
**Objective:** Make sidebar navigation responsive

**Changes Needed:**

```tsx
// Replace hardcoded icon sizes
// Before:
<Icon className={depth > 0 ? "h-2 w-2" : "h-3.5 w-3.5"} />
<span className={depth > 0 ? "text-xs truncate" : "truncate"}>

// After:
<Icon className={depth > 0 ? "h-3 w-3 md:h-2 md:w-2" : "h-4 w-4 md:h-3.5 md:w-3.5"} />
<span className={depth > 0 ? "text-xs md:text-xs" : "text-sm md:text-base"}>
```

**Subtasks:**
- [ ] Make icon sizes responsive
- [ ] Make text sizes responsive
- [ ] Test sidebar at different viewport widths
- [ ] Verify truncation works appropriately
- [ ] Ensure labels display fully when possible

**Expected Output:** Sidebar that scales appropriately from mobile to desktop

---

## Task 1.7: Create Responsive Utilities
**Status:** TO DO
**File:** New `lib/responsive-utils.css` or additions to `globals.css`
**Objective:** Provide reusable responsive patterns

**Utilities to Create:**
```css
/* Responsive typography helpers */
.text-balance-clamp-sm-lg { font-size: clamp(0.875rem, 2vw, 1.125rem); }
.text-balance-clamp-md-xl { font-size: clamp(1rem, 2.5vw, 1.25rem); }

/* Responsive gap helpers */
.gap-responsive { gap: clamp(1rem, 4vw, 2.5rem); }

/* Responsive padding helpers */
.px-responsive { padding-left: clamp(1rem, 2vw, 2rem); padding-right: clamp(1rem, 2vw, 2rem); }
.py-responsive { padding-top: clamp(2rem, 4vw, 3rem); padding-bottom: clamp(2rem, 4vw, 3rem); }

/* Container queries for responsive behavior */
@supports (container-type: inline-size) {
  .container-aware { container-type: inline-size; }
}
```

**Subtasks:**
- [ ] Define responsive utility classes
- [ ] Add container query support classes
- [ ] Document usage patterns
- [ ] Test utilities across all breakpoints

**Expected Output:** Utility CSS file with reusable responsive patterns

---

## Task 1.8: Comprehensive Testing & Validation
**Status:** TO DO
**Objective:** Verify all pages responsive without horizontal scroll

**Test Matrix:**

| Breakpoint | Device | Pages to Test |
|-----------|--------|---------------|
| 320px | iPhone SE | All 22 pages |
| 375px | iPhone 12 | All 22 pages |
| 425px | Galaxy A50 | All 22 pages |
| 600px | Tablet portrait | All 22 pages |
| 768px | Tablet landscape | All 22 pages |
| 1024px | iPad Pro | All 22 pages |
| 1440px | Desktop | All 22 pages |
| 1920px | Ultra-wide | Sample pages |

**Validation Checklist:**
- [ ] No horizontal scrollbars at any breakpoint
- [ ] TOC shows/hides appropriately
- [ ] Text remains readable at all sizes
- [ ] Content doesn't overflow containers
- [ ] Code blocks display properly
- [ ] Tables scroll horizontally only when needed (on their own, not whole page)
- [ ] Images scale appropriately
- [ ] Sidebars don't collapse content unexpectedly
- [ ] Responsive transitions are smooth (no jarring jumps)

**Pages Priority for Testing:**
1. Content Collections (has tables, complex content)
2. Form Collections (has tables)
3. Getting Started pages (longer content)
4. Component System (has lots of content)
5. All other pages

**Expected Output:** Testing report with pass/fail for each page and breakpoint

---

## Success Criteria - Phase 1 Complete

✅ **Must Have:**
- [ ] All hardcoded widths removed
- [ ] All hardcoded gaps/padding use CSS variables
- [ ] No horizontal scroll at 320px viewport
- [ ] No horizontal scroll at 1920px viewport
- [ ] TOC hides on mobile, shows on tablet+
- [ ] Content flows smoothly without TOC on mobile
- [ ] Code blocks display properly
- [ ] All 22 pages tested and working

✅ **Should Have:**
- [ ] CSS variables defined for future dragging
- [ ] Container queries implemented
- [ ] Responsive typography with clamp()
- [ ] All utilities documented

✅ **Nice to Have:**
- [ ] Smooth transitions between breakpoints
- [ ] Optimized performance (no layout thrashing)
- [ ] Documentation of responsive patterns

---

## Implementation Order

1. **Task 1.2** - Global CSS Infrastructure (foundation)
2. **Task 1.3** - Documentation Layout (top-level wrapper)
3. **Task 1.4** - DocPage Component (main content)
4. **Task 1.5** - CodeBlock Component (content display)
5. **Task 1.6** - Docs Sidebar (navigation)
6. **Task 1.7** - Responsive Utilities (helpers)
7. **Task 1.8** - Testing & Validation (QA)

---

## Estimated Complexity

| Task | Complexity | Files Affected | Estimated Lines Changed |
|------|-----------|-----------------|------------------------|
| 1.2 | HIGH | globals.css | +150 lines |
| 1.3 | LOW | documentation/layout.tsx | ~10 lines |
| 1.4 | HIGH | doc-page.tsx | ~40 lines |
| 1.5 | MEDIUM | code-block.tsx | ~20 lines |
| 1.6 | MEDIUM | docs-sidebar.tsx | ~30 lines |
| 1.7 | MEDIUM | globals.css | +100 lines |
| 1.8 | LOW | Testing only | 0 lines (validation) |

**Total Estimated Changes:** ~250-350 lines across 5-7 files

---

## Notes for Implementation

1. **CSS Variables First** - Task 1.2 is foundational; all other tasks depend on it
2. **Mobile-First Mindset** - Define base (mobile) styles, then enhance with media queries
3. **No Pixel Perfect** - Responsive design allows flexibility; test readability not pixel accuracy
4. **Container Queries Optional** - If browsers don't support, fallback to media queries
5. **Future Dragging Ready** - `--sidebar-width-max` variable reserves space for future drag handler
6. **Backward Compatibility** - All changes are additive; existing functionality preserved

---

## Approval Needed

Before starting implementation:

- [ ] Review manifest and confirm component list is complete
- [ ] Approve CSS variable naming convention
- [ ] Confirm responsive breakpoints (sm, md, lg, xl)
- [ ] Agree on mobile-first approach
- [ ] Confirm no hardcoded values to remain
- [ ] Approve task order and complexity estimates

**Next Step:** Await user approval of this plan before Phase 1 implementation begins.
