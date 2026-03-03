/**
 * Strategic Overview Content API
 *
 * Public facade for strategic overview content access.
 * Re-exports content builder functions for use in pages and components.
 *
 * This follows the pattern from content-library: article-content.ts
 */

export {
  getStrategicOverviewList,
  getStrategicOverviewDocument,
  getAllStrategicOverviewSlugs,
  getStrategicOverviewByAudience,
} from "./strategic-overview-content-builder";

export type {
  StrategicOverviewDocument,
  StrategicOverviewBlock,
  StrategicOverviewMeta,
  StrategicOverviewTocItem,
  StrategicOverviewCategory,
} from "./strategic-overview-schema";

