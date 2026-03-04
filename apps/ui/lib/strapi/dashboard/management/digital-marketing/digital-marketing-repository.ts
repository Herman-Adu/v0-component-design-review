import "server-only";

import { loadDigitalMarketing } from "./digital-marketing-content-builder";
import { toDigitalMarketingVM, type DigitalMarketingVM } from "./digital-marketing-view-models";

/**
 * Digital Marketing Repository
 *
 * Server-only query layer. Calls the content builder and applies view model
 * transforms.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getDigitalMarketing(): Promise<DigitalMarketingVM | null> {
  const doc = await loadDigitalMarketing();
  if (!doc) return null;
  return toDigitalMarketingVM(doc);
}
