import "server-only";

import { loadGooglePlatform } from "./google-platform-content-builder";
import { toGooglePlatformVM, type GooglePlatformVM } from "./google-platform-view-models";

/**
 * Google Platform Repository
 *
 * Server-only query layer. Calls the content builder and applies view model
 * transforms.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getGooglePlatform(): Promise<GooglePlatformVM | null> {
  const doc = await loadGooglePlatform();
  if (!doc) return null;
  return toGooglePlatformVM(doc);
}
