"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SectionHeader,
  KeyTakeaway,
  InfoBox,
  ProcessFlow,
  FeatureGrid,
  DataFlowDiagram,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { CodeExplanation } from "@/components/atoms/code-explanation"

export function ZustandFormStoreContent() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <section>
        <SectionHeader number="01" title="Building a Form Store with Zustand" id="overview" />
        <p className="text-muted-foreground leading-relaxed mt-4">
          Multi-step forms need state that persists across steps, survives page refreshes,
          and provides clean navigation. Zustand with the persist middleware gives you all three.
        </p>
      </section>

      <FeatureGrid
        title="What You Will Build"
        features={[
          { title: "Typed Store", description: "Full TypeScript interface for state and actions" },
          { title: "Persist Middleware", description: "Automatic localStorage persistence and rehydration" },
          { title: "Step Navigation", description: "Next, previous, and go-to-step methods with bounds checking" },
          { title: "Field Updates", description: "Type-safe field updater using keyof generics" },
        ]}
      />

      <DataFlowDiagram
        title="Zustand Store Data Flow"
        nodes={[
          { id: "component", label: "Form Component", description: "Reads state, calls actions" },
          { id: "store", label: "Zustand Store", description: "Holds state + action logic" },
          { id: "persist", label: "Persist Middleware", description: "Syncs to localStorage" },
          { id: "storage", label: "localStorage", description: "Survives page refresh" },
        ]}
        connections={[
          { from: "component", to: "store", label: "useContactStore()" },
          { from: "store", to: "component", label: "Re-render on change" },
          { from: "store", to: "persist", label: "State updates" },
          { from: "persist", to: "storage", label: "Serialize + save" },
          { from: "storage", to: "persist", label: "Rehydrate on mount" },
        ]}
      />

      {/* Step 1 */}
      <section>
        <SectionHeader number="02" title="Step 1: Understanding the Requirements" id="step-1" />
        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          A multi-step form store needs four things: current step tracking, form data storage,
          navigation methods, and persistence.
        </p>
        <CodeBlock
          language="typescript"
          title="Challenge: Design the store interface"
          code={`// Create a store that:
// 1. Tracks current step (number)
// 2. Stores form data (typed object)
// 3. Provides navigation (next, prev, goTo)
// 4. Persists to localStorage
// 5. Has reset functionality`}
        />
      </section>

      {/* Step 2 */}
      <section>
        <SectionHeader number="03" title="Step 2: Defining the Store Interface" id="step-2" />
        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          A Zustand store interface defines both the state (data) and actions (methods).
          Unlike Redux, there are no separate action creators or reducers.
        </p>
        <CodeBlock
          language="typescript"
          title="Solution: Store interface"
          code={`interface ContactFormState {
  // State
  currentStep: number
  formData: {
    name: string
    email: string
    message: string
  }
  
  // Actions
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  updateField: <K extends keyof ContactFormState['formData']>(
    field: K,
    value: ContactFormState['formData'][K]
  ) => void
  reset: () => void
}`}
        />
        <CodeExplanation
          terms={[
            { term: "State vs Actions", description: "Zustand co-locates state and actions in one interface. State is the data, actions are the methods that modify it." },
            { term: "nextStep: () => void", description: "A void-returning function that increments the step. Zustand actions are just functions -- no action types or dispatch needed." },
            { term: "<K extends keyof ContactFormState['formData']>", description: "Generic constraint that limits K to valid field names. updateField('name', 123) would be a TypeScript error." },
            { term: "ContactFormState['formData'][K]", description: "Indexed access type. If K is 'email', this resolves to string. TypeScript enforces the value matches the field type." },
          ]}
          summary="The generic updateField signature gives you fully type-safe field updates without separate setter functions for each field."
        />
      </section>

      {/* Step 3 */}
      <section>
        <SectionHeader number="04" title="Step 3: Creating the Store with Persist" id="step-3" />
        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          The persist middleware wraps your store and automatically handles serialisation,
          storage, and rehydration.
        </p>
        <CodeBlock
          language="typescript"
          title="Solution: Complete Zustand store"
          code={`import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const initialState = {
  currentStep: 1,
  formData: { name: '', email: '', message: '' }
}

export const useContactStore = create<ContactFormState>()(
  persist(
    (set) => ({
      ...initialState,
      
      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, 5)
      })),
      
      prevStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 1)
      })),
      
      goToStep: (step) => set({ currentStep: step }),
      
      updateField: (field, value) => set((state) => ({
        formData: { ...state.formData, [field]: value }
      })),
      
      reset: () => set(initialState)
    }),
    { name: 'contact-form' }
  )
)`}
        />
        <CodeExplanation
          terms={[
            { term: "create<ContactFormState>()", description: "Creates a typed Zustand store. The double parentheses are needed for TypeScript middleware type inference." },
            { term: "persist(..., { name: 'contact-form' })", description: "Wraps the store with persistence. The name is the localStorage key." },
            { term: "(set) => ({...})", description: "The store factory. set() shallow-merges new state with existing state." },
            { term: "Math.min(state.currentStep + 1, 5)", description: "Bounds checking: prevents navigating past the last step." },
            { term: "set((state) => ({...}))", description: "Updater function pattern: receives current state, returns partial state to merge." },
          ]}
          summary="The persist middleware handles all localStorage complexity. You just provide a name and write your store logic normally."
        />
      </section>

      <InfoBox type="info" title="Why Zustand over Context?">
        Zustand stores do not cause re-renders in components that do not use the changed state. React Context re-renders every consumer when any part of the value changes. For form stores with many fields, Zustand is significantly more performant.
      </InfoBox>

      <InfoBox type="tip" title="Zustand Store Patterns">
        <ul className="list-disc list-inside space-y-1">
          <li>Define initialState outside the store for clean reset</li>
          <li>Use Math.min/max for bounds checking on navigation</li>
          <li>{"Use updater pattern (set(state => ...)) when new state depends on old"}</li>
          <li>Keep persist name unique per store</li>
          <li>Co-locate related state and actions</li>
          <li>{"Use selectors (useStore(s => s.field)) to prevent re-renders"}</li>
        </ul>
      </InfoBox>

      <ProcessFlow
        title="Store Creation Process"
        steps={[
          "Define the interface (state + actions)",
          "Extract initial state as a constant",
          "Create store with create<Type>()()",
          "Wrap with persist middleware",
          "Implement actions using set()",
          "Export the hook for component consumption",
        ]}
      />

      <KeyTakeaway>
        {"Zustand's power comes from simplicity: state and actions live together, persistence is a one-line middleware, and TypeScript generics ensure every field update is type-safe."}
      </KeyTakeaway>
    </div>
  )
}
