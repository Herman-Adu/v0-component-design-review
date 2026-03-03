import { z } from "zod";
import { blockSchema, BLOCK_TYPE_ALIASES } from "../../_shared/block-schema";

const ARTICLE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const ARTICLE_CATEGORIES = [
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

const tocItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  level: z.number().int().positive(),
});

export const articleContentDocumentSchema = z.object({
  meta: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    level: z.enum(ARTICLE_LEVELS),
    category: z.enum(ARTICLE_CATEGORIES),
    readTime: z.string().min(1),
    publishedAt: z.string().min(1),
    tags: z.array(z.string().min(1)).min(1),
  }),
  layout: z.enum(["content-with-toc", "content-only"]),
  toc: z.array(tocItemSchema).optional(),
  blocks: z.array(blockSchema).min(1),
});

export type ArticleContentDocumentInput = z.infer<
  typeof articleContentDocumentSchema
>;

export const allowedBlockTypes = BLOCK_TYPE_ALIASES;
