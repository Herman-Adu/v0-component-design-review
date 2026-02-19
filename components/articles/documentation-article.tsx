"use client"

import {
  SectionHeader,
  InfoBox,
  StepFlow,
  ComparisonCards,
  CodeBlock,
  FeatureGrid,
  KeyTakeaway,
  TableOfContents,
  ArchitectureDiagram,
  FileTreeDiagram,
  MetricCard,
  DataFlowDiagram,
} from "@/components/molecules/article-components"

const tocItems = [
  { id: "why-document", title: "Why Documentation Matters", level: 2 },
  { id: "documentation-types", title: "Types of Documentation", level: 2 },
  { id: "our-system", title: "Our Documentation System", level: 2 },
  { id: "living-docs", title: "Living Documentation", level: 2 },
  { id: "automation", title: "Automation & Tooling", level: 2 },
  { id: "scaling", title: "Scaling Documentation", level: 2 },
  { id: "takeaways", title: "Key Takeaways", level: 2 },
]

export function DocumentationArticle() {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Why Documentation Matters" id="why-document" />
        
        <InfoBox type="info" title="Documentation is a Product">
          Documentation isn&apos;t an afterthought - it&apos;s a product that serves your team, future developers,
          and stakeholders. Like any product, it needs design, maintenance, and continuous improvement.
        </InfoBox>

        <p className="text-muted-foreground mb-6">
          Throughout this project, we treated documentation as code. Every architectural decision,
          every pattern implementation, every security measure was documented not just for reference,
          but as a learning resource and decision record.
        </p>

        <FeatureGrid
          features={[
            {
              icon: "Users",
              title: "Onboarding Speed",
              description: "New developers productive in days, not weeks",
            },
            {
              icon: "Shield",
              title: "Decision Records",
              description: "Understand why choices were made, not just what",
            },
            {
              icon: "Code",
              title: "Code Quality",
              description: "Documented patterns become enforced standards",
            },
            {
              icon: "Zap",
              title: "Reduced Bus Factor",
              description: "Knowledge shared, not siloed in individuals",
            },
          ]}
        />

        <SectionHeader number="02" title="Types of Documentation" id="documentation-types" />

        <ArchitectureDiagram
          title="Documentation Hierarchy"
          layers={[
            {
              name: "API Reference",
              items: ["Component Props", "Function Signatures", "Type Definitions"],
              color: "blue",
            },
            {
              name: "How-To Guides",
              items: ["Tutorials", "Recipes", "Step-by-Step"],
              color: "green",
            },
            {
              name: "Explanations",
              items: ["Architecture", "Design Decisions", "Trade-offs"],
              color: "purple",
            },
            {
              name: "Quick Reference",
              items: ["Cheatsheets", "Code Examples", "Common Patterns"],
              color: "orange",
            },
          ]}
        />

        <ComparisonCards
          leftTitle="Documentation That Works"
          leftItems={[
            "Lives close to the code it describes",
            "Updated with every code change",
            "Includes real, working examples",
            "Explains the 'why' not just 'what'",
            "Tested and verified automatically",
            "Easy to search and navigate",
          ]}
          rightTitle="Documentation That Fails"
          rightItems={[
            "Separate wiki nobody updates",
            "Written once, forgotten forever",
            "Outdated or broken examples",
            "Just restates the obvious",
            "No verification it's accurate",
            "Buried in nested folders",
          ]}
          leftType="positive"
          rightType="negative"
        />

        <SectionHeader number="03" title="Our Documentation System" id="our-system" />

        <FileTreeDiagram
          title="Documentation Structure"
          files={[
            { name: "app/dashboard/", type: "folder", indent: 0 },
            { name: "page.tsx", type: "file", indent: 1, description: "Getting Started" },
            { name: "frontend/", type: "folder", indent: 1 },
            { name: "page.tsx", type: "file", indent: 2, description: "Frontend Architecture" },
            { name: "backend/", type: "folder", indent: 1 },
            { name: "page.tsx", type: "file", indent: 2, description: "Backend Architecture" },
            { name: "security/", type: "folder", indent: 1 },
            { name: "page.tsx", type: "file", indent: 2, description: "Security Implementation" },
            { name: "content-library/", type: "folder", indent: 1 },
            { name: "articles/", type: "folder", indent: 2 },
            { name: "[slug]/page.tsx", type: "file", indent: 3, description: "Dynamic articles" },
            { name: "admin/", type: "folder", indent: 1 },
            { name: "documentation-health/", type: "folder", indent: 2 },
            { name: "page.tsx", type: "file", indent: 3, description: "Health tracking" },
          ]}
        />

        <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Documentation as React Components</h3>

        <p className="text-muted-foreground mb-4">
          Our documentation pages are React components, giving us full control over presentation,
          interactivity, and consistency.
        </p>

        <CodeBlock
          filename="components/articles/security-article.tsx"
          language="tsx"
          code={`// Documentation as code - full React component
export function SecurityArticle() {
  return (
    <div className="flex gap-8">
      <article className="flex-1">
        <SectionHeader number="01" title="Security Overview" />
        
        <InfoBox type="warning" title="Security First">
          Every input is sanitized before processing...
        </InfoBox>
        
        <DataFlowDiagram
          title="Security Pipeline"
          nodes={[
            { id: "input", label: "User Input" },
            { id: "sanitize", label: "Sanitization" },
            { id: "validate", label: "Validation" },
            { id: "store", label: "Safe Storage" },
          ]}
        />
        
        <CodeBlock
          filename="lib/security/index.ts"
          code={actualCodeFromProject}
        />
      </article>
      
      <TableOfContents items={tocItems} />
    </div>
  )
}`}
        />

        <SectionHeader number="04" title="Living Documentation" id="living-docs" />

        <InfoBox type="tip" title="Documentation Health Dashboard">
          We built a Documentation Health page that tracks coverage, staleness, and gaps.
          This turns documentation maintenance from a chore into a visible metric.
        </InfoBox>

        <StepFlow
          title="Documentation Update Workflow"
          steps={[
            { title: "Code Change", description: "Developer modifies component" },
            { title: "Doc Check", description: "Is documentation affected?" },
            { title: "Update Docs", description: "Modify in same PR" },
            { title: "Review Both", description: "Code + docs reviewed together" },
            { title: "Health Update", description: "Update changelog & status" },
          ]}
        />

        <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Tracking Documentation Health</h3>

        <CodeBlock
          filename="Documentation Health Schema"
          language="typescript"
          code={`interface DocumentationSection {
  name: string
  path: string
  status: "current" | "needs-update" | "outdated" | "planned"
  lastReviewed: string
  coversComponents: string[]
  notes?: string
}

const documentationSections: DocumentationSection[] = [
  {
    name: "Getting Started",
    path: "/dashboard",
    status: "current",
    lastReviewed: "2026-02-04",
    coversComponents: ["Overview", "Quick Start", "Architecture"],
  },
  {
    name: "Security Implementation",
    path: "/dashboard/documentation/app-reference/security-architecture",
    status: "current",
    lastReviewed: "2026-02-04",
    coversComponents: ["Sanitization", "Validation", "CSRF", "Rate Limiting"],
  },
  // Tracked for every section...
]`}
        />

        <SectionHeader number="05" title="Automation & Tooling" id="automation" />

        <DataFlowDiagram
          title="Documentation Pipeline"
          nodes={[
            { id: "write", label: "Write in TSX", description: "Full React power" },
            { id: "components", label: "Use Components", description: "Consistent styling" },
            { id: "build", label: "Build & Deploy", description: "With application" },
            { id: "track", label: "Track Health", description: "Dashboard metrics" },
          ]}
        />

        <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Reusable Documentation Components</h3>

        <FeatureGrid
          features={[
            {
              icon: "Code",
              title: "CodeBlock",
              description: "Syntax highlighted with copy button and filename",
            },
            {
              icon: "Layers",
              title: "ArchitectureDiagram",
              description: "Layered architecture visualization",
            },
            {
              icon: "GitBranch",
              title: "DataFlowDiagram",
              description: "Show how data moves through system",
            },
            {
              icon: "BarChart",
              title: "MetricCard",
              description: "Display performance metrics with trends",
            },
            {
              icon: "CheckCircle",
              title: "ComparisonCards",
              description: "Side-by-side do/don't comparisons",
            },
            {
              icon: "List",
              title: "TableOfContents",
              description: "Sticky navigation with scroll tracking",
            },
          ]}
        />

        <SectionHeader number="06" title="Scaling Documentation" id="scaling" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Doc Pages"
            value="25+"
            change="+400%"
            trend="up"
            description="Grew with the codebase"
          />
          <MetricCard
            title="Coverage"
            value="95%"
            change="+60%"
            trend="up"
            description="All major systems documented"
          />
          <MetricCard
            title="Articles"
            value="14"
            change="New"
            trend="up"
            description="Educational content library"
          />
          <MetricCard
            title="Components"
            value="15+"
            change="Reusable"
            trend="up"
            description="Documentation building blocks"
          />
        </div>

        <ComparisonCards
          leftTitle="What We Document"
          leftItems={[
            "Architecture decisions and trade-offs",
            "Security implementation details",
            "Component patterns and usage",
            "API integration approaches",
            "Deployment and operations",
            "Troubleshooting guides",
          ]}
          rightTitle="What We Generate"
          rightItems={[
            "TypeScript types from schemas",
            "API documentation from routes",
            "Component props from TypeScript",
            "Test coverage reports",
            "Bundle analysis",
            "Performance metrics",
          ]}
          leftType="positive"
          rightType="positive"
        />

        <InfoBox type="important" title="The 3-Click Rule">
          Any developer should be able to find any piece of documentation within 3 clicks
          from the dashboard homepage. If it takes more, the navigation needs improvement.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaways" id="takeaways" />

        <KeyTakeaway
          title="Documentation is Code"
          points={[
            "Write documentation in the same codebase, same PR, same review",
            "Use components for consistency - don't repeat styling decisions",
            "Track documentation health like you track code coverage",
            "Include working examples that are actually tested",
            "Explain WHY decisions were made, not just WHAT exists",
            "Make it searchable, navigable, and beautiful",
            "Update the changelog with every significant change",
          ]}
        />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
