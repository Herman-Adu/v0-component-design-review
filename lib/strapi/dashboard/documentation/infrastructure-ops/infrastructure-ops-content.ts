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
  InfrastructureOpsBlock,
  InfrastructureOpsMeta,
  InfrastructureOpsTocItem,
  InfrastructureOpsCategory,
} from "./infrastructure-ops-schema";

