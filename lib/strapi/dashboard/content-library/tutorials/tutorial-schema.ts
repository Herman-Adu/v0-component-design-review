import { z } from "zod";

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

const atomicLevelSchema = z.enum(["atom", "molecule", "organism"]);

// Simplified block schema - allows any type/atomicLevel/props combination
const tutorialBlockSchema = z.object({
  type: z.string().min(1),
  atomicLevel: atomicLevelSchema,
  props: z.record(z.unknown()),
});

const tocItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  level: z.number().int().positive(),
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
  blocks: z.array(tutorialBlockSchema).min(1),
});
