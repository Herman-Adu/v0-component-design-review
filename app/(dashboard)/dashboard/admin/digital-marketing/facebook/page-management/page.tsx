import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Building2,
  ArrowRight,
  Globe,
  CheckCircle2,
  Lightbulb,
  Star,
  MapPin,
  Phone,
  Clock,
  Image,
  Shield,
} from "lucide-react"

const FB = "/dashboard/admin/digital-marketing/facebook"

const setupChecklist = [
  { section: "Business Info", items: ["Business name matches NICEIC registration exactly", "Category set to 'Electrician' (primary) + 'Electrical Installation' (secondary)", "Complete address with postcode for local search", "Phone number with click-to-call enabled", "Website URL linked", "Business hours set (including emergency availability note)"] },
  { section: "Branding", items: ["Profile photo: company logo (180 x 180px, displays at 170 x 170px)", "Cover photo: professional team/project image (820 x 312px)", "Consistent colour scheme with your website", "Page username set (@YourBusinessName) for easy sharing"] },
  { section: "Services", items: ["All services listed with descriptions and price ranges where appropriate", "Service area defined (radius or postcode list)", "NICEIC registration number visible", "Emergency callout availability highlighted"] },
  { section: "Reviews & Trust", items: ["Reviews enabled and visible", "Response template ready for positive reviews", "Response template ready for negative reviews", "Review request process documented for post-job follow-up"] },
]

const reviewTemplates = [
  {
    type: "Positive Review Response",
    template: "Thank you so much for the kind review, [Name]! It was a pleasure working on your [service]. We pride ourselves on [quality/timeliness/professionalism] and it's great to know it shows. If you ever need anything in the future, don't hesitate to get in touch.",
    tips: ["Personalise with the customer's name and specific job", "Respond within 24 hours", "Keep it warm but professional"],
  },
  {
    type: "Negative Review Response",
    template: "Thank you for your feedback, [Name]. We're sorry to hear about your experience with [issue]. We take all feedback seriously and would like to resolve this. Could you please send us a private message with your contact details so we can discuss this further? We want to make things right.",
    tips: ["Never argue publicly", "Acknowledge the issue", "Move the conversation to private message", "Follow up and resolve"],
  },
  {
    type: "Review Request (Post-Job)",
    template: "Hi [Name], thank you for choosing us for your [service]. If you were happy with our work, we'd really appreciate a quick review on our Facebook page. It helps other homeowners find a trusted electrician. Here's the link: [link]. Thank you!",
    tips: ["Send within 48 hours of job completion", "Only ask satisfied customers", "Make it easy with a direct link"],
  },
]

const optimisationTips = [
  { tip: "Pin your best review or most impressive project to the top of your page", icon: Star },
  { tip: "Update your cover photo seasonally (e.g., winter safety messaging in November)", icon: Image },
  { tip: "Add a 'Book Now' or 'Get Quote' CTA button linked to your website form", icon: Phone },
  { tip: "Enable Messenger for quick customer enquiries", icon: Globe },
  { tip: "Post your NICEIC certificate as a permanent photo album", icon: Shield },
  { tip: "Set your service area accurately -- it affects local search ranking", icon: MapPin },
  { tip: "Update business hours for bank holidays and seasonal changes", icon: Clock },
]

export default function FacebookPageManagementPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Building2 className="h-5 w-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Page Management
            </h1>
            <p className="text-muted-foreground">
              Set up, optimise, and maintain your Facebook Business page
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Business Owner</Badge>
          <Badge variant="outline">Marketing Lead</Badge>
          <Badge className="bg-indigo-500/20 text-indigo-400 border-0">Foundation</Badge>
        </div>
      </div>

      {/* Setup Checklists */}
      {setupChecklist.map((section) => (
        <Card key={section.section} className="border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{section.section}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2.5">
              {section.items.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Review Templates */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Review Response Templates</h2>
        <div className="space-y-4">
          {reviewTemplates.map((tmpl) => (
            <Card key={tmpl.type} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="h-4 w-4 text-indigo-500" />
                  {tmpl.type}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground font-mono leading-relaxed bg-muted/50 p-3 rounded-md mb-3">{tmpl.template}</p>
                <div className="space-y-1.5">
                  {tmpl.tips.map((tip) => (
                    <div key={tip} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-indigo-500 shrink-0" />
                      <span className="text-xs text-muted-foreground">{tip}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Optimisation Tips */}
      <Card className="border-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Page Optimisation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {optimisationTips.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.tip} className="flex items-start gap-3">
                  <Icon className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground leading-relaxed">{item.tip}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tip */}
      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="flex gap-4 p-5">
          <Lightbulb className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Reviews Are Your Best Marketing</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Facebook reviews are visible in Google search results and heavily influence local buying decisions. Make requesting reviews part of your job-completion process. A business with 50+ positive reviews will outperform competitors with fewer reviews almost every time, regardless of ad spend.
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
