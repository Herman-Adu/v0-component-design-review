import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  FileText,
  ArrowRight,
  Globe,
  CheckCircle2,
  Lightbulb,
  MessageSquare,
  Clock,
  Zap,
  AlertTriangle,
} from "lucide-react"

const FB = "/dashboard/admin/digital-marketing/facebook"

const autoReplies = [
  {
    trigger: "Instant Reply (any new message)",
    message: "Hi! Thanks for getting in touch with [Business Name]. We usually reply within a few minutes during business hours (Mon-Fri, 8am-6pm). If it's urgent, call us on [number]. We'll get back to you as soon as we can!",
    when: "Always active",
    notes: "This fires immediately for any new conversation. Keep it warm and set expectations.",
  },
  {
    trigger: "Away Message (outside hours)",
    message: "Thanks for your message! We're currently closed but will get back to you first thing in the morning. Our hours are Mon-Fri, 8am-6pm. For emergencies, call our 24hr line: [number].",
    when: "Outside business hours",
    notes: "Set your business hours in Page Settings first. This triggers automatically outside those hours.",
  },
]

const quickReplies = [
  {
    category: "Pricing Enquiry",
    replies: [
      { label: "Get a Quote", message: "We'd be happy to provide a quote! Could you let us know:\n\n1. What work you need done\n2. Your postcode\n3. A preferred date/time\n\nWe'll get back to you with a price and availability." },
      { label: "Pricing Guide", message: "Our pricing depends on the specific job, but here's a rough guide:\n\n- Socket/switch install: from [price]\n- Consumer unit upgrade: from [price]\n- EICR: from [price]\n- Full rewire: from [price]\n\nFor an exact quote, let us know the details and we'll provide a fixed price." },
    ],
  },
  {
    category: "Booking / Availability",
    replies: [
      { label: "Check Availability", message: "Let me check our availability. Could you share:\n\n1. The type of work needed\n2. Your preferred date and time\n3. Your postcode\n\nWe'll confirm a slot for you." },
      { label: "Emergency Callout", message: "If this is an electrical emergency (sparking, burning smell, total power loss), please call us immediately on [number]. We offer 24/7 emergency callouts with fast response times." },
    ],
  },
  {
    category: "Post-Job Follow-Up",
    replies: [
      { label: "Request Review", message: "Thank you for choosing us for your [service]. We hope you're happy with the work! If you have a moment, we'd really appreciate a review on our Facebook page -- it helps other homeowners find a trusted electrician. Thank you!" },
      { label: "Guarantee Info", message: "All our work comes with a [duration] guarantee, backed by our NICEIC registration. If you have any issues at all, just get in touch and we'll sort it out. Your certificate should be in your email -- let us know if you need another copy." },
    ],
  },
  {
    category: "General Info",
    replies: [
      { label: "Service Area", message: "We cover [area/radius description]. If you're not sure whether you're in our area, just send your postcode and we'll confirm." },
      { label: "Qualifications", message: "We are fully qualified and registered with NICEIC (registration number: [number]). All our electricians hold [relevant qualifications]. We carry full public liability insurance and provide certificates for all notifiable work." },
    ],
  },
]

const messengerBestPractices = [
  { practice: "Respond within 15 minutes during business hours", detail: "Facebook awards a 'Very Responsive' badge to pages that reply within 15 minutes. This badge builds trust with potential customers." },
  { practice: "Use the customer's first name", detail: "Personalisation makes conversations feel human, not automated. Facebook provides the sender's name automatically." },
  { practice: "Move to phone for complex jobs", detail: "Messenger is great for initial contact, but for detailed specifications or quoting, move to a phone call." },
  { practice: "Save frequently asked questions", detail: "Build your saved replies library over time. Each new FAQ becomes a template for the future." },
  { practice: "Never leave a message unread", detail: "Even if you can't help, acknowledge the message. Ignored messages hurt your response rate score." },
  { practice: "Follow up on quotes sent via Messenger", detail: "If someone requested a quote and you haven't heard back in 3 days, send a friendly follow-up." },
]

export default function FacebookMessengerPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <FileText className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Messenger Templates
            </h1>
            <p className="text-muted-foreground">
              Auto-replies, quick responses, and conversation templates for Facebook Messenger
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Office Staff</Badge>
          <Badge variant="outline">Business Owner</Badge>
          <Badge className="bg-indigo-500/20 text-indigo-400 border-0">Customer Service</Badge>
        </div>
      </div>

      {/* Response Badge Info */}
      <Card className="border-indigo-500/20 bg-indigo-500/5">
        <CardContent className="flex gap-4 p-5">
          <Zap className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Earn the "Very Responsive" Badge</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Facebook displays a "Very Responsive to Messages" badge on pages that respond to 90% of messages within 15 minutes. This badge significantly increases customer trust and enquiry volume. Use auto-replies and quick responses to maintain this standard.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Auto Replies */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Auto-Reply Configuration</h2>
        <div className="responsive-grid-2">
          {autoReplies.map((ar) => (
            <Card key={ar.trigger} className="border-border/50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    {ar.trigger}
                  </CardTitle>
                  <Badge variant="outline" className="text-[10px]">{ar.when}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed bg-muted/50 p-3 rounded-md mb-2">{ar.message}</p>
                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
                  {ar.notes}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Replies */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Reply Templates</h2>
        {quickReplies.map((cat) => (
          <div key={cat.category} className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">{cat.category}</h3>
        <div className="responsive-grid-2">
              {cat.replies.map((reply) => (
                <Card key={reply.label} className="border-border/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-indigo-500" />
                      {reply.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground font-mono leading-relaxed bg-muted/50 p-3 rounded-md whitespace-pre-wrap">{reply.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Best Practices */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Messenger Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messengerBestPractices.map((item) => (
              <div key={item.practice} className="flex items-start gap-3">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-foreground">{item.practice}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
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
            <p className="text-sm font-medium text-foreground">Messenger Is Your Digital Receptionist</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Many customers prefer messaging over calling, especially outside business hours. A well-configured Messenger with instant replies and quick responses creates a professional, always-available impression. It is often the first interaction a potential customer has with your business -- make it count.
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
