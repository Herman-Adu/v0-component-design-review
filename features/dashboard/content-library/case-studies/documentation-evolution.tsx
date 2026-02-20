"use client"

import type { CaseStudy } from "@/data/content-library/case-studies"
import {
  SectionHeader,
  InfoBox,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  ProcessFlow,
  ArchitectureDiagram,
  BeforeAfterComparison,
  FeatureGrid,
  ComparisonCards,
  ArticleIcons,
  VerticalFlow,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "context", title: "Context", level: 2 },
  { id: "problem-analysis", title: "Problem Analysis", level: 2 },
  { id: "content-architecture", title: "Content Architecture", level: 2 },
  { id: "component-system", title: "Component System", level: 2 },
  { id: "audience-strategy", title: "Audience Strategy", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "lessons-learned", title: "Lessons Learned", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function DocumentationEvolutionContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Context" id="context" />

        <p className="text-muted-foreground mb-6">
          Every growing engineering team faces the same challenge: knowledge accumulates in people&apos;s heads,
          not in systems. When a senior developer leaves, their architectural decisions, troubleshooting knowledge,
          and tribal wisdom leaves with them. We experienced this firsthand when our lead developer moved on and
          the team spent weeks reconstructing decisions that were never documented.
        </p>

        <p className="text-muted-foreground mb-6">
          The problem was not a lack of writing - we had README files, Notion pages, Slack threads, and Google Docs.
          The problem was that none of it was structured, discoverable, or maintained. New developers did not know
          where to look. Stakeholders had no visibility into technical decisions. And nobody could tell which
          documentation was current and which was months out of date.
        </p>

        <InfoBox type="info" title="Why Documentation Matters for Business">
          Research from Stripe found that developers spend 42% of their time dealing with technical debt
          and maintenance, much of which stems from poor documentation. The cost of bad documentation
          is not just developer frustration - it is measurable in onboarding time, repeated mistakes,
          and lost institutional knowledge.
        </InfoBox>

        <SectionHeader number="02" title="Problem Analysis" id="problem-analysis" />

        <p className="text-muted-foreground mb-6">
          We audited every piece of documentation across the organisation. The results were sobering:
          content scattered across 5 platforms, no consistent structure, no skill-level targeting,
          and no way to know if anything was still accurate.
        </p>

        <MetricsGrid
          metrics={[
            { label: "Documentation Sources", value: "5+", change: "Scattered everywhere", positive: false },
            { label: "Content Freshness", value: "Unknown", change: "No review dates", positive: false },
            { label: "Discoverability", value: "~20%", change: "Tribal knowledge", positive: false },
            { label: "Stakeholder Content", value: "0", change: "No business audience", positive: false },
          ]}
        />

        <ArchitectureDiagram
          title="Before: Scattered Documentation Landscape"
          layers={[
            { name: "Quick Notes", items: ["Slack threads (lost after 90 days)", "DM conversations", "Meeting chat"], color: "#ef4444" },
            { name: "Semi-Structured", items: ["Notion pages (3 orphaned)", "Google Docs (meeting notes)", "Confluence (abandoned)"], color: "#f59e0b" },
            { name: "Code-Adjacent", items: ["README.md (outdated)", "Code comments (sparse)", "JSDoc (incomplete)"], color: "#6b7280" },
          ]}
        />

        <ComparisonCards
          idealTitle="What Good Documentation Looks Like"
          notIdealTitle="What We Had"
          idealFor={[
            "Single source of truth",
            "Organised by topic and skill level",
            "Regular review and update cycle",
            "Accessible to all audiences",
          ]}
          notIdealFor={[
            "Content in 5+ locations",
            "No organisation or categorisation",
            "Unknown freshness and accuracy",
            "Developer-only, no business context",
          ]}
        />

        <SectionHeader number="03" title="Content Architecture" id="content-architecture" />

        <p className="text-muted-foreground mb-6">
          Rather than adopting yet another documentation platform, we built the Learning Hub directly into
          the application dashboard. This meant documentation lived alongside the code, was version-controlled,
          and could use the same component library as the application itself.
        </p>

        <p className="text-muted-foreground mb-6">
          We designed three distinct content types, each serving a different learning purpose:
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.File className="h-5 w-5" />,
              title: "Articles & Insights",
              description: "Deep-dive technical content covering architecture, security, testing, DevOps, accessibility, and business strategy. 28+ articles across 10 topic categories.",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Tutorials",
              description: "Hands-on, step-by-step guides with code examples and challenges. Covering Next.js, Strapi, testing frameworks, and integrations. 13+ tutorials.",
            },
            {
              icon: <ArticleIcons.TrendingUp className="h-5 w-5" />,
              title: "Case Studies",
              description: "Real-world before-and-after transformations with measurable results. Each includes problem context, solution approach, implementation, and quantified outcomes.",
            },
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "Multi-Audience Design",
              description: "Every piece of content is tagged with a skill level (beginner, intermediate, advanced) and relevant audience, from junior developers to CTOs.",
            },
          ]}
        />

        <ArchitectureDiagram
          title="After: Structured Learning Hub Architecture"
          layers={[
            { name: "Content Types", items: ["Articles (28+)", "Tutorials (13+)", "Case Studies (14)"], color: "#22c55e" },
            { name: "Organisation", items: ["10 topic categories", "3 skill levels", "Tag-based filtering", "Table of contents"], color: "#3b82f6" },
            { name: "Shared Components", items: ["SectionHeader", "CodeBlock", "MetricsGrid", "ProcessFlow", "ArchitectureDiagram", "12+ more"], color: "#8b5cf6" },
            { name: "Data Layer", items: ["TypeScript data files", "Type-safe schemas", "Slug-based routing", "Category filtering"], color: "#f59e0b" },
          ]}
        />

        <ProcessFlow
          title="Content Development Workflow"
          steps={[
            { label: "Identify Gap", sublabel: "Topic needed" },
            { label: "Draft Content", sublabel: "Write in data file" },
            { label: "Build Component", sublabel: "Use shared library" },
            { label: "Review & Publish", sublabel: "PR review process", color: "green" },
          ]}
        />

        <SectionHeader number="04" title="Component System" id="component-system" />

        <p className="text-muted-foreground mb-6">
          The key innovation was creating a shared component library specifically for content presentation.
          Instead of writing raw HTML or Markdown, every article, tutorial, and case study uses the same
          set of professionally designed components. This ensures visual consistency across 50+ pieces of content
          while dramatically reducing the effort to create new content.
        </p>

        <StatsTable
          title="Shared Component Library"
          headers={["Component", "Purpose", "Used In"]}
          rows={[
            ["SectionHeader", "Numbered section titles with anchor IDs", "Every content page"],
            ["TableOfContents", "Sticky sidebar navigation with scroll tracking", "Every content page"],
            ["CodeBlock", "Syntax-highlighted code with copy button", "Articles, Tutorials"],
            ["MetricsGrid", "Before/after metric cards with change indicators", "Case Studies, Articles"],
            ["BeforeAfterComparison", "Side-by-side code comparison with improvements", "Case Studies"],
            ["ArchitectureDiagram", "Layered system architecture visualisation", "Articles, Case Studies"],
            ["ProcessFlow", "Horizontal step-by-step flow diagrams", "All content types"],
            ["FeatureGrid", "Icon-titled feature cards in grid layout", "Articles, Tutorials"],
            ["InfoBox", "Contextual callouts (tip, warning, info)", "All content types"],
            ["StatsTable", "Structured data tables with headers", "Case Studies, Articles"],
            ["KeyTakeaway", "Highlighted summary callout", "Every content page"],
            ["RelatedArticles", "Cross-reference navigation links", "Every content page"],
          ]}
        />

        <InfoBox type="tip" title="Component Reuse in Practice">
          When we added new articles and case studies, the shared component library meant each new piece
          of content took roughly 2-3 hours to create instead of a full day. The components handle all styling,
          responsive design, dark mode, and accessibility - authors just focus on the content.
        </InfoBox>

        <BeforeAfterComparison
          beforeTitle="Before: Raw Documentation"
          beforeCode={`## Security Notes

We use rate limiting on the API.
The auth uses JWT tokens.
See John's Slack message from March
for the CSRF implementation details.

TODO: document the middleware setup
TODO: add code examples
TODO: review this section`}
          afterTitle="After: Structured Component-Based Content"
          afterCode={`<SectionHeader number="03" title="Security Architecture" />

<p>Multi-layered security with rate limiting,
JWT authentication, and CSRF protection.</p>

<ArchitectureDiagram
  title="Security Layers"
  layers={[
    { name: "Edge", items: ["Rate Limiting", "CORS"] },
    { name: "Auth", items: ["JWT Tokens", "CSRF"] },
    { name: "API", items: ["Input Validation"] },
  ]}
/>

<CodeBlock filename="middleware.ts" code={...} />`}
          improvements={[
            { metric: "Visual quality", before: "Plain text", after: "Professional components" },
            { metric: "Discoverability", before: "Search required", after: "Browseable with TOC" },
            { metric: "Maintainability", before: "Copy-paste", after: "Shared components" },
          ]}
        />

        <SectionHeader number="05" title="Audience Strategy" id="audience-strategy" />

        <p className="text-muted-foreground mb-6">
          One of the most impactful decisions was designing content for multiple audiences from the start.
          Traditional documentation serves only developers. Our Learning Hub serves three distinct audiences,
          each with different needs and reading patterns.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Junior Developers",
              description: "Beginner articles explain concepts from first principles. Tutorials provide step-by-step guidance with challenges. Case studies show real implementation patterns.",
            },
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Senior Developers & Leads",
              description: "Intermediate and advanced articles cover architectural trade-offs, testing strategy, and security deep-dives. Case studies provide decision-making context.",
            },
            {
              icon: <ArticleIcons.Target className="h-5 w-5" />,
              title: "CTOs & Decision Makers",
              description: "Business-focused articles on ROI analysis, technology decision frameworks, and cost reduction. Case studies with quantified business outcomes.",
            },
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "External Stakeholders",
              description: "The entire Learning Hub is designed to be shared publicly - demonstrating technical depth, engineering culture, and the quality of thinking behind decisions.",
            },
          ]}
        />

        <StatsTable
          title="Content Distribution by Audience"
          headers={["Audience Level", "Articles", "Tutorials", "Case Studies", "Key Topics"]}
          rows={[
            ["Beginner", "5", "4", "3", "Getting started, basic concepts, first projects"],
            ["Intermediate", "6", "4", "4", "Architecture, forms, state management, testing"],
            ["Advanced", "4", "2", "3", "Security, DevOps, performance, business strategy"],
          ]}
        />

        <SectionHeader number="06" title="Results & Metrics" id="results" />

        <StatsTable
          title="Documentation Transformation Results"
          headers={["Metric", "Before", "After", "Improvement"]}
          rows={caseStudy.results.metrics.map((m) => [m.label, m.before, m.after, m.improvement])}
        />

        <MetricsGrid
          metrics={[
            { label: "Content Resources", value: "50+", change: "+525% from 8 scattered", positive: true },
            { label: "Onboarding Time", value: "3 days", change: "-79% from 2 weeks", positive: true },
            { label: "Knowledge Retention", value: "Permanent", change: "Was tribal knowledge", positive: true },
            { label: "Shared Components", value: "15+", change: "Consistent presentation", positive: true },
          ]}
        />

        <InfoBox type="tip" title="Unexpected Benefit: Recruitment Tool">
          The Learning Hub became an unexpected recruitment asset. Candidates who explored it before interviews
          arrived with a deep understanding of our technical approach. Several cited it as a key factor in
          accepting offers, saying it demonstrated the engineering culture better than any job description could.
        </InfoBox>

        <SectionHeader number="07" title="Lessons Learned" id="lessons-learned" />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Lightbulb className="h-5 w-5" />,
              title: "Documentation Is a Product",
              description: "Treat documentation with the same rigour as application code: typed schemas, shared components, review processes, and user testing.",
            },
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Components Over Markdown",
              description: "A shared component library ensures visual consistency and reduces content creation time by 60%. Authors focus on substance, not formatting.",
            },
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "Multi-Audience from Day One",
              description: "Designing for beginners, seniors, and decision makers simultaneously creates content that serves as onboarding, reference, and sales material.",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Live in the Codebase",
              description: "Documentation that lives alongside application code gets maintained alongside it. Separate wikis and Notion pages inevitably go stale.",
            },
          ]}
        />

        <ProcessFlow
          title="Documentation Maturity Journey"
          steps={[
            { label: "Scattered", sublabel: "Multiple platforms", color: "yellow" },
            { label: "Centralised", sublabel: "Single location" },
            { label: "Structured", sublabel: "Types and categories", color: "blue" },
            { label: "Living Product", sublabel: "Maintained and growing", color: "green" },
          ]}
        />

        <SectionHeader number="08" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          {caseStudy.keyTakeaway}
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { href: "/dashboard/content-library/articles/atomic-design-principles", title: "Atomic Design Principles", level: "beginner" },
            { href: "/dashboard/content-library/articles/roi-modern-web-architecture", title: "ROI of Modern Web Architecture", level: "beginner" },
            { href: "/dashboard/content-library/case-studies/developer-productivity-gains", title: "Developer Productivity Gains", level: "intermediate" },
          ]}
        />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
