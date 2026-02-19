/**
 * Hydration Safety Patterns -- Central Reference
 * ================================================
 *
 * This file documents the mandatory patterns for avoiding hydration mismatches
 * in this Next.js codebase. All new features that involve client-side state
 * which can diverge between server and client MUST follow these patterns.
 *
 * -------------------------------------------------------------------------
 * RULE 1: Use useSyncExternalStore for environment-dependent values
 * -------------------------------------------------------------------------
 *
 * Any value that differs between server and client (viewport width, time,
 * localStorage, matchMedia, etc.) MUST use useSyncExternalStore with an
 * explicit getServerSnapshot.
 *
 * WRONG (causes hydration mismatch):
 *   const [isMobile, setIsMobile] = useState(false)
 *   useEffect(() => setIsMobile(window.innerWidth < 768), [])
 *
 * RIGHT (hydration-safe):
 *   useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
 *
 * Implementations:
 *   - hooks/use-hydration.tsx    -- Global hydration state (useSyncExternalStore)
 *   - hooks/use-mobile.ts       -- Viewport breakpoint (useSyncExternalStore)
 *
 * -------------------------------------------------------------------------
 * RULE 2: Guard client-only UI with useHydration()
 * -------------------------------------------------------------------------
 *
 * Components that render Radix primitives (Collapsible, Dialog, Popover,
 * DropdownMenu, etc.) generate random aria-controls IDs that differ between
 * server and client. These MUST be guarded:
 *
 *   const hydrated = useHydration()
 *   if (!hydrated) return <Skeleton />
 *   return <CollapsibleComponent />
 *
 * Implementation:
 *   - components/molecules/docs-sidebar.tsx -- guards all Collapsible nav
 *   - components/molecules/sidebar-skeleton.tsx -- matching SSR skeleton
 *
 * -------------------------------------------------------------------------
 * RULE 3: Server Components by default
 * -------------------------------------------------------------------------
 *
 * Pages and layouts MUST remain Server Components unless they need
 * interactivity. The "use client" boundary should be pushed as deep as
 * possible into the component tree.
 *
 *   - app/dashboard/layout.tsx -- Server Component (delegates to DashboardShell)
 *   - components/molecules/dashboard-shell.tsx -- Client boundary (sidebar only)
 *   - All new overview/feature pages -- Server Components
 *
 * -------------------------------------------------------------------------
 * RULE 4: No conditional rendering based on environment in shared layouts
 * -------------------------------------------------------------------------
 *
 * Never use `typeof window !== "undefined"` or environment checks in layout
 * components. If you need environment-dependent rendering, use the
 * useHydration() guard or useSyncExternalStore pattern.
 *
 * -------------------------------------------------------------------------
 * RULE 5: Date/time formatting
 * -------------------------------------------------------------------------
 *
 * Date.now(), new Date(), and locale-dependent formatters produce different
 * output on server vs client. Options:
 *   a) Format dates in Server Components and pass as props (preferred)
 *   b) Guard with useHydration() and show skeleton until hydrated
 *   c) Use suppressHydrationWarning on the specific element (last resort)
 *
 * -------------------------------------------------------------------------
 * RULE 6: Wrap RSC children in explicit <Suspense> inside Client Components
 * -------------------------------------------------------------------------
 *
 * When a Client Component ("use client") receives Server Component children
 * via {children} props, Next.js inserts an implicit <Suspense> boundary in
 * the server HTML for streaming. If the client tree does NOT have a matching
 * <Suspense>, the server tree has <Suspense> where the client has <div>,
 * causing a hydration mismatch.
 *
 * FIX: Always wrap {children} in an explicit <Suspense> inside the client
 * component so both trees agree:
 *
 *   // WRONG -- server inserts implicit Suspense, client sees <div>
 *   <div className="content">{children}</div>
 *
 *   // RIGHT -- explicit Suspense matches both trees
 *   <Suspense>
 *     <div className="content">{children}</div>
 *   </Suspense>
 *
 * Implementation:
 *   - components/molecules/dashboard-shell.tsx -- wraps {children} in <Suspense>
 *
 * -------------------------------------------------------------------------
 * CHECKLIST for new components:
 * -------------------------------------------------------------------------
 *
 * [ ] Does it use useState with a value that depends on the browser? -> RULE 1
 * [ ] Does it render Radix primitives? -> RULE 2
 * [ ] Is it a page or layout? -> RULE 3
 * [ ] Does it check typeof window? -> RULE 4
 * [ ] Does it format dates/times? -> RULE 5
 * [ ] Is it a Client Component receiving RSC children? -> RULE 6
 */

// Re-export the core hydration utilities so consumers can import from one place
export { useHydration } from "@/hooks/use-hydration"
export { useIsMobile } from "@/hooks/use-mobile"
