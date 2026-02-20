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
  FeatureGrid,
  FileTree,
  ArticleIcons,
  DataFlowDiagram,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "context", title: "Context", level: 2 },
  { id: "problem", title: "The Duplication Problem", level: 2 },
  { id: "architecture", title: "New Architecture", level: 2 },
  { id: "shared-styles", title: "Shared Styles System", level: 2 },
  { id: "urgency-system", title: "Urgency-Based Variants", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function EmailConsolidationContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Context" id="context" />

        <p className="text-muted-foreground mb-6">
          The electrical services application sends transactional emails for three form types: contact
          enquiries, service requests, and quotation requests. Each form sends two emails - one to the
          customer (confirmation) and one to the business (notification). That is six email templates
          with shared branding, shared layout, but individually maintained code.
        </p>

        <InfoBox type="info" title="The Maintainability Challenge">
          When the business owner wanted to update the company phone number in email footers,
          we had to edit 6 separate files. When they wanted to change the accent colour, 6 more edits.
          Every branding update was a minefield of potential inconsistencies.
        </InfoBox>

        <SectionHeader number="02" title="The Duplication Problem" id="problem" />

        <FileTree
          title="Before: 6 Independent Template Files"
          items={[
            {
              name: "emails",
              type: "folder",
              children: [
                { name: "service-customer.tsx", type: "file" },
                { name: "service-business.tsx", type: "file" },
                { name: "contact-customer.tsx", type: "file" },
                { name: "contact-business.tsx", type: "file" },
                { name: "quotation-customer.tsx", type: "file" },
                { name: "quotation-business.tsx", type: "file" },
              ],
            },
          ]}
        />

        <BeforeAfterComparison
          beforeTitle="Before: Duplicated Styles in Every File"
          beforeCode={`// contact-customer.tsx (repeated in all 6 files)
const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#1a1a2e",
  },
  header: {
    backgroundColor: "#f59e0b",
    padding: "24px",
    textAlign: "center" as const,
  },
  footer: {
    backgroundColor: "#0f0f1a",
    padding: "16px",
    textAlign: "center" as const,
    color: "#666",
  },
  // ... 40+ more style properties
  // ALL DUPLICATED IN EVERY FILE
}`}
          afterTitle="After: Single Shared Styles File"
          afterCode={`// lib/email/templates/email-styles.ts
export const emailStyles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#1a1a2e",
  },
  header: {
    backgroundColor: "#f59e0b",
    padding: "24px",
    textAlign: "center" as const,
  },
  // Defined ONCE, imported everywhere
} as const

// Urgency-based colour variants
export const urgencyColors = {
  normal: { accent: "#f59e0b", badge: "#22c55e" },
  high: { accent: "#f59e0b", badge: "#f59e0b" },
  emergency: { accent: "#ef4444", badge: "#ef4444" },
}`}
          improvements={[
            { metric: "Style definitions", before: "6 copies (240 lines)", after: "1 file (40 lines)" },
            { metric: "Update effort", before: "6 files per change", after: "1 file per change" },
            { metric: "Consistency risk", before: "High (manual sync)", after: "Zero (shared source)" },
          ]}
        />

        <SectionHeader number="03" title="New Architecture" id="architecture" />

        <FileTree
          title="After: Consolidated Template Architecture"
          items={[
            {
              name: "lib/email",
              type: "folder",
              children: [
                {
                  name: "templates",
                  type: "folder",
                  children: [
                    { name: "email-styles.ts", type: "file", highlight: true },
                    { name: "customer-html.tsx", type: "file", highlight: true },
                    { name: "business-html.tsx", type: "file", highlight: true },
                  ],
                },
                {
                  name: "services",
                  type: "folder",
                  children: [
                    { name: "email-service.ts", type: "file", highlight: true },
                    { name: "contact-email.ts", type: "file" },
                    { name: "quotation-email.ts", type: "file" },
                    { name: "service-email.ts", type: "file" },
                  ],
                },
              ],
            },
          ]}
        />

        <ArchitectureDiagram
          title="Email System Architecture"
          layers={[
            { name: "Form Services", items: ["contact-email.ts", "quotation-email.ts", "service-email.ts"], color: "#3b82f6" },
            { name: "Base Email Service", items: ["email-service.ts (send, retry, logging)"], color: "#8b5cf6" },
            { name: "Templates", items: ["customer-html.tsx", "business-html.tsx"], color: "#22c55e" },
            { name: "Shared Styles", items: ["email-styles.ts (colours, typography, layout)"], color: "#f59e0b" },
          ]}
        />

        <DataFlowDiagram
          title="Email Generation Flow"
          nodes={[
            { label: "Form Submit", description: "Validated data" },
            { label: "Form Service", description: "Maps fields to template" },
            { label: "Base Service", description: "Sends via Resend API" },
            { label: "Template", description: "Renders HTML" },
            { label: "Delivered", description: "Customer + Business" },
          ]}
        />

        <SectionHeader number="04" title="Shared Styles System" id="shared-styles" />

        <CodeBlock
          filename="lib/email/templates/email-styles.ts"
          language="typescript"
          code={`// Single source of truth for all email styling
export const emailStyles = {
  // Layout
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    fontFamily: "'Arial', 'Helvetica', sans-serif",
    backgroundColor: "#1a1a2e",
    borderRadius: "8px",
    overflow: "hidden",
  },
  
  // Header
  header: {
    backgroundColor: "#f59e0b",
    padding: "24px",
    textAlign: "center" as const,
  },
  
  // Content
  body: {
    padding: "32px 24px",
    backgroundColor: "#16213e",
  },
  
  // Footer with company details
  footer: {
    backgroundColor: "#0f0f1a",
    padding: "16px 24px",
    textAlign: "center" as const,
    fontSize: "12px",
    color: "#666",
  },
  
  // Reusable elements
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
  },
} as const`}
        />

        <SectionHeader number="05" title="Urgency-Based Variants" id="urgency-system" />

        <p className="text-muted-foreground mb-6">
          A significant improvement was the addition of urgency-based email styling. Emergency
          electrical issues get red-accented emails that stand out in the business inbox,
          while routine enquiries use the standard amber branding.
        </p>

        <ProcessFlow
          title="Urgency Levels"
          steps={[
            { label: "Normal", sublabel: "Standard enquiries", color: "green" },
            { label: "High", sublabel: "Urgent repairs", color: "yellow" },
            { label: "Emergency", sublabel: "Safety critical", color: "red" },
          ]}
        />

        <FeatureGrid
          columns={3}
          features={[
            {
              icon: <ArticleIcons.Check className="h-5 w-5" />,
              title: "Normal Priority",
              description: "Green badge, amber header. Used for general contact enquiries and standard quotation requests.",
            },
            {
              icon: <ArticleIcons.AlertTriangle className="h-5 w-5" />,
              title: "High Priority",
              description: "Amber badge, amber header. Used for urgent repair requests and time-sensitive service bookings.",
            },
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Emergency",
              description: "Red badge, red header. Used for electrical emergencies, safety hazards, and immediate callout requests.",
            },
          ]}
        />

        <SectionHeader number="06" title="Results & Metrics" id="results" />

        <StatsTable
          title="Consolidation Results"
          headers={["Metric", "Before", "After", "Improvement"]}
          rows={caseStudy.results.metrics.map((m) => [m.label, m.before, m.after, m.improvement])}
        />

        <MetricsGrid
          metrics={[
            { label: "Template Files", value: "3", change: "Down from 6", positive: true },
            { label: "Style Duplication", value: "0", change: "Eliminated", positive: true },
            { label: "Update Effort", value: "1 file", change: "-83%", positive: true },
            { label: "Urgency Levels", value: "3", change: "New feature", positive: true },
          ]}
        />

        <InfoBox type="tip" title="For Project Managers">
          This consolidation took 4 hours of development time and immediately saved 15 minutes per branding
          update (previously 6 files, now 1). With monthly branding tweaks, the investment paid for
          itself within 2 months. The urgency system was a bonus feature that the business owner rated
          as the most impactful improvement for managing emergency callouts.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          Extract shared patterns and compose variants from common pieces. When you find yourself
          editing the same thing in multiple files, that is a signal to consolidate. The email
          consolidation eliminated all style duplication, made global updates trivial, and enabled
          the urgency system - a feature that was impossible with the duplicated architecture.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { href: "/dashboard/content-library/articles/refactoring-for-maintainability", title: "Refactoring for Maintainability", level: "intermediate" },
            { href: "/dashboard/content-library/case-studies/state-management-evolution", title: "State Management Evolution", level: "intermediate" },
          ]}
        />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
