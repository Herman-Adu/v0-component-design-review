import { z } from "zod";

/**
 * Admin Overview Schema
 *
 * Validates the management-page Strapi response for section=admin.
 * Management pages use flat structured components (not dynamic-zone blocks).
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

const NoticeBlockSchema = z.object({
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  noticeType: z.enum(["warning", "info", "success", "error"]).default("info"),
});

const QuickStatSchema = z.object({
  statId: z.string().min(1),
  label: z.string().min(1),
  value: z.string().optional(),
  description: z.string().optional(),
  source: z.string().optional(),
});

const ToolItemSchema = z.object({
  itemId: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.string().optional().default("Available"),
  badge: z.string().optional(),
  badgeColor: z.string().optional(),
});

const ToolSectionSchema = z.object({
  sectionId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  tools: z.array(ToolItemSchema).default([]),
});

const UpcomingFeatureSchema = z.object({
  featureId: z.string().min(1),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  status: z.string().optional().default("Coming Soon"),
});

const CtaBlockSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  linkText: z.string().min(1),
  linkHref: z.string().min(1),
  linkIcon: z.string().optional().default("ArrowRight"),
});

// ─── Root document schema ─────────────────────────────────────────────────────

export const AdminOverviewDocumentSchema = z.object({
  section: z.literal("admin"),
  header: SectionHeaderSchema,
  notice: NoticeBlockSchema.optional().nullable(),
  quickStats: z.array(QuickStatSchema).default([]),
  toolSections: z.array(ToolSectionSchema).default([]),
  upcomingTitle: z.string().optional(),
  upcomingDescription: z.string().optional(),
  upcomingFeatures: z.array(UpcomingFeatureSchema).default([]),
  cta: CtaBlockSchema.optional().nullable(),
});

export type AdminOverviewDocument = z.infer<typeof AdminOverviewDocumentSchema>;
export type AdminOverviewToolItem = z.infer<typeof ToolItemSchema>;
export type AdminOverviewToolSection = z.infer<typeof ToolSectionSchema>;
export type AdminOverviewQuickStat = z.infer<typeof QuickStatSchema>;
export type AdminOverviewUpcomingFeature = z.infer<typeof UpcomingFeatureSchema>;
