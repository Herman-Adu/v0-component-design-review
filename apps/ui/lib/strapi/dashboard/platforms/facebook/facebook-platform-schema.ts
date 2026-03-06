import { z } from "zod";

/**
 * Facebook Platform Schema
 *
 * Validates the platform-page Strapi response for platform=facebook.
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

export const FacebookPlatformDocumentSchema = z.object({
  platform: z.literal("facebook"),
  header: SectionHeaderSchema.nullish(),
  introTitle: z.string().nullish(),
  introText: z.string().nullish(),
  ecosystemPhases: z.array(EcosystemPhaseSchema).default([]),
  tools: z.array(ToolItemSchema).default([]),
});

export type FacebookPlatformDocument = z.infer<typeof FacebookPlatformDocumentSchema>;
export type FacebookEcosystemPhase = z.infer<typeof EcosystemPhaseSchema>;
export type FacebookToolItem = z.infer<typeof ToolItemSchema>;
