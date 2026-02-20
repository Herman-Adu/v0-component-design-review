import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HeartPulse,
  FlaskConical,
  ArrowRight,
  FileCheck,
  SearchCheck,
  Link2,
  ClipboardCheck,
  Wrench,
  Compass,
  Rocket,
  Shield,
  BarChart3,
} from "lucide-react"

const DA = "/dashboard/admin/document-administration"

export default function DocumentAdministrationOverviewPage() {
  const sections = [
    {
      title: "Documentation Health",
      description:
        "Strategic oversight of documentation coverage, content planning, and gap analysis. Track what exists, identify what is missing, and plan future content using the Gap Discovery Engine.",
      icon: HeartPulse,
      href: `${DA}/documentation-health`,
      role: "Project Lead / CTO",
      pages: 2,
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    {
      title: "Quality Engineering",
      description:
        "Automated validation tools for route verification, count accuracy, TOC integrity, pattern compliance, and bulk fix actions. Ensures documentation stays consistent and correct at scale.",
      icon: FlaskConical,
      href: `${DA}/quality-engineering`,
      role: "Web Administrator / DevOps / QA",
      pages: 6,
      color: "bg-violet-500/15 text-violet-400 border-violet-500/30",
    },
  ]

  const highlights = [
    {
      icon: Compass,
      title: "Gap Discovery Engine",
      description: "Automated scanning identifies undocumented routes, missing articles, and content coverage gaps.",
    },
    {
      icon: SearchCheck,
      title: "Count Validation",
      description: "Verifies data array counts match documentation claims. Catches stale numbers automatically.",
    },
    {
      icon: Link2,
      title: "Route Verification",
      description: "Checks every sidebar navigation link resolves to a real page. Zero broken links guaranteed.",
    },
    {
      icon: ClipboardCheck,
      title: "TOC Integrity",
      description: "Validates table-of-contents anchor IDs exist on page. No dead scroll targets.",
    },
    {
      icon: FileCheck,
      title: "Pattern Compliance",
      description: "Checks content follows naming conventions, tagging standards, and structure rules.",
    },
    {
      icon: Wrench,
      title: "Bulk Fix Actions",
      description: "One-click resolution for common documentation issues detected by QA tools.",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
            <HeartPulse className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Document Administration</h1>
            <p className="text-muted-foreground">
              Unified hub for documentation health monitoring and quality engineering
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">8 Pages</Badge>
          <Badge variant="outline">2 Sections</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">All Systems Active</Badge>
        </div>
      </div>

      {/* What is Document Administration */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 shrink-0">
            <HeartPulse className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">What is Document Administration?</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Document Administration consolidates all documentation oversight into two domains: <strong className="text-foreground">Documentation Health</strong> for strategic coverage tracking, gap analysis, and content planning, and <strong className="text-foreground">Quality Engineering</strong> for automated validation tools that ensure accuracy, consistency, and correctness across the entire documentation system. Each section is organized by role so you can go directly to the tools you need.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Section Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Sections</h2>
        <div className="responsive-grid-2">
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

      {/* At a Glance */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-accent" />
            At a Glance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="responsive-grid-3">
            <div className="flex items-center gap-3 rounded-lg border border-border/50 p-4">
              <Shield className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-sm font-medium text-foreground">6 QA Tools</p>
                <p className="text-xs text-muted-foreground">Automated validation</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 p-4">
              <Compass className="h-5 w-5 text-violet-400" />
              <div>
                <p className="text-sm font-medium text-foreground">Gap Discovery</p>
                <p className="text-xs text-muted-foreground">Content coverage scanning</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border/50 p-4">
              <Wrench className="h-5 w-5 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-foreground">Bulk Fix Actions</p>
                <p className="text-xs text-muted-foreground">One-click resolution</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Start */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
              <Rocket className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">New here?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Start with the Getting Started guide for a walkthrough of both sections and role-based entry points.</p>
            </div>
          </div>
          <Button size="sm" asChild>
            <Link href={`${DA}/getting-started`}>
              Getting Started
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
