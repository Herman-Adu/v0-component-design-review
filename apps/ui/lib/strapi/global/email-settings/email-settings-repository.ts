import "server-only";

import { loadEmailSettings } from "./email-settings-content-builder";
import { toEmailSettingsVM, type EmailSettingsVM } from "./email-settings-view-models";

/**
 * Email Settings Repository
 *
 * Server-only query layer. Calls the content builder and applies view model transforms.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getEmailSettings(): Promise<EmailSettingsVM | null> {
  const doc = await loadEmailSettings();
  if (!doc) return null;
  return toEmailSettingsVM(doc);
}
