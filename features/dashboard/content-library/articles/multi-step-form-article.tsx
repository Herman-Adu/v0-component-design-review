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
  ArchitectureDiagram,
  DataFlowDiagram,
  type TOCItem,
  ArticleIcons,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "the-challenge", title: "The Challenge", level: 2 },
  { id: "architecture-overview", title: "Architecture Overview", level: 2 },
  { id: "shared-steps", title: "Shared Steps Pattern", level: 2 },
  { id: "state-management", title: "State Management", level: 2 },
  { id: "container-pattern", title: "Container Pattern", level: 2 },
  { id: "navigation-flow", title: "Navigation Flow", level: 2 },
  { id: "form-submission", title: "Form Submission", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function MultiStepFormArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="info">
          Building one multi-step form is straightforward. Building three that share code while 
          maintaining flexibility? That requires careful architecture. Here is how we built a 
          scalable multi-step form system.
        </InfoBox>

        <SectionHeader number="01" title="The Challenge" id="the-challenge" />

        <p className="text-muted-foreground mb-6">
          Our application needed to support three different form flows with varying complexity. 
          The naive approach - building three separate forms - would lead to massive code duplication 
          and inconsistent user experiences.
        </p>

        <MetricsGrid
          metrics={[
            { label: "Form Types", value: "3", change: "Service, Contact, Quote", positive: true },
            { label: "Total Steps", value: "17", change: "Across all forms", positive: true },
            { label: "Shared Steps", value: "7", change: "41% reuse rate", positive: true },
            { label: "Step Components", value: "10", change: "Unique implementations", positive: true },
          ]}
        />

        <FeatureGrid
          columns={3}
          features={[
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Service Request",
              description: "5 steps: Basic flow for requesting electrical services with urgency levels.",
            },
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "Contact Form",
              description: "5 steps: General inquiries with reference linking to existing requests.",
            },
            {
              icon: <ArticleIcons.Target className="h-5 w-5" />,
              title: "Quotation",
              description: "7 steps: Complex flow with budget ranges, timelines, and specifications.",
            },
          ]}
        />

        <SectionHeader number="02" title="Architecture Overview" id="architecture-overview" />

        <ArchitectureDiagram
          title="Multi-Step Form Architecture"
          layers={[
            { name: "Form Containers", items: ["ServiceFormContainer", "ContactFormContainer", "QuotationFormContainer"], color: "#ef4444" },
            { name: "Step Components", items: ["Shared Steps (7)", "Unique Steps (10)"], color: "#f59e0b" },
            { name: "State Layer", items: ["useFormStore", "useContactStore", "useQuotationStore"], color: "#22c55e" },
            { name: "Validation Layer", items: ["Zod Schemas", "React Hook Form Resolvers"], color: "#3b82f6" },
          ]}
        />

        <SubSectionHeader title="Key Design Decisions" />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Store Injection Pattern",
              description: "Shared steps accept a store hook as a prop, allowing them to work with any Zustand store.",
            },
            {
              icon: <ArticleIcons.GitBranch className="h-5 w-5" />,
              title: "Container Orchestration",
              description: "Each form has a container that manages step rendering, navigation, and submission.",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Per-Step Validation",
              description: "Each step validates its own fields before allowing navigation to the next step.",
            },
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "Persistent State",
              description: "Zustand's persist middleware saves progress to localStorage automatically.",
            },
          ]}
        />

        <SectionHeader number="03" title="Shared Steps Pattern" id="shared-steps" />

        <p className="text-muted-foreground mb-4">
          We identified steps that appear in multiple forms and made them truly reusable by accepting 
          a generic store interface.
        </p>

        <DataFlowDiagram
          title="Shared Step Usage"
          nodes={[
            { label: "PersonalInfoStep", description: "Used in 3 forms", icon: <ArticleIcons.Users className="h-4 w-4" /> },
            { label: "PropertyInfoStep", description: "Used in 3 forms", icon: <ArticleIcons.Target className="h-4 w-4" /> },
            { label: "ScheduleStep", description: "Used in 3 forms", icon: <ArticleIcons.Clock className="h-4 w-4" /> },
          ]}
        />

        <CodeBlock
          filename="components/organisms/personal-info-step.tsx"
          code={`// Shared step that works with any compatible store
interface PersonalInfoStepProps {
  // Accept any store that provides these methods
  useStore: () => {
    data: { personalInfo: PersonalInfo }
    updatePersonalInfo: (data: Partial<PersonalInfo>) => void
    nextStep: () => void
  }
}

export function PersonalInfoStep({ useStore }: PersonalInfoStepProps) {
  // Use the injected store
  const { data, updatePersonalInfo, nextStep } = useStore()
  
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data.personalInfo,
  })
  
  const onSubmit = (values: PersonalInfo) => {
    updatePersonalInfo(values)
    nextStep()
  }
  
  return (
    <FormStepContainer
      title="Personal Information"
      description="Let us know how to contact you"
    >
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormInput label="First Name" {...form.register("firstName")} />
        <FormInput label="Last Name" {...form.register("lastName")} />
        <FormInput label="Email" type="email" {...form.register("email")} />
        <FormInput label="Phone" type="tel" {...form.register("phone")} />
        <FormNavigation isFirst={true} />
      </form>
    </FormStepContainer>
  )
}

// Usage in different containers
<PersonalInfoStep useStore={useFormStore} />     // Service form
<PersonalInfoStep useStore={useContactStore} />  // Contact form
<PersonalInfoStep useStore={useQuotationStore} /> // Quotation form`}
        />

        <SectionHeader number="04" title="State Management" id="state-management" />

        <p className="text-muted-foreground mb-4">
          Each form has its own Zustand store that manages step navigation, form data, and persistence. 
          The stores share a common interface that shared steps can rely on.
        </p>

        <CodeBlock
          filename="lib/store/use-form-store.ts"
          code={`import { create } from "zustand"
import { persist } from "zustand/middleware"

interface FormStore {
  // Current step tracking
  currentStep: number
  
  // Form data for each step
  data: {
    personalInfo: PersonalInfo
    serviceDetails: ServiceDetails
    propertyInfo: PropertyInfo
    schedulePreferences: SchedulePreferences
  }
  
  // Update methods (one per step)
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void
  updateServiceDetails: (data: Partial<ServiceDetails>) => void
  updatePropertyInfo: (data: Partial<PropertyInfo>) => void
  updateSchedulePreferences: (data: Partial<SchedulePreferences>) => void
  
  // Navigation
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  
  // Utility
  resetForm: () => void
  isStepComplete: (step: number) => boolean
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: initialData,
      
      updatePersonalInfo: (data) =>
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...data },
          },
        })),
      
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 5),
        })),
      
      // ... other methods
    }),
    { name: "electrical-service-form" } // localStorage key
  )
)`}
        />

        <InfoBox type="tip" title="Why Zustand Over Context?">
          Zustand provides better performance (components only re-render when their specific slice changes), 
          built-in persistence middleware, and a simpler API than React Context with useReducer.
        </InfoBox>

        <SectionHeader number="05" title="Container Pattern" id="container-pattern" />

        <p className="text-muted-foreground mb-4">
          Each form has a container component that orchestrates step rendering based on current state. 
          The container owns the step mapping and handles the submission logic.
        </p>

        <CodeBlock
          filename="components/organisms/service-form-container.tsx"
          code={`export function ServiceFormContainer() {
  const { currentStep } = useFormStore()
  
  // Map step numbers to components
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep useStore={useFormStore} />
      case 2:
        return <ServiceDetailsStep /> // Unique to this form
      case 3:
        return <PropertyInfoStep useStore={useFormStore} />
      case 4:
        return <ScheduleStep useStore={useFormStore} />
      case 5:
        return <ReviewStep onSubmit={handleSubmit} />
      default:
        return null
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto">
      <FormProgressIndicator 
        currentStep={currentStep} 
        totalSteps={5}
        steps={["Contact", "Service", "Property", "Schedule", "Review"]}
      />
      {renderStep()}
    </div>
  )
}`}
        />

        <SectionHeader number="06" title="Navigation Flow" id="navigation-flow" />

        <StepFlow
          title="Step Navigation Logic"
          steps={[
            { number: 1, title: "Validate", description: "Run Zod schema on current step" },
            { number: 2, title: "Update Store", description: "Save validated data to Zustand" },
            { number: 3, title: "Navigate", description: "Increment currentStep" },
            { number: 4, title: "Persist", description: "Auto-save to localStorage" },
          ]}
        />

        <CodeBlock
          filename="Navigation Implementation"
          code={`// In each step component
const onSubmit = async (values: StepData) => {
  // 1. Validation happens via React Hook Form + Zod resolver
  // 2. Update store with validated data
  updateStepData(values)
  // 3. Navigate to next step
  nextStep()
  // 4. Persistence happens automatically via Zustand middleware
}

// Previous navigation (no validation needed)
const onPrevious = () => {
  prevStep()
}

// Skip to specific step (only if steps before it are complete)
const onGoToStep = (step: number) => {
  if (canNavigateToStep(step)) {
    goToStep(step)
  }
}`}
        />

        <SectionHeader number="07" title="Form Submission" id="form-submission" />

        <p className="text-muted-foreground mb-4">
          The final review step triggers submission through a Server Action. The action runs 
          security checks, validates the complete form, and sends confirmation emails.
        </p>

        <DataFlowDiagram
          title="Submission Pipeline"
          nodes={[
            { label: "Review Step", description: "User confirms", icon: <ArticleIcons.Check className="h-4 w-4" /> },
            { label: "Server Action", description: "Security + validation", icon: <ArticleIcons.Shield className="h-4 w-4" /> },
            { label: "Email Service", description: "Dual notifications", icon: <ArticleIcons.Zap className="h-4 w-4" /> },
            { label: "Success", description: "Reset form", icon: <ArticleIcons.Target className="h-4 w-4" /> },
          ]}
        />

        <ComparisonCards
          idealTitle="Multi-Step Form Benefits"
          notIdealTitle="When to Use Single Forms"
          idealFor={[
            "Complex data collection (5+ fields)",
            "Progressive disclosure of complexity",
            "Forms with conditional sections",
            "Mobile-friendly long forms",
            "Forms requiring mid-process saves",
          ]}
          notIdealFor={[
            "Simple contact forms (3-4 fields)",
            "Quick feedback submissions",
            "Forms where context matters across fields",
            "Time-sensitive submissions",
          ]}
        />

        <SectionHeader number="08" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Identify shared patterns, extract them into reusable components, and compose unique flows 
          from common pieces. Our multi-step form system handles 3 different flows with 41% code 
          reuse. The store injection pattern lets shared steps work with any form while maintaining 
          type safety throughout.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { title: "Zustand for Complex Form State", href: "/dashboard/content-library/articles/zustand-form-state-management", level: "intermediate" },
            { title: "Type-Safe Validation with Zod", href: "/dashboard/content-library/articles/typescript-zod-validation", level: "beginner" },
            { title: "Atomic Design Principles", href: "/dashboard/content-library/articles/atomic-design-principles", level: "beginner" },
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
