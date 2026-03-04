# v0 Rules: UI Audit (Web Interface Guidelines)

**Last modified:** Session 52 (2026-02-10) -- Adapted from vercel-labs/web-interface-guidelines
**Load when:** Building or reviewing any UI page. Run against migration batches as quality gate.

---

## How to Use

After writing/migrating a page, read it back and check against these rules. Log findings in review-log using `file:line` format. Group by file.

## Rules Checklist

### Accessibility
- [ ] Icon-only buttons have `aria-label`
- [ ] Form controls have `<label>` or `aria-label`
- [ ] Interactive elements have keyboard handlers
- [ ] `<button>` for actions, `<a>`/`<Link>` for navigation (not `<div onClick>`)
- [ ] Images have `alt` (or `alt=""` if decorative)
- [ ] Decorative icons have `aria-hidden="true"`
- [ ] Semantic HTML (`<main>`, `<nav>`, `<header>`, `<section>`) before ARIA
- [ ] Headings hierarchical h1-h6
- [ ] `scroll-margin-top` on heading anchors

### Focus States
- [ ] Interactive elements have visible focus: `focus-visible:ring-*`
- [ ] Never `outline-none` without focus replacement
- [ ] Use `:focus-visible` over `:focus`

### Forms
- [ ] Inputs have `autocomplete` and meaningful `name`
- [ ] Correct `type` (`email`, `tel`, `url`, `number`)
- [ ] Never block paste
- [ ] Labels clickable (`htmlFor` or wrapping control)
- [ ] Submit button enabled until request starts; spinner during request
- [ ] Errors inline next to fields; focus first error on submit
- [ ] Warn before navigation with unsaved changes

### Animation
- [ ] Honor `prefers-reduced-motion`
- [ ] Animate `transform`/`opacity` only (compositor-friendly)
- [ ] Never `transition: all` -- list properties explicitly
- [ ] Animations interruptible

### Typography
- [ ] Ellipsis character not three dots
- [ ] Curly quotes not straight quotes
- [ ] `font-variant-numeric: tabular-nums` for number columns
- [ ] `text-wrap: balance` or `text-pretty` on headings

### Content Handling
- [ ] Text containers handle long content: `truncate`, `line-clamp-*`, or `break-words`
- [ ] Flex children have `min-w-0` for truncation
- [ ] Empty states handled -- no broken UI for empty arrays/strings
- [ ] User-generated content: anticipate short, average, and very long inputs

### Images
- [ ] Explicit `width` and `height` (prevents CLS)
- [ ] Below-fold: `loading="lazy"`
- [ ] Above-fold critical: `priority` or `fetchpriority="high"`

### Performance
- [ ] Large lists (>50 items): virtualize
- [ ] No layout reads in render (`getBoundingClientRect`, `offsetHeight`)
- [ ] Prefer uncontrolled inputs; controlled must be cheap per keystroke

### Dark Mode
- [ ] `color-scheme: dark` on `<html>` for dark themes
- [ ] `<meta theme-color>` matches page background
- [ ] Native `<select>`: explicit `background-color` and `color`

### Hydration Safety
- [ ] Inputs with `value` have `onChange` (or use `defaultValue`)
- [ ] Date/time rendering: guard against hydration mismatch
- [ ] `suppressHydrationWarning` only where truly needed

### Anti-patterns (flag these immediately)
- `user-scalable=no` or `maximum-scale=1`
- `onPaste` with `preventDefault`
- `transition: all`
- `outline-none` without focus-visible replacement
- Inline `onClick` navigation without `<Link>`
- `<div>` or `<span>` with click handlers (should be `<button>`)
- Images without dimensions
- Large arrays `.map()` without virtualization
- Form inputs without labels
- Icon buttons without `aria-label`

## Output Format for Review Log

```
## app/dashboard/page.tsx
app/dashboard/page.tsx:42 - icon button missing aria-label
app/dashboard/page.tsx:55 - animation missing prefers-reduced-motion

## components/card.tsx
PASS
```
