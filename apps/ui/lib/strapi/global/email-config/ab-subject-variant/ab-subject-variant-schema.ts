import { z } from "zod";

/**
 * A/B Subject Variant Schema
 *
 * Validates the ab-subject-variant Collection Type response from Strapi.
 * Collection Type — endpoint: GET /api/ab-subject-variants
 * One document = one subject line variant for a given email template.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export const ABSubjectVariantDocumentSchema = z.object({
  id: z.number(),
  documentId: z.string(),
  templateKey: z.string().min(1),
  templateLabel: z.string().min(1),
  pattern: z.string().min(1),
  description: z.string().nullish(),
  weight: z.number().int().min(0).max(100).default(50),
  sends: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
  abEnabled: z.boolean().default(false),
});

export type ABSubjectVariantDocument = z.infer<typeof ABSubjectVariantDocumentSchema>;
