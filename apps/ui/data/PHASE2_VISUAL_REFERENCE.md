# Documentation System - Responsive Refactor Plan (Visual Overview)

## Current State vs Target State

### CURRENT STATE (Hardcoded)
```
┌─ Documentation Layout ──────────────────────────┐
│  max-w-7xl, px-4 sm:px-6, py-8 sm:py-12        │
├──────────────────────────────────────────────────┤
│  ┌─ DocPage flex gap-6 lg:gap-10 ──────────┐   │
│  │ ┌─────────────┬─ TOC (w-40/w-56) ─────┐ │   │
│  │ │  Content    │ - "On This Page"  │ │ │   │
│  │ │  flex-1     │ - Section 1 link  │ │ │   │
│  │ │             │ - Section 2 link  │ │ │   │
│  │ │ PROBLEMS:   │ - Section 3 link  │ │ │   │
│  │ │ - Hardcoded │   (w-40 TOO NARROW)   │ │   │
│  │ │ - Not mobile│                       │ │   │
│  │ │ - Can't drag│ ┌─ Sticky (top-24) ┐ │ │   │
│  │ │             │ │ on md: breakpoint│ │ │   │
│  │ │             │ └──────────────────┘ │ │   │
│  │ └─────────────┴───────────────────────┘ │   │
│  │                                          │   │
│  │ CodeBlock with overflow-x-auto          │   │
│  │ (fixed padding, fixed font size)        │   │
│  │                                          │   │
│  │ Tables with scroll-x-auto                │   │
│  │ (hardcoded cell widths)                 │   │
│  │                                          │   │
│  │ Docs Sidebar (left)                      │   │
│  │ h-2 w-2 / h-3.5 w-3.5 icons            │   │
│  │ text-xs / default text                  │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

### TARGET STATE (Dynamic/Responsive)
```
MOBILE (320px)
┌────────────────────────────────────────┐
│ Documentation Layout (fluid padding)   │
├────────────────────────────────────────┤
│ DocPage (full width, no TOC)           │
│ ┌──────────────────────────────────┐  │
│ │ Content                          │  │
│ │ flex-1, responsive typography   │  │
│ │                                  │  │
│ │ CodeBlock                        │  │
│ │ (p-2 sm:p-4, text-xs sm:text-sm)│  │
│ │                                  │  │
│ │ Responsive sidebar icons         │  │
│ │ (h-3 w-3 md:h-2 md:w-2)        │  │
│ └──────────────────────────────────┘  │
└────────────────────────────────────────┘

TABLET (768px)
┌────────────────────────────────────────────────┐
│ Documentation Layout                           │
├────────────────────────────────────────────────┤
│ ┌──────────────┬─────── TOC ────────────────┐ │
│ │  Content     │ "On This Page"            │ │
│ │  flex-1      │ (w-[--sidebar-width-md])  │ │
│ │              │ - Section 1               │ │
│ │  gap-[--     │ - Section 2               │ │
│ │  content-    │ - Section 3               │ │
│ │  gap-md]     │                           │ │
│ │              │ Sticky (top-[--scroll-   │ │
│ │ CodeBlock    │ offset], md:block)        │ │
│ │ (responsive) │                           │ │
│ │              │ Ready for drag (future)  │ │
│ │              │ max: --sidebar-width-max │ │
│ └──────────────┴───────────────────────────┘ │
└────────────────────────────────────────────────┘

DESKTOP (1024px+)
┌──────────────────────────────────────────────────────┐
│ Documentation Layout (fluid, scales with content)    │
├──────────────────────────────────────────────────────┤
│ ┌─────────────┬────────── TOC (Larger) ──────────┐  │
│ │  Content    │ "On This Page"                   │  │
│ │  flex-1     │ (w-[--sidebar-width-lg])         │  │
│ │             │ - Section 1                      │  │
│ │ Larger gap- │ - Section 2                      │  │
│ │ [--content- │ - Section 3                      │  │
│ │ gap-lg]     │ - Section 4                      │  │
│ │             │                                  │  │
│ │ Responsive  │ Sticky positioning smooth        │  │
│ │ CodeBlock   │                                  │  │
│ │ with clamp()│ Ready for user drag (Phase 4)   │  │
│ │ font sizing │ Resize sidebar: content expands │  │
│ └─────────────┴──────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

---

## CSS Variables System

```css
/* SIZING VARIABLES */
:root {
  /* Sidebar widths (responsive per breakpoint) */
  --sidebar-width-sm: 0;           /* hidden on mobile */
  --sidebar-width-md: 160px;       /* md: breakpoint */
  --sidebar-width-lg: 224px;       /* lg: breakpoint */
  --sidebar-width-max: 400px;      /* max for dragging */
  
  /* Content area gaps */
  --content-gap-sm: 1rem;          /* 16px mobile */
  --content-gap-md: 1.5rem;        /* 24px tablet */
  --content-gap-lg: 2.5rem;        /* 40px desktop */
  
  /* Padding */
  --doc-padding-x-sm: 1rem;        /* 16px mobile */
  --doc-padding-x-md: 1.5rem;      /* 24px tablet */
  --doc-padding-x-lg: 2rem;        /* 32px desktop */
  --doc-padding-y: clamp(2rem, 4vw, 3rem);
  
  /* Typography */
  --scroll-offset: 6rem;           /* for anchor links */
  --font-size-body: clamp(1rem, 2vw, 1.125rem);
}

/* Update variables at breakpoints */
@media (min-width: 768px) {
  :root {
    --sidebar-width: var(--sidebar-width-md);
    --content-gap: var(--content-gap-md);
  }
}

@media (min-width: 1024px) {
  :root {
    --sidebar-width: var(--sidebar-width-lg);
    --content-gap: var(--content-gap-lg);
  }
}
```

---

## Component Transformation

### Before: DocPage (Hardcoded)
```tsx
<div className="w-full flex gap-6 lg:gap-10">
  <div className="flex-1 min-w-0 space-y-10 overflow-x-hidden">
    {/* Content */}
    <h1 className="text-4xl font-bold">{title}</h1>
    <p className="text-xl text-muted-foreground">{description}</p>
  </div>
  
  {sections && (
    <nav className="hidden md:block sticky top-24 w-40 lg:w-56 shrink-0">
      {/* TOC */}
    </nav>
  )}
</div>
```

### After: DocPage (Responsive with CSS Variables)
```tsx
<div className="w-full flex gap-[--content-gap-md] lg:gap-[--content-gap-lg]">
  <div className="flex-1 min-w-0 space-y-10 overflow-x-hidden">
    {/* Content */}
    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">{title}</h1>
    <p className="text-base sm:text-lg md:text-xl text-muted-foreground">{description}</p>
  </div>
  
  {sections && (
    <nav className="hidden md:block sticky top-[--scroll-offset] 
                    w-[--sidebar-width-md] lg:w-[--sidebar-width-lg] 
                    shrink-0">
      {/* TOC - Ready for dragging! */}
    </nav>
  )}
</div>
```

---

## Phase 1 Implementation Flowchart

```
START: Phase 1 Responsive Foundation
  ↓
Task 1.2: Global CSS Infrastructure
  • Define all CSS variables
  • Create media query breakpoints
  • Test variable values
  ↓ [globals.css updated]
  ↓
Task 1.3: Documentation Layout
  • Remove max-w-7xl hardcoding
  • Use CSS variables for padding
  • Test layout responsiveness
  ↓ [layout.tsx updated]
  ↓
Task 1.4: DocPage Component
  • Replace hardcoded widths (w-40, w-56)
  • Use CSS variables for gaps
  • Add responsive typography
  • Test all pages with TOC
  ↓ [doc-page.tsx updated]
  ↓
Task 1.5: CodeBlock Component
  • Make padding responsive
  • Make font size responsive
  • Handle overflow dynamically
  ↓ [code-block.tsx updated]
  ↓
Task 1.6: Docs Sidebar
  • Responsive icon sizes
  • Responsive text sizes
  ↓ [docs-sidebar.tsx updated]
  ↓
Task 1.7: Responsive Utilities
  • Create helper classes
  • Document patterns
  ↓ [globals.css extended]
  ↓
Task 1.8: Testing & Validation
  • Test all 22 pages
  • Test all 8 breakpoints
  • Verify no horizontal scroll
  • Check TOC behavior
  ↓
Phase 1 COMPLETE ✅
  ↓
Phase 2: Mobile-First Implementation (next)
```

---

## Future: Phase 4 - Draggable Sidebar (Preview)

```css
/* Once Phase 1 complete, Phase 4 uses same variables */

/* CSS Grid instead of Flex */
.doc-container {
  display: grid;
  grid-template-columns: [sidebar] var(--sidebar-width) [content] 1fr;
  /* --sidebar-width controlled by JavaScript on drag */
}

/* User drags handle to resize */
<div className="resize-handle" 
     onMouseDown={handleDragStart}
     onTouchStart={handleDragStart}
/>

/* Drag updates CSS variable */
function handleDrag(dx) {
  const newWidth = Math.max(
    parseFloat(css.get('--sidebar-width-min')),
    Math.min(
      parseFloat(css.get('--sidebar-width-max')),
      currentWidth + dx
    )
  );
  root.style.setProperty('--sidebar-width', `${newWidth}px`);
}

/* Everything reflows automatically! */
/* Thanks to Phase 1 CSS variable setup */
```

---

## File Update Summary

| File | Current State | Changes | Impact |
|------|---------------|---------|--------|
| `globals.css` | Basic styles | +250 lines CSS variables & utilities | Foundation |
| `layout.tsx` (doc) | max-w-7xl hardcoded | Use CSS variables | Layout wrapper |
| `doc-page.tsx` | w-40, w-56, gap-6 hardcoded | Use CSS vars, responsive text | 17 pages |
| `code-block.tsx` | p-4, text-sm hardcoded | Use clamp(), responsive | All code blocks |
| `docs-sidebar.tsx` | h-2 w-2 hardcoded | Responsive sizes | Navigation |

---

## Success Visualization

### Breakpoint Scaling (Before vs After)

**Before (Hardcoded):**
```
Mobile (320px)     Tablet (768px)     Desktop (1024px)
[   Content   ]    [  Content  ][TOC] [  Content   ][TOC]
                   (TOC w-40!)        (TOC w-56!)
PROBLEM: TOC too narrow, content crowded
```

**After (Responsive):**
```
Mobile (320px)     Tablet (768px)     Desktop (1024px)
[     Content     ][Content][TOC]     [Content  ][Wider TOC]
(No TOC)          (md:block)          (lg:wider)
(Full width!)     (balanced)          (generous space)

All gaps, padding, fonts scale smoothly
No jumpy transitions
Ready for sidebar dragging
```

---

## Summary

**Phase 1 transforms documentation from:**
- ❌ Hardcoded pixel values
- ❌ Fixed breakpoints
- ❌ Layout issues on mobile/ultra-wide

**To:**
- ✅ Dynamic CSS variables
- ✅ Responsive breakpoints
- ✅ Seamless scaling across all devices
- ✅ Foundation ready for Phase 4 dragging

**All 22 pages automatically responsive with single CSS variable system.**
