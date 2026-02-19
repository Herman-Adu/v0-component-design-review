import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tag,
  ArrowRight,
  Globe,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  AlertTriangle,
} from "lucide-react"

const TW = "/dashboard/admin/digital-marketing/twitter"

const hashtagCategories = [
  {
    category: "Core Industry",
    description: "Use in most tweets to establish your niche",
    tags: [
      { tag: "#Electrician", reach: "High", competition: "High" },
      { tag: "#ElectricalContractor", reach: "Medium", competition: "Low" },
      { tag: "#NICEIC", reach: "Medium", competition: "Low" },
      { tag: "#ElectricalSafety", reach: "Medium", competition: "Low" },
      { tag: "#18thEdition", reach: "Low", competition: "Very Low" },
    ],
  },
  {
    category: "Services",
    description: "Use when posting about specific services",
    tags: [
      { tag: "#Rewiring", reach: "Low", competition: "Very Low" },
      { tag: "#EVCharging", reach: "Medium", competition: "Medium" },
      { tag: "#LEDLighting", reach: "Medium", competition: "Medium" },
      { tag: "#EICR", reach: "Low", competition: "Very Low" },
      { tag: "#ConsumerUnit", reach: "Low", competition: "Very Low" },
    ],
  },
  {
    category: "Local / Geographic",
    description: "Essential for local visibility and customer acquisition",
    tags: [
      { tag: "#[YourTown]Electrician", reach: "Low", competition: "Very Low" },
      { tag: "#[YourCounty]", reach: "Medium", competition: "Medium" },
      { tag: "#LocalBusiness", reach: "High", competition: "High" },
      { tag: "#SupportLocal", reach: "High", competition: "High" },
      { tag: "#[YourArea]Trades", reach: "Low", competition: "Very Low" },
    ],
  },
  {
    category: "Business & Growth",
    description: "For business-related content and networking",
    tags: [
      { tag: "#SmallBusiness", reach: "Very High", competition: "Very High" },
      { tag: "#TradesBusiness", reach: "Low", competition: "Low" },
      { tag: "#Construction", reach: "High", competition: "High" },
      { tag: "#PropertyManagement", reach: "Medium", competition: "Medium" },
      { tag: "#FacilitiesManagement", reach: "Medium", competition: "Low" },
    ],
  },
  {
    category: "Seasonal / Event",
    description: "Rotate based on time of year or current events",
    tags: [
      { tag: "#WinterReady", reach: "Medium", competition: "Medium" },
      { tag: "#FireSafety", reach: "Medium", competition: "Low" },
      { tag: "#HomeImprovement", reach: "High", competition: "High" },
      { tag: "#NewBuild", reach: "Medium", competition: "Medium" },
      { tag: "#SmartHome", reach: "High", competition: "High" },
    ],
  },
]

const rules = [
  { rule: "Use 1-2 hashtags per tweet", detail: "More than 2 hashtags decreases engagement by up to 17% on Twitter." },
  { rule: "Place hashtags at the end", detail: "Hashtags mid-sentence break reading flow. Put them after your message." },
  { rule: "Mix niche and broad", detail: "One industry-specific tag + one broader tag gives best reach-to-relevance ratio." },
  { rule: "Use location tags for local work", detail: "Geographic hashtags are low competition and directly reach local clients." },
  { rule: "Avoid trending hijacking", detail: "Only use trending hashtags if genuinely relevant. Irrelevant use looks spammy." },
  { rule: "Create a brand hashtag", detail: "e.g. #[YourBusinessName] -- use consistently to build a searchable content library." },
]

const combos = [
  { context: "Safety tip post", combo: "#ElectricalSafety + #[YourTown]Electrician", why: "Industry authority + local reach" },
  { context: "Project completion", combo: "#NICEIC + #[Service]", why: "Certification trust + service visibility" },
  { context: "Business growth", combo: "#SmallBusiness + #TradesBusiness", why: "Broad network + niche community" },
  { context: "Emergency service", combo: "#EmergencyElectrician + #[YourArea]", why: "Urgent search + geographic targeting" },
  { context: "EV charger install", combo: "#EVCharging + #SmartHome", why: "Service specific + trending topic" },
]

export default function HashtagStrategyPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <Tag className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Hashtag Strategy
            </h1>
            <p className="text-muted-foreground">
              Curated hashtag library with reach analysis and recommended combinations
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Content Creator</Badge>
          <Badge variant="outline">Marketing Lead</Badge>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0">5 Categories</Badge>
        </div>
      </div>

      {/* Rules */}
      <Card className="border-emerald-500/20 bg-emerald-500/5">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-medium text-foreground">Twitter Hashtag Rules</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {rules.map((r) => (
              <div key={r.rule} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-foreground">{r.rule}</p>
                  <p className="text-xs text-muted-foreground">{r.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hashtag Library */}
      {hashtagCategories.map((cat) => (
        <div key={cat.category}>
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-foreground">{cat.category}</h2>
            <p className="text-xs text-muted-foreground">{cat.description}</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {cat.tags.map((t) => (
              <Card key={t.tag} className="border-border/50">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-sm font-mono text-foreground">{t.tag}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-[10px]">Reach: {t.reach}</Badge>
                    <Badge variant="outline" className="text-[10px]">Comp: {t.competition}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Recommended Combos */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Recommended Combinations</h2>
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-foreground font-semibold">Context</th>
                    <th className="text-left p-3 text-foreground font-semibold">Hashtag Combo</th>
                    <th className="text-left p-3 text-foreground font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {combos.map((c) => (
                    <tr key={c.context} className="border-b border-border/50">
                      <td className="p-3 text-foreground font-medium">{c.context}</td>
                      <td className="p-3 font-mono text-emerald-400">{c.combo}</td>
                      <td className="p-3 text-muted-foreground">{c.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tip */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Track What Works</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              After 30 days of consistent posting, review your analytics to see which hashtag combinations drove the most impressions and engagement. Double down on what works and drop what does not. The hashtag landscape shifts -- revisit this strategy quarterly.
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
