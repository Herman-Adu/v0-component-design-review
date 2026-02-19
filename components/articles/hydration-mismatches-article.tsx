"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
  FeatureGrid,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  VerticalFlow,
  DataFlowDiagram,
  DecisionTree,
  BeforeAfterComparison,
  ArchitectureDiagram,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "discovery", title: "How We Found It", level: 2 },
  { id: "cascade-effect", title: "The Cascade Effect", level: 2 },
  { id: "hydration-mechanics", title: "Hydration Mechanics", level: 2 },
  { id: "performance-impact", title: "Performance Impact", level: 2 },
  { id: "diagnosis", title: "Diagnosis Approach", level: 2 },
  { id: "the-fix", title: "The Fix", level: 2 },
  { id: "prevention", title: "Prevention Rules", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function HydrationMismatchesArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="important">
          Code Review #4 found all 3 dashboard layouts were marked with &quot;use client&quot;, causing the
          entire dashboard (23 pages, 45+ components) to hydrate as a client-side application. The
          fix was straightforward but the cascade effect was systemic: every child component of a
          Client Component layout is forced into client-side rendering, regardless of whether it
          needs browser APIs.
        </InfoBox>

        {/* Section 1 */}
        <SectionHeader number="01" title="How We Found It" id="discovery" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          During Code Review #4, the architecture axis audit included a check for &quot;use client&quot;
          directives in layout files. The reasoning: layouts are shared wrappers that render for
          every page in their route segment. If a layout is a Client Component, every page under
          it becomes a Client Component tree -- even if those pages only display static content.
        </p>

        <MetricsGrid
          metrics={[
            { label: "Client Layouts Found", value: "3", change: "All dashboard layouts", positive: false },
            { label: "Affected Pages", value: "23", change: "Entire dashboard", positive: false },
            { label: "Affected Components", value: "45+", change: "Forced client rendering", positive: false },
            { label: "Bundle Overhead", value: "~180KB", change: "Unnecessary JS shipped", positive: false },
          ]}
        />

        <CodeBlock
          filename="grep-that-found-it.sh"
          language="bash"
          code={`# The audit command that surfaced the issue
grep -rn "use client" app/**/layout.tsx

# Results:
# app/dashboard/layout.tsx:1:"use client"
# app/dashboard/admin/layout.tsx:1:"use client"
# app/dashboard/content-library/layout.tsx:1:"use client"

# Why were they client layouts?
# Each had a small piece of interactive UI:
# - dashboard/layout.tsx: Sidebar toggle button (useState)
# - admin/layout.tsx: Admin role check (useEffect + redirect)
# - content-library/layout.tsx: Search filter (useState)`}
        />

        {/* Section 2 */}
        <SectionHeader number="02" title="The Cascade Effect" id="cascade-effect" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          When a layout is marked &quot;use client&quot;, React treats the entire subtree below it as a
          client boundary. Every Server Component in that subtree is silently converted to a Client
          Component. There is no warning. No error. The pages render correctly -- they just ship
          significantly more JavaScript than necessary.
        </p>

        <ArchitectureDiagram
          title="Client Layout Cascade (The Problem)"
          layers={[
            {
              name: "Root Layout (Server Component)",
              items: ["<html>", "<body>", "<Providers>"],
              color: "#22c55e",
            },
            {
              name: "Dashboard Layout ('use client')",
              items: ["useState for sidebar toggle", "Everything below is now Client"],
              color: "#ef4444",
            },
            {
              name: "All Dashboard Pages (Forced Client)",
              items: ["23 pages shipped as JS", "45+ components in client bundle", "~180KB unnecessary JavaScript"],
              color: "#ef4444",
            },
          ]}
        />

        <DataFlowDiagram
          title="What Should Happen vs What Happened"
          nodes={[
            { label: "Server Render", description: "Layout + pages render on server" },
            { label: "HTML Sent", description: "Full HTML to browser" },
            { label: "JS Loaded", description: "Only Client Component JS" },
            { label: "Hydration", description: "Attach events to client elements" },
            { label: "Interactive", description: "Page is interactive" },
          ]}
        />

        <BeforeAfterComparison
          title="Rendering Impact"
          before={{
            label: "With 'use client' Layout",
            items: [
              "Server renders HTML for all pages (good)",
              "Browser downloads ALL component JS for 23 pages (~300KB)",
              "React hydrates the ENTIRE page tree",
              "Every component re-runs in the browser (wasteful)",
              "Static text content is double-rendered (server + client)",
              "Bundle includes components that never use browser APIs",
            ],
          }}
          after={{
            label: "With Server Component Layout",
            items: [
              "Server renders HTML for all pages (same)",
              "Browser downloads JS for ONLY interactive components (~120KB)",
              "React hydrates only the interactive leaf components",
              "Static content stays as server HTML (no re-render)",
              "Text, tables, diagrams have zero JS cost",
              "Bundle is 60% smaller",
            ],
          }}
        />

        {/* Section 3 */}
        <SectionHeader number="03" title="Hydration Mechanics" id="hydration-mechanics" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Hydration is the process where React attaches event listeners and state to server-rendered
          HTML. For Server Components, there is no hydration -- the HTML is final. For Client
          Components, React must download the component code, execute it in the browser, compare the
          output to the server HTML, and attach interactivity.
        </p>

        <StepFlow
          steps={[
            { title: "Server Render", description: "Component runs on server, outputs HTML" },
            { title: "HTML Streamed", description: "HTML sent to browser, user sees content" },
            { title: "JS Download", description: "Client Component JS bundles loaded" },
            { title: "Hydration", description: "React re-runs components, compares output" },
            { title: "Mismatch Check", description: "If output differs from server, error" },
          ]}
        />

        <InfoBox type="warning">
          Hydration mismatches occur when the server-rendered HTML and the client-rendered output
          differ. Common causes: Date/time rendering (server timezone vs client timezone), conditional
          rendering based on window.innerWidth (undefined on server), and Math.random() or
          Date.now() in render logic.
        </InfoBox>

        <SubSectionHeader title="Why Layouts Amplify the Problem" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          A Client Component page affects only itself. A Client Component layout affects every page
          nested under it. This is because Next.js preserves layouts across navigation -- they do
          not re-render when you navigate between sibling routes. But they DO establish the
          rendering boundary for their children.
        </p>

        <StatsTable
          title="Blast Radius: Component vs Layout"
          headers={["Element", "Scope of Impact", "JS Bundle Impact", "Hydration Cost"]}
          rows={[
            ["Client Component (leaf)", "1 component", "Component code only (~2-5KB)", "Minimal"],
            ["Client Page", "1 page + its components", "Page + children (~20-50KB)", "Moderate"],
            ["Client Layout (nested)", "All pages in segment", "Layout + all pages (~100-300KB)", "Severe"],
            ["Client Layout (root)", "ENTIRE application", "All components (~500KB+)", "Catastrophic"],
          ]}
        />

        {/* Section 4 */}
        <SectionHeader number="04" title="Performance Impact" id="performance-impact" />

        <MetricsGrid
          metrics={[
            { label: "JS Bundle", value: "-60%", change: "After fixing layouts", positive: true },
            { label: "Hydration Time", value: "-45%", change: "Fewer components to hydrate", positive: true },
            { label: "TTI (Time to Interactive)", value: "-1.2s", change: "On mobile devices", positive: true },
            { label: "Memory Usage", value: "-35%", change: "Fewer React fiber nodes", positive: true },
          ]}
        />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          The performance impact was most visible on mobile devices. The 180KB of unnecessary
          JavaScript added ~1.2 seconds to Time to Interactive on mid-range phones. On fast
          connections and desktop devices, the impact was less noticeable (200-300ms), which is
          why it went undetected until the code review.
        </p>

        <ComparisonCards
          leftTitle="Desktop (fast CPU, fast network)"
          leftItems={[
            "Extra JS parsed in ~200ms",
            "Hydration completes quickly",
            "Users unlikely to notice",
            "180KB wasted bandwidth",
            "Higher memory usage",
          ]}
          leftType="positive"
          rightTitle="Mobile (slow CPU, variable network)"
          rightItems={[
            "Extra JS takes 800ms-1.5s to parse",
            "Main thread blocked during hydration",
            "Buttons unresponsive for 1-2s after visible",
            "High INP (Interaction to Next Paint) scores",
            "Data usage impact on metered connections",
          ]}
          rightType="negative"
        />

        {/* Section 5 */}
        <SectionHeader number="05" title="Diagnosis Approach" id="diagnosis" />

        <VerticalFlow
          title="Step-by-Step Diagnosis"
          steps={[
            {
              title: "1. Find Client Layouts",
              description: "grep -rn 'use client' app/**/layout.tsx -- Any results mean a layout is forcing client rendering on its children.",
            },
            {
              title: "2. Check Why It Is Client",
              description: "Read each client layout. Identify which specific feature requires 'use client': useState? useEffect? onClick? Often it is a single small feature.",
            },
            {
              title: "3. Measure the Blast Radius",
              description: "Count the pages under that layout (ls app/dashboard/**/page.tsx | wc -l). This is the number of pages affected by the client boundary.",
            },
            {
              title: "4. Verify Bundle Impact",
              description: "Run ANALYZE=true next build to see which components are in the client bundle. Components under a client layout will all appear in the client bundle.",
            },
            {
              title: "5. Extract the Interactive Part",
              description: "Move the interactive feature (sidebar toggle, search, etc.) into a small dedicated Client Component. Keep the layout as a Server Component.",
            },
          ]}
        />

        {/* Section 6 */}
        <SectionHeader number="06" title="The Fix" id="the-fix" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          The fix follows a consistent pattern: identify the interactive element, extract it into a
          small Client Component, and keep the layout as a Server Component. The layout passes
          children (which can be Server Components) through composition.
        </p>

        <CodeBlock
          filename="before-dashboard-layout.tsx"
          language="typescript"
          code={`// BEFORE: Entire layout is a Client Component
"use client"

import { useState } from 'react'
import { DashboardNav } from '@/components/molecules/dashboard-nav'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      <DashboardNav
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={sidebarOpen ? 'ml-64' : 'ml-16'}>
        {children}
      </main>
    </div>
  )
}
// PROBLEM: children (23 pages) are all forced into client rendering`}
        />

        <CodeBlock
          filename="after-dashboard-layout.tsx"
          language="typescript"
          code={`// AFTER: Layout is a Server Component
// The interactive sidebar is extracted to a Client Component

// app/dashboard/layout.tsx (Server Component -- no "use client")
import { DashboardShell } from '@/components/organisms/dashboard-shell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardShell>
      {children} {/* Children remain Server Components! */}
    </DashboardShell>
  )
}

// components/organisms/dashboard-shell.tsx (Client Component)
"use client"

import { useState } from 'react'
import { DashboardNav } from '@/components/molecules/dashboard-nav'

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex min-h-screen">
      <DashboardNav
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className={sidebarOpen ? 'ml-64' : 'ml-16'}>
        {children} {/* Children passed through -- stay as Server Components */}
      </main>
    </div>
  )
}
// FIX: The layout is a Server Component.
// DashboardShell is Client (needs useState).
// But children are passed as React.ReactNode (JSX), which crosses the
// boundary as pre-rendered content. Pages stay as Server Components.`}
        />

        <InfoBox type="tip">
          The key insight is that children passed as React.ReactNode to a Client Component do
          NOT become Client Components. They cross the boundary as pre-rendered JSX. This is
          the composition pattern -- and it is the foundation of performant Next.js architecture.
        </InfoBox>

        {/* Section 7 */}
        <SectionHeader number="07" title="Prevention Rules" id="prevention" />

        <DecisionTree
          title="Should This Layout Be a Client Component?"
          decisions={[
            { condition: "Layout uses useState, useEffect, or event handlers?", result: "Check if interactive part can be extracted", recommended: false },
            { condition: "Interactive part CAN be extracted to child Client Component?", result: "Extract it. Keep layout as Server Component.", recommended: true },
            { condition: "Interactive part CANNOT be extracted (extremely rare)?", result: "Document why and measure bundle impact." },
            { condition: "Layout has NO interactivity at all?", result: "Keep as Server Component (default). No action needed.", recommended: true },
          ]}
        />

        <FeatureGrid
          columns={2}
          features={[
            {
              title: "Code Review Rule",
              description: "Any PR that adds 'use client' to a layout file requires explicit justification and bundle size measurement before approval.",
              items: [
                "grep 'use client' app/**/layout.tsx in CI",
                "Block PR if new client layout added without justification",
                "Require before/after bundle comparison",
              ],
            },
            {
              title: "Architecture Rule",
              description: "Layouts are structural -- they define route segments and navigation. They should almost never need browser APIs.",
              items: [
                "Layouts handle: structure, metadata, data fetching",
                "Layouts should NOT handle: state, effects, event handlers",
                "Extract interactivity to child organisms",
              ],
            },
          ]}
        />

        {/* Key Takeaway */}
        <SectionHeader number="08" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          A &quot;use client&quot; directive on a layout file is an architectural decision with cascading
          consequences -- it forces every page in that route segment into client-side rendering.
          The fix is always the same: extract the interactive part into a small Client Component
          and keep the layout as a Server Component. Add a grep-based CI check to prevent
          accidental client layouts from entering the codebase. The composition pattern (passing
          Server Component children through Client Component wrappers) makes this possible without
          sacrificing interactivity.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            {
              title: "The Architectural Cost of Duplicate Providers",
              href: "/dashboard/content-library/articles/architecture/duplicate-providers-architectural-cost",
            },
            {
              title: "Server/Client Boundaries",
              href: "/dashboard/content-library/articles/architecture/server-client-boundaries",
            },
            {
              title: "Why React Hydration Breaks",
              href: "/dashboard/content-library/articles/architecture/why-react-hydration-breaks",
            },
          ]}
        />
      </div>

      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
