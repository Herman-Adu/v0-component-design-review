"use client"

import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Server, Mail, Shield, FileCheck } from "lucide-react"

const SECTIONS = [
  { id: "overview", title: "Server Actions Overview" },
  { id: "submission-flow", title: "Secure Submission Flow" },
  { id: "implementation", title: "Implementation Details" },
  { id: "reference-ids", title: "Reference ID Patterns" },
  { id: "email-integration", title: "Email Notification Integration" },
  { id: "file-structure", title: "File Structure & Env Vars" },
]

export default function APIIntegrationPage() {
  return (
    <DocPage
      title="Server Actions & API Integration"
      description="Complete guide to the server action architecture, secure submission flow, and email notification integration."
      icon={Server}
      badges={[
        { label: "4 Server Actions" },
        { label: "Zod Validation" },
        { label: "React Email" },
        { label: "Resend Integration" },
      ]}
      tags={["server-actions", "api", "email", "security"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* Server Actions Overview */}
      <section className="space-y-6">
        <DocSectionHeader id="overview">Server Actions Overview</DocSectionHeader>
        
        <p className="text-foreground leading-relaxed">
          This application uses <strong>Next.js Server Actions</strong> for all form submissions. 
          Server Actions provide type-safe, secure server-side processing without the need for 
          separate API routes.
        </p>

        <div className="responsive-grid-3">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">submitServiceRequest</CardTitle>
              </div>
              <CardDescription>Service booking form submission</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <code className="text-xs bg-muted px-1 rounded">lib/actions/service-request.ts</code>
              <ul className="mt-2 space-y-1">
                <li>Validates personal, service, property, schedule data</li>
                <li>{"Generates SR-* reference ID"}</li>
                <li>{"Sends customer + business emails"}</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">submitContactRequest</CardTitle>
              </div>
              <CardDescription>Contact form with reference linking</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <code className="text-xs bg-muted px-1 rounded">lib/actions/contact-request.ts</code>
              <ul className="mt-2 space-y-1">
                <li>{"CSRF protection + rate limiting"}</li>
                <li>{"Generates CR-* reference ID"}</li>
                <li>Links to existing service requests</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">submitQuotationRequest</CardTitle>
              </div>
              <CardDescription>Project quotation submission</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <code className="text-xs bg-muted px-1 rounded">lib/actions/quotation-request.ts</code>
              <ul className="mt-2 space-y-1">
                <li>Complex project scope validation</li>
                <li>{"Generates QR-* reference ID"}</li>
                <li>Budget and timeline processing</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-accent" />
                <CardTitle className="text-lg">renderEmail</CardTitle>
              </div>
              <CardDescription>Email preview rendering</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <code className="text-xs bg-muted px-1 rounded">lib/actions/render-email.ts</code>
              <ul className="mt-2 space-y-1">
                <li>Admin-only email preview</li>
                <li>Renders React Email templates</li>
                <li>Returns HTML for preview</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Submission Flow */}
      <section className="space-y-6">
        <DocSectionHeader id="submission-flow">Secure Submission Flow</DocSectionHeader>
        
        <Callout type="info" title="Defense in Depth">
          Every server action follows the same security pattern: CSRF check, rate limiting, 
          schema validation, input sanitization, then business logic. This ensures multiple 
          protection layers for every request.
        </Callout>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Request Processing Pipeline</h3>
          <div className="space-y-4">
            {[
              { step: 1, title: "CSRF Protection", desc: "Validate request origin header matches allowed domains" },
              { step: 2, title: "Rate Limiting", desc: "Check client identifier against sliding window rate limit" },
              { step: 3, title: "Input Sanitization", desc: "Clean all string inputs (text, email, phone, address)" },
              { step: 4, title: "Schema Validation", desc: "Validate structure and types with Zod server schemas" },
              { step: 5, title: "Business Logic", desc: "Generate reference ID, process data, send emails" },
              { step: 6, title: "Safe Response", desc: "Return only safe data (reference ID, success status)" },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex items-start gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                  {step}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{title}</h4>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Server Action Implementations */}
      <section className="space-y-6">
        <DocSectionHeader id="implementation">Implementation Details</DocSectionHeader>

        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="contact">Contact Form</TabsTrigger>
            <TabsTrigger value="quotation">Quotation</TabsTrigger>
            <TabsTrigger value="service">Service Request</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contact" className="space-y-4">
            <Spoiler title="View Contact Form Server Action" defaultOpen>
              <CodeBlock
                title="lib/actions/contact-request.ts"
                language="typescript"
                code={`"use server"

import { headers } from "next/headers"
import { serverContactFormSchema, type CompleteContactFormInput } from "@/features/contact/schemas/contact-schemas"
import { sendContactEmails } from "@/lib/email/services/contact-email-service"
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer"
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limiter"
import { securityCheck } from "@/lib/security/csrf"

export interface ContactSubmissionResult {
  success: boolean
  referenceId?: string
  error?: string
  fieldErrors?: Record<string, string[]>
}

function generateContactReferenceId(): string {
  const uuid = crypto.randomUUID().split("-")[0].toUpperCase()
  const timestamp = Date.now().toString(36).toUpperCase()
  return \`CR-\${timestamp}-\${uuid}\`
}

export async function submitContactRequest(
  data: CompleteContactFormInput
): Promise<ContactSubmissionResult> {
  try {
    // 1. Security checks
    const security = await securityCheck({ validateOriginHeader: true })
    if (!security.valid) {
      return { success: false, error: security.error || "Security validation failed." }
    }

    // 2. Rate limiting
    const headersList = await headers()
    const clientId = getClientIdentifier(headersList)
    const rateLimitResult = rateLimiters.contactForm.check(clientId)
    if (!rateLimitResult.allowed) {
      return { success: false, error: "Too many requests. Please wait a moment." }
    }

    // 3. Sanitize all string inputs
    const sanitizedData = {
      contactInfo: {
        fullName: sanitizeInput.text(data.contactInfo.fullName),
        email: sanitizeInput.email(data.contactInfo.email),
        phone: sanitizeInput.phone(data.contactInfo.phone),
        company: data.contactInfo.company ? sanitizeInput.text(data.contactInfo.company) : undefined,
      },
      inquiryType: {
        inquiryType: data.inquiryType.inquiryType,
        sector: data.inquiryType.sector,
        priority: data.inquiryType.priority,
      },
      referenceLinking: {
        hasExistingReference: data.referenceLinking.hasExistingReference,
        referenceType: data.referenceLinking.referenceType,
        referenceId: data.referenceLinking.referenceId ? sanitizeInput.text(data.referenceLinking.referenceId) : undefined,
        referenceDescription: data.referenceLinking.referenceDescription ? sanitizeInput.text(data.referenceLinking.referenceDescription) : undefined,
      },
      messageDetails: {
        subject: sanitizeInput.text(data.messageDetails.subject),
        message: sanitizeInput.text(data.messageDetails.message),
        preferredContactMethod: data.messageDetails.preferredContactMethod,
        bestTimeToContact: data.messageDetails.bestTimeToContact,
        newsletterOptIn: data.messageDetails.newsletterOptIn,
      },
    }

    // 4. Validate with server-side schema
    const validationResult = serverContactFormSchema.safeParse(sanitizedData)
    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {}
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".")
        if (!fieldErrors[path]) fieldErrors[path] = []
        fieldErrors[path].push(issue.message)
      })
      return { success: false, error: "Validation failed", fieldErrors }
    }

    // 5. Generate reference ID and send emails
    const referenceId = generateContactReferenceId()
    const emailResult = await sendContactEmails({ ...validationResult.data, referenceId })
    if (!emailResult.success) {
      return { success: false, error: emailResult.error || "Failed to send confirmation emails" }
    }

    // 6. Return safe response
    return { success: true, referenceId }
  } catch (error) {
    console.error("Contact submission error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}`}
              />
            </Spoiler>
          </TabsContent>
          
          <TabsContent value="quotation" className="space-y-4">
            <Spoiler title="View Quotation Server Action" defaultOpen>
              <CodeBlock
                title="lib/actions/quotation-request.ts"
                language="typescript"
                code={`"use server"

import { headers } from "next/headers"
import { completeQuotationSchema, type CompleteQuotationInput } from "@/lib/validation/quotation-schemas"
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer"
import { sendQuotationRequestEmails } from "@/lib/email/services/quotation-email-service"
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limiter"
import { securityCheck } from "@/lib/security/csrf"

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function submitQuotationRequest(
  formData: unknown
): Promise<ActionResult<{ requestId: string }>> {
  try {
    const security = await securityCheck({ validateOriginHeader: true })
    if (!security.valid) {
      return { success: false, error: security.error || "Security validation failed." }
    }

    const headersList = await headers()
    const clientId = getClientIdentifier(headersList)
    const rateLimitResult = rateLimiters.quotationRequest.check(clientId)
    if (!rateLimitResult.allowed) {
      return { success: false, error: "Too many requests. Please wait a few minutes." }
    }

    const sanitizedData = sanitizeQuotationFormData(formData)
    const validationResult = completeQuotationSchema.safeParse(sanitizedData)
    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {}
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".")
        if (!fieldErrors[path]) fieldErrors[path] = []
        fieldErrors[path].push(issue.message)
      })
      return { success: false, error: "Validation failed", fieldErrors }
    }

    const uuid = crypto.randomUUID().split("-")[0].toUpperCase()
    const timestamp = Date.now().toString(36).toUpperCase()
    const requestId = \`QR-\${timestamp}-\${uuid}\`

    await sendQuotationRequestEmails({ formData: validationResult.data, requestId })
    return { success: true, data: { requestId } }
  } catch (error) {
    console.error("Quotation action error:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}

function sanitizeQuotationFormData(data: unknown): unknown {
  if (!data || typeof data !== "object") return data
  const formData = data as Record<string, any>
  return {
    contact: {
      fullName: sanitizeInput.text(formData.contact?.fullName || ""),
      email: sanitizeInput.email(formData.contact?.email || ""),
      phone: sanitizeInput.phone(formData.contact?.phone || ""),
      company: formData.contact?.company ? sanitizeInput.text(formData.contact.company) : undefined,
    },
    projectType: {
      projectCategory: formData.projectType?.projectCategory || "",
      projectType: formData.projectType?.projectType || "",
      propertyType: formData.projectType?.propertyType || "",
    },
    scope: {
      projectDescription: sanitizeInput.text(formData.scope?.projectDescription || ""),
      estimatedSize: formData.scope?.estimatedSize || "",
      services: Array.isArray(formData.scope?.services) ? formData.scope.services : [],
      hasDrawings: Boolean(formData.scope?.hasDrawings),
      needsDesign: Boolean(formData.scope?.needsDesign),
    },
    site: {
      addressLine1: sanitizeInput.address(formData.site?.addressLine1 || ""),
      addressLine2: formData.site?.addressLine2 ? sanitizeInput.address(formData.site.addressLine2) : undefined,
      city: sanitizeInput.text(formData.site?.city || ""),
      county: formData.site?.county ? sanitizeInput.text(formData.site.county) : undefined,
      postcode: sanitizeInput.postcode(formData.site?.postcode || ""),
      siteAccessNotes: formData.site?.siteAccessNotes ? sanitizeInput.text(formData.site.siteAccessNotes) : undefined,
      hasExistingElectrical: Boolean(formData.site?.hasExistingElectrical ?? true),
      requiresAsbestosSurvey: Boolean(formData.site?.requiresAsbestosSurvey),
    },
    budget: {
      budgetRange: formData.budget?.budgetRange || "",
      timeline: formData.budget?.timeline || "",
      preferredStartDate: formData.budget?.preferredStartDate || undefined,
      flexibleOnBudget: Boolean(formData.budget?.flexibleOnBudget),
      flexibleOnTimeline: Boolean(formData.budget?.flexibleOnTimeline ?? true),
    },
    additional: {
      complianceRequirements: Array.isArray(formData.additional?.complianceRequirements) ? formData.additional.complianceRequirements : [],
      specialRequirements: formData.additional?.specialRequirements ? sanitizeInput.text(formData.additional.specialRequirements) : undefined,
      preferredContactMethod: formData.additional?.preferredContactMethod || "",
      howDidYouHear: formData.additional?.howDidYouHear || undefined,
      marketingConsent: Boolean(formData.additional?.marketingConsent),
      termsAccepted: Boolean(formData.additional?.termsAccepted),
    },
  }
}`}
              />
            </Spoiler>
          </TabsContent>
          
          <TabsContent value="service" className="space-y-4">
            <Spoiler title="View Service Request Server Action" defaultOpen>
              <CodeBlock
                title="lib/actions/service-request.ts"
                language="typescript"
                code={`"use server"

import { serverCompleteFormSchema, validateBusinessRules } from "@/lib/validation/server-schemas"
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer"
import { sendServiceRequestEmails } from "@/lib/email/services/email-service"

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function submitServiceRequest(
  formData: unknown
): Promise<ActionResult<{ requestId: string }>> {
  try {
    const sanitizedData = sanitizeFormData(formData)
    const validationResult = serverCompleteFormSchema.safeParse(sanitizedData)
    if (!validationResult.success) {
      const fieldErrors: Record<string, string[]> = {}
      validationResult.error.issues.forEach((issue) => {
        const path = issue.path.join(".")
        if (!fieldErrors[path]) fieldErrors[path] = []
        fieldErrors[path].push(issue.message)
      })
      return { success: false, error: "Validation failed", fieldErrors }
    }

    const businessValidation = validateBusinessRules(validationResult.data)
    if (!businessValidation.valid) {
      return { success: false, error: businessValidation.errors.join(", ") }
    }

    const requestId = \`SR-\${Date.now()}-\${Math.random().toString(36).substring(7).toUpperCase()}\`
    await sendServiceRequestEmails({ formData: validationResult.data, requestId })
    return { success: true, data: { requestId } }
  } catch (error) {
    console.error("Server action error:", error)
    return { success: false, error: "An unexpected error occurred." }
  }
}

function sanitizeFormData(data: unknown): unknown {
  if (!data || typeof data !== "object") return data
  const formData = data as Record<string, any>
  return {
    personalInfo: {
      firstName: sanitizeInput.text(formData.personalInfo?.firstName || ""),
      lastName: sanitizeInput.text(formData.personalInfo?.lastName || ""),
      email: sanitizeInput.email(formData.personalInfo?.email || ""),
      phone: sanitizeInput.phone(formData.personalInfo?.phone || ""),
    },
    serviceDetails: {
      serviceType: sanitizeInput.text(formData.serviceDetails?.serviceType || ""),
      urgency: formData.serviceDetails?.urgency || "",
      description: sanitizeInput.text(formData.serviceDetails?.description || ""),
    },
    propertyInfo: {
      address: sanitizeInput.address(formData.propertyInfo?.address || ""),
      city: sanitizeInput.text(formData.propertyInfo?.city || ""),
      county: formData.propertyInfo?.county ? sanitizeInput.text(formData.propertyInfo.county) : undefined,
      postcode: sanitizeInput.postcode(formData.propertyInfo?.postcode || ""),
      propertyType: formData.propertyInfo?.propertyType || "",
      accessInstructions: formData.propertyInfo?.accessInstructions ? sanitizeInput.text(formData.propertyInfo.accessInstructions) : undefined,
    },
    schedulePreferences: {
      preferredDate: formData.schedulePreferences?.preferredDate || "",
      preferredTimeSlot: formData.schedulePreferences?.preferredTimeSlot || "",
      alternativeDate: formData.schedulePreferences?.alternativeDate || undefined,
      flexibleScheduling: Boolean(formData.schedulePreferences?.flexibleScheduling),
    },
  }
}`}
              />
            </Spoiler>
          </TabsContent>
        </Tabs>
      </section>

      {/* Reference ID Patterns */}
      <section className="space-y-6">
        <DocSectionHeader id="reference-ids">Reference ID Patterns</DocSectionHeader>
        
        <p className="text-foreground leading-relaxed">
          Each form type generates unique, traceable reference IDs with prefixes that 
          identify the request type. These IDs use <code className="bg-muted px-1 rounded">crypto.randomUUID()</code> for unpredictability.
        </p>

        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-4">Reference ID Formats</h3>
          <div className="space-y-3">
            {[
              { prefix: "SR-*", label: "Service Request (e.g., SR-1234567890-ABC123)" },
              { prefix: "CR-*", label: "Contact Request (e.g., CR-M5XYZ-8A2B3C4D)" },
              { prefix: "QR-*", label: "Quotation Request (e.g., QR-M5ABC-1E2F3G4H)" },
            ].map(({ prefix, label }) => (
              <div key={prefix} className="flex items-center gap-4">
                <code className="bg-accent/10 text-accent px-3 py-1 rounded font-mono text-sm">{prefix}</code>
                <span className="text-sm text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <CodeBlock
          title="Reference ID Generation"
          language="typescript"
          code={`// Unpredictable, traceable reference IDs
function generateReferenceId(prefix: string): string {
  const uuid = crypto.randomUUID().split("-")[0].toUpperCase()
  const timestamp = Date.now().toString(36).toUpperCase()
  return \`\${prefix}-\${timestamp}-\${uuid}\`
}

// Examples:
// generateReferenceId("SR") -> "SR-M5XYZ123-8A2B3C4D"
// generateReferenceId("CR") -> "CR-M5XYZ456-1E2F3G4H"
// generateReferenceId("QR") -> "QR-M5XYZ789-5I6J7K8L"`}
        />
      </section>

      {/* Email Integration */}
      <section className="space-y-6">
        <DocSectionHeader id="email-integration">Email Notification Integration</DocSectionHeader>
        
        <p className="text-foreground leading-relaxed">
          Each server action triggers email notifications using <strong>React Email</strong> templates 
          sent via <strong>Resend</strong>. Both customer confirmation and business notification 
          emails are sent on successful submission.
        </p>

        <div className="responsive-grid-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Email</CardTitle>
              <CardDescription>Confirmation sent to the submitter</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>Reference ID for tracking</li>
                <li>Summary of submitted information</li>
                <li>Expected response timeline</li>
                <li>Contact information for follow-up</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Business Email</CardTitle>
              <CardDescription>Internal notification to staff</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>Full submission details</li>
                <li>Urgency-based styling</li>
                <li>Customer contact information</li>
                <li>Quick action links</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <CodeBlock
          title="Email Service Integration"
          language="typescript"
          code={`// lib/email/services/contact-email-service.ts
import { Resend } from "resend"
import { CustomerContactConfirmation } from "@/emails/customer-contact-confirmation"
import { BusinessContactNotification } from "@/emails/business-contact-notification"

const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactEmailData {
  contactInfo: ContactInfo
  inquiryType: InquiryType
  messageDetails: MessageDetails
  referenceId: string
}

export async function sendContactEmails(data: ContactEmailData) {
  try {
    const customerResult = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: data.contactInfo.email,
      subject: \`Contact Request Received - \${data.referenceId}\`,
      react: CustomerContactConfirmation({ data }),
    })

    const businessResult = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO!,
      subject: \`New Contact Request - \${data.referenceId}\`,
      react: BusinessContactNotification({ data }),
    })

    return { success: true, customerEmail: customerResult, businessEmail: businessResult }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error: "Failed to send emails" }
  }
}`}
        />
      </section>

      {/* File Structure */}
      <section className="space-y-6">
        <DocSectionHeader id="file-structure">File Structure & Env Vars</DocSectionHeader>

        <CodeBlock
          title="API Integration Structure"
          language="bash"
          code={`lib/
├── actions/                        # Server Actions
│   ├── contact-request.ts          # Contact form submission
│   ├── quotation-request.ts        # Quotation form submission
│   ├── service-request.ts          # Service request submission
│   └── render-email.ts             # Email preview rendering
│
├── email/
│   ├── services/                   # Email sending services
│   │   ├── email-service.ts        # Service request emails
│   │   ├── contact-email-service.ts    # Contact form emails
│   │   └── quotation-email-service.ts  # Quotation emails
│   └── templates/                  # Email template utilities
│
├── validation/                     # Zod schemas
│   ├── schemas.ts                  # Client-side schemas
│   ├── server-schemas.ts           # Server-side schemas
│   ├── contact-schemas.ts          # Contact form schemas
│   └── quotation-schemas.ts        # Quotation schemas
│
├── security/                       # Security utilities
│   ├── rate-limiter.ts             # Rate limiting
│   └── csrf.ts                     # CSRF protection
│
└── sanitize/                       # Input sanitization
    └── input-sanitizer.ts          # XSS prevention

emails/                             # React Email templates
├── customer-confirmation.tsx       # Customer emails
├── business-notification.tsx       # Business emails
└── components/                     # Shared email components`}
        />

        <Callout type="warning" title="Security Note">
          Never commit environment variables to version control. Use 
          <code className="bg-muted px-1 mx-1 rounded">.env.local</code> for local development 
          and configure production variables in your hosting platform.
        </Callout>

        <CodeBlock
          title=".env.local"
          language="bash"
          code={`# Email Configuration (Required)
RESEND_API_KEY=re_xxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com
EMAIL_TO=admin@yourdomain.com

# Security (Required)
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=5`}
        />
      </section>
    </DocPage>
  )
}
