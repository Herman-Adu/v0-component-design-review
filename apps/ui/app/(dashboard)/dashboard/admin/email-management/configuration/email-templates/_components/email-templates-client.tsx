"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  ChevronDown,
  ChevronUp,
  Save,
  Mail,
  User,
  Building2,
  Zap,
  MessageSquare,
  FileQuestion,
} from "lucide-react"
import {
  updateEmailTemplate,
  type UpdateEmailTemplateInput,
} from "@/lib/strapi/global/email-config/email-template/email-template-actions"
import type { EmailTemplateVM } from "@/lib/strapi/global/email-config/email-template/email-template-view-models"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function categoryIcon(category: string) {
  if (category === "service") return <Zap className="h-4 w-4 text-amber-400" />
  if (category === "contact") return <MessageSquare className="h-4 w-4 text-blue-400" />
  return <FileQuestion className="h-4 w-4 text-purple-400" />
}

function categoryColor(category: string) {
  if (category === "service") return "bg-amber-500/15 text-amber-400 border-0"
  if (category === "contact") return "bg-blue-500/15 text-blue-400 border-0"
  return "bg-purple-500/15 text-purple-400 border-0"
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface Props {
  initialTemplates: EmailTemplateVM[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function EmailTemplatesClient({ initialTemplates }: Props) {
  const router = useRouter()
  const [templates, setTemplates] = useState<EmailTemplateVM[]>(initialTemplates)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [editState, setEditState] = useState<Record<string, Partial<UpdateEmailTemplateInput>>>({})

  // Sync fresh initialData from RSC after router.refresh()
  useEffect(() => {
    setTemplates(initialTemplates)
  }, [initialTemplates])

  const strapiConfigured = typeof window !== "undefined"
    ? false // client can't read env; Save button shows "Save disabled" on Vercel fallback
    : false

  // Group by category for display
  const grouped = useMemo(() => {
    const map = new Map<string, EmailTemplateVM[]>()
    for (const t of templates) {
      if (!map.has(t.category)) map.set(t.category, [])
      map.get(t.category)!.push(t)
    }
    return map
  }, [templates])

  const stats = useMemo(() => ({
    total: templates.length,
    active: templates.filter((t) => t.isActive).length,
    withSenderOverride: templates.filter((t) => t.fromEmail).length,
  }), [templates])

  function getEdit<K extends keyof UpdateEmailTemplateInput>(
    documentId: string,
    key: K,
    fallback: EmailTemplateVM,
  ): UpdateEmailTemplateInput[K] {
    const draft = editState[documentId]
    if (draft && key in draft) return draft[key] as UpdateEmailTemplateInput[K]
    return fallback[key as keyof EmailTemplateVM] as unknown as UpdateEmailTemplateInput[K]
  }

  function setEdit(documentId: string, patch: Partial<UpdateEmailTemplateInput>) {
    setEditState((prev) => ({ ...prev, [documentId]: { ...prev[documentId], ...patch } }))
  }

  async function handleToggleActive(tmpl: EmailTemplateVM) {
    const next = !tmpl.isActive
    setTemplates((prev) => prev.map((t) => t.documentId === tmpl.documentId ? { ...t, isActive: next } : t))
    const result = await updateEmailTemplate(tmpl.documentId, { isActive: next })
    if (!result.success) {
      setTemplates((prev) => prev.map((t) => t.documentId === tmpl.documentId ? { ...t, isActive: tmpl.isActive } : t))
    } else {
      router.refresh()
    }
  }

  async function handleSave(tmpl: EmailTemplateVM) {
    const draft = editState[tmpl.documentId]
    if (!draft || Object.keys(draft).length === 0) return
    setSaving(tmpl.documentId)
    const result = await updateEmailTemplate(tmpl.documentId, draft)
    setSaving(null)
    if (result.success) {
      setEditState((prev) => { const n = { ...prev }; delete n[tmpl.documentId]; return n })
      router.refresh()
    }
  }

  const categoryOrder: EmailTemplateVM["category"][] = ["service", "contact", "quotation"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 border border-accent/20">
            <FileText className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
              Email Templates
            </h1>
            <p className="text-muted-foreground">
              Canonical template registry — defines keys, labels, and sender overrides used across A/B variants, recipient groups, and the email queue
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">{stats.total} Templates</Badge>
          <Badge className="bg-green-500/20 text-green-400 border-0">{stats.active} Active</Badge>
          {stats.withSenderOverride > 0 && (
            <Badge className="bg-accent/20 text-accent border-0">{stats.withSenderOverride} Sender Override</Badge>
          )}
        </div>
      </div>

      {/* Template groups by category */}
      {categoryOrder.map((category) => {
        const group = grouped.get(category)
        if (!group?.length) return null
        return (
          <div key={category}>
            <div className="flex items-center gap-2 mb-3">
              {categoryIcon(category)}
              <h2 className="text-base font-semibold text-foreground capitalize">{category}</h2>
              <Badge className={categoryColor(category)}>{group.length} templates</Badge>
            </div>

            <div className="space-y-3">
              {group.map((tmpl) => {
                const isExpanded = expandedKey === tmpl.documentId
                const hasDraft = Boolean(editState[tmpl.documentId] && Object.keys(editState[tmpl.documentId]!).length > 0)

                return (
                  <Card key={tmpl.documentId} className={!tmpl.isActive ? "opacity-60" : ""}>
                    {/* Row header */}
                    <CardHeader className="pb-2 pt-4 px-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-muted shrink-0">
                            {tmpl.recipientType === "customer"
                              ? <User className="h-4 w-4 text-muted-foreground" />
                              : <Building2 className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="text-sm font-semibold text-foreground truncate">
                              {tmpl.templateLabel}
                            </CardTitle>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{tmpl.templateKey}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Badge variant="outline" className="text-[10px]">{tmpl.recipientType}</Badge>
                          {tmpl.fromEmail && (
                            <Badge className="bg-accent/20 text-accent border-0 text-[10px]">
                              <Mail className="h-2.5 w-2.5 mr-1" />override
                            </Badge>
                          )}
                          <Switch
                            checked={tmpl.isActive}
                            onCheckedChange={() => handleToggleActive(tmpl)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => setExpandedKey(isExpanded ? null : tmpl.documentId)}
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    {/* Expanded edit form */}
                    {isExpanded && (
                      <CardContent className="px-5 pb-5 pt-0 space-y-4">
                        <Separator />

                        {/* Description */}
                        <div className="space-y-1.5">
                          <Label className="text-xs">Description</Label>
                          <Textarea
                            rows={2}
                            className="text-xs resize-none"
                            value={getEdit(tmpl.documentId, "description", tmpl) ?? ""}
                            onChange={(e) => setEdit(tmpl.documentId, { description: e.target.value || null })}
                            placeholder="What does this template do?"
                          />
                        </div>

                        {/* Sender overrides */}
                        <div>
                          <p className="text-xs font-medium text-foreground mb-2">Sender Override <span className="text-muted-foreground font-normal">(leave blank to use global defaults)</span></p>
                          <div className="responsive-grid-3 gap-3">
                            <div className="space-y-1.5">
                              <Label className="text-xs">From Name</Label>
                              <Input
                                className="text-xs h-8"
                                value={getEdit(tmpl.documentId, "fromName", tmpl) ?? ""}
                                onChange={(e) => setEdit(tmpl.documentId, { fromName: e.target.value || null })}
                                placeholder="NEXGEN Electrical"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">From Email</Label>
                              <Input
                                type="email"
                                className="text-xs h-8"
                                value={getEdit(tmpl.documentId, "fromEmail", tmpl) ?? ""}
                                onChange={(e) => setEdit(tmpl.documentId, { fromEmail: e.target.value || null })}
                                placeholder="noreply@example.com"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">Reply-To</Label>
                              <Input
                                type="email"
                                className="text-xs h-8"
                                value={getEdit(tmpl.documentId, "replyTo", tmpl) ?? ""}
                                onChange={(e) => setEdit(tmpl.documentId, { replyTo: e.target.value || null })}
                                placeholder="support@example.com"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          {hasDraft && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                              onClick={() => setEditState((prev) => { const n = { ...prev }; delete n[tmpl.documentId]; return n })}
                            >
                              Discard
                            </Button>
                          )}
                          <Button
                            size="sm"
                            className="text-xs"
                            disabled={!hasDraft || saving === tmpl.documentId}
                            onClick={() => handleSave(tmpl)}
                          >
                            <Save className="h-3 w-3 mr-1.5" />
                            {saving === tmpl.documentId ? "Saving…" : "Save"}
                          </Button>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
