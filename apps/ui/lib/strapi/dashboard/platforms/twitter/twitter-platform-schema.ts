import { z } from "zod";

/**
 * Twitter Platform Schema
 *
 * Validates the platform-page Strapi response for platform=twitter.
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

const EcosystemPhaseSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  items: z.preprocess((v) => v ?? [], z.array(z.string())),
});

const ToolItemSchema = z.object({
  itemId: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  badge: z.string().nullish(),
  status: z.string().nullish().transform((v) => v ?? "Available"),
});

// ─── Root document schema ─────────────────────────────────────────────────────

export const TwitterPlatformDocumentSchema = z.object({
  platform: z.literal("twitter"),
  header: SectionHeaderSchema.nullish(),
  introTitle: z.string().nullish(),
  introText: z.string().nullish(),
  ecosystemPhases: z.array(EcosystemPhaseSchema).default([]),
  tools: z.array(ToolItemSchema).default([]),
});

export type TwitterPlatformDocument = z.infer<typeof TwitterPlatformDocumentSchema>;
export type TwitterEcosystemPhase = z.infer<typeof EcosystemPhaseSchema>;
export type TwitterToolItem = z.infer<typeof ToolItemSchema>;
