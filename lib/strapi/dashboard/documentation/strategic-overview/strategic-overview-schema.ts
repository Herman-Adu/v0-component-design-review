import { z } from "zod";

/**
 * Strategic Overview Documentation Schema
 *
 * Defines the structure for strategic-level documentation pages
 * using coarse-grained, section-level blocks for maintainability.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 * Pattern: Follows content-library article-schema.ts structure
 */

// ============================================================================
// Block Schemas (Coarse-Grained, Section-Level)
// ============================================================================

/**
 * Paragraph block - standard text content
 */
const ParagraphBlockSchema = z.object({
  type: z.literal("block.paragraph"),
  content: z.string().min(1),
  className: z.string().optional(),
});

/**
 * Section header block - anchored heading with optional numbering
 */
const SectionHeaderBlockSchema = z.object({
  type: z.literal("block.sectionHeader"),
  id: z.string().regex(/^[a-z0-9\-]+$/),
  title: z.string().min(1),
  number: z.string().optional(),
});

/**
 * List block - ordered or unordered list of items
 */
const ListBlockSchema = z.object({
  type: z.literal("block.list"),
  ordered: z.boolean(),
  items: z.array(z.string().min(1)),
});

/**
 * Callout block - info/warning/success/error message box
 */
const CalloutBlockSchema = z.object({
  type: z.literal("block.callout"),
  calloutType: z.enum(["info", "warning", "success", "error"]),
  title: z.string().min(1),
  content: z.string().min(1),
});

/**
 * Code block - syntax-highlighted code with optional title
 */
const CodeBlockSchema = z.object({
  type: z.literal("block.codeBlock"),
  language: z.string(),
  code: z.string().min(1),
  title: z.string().optional(),
  showLineNumbers: z.boolean().optional(),
});

/**
 * Feature grid block - grid of features/benefits with icons
 */
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

/**
 * Stats table block - statistics with optional comparison
 */
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

/**
 * Card block - content card with optional icon
 */
const CardBlockSchema = z.object({
  type: z.literal("block.card"),
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  content: z.string().min(1),
  variant: z.enum(["default", "accent", "muted"]).optional(),
});

/**
 * Collapsible block (Spoiler) - expandable content section
 */
const CollapsibleBlockSchema = z.object({
  type: z.literal("block.collapsible"),
  title: z.string().min(1),
  defaultOpen: z.boolean().optional(),
  content: z.string().min(1), // Can contain markdown
});

/**
 * Link card block - clickable card with navigation
 */
const LinkCardBlockSchema = z.object({
  type: z.literal("block.linkCard"),
  href: z.string().url(),
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  external: z.boolean().optional(),
});

// Discriminated union of all block types
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

/**
 * Meta information for strategic overview documents
 */
const MetaSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9\-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  category: z.literal("strategic-overview"),
  audience: z.string().min(1, "Audience is required"),
  publishedAt: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  lastUpdated: z
    .string()
    .datetime({ offset: true })
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)),
  tags: z.array(z.string().min(1)).min(1, "At least one tag required"),
});

/**
 * SEO metadata (optional, follows Strapi SEO plugin shape)
 */
const SeoSchema = z
  .object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    canonicalUrl: z.string().url().optional(),
    keywords: z.string().optional(),
    preventIndexing: z.boolean().optional(),
  })
  .optional();

/**
 * Table of contents item
 */
const TocItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9\-]+$/),
  title: z.string().min(1),
  level: z.number().int().min(1).max(6),
});

/**
 * Complete strategic overview document schema
 */
export const StrategicOverviewDocumentSchema = z.object({
  meta: MetaSchema,
  seo: SeoSchema,
  toc: z.array(TocItemSchema).optional(),
  blocks: z.array(BlockSchema).min(1, "At least one block required"),
});

// ============================================================================
// TypeScript Types (Inferred from Zod schemas)
// ============================================================================

export type StrategicOverviewDocument = z.infer<
  typeof StrategicOverviewDocumentSchema
>;
export type Block = z.infer<typeof BlockSchema>;
export type Meta = z.infer<typeof MetaSchema>;
export type TocItem = z.infer<typeof TocItemSchema>;

// Block type exports for discriminated union handling
export type ParagraphBlock = z.infer<typeof ParagraphBlockSchema>;
export type SectionHeaderBlock = z.infer<typeof SectionHeaderBlockSchema>;
export type ListBlock = z.infer<typeof ListBlockSchema>;
export type CalloutBlock = z.infer<typeof CalloutBlockSchema>;
export type CodeBlock = z.infer<typeof CodeBlockSchema>;
export type FeatureGridBlock = z.infer<typeof FeatureGridBlockSchema>;
export type StatsTableBlock = z.infer<typeof StatsTableBlockSchema>;
export type CardBlock = z.infer<typeof CardBlockSchema>;
export type CollapsibleBlock = z.infer<typeof CollapsibleBlockSchema>;
export type LinkCardBlock = z.infer<typeof LinkCardBlockSchema>;
