import { z } from "zod";
import { blockSchema } from "../../_shared/block-schema";
import { ContentMetaSchema } from "../../_shared/content-meta-schema";
import { TocItemSchema } from "../../_shared/toc-schema";

/**
 * Tutorial Content Schema
 *
 * Defines the structure and validation for tutorial documents.
 * Uses atomic-format blocks (atom/molecule/organism) for consistency
 * across all content types.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 * Shared schemas: _shared/block-schema.ts, _shared/toc-schema.ts, _shared/content-meta-schema.ts
 */

export const TUTORIAL_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export const TUTORIAL_CATEGORIES = [
  "components",
  "forms",
  "security",
  "state-management",
  "performance",
  "getting-started",
  "cms",
  "testing",
  "devops",
  "email",
] as const;

const TutorialMetaSchema = ContentMetaSchema.extend({
  level: z.enum(TUTORIAL_LEVELS),
  category: z.enum(TUTORIAL_CATEGORIES),
  readTime: z.string().min(1),
});

export const TutorialContentDocumentSchema = z.object({
  meta: TutorialMetaSchema,
  layout: z.enum(["content-with-toc", "content-only"]),
  toc: z.array(TocItemSchema).optional(),
  blocks: z.array(blockSchema).min(1),
});

export type TutorialContentDocument = z.infer<typeof TutorialContentDocumentSchema>;
export type TutorialContentMeta = z.infer<typeof TutorialMetaSchema>;
export type TutorialContentBlock = z.infer<typeof blockSchema>;
export type TutorialContentTocItem = z.infer<typeof TocItemSchema>;
export type TutorialLevel = (typeof TUTORIAL_LEVELS)[number];
export type TutorialCategory = (typeof TUTORIAL_CATEGORIES)[number];
