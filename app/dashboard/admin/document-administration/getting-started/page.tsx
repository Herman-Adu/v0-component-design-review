import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  HeartPulse,
  FlaskConical,
  ArrowRight,
  Rocket,
  CheckCircle2,
  Users,
  Compass,
  SearchCheck,
  Link2,
  ClipboardCheck,
  FileCheck,
  Wrench,
} from "lucide-react"

const DA = "/dashboard/admin/document-administration"

export default function DocumentAdministrationGettingStartedPage() {
  const journeys = [
    {
      title: "Project Lead / CTO",
      description: "Monitor documentation coverage, identify gaps, and plan content strategy",
      icon: HeartPulse,
      color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      steps: [
        { title: "Documentation Health Overview", href: `${DA}/documentation-health`, desc: "See current documentation coverage and status" },
        { title: "Gap Discovery Engine", href: `${DA}/documentation-health/gap-analysis`, desc: "Find undocumented routes and missing content" },
      ],
    },
    {
      title: "Web Administrator / DevOps / QA",
      description: "Run automated validation checks and resolve documentation issues at scale",
      icon: FlaskConical,
      color: "bg-violet-500/15 text-violet-400 border-violet-500/30",
      steps: [
        { title: "Quality Engineering Overview", href: `${DA}/quality-engineering`, desc: "Understand the automated QA pipeline" },
        { title: "Count Validation", href: `${DA}/quality-engineering/count-validation`, desc: "Verify data arrays match documented counts" },
        { title: "Route Verification", href: `${DA}/quality-engineering/route-verification`, desc: "Check all navigation links resolve correctly" },
        { title: "TOC Integrity", href: `${DA}/quality-engineering/toc-integrity`, desc: "Validate anchor IDs exist on target pages" },
        { title: "Pattern Compliance", href: `${DA}/quality-engineering/pattern-compliance`, desc: "Check naming and structure conventions" },
        { title: "Fix Actions", href: `${DA}/quality-engineering/fix-actions`, desc: "Bulk-resolve detected issues" },
      ],
    },
  ]

  const quickChecklist = [
    "Run Gap Discovery Engine to identify undocumented content",
    "Check Count Validation for any stale numbers",
    "Run Route Verification to confirm zero broken navigation links",
    "Validate TOC Integrity for all documentation pages",
    "Review Pattern Compliance for naming and structure issues",
    "Use Fix Actions to bulk-resolve any detected problems",
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
            <Rocket className="h-5 w-5 text-accent" />
          </div>
          <div>
            <Badge className="bg-green-500/20 text-green-400 border-0 mb-2">Start Here</Badge>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Getting Started</h1>
            <p className="text-muted-foreground">
              Choose your role-based journey through Document Administration
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">2 Journeys</Badge>
          <Badge variant="outline">8 Pages</Badge>
          <Badge variant="outline">Role-Based</Badge>
        </div>
      </div>

      {/* Role Description */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 shrink-0">
            <Users className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">How to use this guide</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Document Administration is organized into two sections by role. <strong className="text-foreground">Documentation Health</strong> is for strategic oversight -- coverage tracking and gap discovery. <strong className="text-foreground">Quality Engineering</strong> is for automated validation and bulk fixes. Find your role below and follow the recommended page order.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Journey Cards */}
      <div className="space-y-6">
        {journeys.map((journey) => (
          <Card key={journey.title} className="border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg border ${journey.color}`}>
                  <journey.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">{journey.title}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-0.5">{journey.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {journey.steps.map((step, i) => (
                  <Link
                    key={step.title}
                    href={step.href}
                    className="flex items-center gap-4 rounded-lg border border-border/50 p-4 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium text-foreground shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Validation Checklist */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            Quick Validation Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {quickChecklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border text-[10px] font-medium text-muted-foreground shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back to Overview */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
              <HeartPulse className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Document Administration</p>
              <p className="text-xs text-muted-foreground mt-0.5">Return to the main overview to explore all sections.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href={DA}>
              Overview
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
