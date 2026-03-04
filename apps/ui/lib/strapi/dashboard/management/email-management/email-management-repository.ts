import "server-only";

import { loadEmailManagement } from "./email-management-content-builder";
import { toEmailManagementVM, type EmailManagementVM } from "./email-management-view-models";

/**
 * Email Management Repository
 *
 * Server-only query layer. Calls the content builder and applies view model
 * transforms.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getEmailManagement(): Promise<EmailManagementVM | null> {
  const doc = await loadEmailManagement();
  if (!doc) return null;
  return toEmailManagementVM(doc);
}
