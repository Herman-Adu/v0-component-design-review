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
  NumberedList,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "client-scenario", title: "Client Scenario", level: 2 },
  { id: "cost-analysis", title: "Cost Breakdown", level: 2 },
  { id: "architecture-redesign", title: "Architecture Redesign", level: 2 },
  { id: "serverless-benefits", title: "Serverless Benefits", level: 2 },
  { id: "migration-path", title: "Migration Path", level: 2 },
  { id: "results", title: "Results & ROI", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function CostReductionContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Client Scenario" id="client-scenario" />

        <p className="text-muted-foreground mb-6">
          A growing e-commerce company was spending GBP 8,500 per month on infrastructure - four
          always-on EC2 instances, a load balancer, an oversized RDS database, a Redis cluster, and
          24/7 DevOps monitoring staff. Their infrastructure costs were scaling linearly with traffic,
          meaning every sales peak required manual intervention to scale up, and every quiet period
          was wasted spend on idle resources.
        </p>

        <FeatureGrid
          columns={4}
          features={[
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "GBP 8,500/mo",
              description: "Monthly hosting and infrastructure costs before migration",
            },
            {
              icon: <ArticleIcons.Clock className="h-5 w-5" />,
              title: "3-Week Deploy",
              description: "Deployment cycles requiring manual QA and release management",
            },
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "24/7 Monitoring",
              description: "DevOps staff required for manual scaling and incident response",
            },
            {
              icon: <ArticleIcons.AlertTriangle className="h-5 w-5" />,
              title: "99.5% Uptime",
              description: "Frequent downtime during traffic peaks costing revenue",
            },
          ]}
        />

        <SectionHeader number="02" title="Cost Breakdown Analysis" id="cost-analysis" />

        <StatsTable
          title="Monthly Cost Breakdown: Legacy Infrastructure"
          headers={["Component", "Monthly Cost", "Utilisation", "Issue"]}
          rows={[
            ["4x EC2 Instances (t3.large)", "GBP 2,800", "35% average", "Paying for 65% idle capacity"],
            ["Application Load Balancer", "GBP 450", "Variable", "Fixed cost regardless of traffic"],
            ["RDS PostgreSQL (db.r5.xlarge)", "GBP 2,200", "20% average", "Oversized for actual workload"],
            ["ElastiCache Redis", "GBP 800", "15% average", "Running 24/7 for minimal caching"],
            ["DevOps Monitoring Tools", "GBP 750", "Always-on", "Datadog, PagerDuty, StatusPage"],
            ["DevOps Staff (partial FTE)", "GBP 1,500", "Ongoing", "Manual scaling and incident response"],
          ]}
        />

        <InfoBox type="warning" title="The Scaling Problem">
          During Black Friday and seasonal sales, the team had to manually spin up additional EC2 instances
          48 hours in advance, warm the load balancer, and have DevOps on standby. Despite preparation,
          they experienced 3 significant outages in the previous year during peak traffic, each costing
          an estimated GBP 5,000-15,000 in lost revenue.
        </InfoBox>

        <SectionHeader number="03" title="Architecture Redesign" id="architecture-redesign" />

        <BeforeAfterComparison
          beforeTitle="Legacy: Always-On Infrastructure"
          beforeCode={`Traditional Architecture:
├── 4x EC2 Instances (always running)
│   └── Node.js application
├── Application Load Balancer
│   └── Manual health checks
├── RDS PostgreSQL (db.r5.xlarge)
│   └── Single region, manual backups
├── ElastiCache Redis
│   └── Session storage + caching
└── Manual Monitoring
    └── PagerDuty + Datadog + StatusPage

Monthly cost: £8,500
Scaling: Manual (48hr notice)
Deployment: 3-week cycles`}
          afterTitle="Modern: Serverless-First"
          afterCode={`Serverless Architecture:
├── Vercel (Next.js)
│   └── Auto-scaling, edge network
├── Railway (Strapi CMS)
│   └── Auto-scaling containers
├── Neon (Serverless PostgreSQL)
│   └── Scale-to-zero, branching
├── Vercel Edge Config
│   └── Ultra-fast config reads
└── Built-in Monitoring
    └── Vercel Analytics + Logs

Monthly cost: £3,000
Scaling: Automatic (zero config)
Deployment: 15-minute CI/CD`}
          improvements={[
            { metric: "Monthly cost", before: "GBP 8,500", after: "GBP 3,000" },
            { metric: "Scaling", before: "Manual (48hr)", after: "Automatic (instant)" },
            { metric: "Deployment", before: "3-week cycles", after: "15-minute CI/CD" },
          ]}
        />

        <ArchitectureDiagram
          title="New Serverless Architecture"
          layers={[
            { name: "Edge Layer (Vercel)", items: ["Static assets cached globally", "Edge functions for dynamic routes", "Automatic SSL/CDN"], color: "#22c55e" },
            { name: "Application Layer", items: ["Next.js (SSR/SSG/ISR)", "Server Actions", "API Routes"], color: "#3b82f6" },
            { name: "CMS Layer (Railway)", items: ["Strapi auto-scaled", "Media storage", "Content API"], color: "#8b5cf6" },
            { name: "Database Layer (Neon)", items: ["Serverless PostgreSQL", "Scale-to-zero", "Automatic branching"], color: "#f59e0b" },
          ]}
        />

        <SectionHeader number="04" title="Serverless Benefits" id="serverless-benefits" />

        <ComparisonCards
          leftTitle="What We Eliminated"
          leftItems={[
            "4 always-on EC2 instances (paying for 65% idle time)",
            "Manual scaling procedures requiring 48-hour advance notice",
            "24/7 DevOps monitoring staff for infrastructure health",
            "3-week deployment cycles with manual QA and release management",
            "Load balancer management and health check configuration",
            "Database instance oversizing to handle peak loads",
          ]}
          rightTitle="What We Gained"
          rightItems={[
            "Pay-per-use pricing that scales with actual traffic",
            "Automatic scaling from zero to millions of requests",
            "Built-in monitoring, logging, and analytics",
            "15-minute deployments with automatic rollback",
            "Global edge network with automatic CDN and SSL",
            "Serverless database that scales to zero during quiet periods",
          ]}
          leftType="negative"
          rightType="positive"
        />

        <SectionHeader number="05" title="Migration Path" id="migration-path" />

        <NumberedList
          title="Phased Migration Strategy"
          items={[
            {
              title: "Static Pages First (Week 1-2)",
              description: "Migrated marketing pages, blog, and product listings to Next.js with static generation. These pages saw immediate performance gains and cost reduction.",
            },
            {
              title: "CMS Migration (Week 3-4)",
              description: "Moved content management from the legacy system to Strapi on Railway. Used ISR (Incremental Static Regeneration) for dynamic content.",
            },
            {
              title: "API Routes & Server Actions (Week 5-6)",
              description: "Replaced Express.js API with Next.js API routes and server actions. Eliminated the need for separate API hosting.",
            },
            {
              title: "Database Migration (Week 7-8)",
              description: "Migrated from RDS to Neon serverless PostgreSQL. Used database branching for safe migration testing.",
            },
            {
              title: "DNS Cutover & Monitoring (Week 9-10)",
              description: "Gradual traffic migration using weighted DNS routing. Monitored performance metrics at each increment until 100% migrated.",
            },
          ]}
        />

        <SectionHeader number="06" title="Results & ROI" id="results" />

        <StatsTable
          title="Cost & Performance Comparison"
          headers={["Metric", "Before", "After", "Improvement"]}
          rows={caseStudy.results.metrics.map((m) => [m.label, m.before, m.after, m.improvement])}
        />

        <MetricsGrid
          metrics={[
            { label: "Monthly Hosting", value: "GBP 3K", change: "-65% from GBP 8.5K", positive: true },
            { label: "DevOps Hours", value: "8/mo", change: "-95% from 160/mo", positive: true },
            { label: "Deploy Time", value: "15 min", change: "-99% from 3 weeks", positive: true },
            { label: "Uptime", value: "99.99%", change: "+0.49%", positive: true },
          ]}
        />

        <StatsTable
          title="Annual Financial Impact"
          headers={["Item", "Before (Annual)", "After (Annual)", "Savings"]}
          rows={[
            ["Infrastructure", "GBP 102,000", "GBP 36,000", "GBP 66,000"],
            ["DevOps Staff (partial)", "GBP 18,000", "GBP 1,200", "GBP 16,800"],
            ["Monitoring Tools", "GBP 9,000", "GBP 0 (built-in)", "GBP 9,000"],
            ["Downtime Revenue Loss", "GBP 25,000 (est.)", "GBP 0", "GBP 25,000"],
            ["Total Annual", "GBP 154,000", "GBP 37,200", "GBP 116,800"],
          ]}
        />

        <InfoBox type="tip" title="For Finance & Executive Teams">
          The migration project cost approximately GBP 40,000 in development time. With annual savings
          of GBP 116,800, the project achieved a 292% ROI in the first year alone. The payback period
          was under 5 months. Beyond cost savings, the elimination of downtime during peak trading
          periods protected an estimated GBP 25,000 in previously at-risk revenue.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          Serverless architecture aligns costs with actual usage - you stop paying for idle infrastructure.
          The migration from always-on servers to Vercel + Railway + Neon reduced annual infrastructure costs by
          GBP 116,800 while simultaneously improving uptime, deployment speed, and developer productivity.
          For growing businesses, this means infrastructure costs grow logarithmically with traffic
          rather than linearly - a fundamental shift in operational economics.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { href: "/dashboard/content-library/case-studies/enterprise-cms-migration", title: "Enterprise CMS Migration", level: "intermediate" },
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
