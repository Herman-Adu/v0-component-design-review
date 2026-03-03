import { z } from "zod";
import {
  blockSchema,
  BLOCK_TYPE_ALIASES,
  atomicLevelSchema,
} from "../../_shared/block-schema";

/**
 * CMS Reference Documentation Schema
 *
 * Defines the structure for CMS-focused documentation pages.
 * Uses atomic-format blocks (atom/molecule/organism) for consistency
 * across all content types.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 * Pattern: Consolidated with content-library schemas via shared block-schema.ts
 */

// ============================================================================
// Block Schema (Shared across all content types)
// ============================================================================
//
// CMS Reference uses the same atomic-format block schema as content-library.
// This ensures consistency in block structure and properties across all
// content in the application.
//
// See: lib/strapi/dashboard/_shared/block-schema.ts

// ============================================================================
// Document Schema
// ============================================================================

const MetaSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9\-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  category: z.literal("cms-reference"),
  audience: z.string().min(1, "Audience is required"),
  publishedAt: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  lastUpdated: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
});

const SeoSchema = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  canonicalUrl: z.string().url().optional(),
});

const TocItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9\-]+$/),
  title: z.string().min(1),
  level: z.number().min(1).max(6),
});

export const CmsReferenceDocumentSchema = z.object({
  meta: MetaSchema,
  blocks: z.array(blockSchema).min(1, "At least one block is required"),
  seo: SeoSchema.optional(),
  toc: z.array(TocItemSchema).optional(),
});

export type CmsReferenceDocument = z.infer<typeof CmsReferenceDocumentSchema>;
export type Block = z.infer<typeof blockSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type TocItem = z.infer<typeof TocItemSchema>;
