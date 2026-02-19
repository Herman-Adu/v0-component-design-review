"use client"

import React from "react"

import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { DocPage as DocPageLayout, DocSectionHeader } from "@/components/molecules/doc-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Layers, User, MapPin, Calendar, Zap, FileText, Link2, CreditCard,
  BookOpen, Tag, ImageIcon, Clock, Users, Search, ListTree, GitBranch,
} from "lucide-react"
import Link from "next/link"

const SECTIONS = [
  { id: "overview", title: "Component Overview" },
  { id: "creation-order", title: "Creation Order" },
  { id: "content-schemas", title: "Content Component Schemas" },
  { id: "form-schemas", title: "Form Component Schemas" },
  { id: "best-practices", title: "Best Practices" },
]

const formComponents = [
  { name: "Contact Information", icon: User, category: "shared", description: "Name, email, phone, company", usedIn: ["Service Requests", "Contact Inquiries", "Quotations"] },
  { name: "UK Address", icon: MapPin, category: "shared", description: "UK address with postcode validation", usedIn: ["Service Requests", "Quotations"] },
  { name: "Schedule Preferences", icon: Calendar, category: "shared", description: "Date, time slot, flexibility", usedIn: ["Service Requests"] },
  { name: "Service Details", icon: Zap, category: "service", description: "Service type, urgency, description", usedIn: ["Service Requests"] },
  { name: "Inquiry Type", icon: FileText, category: "contact", description: "Category, subject, message", usedIn: ["Contact Inquiries"] },
  { name: "Reference Linking", icon: Link2, category: "contact", description: "Link to existing requests", usedIn: ["Contact Inquiries"] },
  { name: "Project Type", icon: FileText, category: "quotation", description: "Project scope and specs", usedIn: ["Quotations"] },
  { name: "Budget Timeline", icon: CreditCard, category: "quotation", description: "Budget range and timeline", usedIn: ["Quotations"] },
]

const contentComponents = [
  { name: "SEO Metadata", icon: Search, category: "content-shared", description: "Meta title, description, Open Graph, canonical URL, structured data", usedIn: ["Articles", "Tutorials", "Case Studies"] },
  { name: "Author Profile", icon: Users, category: "content-shared", description: "Author name, avatar, bio, role, social links", usedIn: ["Articles", "Tutorials", "Case Studies"] },
  { name: "Reading Info", icon: Clock, category: "content-shared", description: "Read time, difficulty indicator, word count", usedIn: ["Articles", "Tutorials"] },
  { name: "Category Tag", icon: Tag, category: "content-shared", description: "Category label, colour, icon mapping", usedIn: ["Articles", "Tutorials", "Case Studies"] },
  { name: "Featured Image", icon: ImageIcon, category: "content-shared", description: "Hero image, thumbnail, alt text, caption", usedIn: ["Articles", "Tutorials", "Case Studies"] },
  { name: "Related Content", icon: GitBranch, category: "content-shared", description: "Cross-references to related articles, tutorials, case studies", usedIn: ["Articles", "Tutorials", "Case Studies"] },
  { name: "Tutorial Step", icon: ListTree, category: "content-tutorial", description: "Title, content, code example, explanation per step", usedIn: ["Tutorials"] },
  { name: "Problem Section", icon: FileText, category: "content-casestudy", description: "Description, issues list, optional code example", usedIn: ["Case Studies"] },
  { name: "Solution Section", icon: FileText, category: "content-casestudy", description: "Description, improvements list, optional code example", usedIn: ["Case Studies"] },
  { name: "Result Metric", icon: Zap, category: "content-casestudy", description: "Label, before value, after value, improvement percentage", usedIn: ["Case Studies"] },
]

function ComponentCard({ component }: { component: { name: string; icon: React.ElementType; description: string; usedIn: string[] }; accent?: boolean }) {
  const Icon = component.icon
  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-accent shrink-0" />
          <CardTitle className="text-xs font-medium leading-tight">{component.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-3">
        <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{component.description}</p>
        <div className="flex flex-wrap gap-1">
          {component.usedIn.map((u) => (
            <span key={u} className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent">{u}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function MappingTable({ title, rows }: { title: string; rows: string[][] }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden mb-4">
      <div className="bg-muted/50 px-4 py-2.5 border-b border-border">
        <p className="text-sm font-medium text-foreground">{title}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-4 py-2 text-foreground font-medium">Frontend Field</th>
              <th className="text-left px-4 py-2 text-foreground font-medium">TS Type</th>
              <th className="text-left px-4 py-2 text-foreground font-medium">Strapi Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row[0]}>
                <td className="px-4 py-2"><code className="text-xs font-mono text-accent">{row[0]}</code></td>
                <td className="px-4 py-2"><code className="text-xs font-mono text-muted-foreground">{row[1]}</code></td>
                <td className="px-4 py-2 text-muted-foreground">{row[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function SharedComponentsPage() {
  return (
    <DocPageLayout
      title="Shared Components"
      description="Reusable Strapi components embedded across multiple Collection Types. This page covers both form submission components and content library components. Create these first before building your collections."
      icon={Layers}
      badges={[
        <Badge key="dev" className="bg-blue-500/20 text-blue-500 border-0">Developers</Badge>,
      ]}
      tags={["components", "strapi", "schema", "DRY"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Components", value: "18 total (8 Form + 10 Content)" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* Architecture Callout */}
      <Callout type="info" title="Creation Order Matters">
        Strapi requires components to exist before they can be referenced in Collection Types.
        Create <strong>all shared components first</strong>, then build your Collection Types.
        Within content components, create the leaf-level components (Result Metric, Tutorial Step)
        before the parent collections that reference them.
      </Callout>

      {/* Component Overview */}
      <DocSectionHeader id="overview">Component Overview</DocSectionHeader>

      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            <h3 className="text-xl font-semibold text-foreground">Content Library Components (10)</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Components for Articles, Tutorials, and Case Studies. These map to the TypeScript
            interfaces in <code className="text-xs px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">/data/content-library/</code>.
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            {contentComponents.map((c) => <ComponentCard key={c.name} component={c} />)}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            <h3 className="text-xl font-semibold text-foreground">Form Components (8)</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Components for Service Requests, Contact Inquiries, and Quotations. Documented in
            detail on the <Link href="/dashboard/documentation/cms-reference/form-collections" className="text-accent underline underline-offset-2">Form Collections</Link> page.
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {formComponents.map((c) => <ComponentCard key={c.name} component={c} />)}
          </div>
        </div>
      </div>

      {/* Creation Order */}
      <DocSectionHeader id="creation-order">Creation Order</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed">Follow this exact order. Each step depends on the previous steps being completed.</p>
      <div className="grid gap-3 md:grid-cols-4">
        {[
          { step: 1, title: "Leaf Components", items: ["Result Metric", "Tutorial Step", "Category Tag", "Reading Info"], color: "bg-green-500/10 text-green-500 border-green-500/20" },
          { step: 2, title: "Media & Identity", items: ["Featured Image", "Author Profile", "SEO Metadata"], color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
          { step: 3, title: "Nested Components", items: ["Problem Section", "Solution Section", "Related Content"], color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
          { step: 4, title: "Collection Types", items: ["Article", "Tutorial", "Case Study"], color: "bg-accent/10 text-accent border-accent/20" },
        ].map((phase) => (
          <div key={phase.step} className={`rounded-lg border p-4 ${phase.color}`}>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-current/10 text-xs font-bold">{phase.step}</span>
              <h4 className="font-semibold text-sm">{phase.title}</h4>
            </div>
            <ul className="space-y-1.5">
              {phase.items.map((item) => <li key={item} className="text-xs opacity-80">{item}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Content Component Schemas */}
      <DocSectionHeader id="content-schemas">Content Component Schemas</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed">
        Copy-paste ready JSON for every content library component. Place these in your Strapi project
        under <code className="text-xs px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">{"src/components/[category]/[component-name].json"}</code>.
      </p>

      <Tabs defaultValue="content-shared" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content-shared">Shared (6)</TabsTrigger>
          <TabsTrigger value="content-tutorial">Tutorial (1)</TabsTrigger>
          <TabsTrigger value="content-casestudy">Case Study (3)</TabsTrigger>
        </TabsList>

        <TabsContent value="content-shared" className="space-y-4">
          <Spoiler title="SEO Metadata" defaultOpen>
            <div className="space-y-3">
              <Callout type="info" title="Frontend Mapping">
                Currently the frontend does not render SEO from CMS data, but this component prepares
                for Next.js generateMetadata() integration. Every content type should embed this.
              </Callout>
              <CodeBlock title="src/components/content/seo-metadata.json" language="json" code={`{
  "collectionName": "components_content_seo_metadata",
  "info": { "displayName": "SEO Metadata", "icon": "search", "description": "Search engine optimization fields for all content types" },
  "attributes": {
    "metaTitle": { "type": "string", "required": true, "maxLength": 70, "minLength": 10 },
    "metaDescription": { "type": "text", "required": true, "maxLength": 160, "minLength": 50 },
    "canonicalUrl": { "type": "string", "required": false },
    "ogImage": { "type": "media", "multiple": false, "required": false, "allowedTypes": ["images"] },
    "ogTitle": { "type": "string", "required": false, "maxLength": 70 },
    "ogDescription": { "type": "text", "required": false, "maxLength": 200 },
    "noIndex": { "type": "boolean", "default": false },
    "structuredData": { "type": "json", "required": false }
  }
}`} />
            </div>
          </Spoiler>

          <Spoiler title="Author Profile">
            <div className="space-y-3">
              <Callout type="info" title="Frontend Mapping">
                Maps to future author attribution. Currently articles don{"'"}t display an author in the frontend, but this component is ready for when author pages are added.
              </Callout>
              <CodeBlock title="src/components/content/author-profile.json" language="json" code={`{
  "collectionName": "components_content_author_profile",
  "info": { "displayName": "Author Profile", "icon": "user", "description": "Content author attribution and profile" },
  "attributes": {
    "name": { "type": "string", "required": true, "maxLength": 100 },
    "slug": { "type": "uid", "targetField": "name", "required": true },
    "role": { "type": "string", "required": false, "maxLength": 100 },
    "bio": { "type": "text", "required": false, "maxLength": 500 },
    "avatar": { "type": "media", "multiple": false, "required": false, "allowedTypes": ["images"] },
    "website": { "type": "string", "required": false },
    "twitter": { "type": "string", "required": false },
    "github": { "type": "string", "required": false },
    "linkedin": { "type": "string", "required": false }
  }
}`} />
            </div>
          </Spoiler>

          <Spoiler title="Reading Info">
            <div className="space-y-3">
              <Callout type="info" title="Frontend Mapping">
                Maps to readTime in Articles and duration in Tutorials. The frontend displays these as badges in content cards and article headers.
              </Callout>
              <CodeBlock title="src/components/content/reading-info.json" language="json" code={`{
  "collectionName": "components_content_reading_info",
  "info": { "displayName": "Reading Info", "icon": "clock", "description": "Read time and content length metadata" },
  "attributes": {
    "readTime": { "type": "string", "required": true, "maxLength": 20 },
    "wordCount": { "type": "integer", "required": false, "min": 0 },
    "difficultyIndicator": { "type": "enumeration", "enum": ["quick-read", "standard", "deep-dive", "comprehensive"], "default": "standard" }
  }
}`} />
            </div>
          </Spoiler>

          <Spoiler title="Category Tag">
            <div className="space-y-3">
              <Callout type="info" title="Frontend Mapping">
                Maps to category enumerations on Article, Tutorial, and Case Study. The frontend uses these to drive filtering, colour-coded badges, and grouping on listing pages.
              </Callout>
              <CodeBlock title="src/components/content/category-tag.json" language="json" code={`{
  "collectionName": "components_content_category_tag",
  "info": { "displayName": "Category Tag", "icon": "tag", "description": "Content category with display metadata" },
  "attributes": {
    "label": { "type": "string", "required": true, "maxLength": 50 },
    "slug": { "type": "uid", "targetField": "label", "required": true },
    "colour": { "type": "string", "required": false, "maxLength": 7, "regex": "^#[0-9a-fA-F]{6}$" },
    "icon": { "type": "string", "required": false, "maxLength": 50 },
    "description": { "type": "text", "required": false, "maxLength": 200 }
  }
}`} />
            </div>
          </Spoiler>

          <Spoiler title="Featured Image">
            <CodeBlock title="src/components/content/featured-image.json" language="json" code={`{
  "collectionName": "components_content_featured_image",
  "info": { "displayName": "Featured Image", "icon": "image", "description": "Hero and thumbnail images for content items" },
  "attributes": {
    "hero": { "type": "media", "multiple": false, "required": false, "allowedTypes": ["images"] },
    "thumbnail": { "type": "media", "multiple": false, "required": false, "allowedTypes": ["images"] },
    "altText": { "type": "string", "required": false, "maxLength": 200 },
    "caption": { "type": "string", "required": false, "maxLength": 300 }
  }
}`} />
          </Spoiler>

          <Spoiler title="Related Content">
            <div className="space-y-3">
              <Callout type="info" title="Frontend Mapping">
                Maps to the relatedArticles sections at the bottom of each article/tutorial component. Uses Strapi relations to link content items to each other for cross-referencing.
              </Callout>
              <CodeBlock title="src/components/content/related-content.json" language="json" code={`{
  "collectionName": "components_content_related_content",
  "info": { "displayName": "Related Content", "icon": "git-branch", "description": "Cross-references between content items" },
  "attributes": {
    "relatedArticles": { "type": "relation", "relation": "oneToMany", "target": "api::article.article" },
    "relatedTutorials": { "type": "relation", "relation": "oneToMany", "target": "api::tutorial.tutorial" },
    "relatedCaseStudies": { "type": "relation", "relation": "oneToMany", "target": "api::case-study.case-study" },
    "displayMode": { "type": "enumeration", "enum": ["cards", "list", "minimal"], "default": "cards" },
    "maxItems": { "type": "integer", "default": 3, "min": 1, "max": 6 }
  }
}`} />
            </div>
          </Spoiler>
        </TabsContent>

        <TabsContent value="content-tutorial" className="space-y-4">
          <Spoiler title="Tutorial Step" defaultOpen>
            <div className="space-y-3">
              <Callout type="info" title="Frontend Mapping">
                Maps 1:1 to the TutorialStep interface in /data/content-library/tutorials.tsx. Each step has a title, rich content body, optional code example with language hint, and an explanation field.
              </Callout>
              <MappingTable title="TutorialStep: Frontend to Strapi Mapping" rows={[
                ["title", "string", "string (required, max 200)"],
                ["content", "string", "richtext (required)"],
                ["code", "string?", "text (long, optional)"],
                ["language", "string?", "enumeration (optional)"],
                ["explanation", "string?", "text (optional, max 1000)"],
              ]} />
              <CodeBlock title="src/components/content/tutorial-step.json" language="json" code={`{
  "collectionName": "components_content_tutorial_step",
  "info": { "displayName": "Tutorial Step", "icon": "list", "description": "A single step in a tutorial with code and explanation" },
  "attributes": {
    "title": { "type": "string", "required": true, "maxLength": 200 },
    "content": { "type": "richtext", "required": true },
    "code": { "type": "text", "required": false },
    "language": { "type": "enumeration", "enum": ["typescript", "javascript", "tsx", "jsx", "json", "bash", "css", "html", "graphql", "sql"], "required": false },
    "explanation": { "type": "text", "required": false, "maxLength": 1000 }
  }
}`} />
            </div>
          </Spoiler>
        </TabsContent>

        <TabsContent value="content-casestudy" className="space-y-4">
          <Spoiler title="Problem Section" defaultOpen>
            <div className="space-y-3">
              <Callout type="info" title="Frontend Mapping">
                Maps to CaseStudy.problem. The frontend renders this as a red-tinted panel with a description paragraph, bulleted issues list, and optional code example.
              </Callout>
              <MappingTable title="Problem: Frontend to Strapi Mapping" rows={[
                ["description", "string", "text (required, max 2000)"],
                ["issues", "string[]", "json (required)"],
                ["codeExample", "string?", "text (long, optional)"],
              ]} />
              <CodeBlock title="src/components/content/problem-section.json" language="json" code={`{
  "collectionName": "components_content_problem_section",
  "info": { "displayName": "Problem Section", "icon": "alert-triangle", "description": "Case study problem definition with issues and code" },
  "attributes": {
    "description": { "type": "text", "required": true, "maxLength": 2000 },
    "issues": { "type": "json", "required": true },
    "codeExample": { "type": "text", "required": false }
  }
}`} />
            </div>
          </Spoiler>

          <Spoiler title="Solution Section">
            <div className="space-y-3">
              <Callout type="info" title="Frontend Mapping">
                Maps to CaseStudy.solution. The frontend renders this as a green-tinted panel with improvements list and optional refactored code example.
              </Callout>
              <MappingTable title="Solution: Frontend to Strapi Mapping" rows={[
                ["description", "string", "text (required, max 2000)"],
                ["improvements", "string[]", "json (required)"],
                ["codeExample", "string?", "text (long, optional)"],
              ]} />
              <CodeBlock title="src/components/content/solution-section.json" language="json" code={`{
  "collectionName": "components_content_solution_section",
  "info": { "displayName": "Solution Section", "icon": "check-circle", "description": "Case study solution with improvements and code" },
  "attributes": {
    "description": { "type": "text", "required": true, "maxLength": 2000 },
    "improvements": { "type": "json", "required": true },
    "codeExample": { "type": "text", "required": false }
  }
}`} />
            </div>
          </Spoiler>

          <Spoiler title="Result Metric">
            <div className="space-y-3">
              <Callout type="info" title="Frontend Mapping">
                Maps to CaseStudy.results.metrics. The frontend renders each metric as a before/after comparison card with a percentage improvement badge and colour coding.
              </Callout>
              <MappingTable title="ResultMetric: Frontend to Strapi Mapping" rows={[
                ["label", "string", "string (required, max 100)"],
                ["before", "string", "string (required, max 50)"],
                ["after", "string", "string (required, max 50)"],
                ["improvement", "string", "string (required, max 50)"],
              ]} />
              <CodeBlock title="src/components/content/result-metric.json" language="json" code={`{
  "collectionName": "components_content_result_metric",
  "info": { "displayName": "Result Metric", "icon": "trending-up", "description": "Before/after metric for case study results" },
  "attributes": {
    "label": { "type": "string", "required": true, "maxLength": 100 },
    "before": { "type": "string", "required": true, "maxLength": 50 },
    "after": { "type": "string", "required": true, "maxLength": 50 },
    "improvement": { "type": "string", "required": true, "maxLength": 50 }
  }
}`} />
            </div>
          </Spoiler>
        </TabsContent>
      </Tabs>

      {/* Form Schemas link */}
      <DocSectionHeader id="form-schemas">Form Component Schemas</DocSectionHeader>
      <Callout type="info" title="Documented on Form Collections Page">
        The 8 form components (Contact Information, UK Address, Schedule Preferences, Service Details, Inquiry Type, Reference Linking, Project Type, Budget Timeline) have full JSON schemas on the{" "}
            <Link href="/dashboard/documentation/cms-reference/form-collections" className="text-accent underline underline-offset-2">Form Collections</Link> page.
      </Callout>

      {/* Best Practices */}
      <DocSectionHeader id="best-practices">Best Practices</DocSectionHeader>
      <div className="responsive-grid-2">
        {[
          { title: "Keep Components Atomic", desc: "Each component should represent one logical group of fields. Avoid mega-components with 20+ fields." },
          { title: "Use Validation Rules", desc: "Set minLength, maxLength, required, and regex validation at the Strapi schema level, not just the frontend." },
          { title: "Document Mappings", desc: "Every component should have a clear Frontend to Strapi mapping table showing how TS interfaces map to Strapi attributes." },
          { title: "Version Carefully", desc: "Changing component schemas after production data exists requires migration. Plan schemas thoroughly before launch." },
        ].map((tip) => (
          <Card key={tip.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{tip.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{tip.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DocPageLayout>
  )
}
