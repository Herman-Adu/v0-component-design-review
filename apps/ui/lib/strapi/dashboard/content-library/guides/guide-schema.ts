import { z } from "zod";
import { blockSchema } from "../../_shared/block-schema";
import { ContentMetaSchema } from "../../_shared/content-meta-schema";
import { TocItemSchema } from "../../_shared/toc-schema";

/**
 * Guide Content Schema
 *
 * Defines the structure and validation for guide documents.
 * Uses atomic-format blocks (atom/molecule/organism) for consistency
 * across all content types.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 * Shared schemas: _shared/block-schema.ts, _shared/toc-schema.ts, _shared/content-meta-schema.ts
 */

export const GUIDE_LEVELS = ["intermediate", "advanced"] as const;
export const GUIDE_CATEGORIES = ["security", "devops", "testing"] as const;

const GuideMetaSchema = ContentMetaSchema.extend({
  level: z.enum(GUIDE_LEVELS),
  category: z.enum(GUIDE_CATEGORIES),
  readTime: z.string().min(1),
});

export const GuideContentDocumentSchema = z.object({
  meta: GuideMetaSchema,
  layout: z.enum(["content-with-toc", "content-only"]),
  toc: z.array(TocItemSchema).optional(),
  blocks: z.array(blockSchema).min(1),
});

export const GuidesCollectionSchema = z.array(GuideContentDocumentSchema);

export type GuideContentDocument = z.infer<typeof GuideContentDocumentSchema>;
export type GuideContentMeta = z.infer<typeof GuideMetaSchema>;
export type GuideContentBlock = z.infer<typeof blockSchema>;
export type GuideContentTocItem = z.infer<typeof TocItemSchema>;
export type GuideLevel = (typeof GUIDE_LEVELS)[number];
export type GuideCategory = (typeof GUIDE_CATEGORIES)[number];
