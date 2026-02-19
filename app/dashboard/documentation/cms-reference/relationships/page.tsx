"use client"

import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { STATS } from "@/data/doc-manifest"
import {
  GitBranch, ArrowRight, ArrowDown, Layers, Server, BookOpen, Box,
  Database, Code, Zap, FileText, GraduationCap, Briefcase, Search,
  Users, Clock, Tag, ImageIcon, MapPin, Calendar, CreditCard,
} from "lucide-react"
import Link from "next/link"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  { id: "entity-relationships", title: "Entity Relationships" },
  { id: "architecture-diagram", title: "Architecture Diagram" },
  { id: "data-flow", title: "Data Flow" },
  { id: "frontend-backend-mapping", title: "Frontend-Backend Mapping" },
  { id: "component-reuse", title: "Component Reuse" },
  { id: "atomic-design", title: "Atomic Design Mapping" },
  { id: "quick-reference", title: "Quick Reference" },
]

const entityRelationships = [
  { from: "Article", to: "Article", field: "relatedArticles", type: "Many-to-Many", cardinality: "N:M", description: "Self-referencing relation for 'Related Reading' sections. Bidirectional." },
  { from: "Tutorial", to: "Tutorial", field: "relatedTutorials", type: "Many-to-Many", cardinality: "N:M", description: "Self-referencing relation for progressive learning paths. Bidirectional." },
  { from: "Case Study", to: "Case Study", field: "relatedCaseStudies", type: "Many-to-Many", cardinality: "N:M", description: "Self-referencing relation for linking complementary case studies." },
  { from: "Article", to: "SEO Metadata", field: "seo", type: "Component", cardinality: "1:1", description: "Embedded SEO component. Not a relation -- stored inline in the article document." },
  { from: "Article", to: "Author Profile", field: "author", type: "Component", cardinality: "1:1", description: "Embedded author component. One author block per article." },
  { from: "Article", to: "Reading Info", field: "readingInfo", type: "Component", cardinality: "1:1", description: "Embedded reading info (readTime, level indicator)." },
  { from: "Tutorial", to: "Tutorial Step", field: "steps", type: "Component (Repeatable)", cardinality: "1:N", description: "Ordered list of step components. Each step has title, content, codeExample." },
  { from: "Tutorial", to: "SEO Metadata", field: "seo", type: "Component", cardinality: "1:1", description: "Same reusable SEO component shared across all content types." },
  { from: "Case Study", to: "Problem Section", field: "problem", type: "Component", cardinality: "1:1", description: "Embedded problem analysis with description, issues list, optional code." },
  { from: "Case Study", to: "Solution Section", field: "solution", type: "Component", cardinality: "1:1", description: "Embedded solution details with description, improvements, optional code." },
  { from: "Case Study", to: "Result Metric", field: "results.metrics", type: "Component (Repeatable)", cardinality: "1:N", description: "Ordered list of metric components (label, before, after, improvement)." },
  { from: "Service Request", to: "Contact Info", field: "contactInfo", type: "Component", cardinality: "1:1", description: "Shared form component: name, email, phone, company." },
  { from: "Service Request", to: "UK Address", field: "address", type: "Component", cardinality: "1:1", description: "Shared form component: structured UK address with postcode." },
  { from: "Service Request", to: "Schedule Preferences", field: "schedule", type: "Component", cardinality: "1:1", description: "Preferred dates, time slots, flexibility, urgency level." },
  { from: "Quotation", to: "Contact Info", field: "contactInfo", type: "Component", cardinality: "1:1", description: "Same Contact Info component reused (DRY)." },
  { from: "Quotation", to: "UK Address", field: "address", type: "Component", cardinality: "1:1", description: "Same UK Address component reused." },
  { from: "Contact Inquiry", to: "Contact Info", field: "contactInfo", type: "Component", cardinality: "1:1", description: "Same Contact Info component -- simplest usage." },
]

const dataFlowStages = [
  { stage: "1. Content Entry", description: "Content is authored in Strapi admin panel using the schema-defined fields, components, and relations.", tools: "Strapi Admin UI, Media Library, Content Manager", color: "blue" },
  { stage: "2. API Layer", description: "Strapi auto-generates REST and GraphQL endpoints for each collection type. Custom controllers add business logic.", tools: "REST API, GraphQL Plugin, Custom Controllers", color: "accent" },
  { stage: "3. Data Fetching", description: "Next.js server components fetch from Strapi APIs at build time (SSG) or request time (SSR). Deep population resolves components and relations.", tools: "fetch(), qs library for query building, populate deep", color: "green" },
  { stage: "4. Frontend Rendering", description: "Data flows through TypeScript interfaces into React components following atomic design hierarchy: atoms > molecules > organisms > pages.", tools: "TypeScript interfaces, React components, Tailwind CSS", color: "amber" },
]

const frontendToBackend = [
  { frontend: "/data/content-library/articles.tsx", interface: "Article", strapiUID: "api::article.article", type: "Collection Type", fields: 11, components: ["SEO", "Author", "ReadingInfo"], route: "/dashboard/content-library/articles/[slug]" },
  { frontend: "/data/content-library/tutorials.tsx", interface: "Tutorial + TutorialStep", strapiUID: "api::tutorial.tutorial", type: "Collection Type", fields: 12, components: ["SEO", "TutorialStep (repeatable)"], route: "/dashboard/content-library/tutorials/[slug]" },
  { frontend: "/data/content-library/case-studies.tsx", interface: "CaseStudy", strapiUID: "api::case-study.case-study", type: "Collection Type", fields: 10, components: ["SEO", "ProblemSection", "SolutionSection", "ResultMetric (repeatable)"], route: "/dashboard/content-library/case-studies/[slug]" },
  { frontend: "ServiceRequestForm (Zod schema)", interface: "ServiceRequestSchema", strapiUID: "api::service-request.service-request", type: "Collection Type", fields: 14, components: ["ContactInfo", "UKAddress", "SchedulePreferences"], route: "POST /api/service-requests" },
  { frontend: "ContactForm (Zod schema)", interface: "ContactSchema", strapiUID: "api::contact-inquiry.contact-inquiry", type: "Collection Type", fields: 8, components: ["ContactInfo"], route: "POST /api/contact-inquiries" },
  { frontend: "QuotationForm (Zod schema)", interface: "QuotationSchema", strapiUID: "api::quotation.quotation", type: "Collection Type", fields: 12, components: ["ContactInfo", "UKAddress"], route: "POST /api/quotation-requests" },
]

const atomicMapping = [
  { level: "Atoms", icon: Zap, color: "bg-blue-500/10 text-blue-500 border-blue-500/20", frontendExamples: "Input, Button, Badge, Label, Checkbox, Select, Textarea", strapiEquivalent: "Field configurations (string, boolean, enum, number, text, date, media)", mapping: "Each Strapi field type maps to an atomic UI element. A 'string' field becomes an Input, an 'enumeration' becomes a Select, a 'boolean' becomes a Checkbox, a 'media' becomes an Image upload." },
  { level: "Molecules", icon: Layers, color: "bg-accent/10 text-accent border-accent/20", frontendExamples: "ContactInfo, UKAddress, SEO, Author, ReadingInfo, TutorialStep", strapiEquivalent: "Shared Components (reusable, embeddable groups of fields)", mapping: "Groups of related fields packaged as reusable Strapi components. ContactInfo groups name + email + phone. SEO groups metaTitle + metaDescription + ogImage. Components can be embedded in any collection type." },
  { level: "Organisms", icon: Server, color: "bg-green-500/10 text-green-500 border-green-500/20", frontendExamples: "ServiceRequestForm, ArticlePage, TutorialPage, CaseStudyPage", strapiEquivalent: "Collection Types and Single Types (complete data models)", mapping: "Full data models combining fields + embedded components + relations. An Article collection type contains top-level fields (title, slug) + SEO component + Author component + tags JSON field." },
  { level: "Templates", icon: FileText, color: "bg-amber-500/10 text-amber-500 border-amber-500/20", frontendExamples: "Article layout, Tutorial layout, Form wizard, Dashboard layout", strapiEquivalent: "Content-type JSON schema definitions (the blueprint files)", mapping: "The schema.json files that Strapi stores in /src/api/[type]/content-types/. These define field order, validation rules, default values, and relation configurations." },
  { level: "Pages", icon: BookOpen, color: "bg-rose-500/10 text-rose-500 border-rose-500/20", frontendExamples: "/articles/[slug], /tutorials/[slug], /case-studies/[slug]", strapiEquivalent: "API endpoints + populated queries that hydrate page components", mapping: "Each page route maps to a Strapi API query. The [slug] page calls GET /api/articles?filters[slug][$eq]=value&populate=deep. The response shape matches the TypeScript interface." },
]

const componentReuse = [
  { component: "SEO Metadata", usedIn: ["Article", "Tutorial", "Case Study"], type: "Content", icon: Search },
  { component: "Author Profile", usedIn: ["Article", "Tutorial", "Case Study"], type: "Content", icon: Users },
  { component: "Reading Info", usedIn: ["Article", "Tutorial"], type: "Content", icon: Clock },
  { component: "Category Tag", usedIn: ["Article", "Tutorial", "Case Study"], type: "Content", icon: Tag },
  { component: "Featured Image", usedIn: ["Article", "Tutorial", "Case Study"], type: "Content", icon: ImageIcon },
  { component: "Related Content", usedIn: ["Article", "Tutorial", "Case Study"], type: "Content", icon: GitBranch },
  { component: "Contact Info", usedIn: ["Service Request", "Contact Inquiry", "Quotation"], type: "Form", icon: Users },
  { component: "UK Address", usedIn: ["Service Request", "Quotation"], type: "Form", icon: MapPin },
  { component: "Schedule Prefs", usedIn: ["Service Request"], type: "Form", icon: Calendar },
  { component: "Budget Timeline", usedIn: ["Quotation"], type: "Form", icon: CreditCard },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function RelationshipsPage() {
  return (
    <DocPage
      icon={GitBranch}
      title="Relationships & Architecture"
      description="Complete guide to entity relationships, data flow architecture, frontend-to-backend mapping, and how atomic design principles translate to Strapi schema design. This is the architectural reference for the entire system."
      badges={["17 Entity Relationships", "6 Collection Types", `${STATS.backend.sharedComponents.total} Shared Components`, "5 Atomic Levels", "4 Data Flow Stages"]}
      audienceBadges={[
        { label: "Architecture", className: "bg-cyan-500/20 text-cyan-500 border-0" },
        { label: "Developer Guide", className: "bg-blue-500/20 text-blue-500 border-0" },
      ]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      <Callout type="info" title="How to Read This Page">
        Start with the Entity Relationships table to understand how data connects, then review
        the Data Flow section to see how content moves from Strapi to the frontend, and finally
        study the Atomic Design Mapping to understand the architectural philosophy behind the schema design.
      </Callout>

      {/* 1. Entity Relationships */}
      <DocSectionHeader id="entity-relationships">Entity Relationships</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed">
        Every relationship between collection types and shared components in the system. Strapi supports
        two relationship paradigms: <strong>Relations</strong> (database-level foreign keys between collection types)
        and <strong>Components</strong> (embedded JSON documents stored within the parent entity).
      </p>

      <Tabs defaultValue="all" className="mt-6">
        <TabsList>
          <TabsTrigger value="all">All ({entityRelationships.length})</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="form">Form</TabsTrigger>
          <TabsTrigger value="relations-only">Relations Only</TabsTrigger>
        </TabsList>
        {["all", "content", "form", "relations-only"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">From</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">Field</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">To</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground text-sm hidden md:table-cell">Card.</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground text-sm hidden lg:table-cell">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {entityRelationships
                      .filter((rel) => {
                        if (tab === "content") return ["Article", "Tutorial", "Case Study"].includes(rel.from)
                        if (tab === "form") return ["Service Request", "Quotation", "Contact Inquiry"].includes(rel.from)
                        if (tab === "relations-only") return rel.type.includes("Many")
                        return true
                      })
                      .map((rel, i) => (
                        <tr key={`${rel.from}-${rel.to}-${rel.field}-${i}`} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3"><code className="text-sm text-foreground">{rel.from}</code></td>
                          <td className="px-4 py-3"><code className="text-xs text-accent">{rel.field}</code></td>
                          <td className="px-4 py-3"><code className="text-sm text-foreground">{rel.to}</code></td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              rel.type.includes("Many") ? "bg-amber-500/10 text-amber-500"
                              : rel.type.includes("Repeatable") ? "bg-cyan-500/10 text-cyan-500"
                              : "bg-blue-500/10 text-blue-500"
                            }`}>{rel.type}</span>
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell"><code className="text-xs">{rel.cardinality}</code></td>
                          <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell">{rel.description}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="responsive-grid-3 mt-6">
        {[
          { label: "Component", title: "Embedded (1:1)", desc: "Stored as JSON within the parent document. No separate table. Used for SEO, Author, ContactInfo.", color: "blue" },
          { label: "Component (Repeatable)", title: "Embedded Array (1:N)", desc: "Ordered array of embedded components. Used for TutorialSteps, ResultMetrics.", color: "cyan" },
          { label: "Many-to-Many", title: "Relational (N:M)", desc: "Database-level join table. Used for self-referencing related content links.", color: "amber" },
        ].map((card) => (
          <div key={card.label} className={`rounded-lg border p-4 border-${card.color}-500/20 bg-${card.color}-500/5`}>
            <span className={`text-xs px-2 py-0.5 rounded bg-${card.color}-500/10 text-${card.color}-500`}>{card.label}</span>
            <p className="text-sm text-foreground font-medium mt-2">{card.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* 2. Architecture Diagram */}
      <DocSectionHeader id="architecture-diagram">System Architecture Diagram</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed">
        The full system from database to browser, showing how Strapi content types, shared components,
        and single types layer together to serve the frontend application.
      </p>

      <div className="space-y-3 mt-6">
        {/* Browser Layer */}
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen className="h-5 w-5 text-rose-500" />
            <h3 className="font-semibold text-foreground">Browser (Next.js Frontend)</h3>
            <Badge variant="outline" className="text-xs ml-auto">Pages & Components</Badge>
          </div>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            {["/articles/[slug]", "/tutorials/[slug]", "/case-studies/[slug]", "/service-request", "/contact", "/quotation", "/dashboard/*", "Layout + Nav"].map((route) => (
              <div key={route} className="p-2 rounded border border-rose-500/15 bg-background/50 text-center">
                <code className="text-xs text-rose-500">{route}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center py-1">
          <div className="flex flex-col items-center gap-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">fetch + populate</span>
          </div>
        </div>

        {/* API Layer */}
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Code className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground">API Layer (Strapi REST + GraphQL)</h3>
            <Badge variant="outline" className="text-xs ml-auto">24+ Endpoints</Badge>
          </div>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            {["/api/articles", "/api/tutorials", "/api/case-studies", "/api/service-requests", "/api/contact-inquiries", "/api/quotation-requests", "/api/site-settings", "/graphql"].map((ep) => (
              <div key={ep} className="p-2 rounded border border-accent/15 bg-background/50 text-center">
                <code className="text-xs text-accent">{ep}</code>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center py-1">
          <div className="flex flex-col items-center gap-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">schema definitions</span>
          </div>
        </div>

        {/* Strapi CMS Layer */}
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Server className="h-5 w-5 text-blue-500" />
            <h3 className="font-semibold text-foreground">Strapi CMS (Content Types)</h3>
            <Badge variant="outline" className="text-xs ml-auto">6 Collections + 4 Singles</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Collection Types</p>
              <div className="grid gap-1.5 grid-cols-2">
                {["Article", "Tutorial", "Case Study", "Service Request", "Contact Inquiry", "Quotation"].map((ct) => (
                  <div key={ct} className="p-2 rounded border border-blue-500/15 bg-background/50 text-center">
                    <code className="text-xs text-blue-500">{ct}</code>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Single Types</p>
              <div className="grid gap-1.5 grid-cols-2">
                {["Site Settings", "Global SEO", "Navigation", "Company Info"].map((st) => (
                  <div key={st} className="p-2 rounded border border-blue-500/15 bg-background/50 text-center">
                    <code className="text-xs text-blue-500">{st}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center py-1">
          <div className="flex flex-col items-center gap-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">embeds & reuses</span>
          </div>
        </div>

        {/* Shared Components Layer */}
        <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold text-foreground">Shared Components (Reusable)</h3>
            <Badge variant="outline" className="text-xs ml-auto">18 Components</Badge>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Content Components (10)</p>
              <div className="flex flex-wrap gap-1.5">
                {["SEO", "Author", "ReadingInfo", "Category", "FeaturedImage", "RelatedContent", "TutorialStep", "ProblemSection", "SolutionSection", "ResultMetric"].map((c) => (
                  <span key={c} className="text-xs px-2 py-1 rounded border border-green-500/15 bg-background/50 text-green-500">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">Form Components (8)</p>
              <div className="flex flex-wrap gap-1.5">
                {["ContactInfo", "UKAddress", "SchedulePrefs", "ServiceDetails", "InquiryType", "ReferenceLinking", "ProjectType", "BudgetTimeline"].map((c) => (
                  <span key={c} className="text-xs px-2 py-1 rounded border border-green-500/15 bg-background/50 text-green-500">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center py-1">
          <div className="flex flex-col items-center gap-1">
            <ArrowDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground">persists to</span>
          </div>
        </div>

        {/* Database Layer */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold text-foreground">PostgreSQL Database</h3>
            <Badge variant="outline" className="text-xs ml-auto">Persistent Storage</Badge>
          </div>
          <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
            {["articles", "tutorials", "case_studies", "service_requests", "contact_inquiries", "quotations", "components_*", "upload_files"].map((t) => (
              <div key={t} className="p-2 rounded border border-amber-500/15 bg-background/50 text-center">
                <code className="text-xs text-amber-500">{t}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Data Flow */}
      <DocSectionHeader id="data-flow">Data Flow: CMS to Browser</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed">
        How content flows from authoring in Strapi to rendering in the browser, through four stages.
      </p>

      <div className="space-y-4 mt-6">
        {dataFlowStages.map((stage, i) => (
          <div key={stage.stage} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                stage.color === "blue" ? "bg-blue-500/10 text-blue-500 border border-blue-500/30"
                : stage.color === "accent" ? "bg-accent/10 text-accent border border-accent/30"
                : stage.color === "green" ? "bg-green-500/10 text-green-500 border border-green-500/30"
                : "bg-amber-500/10 text-amber-500 border border-amber-500/30"
              }`}>{i + 1}</div>
              {i < dataFlowStages.length - 1 && <div className="w-px h-full bg-border min-h-4" />}
            </div>
            <div className="pb-6">
              <h3 className="font-semibold text-foreground">{stage.stage}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stage.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {stage.tools.split(", ").map((tool) => (
                  <span key={tool} className="text-xs px-1.5 py-0.5 rounded bg-muted text-foreground">{tool}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Spoiler title="Example: Article Data Flow (end-to-end)">
        <CodeBlock
          language="typescript"
          filename="data-flow-example.ts"
          code={`// Stage 1: Content authored in Strapi admin
// An editor creates an Article with title, slug, content, SEO, and Author components

// Stage 2: API auto-generates endpoint
// GET /api/articles?filters[slug][$eq]=atomic-design-principles&populate=deep

// Stage 3: Next.js server component fetches at build time
async function getArticle(slug: string) {
  const res = await fetch(
    \`\${STRAPI_URL}/api/articles?filters[slug][$eq]=\${slug}&populate=deep\`,
    { next: { revalidate: 3600 } }
  )
  const { data } = await res.json()
  return data[0]
}

// Stage 4: TypeScript interface ensures type-safe rendering
interface Article {
  id: string; slug: string; title: string; excerpt: string;
  level: "beginner" | "intermediate" | "advanced";
  category: ArticleCategory; readTime: string; publishedAt: string;
  tags: string[]; content: string; hasRichContent?: boolean;
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug)
  return <ArticleRenderer article={article} />
}`}
        />
      </Spoiler>

      {/* 4. Frontend-Backend Mapping */}
      <DocSectionHeader id="frontend-backend-mapping">Frontend-to-Backend Mapping</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed">
        Every frontend data source mapped to its Strapi counterpart. Each row shows the TypeScript
        file, the interface it exports, the Strapi UID, the number of fields, and which shared
        components it embeds.
      </p>

      <div className="space-y-4 mt-6">
        {frontendToBackend.map((mapping) => (
          <Card key={mapping.strapiUID}>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base flex items-center gap-2">
                    <code className="text-sm text-foreground truncate">{mapping.interface}</code>
                    <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    <code className="text-sm text-accent truncate">{mapping.strapiUID}</code>
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs truncate">{mapping.frontend}</CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs">{mapping.fields} fields</Badge>
                  <Badge variant="outline" className="text-xs">{mapping.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Components:</span>
                {mapping.components.map((comp) => (
                  <span key={comp} className="text-xs px-1.5 py-0.5 rounded bg-accent/10 text-accent">{comp}</span>
                ))}
                <span className="text-xs text-muted-foreground ml-auto hidden sm:inline">Route: <code className="text-foreground">{mapping.route}</code></span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 5. Component Reuse */}
      <DocSectionHeader id="component-reuse">Component Reuse Matrix</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed">
        Which shared components are used by which collection types. Components with higher reuse
        deliver more DRY value and should be created first.
      </p>

      <div className="border border-border rounded-lg overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">Component</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">Used In</th>
                <th className="text-center px-4 py-3 font-semibold text-foreground text-sm">Reuse Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {componentReuse
                .sort((a, b) => b.usedIn.length - a.usedIn.length)
                .map((comp) => (
                <tr key={comp.component} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <comp.icon className="h-4 w-4 text-muted-foreground shrink-0" />
                      <code className="text-sm text-foreground">{comp.component}</code>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${comp.type === "Content" ? "bg-blue-500/10 text-blue-500" : "bg-green-500/10 text-green-500"}`}>
                      {comp.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {comp.usedIn.map((ct) => (
                        <span key={ct} className="text-xs px-1.5 py-0.5 rounded bg-muted text-foreground">{ct}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm font-semibold ${comp.usedIn.length >= 3 ? "text-green-500" : comp.usedIn.length === 2 ? "text-accent" : "text-muted-foreground"}`}>
                      {comp.usedIn.length}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Atomic Design Mapping */}
      <DocSectionHeader id="atomic-design">Atomic Design to Strapi Mapping</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed">
        How each level of atomic design translates to Strapi schema concepts. This is the
        architectural philosophy behind why the backend is structured the way it is.
      </p>

      <div className="space-y-4 mt-6">
        {atomicMapping.map((level) => (
          <Card key={level.level}>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${level.color}`}>
                  <level.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg">{level.level}</CardTitle>
                  <CardDescription className="text-xs">{level.strapiEquivalent}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{level.mapping}</p>
              <div className="rounded border border-border bg-muted/30 p-3">
                <div className="flex flex-col sm:flex-row gap-3 text-xs">
                  <div className="flex-1">
                    <span className="text-muted-foreground font-medium">Frontend:</span>
                    <p className="text-foreground mt-0.5">{level.frontendExamples}</p>
                  </div>
                  <div className="hidden sm:block w-px bg-border" />
                  <div className="flex-1">
                    <span className="text-muted-foreground font-medium">Strapi:</span>
                    <p className="text-accent mt-0.5">{level.strapiEquivalent}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 7. Quick Reference */}
      <DocSectionHeader id="quick-reference">Developer Quick Reference</DocSectionHeader>

      <Tabs defaultValue="setup-order">
        <TabsList>
          <TabsTrigger value="setup-order">Setup Order</TabsTrigger>
          <TabsTrigger value="populate">Populate Queries</TabsTrigger>
          <TabsTrigger value="naming">Naming Conventions</TabsTrigger>
        </TabsList>

        <TabsContent value="setup-order" className="space-y-4">
          <Callout type="warning" title="Creation Order Matters">
            Strapi requires that components exist before they can be referenced by collection types.
            Follow this exact order to avoid missing dependency errors.
          </Callout>
          <div className="space-y-3">
            {[
              { phase: "Phase 1: Leaf Components", items: "SEO, Author, ReadingInfo, Category, Tag, ContactInfo, UKAddress, SchedulePreferences", note: "No dependencies on other components" },
              { phase: "Phase 2: Nested Components", items: "TutorialStep, ProblemSection, SolutionSection, ResultMetric, FeaturedImage, RelatedContent", note: "May reference leaf components" },
              { phase: "Phase 3: Form Components", items: "ServiceDetails, InquiryType, ReferenceLinking, ProjectType, BudgetTimeline", note: "Form-specific components" },
              { phase: "Phase 4: Collection Types", items: "Article, Tutorial, CaseStudy, ServiceRequest, ContactInquiry, Quotation", note: "Reference components from phases 1-3" },
              { phase: "Phase 5: Single Types", items: "SiteSettings, GlobalSEO, Navigation, CompanyInfo", note: "Global configuration, created last" },
            ].map((phase, i) => (
              <div key={phase.phase} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-accent/10 text-accent border border-accent/30 shrink-0">{i + 1}</div>
                  {i < 4 && <div className="w-px h-full bg-border min-h-4" />}
                </div>
                <div className="pb-4">
                  <h4 className="font-semibold text-foreground text-sm">{phase.phase}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{phase.note}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {phase.items.split(", ").map((item) => (
                      <span key={item} className="text-xs px-1.5 py-0.5 rounded bg-muted text-foreground">{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="populate" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Strapi requires explicit population of components and relations. Use these patterns to fetch fully resolved data.
          </p>
          <Spoiler title="Deep Populate for Articles">
            <CodeBlock
              language="typescript"
              filename="populate-article.ts"
              code={`const qs = require('qs')
const query = qs.stringify({
  filters: { slug: { $eq: 'atomic-design-principles' } },
  populate: {
    seo: { populate: '*' },
    author: { populate: '*' },
    readingInfo: true,
    featuredImage: { populate: '*' },
    relatedArticles: {
      fields: ['title', 'slug', 'excerpt', 'readTime'],
      populate: { featuredImage: { populate: '*' } }
    }
  }
}, { encodeValuesOnly: true })
const res = await fetch(\`\${STRAPI_URL}/api/articles?\${query}\`)`}
            />
          </Spoiler>
          <Spoiler title="Deep Populate for Tutorials (with Steps)">
            <CodeBlock
              language="typescript"
              filename="populate-tutorial.ts"
              code={`const query = qs.stringify({
  filters: { slug: { $eq: 'nextjs-form-validation' } },
  populate: {
    seo: { populate: '*' },
    steps: { populate: '*', sort: ['order:asc'] },
    relatedTutorials: { fields: ['title', 'slug', 'duration', 'level'] }
  }
}, { encodeValuesOnly: true })
const res = await fetch(\`\${STRAPI_URL}/api/tutorials?\${query}\`)`}
            />
          </Spoiler>
          <Spoiler title="Deep Populate for Case Studies (with Metrics)">
            <CodeBlock
              language="typescript"
              filename="populate-case-study.ts"
              code={`const query = qs.stringify({
  filters: { slug: { $eq: 'client-to-server-components' } },
  populate: {
    seo: { populate: '*' },
    problem: { populate: '*' },
    solution: { populate: '*' },
    results: { populate: { metrics: { populate: '*' } } },
    relatedCaseStudies: { fields: ['title', 'slug', 'subtitle', 'category'] }
  }
}, { encodeValuesOnly: true })
const res = await fetch(\`\${STRAPI_URL}/api/case-studies?\${query}\`)`}
            />
          </Spoiler>
        </TabsContent>

        <TabsContent value="naming" className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Consistent naming conventions between frontend and backend ensure maintainability.
          </p>
          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">Concept</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">Frontend (TS)</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">Strapi UID</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-sm">DB Table</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {[
                  ["Collection Type", "PascalCase: Article", "api::article.article", "articles"],
                  ["Component", "PascalCase: SEOMetadata", "shared.seo-metadata", "components_shared_seo_metadata"],
                  ["Field", "camelCase: readTime", "readTime (same)", "read_time (snake_case)"],
                  ["Enum", "Union: 'beginner' | ...", "enumeration", "VARCHAR"],
                  ["Relation", "relatedArticles", "relation: manyToMany", "articles_related_links"],
                  ["Slug", "slug: string", "uid (auto from title)", "slug VARCHAR UNIQUE"],
                ].map(([concept, frontend, strapi, db]) => (
                  <tr key={concept}>
                    <td className="px-4 py-3 font-medium text-foreground">{concept}</td>
                    <td className="px-4 py-3"><code className="text-xs">{frontend}</code></td>
                    <td className="px-4 py-3"><code className="text-xs text-accent">{strapi}</code></td>
                    <td className="px-4 py-3"><code className="text-xs text-muted-foreground">{db}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Documentation */}
      <section className="space-y-4 mt-8">
        <h2 className="text-2xl font-bold text-foreground border-b border-border pb-2">Related Documentation</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {[
    { href: "/dashboard/documentation/cms-reference/content-collections", icon: BookOpen, title: "Content Collections", desc: "Article, Tutorial, Case Study schemas" },
    { href: "/dashboard/documentation/cms-reference/shared-components", icon: Layers, title: "Shared Components", desc: `${STATS.backend.sharedComponents.total} reusable Strapi components` },
    { href: "/dashboard/documentation/cms-reference/form-collections", icon: Server, title: "Form Collections", desc: "Service Request, Contact, Quotation" },
    { href: "/dashboard/documentation/infrastructure-and-ops/api-and-graphql", icon: Code, title: "API & GraphQL", desc: "Endpoints, auth, and queries" },
          ].map((link) => (
            <Link key={link.href} href={link.href} className="group">
              <Card className="h-full hover:border-accent/50 transition-colors">
                <CardContent className="pt-6">
                  <link.icon className="h-6 w-6 text-accent mb-2" />
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{link.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </DocPage>
  )
}
