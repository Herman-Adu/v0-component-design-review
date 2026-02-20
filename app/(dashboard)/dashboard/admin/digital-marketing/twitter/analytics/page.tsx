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
} from "lucide-react"

const TW = "/dashboard/admin/digital-marketing/twitter"

const keyMetrics = [
  { title: "Impressions", description: "How many times your tweets appear in feeds. Indicates overall reach and visibility.", target: "Track weekly trend, aim for growth", icon: Eye, category: "Reach" },
  { title: "Engagement Rate", description: "Likes + retweets + replies + clicks divided by impressions. Your most important quality metric.", target: "1-3% is good, 3%+ is excellent", icon: TrendingUp, category: "Engagement" },
  { title: "Profile Visits", description: "People who click through to your profile. Shows interest beyond the tweet itself.", target: "Steady growth week-on-week", icon: Users, category: "Interest" },
  { title: "Link Clicks", description: "Clicks on URLs in your tweets. Directly measures traffic to your website or booking page.", target: "Track as conversion metric", icon: MousePointer, category: "Conversion" },
  { title: "Follower Growth", description: "Net new followers per week. Quality over quantity -- are you reaching your target audience?", target: "5-20 per week for local SMEs", icon: Users, category: "Growth" },
  { title: "Reply Rate", description: "How many people reply to your tweets. High reply rate signals strong community engagement.", target: "Higher is always better", icon: BarChart3, category: "Community" },
]

const contentPerformance = [
  { type: "Safety tips", impressions: "High", engagement: "Very High", effort: "Low", notes: "Consistently top performers" },
  { type: "Project photos", impressions: "Very High", engagement: "High", effort: "Medium", notes: "Before/after gets most saves" },
  { type: "Threads", impressions: "High", engagement: "Very High", effort: "High", notes: "Best for deep engagement" },
  { type: "Questions/Polls", impressions: "Very High", engagement: "Very High", effort: "Low", notes: "Algorithm loves interaction" },
  { type: "Promotions", impressions: "Low", engagement: "Low", effort: "Low", notes: "Limit to 20% of content" },
  { type: "Behind-the-scenes", impressions: "Medium", engagement: "High", effort: "Low", notes: "Builds trust and personality" },
]

const reportingSchedule = [
  { frequency: "Weekly", metrics: ["Impressions trend", "Engagement rate", "Top tweet of the week"], action: "Identify what content type worked best. Repeat successful formats." },
  { frequency: "Monthly", metrics: ["Follower growth", "Profile visits", "Link clicks", "Content type comparison"], action: "Adjust content mix based on data. Drop underperforming formats." },
  { frequency: "Quarterly", metrics: ["All metrics vs previous quarter", "Audience demographics", "Business impact"], action: "Strategic review: is Twitter driving enquiries? Adjust time investment." },
]

const setupChecklist = [
  "Access Twitter Analytics (analytics.twitter.com or in-app Analytics tab)",
  "Set up a monthly tracking spreadsheet or document",
  "Define your 3 key metrics to focus on",
  "Record baseline numbers before starting new strategies",
  "Tag content by type so you can compare categories",
  "Review best posting times from your own data (not generic advice)",
  "Export data monthly for long-term trend analysis",
]

export default function TwitterAnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <LineChart className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Twitter/X Analytics
            </h1>
            <p className="text-muted-foreground">
              Track performance, identify top content, and optimise your Twitter presence
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">All Roles</Badge>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Performance Tracking</Badge>
        </div>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Key Metrics</h2>
        <div className="responsive-grid-3">
          {keyMetrics.map((m) => {
            const Icon = m.icon
            return (
              <Card key={m.title} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-emerald-500" />
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
                  <th className="text-left py-2 pr-4 text-foreground font-semibold">Impressions</th>
                  <th className="text-left py-2 pr-4 text-foreground font-semibold">Engagement</th>
                  <th className="text-left py-2 pr-4 text-foreground font-semibold">Effort</th>
                  <th className="text-left py-2 text-foreground font-semibold">Notes</th>
                </tr>
              </thead>
              <tbody>
                {contentPerformance.map((row) => (
                  <tr key={row.type} className="border-b border-border/50">
                    <td className="py-2 pr-4 text-foreground font-medium">{row.type}</td>
                    <td className="py-2 pr-4"><Badge className={row.impressions.includes("Very") ? "bg-emerald-500/20 text-emerald-400 border-0 text-[10px]" : "bg-muted text-muted-foreground border-0 text-[10px]"}>{row.impressions}</Badge></td>
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
                  <Clock className="h-4 w-4 text-emerald-500" />
                  <CardTitle className="text-sm">{r.frequency}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-3">
                  {r.metrics.map((m) => (
                    <div key={m} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
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
            <Target className="h-4 w-4 text-emerald-500" />
            Analytics Setup Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2.5">
            {setupChecklist.map((item) => (
              <div key={item} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
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
            <p className="text-sm font-medium text-foreground">Don't Chase Viral -- Chase Consistent</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              One viral tweet is worth less than 90 days of consistent, quality posting. The algorithm rewards accounts that show up regularly. Focus on posting 3-5 quality tweets per day, engaging with your community daily, and letting compound growth do its work. Most accounts see meaningful results after 60-90 days of consistency.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nav */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 shrink-0">
              <Globe className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Twitter/X Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">Explore other Twitter tools.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href={TW}>Overview <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
