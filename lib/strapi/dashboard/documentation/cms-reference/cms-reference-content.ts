/**
 * CMS Reference Content API
 *
 * Public facade for CMS reference content access.
 * Re-exports content builder functions for use in pages and components.
 */

export {
  getCmsReferenceList,
  getCmsReferenceDocument,
  getAllCmsReferenceSlugs,
  getCmsReferenceByAudience,
} from "./cms-reference-content-builder";

export type {
  CmsReferenceDocument,
  CmsReferenceBlock,
  CmsReferenceMeta,
  CmsReferenceTocItem,
  CmsReferenceCategory,
} from "./cms-reference-schema";

