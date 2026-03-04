"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Mail,
  Send,
  Clock,
  User,
  Phone,
  MessageSquare,
  FileText,
  Wrench,
  ArrowUpRight,
  ArrowDownLeft,
  StickyNote,
  RefreshCw,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  CircleDot,
  Timer,
  MailQuestion,
  Quote,
  XCircle,
} from "lucide-react"
import type {
  Job,
  JobStatus,
  JobPriority,
  FormType,
  Correspondence,
  ActivityEntry,
  InternalNote,
} from "@/lib/email/services/job-management.types"
import {
  JOB_STATUS_OPTIONS,
  JOB_PRIORITY_OPTIONS,
  ASSIGNEE_OPTIONS,
} from "@/lib/email/services/job-management.types"
import {
  getCorrespondence,
  getActivity,
  getNotes,
} from "@/lib/email/services/job-management"
import ReplyComposer from "@/components/admin/jobs/reply-composer"

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_CONFIG: Record<JobStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  acknowledged: { label: "Acknowledged", className: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  in_progress: { label: "In Progress", className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  awaiting_client: { label: "Awaiting Client", className: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
  quoted: { label: "Quoted", className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  resolved: { label: "Resolved", className: "bg-green-500/15 text-green-400 border-green-500/30" },
  closed: { label: "Closed", className: "bg-muted-foreground/15 text-muted-foreground border-muted-foreground/30" },
}

const PRIORITY_CONFIG: Record<JobPriority, { dot: string }> = {
  urgent: { dot: "bg-red-500" },
  high: { dot: "bg-orange-500" },
  normal: { dot: "bg-muted-foreground" },
  low: { dot: "bg-muted-foreground/50" },
}

const TYPE_CONFIG: Record<FormType, { label: string; icon: typeof MessageSquare }> = {
  contact: { label: "Contact", icon: MessageSquare },
  quotation: { label: "Quotation", icon: FileText },
  service: { label: "Service", icon: Wrench },
}

const ACTIVITY_ICON: Record<string, typeof RefreshCw> = {
  status_change: RefreshCw,
  email_sent: Send,
  email_received: Mail,
  note_added: StickyNote,
  assigned: UserPlus,
  priority_change: AlertTriangle,
  created: CircleDot,
}

const STATUS_ICON: Record<JobStatus, typeof CircleDot> = {
  new: CircleDot,
  acknowledged: CheckCircle,
  in_progress: Timer,
  awaiting_client: MailQuestion,
  quoted: Quote,
  resolved: CheckCircle,
  closed: XCircle,
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" })
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-NZ", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

interface JobDetailSheetProps {
  job: Job | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (jobId: string, status: JobStatus) => Promise<void>
  onPriorityChange: (jobId: string, priority: JobPriority) => Promise<void>
  onAssign: (jobId: string, assignee: string | null) => Promise<void>
  onAddNote: (jobId: string, content: string, author: string) => Promise<void>
  onSendReply: (
    job: Job,
    data: {
      subject: string
      sections: import("@/lib/email/templates/continuation-email-html").ContentSection[]
      greeting?: string
      signOff?: string
      includeContactInfo: boolean
    },
  ) => Promise<{ success: boolean; error?: string }>
  onPreviewEmail: (
    job: Job,
    data: {
      subject: string
      sections: import("@/lib/email/templates/continuation-email-html").ContentSection[]
      greeting?: string
      signOff?: string
      includeContactInfo: boolean
    },
  ) => Promise<string>
  devMode?: boolean
  devEmail?: string
}

export default function JobDetailSheet({
  job,
  open,
  onOpenChange,
  onStatusChange,
  onPriorityChange,
  onAssign,
  onAddNote,
  onSendReply,
  onPreviewEmail,
  devMode,
  devEmail,
}: JobDetailSheetProps) {
  const [correspondence, setCorrespondence] = useState<Correspondence[]>([])
  const [activity, setActivity] = useState<ActivityEntry[]>([])
  const [notes, setNotes] = useState<InternalNote[]>([])
  const [loading, setLoading] = useState(false)

  // Note form
  const [noteContent, setNoteContent] = useState("")
  const [savingNote, setSavingNote] = useState(false)

  const [activeTab, setActiveTab] = useState("correspondence")

  const loadData = useCallback(async () => {
    if (!job) return
    setLoading(true)
    try {
      const [corrData, actData, notesData] = await Promise.all([
        getCorrespondence(job.id),
        getActivity(job.id),
        getNotes(job.id),
      ])
      setCorrespondence(corrData)
      setActivity(actData)
      setNotes(notesData)
    } catch (err) {
      console.error("[email-admin] Failed to load job details:", err)
    } finally {
      setLoading(false)
    }
  }, [job])

  useEffect(() => {
    if (open && job) {
      loadData()
      setNoteContent("")
    }
  }, [open, job, loadData])

  const handleAddNote = async () => {
    if (!job || !noteContent.trim()) return
    setSavingNote(true)
    try {
      await onAddNote(job.id, noteContent, job.assignee ?? "Admin")
      setNoteContent("")
      await loadData()
    } finally {
      setSavingNote(false)
    }
  }

  if (!job) return null

  const TypeIcon = TYPE_CONFIG[job.formType].icon
  const statusCfg = STATUS_CONFIG[job.status]
  const StatusIcon = STATUS_ICON[job.status]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[560px] lg:max-w-[640px] p-0 flex flex-col"
      >
        <SheetHeader className="px-5 pt-5 pb-0 shrink-0">
          <div className="flex items-start justify-between gap-3 pr-8">
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs text-accent">{job.requestId}</span>
                <Badge variant="outline" className={`${statusCfg.className} text-[10px] gap-1`}>
                  <StatusIcon className="h-3 w-3" />
                  {statusCfg.label}
                </Badge>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${PRIORITY_CONFIG[job.priority].dot}`} />
                  <span className="text-[10px] text-muted-foreground capitalize">{job.priority}</span>
                </div>
              </div>
              <SheetTitle className="text-base leading-tight text-balance">{job.subject}</SheetTitle>
              <SheetDescription className="sr-only">Job details for {job.requestId}</SheetDescription>
            </div>
          </div>

          {/* Client info */}
          <div className="flex flex-wrap items-center gap-3 pt-3 pb-3 border-b border-border text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="text-foreground font-medium">{job.clientName}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              <span>{job.clientEmail}</span>
            </div>
            {job.clientPhone && (
              <div className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                <span>{job.clientPhone}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <TypeIcon className="h-3.5 w-3.5" />
              <span className="capitalize">{job.formType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatDate(job.createdAt)}</span>
            </div>
          </div>

          {/* Quick actions bar */}
          <div className="flex items-center gap-2 py-3 border-b border-border flex-wrap">
            <Select
              value={job.status}
              onValueChange={(v) => onStatusChange(job.id, v as JobStatus)}
            >
              <SelectTrigger className="h-8 w-[140px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={job.priority}
              onValueChange={(v) => onPriorityChange(job.id, v as JobPriority)}
            >
              <SelectTrigger className="h-8 w-[100px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_PRIORITY_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-xs">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={job.assignee ?? "unassigned"}
              onValueChange={(v) => onAssign(job.id, v === "unassigned" ? null : v)}
            >
              <SelectTrigger className="h-8 w-[120px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned" className="text-xs">
                  Unassigned
                </SelectItem>
                {ASSIGNEE_OPTIONS.map((a) => (
                  <SelectItem key={a} value={a} className="text-xs">
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {job.tags.length > 0 && (
              <div className="flex items-center gap-1 ml-auto">
                {job.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-[10px] py-0 h-5 border-border text-muted-foreground">
                    {tag}
                  </Badge>
                ))}
                {job.tags.length > 3 && (
                  <span className="text-[10px] text-muted-foreground">+{job.tags.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </SheetHeader>

        {/* Content tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-5 mt-2 h-9 w-auto justify-start shrink-0">
            <TabsTrigger value="correspondence" className="text-xs gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Emails ({correspondence.length})
            </TabsTrigger>
            <TabsTrigger value="activity" className="text-xs gap-1.5">
              <RefreshCw className="h-3.5 w-3.5" />
              Activity ({activity.length})
            </TabsTrigger>
            <TabsTrigger value="notes" className="text-xs gap-1.5">
              <StickyNote className="h-3.5 w-3.5" />
              Notes ({notes.length})
            </TabsTrigger>
          </TabsList>

          {/* Correspondence Tab */}
          <TabsContent value="correspondence" className="flex-1 min-h-0 mt-0">
            <ScrollArea className="h-full">
              <div className="px-5 space-y-3 py-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
                ) : correspondence.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No correspondence yet.</p>
                ) : (
                  correspondence.map((c) => (
                    <div
                      key={c.id}
                      className={`rounded-lg border p-3 space-y-2 ${
                        c.direction === "outbound"
                          ? "border-accent/20 bg-accent/5 ml-4"
                          : "border-border mr-4"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
                          {c.direction === "outbound" ? (
                            <ArrowUpRight className="h-3 w-3 text-accent shrink-0" />
                          ) : (
                            <ArrowDownLeft className="h-3 w-3 text-blue-400 shrink-0" />
                          )}
                          <span className="font-medium text-foreground truncate">
                            {c.direction === "outbound" ? "Sent" : "Received"}
                          </span>
                          <span className="truncate">{c.direction === "outbound" ? `to ${c.to}` : `from ${c.from}`}</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                          {formatDate(c.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-foreground">{c.subject}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {c.body}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply composer -- branded continuation emails */}
              <div className="border-t border-border px-5">
                <ReplyComposer
                  job={job}
                  onSend={async (data) => {
                    const result = await onSendReply(job, data)
                    if (result.success) await loadData()
                    return result
                  }}
                  onPreview={(data) => onPreviewEmail(job, data)}
                  devMode={devMode}
                  devEmail={devEmail}
                />
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="flex-1 min-h-0 mt-0 px-5">
            <ScrollArea className="h-full">
              <div className="py-3 space-y-0">
                {loading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
                ) : activity.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No activity yet.</p>
                ) : (
                  activity.map((a, idx) => {
                    const Icon = ACTIVITY_ICON[a.type] ?? CircleDot
                    const isLast = idx === activity.length - 1
                    return (
                      <div key={a.id} className="flex gap-3">
                        {/* Timeline line */}
                        <div className="flex flex-col items-center">
                          <div className="flex items-center justify-center w-7 h-7 rounded-full bg-muted/60 shrink-0">
                            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                          {!isLast && <div className="w-px flex-1 bg-border min-h-[16px]" />}
                        </div>
                        <div className="pb-4 min-w-0">
                          <p className="text-xs text-foreground leading-relaxed">{a.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">{a.user}</span>
                            <span className="text-[10px] text-muted-foreground/50">-</span>
                            <span className="text-[10px] text-muted-foreground">{formatFullDate(a.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="flex-1 flex flex-col min-h-0 mt-0 px-5 pb-0">
            <ScrollArea className="flex-1">
              <div className="space-y-3 py-3">
                {loading ? (
                  <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
                ) : notes.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-8">No internal notes yet.</p>
                ) : (
                  notes.map((n) => (
                    <div key={n.id} className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-foreground">{n.author}</span>
                        <span className="text-[10px] text-muted-foreground">{formatDate(n.timestamp)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">{n.content}</p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>

            {/* Add note form */}
            <div className="border-t border-border pt-3 pb-4 space-y-2 shrink-0">
              <Textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Add an internal note (not sent to client)..."
                rows={2}
                className="text-xs resize-none"
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5 text-xs bg-transparent"
                  disabled={!noteContent.trim() || savingNote}
                  onClick={handleAddNote}
                >
                  <StickyNote className="h-3.5 w-3.5" />
                  {savingNote ? "Saving..." : "Save Note"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
}
