import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Globe,
  ArrowRight,
  Building2,
  PenSquare,
  Megaphone,
  FileText,
  LineChart,
  CheckCircle2,
} from "lucide-react"

const FB = "/dashboard/admin/digital-marketing/facebook"

const tools = [
  {
    href: `${FB}/page-management`,
    icon: Building2,
    title: "Page Management",
    description:
      "Set up and maintain your Facebook Business page with consistent branding, service listings, reviews management, and contact info.",
    role: "Business Owner / Marketing Lead",
    status: "Active",
  },
  {
    href: `${FB}/composer`,
    icon: PenSquare,
    title: "Post Composer",
    description:
      "Compose Facebook posts with image sizing, link preview optimisation, audience targeting tips, and copy-to-clipboard.",
    role: "Content Creator / Marketing Lead",
    status: "Active",
  },
  {
    href: `${FB}/events`,
    icon: Megaphone,
    title: "Events & Promotions",
    description:
      "Create and promote events: open days, seasonal offers, community workshops. Event templates with RSVP best practices.",
    role: "Business Owner / Marketing Lead",
    status: "Active",
  },
  {
    href: `${FB}/messenger`,
    icon: FileText,
    title: "Messenger Templates",
    description:
      "Auto-reply templates for common enquiries, business hours messages, quick-reply buttons, and conversation flows.",
    role: "Office Staff / Business Owner",
    status: "Active",
  },
  {
    href: `${FB}/analytics`,
    icon: LineChart,
    title: "Analytics Dashboard",
    description:
      "Track page likes, post reach, engagement rate, Messenger response times, and review sentiment.",
    role: "All Roles",
    status: "Active",
  },
]

const strategy = [
  {
    title: "Build Community",
    items: ["Page Management", "Post Composer"],
    description: "Professional page with consistent, engaging local content",
  },
  {
    title: "Drive Action",
    items: ["Events & Promotions", "Messenger Templates"],
    description: "Convert interest into bookings through events and instant replies",
  },
  {
    title: "Measure & Grow",
    items: ["Analytics Dashboard"],
    description: "Track what resonates and optimise your community strategy",
  },
]

export default function FacebookOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Globe className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Facebook Marketing
            </h1>
            <p className="text-muted-foreground">
              Community engagement, local awareness, and customer interaction
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">5 Tools</Badge>
          <Badge className="bg-indigo-500/20 text-indigo-400 border-0">Community</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">All Active</Badge>
        </div>
      </div>

      {/* Why Facebook */}
      <Card className="border-indigo-500/20 bg-indigo-500/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-500/10 shrink-0">
            <Globe className="h-4 w-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Why Facebook for Electrical Services?</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Facebook remains the largest social platform for local service businesses. It excels at community engagement, local recommendations, review management, and event promotion. Most homeowners looking for a local electrician will check your Facebook page before booking. A well-maintained page with positive reviews is one of your strongest lead generators.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Flow */}
      <div className="grid gap-4 md:grid-cols-3">
        {strategy.map((phase) => (
          <Card key={phase.title} className="border-border/50">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-foreground mb-1">{phase.title}</p>
              <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>
              <div className="space-y-2">
                {phase.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Card key={tool.href} className="border-indigo-500/30">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-500/10 shrink-0">
                    <Icon className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{tool.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{tool.role}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="shrink-0 h-8 w-8 p-0" asChild>
                  <Link href={tool.href}><ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detail Cards */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Pages</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Card key={tool.href} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-md bg-muted">
                        <Icon className="h-4 w-4 text-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{tool.title}</p>
                        <p className="text-[10px] text-muted-foreground">{tool.role}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">{tool.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{tool.description}</p>
                  <Button variant="outline" size="sm" className="bg-transparent" asChild>
                    <Link href={tool.href}>Open <ArrowRight className="ml-2 h-3 w-3" /></Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Platform Specs */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Facebook Platform Specifications</h3>
          <div className="space-y-2">
            {[
              { spec: "Post character limit", value: "63,206 (recommended < 250)" },
              { spec: "Image size (posts)", value: "1200 x 630 pixels (1.91:1)" },
              { spec: "Event cover image", value: "1920 x 1005 pixels" },
              { spec: "Video length", value: "Up to 240 minutes" },
              { spec: "Best posting times", value: "Wed-Fri, 1-4pm" },
              { spec: "Optimal frequency", value: "1-2 posts per day" },
              { spec: "Messenger response goal", value: "Under 15 minutes for 'Very Responsive' badge" },
            ].map((item) => (
              <div key={item.spec} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.spec}</span>
                <span className="text-foreground font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
              <Megaphone className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Digital Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">Explore other platforms and tools.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href="/dashboard/admin/digital-marketing">
              Overview <ArrowRight className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
