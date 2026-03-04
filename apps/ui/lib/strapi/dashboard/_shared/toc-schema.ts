import { z } from "zod";

/**
 * Shared Table of Contents Item Schema
 * Eliminates duplication across all 8 schema files.
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */
export const TocItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9\-]+$/),
  title: z.string().min(1),
  level: z.number().int().min(1).max(6),
});

export type TocItem = z.infer<typeof TocItemSchema>;
