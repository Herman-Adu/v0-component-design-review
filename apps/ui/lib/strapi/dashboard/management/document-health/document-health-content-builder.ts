import "server-only";

import { readFileSync } from "fs";
import { join } from "path";
import { DocumentHealthDocumentSchema, type DocumentHealthDocument } from "./document-health-schema";

/**
 * Document Health Content Builder
 *
 * Fetches the management-page record for section=document-health from Strapi.
 * Falls back to JSON mock when STRAPI_URL is not set (Vercel, CI, local dev without Docker).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT =
  "/api/management-pages?filters[section][$eq]=document-health&populate[header]=true&populate[pageSections]=true&populate[highlights]=true&populate[quickLinks]=true";

let cached: DocumentHealthDocument | null | undefined;

function loadFromJson(): DocumentHealthDocument | null {
  try {
    const filePath = join(process.cwd(), "data", "strapi-mock", "dashboard", "management", "document-health.json");
    const raw = JSON.parse(readFileSync(filePath, "utf-8"));
    const result = DocumentHealthDocumentSchema.safeParse(raw);
    if (!result.success) {
      console.warn("[document-health-builder] JSON mock validation failed:", result.error.flatten());
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export async function loadDocumentHealth(): Promise<DocumentHealthDocument | null> {
  if (!STRAPI_URL) return loadFromJson();

  if (process.env.NODE_ENV === "development") cached = undefined;
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
