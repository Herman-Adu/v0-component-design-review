"use client"

import type { CaseStudy } from "@/data/content-library/case-studies"
import {
  SectionHeader,
  InfoBox,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  ProcessFlow,
  ArchitectureDiagram,
  BeforeAfterComparison,
  FeatureGrid,
  ArticleIcons,
  VerticalFlow,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "context", title: "Context", level: 2 },
  { id: "problem-analysis", title: "Problem Analysis", level: 2 },
  { id: "solution-approach", title: "Solution Approach", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "lessons-learned", title: "Lessons Learned", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function ClientToServerContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Context" id="context" />

        <p className="text-muted-foreground mb-6">
          When we first built the electrical services website with Next.js, every component was a client component.
          This was the path of least resistance - everything just worked with &quot;use client&quot; at the top.
          But as the application grew, so did the JavaScript bundle. Page loads slowed, Lighthouse scores dropped,
          and mobile users on slower connections had a noticeably degraded experience.
        </p>

        <InfoBox type="info" title="Why This Matters">
          Server components are rendered on the server and send only HTML to the browser. This means zero JavaScript
          for static content like navigation, footers, headings, and layout wrappers. For a content-heavy site,
          this can eliminate 30-50% of the client-side JavaScript.
        </InfoBox>

        <SectionHeader number="02" title="Problem Analysis" id="problem-analysis" />

        <p className="text-muted-foreground mb-6">
          A thorough audit revealed that 100% of our components were client-side, despite most of them
          being entirely static. The Navbar, Footer, Hero section, service descriptions - none of these
          needed client interactivity, yet they were all shipping JavaScript to the browser.
        </p>

        <MetricsGrid
          metrics={[
            { label: "Bundle Size", value: "450KB", change: "Excessive for content site", positive: false },
            { label: "FCP", value: "1.8s", change: "Above 1.5s threshold", positive: false },
            { label: "Lighthouse", value: "78", change: "Below 90 target", positive: false },
            { label: "Client Components", value: "100%", change: "No server rendering", positive: false },
          ]}
        />

        <ArchitectureDiagram
          title="Before: Everything Client-Side"
          layers={[
            { name: "Browser (All JavaScript)", items: ["Navbar", "Hero", "Forms", "Footer", "Services", "Contact"], color: "#ef4444" },
            { name: "Hydration Required", items: ["Every component hydrated", "Even static content"], color: "#f59e0b" },
            { name: "Server", items: ["Only serves JavaScript bundle", "No HTML pre-rendering"], color: "#6b7280" },
          ]}
        />

        <SectionHeader number="03" title="Solution Approach" id="solution-approach" />

        <p className="text-muted-foreground mb-6">
          We conducted a component-by-component audit, classifying each as either truly interactive
          (needs event handlers, state, effects) or static (can be server-rendered). The goal was to push
          &quot;use client&quot; as far down the component tree as possible.
        </p>

        <VerticalFlow
          title="Migration Strategy"
          steps={[
            { title: "Audit", description: "Classified all 24 components as interactive or static. Found that 18 of 24 were purely static." },
            { title: "Remove Top-Level use client", description: "Removed 'use client' from page.tsx and layout.tsx, making them server components by default." },
            { title: "Create Client Boundaries", description: "Wrapped only interactive parts (form inputs, mobile menu toggle) in dedicated client components." },
            { title: "Extract Interactivity", description: "Split large components: static wrapper as server component, interactive island as client component." },
            { title: "Verify & Measure", description: "Ran Lighthouse, checked hydration boundaries, validated no functionality was lost." },
          ]}
        />

        <SectionHeader number="04" title="Implementation" id="implementation" />

        <BeforeAfterComparison
          beforeTitle="Before: Monolithic Client Page"
          beforeCode={`"use client"

// Everything was client-side
export default function HomePage() {
  return (
    <>
      <Navbar />        {/* Static - doesn't need JS */}
      <Hero />          {/* Static - doesn't need JS */}
      <Services />      {/* Static - doesn't need JS */}
      <MultiStepForm /> {/* Interactive - needs JS */}
      <Testimonials />  {/* Static - doesn't need JS */}
      <Footer />        {/* Static - doesn't need JS */}
    </>
  )
}`}
          afterTitle="After: Hybrid Architecture"
          afterCode={`// Server component (default - no directive needed)
export default function HomePage() {
  return (
    <>
      <Navbar />           {/* Server component */}
      <Hero />             {/* Server component */}
      <Services />         {/* Server component */}
      <FormContainer />    {/* Client boundary */}
      <Testimonials />     {/* Server component */}
      <Footer />           {/* Server component */}
    </>
  )
}

// Only the form wrapper is a client component
// "use client" in FormContainer.tsx only`}
          improvements={[
            { metric: "Client components", before: "24 (100%)", after: "6 (25%)" },
            { metric: "JS shipped", before: "450KB", after: "292KB" },
            { metric: "Hydration boundaries", before: "Every component", after: "Only interactive" },
          ]}
        />

        <ArchitectureDiagram
          title="After: Hybrid Server/Client Architecture"
          layers={[
            { name: "Server Components (75%)", items: ["Navbar", "Hero", "Services", "Footer", "Testimonials", "Layout"], color: "#22c55e" },
            { name: "Client Boundary", items: ["FormContainer", "MobileMenuToggle", "ThemeToggle"], color: "#3b82f6" },
            { name: "Client Components (25%)", items: ["MultiStepForm", "FormInputs", "DatePicker"], color: "#f59e0b" },
          ]}
        />

        <CodeBlock
          filename="components/Navbar.tsx"
          language="tsx"
          code={`// Server component - no "use client" directive
// Zero JavaScript sent to browser for this component
import Link from "next/link"
import { MobileMenuToggle } from "./MobileMenuToggle"

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container flex items-center justify-between py-4">
        <Link href="/">Electrical Services</Link>
        <div className="hidden md:flex gap-6">
          <Link href="/services">Services</Link>
          <Link href="/contact">Contact</Link>
        </div>
        {/* Only this tiny piece is client-side */}
        <MobileMenuToggle />
      </div>
    </nav>
  )
}`}
        />

        <SectionHeader number="05" title="Results & Metrics" id="results" />

        <StatsTable
          title="Performance Comparison"
          headers={["Metric", "Before", "After", "Improvement"]}
          rows={caseStudy.results.metrics.map((m) => [m.label, m.before, m.after, m.improvement])}
        />

        <MetricsGrid
          metrics={[
            { label: "Bundle Size", value: "292KB", change: "-35%", positive: true },
            { label: "FCP", value: "1.1s", change: "-39%", positive: true },
            { label: "Lighthouse", value: "94", change: "+16 points", positive: true },
            { label: "TTI", value: "1.5s", change: "-38%", positive: true },
          ]}
        />

        <InfoBox type="tip" title="Quick Win">
          The biggest gains came from the simplest change: removing &quot;use client&quot; from layout.tsx and page.tsx.
          This single change converted the Navbar, Footer, and all layout wrappers to server components, 
          saving approximately 120KB of JavaScript.
        </InfoBox>

        <SectionHeader number="06" title="Lessons Learned" id="lessons-learned" />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Default to Server",
              description: "Start with server components everywhere. Only add 'use client' when you genuinely need interactivity.",
            },
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Push Boundaries Down",
              description: "Keep client boundaries as low in the tree as possible. Wrap the smallest interactive piece, not entire sections.",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Audit Regularly",
              description: "Components evolve. A previously interactive component may become static after a refactor. Audit quarterly.",
            },
            {
              icon: <ArticleIcons.Target className="h-5 w-5" />,
              title: "Measure Impact",
              description: "Use Lighthouse CI, bundle analyzers, and real-user monitoring to quantify every architectural change.",
            },
          ]}
        />

        <SectionHeader number="07" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          Push &quot;use client&quot; down the component tree. Default to server components, only add client interactivity 
          where genuinely needed. In our case, this reduced the JavaScript bundle by 35% and improved 
          First Contentful Paint by 39% - all without changing any user-facing functionality.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { href: "/dashboard/content-library/case-studies/state-management-evolution", title: "State Management Evolution", level: "intermediate" },
            { href: "/dashboard/content-library/articles/refactoring-for-maintainability", title: "Refactoring for Maintainability", level: "intermediate" },
          ]}
        />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
