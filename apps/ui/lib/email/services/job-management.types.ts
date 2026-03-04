// ---------------------------------------------------------------------------
// Job Management -- Types & Constants (shared, NOT "use server")
// ---------------------------------------------------------------------------
// Extracted from job-management.ts because "use server" files can only export
// async functions. Types and constants live here, server actions live there.
// ---------------------------------------------------------------------------

export type JobStatus =
  | "new"
  | "acknowledged"
  | "in_progress"
  | "awaiting_client"
  | "quoted"
  | "resolved"
  | "closed"

export type JobPriority = "urgent" | "high" | "normal" | "low"

export type FormType = "contact" | "quotation" | "service"

export type CorrespondenceDirection = "inbound" | "outbound"

export type ActivityType =
  | "status_change"
  | "email_sent"
  | "email_received"
  | "note_added"
  | "assigned"
  | "priority_change"
  | "created"

export interface Job {
  id: string
  requestId: string
  formType: FormType
  status: JobStatus
  priority: JobPriority
  assignee: string | null
  clientName: string
  clientEmail: string
  clientPhone: string
  subject: string
  createdAt: string
  updatedAt: string
  tags: string[]
  archived: boolean
}

export interface Correspondence {
  id: string
  jobId: string
  direction: CorrespondenceDirection
  from: string
  to: string
  subject: string
  body: string
  timestamp: string
  emailType: string
}

export interface ActivityEntry {
  id: string
  jobId: string
  type: ActivityType
  description: string
  user: string
  timestamp: string
  metadata?: Record<string, string>
}

export interface InternalNote {
  id: string
  jobId: string
  content: string
  author: string
  timestamp: string
}

export interface JobStats {
  total: number
  byStatus: Record<JobStatus, number>
  byType: Record<FormType, number>
  byPriority: Record<JobPriority, number>
  unassigned: number
  avgAge: number
}

export interface JobQuery {
  formType?: FormType
  status?: JobStatus
  priority?: JobPriority
  assignee?: string
  search?: string
  includeArchived?: boolean
}

// ---------------------------------------------------------------------------
// Constants (option lists for UI dropdowns)
// ---------------------------------------------------------------------------

export const JOB_STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "in_progress", label: "In Progress" },
  { value: "awaiting_client", label: "Awaiting Client" },
  { value: "quoted", label: "Quoted" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
]

export const JOB_PRIORITY_OPTIONS: { value: JobPriority; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
]

export const ASSIGNEE_OPTIONS: string[] = ["Sarah M.", "James K."]
