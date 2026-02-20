"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  Clock, Calendar, Play, Pause, RefreshCw, Trash2, RotateCcw,
  CheckCircle2, XCircle, AlertTriangle, ArrowLeft, Loader2, Timer, Zap,
} from "lucide-react"
import Link from "next/link"
import {
  getSchedulerConfig, updateSchedulerConfig, updateBusinessHours,
  getQueue, getQueueStats, cancelScheduled, retryFailed, clearProcessed,
  type SchedulerConfig, type ScheduledEmail, type QueueStats,
} from "@/lib/email/services/email-scheduler"

const STATUS_STYLES: Record<ScheduledEmail["status"], { bg: string; text: string; icon: React.ElementType }> = {
  queued: { bg: "bg-blue-500/20", text: "text-blue-400", icon: Clock },
  scheduled: { bg: "bg-amber-500/20", text: "text-amber-400", icon: Timer },
  sent: { bg: "bg-green-500/20", text: "text-green-400", icon: CheckCircle2 },
  failed: { bg: "bg-red-500/20", text: "text-red-400", icon: XCircle },
  cancelled: { bg: "bg-muted", text: "text-muted-foreground", icon: Trash2 },
}

const CATEGORY_LABELS: Record<string, string> = {
  service: "Service Request",
  contact: "Contact Form",
  quotation: "Quotation Request",
}

export default function EmailSchedulingPage() {
  const [config, setConfig] = useState<SchedulerConfig | null>(null)
  const [queue, setQueue] = useState<ScheduledEmail[]>([])
  const [stats, setStats] = useState<QueueStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<ScheduledEmail["status"] | "all">("all")
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    const [cfg, q, s] = await Promise.all([
      getSchedulerConfig(),
      getQueue(statusFilter === "all" ? undefined : statusFilter),
      getQueueStats(),
    ])
    setConfig(cfg)
    setQueue(q)
    setStats(s)
    setLoading(false)
  }, [statusFilter])

  useEffect(() => { loadData() }, [loadData])

  async function handleToggleScheduler() {
    if (!config) return
    await updateSchedulerConfig({ isEnabled: !config.isEnabled })
    await loadData()
  }

  async function handleToggleImmediate(cat: "service" | "contact" | "quotation") {
    if (!config) return
    const updated = config.immediateCategories.includes(cat)
      ? config.immediateCategories.filter((c) => c !== cat)
      : [...config.immediateCategories, cat]
    await updateSchedulerConfig({ immediateCategories: updated })
    await loadData()
  }

  async function handleUpdateBatchSize(val: number) {
    await updateSchedulerConfig({ batchSize: val })
    await loadData()
  }

  async function handleUpdateInterval(val: number) {
    await updateSchedulerConfig({ batchIntervalMinutes: val })
    await loadData()
  }

  async function handleToggleDay(day: number) {
    if (!config) return
    const dayConfig = config.businessHours.find((bh) => bh.dayOfWeek === day)
    if (!dayConfig) return
    await updateBusinessHours(day, { isEnabled: !dayConfig.isEnabled })
    await loadData()
  }

  async function handleUpdateHours(day: number, field: "startHour" | "endHour", val: number) {
    await updateBusinessHours(day, { [field]: val })
    await loadData()
  }

  async function handleCancel(id: string) {
    setActionLoading(id)
    await cancelScheduled(id)
    await loadData()
    setActionLoading(null)
  }

  async function handleRetry(id: string) {
    setActionLoading(id)
    await retryFailed(id)
    await loadData()
    setActionLoading(null)
  }

  async function handleClearProcessed() {
    setActionLoading("clear")
    await clearProcessed()
    await loadData()
    setActionLoading(null)
  }

  function formatTime(iso: string | null) {
    if (!iso) return "--"
    try {
      const d = new Date(iso)
      const now = Date.now()
      const diff = now - d.getTime()
      const absDiff = Math.abs(diff)
      const mins = Math.floor(absDiff / 60000)
      if (diff > 0) {
        if (mins < 1) return "Just now"
        if (mins < 60) return `${mins}m ago`
        const hrs = Math.floor(mins / 60)
        if (hrs < 24) return `${hrs}h ago`
        return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
      }
      if (mins < 60) return `in ${mins}m`
      const hrs = Math.floor(mins / 60)
      if (hrs < 24) return `in ${hrs}h`
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    } catch { return iso }
  }

  if (loading || !config || !stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link href="/dashboard/admin/email"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <h1 className="text-2xl font-bold text-foreground">Email Scheduling</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild><Link href="/dashboard/admin/email"><ArrowLeft className="h-4 w-4" /></Link></Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Email Scheduling</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Queue management, business hours, and batch delivery</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadData}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" /> Refresh
          </Button>
          <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-2">
            <span className="text-sm text-muted-foreground">Scheduler</span>
            <Switch checked={config.isEnabled} onCheckedChange={handleToggleScheduler} />
            <Badge className={config.isEnabled ? "bg-green-500/20 text-green-400 border-0" : "bg-red-500/20 text-red-400 border-0"}>
              {config.isEnabled ? "Active" : "Paused"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {([
          { label: "Queued", value: stats.queued, color: "text-blue-400" },
          { label: "Scheduled", value: stats.scheduled, color: "text-amber-400" },
          { label: "Sent", value: stats.sent, color: "text-green-400" },
          { label: "Failed", value: stats.failed, color: "text-red-400" },
          { label: "Total", value: stats.total, color: "text-foreground" },
        ] as const).map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Business Hours Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stats.isWithinBusinessHours ? "bg-green-500 animate-pulse" : "bg-muted-foreground"}`} />
              <span className="text-sm font-medium text-foreground">
                {stats.isWithinBusinessHours ? "Within Business Hours" : "Outside Business Hours"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {stats.nextBatchAt ? `Next batch: ${formatTime(stats.nextBatchAt)}` : "No upcoming batch window"}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Business Hours Configuration */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-accent" /> Business Hours
            </CardTitle>
            <CardDescription>Queued emails are sent during these windows ({config.timezone})</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {config.businessHours.map((bh) => (
              <div key={bh.dayOfWeek} className="flex items-center gap-3 py-1.5">
                <Switch
                  checked={bh.isEnabled}
                  onCheckedChange={() => handleToggleDay(bh.dayOfWeek)}
                  className="shrink-0"
                />
                <span className={`text-sm w-24 ${bh.isEnabled ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                  {bh.dayName}
                </span>
                {bh.isEnabled ? (
                  <div className="flex items-center gap-2 text-sm">
                    <Input
                      type="number" min={0} max={23} value={bh.startHour}
                      onChange={(e) => handleUpdateHours(bh.dayOfWeek, "startHour", Number(e.target.value))}
                      className="w-16 h-8 text-center text-xs"
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                      type="number" min={0} max={23} value={bh.endHour}
                      onChange={(e) => handleUpdateHours(bh.dayOfWeek, "endHour", Number(e.target.value))}
                      className="w-16 h-8 text-center text-xs"
                    />
                    <span className="text-xs text-muted-foreground">{bh.endHour - bh.startHour}h window</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">Closed</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Batch & Category Config */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-accent" /> Immediate Send Bypass
              </CardTitle>
              <CardDescription>These categories skip the queue and send immediately</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(["service", "contact", "quotation"] as const).map((cat) => (
                <div key={cat} className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{CATEGORY_LABELS[cat]}</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={config.immediateCategories.includes(cat)}
                      onCheckedChange={() => handleToggleImmediate(cat)}
                    />
                    <Badge className={config.immediateCategories.includes(cat)
                      ? "bg-amber-500/20 text-amber-400 border-0 text-xs"
                      : "bg-muted text-muted-foreground border-0 text-xs"
                    }>
                      {config.immediateCategories.includes(cat) ? "Immediate" : "Queued"}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Play className="h-4 w-4 text-accent" /> Batch Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Batch Size</p>
                  <p className="text-xs text-muted-foreground">Emails sent per batch cycle</p>
                </div>
                <Input
                  type="number" min={1} max={50} value={config.batchSize}
                  onChange={(e) => handleUpdateBatchSize(Number(e.target.value))}
                  className="w-20 h-8 text-center text-sm"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">Batch Interval</p>
                  <p className="text-xs text-muted-foreground">Minutes between batch runs</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number" min={5} max={120} value={config.batchIntervalMinutes}
                    onChange={(e) => handleUpdateInterval(Number(e.target.value))}
                    className="w-20 h-8 text-center text-sm"
                  />
                  <span className="text-xs text-muted-foreground">min</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Queue Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" /> Email Queue
            </CardTitle>
            <div className="flex items-center gap-2">
              {(["all", "queued", "scheduled", "sent", "failed", "cancelled"] as const).map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => setStatusFilter(s)}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
              <Button
                variant="outline" size="sm" className="text-xs h-7 ml-2 bg-transparent"
                onClick={handleClearProcessed}
                disabled={actionLoading === "clear"}
              >
                {actionLoading === "clear" ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="mr-1 h-3 w-3" />}
                Clear Processed
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {queue.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-sm text-muted-foreground">No emails in queue{statusFilter !== "all" ? ` with status "${statusFilter}"` : ""}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {queue.map((email) => {
                const style = STATUS_STYLES[email.status]
                const StatusIcon = style.icon
                return (
                  <div key={email.id} className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${style.bg} shrink-0`}>
                      <StatusIcon className={`h-4 w-4 ${style.text}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-foreground truncate">{email.subject}</p>
                        <Badge className={`${style.bg} ${style.text} border-0 text-[10px] px-1.5 shrink-0`}>
                          {email.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span>{email.templateLabel}</span>
                        <span className="opacity-50">|</span>
                        <span>{email.to}</span>
                        <span className="opacity-50">|</span>
                        <span>Created {formatTime(email.createdAt)}</span>
                        {email.scheduledFor && (
                          <>
                            <span className="opacity-50">|</span>
                            <span>{email.status === "scheduled" ? `Scheduled ${formatTime(email.scheduledFor)}` : `Processed ${formatTime(email.processedAt)}`}</span>
                          </>
                        )}
                      </div>
                      {email.error && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                          <span className="text-xs text-red-400">{email.error}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {(email.status === "queued" || email.status === "scheduled") && (
                        <Button
                          variant="outline" size="sm" className="h-7 text-xs bg-transparent"
                          onClick={() => handleCancel(email.id)}
                          disabled={actionLoading === email.id}
                        >
                          {actionLoading === email.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><Pause className="mr-1 h-3 w-3" /> Cancel</>}
                        </Button>
                      )}
                      {email.status === "failed" && (
                        <Button
                          variant="outline" size="sm" className="h-7 text-xs bg-transparent"
                          onClick={() => handleRetry(email.id)}
                          disabled={actionLoading === email.id}
                        >
                          {actionLoading === email.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <><RotateCcw className="mr-1 h-3 w-3" /> Retry</>}
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Architecture Note */}
      <Card className="border-accent/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Strapi-Ready Architecture</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Currently using in-memory queue for demonstration. In production, migrate to a Strapi
                &quot;scheduled-email&quot; collection type with Vercel Cron for batch processing. The scheduler
                config and business hours would be stored in a Strapi single type for persistence.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
