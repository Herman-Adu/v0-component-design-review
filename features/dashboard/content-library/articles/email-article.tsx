"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  FeatureGrid,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  StatsTable,
  ArchitectureDiagram,
  DataFlowDiagram,
  FileTree,
  type TOCItem,
  ArticleIcons,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "architecture-overview", title: "Architecture Overview", level: 2 },
  { id: "template-layer", title: "Template Layer (React Email)", level: 2 },
  { id: "urgency-styling", title: "Urgency-Based Styling", level: 3 },
  { id: "service-layer", title: "Service Layer", level: 2 },
  { id: "dual-email", title: "Dual Email Pattern", level: 2 },
  { id: "delivery-layer", title: "Delivery Layer (Resend)", level: 2 },
  { id: "error-handling", title: "Error Handling", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function EmailArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="info">
          Email seems simple until you need: HTML/text variants, urgency-based styling, 
          customer and business templates, and reliable delivery. Here is how we built 
          a production email system using React Email and Resend.
        </InfoBox>

        <SectionHeader number="01" title="Architecture Overview" id="architecture-overview" />

        <p className="text-muted-foreground mb-6">
          Our email system is organized into three distinct layers, each with a specific 
          responsibility. This separation allows us to change delivery providers without 
          touching templates, or add new templates without changing delivery logic.
        </p>

        <ArchitectureDiagram
          title="Email System Architecture"
          layers={[
            { name: "Template Layer", items: ["React Email", "Shared Styles", "Customer Template", "Business Template"], color: "#ef4444" },
            { name: "Service Layer", items: ["EmailService", "ContactEmailService", "QuotationEmailService"], color: "#f59e0b" },
            { name: "Delivery Layer", items: ["Resend API", "Error Handling", "Retry Logic"], color: "#22c55e" },
          ]}
        />

        <FileTree
          title="Email System File Structure"
          items={[
            {
              name: "lib/email/",
              type: "folder",
              children: [
                {
                  name: "templates/",
                  type: "folder",
                  children: [
                    { name: "email-styles.ts", type: "file", highlight: true },
                    { name: "service-request-customer.tsx", type: "file" },
                    { name: "service-request-business.tsx", type: "file" },
                    { name: "contact-customer.tsx", type: "file" },
                    { name: "contact-business.tsx", type: "file" },
                  ],
                },
                {
                  name: "services/",
                  type: "folder",
                  children: [
                    { name: "email-service.ts", type: "file", highlight: true },
                    { name: "contact-email-service.ts", type: "file" },
                    { name: "quotation-email-service.ts", type: "file" },
                  ],
                },
              ],
            },
          ]}
        />

        <SectionHeader number="02" title="Template Layer (React Email)" id="template-layer" />

        <p className="text-muted-foreground mb-4">
          React Email lets us build email templates using familiar React components. 
          Templates are type-safe, composable, and can be previewed during development.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Component-Based",
              description: "Build emails with React components - Text, Section, Container, Button, etc.",
            },
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Shared Styles",
              description: "Central style definitions ensure consistent branding across all emails.",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Type Safety",
              description: "TypeScript props ensure all required data is passed to templates.",
            },
            {
              icon: <ArticleIcons.Target className="h-5 w-5" />,
              title: "Dev Preview",
              description: "Preview emails in browser during development, no sending required.",
            },
          ]}
        />

        <CodeBlock
          filename="lib/email/templates/service-request-customer.tsx"
          code={`import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { getEmailStyles, getUrgencyStyles } from "./email-styles"

interface ServiceRequestEmailProps {
  customerName: string
  serviceType: string
  urgency: "routine" | "urgent" | "emergency"
  scheduledDate: string
  referenceNumber: string
}

export function ServiceRequestCustomerEmail({
  customerName,
  serviceType,
  urgency,
  scheduledDate,
  referenceNumber,
}: ServiceRequestEmailProps) {
  const styles = getEmailStyles()
  const urgencyStyles = getUrgencyStyles(urgency)
  
  return (
    <Html>
      <Head />
      <Preview>Your service request has been received</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header with urgency-based styling */}
          <Section style={{ ...styles.header, backgroundColor: urgencyStyles.headerBg }}>
            <Heading style={styles.heading}>
              Service Request Confirmed
            </Heading>
          </Section>
          
          {/* Content */}
          <Section style={styles.content}>
            <Text style={styles.text}>
              Hello {customerName},
            </Text>
            <Text style={styles.text}>
              We have received your {urgency} request for {serviceType}.
            </Text>
            
            {/* Request details */}
            <Section style={styles.detailsBox}>
              <Text style={styles.detailLabel}>Reference Number</Text>
              <Text style={styles.detailValue}>{referenceNumber}</Text>
              
              <Text style={styles.detailLabel}>Scheduled Date</Text>
              <Text style={styles.detailValue}>{scheduledDate}</Text>
              
              <Text style={styles.detailLabel}>Urgency Level</Text>
              <Text style={{ ...styles.detailValue, color: urgencyStyles.textColor }}>
                {urgency.toUpperCase()}
              </Text>
            </Section>
          </Section>
          
          {/* Footer */}
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              Electrical Services Ltd | support@example.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}`}
        />

        <SubSectionHeader title="Urgency-Based Styling" id="urgency-styling" />

        <p className="text-muted-foreground mb-4">
          Different urgency levels get different visual treatments, making it immediately 
          clear to both customers and staff how urgent a request is.
        </p>

        <StatsTable
          title="Urgency Styling Matrix"
          headers={["Urgency", "Header Color", "Accent Color", "Response Time"]}
          rows={[
            ["Routine", "Blue (#3b82f6)", "Blue text/borders", "Within 5 business days"],
            ["Urgent", "Orange (#f59e0b)", "Orange highlights", "Within 24 hours"],
            ["Emergency", "Red (#ef4444)", "Red urgent indicators", "Same day response"],
          ]}
        />

        <CodeBlock
          filename="lib/email/templates/email-styles.ts"
          code={`export function getUrgencyStyles(urgency: "routine" | "urgent" | "emergency") {
  const styles = {
    routine: {
      headerBg: "#3b82f6",
      textColor: "#3b82f6",
      borderColor: "#3b82f6",
      label: "Routine Service",
    },
    urgent: {
      headerBg: "#f59e0b",
      textColor: "#f59e0b",
      borderColor: "#f59e0b",
      label: "Urgent - Priority Response",
    },
    emergency: {
      headerBg: "#ef4444",
      textColor: "#ef4444",
      borderColor: "#ef4444",
      label: "EMERGENCY - Immediate Attention",
    },
  }
  
  return styles[urgency]
}`}
        />

        <SectionHeader number="03" title="Service Layer" id="service-layer" />

        <p className="text-muted-foreground mb-4">
          The service layer abstracts email sending logic. Each form type has a dedicated 
          service that knows how to construct and send its specific emails.
        </p>

        <DataFlowDiagram
          title="Service Layer Flow"
          nodes={[
            { label: "Server Action", description: "Triggers email", icon: <ArticleIcons.Zap className="h-4 w-4" /> },
            { label: "Email Service", description: "Constructs email", icon: <ArticleIcons.Layers className="h-4 w-4" /> },
            { label: "Template", description: "Renders HTML", icon: <ArticleIcons.Code className="h-4 w-4" /> },
            { label: "Resend", description: "Delivers email", icon: <ArticleIcons.Target className="h-4 w-4" /> },
          ]}
        />

        <CodeBlock
          filename="lib/email/services/email-service.ts"
          code={`import { Resend } from "resend"
import { render } from "@react-email/render"
import { ServiceRequestCustomerEmail } from "../templates/service-request-customer"
import { ServiceRequestBusinessEmail } from "../templates/service-request-business"

const resend = new Resend(process.env.RESEND_API_KEY)

export class EmailService {
  async sendServiceRequestEmails(data: ServiceRequestData) {
    const referenceNumber = generateReferenceNumber()
    
    // Send both emails in parallel
    const [customerResult, businessResult] = await Promise.allSettled([
      this.sendCustomerConfirmation(data, referenceNumber),
      this.sendBusinessNotification(data, referenceNumber),
    ])
    
    // Log any failures but don't fail the whole request
    if (customerResult.status === "rejected") {
      console.error("Customer email failed:", customerResult.reason)
    }
    if (businessResult.status === "rejected") {
      console.error("Business email failed:", businessResult.reason)
    }
    
    return { referenceNumber }
  }
  
  private async sendCustomerConfirmation(
    data: ServiceRequestData,
    referenceNumber: string
  ) {
    const html = await render(
      ServiceRequestCustomerEmail({
        customerName: data.personalInfo.firstName,
        serviceType: data.serviceDetails.serviceType,
        urgency: data.serviceDetails.urgency,
        scheduledDate: data.schedulePreferences.preferredDate,
        referenceNumber,
      })
    )
    
    return resend.emails.send({
      from: "Electrical Services <noreply@example.com>",
      to: data.personalInfo.email,
      subject: \`Service Request Confirmed - \${referenceNumber}\`,
      html,
    })
  }
  
  private async sendBusinessNotification(
    data: ServiceRequestData,
    referenceNumber: string
  ) {
    // Similar pattern for business email
  }
}`}
        />

        <SectionHeader number="04" title="Dual Email Pattern" id="dual-email" />

        <p className="text-muted-foreground mb-4">
          Every form submission sends two emails with different content for different audiences. 
          The customer gets a confirmation; the business gets actionable details.
        </p>

        <ComparisonCards
          idealTitle="Customer Email"
          notIdealTitle="Business Email"
          idealFor={[
            "Confirmation that request was received",
            "Reference number for future inquiries",
            "Expected response timeline",
            "Contact information for questions",
            "Branded, professional appearance",
          ]}
          notIdealFor={[
            "Full customer contact details",
            "Complete service requirements",
            "Property access instructions",
            "Internal notes and urgency flags",
            "Direct action links (view in CRM, assign tech)",
          ]}
        />

        <SectionHeader number="05" title="Delivery Layer (Resend)" id="delivery-layer" />

        <p className="text-muted-foreground mb-4">
          Resend handles actual email delivery with high deliverability rates, tracking, 
          and a simple API. The service layer abstracts this, making it easy to swap providers.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "High Deliverability",
              description: "Built-in reputation management and authentication (SPF, DKIM, DMARC).",
            },
            {
              icon: <ArticleIcons.Target className="h-5 w-5" />,
              title: "Simple API",
              description: "One function call to send - no complex configuration required.",
            },
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "Tracking",
              description: "Built-in open and click tracking for monitoring email engagement.",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Error Details",
              description: "Detailed error responses help diagnose delivery issues.",
            },
          ]}
        />

        <SectionHeader number="06" title="Error Handling" id="error-handling" />

        <p className="text-muted-foreground mb-4">
          Email delivery can fail for many reasons. We handle errors gracefully to ensure 
          form submissions succeed even if email delivery has issues.
        </p>

        <CodeBlock
          filename="Email Error Handling"
          code={`export class EmailService {
  async sendWithRetry(
    emailFn: () => Promise<ResendResponse>,
    maxRetries: number = 2
  ): Promise<ResendResponse | null> {
    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await emailFn()
        return result
      } catch (error) {
        lastError = error as Error
        console.error(\`Email attempt \${attempt} failed:\`, error)
        
        // Don't retry on client errors (invalid email, etc.)
        if (isClientError(error)) {
          break
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < maxRetries) {
          await sleep(Math.pow(2, attempt) * 1000)
        }
      }
    }
    
    // Log failure but don't throw - form submission should still succeed
    console.error("All email attempts failed:", lastError)
    return null
  }
}

// In Server Action
const emailResult = await emailService.sendServiceRequestEmails(data)

// Form submission succeeds even if email failed
return {
  success: true,
  referenceNumber: emailResult.referenceNumber,
  emailSent: emailResult !== null,
}`}
        />

        <InfoBox type="warning" title="Form Success vs Email Success">
          A form submission should succeed even if email delivery fails. The user filled out 
          the form correctly - do not make them retry because of email infrastructure issues. 
          Log the failure and handle it asynchronously.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Abstract email into layers: templates define what emails look like, services 
          orchestrate when and what to send, and the delivery layer handles the how. 
          This separation lets you change any layer independently. Always send dual emails 
          (customer + business), handle delivery failures gracefully, and never let email 
          issues block form submissions.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { title: "Server Actions: Beyond the Basics", href: "/dashboard/content-library/articles/architecture/server-actions-deep-dive" },
            { title: "Security Architecture Deep Dive", href: "/dashboard/content-library/articles/architecture/security-architecture-deep-dive" },
            { title: "Refactoring for Maintainability", href: "/dashboard/content-library/articles/architecture/refactoring-for-maintainability" },
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
