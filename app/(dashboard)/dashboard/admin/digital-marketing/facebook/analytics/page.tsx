import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  ArrowRight,
  Globe,
  CheckCircle2,
  Lightbulb,
  Eye,
  Users,
  TrendingUp,
  BarChart3,
  Target,
  Clock,
  MousePointer,
  ThumbsUp,
  MessageSquare,
} from "lucide-react"

const FB = "/dashboard/admin/digital-marketing/facebook"

const keyMetrics = [
  { title: "Page Reach", description: "Total unique users who saw any content from your page. Measures overall visibility across feeds, stories, and shares.", target: "Track weekly trend, aim for steady growth", icon: Eye, category: "Reach" },
  { title: "Engagement Rate", description: "Reactions + comments + shares divided by reach. Your core quality metric for content resonance.", target: "1-3% is average, 5%+ is excellent", icon: TrendingUp, category: "Engagement" },
  { title: "Page Likes / Followers", description: "Net new followers per period. Focus on quality -- are they local homeowners and businesses in your service area?", target: "10-30 per week for local SMEs", icon: ThumbsUp, category: "Growth" },
  { title: "Post Clicks", description: "Clicks on your content: links, photos, see more. Measures active interest beyond passive scrolling.", target: "Track as conversion metric", icon: MousePointer, category: "Conversion" },
  { title: "Comments & Replies", description: "Direct conversations on your posts. High comment rates signal community trust and boost algorithm distribution.", target: "Reply to 100% within 2 hours", icon: MessageSquare, category: "Community" },
  { title: "Shares", description: "People sharing your content to their own feeds. The highest form of organic endorsement and free reach expansion.", target: "Aim for 1-2 shares per post", icon: Users, category: "Amplification" },
]

const contentPerformance = [
  { type: "Before/After projects", reach: "Very High", engagement: "Very High", effort: "Medium", notes: "Top performer consistently" },
  { type: "Safety tips & advice", reach: "High", engagement: "High", effort: "Low", notes: "High save rate, positions expertise" },
  { type: "Customer testimonials", reach: "High", engagement: "Very High", effort: "Low", notes: "Build trust, encourage reviews" },
  { type: "Events & promotions", reach: "Very High", engagement: "Medium", effort: "Medium", notes: "Good for reach spikes" },
  { type: "Behind-the-scenes", reach: "Medium", engagement: "High", effort: "Low", notes: "Humanises the brand" },
  { type: "Direct promotions", reach: "Low", engagement: "Low", effort: "Low", notes: "Limit to 20% of content" },
]

const reportingSchedule = [
  { frequency: "Weekly", metrics: ["Page reach trend", "Top performing post", "Response time to messages"], action: "Identify winning content type. Double down on formats that got the most shares." },
  { frequency: "Monthly", metrics: ["Follower growth", "Engagement rate by post type", "Click-through rate", "Messenger enquiries"], action: "Adjust content calendar. Drop underperforming formats, increase what works." },
  { frequency: "Quarterly", metrics: ["All metrics vs previous quarter", "Audience demographics", "Business enquiries from Facebook", "Ad spend ROI"], action: "Strategic review: is Facebook driving real business? Adjust investment accordingly." },
]

const setupChecklist = [
  "Switch to a Facebook Business Page (not personal profile)",
  "Access Meta Business Suite Insights (business.facebook.com)",
  "Set up a monthly tracking spreadsheet or document",
  "Define your 3 key metrics to focus on this quarter",
  "Record baseline numbers before starting new strategies",
  "Tag content by type (project, tip, testimonial, promo) for comparison",
  "Set up Facebook Pixel on your website for conversion tracking",
  "Configure Messenger auto-responses for after-hours enquiries",
]

export default function FacebookAnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <LineChart className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Facebook Analytics
            </h1>
            <p className="text-muted-foreground">
              Track page performance, identify top content, and measure business impact
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">All Roles</Badge>
          <Badge className="bg-indigo-500/20 text-indigo-400 border-0">Performance Tracking</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Key Metrics</h2>
        <div className="responsive-grid-6">
          {keyMetrics.map((m) => {
            const Icon = m.icon
            return (
              <Card key={m.title} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-indigo-500" />
                      <p className="font-semibold text-foreground text-sm">{m.title}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{m.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{m.description}</p>
                  <p className="text-xs"><span className="text-foreground font-medium">Target: </span><span className="text-muted-foreground">{m.target}</span></p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Content Performance */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Content Type Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4 text-foreground font-semibold">Content Type</th>
                  <th className="text-left py-2 pr-4 text-foreground font-semibold">Reach</th>
                  <th className="text-left py-2 pr-4 text-foreground font-semibold">Engagement</th>
                  <th className="text-left py-2 pr-4 text-foreground font-semibold">Effort</th>
                  <th className="text-left py-2 text-foreground font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {contentPerformance.map((row) => (
                  <tr key={row.type} className="border-b border-border/50">
                    <td className="py-2 pr-4 text-foreground font-medium">{row.type}</td>
                    <td className="py-2 pr-4"><Badge className={row.reach.includes("Very") ? "bg-indigo-500/20 text-indigo-400 border-0 text-[10px]" : "bg-muted text-muted-foreground border-0 text-[10px]"}>{row.reach}</Badge></td>
                    <td className="py-2 pr-4"><Badge className={row.engagement.includes("Very") ? "bg-green-500/20 text-green-400 border-0 text-[10px]" : "bg-muted text-muted-foreground border-0 text-[10px]"}>{row.engagement}</Badge></td>
                    <td className="py-2 pr-4"><Badge className={row.effort === "Low" ? "bg-green-500/20 text-green-400 border-0 text-[10px]" : row.effort === "High" ? "bg-amber-500/20 text-amber-400 border-0 text-[10px]" : "bg-muted text-muted-foreground border-0 text-[10px]"}>{row.effort}</Badge></td>
                    <td className="py-2 text-muted-foreground">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reporting Schedule */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Reporting Cadence</h2>
        <div className="responsive-grid-3">
          {reportingSchedule.map((r) => (
            <Card key={r.frequency} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <CardTitle className="text-sm">{r.frequency}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-3">
                  {r.metrics.map((m) => (
                    <div key={m} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-indigo-500 shrink-0" />
                      <span className="text-xs text-muted-foreground">{m}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-foreground font-medium">{r.action}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Setup Checklist */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4 text-indigo-500" />
            Analytics Setup Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {setupChecklist.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tip */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Facebook Rewards Conversations</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              The Facebook algorithm heavily favours posts that generate meaningful conversations. Ask questions, respond to every comment promptly, and create content that people want to discuss. A post with 20 genuine comments will outperform a post with 200 likes every time. Focus on community engagement over vanity metrics.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nav */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 shrink-0">
              <Globe className="h-5 w-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Facebook Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">Explore other Facebook tools.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href={FB}>Overview <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
