import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  UsersRound,
  ArrowRight,
  Globe,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  Clock,
  Target,
  Repeat,
} from "lucide-react"

const TW = "/dashboard/admin/digital-marketing/twitter"

const dailyRoutine = [
  { time: "Morning (8-9am)", tasks: ["Check notifications and reply to any overnight mentions", "Like and retweet 2-3 relevant local/industry posts", "Post your first tweet of the day (scheduled or composed)"], duration: "15 min" },
  { time: "Midday (12-1pm)", tasks: ["Post second tweet (different content type from morning)", "Reply to any comments on your morning post", "Search local hashtags and engage with 2-3 posts"], duration: "10 min" },
  { time: "Evening (5-6pm)", tasks: ["Review day's analytics quickly", "Respond to any remaining comments", "Schedule tomorrow's first tweet if pre-written"], duration: "10 min" },
]

const replyTemplates = [
  {
    scenario: "Customer Enquiry",
    template: "Thanks for reaching out! We'd be happy to help with [service]. Drop us a DM with your postcode and we'll get back to you with availability and a free quote.",
    tone: "Professional, welcoming",
  },
  {
    scenario: "Positive Feedback",
    template: "Really appreciate the kind words -- thank you! It was a pleasure working on [project]. If you ever need anything in the future, you know where we are.",
    tone: "Grateful, personal",
  },
  {
    scenario: "Safety Question",
    template: "Great question. [Brief answer]. If you're ever unsure, it's always safest to call a qualified electrician. Happy to help if you need advice.",
    tone: "Authoritative, helpful",
  },
  {
    scenario: "Complaint / Issue",
    template: "Sorry to hear about this. We take all feedback seriously. Could you DM us with the details so we can look into it properly? We want to make this right.",
    tone: "Empathetic, action-oriented",
  },
  {
    scenario: "Other Tradesperson",
    template: "Great work on that! Always good to see quality craftsmanship. If you ever need an electrician on a project, give us a shout.",
    tone: "Collegial, collaborative",
  },
]

const engagementTactics = [
  {
    tactic: "Quote-Tweet with Value",
    description: "When you share someone else's post, add your own insight or experience. This positions you as a knowledgeable voice, not just a resharer.",
    example: "RT @NewsOutlet: 'House fire caused by faulty wiring'\n\nYour QT: 'This is exactly why regular EICR inspections matter. If your wiring hasn't been tested in 10+ years, book one. It could save lives.'",
  },
  {
    tactic: "Ask Questions",
    description: "Posts that ask questions get 2x more replies. Use polls, open questions, or 'this or that' comparisons to spark conversation.",
    example: "Homeowners: when was the last time your electrics were inspected?\n\nA) Less than 5 years\nB) 5-10 years\nC) Over 10 years\nD) Never / don't know",
  },
  {
    tactic: "Engage Before You Post",
    description: "Spend 5 minutes engaging with others' content before posting your own. The algorithm rewards active users and you'll be more visible in feeds.",
    example: "Like 3 posts, reply to 2, retweet 1 -- then post your content.",
  },
  {
    tactic: "Tag Strategically",
    description: "Tag relevant local businesses, suppliers, or clients (with permission) in project completion posts. Their retweets expose you to their audience.",
    example: "'Just completed a full rewire for @LocalBusinessName in [Town]. NICEIC certified, all tested and safe.'",
  },
]

const accountsToFollow = [
  { type: "Local businesses", why: "Networking, referrals, community presence" },
  { type: "Property managers", why: "Commercial leads and maintenance contracts" },
  { type: "Other tradespeople", why: "Referral partnerships and project collaboration" },
  { type: "Industry bodies (NICEIC, ECA)", why: "Credibility by association, industry news" },
  { type: "Local news/community accounts", why: "Local visibility and community engagement" },
  { type: "Construction companies", why: "Subcontract opportunities on larger projects" },
]

export default function EngagementPlaybookPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <UsersRound className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Engagement Playbook
            </h1>
            <p className="text-muted-foreground">
              Daily routines, reply templates, and community-building tactics for Twitter/X
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Business Owner</Badge>
          <Badge variant="outline">Marketing Lead</Badge>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-0">Community Growth</Badge>
        </div>
      </div>

      {/* Daily Routine */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Daily Engagement Routine</h2>
        <p className="text-sm text-muted-foreground mb-4">35 minutes per day. Consistency beats intensity -- do this daily rather than spending hours once a week.</p>
        <div className="grid gap-4 md:grid-cols-3">
          {dailyRoutine.map((block) => (
            <Card key={block.time} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-emerald-500" />
                    {block.time}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px]">{block.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {block.tasks.map((task) => (
                    <div key={task} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground leading-relaxed">{task}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reply Templates */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Reply Templates</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {replyTemplates.map((tmpl) => (
            <Card key={tmpl.scenario} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-emerald-500" />
                    {tmpl.scenario}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px]">{tmpl.tone}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed bg-muted/50 p-3 rounded-md">{tmpl.template}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Engagement Tactics */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Engagement Tactics</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {engagementTactics.map((item) => (
            <Card key={item.tactic} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-emerald-500" />
                  {item.tactic}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{item.description}</p>
                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-[10px] text-muted-foreground font-medium mb-1">Example:</p>
                  <p className="text-xs text-foreground font-mono leading-relaxed">{item.example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Accounts to Follow */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-emerald-500" />
            Accounts to Follow and Engage With
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {accountsToFollow.map((acct) => (
              <div key={acct.type} className="flex items-start gap-3">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-foreground">{acct.type}</p>
                  <p className="text-xs text-muted-foreground">{acct.why}</p>
                </div>
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
            <p className="text-sm font-medium text-foreground">The 80/20 Rule of Social Engagement</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              80% of your tweets should provide value (tips, insights, project showcases, community engagement). 20% can be promotional (service offers, availability, CTAs). Accounts that only promote get unfollowed. Accounts that consistently provide value build trust and attract enquiries naturally.
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
