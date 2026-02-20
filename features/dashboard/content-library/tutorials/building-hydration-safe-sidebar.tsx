"use client";

import {
  TableOfContents,
  SectionHeader,
  StepFlow,
  InfoBox,
  KeyTakeaway,
  NumberedList,
  ProcessFlow,
  FeatureGrid,
  BeforeAfterComparison,
  ArchitectureDiagram,
  CodeBlock as ArticleCodeBlock,
} from "@/components/molecules/article-components";
import { CodeBlock } from "@/components/atoms/code-block";
import { CodeExplanation } from "@/components/atoms/code-explanation";

export function BuildingHydrationSafeSidebarContent() {
  return (
    <div className="space-y-8">
      <TableOfContents
        items={[
          { id: "radix-problem", title: "The Radix ID Problem", level: 2 },
          {
            id: "useeffect-fails",
            title: "Why useEffect Band-Aids Fail",
            level: 2,
          },
          {
            id: "sync-external-store",
            title: "The useSyncExternalStore Solution",
            level: 2,
          },
          { id: "skeleton", title: "Building a Static Skeleton", level: 2 },
          { id: "guard-pattern", title: "The Guard Pattern", level: 2 },
          { id: "reusable-hook", title: "Making It Reusable", level: 2 },
        ]}
      />

      <SectionHeader
        number="1"
        title="The Radix ID Problem"
        id="radix-problem"
      />

      <p className="text-muted-foreground leading-relaxed">
        Radix UI uses React&apos;s useId() hook to generate unique IDs for ARIA
        attributes like aria-controls. These IDs connect trigger elements to
        their content panels for screen readers. The problem: useId() generates
        IDs based on component position in the React tree, and this position can
        differ between server and client when conditional rendering is involved.
      </p>

      <CodeBlock
        code={`// What Radix generates internally for each Collapsible:
<button
  type="button"
  aria-controls="radix-:R_259knelb_:"  // Generated ID
  aria-expanded={false}
>
  Toggle Section
</button>
<div id="radix-:R_259knelb_:">         // Must match!
  Hidden content here
</div>

// With 20 collapsible sections in a sidebar,
// that is 20 pairs of IDs that must match perfectly
// between server and client.

// If the component tree differs even slightly:
// Server: aria-controls="radix-:R_8l6itplb_:"
// Client: aria-controls="radix-:R_259knelb_:"
// MISMATCH on every single collapsible!`}
        language="html"
        filename="Radix internal output"
      />

      <InfoBox type="warning" title="Silent accessibility breakage">
        When ARIA IDs mismatch, screen readers can no longer connect triggers to
        their content panels. The sidebar looks fine visually but is broken for
        assistive technology users.
      </InfoBox>

      <SectionHeader
        number="2"
        title="Why useEffect Band-Aids Fail"
        id="useeffect-fails"
      />

      <NumberedList
        items={[
          "Visible flash: sections collapse then expand as state updates after mount",
          "Radix still generates IDs during SSR, creating the mismatch it was meant to prevent",
          "Every new section or nested item introduces another mismatch point",
          "You must remember to add the useEffect pattern to EVERY collapsible component",
        ]}
      />

      <BeforeAfterComparison
        before={{
          title: "Fragile useEffect approach",
          code: `function NavSection({ section, pathname }) {
  const isActive = pathname.startsWith(section.href)
  // Start closed on server to avoid mismatch
  const [isOpen, setIsOpen] = useState(false)
  // Open after hydration if section is active
  useEffect(() => {
    if (isActive) setIsOpen(true)
  }, [isActive])
  // PROBLEMS: flash, timing, per-component overhead
}`,
        }}
        after={{
          title: "Guard pattern (coming in step 5)",
          code: `function DocsSidebar() {
  const hydrated = useHydration()
  if (!hydrated) return <SidebarSkeleton />
  // Real sidebar only mounts AFTER hydration
  // No Radix during SSR = no ID mismatches
  return <RealSidebar />
}`,
        }}
      />

      <SectionHeader
        number="3"
        title="The useSyncExternalStore Solution"
        id="sync-external-store"
      />

      <p className="text-muted-foreground leading-relaxed">
        React 18 introduced useSyncExternalStore, a hook designed for values
        that differ between server and client. Unlike useState + useEffect, it
        provides a getServerSnapshot parameter that explicitly tells React what
        to use during SSR -- no double-render, no flash.
      </p>

      <CodeBlock
        code={`// hooks/use-hydration.ts
"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

/**
 * Returns true once the component has hydrated on the client.
 * Returns false during SSR and the initial hydration pass.
 *
 * Uses useSyncExternalStore -- React's official solution
 * for values that differ between server and client:
 * - getSnapshot (2nd arg): called on client, returns true
 * - getServerSnapshot (3rd arg): called during SSR, returns false
 */
export function useHydration(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // Client snapshot: always true
    () => false    // Server snapshot: always false
  )
}

// WHY THIS IS BETTER:
// useState:     Server: false -> Render 1: false -> useEffect: true -> Re-render
// useSyncExternalStore: Server: false -> Client: true (single pass)`}
        language="typescript"
        filename="hooks/use-hydration.ts"
      />

      <CodeExplanation
        summary="useSyncExternalStore parameters"
        terms={[
          {
            term: "emptySubscribe",
            description:
              "Hydration status never changes after mount, so no subscription is needed. React requires a function so we provide a no-op.",
          },
          {
            term: "() => true (2nd arg)",
            description:
              "Client snapshot: always returns true because the client is always hydrated",
          },
          {
            term: "() => false (3rd arg)",
            description:
              "Server snapshot: always returns false because SSR is never hydrated",
          },
        ]}
      />

      <SectionHeader
        number="4"
        title="Building a Static Skeleton"
        id="skeleton"
      />

      <InfoBox type="important" title="Skeleton rules">
        The skeleton must produce identical HTML on server and client. That
        means: no Radix components, no hooks, no random values, no
        client-dependent logic. Pure HTML + CSS only.
      </InfoBox>

      <CodeBlock
        code={`// components/molecules/sidebar-skeleton.tsx
// No "use client" -- works identically as server component
// No Radix. No hooks. No random values. Pure HTML + CSS.

export function SidebarSkeleton() {
  return (
    <div className="flex h-full w-[var(--sidebar-width)] flex-col border-r bg-sidebar">
      {/* Header skeleton */}
      <div className="p-4 border-b border-border">
        <div className="h-5 w-32 bg-muted rounded animate-pulse" />
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        {["MANAGEMENT", "BACKEND & CMS", "FRONTEND", "LEARN & GROW"].map(
          (label) => (
            <div key={label} className="mb-4">
              <div className="px-3 py-2">
                <span className="text-xs font-semibold text-muted-foreground">
                  {label}
                </span>
              </div>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={\`\${label}-\${i}\`} className="flex items-center gap-3 px-3 py-2">
                  <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </div>
              ))}
            </div>
          )
        )}
      </nav>
    </div>
  )
}`}
        language="typescript"
        filename="components/molecules/sidebar-skeleton.tsx"
      />

      <FeatureGrid
        features={[
          {
            title: "No Client Directive",
            description:
              "Works as both server and client component -- identical output either way",
          },
          {
            title: "Zero Radix",
            description: "No Collapsible, no useId(), no generated ARIA IDs",
          },
          {
            title: "Deterministic Keys",
            description: "String template keys instead of random values",
          },
          {
            title: "Visual Match",
            description:
              "Same spacing and structure as the real sidebar for smooth transition",
          },
        ]}
        columns={2}
      />

      <SectionHeader number="5" title="The Guard Pattern" id="guard-pattern" />

      <ArchitectureDiagram
        layers={[
          {
            label: "Guard Check",
            items: ["useHydration() returns false during SSR"],
          },
          {
            label: "SSR Output",
            items: [
              "SidebarSkeleton renders static HTML",
              "No Radix components exist",
              "Zero generated IDs",
            ],
          },
          {
            label: "After Hydration",
            items: [
              "useHydration() returns true",
              "Real sidebar mounts fresh",
              "Radix IDs generated client-only",
            ],
          },
        ]}
      />

      <CodeBlock
        code={`// components/molecules/docs-sidebar.tsx
"use client"

import { useHydration } from "@/hooks/use-hydration"
import { SidebarSkeleton } from "@/components/molecules/sidebar-skeleton"

export function DocsSidebar() {
  const hydrated = useHydration()

  // GUARD: During SSR, render skeleton only
  if (!hydrated) return <SidebarSkeleton />

  // AFTER HYDRATION: Safe to render Radix components
  return (
    <Sidebar>
      <SidebarContent>
        {sections.map(section => (
          <NavCollapsible key={section.title} section={section} />
        ))}
      </SidebarContent>
    </Sidebar>
  )
}

// Child components can safely initialise with correct values:
function NavCollapsible({ section }) {
  const pathname = usePathname()
  const isActive = section.items.some(item => pathname.startsWith(item.href))

  // SAFE -- only mounts after hydration, so pathname is available
  const [isOpen, setIsOpen] = useState(isActive)
  // No useEffect needed!

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      {/* ... */}
    </Collapsible>
  )
}`}
        language="typescript"
        filename="components/molecules/docs-sidebar.tsx"
      />

      <ProcessFlow
        steps={[
          "Server renders SidebarSkeleton (static HTML, zero IDs)",
          "Browser displays skeleton instantly (fast first paint)",
          "JavaScript bundle downloads and hydration begins",
          "useHydration() transitions to true (single synchronous pass)",
          "Real sidebar mounts fresh with correct Radix IDs",
          "Skeleton swapped for interactive sidebar (~50-100ms)",
        ]}
        title="Runtime Flow"
      />

      <SectionHeader number="6" title="Making It Reusable" id="reusable-hook" />

      <CodeBlock
        code={`// A generic HydrationGuard wrapper
"use client"

import { useHydration } from "@/hooks/use-hydration"
import { type ReactNode } from "react"

interface HydrationGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function HydrationGuard({ children, fallback }: HydrationGuardProps) {
  const hydrated = useHydration()
  if (!hydrated) return fallback ?? null
  return children
}

// Usage:
<HydrationGuard fallback={<SidebarSkeleton />}>
  <DocsSidebar />
</HydrationGuard>

<HydrationGuard fallback={<ChartSkeleton />}>
  <RevenueChart data={data} />
</HydrationGuard>`}
        language="typescript"
        filename="components/hydration-guard.tsx"
      />

      <StepFlow
        steps={[
          {
            number: "1",
            title: "Create useHydration hook",
            description:
              "One hook using useSyncExternalStore, shared across the entire app",
          },
          {
            number: "2",
            title: "Build static skeletons",
            description:
              "One skeleton per guarded component, matching its visual structure",
          },
          {
            number: "3",
            title: "Apply guard at component root",
            description: "Single conditional check protects the entire subtree",
          },
        ]}
      />

      <KeyTakeaway>
        The guard pattern solves hydration mismatches architecturally instead of
        per-component. One check at the top of a component tree protects every
        nested Radix primitive, eliminating the need for fragile useEffect
        workarounds that must be added to each child individually.
      </KeyTakeaway>
    </div>
  );
}
