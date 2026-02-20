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
  { id: "client-background", title: "Client Background", level: 2 },
  { id: "legacy-pain", title: "Legacy Pain Points", level: 2 },
  { id: "headless-strategy", title: "Headless CMS Strategy", level: 2 },
  { id: "migration-process", title: "Migration Process", level: 2 },
  { id: "workflow-design", title: "Content Workflow", level: 2 },
  { id: "results", title: "Results & ROI", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function EnterpriseCmsContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Client Background" id="client-background" />

        <p className="text-muted-foreground mb-6">
          A mid-size financial services company with 200 employees needed to publish regulatory updates,
          product information, and marketing content across their website, mobile app, and partner portals.
          Their legacy CMS was a monolithic platform purchased 8 years prior, tightly coupled to
          their website&apos;s frontend, and requiring developer intervention for every content change.
        </p>

        <FeatureGrid
          columns={4}
          features={[
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "200 Staff",
              description: "15 content creators across 4 departments needing CMS access",
            },
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "3 Channels",
              description: "Website, mobile app, and partner portal all needing content",
            },
            {
              icon: <ArticleIcons.Clock className="h-5 w-5" />,
              title: "48hr Publish",
              description: "Average time from content creation to live publication",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Dev Dependent",
              description: "Every content change required developer involvement",
            },
          ]}
        />

        <SectionHeader number="02" title="Legacy Pain Points" id="legacy-pain" />

        <ComparisonCards
          leftTitle="Technical Issues"
          leftItems={[
            "Monolithic CMS tightly coupled to frontend rendering",
            "No API access - content locked in proprietary database",
            "Annual licence fee of GBP 45,000 with escalating costs",
            "PHP 5.6 backend with known security vulnerabilities",
            "No mobile app content support without duplication",
            "Single point of failure - entire site down if CMS crashes",
          ]}
          rightTitle="Business Impact"
          rightItems={[
            "6-month backlog of content requests from marketing",
            "Regulatory updates delayed by developer availability",
            "20 hours per week of developer time on content tasks",
            "Mobile app content manually duplicated and frequently stale",
            "Competitors publishing content same-day while they took 48 hours",
            "Marketing team demoralised by inability to self-serve",
          ]}
          leftType="negative"
          rightType="negative"
        />

        <SectionHeader number="03" title="Headless CMS Strategy" id="headless-strategy" />

        <p className="text-muted-foreground mb-6">
          We proposed migrating to Strapi as a headless CMS, decoupling content management from
          content delivery. This architecture enables a single content source to feed multiple
          frontends through a REST/GraphQL API.
        </p>

        <ArchitectureDiagram
          title="Before vs After Architecture"
          layers={[
            { name: "Legacy: Monolithic", items: ["CMS + Frontend + Database all-in-one", "Content locked in proprietary format"], color: "#ef4444" },
            { name: "New: Headless", items: ["Strapi CMS (content management)", "REST API (content delivery)"], color: "#3b82f6" },
            { name: "Frontend Layer", items: ["Next.js Website", "React Native App", "Partner Portal"], color: "#22c55e" },
            { name: "Infrastructure", items: ["Railway (Strapi)", "Vercel (Next.js)", "PostgreSQL (Database)"], color: "#6b7280" },
          ]}
        />

        <SectionHeader number="04" title="Migration Process" id="migration-process" />

        <VerticalFlow
          title="Phased Migration Approach"
          steps={[
            {
              title: "Phase 1: Content Audit (Week 1-2)",
              description: "Catalogued all 847 content items across the legacy CMS. Classified content types, identified relationships, and mapped to Strapi collection types. Found 23% was outdated and could be archived.",
            },
            {
              title: "Phase 2: Strapi Configuration (Week 3-4)",
              description: "Designed content types in Strapi matching audited structure. Configured roles and permissions for marketing, compliance, and executive users. Built custom preview plugin.",
            },
            {
              title: "Phase 3: Data Migration (Week 5-6)",
              description: "Built automated migration scripts to transform legacy content. Migrated 650 active items with full media assets. Validated content integrity with automated comparison checks.",
            },
            {
              title: "Phase 4: Frontend Integration (Week 7-10)",
              description: "Built Next.js frontend consuming Strapi API with ISR for performance. Implemented real-time preview for content editors. Connected mobile app to the same API.",
            },
            {
              title: "Phase 5: Training & Handover (Week 11-12)",
              description: "Trained 15 content creators across 4 departments. Created documentation and video tutorials. Ran parallel operation for 2 weeks before legacy shutdown.",
            },
          ]}
        />

        <SectionHeader number="05" title="Content Workflow Design" id="workflow-design" />

        <p className="text-muted-foreground mb-6">
          A key requirement was building an editorial workflow that maintained quality control
          while enabling marketing to self-serve. We designed a three-stage approval process
          within Strapi.
        </p>

        <ProcessFlow
          title="Content Publishing Workflow"
          steps={[
            { label: "Draft", sublabel: "Creator writes content" },
            { label: "Preview", sublabel: "Live preview in staging", color: "yellow" },
            { label: "Review", sublabel: "Editor approves", color: "blue" },
            { label: "Published", sublabel: "Live across all channels", color: "green" },
          ]}
        />

        <CodeBlock
          filename="strapi/api/content/lifecycles.ts"
          language="typescript"
          code={`// Strapi lifecycle hook for content approval
export default {
  async afterUpdate(event: any) {
    const { data, where } = event.params
    
    // Notify editors when content moves to review
    if (data.publishState === "review") {
      await strapi.service("api::notification.notification")
        .notifyEditors({
          contentId: where.id,
          contentType: event.model.uid,
          author: data.updatedBy,
        })
    }
    
    // Trigger ISR revalidation on publish
    if (data.publishedAt) {
      await fetch(\`\${process.env.FRONTEND_URL}/api/revalidate\`, {
        method: "POST",
        headers: { 
          "x-revalidation-token": process.env.REVALIDATION_TOKEN 
        },
        body: JSON.stringify({ 
          tag: event.model.uid 
        }),
      })
    }
  },
}`}
        />

        <SectionHeader number="06" title="Results & ROI" id="results" />

        <StatsTable
          title="Migration Results"
          headers={["Metric", "Before", "After", "Improvement"]}
          rows={caseStudy.results.metrics.map((m) => [m.label, m.before, m.after, m.improvement])}
        />

        <MetricsGrid
          metrics={[
            { label: "Publish Time", value: "4hrs", change: "-92% from 48hrs", positive: true },
            { label: "Dev Time", value: "2hr/wk", change: "-90% from 20hr/wk", positive: true },
            { label: "Annual Cost", value: "GBP 8K", change: "-82% from GBP 45K", positive: true },
            { label: "Content Output", value: "45/mo", change: "+275% from 12/mo", positive: true },
          ]}
        />

        <InfoBox type="tip" title="For CTOs: The Business Case">
          The 12-week migration project cost approximately GBP 35,000 in development time. Annual savings
          from eliminated licensing (GBP 37,000) and reduced developer time (GBP 40,000+ at market rates)
          meant the project paid for itself within 6 months. The 275% increase in content output
          is a competitive advantage that compounds over time.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          Headless CMS pays for itself in developer time savings alone. The content velocity increase
          is a bonus. By decoupling content management from frontend delivery, you unlock multi-channel
          publishing, self-service for non-technical teams, and eliminate the developer bottleneck
          that keeps marketing backlogs growing. The migration is an investment measured in weeks
          that delivers returns measured in years.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { href: "/dashboard/content-library/case-studies/strapi-multi-site-architecture", title: "Strapi Multi-Site Architecture", level: "advanced" },
            { href: "/dashboard/content-library/case-studies/cost-reduction-architecture", title: "Architecture-Driven Cost Reduction", level: "intermediate" },
          ]}
        />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
