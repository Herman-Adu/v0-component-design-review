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
  Block,
  Meta,
  TocItem,
} from "./app-reference-schema";

export {
  toAppReferenceDetailViewModel,
  toAppReferenceListItemViewModel,
} from "./app-reference-view-models";

export type {
  AppReferenceDetailViewModel,
  AppReferenceListItemViewModel,
} from "./app-reference-view-models";
