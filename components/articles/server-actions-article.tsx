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
  VerticalFlow,
  DataFlowDiagram,
  type TOCItem,
  ArticleIcons,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "what-are-server-actions", title: "What Are Server Actions?", level: 2 },
  { id: "our-pipeline", title: "Our Server Action Pipeline", level: 2 },
  { id: "security-layer", title: "Security Layer", level: 3 },
  { id: "validation-layer", title: "Validation Layer", level: 3 },
  { id: "business-logic", title: "Business Logic Layer", level: 3 },
  { id: "error-handling", title: "Error Handling", level: 2 },
  { id: "response-patterns", title: "Response Patterns", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function ServerActionsArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="info">
          Server Actions simplified our API layer by eliminating the need for separate API routes. 
          But production use requires more than the basics - security, validation, error handling, 
          and consistent response patterns.
        </InfoBox>

        <SectionHeader number="01" title="What Are Server Actions?" id="what-are-server-actions" />

        <p className="text-muted-foreground mb-6">
          Server Actions are async functions that run on the server, callable directly from Client 
          Components. They replace traditional API routes for mutations, providing automatic request 
          handling, error boundaries, and progressive enhancement.
        </p>

        <ComparisonCards
          idealTitle="Server Actions Excel At"
          notIdealTitle="Use API Routes Instead For"
          idealFor={[
            "Form submissions and mutations",
            "Database operations (CRUD)",
            "Email sending and notifications",
            "File processing after upload",
            "Any action triggered by user interaction",
          ]}
          notIdealFor={[
            "Webhooks from external services",
            "Public APIs consumed by third parties",
            "Long-running background jobs",
            "Streaming responses",
            "GraphQL endpoints",
          ]}
        />

        <CodeBlock
          filename="Basic Server Action"
          code={`// lib/actions/service-request.ts
"use server"

export async function submitServiceRequest(formData: FormData) {
  // This runs on the server
  const email = formData.get("email") as string
  
  // Access server-only resources
  await db.insert(serviceRequests).values({ email })
  
  // Return data to the client
  return { success: true }
}

// Usage in Client Component
"use client"
import { submitServiceRequest } from "@/lib/actions/service-request"

export function ServiceForm() {
  const handleSubmit = async (formData: FormData) => {
    const result = await submitServiceRequest(formData)
    if (result.success) {
      // Handle success
    }
  }
  
  return <form action={handleSubmit}>...</form>
}`}
        />

        <SectionHeader number="02" title="Our Server Action Pipeline" id="our-pipeline" />

        <p className="text-muted-foreground mb-4">
          Every Server Action in our application follows a consistent pipeline that handles 
          security, validation, and error handling in a predictable order.
        </p>

        <VerticalFlow
          title="Request Processing Pipeline"
          steps={[
            { title: "1. Security Check", description: "Origin validation and rate limiting before any processing", icon: <ArticleIcons.Shield className="h-4 w-4" /> },
            { title: "2. Input Sanitization", description: "Neutralize XSS vectors in all string inputs", icon: <ArticleIcons.Code className="h-4 w-4" /> },
            { title: "3. Schema Validation", description: "Validate data structure and business rules with Zod", icon: <ArticleIcons.Check className="h-4 w-4" /> },
            { title: "4. Business Logic", description: "Process the validated, secure data", icon: <ArticleIcons.Zap className="h-4 w-4" /> },
            { title: "5. Response", description: "Return structured success or error response", icon: <ArticleIcons.Target className="h-4 w-4" /> },
          ]}
        />

        <SubSectionHeader title="Security Layer" id="security-layer" />

        <p className="text-muted-foreground mb-4">
          Security checks run first, before we touch any user data. If security fails, we 
          reject the request immediately.
        </p>

        <CodeBlock
          filename="Security Check Implementation"
          code={`"use server"

import { securityCheck, rateLimiters } from "@/lib/security"
import { sanitizeObject } from "@/lib/sanitize/input-sanitizer"

export async function submitServiceRequest(data: unknown) {
  // Step 1: Security check (origin + rate limit)
  const security = await securityCheck(rateLimiters.serviceRequest)
  
  if (!security.passed) {
    return {
      success: false,
      error: security.error, // "Invalid origin" or "Rate limit exceeded"
    }
  }
  
  // Security passed, continue to sanitization...
}`}
        />

        <SubSectionHeader title="Validation Layer" id="validation-layer" />

        <p className="text-muted-foreground mb-4">
          After security checks, we sanitize inputs and validate against our Zod schemas. 
          This catches malformed data that could cause issues downstream.
        </p>

        <CodeBlock
          filename="Validation Implementation"
          code={`export async function submitServiceRequest(data: unknown) {
  // ... security check ...
  
  // Step 2: Sanitize all string inputs
  const sanitizedData = sanitizeObject(data as Record<string, unknown>)
  
  // Step 3: Validate with Zod schema
  const result = serverFormSchema.safeParse(sanitizedData)
  
  if (!result.success) {
    // Return structured validation errors
    return {
      success: false,
      fieldErrors: result.error.flatten().fieldErrors,
      // Example: { "personalInfo.email": ["Invalid email format"] }
    }
  }
  
  // Data is now typed, validated, and sanitized
  const validatedData = result.data
  
  // Continue to business logic...
}`}
        />

        <SubSectionHeader title="Business Logic Layer" id="business-logic" />

        <p className="text-muted-foreground mb-4">
          With validated data, we can safely execute business logic. Our forms send dual 
          emails - one to the customer and one to the business.
        </p>

        <DataFlowDiagram
          title="Business Logic Flow"
          nodes={[
            { label: "Validated Data", description: "Type-safe input", icon: <ArticleIcons.Database className="h-4 w-4" /> },
            { label: "Email Service", description: "Dual notifications", icon: <ArticleIcons.Zap className="h-4 w-4" /> },
            { label: "Customer Email", description: "Confirmation", icon: <ArticleIcons.Users className="h-4 w-4" /> },
            { label: "Business Email", description: "Notification", icon: <ArticleIcons.Target className="h-4 w-4" /> },
          ]}
        />

        <CodeBlock
          filename="Business Logic Implementation"
          code={`export async function submitServiceRequest(data: unknown) {
  // ... security + validation ...
  
  // Step 4: Business logic with validated data
  try {
    // Send dual emails
    const emailService = new EmailService()
    
    await Promise.all([
      emailService.sendCustomerConfirmation({
        to: validatedData.personalInfo.email,
        name: validatedData.personalInfo.firstName,
        serviceType: validatedData.serviceDetails.serviceType,
        urgency: validatedData.serviceDetails.urgency,
      }),
      emailService.sendBusinessNotification({
        customerName: \`\${validatedData.personalInfo.firstName} \${validatedData.personalInfo.lastName}\`,
        serviceType: validatedData.serviceDetails.serviceType,
        urgency: validatedData.serviceDetails.urgency,
        scheduledDate: validatedData.schedulePreferences.preferredDate,
      }),
    ])
    
    return { success: true }
  } catch (error) {
    // Handle errors gracefully
    console.error("Service request failed:", error)
    return {
      success: false,
      error: "Failed to process request. Please try again.",
    }
  }
}`}
        />

        <SectionHeader number="03" title="Error Handling" id="error-handling" />

        <p className="text-muted-foreground mb-4">
          Server Actions can fail at multiple points. We use a consistent error handling 
          approach that provides useful feedback without exposing internal details.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Security Errors",
              description: "Generic messages like 'Invalid request' - never reveal security implementation details.",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Validation Errors",
              description: "Field-level errors mapped to form fields for inline display.",
            },
            {
              icon: <ArticleIcons.AlertTriangle className="h-5 w-5" />,
              title: "Business Logic Errors",
              description: "User-friendly messages with retry suggestions when appropriate.",
            },
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Unexpected Errors",
              description: "Logged to monitoring, generic message to user, never expose stack traces.",
            },
          ]}
        />

        <CodeBlock
          filename="Error Handling Pattern"
          code={`// lib/errors/error-handler.ts
export function handleActionError(error: unknown): ActionResult {
  // Log for debugging (server-side only)
  console.error("Action error:", error)
  
  // Known error types
  if (error instanceof ValidationError) {
    return {
      success: false,
      fieldErrors: error.fieldErrors,
    }
  }
  
  if (error instanceof RateLimitError) {
    return {
      success: false,
      error: \`Too many requests. Please wait \${error.retryAfter} seconds.\`,
    }
  }
  
  if (error instanceof EmailDeliveryError) {
    return {
      success: false,
      error: "Failed to send confirmation email. Your request was received.",
    }
  }
  
  // Unknown errors - never expose details
  return {
    success: false,
    error: "An unexpected error occurred. Please try again.",
  }
}`}
        />

        <SectionHeader number="04" title="Response Patterns" id="response-patterns" />

        <p className="text-muted-foreground mb-4">
          All Server Actions return a consistent response structure that the client can 
          reliably parse and handle.
        </p>

        <CodeBlock
          filename="Response Types"
          code={`// Consistent response structure
type ActionResult =
  | { success: true; data?: unknown }
  | { success: false; error: string }
  | { success: false; fieldErrors: Record<string, string[]> }

// Client-side handling
const result = await submitServiceRequest(formData)

if (result.success) {
  // Show success message, reset form, redirect
  toast.success("Request submitted successfully!")
  resetForm()
  router.push("/confirmation")
} else if ("fieldErrors" in result) {
  // Map errors to form fields
  Object.entries(result.fieldErrors).forEach(([field, messages]) => {
    form.setError(field, { message: messages[0] })
  })
} else {
  // Show general error
  toast.error(result.error)
}`}
        />

        <InfoBox type="tip" title="Progressive Enhancement">
          Server Actions work without JavaScript through native form submissions. For the best 
          UX, use the useFormStatus hook to show loading states and useOptimistic for instant 
          feedback on mutations.
        </InfoBox>

        <SectionHeader number="05" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Server Actions are powerful but need a consistent pipeline pattern. Always run 
          security checks first, sanitize inputs, validate with Zod, then execute business 
          logic. Use structured responses that the client can reliably handle. Never expose 
          internal error details to users - log them server-side and return generic messages.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { title: "Security Architecture Deep Dive", href: "/dashboard/content-library/articles/security-architecture-deep-dive", level: "advanced" },
            { title: "Type-Safe Validation with Zod", href: "/dashboard/content-library/articles/typescript-zod-validation", level: "beginner" },
            { title: "Building a Production Email System", href: "/dashboard/content-library/articles/email-system-architecture", level: "advanced" },
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
