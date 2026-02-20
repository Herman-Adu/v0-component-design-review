import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  ArrowRight,
  Share2,
  CheckCircle2,
  Lightbulb,
  Eye,
  Users,
  TrendingUp,
  BarChart3,
  Target,
  Clock,
} from "lucide-react"

const LI = "/dashboard/admin/digital-marketing/linkedin"

const keyMetrics = [
  {
    title: "Profile Views",
    description: "How many people visit your company page. Indicates brand awareness and search visibility.",
    target: "Steady week-on-week growth",
    icon: Eye,
    category: "Awareness",
  },
  {
    title: "Follower Growth",
    description: "Net new followers per week/month. Quality matters more than quantity -- focus on your target audience.",
    target: "5-15 new followers per week (for SMEs)",
    icon: Users,
    category: "Awareness",
  },
  {
    title: "Post Impressions",
    description: "Total times your posts appear in feeds. Affected by posting time, content type, and early engagement.",
    target: "Track trend, not absolute numbers",
    icon: BarChart3,
    category: "Reach",
  },
  {
    title: "Engagement Rate",
    description: "Reactions + comments + shares divided by impressions. The most important metric for content quality.",
    target: "2-5% is good, 5%+ is excellent",
    icon: TrendingUp,
    category: "Engagement",
  },
  {
    title: "Click-Through Rate",
    description: "Clicks on links, CTAs, or 'see more'. Indicates how compelling your content and calls-to-action are.",
    target: "1-3% for organic posts",
    icon: Target,
    category: "Conversion",
  },
  {
    title: "Visitor Demographics",
    description: "Job titles, industries, locations, and company sizes of your page visitors. Validates your targeting.",
    target: "Majority matching your target profiles",
    icon: Users,
    category: "Targeting",
  },
]

const reportingCadence = [
  {
    frequency: "Weekly",
    metrics: ["Post impressions", "Engagement rate", "New followers"],
    action: "Identify top-performing content of the week. Note what format/topic worked best.",
  },
  {
    frequency: "Monthly",
    metrics: ["Follower growth trend", "Profile views", "Visitor demographics", "Click-through rate"],
    action: "Review content strategy against goals. Adjust posting mix based on data.",
  },
  {
    frequency: "Quarterly",
    metrics: ["All metrics vs. previous quarter", "Content ROI", "Lead generation attribution"],
    action: "Strategic review: is LinkedIn driving commercial enquiries? Adjust resource allocation.",
  },
]

const contentComparison = [
  { type: "Text-only posts", reach: "High", engagement: "High", effort: "Low", notes: "Best for thoughts, tips, and stories" },
  { type: "Image posts", reach: "Very High", engagement: "Very High", effort: "Medium", notes: "Project photos, team shots, infographics" },
  { type: "Video posts", reach: "Very High", engagement: "High", effort: "High", notes: "Short-form (under 90 seconds) performs best" },
  { type: "Document/Carousel", reach: "High", engagement: "Very High", effort: "Medium", notes: "Step-by-step guides, before/after showcases" },
  { type: "Articles", reach: "Medium", engagement: "Medium", effort: "High", notes: "Long-term SEO value, permanent on profile" },
  { type: "Polls", reach: "Very High", engagement: "Very High", effort: "Low", notes: "Great for audience research and reach" },
]

const dashboardChecklist = [
  "Access LinkedIn Page Analytics (Admin View > Analytics tab)",
  "Set up a monthly reporting template (spreadsheet or document)",
  "Define your 3 key metrics to track consistently",
  "Establish baseline numbers before starting new campaigns",
  "Compare week-on-week and month-on-month, not day-to-day",
  "Tag content by type/topic so you can compare performance by category",
  "Export analytics monthly for long-term trend tracking",
]

export default function LinkedInAnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <LineChart className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              LinkedIn Analytics
            </h1>
            <p className="text-muted-foreground">
              Track performance, measure engagement, and optimise your LinkedIn presence
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">All Roles</Badge>
          <Badge className="bg-sky-500/20 text-sky-400 border-0">Performance Tracking</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Key Metrics to Track</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon
            return (
              <Card key={metric.title} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-sky-500" />
                      <p className="font-semibold text-foreground text-sm">{metric.title}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px]">{metric.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-2">{metric.description}</p>
                  <p className="text-xs">
                    <span className="text-foreground font-medium">Target: </span>
                    <span className="text-muted-foreground">{metric.target}</span>
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Content Type Comparison */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Content Type Performance Comparison</CardTitle>
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
                {contentComparison.map((row) => (
                  <tr key={row.type} className="border-b border-border/50">
                    <td className="py-2 pr-4 text-foreground font-medium">{row.type}</td>
                    <td className="py-2 pr-4">
                      <Badge className={row.reach.includes("Very") ? "bg-sky-500/20 text-sky-400 border-0 text-[10px]" : "bg-muted text-muted-foreground border-0 text-[10px]"}>
                        {row.reach}
                      </Badge>
                    </td>
                    <td className="py-2 pr-4">
                      <Badge className={row.engagement.includes("Very") ? "bg-green-500/20 text-green-400 border-0 text-[10px]" : "bg-muted text-muted-foreground border-0 text-[10px]"}>
                        {row.engagement}
                      </Badge>
                    </td>
                    <td className="py-2 pr-4">
                      <Badge className={row.effort === "Low" ? "bg-green-500/20 text-green-400 border-0 text-[10px]" : row.effort === "High" ? "bg-amber-500/20 text-amber-400 border-0 text-[10px]" : "bg-muted text-muted-foreground border-0 text-[10px]"}>
                        {row.effort}
                      </Badge>
                    </td>
                    <td className="py-2 text-muted-foreground">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Reporting Cadence */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Reporting Cadence</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {reportingCadence.map((report) => (
            <Card key={report.frequency} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-sky-500" />
                  <CardTitle className="text-sm">{report.frequency}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-3">
                  {report.metrics.map((metric) => (
                    <div key={metric} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-sky-500 shrink-0" />
                      <span className="text-xs text-muted-foreground">{metric}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-foreground font-medium">{report.action}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Setup Checklist */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-sky-500" />
            Analytics Setup Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {dashboardChecklist.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-500 shrink-0 mt-0.5" />
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
            <p className="text-sm font-medium text-foreground">Focus on Engagement Rate, Not Vanity Metrics</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Impressions and follower counts feel good but don't directly drive business. Engagement rate tells you if your content resonates with your audience. A post with 200 impressions and 10% engagement is far more valuable than one with 2,000 impressions and 0.5% engagement. Build for your ideal client, not for reach.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nav */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 shrink-0">
              <Share2 className="h-5 w-5 text-sky-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to LinkedIn Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">Explore other LinkedIn tools.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href={LI}>Overview <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
