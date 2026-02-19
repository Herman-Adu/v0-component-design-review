"use client"

import {
  SectionHeader,
  InfoBox,
  FeatureGrid,
  ComparisonCards,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  ProcessFlow,
  ArticleIcons,
  type TOCItem,
  BeforeAfterComparison, // Declared the BeforeAfterComparison variable here
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "technical-debt", title: "The Cost of Technical Debt", level: 2 },
  { id: "tco-comparison", title: "5-Year TCO Comparison", level: 2 },
  { id: "business-metrics", title: "Key Business Metrics", level: 2 },
  { id: "when-to-invest", title: "When to Invest", level: 2 },
  { id: "making-the-case", title: "Making the Business Case", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function ROIArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="important">
          Making the case for modern web architecture requires hard data, not just technical preferences.
          This guide provides the financial analysis and metrics you need to justify investment in 
          headless CMS architecture to stakeholders.
        </InfoBox>

        <SectionHeader number="01" title="The Cost of Technical Debt" id="technical-debt" />

        <p className="text-muted-foreground mb-6">
          Technical debt accumulates silently, then suddenly becomes the primary driver of all 
          development costs. Understanding where teams spend their time reveals the true cost 
          of architectural decisions.
        </p>

        <StatsTable
          title="Architecture Comparison"
          headers={["Metric", "Traditional Monolithic", "Modern Headless"]}
          rows={[
            ["Developer Maintenance Time", "60-70%", "20-30%"],
            ["Feature Velocity", "2-3/sprint", "5-8/sprint"],
            ["Bug Regression Rate", "15-20%", "3-5%"],
            ["New Developer Onboarding", "4-6 weeks", "1-2 weeks"],
          ]}
        />

        <InfoBox type="tip" title="The Hidden Cost">
          Most organisations underestimate maintenance burden because it is distributed across all 
          features. Track time explicitly for 2 weeks to get accurate baseline measurements.
        </InfoBox>

        <SectionHeader number="02" title="5-Year Total Cost of Ownership" id="tco-comparison" />

        <p className="text-muted-foreground mb-4">
          While modern architecture requires higher initial investment, the compounding savings 
          in maintenance and feature development deliver significant ROI over time.
        </p>

        <StatsTable
          title="5-Year TCO Comparison"
          headers={["Cost Factor", "Traditional", "Headless", "Savings"]}
          rows={[
            ["Initial Build", "£80,000", "£100,000", "-£20,000"],
            ["Annual Maintenance", "£40,000/yr", "£15,000/yr", "£25,000/yr"],
            ["Feature Development", "£60,000/yr", "£35,000/yr", "£25,000/yr"],
            ["Infrastructure", "£12,000/yr", "£6,000/yr", "£6,000/yr"],
            ["5-Year Total", "£360,000", "£210,000", "£150,000"],
          ]}
        />

        <MetricsGrid
          metrics={[
            { label: "5-Year Savings", value: "£150K", change: "42% reduction", positive: true },
            { label: "Break-Even Point", value: "18 mo", change: "After initial investment", positive: true },
            { label: "Annual ROI", value: "56%", change: "After break-even", positive: true },
            { label: "Risk Reduction", value: "High", change: "Lower tech debt", positive: true },
          ]}
        />

        <ProcessFlow
          title="Investment Recovery Timeline"
          steps={[
            { label: "Months 1-6", sublabel: "Initial investment", color: "yellow" },
            { label: "Months 7-12", sublabel: "Productivity gains emerge" },
            { label: "Months 13-18", sublabel: "Break-even reached", color: "blue" },
            { label: "Year 2+", sublabel: "Accelerating returns", color: "green" },
          ]}
        />

        <SectionHeader number="03" title="Key Business Metrics" id="business-metrics" />

        <p className="text-muted-foreground mb-4">
          Beyond direct cost savings, modern architecture delivers measurable improvements 
          across critical business KPIs.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "40% Faster Deployment",
              description: "Features reach production in days rather than weeks",
            },
            {
              icon: <ArticleIcons.Clock className="h-5 w-5" />,
              title: "60% Shorter QA Cycles",
              description: "Type safety and automated testing catch issues earlier",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "80% Fewer Incidents",
              description: "Production stability through better architecture",
            },
            {
              icon: <ArticleIcons.TrendingUp className="h-5 w-5" />,
              title: "3x Code Reuse",
              description: "Shared components and patterns across projects",
            },
          ]}
        />

        <ComparisonCards
          idealTitle="Modern Architecture"
          notIdealTitle="Traditional Metrics"
          idealFor={[
            "Clear separation of concerns",
            "50% less boilerplate code",
            "70% faster onboarding",
            "Enforced consistency through types",
          ]}
          notIdealFor={[
            "High context-switching overhead",
            "Repeated boilerplate for each feature",
            "Long onboarding for new team members",
            "Difficult to maintain consistency",
          ]}
        />

        <SectionHeader number="04" title="When to Invest" id="when-to-invest" />

        <p className="text-muted-foreground mb-4">
          Not every organisation is ready for this investment. The best candidates share 
          specific characteristics that maximise ROI.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "3+ Digital Touchpoints",
              description: "Web, mobile, kiosks, APIs - headless shines with multi-channel",
            },
            {
              icon: <ArticleIcons.Clock className="h-5 w-5" />,
              title: "50%+ Maintenance Burden",
              description: "Teams spending majority of time on fixes rather than features",
            },
            {
              icon: <ArticleIcons.TrendingUp className="h-5 w-5" />,
              title: "Growth Plans",
              description: "Businesses expecting significant scaling in 2-3 years",
            },
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "Content-Heavy Operations",
              description: "Organisations with frequent content updates and publishing needs",
            },
          ]}
        />

        <InfoBox type="warning" title="When NOT to Invest">
          Small projects with limited scope, one-off marketing sites, or teams without 
          TypeScript experience may not see sufficient ROI. Consider a pilot project first 
          to validate assumptions with your specific context.
        </InfoBox>

        <SectionHeader number="05" title="Making the Business Case" id="making-the-case" />

        <p className="text-muted-foreground mb-4">
          When presenting to stakeholders, focus on business outcomes rather than technical 
          details. Frame the investment in terms they understand.
        </p>

        <StatsTable
          title="Stakeholder Communication Framework"
          headers={["Audience", "Key Message", "Supporting Data"]}
          rows={[
            ["CEO/Board", "Competitive advantage through speed", "Time to market metrics, customer satisfaction"],
            ["CFO", "Positive ROI within 18 months", "TCO analysis, maintenance cost reduction"],
            ["CTO", "Reduced technical debt and risk", "Architecture comparison, incident rates"],
            ["Product", "Faster feature delivery", "Velocity metrics, deployment frequency"],
            ["HR", "Improved retention and hiring", "Developer satisfaction, onboarding time"],
          ]}
        />

        <ProcessFlow
          title="Business Case Presentation Flow"
          steps={[
            { label: "Current State", sublabel: "Document pain points" },
            { label: "Future Vision", sublabel: "Improved capabilities" },
            { label: "Investment", sublabel: "Time, money, effort", color: "yellow" },
            { label: "Expected Returns", sublabel: "Quantified benefits", color: "green" },
            { label: "Risk Mitigation", sublabel: "Phased approach", color: "blue" },
          ]}
        />

        <SectionHeader number="06" title="Key Takeaway" id="key-takeaway" />
        <KeyTakeaway>
          The upfront investment in modern web architecture pays for itself within 18 months through 
          reduced maintenance costs and increased feature velocity. The key is presenting hard 
          numbers rather than technical preferences, and framing the conversation in terms of 
          business outcomes that stakeholders care about.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            {
              href: "/dashboard/content-library/articles/tech-stack-decision-framework",
              title: "Technology Stack Decision Framework",
              level: "intermediate",
            },
            {
              href: "/dashboard/content-library/articles/planning-full-stack-application",
              title: "Planning a Full Stack Application",
              level: "beginner",
            },
          ]}
        />
      </div>

      <aside className="hidden lg:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
