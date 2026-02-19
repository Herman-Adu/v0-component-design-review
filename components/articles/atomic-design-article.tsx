"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
  ArchitectureDiagram,
  FileTree,
  FeatureGrid,
  MetricsGrid,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  DecisionTree,
  TableOfContents,
  type TOCItem,
  ArticleIcons,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "what-is-atomic", title: "What is Atomic Design?", level: 2 },
  { id: "our-implementation", title: "Our Implementation", level: 2 },
  { id: "atoms", title: "Atoms (10 Components)", level: 3 },
  { id: "molecules", title: "Molecules (12 Components)", level: 3 },
  { id: "organisms", title: "Organisms (23 Components)", level: 3 },
  { id: "benefits", title: "Why This Architecture", level: 2 },
  { id: "real-example", title: "Real Example", level: 2 },
  { id: "decision-guide", title: "Decision Guide", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function AtomicDesignArticleContent() {
  return (
    <div className="flex gap-8">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <InfoBox type="info">
          Atomic Design is a methodology for creating design systems with five distinct levels: Atoms, Molecules, 
          Organisms, Templates, and Pages. We adapted it for our React component library, focusing on the first 
          three levels for maximum reusability.
        </InfoBox>

        <SectionHeader number="01" title="What is Atomic Design?" id="what-is-atomic" />
        
        <p className="text-muted-foreground mb-6">
          Coined by Brad Frost, Atomic Design breaks UI into fundamental building blocks that compose into 
          increasingly complex structures. Think of it like chemistry: atoms combine to form molecules, 
          which combine to form organisms.
        </p>

        <ArchitectureDiagram
          title="Component Hierarchy"
          layers={[
            { name: "Organisms", items: ["Form Containers", "Step Components", "Review Displays"], color: "#ef4444" },
            { name: "Molecules", items: ["Navigation", "Cards", "Step Indicators", "Sidebar"], color: "#f59e0b" },
            { name: "Atoms", items: ["Input", "Select", "Button", "Checkbox", "DatePicker"], color: "#22c55e" },
          ]}
        />

        <SectionHeader number="02" title="Our Implementation" id="our-implementation" />

        <MetricsGrid
          metrics={[
            { label: "Total Components", value: "52", change: "Production Ready", positive: true },
            { label: "Atoms", value: "10", change: "Building blocks", positive: true },
            { label: "Molecules", value: "12", change: "Composite units", positive: true },
            { label: "Organisms", value: "23", change: "Complete features", positive: true },
          ]}
        />

        <SubSectionHeader title="Atoms (10 Components)" id="atoms" />
        
        <p className="text-muted-foreground mb-4">
          Atoms are the smallest, most fundamental components. They cannot be broken down further while 
          still being functional. Each atom handles one specific UI responsibility.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "FormInput",
              description: "Text input with label, error handling, and validation states. Used in 15+ locations.",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "FormSelect",
              description: "Dropdown selection with shadcn/ui styling and accessibility support.",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "FormCheckbox",
              description: "Checkbox with label and error states for boolean inputs.",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "DatePicker",
              description: "Calendar-based date selection with validation and format handling.",
            },
          ]}
        />

        <CodeBlock
          filename="components/atoms/form-input.tsx"
          code={`// Atom Example: FormInput
interface FormInputProps {
  label: string
  error?: string
  ...inputProps
}

export function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input {...props} className={error ? "border-red-500" : ""} />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}`}
        />

        <SubSectionHeader title="Molecules (12 Components)" id="molecules" />

        <p className="text-muted-foreground mb-4">
          Molecules combine atoms into functional units. They handle specific UI patterns that appear 
          repeatedly across the application.
        </p>

        <FileTree
          title="Molecule Components"
          items={[
            {
              name: "molecules/",
              type: "folder",
              children: [
                { name: "form-navigation.tsx", type: "file", highlight: true },
                { name: "form-step-container.tsx", type: "file", highlight: true },
                { name: "form-progress-indicator.tsx", type: "file" },
                { name: "step-indicator.tsx", type: "file" },
                { name: "content-card.tsx", type: "file" },
                { name: "office-hours-card.tsx", type: "file" },
                { name: "quick-contact-card.tsx", type: "file" },
                { name: "navbar.tsx", type: "file" },
                { name: "docs-sidebar.tsx", type: "file" },
              ],
            },
          ]}
        />

        <CodeBlock
          filename="components/molecules/form-navigation.tsx"
          code={`// Molecule Example: Combines Button atoms with navigation logic
export function FormNavigation({ 
  onNext, 
  onPrev, 
  isFirst, 
  isLast,
  isSubmitting 
}: FormNavigationProps) {
  return (
    <div className="flex justify-between pt-6 border-t">
      <Button 
        variant="outline" 
        onClick={onPrev} 
        disabled={isFirst}
      >
        Previous
      </Button>
      <Button 
        onClick={onNext}
        disabled={isSubmitting}
      >
        {isLast ? "Submit" : "Continue"}
      </Button>
    </div>
  )
}`}
        />

        <SubSectionHeader title="Organisms (23 Components)" id="organisms" />

        <p className="text-muted-foreground mb-4">
          Organisms are complete, standalone features. They combine molecules and atoms into fully 
          functional UI sections. In our case, each form step is an organism.
        </p>

        <StepFlow
          title="Service Request Form Organisms"
          steps={[
            { number: 1, title: "Personal Info", description: "Name, email, phone" },
            { number: 2, title: "Service Details", description: "Type, urgency, description" },
            { number: 3, title: "Property Info", description: "Address, property type" },
            { number: 4, title: "Schedule", description: "Date, time slot" },
          ]}
        />

        <InfoBox type="tip" title="Shared Step Pattern">
          We identified steps that appear in multiple forms (Personal Info, Property Info, Schedule) 
          and made them accept a generic store hook. This allows the same organism to work with 
          different Zustand stores.
        </InfoBox>

        <SectionHeader number="03" title="Why This Architecture" id="benefits" />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Maximum Reusability",
              description: "FormInput is used in 15+ locations. One change updates all instances automatically.",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Consistent Quality",
              description: "All inputs share the same validation patterns, error handling, and accessibility features.",
            },
            {
              icon: <ArticleIcons.GitBranch className="h-5 w-5" />,
              title: "Independent Testing",
              description: "Each atom, molecule, and organism can be unit tested in isolation.",
            },
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "Team Scalability",
              description: "New developers understand the structure immediately. Clear boundaries reduce conflicts.",
            },
          ]}
        />

        <ComparisonCards
          idealTitle="Atomic Design Shines When"
          notIdealTitle="Consider Alternatives When"
          idealFor={[
            "Building design systems or component libraries",
            "Multiple teams working on the same codebase",
            "Applications with consistent UI patterns",
            "Projects requiring long-term maintainability",
            "Products with multiple similar forms or flows",
          ]}
          notIdealFor={[
            "One-off marketing pages",
            "Rapid prototypes that will be discarded",
            "Very small applications (< 10 components)",
            "Projects with highly unique UI per page",
          ]}
        />

        <SectionHeader number="04" title="Real Example: The Form System" id="real-example" />

        <p className="text-muted-foreground mb-4">
          Here is how our atomic architecture handles the multi-step form system with three different 
          form types sharing components:
        </p>

        <CodeBlock
          filename="Form Composition Pattern"
          code={`// Three forms, sharing 60% of their components

// Service Request Form (5 steps)
<ServiceFormContainer>
  <PersonalInfoStep store={useFormStore} />    // Shared
  <ServiceDetailsStep />                        // Unique
  <PropertyInfoStep store={useFormStore} />    // Shared
  <ScheduleStep store={useFormStore} />        // Shared
  <ReviewStep />                               // Unique
</ServiceFormContainer>

// Contact Form (5 steps)
<ContactFormContainer>
  <PersonalInfoStep store={useContactStore} /> // Shared
  <InquiryTypeStep />                          // Unique
  <PropertyInfoStep store={useContactStore} /> // Shared
  <ScheduleStep store={useContactStore} />     // Shared
  <ReviewStep />                               // Unique
</ContactFormContainer>

// Result: 3 forms, 45 total components, 40% code reuse`}
        />

        <SectionHeader number="05" title="Decision Guide" id="decision-guide" />

        <DecisionTree
          title="When to Create New Components"
          decisions={[
            { condition: "UI element appears 3+ times", result: "Create an Atom", recommended: true },
            { condition: "Combining 2-3 atoms with shared logic", result: "Create a Molecule" },
            { condition: "Complete feature with state/effects", result: "Create an Organism" },
            { condition: "One-off styling variation", result: "Use props/variants, not new component" },
            { condition: "Platform-specific UI (mobile/desktop)", result: "Use responsive design in existing component" },
          ]}
        />

        <SectionHeader number="06" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Start with atoms, compose upward. Identify shared patterns early and extract them. 
          The initial investment in structure pays dividends as your application grows. Our 52-component 
          system handles 3 different form flows with 40% code reuse - that is the power of atomic design.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { title: "Multi-Step Form Architecture That Scales", href: "/dashboard/content-library/articles/multi-step-form-architecture", level: "intermediate" },
            { title: "Planning a Full-Stack Application", href: "/dashboard/content-library/articles/planning-full-stack-application", level: "beginner" },
            { title: "Zustand for Complex Form State", href: "/dashboard/content-library/articles/zustand-form-state-management", level: "intermediate" },
          ]}
        />
      </div>

      {/* Table of Contents */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}

// Alias export for backward compatibility
