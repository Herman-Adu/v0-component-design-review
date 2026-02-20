"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { STATS, LABELS, COMPONENT_COUNTS } from "@/data/doc-manifest"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Code,
  Layers,
  Shield,
  Zap,
  ArrowRight,
  Users,
  Globe,
  BookOpen,
  GraduationCap,
  Briefcase,
  TrendingUp,
  CheckCircle,
  LayoutGrid,
  FileText,
  Mail,
  TestTube,
  Rocket,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Lock,
  Box,
  Plug,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const stats = [
  { label: "Custom Components", value: String(STATS.frontend.components.total), detail: STATS.frontend.components.breakdown, icon: LayoutGrid },
  { label: "shadcn/ui Components", value: "30+", detail: "Pre-built accessible UI primitives", icon: Box },
  { label: "Content Library", value: `${STATS.content.totalItems}+`, detail: `${STATS.content.articles} Articles, ${STATS.content.tutorials} Tutorials, ${STATS.content.caseStudies} Case Studies`, icon: BookOpen },
  { label: "Security Layers", value: String(STATS.security.layers), detail: STATS.security.layerNames.join(", "), icon: Shield },
]

const audienceCards = [
  {
    title: "Business & CTO",
    description: "Understand the technical decisions, architecture quality, and production readiness of this codebase",
    icon: TrendingUp,
        href: "/dashboard/documentation/app-reference/overview",
    badge: "Decision Makers",
    badgeColor: "bg-purple-500/20 text-purple-400",
    highlights: ["Atomic design ROI", "Security posture", "Scalability assessment"],
    journey: [
    { label: "Overview", href: "/dashboard/documentation/app-reference/overview", current: true },
    { label: "Security Architecture", href: "/dashboard/documentation/app-reference/security-architecture" },
    { label: "Performance", href: "/dashboard/documentation/app-reference/performance-and-caching" },
    { label: "Deployment", href: "/dashboard/documentation/infrastructure-and-ops/deployment" },
    ],
  },
  {
    title: "Getting Started",
    description: "New to the project? Start here for a guided walkthrough of the architecture and key patterns",
    icon: GraduationCap,
    href: "/dashboard",
    badge: "Beginners",
    badgeColor: "bg-green-500/20 text-green-400",
    highlights: ["Project structure", "Component patterns", "First contribution"],
    journey: [
      { label: "Getting Started", href: "/dashboard", current: true },
      { label: "Server vs Client", href: "/dashboard/documentation/app-reference/server-vs-client" },
      { label: "Component System", href: "/dashboard/documentation/app-reference/component-system" },
      { label: "Testing", href: "/dashboard/documentation/infrastructure-and-ops/testing-strategy" },
    ],
  },
  {
    title: "Senior Engineer",
    description: "Deep-dive into the guard architecture, hydration strategy, security layers, and advanced patterns",
    icon: Code,
        href: "/dashboard/documentation/app-reference/component-system",
    badge: "Advanced",
    badgeColor: "bg-amber-500/20 text-amber-400",
    highlights: ["Guard pattern", "Hydration protection", "State management"],
    journey: [
      { label: "Component System", href: "/dashboard/documentation/app-reference/component-system", current: true },
      { label: "Hydration & Guards", href: "/dashboard/documentation/app-reference/hydration-and-guards" },
      { label: "Security Architecture", href: "/dashboard/documentation/app-reference/security-architecture" },
      { label: "Code Review", href: "/dashboard/documentation/strategic-overview/code-review-log" },
    ],
  },
]

const sectionCards = [
  {
    title: "Component System",
    description: "Atomic design breakdown: 10 atoms, 14 molecules, 10 organisms with dependency tree and reuse patterns",
    icon: LayoutGrid,
        href: "/dashboard/documentation/app-reference/component-system",
    badge: "Core",
    badgeColor: "bg-blue-500/20 text-blue-400",
    highlights: ["Atomic design", "Component tree", "Reuse patterns"],
  },
  {
    title: "Hydration & Guards",
    description: "The guard architecture protecting against hydration mismatches from Radix UI aria-controls IDs",
    icon: Shield,
        href: "/dashboard/documentation/app-reference/hydration-and-guards",
    badge: "Key Pattern",
    badgeColor: "bg-amber-500/20 text-amber-400",
    highlights: ["useHydration hook", "SidebarSkeleton", "Radix ID fix"],
  },
  {
    title: "Server vs Client",
    description: "When to use Server Components vs Client Components, data fetching patterns, and rendering strategies",
    icon: Layers,
    href: "/dashboard/documentation/app-reference/server-vs-client",
    badge: "Fundamentals",
    badgeColor: "bg-green-500/20 text-green-400",
    highlights: ["RSC patterns", "Client boundaries", "Data flow"],
  },
  {
    title: "Security Architecture",
    description: "Defense-in-depth: rate limiting, CSRF protection, input sanitization, hydration guards, and server action security",
    icon: ShieldCheck,
        href: "/dashboard/documentation/app-reference/security-architecture",
    badge: "Critical",
    badgeColor: "bg-red-500/20 text-red-400",
    highlights: [`${STATS.security.layers} security layers`, "OWASP threat model", "Production hardened"],
  },
  {
    title: "Server Actions & API",
    description: "Type-safe server actions, form submission handling, Strapi API integration patterns",
    icon: Plug,
    href: "/dashboard/documentation/app-reference/server-actions-and-api",
    badge: "Integration",
    badgeColor: "bg-cyan-500/20 text-cyan-400",
    highlights: ["Type-safe actions", "Error handling", "API patterns"],
  },
  {
    title: "Email System",
    description: "React Email templates, SMTP configuration, notification workflows, and delivery patterns",
    icon: Mail,
    href: "/dashboard/documentation/app-reference/email-system",
    badge: "Feature",
    badgeColor: "bg-cyan-500/20 text-cyan-400",
    highlights: ["React Email", "SMTP config", "Templates"],
  },
  {
    title: "Performance & Caching",
    description: "Core Web Vitals optimization, caching strategies, bundle analysis, and lazy loading patterns",
    icon: Zap,
        href: "/dashboard/documentation/app-reference/performance-and-caching",
    badge: "Optimization",
    badgeColor: "bg-amber-500/20 text-amber-400",
    highlights: ["Core Web Vitals", "Caching layers", "Bundle size"],
  },
  {
    title: "Testing Strategy",
    description: "Testing pyramid, unit tests, integration tests, E2E with Playwright, and CI/CD pipeline",
    icon: TestTube,
        href: "/dashboard/documentation/infrastructure-and-ops/testing-strategy",
    badge: "Quality",
    badgeColor: "bg-green-500/20 text-green-400",
    highlights: ["Testing pyramid", "Playwright E2E", "CI/CD"],
  },
  {
    title: "Deployment Guide",
    description: "Vercel deployment, environment variables, preview deployments, and production checklist",
    icon: Rocket,
        href: "/dashboard/documentation/infrastructure-and-ops/deployment",
    badge: "DevOps",
    badgeColor: "bg-orange-500/20 text-orange-400",
    highlights: ["Vercel deploy", "Env config", "Production checklist"],
  },
]

const architectureLayers = [
  {
    layer: "Presentation",
    color: "border-blue-500/30 bg-blue-500/5",
    labelColor: "text-blue-400",
    items: [`${COMPONENT_COUNTS.atoms.count} Atoms (inputs, selects, checkboxes)`, `${COMPONENT_COUNTS.molecules.count} Molecules (forms, cards, nav)`, `${COMPONENT_COUNTS.organisms.count} Organisms (multi-step forms, containers)`],
  },
  {
    layer: "State & Logic",
    color: "border-amber-500/30 bg-amber-500/5",
    labelColor: "text-amber-400",
    items: ["Zustand stores (form state, UI state)", "React Hook Form + Zod validation", "useHydration guard hook"],
  },
  {
    layer: "Security",
    color: "border-red-500/30 bg-red-500/5",
    labelColor: "text-red-400",
    items: ["Rate limiting (IP-based throttle)", "CSRF token validation", "Input sanitization (DOMPurify)", "Hydration guard pattern"],
  },
  {
    layer: "Integration",
    color: "border-green-500/30 bg-green-500/5",
    labelColor: "text-green-400",
    items: ["Next.js Server Actions", "Strapi REST/GraphQL API", "React Email + SMTP", "Vercel edge deployment"],
  },
]

const progressItems = [
  { label: "Atomic Design Component System (Atoms, Molecules, Organisms)", progress: 100 },
  { label: "Multi-Step Form Architecture (Service, Contact, Quotation)", progress: 100 },
  { label: "Hydration Guard Architecture (useHydration, SidebarSkeleton)", progress: 100 },
  { label: "Security Layers (Rate Limit, CSRF, Sanitization, Validation)", progress: 100 },
  { label: "Server Actions & API Integration (Strapi, Form Handlers)", progress: 100 },
  { label: "Email Notification System (React Email, SMTP)", progress: 100 },
  { label: "Performance & Caching (Core Web Vitals, Bundle Optimization)", progress: 100 },
  { label: "Testing Strategy (Unit, Integration, E2E, CI/CD)", progress: 100 },
  { label: "Content Library Frontend (Articles, Tutorials, Case Studies)", progress: 100 },
  { label: "Deployment & Operations (Vercel, Env Config, Monitoring)", progress: 100 },
]

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function FrontendOverviewPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-blue-500/20 text-blue-500 border-0">All Audiences</Badge>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">App Overview</h1>
        <p className="text-xl text-muted-foreground text-pretty">
          Production-ready Next.js 15 application built with atomic design principles,
          a guard architecture protecting against hydration mismatches, {STATS.security.layers}-layer security,
          and comprehensive content management -- from form submissions to a {STATS.content.totalItems}+ item content library.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Next.js 15</Badge>
          <Badge variant="outline">TypeScript</Badge>
          <Badge variant="outline">Atomic Design</Badge>
          <Badge variant="outline">Guard Architecture</Badge>
          <Badge variant="outline">{STATS.frontend.components.total} Custom Components</Badge>
          <Badge variant="outline">{STATS.security.layers} Security Layers</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="responsive-grid-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{stat.detail}</p>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {/* Role-Based Journeys */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Choose Your Path</h2>
          <p className="text-muted-foreground mt-1">
            Select documentation based on your role and what you need to accomplish
          </p>
        </div>

        <div className="responsive-grid-3">
          {audienceCards.map((card) => {
            const Icon = card.icon
            return (
              <Card key={card.title} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                      <Icon className="h-5 w-5 text-accent" />
                    </div>
                    <Badge className={cn("border-0", card.badgeColor)}>{card.badge}</Badge>
                  </div>
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <CardDescription className="text-pretty">{card.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-1">
                    {card.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="text-accent">{">"}</span> {h}
                      </li>
                    ))}
                  </ul>

                  {/* Suggested Journey */}
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
                      Suggested Journey
                    </p>
                    <div className="flex flex-wrap items-center gap-1">
                      {card.journey.map((step, i) => (
                        <div key={step.label} className="flex items-center gap-1">
                          <Link
                            href={step.href}
                            className={cn(
                              "text-xs px-2 py-1 rounded transition-colors",
                              step.current
                                ? "bg-accent/20 text-accent font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            )}
                          >
                            {step.label}
                          </Link>
                          {i < card.journey.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">System Architecture</h2>
          <p className="text-muted-foreground mt-1">
            Four-layer architecture from presentation through integration
          </p>
        </div>

        <div className="space-y-3">
          {architectureLayers.map((layer) => (
            <div
              key={layer.layer}
              className={cn("rounded-lg border p-4", layer.color)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <span className={cn("text-sm font-bold uppercase tracking-wider min-w-[140px] shrink-0", layer.labelColor)}>
                  {layer.layer}
                </span>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span
                      key={item}
                      className="text-xs px-2.5 py-1 rounded-md bg-background/60 text-foreground border border-border/50"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Documentation Sections */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Documentation</h2>
          <p className="text-muted-foreground mt-1">
            Every aspect of the frontend architecture, from components to deployment
          </p>
        </div>

        <div className="responsive-grid-2 md:responsive-grid-3">
          {sectionCards.map((card) => {
            const Icon = card.icon
            return (
              <Link key={card.href} href={card.href} className="group">
                <Card className="h-full transition-colors hover:border-accent/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <Badge className={cn("border-0", card.badgeColor)}>{card.badge}</Badge>
                    </div>
                    <CardTitle className="text-lg group-hover:text-accent transition-colors">{card.title}</CardTitle>
                    <CardDescription className="text-pretty">{card.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {card.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="text-accent">{">"}</span> {h}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Documentation Progress */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Documentation Coverage</h2>
          <p className="text-muted-foreground mt-1">
            Current documentation completeness across all frontend systems
          </p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-3">
            {progressItems.map((item) => (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground flex items-center gap-2">
                    {item.progress === 100 && <CheckCircle className="h-3.5 w-3.5 text-green-500" />}
                    {item.label}
                  </span>
                  <span className="text-muted-foreground font-medium">{item.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      item.progress === 100 ? "bg-green-500" : item.progress >= 50 ? "bg-amber-500" : "bg-accent"
                    )}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Quick Navigation */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground">Quick Navigation</h2>
        <div className="responsive-grid-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-green-500" />
                New to the project?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Start with the guided walkthrough, then explore the component system and server/client patterns.
              </p>
              <Button variant="outline" className="bg-transparent" asChild>
                <Link href="/dashboard" className="flex items-center gap-2">
                  Start the Guide <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-500" />
                Concerned about security?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                The security architecture page covers all {STATS.security.layers} defense layers, OWASP threat modeling, and the guard pattern protecting production.
              </p>
              <Button variant="outline" className="bg-transparent" asChild>
                <Link href="/dashboard/documentation/app-reference/security-architecture" className="flex items-center gap-2">
                  Security Deep-Dive <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Cross-reference to Backend */}
      <section>
        <div className="rounded-lg border border-accent/30 bg-accent/5 p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">Looking for backend documentation?</p>
                <p className="text-sm text-muted-foreground">
                  The CMS Reference section covers Strapi schemas, content models, shared components, and entity relationships.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/documentation/cms-reference/overview"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium shrink-0 hover:bg-accent/90 transition-colors"
            >
              CMS Reference
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
