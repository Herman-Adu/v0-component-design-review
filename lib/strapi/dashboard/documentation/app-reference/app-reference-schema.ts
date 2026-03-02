import { z } from "zod";

/**
 * App Reference Documentation Schema
 *
 * Defines the structure for app/frontend documentation pages
 * using coarse-grained, section-level blocks for maintainability.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 * Pattern: Follows content-library article-schema.ts structure
 */

// ============================================================================
// Block Schemas (Coarse-Grained, Section-Level)
// ============================================================================

const ParagraphBlockSchema = z.object({
  type: z.literal("block.paragraph"),
  content: z.string().min(1),
  className: z.string().optional(),
});

const SectionHeaderBlockSchema = z.object({
  type: z.literal("block.sectionHeader"),
  id: z.string().regex(/^[a-z0-9\-]+$/),
  title: z.string().min(1),
  number: z.string().optional(),
});

const ListBlockSchema = z.object({
  type: z.literal("block.list"),
  ordered: z.boolean(),
  items: z.array(z.string().min(1)),
});

const CalloutBlockSchema = z.object({
  type: z.literal("block.callout"),
  calloutType: z.enum(["info", "warning", "success", "error"]),
  title: z.string().min(1),
  content: z.string().min(1),
});

const CodeBlockSchema = z.object({
  type: z.literal("block.codeBlock"),
  language: z.string(),
  code: z.string().min(1),
  title: z.string().optional(),
  showLineNumbers: z.boolean().optional(),
});

const FeatureGridBlockSchema = z.object({
  type: z.literal("block.featureGrid"),
  title: z.string().optional(),
  features: z.array(
    z.object({
      icon: z.string(),
      title: z.string().min(1),
      description: z.string().min(1),
    }),
  ),
});

const StatsTableBlockSchema = z.object({
  type: z.literal("block.statsTable"),
  title: z.string().optional(),
  stats: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
      change: z.string().optional(),
      changeType: z.enum(["positive", "negative", "neutral"]).optional(),
    }),
  ),
});

const CardBlockSchema = z.object({
  type: z.literal("block.card"),
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().min(1),
  variant: z.enum(["default", "accent", "muted"]).optional(),
});

const CollapsibleBlockSchema = z.object({
  type: z.literal("block.collapsible"),
  title: z.string().min(1),
  defaultOpen: z.boolean().optional(),
  content: z.string().min(1),
});

const LinkCardBlockSchema = z.object({
  type: z.literal("block.linkCard"),
  href: z.string().url(),
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  external: z.boolean().optional(),
});

const BlockSchema = z.discriminatedUnion("type", [
  ParagraphBlockSchema,
  SectionHeaderBlockSchema,
  ListBlockSchema,
  CalloutBlockSchema,
  CodeBlockSchema,
  FeatureGridBlockSchema,
  StatsTableBlockSchema,
  CardBlockSchema,
  CollapsibleBlockSchema,
  LinkCardBlockSchema,
]);

// ============================================================================
// Document Schema
// ============================================================================

const MetaSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9\-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  category: z.literal("app-reference"),
  audience: z.string().min(1, "Audience is required"),
  publishedAt: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  lastUpdated: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  tags: z.array(z.string().min(1)).min(1, "At least one tag is required"),
});

const SeoSchema = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  canonicalUrl: z.string().url().optional(),
});

const TocItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9\-]+$/),
  title: z.string().min(1),
  level: z.number().min(1).max(6),
});

export const AppReferenceDocumentSchema = z.object({
  meta: MetaSchema,
  blocks: z.array(BlockSchema).min(1, "At least one block is required"),
  seo: SeoSchema.optional(),
  toc: z.array(TocItemSchema).optional(),
});

export type AppReferenceDocument = z.infer<typeof AppReferenceDocumentSchema>;
export type Block = z.infer<typeof BlockSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type TocItem = z.infer<typeof TocItemSchema>;
