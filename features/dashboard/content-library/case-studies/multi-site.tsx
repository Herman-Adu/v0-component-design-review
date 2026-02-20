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
  DataFlowDiagram,
  DecisionTree,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "challenge", title: "The Challenge", level: 2 },
  { id: "architecture-problem", title: "Architecture Problem", level: 2 },
  { id: "multi-tenant-design", title: "Multi-Tenant Design", level: 2 },
  { id: "content-model", title: "Content Modelling", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function MultiSiteContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="The Challenge" id="challenge" />

        <p className="text-muted-foreground mb-6">
          A national retail chain operates 12 regional websites serving different UK regions and
          international markets. Each region needs localised content - pricing, promotions, store
          locations, and regulatory information - while maintaining consistent brand identity,
          shared product catalogues, and centralised marketing campaigns.
        </p>

        <FeatureGrid
          columns={4}
          features={[
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "12 Websites",
              description: "Regional sites for UK regions and international markets",
            },
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "30 Editors",
              description: "Content creators across regional and central marketing teams",
            },
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "5,000+ Pages",
              description: "Total content items across all 12 regional websites",
            },
            {
              icon: <ArticleIcons.GitBranch className="h-5 w-5" />,
              title: "3 Languages",
              description: "English, Welsh, and French for different market requirements",
            },
          ]}
        />

        <SectionHeader number="02" title="Architecture Problem" id="architecture-problem" />

        <BeforeAfterComparison
          beforeTitle="Before: 12 Independent CMS Instances"
          beforeCode={`Site 1 (London)    → CMS 1  → Database 1
Site 2 (Manchester) → CMS 2  → Database 2
Site 3 (Birmingham) → CMS 3  → Database 3
Site 4 (Edinburgh)  → CMS 4  → Database 4
...
Site 12 (Paris)     → CMS 12 → Database 12

Content sync method: Manual copy/paste
Brand consistency: "Best effort"
Shared content: None (everything duplicated)
Total databases: 12
Total admin panels: 12`}
          afterTitle="After: Single Multi-Tenant Strapi"
          afterCode={`All 12 Sites → Single Strapi Instance → Single Database

Content hierarchy:
├── Global content (shared across all sites)
│   ├── Product catalogue
│   ├── Brand assets
│   └── Core policies
├── Regional content (locale-specific)
│   ├── Promotions
│   ├── Store locations
│   └── Pricing
└── Local content (site-specific)
    ├── Opening hours
    ├── Local events
    └── Regional regulations

Total databases: 1
Total admin panels: 1 (role-based access)`}
          improvements={[
            { metric: "CMS instances", before: "12", after: "1" },
            { metric: "Databases", before: "12", after: "1" },
            { metric: "Content duplication", before: "~70%", after: "0%" },
          ]}
        />

        <ComparisonCards
          leftTitle="Problems with 12 Separate Instances"
          leftItems={[
            "Product info updated on 1 site but stale on 11 others",
            "Brand guidelines applied inconsistently across regions",
            "12x the security patching and CMS upgrade effort",
            "Content creators logging into 3-4 different admin panels",
            "No way to run cross-regional marketing campaigns",
            "Annual maintenance cost of GBP 120,000",
          ]}
          rightTitle="Benefits of Unified Instance"
          rightItems={[
            "Product update propagates to all 12 sites instantly",
            "Brand assets and templates shared from single source",
            "One CMS to patch, upgrade, and maintain",
            "Single admin panel with role-based regional access",
            "Campaign content created once, targeted per region",
            "Annual maintenance cost of GBP 35,000",
          ]}
          leftType="negative"
          rightType="positive"
        />

        <SectionHeader number="03" title="Multi-Tenant Content Design" id="multi-tenant-design" />

        <ArchitectureDiagram
          title="Content Hierarchy Architecture"
          layers={[
            { name: "Global Layer", items: ["Products", "Brand Assets", "Core Policies", "Shared Components"], color: "#22c55e" },
            { name: "Regional Layer", items: ["Promotions", "Pricing", "Store Locations", "Regional Campaigns"], color: "#3b82f6" },
            { name: "Local Layer", items: ["Opening Hours", "Local Events", "Regulations", "Contact Details"], color: "#f59e0b" },
            { name: "Delivery (per-site)", items: ["London", "Manchester", "Edinburgh", "Paris", "...8 more"], color: "#8b5cf6" },
          ]}
        />

        <DecisionTree
          title="Content Inheritance Rules"
          decisions={[
            { condition: "Content exists at local level", result: "Use local version (highest priority)", recommended: true },
            { condition: "No local content, regional exists", result: "Fall back to regional content" },
            { condition: "No regional content, global exists", result: "Fall back to global content" },
            { condition: "No content at any level", result: "Show default placeholder or hide section" },
          ]}
        />

        <SectionHeader number="04" title="Content Modelling in Strapi" id="content-model" />

        <CodeBlock
          filename="strapi/content-types/product.json"
          language="json"
          code={`{
  "kind": "collectionType",
  "collectionName": "products",
  "info": {
    "singularName": "product",
    "pluralName": "products",
    "displayName": "Product"
  },
  "attributes": {
    "name": { "type": "string", "required": true },
    "description": { "type": "richtext" },
    "price": { "type": "decimal" },
    "image": { "type": "media" },
    "category": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::category.category"
    },
    "visibility": {
      "type": "enumeration",
      "enum": ["global", "regional", "local"],
      "default": "global"
    },
    "regions": {
      "type": "relation",
      "relation": "manyToMany",
      "target": "api::region.region"
    },
    "locale": {
      "pluginOptions": { "i18n": { "localized": true } },
      "type": "string"
    }
  }
}`}
        />

        <DataFlowDiagram
          title="Content Resolution Flow"
          nodes={[
            { label: "Request", description: "site=london&locale=en" },
            { label: "Local Check", description: "Site-specific content" },
            { label: "Regional Fallback", description: "UK-South content" },
            { label: "Global Fallback", description: "Shared content" },
            { label: "Merge & Serve", description: "Complete page data" },
          ]}
        />

        <SectionHeader number="05" title="Frontend Implementation" id="implementation" />

        <CodeBlock
          filename="lib/content/resolve-content.ts"
          language="typescript"
          code={`// Content resolution with inheritance
export async function resolveContent(
  contentType: string,
  site: string,
  locale: string
) {
  // Fetch all content levels in parallel
  const [local, regional, global] = await Promise.all([
    fetchContent(contentType, { site, locale, visibility: "local" }),
    fetchContent(contentType, { region: getRegion(site), locale, visibility: "regional" }),
    fetchContent(contentType, { locale, visibility: "global" }),
  ])
  
  // Merge with priority: local > regional > global
  return mergeContent(global, regional, local)
}

function mergeContent(...layers: ContentLayer[]) {
  const merged = new Map()
  
  for (const layer of layers) {
    for (const item of layer) {
      // Later layers (higher priority) overwrite earlier ones
      merged.set(item.slug, item)
    }
  }
  
  return Array.from(merged.values())
}`}
        />

        <SectionHeader number="06" title="Results & Metrics" id="results" />

        <StatsTable
          title="Multi-Site Consolidation Results"
          headers={["Metric", "Before", "After", "Improvement"]}
          rows={caseStudy.results.metrics.map((m) => [m.label, m.before, m.after, m.improvement])}
        />

        <MetricsGrid
          metrics={[
            { label: "CMS Instances", value: "1", change: "Down from 12", positive: true },
            { label: "Content Sync", value: "Instant", change: "Was 4 hours", positive: true },
            { label: "Maintenance", value: "GBP 35K/yr", change: "-71%", positive: true },
            { label: "Consistency", value: "100%", change: "Was 60%", positive: true },
          ]}
        />

        <InfoBox type="tip" title="For Enterprise Architects">
          The multi-tenant approach works because Strapi supports both role-based access control and
          content-level permissions. Regional editors can only modify content for their assigned regions,
          while central marketing can publish global content that cascades to all sites. This governance
          model maintains quality while enabling decentralised content creation.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          Multi-tenancy in Strapi scales content management without scaling complexity. By modelling
          content in three tiers - global, regional, and local - with clear inheritance rules, 
          a single CMS instance replaced 12 independent installations. The result is instant content
          synchronisation, 71% lower maintenance costs, and 100% brand consistency across all regions.
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
