"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Briefcase,
  Clock,
  UserX,
  AlertTriangle,
  Inbox,
  BarChart3,
  FlaskConical,
} from "lucide-react"
import type { Job, JobStatus, JobPriority, JobStats } from "@/lib/email/services/job-management.types"
import {
  getJobs,
  getJobStats,
  updateJobStatus,
  updateJobPriority,
  assignJob,
  addNote,
  bulkUpdateStatus,
  bulkAssign,
  bulkArchive,
} from "@/lib/email/services/job-management"
import {
  sendContinuationEmail,
  previewContinuationEmail,
} from "@/lib/email/services/continuation-email-service"
import type { ContentSection } from "@/lib/email/templates/continuation-email-html"
import JobsDataTable from "@/components/admin/jobs/jobs-data-table"
import JobDetailSheet from "@/components/admin/jobs/job-detail-sheet"

export default function EmailJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [stats, setStats] = useState<JobStats | null>(null)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // Dev mode -- redirect all outbound emails to a test address
  const [devMode, setDevMode] = useState(true)
  const [devEmail, setDevEmail] = useState("herman@adudev.co.uk")

  const loadData = useCallback(async () => {
    try {
      const [jobsData, statsData] = await Promise.all([getJobs(), getJobStats()])
      setJobs(jobsData)
      setStats(statsData)
    } catch (err) {
      console.error("[email-admin] Failed to load jobs:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleViewJob = useCallback((job: Job) => {
    setSelectedJob(job)
    setSheetOpen(true)
  }, [])

  const handleStatusChange = useCallback(
    async (jobId: string, status: JobStatus) => {
      await updateJobStatus(jobId, status, "Admin")
      await loadData()
      // Update selected job if it matches
      setSelectedJob((prev) => (prev?.id === jobId ? { ...prev, status, updatedAt: new Date().toISOString() } : prev))
    },
    [loadData],
  )

  const handlePriorityChange = useCallback(
    async (jobId: string, priority: JobPriority) => {
      await updateJobPriority(jobId, priority, "Admin")
      await loadData()
      setSelectedJob((prev) => (prev?.id === jobId ? { ...prev, priority, updatedAt: new Date().toISOString() } : prev))
    },
    [loadData],
  )

  const handleAssign = useCallback(
    async (jobId: string, assignee: string | null) => {
      await assignJob(jobId, assignee, "Admin")
      await loadData()
      setSelectedJob((prev) => (prev?.id === jobId ? { ...prev, assignee, updatedAt: new Date().toISOString() } : prev))
    },
    [loadData],
  )

  const handleSendReply = useCallback(
    async (
      job: Job,
      data: {
        subject: string
        sections: ContentSection[]
        greeting?: string
        signOff?: string
        includeContactInfo: boolean
      },
    ): Promise<{ success: boolean; error?: string }> => {
      const targetEmail = devMode && devEmail.trim() ? devEmail.trim() : job.clientEmail
      const result = await sendContinuationEmail({
        jobId: job.id,
        requestId: job.requestId,
        formType: job.formType,
        clientName: job.clientName,
        clientEmail: targetEmail,
        subject: devMode
          ? data.subject.replace(/^(RE:\s*)?/, "$1[DEV TEST] ")
          : data.subject,
        priority: job.priority,
        greeting: data.greeting,
        sections: data.sections,
        signOff: data.signOff,
        includeContactInfo: data.includeContactInfo,
        senderName: job.assignee ?? "Admin",
      })
      await loadData()
      return { success: result.success, error: result.error }
    },
    [loadData, devMode, devEmail],
  )

  const handlePreviewEmail = useCallback(
    async (
      job: Job,
      data: {
        subject: string
        sections: ContentSection[]
        greeting?: string
        signOff?: string
        includeContactInfo: boolean
      },
    ): Promise<string> => {
      return previewContinuationEmail({
        requestId: job.requestId,
        formType: job.formType,
        clientName: job.clientName,
        clientEmail: job.clientEmail,
        subject: data.subject,
        priority: job.priority,
        greeting: data.greeting,
        sections: data.sections,
        signOff: data.signOff,
        includeContactInfo: data.includeContactInfo,
      })
    },
    [],
  )

  const handleAddNote = useCallback(
    async (jobId: string, content: string, author: string) => {
      await addNote(jobId, content, author)
      await loadData()
    },
    [loadData],
  )

  const handleBulkStatusChange = useCallback(
    async (jobIds: string[], status: JobStatus) => {
      await bulkUpdateStatus(jobIds, status, "Admin")
      await loadData()
    },
    [loadData],
  )

  const handleBulkAssign = useCallback(
    async (jobIds: string[], assignee: string | null) => {
      await bulkAssign(jobIds, assignee, "Admin")
      await loadData()
    },
    [loadData],
  )

  const handleBulkArchive = useCallback(
    async (jobIds: string[]) => {
      await bulkArchive(jobIds)
      await loadData()
    },
    [loadData],
  )

  // Stats cards
  const statCards = stats
    ? [
        {
          label: "Total Active",
          value: stats.total,
          icon: Briefcase,
          sub: `${stats.byStatus.new} new`,
          accent: false,
        },
        {
          label: "Needs Action",
          value: stats.byStatus.new + stats.byStatus.awaiting_client,
          icon: Inbox,
          sub: `${stats.byStatus.new} new, ${stats.byStatus.awaiting_client} awaiting`,
          accent: true,
        },
        {
          label: "Unassigned",
          value: stats.unassigned,
          icon: UserX,
          sub: "Needs assignment",
          accent: stats.unassigned > 0,
        },
        {
          label: "Urgent / High",
          value: stats.byPriority.urgent + stats.byPriority.high,
          icon: AlertTriangle,
          sub: `${stats.byPriority.urgent} urgent, ${stats.byPriority.high} high`,
          accent: stats.byPriority.urgent > 0,
        },
        {
          label: "In Progress",
          value: stats.byStatus.in_progress,
          icon: Clock,
          sub: `Avg age: ${stats.avgAge}d`,
          accent: false,
        },
        {
          label: "Resolved",
          value: stats.byStatus.resolved + stats.byStatus.closed,
          icon: BarChart3,
          sub: `${stats.byStatus.resolved} resolved, ${stats.byStatus.closed} closed`,
          accent: false,
        },
      ]
    : []

  return (
    <div className="space-y-6">
      {/* Dev Mode Banner */}
      <div className={`rounded-lg border-2 p-3 transition-colors ${
        devMode
          ? "border-amber-500/60 bg-amber-500/10"
          : "border-border bg-card/50"
      }`}>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <FlaskConical className={`h-4 w-4 ${devMode ? "text-amber-500" : "text-muted-foreground"}`} />
            <Label htmlFor="dev-mode-toggle" className={`text-sm font-medium cursor-pointer ${
              devMode ? "text-amber-500" : "text-muted-foreground"
            }`}>
              {devMode ? "Dev Mode Active" : "Dev Mode Off"}
            </Label>
            <Switch
              id="dev-mode-toggle"
              checked={devMode}
              onCheckedChange={setDevMode}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>
          {devMode && (
            <div className="flex items-center gap-2 flex-1 min-w-0 max-w-sm">
              <span className="text-xs text-amber-500/80 whitespace-nowrap">All emails to:</span>
              <Input
                value={devEmail}
                onChange={(e) => setDevEmail(e.target.value)}
                placeholder="test@example.com"
                className="h-7 text-xs border-amber-500/30 bg-amber-500/5 max-w-[220px]"
              />
            </div>
          )}
        </div>
        {devMode && (
          <p className="text-[11px] text-amber-500/70 mt-1.5 pl-7">
            All outbound emails will be redirected to the address above with a [DEV TEST] subject prefix. Client data stays unchanged in the UI.
          </p>
        )}
      </div>

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Request Management</h1>
          <Badge className="bg-accent/20 text-accent border-0">Job Tracker</Badge>
          {devMode && (
            <Badge className="bg-amber-500/20 text-amber-500 border-0 text-[10px] uppercase tracking-wider">
              Dev Mode
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Manage all customer requests from initial contact through to resolution. Click any row to view details, send replies, and track correspondence.
        </p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {statCards.map((card) => (
            <Card key={card.label} className={`${card.accent ? "border-accent/30" : "border-border"}`}>
              <CardContent className="p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-medium">{card.label}</span>
                  <card.icon className={`h-3.5 w-3.5 ${card.accent ? "text-accent" : "text-muted-foreground/50"}`} />
                </div>
                <p className={`text-xl font-bold ${card.accent ? "text-accent" : "text-foreground"}`}>
                  {card.value}
                </p>
                <p className="text-[10px] text-muted-foreground">{card.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Data Table */}
      {loading ? (
        <Card className="border-border">
          <CardContent className="p-12 text-center text-muted-foreground">
            Loading requests...
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">
              All Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <JobsDataTable
              data={jobs}
              onViewJob={handleViewJob}
              onStatusChange={handleStatusChange}
              onAssign={handleAssign}
              onBulkStatusChange={handleBulkStatusChange}
              onBulkAssign={handleBulkAssign}
              onBulkArchive={handleBulkArchive}
            />
          </CardContent>
        </Card>
      )}

      {/* Detail Sheet */}
      <JobDetailSheet
        job={selectedJob}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onAssign={handleAssign}
        onAddNote={handleAddNote}
        onSendReply={handleSendReply}
        onPreviewEmail={handlePreviewEmail}
        devMode={devMode}
        devEmail={devEmail}
      />
    </div>
  )
}
