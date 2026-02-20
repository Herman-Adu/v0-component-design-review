"use client"

import {
  ShieldCheck,
  Share2,
  MailCheck,
  Users,
  Settings,
  BarChart3,
  Lock,
  HeartPulse,
  Activity,
  SearchCheck,
  Link2,
  ClipboardCheck,
  FileCheck,
  Wrench,
  TrendingUp,
  ArrowRight,
  Compass,
  FlaskConical,
  Target,
  Megaphone,
} from "lucide-react"
import Link from "next/link"
import { articles } from "@/data/content-library/articles"
import { caseStudies } from "@/data/content-library/case-studies"
import { tutorials } from "@/data/content-library/tutorials"

const totalContent = articles.length + caseStudies.length + tutorials.length

const docSystemTools = [
  {
    href: "/dashboard/admin/document-administration/documentation-health",
    icon: Activity,
    title: "Health Overview",
    description: "System-wide health dashboard with real-time stats, coverage tracking, and changelog history.",
    status: "Available",
    badge: "Doc Health",
    badgeColor: "bg-cyan-500/10 text-cyan-500",
  },
  {
    href: "/dashboard/admin/document-administration/documentation-health/gap-analysis",
    icon: Compass,
    title: "Gap Analysis",
    description: "Identify missing content areas, under-covered topics, and opportunities for new documentation.",
    status: "Available",
    badge: "Doc Health",
    badgeColor: "bg-cyan-500/10 text-cyan-500",
  },
  {
    href: "/dashboard/admin/document-administration/quality-engineering",
    icon: FlaskConical,
    title: "Doc QA Overview",
    description: "Automated documentation quality assurance hub with 5 validation tools and remediation workflow.",
    status: "Available",
    badge: "Doc QA",
    badgeColor: "bg-violet-500/10 text-violet-500",
  },
  {
    href: "/dashboard/admin/document-administration/documentation-health/count-validation",
    icon: SearchCheck,
    title: "Count Validation",
    description: "Validate that all overview pages, listing pages, and stat cards display accurate counts matching the data layer.",
    status: "Available",
    badge: "Doc QA",
    badgeColor: "bg-violet-500/10 text-violet-500",
  },
  {
    href: "/dashboard/admin/document-administration/documentation-health/route-verification",
    icon: Link2,
    title: "Route Verification",
    description: "Verify every sidebar nav link, cross-reference href, and content slug resolves to an existing page.",
    status: "Available",
    badge: "Doc QA",
    badgeColor: "bg-violet-500/10 text-violet-500",
  },
  {
    href: "/dashboard/admin/document-administration/documentation-health/toc-integrity",
    icon: ClipboardCheck,
    title: "TOC Integrity",
    description: "Check that every TableOfContents id matches a SectionHeader id in the DOM. Detect orphaned anchors.",
    status: "Available",
    badge: "Doc QA",
    badgeColor: "bg-violet-500/10 text-violet-500",
  },
  {
    href: "/dashboard/admin/document-administration/documentation-health/pattern-compliance",
    icon: FileCheck,
    title: "Pattern Compliance",
    description: "Audit components for consistent patterns: data-driven listings, filter logic, atomic design adherence.",
    status: "Available",
    badge: "Doc QA",
    badgeColor: "bg-violet-500/10 text-violet-500",
  },
  {
    href: "/dashboard/admin/document-administration/documentation-health/fix-actions",
    icon: Wrench,
    title: "Fix Actions",
    description: "One-click fixes for common issues: stale counts, missing anchors, broken cross-references.",
    status: "Available",
    badge: "Doc QA",
    badgeColor: "bg-violet-500/10 text-violet-500",
  },
]

const contentTools = [
  {
    href: "/dashboard/admin/digital-marketing",
    icon: Megaphone,
    title: "Digital Marketing",
    description: "Platform marketing for Google, LinkedIn, Twitter/X, and Facebook. SEO, ads, content composers, and analytics.",
    status: "Available",
    badge: "Marketing",
    badgeColor: "bg-accent/10 text-accent",
  },
  {
    href: "/dashboard/admin/email-preview",
    icon: MailCheck,
    title: "Email Preview",
    description: "Preview and test email templates before sending to customers and business notifications.",
    status: "Available",
    badge: "Content",
    badgeColor: "bg-accent/10 text-accent",
  },
  {
    href: "/dashboard/admin/document-administration/documentation-health/gap-analysis",
    icon: Target,
    title: "Content Pipeline",
    description: "10-pass gap analysis with review log scanning, audience coverage, and batch content pipeline.",
    status: "Available",
    badge: "Pipeline",
    badgeColor: "bg-teal-500/10 text-teal-400",
  },
]

const upcomingFeatures = [
  {
    icon: Users,
    title: "User Management",
    description: "Manage user accounts, roles, and permissions for team members and administrators.",
    status: "Coming Soon",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track form submissions, user engagement, and business metrics in real-time.",
    status: "Planned",
  },
  {
    icon: Settings,
    title: "System Settings",
    description: "Configure application settings, email providers, and integration options.",
    status: "Planned",
  },
]

export default function AdminOverviewPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/10">
            <ShieldCheck className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
        </div>
        <p className="text-lg text-muted-foreground text-balance max-w-3xl">
          Centralized administration for managing documentation health, content tools, 
          and system settings. Run health checks, validate data integrity, and maintain 
          the documentation library at scale.
        </p>
      </div>

      {/* Security Notice */}
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-6">
        <div className="flex items-start gap-4">
          <Lock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-foreground mb-1">Authentication Required</h3>
            <p className="text-sm text-muted-foreground">
              In production, all admin features will require authentication. Role-based access control (RBAC) 
              will restrict features based on user permissions. Currently in development mode for demonstration.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Content Items</p>
          <p className="text-3xl font-bold text-accent mt-1">{totalContent}</p>
          <p className="text-xs text-muted-foreground mt-1">{articles.length} articles, {caseStudies.length} case studies, {tutorials.length} tutorials</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Doc Pages</p>
          <p className="text-3xl font-bold text-foreground mt-1">35</p>
          <p className="text-xs text-muted-foreground mt-1">Across 4 major sections</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Health Checks</p>
          <p className="text-3xl font-bold text-cyan-500 mt-1">5</p>
          <p className="text-xs text-muted-foreground mt-1">Automated validation tools</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-sm text-muted-foreground">Email Templates</p>
          <p className="text-3xl font-bold text-foreground mt-1">4</p>
          <p className="text-xs text-muted-foreground mt-1">Customer + business pairs</p>
        </div>
      </div>

      {/* Doc System Quick Access */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <HeartPulse className="h-6 w-6 text-cyan-500" />
            <h2 className="text-2xl font-semibold text-foreground">Doc System Management</h2>
          </div>
          <Link 
            href="/dashboard/admin/document-administration/documentation-health"
            className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
          >
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {docSystemTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-lg border border-border bg-card p-6 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="h-8 w-8 text-cyan-500" />
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-cyan-500 transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Content Tools */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Content Tools</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {contentTools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group rounded-lg border border-border bg-card p-6 hover:border-accent/50 hover:bg-accent/5 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="h-8 w-8 text-accent" />
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-500">
                    {tool.status}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
                  {tool.title}
                </h3>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Upcoming Features */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Upcoming Features</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {upcomingFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-lg border border-border bg-card/50 p-6 opacity-75"
              >
                <div className="flex items-start justify-between mb-4">
                  <Icon className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {feature.status}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
