"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  FeatureGrid,
  ComparisonCards,
  BeforeAfterComparison,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  StatsTable,
  DataFlowDiagram,
  ArchitectureDiagram,
  type TOCItem,
  ArticleIcons,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "why-zustand", title: "Why Zustand?", level: 2 },
  { id: "store-design", title: "Store Design", level: 2 },
  { id: "persistence", title: "Persistence Strategy", level: 2 },
  { id: "step-completion", title: "Step Completion Logic", level: 2 },
  { id: "multiple-stores", title: "Multiple Stores Pattern", level: 2 },
  { id: "performance", title: "Performance Optimization", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function ZustandArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="info">
          React Hook Form handles field-level state excellently. But multi-step forms need more: 
          step tracking, cross-step data sharing, and persistence. Zustand fills this gap with 
          minimal complexity.
        </InfoBox>

        <SectionHeader number="01" title="Why Zustand?" id="why-zustand" />

        <p className="text-muted-foreground mb-6">
          We evaluated several state management options. Zustand won because it provides exactly 
          what multi-step forms need without the boilerplate of Redux or the limitations of Context.
        </p>

        <StatsTable
          title="State Management Comparison"
          headers={["Feature", "React Context", "Redux", "Zustand"]}
          rows={[
            ["Bundle Size", "0 KB (built-in)", "~7 KB", "~1 KB"],
            ["Boilerplate", "Medium", "High", "Minimal"],
            ["DevTools", "React DevTools", "Redux DevTools", "Redux DevTools"],
            ["Persistence", "Manual", "redux-persist", "Built-in middleware"],
            ["TypeScript", "Verbose", "Verbose", "Native inference"],
            ["Re-render Control", "Poor", "Good", "Excellent"],
          ]}
        />

        <BeforeAfterComparison
          before={{
            title: "Context + useReducer",
            items: [
              "Define action types as constants",
              "Create reducer with switch statement",
              "Wrap app in Provider component",
              "Use useContext + useReducer hooks",
              "Manual memoization for performance",
            ],
          }}
          after={{
            title: "Zustand",
            items: [
              "Create store with create()",
              "Define state and actions together",
              "No Provider needed",
              "Use store hook directly",
              "Automatic selector-based re-renders",
            ],
          }}
        />

        <SectionHeader number="02" title="Store Design" id="store-design" />

        <p className="text-muted-foreground mb-4">
          Our form stores follow a consistent pattern: state sections map to form steps, 
          with dedicated update methods for each section.
        </p>

        <ArchitectureDiagram
          title="Store Structure"
          layers={[
            { name: "Navigation State", items: ["currentStep", "totalSteps"], color: "#ef4444" },
            { name: "Form Data", items: ["personalInfo", "serviceDetails", "propertyInfo", "schedulePreferences"], color: "#f59e0b" },
            { name: "Actions", items: ["updateX()", "nextStep()", "prevStep()", "resetForm()"], color: "#22c55e" },
            { name: "Derived State", items: ["isStepComplete()", "canSubmit()"], color: "#3b82f6" },
          ]}
        />

        <CodeBlock
          filename="lib/store/use-form-store.ts"
          code={`import { create } from "zustand"
import { persist } from "zustand/middleware"

// Type definitions for each form section
interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface ServiceDetails {
  serviceType: string
  urgency: "routine" | "urgent" | "emergency"
  description: string
}

// Complete form data structure
interface FormData {
  personalInfo: PersonalInfo
  serviceDetails: ServiceDetails
  propertyInfo: PropertyInfo
  schedulePreferences: SchedulePreferences
}

// Store interface
interface FormStore {
  currentStep: number
  data: FormData
  
  // Section updates
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void
  updateServiceDetails: (data: Partial<ServiceDetails>) => void
  updatePropertyInfo: (data: Partial<PropertyInfo>) => void
  updateSchedulePreferences: (data: Partial<SchedulePreferences>) => void
  
  // Navigation
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  
  // Utilities
  resetForm: () => void
  isStepComplete: (step: number) => boolean
}

// Initial empty state
const initialData: FormData = {
  personalInfo: { firstName: "", lastName: "", email: "", phone: "" },
  serviceDetails: { serviceType: "", urgency: "routine", description: "" },
  propertyInfo: { address: "", city: "", state: "", zipCode: "", propertyType: "residential" },
  schedulePreferences: { preferredDate: "", preferredTimeSlot: "morning", flexibleScheduling: false },
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      data: initialData,
      
      // Partial updates merge with existing data
      updatePersonalInfo: (data) =>
        set((state) => ({
          data: {
            ...state.data,
            personalInfo: { ...state.data.personalInfo, ...data },
          },
        })),
      
      // Navigation with bounds checking
      nextStep: () =>
        set((state) => ({
          currentStep: Math.min(state.currentStep + 1, 5),
        })),
      
      prevStep: () =>
        set((state) => ({
          currentStep: Math.max(state.currentStep - 1, 1),
        })),
      
      goToStep: (step) =>
        set(() => ({
          currentStep: Math.max(1, Math.min(step, 5)),
        })),
      
      resetForm: () =>
        set(() => ({
          currentStep: 1,
          data: initialData,
        })),
      
      // Derived state using get()
      isStepComplete: (step) => {
        const { data } = get()
        switch (step) {
          case 1:
            return !!(data.personalInfo.firstName && data.personalInfo.email)
          case 2:
            return !!(data.serviceDetails.serviceType && data.serviceDetails.description)
          // ... other steps
          default:
            return false
        }
      },
    }),
    { name: "electrical-service-form" }
  )
)`}
        />

        <SectionHeader number="03" title="Persistence Strategy" id="persistence" />

        <p className="text-muted-foreground mb-4">
          Zustand's persist middleware automatically syncs state to localStorage. Users can 
          refresh the page or close the browser without losing their progress.
        </p>

        <DataFlowDiagram
          title="Persistence Flow"
          nodes={[
            { label: "State Change", description: "User fills field", icon: <ArticleIcons.Code className="h-4 w-4" /> },
            { label: "Zustand Store", description: "Updates in memory", icon: <ArticleIcons.Database className="h-4 w-4" /> },
            { label: "Persist Middleware", description: "Serializes state", icon: <ArticleIcons.Layers className="h-4 w-4" /> },
            { label: "localStorage", description: "Persistent storage", icon: <ArticleIcons.Shield className="h-4 w-4" /> },
          ]}
        />

        <CodeBlock
          filename="Persistence Configuration"
          code={`import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      // ... store definition
    }),
    {
      // localStorage key - unique per form type
      name: "electrical-service-form",
      
      // Optional: customize storage (default is localStorage)
      storage: createJSONStorage(() => localStorage),
      
      // Optional: only persist certain fields
      partialize: (state) => ({
        currentStep: state.currentStep,
        data: state.data,
        // Exclude methods and derived state
      }),
      
      // Optional: handle version migrations
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // Handle migration from older version
        }
        return persistedState as FormStore
      },
    }
  )
)`}
        />

        <InfoBox type="warning" title="SSR Hydration">
          When using persist with Next.js, initial server render will not have localStorage data. 
          This can cause hydration mismatches. Use conditional rendering or the onRehydrateStorage 
          callback to handle this gracefully.
        </InfoBox>

        <SectionHeader number="04" title="Step Completion Logic" id="step-completion" />

        <p className="text-muted-foreground mb-4">
          The isStepComplete function enables UI features like progress indicators and 
          navigation guards that prevent skipping required steps.
        </p>

        <CodeBlock
          filename="Step Completion Implementation"
          code={`// In the store
isStepComplete: (step) => {
  const { data } = get()
  
  switch (step) {
    case 1: // Personal Info
      return !!(
        data.personalInfo.firstName &&
        data.personalInfo.lastName &&
        data.personalInfo.email &&
        data.personalInfo.phone
      )
    case 2: // Service Details
      return !!(
        data.serviceDetails.serviceType &&
        data.serviceDetails.description
      )
    case 3: // Property Info
      return !!(
        data.propertyInfo.address &&
        data.propertyInfo.city &&
        data.propertyInfo.zipCode
      )
    case 4: // Schedule
      return !!(
        data.schedulePreferences.preferredDate &&
        data.schedulePreferences.preferredTimeSlot
      )
    case 5: // Review (always "complete" if reached)
      return true
    default:
      return false
  }
}

// Usage in progress indicator
function StepIndicator({ step }: { step: number }) {
  const isComplete = useFormStore((state) => state.isStepComplete(step))
  const currentStep = useFormStore((state) => state.currentStep)
  
  return (
    <div className={cn(
      "w-8 h-8 rounded-full flex items-center justify-center",
      isComplete && "bg-green-500",
      currentStep === step && "bg-accent",
      !isComplete && currentStep !== step && "bg-muted"
    )}>
      {isComplete ? <Check /> : step}
    </div>
  )
}`}
        />

        <SectionHeader number="05" title="Multiple Stores Pattern" id="multiple-stores" />

        <p className="text-muted-foreground mb-4">
          Each form type has its own store with a unique localStorage key. Stores share a 
          common interface so shared step components can work with any of them.
        </p>

        <FeatureGrid
          columns={3}
          features={[
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "useFormStore",
              description: "Service request form. 5 steps, stores under 'electrical-service-form' key.",
            },
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "useContactStore",
              description: "Contact form. 5 steps, stores under 'electrical-contact-form' key.",
            },
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "useQuotationStore",
              description: "Quotation form. 7 steps, stores under 'electrical-quotation-form' key.",
            },
          ]}
        />

        <CodeBlock
          filename="Common Store Interface"
          code={`// Shared interface that all form stores implement
interface BaseFormStore {
  currentStep: number
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  resetForm: () => void
}

// Personal info interface (used in shared step)
interface PersonalInfoStore extends BaseFormStore {
  data: { personalInfo: PersonalInfo }
  updatePersonalInfo: (data: Partial<PersonalInfo>) => void
}

// The shared step accepts any store matching this interface
function PersonalInfoStep({ useStore }: { useStore: () => PersonalInfoStore }) {
  const { data, updatePersonalInfo, nextStep } = useStore()
  // Works with useFormStore, useContactStore, or useQuotationStore
}`}
        />

        <SectionHeader number="06" title="Performance Optimization" id="performance" />

        <p className="text-muted-foreground mb-4">
          Zustand automatically optimizes re-renders through selector subscriptions. Components 
          only re-render when the specific state they use changes.
        </p>

        <ComparisonCards
          idealTitle="Good Patterns"
          notIdealTitle="Avoid These"
          idealFor={[
            "Select specific fields: useStore(s => s.data.personalInfo)",
            "Select multiple fields with shallow: useStore(s => [s.step, s.data], shallow)",
            "Memoize selectors for complex derivations",
            "Split into multiple small stores if unrelated state",
          ]}
          notIdealFor={[
            "Selecting entire state: useStore()",
            "Creating new objects in selectors",
            "Subscribing to state you do not use",
            "One massive store for entire app",
          ]}
        />

        <CodeBlock
          filename="Optimized Selectors"
          code={`// BAD: Re-renders on ANY state change
const store = useFormStore()

// GOOD: Only re-renders when currentStep changes
const currentStep = useFormStore((state) => state.currentStep)

// GOOD: Select specific nested data
const email = useFormStore((state) => state.data.personalInfo.email)

// GOOD: Multiple values with shallow comparison
import { shallow } from "zustand/shallow"
const [step, total] = useFormStore(
  (state) => [state.currentStep, state.totalSteps],
  shallow
)

// GOOD: Memoized complex selector
const completedSteps = useFormStore(
  (state) => [1, 2, 3, 4, 5].filter(step => state.isStepComplete(step))
)`}
        />

        <SectionHeader number="07" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Separate form field state (React Hook Form) from form flow state (Zustand). Use 
          Zustand for step tracking, cross-step data, and persistence. Its minimal API, 
          TypeScript support, and built-in persistence make it ideal for multi-step forms. 
          Use selectors to optimize re-renders and keep stores focused on specific features.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { title: "Multi-Step Form Architecture", href: "/dashboard/content-library/articles/multi-step-form-architecture", level: "intermediate" },
            { title: "Type-Safe Validation with Zod", href: "/dashboard/content-library/articles/typescript-zod-validation", level: "beginner" },
            { title: "Refactoring for Maintainability", href: "/dashboard/content-library/articles/refactoring-for-maintainability", level: "advanced" },
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
