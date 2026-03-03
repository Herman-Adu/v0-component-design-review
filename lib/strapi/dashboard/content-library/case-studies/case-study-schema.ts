import { z } from "zod";
import { blockSchema } from "../../_shared/block-schema";
import { ContentMetaSchema } from "../../_shared/content-meta-schema";
import { TocItemSchema } from "../../_shared/toc-schema";

/**
 * Case Study Content Schema
 *
 * Defines the structure and validation for case study documents.
 * Uses atomic-format blocks (atom/molecule/organism) for consistency
 * across all content types.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 * Shared schemas: _shared/block-schema.ts, _shared/toc-schema.ts, _shared/content-meta-schema.ts
 */

export const CASE_STUDY_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export const CASE_STUDY_CATEGORIES = [
  "refactoring",
  "performance",
  "security",
  "architecture",
  "business",
  "cms",
  "infrastructure",
  "rendering",
  "forms",
] as const;

const CaseStudyMetaSchema = ContentMetaSchema.extend({
  level: z.enum(CASE_STUDY_LEVELS),
  category: z.enum(CASE_STUDY_CATEGORIES),
  readTime: z.string().min(1),
});

export const CaseStudyContentDocumentSchema = z.object({
  meta: CaseStudyMetaSchema,
  layout: z.enum(["content-with-toc", "content-only"]),
  toc: z.array(TocItemSchema).optional(),
  blocks: z.array(blockSchema).min(1),
});

export type CaseStudyContentDocument = z.infer<typeof CaseStudyContentDocumentSchema>;
export type CaseStudyContentMeta = z.infer<typeof CaseStudyMetaSchema>;
export type CaseStudyContentBlock = z.infer<typeof blockSchema>;
export type CaseStudyContentTocItem = z.infer<typeof TocItemSchema>;
export type CaseStudyLevel = (typeof CASE_STUDY_LEVELS)[number];
export type CaseStudyCategory = (typeof CASE_STUDY_CATEGORIES)[number];
