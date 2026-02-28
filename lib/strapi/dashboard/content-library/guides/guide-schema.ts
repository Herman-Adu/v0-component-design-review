import { z } from "zod";

/**
 * Guide Block Schema
 * Represents a content block within a guide (matches article/tutorial block structure)
 */
const atomicLevelSchema = z.enum(["atom", "molecule", "organism"]);

const guideBlockSchema = z.object({
  type: z.string().min(1),
  atomicLevel: atomicLevelSchema,
  props: z.record(z.unknown()),
});

const tocItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  level: z.number().int().positive(),
});

/**
 * Guide Schema
 * Represents a complete operational guide with block-based content
 */
export const guideSchema = z.object({
  meta: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    level: z.enum(["intermediate", "advanced"]),
    category: z.enum(["security", "devops", "testing"]),
    readTime: z.string().min(1),
    publishedAt: z.string().min(1),
    tags: z.array(z.string()).min(1),
  }),
  layout: z.union([z.literal("content-with-toc"), z.literal("content-only")]),
  toc: z.array(tocItemSchema).optional(),
  blocks: z.array(guideBlockSchema).min(1),
});

export type Guide = z.infer<typeof guideSchema>;

/**
 * Guides Collection Schema
 * Used for type-safe validation of guide JSON files
 */
export const guidesCollectionSchema = z.array(guideSchema);
