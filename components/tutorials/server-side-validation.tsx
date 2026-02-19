"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  SectionHeader,
  KeyTakeaway,
  InfoBox,
  ProcessFlow,
  FeatureGrid,
  DecisionTree,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { CodeExplanation } from "@/components/atoms/code-explanation"

export function ServerSideValidationContent() {
  return (
    <div className="space-y-8">
      {/* Introduction */}
      <section>
        <SectionHeader number="01" title="Server-Side Validation with Server Actions" id="overview" />
        <p className="text-muted-foreground leading-relaxed mt-4">
          Client-side validation improves UX, but server-side validation is your security boundary.
          Never trust data from the client -- always validate on the server.
        </p>
      </section>

      <InfoBox type="warning" title="Security First">
        Client-side validation can be bypassed by disabling JavaScript or using dev tools. Server-side validation is your only reliable defense against malicious input.
      </InfoBox>

      <FeatureGrid
        title="What You Will Build"
        features={[
          { title: "Zod Schema", description: "Type-safe validation rules with automatic TypeScript inference" },
          { title: "ActionResult Type", description: "Discriminated union for type-safe success/error responses" },
          { title: "Server Action", description: "Secure server-side function with full validation pipeline" },
          { title: "Error Handling", description: "Field-level error reporting back to the client" },
        ]}
      />

      {/* Step 1 */}
      <section>
        <SectionHeader number="02" title="Step 1: Understanding the Pattern" id="step-1" />
        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          Server actions must validate all incoming data. The pattern follows a clear pipeline.
        </p>
        <ProcessFlow
          title="Server Action Validation Pipeline"
          steps={[
            "Receive raw data from client (FormData or object)",
            "Parse with Zod schema (validates + transforms)",
            "Return field errors if validation fails",
            "Process validated data (save to DB, send email, etc.)",
            "Return typed success result",
          ]}
        />
      </section>

      {/* Step 2 */}
      <section>
        <SectionHeader number="03" title="Step 2: Defining the Zod Schema" id="step-2" />
        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          Zod schemas define your validation rules and automatically infer TypeScript types.
        </p>
        <CodeBlock
          language="typescript"
          title="Solution: Contact form schema"
          code={`import { z } from 'zod'

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(1000),
})

// TypeScript type is automatically inferred:
// type Contact = { name: string; email: string; message: string }`}
        />
        <CodeExplanation
          terms={[
            { term: "z.object({})", description: "Defines a schema for an object shape. Each key maps to a Zod validator that checks the value at runtime." },
            { term: "z.string().min(2).max(100)", description: "Chains validators: must be a string, at least 2 chars, at most 100. Zod checks all constraints in order." },
            { term: "z.string().email()", description: "Built-in email validator. Checks format without a regex -- Zod handles the complexity for you." },
          ]}
          summary="Zod gives you runtime validation and TypeScript types from a single source of truth."
        />
      </section>

      {/* Step 3 */}
      <section>
        <SectionHeader number="04" title="Step 3: Creating the Action Result Type" id="step-3" />
        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          A discriminated union lets TypeScript narrow the type based on a boolean flag.
        </p>
        <CodeBlock
          language="typescript"
          title="Solution: Discriminated union result type"
          code={`type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }`}
        />
        <CodeExplanation
          terms={[
            { term: "ActionResult<T>", description: "A generic type parameterised by T -- the shape of your success data. Reusable across all server actions." },
            { term: "{ success: true; data: T }", description: "The success branch. TypeScript knows that when success is true, data exists and has type T." },
            { term: "{ success: false; error: string }", description: "The error branch. TypeScript knows that when success is false, error exists but data does not." },
            { term: "fieldErrors?: Record<string, string[]>", description: "Optional per-field errors. Maps field names to arrays of error messages." },
          ]}
          summary="This pattern allows TypeScript to narrow the type: after checking result.success, you get full autocomplete on either data or error."
        />
      </section>

      {/* Step 4 */}
      <section>
        <SectionHeader number="05" title="Step 4: Implementing the Server Action" id="step-4" />
        <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
          The complete server action combines the schema, result type, and error handling.
        </p>
        <CodeBlock
          language="typescript"
          title="Solution: Complete server action"
          code={`"use server"

import { z } from 'zod'

export async function submitContact(
  formData: unknown
): Promise<ActionResult<{ id: string }>> {
  const result = ContactSchema.safeParse(formData)
  
  if (!result.success) {
    return {
      success: false,
      error: "Validation failed",
      fieldErrors: result.error.flatten().fieldErrors
    }
  }
  
  const id = await saveContact(result.data)
  return { success: true, data: { id } }
}`}
        />
        <CodeExplanation
          terms={[
            { term: "\"use server\"", description: "Directive that marks this function as a Server Action. It only runs on the server." },
            { term: "formData: unknown", description: "Accept unknown type because client data cannot be trusted. Zod will validate and narrow the type." },
            { term: "ContactSchema.safeParse(formData)", description: "safeParse returns { success, data } or { success, error } without throwing." },
            { term: "result.error.flatten().fieldErrors", description: "Converts Zod's nested error format into a flat Record that maps field names to error messages." },
          ]}
          summary="The 'use server' directive ensures this code never reaches the client. Combined with safeParse, you get a type-safe and secure validation pipeline."
        />
      </section>

      <DecisionTree
        title="When to Use safeParse vs parse"
        decisions={[
          { condition: "You want to handle errors gracefully", result: "Use safeParse() -- returns result object", recommended: true },
          { condition: "You want to throw on invalid data", result: "Use parse() -- throws ZodError", recommended: false },
          { condition: "You are inside a try/catch", result: "Either works -- parse() integrates with catch block" },
        ]}
      />

      <InfoBox type="tip" title="Server Action Security Checklist">
        <ul className="list-disc list-inside space-y-1">
          <li>{"Always use 'use server' directive at the top"}</li>
          <li>Accept unknown type for all inputs</li>
          <li>Use safeParse() instead of parse()</li>
          <li>Return field-level errors for UI highlighting</li>
          <li>Never expose internal error details to the client</li>
          <li>Add rate limiting to prevent abuse</li>
        </ul>
      </InfoBox>

      <KeyTakeaway>
        Server-side validation is not optional -- it is your security boundary. Client-side validation is a UX enhancement; server-side validation is a security requirement.
      </KeyTakeaway>
    </div>
  )
}
