import { z } from "zod";

/**
 * Email Management Schema
 *
 * Validates the management-page Strapi response for section=email-management.
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

export const EmailManagementDocumentSchema = z.object({
  section: z.literal("email-management"),
  header: SectionHeaderSchema.nullish(),
  pageSections: z.array(PageSectionSchema).default([]),
  highlights: z.array(HighlightItemSchema).default([]),
  quickLinks: z.array(QuickLinkSchema).default([]),
});

export type EmailManagementDocument = z.infer<typeof EmailManagementDocumentSchema>;
export type EmailManagementPageSection = z.infer<typeof PageSectionSchema>;
export type EmailManagementHighlightItem = z.infer<typeof HighlightItemSchema>;
export type EmailManagementQuickLink = z.infer<typeof QuickLinkSchema>;
