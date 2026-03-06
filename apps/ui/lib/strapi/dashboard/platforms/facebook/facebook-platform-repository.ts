import "server-only";

import { loadFacebookPlatform } from "./facebook-platform-content-builder";
import { toFacebookPlatformVM, type FacebookPlatformVM } from "./facebook-platform-view-models";

/**
 * Facebook Platform Repository
 *
 * Server-only query layer. Calls the content builder and applies view model
 * transforms.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getFacebookPlatform(): Promise<FacebookPlatformVM | null> {
  const doc = await loadFacebookPlatform();
  if (!doc) return null;
  return toFacebookPlatformVM(doc);
}
