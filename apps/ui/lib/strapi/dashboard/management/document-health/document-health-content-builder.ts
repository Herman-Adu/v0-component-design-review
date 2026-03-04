import "server-only";

import { DocumentHealthDocumentSchema, type DocumentHealthDocument } from "./document-health-schema";

/**
 * Document Health Content Builder
 *
 * Fetches the management-page record for section=document-health from Strapi.
 * CI guard: returns null when STRAPI_URL is not set (build-time, CI).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT =
  "/api/management-pages?filters[section][$eq]=document-health&populate[header]=true&populate[pageSections]=true&populate[highlights]=true&populate[quickLinks]=true";

let cached: DocumentHealthDocument | null | undefined;

export async function loadDocumentHealth(): Promise<DocumentHealthDocument | null> {
  if (!STRAPI_URL) {
    return null;
  }

  if (cached !== undefined) return cached;

  try {
    const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      next: { revalidate: 3600, tags: ["management-page", "document-health"] },
    });

    if (!res.ok) {
      console.error(`[document-health-builder] Strapi ${res.status}: ${await res.text()}`);
      cached = null;
      return null;
    }

    const json = await res.json();
    const raw = json.data?.[0];

    if (!raw) {
      console.warn("[document-health-builder] No document-health management-page record found in Strapi");
      cached = null;
      return null;
    }

    const parsed = DocumentHealthDocumentSchema.safeParse(raw);

    if (!parsed.success) {
      console.error("[document-health-builder] Validation failed:", parsed.error.flatten());
      cached = null;
      return null;
    }

    cached = parsed.data;
    return cached;
  } catch (err) {
    console.error("[document-health-builder] Fetch error:", err);
    cached = null;
    return null;
  }
}
