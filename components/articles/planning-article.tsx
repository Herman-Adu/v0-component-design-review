"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
  FeatureGrid,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  FileTree,
  VerticalFlow,
  type TOCItem,
  ArticleIcons,
  DataFlowDiagram,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "why-planning", title: "Why Planning Matters", level: 2 },
  { id: "user-flows", title: "Mapping User Flows", level: 2 },
  { id: "tech-stack", title: "Tech Stack Decisions", level: 2 },
  { id: "component-planning", title: "Component Planning", level: 2 },
  { id: "schema-first", title: "Schema-First Design", level: 2 },
  { id: "project-structure", title: "Project Structure", level: 2 },
  { id: "time-investment", title: "Time Investment", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function PlanningArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="info">
          Before writing any code, we spent significant time planning. This upfront investment 
          prevented major rewrites, enabled code reuse, and gave the team a shared mental model 
          of the system.
        </InfoBox>

        <SectionHeader number="01" title="Why Planning Matters" id="why-planning" />

        <p className="text-muted-foreground mb-6">
          The temptation to start coding immediately is strong. But without planning, you end up 
          with inconsistent patterns, duplicate code, and painful refactoring. We call this phase 
          "Week Zero" - time invested before the first commit.
        </p>

        <MetricsGrid
          metrics={[
            { label: "Planning Time", value: "7h", change: "Week Zero", positive: true },
            { label: "Major Rewrites", value: "0", change: "Prevented", positive: true },
            { label: "Code Reuse", value: "40%", change: "Across forms", positive: true },
            { label: "Breaking Changes", value: "0", change: "Schema stability", positive: true },
          ]}
        />

        <ComparisonCards
          idealTitle="With Planning"
          notIdealTitle="Without Planning"
          idealFor={[
            "Clear component boundaries from day one",
            "Shared steps identified before implementation",
            "Type safety end-to-end (no retrofitting)",
            "Consistent patterns across the codebase",
            "New developers understand structure immediately",
          ]}
          notIdealFor={[
            "Discover shared patterns mid-implementation",
            "Refactor to extract common components",
            "Add TypeScript after JavaScript prototype",
            "Inconsistent naming and file organization",
            "Tribal knowledge required to navigate code",
          ]}
        />

        <SectionHeader number="02" title="Mapping User Flows" id="user-flows" />

        <p className="text-muted-foreground mb-4">
          We identified three core user journeys that the application needed to support. 
          Mapping these revealed shared steps and unique requirements.
        </p>

        <SubSectionHeader title="Service Request Flow (5 Steps)" />

        <StepFlow
          steps={[
            { number: 1, title: "Personal Info", description: "Name, email, phone" },
            { number: 2, title: "Service Type", description: "Category + urgency" },
            { number: 3, title: "Property", description: "Address + type" },
            { number: 4, title: "Schedule", description: "Date + time slot" },
            { number: 5, title: "Review", description: "Confirm + submit" },
          ]}
        />

        <SubSectionHeader title="Contact Form Flow (5 Steps)" />

        <StepFlow
          steps={[
            { number: 1, title: "Personal Info", description: "Name, email, phone" },
            { number: 2, title: "Inquiry Type", description: "Question category" },
            { number: 3, title: "Property", description: "Address + type" },
            { number: 4, title: "Schedule", description: "Callback preference" },
            { number: 5, title: "Review", description: "Confirm + submit" },
          ]}
        />

        <SubSectionHeader title="Quotation Request Flow (7 Steps)" />

        <StepFlow
          steps={[
            { number: 1, title: "Personal Info", description: "Name, email, phone" },
            { number: 2, title: "Project Scope", description: "Type + details" },
            { number: 3, title: "Property", description: "Address + type" },
            { number: 4, title: "Requirements", description: "Specifications" },
            { number: 5, title: "Budget", description: "Range + timeline" },
            { number: 6, title: "Schedule", description: "Site visit date" },
            { number: 7, title: "Review", description: "Confirm + submit" },
          ]}
        />

        <InfoBox type="tip" title="Pattern Discovery">
          Notice how Personal Info, Property, and Schedule appear in ALL three flows. This 
          insight led us to create shared step components that accept different Zustand stores.
        </InfoBox>

        <SectionHeader number="03" title="Tech Stack Decisions" id="tech-stack" />

        <p className="text-muted-foreground mb-4">
          Each technology choice was deliberate, solving specific problems we identified during planning.
        </p>

        <StatsTable
          title="Final Tech Stack"
          headers={["Category", "Technology", "Why We Chose It"]}
          rows={[
            ["Framework", "Next.js 16 (App Router)", "Server Components, Server Actions, built-in optimization"],
            ["Language", "TypeScript (strict mode)", "Catch errors at compile time, better DX"],
            ["Styling", "Tailwind CSS v4 + shadcn/ui", "Rapid development, consistent design tokens"],
            ["Validation", "Zod", "Single schema for types AND runtime validation"],
            ["State", "Zustand", "Simple API, persistence middleware, small bundle"],
            ["Forms", "React Hook Form", "Performance, minimal re-renders, Zod integration"],
            ["Email", "React Email + Resend", "Component-based templates, reliable delivery"],
          ]}
        />

        <SectionHeader number="04" title="Component Planning" id="component-planning" />

        <p className="text-muted-foreground mb-4">
          Before writing any components, we mapped out the entire component hierarchy using 
          Atomic Design principles. This prevented duplicate components and unclear boundaries.
        </p>

        <DataFlowDiagram
          title="Component Composition Strategy"
          nodes={[
            { label: "Atoms", description: "10 components", icon: <ArticleIcons.Code className="h-4 w-4" /> },
            { label: "Molecules", description: "12 components", icon: <ArticleIcons.Layers className="h-4 w-4" /> },
            { label: "Organisms", description: "23 components", icon: <ArticleIcons.Database className="h-4 w-4" /> },
            { label: "Pages", description: "15 routes", icon: <ArticleIcons.Target className="h-4 w-4" /> },
          ]}
        />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Shared Components",
              description: "FormInput, FormSelect, FormNavigation - used across all forms with consistent behavior.",
            },
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Shared Steps",
              description: "PersonalInfoStep, PropertyInfoStep, ScheduleStep - accept store hook as prop for flexibility.",
            },
            {
              icon: <ArticleIcons.GitBranch className="h-5 w-5" />,
              title: "Form-Specific Steps",
              description: "ServiceDetailsStep, InquiryTypeStep, BudgetStep - unique to each form flow.",
            },
            {
              icon: <ArticleIcons.Target className="h-5 w-5" />,
              title: "Container Pattern",
              description: "Each form has a container that orchestrates steps, state, and submission.",
            },
          ]}
        />

        <SectionHeader number="05" title="Schema-First Design" id="schema-first" />

        <p className="text-muted-foreground mb-4">
          We defined all data schemas before building UI. This ensured type safety from the start 
          and prevented the common pattern of retrofitting types onto existing code.
        </p>

        <CodeBlock
          filename="Schema-First Approach"
          code={`// Step 1: Define schemas FIRST
export const personalInfoSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
})

// Step 2: Derive types from schemas
export type PersonalInfo = z.infer<typeof personalInfoSchema>

// Step 3: Use types in components
export function PersonalInfoStep() {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
  })
  // TypeScript knows exact shape of form data
}

// Step 4: Same schema validates Server Actions
export async function submitForm(data: unknown) {
  const result = serverSchema.safeParse(data)
  // Same rules, same types, no drift
}`}
        />

        <SectionHeader number="06" title="Project Structure" id="project-structure" />

        <FileTree
          title="Planned Directory Structure"
          items={[
            {
              name: "app/",
              type: "folder",
              children: [
                { name: "page.tsx", type: "file" },
                { name: "services/", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "contact/", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "get-a-quote/", type: "folder", children: [{ name: "page.tsx", type: "file" }] },
                { name: "docs/", type: "folder", children: [{ name: "[...slug]/", type: "folder" }] },
              ],
            },
            {
              name: "components/",
              type: "folder",
              children: [
                { name: "atoms/", type: "folder", highlight: true },
                { name: "molecules/", type: "folder", highlight: true },
                { name: "organisms/", type: "folder", highlight: true },
                { name: "ui/", type: "folder" },
              ],
            },
            {
              name: "lib/",
              type: "folder",
              children: [
                { name: "validation/", type: "folder", highlight: true },
                { name: "store/", type: "folder", highlight: true },
                { name: "actions/", type: "folder", highlight: true },
                { name: "security/", type: "folder", highlight: true },
                { name: "email/", type: "folder" },
              ],
            },
          ]}
        />

        <SectionHeader number="07" title="Time Investment" id="time-investment" />

        <p className="text-muted-foreground mb-4">
          Here is exactly how we spent our Week Zero planning time and the value each activity delivered.
        </p>

        <StatsTable
          title="Planning Time Breakdown"
          headers={["Activity", "Time", "Outcome"]}
          rows={[
            ["User flow mapping", "2 hours", "Identified 3 shared steps across all forms"],
            ["Schema design", "3 hours", "Zero breaking changes throughout development"],
            ["Component inventory", "1.5 hours", "40% code reuse, clear ownership"],
            ["Tech stack evaluation", "0.5 hours", "No mid-project technology pivots"],
          ]}
        />

        <VerticalFlow
          title="What Planning Prevented"
          steps={[
            { title: "Major Rewrite #1", description: "Would have built 3 separate form systems, then discovered shared patterns", icon: <ArticleIcons.X className="h-4 w-4" /> },
            { title: "Major Rewrite #2", description: "Would have added TypeScript after JavaScript prototype was built", icon: <ArticleIcons.X className="h-4 w-4" /> },
            { title: "Major Rewrite #3", description: "Would have moved from client-only to Server Actions mid-development", icon: <ArticleIcons.X className="h-4 w-4" /> },
          ]}
        />

        <SectionHeader number="08" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Plan the architecture before you code. Map user flows to discover shared patterns. 
          Define schemas to lock in type safety. Structure directories to enforce boundaries. 
          The 7 hours we invested in Week Zero saved us from 3 major rewrites and enabled 40% 
          code reuse across our form system.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { title: "Atomic Design: From Theory to Production", href: "/dashboard/content-library/articles/atomic-design-principles", level: "beginner" },
            { title: "Type-Safe Validation with Zod", href: "/dashboard/content-library/articles/typescript-zod-validation", level: "beginner" },
            { title: "Multi-Step Form Architecture", href: "/dashboard/content-library/articles/multi-step-form-architecture", level: "intermediate" },
          ]}
        />
      </div>

      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}

// Alias export for backward compatibility
