"use server"

/**
 * Email Attachment Configuration Service
 *
 * Manages attachment configurations per email template type.
 * Each template can have associated attachment types (PDFs, service
 * agreements, etc.) with file size limits and MIME type restrictions.
 *
 * Strapi-ready: Will map to attachment-config component type
 * on the email-configuration single-type.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface AttachmentType {
  id: string
  label: string
  description: string
  mimeTypes: string[]
  maxSizeMb: number
  required: boolean
  autoGenerate: boolean
}

export interface TemplateAttachmentConfig {
  templateId: string
  templateLabel: string
  enabled: boolean
  attachments: AttachmentType[]
  globalMaxSizeMb: number
  maxAttachments: number
  lastUpdated: string
}

export interface AttachmentState {
  globalEnabled: boolean
  globalMaxSizeMb: number
  configs: TemplateAttachmentConfig[]
}

// ---------------------------------------------------------------------------
// Default attachment types per template
// ---------------------------------------------------------------------------
const SERVICE_CUSTOMER_ATTACHMENTS: AttachmentType[] = [
  {
    id: "service-agreement",
    label: "Service Agreement",
    description: "Standard terms and conditions PDF auto-attached to customer confirmations",
    mimeTypes: ["application/pdf"],
    maxSizeMb: 2,
    required: false,
    autoGenerate: true,
  },
  {
    id: "safety-guide",
    label: "Electrical Safety Guide",
    description: "Customer safety information PDF for the service type requested",
    mimeTypes: ["application/pdf"],
    maxSizeMb: 5,
    required: false,
    autoGenerate: true,
  },
]

const SERVICE_BUSINESS_ATTACHMENTS: AttachmentType[] = [
  {
    id: "job-sheet",
    label: "Job Sheet Template",
    description: "Pre-filled job sheet PDF for the assigned engineer",
    mimeTypes: ["application/pdf"],
    maxSizeMb: 1,
    required: false,
    autoGenerate: true,
  },
]

const QUOTATION_CUSTOMER_ATTACHMENTS: AttachmentType[] = [
  {
    id: "quotation-pdf",
    label: "Quotation Document",
    description: "Detailed PDF quotation with line items, pricing, and terms",
    mimeTypes: ["application/pdf"],
    maxSizeMb: 5,
    required: true,
    autoGenerate: true,
  },
  {
    id: "portfolio-samples",
    label: "Portfolio Samples",
    description: "Optional images of similar completed work",
    mimeTypes: ["image/jpeg", "image/png", "application/pdf"],
    maxSizeMb: 10,
    required: false,
    autoGenerate: false,
  },
]

const QUOTATION_BUSINESS_ATTACHMENTS: AttachmentType[] = [
  {
    id: "site-photos",
    label: "Site Photos",
    description: "Customer-submitted photos of the work area (if provided)",
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSizeMb: 15,
    required: false,
    autoGenerate: false,
  },
]

const CONTACT_CUSTOMER_ATTACHMENTS: AttachmentType[] = []

const CONTACT_BUSINESS_ATTACHMENTS: AttachmentType[] = [
  {
    id: "inquiry-attachment",
    label: "Customer Attachment",
    description: "Any file the customer attached to their contact inquiry",
    mimeTypes: ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    maxSizeMb: 10,
    required: false,
    autoGenerate: false,
  },
]

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------
const TEMPLATE_DEFAULTS: { id: string; label: string; attachments: AttachmentType[] }[] = [
  { id: "service-customer", label: "Service Request -- Customer", attachments: SERVICE_CUSTOMER_ATTACHMENTS },
  { id: "service-business", label: "Service Request -- Business", attachments: SERVICE_BUSINESS_ATTACHMENTS },
  { id: "contact-customer", label: "Contact Inquiry -- Customer", attachments: CONTACT_CUSTOMER_ATTACHMENTS },
  { id: "contact-business", label: "Contact Inquiry -- Business", attachments: CONTACT_BUSINESS_ATTACHMENTS },
  { id: "quotation-customer", label: "Quotation Request -- Customer", attachments: QUOTATION_CUSTOMER_ATTACHMENTS },
  { id: "quotation-business", label: "Quotation Request -- Business", attachments: QUOTATION_BUSINESS_ATTACHMENTS },
]

const state: AttachmentState = {
  globalEnabled: true,
  globalMaxSizeMb: 25,
  configs: TEMPLATE_DEFAULTS.map((t) => ({
    templateId: t.id,
    templateLabel: t.label,
    enabled: t.attachments.length > 0,
    attachments: t.attachments.map((a) => ({ ...a })),
    globalMaxSizeMb: 25,
    maxAttachments: 5,
    lastUpdated: new Date().toISOString(),
  })),
}

// ---------------------------------------------------------------------------
// Read actions
// ---------------------------------------------------------------------------
export async function getAttachmentState(): Promise<AttachmentState> {
  return structuredClone(state)
}

export async function getTemplateAttachmentConfig(templateId: string): Promise<TemplateAttachmentConfig | null> {
  const config = state.configs.find((c) => c.templateId === templateId)
  return config ? structuredClone(config) : null
}

// ---------------------------------------------------------------------------
// Write actions
// ---------------------------------------------------------------------------
export async function setGlobalAttachments(enabled: boolean): Promise<AttachmentState> {
  state.globalEnabled = enabled
  return structuredClone(state)
}

export async function setGlobalMaxSize(maxSizeMb: number): Promise<AttachmentState> {
  state.globalMaxSizeMb = Math.max(1, Math.min(50, maxSizeMb))
  return structuredClone(state)
}

export async function toggleTemplateAttachments(templateId: string): Promise<TemplateAttachmentConfig | null> {
  const config = state.configs.find((c) => c.templateId === templateId)
  if (!config) return null
  config.enabled = !config.enabled
  config.lastUpdated = new Date().toISOString()
  return structuredClone(config)
}

export async function updateAttachmentType(
  templateId: string,
  attachmentId: string,
  updates: Partial<Omit<AttachmentType, "id">>
): Promise<TemplateAttachmentConfig | null> {
  const config = state.configs.find((c) => c.templateId === templateId)
  if (!config) return null
  const attachment = config.attachments.find((a) => a.id === attachmentId)
  if (!attachment) return null
  Object.assign(attachment, updates)
  config.lastUpdated = new Date().toISOString()
  return structuredClone(config)
}

export async function addAttachmentType(
  templateId: string,
  attachment: Omit<AttachmentType, "id">
): Promise<TemplateAttachmentConfig | null> {
  const config = state.configs.find((c) => c.templateId === templateId)
  if (!config) return null
  const id = `custom-${Date.now()}`
  config.attachments.push({ id, ...attachment })
  config.lastUpdated = new Date().toISOString()
  return structuredClone(config)
}

export async function removeAttachmentType(
  templateId: string,
  attachmentId: string
): Promise<TemplateAttachmentConfig | null> {
  const config = state.configs.find((c) => c.templateId === templateId)
  if (!config) return null
  config.attachments = config.attachments.filter((a) => a.id !== attachmentId)
  config.lastUpdated = new Date().toISOString()
  return structuredClone(config)
}

export async function setMaxAttachments(templateId: string, max: number): Promise<TemplateAttachmentConfig | null> {
  const config = state.configs.find((c) => c.templateId === templateId)
  if (!config) return null
  config.maxAttachments = Math.max(1, Math.min(10, max))
  config.lastUpdated = new Date().toISOString()
  return structuredClone(config)
}

// ---------------------------------------------------------------------------
// Utility -- format human-readable MIME list
// ---------------------------------------------------------------------------
export async function formatMimeTypes(mimeTypes: string[]): Promise<string> {
  const labels: Record<string, string> = {
    "application/pdf": "PDF",
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WebP",
    "application/msword": "DOC",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  }
  return mimeTypes.map((m) => labels[m] || m).join(", ")
}

// ---------------------------------------------------------------------------
// Summary stats
// ---------------------------------------------------------------------------
export async function getAttachmentSummary(): Promise<{
  totalConfigs: number
  enabledConfigs: number
  totalAttachmentTypes: number
  autoGeneratedCount: number
  maxGlobalSize: number
}> {
  return {
    totalConfigs: state.configs.length,
    enabledConfigs: state.configs.filter((c) => c.enabled).length,
    totalAttachmentTypes: state.configs.reduce((sum, c) => sum + c.attachments.length, 0),
    autoGeneratedCount: state.configs.reduce((sum, c) => sum + c.attachments.filter((a) => a.autoGenerate).length, 0),
    maxGlobalSize: state.globalMaxSizeMb,
  }
}
