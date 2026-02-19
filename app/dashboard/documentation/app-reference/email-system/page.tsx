"use client"

import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, CheckCircle, AlertTriangle, Settings, Zap, FileText, Users } from "lucide-react"
import Link from "next/link"

const SECTIONS = [
  { id: "architecture", title: "Email System Architecture" },
  { id: "file-structure", title: "Email Module Structure" },
  { id: "urgency-styling", title: "Urgency-Based Styling" },
  { id: "email-services", title: "Email Service Implementation" },
  { id: "setup", title: "Setup Instructions" },
  { id: "preview", title: "Email Preview & Testing" },
  { id: "best-practices", title: "Best Practices" },
  { id: "error-handling", title: "Error Handling" },
]

export default function EmailNotificationsPage() {
  return (
    <DocPage
      title="Email System"
      description="Professional email notification system with urgency-based styling, React Email templates, and Resend delivery for all form types."
      icon={Mail}
      badges={[
        { label: "React Email" },
        { label: "Resend" },
        { label: "3 Form Types" },
        { label: "Urgency Styling" },
        { label: "HTML Templates" },
      ]}
      tags={["email", "resend", "notifications", "templates"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* Architecture Overview */}
      <section className="space-y-6">
        <DocSectionHeader id="architecture">Email System Architecture</DocSectionHeader>
        
        <Callout type="info" title="Template Architecture">
          The email system uses pure HTML templates (no JSX runtime dependency) for maximum 
          compatibility with Resend and other email providers. Templates are organized by 
          form type with shared styling via a centralized style system.
        </Callout>

        <div className="responsive-grid-3">
          {[
            { icon: Zap, title: "Service Request", desc: "Booking confirmations", items: ["customer-confirmation-html.tsx", "business-notification-html.tsx", "Urgency-based styling"] },
            { icon: Users, title: "Contact Form", desc: "Inquiry notifications", items: ["contact-customer-html.tsx", "contact-business-html.tsx", "Priority-based styling"] },
            { icon: FileText, title: "Quotation", desc: "Quote request notifications", items: ["quotation-customer-html.tsx", "quotation-business-html.tsx", "Project scope details"] },
          ].map(({ icon: Icon, title, desc, items }) => (
            <Card key={title}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-5 w-5 text-accent" />
                  <CardTitle className="text-lg">{title}</CardTitle>
                </div>
                <CardDescription>{desc}</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* File Structure */}
      <section className="space-y-6">
        <DocSectionHeader id="file-structure">Email Module Structure</DocSectionHeader>

        <CodeBlock
          title="lib/email/ Structure"
          language="bash"
          code={`lib/email/
├── services/                          # Email sending services
│   ├── email-service.ts               # Service request emails
│   ├── contact-email-service.ts       # Contact form emails
│   └── quotation-email-service.ts     # Quotation emails
│
└── templates/                         # HTML email templates
    ├── email-styles.ts                # Shared style definitions
    │
    ├── customer-confirmation-html.tsx # Service: customer email
    ├── business-notification-html.tsx # Service: business email
    │
    ├── contact-customer-html.tsx      # Contact: customer email
    ├── contact-business-html.tsx      # Contact: business email
    │
    ├── quotation-customer-html.tsx    # Quotation: customer email
    └── quotation-business-html.tsx    # Quotation: business email`}
        />
      </section>

      {/* Urgency-Based Styling */}
      <section className="space-y-6">
        <DocSectionHeader id="urgency-styling">Urgency-Based Styling System</DocSectionHeader>
        
        <p className="text-foreground leading-relaxed">
          Email templates dynamically adjust their visual appearance based on urgency level.
          Emergency requests receive high-visibility red styling to ensure immediate attention.
        </p>

        <div className="responsive-grid-3">
          {[
            { level: "Routine", color: "border-l-green-500", textColor: "text-green-600", items: ["Dark header (#1a1a1a)", "Amber accent (#f59e0b)", "Standard layout", "Normal subject line"] },
            { level: "Urgent", color: "border-l-amber-500", textColor: "text-amber-600", items: ["Amber header gradient", "Priority indicators", "Highlighted urgency", "Urgent subject prefix"] },
            { level: "Emergency", color: "border-l-red-500", textColor: "text-red-600", items: ["Red header (#7f1d1d)", "Emergency banner", "Red info cards", "EMERGENCY subject prefix"] },
          ].map(({ level, color, textColor, items }) => (
            <Card key={level} className={`border-l-4 ${color}`}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-lg ${textColor}`}>{level}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Spoiler title="View Urgency Styling Implementation">
          <CodeBlock
            title="lib/email/templates/email-styles.ts"
            language="typescript"
            code={`export const emailStyles = {
  // Standard header (routine/urgent)
  header: \`
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    padding: 40px 30px;
    text-align: center;
    border-radius: 8px 8px 0 0;
  \`,
  
  // Emergency header (red gradient)
  headerEmergency: \`
    background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%);
    padding: 40px 30px;
    text-align: center;
    border-radius: 8px 8px 0 0;
  \`,
  
  // Standard logo container (amber)
  logo: \`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #f59e0b;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    margin-bottom: 16px;
  \`,
  
  // Emergency logo container (red)
  logoEmergency: \`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #dc2626;
    width: 60px;
    height: 60px;
    border-radius: 12px;
    margin-bottom: 16px;
  \`,
  
  // Emergency banner
  emergencyBanner: \`
    background: #fee2e2;
    border-left: 4px solid #dc2626;
    padding: 16px;
    margin-bottom: 24px;
    border-radius: 4px;
  \`,
  
  emergencyText: \`
    color: #991b1b;
    font-size: 14px;
    font-weight: 600;
    margin: 0;
  \`,
  
  // Standard info card
  infoCard: \`
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
  \`,
  
  // Emergency info card
  infoCardEmergency: \`
    background: #fef2f2;
    border: 2px solid #fecaca;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
  \`,
}`}
          />
        </Spoiler>
      </section>

      {/* Email Services */}
      <section className="space-y-6">
        <DocSectionHeader id="email-services">Email Service Implementation</DocSectionHeader>

        <Tabs defaultValue="service" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="service">Service Request</TabsTrigger>
            <TabsTrigger value="contact">Contact Form</TabsTrigger>
            <TabsTrigger value="quotation">Quotation</TabsTrigger>
          </TabsList>
          
          <TabsContent value="service" className="space-y-4">
            <Spoiler title="View Service Request Email Service" defaultOpen>
              <CodeBlock
                title="lib/email/services/email-service.ts"
                language="typescript"
                code={`"use server"

import { Resend } from "resend"
import { generateCustomerConfirmationEmail } from "../templates/customer-confirmation-html"
import { generateBusinessNotificationEmail } from "../templates/business-notification-html"
import type { CompleteFormInput } from "@/lib/validation/schemas"

function getResendClient() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY environment variable is not set")
  }
  return new Resend(process.env.RESEND_API_KEY)
}

export type EmailResult = 
  | { success: true; messageId: string } 
  | { success: false; error: string }

interface SendEmailsParams {
  formData: CompleteFormInput
  requestId: string
}

export async function sendServiceRequestEmails({ 
  formData, 
  requestId 
}: SendEmailsParams): Promise<{
  customerEmail: EmailResult
  businessEmail: EmailResult
}> {
  const submittedAt = new Date().toISOString()

  const customerEmailResult = await sendCustomerConfirmationEmail({
    to: formData.personalInfo.email,
    customerName: \`\${formData.personalInfo.firstName} \${formData.personalInfo.lastName}\`,
    requestId,
    serviceType: formData.serviceDetails.serviceType,
    urgency: formData.serviceDetails.urgency,
    preferredDate: formData.schedulePreferences.preferredDate,
    preferredTimeSlot: formData.schedulePreferences.preferredTimeSlot,
    address: formData.propertyInfo.address,
    city: formData.propertyInfo.city,
    postcode: formData.propertyInfo.postcode,
  })

  const businessEmailResult = await sendBusinessNotificationEmail({
    requestId,
    customerName: \`\${formData.personalInfo.firstName} \${formData.personalInfo.lastName}\`,
    customerEmail: formData.personalInfo.email,
    customerPhone: formData.personalInfo.phone,
    serviceType: formData.serviceDetails.serviceType,
    urgency: formData.serviceDetails.urgency,
    description: formData.serviceDetails.description,
    preferredDate: formData.schedulePreferences.preferredDate,
    preferredTimeSlot: formData.schedulePreferences.preferredTimeSlot,
    address: formData.propertyInfo.address,
    city: formData.propertyInfo.city,
    postcode: formData.propertyInfo.postcode,
    propertyType: formData.propertyInfo.propertyType,
    submittedAt,
  })

  return { customerEmail: customerEmailResult, businessEmail: businessEmailResult }
}`}
              />
            </Spoiler>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4">
            <Spoiler title="View Contact Email Service" defaultOpen>
              <CodeBlock
                title="lib/email/services/contact-email-service.ts"
                language="typescript"
                code={`"use server"

import { Resend } from "resend"
import { generateContactCustomerEmail } from "../templates/contact-customer-html"
import { generateContactBusinessEmail } from "../templates/contact-business-html"

export async function sendContactEmails(data: {
  contactInfo: { fullName: string; email: string; phone: string; company?: string }
  inquiryType: { inquiryType: string; sector: string; priority: string }
  messageDetails: { subject: string; message: string; preferredContactMethod: string }
  referenceId: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@electricalservices.com",
      to: data.contactInfo.email,
      subject: \`Contact Request Received - \${data.referenceId}\`,
      html: generateContactCustomerEmail({
        customerName: data.contactInfo.fullName,
        referenceId: data.referenceId,
        subject: data.messageDetails.subject,
        inquiryType: data.inquiryType.inquiryType,
      }),
    })

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@electricalservices.com",
      to: process.env.BUSINESS_EMAIL || "admin@electricalservices.com",
      subject: \`New Contact: \${data.messageDetails.subject} (\${data.referenceId})\`,
      html: generateContactBusinessEmail({
        referenceId: data.referenceId,
        customerName: data.contactInfo.fullName,
        customerEmail: data.contactInfo.email,
        customerPhone: data.contactInfo.phone,
        company: data.contactInfo.company,
        inquiryType: data.inquiryType.inquiryType,
        sector: data.inquiryType.sector,
        priority: data.inquiryType.priority,
        subject: data.messageDetails.subject,
        message: data.messageDetails.message,
        preferredContactMethod: data.messageDetails.preferredContactMethod,
      }),
    })

    return { success: true }
  } catch (error) {
    console.error("Contact email error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to send emails" 
    }
  }
}`}
              />
            </Spoiler>
          </TabsContent>
          
          <TabsContent value="quotation" className="space-y-4">
            <Spoiler title="View Quotation Email Service" defaultOpen>
              <CodeBlock
                title="lib/email/services/quotation-email-service.ts"
                language="typescript"
                code={`"use server"

import { Resend } from "resend"
import { generateQuotationCustomerEmail } from "../templates/quotation-customer-html"
import { generateQuotationBusinessEmail } from "../templates/quotation-business-html"
import type { CompleteQuotationInput } from "@/lib/validation/quotation-schemas"

interface QuotationEmailParams {
  formData: CompleteQuotationInput
  requestId: string
}

export async function sendQuotationRequestEmails({ 
  formData, 
  requestId 
}: QuotationEmailParams) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@electricalservices.com",
      to: formData.contact.email,
      subject: \`Quotation Request Received - \${requestId}\`,
      html: generateQuotationCustomerEmail({
        customerName: formData.contact.fullName,
        requestId,
        projectType: formData.projectType.projectType,
        projectCategory: formData.projectType.projectCategory,
        budgetRange: formData.budget.budgetRange,
        timeline: formData.budget.timeline,
      }),
    })

    await resend.emails.send({
      from: process.env.EMAIL_FROM || "noreply@electricalservices.com",
      to: process.env.BUSINESS_EMAIL || "admin@electricalservices.com",
      subject: \`New Quotation Request - \${requestId} - \${formData.projectType.projectType}\`,
      html: generateQuotationBusinessEmail({
        requestId,
        contact: formData.contact,
        projectType: formData.projectType,
        scope: formData.scope,
        site: formData.site,
        budget: formData.budget,
        additional: formData.additional,
      }),
    })

    return { success: true }
  } catch (error) {
    console.error("Quotation email error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to send emails" 
    }
  }
}`}
              />
            </Spoiler>
          </TabsContent>
        </Tabs>
      </section>

      {/* Setup Instructions */}
      <section className="space-y-6">
        <DocSectionHeader id="setup">Setup Instructions</DocSectionHeader>

        <div className="space-y-4">
          {[
            {
              step: 1,
              title: "Get Resend API Key",
              content: (
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground ml-4">
                  <li>Go to resend.com and create an account</li>
                  <li>Navigate to API Keys section</li>
                  <li>{"Create a new API key (starts with re_)"}</li>
                </ol>
              ),
            },
            {
              step: 2,
              title: "Add Environment Variables",
              content: (
                <CodeBlock
                  title=".env.local"
                  language="bash"
                  code={`# Required
RESEND_API_KEY=re_your_api_key_here

# Optional - defaults provided
EMAIL_FROM=noreply@yourdomain.com
BUSINESS_EMAIL=admin@yourdomain.com`}
                />
              ),
            },
            {
              step: 3,
              title: "Verify Domain (Production)",
              content: (
                <p className="text-sm text-muted-foreground">
                  For production, verify your domain in Resend dashboard to send from your domain.
                  Add the DNS records provided and wait for verification (24-48 hours).
                </p>
              ),
            },
          ].map(({ step, title, content }) => (
            <div key={step} className="flex items-start gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                {step}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-2">{title}</h4>
                {content}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Email Preview */}
      <section className="space-y-6">
        <DocSectionHeader id="preview">Email Preview & Testing</DocSectionHeader>
        
        <Callout type="success" title="Preview Available">
          Visit the{" "}
          <Link href="/dashboard/admin/email-preview" className="text-accent underline font-semibold">
            Email Preview
          </Link>{" "}
          page in the Admin section to see how your email templates render before sending.
          Test different urgency levels and form types.
        </Callout>

        <div className="responsive-grid-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Development Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ol className="list-decimal list-inside space-y-1">
                <li>Submit a test form</li>
                <li>Check Resend dashboard for sent emails</li>
                <li>Click email to see rendered preview</li>
                <li>Verify dynamic content is correct</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Production Testing
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="list-disc list-inside space-y-1">
                <li>Test all urgency levels</li>
                <li>Verify mobile responsiveness</li>
                <li>Check spam folder if not received</li>
                <li>Monitor Resend dashboard</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-6">
        <DocSectionHeader id="best-practices">Best Practices</DocSectionHeader>

        <div className="responsive-grid-3">
          {[
            { title: "Performance", items: ["Send emails asynchronously", "Don't block user on email send", "Log failures for monitoring", "Keep templates under 100KB"] },
            { title: "Security", items: ["Never expose API keys client-side", "Validate email addresses", "Sanitize user input in emails", "Use environment variables"] },
            { title: "Deliverability", items: ["Verify your domain", "Use clear subject lines", "Include unsubscribe link", "Test in spam checkers"] },
            { title: "Accessibility", items: ["Use semantic HTML", "Ensure good color contrast", "Include alt text for images", "Test with screen readers"] },
          ].map(({ title, items }) => (
            <Card key={title}>
              <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <ul className="space-y-1">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Error Handling */}
      <section className="space-y-6">
        <DocSectionHeader id="error-handling">Error Handling</DocSectionHeader>

        <Callout type="warning" title="Graceful Degradation">
          The system continues to work even if email sending fails. Form submissions 
          are always successful - email failures are logged but don{"'"}t block the user.
        </Callout>

        <div className="space-y-4 mt-6">
          {[
            { title: "Missing API Key", error: "Email service not configured", solution: "Add RESEND_API_KEY to environment variables" },
            { title: "Domain Not Verified", error: "Domain not verified", solution: "Verify domain in Resend or use onboarding@resend.dev for testing" },
            { title: "Rate Limiting", error: "Too many requests", solution: "Upgrade Resend plan or implement request queuing" },
          ].map(({ title, error, solution }) => (
            <div key={title} className="border-l-4 border-yellow-500 bg-yellow-500/10 p-4 rounded-r-lg">
              <p className="font-semibold text-foreground mb-1">{title}</p>
              <p className="text-sm text-muted-foreground">
                {"Error: \""}{error}{"\""}<br />
                {"Solution: "}{solution}
              </p>
            </div>
          ))}
        </div>
      </section>
    </DocPage>
  )
}
