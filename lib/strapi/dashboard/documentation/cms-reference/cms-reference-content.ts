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
  Block,
  Meta,
  TocItem,
} from "./cms-reference-schema";

export {
  toCmsReferenceDetailViewModel,
  toCmsReferenceListItemViewModel,
} from "./cms-reference-view-models";

export type {
  CmsReferenceDetailViewModel,
  CmsReferenceListItemViewModel,
} from "./cms-reference-view-models";
