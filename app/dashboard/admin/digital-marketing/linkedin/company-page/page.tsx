import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  ArrowRight,
  Share2,
  CheckCircle2,
  Image,
  FileText,
  Users,
  MapPin,
  Lightbulb,
  AlertTriangle,
} from "lucide-react"

const LI = "/dashboard/admin/digital-marketing/linkedin"

const profileChecklist = [
  { item: "Company name matches legal business name", category: "Identity" },
  { item: "Logo uploaded (300 x 300px, square)", category: "Identity" },
  { item: "Banner image uploaded (1128 x 191px)", category: "Identity" },
  { item: "Tagline set (max 120 characters)", category: "Identity" },
  { item: "Industry set to 'Electrical/Electronic Manufacturing' or 'Construction'", category: "Classification" },
  { item: "Company size accurately selected", category: "Classification" },
  { item: "Headquarters location with full address", category: "Classification" },
  { item: "Website URL linked to main site", category: "Classification" },
  { item: "About section completed (max 2,000 characters)", category: "Content" },
  { item: "Specialities/Services listed (up to 20)", category: "Content" },
  { item: "Custom call-to-action button configured", category: "Content" },
  { item: "Featured content section curated", category: "Content" },
]

const aboutTemplate = `[Company Name] is a NICEIC-registered electrical contractor serving [region] with [X] years of experience in residential, commercial, and emergency electrical services.

Our Services:
- Full house and commercial rewiring
- Consumer unit upgrades (18th Edition)
- Emergency electrical repairs (24/7)
- Electrical Installation Condition Reports (EICRs)
- LED lighting design and installation
- EV charger installation (OZEV approved)

We pride ourselves on transparent pricing, quality workmanship, and outstanding customer service. All work is certified and guaranteed.

Contact us for a free, no-obligation quote.`

const brandingGuidelines = [
  {
    title: "Logo",
    specs: "300 x 300px, PNG or JPG, square format",
    tip: "Use your standard logo on a clean background. Avoid text-heavy logos at this size.",
  },
  {
    title: "Banner Image",
    specs: "1128 x 191px, PNG or JPG",
    tip: "Showcase your team, a flagship project, or branded vehicle. Include a subtle tagline overlay.",
  },
  {
    title: "Tagline",
    specs: "Max 120 characters",
    tip: "Professional and benefit-led: 'NICEIC Registered | 24/7 Emergency | Free Quotes' or similar.",
  },
  {
    title: "About Section",
    specs: "Max 2,000 characters",
    tip: "Lead with credentials, list core services, end with a CTA. Use the template below as a starting point.",
  },
]

const teamShowcase = [
  { role: "Director / Owner", content: "Personal profile linked as admin. Share company updates and thought leadership." },
  { role: "Lead Electrician", content: "Technical credibility. Share project completions, certifications earned." },
  { role: "Office Manager", content: "Customer-facing. Share testimonials, service awards, community involvement." },
]

export default function LinkedInCompanyPagePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <Building2 className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Company Page Management
            </h1>
            <p className="text-muted-foreground">
              Set up and optimise your LinkedIn company page for maximum professional impact
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Business Owner</Badge>
          <Badge variant="outline">Marketing Lead</Badge>
          <Badge className="bg-sky-500/20 text-sky-400 border-0">LinkedIn</Badge>
        </div>
      </div>

      {/* Why It Matters */}
      <Card className="border-sky-500/20 bg-sky-500/5">
        <CardContent className="flex gap-4 p-5">
          <Lightbulb className="h-5 w-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Why Your Company Page Matters</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Your LinkedIn company page is often the first touchpoint for commercial clients, property managers, and facilities teams. A complete, professional page with consistent branding builds trust before the first conversation. Companies with complete profiles get 30% more weekly views.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Completion Checklist */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Profile Completion Checklist</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {["Identity", "Classification", "Content"].map((category) => (
            <Card key={category} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {profileChecklist
                    .filter((c) => c.category === category)
                    .map((c) => (
                      <div key={c.item} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground leading-relaxed">{c.item}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Branding Guidelines */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Branding Guidelines</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {brandingGuidelines.map((guide) => (
            <Card key={guide.title} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Image className="h-4 w-4 text-sky-500" />
                  <p className="font-semibold text-foreground text-sm">{guide.title}</p>
                </div>
                <p className="text-xs text-muted-foreground font-mono mb-2">{guide.specs}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{guide.tip}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* About Section Template */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4 text-sky-500" />
            About Section Template
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-3">
            Copy and customise this template for your company page. Replace bracketed placeholders with your details.
          </p>
          <div className="rounded-md bg-muted/50 border border-border p-4">
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
              {aboutTemplate}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Team Showcase */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Team Showcase Strategy</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Encourage key team members to link their personal profiles to the company page. Each role contributes differently to your LinkedIn presence.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {teamShowcase.map((member) => (
            <Card key={member.role} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-sky-500" />
                  <p className="font-semibold text-foreground text-sm">{member.role}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{member.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Location Optimisation */}
      <Card className="border-border/50">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-4 w-4 text-sky-500" />
            <h3 className="text-sm font-semibold text-foreground">Location Optimisation</h3>
          </div>
          <div className="space-y-2">
            {[
              "Set your headquarters address to match your Google Business Profile exactly",
              "Add service areas if you cover multiple regions",
              "Include location keywords in your About section naturally",
              "Ensure NAP (Name, Address, Phone) consistency across all platforms",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-500 shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="flex gap-4 p-5">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Common Mistakes to Avoid</p>
            <div className="space-y-1.5 mt-2">
              {[
                "Leaving the About section blank or with placeholder text",
                "Using a low-resolution logo that appears pixelated",
                "Not listing specialities -- LinkedIn uses these for search indexing",
                "Forgetting to configure the CTA button (Book, Contact, Visit Website)",
                "Not having any team members linked to the company page",
              ].map((mistake) => (
                <p key={mistake} className="text-xs text-muted-foreground leading-relaxed">
                  {"- "}{mistake}
                </p>
              ))}
            </div>
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
