"use server"

/**
 * Email Scheduling Store
 *
 * Queue-based email scheduling with business hours enforcement.
 * Emails can be sent immediately or queued for batch delivery
 * during configured business hours windows.
 *
 * Strapi-ready: migrate to a "scheduled-email" collection type
 * with cron-based processing via Strapi lifecycles or Vercel Cron.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BusinessHours {
  dayOfWeek: number // 0=Sunday, 1=Monday, ..., 6=Saturday
  dayName: string
  startHour: number // 0-23
  endHour: number // 0-23
  isEnabled: boolean
}

export interface ScheduledEmail {
  id: string
  templateKey: string
  templateLabel: string
  category: "service" | "contact" | "quotation"
  recipientType: "customer" | "business"
  to: string
  subject: string
  status: "queued" | "scheduled" | "sent" | "failed" | "cancelled"
  scheduledFor: string | null // ISO timestamp, null = next business window
  createdAt: string
  processedAt: string | null
  error?: string
  metadata?: Record<string, unknown>
}

export interface SchedulerConfig {
  isEnabled: boolean
  businessHours: BusinessHours[]
  batchSize: number
  batchIntervalMinutes: number
  timezone: string
  immediateCategories: ("service" | "contact" | "quotation")[] // These bypass the queue
}

export interface QueueStats {
  queued: number
  scheduled: number
  sent: number
  failed: number
  cancelled: number
  total: number
  nextBatchAt: string | null
  isWithinBusinessHours: boolean
}

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------

function genId(): string {
  return `se_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

const config: SchedulerConfig = {
  isEnabled: true,
  businessHours: [
    { dayOfWeek: 0, dayName: "Sunday", startHour: 0, endHour: 0, isEnabled: false },
    { dayOfWeek: 1, dayName: "Monday", startHour: 8, endHour: 18, isEnabled: true },
    { dayOfWeek: 2, dayName: "Tuesday", startHour: 8, endHour: 18, isEnabled: true },
    { dayOfWeek: 3, dayName: "Wednesday", startHour: 8, endHour: 18, isEnabled: true },
    { dayOfWeek: 4, dayName: "Thursday", startHour: 8, endHour: 18, isEnabled: true },
    { dayOfWeek: 5, dayName: "Friday", startHour: 8, endHour: 17, isEnabled: true },
    { dayOfWeek: 6, dayName: "Saturday", startHour: 9, endHour: 13, isEnabled: true },
  ],
  batchSize: 10,
  batchIntervalMinutes: 15,
  timezone: "Europe/London",
  immediateCategories: ["service"], // Service requests always send immediately
}

const queue: ScheduledEmail[] = []

// Seed with sample data
function ensureSeed() {
  if (queue.length > 0) return
  const now = Date.now()
  queue.push(
    {
      id: genId(), templateKey: "contactCustomer", templateLabel: "Contact Customer Confirmation",
      category: "contact", recipientType: "customer", to: "john@example.com",
      subject: "Contact Inquiry Received - CR-2024-001", status: "sent",
      scheduledFor: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 4 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: genId(), templateKey: "quotationBusiness", templateLabel: "Quotation Business Notification",
      category: "quotation", recipientType: "business", to: "admin@electricalservices.com",
      subject: "New Quotation Request - QR-2024-015", status: "sent",
      scheduledFor: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: genId(), templateKey: "contactBusiness", templateLabel: "Contact Business Notification",
      category: "contact", recipientType: "business", to: "admin@electricalservices.com",
      subject: "New Contact Inquiry - CR-2024-002", status: "queued",
      scheduledFor: null,
      createdAt: new Date(now - 30 * 60 * 1000).toISOString(),
      processedAt: null,
    },
    {
      id: genId(), templateKey: "quotationCustomer", templateLabel: "Quotation Customer Confirmation",
      category: "quotation", recipientType: "customer", to: "sarah@example.com",
      subject: "Quotation Request Received - QR-2024-016", status: "scheduled",
      scheduledFor: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 15 * 60 * 1000).toISOString(),
      processedAt: null,
    },
    {
      id: genId(), templateKey: "contactCustomer", templateLabel: "Contact Customer Confirmation",
      category: "contact", recipientType: "customer", to: "mike@example.com",
      subject: "Contact Inquiry Received - CR-2024-003", status: "failed",
      scheduledFor: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date(now - 1 * 60 * 60 * 1000).toISOString(),
      error: "Resend API timeout after 30s",
    },
  )
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isWithinBusinessHours(): boolean {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()
  const dayConfig = config.businessHours.find((bh) => bh.dayOfWeek === day)
  if (!dayConfig || !dayConfig.isEnabled) return false
  return hour >= dayConfig.startHour && hour < dayConfig.endHour
}

function getNextBusinessWindow(): string | null {
  const now = new Date()
  for (let offset = 0; offset < 8; offset++) {
    const check = new Date(now.getTime() + offset * 24 * 60 * 60 * 1000)
    const dayConfig = config.businessHours.find((bh) => bh.dayOfWeek === check.getDay())
    if (!dayConfig || !dayConfig.isEnabled) continue

    const startTime = new Date(check)
    startTime.setHours(dayConfig.startHour, 0, 0, 0)

    if (startTime > now) return startTime.toISOString()
    if (offset === 0 && now.getHours() < dayConfig.endHour) {
      // Within today's window already
      return now.toISOString()
    }
  }
  return null
}

// ---------------------------------------------------------------------------
// Server Actions
// ---------------------------------------------------------------------------

export async function getSchedulerConfig(): Promise<SchedulerConfig> {
  return { ...config, businessHours: config.businessHours.map((bh) => ({ ...bh })) }
}

export async function updateSchedulerConfig(updates: {
  isEnabled?: boolean
  batchSize?: number
  batchIntervalMinutes?: number
  immediateCategories?: ("service" | "contact" | "quotation")[]
}): Promise<{ success: boolean }> {
  if (updates.isEnabled !== undefined) config.isEnabled = updates.isEnabled
  if (updates.batchSize !== undefined) config.batchSize = Math.max(1, Math.min(50, updates.batchSize))
  if (updates.batchIntervalMinutes !== undefined) config.batchIntervalMinutes = Math.max(5, Math.min(120, updates.batchIntervalMinutes))
  if (updates.immediateCategories !== undefined) config.immediateCategories = updates.immediateCategories
  return { success: true }
}

export async function updateBusinessHours(
  dayOfWeek: number,
  updates: { startHour?: number; endHour?: number; isEnabled?: boolean }
): Promise<{ success: boolean }> {
  const day = config.businessHours.find((bh) => bh.dayOfWeek === dayOfWeek)
  if (!day) return { success: false }
  if (updates.startHour !== undefined) day.startHour = updates.startHour
  if (updates.endHour !== undefined) day.endHour = updates.endHour
  if (updates.isEnabled !== undefined) day.isEnabled = updates.isEnabled
  return { success: true }
}

export async function getQueue(
  statusFilter?: ScheduledEmail["status"]
): Promise<ScheduledEmail[]> {
  ensureSeed()
  let filtered = [...queue]
  if (statusFilter) filtered = filtered.filter((e) => e.status === statusFilter)
  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getQueueStats(): Promise<QueueStats> {
  ensureSeed()
  return {
    queued: queue.filter((e) => e.status === "queued").length,
    scheduled: queue.filter((e) => e.status === "scheduled").length,
    sent: queue.filter((e) => e.status === "sent").length,
    failed: queue.filter((e) => e.status === "failed").length,
    cancelled: queue.filter((e) => e.status === "cancelled").length,
    total: queue.length,
    nextBatchAt: getNextBusinessWindow(),
    isWithinBusinessHours: isWithinBusinessHours(),
  }
}

export async function cancelScheduled(id: string): Promise<{ success: boolean; error?: string }> {
  ensureSeed()
  const email = queue.find((e) => e.id === id)
  if (!email) return { success: false, error: "Email not found" }
  if (email.status !== "queued" && email.status !== "scheduled") {
    return { success: false, error: `Cannot cancel email with status: ${email.status}` }
  }
  email.status = "cancelled"
  return { success: true }
}

export async function retryFailed(id: string): Promise<{ success: boolean; error?: string }> {
  ensureSeed()
  const email = queue.find((e) => e.id === id)
  if (!email) return { success: false, error: "Email not found" }
  if (email.status !== "failed") return { success: false, error: "Can only retry failed emails" }
  email.status = "queued"
  email.error = undefined
  email.processedAt = null
  return { success: true }
}

export async function clearProcessed(): Promise<{ success: boolean; cleared: number }> {
  ensureSeed()
  const before = queue.length
  const remaining = queue.filter((e) => e.status === "queued" || e.status === "scheduled")
  queue.length = 0
  queue.push(...remaining)
  return { success: true, cleared: before - remaining.length }
}
