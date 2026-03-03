import { z } from "zod";
import {
  BLOCK_TYPE_ALIASES,
  atomicLevelSchema,
} from "../../_shared/block-schema";

const tocItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  level: z.number().int().positive(),
});

/**
 * Guide Block Schema
 * Uses shared BLOCK_TYPE_ALIASES and atomicLevelSchema for consistency,
 * but allows permissive prop validation for flexible data structures
 */
const blockSchema = z.object({
  type: z.enum(BLOCK_TYPE_ALIASES),
  atomicLevel: atomicLevelSchema,
  props: z.record(z.unknown()).optional(),
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
  blocks: z.array(blockSchema).min(1),
});

export type Guide = z.infer<typeof guideSchema>;

/**
 * Guides Collection Schema
 * Used for type-safe validation of guide JSON files
 */
export const guidesCollectionSchema = z.array(guideSchema);
