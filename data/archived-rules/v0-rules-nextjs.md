# v0 Rules: Next.js & React Module
**Last modified:** Session 53 (2026-02-10) -- Adapted from vercel-labs/agent-skills (Next.js Best Practices 9.1K + React Best Practices 115K installs). Security audited.
**Load when:** Building or reviewing Next.js pages, components, or API routes. Always load during DocPage migration.

---

## CRITICAL Priority (Fix Immediately)

### Server/Client Boundaries
- Components are Server Components by default. Only add `"use client"` when using hooks, event handlers, or browser APIs.
- NEVER pass functions/callbacks as props from Server to Client Components.
- NEVER import server-only code (db, env vars, fs) in Client Components.
- Use `server-only` package to prevent accidental client imports of sensitive modules.

### Data Fetching
- Fetch data in Server Components, pass as props to Client Components.
- NEVER fetch inside `useEffect`. Use RSC data passing or SWR.
- NEVER use `getServerSideProps` or `getStaticProps` (App Router only).
- Use `Suspense` boundaries around async components with meaningful fallbacks.

### Async Patterns (Next.js 16)
- `params`, `searchParams`, `headers`, `cookies` MUST be awaited.
- Route handlers: `const { id } = await params;`
- NEVER destructure params synchronously.

### Hydration Safety
- NEVER use `typeof window !== "undefined"` for conditional rendering. Use `useEffect` + state.
- NEVER access `localStorage`, `sessionStorage`, or `document` during SSR.
- Wrap browser-only code in `useEffect` or behind a `mounted` state check.

## HIGH Priority (Fix Before PR)

### Performance -- Waterfall Elimination
- Use parallel data fetching with `Promise.all()` for independent requests.
- Prefer colocating data fetching with the component that uses it (not parent).
- Use `loading.tsx` for route-level Suspense boundaries.

### Performance -- Bundle Optimization
- Use `next/dynamic` for heavy client components (charts, editors, maps).
- Use `next/image` for all images (auto-optimization, lazy loading, sizing).
- Use `next/font` for fonts (eliminates layout shift).
- NEVER import a large library in a Server Component if only used client-side.

### Performance -- Re-render Prevention
- Memoize expensive computations with `useMemo`.
- Use `useCallback` for functions passed as props to child components.
- Lift state up to the lowest common ancestor, not to the root.
- Split large Client Components: keep interactive parts small, rest as Server Components.

### Caching (Next.js 16)
- Use `"use cache"` directive for pages, components, or functions that can be cached.
- Use `cacheLife` profiles (`'max'`, `'days'`, `'hours'`) for cache duration.
- Use `revalidateTag(tag, cacheLifeProfile)` for targeted cache invalidation.
- NEVER cache components that depend on user-specific data without proper keying.

### Security
- Validate ALL user input on the server (Server Actions, Route Handlers).
- Use `zod` for schema validation.
- Never trust client-side validation alone.
- Sanitize data before rendering to prevent XSS.
- Use `csrf` protection for forms.

### Error Handling
- Every route segment should have an `error.tsx` boundary.
- Server Actions should return typed error objects, not throw.
- Use `notFound()` for missing resources, not empty states.

## MEDIUM Priority (Best Practice)

### Code Organization
- Group related routes in `(group)` folders.
- Colocate page-specific components next to their page.
- Use barrel exports (`index.ts`) sparingly -- they can hurt tree-shaking.
- Prefer named exports over default exports for components.

### Accessibility
- All interactive elements must be keyboard accessible.
- Use semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>`).
- Images need `alt` text. Decorative images use `alt=""`.
- Form inputs need associated `<label>` elements.
- Use `aria-live` regions for dynamic content updates.

### TypeScript
- Enable strict mode. No `any` types in production code.
- Use `satisfies` for type narrowing when possible.
- Infer types from data when possible rather than manually typing.
- Use discriminated unions for state machines.

---

## v0-Specific Adaptations

These rules are adapted for the v0 environment where we cannot run builds or tests:

1. **Verification method:** Read back the file + check preview debug logs + grep for anti-patterns.
2. **"use client" audit:** After migration, grep for `"use client"` and verify each file actually needs it.
3. **Import audit:** Grep for `import` statements crossing the server/client boundary.
4. **Performance check:** Look for `useEffect` fetch patterns, missing Suspense boundaries, synchronous param access.
