import { z } from "zod";

/**
 * Email Settings Schema
 *
 * Validates the email-setting Single Type response from Strapi.
 * Single Type — endpoint: GET /api/email-setting (flat object, no data[])
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export const EmailSettingsDocumentSchema = z.object({
  fromEmail: z.string().email(),
  contactFromEmail: z.string().email().optional().nullable(),
  quotationFromEmail: z.string().email().optional().nullable(),
  replyToEmail: z.string().email().optional().nullable(),
  slaResponseHours: z.number().int().positive().default(24),
  slaUrgentHours: z.number().int().positive().default(4),
  footerDisclaimer: z.string().optional().nullable(),
  emailSignatureTemplate: z.string().optional().nullable(),
  urgencyColorsJson: z.string().optional().nullable(),
  slaJson: z.string().optional().nullable(),
});

export type EmailSettingsDocument = z.infer<typeof EmailSettingsDocumentSchema>;
