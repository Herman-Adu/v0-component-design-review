"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
  DataFlowDiagram,
  FeatureGrid,
  ComparisonCards,
  BeforeAfterComparison,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  type TOCItem,
  ArticleIcons,
  ArchitectureDiagram,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "the-problem", title: "The Problem", level: 2 },
  { id: "single-source", title: "Single Source of Truth", level: 2 },
  { id: "schema-design", title: "Schema Design Patterns", level: 2 },
  { id: "client-validation", title: "Client-Side Validation", level: 3 },
  { id: "server-validation", title: "Server-Side Validation", level: 3 },
  { id: "advanced-patterns", title: "Advanced Patterns", level: 2 },
  { id: "error-handling", title: "Error Handling", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function ZodValidationArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="important">
          Our forms handle sensitive customer data including contact details, addresses, and service requests. 
          Validation is not optional - it is a critical security and UX requirement that runs on both client and server.
        </InfoBox>

        <SectionHeader number="01" title="The Problem" id="the-problem" />

        <p className="text-muted-foreground mb-6">
          Traditional validation approaches create dangerous gaps between frontend and backend. Types drift, 
          validation rules differ, and bugs slip through the cracks at the worst possible times.
        </p>

        <BeforeAfterComparison
          before={{
            title: "Traditional Approach",
            items: [
              "Types defined separately in frontend and backend",
              "Validation rules duplicated and prone to drift",
              "No compile-time safety for validation logic",
              "Manual synchronization of business rules",
              "Runtime errors discovered in production",
            ],
          }}
          after={{
            title: "Zod Approach",
            items: [
              "Single schema defines types AND validation",
              "Same rules run on client and server",
              "TypeScript types auto-inferred from schemas",
              "Compile-time errors catch mismatches",
              "Runtime validation at all boundaries",
            ],
          }}
        />

        <SectionHeader number="02" title="Single Source of Truth" id="single-source" />

        <p className="text-muted-foreground mb-6">
          With Zod, we define schemas once and derive everything else. This eliminates an entire category 
          of bugs where frontend and backend disagree about data shapes.
        </p>

        <DataFlowDiagram
          title="Schema-First Architecture"
          nodes={[
            { label: "Zod Schema", description: "Single definition", icon: <ArticleIcons.Database className="h-4 w-4" /> },
            { label: "TypeScript Types", description: "Auto-inferred", icon: <ArticleIcons.Code className="h-4 w-4" /> },
            { label: "Client Validation", description: "React Hook Form", icon: <ArticleIcons.Shield className="h-4 w-4" /> },
            { label: "Server Validation", description: "Server Actions", icon: <ArticleIcons.Shield className="h-4 w-4" /> },
          ]}
        />

        <CodeBlock
          filename="lib/validation/schemas.ts"
          code={`import { z } from "zod"

// Define schema ONCE - types are automatically inferred
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  
  email: z
    .string()
    .email("Please enter a valid email address"),
  
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
})

// TypeScript type is automatically derived
export type PersonalInfo = z.infer<typeof personalInfoSchema>
// Result: { firstName: string; lastName: string; email: string; phone: string }`}
        />

        <SectionHeader number="03" title="Schema Design Patterns" id="schema-design" />

        <SubSectionHeader title="Client-Side Validation" id="client-validation" />

        <p className="text-muted-foreground mb-4">
          On the client, Zod integrates seamlessly with React Hook Form through the resolver pattern. 
          Validation runs on blur and submit, providing instant feedback to users.
        </p>

        <CodeBlock
          filename="components/organisms/personal-info-step.tsx"
          code={`import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { personalInfoSchema, type PersonalInfo } from "@/lib/validation/schemas"

export function PersonalInfoStep() {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  // Errors automatically populated from Zod schema
  const { errors } = form.formState
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormInput
        label="First Name"
        error={errors.firstName?.message}
        {...form.register("firstName")}
      />
      {/* TypeScript ensures all fields are covered */}
    </form>
  )
}`}
        />

        <SubSectionHeader title="Server-Side Validation" id="server-validation" />

        <p className="text-muted-foreground mb-4">
          The same schema runs on the server, ensuring malicious clients cannot bypass validation. 
          Server schemas can include additional rules not needed on the client.
        </p>

        <CodeBlock
          filename="lib/actions/service-request.ts"
          code={`"use server"

import { serverFormSchema } from "@/lib/validation/server-schemas"
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer"

export async function submitServiceRequest(formData: unknown) {
  // 1. Parse and validate with Zod
  const result = serverFormSchema.safeParse(formData)
  
  if (!result.success) {
    // Return structured errors to client
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }
  
  // 2. Data is now fully typed and validated
  const validatedData = result.data
  
  // 3. Additional sanitization for XSS prevention
  const sanitizedData = {
    ...validatedData,
    personalInfo: {
      ...validatedData.personalInfo,
      firstName: sanitizeInput(validatedData.personalInfo.firstName),
      lastName: sanitizeInput(validatedData.personalInfo.lastName),
    },
  }
  
  // 4. Safe to use in database/email
  return { success: true, data: sanitizedData }
}`}
        />

        <SectionHeader number="04" title="Advanced Patterns" id="advanced-patterns" />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Schema Composition",
              description: "Combine smaller schemas into larger ones. Our complete form schema is built from 4 step schemas.",
            },
            {
              icon: <ArticleIcons.GitBranch className="h-5 w-5" />,
              title: "Conditional Validation",
              description: "Use .refine() for complex rules like 'emergency requests require phone number'.",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Transform Pipelines",
              description: "Use .transform() to normalize data - trim strings, format phones, convert dates.",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Custom Error Messages",
              description: "Every validation rule has a user-friendly message that appears in the UI.",
            },
          ]}
        />

        <CodeBlock
          filename="Advanced Schema Patterns"
          code={`// Schema Composition
export const completeFormSchema = z.object({
  personalInfo: personalInfoSchema,
  serviceDetails: serviceDetailsSchema,
  propertyInfo: propertyInfoSchema,
  schedulePreferences: schedulePreferencesSchema,
})

// Conditional Validation
export const serviceSchema = z.object({
  urgency: z.enum(["routine", "urgent", "emergency"]),
  phone: z.string().optional(),
}).refine(
  (data) => data.urgency !== "emergency" || data.phone,
  { message: "Phone required for emergencies", path: ["phone"] }
)

// Transform Pipeline
export const phoneSchema = z.string()
  .transform(val => val.replace(/\\D/g, "")) // Remove non-digits
  .pipe(z.string().min(10, "Phone must be 10+ digits"))`}
        />

        <SectionHeader number="05" title="Error Handling" id="error-handling" />

        <p className="text-muted-foreground mb-4">
          Zod provides structured error objects that map directly to form fields. We transform these 
          into user-friendly messages with consistent formatting.
        </p>

        <ArchitectureDiagram
          title="Error Flow"
          layers={[
            { name: "User Input", items: ["Form Fields", "File Uploads", "Selections"], color: "#3b82f6" },
            { name: "Zod Validation", items: ["Type Checking", "Constraints", "Custom Rules"], color: "#f59e0b" },
            { name: "Error Handling", items: ["Field Mapping", "Message Formatting", "UI Display"], color: "#ef4444" },
          ]}
        />

        <CodeBlock
          filename="Error Handling Pattern"
          code={`// Server-side error extraction
const result = schema.safeParse(data)

if (!result.success) {
  const fieldErrors: Record<string, string[]> = {}
  
  result.error.issues.forEach((issue) => {
    const path = issue.path.join(".")
    if (!fieldErrors[path]) fieldErrors[path] = []
    fieldErrors[path].push(issue.message)
  })
  
  return { success: false, fieldErrors }
}

// Client-side error display
{errors.email && (
  <p className="text-sm text-red-500 mt-1">
    {errors.email.message}
  </p>
)}`}
        />

        <ComparisonCards
          idealTitle="Zod Excels At"
          notIdealTitle="Consider Alternatives For"
          idealFor={[
            "Form validation (client + server)",
            "API request/response validation",
            "Environment variable validation",
            "Configuration file parsing",
            "Runtime type checking at boundaries",
          ]}
          notIdealFor={[
            "Heavy computational validation (use workers)",
            "File content validation (use specialized libs)",
            "Real-time validation of large datasets",
            "Validation that requires async database checks",
          ]}
        />

        <SectionHeader number="06" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Define schemas as the single source of truth. Let Zod infer your TypeScript types, 
          power your form validation, and guard your server actions. The result is bulletproof 
          type safety from form input to database - with zero type duplication.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { title: "Server Actions: Beyond the Basics", href: "/dashboard/content-library/articles/server-actions-deep-dive", level: "intermediate" },
            { title: "Multi-Step Form Architecture", href: "/dashboard/content-library/articles/multi-step-form-architecture", level: "intermediate" },
            { title: "Security Architecture Deep Dive", href: "/dashboard/content-library/articles/security-architecture-deep-dive", level: "advanced" },
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
