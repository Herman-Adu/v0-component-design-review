"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft, Split, Plus, Trash2, Save, FlaskConical, ChevronDown, ChevronRight,
  Mail, Building2, ToggleLeft, ToggleRight, Zap,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { TemplateSubjectsVM, ABSubjectVariantVM } from "@/lib/strapi/global/email-config/ab-subject-variant/ab-subject-variant-view-models"
import type { EmailTemplateVM } from "@/lib/strapi/global/email-config/email-template/email-template-view-models"
import {
  createABVariant,
  updateABVariant,
  deleteABVariant,
  setTemplateAbEnabled,
} from "@/lib/strapi/global/email-config/ab-subject-variant/ab-subject-variant-actions"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const CAT_COLORS: Record<string, string> = {
  service: "bg-blue-500/20 text-blue-400",
  contact: "bg-green-500/20 text-green-400",
  quotation: "bg-purple-500/20 text-purple-400",
}

function resolveSubjectLocal(
  variants: ABSubjectVariantVM[],
  vars: Record<string, string>,
): string {
  if (variants.length === 0) return ""
  const totalWeight = variants.reduce((sum, v) => sum + v.weight, 0)
  if (totalWeight === 0) return variants[0].pattern
  let rand = Math.random() * totalWeight
  for (const v of variants) {
    rand -= v.weight
    if (rand <= 0) {
      return v.pattern.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`)
    }
  }
  return variants[variants.length - 1].pattern
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface Props {
  initialTemplates: TemplateSubjectsVM[]
  emailTemplates: EmailTemplateVM[]
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function ABSubjectLinesClient({ initialTemplates, emailTemplates }: Props) {
  const templateMap = useMemo(
    () => new Map(emailTemplates.map((t) => [t.templateKey, t])),
    [emailTemplates],
  )
  const router = useRouter()
  const [templates, setTemplates] = useState(initialTemplates)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [testResult, setTestResult] = useState<Record<string, string>>({})
  const [newPattern, setNewPattern] = useState("")
  const [newDesc, setNewDesc] = useState("")

  // Sync when RSC delivers fresh props after router.refresh()
  useEffect(() => { setTemplates(initialTemplates) }, [initialTemplates])

  const stats = useMemo(() => {
    const totalVariants = templates.reduce((sum, t) => sum + t.variants.length, 0)
    return {
      totalTemplates: templates.length,
      activeTemplates: templates.filter(t => t.abEnabled).length,
      totalVariants,
      avgVariantsPerTemplate: templates.length > 0
        ? Math.round((totalVariants / templates.length) * 10) / 10
        : 0,
    }
  }, [templates])

  const refresh = useCallback(async () => {
    router.refresh()
  }, [router])

  async function handleToggle(tmpl: TemplateSubjectsVM) {
    setSaving(true)
    const docIds = tmpl.variants.map(v => v.documentId)
    await setTemplateAbEnabled(docIds, !tmpl.abEnabled)
    await refresh()
    setSaving(false)
  }

  async function handleAddVariant(tmpl: TemplateSubjectsVM) {
    if (!newPattern.trim()) return
    setSaving(true)
    await createABVariant({
      templateKey: tmpl.templateKey,
      templateLabel: tmpl.templateLabel,
      pattern: newPattern,
      description: newDesc || null,
      weight: 25,
      abEnabled: tmpl.abEnabled,
    })
    setNewPattern("")
    setNewDesc("")
    await refresh()
    setSaving(false)
  }

  async function handleRemove(documentId: string) {
    setSaving(true)
    await deleteABVariant(documentId)
    await refresh()
    setSaving(false)
  }

  async function handleWeightChange(documentId: string, weight: number) {
    setSaving(true)
    await updateABVariant(documentId, { weight })
    await refresh()
    setSaving(false)
  }

  function handleTestResolve(tmpl: TemplateSubjectsVM) {
    const vars: Record<string, string> = { requestId: "SR-TEST-001", referenceId: "CR-TEST-001" }
    const result = resolveSubjectLocal(tmpl.variants, vars)
    setTestResult(prev => ({ ...prev, [tmpl.templateKey]: result }))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/admin/email"><ArrowLeft className="mr-2 h-4 w-4" /> Email Configuration</Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <Split className="h-8 w-8 text-accent" />
            A/B Subject Lines
          </h1>
          <p className="text-muted-foreground mt-1">
            Store multiple subject patterns per template with weighted random selection at send-time.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="responsive-grid-icon-2-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Templates</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.totalTemplates}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">A/B Active</p>
            <p className="text-2xl font-bold text-accent mt-1">{stats.activeTemplates}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Total Variants</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.totalVariants}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Avg / Template</p>
            <p className="text-2xl font-bold text-foreground mt-1">{stats.avgVariantsPerTemplate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Template list */}
      {templates.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No templates found.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {templates.map((tmpl) => {
            const isExpanded = expandedKey === tmpl.templateKey
            const etMeta = templateMap.get(tmpl.templateKey)
            const category = etMeta?.category ?? (tmpl.templateKey.startsWith("service") ? "service" : tmpl.templateKey.startsWith("contact") ? "contact" : "quotation")
            const recipientType = etMeta?.recipientType ?? (tmpl.templateKey.toLowerCase().endsWith("customer") ? "customer" : "business")
            const totalWeight = tmpl.variants.reduce((sum, v) => sum + v.weight, 0)
            const totalSends = tmpl.variants.reduce((sum, v) => sum + v.sends, 0)

            return (
              <Card key={tmpl.templateKey} className={tmpl.abEnabled ? "border-accent/30" : ""}>
                {/* Template header */}
                <button
                  type="button"
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-muted/30 transition-colors"
                  onClick={() => setExpandedKey(isExpanded ? null : tmpl.templateKey)}
                >
                  <div className="shrink-0">
                    {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className="shrink-0">
                    {recipientType === "customer" ? (
                      <Mail className="h-5 w-5 text-accent" />
                    ) : (
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{tmpl.templateLabel}</p>
                      <Badge className={`${CAT_COLORS[category]} border-0 text-[10px]`}>{category}</Badge>
                      <Badge variant="outline" className="text-[10px]">{recipientType}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tmpl.variants.length} variant{tmpl.variants.length !== 1 ? "s" : ""} — {totalSends} total sends
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {tmpl.abEnabled ? (
                      <Badge className="bg-green-500/20 text-green-400 border-0 text-[10px]">A/B Active</Badge>
                    ) : (
                      <Badge className="bg-muted text-muted-foreground border-0 text-[10px]">Single</Badge>
                    )}
                  </div>
                </button>

                {/* Expanded detail */}
                {isExpanded && (
                  <CardContent className="pt-0 pb-6 px-6 space-y-5 border-t border-border">
                    {/* Toggle & test */}
                    <div className="flex items-center justify-between pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={saving}
                        onClick={() => handleToggle(tmpl)}
                      >
                        {tmpl.abEnabled ? (
                          <><ToggleRight className="mr-2 h-4 w-4 text-green-400" /> Disable A/B</>
                        ) : (
                          <><ToggleLeft className="mr-2 h-4 w-4" /> Enable A/B</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestResolve(tmpl)}
                      >
                        <FlaskConical className="mr-2 h-4 w-4" /> Test Resolve
                      </Button>
                    </div>

                    {/* Test result */}
                    {testResult[tmpl.templateKey] && (
                      <div className="bg-accent/10 rounded-lg px-4 py-3 flex items-start gap-2">
                        <Zap className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-muted-foreground">Resolved subject:</p>
                          <p className="text-sm font-medium text-foreground font-mono">{testResult[tmpl.templateKey]}</p>
                        </div>
                      </div>
                    )}

                    {/* Variants */}
                    <div className="space-y-3">
                      {tmpl.variants.map((v) => {
                        const pct = totalWeight > 0 ? Math.round((v.weight / totalWeight) * 100) : 0
                        return (
                          <div key={v.documentId} className="rounded-lg border border-border p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <code className="text-sm font-mono text-foreground break-all">{v.pattern}</code>
                                {v.description && (
                                  <p className="text-xs text-muted-foreground mt-1">{v.description}</p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="shrink-0 text-muted-foreground hover:text-red-400"
                                disabled={saving || tmpl.variants.length <= 1}
                                onClick={() => handleRemove(v.documentId)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <Label className="text-xs text-muted-foreground">Weight: {v.weight}</Label>
                                  <span className="text-xs text-muted-foreground">{pct}% chance</span>
                                </div>
                                <Slider
                                  value={[v.weight]}
                                  min={0}
                                  max={100}
                                  step={5}
                                  onValueCommit={([val]) => handleWeightChange(v.documentId, val)}
                                  className="w-full"
                                />
                              </div>
                              <div className="text-right shrink-0 w-20">
                                <p className="text-xs text-muted-foreground">{v.sends} sends</p>
                              </div>
                            </div>

                            {/* Visual weight bar */}
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-accent transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Add variant */}
                    {tmpl.variants.length < 5 && (
                      <div className="rounded-lg border border-dashed border-border p-4 space-y-3">
                        <p className="text-sm font-medium text-foreground flex items-center gap-2">
                          <Plus className="h-4 w-4" /> Add Variant
                        </p>
                        <div className="space-y-2">
                          <Input
                            placeholder="Subject pattern e.g. Your request {requestId} is confirmed"
                            value={expandedKey === tmpl.templateKey ? newPattern : ""}
                            onChange={(e) => setNewPattern(e.target.value)}
                            className="font-mono text-sm"
                          />
                          <Input
                            placeholder="Description (optional)"
                            value={expandedKey === tmpl.templateKey ? newDesc : ""}
                            onChange={(e) => setNewDesc(e.target.value)}
                            className="text-sm"
                          />
                        </div>
                        <Button
                          size="sm"
                          disabled={!newPattern.trim() || saving}
                          onClick={() => handleAddVariant(tmpl)}
                        >
                          <Save className="mr-2 h-3.5 w-3.5" /> Add Variant
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Architecture note */}
      <Card className="border-dashed border-amber-500/30">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <FlaskConical className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">How A/B Selection Works</p>
              <p className="text-xs text-muted-foreground mt-1">
                At send-time, <code className="mx-1 px-1.5 py-0.5 bg-muted rounded text-[10px]">resolveSubject()</code> uses
                weighted random selection across all active variants. Weights are relative — a 60/40 split gives 60% and 40% probability.
                Variables like <code className="mx-1 px-1.5 py-0.5 bg-muted rounded text-[10px]">{"{requestId}"}</code> are replaced with real values.
                Send counts track per-variant volume for performance comparison.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
