import "server-only";

import { loadCompanySettings } from "./company-settings-content-builder";
import { toCompanySettingsVM, type CompanySettingsVM } from "./company-settings-view-models";

/**
 * Company Settings Repository
 *
 * Server-only query layer. Calls the content builder and applies view model transforms.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getCompanySettings(): Promise<CompanySettingsVM | null> {
  const doc = await loadCompanySettings();
  if (!doc) return null;
  return toCompanySettingsVM(doc);
}
