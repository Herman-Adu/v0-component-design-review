"use client"

import type { CaseStudy } from "@/data/content-library/case-studies"
import {
  SectionHeader,
  InfoBox,
  StepFlow,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  ProcessFlow,
  MetricsGrid,
  TableOfContents,
  FeatureGrid,
  StatsTable,
  BeforeAfterComparison,
} from "@/components/molecules/article-components"

const tocItems = [
  { id: "recurring-problem", title: "The Recurring Problem", level: 2 },
  { id: "failed-approaches", title: "Failed Approaches", level: 2 },
  { id: "root-cause", title: "Root Cause Analysis", level: 2 },
  { id: "architectural-solution", title: "The Architectural Solution", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "measured-results", title: "Measured Results", level: 2 },
  { id: "lessons-learned", title: "Lessons for Leaders", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function HydrationGuardCaseStudyContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-10">
      <div className="prose prose-invert max-w-none flex-1">
        <SectionHeader number="01" title="The Recurring Problem" id="recurring-problem" />

        <InfoBox type="info" title="Context: What is Hydration?">
          In modern web applications, the server generates HTML so users see content immediately. When that HTML arrives in the
          browser, React &ldquo;hydrates&rdquo; it - attaching event listeners and connecting it to the application&apos;s state management.
          Hydration requires the server-generated HTML to exactly match what the client-side React would produce. When they differ,
          React reports a hydration error. These errors can silently break interactivity and accessibility in production.
        </InfoBox>

        <p className="text-muted-foreground leading-relaxed">
          Our application dashboard features a collapsible sidebar navigation with approximately 30 expandable sections across
          four major categories. After introducing the sidebar, we began experiencing intermittent hydration errors. The errors
          appeared in the console as mismatched <code className="text-accent">aria-controls</code> attributes, with server-rendered
          IDs differing from client-rendered IDs. Initially, the errors seemed isolated and manageable.
        </p>

        <StatsTable
          title="Problem Timeline"
          headers={["Event", "Impact", "Resolution"]}
          rows={[
            ["Initial sidebar build", "Hydration error on page load", "Added useEffect to sync open state"],
            ["Added Learning Hub sections (+9 items)", "Hydration errors returned", "Added useEffect to new sections"],
            ["Added article categories (+6 items)", "Multiple simultaneous errors", "Changed initialisation order"],
            ["Added case study sections (+4 items)", "Errors cascade through entire sidebar", "Attempted suppressHydrationWarning"],
          ]}
        />

        <InfoBox type="warning" title="The Pattern">
          Every sidebar expansion triggered new hydration errors. Each fix took 1-3 hours and only lasted until the next content
          addition. The total accumulated debugging time exceeded 15 hours across four iterations, with each fix creating a more
          fragile system that required more knowledge to maintain.
        </InfoBox>

        <SectionHeader number="02" title="Failed Approaches" id="failed-approaches" />

        <p className="text-muted-foreground leading-relaxed">
          Understanding why each attempted fix failed reveals a progression from symptom treatment to root cause analysis. Each
          approach solved the immediate error but did not address the underlying architectural problem.
        </p>

        <FeatureGrid
          features={[
            {
              title: "Attempt 1: Matching Initial State",
              description: "We tried initialising all collapsible sections to closed (open={false}) on both server and client, then opening the active section in useEffect. This produced matching HTML but caused a visible flash where sections collapsed then expanded. The Radix Collapsible component still generated internal IDs during SSR, and those IDs shifted when sections opened.",
            },
            {
              title: "Attempt 2: Conditional Rendering",
              description: "We tried rendering collapsible content only when the section was open. This changed the component tree structure between server (all closed) and client (active sections open), shifting the positions of all subsequent useId() calls and making the ID mismatch worse.",
            },
            {
              title: "Attempt 3: suppressHydrationWarning",
              description: "React offers a suppressHydrationWarning attribute that silences the console error. This hid the symptom but did not fix the underlying problem. Event handlers were still attached to the wrong elements, and screen readers received incorrect aria-controls connections. The errors were invisible but the bugs were real.",
            },
            {
              title: "Attempt 4: Per-Component useEffect Guards",
              description: "We added individual useState(false) + useEffect(setOpen(true)) guards to every collapsible component. This worked temporarily but required every developer to remember to apply the pattern to every new collapsible. With 30+ sections, maintaining these guards became a source of bugs itself.",
            },
          ]}
        />

        <ProcessFlow
          title="The Diminishing Returns Cycle"
          steps={[
            { label: "Add Content", sublabel: "New sidebar sections" },
            { label: "Error Appears", sublabel: "Hydration mismatch", color: "yellow" },
            { label: "Apply Fix", sublabel: "Per-component workaround" },
            { label: "Next Addition", sublabel: "Breaks again", color: "yellow" },
          ]}
        />

        <SectionHeader number="03" title="Root Cause Analysis" id="root-cause" />

        <InfoBox type="info" title="Background: How Radix UI Generates IDs">
          Radix UI is an accessibility-first component library that generates unique IDs for ARIA attributes. These IDs connect
          trigger buttons to their content panels, enabling screen readers to navigate the interface. Radix uses React&apos;s useId()
          hook internally, which generates IDs based on a component&apos;s position in the React tree. The same tree structure always
          produces the same IDs. Different tree structures produce different IDs. This is by design - it ensures uniqueness without
          requiring manual ID management.
        </InfoBox>

        <p className="text-muted-foreground leading-relaxed">
          The root cause was not a bug in any individual component. It was an architectural mismatch between two requirements:
          (1) Radix Collapsible components need to exist in the same tree positions on server and client to generate matching IDs,
          and (2) the sidebar&apos;s open/closed state depends on the current URL pathname, which is not available during server
          rendering in the same way as on the client.
        </p>

        <BeforeAfterComparison
          before={{
            title: "Server Render (No Pathname Context)",
            items: [
              "All 30 Collapsible sections render closed",
              "Radix generates IDs: :R1:, :R2:, :R3: ... :R30:",
              "Each section renders minimal child tree",
              "Total useId() calls: ~30",
            ],
          }}
          after={{
            title: "Client Render (Pathname Available)",
            items: [
              "Active section opens, renders full child tree",
              "Extra children insert new useId() calls into tree",
              "IDs shift: :R1:, :R2:, :R2a:, :R2b:, :R3: ...",
              "Total useId() calls: ~35+ (varies by active section)",
            ],
          }}
        />

        <p className="text-muted-foreground leading-relaxed">
          The fundamental insight: any approach that allows Radix components to participate in server rendering will produce
          mismatched IDs whenever the component tree differs between server and client. The only way to guarantee matching IDs
          is to guarantee matching trees. And the simplest way to guarantee matching trees is to exclude the non-deterministic
          components from server rendering entirely.
        </p>

        <SectionHeader number="04" title="The Architectural Solution" id="architectural-solution" />

        <InfoBox type="info" title="Background: The Guard Pattern">
          A guard is a conditional check at a system boundary that controls access to protected resources. In authentication,
          a route guard redirects unauthenticated users to a login page. In our case, a hydration guard checks whether the
          application has completed hydration and only renders interactive components after it has. The guard replaces the
          protected components with a static skeleton during server rendering, ensuring zero non-deterministic output reaches
          the server HTML.
        </InfoBox>

        <StepFlow
          steps={[
            { number: 1, title: "Create useHydration Hook", description: "useSyncExternalStore-based detection: false during SSR, true after hydration" },
            { number: 2, title: "Build Static Skeleton", description: "Pure HTML/CSS sidebar skeleton with zero Radix components or hooks" },
            { number: 3, title: "Apply Guard at Root", description: "Single conditional in DocsSidebar: if not hydrated, return skeleton" },
            { number: 4, title: "Remove All Workarounds", description: "Delete every useEffect-based open state sync from child components" },
          ]}
        />

        <ComparisonCards
          leftTitle="Before: Distributed Workarounds"
          leftItems={[
            "30+ useState(false) + useEffect guards",
            "Each new section needs manual guard",
            "Visible flash on page load (close then open)",
            "Developers must understand hydration internals",
            "Errors recur with every content addition",
          ]}
          rightTitle="After: Centralised Guard"
          rightItems={[
            "1 guard at the sidebar root",
            "New sections are automatically protected",
            "Clean skeleton-to-sidebar transition",
            "Developers add sections normally",
            "Zero hydration errors permanently",
          ]}
        />

        <SectionHeader number="05" title="Implementation" id="implementation" />

        <CodeBlock
          title="hooks/use-hydration.ts - The core primitive"
          code={`"use client"
import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

// useSyncExternalStore is React's official solution for values
// that differ between server and client.
//
// - 2nd argument (getSnapshot): called on client → returns true
// - 3rd argument (getServerSnapshot): called during SSR → returns false
//
// Unlike useState + useEffect, this is synchronous:
// no double-render, no flash, no timing issues.
export function useHydration(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // Client: always hydrated
    () => false    // Server: never hydrated
  )
}`}
        />

        <CodeBlock
          title="DocsSidebar - Guard application"
          code={`export function DocsSidebar() {
  const hydrated = useHydration()
  const pathname = usePathname()

  // GUARD: Render skeleton during SSR.
  // No Radix components exist → no IDs generated → no mismatches
  if (!hydrated) {
    return <SidebarSkeleton />
  }

  // AFTER HYDRATION: Safe to render full sidebar.
  // Components mount fresh (not hydrating) → no ID conflicts.
  // useState can safely initialise with pathname-derived values.
  return (
    <Sidebar>
      {sections.map(section => (
        <NavCollapsible key={section.title} section={section} />
      ))}
    </Sidebar>
  )
}

// Child components BEFORE the guard:
function NavCollapsible({ section }) {
  const [isOpen, setIsOpen] = useState(false)         // Always false
  useEffect(() => {                                    // Then sync
    if (isActive) setIsOpen(true)
  }, [isActive])
  // ...
}

// Child components AFTER the guard:
function NavCollapsible({ section }) {
  const [isOpen, setIsOpen] = useState(isActive)       // Correct immediately
  // No useEffect needed - component only mounts after hydration
  // ...
}`}
        />

        <SectionHeader number="06" title="Measured Results" id="measured-results" />

        <MetricsGrid
          metrics={[
            { label: "Hydration Errors", value: "0 (was 4-8/quarter)" },
            { label: "Lines of Workaround Code Removed", value: "60+" },
            { label: "Time to Add Sidebar Section", value: "< 5 min" },
            { label: "Guard Implementation Time", value: "4 hours" },
          ]}
        />

        <StatsTable
          title="Before vs After Comparison"
          headers={["Metric", "Before (Workarounds)", "After (Guard)", "Change"]}
          rows={[
            ["Console hydration errors", "4-8 per quarter", "0", "-100%"],
            ["Developer time per sidebar change", "1-3 hours (includes debugging)", "5-10 minutes", "-95%"],
            ["useEffect state sync hooks", "30+ across child components", "0", "Eliminated"],
            ["Visual flash on navigation", "Yes (sections collapse/expand)", "No (clean skeleton swap)", "Eliminated"],
            ["Special knowledge required", "Hydration internals + Radix IDs", "None (add sections normally)", "Simplified"],
            ["Risk of regression per change", "High", "Zero (structural guarantee)", "Eliminated"],
          ]}
        />

        <SectionHeader number="07" title="Lessons for Leaders" id="lessons-learned" />

        <InfoBox type="important" title="Decision-Making Insight">
          The total time spent on reactive fixes (15+ hours across four iterations) exceeded the implementation time of the
          proactive solution (4 hours) by nearly 4x - and the reactive fixes were not permanent. This is a common pattern in
          software projects: the quick fix appears cheaper in the moment but accumulates a cost that eventually exceeds the
          architectural solution. The decision to invest in a proper solution is easier to justify when you track the cumulative
          cost of the workarounds it replaces.
        </InfoBox>

        <FeatureGrid
          features={[
            {
              title: "Track Recurring Issues",
              description: "If a category of bug appears more than twice, it is an architectural problem, not a code problem. Individual fixes treat symptoms. Architectural changes treat the disease. Maintain a simple tally of recurring issue types to identify candidates for structural investment.",
            },
            {
              title: "Measure the Cost of Inaction",
              description: "Every reactive fix has a visible cost (developer time) and an invisible cost (increased system fragility, knowledge burden, reduced velocity). When presenting architectural investments to stakeholders, quantify both. Our case: 15 hours of visible reactive cost plus unmeasured confidence and velocity impact vs 4 hours of one-time investment.",
            },
            {
              title: "Prefer Elimination Over Mitigation",
              description: "The strongest engineering solutions eliminate problem categories entirely rather than reducing their frequency. The guard pattern does not reduce hydration errors - it makes them structurally impossible. This is a qualitatively different outcome that requires no ongoing monitoring or maintenance.",
            },
            {
              title: "Design for the Next Developer",
              description: "The best architectural patterns require no special knowledge to use correctly. A new team member adding a sidebar section does not need to understand useId(), Radix internals, or hydration mechanics. They add their section, and it works. This is the hallmark of a well-designed boundary: it absorbs complexity so that downstream code can be simple.",
            },
          ]}
        />

        <SectionHeader number="08" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          When a bug keeps coming back after every fix, the bug is not in the code - it is in the architecture. Our four
          iterations of hydration workarounds each solved the immediate symptom but preserved the underlying structural problem.
          The guard pattern solved the problem once by changing the architecture: instead of trying to make non-deterministic
          components produce deterministic output during SSR, we removed them from SSR entirely. The result was not just zero
          hydration errors, but a simpler, more maintainable codebase where new features can be added without fear of regression.
          This is the ROI of architectural thinking: a one-time investment that eliminates an entire category of recurring cost.
        </KeyTakeaway>
      </div>
      <TableOfContents items={tocItems} />
    </div>
  )
}
