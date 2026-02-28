import { z } from "zod";

/**
 * Block Types for Strategic Documentation
 * All blocks follow a discriminated union pattern for type safety
 */

const TextBlockSchema = z.object({
  type: z.literal("text"),
  content: z.string().min(1),
});

const HeadingBlockSchema = z.object({
  type: z.literal("heading"),
  level: z.number().min(1).max(6),
  content: z.string().min(1),
  anchorId: z.string().optional(),
});

const CodeBlockSchema = z.object({
  type: z.literal("code"),
  language: z.string(),
  content: z.string().min(1),
});

const ListBlockSchema = z.object({
  type: z.literal("list"),
  ordered: z.boolean(),
  items: z.array(
    z.union([
      z.string(),
      z.object({
        title: z.string(),
        description: z.string().optional(),
      }),
    ]),
  ),
});

const TableBlockSchema = z.object({
  type: z.literal("table"),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

const CalloutBlockSchema = z.object({
  type: z.literal("callout"),
  type_name: z.enum([
    "info",
    "warning",
    "success",
    "error",
    "diagram-reference",
  ]),
  title: z.string(),
  content: z.string(),
});

const AlertBlockSchema = z.object({
  type: z.literal("alert"),
  type_name: z.enum(["info", "warning", "success", "error"]),
  title: z.string(),
  content: z.string(),
});

const QuoteBlockSchema = z.object({
  type: z.literal("quote"),
  content: z.string(),
  author: z.string().optional(),
});

export const BlockSchema = z.discriminatedUnion("type", [
  TextBlockSchema,
  HeadingBlockSchema,
  CodeBlockSchema,
  ListBlockSchema,
  TableBlockSchema,
  CalloutBlockSchema,
  AlertBlockSchema,
  QuoteBlockSchema,
]);

export type Block = z.infer<typeof BlockSchema>;

/**
 * Table of Contents Entry
 */
const TOCEntrySchema = z.object({
  level: z.number().min(1).max(6),
  title: z.string(),
  anchor: z.string(),
});

/**
 * Metadata
 */
const MetaSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  category: z.enum(["vision", "decisions", "patterns", "roadmap", "phases"]),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  publishedAt: z.string().datetime(),
  tags: z.array(z.string()).optional(),
});

/**
 * SEO
 */
const SEOSchema = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  keywords: z.string().min(1),
  canonicalUrl: z
    .string()
    .min(1)
    .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
      message:
        "canonicalUrl must be root-relative (/...) or absolute (http/https)",
    }),
  robots: z.string().optional(),
  preventIndexing: z.boolean().optional(),
});

/**
 * Route
 */
const RouteSchema = z.object({
  pattern: z.string(),
  params: z.object({
    domain: z.literal("strategic"),
    slug: z.string(),
  }),
});

/**
 * Access Control
 */
const AccessSchema = z.object({
  requiresAuth: z.boolean(),
  visibleToPublic: z.boolean(),
});

/**
 * Strategic Documentation Schema
 * The complete structure for all strategic documentation articles
 */
export const StrategicDocumentationSchema = z.object({
  meta: MetaSchema,
  seo: SEOSchema,
  route: RouteSchema,
  access: AccessSchema,
  toc: z.array(TOCEntrySchema),
  blocks: z.array(BlockSchema),
});

export type StrategicDocumentation = z.infer<
  typeof StrategicDocumentationSchema
>;
