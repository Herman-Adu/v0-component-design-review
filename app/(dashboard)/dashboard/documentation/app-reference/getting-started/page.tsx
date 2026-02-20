"use client"

import { DocPage } from "@/components/molecules/doc-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Lightbulb,
  Code,
  Layers,
  Shield,
  Zap,
  Mail,
  LayoutGrid,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AppRefGettingStartedPage() {
  const journeys = [
    {
      title: "Learning Journey",
      description: "Understand frontend fundamentals and architecture patterns",
      icon: Lightbulb,
      color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      docs: [
        { title: "Server vs Client", href: "/dashboard/documentation/app-reference/server-vs-client", desc: "Decision matrix and rendering strategies" },
        { title: "Component System", href: "/dashboard/documentation/app-reference/component-system", desc: "Atomic design and composition patterns" },
        { title: "Hydration & Guards", href: "/dashboard/documentation/app-reference/hydration-and-guards", desc: "Mismatch solutions and browser API safety" },
      ],
    },
    {
      title: "Development Journey",
      description: "Build features with patterns, security, and performance best practices",
      icon: Code,
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      docs: [
        { title: "Server Actions & API", href: "/dashboard/documentation/app-reference/server-actions-and-api", desc: "Zod validation and error handling" },
        { title: "Email System", href: "/dashboard/documentation/app-reference/email-system", desc: "React Email templates and Resend integration" },
        { title: "Performance & Caching", href: "/dashboard/documentation/app-reference/performance-and-caching", desc: "TanStack Query strategies and bundle optimization" },
        { title: "Security Architecture", href: "/dashboard/documentation/app-reference/security-architecture", desc: "7-layer defense-in-depth implementation" },
      ],
    },
    {
      title: "CTO Journey",
      description: "Strategic overview for architectural and system design decisions",
      icon: Shield,
      color: "bg-red-500/15 text-red-400 border-red-500/30",
      docs: [
        { title: "Component System", href: "/dashboard/documentation/app-reference/component-system", desc: "Entire UI inventory and composition" },
        { title: "Security Architecture", href: "/dashboard/documentation/app-reference/security-architecture", desc: "Defense-in-depth and compliance" },
        { title: "Performance & Caching", href: "/dashboard/documentation/app-reference/performance-and-caching", desc: "Scalability and optimization strategy" },
      ],
    },
  ]

  return (
      <DocPage
      title="Getting Started"
      description="Quick-access hub to App Reference documentation. Choose your journey: learn fundamentals, build features, or review architecture."
      icon={Lightbulb}
      badges={[
        <Badge key="level" className="bg-blue-500/20 text-blue-400 border-0">
          Navigation Hub
        </Badge>,
      ]}
      tags={["getting-started", "app-reference", "frontend", "navigation"]}
      meta={[
        { label: "Audience", value: "Developer / Architect / CTO" },
        { label: "Purpose", value: "Quick navigation to frontend docs" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
    >
      {/* Intro */}
      <section className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2 mb-4">
            Choose Your Learning Path
          </h2>
          <p className="text-muted-foreground text-lg">
            The App Reference contains everything needed to work with the Next.js frontend: architecture patterns, 
            integration guides, security implementation, and performance optimization. Select your role to find 
            relevant documentation quickly.
          </p>
        </div>
      </section>

      {/* Journey Cards */}
      <section className="space-y-8">
        {journeys.map((journey) => {
          const Icon = journey.icon
          return (
            <div key={journey.title} className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${journey.color.split(" ")[0]} ${journey.color.split(" ")[1]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{journey.title}</h3>
                  <p className="text-muted-foreground text-sm">{journey.description}</p>
                </div>
              </div>

              <div className="responsive-grid-2">
                {journey.docs.map((doc) => (
                  <Card key={doc.href} className="hover:border-accent/50 transition-colors">
                    <Link href={doc.href} className="block p-4 h-full">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground mb-1">{doc.title}</h4>
                          <p className="text-sm text-muted-foreground">{doc.desc}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
                      </div>
                    </Link>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* Architecture Overview */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Architecture Principles</h2>
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-base">Server-First Pattern</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">
              The application follows a server-first pattern: Server Components by default, Client Components only 
              when interactivity is required. All client boundaries use the global hydration guard pattern.
            </p>
            <p className="text-muted-foreground text-sm">
              Security is implemented as defense-in-depth with 7 independent layers, covering CSRF protection, 
              rate limiting, input sanitisation, headers, bot detection, and environment security.
            </p>
            <div className="flex gap-2 pt-2">
              <Link href="/dashboard/documentation/app-reference/component-system">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <LayoutGrid className="h-4 w-4" />
                  Component System
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
              <Link href="/dashboard/documentation/app-reference/security-architecture">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Shield className="h-4 w-4" />
                  Security Architecture
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* All Docs Quick Reference */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Complete Documentation</h2>
        <div className="responsive-grid-2 lg:responsive-grid-4">
          {[
            { title: "Component System", href: "/dashboard/documentation/app-reference/component-system", icon: LayoutGrid },
            { title: "Hydration & Guards", href: "/dashboard/documentation/app-reference/hydration-and-guards", icon: Shield },
            { title: "Server vs Client", href: "/dashboard/documentation/app-reference/server-vs-client", icon: Layers },
            { title: "Server Actions & API", href: "/dashboard/documentation/app-reference/server-actions-and-api", icon: Code },
            { title: "Email System", href: "/dashboard/documentation/app-reference/email-system", icon: Mail },
            { title: "Security Architecture", href: "/dashboard/documentation/app-reference/security-architecture", icon: Shield },
            { title: "Performance & Caching", href: "/dashboard/documentation/app-reference/performance-and-caching", icon: Zap },
          ].map((doc) => {
            const DocIcon = doc.icon
            return (
              <Link key={doc.href} href={doc.href}>
                <Card className="h-full hover:border-accent/50 transition-colors">
                  <CardContent className="pt-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
                        <DocIcon className="h-4 w-4 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{doc.title}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Next Steps */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Next Steps</h2>
        <div className="responsive-grid-3">
          {[
            { title: "Overview", href: "/dashboard/documentation/app-reference/overview", desc: "Complete feature inventory" },
            { title: "CMS Reference", href: "/dashboard/documentation/cms-reference/overview", desc: "Backend & Strapi documentation" },
            { title: "Code Review Log", href: "/dashboard/documentation/strategic-overview/code-review-log", desc: "Project evolution and findings" },
          ].map((link) => (
            <Card key={link.title} className="hover:border-accent/50 transition-colors">
              <Link href={link.href} className="block p-4">
                <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>
                <p className="text-sm text-muted-foreground">{link.desc}</p>
              </Link>
            </Card>
          ))}
        </div>
      </section>
      </DocPage>
  )
}
