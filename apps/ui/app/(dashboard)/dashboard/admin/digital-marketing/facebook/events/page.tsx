import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Megaphone,
  ArrowRight,
  Globe,
  CheckCircle2,
  Lightbulb,
  Calendar,
  MapPin,
  Clock,
  Users,
  Tag,
  Image,
} from "lucide-react"

const FB = "/dashboard/admin/digital-marketing/facebook"

const eventTypes = [
  {
    type: "Open Day",
    description: "Invite the community to visit your premises, meet the team, and learn about electrical safety.",
    when: "Annually or bi-annually",
    tips: ["Offer free electrical safety checks for attendees", "Have a Q&A session on common home electrical issues", "Provide refreshments -- it increases turnout significantly", "Set up a photo booth with branded props for social sharing"],
  },
  {
    type: "Community Workshop",
    description: "Free educational session on electrical safety, energy saving, or smart home technology.",
    when: "Quarterly",
    tips: ["Partner with a local community centre for venue", "Topics: 'Winter Electrical Safety', 'Smart Home 101', 'Energy Saving Tips'", "Collect email addresses for follow-up marketing", "Live stream on Facebook for those who can't attend"],
  },
  {
    type: "Seasonal Promotion",
    description: "Time-limited offers tied to seasons -- winter safety checks, spring EICR offers, summer garden lighting.",
    when: "Each season",
    tips: ["Create urgency with a clear end date", "Offer a specific discount percentage or fixed price", "Include a booking link or phone number", "Share customer testimonials from previous seasonal work"],
  },
  {
    type: "Charity / Sponsorship",
    description: "Sponsor or participate in local charity events, school fetes, or community fundraisers.",
    when: "As opportunities arise",
    tips: ["Wear branded clothing for visibility", "Offer to do free safety checks at the event", "Take photos and share on your page", "Tag the charity and event organisers in your posts"],
  },
]

const eventChecklist = [
  { step: "4 weeks before", tasks: ["Create Facebook event with cover image (1920 x 1005px)", "Write compelling event description with all details", "Set location, date, time, and ticket info if applicable"] },
  { step: "3 weeks before", tasks: ["Share event on your page with a personal message", "Invite your existing followers/contacts", "Ask partners and suppliers to share the event"] },
  { step: "2 weeks before", tasks: ["Post a behind-the-scenes preparation update", "Share a countdown post with key highlights", "Boost the event post with a small ad budget (even $10 helps)"] },
  { step: "1 week before", tasks: ["Final reminder post with excitement", "Direct message RSVPs with any logistics", "Prepare materials, signage, and branded items"] },
  { step: "Day of event", tasks: ["Post a 'We're live!' update with photos", "Go live on Facebook for a quick tour/introduction", "Encourage attendees to check in and tag your page"] },
  { step: "After event", tasks: ["Post a thank-you with photo gallery", "Share any highlights or testimonials", "Follow up with leads collected at the event"] },
]

const promotionTemplates = [
  {
    title: "Winter Safety Check",
    content: "WINTER ELECTRICAL SAFETY CHECK -- LIMITED OFFER\n\nAs the nights draw in, make sure your home is safe.\n\nOur winter safety check includes:\n- Full visual inspection of your consumer unit\n- Socket and switch check\n- Smoke alarm test\n- PAT testing of portable heaters\n\nNormally [price] -- this month just [offer price].\n\nBook before [date]. Limited slots available.\n\nCall [number] or message us to book.",
  },
  {
    title: "EICR Spring Offer",
    content: "SPRING EICR OFFER -- 10% OFF\n\nIs your electrical installation condition report up to date?\n\nRecommended every:\n- 10 years for homeowners\n- 5 years for landlords (legal requirement)\n- 5 years for businesses\n\nBook this month and save 10%.\n\nIncludes full inspection, written report, and certificate.\n\n[Phone] | [Website] | Message us",
  },
  {
    title: "Referral Programme",
    content: "REFER A FRIEND -- GET [REWARD]\n\nKnow someone who needs an electrician?\n\nRefer a friend to us and when they book a job:\n- You get [reward, e.g., a $25 gift card]\n- They get 10% off their first job\n\nWin-win.\n\nJust ask them to mention your name when they call.\n\nThank you for your continued support!",
  },
]

export default function FacebookEventsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Megaphone className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Events & Promotions
            </h1>
            <p className="text-muted-foreground">
              Event templates, promotion strategies, and execution checklists
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Business Owner</Badge>
          <Badge variant="outline">Marketing Lead</Badge>
          <Badge className="bg-indigo-500/20 text-indigo-400 border-0">Lead Generation</Badge>
        </div>
      </div>

      {/* Event Types */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Event Types for Electrical Services</h2>
        <div className="responsive-grid-2">
          {eventTypes.map((ev) => (
            <Card key={ev.type} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    {ev.type}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px]">{ev.when}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{ev.description}</p>
                <div className="space-y-1.5">
                  {ev.tips.map((tip) => (
                    <div key={tip} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3 w-3 text-indigo-500 shrink-0 mt-0.5" />
                      <span className="text-xs text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Event Execution Timeline */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Event Execution Timeline</h2>
        <div className="space-y-4">
          {eventChecklist.map((phase) => (
            <Card key={phase.step} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center px-3 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-xs font-semibold whitespace-nowrap shrink-0">
                    {phase.step}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    {phase.tasks.map((task) => (
                      <div key={task} className="flex items-start gap-2">
                        <CheckCircle2 className="h-3 w-3 text-indigo-500 shrink-0 mt-0.5" />
                        <span className="text-xs text-muted-foreground">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Promotion Templates */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Promotion Templates</h2>
        <div className="responsive-grid-3">
          {promotionTemplates.map((tmpl) => (
            <Card key={tmpl.title} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Tag className="h-4 w-4 text-indigo-500" />
                  {tmpl.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed bg-muted/50 p-3 rounded-md line-clamp-8">{tmpl.content}</p>
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
            <p className="text-sm font-medium text-foreground">Events Build Trust Faster Than Ads</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              A single well-run community event can generate more trust and word-of-mouth referrals than months of advertising. People buy from people they know and trust. Events let potential customers meet you face-to-face, ask questions, and experience your expertise firsthand.
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
