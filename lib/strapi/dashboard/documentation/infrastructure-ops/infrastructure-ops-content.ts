/**
 * Infrastructure & Ops Content API
 *
 * Public facade for infrastructure ops content access.
 * Re-exports content builder functions for use in pages and components.
 */

export {
  getInfrastructureOpsList,
  getInfrastructureOpsDocument,
  getAllInfrastructureOpsSlugs,
  getInfrastructureOpsByAudience,
} from "./infrastructure-ops-content-builder";

export type {
  InfrastructureOpsDocument,
  Block,
  Meta,
  TocItem,
} from "./infrastructure-ops-schema";

export {
  toInfrastructureOpsDetailViewModel,
  toInfrastructureOpsListItemViewModel,
} from "./infrastructure-ops-view-models";

export type {
  InfrastructureOpsDetailViewModel,
  InfrastructureOpsListItemViewModel,
} from "./infrastructure-ops-view-models";
