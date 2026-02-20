"use client"

import React, { useState } from "react"
import Link from "next/link"
import { STATS, COMPONENT_COUNTS, MANAGEMENT_DOCS, MANAGEMENT_DOC_STATS } from "@/data/doc-manifest"
import { guides } from "@/data/content-library/guides"
import {
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Code,
  Layers,
  TrendingUp,
  FolderTree,
  Activity,
  HeartPulse,
  SearchCheck,
  Link2,
  ClipboardCheck,
  FileCheck,
  Wrench,
  ArrowRight,
  RefreshCw,
  Database,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { articles } from "@/data/content-library/articles"
import { caseStudies } from "@/data/content-library/case-studies"
import { tutorials } from "@/data/content-library/tutorials"

// Health check status types
type HealthStatus = "healthy" | "warning" | "error" | "unchecked"
type DocStatus = "current" | "needs-update" | "planned"

interface HealthCheckSummary {
  name: string
  description: string
  href: string
  icon: React.ElementType
  status: HealthStatus
  lastRun: string | null
  passCount: number
  failCount: number
  warnCount: number
}

interface DocSection {
  name: string
  path: string
  status: DocStatus
  lastReviewed: string
  coversComponents: string[]
  notes?: string
}

interface CodebaseArea {
  area: string
  totalItems: number
  documentedItems: number
  files: string[]
}

// Health check tools with their current state
const healthChecks: HealthCheckSummary[] = [
  {
    name: "Count Validation",
    description: "Verify stats on overview and listing pages match actual data counts",
    href: "/dashboard/admin/document-administration/quality-engineering/count-validation",
    icon: SearchCheck,
    status: "unchecked",
    lastRun: null,
    passCount: 0,
    failCount: 0,
    warnCount: 0,
  },
  {
    name: "Route Verification",
    description: "Check all sidebar links, cross-references, and content slugs resolve",
    href: "/dashboard/admin/document-administration/quality-engineering/route-verification",
    icon: Link2,
    status: "unchecked",
    lastRun: null,
    passCount: 0,
    failCount: 0,
    warnCount: 0,
  },
  {
    name: "TOC Integrity",
    description: "Validate TOC item IDs match SectionHeader IDs in article/case-study pages",
    href: "/dashboard/admin/document-administration/quality-engineering/toc-integrity",
    icon: ClipboardCheck,
    status: "unchecked",
    lastRun: null,
    passCount: 0,
    failCount: 0,
    warnCount: 0,
  },
  {
    name: "Pattern Compliance",
    description: "Audit data-driven listings, filter logic, and atomic design adherence",
    href: "/dashboard/admin/document-administration/quality-engineering/pattern-compliance",
    icon: FileCheck,
    status: "unchecked",
    lastRun: null,
    passCount: 0,
    failCount: 0,
    warnCount: 0,
  },
]

// Documentation sections registry - source of truth
const documentationSections: DocSection[] = [
  {
    name: "Getting Started",
    path: "/dashboard",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["Project overview", "Role-based journeys", "Tech stack", "Directory structure"],
  },
  {
    name: "Frontend Overview",
    path: "/dashboard/frontend",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: [`${STATS.frontend.components.total} components`, `${STATS.security.layers} security layers`, "Architecture diagram", "Role-based paths"],
  },
  {
    name: "Component System",
    path: "/dashboard/documentation/app-reference/component-system",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: [
      `${COMPONENT_COUNTS.atoms.count} Atoms`, `${COMPONENT_COUNTS.molecules.count} Molecules`, `${COMPONENT_COUNTS.organisms.count} Organisms`,
      `${COMPONENT_COUNTS.contactSteps.count} Contact Steps`, `${COMPONENT_COUNTS.sharedSteps.count} Shared Steps`, `${COMPONENT_COUNTS.animations.count} Animations`, `${COMPONENT_COUNTS.hooks.count} Hooks`,
      `${COMPONENT_COUNTS.articleSubComponents.count} Article sub-components`, "Content library architecture",
    ],
  },
  {
    name: "Hydration & Guards",
    path: "/dashboard/documentation/app-reference/hydration-and-guards",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["useHydration hook", "SidebarSkeleton", "Guard pattern", "Radix ID fix"],
  },
  {
    name: "Security Architecture",
    path: "/dashboard/documentation/app-reference/security-architecture",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["7 defense layers", "OWASP threat model", "Rate limiting", "CSRF", "Sanitization", "Production headers"],
  },
  {
    name: "Server vs Client",
    path: "/dashboard/documentation/app-reference/server-vs-client",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["RSC patterns", "Client components", "Data fetching"],
  },
  {
    name: "API Integration",
    path: "/dashboard/documentation/app-reference/server-actions-and-api",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["Server Actions (4)", "Security pipeline", "Error handling", "Email integration"],
  },
  {
    name: "Email Notifications",
    path: "/dashboard/documentation/app-reference/email-system",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["React Email templates", "Urgency-based styling", "Dual-email pattern", "Resend integration"],
  },
  {
    name: "Performance",
    path: "/dashboard/documentation/app-reference/performance-and-caching",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["Caching strategies", "Bundle optimization", "Core Web Vitals"],
  },
  {
    name: "Testing",
    path: "/dashboard/documentation/infrastructure-and-ops/testing-strategy",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["Unit testing", "Integration testing", "E2E patterns"],
    notes: "Tests documented but not yet implemented",
  },
  {
    name: "Deployment",
    path: "/dashboard/documentation/infrastructure-and-ops/deployment",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["Vercel deployment", "Environment variables", "CI/CD"],
  },
  {
    name: "Backend Overview",
    path: "/dashboard/documentation/cms-reference/overview",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["Architecture diagram", `${STATS.backend.collectionTypes.total} collection types`, `${STATS.backend.sharedComponents.total} shared components`, "Progress tracker"],
  },
  {
    name: "Why Strapi (CTO)",
    path: "/dashboard/documentation/strategic-overview/why-strapi",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["ROI analysis", "Strapi vs alternatives", "Enterprise features"],
  },
  {
    name: "CMS Getting Started",
    path: "/dashboard/documentation/cms-reference/getting-started",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["Quick setup", "First collection", "Connect frontend"],
  },
  {
    name: "Form Collections",
    path: "/dashboard/documentation/cms-reference/form-collections",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["Service Request", "Contact Inquiry", "Quotation", "Copy-paste schemas"],
  },
  {
    name: "Content Collections",
    path: "/dashboard/documentation/cms-reference/content-collections",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["Article", "Tutorial", "Case Study", "Field mapping from TS interfaces"],
  },
  {
    name: "Single Types",
    path: "/dashboard/documentation/cms-reference/single-types",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["Site Settings", "Global SEO", "Navigation", "Company Profile"],
  },
  {
    name: "Shared Components",
    path: "/dashboard/documentation/cms-reference/shared-components",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: [`${STATS.backend.sharedComponents.form} form + ${STATS.backend.sharedComponents.content} content = ${STATS.backend.sharedComponents.total} total`, "Copy-paste JSON schemas", "Creation order"],
  },
  {
    name: "Relationships",
    path: "/dashboard/documentation/cms-reference/relationships",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: ["17 entity relations", "Architecture diagram", "Component reuse matrix", "Developer quick ref"],
  },
  {
    name: "Content Library",
    path: "/dashboard/content-library",
    status: "current",
    lastReviewed: "2026-02-06",
    coversComponents: [
      `${articles.length} Articles`, `${caseStudies.length} Case Studies`, `${tutorials.length} Tutorials`, `${guides.length} Guides`,
      "Dynamic [slug] routing", "Filter by level/category",
    ],
  },
]

// Codebase coverage tracking
const codebaseCoverage: CodebaseArea[] = [
  { area: "Atoms", totalItems: 10, documentedItems: 10, files: ["callout.tsx", "code-block.tsx", "date-picker.tsx", "form-checkbox.tsx", "form-input.tsx", "form-select.tsx", "form-textarea.tsx", "radio-group.tsx", "spoiler.tsx", "theme-toggle.tsx"] },
  { area: "Molecules", totalItems: 14, documentedItems: 14, files: ["article-components.tsx", "contact-success-message.tsx", "content-card.tsx", "docs-sidebar.tsx", "form-navigation.tsx", "form-progress-indicator.tsx", "form-step-container.tsx", "location-map-card.tsx", "navbar.tsx", "office-hours-card.tsx", "quick-contact-card.tsx", "quotation-success-message.tsx", "sidebar-skeleton.tsx", "step-indicator.tsx"] },
  { area: "Organisms", totalItems: 10, documentedItems: 10, files: ["multi-step-form-container.tsx", "multi-step-form-wrapper.tsx", "personal-info-step.tsx", "property-info-step.tsx", "review-step.tsx", "review-step-display.tsx", "schedule-step.tsx", "service-details-step.tsx", "contact-form-container.tsx", "quotation-form-container.tsx"] },
  { area: "Contact Steps", totalItems: 5, documentedItems: 5, files: ["contact-info-step.tsx", "contact-message-step.tsx", "contact-preference-step.tsx", "contact-review-step.tsx", "contact-subject-step.tsx"] },
  { area: "Shared Steps", totalItems: 3, documentedItems: 3, files: ["shared-personal-info-step.tsx", "shared-address-step.tsx", "shared-review-step-display.tsx"] },
  { area: "Animations", totalItems: 7, documentedItems: 7, files: ["electric-border.tsx", "electric-current.tsx", "light-bulb.tsx", "lightning-arc.tsx", "power-surge.tsx", "pulse-circle.tsx", "spark-effect.tsx"] },
  { area: "Hooks", totalItems: 3, documentedItems: 3, files: ["use-hydration.tsx", "use-mobile.tsx", "use-toast.ts"] },
  { area: "Server Actions", totalItems: 4, documentedItems: 4, files: ["service-request.ts", "contact-request.ts", "quotation-request.ts", "render-email.ts"] },
  { area: "Security", totalItems: 4, documentedItems: 4, files: ["rate-limiter.ts", "csrf.ts", "input-sanitizer.ts", "index.ts"] },
  { area: "Validation Schemas", totalItems: 5, documentedItems: 5, files: ["schemas.ts", "contact-schemas.ts", "quotation-schemas.ts", "email-schemas.ts", "server-schemas.ts"] },
  { area: "Stores", totalItems: 4, documentedItems: 4, files: ["use-form-store.ts", "use-contact-store.ts", "use-quotation-store.ts", "create-form-store.ts"] },
  { area: "Email Templates", totalItems: 8, documentedItems: 8, files: ["customer-confirmation-html.tsx", "business-notification-html.tsx", "contact-customer-html.tsx", "contact-business-html.tsx", "quotation-customer-html.tsx", "quotation-business-html.tsx", "email-styles.ts", "email-service.ts"] },
  { area: "Content Library Data", totalItems: 4, documentedItems: 4, files: ["articles.tsx", "case-studies.tsx", "tutorials.tsx", "guides.ts"] },
  { area: "Management Docs", totalItems: MANAGEMENT_DOC_STATS.total, documentedItems: MANAGEMENT_DOC_STATS.usingDocPage, files: MANAGEMENT_DOCS.filter((d) => d.usesDocPage).map((d) => d.slug) },
]

// Content library structure computed from data
const contentLibraryStructure = {
  articles: {
    total: articles.length,
    byLevel: {
      beginner: articles.filter((a) => a.level === "beginner").length,
      intermediate: articles.filter((a) => a.level === "intermediate").length,
      advanced: articles.filter((a) => a.level === "advanced").length,
    },
    dynamicRoute: "/dashboard/content-library/articles/[slug]",
  },
  caseStudies: {
    total: caseStudies.length,
    byCategory: Object.fromEntries(
      [...new Set(caseStudies.map((cs) => cs.category))].map((cat) => [
        cat,
        caseStudies.filter((cs) => cs.category === cat).length,
      ])
    ),
    dynamicRoute: "/dashboard/content-library/case-studies/[slug]",
  },
  tutorials: {
    total: tutorials.length,
    byLevel: {
      beginner: tutorials.filter((t) => t.level === "beginner").length,
      intermediate: tutorials.filter((t) => t.level === "intermediate").length,
      advanced: tutorials.filter((t) => t.level === "advanced").length,
    },
    dynamicRoute: "/dashboard/content-library/tutorials/[slug]",
  },
  guides: {
    total: guides.length,
    byCategory: Object.fromEntries(
      [...new Set(guides.map((g) => g.category))].map((cat) => [
        cat,
        guides.filter((g) => g.category === cat).length,
      ])
    ),
    dynamicRoute: "/dashboard/content-library/guides/[slug]",
  },
  managementDocs: {
    total: MANAGEMENT_DOC_STATS.total,
    bySection: MANAGEMENT_DOC_STATS.bySection,
    usingDocPage: MANAGEMENT_DOC_STATS.usingDocPage,
    notUsingDocPage: MANAGEMENT_DOC_STATS.notUsingDocPage,
    byStatus: MANAGEMENT_DOC_STATS.byStatus,
  },
}

// Changelog
const changelog = [
  {
    date: "2026-02-06",
    version: "3.0",
    changes: [
      "NEW: Admin Doc System with 5 health check tools and management dashboard",
      "NEW: Frontend & Integration section rebuilt with 4 pages (Overview, Component System, Hydration & Guards)",
      "NEW: Security Architecture rebuilt to 1,061 lines with OWASP threat model and 7 defense layers",
      "NEW: Backend Content Collections page with full Strapi JSON schemas for Article, Tutorial, Case Study",
      `NEW: Backend Shared Components expanded to ${STATS.backend.sharedComponents.total} components (${STATS.backend.sharedComponents.form} form + ${STATS.backend.sharedComponents.content} content)`,
      "NEW: Backend Relationships page with 17 entity relations and architecture diagrams",
      `UPDATED: All overview pages with accurate stats (${STATS.frontend.components.total} components, ${STATS.security.layers} security layers, ${STATS.backend.sharedComponents.total} shared components)`,
      "UPDATED: Getting Started page rebuilt as project entry point with role-based journeys",
      "UPDATED: Sidebar restructured with logical groups matching Backend & CMS pattern",
      "FIXED: TOC id mismatches in 7 article files (label vs title, missing key-takeaway anchors)",
    ],
  },
  {
    date: "2026-02-05",
    version: "2.5",
    changes: [
      "CONTENT: Added 5 new articles (ROI Analysis, Tech Decision Framework, Accessibility, Testing Strategy, CI/CD)",
      "CONTENT: Added 4 new tutorials and 4 new case studies",
      "Fixed hydration mismatch in sidebar navigation using guard pattern",
    ],
  },
  {
    date: "2026-02-05",
    version: "2.4",
    changes: [
      "MAJOR: Backend & CMS section expanded to 8 pages with audience navigation",
      "Created content gap analysis and backend documentation plan",
    ],
  },
  {
    date: "2026-02-04",
    version: "2.0",
    changes: [
      "Complete documentation overhaul",
      "Added Security, Email, Content Library sections",
      "Content Library refactored to scalable [slug] architecture",
    ],
  },
]

function StatusBadge({ status }: { status: DocStatus }) {
  const config = {
    current: { icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10", label: "Current" },
    "needs-update": { icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Needs Update" },
    planned: { icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10", label: "Planned" },
  }
  const { icon: Icon, color, bg, label } = config[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${bg} ${color}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  )
}

function HealthStatusBadge({ status }: { status: HealthStatus }) {
  const config = {
    healthy: { color: "text-green-500", bg: "bg-green-500/10", label: "Healthy" },
    warning: { color: "text-yellow-500", bg: "bg-yellow-500/10", label: "Warning" },
    error: { color: "text-red-500", bg: "bg-red-500/10", label: "Error" },
    unchecked: { color: "text-muted-foreground", bg: "bg-muted", label: "Not Run" },
  }
  const { color, bg, label } = config[status]
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${bg} ${color}`}>
      {label}
    </span>
  )
}

function CoverageBar({ documented, total }: { documented: number; total: number }) {
  const percentage = Math.round((documented / total) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-sm font-medium text-muted-foreground">{percentage}%</span>
    </div>
  )
}

export default function DocSystemOverviewPage() {
  const totalDocumented = codebaseCoverage.reduce((acc, area) => acc + area.documentedItems, 0)
  const totalItems = codebaseCoverage.reduce((acc, area) => acc + area.totalItems, 0)
  const overallCoverage = Math.round((totalDocumented / totalItems) * 100)
  const totalContent = contentLibraryStructure.articles.total + contentLibraryStructure.caseStudies.total + contentLibraryStructure.tutorials.total

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <HeartPulse className="h-6 w-6 text-cyan-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Documentation Health</h1>
            <p className="text-sm text-muted-foreground">Single source of truth for documentation status, coverage, and health</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="responsive-grid-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{STATS.pages.total}</div>
            <p className="text-xs text-muted-foreground">Documentation Pages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{COMPONENT_COUNTS.total}</div>
            <p className="text-xs text-muted-foreground">UI Components</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              {articles.length + tutorials.length + caseStudies.length + guides.length}
            </div>
            <p className="text-xs text-muted-foreground">Library Items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{healthChecks.length}</div>
            <p className="text-xs text-muted-foreground">Active Tools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Data Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="responsive-grid-3">
            <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">How It Works</p>
              <p className="text-xs text-muted-foreground">
                The manifest imports real data arrays and computes counts via .length.
                All doc pages import STATS instead of hardcoding numbers.
              </p>
            </div>
            <div className="rounded-lg border border-border/50 bg-card p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">After Any Change</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>1. Add/remove content in data arrays</li>
                <li>2. Manifest auto-recomputes counts</li>
                <li>3. All pages reflect new numbers</li>
                <li>4. Run Count Validation to verify</li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">v0 Custom Rules:</span>{" "}
                Rules in .v0/rules.md instruct the AI to always import from the manifest, never hardcode
                stats, and run validation after feature changes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Changelog */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Changelog
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {changelog.map((entry) => (
              <div key={entry.version} className="border-l-2 border-accent pl-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">v{entry.version}</Badge>
                  <span className="text-sm text-muted-foreground">{entry.date}</span>
                </div>
                <ul className="space-y-1">
                  {entry.changes.map((change, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-green-500 mt-0.5 shrink-0" />
                      {change}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
