import { z } from "zod";

/**
 * Digital Marketing Schema
 *
 * Validates the management-page Strapi response for section=digital-marketing.
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
});

const QuickLinkSchema = z.object({
  linkId: z.string().min(1),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  href: z.string().min(1),
});

const PlatformPageItemSchema = z.object({
  itemLabel: z.string().min(1),
  icon: z.string().min(1),
});

const PlatformCardSchema = z.object({
  platformId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  href: z.string().min(1),
  status: z.enum(["Active", "Coming Soon", "Beta"]).default("Coming Soon"),
  badge: z.string().optional(),
  badgeColor: z.string().optional(),
  iconColor: z.string().optional(),
  pageItems: z.array(PlatformPageItemSchema).default([]),
});

// ─── Root document schema ─────────────────────────────────────────────────────

export const DigitalMarketingDocumentSchema = z.object({
  section: z.literal("digital-marketing"),
  header: SectionHeaderSchema,
  notice: NoticeBlockSchema.optional().nullable(),
  quickStats: z.array(QuickStatSchema).default([]),
  quickLinks: z.array(QuickLinkSchema).default([]),
  platforms: z.array(PlatformCardSchema).default([]),
});

export type DigitalMarketingDocument = z.infer<typeof DigitalMarketingDocumentSchema>;
export type DigitalMarketingPlatformCard = z.infer<typeof PlatformCardSchema>;
export type DigitalMarketingPlatformPageItem = z.infer<typeof PlatformPageItemSchema>;
export type DigitalMarketingQuickStat = z.infer<typeof QuickStatSchema>;
