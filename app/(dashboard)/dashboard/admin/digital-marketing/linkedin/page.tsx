import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Share2,
  ArrowRight,
  Building2,
  PenSquare,
  FileText,
  LineChart,
  Megaphone,
  CheckCircle2,
  UsersRound,
} from "lucide-react"

const LI = "/dashboard/admin/digital-marketing/linkedin"

const tools = [
  {
    href: `${LI}/company-page`,
    icon: Building2,
    title: "Company Page Management",
    description:
      "Set up and optimise your LinkedIn company page with consistent branding, service descriptions, team showcases, and location details.",
    role: "Business Owner / Marketing Lead",
    status: "Active",
  },
  {
    href: `${LI}/composer`,
    icon: PenSquare,
    title: "Post Composer",
    description:
      "Professional post composer with 3,000-character support, formatting guidelines, hashtag suggestions, and mobile/desktop preview.",
    role: "Content Creator / Marketing Lead",
    status: "Active",
  },
  {
    href: `${LI}/articles`,
    icon: FileText,
    title: "Article Publisher",
    description:
      "Long-form article templates for thought leadership. Repurpose learning hub content for LinkedIn's publishing platform.",
    role: "Content Creator / Business Owner",
    status: "Active",
  },
  {
    href: `${LI}/connection-strategy`,
    icon: UsersRound,
    title: "Connection Strategy",
    description:
      "B2B targeting, connection request templates, InMail sequences for commercial clients, and engagement best practices.",
    role: "Business Owner / Sales Lead",
    status: "Active",
  },
  {
    href: `${LI}/analytics`,
    icon: LineChart,
    title: "Analytics Dashboard",
    description:
      "Track post performance, follower growth, profile views, and engagement rates. Compare content types and posting times.",
    role: "All Roles",
    status: "Active",
  },
]

const strategy = [
  {
    title: "Establish Authority",
    items: ["Company Page", "Article Publisher"],
    description: "Build credibility with a polished profile and thought leadership",
  },
  {
    title: "Engage & Connect",
    items: ["Post Composer", "Connection Strategy"],
    description: "Reach commercial clients and build a professional network",
  },
  {
    title: "Measure & Refine",
    items: ["Analytics Dashboard"],
    description: "Track what works and optimise your LinkedIn presence",
  },
]

export default function LinkedInOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Share2 className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              LinkedIn Marketing
            </h1>
            <p className="text-muted-foreground">
              Professional B2B presence and thought leadership for electrical services
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">5 Tools</Badge>
          <Badge className="bg-sky-500/20 text-sky-400 border-0">B2B Focus</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">All Active</Badge>
        </div>
      </div>

      {/* Why LinkedIn */}
      <Card className="border-sky-500/20 bg-sky-500/5">
        <CardContent className="flex gap-4 p-5">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-sky-500/10 shrink-0">
            <Share2 className="h-4 w-4 text-sky-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Why LinkedIn for Electrical Services?</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              LinkedIn is the primary platform for reaching commercial clients, property managers, facilities teams, and construction project leads. A strong LinkedIn presence positions your business as a professional, NICEIC-registered contractor that commercial clients can trust with large-scale projects, maintenance contracts, and emergency callouts.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Flow */}
        <div className="responsive-grid-3">
        {strategy.map((phase) => (
          <Card key={phase.title} className="border-border/50">
            <CardContent className="p-5">
              <p className="text-lg font-semibold text-foreground mb-1">{phase.title}</p>
              <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>
              <div className="space-y-2">
                {phase.items.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Access Grid */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Card key={tool.href} className="border-sky-500/30">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-sky-500/10 shrink-0">
                    <Icon className="h-4 w-4 text-sky-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{tool.title}</p>
                    <p className="text-[10px] text-muted-foreground truncate">{tool.role}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="shrink-0 h-8 w-8 p-0" asChild>
                  <Link href={tool.href}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Tool Detail Cards */}
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
                    <Link href={tool.href}>
                      Open <ArrowRight className="ml-2 h-3 w-3" />
                    </Link>
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
          <h3 className="text-sm font-semibold text-foreground mb-3">LinkedIn Platform Specifications</h3>
          <div className="space-y-2">
            {[
              { spec: "Post character limit", value: "3,000 characters" },
              { spec: "Article length", value: "Unlimited (1,500-2,000 words recommended)" },
              { spec: "Image size (posts)", value: "1200 x 627 pixels (1.91:1 ratio)" },
              { spec: "Image size (articles)", value: "744 x 400 pixels" },
              { spec: "Video length", value: "Up to 10 minutes" },
              { spec: "Best posting times", value: "Tuesday-Thursday, 8-10am" },
              { spec: "Hashtag limit", value: "3-5 per post (recommended)" },
            ].map((item) => (
              <div key={item.spec} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.spec}</span>
                <span className="text-foreground font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Back to DM */}
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
