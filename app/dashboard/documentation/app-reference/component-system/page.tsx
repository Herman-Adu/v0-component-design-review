"use client"

import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { STATS, COMPONENT_COUNTS } from "@/data/doc-manifest"
import {
  LayoutGrid,
  ArrowRight,
  Layers,
  Box,
  Shield,
  Sparkles,
  BookOpen,
  FileText,
  Share2,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Component Data -- accurate to codebase audit                       */
/* ------------------------------------------------------------------ */

const atoms = [
  { name: "FormInput", file: "form-input.tsx", desc: "Text input with label, error, and validation states", usedBy: 6 },
  { name: "FormSelect", file: "form-select.tsx", desc: "Dropdown select with option groups", usedBy: 4 },
  { name: "FormTextarea", file: "form-textarea.tsx", desc: "Multi-line text input with character count", usedBy: 3 },
  { name: "FormCheckbox", file: "form-checkbox.tsx", desc: "Checkbox with label and indeterminate state", usedBy: 2 },
  { name: "RadioGroup", file: "radio-group.tsx", desc: "Radio button group with horizontal/vertical layout", usedBy: 3 },
  { name: "DatePicker", file: "date-picker.tsx", desc: "Calendar date picker with range support", usedBy: 2 },
  { name: "ThemeToggle", file: "theme-toggle.tsx", desc: "Dark/light mode switcher with system detection", usedBy: 1 },
  { name: "CodeBlock", file: "code-block.tsx", desc: "Syntax-highlighted code with copy button", usedBy: 28 },
  { name: "Callout", file: "callout.tsx", desc: "Contextual alert with info/warning/error/success variants", usedBy: 35 },
  { name: "Spoiler", file: "spoiler.tsx", desc: "Collapsible content block for optional detail", usedBy: 22 },
]

const molecules = [
  { name: "FormNavigation", file: "form-navigation.tsx", desc: "Previous/Next step controls for multi-step forms", usedBy: 3 },
  { name: "FormProgressIndicator", file: "form-progress-indicator.tsx", desc: "Visual step progress bar with labels", usedBy: 3 },
  { name: "FormStepContainer", file: "form-step-container.tsx", desc: "Wrapper for individual form steps with animation", usedBy: 5 },
  { name: "StepIndicator", file: "step-indicator.tsx", desc: "Numbered step indicator with active/complete states", usedBy: 3 },
  { name: "Navbar", file: "navbar.tsx", desc: "Responsive navigation bar with mobile menu", usedBy: 1 },
  { name: "DocsSidebar", file: "docs-sidebar.tsx", desc: "Collapsible documentation sidebar with nested navigation", usedBy: 1 },
  { name: "SidebarSkeleton", file: "sidebar-skeleton.tsx", desc: "Hydration-safe skeleton replacing sidebar during SSR", usedBy: 1 },
  { name: "ContentCard", file: "content-card.tsx", desc: "Article/tutorial/case-study card with metadata and copy", usedBy: 3 },
  { name: "ArticleComponents", file: "article-components.tsx", desc: `${COMPONENT_COUNTS.articleSubComponents.count} article building blocks (TOC, SectionHeader, KeyTakeaway, etc.)`, usedBy: 32 },
  { name: "ContactSuccessMessage", file: "contact-success-message.tsx", desc: "Contact form submission confirmation", usedBy: 1 },
  { name: "QuotationSuccessMessage", file: "quotation-success-message.tsx", desc: "Quote form submission confirmation", usedBy: 1 },
  { name: "LocationMapCard", file: "location-map-card.tsx", desc: "Map embed with office location", usedBy: 1 },
  { name: "OfficeHoursCard", file: "office-hours-card.tsx", desc: "Business hours display card", usedBy: 1 },
  { name: "QuickContactCard", file: "quick-contact-card.tsx", desc: "Phone/email quick-action card", usedBy: 1 },
]

const organisms = [
  { name: "MultiStepFormContainer", file: "multi-step-form-container.tsx", desc: "Root container orchestrating the 5-step service request wizard", usedBy: 1 },
  { name: "MultiStepFormWrapper", file: "multi-step-form-wrapper.tsx", desc: "Layout wrapper with progress bar and step transitions", usedBy: 1 },
  { name: "PersonalInfoStep", file: "personal-info-step.tsx", desc: "Step 1: Name, email, phone, address collection", usedBy: 1 },
  { name: "ServiceDetailsStep", file: "service-details-step.tsx", desc: "Step 2: Service type, description, urgency", usedBy: 1 },
  { name: "PropertyInfoStep", file: "property-info-step.tsx", desc: "Step 3: Property type, size, access details", usedBy: 1 },
  { name: "ScheduleStep", file: "schedule-step.tsx", desc: "Step 4: Date picker, time preferences", usedBy: 1 },
  { name: "ReviewStep", file: "review-step.tsx", desc: "Step 5: Full summary with edit-back navigation", usedBy: 1 },
  { name: "ReviewStepDisplay", file: "review-step-display.tsx", desc: "Read-only display for review data sections", usedBy: 1 },
  { name: "ContactFormContainer", file: "contact-form-container.tsx", desc: "5-step contact form wizard with inquiry routing", usedBy: 1 },
  { name: "QuotationFormContainer", file: "quotation-form-container.tsx", desc: "Multi-section quotation request form", usedBy: 1 },
]

const contactSteps = [
  { name: "InquiryTypeStep", file: "inquiry-type-step.tsx", desc: "Step 1: Select inquiry category (general, support, sales)", usedBy: 1 },
  { name: "ContactInfoStep", file: "contact-info-step.tsx", desc: "Step 2: Name, email, phone details", usedBy: 1 },
  { name: "MessageDetailsStep", file: "message-details-step.tsx", desc: "Step 3: Subject, message body, attachments", usedBy: 1 },
  { name: "ReferenceLinkingStep", file: "reference-linking-step.tsx", desc: "Step 4: Link to related services or prior requests", usedBy: 1 },
  { name: "ContactReviewStep", file: "contact-review-step.tsx", desc: "Step 5: Final review and submit", usedBy: 1 },
]

const sharedSteps = [
  { name: "AddressInfoStep", file: "address-info-step.tsx", desc: "Reusable address collection step (service + quotation forms)", usedBy: 2 },
  { name: "SharedContactInfoStep", file: "contact-info-step.tsx", desc: "Reusable contact info step shared across form types", usedBy: 2 },
  { name: "SharedScheduleStep", file: "schedule-step.tsx", desc: "Reusable scheduling step with date/time pickers", usedBy: 2 },
]

const animations = [
  { name: "ElectricBorder", file: "electric-border.tsx", desc: "Animated electric pulse border effect for cards", usedBy: 2 },
  { name: "ElectricCurrent", file: "electric-current.tsx", desc: "Flowing current animation for hero sections", usedBy: 1 },
  { name: "LightBulb", file: "light-bulb.tsx", desc: "Animated light bulb with glow effect", usedBy: 1 },
  { name: "LightningArc", file: "lightning-arc.tsx", desc: "SVG lightning arc between two points", usedBy: 1 },
  { name: "PowerSurge", file: "power-surge.tsx", desc: "Power surge pulse animation", usedBy: 1 },
  { name: "PulseCircle", file: "pulse-circle.tsx", desc: "Radiating pulse circle animation", usedBy: 1 },
  { name: "SparkEffect", file: "spark-effect.tsx", desc: "Particle spark burst on hover/click", usedBy: 2 },
]

const articleSubComponents = [
  { name: "TableOfContents", desc: "Sticky right sidebar with IntersectionObserver-based active tracking" },
  { name: "SectionHeader", desc: "Numbered section heading with anchor ID for TOC navigation" },
  { name: "SubSectionHeader", desc: "Nested sub-section heading with optional anchor ID" },
  { name: "InfoBox", desc: "Contextual info/warning/tip/danger box with icon variants" },
  { name: "StepFlow", desc: "Numbered step sequence with title and description per step" },
  { name: "VerticalFlow", desc: "Vertical flow diagram connecting sequential items" },
  { name: "ComparisonCards", desc: "Side-by-side comparison grid with good/bad/neutral variants" },
  { name: "BeforeAfterComparison", desc: "Two-column before/after code comparison with labels" },
  { name: "CodeBlock", desc: "Article-specific syntax-highlighted code block with filename header" },
  { name: "FileTree", desc: "Directory tree visualization with folder/file icons" },
  { name: "ArchitectureDiagram", desc: "Layered architecture visualization with labeled blocks" },
  { name: "FeatureGrid", desc: "Grid of feature cards with icons and descriptions" },
  { name: "MetricsGrid", desc: "Stats display grid with values, labels, and change indicators" },
  { name: "DataFlowDiagram", desc: "Arrow-connected data flow between labeled stages" },
  { name: "DecisionTree", desc: "Yes/No decision tree visualization for architecture choices" },
  { name: "KeyTakeaway", desc: "Highlighted key insight card used at article end" },
  { name: "RelatedArticles", desc: "Card grid linking to related content across the library" },
  { name: "StatsTable", desc: "Tabular statistics with labels, values, and change indicators" },
  { name: "NumberedList", desc: "Styled numbered list with consistent formatting" },
  { name: "ProcessFlow", desc: "Horizontal process flow diagram with connected stages" },
  { name: "SideBySideComparison", desc: "Two-column prose comparison with heading labels" },
  { name: "FileTreeDiagram", desc: "Enhanced file tree with syntax-highlighted filenames" },
  { name: "MetricCard", desc: "Individual stat card with label, value, and description" },
]

const hooks = [
  { name: "useHydration", file: "use-hydration.tsx", desc: "Returns false during SSR, true after hydration -- guards Radix-based components", usedBy: 1 },
  { name: "useMobile", file: "use-mobile.ts", desc: "Responsive breakpoint hook for mobile detection", usedBy: 2 },
  { name: "useToast", file: "use-toast.ts", desc: "Toast notification state management", usedBy: 4 },
]

/* ------------------------------------------------------------------ */
/*  Reusable table                                                     */
/* ------------------------------------------------------------------ */

function ComponentTable({ items }: { items: { name: string; file: string; desc: string; usedBy: number }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 font-semibold text-foreground">Component</th>
            <th className="text-left py-2 pr-4 font-semibold text-foreground">File</th>
            <th className="text-left py-2 pr-4 font-semibold text-foreground">Description</th>
            <th className="text-right py-2 font-semibold text-foreground">Reuse</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-b border-border/50">
              <td className="py-2.5 pr-4 font-mono text-accent text-xs">{item.name}</td>
              <td className="py-2.5 pr-4 font-mono text-muted-foreground text-xs">{item.file}</td>
              <td className="py-2.5 pr-4 text-muted-foreground">{item.desc}</td>
              <td className="py-2.5 text-right font-medium text-foreground">{item.usedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SimpleTable({ items }: { items: { name: string; desc: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 pr-4 font-semibold text-foreground">Component</th>
            <th className="text-left py-2 font-semibold text-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.name} className="border-b border-border/50">
              <td className="py-2.5 pr-4 font-mono text-accent text-xs whitespace-nowrap">{item.name}</td>
              <td className="py-2.5 text-muted-foreground">{item.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const SECTIONS = [
  { id: "system-glance", title: "System at a Glance" },
  { id: "component-hierarchy", title: "Component Hierarchy" },
  { id: "component-catalog", title: "Component Catalog" },
  { id: "article-sub-components", title: "Article Sub-Components (23)" },
  { id: "architecture-patterns", title: "Architecture Patterns" },
  { id: "content-library-arch", title: "Content Library Architecture" },
  { id: "directory-structure", title: "Directory Structure" },
  { id: "related-docs", title: "Related Documentation" },
]

export default function ComponentSystemPage() {
  return (
    <DocPage
      title="Component System"
      description="Atomic design implementation with 52 custom components across 7 categories, 23 article sub-components, 32 content pages, and 30+ shadcn/ui primitives. Every component follows a strict hierarchy ensuring maximum reuse and zero duplication."
      icon={LayoutGrid}
      badges={[{ label: "Core Architecture", color: "blue" }]}
      tags={["10 Atoms", "14 Molecules", "18 Organisms", "7 Animations", "3 Hooks", "23 Article Sub-Components"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      <Callout type="info" title="Atomic Design Methodology">
        {"This codebase follows Brad Frost's Atomic Design principles with two domain-specific extensions: an Animations layer for branded Framer Motion effects, and a Content Library system with 23 composable article building blocks. Atoms compose into Molecules, Molecules into Organisms -- and shared steps are reused across multiple form wizards via the shared-steps pattern."}
      </Callout>

      {/* System Stats */}
      <section className="space-y-6">
        <DocSectionHeader id="system-glance">System at a Glance</DocSectionHeader>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Custom Components", value: String(STATS.frontend.components.total), detail: "Across 7 categories", color: "text-accent" },
            { label: "Article Sub-Components", value: String(COMPONENT_COUNTS.articleSubComponents.count), detail: "Inside article-components.tsx", color: "text-blue-400" },
            { label: "Content Pages", value: String(STATS.frontend.contentPages.total), detail: `${STATS.frontend.contentPages.articles} articles + ${STATS.frontend.contentPages.caseStudies} case studies`, color: "text-green-400" },
            { label: "Framer Motion Files", value: String(STATS.frontend.framerMotionFiles), detail: "Animated across the app", color: "text-purple-400" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Component Hierarchy Diagram */}
      <section className="space-y-6">
        <DocSectionHeader id="component-hierarchy">Component Hierarchy</DocSectionHeader>
        <div className="space-y-3">
          {[
            {
              level: "Organisms",
              count: 18,
              color: "border-purple-500/30 bg-purple-500/5",
              labelColor: "text-purple-400",
              items: ["MultiStepFormContainer", "ContactFormContainer", "QuotationFormContainer", `${COMPONENT_COUNTS.organisms.count} Service Steps`, `${COMPONENT_COUNTS.contactSteps.count} Contact Steps`, `${COMPONENT_COUNTS.sharedSteps.count} Shared Steps`],
            },
            {
              level: "Molecules",
              count: 14,
              color: "border-blue-500/30 bg-blue-500/5",
              labelColor: "text-blue-400",
              items: ["DocsSidebar", "SidebarSkeleton", "ArticleComponents (x23)", "ContentCard", "FormNavigation", "FormProgressIndicator", "Navbar"],
            },
            {
              level: "Atoms",
              count: 10,
              color: "border-green-500/30 bg-green-500/5",
              labelColor: "text-green-400",
              items: ["FormInput", "FormSelect", "FormTextarea", "FormCheckbox", "RadioGroup", "DatePicker", "CodeBlock", "Callout", "Spoiler", "ThemeToggle"],
            },
            {
              level: "Animations",
              count: 7,
              color: "border-orange-500/30 bg-orange-500/5",
              labelColor: "text-orange-400",
              items: ["ElectricBorder", "ElectricCurrent", "LightBulb", "LightningArc", "PowerSurge", "PulseCircle", "SparkEffect"],
            },
            {
              level: "Hooks",
              count: 3,
              color: "border-amber-500/30 bg-amber-500/5",
              labelColor: "text-amber-400",
              items: ["useHydration (guard)", "useMobile (responsive)", "useToast (notifications)"],
            },
          ].map((layer) => (
            <div key={layer.level} className={`rounded-lg border p-4 ${layer.color}`}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <span className={`text-sm font-bold uppercase tracking-wider min-w-[120px] shrink-0 ${layer.labelColor}`}>
                  {layer.level} ({layer.count})
                </span>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span key={item} className="text-xs px-2.5 py-1 rounded-md bg-background/60 text-foreground border border-border/50">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tabbed Component Catalog */}
      <section className="space-y-6">
        <DocSectionHeader id="component-catalog">Component Catalog</DocSectionHeader>

        <Tabs defaultValue="atoms" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="atoms">Atoms</TabsTrigger>
            <TabsTrigger value="molecules">Molecules</TabsTrigger>
            <TabsTrigger value="organisms">Organisms</TabsTrigger>
            <TabsTrigger value="contact">Contact Steps</TabsTrigger>
            <TabsTrigger value="shared">Shared Steps</TabsTrigger>
            <TabsTrigger value="animations">Animations</TabsTrigger>
            <TabsTrigger value="hooks">Hooks</TabsTrigger>
          </TabsList>

          <TabsContent value="atoms" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Box className="h-5 w-5 text-green-500" />
                  {"Atoms -- 10 Components"}
                </CardTitle>
                <CardDescription>
                  {"The smallest building blocks. Each atom is a single-responsibility UI element. Located in "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"components/atoms/"}</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComponentTable items={atoms} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="molecules" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-500" />
                  {"Molecules -- 14 Components"}
                </CardTitle>
                <CardDescription>
                  {"Functional compositions of atoms. ArticleComponents alone exports 23 sub-components used across all 32 content pages. Located in "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"components/molecules/"}</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComponentTable items={molecules} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="organisms" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-purple-500" />
                  {"Organisms -- 10 Core Components"}
                </CardTitle>
                <CardDescription>
                  {"Complete features composed of molecules. Includes the 3 form wizards (Service Request, Contact, Quotation) and the 5 service request steps. Located in "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"components/organisms/"}</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComponentTable items={organisms} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-cyan-500" />
                  {"Contact Form Steps -- 5 Components"}
                </CardTitle>
                <CardDescription>
                  {"The 5-step contact form wizard. Located in "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"components/organisms/contact-steps/"}</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComponentTable items={contactSteps} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="shared" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-emerald-500" />
                  {"Shared Form Steps -- 3 Components"}
                </CardTitle>
                <CardDescription>
                  {"Reusable form steps shared across Service Request and Quotation wizards. This is the DRY principle in action -- identical steps are extracted once and used in multiple forms. Located in "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"components/organisms/shared-steps/"}</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComponentTable items={sharedSteps} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="animations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-500" />
                  {"Animations -- 7 Components"}
                </CardTitle>
                <CardDescription>
                  {"Branded Framer Motion animation components for the electrical services theme. Located in "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"components/animations/"}</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComponentTable items={animations} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hooks" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-500" />
                  {"Custom Hooks -- 3 Hooks"}
                </CardTitle>
                <CardDescription>
                  {"Reusable stateful logic. The useHydration hook is the foundation of the guard architecture. Located in "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"hooks/"}</code>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ComponentTable items={hooks} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Article Sub-Components Deep Dive */}
      <section className="space-y-6">
        <DocSectionHeader id="article-sub-components">Article Sub-Components (23)</DocSectionHeader>
        <p className="text-muted-foreground">
          {"The "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"article-components.tsx"}</code>
          {" file exports 23 composable building blocks used across all 28 articles and 14 case studies. These are the content library's equivalent of a design system -- every article uses the same visual vocabulary for consistency."}
        </p>

        <Tabs defaultValue="layout" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="layout">{"Layout & Navigation (6)"}</TabsTrigger>
            <TabsTrigger value="content">Content Blocks (11)</TabsTrigger>
            <TabsTrigger value="data">Data Visualization (6)</TabsTrigger>
          </TabsList>

          <TabsContent value="layout" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <SimpleTable items={articleSubComponents.slice(0, 6)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <SimpleTable items={articleSubComponents.slice(6, 17)} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <SimpleTable items={articleSubComponents.slice(17)} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Spoiler title="Example: How an article page composes sub-components">
          <CodeBlock
            language="tsx"
            code={`// components/articles/guard-pattern-article.tsx
import {
  TableOfContents,
  SectionHeader,
  InfoBox,
  CodeBlock,
  BeforeAfterComparison,
  StepFlow,
  KeyTakeaway,
  RelatedArticles,
} from "@/components/molecules/article-components"

const tocItems = [
  { id: "reactive-cost", title: "The Cost of Reactive Bug Fixing", level: 2 },
  { id: "guard-fundamentals", title: "Guard Pattern Fundamentals", level: 2 },
  // ...
]

export function GuardPatternArticle() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-8">
      <article className="space-y-8">
        <SectionHeader number="01" title="The Cost..." id="reactive-cost" />
        <InfoBox type="warning" title="Why This Matters">
          Hydration mismatches silently break accessibility...
        </InfoBox>
        <BeforeAfterComparison
          before={{ title: "Without Guard", code: "// Random ID mismatch" }}
          after={{ title: "With Guard", code: "// Deterministic render" }}
        />
        <KeyTakeaway>Build guards in from the start.</KeyTakeaway>
      </article>
      <TableOfContents items={tocItems} />
    </div>
  )
}`}
          />
        </Spoiler>
      </section>

      {/* Key Architecture Patterns */}
      <section className="space-y-6">
        <DocSectionHeader id="architecture-patterns">Architecture Patterns</DocSectionHeader>

        <div className="responsive-grid-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Multi-Step Form Composition</CardTitle>
              <CardDescription>How the 5-step service request wizard composes 15+ components</CardDescription>
            </CardHeader>
            <CardContent>
              <Spoiler title="Full Composition Tree">
                <CodeBlock
                  language="text"
                  code={`MultiStepFormContainer (Organism)
  |-- FormProgressIndicator (Molecule)
  |     +-- StepIndicator (Molecule) x5
  |-- FormStepContainer (Molecule)
  |     |-- PersonalInfoStep (Organism)
  |     |     |-- FormInput (Atom) x4
  |     |     +-- FormSelect (Atom) x1
  |     |-- ServiceDetailsStep (Organism)
  |     |     |-- RadioGroup (Atom)
  |     |     |-- FormTextarea (Atom)
  |     |     +-- FormSelect (Atom) x2
  |     |-- PropertyInfoStep (Organism)
  |     |     |-- FormInput (Atom) x3
  |     |     +-- FormCheckbox (Atom) x2
  |     |-- ScheduleStep (Organism)
  |     |     |-- DatePicker (Atom)
  |     |     +-- RadioGroup (Atom)
  |     +-- ReviewStep (Organism)
  |           +-- ReviewStepDisplay (Organism)
  +-- FormNavigation (Molecule)
        +-- Button (shadcn/ui) x2`}
                />
              </Spoiler>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Shared Step Pattern</CardTitle>
              <CardDescription>DRY architecture: identical steps reused across form wizards</CardDescription>
            </CardHeader>
            <CardContent>
              <Spoiler title="Step Reuse Architecture">
                <CodeBlock
                  language="text"
                  code={`components/organisms/shared-steps/
  |-- address-info-step.tsx   --> Used by:
  |                                 Service Request (Step 1)
  |                                 Quotation Form (Step 2)
  |
  |-- contact-info-step.tsx   --> Used by:
  |                                 Service Request (Step 1)
  |                                 Quotation Form (Step 1)
  |
  +-- schedule-step.tsx       --> Used by:
                                    Service Request (Step 4)
                                    Quotation Form (Step 4)

Result: 3 components serve 2 forms = 50% code saved`}
                />
              </Spoiler>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hydration Guard Pattern</CardTitle>
              <CardDescription>How SSR/client ID mismatches are prevented at the architecture level</CardDescription>
            </CardHeader>
            <CardContent>
              <Spoiler title="Guard Architecture">
                <CodeBlock
                  language="text"
                  code={`DocsSidebar (Molecule)
  |-- useHydration() -> false during SSR
  |     +-- Returns <SidebarSkeleton />
  |           (no Radix = no random IDs = no mismatch)
  |
  |-- useHydration() -> true after mount
  |     +-- Returns real <Sidebar /> with Radix
  |           |-- Collapsible (Radix)
  |           |     +-- aria-controls now matches
  |           +-- CollapsibleContent (Radix)
  |                 +-- id now matches`}
                />
              </Spoiler>
              <div className="mt-3">
                <Link href="/dashboard/documentation/app-reference/hydration-and-guards" className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
                  {"Deep-dive into Hydration & Guards"} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Content Library Pattern</CardTitle>
              <CardDescription>How 32 content pages share 23 composable article blocks</CardDescription>
            </CardHeader>
            <CardContent>
              <Spoiler title="Content Composition">
                <CodeBlock
                  language="text"
                  code={`Content Page (e.g. guard-pattern-article.tsx)
  |-- TableOfContents          <- Layout
  |-- SectionHeader x7         <- Navigation anchors
  |-- InfoBox (warning/tip)    <- Contextual callouts
  |-- CodeBlock                <- Syntax-highlighted code
  |-- BeforeAfterComparison    <- Visual diff
  |-- StepFlow                 <- Process explanation
  |-- MetricsGrid              <- Data visualization
  |-- DecisionTree             <- Architecture choice
  |-- RelatedArticles          <- Cross-linking
  +-- KeyTakeaway              <- Closing insight

23 blocks x 32 pages = consistent visual language`}
                />
              </Spoiler>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Content Library Architecture */}
      <section className="space-y-6">
        <DocSectionHeader id="content-library-arch">Content Library Architecture</DocSectionHeader>

        <div className="responsive-grid-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-base">28 Articles</CardTitle>
              </div>
              <CardDescription>In-depth technical articles across 7 categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {["Architecture", "Performance", "Security", "Forms", "State", "DevOps", "UI/UX"].map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {"Located in "}<code className="bg-muted px-1 py-0.5 rounded">{"components/articles/"}</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                <CardTitle className="text-base">14 Case Studies</CardTitle>
              </div>
              <CardDescription>Real-world problem-solution-result analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {["Migration", "Performance", "Security", "Architecture", "DevOps"].map((cat) => (
                  <Badge key={cat} variant="outline" className="text-xs">{cat}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {"Located in "}<code className="bg-muted px-1 py-0.5 rounded">{"components/case-studies/"}</code>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-base">Data-Driven Tutorials</CardTitle>
              </div>
              <CardDescription>13 tutorials rendered from TypeScript data files</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {["Beginner", "Intermediate", "Advanced"].map((lvl) => (
                  <Badge key={lvl} variant="outline" className="text-xs">{lvl}</Badge>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {"Data in "}<code className="bg-muted px-1 py-0.5 rounded">{"data/content-library/tutorials.tsx"}</code>
              </p>
            </CardContent>
          </Card>
        </div>

        <Callout type="info" title="Frontend-to-Backend Mapping">
          {"Every content type has a corresponding Strapi Collection Type documented in the "}
          <a href="/dashboard/documentation/cms-reference/content-collections" className="underline font-medium">Backend Content Collections</a>
          {" page. The TypeScript interfaces in "}
          <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"data/content-library/"}</code>
          {" map 1:1 to the Strapi JSON schemas."}
        </Callout>
      </section>

      {/* File Structure */}
      <section className="space-y-6">
        <DocSectionHeader id="directory-structure">Directory Structure</DocSectionHeader>

        <Spoiler title="Complete component file tree">
          <CodeBlock
            language="text"
            code={`components/
  |-- atoms/                     # 10 atomic UI elements
  |     |-- form-input.tsx
  |     |-- form-select.tsx
  |     |-- form-textarea.tsx
  |     |-- form-checkbox.tsx
  |     |-- radio-group.tsx
  |     |-- date-picker.tsx
  |     |-- theme-toggle.tsx
  |     |-- code-block.tsx
  |     |-- callout.tsx
  |     +-- spoiler.tsx
  |
  |-- molecules/                 # 14 composed elements
  |     |-- form-navigation.tsx
  |     |-- form-progress-indicator.tsx
  |     |-- form-step-container.tsx
  |     |-- step-indicator.tsx
  |     |-- navbar.tsx
  |     |-- docs-sidebar.tsx         # uses useHydration guard
  |     |-- sidebar-skeleton.tsx     # SSR-safe placeholder
  |     |-- content-card.tsx
  |     |-- article-components.tsx   # 23 sub-components
  |     |-- contact-success-message.tsx
  |     |-- quotation-success-message.tsx
  |     |-- location-map-card.tsx
  |     |-- office-hours-card.tsx
  |     +-- quick-contact-card.tsx
  |
  |-- organisms/                 # 10 + 5 + 3 feature units
  |     |-- multi-step-form-container.tsx
  |     |-- multi-step-form-wrapper.tsx
  |     |-- personal-info-step.tsx
  |     |-- service-details-step.tsx
  |     |-- property-info-step.tsx
  |     |-- schedule-step.tsx
  |     |-- review-step.tsx
  |     |-- review-step-display.tsx
  |     |-- contact-form-container.tsx
  |     |-- quotation-form-container.tsx
  |     |-- contact-steps/           # 5 contact form steps
  |     |     |-- inquiry-type-step.tsx
  |     |     |-- contact-info-step.tsx
  |     |     |-- message-details-step.tsx
  |     |     |-- reference-linking-step.tsx
  |     |     +-- contact-review-step.tsx
  |     +-- shared-steps/            # 3 DRY reusable steps
  |           |-- address-info-step.tsx
  |           |-- contact-info-step.tsx
  |           +-- schedule-step.tsx
  |
  |-- animations/                # 7 branded Framer Motion
  |     |-- electric-border.tsx
  |     |-- electric-current.tsx
  |     |-- light-bulb.tsx
  |     |-- lightning-arc.tsx
  |     |-- power-surge.tsx
  |     |-- pulse-circle.tsx
  |     +-- spark-effect.tsx
  |
  |-- articles/                  # 28 article pages
  +-- case-studies/              # 14 case study pages

hooks/                           # 3 custom hooks
  |-- use-hydration.tsx
  |-- use-mobile.ts
  +-- use-toast.ts`}
          />
        </Spoiler>
      </section>

      {/* Related Documentation */}
      <section className="space-y-6">
        <DocSectionHeader id="related-docs">Related Documentation</DocSectionHeader>
        <div className="responsive-grid-3">
          <Link href="/dashboard/documentation/app-reference/hydration-and-guards" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-base group-hover:text-accent transition-colors">{"Hydration & Guards"}</CardTitle>
                </div>
                <CardDescription>The guard architecture preventing hydration mismatches from Radix UI components.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/dashboard/documentation/app-reference/security-architecture" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-base group-hover:text-accent transition-colors">Security Architecture</CardTitle>
                </div>
                <CardDescription>Defense-in-depth security layers protecting every form submission and API call.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/dashboard/documentation/cms-reference/shared-components" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-accent" />
                  <CardTitle className="text-base group-hover:text-accent transition-colors">Backend Components</CardTitle>
                </div>
                <CardDescription>How these frontend components map 1:1 to Strapi shared components in the backend.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>
    </DocPage>
  )
}
