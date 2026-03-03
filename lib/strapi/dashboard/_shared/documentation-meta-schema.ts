/**
 * Documentation Meta Base Schema
 *
 * Single source of truth for metadata validation across all 4 documentation types.
 * Stricter than ContentMetaSchema: enforces slug format, min lengths, audience, lastUpdated,
 * and ISO date format. Each documentation schema extends this with its specific category literal.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md, ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 *
 * Usage:
 *   const StrategicOverviewMetaSchema = DocumentationMetaBaseSchema.extend({
 *     category: z.literal("strategic-overview"),
 *   });
 */

import { z } from "zod";

const dateSchema = z
  .string()
  .datetime({ offset: true })
  .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/));

export const DocumentationMetaBaseSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9\-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  audience: z.string().min(1, "Audience is required"),
  publishedAt: dateSchema,
  lastUpdated: dateSchema,
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
});

export type DocumentationMetaBase = z.infer<typeof DocumentationMetaBaseSchema>;
