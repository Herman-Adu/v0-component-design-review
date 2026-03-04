/**
 * Shared SEO Schema
 *
 * Single source of truth for SEO metadata across all documentation types.
 * All documentation schemas import SeoSchema from here — never define inline.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md, ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import { z } from "zod";

export const SeoSchema = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  canonicalUrl: z.string().url().optional(),
  keywords: z.string().optional(),
  preventIndexing: z.boolean().optional(),
});

export type Seo = z.infer<typeof SeoSchema>;
