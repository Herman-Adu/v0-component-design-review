# Documentation Component Audit & Manifest

## Session Metrics
- **Created:** 2026-02-12
- **Token Usage:** ~110,000 / 200,000 (55% utilized)
- **Status:** Phase 1 Planning - Manifest Complete

---

## Overview

This manifest documents all components used in the documentation section, their current responsiveness state, hardcoded values, and required fixes for Phase 1: Responsive Foundation.

---

## Core Layout Components

### 1. Documentation Layout (`app/dashboard/documentation/layout.tsx`)
**Status:** ⚠️ NEEDS REFACTORING
**Purpose:** Top-level wrapper for all documentation pages
**Current Implementation:**
```
- max-w-7xl (HARDCODED - should be dynamic/responsive)
- px-4 sm:px-6 (HARDCODED - should use CSS variables)
- py-8 sm:py-12 (HARDCODED - should use CSS variables)
```
**Issues:**
- [ ] Fixed max-width breaks fluid responsiveness on very large screens
- [ ] Padding values don't adapt to sidebar width changes
- [ ] No container query implementation
- [ ] No CSS variables for dynamic theming

**Priority:** CRITICAL (foundational for all pages)

---

### 2. DashboardShell (`components/molecules/dashboard-shell.tsx`)
**Status:** ✅ CLEAN (minimal constraints)
**Purpose:** Dashboard container wrapping documentation pages
**Current Implementation:**
```
- flex-1 bg-background (good - no hardcoded sizes)
```
**Issues:** None identified
**Priority:** LOW (no changes needed)

---

## Documentation Display Components

### 3. DocPage Component (`components/molecules/doc-page.tsx`)
**Status:** ⚠️ NEEDS REFACTORING
**Purpose:** Main content wrapper with optional TOC sidebar, header, badges
**Current Implementation:**
```
Line 143: w-full flex gap-6 lg:gap-10 (HARDCODED gaps)
Line 145: flex-1 min-w-0 overflow-x-hidden (good structure, but gaps are fixed)
Line 87:  w-40 lg:w-56 (HARDCODED TOC widths)
Line 88:  hidden md:block (breakpoint - OK but could be CSS variable)
```
**Issues:**
- [ ] TOC sidebar has fixed widths (w-40, w-56) - should be percentage/css variable
- [ ] Gap between content and TOC is hardcoded (gap-6, gap-10)
- [ ] No container query implementation for responsive reflow
- [ ] md: breakpoint hardcoded - should allow customization
- [ ] TOC scroll margin (scroll-mt-24) is hardcoded

**Sub-components:**
- **DocTOC (line 57)** - TOC sidebar render logic
- **DocSectionHeader (function)** - Section heading helper with scroll anchor

**Priority:** CRITICAL (affects all content pages)

---

### 4. CodeBlock Component (`components/atoms/code-block.tsx`)
**Status:** ⚠️ NEEDS REFACTORING
**Purpose:** Code display with copy button
**Current Implementation:**
```
- overflow-x-auto (HARDCODED - should be container query aware)
- p-4 (HARDCODED padding)
- text-sm (HARDCODED font size)
- absolute top-2 right-2 (HARDCODED positioning)
```
**Issues:**
- [ ] overflow-x-auto doesn't account for available container width
- [ ] Padding and font size don't scale with viewport
- [ ] Copy button positioning may overlap content on small screens
- [ ] No responsive text sizing
- [ ] Should use container queries to detect parent width

**Priority:** HIGH (used in every code example)

---

### 5. Docs Sidebar Component (`components/molecules/docs-sidebar.tsx`)
**Status:** ⚠️ NEEDS REFACTORING
**Purpose:** Left navigation sidebar for documentation
**Current Implementation:**
```
- Uses Radix Sidebar component (responsive framework)
- No explicit hardcoded widths visible in initial scan
- Nested items with depth-based sizing (h-2 w-2, h-3.5 w-3.5)
```
**Issues:**
- [ ] Icon sizes are hardcoded per depth level (h-2 w-2, h-3.5 w-3.5)
- [ ] text-xs for depth > 0 is hardcoded
- [ ] No container queries for responsive behavior
- [ ] When TOC sidebar exists, layout may crowd this component
- [ ] Collapsible states may not persist on viewport changes

**Priority:** MEDIUM (navigation works, but not optimal when sidebar draggable)

---

## Utility Components Used

### 6. Badge Component (`components/ui/badge.tsx`)
**Status:** ✅ CHECK (likely responsive in shadcn)
**Purpose:** Display category/tag badges
**Used in:** DocPage header
**Issues:** 
- [ ] Verify it doesn't have hardcoded sizing
- [ ] Check responsive font scaling

**Priority:** LOW (shadcn components usually responsive)

---

### 7. Table Component (`components/ui/table.tsx`)
**Status:** ⚠️ NEEDS AUDIT
**Purpose:** Display schema tables in content
**Used in:** Content Collections, Relationships pages
**Issues:**
- [ ] May have hardcoded cell widths
- [ ] scroll-x containers may not be responsive
- [ ] Column widths don't adapt to viewport

**Priority:** MEDIUM (affects content readability)

---

### 8. Card Component (`components/ui/card.tsx`)
**Status:** ✅ CHECK (likely responsive)
**Purpose:** Display content cards
**Used in:** Overview/hub pages
**Issues:**
- [ ] Verify no hardcoded widths
- [ ] Check grid layouts on different screens

**Priority:** LOW (shadcn component)

---

## Page Templates (22 Documentation Pages)

### Strategic Overview Section (5 pages)
- overview/page.tsx (hub - no TOC)
- getting-started/page.tsx (hub - no TOC)
- app-overview/page.tsx
- why-strapi/page.tsx
- code-review-log/page.tsx

**Status:** ⚠️ Hub pages may have hardcoded widths in content areas

---

### CMS Reference Section (7 pages)
- overview/page.tsx (hub - no TOC)
- getting-started/page.tsx (has SECTIONS - TOC enabled)
- form-collections/page.tsx (has SECTIONS)
- content-collections/page.tsx (has SECTIONS)
- single-types/page.tsx (has SECTIONS)
- shared-components/page.tsx (has SECTIONS)
- relationships/page.tsx (has SECTIONS)

**Status:** ✅ SECTIONS arrays correct | ⚠️ Content widths may be hardcoded

---

### App Reference Section (9 pages)
- overview/page.tsx (hub - no TOC)
- getting-started/page.tsx (has SECTIONS)
- component-system/page.tsx (has SECTIONS)
- email-system/page.tsx (has SECTIONS)
- hydration-and-guards/page.tsx (has SECTIONS)
- performance-and-caching/page.tsx (has SECTIONS)
- security-architecture/page.tsx (has SECTIONS)
- server-actions-and-api/page.tsx (has SECTIONS)
- server-vs-client/page.tsx (has SECTIONS)

**Status:** ✅ SECTIONS arrays correct | ⚠️ Content widths may be hardcoded

---

### Infrastructure & Ops Section (7 pages)
- overview/page.tsx (hub - no TOC)
- getting-started/page.tsx (has SECTIONS)
- api-and-graphql/page.tsx (has SECTIONS)
- cms-operations/page.tsx (has SECTIONS)
- testing-strategy/page.tsx (has SECTIONS)
- deployment/page.tsx (has SECTIONS)
- troubleshooting/page.tsx (has SECTIONS)

**Status:** ✅ SECTIONS arrays correct | ⚠️ Content widths may be hardcoded

---

## CSS/Styling Layers

### globals.css
**Status:** ⚠️ NEEDS EXTENSION
**Current:** Basic Tailwind v4 setup with theme variables
**Missing:**
- [ ] Container query definitions
- [ ] CSS variables for sidebar width (--sidebar-width)
- [ ] CSS variables for responsive padding/gaps (--doc-padding, --doc-gap)
- [ ] Container query breakpoints
- [ ] Responsive typography clamp() functions
- [ ] Transition classes for smooth layout changes

**Priority:** CRITICAL (foundation for all responsive work)

---

## Hardcoded Values Summary

### High Priority (Block mobile responsiveness)
| Component | Value | Type | Location |
|-----------|-------|------|----------|
| DocPage | w-40, w-56 | TOC widths | line 87 |
| DocPage | gap-6, gap-10 | flex gap | line 143 |
| CodeBlock | overflow-x-auto | layout | line 21 |
| CodeBlock | p-4 | padding | line 21 |
| CodeBlock | text-sm | font size | line 22 |
| CodeBlock | top-2 right-2 | button position | line 29 |

### Medium Priority (Affect optimization)
| Component | Value | Type | Location |
|-----------|-------|------|----------|
| Docs Sidebar | h-2 w-2, h-3.5 w-3.5 | icon sizes | lines 63, 76 |
| Docs Sidebar | text-xs | font size | line 64 |
| DocPage | scroll-mt-24 | scroll margin | DocSectionHeader |
| Documentation Layout | max-w-7xl | max width | app/dashboard/documentation/layout.tsx |
| Documentation Layout | px-4 sm:px-6 | padding | app/dashboard/documentation/layout.tsx |

### Low Priority (Nice to fix)
| Component | Value | Type | Location |
|-----------|-------|------|----------|
| DocPage | h-10 w-10 | icon size | line 169 |
| DocPage | text-4xl | heading size | line 170 |
| DocPage | text-xl | description size | line 173 |

---

## Phase 1 Refactoring Checklist

### 1.1 Audit Components ✅ DONE

### 1.2 Create Global CSS Infrastructure
- [ ] Define CSS variables in globals.css:
  - `--doc-sidebar-width-sm`: mobile sidebar width
  - `--doc-sidebar-width-md`: tablet sidebar width  
  - `--doc-sidebar-width-lg`: desktop sidebar width
  - `--doc-sidebar-max-width`: max sidebar width (for dragging future)
  - `--doc-content-gap-sm`: mobile gap between TOC and content
  - `--doc-content-gap-md`: tablet gap
  - `--doc-content-gap-lg`: desktop gap
  - `--doc-padding-x`: responsive horizontal padding
  - `--doc-padding-y`: responsive vertical padding
  - `--doc-max-content-width`: max width for content area
  - `--scroll-offset-sm/md/lg`: scroll margin offsets
- [ ] Define container queries in globals.css
- [ ] Define responsive typography with clamp()

### 1.3 Refactor Documentation Layout
- [ ] Remove max-w-7xl hardcoding
- [ ] Use CSS variables for all spacing
- [ ] Implement container query wrapper
- [ ] Add responsive padding based on viewport

### 1.4 Refactor DocPage Component
- [ ] Replace w-40, w-56 with CSS variables or percentages
- [ ] Replace gap-6, gap-10 with responsive CSS variables
- [ ] Implement container queries for TOC visibility
- [ ] Dynamic md: breakpoint from CSS variable
- [ ] Responsive gap sizing with clamp()
- [ ] Responsive font sizes with clamp()

### 1.5 Refactor CodeBlock Component
- [ ] Remove hardcoded overflow-x-auto assumption
- [ ] Use container queries for responsive overflow
- [ ] Responsive padding with clamp()
- [ ] Responsive font size with clamp()
- [ ] Responsive button positioning
- [ ] Mobile-optimized copy button placement

### 1.6 Refactor Docs Sidebar
- [ ] Dynamic icon sizes based on viewport
- [ ] Responsive text sizing
- [ ] Container queries for depth-based styling
- [ ] Responsive collapsible behavior

### 1.7 Create Responsive Utilities
- [ ] Add Tailwind container query plugin if needed
- [ ] Create helper classes for common patterns
- [ ] Document responsive patterns for future use

### 1.8 Test All Pages
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1024px)
- [ ] Ultra-wide (1400px+)
- [ ] Verify no horizontal scroll at any breakpoint

---

## Future Phases

### Phase 2: Mobile-First Implementation
Once Phase 1 refactoring complete, implement mobile-first approach ensuring base mobile styles work everywhere, then enhance with media queries for larger screens.

### Phase 3: Smooth Transitions & Polish
Add CSS transitions, animations, and optimize for 60fps on layout changes.

### Phase 4: Draggable Sidebar Structure
Set up CSS Grid with `--sidebar-width` variable ready for JavaScript drag handler.

---

## Notes

- All 22 documentation pages use DocPage component
- 17 pages have TOC (have SECTIONS prop)
- 5 pages are hubs without TOC (no SECTIONS prop)
- No pages currently broken, but many have suboptimal responsiveness
- Token budget: 95,000 remaining - sufficient for Phase 1

---

## Approval Checklist

Before Phase 1 implementation:
- [ ] Manifest reviewed and approved
- [ ] Priority order agreed upon
- [ ] CSS variables naming convention approved
- [ ] Container query strategy agreed upon
- [ ] Responsive breakpoints defined (sm, md, lg, xl)
- [ ] Future draggable sidebar constraints discussed
