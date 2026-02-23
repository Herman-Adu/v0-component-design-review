import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Phone,
  Clock,
  Image,
  Star,
  MessageSquare,
  HelpCircle,
  Search,
  Globe,
  FileText,
  AlertTriangle,
} from "lucide-react"

const G = "/dashboard/admin/digital-marketing/google"

const profileChecklist = [
  { item: "Business name matches signage and website exactly", category: "NAP Consistency" },
  { item: "Address is verified and matches all directory listings", category: "NAP Consistency" },
  { item: "Phone number uses primary business line (not tracking number)", category: "NAP Consistency" },
  { item: "Business category set to 'Electrician' with relevant secondary categories", category: "Category Setup" },
  { item: "Service areas defined (all postcodes/regions you cover)", category: "Category Setup" },
  { item: "Business hours are accurate including bank holidays", category: "Hours & Availability" },
  { item: "Special hours set for emergency services (24/7 if applicable)", category: "Hours & Availability" },
  { item: "Business description includes key services and service area (750 chars max)", category: "Content" },
  { item: "At least 10 high-quality photos (team, vehicles, completed work)", category: "Media" },
  { item: "Logo and cover photo uploaded at correct dimensions", category: "Media" },
  { item: "All services listed with descriptions and price ranges where possible", category: "Services" },
  { item: "Booking/quote URL points to your quotation form", category: "Services" },
]

const faqPairs = [
  {
    question: "Do you offer emergency electrical services?",
    answer: "Yes, we provide 24/7 emergency electrical services across [service area]. Call [phone] for immediate assistance.",
    platforms: ["Google Business", "Website FAQ"],
  },
  {
    question: "Are your electricians qualified and insured?",
    answer: "All our electricians are fully qualified, NICEIC registered, and carry comprehensive public liability insurance.",
    platforms: ["Google Business", "Website FAQ"],
  },
  {
    question: "How much does an electrician cost?",
    answer: "Prices vary by job type. We offer free quotations -- submit a request through our website or call us for an estimate.",
    platforms: ["Google Business", "Website FAQ"],
  },
  {
    question: "What areas do you cover?",
    answer: "We cover [list of areas]. Check our service area page or call to confirm coverage for your location.",
    platforms: ["Google Business", "Website FAQ"],
  },
  {
    question: "Do you offer certificates for electrical work?",
    answer: "Yes, all notifiable work comes with the appropriate certificates (EICR, Minor Works, Installation Certificate) registered with the local authority.",
    platforms: ["Google Business", "Website FAQ"],
  },
]

const reviewTemplates = [
  {
    type: "Positive Review",
    template: "Thank you for your kind words, [Name]! We're glad [specific mention]. It was a pleasure working on your [job type]. We appreciate your trust in our team.",
    tone: "Warm and grateful",
  },
  {
    type: "Neutral Review",
    template: "Thank you for your feedback, [Name]. We value your input and always look for ways to improve. If there's anything we can do to enhance your experience, please don't hesitate to reach out.",
    tone: "Professional and open",
  },
  {
    type: "Negative Review",
    template: "We're sorry to hear about your experience, [Name]. This doesn't reflect our standards. Please contact us directly at [email/phone] so we can understand what happened and make it right.",
    tone: "Empathetic and solution-focused",
  },
]

const localSeoSignals = [
  { signal: "NAP consistency across all directories", icon: MapPin, impact: "High" },
  { signal: "Google Business Profile completeness score", icon: Building2, impact: "High" },
  { signal: "Review quantity and recency", icon: Star, impact: "High" },
  { signal: "Review response rate and speed", icon: MessageSquare, impact: "Medium" },
  { signal: "Photo uploads (quantity and recency)", icon: Image, impact: "Medium" },
  { signal: "Google Business posts frequency", icon: FileText, impact: "Medium" },
  { signal: "Website local landing pages", icon: Globe, impact: "Medium" },
  { signal: "Structured data (LocalBusiness schema)", icon: Search, impact: "High" },
]

export default function GoogleBusinessProfilePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Building2 className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Business Profile & FAQs</h1>
            <p className="text-muted-foreground">Google Business Profile optimisation and consistent FAQ management</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Business Owner</Badge>
          <Badge variant="outline">Marketing Lead</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-0">Local SEO</Badge>
        </div>
      </div>

      {/* Profile Completeness Checklist */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-blue-500" />
          Profile Completeness Checklist
        </h2>
        <div className="responsive-grid-2">
          {profileChecklist.map((check, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-border text-[10px] font-medium text-muted-foreground shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div>
                  <p className="text-sm text-foreground">{check.item}</p>
                  <Badge variant="outline" className="mt-1 text-[10px]">{check.category}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* FAQ Management */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-blue-500" />
          FAQ Templates
        </h2>
        <p className="text-sm text-muted-foreground mb-4">Keep FAQs consistent across Google Business and your website. Use these templates as starting points.</p>
        <div className="space-y-4">
          {faqPairs.map((faq, i) => (
            <Card key={i} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-start gap-3 mb-3">
                  <HelpCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="font-medium text-foreground text-sm">{faq.question}</p>
                </div>
                <p className="text-sm text-muted-foreground pl-7 mb-3">{faq.answer}</p>
                <div className="flex gap-2 pl-7">
                  {faq.platforms.map((p) => (
                    <Badge key={p} variant="outline" className="text-[10px]">{p}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Review Response Templates */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-blue-500" />
          Review Response Templates
        </h2>
        <div className="responsive-grid-3">
          {reviewTemplates.map((tmpl) => (
            <Card key={tmpl.type} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center justify-between">
                  {tmpl.type}
                  <Badge variant="outline" className="text-[10px] font-normal">{tmpl.tone}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground leading-relaxed italic">
                  &ldquo;{tmpl.template}&rdquo;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Local SEO Signals */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" />
          Local SEO Ranking Signals
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {localSeoSignals.map((signal) => {
                const Icon = signal.icon
                return (
                  <div key={signal.signal} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm text-foreground">{signal.signal}</p>
                    </div>
                    <Badge className={signal.impact === "High" ? "bg-blue-500/20 text-blue-400 border-0" : "bg-muted text-muted-foreground border-0"} >
                      {signal.impact}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tip */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="flex gap-4 p-5">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">NAP Consistency Warning</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Your business Name, Address, and Phone number must be identical across every online listing -- Google, Yell, Checkatrade, your website, social profiles. Even small variations (e.g. &ldquo;St&rdquo; vs &ldquo;Street&rdquo;) can hurt local search rankings.
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
