/**
 * CMS Reference Documentation Schema
 *
 * Defines the structure for CMS-focused documentation pages.
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

const CmsReferenceMetaSchema = DocumentationMetaBaseSchema.extend({
  category: z.literal("cms-reference"),
});

// ============================================================================
// Document Schema
// ============================================================================

export const CmsReferenceDocumentSchema = z.object({
  meta: CmsReferenceMetaSchema,
  blocks: z.array(blockSchema).min(1, "At least one block is required"),
  seo: SeoSchema.optional(),
  toc: z.array(TocItemSchema).optional(),
});

// ============================================================================
// TypeScript Types (Inferred from Zod schemas)
// ============================================================================

export type CmsReferenceDocument = z.infer<typeof CmsReferenceDocumentSchema>;
export type CmsReferenceMeta = z.infer<typeof CmsReferenceMetaSchema>;
export type CmsReferenceBlock = z.infer<typeof blockSchema>;
export type CmsReferenceTocItem = z.infer<typeof TocItemSchema>;
export type CmsReferenceCategory = "cms-reference";
