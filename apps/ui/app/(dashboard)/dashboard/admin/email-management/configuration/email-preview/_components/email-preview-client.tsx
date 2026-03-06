"use client"

import { useState, useEffect, useMemo } from "react"
import { renderEmailPreview } from "@/lib/actions/render-email"
import type { EmailTemplate } from "@/lib/actions/action.types"
import type { EmailTemplateVM } from "@/lib/strapi/global/email-config/email-template/email-template-view-models"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, User, Building, FileText, MessageSquare, Calculator, ChevronRight } from "lucide-react"

// Category UI metadata — static display config, not data
const CATEGORY_META = {
  service: {
    label: "Service Request",
    icon: FileText,
    description: "Multi-step service request form emails",
  },
  contact: {
    label: "Contact Inquiry",
    icon: MessageSquare,
    description: "Contact form submission emails",
  },
  quotation: {
    label: "Quotation Request",
    icon: Calculator,
    description: "Quotation form submission emails",
  },
} as const

const URGENCY_LEVELS = [
  { id: "routine" as const, label: "Routine", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
  { id: "urgent" as const, label: "Urgent", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  { id: "emergency" as const, label: "Emergency", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30" },
]

/** Convert camelCase templateKey (Strapi) → kebab-case EmailTemplate (renderEmailPreview) */
function toPreviewKey(templateKey: string): EmailTemplate {
  return templateKey.replace(/([A-Z])/g, (c) => "-" + c.toLowerCase()) as EmailTemplate
}

interface Props {
  initialTemplates: EmailTemplateVM[]
}

export function EmailPreviewClient({ initialTemplates }: Props) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [activeKey, setActiveKey] = useState<string>(() => initialTemplates[0]?.templateKey ?? "serviceCustomer")
  const [urgency, setUrgency] = useState<"routine" | "urgent" | "emergency">("routine")
  const [emailHtml, setEmailHtml] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setTemplates(initialTemplates)
  }, [initialTemplates])

  // Build category groups dynamically from Strapi data
  const templateGroups = useMemo(() => {
    const grouped = new Map<string, EmailTemplateVM[]>()
    for (const t of templates) {
      if (!grouped.has(t.category)) grouped.set(t.category, [])
      grouped.get(t.category)!.push(t)
    }
    return (["service", "contact", "quotation"] as const)
      .filter((cat) => grouped.has(cat))
      .map((cat) => ({
        id: cat,
        label: CATEGORY_META[cat].label,
        icon: CATEGORY_META[cat].icon,
        description: CATEGORY_META[cat].description,
        hasUrgency: cat === "service",
        templates: grouped.get(cat)!,
      }))
  }, [templates])

  const activeTemplate = templates.find((t) => t.templateKey === activeKey)
  const activeGroup = templateGroups.find((g) => g.templates.some((t) => t.templateKey === activeKey))

  useEffect(() => {
    const loadEmail = async () => {
      setIsLoading(true)
      const result = await renderEmailPreview(toPreviewKey(activeKey), urgency)
      setEmailHtml(result.html)
      setIsLoading(false)
    }
    loadEmail()
  }, [activeKey, urgency])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Mail className="h-8 w-8 text-accent" />
          <h1 className="text-3xl font-bold text-foreground">Email Template Preview</h1>
          <Badge className="bg-accent/20 text-accent border-0">{templates.length} Templates</Badge>
        </div>
        <p className="text-muted-foreground">
          Preview all email templates across 3 form types. Service request emails support urgency-based styling
          with distinct visual treatments for routine, urgent, and emergency levels.
        </p>
      </div>

      {/* Template Selector */}
      <div className="responsive-grid-3">
        {templateGroups.map((group) => {
          const isActiveGroup = group.templates.some((t) => t.templateKey === activeKey)
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
                  const isActive = tmpl.templateKey === activeKey
                  const RecipientIcon = tmpl.recipientType === "customer" ? User : Building
                  return (
                    <button
                      key={tmpl.templateKey}
                      onClick={() => setActiveKey(tmpl.templateKey)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-left text-sm transition-colors ${
                        isActive
                          ? "bg-accent/20 text-accent font-medium"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <RecipientIcon className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{tmpl.templateLabel}</span>
                      {!tmpl.isActive && (
                        <Badge variant="outline" className="text-[10px] px-1 py-0 ml-auto border-muted text-muted-foreground shrink-0">
                          Inactive
                        </Badge>
                      )}
                      {isActive && tmpl.isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto shrink-0" />}
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Urgency Controls */}
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
              ? "Standard processing — response within 2-4 hours"
              : urgency === "urgent"
                ? "Priority processing — response within 2 hours"
                : "Immediate processing — response within 30 minutes"}
        </div>
      </div>

      {/* Preview Container */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-medium text-foreground">{activeGroup?.label}</span>
          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{activeTemplate?.templateLabel}</span>
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
          {activeTemplate && !activeTemplate.isActive && (
            <Badge variant="outline" className="border-muted text-muted-foreground ml-2">
              Inactive
            </Badge>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs text-gray-600 ml-2">
              {activeTemplate?.description ?? activeTemplate?.templateLabel}
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
          <div className="responsive-grid-3 text-sm">
            <div>
              <span className="font-medium text-foreground">Template Key</span>
              <p className="text-muted-foreground mt-1">
                <code className="bg-muted px-2 py-0.5 rounded text-xs">{activeTemplate?.templateKey}</code>
              </p>
            </div>
            <div>
              <span className="font-medium text-foreground">Urgency Support</span>
              <p className="text-muted-foreground mt-1">
                {activeGroup?.hasUrgency
                  ? "3 levels: routine (blue), urgent (amber), emergency (red)"
                  : "Not applicable — single style"}
              </p>
            </div>
            <div>
              <span className="font-medium text-foreground">Status</span>
              <p className="text-muted-foreground mt-1">
                {activeTemplate?.isActive ? "Active — sending enabled" : "Inactive — sending disabled"}
                {activeTemplate?.fromEmail && (
                  <span className="block text-xs mt-0.5">
                    From: {activeTemplate.fromName ?? activeTemplate.fromEmail}
                  </span>
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
