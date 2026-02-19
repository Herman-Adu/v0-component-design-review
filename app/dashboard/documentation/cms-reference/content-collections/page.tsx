"use client"

import React from "react"

import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, FileText, GraduationCap, Briefcase, Layers, Database, GitBranch } from "lucide-react"
import Link from "next/link"

const SECTIONS = [
  { id: "overview", title: "Content Library Overview" },
  { id: "field-mapping", title: "Frontend-to-Backend Mapping" },
  { id: "schemas", title: "Complete Strapi Schemas" },
  { id: "api-queries", title: "API Query Examples" },
  { id: "dependencies", title: "Component Dependencies" },
  { id: "related", title: "Related Documentation" },
]

const contentOverview = [
  {
    name: "Article",
    icon: FileText,
    count: 21,
    description: "Long-form educational content with rich component rendering, categories, difficulty levels, and reading time.",
    frontendFile: "/data/content-library/articles.tsx",
    frontendInterface: "Article",
    categories: ["architecture", "security", "forms", "performance", "best-practices", "rendering", "business", "testing", "devops"],
  },
  {
    name: "Tutorial",
    icon: GraduationCap,
    count: 10,
    description: "Step-by-step interactive guides with structured steps, prerequisites, learning outcomes, and code exercises.",
    frontendFile: "/data/content-library/tutorials.tsx",
    frontendInterface: "Tutorial + TutorialStep",
    categories: ["components", "forms", "security", "state-management", "performance", "getting-started", "cms", "testing"],
  },
  {
    name: "Case Study",
    icon: Briefcase,
    count: 11,
    description: "Real-world before/after implementation stories with problem analysis, solution architecture, and measurable outcome metrics.",
    frontendFile: "/data/content-library/case-studies.tsx",
    frontendInterface: "CaseStudy",
    categories: ["refactoring", "performance", "security", "architecture", "business", "cms"],
  },
]

const articleFields = [
  ["id", "string", "Auto-generated", "Strapi provides this automatically"],
  ["slug", "string", "uid (linked to title)", "Unique, URL-safe identifier"],
  ["title", "string", "string (required)", "Max 255 characters"],
  ["excerpt", "string", "text", "Plain text summary, max 500 chars"],
  ["level", "ArticleLevel", "enumeration", "beginner | intermediate | advanced"],
  ["category", "ArticleCategory", "enumeration", "9 values: architecture, security, forms..."],
  ["readTime", "string", "string", "Display string e.g. '8 min'"],
  ["publishedAt", "string", "date", "ISO date format"],
  ["tags", "string[]", "json", "Array of tag strings"],
  ["content", "string", "richtext (markdown)", "Markdown body for basic rendering"],
  ["hasRichContent", "boolean?", "boolean (default: false)", "If true, frontend uses dedicated component"],
]

const tutorialFields = [
  ["id", "string", "Auto-generated", "Strapi provides this automatically"],
  ["slug", "string", "uid (linked to title)", "Unique, URL-safe identifier"],
  ["title", "string", "string (required)", "Max 255 characters"],
  ["description", "string", "text", "Tutorial summary, max 500 chars"],
  ["level", "TutorialLevel", "enumeration", "beginner | intermediate | advanced"],
  ["category", "TutorialCategory", "enumeration", "8 values: components, forms, security..."],
  ["duration", "string", "string", "Display string e.g. '20 min'"],
  ["publishedAt", "string", "date", "ISO date format"],
  ["tags", "string[]", "json", "Array of tag strings"],
  ["prerequisites", "string[]", "json", "Array of prerequisite descriptions"],
  ["learningOutcomes", "string[]", "json", "Array of outcome descriptions"],
  ["steps", "TutorialStep[]", "component (repeatable)", "Uses TutorialStep shared component"],
]

const caseStudyFields = [
  ["id", "string", "Auto-generated", "Strapi provides this automatically"],
  ["slug", "string", "uid (linked to title)", "Unique, URL-safe identifier"],
  ["title", "string", "string (required)", "Max 255 characters"],
  ["subtitle", "string", "string", "Secondary headline"],
  ["category", "CaseStudyCategory", "enumeration", "6 values: refactoring, performance, security..."],
  ["publishedAt", "string", "date", "ISO date format"],
  ["tags", "string[]", "json", "Array of tag strings"],
  ["problem.description", "string", "text", "Nested in Problem component"],
  ["problem.issues", "string[]", "json", "Array of issue descriptions"],
  ["problem.codeExample", "string?", "text (long)", "Optional code snippet"],
  ["solution.description", "string", "text", "Nested in Solution component"],
  ["solution.improvements", "string[]", "json", "Array of improvement descriptions"],
  ["solution.codeExample", "string?", "text (long)", "Optional code snippet"],
  ["results.metrics", "Metric[]", "component (repeatable)", "Uses ResultMetric component"],
  ["keyTakeaway", "string", "text", "Single-paragraph summary"],
]

const dependencyOrder = [
  { step: "1", name: "TutorialStep", type: "Component", dependsOn: "None", usedBy: "Tutorial" },
  { step: "2", name: "ProblemSection", type: "Component", dependsOn: "None", usedBy: "Case Study" },
  { step: "3", name: "SolutionSection", type: "Component", dependsOn: "None", usedBy: "Case Study" },
  { step: "4", name: "ResultMetric", type: "Component", dependsOn: "None", usedBy: "Case Study" },
  { step: "5", name: "Article", type: "Collection Type", dependsOn: "None", usedBy: "Frontend listing + detail pages" },
  { step: "6", name: "Tutorial", type: "Collection Type", dependsOn: "TutorialStep", usedBy: "Frontend listing + detail pages" },
  { step: "7", name: "Case Study", type: "Collection Type", dependsOn: "ProblemSection, SolutionSection, ResultMetric", usedBy: "Frontend listing + detail pages" },
]

const relatedDocs = [
    { href: "/dashboard/documentation/cms-reference/form-collections", icon: Database, title: "Form Collections", desc: "Service Request, Contact, and Quotation form schemas" },
    { href: "/dashboard/documentation/cms-reference/shared-components", icon: Layers, title: "Shared Components", desc: "Reusable Strapi components for forms and content" },
    { href: "/dashboard/documentation/cms-reference/relationships", icon: GitBranch, title: "Relationships", desc: "Entity relationships and data flow between all content types" },
]

function FieldMappingTable({ icon: Icon, label, fields }: { icon: React.ElementType; label: string; fields: string[][] }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="bg-muted/50 px-4 py-2.5 border-b border-border flex items-center gap-2">
        <Icon className="h-4 w-4 text-accent" />
        <p className="text-sm font-medium text-foreground">{label}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/30 border-b border-border">
              <th className="text-left px-4 py-2 text-foreground font-medium">Frontend Field</th>
              <th className="text-left px-4 py-2 text-foreground font-medium">TS Type</th>
              <th className="text-left px-4 py-2 text-foreground font-medium">Strapi Type</th>
              <th className="text-left px-4 py-2 text-foreground font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {fields.map((row) => (
              <tr key={row[0]}>
                <td className="px-4 py-2"><code className="text-xs font-mono text-accent">{row[0]}</code></td>
                <td className="px-4 py-2"><code className="text-xs font-mono text-muted-foreground">{row[1]}</code></td>
                <td className="px-4 py-2 text-muted-foreground">{row[2]}</td>
                <td className="px-4 py-2 text-muted-foreground">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ContentCollectionsPage() {
  return (
    <DocPage
      title="Content Collection Types"
      description="Complete Strapi 5 Collection Type schemas for the content library. Each schema maps 1:1 to the TypeScript interfaces in /data/content-library/ with copy-paste ready JSON for your Strapi project."
      icon={BookOpen}
      badges={[{ label: "Developers", variant: "default" as const }]}
      tags={["Strapi 5", "3 Content Collections", "42 Content Items", "10 Content Components", "PostgreSQL"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      <Callout type="info" title="Content Architecture Pattern">
        {"The content library follows the same atomic design mapping as the form system: frontend TypeScript interfaces define the data shape, Strapi Collection Types mirror those interfaces field-for-field, and Strapi Components handle reusable sub-structures (SEO, Author, Rich Content blocks). All 10 content shared components are fully documented on the "}
        <a href="/dashboard/documentation/cms-reference/shared-components" className="underline font-medium">Shared Components</a>
        {" page -- create those first, then create these collection types."}
      </Callout>

      {/* Overview */}
      <DocSectionHeader id="overview">Content Library Overview</DocSectionHeader>
      <div className="responsive-grid-3">
        {contentOverview.map((type) => {
          const Icon = type.icon
          return (
            <Card key={type.name}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-accent" />
                    <CardTitle className="text-lg">{type.name}</CardTitle>
                  </div>
                  <span className="text-2xl font-bold text-accent">{type.count}</span>
                </div>
                <CardDescription>{type.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Frontend Interface</p>
                  <code className="text-xs px-1.5 py-0.5 rounded bg-muted text-accent font-mono">{type.frontendInterface}</code>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground mb-1">Source File</p>
                  <code className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">{type.frontendFile}</code>
                </div>
                <div>
                  <p className="text-xs font-medium text-foreground mb-1.5">{"Categories ("}{type.categories.length}{")"}</p>
                  <div className="flex flex-wrap gap-1">
                    {type.categories.map((cat) => (
                      <span key={cat} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{cat}</span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Field Mapping */}
      <DocSectionHeader id="field-mapping">Frontend-to-Backend Field Mapping</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Every frontend TypeScript field maps to a specific Strapi field type. This reference shows how each interface property translates to the CMS schema.
      </p>
      <Tabs defaultValue="article-map" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="article-map">Article</TabsTrigger>
          <TabsTrigger value="tutorial-map">Tutorial</TabsTrigger>
          <TabsTrigger value="casestudy-map">Case Study</TabsTrigger>
        </TabsList>
        <TabsContent value="article-map">
          <FieldMappingTable icon={FileText} label={"Article Interface \u2192 Strapi Schema"} fields={articleFields} />
        </TabsContent>
        <TabsContent value="tutorial-map">
          <FieldMappingTable icon={GraduationCap} label={"Tutorial Interface \u2192 Strapi Schema"} fields={tutorialFields} />
        </TabsContent>
        <TabsContent value="casestudy-map">
          <FieldMappingTable icon={Briefcase} label={"CaseStudy Interface \u2192 Strapi Schema"} fields={caseStudyFields} />
        </TabsContent>
      </Tabs>

      {/* Schemas */}
      <DocSectionHeader id="schemas">Complete Strapi Schemas</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed mb-4">
        {"Copy-paste ready JSON schemas for each content collection type. These go in your Strapi project under "}
        <code className="text-xs px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">{"src/api/[content-type]/content-types/[content-type]/schema.json"}</code>.
      </p>
      <Callout type="warning" title="Prerequisites">
        Before creating these collection types, ensure you have created the shared components: TutorialStep, ProblemSection, SolutionSection, and ResultMetric. These are documented on the Shared Components page.
      </Callout>

      <Spoiler title="Article Collection Type" defaultOpen>
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm font-medium text-foreground">api::article.article</p>
              <p className="text-xs text-muted-foreground">{"Maps to: Article interface in articles.tsx"}</p>
            </div>
          </div>
          <CodeBlock
            title="src/api/article/content-types/article/schema.json"
            language="json"
            code={`{
  "kind": "collectionType",
  "collectionName": "articles",
  "info": {
    "singularName": "article",
    "pluralName": "articles",
    "displayName": "Article",
    "description": "Long-form educational content for the content library"
  },
  "options": { "draftAndPublish": true },
  "pluginOptions": {},
  "attributes": {
    "title": { "type": "string", "required": true, "maxLength": 255 },
    "slug": { "type": "uid", "targetField": "title", "required": true },
    "excerpt": { "type": "text", "maxLength": 500, "required": true },
    "level": { "type": "enumeration", "enum": ["beginner", "intermediate", "advanced"], "required": true, "default": "beginner" },
    "category": { "type": "enumeration", "enum": ["architecture", "security", "forms", "performance", "best-practices", "rendering", "business", "testing", "devops"], "required": true },
    "readTime": { "type": "string", "required": true },
    "tags": { "type": "json" },
    "content": { "type": "richtext", "required": true },
    "hasRichContent": { "type": "boolean", "default": false }
  }
}`}
          />
          <Callout type="info" title="Article Notes">
            {"The hasRichContent field tells the frontend whether to render the markdown content field or use a dedicated React component for richer presentation (interactive diagrams, code playgrounds, architecture visualisations). Strapi's built-in publishedAt field handles the publish date automatically."}
          </Callout>
        </div>
      </Spoiler>

      <Spoiler title="Tutorial Collection Type">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm font-medium text-foreground">api::tutorial.tutorial</p>
              <p className="text-xs text-muted-foreground">{"Maps to: Tutorial + TutorialStep interfaces in tutorials.tsx"}</p>
            </div>
          </div>
          <CodeBlock
            title="src/api/tutorial/content-types/tutorial/schema.json"
            language="json"
            code={`{
  "kind": "collectionType",
  "collectionName": "tutorials",
  "info": {
    "singularName": "tutorial",
    "pluralName": "tutorials",
    "displayName": "Tutorial",
    "description": "Step-by-step interactive learning guides"
  },
  "options": { "draftAndPublish": true },
  "pluginOptions": {},
  "attributes": {
    "title": { "type": "string", "required": true, "maxLength": 255 },
    "slug": { "type": "uid", "targetField": "title", "required": true },
    "description": { "type": "text", "maxLength": 500, "required": true },
    "level": { "type": "enumeration", "enum": ["beginner", "intermediate", "advanced"], "required": true, "default": "beginner" },
    "category": { "type": "enumeration", "enum": ["components", "forms", "security", "state-management", "performance", "getting-started", "cms", "testing"], "required": true },
    "duration": { "type": "string", "required": true },
    "tags": { "type": "json" },
    "prerequisites": { "type": "json" },
    "learningOutcomes": { "type": "json" },
    "steps": { "type": "component", "repeatable": true, "component": "content.tutorial-step" }
  }
}`}
          />
          <p className="text-sm font-medium text-foreground mt-6 mb-2">Required Shared Component: TutorialStep</p>
          <CodeBlock
            title="src/components/content/tutorial-step.json"
            language="json"
            code={`{
  "collectionName": "components_content_tutorial_step",
  "info": { "displayName": "Tutorial Step", "icon": "list-ol", "description": "A single step in a tutorial with code exercise" },
  "options": {},
  "attributes": {
    "title": { "type": "string", "required": true, "maxLength": 200 },
    "content": { "type": "text", "required": true },
    "code": { "type": "text" },
    "hint": { "type": "text" },
    "solution": { "type": "text" },
    "explanation": { "type": "text" }
  }
}`}
          />
          <Callout type="info" title="Tutorial Notes">
            {"Each tutorial step maps directly to the TutorialStep interface. The code, hint, solution, and explanation fields are all optional -- some steps present a challenge (code + hint), others present the answer (solution + explanation). Strapi's built-in publishedAt handles the publish date."}
          </Callout>
        </div>
      </Spoiler>

      <Spoiler title="Case Study Collection Type">
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="h-5 w-5 text-accent" />
            <div>
              <p className="text-sm font-medium text-foreground">{"api::case-study.case-study"}</p>
              <p className="text-xs text-muted-foreground">{"Maps to: CaseStudy interface in case-studies.tsx"}</p>
            </div>
          </div>
          <CodeBlock
            title="src/api/case-study/content-types/case-study/schema.json"
            language="json"
            code={`{
  "kind": "collectionType",
  "collectionName": "case_studies",
  "info": {
    "singularName": "case-study",
    "pluralName": "case-studies",
    "displayName": "Case Study",
    "description": "Real-world implementation stories with measurable outcomes"
  },
  "options": { "draftAndPublish": true },
  "pluginOptions": {},
  "attributes": {
    "title": { "type": "string", "required": true, "maxLength": 255 },
    "slug": { "type": "uid", "targetField": "title", "required": true },
    "subtitle": { "type": "string", "maxLength": 255 },
    "category": { "type": "enumeration", "enum": ["refactoring", "performance", "security", "architecture", "business", "cms"], "required": true },
    "tags": { "type": "json" },
    "problem": { "type": "component", "repeatable": false, "component": "content.problem-section", "required": true },
    "solution": { "type": "component", "repeatable": false, "component": "content.solution-section", "required": true },
    "resultMetrics": { "type": "component", "repeatable": true, "component": "content.result-metric" },
    "keyTakeaway": { "type": "text", "required": true, "maxLength": 1000 }
  }
}`}
          />
          <p className="text-sm font-medium text-foreground mt-6 mb-2">Required Shared Components</p>
          <Spoiler title="ProblemSection Component">
            <CodeBlock
              title="src/components/content/problem-section.json"
              language="json"
              code={`{
  "collectionName": "components_content_problem_section",
  "info": { "displayName": "Problem Section", "icon": "exclamation-triangle", "description": "Describes the challenge or issue that was faced" },
  "options": {},
  "attributes": {
    "description": { "type": "text", "required": true },
    "issues": { "type": "json", "required": true },
    "codeExample": { "type": "text" }
  }
}`}
            />
          </Spoiler>
          <Spoiler title="SolutionSection Component">
            <CodeBlock
              title="src/components/content/solution-section.json"
              language="json"
              code={`{
  "collectionName": "components_content_solution_section",
  "info": { "displayName": "Solution Section", "icon": "check-circle", "description": "Describes the approach taken and improvements made" },
  "options": {},
  "attributes": {
    "description": { "type": "text", "required": true },
    "improvements": { "type": "json", "required": true },
    "codeExample": { "type": "text" }
  }
}`}
            />
          </Spoiler>
          <Spoiler title="ResultMetric Component">
            <CodeBlock
              title="src/components/content/result-metric.json"
              language="json"
              code={`{
  "collectionName": "components_content_result_metric",
  "info": { "displayName": "Result Metric", "icon": "chart-line", "description": "Before/after metric for case study outcomes" },
  "options": {},
  "attributes": {
    "label": { "type": "string", "required": true, "maxLength": 100 },
    "before": { "type": "string", "required": true, "maxLength": 50 },
    "after": { "type": "string", "required": true, "maxLength": 50 },
    "improvement": { "type": "string", "required": true, "maxLength": 50 }
  }
}`}
            />
          </Spoiler>
          <Callout type="info" title="Case Study Notes">
            {"The nested problem and solution objects from the frontend interface become single (non-repeatable) Strapi components. The results.metrics array becomes a repeatable ResultMetric component. Each metric stores the before value, after value, and improvement percentage for the comparison table. Strapi's built-in publishedAt handles the publish date."}
          </Callout>
        </div>
      </Spoiler>

      {/* API Queries */}
      <DocSectionHeader id="api-queries">API Query Examples</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Example REST and GraphQL queries for fetching content from these collection types. For full API documentation, see the API & GraphQL page.
      </p>
      <Tabs defaultValue="rest" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="rest">REST API</TabsTrigger>
          <TabsTrigger value="graphql">GraphQL</TabsTrigger>
        </TabsList>
        <TabsContent value="rest" className="space-y-4">
          <Spoiler title="Fetch All Articles (Paginated)" defaultOpen>
            <CodeBlock title="GET /api/articles" language="bash" code={`# Fetch articles with pagination, filtering, and sorting
GET /api/articles?pagination[page]=1&pagination[pageSize]=10&sort=publishedAt:desc

# Filter by category and level
GET /api/articles?filters[category][$eq]=architecture&filters[level][$eq]=beginner

# Search by title
GET /api/articles?filters[title][$containsi]=hydration`} />
          </Spoiler>
          <Spoiler title="Fetch Single Tutorial with Steps">
            <CodeBlock title="GET /api/tutorials/:slug" language="bash" code={`# Fetch a single tutorial by slug with all nested components
GET /api/tutorials?filters[slug][$eq]=building-atomic-component&populate=steps

# Response shape matches the Tutorial interface:
# {
#   data: {
#     id: 1,
#     attributes: {
#       title, slug, description, level, category,
#       duration, tags, prerequisites, learningOutcomes,
#       steps: [{ title, content, code, hint, solution, explanation }],
#       publishedAt
#     }
#   }
# }`} />
          </Spoiler>
          <Spoiler title="Fetch Case Study with All Components">
            <CodeBlock title="GET /api/case-studies/:slug" language="bash" code={`# Fetch case study with deeply populated components
GET /api/case-studies?filters[slug][$eq]=client-to-server-components&populate[problem]=*&populate[solution]=*&populate[resultMetrics]=*

# Deep populate shorthand
GET /api/case-studies?filters[slug][$eq]=client-to-server-components&populate=deep`} />
          </Spoiler>
        </TabsContent>
        <TabsContent value="graphql" className="space-y-4">
          <Spoiler title="Query Articles by Category" defaultOpen>
            <CodeBlock title="GraphQL Query" language="graphql" code={`query GetArticles($category: String, $level: String) {
  articles(
    filters: { category: { eq: $category }, level: { eq: $level } }
    sort: "publishedAt:desc"
    pagination: { page: 1, pageSize: 10 }
  ) {
    data {
      id
      attributes {
        title, slug, excerpt, level, category,
        readTime, tags, hasRichContent, publishedAt
      }
    }
    meta { pagination { total, pageCount } }
  }
}`} />
          </Spoiler>
          <Spoiler title="Query Tutorial with Steps">
            <CodeBlock title="GraphQL Query" language="graphql" code={`query GetTutorial($slug: String!) {
  tutorials(filters: { slug: { eq: $slug } }) {
    data {
      id
      attributes {
        title, slug, description, level, category,
        duration, tags, prerequisites, learningOutcomes,
        steps { title, content, code, hint, solution, explanation }
        publishedAt
      }
    }
  }
}`} />
          </Spoiler>
          <Spoiler title="Query Case Study with Nested Components">
            <CodeBlock title="GraphQL Query" language="graphql" code={`query GetCaseStudy($slug: String!) {
  caseStudies(filters: { slug: { eq: $slug } }) {
    data {
      id
      attributes {
        title, slug, subtitle, category, tags,
        problem { description, issues, codeExample }
        solution { description, improvements, codeExample }
        resultMetrics { label, before, after, improvement }
        keyTakeaway, publishedAt
      }
    }
  }
}`} />
          </Spoiler>
        </TabsContent>
      </Tabs>

      {/* Dependencies */}
      <DocSectionHeader id="dependencies">Component Dependencies</DocSectionHeader>
      <p className="text-muted-foreground leading-relaxed mb-4">
        Create these in order -- shared components first, then collection types that reference them.
      </p>
      <div className="rounded-lg border border-border overflow-hidden">
        <div className="bg-muted/50 px-4 py-2.5 border-b border-border">
          <p className="text-sm font-medium text-foreground">Creation Order</p>
        </div>
        <div className="divide-y divide-border">
          {dependencyOrder.map((item) => (
            <div key={item.step} className="px-4 py-3 flex items-center gap-4">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent text-xs font-bold shrink-0">{item.step}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-accent">{item.name}</code>
                  <Badge variant="outline" className="text-xs">{item.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {"Depends on: "}{item.dependsOn}{" \u00B7 Used by: "}{item.usedBy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Related */}
      <DocSectionHeader id="related">Related Documentation</DocSectionHeader>
      <div className="responsive-grid-3">
        {relatedDocs.map((doc) => (
          <Link key={doc.href} href={doc.href} className="group">
            <Card className="h-full hover:border-accent/50 transition-colors">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <doc.icon className="h-4 w-4 text-accent" />
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{doc.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{doc.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </DocPage>
  )
}
