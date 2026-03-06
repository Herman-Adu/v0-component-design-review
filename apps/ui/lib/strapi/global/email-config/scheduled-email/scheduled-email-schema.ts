import { z } from "zod";

/**
 * Scheduled Email Schema
 *
 * Validates the scheduled-email Collection Type response from Strapi.
 * Collection Type — endpoint: GET /api/scheduled-emails
 * Represents a persistent email queue entry.
 *
 * metadata: Strapi JSON field (returns native object).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export const ScheduledEmailDocumentSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  templateKey: z.string().min(1),
  to: z.string().email(),
  subject: z.string().min(1),
  htmlContent: z.string().nullish(),
  status: z.enum(["queued", "scheduled", "sent", "failed", "cancelled"]).default("queued"),
  scheduledFor: z.string().nullish(),
  processedAt: z.string().nullish(),
  error: z.string().nullish(),
  metadata: z.record(z.unknown()).nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ScheduledEmailDocument = z.infer<typeof ScheduledEmailDocumentSchema>;
