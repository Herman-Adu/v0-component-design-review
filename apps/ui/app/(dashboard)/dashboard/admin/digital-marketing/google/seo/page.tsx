import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Search,
  ArrowRight,
  CheckCircle2,
  FileText,
  Code,
  Globe,
  Zap,
  Target,
  AlertTriangle,
  Lightbulb,
} from "lucide-react"

const G = "/dashboard/admin/digital-marketing/google"

const onPageChecklist = [
  { item: "Unique title tag on every page (50-60 characters)", category: "Title Tags", priority: "Critical" },
  { item: "Title includes primary keyword + location for service pages", category: "Title Tags", priority: "Critical" },
  { item: "Meta description on every page (150-160 characters)", category: "Meta", priority: "High" },
  { item: "Meta description includes call-to-action and phone number", category: "Meta", priority: "Medium" },
  { item: "H1 heading matches page intent (one per page)", category: "Headings", priority: "Critical" },
  { item: "H2/H3 hierarchy uses natural keyword variations", category: "Headings", priority: "High" },
  { item: "Alt text on all images describing the content", category: "Images", priority: "High" },
  { item: "Image file names are descriptive (not IMG_001.jpg)", category: "Images", priority: "Medium" },
  { item: "Internal links between related service pages", category: "Links", priority: "High" },
  { item: "External links to relevant authority sources (NICEIC, IET)", category: "Links", priority: "Medium" },
]

const structuredDataSchemas = [
  {
    name: "LocalBusiness / Electrician",
    description: "Core business schema with NAP, hours, geo coordinates, service area, and payment methods.",
    fields: ["name", "address", "telephone", "openingHours", "geo", "areaServed", "priceRange"],
    priority: "Required",
  },
  {
    name: "Service",
    description: "Individual service schema for each service you offer (rewiring, testing, emergency, etc.).",
    fields: ["name", "description", "provider", "areaServed", "serviceType"],
    priority: "Required",
  },
  {
    name: "FAQPage",
    description: "FAQ schema matching your Google Business FAQs. Enables rich snippet display in search results.",
    fields: ["mainEntity[].name", "mainEntity[].acceptedAnswer.text"],
    priority: "Recommended",
  },
  {
    name: "Review / AggregateRating",
    description: "Display star ratings in search results. Requires genuine verified reviews.",
    fields: ["ratingValue", "reviewCount", "bestRating", "author"],
    priority: "Recommended",
  },
  {
    name: "BreadcrumbList",
    description: "Breadcrumb navigation schema for better search result display and site hierarchy.",
    fields: ["itemListElement[].name", "itemListElement[].item"],
    priority: "Recommended",
  },
]

const coreWebVitals = [
  { metric: "LCP (Largest Contentful Paint)", target: "< 2.5 seconds", description: "Largest visible element loads quickly. Optimise hero images, use next/image.", status: "Monitor" },
  { metric: "INP (Interaction to Next Paint)", target: "< 200ms", description: "Page responds to interactions fast. Minimise JavaScript, use server components.", status: "Monitor" },
  { metric: "CLS (Cumulative Layout Shift)", target: "< 0.1", description: "Page layout doesn't jump. Set image dimensions, avoid dynamic content injection.", status: "Monitor" },
]

const keywordStrategy = [
  {
    intent: "Emergency / Urgent",
    keywords: ["emergency electrician near me", "24 hour electrician", "electrical emergency"],
    landingPage: "Emergency services page",
    notes: "High conversion, high CPC. Optimise for mobile and speed.",
  },
  {
    intent: "Service-Specific",
    keywords: ["rewiring cost", "EICR certificate", "consumer unit upgrade", "electrical testing"],
    landingPage: "Individual service pages",
    notes: "Informational + transactional mix. Include pricing guides.",
  },
  {
    intent: "Local",
    keywords: ["electrician [town]", "electrical services [area]", "best electrician [region]"],
    landingPage: "Location landing pages",
    notes: "Create per-area pages with unique content. Avoid thin doorway pages.",
  },
  {
    intent: "Commercial",
    keywords: ["commercial electrician", "office electrical installation", "industrial electrical services"],
    landingPage: "Commercial services page",
    notes: "B2B focus. Highlight certifications and project portfolio.",
  },
]

export default function GoogleSEOPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Search className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">SEO & Site Optimization</h1>
            <p className="text-muted-foreground">On-page SEO, structured data, Core Web Vitals, and keyword strategy</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Developer</Badge>
          <Badge variant="outline">Marketing Lead</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-0">Organic Search</Badge>
        </div>
      </div>

      {/* On-Page Audit Checklist */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-blue-500" />
          On-Page SEO Audit Checklist
        </h2>
        <div className="space-y-2">
          {onPageChecklist.map((check, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border text-[10px] font-medium text-muted-foreground shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm text-foreground">{check.item}</p>
                  <Badge variant="outline" className="mt-1 text-[10px]">{check.category}</Badge>
                </div>
              </div>
              <Badge className={
                check.priority === "Critical" ? "bg-red-500/20 text-red-400 border-0" :
                check.priority === "High" ? "bg-amber-500/20 text-amber-400 border-0" :
                "bg-muted text-muted-foreground border-0"
              }>{check.priority}</Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Structured Data */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-500" />
          Structured Data / Schema.org
        </h2>
        <div className="space-y-4">
          {structuredDataSchemas.map((schema) => (
            <Card key={schema.name} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{schema.name}</CardTitle>
                  <Badge className={schema.priority === "Required" ? "bg-blue-500/20 text-blue-400 border-0" : "bg-muted text-muted-foreground border-0"}>
                    {schema.priority}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">{schema.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {schema.fields.map((f) => (
                    <code key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">{f}</code>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Core Web Vitals */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          Core Web Vitals Targets
        </h2>
        <div className="responsive-grid-3">
          {coreWebVitals.map((vital) => (
            <Card key={vital.metric} className="border-border/50">
              <CardContent className="p-5">
                <p className="font-semibold text-foreground text-sm mb-1">{vital.metric}</p>
                <p className="text-lg font-bold text-blue-500 mb-2">{vital.target}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{vital.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Keyword Strategy */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-blue-500" />
          Keyword Strategy for Electrical Services
        </h2>
        <div className="space-y-4">
          {keywordStrategy.map((group) => (
            <Card key={group.intent} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-foreground text-sm">{group.intent} Intent</p>
                  <Badge variant="outline" className="text-[10px]">{group.landingPage}</Badge>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {group.keywords.map((kw) => (
                    <code key={kw} className="text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-mono">{kw}</code>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{group.notes}</p>
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
            <p className="text-sm font-medium text-foreground">XML Sitemap</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Next.js generates sitemaps automatically with the <code className="font-mono text-accent">sitemap.ts</code> file in the app directory. Ensure all public service pages, location pages, and blog posts are included. Submit to Google Search Console after every major content update.
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
