"use client"

import { DocPage } from "@/components/molecules/doc-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Database,
  Globe,
  Cog,
  ArrowRight,
  Users,
  Shield,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function StrategicOverviewPage() {
  const sections = [
    {
      title: "CMS Reference",
      description: "Strapi headless CMS: content types, form collections, single types, shared components, and relationship modelling. Everything powering the backend data layer.",
      icon: Database,
      href: "/dashboard/documentation/cms-reference/overview",
      color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      iconColor: "bg-blue-500/10 text-blue-400",
      pages: 7,
      audience: "Developer / Architect",
    },
    {
      title: "App Reference",
      description: "Next.js 16 frontend: atomic component system, server vs client rendering, hydration guards, server actions, email system, security architecture, and performance caching.",
      icon: Globe,
      href: "/dashboard/documentation/app-reference/overview",
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-emerald-500/10 text-emerald-400",
      pages: 9,
      audience: "Developer / Architect",
    },
    {
      title: "Infrastructure & Ops",
      description: "API and GraphQL integration, CMS operations, testing strategy, deployment pipelines, and troubleshooting guides. Production-ready operational knowledge.",
      icon: Cog,
      href: "/dashboard/documentation/infrastructure-and-ops/overview",
      color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      iconColor: "bg-amber-500/10 text-amber-400",
      pages: 6,
      audience: "Developer / DevOps / CTO",
    },
  ]

  const audiences = [
    {
      title: "For Developers",
      icon: BookOpen,
      description: "Start with Getting Started in any section. Build features using CMS Reference for data, App Reference for UI, and Infrastructure for deployment.",
      action: "Start Building",
      href: "/dashboard/documentation/app-reference/getting-started",
    },
    {
      title: "For CTOs & Architects",
      icon: BarChart3,
      description: "Review Why Strapi for the CMS business case, then App Overview for architecture decisions. Check Security Architecture and Performance for compliance.",
      action: "Review Architecture",
      href: "/dashboard/documentation/strategic-overview/why-strapi",
    },
    {
      title: "For New Team Members",
      icon: Users,
      description: "Start with this overview, then follow Getting Started in each section. The documentation mirrors the codebase structure for easy navigation.",
      action: "Get Oriented",
      href: "/dashboard/documentation/strategic-overview/getting-started",
    },
  ]

  return (
    <DocPage
      title="Strategic Overview"
      description="High-level guide to the documentation system. Understand what is covered, how it is organised, and where to start based on your role."
      badges={[
        { label: "Navigation Hub", variant: "default" },
        { label: "All Roles", variant: "outline" },
      ]}
      meta={[
        { label: "Audience", value: "All Roles" },
        { label: "Last Updated", value: "2026-02-11" },
      ]}
      tableOfContents={[
        { id: "documentation-sections", label: "Documentation Sections" },
        { id: "by-audience", label: "By Audience" },
        { id: "how-docs-are-organised", label: "How Docs Are Organised" },
      ]}
    >
      <section id="documentation-sections">
        <h2 className="text-2xl font-bold text-foreground mb-6">Documentation Sections</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          {"The documentation is split into three reference sections, each covering a distinct layer of the application. Every section follows the same structure: Overview, Getting Started, then detailed topic pages."}
        </p>
        <div className="responsive-grid-3">
          {sections.map((section) => (
            <Card key={section.title} className="responsive-card bg-card border-border hover:border-primary/30 transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${section.iconColor}`}>
                    <section.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-xs">{section.pages} pages</Badge>
                </div>
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="responsive-card-content space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <Badge variant="outline" className={`text-truncate-responsive ${section.color}`}>{section.audience}</Badge>
                  <Link href={section.href}>
                    <Button variant="ghost" size="sm" className="gap-1">
                      {"Explore"} <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="by-audience" className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">By Audience</h2>
        <div className="responsive-grid-3">
          {audiences.map((audience) => (
            <Card key={audience.title} className="responsive-card bg-card border-border">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <audience.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{audience.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="responsive-card-content space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{audience.description}</p>
                <Link href={audience.href} className="mt-auto">
                  <Button variant="outline" size="sm" className="w-full gap-1 bg-transparent">
                    {audience.action} <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="how-docs-are-organised" className="mt-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">How Docs Are Organised</h2>
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Consistent Structure</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {"Every section starts with an Overview (what it covers) and Getting Started (how to begin). Topic pages follow with detailed implementation guidance, code examples, and architecture decisions."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Real Code, Not Theory</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {"Every code example references actual files in this codebase. Patterns are drawn from production implementations, not theoretical best practices."}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Role-Based Navigation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {"Each page indicates its target audience (Developer, Architect, CTO). Use the sidebar to browse by section, or follow the audience paths above to find relevant content quickly."}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </DocPage>
  )
}
