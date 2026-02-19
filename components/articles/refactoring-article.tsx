"use client"

import {
  SectionHeader,
  InfoBox,
  StepFlow,
  ComparisonCards,
  CodeBlock,
  FeatureGrid,
  KeyTakeaway,
  TableOfContents,
  ArchitectureDiagram,
  MetricCard,
  BeforeAfterComparison,
  DataFlowDiagram,
} from "@/components/molecules/article-components"

const tocItems = [
  { id: "why-refactor", title: "Why Refactor?", level: 2 },
  { id: "code-smells", title: "Recognizing Code Smells", level: 2 },
  { id: "refactoring-patterns", title: "Refactoring Patterns", level: 2 },
  { id: "before-after", title: "Real Examples", level: 2 },
  { id: "measuring-success", title: "Measuring Success", level: 2 },
  { id: "continuous-improvement", title: "Continuous Improvement", level: 2 },
  { id: "takeaways", title: "Key Takeaways", level: 2 },
]

export function RefactoringArticle() {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Why Refactor?" id="why-refactor" />
        
        <InfoBox type="info" title="The Refactoring Mindset">
          Refactoring is not about fixing bugs or adding features. It&apos;s about improving the internal structure
          of code without changing its external behavior. Think of it as cleaning and organizing while the
          house still functions perfectly.
        </InfoBox>

        <p className="text-muted-foreground mb-6">
          In our electrical services form project, we continuously refactored to maintain code quality
          as requirements evolved. What started as a simple contact form grew into a sophisticated
          multi-step wizard with state management, validation, and email notifications.
        </p>

        <FeatureGrid
          features={[
            {
              icon: "Zap",
              title: "Improved Performance",
              description: "Optimized renders, reduced bundle size, faster load times",
            },
            {
              icon: "Shield",
              title: "Better Security",
              description: "Centralized sanitization, type-safe validation, secure patterns",
            },
            {
              icon: "Code",
              title: "Maintainability",
              description: "Clear separation of concerns, reusable components, consistent patterns",
            },
            {
              icon: "Users",
              title: "Team Productivity",
              description: "Easier onboarding, predictable code locations, self-documenting architecture",
            },
          ]}
        />

        <SectionHeader number="02" title="Recognizing Code Smells" id="code-smells" />

        <p className="text-muted-foreground mb-6">
          Code smells are indicators that something might be wrong with your code structure.
          Learning to recognize them is the first step to effective refactoring.
        </p>

        <ComparisonCards
          leftTitle="Common Code Smells"
          leftItems={[
            "Components over 300 lines",
            "Props drilling through 3+ levels",
            "Duplicate validation logic",
            "Mixed concerns in single file",
            "Inconsistent naming patterns",
            "Hardcoded values scattered everywhere",
          ]}
          rightTitle="Healthy Code Indicators"
          rightItems={[
            "Single responsibility components",
            "Centralized state management",
            "Shared validation schemas",
            "Clear separation of concerns",
            "Consistent naming conventions",
            "Configuration in dedicated files",
          ]}
          leftType="negative"
          rightType="positive"
        />

        <SectionHeader number="03" title="Refactoring Patterns We Applied" id="refactoring-patterns" />

        <h3 className="text-lg font-semibold text-foreground mb-4">Pattern 1: Extract Component</h3>
        
        <p className="text-muted-foreground mb-4">
          When a component grows too large, extract logical sections into smaller, focused components.
        </p>

        <BeforeAfterComparison
          beforeTitle="Before: Monolithic Form"
          beforeCode={`// One massive 500-line component
function ServiceRequestForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})
  
  // 50+ lines of validation logic
  // 100+ lines of form handlers
  // 300+ lines of JSX for all 5 steps
  
  return (
    <form>
      {step === 1 && (/* Personal info fields */)}
      {step === 2 && (/* Service selection */)}
      {step === 3 && (/* Property details */)}
      {step === 4 && (/* Schedule */)}
      {step === 5 && (/* Review */)}
    </form>
  )
}`}
          afterTitle="After: Atomic Components"
          afterCode={`// Orchestrating component
function ServiceRequestForm() {
  const { currentStep } = useFormStore()
  
  return (
    <FormProvider>
      <ProgressIndicator />
      <StepRenderer step={currentStep} />
      <NavigationControls />
    </FormProvider>
  )
}

// Each step is its own focused component
// PersonalInfoStep.tsx - 80 lines
// ServiceSelectionStep.tsx - 100 lines
// PropertyDetailsStep.tsx - 90 lines
// ScheduleStep.tsx - 70 lines
// ReviewStep.tsx - 120 lines`}
          improvements={[
            { metric: "Lines per file", before: "500+", after: "< 120" },
            { metric: "Test coverage", before: "30%", after: "85%" },
            { metric: "Time to understand", before: "30 min", after: "5 min" },
          ]}
        />

        <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Pattern 2: Centralize State</h3>

        <DataFlowDiagram
          title="State Management Evolution"
          nodes={[
            { id: "old", label: "Props Drilling", description: "Pass state through every component" },
            { id: "context", label: "React Context", description: "Global but causes re-renders" },
            { id: "zustand", label: "Zustand Store", description: "Selective subscriptions, persistence" },
          ]}
        />

        <CodeBlock
          filename="lib/store/use-form-store.ts"
          language="typescript"
          code={`// Centralized state with Zustand
export const useFormStore = create<FormState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {},
      
      // Actions
      setStep: (step) => set({ currentStep: step }),
      updateFormData: (data) => set({ 
        formData: { ...get().formData, ...data } 
      }),
      reset: () => set({ currentStep: 1, formData: {} }),
      
      // Computed
      canProceed: () => validateStep(get().currentStep, get().formData),
    }),
    { name: 'service-form' }
  )
)`}
        />

        <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Pattern 3: Extract Utilities</h3>

        <ArchitectureDiagram
          title="Utility Extraction"
          layers={[
            {
              name: "Components",
              items: ["FormInput", "ServiceCard", "DatePicker"],
              color: "blue",
            },
            {
              name: "Hooks",
              items: ["useFormValidation", "useDebounce", "useFormStore"],
              color: "purple",
            },
            {
              name: "Utilities",
              items: ["sanitizeInput", "formatDate", "generateId"],
              color: "green",
            },
            {
              name: "Constants",
              items: ["SERVICE_TYPES", "TIME_SLOTS", "VALIDATION_RULES"],
              color: "orange",
            },
          ]}
        />

        <SectionHeader number="04" title="Real Examples from Our Project" id="before-after" />

        <h3 className="text-lg font-semibold text-foreground mb-4">Validation Refactoring</h3>

        <BeforeAfterComparison
          beforeTitle="Before: Inline Validation"
          beforeCode={`// Scattered across components
if (!email || !email.includes('@')) {
  setErrors({ email: 'Invalid email' })
}
if (!phone || phone.length < 10) {
  setErrors({ phone: 'Invalid phone' })
}
// Repeated in multiple places...`}
          afterTitle="After: Centralized Zod Schemas"
          afterCode={`// lib/validation/schemas.ts
export const personalInfoSchema = z.object({
  email: z.string()
    .email('Please enter a valid email')
    .transform(sanitizeEmail),
  phone: z.string()
    .regex(phoneRegex, 'Please enter a valid UK phone number')
    .transform(sanitizePhone),
})

// Usage in components
const result = personalInfoSchema.safeParse(data)
if (!result.success) {
  return formatZodErrors(result.error)
}`}
          improvements={[
            { metric: "Validation code", before: "200 lines scattered", after: "50 lines centralized" },
            { metric: "Consistency", before: "Varies by component", after: "100% consistent" },
            { metric: "Type safety", before: "None", after: "Full TypeScript inference" },
          ]}
        />

        <h3 className="text-lg font-semibold text-foreground mb-4 mt-8">Security Refactoring</h3>

        <BeforeAfterComparison
          beforeTitle="Before: No Sanitization"
          beforeCode={`// Direct user input to database
await db.insert({
  name: formData.name,
  email: formData.email,
  message: formData.message,
})`}
          afterTitle="After: Defense in Depth"
          afterCode={`// Security pipeline
const sanitized = sanitizeFormData(formData)
const validated = schema.parse(sanitized)
const safe = {
  name: escapeHtml(validated.name),
  email: validated.email.toLowerCase(),
  message: escapeHtml(validated.message),
}
await db.insert(safe)`}
          improvements={[
            { metric: "XSS Protection", before: "None", after: "Full" },
            { metric: "SQL Injection", before: "Vulnerable", after: "Protected" },
            { metric: "Input Validation", before: "Client only", after: "Client + Server" },
          ]}
        />

        <SectionHeader number="05" title="Measuring Refactoring Success" id="measuring-success" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <MetricCard
            title="Code Coverage"
            value="85%"
            change="+55%"
            trend="up"
            description="From 30% before refactoring"
          />
          <MetricCard
            title="Bundle Size"
            value="124kb"
            change="-40%"
            trend="up"
            description="Tree-shaking & code splitting"
          />
          <MetricCard
            title="Build Time"
            value="12s"
            change="-60%"
            trend="up"
            description="Optimized imports & caching"
          />
          <MetricCard
            title="Bug Reports"
            value="2/month"
            change="-80%"
            trend="up"
            description="Down from 10/month"
          />
        </div>

        <SectionHeader number="06" title="Continuous Improvement Process" id="continuous-improvement" />

        <StepFlow
          title="Our Refactoring Workflow"
          steps={[
            { title: "Identify", description: "Spot code smells in reviews" },
            { title: "Plan", description: "Document what needs changing" },
            { title: "Test", description: "Write tests before refactoring" },
            { title: "Refactor", description: "Small, incremental changes" },
            { title: "Verify", description: "Run tests, review, deploy" },
          ]}
        />

        <InfoBox type="tip" title="The Boy Scout Rule">
          Always leave the code better than you found it. Even small improvements - renaming a variable,
          extracting a constant, adding a type annotation - compound over time into significant gains.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaways" id="takeaways" />

        <KeyTakeaway
          title="Refactoring is an Investment"
          points={[
            "Start with clear code smells - don't refactor for its own sake",
            "Write tests first to ensure behavior doesn't change",
            "Make small, incremental changes rather than big-bang rewrites",
            "Extract, centralize, and standardize patterns across the codebase",
            "Measure improvements to justify the investment",
            "Build refactoring into your regular development workflow",
          ]}
        />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
