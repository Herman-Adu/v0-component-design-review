import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DollarSign,
  ArrowRight,
  Search,
  Target,
  MapPin,
  FileText,
  Zap,
  AlertTriangle,
  Lightbulb,
  Ban,
  Users,
  CheckCircle2,
} from "lucide-react"

const G = "/dashboard/admin/digital-marketing/google"

const campaignTypes = [
  {
    type: "Search Campaigns",
    description: "Text ads appearing in Google search results when people search for electrical services. Highest intent, best for lead generation.",
    budget: "60-70% of total ad spend",
    bidding: "Maximise Conversions or Target CPA",
    icon: Search,
    priority: "Primary",
  },
  {
    type: "Local Services Ads",
    description: "Google Guaranteed ads appearing at the very top of search. Pay per lead, not per click. Requires verification.",
    budget: "20-30% of total ad spend",
    bidding: "Pay per lead (set max bid per lead)",
    icon: MapPin,
    priority: "Primary",
  },
  {
    type: "Display / Remarketing",
    description: "Banner ads shown to people who visited your site but didn't convert. Keeps your brand visible during consideration.",
    budget: "5-10% of total ad spend",
    bidding: "Target CPA or Maximise Clicks",
    icon: Users,
    priority: "Secondary",
  },
]

const adGroupStructure = [
  {
    group: "Emergency Services",
    keywords: ["emergency electrician", "24 hour electrician", "urgent electrical repair"],
    adCopy: "24/7 Emergency Electrician -- Fast Response. Call Now for Same-Day Service. Fully Qualified & Insured.",
    landingPage: "/services (emergency section)",
  },
  {
    group: "Residential Rewiring",
    keywords: ["house rewiring", "home rewiring cost", "full rewire electrician"],
    adCopy: "Expert House Rewiring -- Free Survey & Quote. NICEIC Registered. All Work Certificated.",
    landingPage: "/services (rewiring section)",
  },
  {
    group: "Testing & Inspection",
    keywords: ["EICR certificate", "electrical testing", "electrical inspection"],
    adCopy: "EICR Certificates from [price]. Landlord & Homeowner Testing. Book Online Today.",
    landingPage: "/services (testing section)",
  },
  {
    group: "Commercial",
    keywords: ["commercial electrician", "office electrical work", "shop electrician"],
    adCopy: "Commercial Electrical Services -- Office, Retail & Industrial. Project Management Included.",
    landingPage: "/services (commercial section)",
  },
]

const negativeKeywords = [
  { category: "DIY / Self-Help", keywords: ["how to", "DIY", "tutorial", "guide", "learn", "course", "training"] },
  { category: "Employment", keywords: ["jobs", "vacancy", "career", "apprenticeship", "salary", "hiring"] },
  { category: "Products / Parts", keywords: ["buy", "shop", "parts", "wholesale", "supplier", "catalogue"] },
  { category: "Unrelated Services", keywords: ["plumber", "gas engineer", "locksmith", "builder", "decorator"] },
  { category: "Low Intent", keywords: ["free", "cheap", "cheapest", "budget", "discount"] },
]

const landingPageChecklist = [
  "Headline matches the ad copy promise",
  "Phone number visible above the fold (click-to-call on mobile)",
  "Quote form visible without scrolling",
  "Trust signals: NICEIC logo, insurance details, review score",
  "Page loads in under 3 seconds (test with PageSpeed Insights)",
  "No navigation distractions -- remove main menu on ad landing pages",
  "Service-specific content matching the ad group",
  "Clear CTA: 'Get a Free Quote' or 'Call Now'",
]

export default function GoogleAdsCampaignsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <DollarSign className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Google Ads & Campaigns</h1>
            <p className="text-muted-foreground">Campaign structure, budgets, ad copy templates, and landing page optimisation</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Business Owner</Badge>
          <Badge variant="outline">Marketing Lead</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-0">Paid Search</Badge>
        </div>
      </div>

      {/* Campaign Types */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Campaign Types
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {campaignTypes.map((camp) => {
            const Icon = camp.icon
            return (
              <Card key={camp.type} className="border-border/50">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-md bg-blue-500/10">
                      <Icon className="h-4 w-4 text-blue-500" />
                    </div>
                    <Badge className={camp.priority === "Primary" ? "bg-blue-500/20 text-blue-400 border-0" : "bg-muted text-muted-foreground border-0"}>
                      {camp.priority}
                    </Badge>
                  </div>
                  <p className="font-semibold text-foreground text-sm mb-2">{camp.type}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{camp.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Budget: <span className="text-foreground">{camp.budget}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">Bidding: <span className="text-foreground">{camp.bidding}</span></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Ad Group Structure */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-500" />
          Ad Group Structure & Copy Templates
        </h2>
        <div className="space-y-4">
          {adGroupStructure.map((group) => (
            <Card key={group.group} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{group.group}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Keywords</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.keywords.map((kw) => (
                      <code key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono">{kw}</code>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Ad Copy</p>
                  <p className="text-sm text-foreground italic">&ldquo;{group.adCopy}&rdquo;</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Target className="h-3 w-3" />
                  <span>Landing page: <code className="font-mono text-foreground">{group.landingPage}</code></span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Negative Keywords */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Ban className="h-5 w-5 text-blue-500" />
          Negative Keyword Lists
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {negativeKeywords.map((group) => (
            <Card key={group.category} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{group.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {group.keywords.map((kw) => (
                    <code key={kw} className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">-{kw}</code>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Landing Page Checklist */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-blue-500" />
          Landing Page Alignment Checklist
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {landingPageChecklist.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4">
                  <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border text-[10px] font-medium text-muted-foreground shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-sm text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tip */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Budget Strategy</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Start with Search campaigns only. Once you have conversion data (at least 30 conversions), enable Smart Bidding (Target CPA). Add Local Services Ads as a separate channel -- they don't compete with your search campaigns. Only add Display/Remarketing after your search campaigns are profitable.
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
