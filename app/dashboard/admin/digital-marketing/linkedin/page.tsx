import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Share2,
  ArrowRight,
  Megaphone,
  Users,
  FileText,
  PenSquare,
  BarChart3,
  Building2,
  CheckCircle2,
} from "lucide-react"

const DM = "/dashboard/admin/digital-marketing"

const plannedFeatures = [
  {
    title: "Company Page Management",
    description: "Set up and optimise your LinkedIn company page with consistent branding, service descriptions, and team highlights.",
    icon: Building2,
  },
  {
    title: "Post Composer",
    description: "Professional post composer with 3000 character limit, formatting guidelines, hashtag suggestions, and mobile/desktop preview.",
    icon: PenSquare,
  },
  {
    title: "Article Publisher",
    description: "Long-form article templates for thought leadership. Repurpose learning hub articles for LinkedIn's publishing platform.",
    icon: FileText,
  },
  {
    title: "B2B Engagement Strategy",
    description: "Connection targeting, InMail templates for commercial clients, and engagement tracking for business development.",
    icon: Users,
  },
  {
    title: "Analytics Dashboard",
    description: "Track post performance, follower growth, profile views, and engagement rates. Compare content types and posting times.",
    icon: BarChart3,
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
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">LinkedIn Marketing</h1>
            <p className="text-muted-foreground">Professional B2B presence and thought leadership for electrical services</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">B2B Focus</Badge>
          <Badge className="bg-muted text-muted-foreground border-0">Coming Soon</Badge>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-sky-500/20 bg-sky-500/5">
        <CardContent className="flex gap-4 p-6">
          <Share2 className="h-6 w-6 text-sky-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">LinkedIn Section Under Development</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The LinkedIn marketing tools are being built out in an upcoming session. This section will cover company page management, a professional post composer with 3000-character support, article publishing, B2B engagement strategy, and analytics. In the meantime, the existing Social Media content tool includes LinkedIn post templates.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Planned Features */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Planned Features</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {plannedFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-border/50 opacity-75">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-sky-500/10 shrink-0">
                      <Icon className="h-4 w-4 text-sky-500" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Platform Specs */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">LinkedIn Platform Specs</h3>
          <div className="space-y-2">
            {[
              { spec: "Post character limit", value: "3,000 characters" },
              { spec: "Article length", value: "Unlimited (recommended 1,500-2,000 words)" },
              { spec: "Image size", value: "1200 x 627 pixels (1.91:1 ratio)" },
              { spec: "Video length", value: "Up to 10 minutes" },
              { spec: "Best posting times", value: "Tuesday-Thursday, 8-10am" },
            ].map((item) => (
              <div key={item.spec} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.spec}</span>
                <span className="text-foreground font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Nav */}
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
            <Link href={DM}>Overview <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
