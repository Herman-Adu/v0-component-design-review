/**
 * Strategic Overview Documentation Schema
 *
 * Defines the structure for strategic-level documentation pages.
 * Uses atomic-format blocks (atom/molecule/organism) for consistency
 * across all content types.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md, ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 * Shared schemas: _shared/block-schema.ts, _shared/toc-schema.ts,
 *                 _shared/seo-schema.ts, _shared/documentation-meta-schema.ts
 */

import { z } from "zod";
import { blockSchema } from "../../_shared/block-schema";
import { TocItemSchema } from "../../_shared/toc-schema";
import { SeoSchema } from "../../_shared/seo-schema";
import { DocumentationMetaBaseSchema } from "../../_shared/documentation-meta-schema";

// ============================================================================
// Meta Schema
// ============================================================================

const StrategicOverviewMetaSchema = DocumentationMetaBaseSchema.extend({
  category: z.literal("strategic-overview"),
});

// ============================================================================
// Document Schema
// ============================================================================

export const StrategicOverviewDocumentSchema = z.object({
  meta: StrategicOverviewMetaSchema,
  seo: SeoSchema.optional(),
  toc: z.array(TocItemSchema).optional(),
  blocks: z.array(blockSchema).min(1, "At least one block required"),
});

// ============================================================================
// TypeScript Types (Inferred from Zod schemas)
// ============================================================================

export type StrategicOverviewDocument = z.infer<
  typeof StrategicOverviewDocumentSchema
>;
export type StrategicOverviewMeta = z.infer<typeof StrategicOverviewMetaSchema>;
export type StrategicOverviewBlock = z.infer<typeof blockSchema>;
export type StrategicOverviewTocItem = z.infer<typeof TocItemSchema>;
export type StrategicOverviewCategory = "strategic-overview";
