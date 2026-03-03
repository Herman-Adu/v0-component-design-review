import { z } from "zod";
import {
  BLOCK_TYPE_ALIASES,
  atomicLevelSchema,
} from "../../_shared/block-schema";

const CASE_STUDY_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const CASE_STUDY_CATEGORIES = [
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

const tocItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  level: z.number().int().positive(),
});

/**
 * Case Study Block Schema
 * Uses shared BLOCK_TYPE_ALIASES and atomicLevelSchema for consistency,
 * but allows permissive prop validation for custom data structures
 */
const blockSchema = z.object({
  type: z.enum(BLOCK_TYPE_ALIASES),
  atomicLevel: atomicLevelSchema,
  props: z.record(z.unknown()).optional(),
});

export const caseStudyContentDocumentSchema = z.object({
  meta: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    level: z.enum(CASE_STUDY_LEVELS),
    category: z.enum(CASE_STUDY_CATEGORIES),
    readTime: z.string().min(1),
    publishedAt: z.string().min(1),
    tags: z.array(z.string()).min(1),
  }),
  layout: z.enum(["content-with-toc", "content-only"]),
  toc: z.array(tocItemSchema).optional(),
  blocks: z.array(blockSchema).min(1),
});
