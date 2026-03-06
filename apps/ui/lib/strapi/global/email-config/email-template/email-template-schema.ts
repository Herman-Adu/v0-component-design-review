import { z } from "zod";

/**
 * Email Template Schema
 *
 * Validates the email-template Collection Type response from Strapi.
 * Collection Type — endpoint: GET /api/email-templates
 * One document = one canonical email template definition.
 *
 * SSOT for templateKey used across:
 *   - ab-subject-variant (templateKey, templateLabel)
 *   - recipient-group (templateTypes filter)
 *   - scheduled-email (templateKey)
 *   - UI derive helpers (category, recipientType)
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export const EmailTemplateCategorySchema = z.enum(["service", "contact", "quotation"]);
export const EmailTemplateRecipientTypeSchema = z.enum(["customer", "business"]);

export const EmailTemplateDocumentSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  templateKey: z.string().min(1),
  templateLabel: z.string().min(1),
  category: EmailTemplateCategorySchema,
  recipientType: EmailTemplateRecipientTypeSchema,
  description: z.string().nullish(),
  isActive: z.boolean().default(true),
  fromName: z.string().nullish(),
  fromEmail: z.string().email().nullish(),
  replyTo: z.string().email().nullish(),
});

export type EmailTemplateDocument = z.infer<typeof EmailTemplateDocumentSchema>;
export type EmailTemplateCategory = z.infer<typeof EmailTemplateCategorySchema>;
export type EmailTemplateRecipientType = z.infer<typeof EmailTemplateRecipientTypeSchema>;
