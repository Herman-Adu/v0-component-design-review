import { z } from "zod";

/**
 * Google Platform Schema
 *
 * Validates the platform-page Strapi response for platform=google.
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
  items: z.array(z.string()).default([]),
});

const ToolItemSchema = z.object({
  itemId: z.string().min(1),
  href: z.string().min(1),
  icon: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  badge: z.string().optional(),
  status: z.string().optional().default("Available"),
});

// ─── Root document schema ─────────────────────────────────────────────────────

export const GooglePlatformDocumentSchema = z.object({
  platform: z.literal("google"),
  header: SectionHeaderSchema.nullish(),
  introTitle: z.string().optional(),
  introText: z.string().optional(),
  ecosystemPhases: z.array(EcosystemPhaseSchema).default([]),
  tools: z.array(ToolItemSchema).default([]),
});

export type GooglePlatformDocument = z.infer<typeof GooglePlatformDocumentSchema>;
export type GoogleEcosystemPhase = z.infer<typeof EcosystemPhaseSchema>;
export type GoogleToolItem = z.infer<typeof ToolItemSchema>;
