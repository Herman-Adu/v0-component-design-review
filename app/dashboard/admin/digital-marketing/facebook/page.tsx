import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Users,
  ArrowRight,
  Megaphone,
  PenSquare,
  Calendar,
  MessageSquare,
  BarChart3,
  DollarSign,
} from "lucide-react"

const DM = "/dashboard/admin/digital-marketing"

const plannedFeatures = [
  {
    title: "Page Management",
    description: "Set up and maintain your Facebook Business page with consistent branding, service listings, and contact information.",
    icon: Users,
  },
  {
    title: "Post Composer",
    description: "Compose Facebook posts with image sizing, link previews, and audience targeting. Optimise for the Facebook algorithm.",
    icon: PenSquare,
  },
  {
    title: "Event Creation",
    description: "Create and promote events: open days, community workshops, seasonal promotions. Track RSVPs and engagement.",
    icon: Calendar,
  },
  {
    title: "Messenger Configuration",
    description: "Set up auto-replies for common enquiries, business hours away messages, and quick-reply templates.",
    icon: MessageSquare,
  },
  {
    title: "Facebook Ads Integration",
    description: "Campaign templates for local awareness, lead generation, and retargeting. Budget guidance for small service businesses.",
    icon: DollarSign,
  },
  {
    title: "Community Engagement",
    description: "Monitor and respond to reviews, comments, and messages. Track community sentiment and engagement rates.",
    icon: BarChart3,
  },
]

export default function FacebookOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Users className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Facebook Marketing</h1>
            <p className="text-muted-foreground">Community engagement, local awareness, and customer interaction</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Community</Badge>
          <Badge className="bg-muted text-muted-foreground border-0">Coming Soon</Badge>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-indigo-500/20 bg-indigo-500/5">
        <CardContent className="flex gap-4 p-6">
          <Users className="h-6 w-6 text-indigo-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Facebook Section Under Development</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Facebook marketing tools are being built out in an upcoming session. This section will cover page management, a post composer, event creation, Messenger auto-replies, Facebook Ads integration, and community engagement tracking. The existing Social Media content tool includes Facebook post templates in the meantime.
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
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-indigo-500/10 shrink-0">
                      <Icon className="h-4 w-4 text-indigo-500" />
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
          <h3 className="text-sm font-semibold text-foreground mb-3">Facebook Platform Specs</h3>
          <div className="space-y-2">
            {[
              { spec: "Post character limit", value: "63,206 characters (recommended < 250)" },
              { spec: "Image size", value: "1200 x 630 pixels (1.91:1 ratio)" },
              { spec: "Video length", value: "Up to 240 minutes" },
              { spec: "Event cover image", value: "1920 x 1005 pixels" },
              { spec: "Best posting times", value: "Wednesday-Friday, 1-4pm" },
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
