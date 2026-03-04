import { z } from "zod";

/**
 * Unified Content Meta Schema
 *
 * Single source of truth for meta fields across all 8 content types.
 * Content-library and documentation both import from here.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */
export const ContentMetaSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.string().min(1),
  // Content-library specific (optional for documentation)
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  readTime: z.string().optional(),
  // Documentation specific (optional for content-library)
  audience: z.string().optional(),
  lastUpdated: z.string().optional(),
  // Common fields
  publishedAt: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
});

export type ContentMeta = z.infer<typeof ContentMetaSchema>;
