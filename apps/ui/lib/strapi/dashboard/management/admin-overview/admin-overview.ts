/**
 * Admin Overview — Public Facade
 *
 * Thin re-export of the repository and view model types.
 * Consumers import from this file only.
 */
export { getAdminOverview } from "./admin-overview-repository";
export type { AdminOverviewVM, AdminOverviewSectionVM, AdminOverviewToolVM } from "./admin-overview-view-models";
