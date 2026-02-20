import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MetricsGrid } from "@/components/organisms"
import {
  LineChart,
  ArrowRight,
  Search,
  Settings,
  Target,
  BarChart3,
  Users,
  Phone,
  FileText,
  Zap,
  Lightbulb,
  CheckCircle2,
} from "lucide-react"

const G = "/dashboard/admin/digital-marketing/google"

const setupSteps = [
  { step: "Create a GA4 property in Google Analytics", detail: "One property per website. Enable Enhanced Measurement for automatic page view, scroll, and outbound click tracking." },
  { step: "Add the GA4 Measurement ID to Tag Manager", detail: "Don't install GA4 directly -- use GTM for centralised tag management. See the Tag Manager page." },
  { step: "Verify data collection in Realtime report", detail: "Open your site in a new tab and check the GA4 Realtime view to confirm events are flowing." },
  { step: "Configure data retention to 14 months", detail: "Admin > Data Settings > Data Retention. Default is 2 months -- extend for trend analysis." },
  { step: "Enable Google Signals for cross-device tracking", detail: "Admin > Data Settings > Data Collection. Requires user consent for GDPR compliance." },
  { step: "Link Google Ads account for attribution data", detail: "Admin > Product Links > Google Ads. Enables conversion import and audience sharing." },
]

const keyMetrics = [
  { metric: "Total Leads", description: "Form submissions + phone clicks + quote requests. Primary business KPI.", icon: Target, category: "Conversion" },
  { metric: "Cost per Lead", description: "Total ad spend / total leads. Target: under industry average for electrical services.", icon: BarChart3, category: "Efficiency" },
  { metric: "Conversion Rate", description: "Leads / total sessions. Benchmark: 3-5% for service businesses.", icon: Zap, category: "Conversion" },
  { metric: "Sessions by Source", description: "Organic search, paid search, direct, referral, social. Track which channels drive qualified traffic.", icon: Users, category: "Acquisition" },
  { metric: "Phone Call Clicks", description: "Mobile users tapping your phone number. Often 40-60% of total leads for trade businesses.", icon: Phone, category: "Conversion" },
  { metric: "Top Landing Pages", description: "Which pages drive the most leads. Optimise top performers, fix or redirect underperformers.", icon: FileText, category: "Content" },
]

const conversionGoals = [
  {
    goal: "Quote Form Submission",
    event: "submit_quote",
    value: "Estimated average job value / conversion rate",
    setup: "Mark as conversion in GA4 Events. Assign monetary value for ROAS tracking.",
  },
  {
    goal: "Contact Form Submission",
    event: "generate_lead",
    value: "Lower than quote -- often general enquiries",
    setup: "Mark as conversion. Lower priority than quote submissions.",
  },
  {
    goal: "Phone Call Click",
    event: "phone_call_click",
    value: "Same as quote form -- phone calls often convert higher",
    setup: "Track tel: link clicks via GTM. Mark as conversion in GA4.",
  },
  {
    goal: "Emergency Call",
    event: "emergency_call",
    value: "Higher value -- emergency callouts command premium pricing",
    setup: "Separate from general phone clicks. Track emergency-specific CTAs.",
  },
]

const reportTemplates = [
  {
    name: "Weekly Lead Report",
    dimensions: ["Date", "Source/Medium", "Landing Page"],
    metrics: ["Sessions", "Conversions", "Conversion Rate"],
    filters: "Last 7 days, all traffic sources",
    audience: "Business Owner / Marketing Lead",
  },
  {
    name: "Monthly Channel Performance",
    dimensions: ["Default Channel Group", "Campaign"],
    metrics: ["Sessions", "Engaged Sessions", "Conversions", "Revenue"],
    filters: "Last 30 days, compare to previous period",
    audience: "Marketing Lead",
  },
  {
    name: "Service Page Analysis",
    dimensions: ["Page Path", "Page Title"],
    metrics: ["Views", "Average Engagement Time", "Conversions"],
    filters: "Page path contains /services/",
    audience: "Content Creator / Marketing Lead",
  },
  {
    name: "Ad Campaign ROI",
    dimensions: ["Campaign", "Ad Group", "Keyword"],
    metrics: ["Cost", "Conversions", "Cost per Conversion", "ROAS"],
    filters: "Google Ads traffic only",
    audience: "Business Owner",
  },
]

const attributionModels = [
  { model: "Data-Driven (Recommended)", description: "Uses machine learning to assign credit based on your actual conversion paths. Requires 300+ conversions/month for accuracy." },
  { model: "Last Click", description: "All credit to the last touchpoint before conversion. Simple but ignores the customer journey." },
  { model: "First Click", description: "All credit to the first touchpoint. Good for understanding which channels drive awareness." },
  { model: "Linear", description: "Equal credit to every touchpoint. Fair but doesn't reflect real impact." },
]

export default function GoogleAnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <LineChart className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Analytics & Reporting</h1>
            <p className="text-muted-foreground">GA4 setup, key metrics, goals, custom reports, and attribution</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">All Roles</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-0">Measurement</Badge>
        </div>
      </div>

      {/* GA4 Setup */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-500" />
          GA4 Property Setup
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {setupSteps.map((s, i) => (
                <div key={i} className="flex items-start gap-4 p-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-sm font-medium text-blue-500 shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.step}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          Key Metrics Dashboard
        </h2>
        <MetricsGrid 
          metrics={keyMetrics.map(m => ({
            label: m.metric,
            value: m.description,
            icon: m.icon,
            category: m.category
          }))}
        />
      </div>

      {/* Conversion Goals */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Conversion Goals
        </h2>
        <div className="space-y-3">
          {conversionGoals.map((goal) => (
            <Card key={goal.goal} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-medium text-foreground text-sm">{goal.goal}</p>
                  <code className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">{goal.event}</code>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Value: {goal.value}</p>
                <p className="text-xs text-muted-foreground">{goal.setup}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Report Templates */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Custom Report Templates
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {reportTemplates.map((report) => (
            <Card key={report.name} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{report.name}</CardTitle>
                  <Badge variant="outline" className="text-[10px]">{report.audience}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Dimensions</p>
                  <div className="flex flex-wrap gap-1">
                    {report.dimensions.map((d) => (
                      <code key={d} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">{d}</code>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Metrics</p>
                  <div className="flex flex-wrap gap-1">
                    {report.metrics.map((m) => (
                      <code key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">{m}</code>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{report.filters}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Attribution Models */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Attribution Models
        </h2>
        <div className="space-y-3">
          {attributionModels.map((model) => (
            <Card key={model.model} className="border-border/50">
              <CardContent className="flex items-start gap-3 p-4">
                <CheckCircle2 className={`h-4 w-4 shrink-0 mt-0.5 ${model.model.includes("Recommended") ? "text-blue-500" : "text-muted-foreground"}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{model.model}</p>
                  <p className="text-xs text-muted-foreground mt-1">{model.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tip */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Multi-Touch Attribution</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Most electrical service customers touch 3-5 marketing channels before converting (e.g. Google search, visit site, see remarketing ad, Google Business Profile, phone call). Use Data-Driven attribution once you have enough conversion volume to understand which touchpoints actually drive decisions.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Nav */}
      <Card className="border-border/50">
        <CardContent className="flex items-center justify-between p-5 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 shrink-0">
              <Search className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Back to Google Marketing</p>
              <p className="text-xs text-muted-foreground mt-0.5">Explore other Google tools.</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent" asChild>
            <Link href={G}>Overview <ArrowRight className="ml-2 h-3 w-3" /></Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
