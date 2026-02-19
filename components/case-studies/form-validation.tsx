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
  VerticalFlow,
  DataFlowDiagram,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "context", title: "Context", level: 2 },
  { id: "vulnerability-audit", title: "Vulnerability Audit", level: 2 },
  { id: "dual-layer-design", title: "Dual-Layer Design", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "sanitization", title: "Sanitization Pipeline", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function FormValidationContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Context" id="context" />

        <p className="text-muted-foreground mb-6">
          Our multi-step service request form was handling real customer data - names, email addresses,
          phone numbers, property details, and free-text messages. Initially, all validation happened 
          exclusively in the browser using basic JavaScript checks. A simple DevTools session could bypass
          every validation rule and submit arbitrary data directly to our server actions.
        </p>

        <InfoBox type="warning" title="The Risk">
          Client-side validation is a user experience tool, not a security measure. Any validation that
          only runs in the browser can be bypassed by anyone with DevTools, a REST client, or basic
          scripting knowledge. Server-side validation is the actual security boundary.
        </InfoBox>

        <SectionHeader number="02" title="Vulnerability Audit" id="vulnerability-audit" />

        <p className="text-muted-foreground mb-6">
          We conducted a security review that revealed multiple attack vectors in our form handling.
          The audit simulated what a malicious actor could do with our unprotected endpoints.
        </p>

        <ComparisonCards
          leftTitle="Attack Vectors Found"
          leftItems={[
            "Direct API calls bypassing client validation entirely",
            "XSS payloads in free-text fields rendered unsanitised",
            "Type coercion exploits (string where number expected)",
            "Oversized payloads with no length limits",
            "Missing email/phone format enforcement server-side",
          ]}
          rightTitle="Protection Required"
          rightItems={[
            "Server-side schema validation on every submission",
            "HTML entity encoding and XSS sanitisation",
            "Strict type checking with TypeScript + Zod",
            "Input length limits enforced at schema level",
            "Regex-based format validation for emails and phones",
          ]}
          leftType="negative"
          rightType="positive"
        />

        <SectionHeader number="03" title="Dual-Layer Design" id="dual-layer-design" />

        <p className="text-muted-foreground mb-6">
          The solution was a dual-layer validation architecture where client and server share the same
          Zod schemas. The client layer provides instant UX feedback; the server layer provides the
          actual security boundary. Both use identical rules, ensuring consistency.
        </p>

        <ArchitectureDiagram
          title="Validation Architecture"
          layers={[
            { name: "Client Layer (UX)", items: ["Instant feedback", "Field-level errors", "Format hints", "Progressive disclosure"], color: "#3b82f6" },
            { name: "Shared Zod Schemas", items: ["personalInfoSchema", "serviceSchema", "propertySchema", "scheduleSchema"], color: "#8b5cf6" },
            { name: "Server Layer (Security)", items: ["Input sanitisation", "Schema validation", "Type enforcement", "Length limits"], color: "#22c55e" },
            { name: "Database", items: ["Only validated, sanitised data reaches storage"], color: "#6b7280" },
          ]}
        />

        <DataFlowDiagram
          title="Data Flow Through Validation"
          nodes={[
            { label: "User Input", description: "Raw form data" },
            { label: "Client Validate", description: "UX feedback" },
            { label: "Server Sanitise", description: "Strip dangerous content" },
            { label: "Server Validate", description: "Zod schema check" },
            { label: "Database", description: "Clean data stored" },
          ]}
        />

        <SectionHeader number="04" title="Implementation" id="implementation" />

        <CodeBlock
          filename="lib/validation/schemas.ts"
          language="typescript"
          code={`import { z } from "zod"

// Shared schema - used by both client and server
export const personalInfoSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters")
    .transform((val) => val.trim()),
  
  email: z.string()
    .email("Please enter a valid email address")
    .max(254, "Email must be under 254 characters")
    .transform((val) => val.toLowerCase().trim()),
  
  phone: z.string()
    .regex(
      /^(?:(?:\\+44)|0)\\s?\\d{4}\\s?\\d{6}$/,
      "Please enter a valid UK phone number"
    ),
  
  message: z.string()
    .min(10, "Please provide more detail")
    .max(2000, "Message must be under 2000 characters"),
})

export type PersonalInfo = z.infer<typeof personalInfoSchema>`}
        />

        <BeforeAfterComparison
          beforeTitle="Before: Client-Only Validation"
          beforeCode={`// Easy to bypass via DevTools
const onSubmit = async (data: any) => {
  if (!data.email.includes("@")) {
    setError("Invalid email")
    return
  }
  // No server check - data goes straight to DB
  await fetch("/api/submit", {
    method: "POST",
    body: JSON.stringify(data),
  })
}`}
          afterTitle="After: Dual-Layer with Shared Schema"
          afterCode={`"use server"

import { personalInfoSchema } from "@/lib/validation"
import { sanitiseInput } from "@/lib/security"

export async function submitForm(rawData: unknown) {
  // 1. Sanitise all string inputs
  const sanitised = sanitiseFormData(rawData)
  
  // 2. Validate against shared Zod schema
  const result = personalInfoSchema.safeParse(sanitised)
  
  if (!result.success) {
    return { 
      success: false, 
      errors: formatZodErrors(result.error) 
    }
  }
  
  // 3. Only clean, validated data reaches DB
  return await saveToDatabase(result.data)
}`}
          improvements={[
            { metric: "Validation layers", before: "Client only", after: "Client + Server" },
            { metric: "Schema sharing", before: "None (duplicated)", after: "Single source of truth" },
            { metric: "Type safety", before: "any types", after: "Full Zod inference" },
          ]}
        />

        <SectionHeader number="05" title="Sanitisation Pipeline" id="sanitization" />

        <p className="text-muted-foreground mb-6">
          Beyond validation, we implemented a sanitisation pipeline that strips dangerous content
          before it reaches validation. This provides defence-in-depth against XSS, injection, and
          other content-based attacks.
        </p>

        <CodeBlock
          filename="lib/security/sanitise.ts"
          language="typescript"
          code={`// Sanitisation runs BEFORE validation
export function sanitiseFormData<T extends Record<string, unknown>>(
  data: T
): T {
  const sanitised = {} as T
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      sanitised[key as keyof T] = sanitiseString(value) as T[keyof T]
    } else {
      sanitised[key as keyof T] = value as T[keyof T]
    }
  }
  
  return sanitised
}

function sanitiseString(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim()
}`}
        />

        <ProcessFlow
          title="Security Pipeline Order"
          steps={[
            { label: "Receive", sublabel: "Raw input from client" },
            { label: "Sanitise", sublabel: "Strip HTML entities", color: "yellow" },
            { label: "Validate", sublabel: "Zod schema check", color: "blue" },
            { label: "Store", sublabel: "Clean data to DB", color: "green" },
          ]}
        />

        <SectionHeader number="06" title="Results & Metrics" id="results" />

        <StatsTable
          title="Security Improvement Metrics"
          headers={["Metric", "Before", "After", "Improvement"]}
          rows={caseStudy.results.metrics.map((m) => [m.label, m.before, m.after, m.improvement])}
        />

        <InfoBox type="tip" title="For CTOs and Tech Leads">
          The dual-layer approach costs almost nothing in development time when you share schemas.
          The Zod schema is written once and imported by both client and server. There is no duplication
          to maintain, and TypeScript ensures the types stay in sync automatically.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          Client validation is for user experience; server validation is for security. Never trust
          client data. By sharing Zod schemas between client and server, you get instant UX feedback
          and robust security with zero duplication. The shared schema becomes the single source
          of truth for what valid data looks like in your application.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { href: "/dashboard/content-library/case-studies/security-layer-implementation", title: "Security Layer Implementation", level: "advanced" },
            { href: "/dashboard/content-library/articles/refactoring-for-maintainability", title: "Refactoring for Maintainability", level: "intermediate" },
          ]}
        />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
