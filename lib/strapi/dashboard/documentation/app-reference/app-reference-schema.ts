/**
 * App Reference Documentation Schema
 *
 * Defines the structure for app/frontend documentation pages.
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

const AppReferenceMetaSchema = DocumentationMetaBaseSchema.extend({
  category: z.literal("app-reference"),
});

// ============================================================================
// Document Schema
// ============================================================================

export const AppReferenceDocumentSchema = z.object({
  meta: AppReferenceMetaSchema,
  blocks: z.array(blockSchema).min(1, "At least one block is required"),
  seo: SeoSchema.optional(),
  toc: z.array(TocItemSchema).optional(),
});

// ============================================================================
// TypeScript Types (Inferred from Zod schemas)
// ============================================================================

export type AppReferenceDocument = z.infer<typeof AppReferenceDocumentSchema>;
export type AppReferenceMeta = z.infer<typeof AppReferenceMetaSchema>;
export type AppReferenceBlock = z.infer<typeof blockSchema>;
export type AppReferenceTocItem = z.infer<typeof TocItemSchema>;
export type AppReferenceCategory = "app-reference";
