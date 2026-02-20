import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FlaskConical,
  SearchCheck,
  Link2,
  ClipboardCheck,
  FileCheck,
  Wrench,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Quality Engineering | Document Administration",
  description: "Automated documentation quality assurance: validation checks, route verification, pattern compliance, and remediation tools.",
}

const qaTools = [
  {
    title: "Count Validation",
    description: "Verify documented component counts match actual codebase. Catches drift between docs and reality.",
    href: "/dashboard/admin/document-administration/quality-engineering/count-validation",
    icon: SearchCheck,
    badge: "Automated",
    status: "active",
  },
  {
    title: "Route Verification",
    description: "Check all documented routes resolve to actual page files. Catches broken nav links and missing pages.",
    href: "/dashboard/admin/document-administration/quality-engineering/route-verification",
    icon: Link2,
    badge: "Automated",
    status: "active",
  },
  {
    title: "TOC Integrity",
    description: "Validate table of contents entries match page headings and section structure across all doc pages.",
    href: "/dashboard/admin/document-administration/quality-engineering/toc-integrity",
    icon: ClipboardCheck,
    badge: "Automated",
    status: "active",
  },
  {
    title: "Pattern Compliance",
    description: "Check documentation pages follow established patterns: JSDoc headers, section ordering, code examples.",
    href: "/dashboard/admin/document-administration/quality-engineering/pattern-compliance",
    icon: FileCheck,
    badge: "Automated",
    status: "active",
  },
  {
    title: "Fix Actions",
    description: "One-click remediation for common documentation issues found by the other QA tools.",
    href: "/dashboard/admin/document-administration/quality-engineering/fix-actions",
    icon: Wrench,
    badge: "Semi-Auto",
    status: "active",
  },
]

export default function DocQAPage() {
  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FlaskConical className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Doc QA</h1>
              <p className="text-muted-foreground">Automated documentation quality assurance</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mt-2">
            Run these tools after deployments or content changes to catch documentation drift,
            broken links, and pattern violations before they reach production.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="responsive-grid-3 mb-8">
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">5</p>
                <p className="text-sm text-muted-foreground">QA Tools Available</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-sm text-muted-foreground">Open Issues</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 p-4">
              <Lightbulb className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">Post-Deploy</p>
                <p className="text-sm text-muted-foreground">Recommended Run Schedule</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* QA Tools Grid */}
        <div className="responsive-grid-3">
          {qaTools.map((tool) => (
            <Card key={tool.href} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <tool.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {tool.badge}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-3">{tool.title}</CardTitle>
                <CardDescription className="text-sm">{tool.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                  <Link href={tool.href}>
                    Run Tool
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Workflow Note */}
        <Card className="mt-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground mb-1">Recommended Workflow</p>
                <p className="text-sm text-muted-foreground">
                  Run Count Validation and Route Verification first to catch structural issues,
                  then Pattern Compliance for style consistency. Use Fix Actions to remediate
                  any findings. TOC Integrity should be run after any page restructuring.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
    </div>
  )
}
