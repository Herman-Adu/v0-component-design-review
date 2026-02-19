import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Inbox,
  Briefcase,
  ClipboardCheck,
  ArrowRight,
  MessageSquare,
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react"

export default function RequestManagementOverviewPage() {
  const features = [
    {
      title: "Email Dashboard",
      description:
        "Full job tracking for all form submissions. Data table with tab filtering by type (All, Contact, Quotation, Service), status pipeline, correspondence threads, activity timeline, inline branded replies, team assignment, and bulk operations.",
      icon: Briefcase,
      href: "/dashboard/admin/email-administration/request-management/email-dashboard",
      role: "Business Administrator",
    },
    {
      title: "Testing & Ops Guide",
      description:
        "Step-by-step operational procedures for testing the request pipeline end-to-end. Covers dev mode, email delivery verification, and troubleshooting common issues.",
      icon: ClipboardCheck,
      href: "/dashboard/admin/email-administration/request-management/testing-and-ops-guide",
      role: "Business Administrator",
    },
  ]

  const capabilities = [
    {
      icon: MessageSquare,
      title: "Branded Correspondence",
      description: "Send professional branded reply emails directly from the dashboard with configurable sections, presets, and live preview.",
    },
    {
      icon: Users,
      title: "Team Assignment",
      description: "Assign requests to team members, track who is handling what, and see unassigned requests at a glance.",
    },
    {
      icon: BarChart3,
      title: "Status Pipeline",
      description: "Track requests through their lifecycle: New, Acknowledged, In Progress, Quoted, Completed, and Closed.",
    },
    {
      icon: Clock,
      title: "Priority Management",
      description: "Flag urgent and high-priority requests with SLA tracking. Filter and sort by priority across the dashboard.",
    },
    {
      icon: CheckCircle2,
      title: "Bulk Operations",
      description: "Select multiple requests and update status, assign team members, or archive in batch.",
    },
    {
      icon: AlertTriangle,
      title: "Dev Mode Testing",
      description: "Redirect all outbound emails to a test address for safe testing with real data. Toggle on/off with a single switch.",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
            <Inbox className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Request Management</h1>
            <p className="text-muted-foreground">
              Handle client requests from initial contact through to resolution
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Business Administrator</Badge>
          <Badge variant="outline">Office Staff</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">Dashboard Active</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">Correspondence Active</Badge>
          <Badge className="bg-accent/20 text-accent border-0">Dev Mode Available</Badge>
        </div>
      </div>

      {/* Role Description */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 shrink-0">
            <Users className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Who is this for?</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              This section is designed for <strong className="text-foreground">Business Administrators</strong> and <strong className="text-foreground">Office Staff</strong> who handle day-to-day client communications. It provides the tools to track incoming form submissions, manage the request lifecycle, send branded correspondence, and ensure nothing falls through the cracks. For email branding and templates, see <Link href="/dashboard/admin/email-administration/configuration" className="text-accent hover:underline">Configuration</Link>. For technical operations, see <Link href="/dashboard/admin/email-administration/infrastructure" className="text-accent hover:underline">Infrastructure</Link>.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Feature Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Pages</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted">
                      <feature.icon className="h-4 w-4 text-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{feature.role}</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                <Button variant="outline" size="sm" className="mt-4 bg-transparent" asChild>
                  <Link href={feature.href}>
                    Open
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Capabilities Grid */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Capabilities</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((cap) => (
            <Card key={cap.title} className="border-border/50">
              <CardContent className="flex gap-4 p-5">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted shrink-0">
                  <cap.icon className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{cap.title}</p>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{cap.description}</p>
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
              <Briefcase className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Ready to start?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Open the Email Dashboard to view and manage all incoming requests.</p>
            </div>
          </div>
          <Button size="sm" asChild>
            <Link href="/dashboard/admin/email-administration/request-management/email-dashboard">
              Open Dashboard
              <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
