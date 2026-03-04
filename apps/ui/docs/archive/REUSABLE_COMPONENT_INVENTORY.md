# Reusable Component Inventory — Governance & Reuse First Discipline

**Status:** Component Registry (Feb 28, 2026)  
**Authority:** Canonical component governance and reuse rules  
**Extends:** STRAPI_DYNAMIC_ZONES_AUTHORITY.md  
**Last Updated:** 2026-02-28

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Component Taxonomy (Atoms → Organisms)](#component-taxonomy-atoms--organisms)
3. [Block Components (Dynamic Zone Registry)](#block-components-dynamic-zone-registry)
4. [Reuse-First Discipline](#reuse-first-discipline)
5. [Component Creation Checklist](#component-creation-checklist)
6. [Deprecation & Sunset Policy](#deprecation--sunset-policy)

---

## Executive Summary

All UI components follow a **strict reuse-first discipline**. New components are created only when:

1. ✅ Comprehensive audit of existing components confirms NO viable alternative
2. ✅ Formal proposal document submitted with reuse-first justification
3. ✅ Senior architect + tech lead approval obtained
4. ✅ Component added to this inventory with governance field

**Non-Negotiables:**

- Reuse existing components whenever possible, even if 80% match ≠ 100% match
- Custom styling / CSS variations are preferred over new components
- Prop variations (conditional rendering) are preferred over new components
- Break compound components into simpler atoms when possible (composition over inheritance)
- Every component must have clear ownership and last reviewed date

---

## Component Taxonomy (Atoms → Organisms)

Components follow atomic design principles with clear boundaries.

### Atomic Design Model

```
Atoms (smallest, reusable UI elements)
├── Text
├── Button
├── Input
├── Select
└── ...

Molecules (simple composites of atoms)
├── Form Controls (Input + Label)
├── Cards (Container + Text)
├── Navigation Items (Button + Icon)
└── ...

Organisms (complex composites)
├── Navigation Bar
├── Article List
├── Form Layout
└── ...

Layouts (page-level containers)
├── Dashboard Layout
├── Documentation Layout
└── ...
```

### Atom Components (Foundation Layer)

| Component | Purpose                               | File                           | Status        | Owner    | Last Reviewed |
| --------- | ------------------------------------- | ------------------------------ | ------------- | -------- | ------------- |
| `Text`    | Generic text rendering, semantic HTML | `components/atoms/Text.tsx`    | ✅ Production | Frontend | 2026-02-28    |
| `Button`  | Clickable action element              | `components/atoms/Button.tsx`  | ✅ Production | Frontend | 2026-02-28    |
| `Input`   | Text/email/password input             | `components/atoms/Input.tsx`   | ✅ Production | Frontend | 2026-02-28    |
| `Select`  | Dropdown/select input                 | `components/atoms/Select.tsx`  | ✅ Production | Frontend | 2026-02-28    |
| `Label`   | Form label wrapper                    | `components/atoms/Label.tsx`   | ✅ Production | Frontend | 2026-02-28    |
| `Badge`   | Small label tag                       | `components/atoms/Badge.tsx`   | ✅ Production | Frontend | 2026-02-28    |
| `Icon`    | SVG icon wrapper                      | `components/atoms/Icon.tsx`    | ✅ Production | Frontend | 2026-02-28    |
| `Link`    | Styled anchor/navigation link         | `components/atoms/Link.tsx`    | ✅ Production | Frontend | 2026-02-28    |
| `Divider` | Horizontal or vertical separator      | `components/atoms/Divider.tsx` | ✅ Production | Frontend | 2026-02-28    |
| `Code`    | Inline code span, syntax highlighting | `components/atoms/Code.tsx`    | ✅ Production | Frontend | 2026-02-28    |

**Reuse Rules:**

- Never create `PrimaryButton`, `SecondaryButton` — use `Button` with `variant` prop
- Never create `EmailInput`, `PasswordInput` — use `Input` with `type` prop
- Never create `ErrorText`, `SuccessText` — use `Text` with `color` prop

### Molecule Components (Common Compositions)

| Component     | Composition                         | Purpose                | File                                   | Status        | Owner    | Last Reviewed |
| ------------- | ----------------------------------- | ---------------------- | -------------------------------------- | ------------- | -------- | ------------- |
| `TextField`   | Label + Input + Error               | Text input with label  | `components/molecules/TextField.tsx`   | ✅ Production | Frontend | 2026-02-28    |
| `FormControl` | Label + Input + Validation          | Form field wrapper     | `components/molecules/FormControl.tsx` | ✅ Production | Frontend | 2026-02-28    |
| `Card`        | Container + Padding + Shadow        | Content card           | `components/molecules/Card.tsx`        | ✅ Production | Frontend | 2026-02-28    |
| `Alert`       | Icon + Text + Close                 | Alert message box      | `components/molecules/Alert.tsx`       | ✅ Production | Frontend | 2026-02-28    |
| `Breadcrumb`  | Link + Divider (repeated)           | Navigation breadcrumbs | `components/molecules/Breadcrumb.tsx`  | ✅ Production | Frontend | 2026-02-28    |
| `Tag`         | Badge + Close button                | Removable label        | `components/molecules/Tag.tsx`         | ✅ Production | Frontend | 2026-02-28    |
| `Tooltip`     | Text + Position wrapper             | Hover tooltip          | `components/molecules/Tooltip.tsx`     | ✅ Production | Frontend | 2026-02-28    |
| `CodeBlock`   | Code + Copy button + Language label | Code snippet rendering | `components/molecules/CodeBlock.tsx`   | ✅ Production | Frontend | 2026-02-28    |
| `NavItem`     | Link + Icon + Active state          | Navigation list item   | `components/molecules/NavItem.tsx`     | ✅ Production | Frontend | 2026-02-28    |

**Reuse Rules:**

- Use existing molecule components before creating new ones
- Prefer prop variations for styling (e.g., `<Card variant="elevated" />`)
- Avoid creating domain-specific molecules (`ArticleCard` → use `Card` + css)

### Organism Components (Complex Layouts)

| Component             | Composition                    | Purpose                   | File                                           | Status        | Owner    | Last Reviewed |
| --------------------- | ------------------------------ | ------------------------- | ---------------------------------------------- | ------------- | -------- | ------------- |
| `Navigation`          | NavItems + Layout              | Top navigation bar        | `components/organisms/Navigation.tsx`          | ✅ Production | Frontend | 2026-02-28    |
| `Sidebar`             | NavItems + Collapse            | Side navigation panel     | `components/organisms/Sidebar.tsx`             | ✅ Production | Frontend | 2026-02-28    |
| `Form`                | FormControls + Layout + Submit | Multi-field form          | `components/organisms/Form.tsx`                | ✅ Production | Frontend | 2026-02-28    |
| `ArticleHeader`       | Heading + Meta + Image         | Article title section     | `components/organisms/ArticleHeader.tsx`       | ✅ Production | Frontend | 2026-02-28    |
| `DocumentationLayout` | Sidebar + Main + TOC           | Documentation page layout | `components/organisms/DocumentationLayout.tsx` | ✅ Production | Frontend | 2026-02-28    |
| `SearchBar`           | Input + Autocomplete + Results | Search interface          | `components/organisms/SearchBar.tsx`           | ✅ Production | Frontend | 2026-02-28    |

**Reuse Rules:**

- Use layout organisms to compose page structures (not create new layouts per domain)
- Pass children/slots for content customization
- Avoid page-specific organisms (they should be 100% reusable across pages)

---

## Block Components (Dynamic Zone Registry)

These are the 11 core block components used in Strapi dynamic zones. They render JSON block definitions directly.

### Core Block Components (Immutable)

| Block Type | Component      | Props                                                               | Status        | Owner    | Last Reviewed |
| ---------- | -------------- | ------------------------------------------------------------------- | ------------- | -------- | ------------- |
| `text`     | `TextBlock`    | `content: string`                                                   | ✅ Production | Frontend | 2026-02-28    |
| `heading`  | `HeadingBlock` | `level: 1-6, content: string, anchorId?: string`                    | ✅ Production | Frontend | 2026-02-28    |
| `code`     | `CodeBlock`    | `language: string, content: string, title?: string`                 | ✅ Production | Frontend | 2026-02-28    |
| `image`    | `ImageBlock`   | `url: string, alt: string, caption?: string`                        | ✅ Production | Frontend | 2026-02-28    |
| `quote`    | `QuoteBlock`   | `content: string, author?: string`                                  | ✅ Production | Frontend | 2026-02-28    |
| `alert`    | `AlertBlock`   | `alertType: "info"\|"warning"\|"error"\|"success", content: string` | ✅ Production | Frontend | 2026-02-28    |
| `callout`  | `CalloutBlock` | `type: string, title: string, content: string`                      | ✅ Production | Frontend | 2026-02-28    |
| `list`     | `ListBlock`    | `ordered: boolean, items: string[]`                                 | ✅ Production | Frontend | 2026-02-28    |
| `table`    | `TableBlock`   | `headers: string[], rows: string[][]`                               | ✅ Production | Frontend | 2026-02-28    |
| `divider`  | `DividerBlock` | (none)                                                              | ✅ Production | Frontend | 2026-02-28    |
| `video`    | `VideoBlock`   | `url: string, videoType: "youtube"\|"vimeo", aspectRatio?: string`  | ✅ Production | Frontend | 2026-02-28    |

**Reuse Rules:**

- Block components cannot be replaced or deprecated without governance review
- Extensions via new props are allowed (backwards compatible only)
- Custom styling via CSS classes is allowed, new blocks are not
- If a new block type is needed, file formal proposal (see below)

### Block Renderer Registry

All blocks are rendered via a central dispatcher:

```typescript
// components/blocks/BlockRenderer.tsx
export function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "text":
      return <TextBlock {...block} />;
    case "heading":
      return <HeadingBlock {...block} />;
    case "code":
      return <CodeBlock {...block} />;
    // ... all 11 blocks
    default:
      return <FallbackBlock block={block} />;
  }
}
```

**Fallback Rendering:** If a block type is unrecognized, render a `FallbackBlock` component showing:

- Block type name
- JSON preview
- Developer message ("Unknown block type, check schema")

---

## Reuse-First Discipline

### Decision Tree: Should I Create a New Component?

```
1. Does an atom component already do 80%+ of what I need?
   └─ YES → Use atom + custom CSS or prop variation
   └─ NO → Continue

2. Does a molecule component already do 80%+ of what I need?
   └─ YES → Use molecule + custom CSS or prop variation
   └─ NO → Continue

3. Does an organism component already do 80%+ of what I need?
   └─ YES → Use organism + custom CSS or prop variation
   └─ NO → Continue

4. Is this component 100% unique and cannot be composed from smaller components?
   └─ YES → File formal proposal (see below)
   └─ NO → Reconsider composition or reuse

5. Does the proposal justify NEW component vs. customization?
   └─ YES → Submit for approval
   └─ NO → Use existing component
```

### Formal Proposal Template

**Required before creating ANY new component:**

````markdown
# [Component Name] Proposal

## Reuse-First Checklist

- [ ] Audited 100% of existing atom components → no fit
- [ ] Audited 100% of existing molecule components → no fit
- [ ] Audited 100% of existing organism components → no fit
- [ ] Attempted composition from existing components → impossible
- [ ] Attempted CSS/prop variations → insufficient

## Justification

[Explain why this component CANNOT be achieved by reusing existing components + customization]

## Proposed Component

```typescript
interface Props {
  // ...
}

export function NewComponent(props: Props) {
  // ...
}
```
````

## Usage Example

```tsx
<NewComponent foo="bar" />
```

## Testing Plan

- Unit tests (vitest)
- Visual regression tests
- Accessibility audit

## Approval Required From

- [ ] Senior Architect (architecture fit)
- [ ] Frontend Lead (implementation feasibility)
- [ ] QA/Testing (test coverage)

````

### Approval Process

1. **Submit proposal** to `/docs/component-proposals/[name]-proposal.md`
2. **Senior architect reviews** (within 2 business days)
3. **If approved:** Add to this inventory, create component, add tests
4. **If rejected:** Revise or use existing components

---

## Component Creation Checklist

When creating a new component (after proposal approval):

### Code Phase

- [ ] Component file created: `components/[layer]/[Name].tsx`
- [ ] Props interface defined with JSDoc comments
- [ ] Default exports only (no named exports)
- [ ] TypeScript strict mode (no `any`)
- [ ] Accessibility: ARIA attributes, semantic HTML
- [ ] Mobile responsive (CSS media queries)

### Testing Phase

- [ ] Unit tests written (vitest)
- [ ] >90% code coverage
- [ ] Snapshot tests (for visual components)
- [ ] Accessibility tests (accessibility-testing-library)
- [ ] All tests passing (`pnpm run test`)

### Documentation Phase

- [ ] Component added to this inventory
- [ ] Storybook story created (optional, nice-to-have)
- [ ] Usage examples in JSDoc
- [ ] Props documented with types

### Quality Gate

- [ ] No TypeScript errors (`pnpm run type-check`)
- [ ] No linting errors (`pnpm run lint`)
- [ ] Passes all tests (`pnpm run test`)
- [ ] Code reviewed by another developer
- [ ] Ready to merge to main

---

## Deprecation & Sunset Policy

When a component becomes obsolete:

### Deprecation Notice (6 Weeks)

1. **Announce deprecation** in component file:

```typescript
/**
 * @deprecated As of 2026-03-15. Use {@link NewComponent} instead.
 * This component will be removed in 8 weeks (2026-05-01).
 */
export function DeprecatedComponent() {
  // ...
}
````

2. **Find all usages:**

```bash
grep -r "DeprecatedComponent" src/
```

3. **Migrate all usages** to replacement component
4. **Update this inventory** with deprecation date

### Removal (After 8 Weeks)

1. **Delete component file**
2. **Update inventory**, mark status as `🪦 Deprecated`
3. **Document in PITFALLS_TROUBLESHOOTING.md** what it was and what to use instead

---

## Inventory Maintenance

This inventory is reviewed in every session:

- **Monthly:** Audit for orphaned or duplicate components
- **Quarterly:** Audit for reusable patterns that should be extracted
- **Per-deprecation:** Update when components are sunset

**Last Inventory Audit:** 2026-02-28  
**Next Audit Due:** 2026-03-28

---

## Approval Checklist

- [ ] Senior Architect: Reuse discipline aligned with governance
- [ ] Frontend Lead: Component inventory complete and feasible
- [ ] CTO: No technical debt from component explosion

**Approved By:** ********\_******** **Date:** ****\_****

---

**Status:** Locked. Changes require formal proposal review.
