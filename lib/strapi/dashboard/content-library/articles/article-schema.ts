import { z } from "zod";
import { blockSchema, BLOCK_TYPE_ALIASES } from "../../_shared/block-schema";
import { ContentMetaSchema } from "../../_shared/content-meta-schema";
import { TocItemSchema } from "../../_shared/toc-schema";

/**
 * Article Content Schema
 *
 * Defines the structure and validation for article documents.
 * Uses atomic-format blocks (atom/molecule/organism) for consistency
 * across all content types.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 * Shared schemas: _shared/block-schema.ts, _shared/toc-schema.ts, _shared/content-meta-schema.ts
 */

export const ARTICLE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export const ARTICLE_CATEGORIES = [
  "architecture",
  "security",
  "forms",
  "performance",
  "best-practices",
  "rendering",
  "business",
  "accessibility",
  "testing",
  "devops",
  "ai-tooling",
] as const;

const ArticleMetaSchema = ContentMetaSchema.extend({
  level: z.enum(ARTICLE_LEVELS),
  category: z.enum(ARTICLE_CATEGORIES),
  readTime: z.string().min(1),
});

export const ArticleContentDocumentSchema = z.object({
  meta: ArticleMetaSchema,
  layout: z.enum(["content-with-toc", "content-only"]),
  toc: z.array(TocItemSchema).optional(),
  blocks: z.array(blockSchema).min(1),
});

export type ArticleContentDocument = z.infer<typeof ArticleContentDocumentSchema>;
export type ArticleContentMeta = z.infer<typeof ArticleMetaSchema>;
export type ArticleContentBlock = z.infer<typeof blockSchema>;
export type ArticleContentTocItem = z.infer<typeof TocItemSchema>;
export type ArticleLevel = (typeof ARTICLE_LEVELS)[number];
export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number];

export const allowedBlockTypes = BLOCK_TYPE_ALIASES;
