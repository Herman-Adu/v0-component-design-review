import "server-only";

import { loadLinkedInPlatform } from "./linkedin-platform-content-builder";
import { toLinkedInPlatformVM, type LinkedInPlatformVM } from "./linkedin-platform-view-models";

/**
 * LinkedIn Platform Repository
 *
 * Server-only query layer. Calls the content builder and applies view model
 * transforms.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getLinkedInPlatform(): Promise<LinkedInPlatformVM | null> {
  const doc = await loadLinkedInPlatform();
  if (!doc) return null;
  return toLinkedInPlatformVM(doc);
}
