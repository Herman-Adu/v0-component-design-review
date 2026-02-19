"use client"

import {
  TableOfContents,
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
  VerticalFlow,
  FeatureGrid,
  MetricsGrid,
  DataFlowDiagram,
  DecisionTree,
  KeyTakeaway,
  RelatedArticles,
  StatsTable,
  NumberedList,
  FileTree,
  ProcessFlow,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { Layers, Shield, Zap, CheckCircle2, FileText, Database, ArrowRight, Settings } from "lucide-react"

const tocItems = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "architecture", title: "Architecture", level: 1 },
  { id: "project-structure", title: "Project Structure", level: 2 },
  { id: "step-1-schema", title: "Step 1: Define the Schema", level: 1 },
  { id: "step-2-store", title: "Step 2: Create the Form Store", level: 1 },
  { id: "step-3-components", title: "Step 3: Build Step Components", level: 1 },
  { id: "step-4-server-action", title: "Step 4: Server Action", level: 1 },
  { id: "step-5-validation", title: "Step 5: Progressive Validation", level: 1 },
  { id: "step-6-navigation", title: "Step 6: Step Navigation", level: 1 },
  { id: "error-handling", title: "Error Handling", level: 1 },
  { id: "accessibility", title: "Accessibility", level: 1 },
  { id: "takeaway", title: "Key Takeaway", level: 1 },
]

export function MultiStepFormsServerActionsContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">

        <SectionHeader id="overview" title="Overview" />
        <p className="text-muted-foreground leading-relaxed">
          Multi-step forms break complex data collection into manageable stages. This tutorial builds
          a production-ready multi-step form using React Server Actions for submission, Zod for
          validation, and Zustand for client-side step state. The form works without JavaScript
          enabled (progressive enhancement).
        </p>

        <FeatureGrid
          columns={3}
          features={[
            { icon: <Shield className="h-5 w-5" />, title: "Server Actions", description: "Form submission handled server-side. No API routes needed. Works without JS." },
            { icon: <CheckCircle2 className="h-5 w-5" />, title: "Zod Validation", description: "Schema-first validation. Same schema validates client and server." },
            { icon: <Layers className="h-5 w-5" />, title: "Zustand Store", description: "Lightweight state management for step data and navigation." },
          ]}
        />

        <SectionHeader id="architecture" title="Architecture" />

        <DataFlowDiagram
          title="Form Data Flow"
          nodes={[
            { label: "Step Components", description: "Collect input", icon: <FileText className="h-4 w-4" /> },
            { label: "Zustand Store", description: "Hold state", icon: <Database className="h-4 w-4" /> },
            { label: "Zod Schema", description: "Validate", icon: <Shield className="h-4 w-4" /> },
            { label: "Server Action", description: "Process", icon: <Zap className="h-4 w-4" /> },
          ]}
        />

        <InfoBox type="info" title="Why Server Actions?">
          Server Actions eliminate the need for API route files. The form&apos;s <code>action</code> attribute
          points directly to a server function. This means the form submits and processes even if
          JavaScript fails to load -- true progressive enhancement.
        </InfoBox>

        <SubSectionHeader id="project-structure" title="Project Structure" />
        <FileTree
          title="Form File Organisation"
          items={[
            { name: "lib/", type: "folder", children: [
              { name: "validation/", type: "folder", children: [
                { name: "service-request.ts", type: "file", highlight: true },
              ]},
              { name: "store/", type: "folder", children: [
                { name: "service-request-store.ts", type: "file", highlight: true },
              ]},
              { name: "actions/", type: "folder", children: [
                { name: "submit-service-request.ts", type: "file", highlight: true },
              ]},
            ]},
            { name: "components/organisms/", type: "folder", children: [
              { name: "service-request-form.tsx", type: "file" },
              { name: "steps/", type: "folder", children: [
                { name: "contact-step.tsx", type: "file" },
                { name: "service-step.tsx", type: "file" },
                { name: "details-step.tsx", type: "file" },
                { name: "review-step.tsx", type: "file" },
              ]},
            ]},
          ]}
        />

        <SectionHeader id="step-1-schema" title="Step 1: Define the Schema" />
        <p className="text-muted-foreground leading-relaxed">
          Start with the Zod schema. This is the single source of truth for what the form accepts.
          Define per-step schemas, then compose them into the full form schema.
        </p>

        <CodeBlock
          filename="lib/validation/service-request.ts"
          language="typescript"
          code={`import { z } from "zod"

// Per-step schemas for incremental validation
export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
})

export const serviceSchema = z.object({
  serviceType: z.enum(["residential", "commercial", "emergency"]),
  urgency: z.enum(["low", "medium", "high", "emergency"]),
})

export const detailsSchema = z.object({
  description: z.string().min(10, "Please provide more detail"),
  preferredDate: z.string().optional(),
  budget: z.string().optional(),
})

// Full form schema = composition of all steps
export const serviceRequestSchema = contactSchema
  .merge(serviceSchema)
  .merge(detailsSchema)

export type ServiceRequest = z.infer<typeof serviceRequestSchema>`}
        />

        <InfoBox type="tip" title="Schema Composition">
          By defining per-step schemas and merging them, you get both incremental validation
          (validate each step independently) and full-form validation (validate everything before
          server submission). One schema, two uses.
        </InfoBox>

        <SectionHeader id="step-2-store" title="Step 2: Create the Form Store" />
        <CodeBlock
          filename="lib/store/service-request-store.ts"
          language="typescript"
          code={`import { create } from "zustand"

interface FormState {
  currentStep: number
  data: Record<string, unknown>
  setStep: (step: number) => void
  updateData: (partial: Record<string, unknown>) => void
  reset: () => void
}

export const useServiceRequestStore = create<FormState>((set) => ({
  currentStep: 0,
  data: {},
  setStep: (step) => set({ currentStep: step }),
  updateData: (partial) =>
    set((state) => ({ data: { ...state.data, ...partial } })),
  reset: () => set({ currentStep: 0, data: {} }),
}))`}
        />

        <SectionHeader id="step-3-components" title="Step 3: Build Step Components" />
        <p className="text-muted-foreground leading-relaxed">
          Each step is a separate component that reads from and writes to the Zustand store.
          Components render form fields and validate their own step schema on blur or next.
        </p>

        <CodeBlock
          filename="components/organisms/steps/contact-step.tsx"
          language="typescript"
          code={`"use client"

import { useServiceRequestStore } from "@/lib/store/service-request-store"
import { contactSchema } from "@/lib/validation/service-request"

export function ContactStep() {
  const { data, updateData } = useServiceRequestStore()

  function handleBlur(field: string, value: string) {
    updateData({ [field]: value })
    // Validate single field
    const result = contactSchema.shape[field].safeParse(value)
    if (!result.success) {
      // Show field-level error
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          defaultValue={data.name as string}
          onBlur={(e) => handleBlur("name", e.target.value)}
          className="mt-1 w-full rounded-md border p-2"
          required
        />
      </div>
      {/* ... email, phone fields ... */}
    </div>
  )
}`}
        />

        <SectionHeader id="step-4-server-action" title="Step 4: Server Action" />
        <CodeBlock
          filename="lib/actions/submit-service-request.ts"
          language="typescript"
          code={`"use server"

import { serviceRequestSchema } from "@/lib/validation/service-request"

export async function submitServiceRequest(
  _prevState: unknown,
  formData: FormData
) {
  const raw = Object.fromEntries(formData)
  const result = serviceRequestSchema.safeParse(raw)

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  // Process the validated data
  // await db.insert(serviceRequests).values(result.data)
  // await sendConfirmationEmail(result.data.email)

  return { success: true, errors: {} }
}`}
        />

        <InfoBox type="warning" title="Always Re-Validate on Server">
          Client-side validation is for UX only. The server action MUST re-validate with the same Zod
          schema because client-side validation can be bypassed. This is a security requirement.
        </InfoBox>

        <SectionHeader id="step-5-validation" title="Step 5: Progressive Validation" />
        <StatsTable
          title="Validation Strategy Per Layer"
          headers={["Layer", "When", "Purpose", "Schema"]}
          rows={[
            ["Field blur", "User leaves field", "Immediate feedback", "Single field shape"],
            ["Step next", "User clicks Next", "Block progression", "Per-step schema"],
            ["Form submit", "User clicks Submit", "Final gate", "Full merged schema"],
            ["Server action", "Server receives data", "Security", "Full merged schema"],
          ]}
        />

        <SectionHeader id="step-6-navigation" title="Step 6: Step Navigation" />
        <ProcessFlow
          title="Form Step Flow"
          steps={[
            { label: "Contact", sublabel: "Step 1", color: "blue" },
            { label: "Service", sublabel: "Step 2", color: "blue" },
            { label: "Details", sublabel: "Step 3", color: "blue" },
            { label: "Review", sublabel: "Step 4", color: "green" },
          ]}
        />

        <DecisionTree
          title="Navigation Rules"
          decisions={[
            { condition: "User clicks Next?", result: "Validate current step schema. If valid, advance. If invalid, show errors.", recommended: true },
            { condition: "User clicks Back?", result: "Always allow. No validation needed. Preserve entered data." },
            { condition: "User clicks step indicator?", result: "Only allow if all prior steps are valid (no skipping ahead)." },
            { condition: "User refreshes page?", result: "Zustand store resets. Consider persisting to sessionStorage if needed." },
          ]}
        />

        <SectionHeader id="error-handling" title="Error Handling" />
        <VerticalFlow
          title="Error Display Priority"
          steps={[
            { title: "Field-level errors", description: "Show inline below the input immediately on blur. Use red text with aria-describedby." },
            { title: "Step-level errors", description: "Show a summary banner at the top of the step when Next is clicked with invalid data." },
            { title: "Server errors", description: "Show a toast or banner after server action returns. Map server field errors back to inputs." },
            { title: "Network errors", description: "Show a generic retry message. The form data is preserved in Zustand store." },
          ]}
        />

        <SectionHeader id="accessibility" title="Accessibility" />
        <NumberedList
          items={[
            { title: "aria-describedby on inputs", description: "Link each input to its error message element so screen readers announce errors." },
            { title: "role='alert' on error summaries", description: "Step-level error banners should be announced immediately to screen readers." },
            { title: "Focus management on step change", description: "When advancing to the next step, move focus to the first input of the new step." },
            { title: "Progressive enhancement", description: "The form's action attribute points to the Server Action. It submits without JS enabled." },
          ]}
        />

        <SectionHeader id="takeaway" title="Key Takeaway" />
        <KeyTakeaway>
          The power of this pattern is the single Zod schema that validates everywhere: field blur,
          step navigation, form submission, and server-side processing. Combined with Zustand for
          lightweight state and Server Actions for zero-API-route submission, you get a multi-step
          form that is type-safe, progressively enhanced, and accessible out of the box.
        </KeyTakeaway>

        <MetricsGrid
          metrics={[
            { label: "API Routes", value: "0", change: "Server Actions", positive: true },
            { label: "Validation", value: "4 Layers", change: "Single schema", positive: true },
            { label: "Bundle", value: "~8KB", change: "Zustand + Zod", positive: true },
            { label: "Works without JS", value: "Yes", change: "Progressive", positive: true },
          ]}
        />

        <RelatedArticles
          articles={[
            { title: "Multi-Step Form Case Study", href: "/dashboard/content-library/case-studies/multi-step-form-prototype-to-production", level: "intermediate" },
            { title: "Form Validation Refactor", href: "/dashboard/content-library/case-studies/form-validation-refactor", level: "intermediate" },
            { title: "Server/Client Component Boundaries", href: "/dashboard/content-library/articles/server-client-component-boundaries", level: "advanced" },
          ]}
        />
      </div>

      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-8">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  )
}
