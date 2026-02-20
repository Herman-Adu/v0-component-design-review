"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  ArrowLeft, Split, Plus, Trash2, Save, FlaskConical, ChevronDown, ChevronRight,
  Mail, Building2, ToggleLeft, ToggleRight, Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  getAllTemplateSubjects,
  getABStats,
  addVariant,
  removeVariant,
  updateVariant,
  toggleABActive,
  resolveSubject,
  type TemplateSubjects,
  type ABStats,
} from "@/lib/email/services/ab-subjects"

const CAT_COLORS: Record<string, string> = {
  service: "bg-blue-500/20 text-blue-400",
  contact: "bg-green-500/20 text-green-400",
  quotation: "bg-purple-500/20 text-purple-400",
}

export default function ABSubjectLinesPage() {
  const [templates, setTemplates] = useState<TemplateSubjects[]>([])
  const [stats, setStats] = useState<ABStats | null>(null)
  const [expandedKey, setExpandedKey] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [testResult, setTestResult] = useState<Record<string, string>>({})
  const [newPattern, setNewPattern] = useState("")
  const [newDesc, setNewDesc] = useState("")

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [t, s] = await Promise.all([getAllTemplateSubjects(), getABStats()])
      setTemplates(t)
      setStats(s)
    } catch (err) {
      console.error("[email-admin] Failed to load A/B data:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadData() }, [loadData])

  async function handleToggle(templateKey: string) {
    await toggleABActive(templateKey)
    await loadData()
  }

  async function handleAddVariant(templateKey: string) {
    if (!newPattern.trim()) return
    const res = await addVariant(templateKey, newPattern, 25, newDesc)
    if (res.success) {
      setNewPattern("")
      setNewDesc("")
      await loadData()
    }
  }

  async function handleRemove(templateKey: string, variantId: string) {
    await removeVariant(templateKey, variantId)
    await loadData()
  }

  async function handleWeightChange(templateKey: string, variantId: string, weight: number) {
    await updateVariant(templateKey, variantId, { weight })
    await loadData()
  }

  async function handleTestResolve(templateKey: string) {
    const vars: Record<string, string> = { requestId: "SR-TEST-001", referenceId: "CR-TEST-001" }
    const result = await resolveSubject(templateKey, vars)
    setTestResult((prev) => ({ ...prev, [templateKey]: result.subject }))
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
      {stats && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
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
      )}

      {/* Template list */}
      {loading ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Loading templates...</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {templates.map((tmpl) => {
            const isExpanded = expandedKey === tmpl.templateKey
            const totalWeight = tmpl.variants.reduce((sum, v) => sum + v.weight, 0)
            const totalSends = tmpl.variants.reduce((sum, v) => sum + v.sends, 0)

            return (
              <Card key={tmpl.templateKey} className={tmpl.isActive ? "border-accent/30" : ""}>
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
                    {tmpl.recipientType === "customer" ? (
                      <Mail className="h-5 w-5 text-accent" />
                    ) : (
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-foreground">{tmpl.templateLabel}</p>
                      <Badge className={`${CAT_COLORS[tmpl.category]} border-0 text-[10px]`}>{tmpl.category}</Badge>
                      <Badge variant="outline" className="text-[10px]">{tmpl.recipientType}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {tmpl.variants.length} variant{tmpl.variants.length !== 1 ? "s" : ""} -- {totalSends} total sends
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    {tmpl.isActive ? (
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
                        onClick={() => handleToggle(tmpl.templateKey)}
                      >
                        {tmpl.isActive ? (
                          <><ToggleRight className="mr-2 h-4 w-4 text-green-400" /> Disable A/B</>
                        ) : (
                          <><ToggleLeft className="mr-2 h-4 w-4" /> Enable A/B</>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestResolve(tmpl.templateKey)}
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
                          <div key={v.id} className="rounded-lg border border-border p-4 space-y-3">
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
                                onClick={() => handleRemove(tmpl.templateKey, v.id)}
                                disabled={tmpl.variants.length <= 1}
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
                                  onValueCommit={([val]) => handleWeightChange(tmpl.templateKey, v.id, val)}
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
                          onClick={() => handleAddVariant(tmpl.templateKey)}
                          disabled={!newPattern.trim()}
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
                weighted random selection across all active variants. Weights are relative -- a 60/40 split gives 60% and 40% probability.
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
