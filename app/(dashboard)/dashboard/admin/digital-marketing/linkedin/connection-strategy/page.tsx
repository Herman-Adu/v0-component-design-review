import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  UsersRound,
  ArrowRight,
  Share2,
  CheckCircle2,
  Target,
  MessageSquare,
  Lightbulb,
  Briefcase,
  Building2,
  TrendingUp,
  Clock,
} from "lucide-react"

const LI = "/dashboard/admin/digital-marketing/linkedin"

const targetProfiles = [
  {
    title: "Property Managers",
    description: "Residential and commercial property management companies needing regular electrical maintenance and emergency cover.",
    searchTerms: "Property Manager, Facilities Manager, Estate Manager",
    priority: "High",
  },
  {
    title: "Construction Project Managers",
    description: "New-build and refurbishment projects requiring first and second fix electrical installations.",
    searchTerms: "Construction PM, Site Manager, Contracts Manager",
    priority: "High",
  },
  {
    title: "Architects & Interior Designers",
    description: "Specification-stage influence. Building relationships early leads to being specified into projects.",
    searchTerms: "Architect, Interior Designer, Building Surveyor",
    priority: "Medium",
  },
  {
    title: "Landlords & Letting Agents",
    description: "EICR requirements, compliance certificates, and ongoing maintenance contracts.",
    searchTerms: "Landlord, Letting Agent, Property Investor",
    priority: "Medium",
  },
  {
    title: "Other Trades",
    description: "Plumbers, builders, and decorators who can refer electrical work. Two-way referral networks.",
    searchTerms: "Builder, Plumber, General Contractor",
    priority: "Medium",
  },
]

const connectionTemplates = [
  {
    title: "Cold Connection Request",
    context: "First contact with a potential commercial client",
    template: `Hi [Name],

I noticed you're a [role] at [company] -- we work with several [property management/construction] firms in [region] providing electrical services.

Would be great to connect in case we can ever help with your electrical requirements.

Best regards,
[Your Name]
[Company]`,
  },
  {
    title: "Post-Event Follow-Up",
    context: "After meeting at a networking event or trade show",
    template: `Hi [Name],

Great to meet you at [event] yesterday. Really enjoyed our conversation about [topic].

Let's stay connected -- would be happy to chat further about how we can support [their company] with any electrical projects.

Best,
[Your Name]`,
  },
  {
    title: "Referral Introduction",
    context: "Warm introduction via a mutual connection",
    template: `Hi [Name],

[Mutual contact] suggested we connect -- they mentioned you're looking for a reliable electrical contractor for [project type].

We're NICEIC registered with [X] years in the trade. Happy to have a quick chat about your requirements.

Best regards,
[Your Name]`,
  },
  {
    title: "InMail for Commercial Contracts",
    context: "Direct outreach for facilities management or maintenance contracts",
    template: `Hi [Name],

I'm reaching out because we specialise in commercial electrical maintenance for [industry/building type] in [region].

We currently look after [X] commercial properties, providing:
- Planned preventive maintenance
- Emergency callout cover (24/7)
- EICR testing and compliance
- LED lighting upgrades

Would you be open to a brief call to discuss your current electrical maintenance arrangements?

Best regards,
[Your Name]
[Company] | NICEIC Registered`,
  },
]

const engagementRules = [
  {
    title: "Comment Strategy",
    items: [
      "Comment on clients' posts before sending connection requests",
      "Add genuine value -- share relevant experience or insight",
      "Engage with 5-10 target profiles per week consistently",
      "Avoid generic comments like 'Great post!' -- be specific",
    ],
  },
  {
    title: "Posting Cadence",
    items: [
      "Share 2-3 posts per week from your company page",
      "Mix content: project completions, tips, industry news, team highlights",
      "Use the Post Composer tool for consistent formatting",
      "Repurpose learning hub articles for LinkedIn's audience",
    ],
  },
  {
    title: "Response Timing",
    items: [
      "Reply to comments within 2 hours during business hours",
      "Accept connection requests within 24 hours",
      "Follow up InMail conversations within 1 business day",
      "Set aside 15 minutes daily for LinkedIn engagement",
    ],
  },
]

const weeklyPlan = [
  { day: "Monday", activity: "Share a project completion post with photos" },
  { day: "Tuesday", activity: "Engage with 5 target profiles (comment on their posts)" },
  { day: "Wednesday", activity: "Send 3-5 connection requests with personalised notes" },
  { day: "Thursday", activity: "Share an electrical tip or safety insight" },
  { day: "Friday", activity: "Publish or share a longer article/case study" },
]

export default function LinkedInConnectionStrategyPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <UsersRound className="h-5 w-5 text-sky-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Connection Strategy
            </h1>
            <p className="text-muted-foreground">
              B2B targeting, connection templates, and engagement best practices
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Business Owner</Badge>
          <Badge variant="outline">Sales Lead</Badge>
          <Badge className="bg-sky-500/20 text-sky-400 border-0">LinkedIn</Badge>
        </div>
      </div>

      {/* Target Profiles */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Target Profiles</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Focus your connection efforts on these profile types. Use the search terms to find them on LinkedIn.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          {targetProfiles.map((profile) => (
            <Card key={profile.title} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-sky-500" />
                    <p className="font-semibold text-foreground text-sm">{profile.title}</p>
                  </div>
                  <Badge className={profile.priority === "High" ? "bg-sky-500/20 text-sky-400 border-0 text-xs" : "bg-muted text-muted-foreground border-0 text-xs"}>
                    {profile.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{profile.description}</p>
                <p className="text-xs text-muted-foreground">
                  <span className="text-foreground font-medium">Search: </span>
                  {profile.searchTerms}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Connection & InMail Templates */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Connection & InMail Templates</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Personalise these templates for each prospect. Never send generic connection requests.
        </p>
        <div className="space-y-4">
          {connectionTemplates.map((tmpl) => (
            <Card key={tmpl.title} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-sky-500" />
                    {tmpl.title}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px]">{tmpl.context}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md bg-muted/50 border border-border p-4">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">
                    {tmpl.template}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Engagement Rules */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Engagement Best Practices</h2>
        <div className="responsive-grid-3">
          {engagementRules.map((rule) => (
            <Card key={rule.title} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{rule.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2.5">
                  {rule.items.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-sky-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Weekly Plan */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-500" />
            Weekly Engagement Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Consistency beats intensity. Follow this weekly plan to build your network steadily.
          </p>
          <div className="space-y-3">
            {weeklyPlan.map((day) => (
              <div key={day.day} className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground w-24 shrink-0">{day.day}</span>
                <span className="text-sm text-muted-foreground">{day.activity}</span>
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
            <p className="text-sm font-medium text-foreground">The 80/20 Rule</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Spend 80% of your LinkedIn time engaging with others' content and 20% creating your own. This builds genuine relationships and increases visibility. People are far more likely to accept a connection request from someone who has already engaged with their posts.
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
