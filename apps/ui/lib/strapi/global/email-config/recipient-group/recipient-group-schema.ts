import { z } from "zod";

/**
 * Recipient Group Schema
 *
 * Validates the recipient-group Collection Type response from Strapi.
 * Collection Type — endpoint: GET /api/recipient-groups?populate[members]=*
 *
 * emailStaff is a repeatable Strapi component embedded under `members`.
 * templateTypes is a Strapi JSON field (returns native array, not a string).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export const EmailStaffSchema = z.object({
  id: z.number(),
  name: z.string().min(1),
  email: z.string().email(),
  role: z.string().min(1),
  isActive: z.boolean().default(true),
});

export const RecipientGroupDocumentSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  name: z.string().min(1),
  description: z.string().nullish(),
  templateTypes: z.array(z.enum(["service", "contact", "quotation"])).default([]),
  urgencyFilter: z
    .enum(["all", "emergency-only", "urgent-and-emergency", "routine-only"])
    .default("all"),
  isActive: z.boolean().default(true),
  members: z.array(EmailStaffSchema).default([]),
});

export type EmailStaffDocument = z.infer<typeof EmailStaffSchema>;
export type RecipientGroupDocument = z.infer<typeof RecipientGroupDocumentSchema>;
