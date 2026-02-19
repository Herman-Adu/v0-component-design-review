"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  FeatureGrid,
  ComparisonCards,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  ProcessFlow,
  ArchitectureDiagram,
  ArticleIcons,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "decision-matrix", title: "The Decision Matrix", level: 2 },
  { id: "evaluation-dimensions", title: "Five Evaluation Dimensions", level: 2 },
  { id: "our-stack-choices", title: "Our Stack Choices Explained", level: 2 },
  { id: "red-flags", title: "Red Flags to Watch", level: 2 },
  { id: "decision-process", title: "Decision Process", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function TechStackArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="important">
          Technology decisions are business decisions. The right stack enables your team to deliver 
          value efficiently. The wrong stack creates friction, delays, and technical debt that 
          compounds over time.
        </InfoBox>

        <SectionHeader number="01" title="The Decision Matrix" id="decision-matrix" />

        <p className="text-muted-foreground mb-6">
          Rather than choosing technologies based on hype or personal preference, we use a 
          weighted decision matrix that evaluates every choice against five key dimensions.
        </p>

        <ArchitectureDiagram
          title="Technology Decision Framework"
          layers={[
            { name: "Team Capability (25%)", items: ["Expertise", "Learning Curve", "Hiring Pool", "Training"], color: "#3b82f6" },
            { name: "Business Alignment (25%)", items: ["Time to Market", "Scalability", "Integration", "Compliance"], color: "#22c55e" },
            { name: "Technical Merit (20%)", items: ["Performance", "Security", "Maintainability", "Testing"], color: "#f59e0b" },
            { name: "Ecosystem Health (15%)", items: ["Community", "Packages", "Documentation", "Longevity"], color: "#8b5cf6" },
            { name: "Total Cost (15%)", items: ["Licensing", "Infrastructure", "Operations", "Vendor Lock-in"], color: "#ef4444" },
          ]}
        />

        <SectionHeader number="02" title="Five Evaluation Dimensions" id="evaluation-dimensions" />

        <SubSectionHeader title="1. Team Capability (Weight: 25%)" />

        <p className="text-muted-foreground mb-4">
          The best technology is worthless if your team cannot use it effectively. This dimension 
          evaluates realistic team readiness, not aspirational skill development.
        </p>

        <StatsTable
          title="Team Capability Assessment"
          headers={["Factor", "Questions to Ask", "Data Sources"]}
          rows={[
            ["Current Expertise", "How many team members have production experience?", "Skills matrix, past projects"],
            ["Learning Curve", "How long until team is productive?", "Documentation, training resources"],
            ["Hiring Market", "Can we find talent when we need to grow?", "Job board analysis, recruiter feedback"],
            ["Training Cost", "What investment is needed to upskill?", "Course costs, productivity loss"],
          ]}
        />

        <SubSectionHeader title="2. Business Alignment (Weight: 25%)" />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Clock className="h-5 w-5" />,
              title: "Time to Market",
              description: "How quickly can we ship features? Does this enable or hinder velocity?",
            },
            {
              icon: <ArticleIcons.TrendingUp className="h-5 w-5" />,
              title: "Scalability Needs",
              description: "Will this scale with our growth projections? What are the limits?",
            },
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Integration Requirements",
              description: "Does it work with our existing systems and planned integrations?",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Compliance Constraints",
              description: "Does it meet regulatory requirements for our industry?",
            },
          ]}
        />

        <SubSectionHeader title="3. Technical Merit (Weight: 20%)" />

        <ComparisonCards
          idealTitle="Positive Indicators"
          notIdealTitle="Warning Signs"
          idealFor={[
            "Strong performance characteristics",
            "Active security maintenance",
            "First-class testing support",
            "Good observability tooling",
          ]}
          notIdealFor={[
            "Poor performance benchmarks",
            "Known security vulnerabilities",
            "Difficult to test effectively",
            "Hard to debug in production",
          ]}
        />

        <SubSectionHeader title="4. Ecosystem Health (Weight: 15%)" />

        <MetricsGrid
          metrics={[
            { label: "Community Size", value: "Large", change: "Active contributors, forums", positive: true },
            { label: "Package Ecosystem", value: "Mature", change: "Well-maintained packages", positive: true },
            { label: "Documentation", value: "Excellent", change: "Up-to-date, comprehensive", positive: true },
            { label: "Long-term Viability", value: "Strong", change: "Clear roadmap, backing", positive: true },
          ]}
        />

        <SubSectionHeader title="5. Total Cost of Ownership (Weight: 15%)" />

        <StatsTable
          title="Cost Factors to Consider"
          headers={["Factor", "Consideration", "Hidden Costs"]}
          rows={[
            ["Licensing", "Open source vs commercial", "Enterprise features, support tiers"],
            ["Infrastructure", "Cloud costs, self-hosted options", "Scaling costs, egress fees"],
            ["Operations", "DevOps complexity, monitoring", "On-call burden, incident response"],
            ["Vendor Lock-in", "Portability, exit strategy", "Migration costs if switching"],
          ]}
        />

        <SectionHeader number="03" title="Our Stack Choices Explained" id="our-stack-choices" />

        <p className="text-muted-foreground mb-4">
          Here is how our chosen technologies score against the decision matrix, with transparent 
          reasoning for each choice.
        </p>

        <SubSectionHeader title="Frontend: Next.js + React" />

        <StatsTable
          title="Next.js + React Evaluation"
          headers={["Dimension", "Score", "Reasoning"]}
          rows={[
            ["Team Capability", "9/10", "Industry standard, vast learning resources, large hiring pool"],
            ["Business Alignment", "9/10", "Fast iteration, excellent SEO, flexible deployment"],
            ["Technical Merit", "9/10", "Outstanding performance, type safety, great DX"],
            ["Ecosystem Health", "10/10", "Massive community, mature package ecosystem"],
            ["Total Cost", "8/10", "Open source, but Vercel costs at scale"],
          ]}
        />

        <SubSectionHeader title="Backend: Strapi CMS" />

        <StatsTable
          title="Strapi CMS Evaluation"
          headers={["Dimension", "Score", "Reasoning"]}
          rows={[
            ["Team Capability", "7/10", "Moderate learning curve, good documentation"],
            ["Business Alignment", "10/10", "Extremely flexible content modeling, multi-channel ready"],
            ["Technical Merit", "8/10", "Extensible, plugin architecture, REST + GraphQL"],
            ["Ecosystem Health", "7/10", "Growing community, improving plugin ecosystem"],
            ["Total Cost", "9/10", "Open source, self-hosted option available"],
          ]}
        />

        <SubSectionHeader title="Validation: Zod + React Hook Form" />

        <StatsTable
          title="Zod + React Hook Form Evaluation"
          headers={["Dimension", "Score", "Reasoning"]}
          rows={[
            ["Team Capability", "8/10", "TypeScript native, intuitive API"],
            ["Business Alignment", "9/10", "Data integrity, reduced bugs, validation reuse"],
            ["Technical Merit", "10/10", "Type inference, composable schemas, excellent testing"],
            ["Ecosystem Health", "8/10", "Well maintained, active development"],
            ["Total Cost", "10/10", "Fully open source, no licensing"],
          ]}
        />

        <SectionHeader number="04" title="Red Flags to Watch" id="red-flags" />

        <p className="text-muted-foreground mb-4">
          Not all technologies that score well on paper make good choices. Watch for these 
          warning signs that may not appear in standard evaluations.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "Single Maintainer",
              description: "Projects dependent on one person are at risk of abandonment",
            },
            {
              icon: <ArticleIcons.TrendingUp className="h-5 w-5" />,
              title: "Declining Activity",
              description: "Decreasing GitHub commits, stale issues, unanswered questions",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "No Governance Model",
              description: "Unclear decision-making process, no roadmap, unclear ownership",
            },
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Excessive Breaking Changes",
              description: "Frequent major versions requiring significant migration effort",
            },
          ]}
        />

        <InfoBox type="warning" title="The Hype Trap">
          New technologies often have enthusiastic communities that overstate benefits and 
          understate problems. Wait for production usage reports before adopting anything 
          in the first year of release.
        </InfoBox>

        <SectionHeader number="05" title="Decision Process" id="decision-process" />

        <ProcessFlow
          title="Technology Selection Process"
          steps={[
            { label: "Define Requirements", sublabel: "Must-haves vs nice-to-haves" },
            { label: "Research", sublabel: "Identify 3-5 viable options" },
            { label: "Score Options", sublabel: "Apply decision matrix", color: "blue" },
            { label: "Proof of Concept", sublabel: "Test top 2 candidates", color: "yellow" },
            { label: "Final Decision", sublabel: "Choose and document", color: "green" },
          ]}
        />

        <InfoBox type="tip" title="Document Your Decisions">
          Create an Architecture Decision Record (ADR) for every significant technology choice. 
          Future team members will thank you when they understand why decisions were made.
        </InfoBox>

        <SectionHeader number="06" title="Key Takeaway" id="key-takeaway" />
        <KeyTakeaway>
          Technology decisions should be business decisions first. Use a structured framework to 
          remove emotion and bias from the process. Score options objectively, validate with 
          proof of concepts, and document your reasoning for future reference.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            {
              href: "/dashboard/content-library/articles/roi-modern-web-architecture",
              title: "ROI of Modern Web Architecture",
              level: "beginner",
            },
            {
              href: "/dashboard/content-library/articles/atomic-design-principles",
              title: "Atomic Design Principles",
              level: "intermediate",
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
