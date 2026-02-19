"use client"

import { useState, useEffect } from "react"
import { renderEmailPreview } from "@/lib/actions/render-email"
import type { EmailTemplate } from "@/lib/actions/action.types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Building, FileText, MessageSquare, Calculator, ChevronRight } from "lucide-react"

const TEMPLATE_GROUPS = [
  {
    id: "service" as const,
    label: "Service Request",
    icon: FileText,
    description: "Multi-step service request form emails",
    hasUrgency: true,
    templates: [
      { id: "service-customer" as EmailTemplate, label: "Customer Confirmation", icon: User, description: "Sent to customer after service request submission" },
      { id: "service-business" as EmailTemplate, label: "Business Notification", icon: Building, description: "Internal notification for new service requests" },
    ],
  },
  {
    id: "contact" as const,
    label: "Contact Inquiry",
    icon: MessageSquare,
    description: "Contact form submission emails",
    hasUrgency: false,
    templates: [
      { id: "contact-customer" as EmailTemplate, label: "Customer Confirmation", icon: User, description: "Sent to customer after contact form submission" },
      { id: "contact-business" as EmailTemplate, label: "Business Notification", icon: Building, description: "Internal notification for new contact inquiries" },
    ],
  },
  {
    id: "quotation" as const,
    label: "Quotation Request",
    icon: Calculator,
    description: "Quotation form submission emails",
    hasUrgency: false,
    templates: [
      { id: "quotation-customer" as EmailTemplate, label: "Customer Confirmation", icon: User, description: "Sent to customer after quotation submission" },
      { id: "quotation-business" as EmailTemplate, label: "Business Notification", icon: Building, description: "Internal notification for new quotation requests" },
    ],
  },
]

const URGENCY_LEVELS = [
  { id: "routine" as const, label: "Routine", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  { id: "urgent" as const, label: "Urgent", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  { id: "emergency" as const, label: "Emergency", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
]

export default function EmailPreviewPage() {
  const [activeTemplate, setActiveTemplate] = useState<EmailTemplate>("service-customer")
  const [urgency, setUrgency] = useState<"routine" | "urgent" | "emergency">("routine")
  const [emailHtml, setEmailHtml] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const activeGroup = TEMPLATE_GROUPS.find((g) => g.templates.some((t) => t.id === activeTemplate))
  const activeTemplateInfo = activeGroup?.templates.find((t) => t.id === activeTemplate)

  useEffect(() => {
    const loadEmail = async () => {
      setIsLoading(true)
      const result = await renderEmailPreview(activeTemplate, urgency)
      setEmailHtml(result.html)
      setIsLoading(false)
    }
    loadEmail()
  }, [activeTemplate, urgency])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Mail className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-foreground">Email Template Preview</h1>
          <Badge className="bg-accent/20 text-accent border-0">6 Templates</Badge>
        </div>
        <p className="text-muted-foreground">
          Preview all email templates across 3 form types. Service request emails support urgency-based styling
          with distinct visual treatments for routine, urgent, and emergency levels.
        </p>
      </div>

      {/* Template Selector */}
      <div className="grid gap-4 md:grid-cols-3">
        {TEMPLATE_GROUPS.map((group) => {
          const isActiveGroup = group.templates.some((t) => t.id === activeTemplate)
          const GroupIcon = group.icon
          return (
            <Card
              key={group.id}
              className={`border transition-colors ${isActiveGroup ? "border-accent bg-accent/5" : "border-border/50 hover:border-border"}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <GroupIcon className={`h-5 w-5 ${isActiveGroup ? "text-accent" : "text-muted-foreground"}`} />
                  <CardTitle className="text-sm font-semibold">{group.label}</CardTitle>
                  {group.hasUrgency && (
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto border-amber-500/40 text-amber-400">
                      Urgency
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{group.description}</p>
              </CardHeader>
              <CardContent className="space-y-1.5">
                {group.templates.map((tmpl) => {
                  const TmplIcon = tmpl.icon
                  const isActive = tmpl.id === activeTemplate
                  return (
                    <button
                      key={tmpl.id}
                      onClick={() => setActiveTemplate(tmpl.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-sm transition-colors ${
                        isActive
                          ? "bg-accent/20 text-accent font-medium"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <TmplIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{tmpl.label}</span>
                      {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto shrink-0" />}
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Urgency Controls -- always visible, functional for service requests */}
      <div className="flex items-center gap-3 p-4 bg-card/50 border border-border rounded-lg">
        <span className="text-sm font-medium text-muted-foreground">Urgency Level:</span>
        <div className="flex gap-2">
          {URGENCY_LEVELS.map((level) => (
            <Button
              key={level.id}
              variant={urgency === level.id ? "default" : "outline"}
              size="sm"
              onClick={() => setUrgency(level.id)}
              disabled={!activeGroup?.hasUrgency}
              className={urgency === level.id ? "" : `${level.bg} ${level.color} hover:${level.color}`}
            >
              {level.label}
            </Button>
          ))}
        </div>
        <div className="ml-auto text-xs text-muted-foreground">
          {!activeGroup?.hasUrgency
            ? "Urgency styling applies to service request templates only"
            : urgency === "routine"
              ? "Standard processing -- response within 2-4 hours"
              : urgency === "urgent"
                ? "Priority processing -- response within 2 hours"
                : "Immediate processing -- response within 30 minutes"}
        </div>
      </div>

      {/* Preview Container */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-foreground">
            {activeGroup?.label}
          </span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{activeTemplateInfo?.label}</span>
          {activeGroup?.hasUrgency && (
            <>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <Badge
                variant="outline"
                className={
                  urgency === "emergency"
                    ? "border-red-500/40 text-red-400"
                    : urgency === "urgent"
                      ? "border-amber-500/40 text-amber-400"
                      : "border-blue-500/40 text-blue-400"
                }
              >
                {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
              </Badge>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Browser chrome */}
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-600 ml-2">
              {activeTemplateInfo?.description}
            </span>
          </div>

          <div className="bg-gray-50 overflow-auto" style={{ height: "calc(100vh - 520px)", minHeight: "500px" }}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-2">
                  <div className="h-8 w-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin mx-auto" />
                  <p className="text-gray-500 text-sm">Loading template...</p>
                </div>
              </div>
            ) : emailHtml ? (
              <iframe
                sandbox=""
                srcDoc={emailHtml}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Email Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No preview available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Template Info */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div>
              <span className="font-medium text-foreground">Template File</span>
              <p className="text-muted-foreground mt-1">
                <code className="bg-muted px-2 py-0.5 rounded text-xs">
                  lib/email/templates/{activeTemplate.replace("-", "-")}-html.tsx
                </code>
              </p>
            </div>
            <div>
              <span className="font-medium text-foreground">Urgency Support</span>
              <p className="text-muted-foreground mt-1">
                {activeGroup?.hasUrgency
                  ? "3 levels: routine (blue), urgent (amber), emergency (red)"
                  : "Not applicable -- single style"}
              </p>
            </div>
            <div>
              <span className="font-medium text-foreground">Email Client Support</span>
              <p className="text-muted-foreground mt-1">
                Outlook, Gmail, Apple Mail, Yahoo -- inline styles, table layout
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
