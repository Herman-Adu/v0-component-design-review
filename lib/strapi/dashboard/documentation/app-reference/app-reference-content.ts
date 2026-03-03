/**
 * App Reference Content API
 *
 * Public facade for app reference content access.
 * Re-exports content builder functions for use in pages and components.
 */

export {
  getAppReferenceList,
  getAppReferenceDocument,
  getAllAppReferenceSlugs,
  getAppReferenceByAudience,
} from "./app-reference-content-builder";

export type {
  AppReferenceDocument,
  AppReferenceBlock,
  AppReferenceMeta,
  AppReferenceTocItem,
  AppReferenceCategory,
} from "./app-reference-schema";

