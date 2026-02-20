import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Tag,
  ArrowRight,
  Search,
  CheckCircle2,
  Zap,
  MousePointer,
  Phone,
  FileText,
  DollarSign,
  AlertTriangle,
  Lightbulb,
  Settings,
} from "lucide-react"

const G = "/dashboard/admin/digital-marketing/google"

const setupSteps = [
  { step: "Create a GTM account and container for your website", detail: "One container per website. Name it clearly (e.g. 'Electrical Services - Production')." },
  { step: "Install the GTM snippet in your Next.js layout", detail: "Add the script tag to <head> and noscript to <body> in your root layout.tsx." },
  { step: "Verify installation with GTM Preview mode", detail: "Use the GTM debugger to confirm the container loads on every page." },
  { step: "Set up a GA4 Configuration tag as your first tag", detail: "This connects GTM to Google Analytics. Use your GA4 Measurement ID (G-XXXXXXXXXX)." },
  { step: "Configure the built-in Page View trigger", detail: "Fire the GA4 config tag on all pages to track basic page views." },
  { step: "Publish your first container version", detail: "Versions create a snapshot. Always name versions descriptively." },
]

const standardEvents = [
  {
    event: "Form Submission",
    trigger: "Form submit success (thank you page or success state)",
    tags: ["GA4 Event: generate_lead", "Google Ads Conversion"],
    icon: FileText,
    priority: "Critical",
  },
  {
    event: "Phone Click",
    trigger: "Click on tel: links",
    tags: ["GA4 Event: phone_call_click", "Google Ads Conversion"],
    icon: Phone,
    priority: "Critical",
  },
  {
    event: "Quote Request Started",
    trigger: "Multi-step form: step 1 loaded",
    tags: ["GA4 Event: begin_quote"],
    icon: MousePointer,
    priority: "High",
  },
  {
    event: "Quote Request Completed",
    trigger: "Multi-step form: final submission",
    tags: ["GA4 Event: submit_quote", "Google Ads Conversion"],
    icon: CheckCircle2,
    priority: "Critical",
  },
  {
    event: "Emergency Call Click",
    trigger: "Click on emergency phone number",
    tags: ["GA4 Event: emergency_call", "Google Ads Conversion"],
    icon: Zap,
    priority: "High",
  },
  {
    event: "Service Page View",
    trigger: "Page path matches /services/*",
    tags: ["GA4 Event: view_service"],
    icon: Search,
    priority: "Medium",
  },
]

const conversionSetup = [
  {
    conversion: "Google Ads Conversion Tracking",
    steps: [
      "Create conversion action in Google Ads (Settings > Conversions)",
      "Copy the Conversion ID and Conversion Label",
      "Create a 'Google Ads Conversion' tag in GTM",
      "Set trigger to fire on form submission / phone click events",
      "Test with GTM Preview + Google Ads conversion checker",
    ],
  },
  {
    conversion: "GA4 Conversion Events",
    steps: [
      "In GA4, go to Admin > Events > Mark as Conversion",
      "Mark generate_lead, submit_quote, phone_call_click as conversions",
      "Verify events appear in GA4 Realtime report",
      "Set up conversion attribution model (data-driven recommended)",
    ],
  },
]

const triggerRules = [
  { name: "All Pages", type: "Page View", condition: "Built-in -- fires on every page load", usage: "GA4 config tag" },
  { name: "Form Success", type: "Custom Event", condition: "Event name equals 'form_submission_success'", usage: "Lead conversion tags" },
  { name: "Tel Link Click", type: "Click - Just Links", condition: "Click URL contains 'tel:'", usage: "Phone call tags" },
  { name: "Service Pages", type: "Page View", condition: "Page Path matches /services/*", usage: "Service view tag" },
  { name: "Quote Form Start", type: "Custom Event", condition: "Event name equals 'quote_form_start'", usage: "Quote funnel entry" },
  { name: "Emergency CTA", type: "Click", condition: "Click Element matches '.emergency-cta'", usage: "Emergency tracking" },
]

export default function GoogleTagManagerPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Tag className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">Tag Manager</h1>
            <p className="text-muted-foreground">GTM setup, event tracking, conversion tags, and trigger management</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Developer</Badge>
          <Badge variant="outline">Technical Admin</Badge>
          <Badge className="bg-blue-500/20 text-blue-400 border-0">Tracking & Events</Badge>
        </div>
      </div>

      {/* GTM Setup */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="h-5 w-5 text-blue-500" />
          GTM Container Setup
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {setupSteps.map((s, i) => (
                <div key={i} className="flex items-start gap-4 p-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/10 text-sm font-medium text-blue-500 shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{s.step}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Standard Events */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-500" />
          Standard Event Tracking
        </h2>
        <div className="space-y-3">
          {standardEvents.map((evt) => {
            const Icon = evt.icon
            return (
              <Card key={evt.event} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-blue-500/10">
                        <Icon className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{evt.event}</p>
                        <p className="text-xs text-muted-foreground">{evt.trigger}</p>
                      </div>
                    </div>
                    <Badge className={
                      evt.priority === "Critical" ? "bg-red-500/20 text-red-400 border-0" :
                      evt.priority === "High" ? "bg-amber-500/20 text-amber-400 border-0" :
                      "bg-muted text-muted-foreground border-0"
                    }>{evt.priority}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-11">
                    {evt.tags.map((t) => (
                      <code key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-foreground font-mono">{t}</code>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Conversion Setup */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-500" />
          Conversion Tracking Setup
        </h2>
        <div className="responsive-grid-2">
            <Card key={conv.conversion} className="border-border/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">{conv.conversion}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {conv.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="flex items-center justify-center w-4 h-4 rounded-full border border-border text-[9px] font-medium text-muted-foreground shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-xs text-muted-foreground">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trigger Rules */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <MousePointer className="h-5 w-5 text-blue-500" />
          Trigger Rules Reference
        </h2>
        <Card className="border-border/50">
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {triggerRules.map((rule) => (
                <div key={rule.name} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{rule.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{rule.condition}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Badge variant="outline" className="text-[10px]">{rule.type}</Badge>
                    <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">{rule.usage}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="flex gap-4 p-5">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Data Layer Best Practice</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Push custom events to the data layer from your application code rather than relying on DOM scraping.
              Use <code className="font-mono text-amber-400">window.dataLayer.push()</code> in your form success handlers and CTA click handlers. This is more reliable and survives UI changes.
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
