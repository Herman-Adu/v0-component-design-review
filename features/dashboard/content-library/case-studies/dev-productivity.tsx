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
  ComparisonCards,
  FeatureGrid,
  ArticleIcons,
  VerticalFlow,
  NumberedList,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "agency-context", title: "Agency Context", level: 2 },
  { id: "fragmentation-cost", title: "Cost of Fragmentation", level: 2 },
  { id: "standardisation", title: "Standardisation Strategy", level: 2 },
  { id: "shared-library", title: "Shared Component Library", level: 2 },
  { id: "estimation-accuracy", title: "Estimation Accuracy", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function DevProductivityContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Agency Context" id="agency-context" />

        <p className="text-muted-foreground mb-6">
          A 15-person development agency delivering 8-12 client projects per year was struggling with
          inconsistent timelines, quality variance, and a crippling inability to reuse code. Every
          project started from scratch because the previous project used a different stack, different
          patterns, and different conventions. New team members faced a steep learning curve on every
          project, and estimation accuracy was so poor that 60% of projects exceeded their budget.
        </p>

        <FeatureGrid
          columns={4}
          features={[
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "15 Developers",
              description: "Full-stack team with varied technology preferences and experience",
            },
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "4 Frameworks",
              description: "jQuery+PHP, React+Express, Vue+Laravel, Angular+.NET",
            },
            {
              icon: <ArticleIcons.Target className="h-5 w-5" />,
              title: "40% Accuracy",
              description: "Project estimation accuracy - 60% of projects over budget",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "0% Reuse",
              description: "Zero shared code between projects due to stack fragmentation",
            },
          ]}
        />

        <SectionHeader number="02" title="The Cost of Fragmentation" id="fragmentation-cost" />

        <ComparisonCards
          leftTitle="Development Costs"
          leftItems={[
            "Every project built from scratch - no starter templates",
            "Authentication implemented differently in every project",
            "4 different state management approaches across projects",
            "No shared component library - custom buttons in every project",
            "2-week onboarding per developer per project switch",
            "Bug patterns repeated because lessons not transferable",
          ]}
          rightTitle="Business Consequences"
          rightItems={[
            "60% of projects exceeded budget by average of 35%",
            "Client relationships strained by timeline overruns",
            "Developers burnt out switching contexts between stacks",
            "Code reviews ineffective - reviewers unfamiliar with stack",
            "Senior developers became bottlenecks as the only stack experts",
            "New hires took 3-6 months to become productive",
          ]}
          leftType="negative"
          rightType="negative"
        />

        <StatsTable
          title="Before: Technology Fragmentation"
          headers={["Stack", "Projects", "Shared Code", "Estimation Accuracy"]}
          rows={[
            ["jQuery + PHP", "3", "0%", "35%"],
            ["React + Express", "2", "15%", "45%"],
            ["Vue + Laravel", "2", "0%", "40%"],
            ["Angular + .NET", "1", "0%", "50%"],
          ]}
        />

        <SectionHeader number="03" title="Standardisation Strategy" id="standardisation" />

        <p className="text-muted-foreground mb-6">
          After evaluating the agency&apos;s project types, client requirements, and team capabilities,
          we standardised on a single stack: Next.js for the frontend, TypeScript for type safety,
          and Strapi for content management. The decision was based on coverage, ecosystem, and
          hiring potential.
        </p>

        <ArchitectureDiagram
          title="Standardised Stack"
          layers={[
            { name: "Frontend", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "shadcn/ui"], color: "#3b82f6" },
            { name: "CMS Layer", items: ["Strapi (headless)", "PostgreSQL", "REST/GraphQL API"], color: "#22c55e" },
            { name: "Shared Library", items: ["Component library", "Utility functions", "Auth patterns", "Email templates"], color: "#8b5cf6" },
            { name: "Infrastructure", items: ["Vercel (hosting)", "Railway (Strapi)", "GitHub (CI/CD)"], color: "#f59e0b" },
          ]}
        />

        <ProcessFlow
          title="Standardisation Rollout"
          steps={[
            { label: "Evaluate", sublabel: "Stack analysis" },
            { label: "Pilot", sublabel: "2 pilot projects" },
            { label: "Library", sublabel: "Build shared code", color: "blue" },
            { label: "Templates", sublabel: "Starter kits", color: "blue" },
            { label: "Adopt", sublabel: "All new projects", color: "green" },
          ]}
        />

        <SectionHeader number="04" title="Shared Component Library" id="shared-library" />

        <p className="text-muted-foreground mb-6">
          The shared component library became the highest-ROI investment. Built on top of shadcn/ui
          with agency-specific extensions, it provided pre-built, tested components that every
          project could use immediately.
        </p>

        <CodeBlock
          filename="packages/shared/components/index.ts"
          language="typescript"
          code={`// Agency shared component library
export { AuthProvider, useAuth, LoginForm, SignupForm } from "./auth"
export { ContactForm, MultiStepForm, FormField } from "./forms"
export { Navbar, Footer, MobileMenu, ThemeToggle } from "./layout"
export { Hero, FeatureGrid, Pricing, Testimonials } from "./sections"
export { EmailTemplate, TransactionalEmail } from "./email"
export { SEOHead, StructuredData, SocialMeta } from "./seo"
export { Analytics, ConsentBanner } from "./tracking"

// Utility hooks
export { useFormValidation, useDebounce, useMediaQuery } from "./hooks"

// Configuration
export { strapiClient, createApiClient } from "./api"
export { emailService, createEmailService } from "./email"

// Total: 35 components, 12 hooks, 8 utilities
// Average time saved per project: 3 weeks`}
        />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Project Templates",
              description: "Three starter templates (marketing site, web app, e-commerce) with pre-configured auth, CMS integration, and deployment pipelines. New projects bootstrap in 30 minutes.",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Tested Patterns",
              description: "Authentication, form validation, and security patterns tested across 8+ production projects. Bug patterns fixed once in the library, not repeatedly in each project.",
            },
            {
              icon: <ArticleIcons.GitBranch className="h-5 w-5" />,
              title: "Consistent Code Reviews",
              description: "Every reviewer understands every project because they all use the same patterns. Code reviews became 3x faster and caught 4x more genuine issues.",
            },
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "Fast Onboarding",
              description: "New hires learn one stack and can contribute to any project. Onboarding dropped from 2 weeks per project to 3 days total for the entire portfolio.",
            },
          ]}
        />

        <SectionHeader number="05" title="Estimation Accuracy" id="estimation-accuracy" />

        <p className="text-muted-foreground mb-6">
          The most transformative business impact was estimation accuracy. With a standardised stack
          and shared components, the team could accurately predict project timelines based on
          historical data from similar projects.
        </p>

        <BeforeAfterComparison
          beforeTitle="Before: Guesswork-Based Estimation"
          beforeCode={`Estimation Process (Old):
1. Client provides requirements
2. Lead developer "feels" the effort
3. Add 20% buffer (not enough)
4. Promise 8 weeks

Reality:
- Average delivery: 11.2 weeks
- Budget overrun: 35% average
- Client satisfaction: Declining
- Team morale: Low`}
          afterTitle="After: Data-Driven Estimation"
          afterCode={`Estimation Process (New):
1. Client provides requirements
2. Map to standard components:
   - Auth: 2 days (known pattern)
   - CMS setup: 1 day (template)
   - Custom pages: 3 days each
   - Forms: 1 day each (shared)
3. Sum with 15% buffer

Reality:
- Average delivery: On time (±5%)
- Budget overrun: 10% rare
- Client satisfaction: Growing
- Team morale: High`}
          improvements={[
            { metric: "Estimation accuracy", before: "40%", after: "90%" },
            { metric: "Budget overrun rate", before: "60% of projects", after: "10% of projects" },
            { metric: "Average overrun amount", before: "35%", after: "5%" },
          ]}
        />

        <SectionHeader number="06" title="Results & Metrics" id="results" />

        <StatsTable
          title="Productivity Improvement Results"
          headers={["Metric", "Before", "After", "Improvement"]}
          rows={caseStudy.results.metrics.map((m) => [m.label, m.before, m.after, m.improvement])}
        />

        <MetricsGrid
          metrics={[
            { label: "On-Budget Rate", value: "90%", change: "+50% from 40%", positive: true },
            { label: "Code Reuse", value: "60%", change: "Up from 0%", positive: true },
            { label: "Onboarding", value: "3 days", change: "-79% from 2 weeks", positive: true },
            { label: "Bug Escape Rate", value: "3%", change: "-80% from 15%", positive: true },
          ]}
        />

        <InfoBox type="tip" title="For Agency Owners and CTOs">
          The investment in standardisation took approximately 6 weeks of dedicated effort (shared library,
          templates, documentation). Within 3 months, the agency had delivered 2 projects on-time and on-budget
          that would have previously overrun. The financial impact in the first year was an estimated
          GBP 180,000 in recovered budget overruns and an additional 3 projects capacity from faster delivery.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          Stack standardisation enables estimation accuracy, code reuse, and quality consistency.
          The upfront investment in a shared stack and component library pays for itself within one project
          cycle. For agencies, this means transforming from unpredictable delivery to reliable execution -
          the single biggest factor in client retention and business growth.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { href: "/dashboard/content-library/case-studies/cost-reduction-architecture", title: "Architecture-Driven Cost Reduction", level: "intermediate" },
            { href: "/dashboard/content-library/case-studies/enterprise-cms-migration", title: "Enterprise CMS Migration", level: "advanced" },
          ]}
        />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
