import type { ScheduledEmailDocument } from "./scheduled-email-schema";

/**
 * Scheduled Email View Models
 *
 * Transforms validated Strapi documents into UI-ready view models.
 * Also provides queue statistics derived from a list of emails.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export type EmailQueueStatus = "queued" | "scheduled" | "sent" | "failed" | "cancelled";

export interface ScheduledEmailVM {
  id: number;
  documentId: string;
  templateKey: string;
  to: string;
  subject: string;
  status: EmailQueueStatus;
  scheduledFor: string | null;
  processedAt: string | null;
  error: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface QueueStatsVM {
  queued: number;
  scheduled: number;
  sent: number;
  failed: number;
  cancelled: number;
  total: number;
}

export function toScheduledEmailVM(doc: ScheduledEmailDocument): ScheduledEmailVM {
  return {
    id: doc.id,
    documentId: doc.documentId,
    templateKey: doc.templateKey,
    to: doc.to,
    subject: doc.subject,
    status: doc.status,
    scheduledFor: doc.scheduledFor ?? null,
    processedAt: doc.processedAt ?? null,
    error: doc.error ?? null,
    metadata: (doc.metadata as Record<string, unknown>) ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export function toQueueStatsVM(emails: ScheduledEmailVM[]): QueueStatsVM {
  return {
    queued: emails.filter((e) => e.status === "queued").length,
    scheduled: emails.filter((e) => e.status === "scheduled").length,
    sent: emails.filter((e) => e.status === "sent").length,
    failed: emails.filter((e) => e.status === "failed").length,
    cancelled: emails.filter((e) => e.status === "cancelled").length,
    total: emails.length,
  };
}
