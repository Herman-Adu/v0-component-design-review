"use client"

import {
  TableOfContents,
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  CodeBlock,
  StepFlow,
  MetricsGrid,
  DataFlowDiagram,
  DecisionTree,
  StatsTable,
  FeatureGrid,
  ComparisonCards,
  BeforeAfterComparison,
  KeyTakeaway,
  RelatedArticles,
} from "@/components/molecules/article-components"
import { Zap, Globe, FileText, Server, Monitor, RefreshCw, Clock, Layers } from "lucide-react"
import type { CaseStudy } from "@/data/content-library/case-studies"

const tocItems = [
  { id: "context", title: "Context", level: 1 },
  { id: "problem", title: "The Problem", level: 1 },
  { id: "discovery", title: "Discovery Phase", level: 1 },
  { id: "rendering-audit", title: "Rendering Audit", level: 2 },
  { id: "solution", title: "Solution", level: 1 },
  { id: "strategy-mapping", title: "Strategy Mapping", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "results", title: "Results", level: 1 },
  { id: "lessons", title: "Lessons Learned", level: 1 },
  { id: "related", title: "Related Reading", level: 1 },
]

export function RenderingStrategyContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        {/* Section 1: Context */}
        <SectionHeader id="context" number={1} title="Context" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          Our Next.js 16 application had grown to 58 pages, but every page used the same rendering approach: 
          dynamic server-side rendering on every request. This meant marketing pages, documentation, dashboards, 
          and forms all had identical load characteristics -- none optimised for their actual usage patterns.
        </p>

        <MetricsGrid
          metrics={[
            { label: "Total Pages", value: "58", change: "All dynamic" },
            { label: "Avg TTFB", value: "890ms", positive: false, change: "Too slow" },
            { label: "Cache Hit Rate", value: "0%", positive: false, change: "No caching" },
            { label: "Server Load", value: "High", positive: false, change: "Every request computed" },
          ]}
        />

        {/* Section 2: The Problem */}
        <SectionHeader id="problem" number={2} title="The Problem" />
        <InfoBox type="warning" title="One-Size-Fits-All Rendering">
          Every page was dynamically rendered on each request, regardless of whether the content changed hourly, 
          daily, or never. Marketing pages rebuilt their HTML on every visit. Documentation re-rendered unchanged 
          content thousands of times per day. The server was doing unnecessary work on every single request.
        </InfoBox>

        <ComparisonCards
          leftTitle="What We Had"
          leftData={[
            "All pages: dynamic SSR",
            "No static generation",
            "No ISR configured",
            "No per-route caching",
            "Uniform slow performance",
          ]}
          rightTitle="What We Needed"
          rightData={[
            "Static pages for marketing",
            "ISR for content that changes",
            "Dynamic for user-specific data",
            "Per-route rendering strategy",
            "Optimised per page type",
          ]}
        />

        {/* Section 3: Discovery Phase */}
        <SectionHeader id="discovery" number={3} title="Discovery Phase" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We audited every route in the application to understand its data freshness requirements, 
          personalisation needs, and traffic patterns. This audit revealed three distinct page categories.
        </p>

        <SubSectionHeader id="rendering-audit" title="Rendering Audit Results" />
        <StatsTable
          title="Page Category Analysis"
          headers={["Category", "Page Count", "Data Freshness", "Personalised?", "Recommended Strategy"]}
          rows={[
            ["Marketing / Landing", "8", "Changes monthly", "No", "Static (SSG)"],
            ["Documentation", "22", "Changes weekly", "No", "ISR (60 min revalidate)"],
            ["Dashboard / Forms", "18", "Real-time", "Yes", "Dynamic SSR"],
            ["Content Library", "10", "Changes daily", "No", "ISR (30 min revalidate)"],
          ]}
        />

        <DataFlowDiagram
          title="Decision Flow: Choosing a Rendering Strategy"
          nodes={[
            { label: "New Page", icon: <FileText className="h-4 w-4" /> },
            { label: "Personalised?", icon: <Monitor className="h-4 w-4" />, description: "User-specific data?" },
            { label: "Changes Often?", icon: <RefreshCw className="h-4 w-4" />, description: "Hourly or real-time?" },
            { label: "Strategy Selected", icon: <Zap className="h-4 w-4" />, description: "SSG / ISR / Dynamic" },
          ]}
        />

        {/* Section 4: Solution */}
        <SectionHeader id="solution" number={4} title="Solution" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We implemented a per-route rendering strategy using Next.js built-in mechanisms: 
          static generation for marketing, ISR with <code>revalidate</code> for content, 
          and dynamic rendering for authenticated pages.
        </p>

        <SubSectionHeader id="strategy-mapping" title="Strategy Mapping" />
        <DecisionTree
          title="Which Rendering Strategy Per Page Type?"
          decisions={[
            { condition: "Page has no dynamic data and rarely changes?", result: "Static Generation (SSG) -- build-time HTML", recommended: true },
            { condition: "Page content changes periodically but is not personalised?", result: "ISR with revalidate interval matching change frequency" },
            { condition: "Page shows user-specific or real-time data?", result: "Dynamic SSR -- computed on every request" },
            { condition: "Page has both static shell and dynamic content?", result: "Partial rendering -- static shell with client-fetched dynamic parts", recommended: true },
          ]}
        />

        <SubSectionHeader id="implementation" title="Implementation Details" />
        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <Globe className="h-5 w-5" />,
              title: "Marketing Pages (SSG)",
              description: "Added generateStaticParams() and removed all dynamic data fetching. Pages now serve from CDN edge with 0ms TTFB.",
            },
            {
              icon: <RefreshCw className="h-5 w-5" />,
              title: "Documentation (ISR 60min)",
              description: "Added revalidate: 3600 to layout. Content regenerates at most once per hour. Serves stale while revalidating.",
            },
            {
              icon: <Server className="h-5 w-5" />,
              title: "Dashboards (Dynamic)",
              description: "Kept dynamic rendering for authenticated routes. Added cookies() and headers() usage to opt into dynamic.",
            },
            {
              icon: <Layers className="h-5 w-5" />,
              title: "Content Library (ISR 30min)",
              description: "Articles and case studies use ISR with 30-minute revalidation. New content appears within half an hour of publishing.",
            },
          ]}
        />

        <CodeBlock
          language="typescript"
          filename="app/dashboard/content-library/layout.tsx"
          code={`// ISR: Revalidate content library every 30 minutes
export const revalidate = 1800

export default function ContentLibraryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="content-library-wrapper">{children}</div>
}`}
        />

        <CodeBlock
          language="typescript"
          filename="app/(marketing)/page.tsx"
          code={`// SSG: Fully static at build time
// No dynamic functions (cookies, headers, searchParams)
// No revalidate needed -- rebuilds on deploy

export default function HomePage() {
  return <LandingPage />
}

// Optional: Force static even if layout is dynamic
export const dynamic = 'force-static'`}
        />

        {/* Section 5: Results */}
        <SectionHeader id="results" number={5} title="Results" />
        <BeforeAfterComparison
          title="Performance Impact"
          items={[
            { label: "Avg TTFB (marketing)", before: "890ms", after: "12ms" },
            { label: "Avg TTFB (docs)", before: "890ms", after: "45ms (cached)" },
            { label: "Server compute per day", before: "~50,000 renders", after: "~8,000 renders" },
            { label: "CDN cache hit rate", before: "0%", after: "78%" },
            { label: "Monthly server cost", before: "Baseline", after: "-40% reduction" },
          ]}
        />

        <MetricsGrid
          metrics={[
            { label: "TTFB (Marketing)", value: "12ms", change: "98.7% faster", positive: true },
            { label: "Cache Hit Rate", value: "78%", change: "From 0%", positive: true },
            { label: "Server Renders/Day", value: "-84%", change: "50K to 8K", positive: true },
            { label: "Lighthouse Score", value: "98", change: "+22 points", positive: true },
          ]}
        />

        <InfoBox type="success" title="Key Win">
          Marketing pages went from 890ms TTFB to 12ms -- a 98.7% improvement -- by simply serving 
          pre-built HTML from the CDN edge. No code changes to the components themselves were needed.
        </InfoBox>

        {/* Section 6: Lessons */}
        <SectionHeader id="lessons" number={6} title="Lessons Learned" />
        <StepFlow
          title="Key Takeaways"
          steps={[
            { number: 1, title: "Audit First", description: "Map every route's data freshness, personalisation needs, and traffic before choosing strategies." },
            { number: 2, title: "Default to Static", description: "Start with SSG. Only add ISR or dynamic when the page genuinely needs it." },
            { number: 3, title: "Match Revalidation to Reality", description: "Set revalidate intervals based on actual content change frequency, not arbitrary values." },
            { number: 4, title: "Measure the Impact", description: "Track TTFB, cache hit rates, and server compute before and after to prove the value." },
          ]}
        />

        <KeyTakeaway>
          The biggest performance gains come not from optimising code, but from choosing the right rendering 
          strategy per page. A static marketing page served from CDN will always outperform the most optimised 
          dynamic render. Audit your routes, match strategies to data freshness needs, and measure the results.
        </KeyTakeaway>

        {/* Section 7: Related */}
        <SectionHeader id="related" number={7} title="Related Reading" />
        <RelatedArticles
          articles={[
            { title: "ISR, SSR, SSG: Which Rendering Strategy Fits?", href: "/dashboard/content-library/articles/isr-ssr-ssg-which-rendering-strategy-fits", level: "intermediate" },
            { title: "Performance Budgets for Web Applications", href: "/dashboard/content-library/articles/performance-budgets-for-web-applications", level: "advanced" },
            { title: "The Service Request Lifecycle", href: "/dashboard/content-library/articles/business/service-request-lifecycle", level: "beginner" },
          ]}
        />
      </div>

      {/* Right sidebar TOC */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  )
}
