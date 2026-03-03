import { z } from "zod";
import {
  BLOCK_TYPE_ALIASES,
  atomicLevelSchema,
} from "../../_shared/block-schema";

const TUTORIAL_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const TUTORIAL_CATEGORIES = [
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

const tocItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  level: z.number().int().positive(),
});

/**
 * Tutorial Block Schema
 * Uses shared BLOCK_TYPE_ALIASES and atomicLevelSchema for consistency,
 * but allows permissive prop validation for custom data structures
 */
const blockSchema = z.object({
  type: z.enum(BLOCK_TYPE_ALIASES),
  atomicLevel: atomicLevelSchema,
  props: z.record(z.unknown()),
});

export const tutorialContentDocumentSchema = z.object({
  meta: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    level: z.enum(TUTORIAL_LEVELS),
    category: z.enum(TUTORIAL_CATEGORIES),
    readTime: z.string().min(1),
    publishedAt: z.string().min(1),
    tags: z.array(z.string()).min(1),
  }),
  layout: z.union([z.literal("content-with-toc"), z.literal("content-only")]),
  toc: z.array(tocItemSchema).optional(),
  blocks: z.array(blockSchema).min(1),
});
