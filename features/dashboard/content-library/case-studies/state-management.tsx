"use client"

import type { CaseStudy } from "@/data/content-library/case-studies"
import {
  SectionHeader,
  InfoBox,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  ProcessFlow,
  ArchitectureDiagram,
  BeforeAfterComparison,
  ComparisonCards,
  FeatureGrid,
  ArticleIcons,
  DataFlowDiagram,
  DecisionTree,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "context", title: "Context", level: 2 },
  { id: "pain-points", title: "Pain Points", level: 2 },
  { id: "solution-design", title: "Solution Design", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "persistence", title: "Persistence & DevTools", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function StateManagementContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Context" id="context" />

        <p className="text-muted-foreground mb-6">
          Our multi-step service request form had grown from a simple contact form into a 5-step wizard
          managing personal information, service selection, property details, scheduling, and a review step.
          State was managed entirely through useState hooks and props drilling. Every component in the tree
          needed to pass data up and down, creating a brittle, hard-to-debug architecture.
        </p>

        <InfoBox type="info" title="The Scale of the Problem">
          With 5 form steps, 15+ form fields, validation state, navigation state, and error state,
          we had over 20 pieces of state being passed through props. Adding a new field meant updating
          the type definition, the parent component, the step component, and often multiple intermediate
          wrapper components.
        </InfoBox>

        <SectionHeader number="02" title="Pain Points" id="pain-points" />

        <ComparisonCards
          leftTitle="Developer Experience Issues"
          leftItems={[
            "Props drilling through 5+ component levels",
            "Adding a field required editing 4-6 files",
            "State lost on page refresh - users lost progress",
            "Debugging required console.log at every level",
            "Race conditions between parent and child state updates",
            "No way to inspect current form state holistically",
          ]}
          rightTitle="User Experience Issues"
          rightItems={[
            "Form progress lost if user accidentally navigated away",
            "Back button destroyed all entered data",
            "No way to resume a partially completed form",
            "Slow re-renders as entire tree updated on every keystroke",
            "Validation errors cleared unexpectedly during navigation",
            "Inconsistent state between steps",
          ]}
          leftType="negative"
          rightType="negative"
        />

        <BeforeAfterComparison
          beforeTitle="Before: Props Drilling Nightmare"
          beforeCode={`// Parent component managing everything
function ServiceForm() {
  const [step, setStep] = useState(1)
  const [personal, setPersonal] = useState({})
  const [service, setService] = useState({})
  const [property, setProperty] = useState({})
  const [schedule, setSchedule] = useState({})
  const [errors, setErrors] = useState({})

  return (
    <FormWrapper
      step={step}
      setStep={setStep}
      personal={personal}
      setPersonal={setPersonal}
      service={service}
      setService={setService}
      errors={errors}
      setErrors={setErrors}
      // ... 12+ more props
    >
      {step === 1 && (
        <PersonalStep
          data={personal}
          setData={setPersonal}
          errors={errors}
          setErrors={setErrors}
          onNext={() => setStep(2)}
        />
      )}
      {/* Repeated for every step */}
    </FormWrapper>
  )
}`}
          afterTitle="After: Clean Store Access"
          afterCode={`// Orchestrating component - clean and simple
function ServiceForm() {
  const currentStep = useContactStore(s => s.currentStep)

  return (
    <FormProvider>
      <ProgressIndicator />
      <StepRenderer step={currentStep} />
      <NavigationControls />
    </FormProvider>
  )
}

// Each step component subscribes directly
function PersonalStep() {
  const name = useContactStore(s => s.formData.name)
  const updateField = useContactStore(s => s.updateField)

  return (
    <FormInput
      value={name}
      onChange={(v) => updateField("name", v)}
    />
  )
}`}
          improvements={[
            { metric: "Props per component", before: "8-15", after: "0 (direct store access)" },
            { metric: "Files to edit for new field", before: "4-6", after: "1 (schema + store)" },
            { metric: "Re-renders per keystroke", before: "Entire tree", after: "Single component" },
          ]}
        />

        <SectionHeader number="03" title="Solution Design" id="solution-design" />

        <p className="text-muted-foreground mb-6">
          We evaluated three state management approaches before selecting Zustand. The decision was
          based on bundle size, developer experience, performance characteristics, and built-in
          persistence support.
        </p>

        <DecisionTree
          title="State Management Options Evaluated"
          decisions={[
            { condition: "Need minimal bundle size + persistence", result: "Zustand (2KB + persist middleware)", recommended: true },
            { condition: "Need complex computed state + time travel", result: "Redux Toolkit (heavier, more boilerplate)" },
            { condition: "Need simple shared state, no persistence", result: "React Context (built-in, causes re-renders)" },
            { condition: "Need server state syncing", result: "React Query / SWR (for server state, not form state)" },
          ]}
        />

        <DataFlowDiagram
          title="Zustand Store Architecture"
          nodes={[
            { label: "Store", description: "Single source of truth" },
            { label: "Selectors", description: "Granular subscriptions" },
            { label: "Components", description: "Only re-render on used state" },
            { label: "Persist", description: "Auto-save to localStorage" },
          ]}
        />

        <SectionHeader number="04" title="Implementation" id="implementation" />

        <CodeBlock
          filename="lib/store/use-contact-store.ts"
          language="typescript"
          code={`import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { ContactFormData } from "@/lib/validation/schemas"

interface ContactStore {
  // State
  currentStep: number
  formData: Partial<ContactFormData>
  errors: Record<string, string>
  isSubmitting: boolean
  
  // Navigation
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  
  // Data
  updateField: (field: string, value: unknown) => void
  updateFormData: (data: Partial<ContactFormData>) => void
  
  // Validation
  setErrors: (errors: Record<string, string>) => void
  clearFieldError: (field: string) => void
  
  // Lifecycle
  reset: () => void
}

export const useContactStore = create<ContactStore>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {},
      errors: {},
      isSubmitting: false,
      
      nextStep: () => set({ currentStep: get().currentStep + 1 }),
      prevStep: () => set({ currentStep: get().currentStep - 1 }),
      goToStep: (step) => set({ currentStep: step }),
      
      updateField: (field, value) => set({
        formData: { ...get().formData, [field]: value },
        errors: { ...get().errors, [field]: "" },
      }),
      
      updateFormData: (data) => set({
        formData: { ...get().formData, ...data },
      }),
      
      setErrors: (errors) => set({ errors }),
      clearFieldError: (field) => set({
        errors: { ...get().errors, [field]: "" },
      }),
      
      reset: () => set({
        currentStep: 1,
        formData: {},
        errors: {},
        isSubmitting: false,
      }),
    }),
    {
      name: "contact-form-draft",
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: state.formData,
      }),
    }
  )
)`}
        />

        <SectionHeader number="05" title="Persistence & DevTools" id="persistence" />

        <p className="text-muted-foreground mb-6">
          Two features that immediately improved both developer and user experience: automatic
          persistence and DevTools integration. Users can now close their browser mid-form and
          return to exactly where they left off. Developers can inspect the full store state
          in real-time.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "Auto-Persistence",
              description: "The persist middleware automatically saves form progress to localStorage. The partialize option ensures only relevant data is saved, not transient UI state.",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "DevTools Integration",
              description: "Zustand integrates with Redux DevTools, enabling time-travel debugging, state inspection, and action logging during development.",
            },
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Selective Re-renders",
              description: "Components subscribe to specific slices of state via selectors. A keystroke in the name field only re-renders the name input, not the entire form.",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Type Safety",
              description: "The store interface is fully typed. TypeScript catches invalid field names, wrong value types, and missing actions at compile time.",
            },
          ]}
        />

        <SectionHeader number="06" title="Results & Metrics" id="results" />

        <StatsTable
          title="State Management Improvement Metrics"
          headers={["Metric", "Before", "After", "Improvement"]}
          rows={caseStudy.results.metrics.map((m) => [m.label, m.before, m.after, m.improvement])}
        />

        <MetricsGrid
          metrics={[
            { label: "State Code Lines", value: "180", change: "-60% (from 450)", positive: true },
            { label: "Prop Drilling", value: "0", change: "Eliminated", positive: true },
            { label: "Persistence", value: "Auto", change: "Was manual", positive: true },
            { label: "Debug Tools", value: "DevTools", change: "Was console.log", positive: true },
          ]}
        />

        <SectionHeader number="07" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          Extract shared state into dedicated stores. Let components subscribe only to what they need
          via selectors. The combination of Zustand + persist middleware + TypeScript gave us type-safe,
          persistent, granular state management with a 2KB bundle cost - eliminating props drilling,
          state loss, and unnecessary re-renders in a single architectural change.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { href: "/dashboard/content-library/case-studies/client-to-server-components", title: "Client to Server Components", level: "intermediate" },
            { href: "/dashboard/content-library/case-studies/form-validation-refactor", title: "Form Validation Refactor", level: "advanced" },
          ]}
        />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
