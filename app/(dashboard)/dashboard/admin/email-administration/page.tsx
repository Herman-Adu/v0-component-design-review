import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Mail,
  Briefcase,
  Palette,
  HardDrive,
  ArrowRight,
  Users,
  Shield,
  Clock,
  MessageSquare,
  Server,
  Rocket,
} from "lucide-react"

const EA = "/dashboard/admin/email-administration"

export default function EmailAdministrationOverviewPage() {
  const sections = [
    {
      title: "Request Management",
      description:
        "Day-to-day handling of client requests. Job tracking, status pipeline, branded correspondence, team assignment, and bulk operations across all form submission types.",
      icon: Briefcase,
      href: `${EA}/request-management`,
      role: "Business Administrator / Office Staff",
      pages: 3,
      color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    {
      title: "Configuration",
      description:
        "Brand identity, templates, preview, A/B subject lines, recipient groups, and scheduling. Control how emails look and behave without touching code.",
      icon: Palette,
      href: `${EA}/configuration`,
      role: "Business Admin / Project Lead",
      pages: 6,
      color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    },
    {
      title: "Infrastructure",
      description:
        "Technical monitoring and operational tools. API health, delivery logs, configuration versioning, and a comprehensive 21-check security audit.",
      icon: HardDrive,
      href: `${EA}/infrastructure`,
      role: "Web Administrator / DevOps / CTO",
      pages: 5,
      color: "bg-red-500/15 text-red-400 border-red-500/30",
    },
  ]

  const highlights = [
    {
      icon: MessageSquare,
      title: "Branded Correspondence",
      description: "Send professional reply emails with configurable sections, presets, and live preview.",
    },
    {
      icon: Shield,
      title: "7-Layer Security",
      description: "Rate limiting, CSRF, honeypot, XSS sanitization, Zod validation, API key masking, and env security.",
    },
    {
      icon: Clock,
      title: "SLA Tracking",
      description: "Priority-based response times with urgency-specific styling and team routing.",
    },
    {
      icon: Server,
      title: "Resend Integration",
      description: "Production-ready email delivery via Resend API with full delivery pipeline observability.",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      description: "Sections organized by role: Office Staff, Business Admins, Project Leads, and DevOps.",
    },
    {
      icon: Palette,
      title: "Config-Driven Templates",
      description: "All brand colors, company details, and SLA settings driven from a single config file, Strapi-ready.",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
            <Mail className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Email Administration</h1>
            <p className="text-muted-foreground">
              Unified hub for request handling, email configuration, and infrastructure
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">14 Pages</Badge>
          <Badge variant="outline">3 Sections</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">All Systems Active</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-0">Strapi-Ready</Badge>
        </div>
      </div>

      {/* What is Email Administration */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 shrink-0">
            <Mail className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">What is Email Administration?</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Email Administration consolidates all email operations into three domains: <strong className="text-foreground">Request Management</strong> for day-to-day job tracking and correspondence, <strong className="text-foreground">Configuration</strong> for brand identity, templates, and scheduling, and <strong className="text-foreground">Infrastructure</strong> for technical health, security, and delivery monitoring. Each section is organized by role so you can go directly to the tools you need.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Sections</h2>
        <div className="responsive-grid-3">
          {sections.map((section) => (
            <Card key={section.title} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`flex items-center justify-center w-9 h-9 rounded-md border ${section.color}`}>
                    <section.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{section.pages} pages</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{section.description}</CardDescription>
                <p className="text-[10px] text-muted-foreground mt-3">{section.role}</p>
                <Button variant="outline" size="sm" className="mt-4 bg-transparent w-full" asChild>
                  <Link href={section.href}>
                    Open {section.title}
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Highlights */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Key Capabilities</h2>
        <div className="responsive-grid-3">
          {highlights.map((item) => (
            <Card key={item.title} className="border-border/50">
              <CardContent className="flex gap-4 p-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted shrink-0">
                  <item.icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Start */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
              <Rocket className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">New here?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Start with the Getting Started guide for a walkthrough of all three sections and role-based entry points.</p>
            </div>
          </div>
          <Button size="sm" asChild>
            <Link href={`${EA}/getting-started`}>
              Getting Started
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
