import { z } from "zod";

/**
 * Document Health Schema
 *
 * Validates the management-page Strapi response for section=document-health.
 * Uses flat structured components (not dynamic-zone blocks).
 * Icon fields are Lucide icon names (strings) — resolved to LucideIcon in the page.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

// ─── Component schemas ────────────────────────────────────────────────────────

const SectionHeaderSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const PageSectionSchema = z.object({
  sectionId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  href: z.string().min(1),
  role: z.string().nullish(),
  pages: z.number().int().nullish(),
  color: z
    .enum(["emerald", "violet", "amber", "blue", "red", "green", "indigo", "orange", "pink", "slate"])
    .default("slate"),
});

const HighlightItemSchema = z.object({
  itemId: z.string().min(1),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const QuickLinkSchema = z.object({
  linkId: z.string().min(1),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  href: z.string().min(1),
});

// ─── Root document schema ─────────────────────────────────────────────────────

export const DocumentHealthDocumentSchema = z.object({
  section: z.literal("document-health"),
  header: SectionHeaderSchema.nullish(),
  pageSections: z.array(PageSectionSchema).default([]),
  highlights: z.array(HighlightItemSchema).default([]),
  quickLinks: z.array(QuickLinkSchema).default([]),
});

export type DocumentHealthDocument = z.infer<typeof DocumentHealthDocumentSchema>;
export type DocumentHealthPageSection = z.infer<typeof PageSectionSchema>;
export type DocumentHealthHighlightItem = z.infer<typeof HighlightItemSchema>;
export type DocumentHealthQuickLink = z.infer<typeof QuickLinkSchema>;
