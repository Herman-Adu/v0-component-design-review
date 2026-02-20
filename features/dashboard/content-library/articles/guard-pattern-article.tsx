"use client"

import {
  SectionHeader,
  InfoBox,
  StepFlow,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  ProcessFlow,
  ArchitectureDiagram,
  FeatureGrid,
  MetricsGrid,
  TableOfContents,
  StatsTable,
} from "@/components/molecules/article-components"

const tocItems = [
  { id: "reactive-cost", title: "The Cost of Reactive Bug Fixing", level: 2 },
  { id: "guard-fundamentals", title: "Guard Pattern Fundamentals", level: 2 },
  { id: "boundary-architecture", title: "Boundary Architecture", level: 2 },
  { id: "implementation-hierarchy", title: "Implementation Hierarchy", level: 2 },
  { id: "scaling-guards", title: "Scaling Guards Across a Team", level: 2 },
  { id: "measuring-resilience", title: "Measuring Architectural Resilience", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function GuardPatternArticleContent() {
  return (
    <div className="flex gap-10">
      <div className="prose prose-invert max-w-none flex-1">
        <SectionHeader number="01" title="The Cost of Reactive Bug Fixing" id="reactive-cost" />

        <InfoBox type="info" title="Background: Reactive vs Proactive Architecture">
          Software engineering approaches to defects fall into two categories. Reactive approaches fix problems after they appear:
          a bug is reported, a developer investigates, a patch is applied. Proactive approaches design systems that prevent entire
          categories of problems from occurring. The guard pattern is a proactive architectural pattern - it does not fix hydration
          errors, it makes them structurally impossible. This distinction is critical for technical leaders because reactive fixes
          have a linear cost (each bug costs roughly the same to fix), while proactive architecture has an upfront cost that amortises
          to near-zero over time.
        </InfoBox>

        <p className="text-muted-foreground leading-relaxed">
          Our sidebar experienced hydration errors across four development iterations over several weeks. Each iteration followed
          the same pattern: a developer adds a new collapsible section, the sidebar breaks, a fix is applied to that specific section,
          and the cycle repeats with the next addition. This is a classic symptom of architectural debt - the system&apos;s design does
          not accommodate the changes it needs to support.
        </p>

        <StatsTable
          title="Cost Analysis: Reactive vs Proactive Approach"
          headers={["Metric", "Reactive (Per Fix)", "Proactive (Guard)", "Difference"]}
          rows={[
            ["Developer time per incident", "1-3 hours", "0 hours", "100% reduction"],
            ["Incidents per quarter (growing codebase)", "4-8", "0", "Eliminated"],
            ["Quarterly engineering cost", "8-24 hours", "4 hours (one-time)", "-83% to -100%"],
            ["Risk of production regression", "Medium", "None", "Eliminated"],
            ["Onboarding complexity", "Must learn workarounds", "No special knowledge", "Simplified"],
            ["Confidence during refactoring", "Low (might break sidebar)", "High (guard protects)", "Significant"],
          ]}
        />

        <InfoBox type="important" title="Background: Technical Debt as a Financial Concept">
          Technical debt is a metaphor borrowed from finance. Just as financial debt accrues interest, technical shortcuts accrue
          maintenance cost. The critical insight for decision makers is that technical debt compounds: each new feature built on top
          of a fragile foundation inherits the fragility. Our hydration workarounds were compounding - each new sidebar section added
          a new useEffect, a new state variable, and a new potential failure point. The guard pattern was a debt repayment that
          eliminated the compounding entirely.
        </InfoBox>

        <SectionHeader number="02" title="Guard Pattern Fundamentals" id="guard-fundamentals" />

        <p className="text-muted-foreground leading-relaxed">
          A guard is a conditional check at the boundary of a component subtree that controls whether the subtree renders. Guards
          are not new - authentication guards (redirect if not logged in) and feature flags (hide if feature disabled) are common
          examples. The hydration guard applies the same principle to the server/client rendering boundary: if the client has not
          completed hydration, render a safe alternative; otherwise, render the full interactive component.
        </p>

        <ArchitectureDiagram
          title="Guard Pattern Architecture"
          layers={[
            { name: "Guard Boundary", items: ["Checks hydration status", "Acts as gatekeeper"], color: "#3b82f6" },
            { name: "Safe Fallback", items: ["Static skeleton with zero non-determinism"], color: "#eab308" },
            { name: "Protected Subtree", items: ["Full interactive components (Radix, charts, maps)"], color: "#22c55e" },
          ]}
        />

        <p className="text-muted-foreground leading-relaxed">
          The architectural power of guards comes from their composability and their ability to contain non-determinism.
          Any component that produces non-deterministic output during SSR (random IDs, browser API reads, environment-dependent
          values) can be placed inside a guard boundary. The guard ensures these components never participate in SSR, eliminating
          the hydration contract violation at its source.
        </p>

        <FeatureGrid
          features={[
            {
              title: "Single Point of Protection",
              description: "One guard protects an entire subtree. Unlike per-component useEffect workarounds that must be applied to every child, a guard at the root protects all descendants automatically. This means new components added inside the guard boundary are protected without any additional code.",
            },
            {
              title: "Separation of Concerns",
              description: "The guard separates 'what to render during SSR' from 'what to render interactively'. The skeleton component owns the SSR concern (static, deterministic, fast), while the real component owns the interactivity concern (event handlers, state, dynamic IDs). Neither needs to know about the other's constraints.",
            },
            {
              title: "Explicit Contract",
              description: "Guards make the SSR/client boundary visible in code. When a developer sees a HydrationGuard wrapper, they immediately understand that the contained component has client-only requirements. This is documentation that cannot go stale because it is enforced by the code itself.",
            },
            {
              title: "Graceful Degradation",
              description: "The skeleton fallback provides a meaningful experience even if JavaScript fails to load or hydration is delayed. Users see a correctly-shaped layout rather than a blank space or layout shift. This is especially important on slow connections or low-powered devices.",
            },
          ]}
        />

        <SectionHeader number="03" title="Boundary Architecture" id="boundary-architecture" />

        <InfoBox type="info" title="Background: Architectural Boundaries">
          In software architecture, a boundary is a line between two areas of concern. Clean boundaries reduce coupling: changes on one
          side do not cascade to the other. Robert C. Martin (Clean Architecture) identifies boundaries as the most important architectural
          decision - more important than frameworks, databases, or UI choices. The hydration guard establishes a boundary between the
          server-safe rendering context and the client-only interactive context. Everything above the guard must be deterministic. Everything
          below can be freely non-deterministic.
        </InfoBox>

        <p className="text-muted-foreground leading-relaxed">
          The placement of guard boundaries follows a principle of maximum containment with minimum disruption. Place the guard as
          high in the component tree as possible to protect the most components, but not so high that useful server-rendered content
          is lost. For a sidebar, the guard wraps the entire sidebar because every element within it uses Radix primitives. For a
          dashboard page, the guard might wrap only the chart section while leaving the header and data tables to render on the server.
        </p>

        <CodeBlock
          title="Strategic guard placement examples"
          code={`// EXAMPLE 1: Full component guard (sidebar)
// Guard wraps the entire sidebar because every element uses Radix
export function DocsSidebar() {
  const hydrated = useHydration()
  if (!hydrated) return <SidebarSkeleton />
  return <Sidebar>{/* All Radix components safe */}</Sidebar>
}

// EXAMPLE 2: Partial page guard (dashboard)
// Only the chart needs guarding, tables render server-side
export function DashboardPage({ data }) {
  return (
    <main>
      {/* These render on the server - fast, SEO-friendly */}
      <DashboardHeader title="Analytics" />
      <DataTable rows={data.rows} />
      
      {/* Only the chart needs client-only rendering */}
      <HydrationGuard fallback={<ChartSkeleton />}>
        <InteractiveChart data={data.chartData} />
      </HydrationGuard>
      
      {/* This also renders on the server */}
      <DataSummary totals={data.totals} />
    </main>
  )
}

// EXAMPLE 3: Nested guards for progressive enhancement
// Each section independently guards its interactive parts
export function AnalyticsPage({ metrics }) {
  return (
    <main>
      <h1>Analytics</h1>
      <HydrationGuard fallback={<FilterSkeleton />}>
        <InteractiveFilters />
      </HydrationGuard>
      <ServerRenderedMetricsGrid metrics={metrics} />
      <HydrationGuard fallback={<ChartSkeleton />}>
        <LiveUpdatingChart />
      </HydrationGuard>
    </main>
  )
}`}
        />

        <SectionHeader number="04" title="Implementation Hierarchy" id="implementation-hierarchy" />

        <p className="text-muted-foreground leading-relaxed">
          Not all hydration issues require the guard pattern. The correct solution depends on the scope of the problem
          and the cost of the workaround. We can rank solutions from simplest to most architectural, choosing the lightest
          solution that fully solves the problem.
        </p>

        <ProcessFlow
          title="Solution Selection (Simplest to Most Architectural)"
          steps={[
            { label: "CSS-Only", sublabel: "Use responsive CSS instead of JS-based conditional rendering", color: "green" },
            { label: "useEffect Guard", sublabel: "Simple state + effect for isolated browser API usage", color: "green" },
            { label: "Dynamic Import", sublabel: "next/dynamic with ssr: false for entire client-only components" },
            { label: "Hydration Guard", sublabel: "Guard pattern for subtrees with many non-deterministic components", color: "blue" },
            { label: "Full SSR Bypass", sublabel: "Last resort: suppress entire pages from SSR (rare)", color: "yellow" },
          ]}
        />

        <ComparisonCards
          leftTitle="When to Use Simpler Solutions"
          leftItems={[
            "Single component reads window.innerWidth",
            "One date needs client-side formatting",
            "A chart library only works in the browser",
            "localStorage read for a single preference",
          ]}
          rightTitle="When to Use Guard Pattern"
          rightItems={[
            "Entire subtree uses non-deterministic library (Radix)",
            "Multiple nested components each generate IDs",
            "Problem recurs every time new children are added",
            "Team needs a scalable, zero-maintenance solution",
          ]}
        />

        <SectionHeader number="05" title="Scaling Guards Across a Team" id="scaling-guards" />

        <InfoBox type="info" title="Background: Pit of Success">
          The &ldquo;pit of success&rdquo; is a software design principle coined by Rico Mariani: make the easy path the correct path.
          Instead of relying on documentation and discipline to prevent mistakes, design your tools and patterns so that the
          natural, obvious approach is also the safe approach. A reusable HydrationGuard component embodies this principle - developers
          do not need to understand useSyncExternalStore or hydration mechanics. They wrap their component, provide a skeleton, and
          the problem is solved.
        </InfoBox>

        <StepFlow
          steps={[
            { number: 1, title: "Create Shared Primitives", description: "useHydration hook + HydrationGuard wrapper, tested and documented" },
            { number: 2, title: "Establish Skeleton Convention", description: "Every guarded component gets a co-located Skeleton component" },
            { number: 3, title: "Add to Component Checklist", description: "PR reviews check: does this component use browser APIs or non-deterministic libraries?" },
            { number: 4, title: "Automate Detection", description: "ESLint rules to flag window/document access outside useEffect or guard boundaries" },
          ]}
        />

        <CodeBlock
          title="Team-scalable component convention"
          code={`// Convention: co-locate skeleton with component
// components/
//   interactive-chart/
//     index.tsx           ← The real component
//     skeleton.tsx        ← SSR-safe skeleton
//
// Usage in pages:
import { InteractiveChart } from '@/components/interactive-chart'
import { InteractiveChartSkeleton } from '@/components/interactive-chart/skeleton'

export function Dashboard() {
  return (
    <HydrationGuard fallback={<InteractiveChartSkeleton />}>
      <InteractiveChart />
    </HydrationGuard>
  )
}

// Team benefits:
// 1. New developers follow the pattern by example
// 2. Skeletons are discoverable (same folder)
// 3. Code reviews catch missing guards
// 4. No tribal knowledge required`}
        />

        <SectionHeader number="06" title="Measuring Architectural Resilience" id="measuring-resilience" />

        <MetricsGrid
          metrics={[
            { label: "Hydration Errors (Before)", value: "4-8 per quarter" },
            { label: "Hydration Errors (After)", value: "0" },
            { label: "Time to Add Sidebar Section", value: "Minutes (was hours)" },
            { label: "Guard Implementation Time", value: "4 hours (one-time)" },
          ]}
        />

        <p className="text-muted-foreground leading-relaxed">
          The most valuable metric is the one you stop tracking: hydration error frequency. Before the guard pattern, every
          sidebar change carried a risk of hydration regression. After the guard, the risk is structurally zero. This is the
          hallmark of a good architectural decision - it eliminates a category of problems rather than addressing individual
          instances.
        </p>

        <InfoBox type="tip" title="For CTOs and Technical Directors">
          When evaluating architectural investments, look for solutions that reduce the marginal cost of future changes toward
          zero. The guard pattern cost 4 hours of implementation time. It saved an estimated 8-24 hours per quarter in debugging
          time, reduced onboarding friction, and increased refactoring confidence. The break-even point was reached within the
          first month. More importantly, it freed the team to add features without fear of regression - a competitive advantage
          in delivery velocity that compounds over time.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          The guard pattern is a manifestation of a deeper architectural principle: contain non-determinism behind explicit boundaries.
          Every system has components that behave differently in different environments (server vs client, test vs production, mobile
          vs desktop). Rather than scattering environment checks throughout the codebase, establish clear boundaries where the
          transition happens and protect those boundaries with guards. This reduces the surface area for environment-related bugs from
          the entire codebase to a handful of well-tested guard components. The result is a system that scales with confidence -
          new features can be added without fear of breaking the rendering contract.
        </KeyTakeaway>
      </div>
      <TableOfContents items={tocItems} />
    </div>
  )
}
