import "server-only";

import { loadAdminOverview } from "./admin-overview-content-builder";
import { toAdminOverviewVM, type AdminOverviewVM } from "./admin-overview-view-models";

/**
 * Admin Overview Repository
 *
 * Server-only query layer. Calls the content builder and applies view model
 * transforms. Accepts optional dynamic counts for content-library stats.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getAdminOverview(dynamicCounts?: {
  contentLibrary: number;
  contentDetail?: string;
}): Promise<AdminOverviewVM | null> {
  const doc = await loadAdminOverview();
  if (!doc) return null;
  return toAdminOverviewVM(doc, dynamicCounts);
}
