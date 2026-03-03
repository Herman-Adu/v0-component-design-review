/**
 * Guide Content API
 *
 * Public facade for guide content access.
 * Functions and aggregate type from builder; schema types from schema (SSOT).
 */

// Functions and aggregate list-item type (computed with id)
export {
  getGuideList,
  getGuideContentDocument,
  getAllGuideContentSlugs,
  type Guide,
} from "./guide-content-builder";

// Schema types — imported directly from schema (not via builder)
export type {
  GuideLevel,
  GuideCategory,
  GuideContentBlock,
  GuideContentMeta,
  GuideContentDocument,
} from "./guide-schema";
