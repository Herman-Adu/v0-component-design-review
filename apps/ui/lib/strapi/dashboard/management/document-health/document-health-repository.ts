import "server-only";

import { loadDocumentHealth } from "./document-health-content-builder";
import { toDocumentHealthVM, type DocumentHealthVM } from "./document-health-view-models";

/**
 * Document Health Repository
 *
 * Server-only query layer. Calls the content builder and applies view model
 * transforms.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getDocumentHealth(): Promise<DocumentHealthVM | null> {
  const doc = await loadDocumentHealth();
  if (!doc) return null;
  return toDocumentHealthVM(doc);
}
