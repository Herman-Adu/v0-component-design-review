import type { ContentSection } from "../templates/continuation-email-html"
import type { UrgencyLevel } from "../config/email-config"
import type { FormType, JobPriority } from "./job-management.types"

export interface SendContinuationEmailParams {
  jobId: string
  requestId: string
  formType: FormType
  clientName: string
  clientEmail: string
  subject: string
  priority?: JobPriority
  urgency?: UrgencyLevel
  greeting?: string
  sections: ContentSection[]
  signOff?: string
  includeContactInfo?: boolean
  senderName?: string
}

export interface SendContinuationEmailResult {
  success: boolean
  messageId?: string
  error?: string
  htmlContent?: string
}
