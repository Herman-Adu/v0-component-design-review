import "server-only";

import { loadTwitterPlatform } from "./twitter-platform-content-builder";
import { toTwitterPlatformVM, type TwitterPlatformVM } from "./twitter-platform-view-models";

/**
 * Twitter Platform Repository
 *
 * Server-only query layer. Calls the content builder and applies view model
 * transforms.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getTwitterPlatform(): Promise<TwitterPlatformVM | null> {
  const doc = await loadTwitterPlatform();
  if (!doc) return null;
  return toTwitterPlatformVM(doc);
}
