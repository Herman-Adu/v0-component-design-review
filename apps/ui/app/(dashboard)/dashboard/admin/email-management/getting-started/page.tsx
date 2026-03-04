import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  Rocket,
  CheckCircle2,
} from "lucide-react"

const EA = "/dashboard/admin/email-administration"

export default function EmailAdministrationGettingStartedPage() {
  const journeys = [
    {
      title: "Office Staff / Business Admin",
      description: "Handle incoming requests, send branded replies, and track job status",
      icon: Briefcase,
      color: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      steps: [
        { title: "Request Management Overview", href: `${EA}/request-management`, desc: "Understand the request handling workflow" },
        { title: "Email Dashboard", href: `${EA}/request-management/email-dashboard`, desc: "View, filter, and manage all form submissions" },
        { title: "Testing & Ops Guide", href: `${EA}/request-management/testing-and-ops-guide`, desc: "Test the full pipeline in dev mode" },
      ],
    },
    {
      title: "Project Lead / Business Admin",
      description: "Configure brand identity, templates, scheduling, and recipient groups",
      icon: Palette,
      color: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      steps: [
        { title: "Configuration Overview", href: `${EA}/configuration`, desc: "See all available brand and template settings" },
        { title: "Template & Brand", href: `${EA}/configuration/template-and-brand`, desc: "Edit company details, colors, and SLA times" },
        { title: "Email Preview", href: `${EA}/configuration/email-preview`, desc: "Preview all 6 templates with urgency styling" },
        { title: "A/B Subject Lines", href: `${EA}/configuration/ab-subject-lines`, desc: "Manage subject line variants and weights" },
      ],
    },
    {
      title: "DevOps / CTO",
      description: "Monitor API health, review delivery logs, audit security, and manage versioning",
      icon: Shield,
      color: "bg-red-500/15 text-red-400 border-red-500/30",
      steps: [
        { title: "Infrastructure Overview", href: `${EA}/infrastructure`, desc: "System architecture and component health" },
        { title: "Send Configuration", href: `${EA}/infrastructure/send-configuration`, desc: "API keys, from-addresses, and test email delivery" },
        { title: "Delivery Logs", href: `${EA}/infrastructure/delivery-logs`, desc: "Real-time log of every outbound email" },
        { title: "Security Audit", href: `${EA}/infrastructure/security-audit`, desc: "21-check audit across all form actions" },
      ],
    },
  ]

  const quickChecklist = [
    "Verify Resend API key is set in environment variables",
    "Send a test email from Send Configuration page",
    "Check Delivery Logs to confirm successful delivery",
    "Review Template & Brand settings match your company details",
    "Preview all 6 email templates across urgency levels",
    "Run the Security Audit to confirm all 21 checks pass",
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
              Choose your role-based journey through Email Administration
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">3 Journeys</Badge>
          <Badge variant="outline">14 Pages</Badge>
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
              Email Administration is organized into three sections by role. Find your role below and follow the recommended page order. Each journey builds on the previous page, so working through them in sequence gives you the best understanding of the system.
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

      {/* Quick Setup Checklist */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-accent" />
            Quick Setup Checklist
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
              <Mail className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Email Administration</p>
              <p className="text-xs text-muted-foreground mt-0.5">Return to the main overview to explore all sections.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href={EA}>
              Overview
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
