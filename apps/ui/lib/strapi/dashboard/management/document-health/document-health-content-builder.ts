import "server-only";

import { cache } from "react";
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

function loadFromJson(): DocumentHealthDocument | null {
  try {
    const filePath = join(process.cwd(), "data", "strapi-mock", "dashboard", "admin", "admin", "document-health.json");
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

export const loadDocumentHealth = cache(
  async (): Promise<DocumentHealthDocument | null> => {
    if (!STRAPI_URL) return loadFromJson();

    try {
      const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        next: { revalidate: 3600, tags: ["management-page", "document-health"] },
      });

      if (!res.ok) {
        console.error(`[document-health-builder] Strapi ${res.status}: ${await res.text()}`);
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown[] };
      const raw = json.data?.[0];

      if (!raw) {
        console.warn("[document-health-builder] No document-health management-page record found in Strapi");
        return loadFromJson();
      }

      const parsed = DocumentHealthDocumentSchema.safeParse(raw);

      if (!parsed.success) {
        console.error("[document-health-builder] Validation failed:", parsed.error.flatten());
        return loadFromJson();
      }

      return parsed.data;
    } catch (err) {
      console.error("[document-health-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
