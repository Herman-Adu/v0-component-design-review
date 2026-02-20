"use client"

import type { CaseStudy } from "@/data/content-library/case-studies"
import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  StatsTable,
  MetricsGrid,
  BeforeAfterComparison,
  ComparisonCards,
  FeatureGrid,
  DataFlowDiagram,
  FileTree,
  VerticalFlow,
  StepFlow,
  NumberedList,
  ArticleIcons,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "context", title: "Context & Discovery", level: 2 },
  { id: "problem-analysis", title: "Problem Analysis", level: 2 },
  { id: "data-model", title: "Data Model Design", level: 2 },
  { id: "extraction", title: "Extraction Process", level: 2 },
  { id: "renderer", title: "Renderer Architecture", level: 2 },
  { id: "role-based", title: "Role-Based Navigation", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function SidebarRefactorContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        {/* Section 1: Context */}
        <SectionHeader number="01" title="Context & Discovery" id="context" />

        <p className="text-muted-foreground mb-6">
          Code Review #3 (Architecture Review) revealed that our sidebar component had grown to
          ~430 lines of inline navigation data mixed with rendering logic. Every menu item, icon
          import, href, and nested child was hardcoded directly in the JSX. What started as a
          simple sidebar had become the most-edited file in the entire codebase.
        </p>

        <MetricsGrid
          metrics={[
            { label: "Sidebar Lines", value: "430", change: "inline data", positive: false },
            { label: "Icon Imports", value: "26", change: "in one file", positive: false },
            { label: "Merge Conflicts", value: "8", change: "/month", positive: false },
            { label: "Time to Add Page", value: "15min", change: "error-prone", positive: false },
          ]}
        />

        <InfoBox type="important" title="Architecture Smell">
          When the most frequently edited file in your project is a UI component rather than a data
          file, it signals that data and presentation are improperly coupled. Navigation structure
          is data -- it should live in a data file, not in JSX.
        </InfoBox>

        {/* Section 2: Problem */}
        <SectionHeader number="02" title="Problem Analysis" id="problem-analysis" />

        <ComparisonCards
          leftTitle="Symptoms"
          rightTitle="Root Causes"
          leftItems={caseStudy.problem.issues}
          rightItems={[
            "Data (nav items) mixed with presentation (JSX)",
            "No separation of concerns",
            "No type safety on nav structure",
            "No single source of truth for routes",
            "Icon imports coupled to component",
          ]}
        />

        <CodeBlock
          filename="BEFORE: components/sidebar.tsx (430 lines)"
          language="tsx"
          code={`// 26 icon imports at the top
import { Home, Settings, Users, FileText, Shield, Mail, 
  Database, Code, Layers, GitBranch, /* ...16 more */ } from "lucide-react"

export function Sidebar() {
  return (
    <nav>
      {/* 400+ lines of inline nav items */}
      <CollapsibleSection title="Documentation">
        <NavItem href="/docs/overview" icon={<FileText />}>
          Strategic Overview
        </NavItem>
        <NavItem href="/docs/cms" icon={<Database />}>
          CMS Reference
        </NavItem>
        {/* ...50+ more items, each hardcoded */}
      </CollapsibleSection>
      
      <CollapsibleSection title="Management">
        {/* ...another 100 lines of items */}
      </CollapsibleSection>
    </nav>
  )
}`}
        />

        {/* Section 3: Data Model */}
        <SectionHeader number="03" title="Data Model Design" id="data-model" />

        <p className="text-muted-foreground mb-6">
          The first step was designing a typed data model that could represent the full navigation
          hierarchy: groups, sections, items, and nested children. This model became the single
          source of truth -- the sidebar component would simply render whatever the data described.
        </p>

        <CodeBlock
          filename="data/nav-data.ts (type definitions)"
          language="typescript"
          code={`export interface NavItem {
  title: string
  href: string
  icon?: LucideIcon
  badge?: string
  children?: NavItem[]
}

export interface NavSection {
  id: string
  title: string
  icon: LucideIcon
  items: NavItem[]
  defaultOpen?: boolean
  role?: "strategic" | "developer" | "devops" | "all"
}

export interface NavGroup {
  label: string
  sections: NavSection[]
}

// All navigation defined in one place
export const navigationGroups: NavGroup[] = [
  {
    label: "MANAGEMENT",
    sections: [adminSection, documentAdministrationSection, /* ... */],
  },
  {
    label: "DOCUMENTATION",
    sections: [strategicSection, cmsSection, appSection, infraSection],
  },
  {
    label: "LEARN & GROW",
    sections: [contentLibrarySection, learningHubSection],
  },
]`}
        />

        <DataFlowDiagram
          title="Data Flow: Single Source of Truth"
          nodes={[
            { label: "nav-data.ts", description: "Define structure" },
            { label: "NavSection[]", description: "Typed data" },
            { label: "docs-sidebar.tsx", description: "Render data" },
            { label: "NavCollapsible", description: "UI component" },
            { label: "User Screen", description: "Final output" },
          ]}
        />

        <FileTree
          title="After: File Architecture"
          items={[
            {
              name: "data",
              type: "folder" as const,
              children: [
                { name: "nav-data.ts", type: "file" as const, highlight: true },
              ],
            },
            {
              name: "components/molecules",
              type: "folder" as const,
              children: [
                { name: "docs-sidebar.tsx", type: "file" as const, highlight: true },
                { name: "nav-collapsible.tsx", type: "file" as const },
              ],
            },
          ]}
        />

        {/* Section 4: Extraction */}
        <SectionHeader number="04" title="Extraction Process" id="extraction" />

        <VerticalFlow
          title="Refactoring Steps"
          steps={[
            { title: "Step 1: Define Types", description: "Created NavItem, NavSection, NavGroup interfaces with full type safety" },
            { title: "Step 2: Extract Data", description: "Moved all 26 sections with their items into nav-data.ts as typed constants" },
            { title: "Step 3: Create Renderer", description: "Built NavCollapsible component that renders any NavSection generically" },
            { title: "Step 4: Wire Up", description: "Sidebar now maps over navigationGroups and renders NavCollapsible for each section" },
            { title: "Step 5: Add Role Filter", description: "Each NavSection has optional role field. Sidebar filters by current user role." },
            { title: "Step 6: Verify", description: "Every existing route still accessible. No broken links. Full regression test." },
          ]}
        />

        {/* Section 5: Renderer */}
        <SectionHeader number="05" title="Renderer Architecture" id="renderer" />

        <CodeBlock
          filename="components/molecules/docs-sidebar.tsx (after)"
          language="tsx"
          code={`import { navigationGroups } from "@/data/nav-data"
import { NavCollapsible } from "./nav-collapsible"

export function DocsSidebar() {
  return (
    <nav className="space-y-6">
      {navigationGroups.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {group.label}
          </p>
          {group.sections.map((section) => (
            <NavCollapsible key={section.id} section={section} />
          ))}
        </div>
      ))}
    </nav>
  )
}
// Total: ~40 lines. Zero hardcoded nav items.`}
        />

        <BeforeAfterComparison
          beforeTitle="Before: Monolithic"
          afterTitle="After: Data-Driven"
          beforeItems={[
            "430 lines in one component file",
            "26 icon imports in sidebar",
            "Every nav item hardcoded in JSX",
            "Adding a page = editing sidebar component",
            "Merge conflicts on every nav change",
          ]}
          afterItems={[
            "40-line renderer + 200-line data file",
            "Icons imported where data is defined",
            "Nav items are typed data objects",
            "Adding a page = adding object to array",
            "Data file rarely conflicts (append-only)",
          ]}
        />

        {/* Section 6: Role-Based */}
        <SectionHeader number="06" title="Role-Based Navigation" id="role-based" />

        <p className="text-muted-foreground mb-6">
          With the data model in place, adding role-based filtering was trivial. Each NavSection
          has an optional <code className="text-accent">role</code> field. The renderer filters
          sections based on the current user&apos;s role, so each persona sees only their relevant content.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Users />,
              title: "CTO / Project Lead",
              description: "Sees: Strategic Overview, Business metrics, Cost analysis. Hidden: Low-level implementation details.",
            },
            {
              icon: <ArticleIcons.Code />,
              title: "Developer / Architect",
              description: "Sees: CMS Reference, App Reference, code examples. Hidden: Business strategy pages.",
            },
            {
              icon: <ArticleIcons.Database />,
              title: "DevOps / QA",
              description: "Sees: Infrastructure & Ops, deployment guides, testing. Hidden: CMS content management.",
            },
            {
              icon: <ArticleIcons.Star />,
              title: "All Roles",
              description: "Sees: Learning Hub, Content Library, Admin tools. These are shared across all personas.",
            },
          ]}
        />

        <StatsTable
          title="Navigation Sections by Role"
          headers={["Section", "CTO/PL", "Developer", "DevOps", "All"]}
          rows={[
            ["Strategic Overview (5 items)", "Yes", "No", "No", "No"],
            ["CMS Reference (7 items)", "No", "Yes", "No", "No"],
            ["App Reference (8 items)", "No", "Yes", "No", "No"],
            ["Infrastructure & Ops (6 items)", "No", "No", "Yes", "No"],
            ["Management (6 sections)", "Yes", "Yes", "Yes", "Yes"],
            ["Learning Hub", "Yes", "Yes", "Yes", "Yes"],
          ]}
        />

        {/* Section 7: Results */}
        <SectionHeader number="07" title="Results & Metrics" id="results" />

        <MetricsGrid
          metrics={caseStudy.results.metrics.map(m => ({
            label: m.label,
            value: m.after,
            change: m.improvement,
            positive: true,
          }))}
        />

        <NumberedList
          title="Quality Improvements"
          items={[
            { title: "Zero merge conflicts", description: "Data file is append-only. Multiple developers can add pages simultaneously." },
            { title: "Type-safe navigation", description: "TypeScript catches broken links, missing icons, and invalid hrefs at compile time." },
            { title: "30-second page additions", description: "Adding a new page means adding one object to an array. No component editing needed." },
            { title: "Role-based filtering", description: "Each persona sees only relevant content. Reduces cognitive load by ~60%." },
            { title: "Testable structure", description: "Navigation data can be validated programmatically -- check all hrefs resolve to real pages." },
          ]}
        />

        {/* Takeaway */}
        <SectionHeader number="08" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          {caseStudy.keyTakeaway}
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { title: "Atomic Design in Next.js", href: "/dashboard/content-library/articles/atomic-design-nextjs", level: "Intermediate" },
            { title: "Refactoring for Maintainability", href: "/dashboard/content-library/articles/refactoring-for-maintainability", level: "Intermediate" },
            { title: "Documentation Evolution", href: "/dashboard/content-library/case-studies/documentation-evolution", level: "Advanced" },
          ]}
        />
      </article>

      {/* TOC Sidebar */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  )
}
