"use client"

import {
  TableOfContents,
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  CodeBlock,
  StepFlow,
  MetricsGrid,
  DataFlowDiagram,
  DecisionTree,
  StatsTable,
  FeatureGrid,
  VerticalFlow,
  ComparisonCards,
  BeforeAfterComparison,
  KeyTakeaway,
  RelatedArticles,
} from "@/components/molecules/article-components"
import { FileText, Layers, Shield, Accessibility, Zap, Database, CheckCircle, RefreshCw } from "lucide-react"
import type { CaseStudy } from "@/data/content-library/case-studies"

const tocItems = [
  { id: "context", title: "Context", level: 1 },
  { id: "problem", title: "The Problem", level: 1 },
  { id: "code-review-findings", title: "Code Review Findings", level: 2 },
  { id: "solution", title: "Solution", level: 1 },
  { id: "architecture", title: "Architecture Design", level: 2 },
  { id: "state-management", title: "State Management", level: 2 },
  { id: "validation", title: "Dual-Layer Validation", level: 2 },
  { id: "accessibility", title: "Accessibility", level: 2 },
  { id: "results", title: "Results", level: 1 },
  { id: "lessons", title: "Lessons Learned", level: 1 },
  { id: "related", title: "Related Reading", level: 1 },
]

export function MultiStepFormContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        {/* Section 1: Context */}
        <SectionHeader id="context" number={1} title="Context" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          The service request form is the primary conversion point for the business -- every new client engagement 
          starts here. The original implementation was a rapid prototype: functional but not production-ready. 
          As the application matured through code reviews, the form needed to evolve from a monolithic component 
          into a maintainable, secure, accessible multi-step experience.
        </p>

        <MetricsGrid
          metrics={[
            { label: "Original Size", value: "400+", change: "Lines of JSX" },
            { label: "Validation", value: "Client", positive: false, change: "Only" },
            { label: "A11y Score", value: "42%", positive: false, change: "Below standard" },
            { label: "Reviews Flagged", value: "2", change: "Reviews #1 and #2" },
          ]}
        />

        {/* Section 2: The Problem */}
        <SectionHeader id="problem" number={2} title="The Problem" />
        <InfoBox type="warning" title="Prototype in Production">
          The form worked for demos but had fundamental issues: all state in local useState hooks (lost on navigation), 
          client-only validation (security vulnerability), no error announcements for screen readers, and a single 
          400-line component that was impossible to test or modify safely.
        </InfoBox>

        <SubSectionHeader id="code-review-findings" title="Code Review Findings" />
        <StatsTable
          title="Issues Identified Across Reviews"
          headers={["Review", "Finding", "Severity", "Category"]}
          rows={[
            ["Review #1", "400+ line monolithic component", "High", "Maintainability"],
            ["Review #1", "All state in local useState hooks", "Medium", "Architecture"],
            ["Review #2", "Client-only validation (no server validation)", "Critical", "Security"],
            ["Review #2", "No ARIA labels or error announcements", "High", "Accessibility"],
            ["Review #3", "Form data lost on page navigation", "Medium", "UX"],
            ["Review #3", "No loading states during submission", "Low", "UX"],
          ]}
        />

        <ComparisonCards
          leftTitle="Prototype Issues"
          leftData={[
            "Single 400+ line component",
            "useState for all form state",
            "Client-only Zod validation",
            "No ARIA labels or roles",
            "No error focus management",
            "Data lost on navigation",
          ]}
          rightTitle="Production Requirements"
          rightData={[
            "Multi-step with separate components",
            "Zustand store with persistence",
            "Dual-layer: client + server validation",
            "Full ARIA support with live regions",
            "Error focus and announcement",
            "State persisted across navigation",
          ]}
        />

        {/* Section 3: Solution */}
        <SectionHeader id="solution" number={3} title="Solution" />
        <p className="text-muted-foreground leading-relaxed mb-4">
          We refactored the form across three focused sprints, each addressing one major concern: 
          architecture (component decomposition), security (dual-layer validation), and accessibility 
          (ARIA compliance and focus management).
        </p>

        <SubSectionHeader id="architecture" title="Architecture Design" />
        <DataFlowDiagram
          title="Multi-Step Form Architecture"
          nodes={[
            { label: "FormContainer", icon: <Layers className="h-4 w-4" />, description: "Orchestrator" },
            { label: "StepRenderer", icon: <FileText className="h-4 w-4" />, description: "Dynamic step loading" },
            { label: "Zustand Store", icon: <Database className="h-4 w-4" />, description: "Shared state" },
            { label: "Zod Schemas", icon: <Shield className="h-4 w-4" />, description: "Validation rules" },
            { label: "Server Action", icon: <CheckCircle className="h-4 w-4" />, description: "Submit + validate" },
          ]}
        />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <Layers className="h-5 w-5" />,
              title: "Step Components",
              description: "Each step is an independent component: ContactStep, ServiceStep, PropertyStep, ScheduleStep, ReviewStep. Each owns its UI but shares state via Zustand.",
            },
            {
              icon: <RefreshCw className="h-5 w-5" />,
              title: "Shared Steps",
              description: "Common patterns (address input, date picker, file upload) extracted into reusable shared step components in components/organisms/shared-steps/.",
            },
            {
              icon: <Database className="h-5 w-5" />,
              title: "Form Navigation",
              description: "FormNavigation molecule handles step indicators, back/next buttons, and progress tracking. Controlled by the Zustand store's currentStep state.",
            },
            {
              icon: <Zap className="h-5 w-5" />,
              title: "Step Validation",
              description: "Each step has its own Zod schema. Navigation between steps triggers per-step validation. Full-form validation runs on final submission.",
            },
          ]}
        />

        <SubSectionHeader id="state-management" title="Zustand State Management" />
        <CodeBlock
          language="typescript"
          filename="lib/store/service-request-store.ts"
          code={`interface ServiceRequestState {
  // Step tracking
  currentStep: number
  completedSteps: Set<number>
  
  // Form data (persisted)
  contactInfo: ContactInfo
  serviceDetails: ServiceDetails
  propertyInfo: PropertyInfo
  schedule: ScheduleInfo
  
  // Actions
  setStep: (step: number) => void
  updateContact: (data: Partial<ContactInfo>) => void
  updateService: (data: Partial<ServiceDetails>) => void
  resetForm: () => void
}

// Zustand store with persist middleware
export const useServiceRequestStore = create<ServiceRequestState>()(
  persist(
    (set) => ({
      currentStep: 0,
      completedSteps: new Set(),
      // ... initial state and actions
    }),
    { name: 'service-request-form' }
  )
)`}
        />

        <SubSectionHeader id="validation" title="Dual-Layer Validation" />
        <InfoBox type="important" title="Why Dual-Layer?">
          Client-only validation is a UX feature, not a security measure. Any client-side check can be bypassed. 
          Server-side validation with the same Zod schema ensures data integrity regardless of how the form is submitted.
        </InfoBox>

        <StepFlow
          title="Validation Flow"
          steps={[
            { number: 1, title: "Client Validates", description: "Zod schema runs on blur and step navigation. Instant feedback to user." },
            { number: 2, title: "Step Advances", description: "Only if client validation passes. Prevents invalid data from reaching later steps." },
            { number: 3, title: "Server Validates", description: "Same Zod schema runs in server action on submit. Catches any bypassed client checks." },
            { number: 4, title: "Action Executes", description: "Only after server validation passes. Email sent, data persisted." },
          ]}
        />

        <SubSectionHeader id="accessibility" title="Accessibility Implementation" />
        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <Accessibility className="h-5 w-5" />,
              title: "ARIA Live Regions",
              description: "Error summaries announced via aria-live='polite'. Step changes announced via aria-live='assertive'. Screen readers always know the current state.",
            },
            {
              icon: <Accessibility className="h-5 w-5" />,
              title: "Focus Management",
              description: "On step change, focus moves to the step heading. On validation error, focus moves to the first invalid field. Keyboard navigation fully supported.",
            },
          ]}
        />

        {/* Section 4: Results */}
        <SectionHeader id="results" number={4} title="Results" />
        <BeforeAfterComparison
          title="Form Quality Metrics"
          items={[
            { label: "Component size", before: "400+ lines (1 file)", after: "~80 lines avg (7 files)" },
            { label: "Validation layers", before: "Client only", after: "Client + Server (shared Zod)" },
            { label: "Accessibility score", before: "42%", after: "96%" },
            { label: "Form completion rate", before: "~60%", after: "~82%" },
            { label: "State persistence", before: "Lost on navigation", after: "Persisted via Zustand" },
          ]}
        />

        <MetricsGrid
          metrics={[
            { label: "A11y Score", value: "96%", change: "+54 points", positive: true },
            { label: "Completion Rate", value: "82%", change: "+22%", positive: true },
            { label: "Avg File Size", value: "80 lines", change: "-80% from monolith", positive: true },
            { label: "Security Vulns", value: "0", change: "From 1 critical", positive: true },
          ]}
        />

        {/* Section 5: Lessons */}
        <SectionHeader id="lessons" number={5} title="Lessons Learned" />
        <VerticalFlow
          title="Key Takeaways"
          steps={[
            { title: "Prototypes Aren't Production", description: "A working form is not a production form. Budget time for security, accessibility, and architecture before launching." },
            { title: "Share Validation Schemas", description: "One Zod schema shared between client and server eliminates drift. Change it once, both layers update." },
            { title: "Zustand Simplifies Multi-Step", description: "A centralised store removes prop drilling across steps and enables persistence with one middleware addition." },
            { title: "Code Reviews Drive Evolution", description: "Each review caught issues the previous one missed. The form improved through three review cycles, not one big rewrite." },
          ]}
        />

        <KeyTakeaway>
          The most important lesson: production forms need three things prototypes skip -- server validation 
          (security), state persistence (UX), and accessibility (compliance). Addressing these after launch is 
          always harder than building them in from the start. Let code reviews guide the evolution.
        </KeyTakeaway>

        {/* Section 6: Related */}
        <SectionHeader id="related" number={6} title="Related Reading" />
        <RelatedArticles
          articles={[
            { title: "Building Accessible Forms with React", href: "/dashboard/content-library/articles/building-accessible-forms-react", level: "intermediate" },
            { title: "Zustand vs Context API", href: "/dashboard/content-library/articles/zustand-vs-context-api-form-state", level: "intermediate" },
            { title: "Form Validation Refactor", href: "/dashboard/content-library/case-studies/form-validation-refactor", level: "advanced" },
          ]}
        />
      </div>

      {/* Right sidebar TOC */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  )
}
