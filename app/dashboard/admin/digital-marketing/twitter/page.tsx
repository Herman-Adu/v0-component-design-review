import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Globe,
  ArrowRight,
  Megaphone,
  PenSquare,
  Hash,
  MessageSquare,
  BarChart3,
  List,
} from "lucide-react"

const DM = "/dashboard/admin/digital-marketing"

const plannedFeatures = [
  {
    title: "Tweet Composer",
    description: "Compose tweets with 280-character enforcement, image attachment sizing, and mobile/desktop preview.",
    icon: PenSquare,
  },
  {
    title: "Thread Builder",
    description: "Create multi-tweet threads for in-depth content. Automatic numbering, character tracking per tweet, and thread preview.",
    icon: List,
  },
  {
    title: "Hashtag Strategy",
    description: "Curated hashtag lists for electrical services, local marketing, and industry events. Track trending tags.",
    icon: Hash,
  },
  {
    title: "Engagement Tracking",
    description: "Monitor replies, retweets, likes, and impressions. Identify top-performing content and optimal posting times.",
    icon: BarChart3,
  },
  {
    title: "Quick Response Templates",
    description: "Pre-written responses for common enquiries, compliments, and complaints. Maintain professional tone at speed.",
    icon: MessageSquare,
  },
]

export default function TwitterOverviewPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-neutral-500/10 border border-neutral-500/20">
            <Globe className="h-5 w-5 text-neutral-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Twitter/X Marketing</h1>
            <p className="text-muted-foreground">Quick updates, engagement, and real-time customer interaction</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Quick Updates</Badge>
          <Badge className="bg-muted text-muted-foreground border-0">Coming Soon</Badge>
        </div>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-neutral-500/20 bg-neutral-500/5">
        <CardContent className="flex gap-4 p-6">
          <Globe className="h-6 w-6 text-neutral-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground mb-1">Twitter/X Section Under Development</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Twitter/X marketing tools are being built out in an upcoming session. This section will cover a tweet composer with 280-character enforcement, thread builder, hashtag strategy, engagement tracking, and quick response templates. The existing Social Media content tool includes Twitter post templates in the meantime.
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
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-neutral-500/10 shrink-0">
                      <Icon className="h-4 w-4 text-neutral-400" />
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
          <h3 className="text-sm font-semibold text-foreground mb-3">Twitter/X Platform Specs</h3>
          <div className="space-y-2">
            {[
              { spec: "Tweet character limit", value: "280 characters" },
              { spec: "Image size", value: "1200 x 675 pixels (16:9 ratio)" },
              { spec: "Video length", value: "Up to 2 minutes 20 seconds" },
              { spec: "Thread length", value: "Up to 25 tweets" },
              { spec: "Best posting times", value: "Monday-Friday, 12-3pm" },
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
