"use client"

import {
  TableOfContents,
  StepFlow,
  VerticalFlow,
  CodeBlock as ArticleCodeBlock,
  InfoBox,
  StatsTable,
  FileTree,
  ArchitectureDiagram,
  FeatureGrid,
  DataFlowDiagram,
  DecisionTree,
  KeyTakeaway,
  NumberedList,
  ProcessFlow,
} from "@/components/molecules/article-components"
import { Shield, Mail, Eye, Code, Palette, Send, Server, Layout } from "lucide-react"

const tocItems = [
  { id: "why-react-email", label: "Why React Email" },
  { id: "project-setup", label: "Project Setup" },
  { id: "component-model", label: "Component Model" },
  { id: "styling-constraints", label: "Styling Constraints" },
  { id: "template-patterns", label: "Template Patterns" },
  { id: "preview-workflow", label: "Preview Workflow" },
  { id: "resend-integration", label: "Resend Integration" },
  { id: "server-actions", label: "Server Actions" },
  { id: "testing-debugging", label: "Testing & Debugging" },
]

export function EmailTemplatesReactEmailContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">

        {/* Section 1: Why React Email */}
        <section id="why-react-email">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why React Email</h2>
          <p className="text-muted-foreground mb-4">
            Email HTML is stuck in the 1990s -- table-based layouts, inline styles, no flexbox.
            React Email lets you write modern React components that compile to battle-tested email HTML.
          </p>

          <StatsTable
            headers={["Approach", "DX", "Compatibility", "Maintenance"]}
            rows={[
              ["Raw HTML tables", "Painful", "Universal", "Nightmarish"],
              ["MJML", "Better", "Good", "Medium"],
              ["React Email", "Excellent", "Excellent", "Easy"],
            ]}
          />

          <FeatureGrid
            columns={3}
            features={[
              { icon: <Code className="h-5 w-5" />, title: "React Components", description: "Write email templates using familiar React component patterns" },
              { icon: <Eye className="h-5 w-5" />, title: "Live Preview", description: "Dev server with hot reload for instant email preview" },
              { icon: <Palette className="h-5 w-5" />, title: "Type-Safe Styles", description: "Inline styles with TypeScript -- no CSS class guessing" },
            ]}
          />
        </section>

        {/* Section 2: Project Setup */}
        <section id="project-setup">
          <h2 className="text-2xl font-bold text-foreground mb-4">Project Setup</h2>

          <StepFlow
            steps={[
              { title: "Install dependencies", description: "npm install @react-email/components react-email resend" },
              { title: "Create emails directory", description: "Create an /emails folder at the project root for your templates" },
              { title: "Add preview script", description: 'Add "email:dev": "email dev" to your package.json scripts' },
              { title: "Run preview server", description: "npm run email:dev -- opens localhost:3000 with email previews" },
            ]}
          />

          <FileTree
            title="Recommended Structure"
            items={[
              { name: "emails/", type: "folder", children: [
                { name: "components/", type: "folder", children: [
                  { name: "header.tsx", type: "file" },
                  { name: "footer.tsx", type: "file" },
                  { name: "button.tsx", type: "file" },
                ]},
                { name: "welcome.tsx", type: "file", highlight: true },
                { name: "reset-password.tsx", type: "file" },
                { name: "invoice.tsx", type: "file" },
              ]},
              { name: "lib/", type: "folder", children: [
                { name: "email.ts", type: "file", highlight: true },
              ]},
            ]}
          />
        </section>

        {/* Section 3: Component Model */}
        <section id="component-model">
          <h2 className="text-2xl font-bold text-foreground mb-4">Component Model</h2>
          <p className="text-muted-foreground mb-4">
            React Email provides primitive components that map to email-safe HTML elements.
            You compose them like regular React components.
          </p>

          <ArticleCodeBlock
            language="tsx"
            title="emails/welcome.tsx"
            code={`import {
  Html, Head, Body, Container, Section,
  Text, Button, Img, Hr, Preview
} from '@react-email/components'

interface WelcomeEmailProps {
  username: string
  loginUrl: string
}

export default function WelcomeEmail({ username, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to our platform, {username}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img src="https://example.com/logo.png" width="48" height="48" alt="Logo" />
          <Text style={heading}>Welcome, {username}!</Text>
          <Text style={paragraph}>
            Your account is ready. Click below to get started.
          </Text>
          <Button style={button} href={loginUrl}>
            Go to Dashboard
          </Button>
          <Hr style={hr} />
          <Text style={footer}>
            If you did not create this account, you can ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }
const container = { margin: '0 auto', padding: '40px 20px', maxWidth: '560px' }
const heading = { fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }
const paragraph = { fontSize: '16px', lineHeight: '1.5', color: '#555' }
const button = {
  backgroundColor: '#007bff', color: '#fff', padding: '12px 24px',
  borderRadius: '6px', textDecoration: 'none', display: 'inline-block',
}
const hr = { borderColor: '#e6ebf1', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#999' }`}
          />

          <InfoBox title="Props are your data contract">
            Every email template is a React component with typed props. This gives you
            compile-time safety on the data you pass when sending emails.
          </InfoBox>
        </section>

        {/* Section 4: Styling Constraints */}
        <section id="styling-constraints">
          <h2 className="text-2xl font-bold text-foreground mb-4">Styling Constraints</h2>
          <p className="text-muted-foreground mb-4">
            Email clients strip most CSS. React Email handles this, but you need to understand the constraints.
          </p>

          <StatsTable
            headers={["CSS Feature", "Email Support", "Workaround"]}
            rows={[
              ["Flexbox", "Gmail only", "Use tables via Section/Row/Column"],
              ["Grid", "None", "Use tables via Section/Row/Column"],
              ["External CSS", "Stripped by most clients", "Inline styles only (React Email does this)"],
              ["Web fonts", "Apple Mail / iOS only", "Use system font stacks"],
              ["Border-radius", "Most clients", "Safe to use on buttons and containers"],
              ["Media queries", "Some clients", "Use responsive Container widths"],
            ]}
          />

          <InfoBox type="warning" title="The Golden Rule">
            If it works in Outlook 2019, it works everywhere. Outlook uses Word as its
            rendering engine -- the lowest common denominator for email HTML.
          </InfoBox>
        </section>

        {/* Section 5: Template Patterns */}
        <section id="template-patterns">
          <h2 className="text-2xl font-bold text-foreground mb-4">Template Patterns</h2>

          <NumberedList
            title="Essential Template Types"
            items={[
              { title: "Transactional", description: "Welcome, password reset, email verification. Simple layout, clear CTA." },
              { title: "Notification", description: "Activity alerts, status updates, reminders. Brief content, action link." },
              { title: "Receipt/Invoice", description: "Order confirmation, payment receipt. Table-heavy, line items, totals." },
              { title: "Digest/Newsletter", description: "Weekly summaries, content roundups. Multi-section, image-heavy." },
            ]}
          />

          <DecisionTree
            title="Which Template Pattern?"
            decisions={[
              { condition: "Single action required from user?", result: "Transactional template (button CTA)", recommended: true },
              { condition: "Informational only, optional action?", result: "Notification template (text + optional link)" },
              { condition: "Contains line items or financial data?", result: "Receipt/Invoice template (table layout)" },
              { condition: "Multiple content sections?", result: "Digest template (sections with headers)" },
            ]}
          />
        </section>

        {/* Section 6: Preview Workflow */}
        <section id="preview-workflow">
          <h2 className="text-2xl font-bold text-foreground mb-4">Preview Workflow</h2>

          <ProcessFlow
            title="Development Cycle"
            steps={[
              { label: "Write Template", sublabel: "React components", color: "blue" },
              { label: "Preview", sublabel: "email dev server", color: "blue" },
              { label: "Test Props", sublabel: "different data", color: "yellow" },
              { label: "Send Test", sublabel: "real inbox", color: "green" },
              { label: "Ship", sublabel: "production", color: "green" },
            ]}
          />

          <ArticleCodeBlock
            language="tsx"
            title="Preview Props (bottom of template file)"
            code={`// Add default props for the preview server
WelcomeEmail.PreviewProps = {
  username: 'Jane Developer',
  loginUrl: 'https://app.example.com/dashboard',
} satisfies WelcomeEmailProps`}
          />
        </section>

        {/* Section 7: Resend Integration */}
        <section id="resend-integration">
          <h2 className="text-2xl font-bold text-foreground mb-4">Resend Integration</h2>

          <DataFlowDiagram
            title="Email Sending Flow"
            nodes={[
              { label: "Server Action", description: "Triggered by form", icon: <Server className="h-4 w-4" /> },
              { label: "React Email", description: "Renders to HTML", icon: <Layout className="h-4 w-4" /> },
              { label: "Resend API", description: "Delivers email", icon: <Send className="h-4 w-4" /> },
              { label: "Inbox", description: "User receives", icon: <Mail className="h-4 w-4" /> },
            ]}
          />

          <ArticleCodeBlock
            language="typescript"
            title="lib/email.ts"
            code={`import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendWelcomeEmail(to: string, username: string) {
  const { data, error } = await resend.emails.send({
    from: 'App <noreply@yourdomain.com>',
    to,
    subject: \`Welcome, \${username}!\`,
    react: WelcomeEmail({ username, loginUrl: 'https://app.example.com' }),
  })

  if (error) {
    console.error('Email send failed:', error)
    throw new Error('Failed to send welcome email')
  }

  return data
}`}
          />

          <InfoBox title="Environment variable required">
            RESEND_API_KEY must be set in your environment. In v0, add it via
            the Vars section in the sidebar. In production, set it in your Vercel
            project settings.
          </InfoBox>
        </section>

        {/* Section 8: Server Actions */}
        <section id="server-actions">
          <h2 className="text-2xl font-bold text-foreground mb-4">Server Actions Integration</h2>

          <ArticleCodeBlock
            language="tsx"
            title="app/actions/send-welcome.ts"
            code={`'use server'

import { sendWelcomeEmail } from '@/lib/email'

export async function sendWelcome(formData: FormData) {
  const email = formData.get('email') as string
  const name = formData.get('name') as string

  // Validate inputs
  if (!email || !name) {
    return { error: 'Email and name are required' }
  }

  try {
    await sendWelcomeEmail(email, name)
    return { success: true }
  } catch {
    return { error: 'Failed to send email. Please try again.' }
  }
}`}
          />

          <InfoBox type="warning" title="Never send emails from Client Components">
            Email sending requires API keys and must happen server-side.
            Always use Server Actions or API routes -- never expose RESEND_API_KEY
            to the browser.
          </InfoBox>
        </section>

        {/* Section 9: Testing & Debugging */}
        <section id="testing-debugging">
          <h2 className="text-2xl font-bold text-foreground mb-4">Testing & Debugging</h2>

          <VerticalFlow
            title="Testing Checklist"
            steps={[
              { title: "Preview server", description: "Does the template render correctly in the email dev server?", icon: <Eye className="h-4 w-4" /> },
              { title: "Test email", description: "Send a test to your own inbox. Check Gmail, Outlook, Apple Mail.", icon: <Mail className="h-4 w-4" /> },
              { title: "Mobile check", description: "Open test emails on mobile. Check text size, button tap targets.", icon: <Shield className="h-4 w-4" /> },
              { title: "Spam check", description: "Verify emails land in inbox, not spam. Check SPF/DKIM/DMARC.", icon: <Shield className="h-4 w-4" /> },
            ]}
          />

          <KeyTakeaway>
            React Email eliminates the pain of email HTML while keeping full
            compatibility. Combined with Resend and Server Actions, you get a
            type-safe, testable email pipeline that integrates seamlessly with Next.js.
          </KeyTakeaway>
        </section>

      </div>

      {/* Right sidebar TOC */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-8">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  )
}
