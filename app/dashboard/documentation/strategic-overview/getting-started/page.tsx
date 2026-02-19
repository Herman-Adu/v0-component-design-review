"use client"

import { DocPage } from "@/components/molecules/doc-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Rocket,
  Database,
  Globe,
  Cog,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Layers,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function StrategicGettingStartedPage() {
  const sectionStarts = [
    {
      title: "CMS Reference",
      subtitle: "Start with the data layer",
      description: "Learn how Strapi content types map to TypeScript interfaces. Set up your local CMS, create your first collection, and connect it to the frontend.",
      icon: Database,
      href: "/dashboard/documentation/cms-reference/getting-started",
      color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      iconColor: "bg-blue-500/10 text-blue-400",
      steps: [
        "Install Strapi with PostgreSQL",
        "Create your first content type",
        "Connect to Next.js via GraphQL",
      ],
    },
    {
      title: "App Reference",
      subtitle: "Build the frontend",
      description: "Understand the atomic component system, server vs client rendering decisions, and how to build features with security and performance built in.",
      icon: Globe,
      href: "/dashboard/documentation/app-reference/getting-started",
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-emerald-500/10 text-emerald-400",
      steps: [
        "Learn server vs client component rules",
        "Build with the atomic design system",
        "Add server actions with Zod validation",
      ],
    },
    {
      title: "Infrastructure & Ops",
      subtitle: "Deploy and operate",
      description: "Configure API integrations, set up testing pipelines, deploy to production, and troubleshoot common issues across the full stack.",
      icon: Cog,
      href: "/dashboard/documentation/infrastructure-and-ops/overview",
      color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      iconColor: "bg-amber-500/10 text-amber-400",
      steps: [
        "Configure API and GraphQL endpoints",
        "Set up testing strategy",
        "Deploy with environment configuration",
      ],
    },
  ]

  const quickLinks = [
    { title: "Why Strapi?", href: "/dashboard/documentation/strategic-overview/why-strapi", desc: "Business case and CMS selection rationale" },
    { title: "App Overview", href: "/dashboard/documentation/strategic-overview/app-overview", desc: "Architecture summary and tech stack decisions" },
    { title: "Code Review Log", href: "/dashboard/documentation/strategic-overview/code-review-log", desc: "Quality findings and architectural decisions" },
    { title: "Security Architecture", href: "/dashboard/documentation/app-reference/security-architecture", desc: "7-layer defense-in-depth implementation" },
    { title: "Performance & Caching", href: "/dashboard/documentation/app-reference/performance-and-caching", desc: "TanStack Query and Next.js 16 caching" },
    { title: "Testing Strategy", href: "/dashboard/documentation/infrastructure-and-ops/testing-strategy", desc: "End-to-end testing approach" },
  ]

  return (
    <DocPage
      title="Getting Started"
      description="Your starting point for the entire documentation system. Follow the recommended path through CMS, App, and Infrastructure -- or jump directly to any section."
      badges={[
        { label: "Start Here", variant: "default" },
        { label: "Navigation Hub", variant: "outline" },
      ]}
      meta={[
        { label: "Audience", value: "All Roles" },
        { label: "Last Updated", value: "2026-02-11" },
      ]}
      tableOfContents={[
        { id: "recommended-path", label: "Recommended Path" },
        { id: "section-starting-points", label: "Section Starting Points" },
        { id: "quick-links", label: "Quick Links" },
      ]}
    >
      <section id="recommended-path">
        <h2 className="text-2xl font-bold text-foreground mb-6">Recommended Path</h2>
        <Card className="bg-card border-border mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-blue-500/15 text-blue-400">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{"1. CMS Reference"}</p>
                  <p className="text-xs text-muted-foreground">{"Data layer first"}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-emerald-500/15 text-emerald-400">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{"2. App Reference"}</p>
                  <p className="text-xs text-muted-foreground">{"Build the UI"}</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-amber-500/15 text-amber-400">
                  <Cog className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{"3. Infrastructure"}</p>
                  <p className="text-xs text-muted-foreground">{"Deploy and operate"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section id="section-starting-points">
        <h2 className="text-2xl font-bold text-foreground mb-6">Section Starting Points</h2>
        <div className="grid gap-6">
          {sectionStarts.map((section) => (
            <Card key={section.title} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${section.iconColor}`}>
                    <section.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>
                <div className="space-y-2">
                  {section.steps.map((step) => (
                    <div key={step} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span className="text-muted-foreground">{step}</span>
                    </div>
                  ))}
                </div>
                <Link href={section.href}>
                  <Button variant="outline" size="sm" className="gap-1 bg-transparent mt-2">
                    {"Get Started"} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="quick-links" className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Links</h2>
        <p className="text-muted-foreground mb-6 leading-relaxed">
          {"Jump directly to key topics across all sections."}
        </p>
        <div className="responsive-grid-2">
          {quickLinks.map((link) => (
            <Link key={link.title} href={link.href} className="group">
              <Card className="bg-card border-border hover:border-primary/30 transition-colors h-full">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">{link.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{link.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </DocPage>
  )
}
