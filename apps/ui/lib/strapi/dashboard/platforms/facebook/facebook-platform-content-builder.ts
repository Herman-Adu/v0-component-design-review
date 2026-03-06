import "server-only";

import { cache } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import { FacebookPlatformDocumentSchema, type FacebookPlatformDocument } from "./facebook-platform-schema";

/**
 * Facebook Platform Content Builder
 *
 * Fetches the platform-page record for platform=facebook from Strapi.
 * Falls back to JSON mock when STRAPI_URL is not set (Vercel, CI, local dev without Docker).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT =
  "/api/platform-pages?filters[platform][$eq]=facebook&populate[header]=true&populate[ecosystemPhases]=true&populate[tools]=true";

function loadFromJson(): FacebookPlatformDocument | null {
  try {
    const filePath = join(process.cwd(), "data", "strapi-mock", "dashboard", "admin", "admin", "facebook.json");
    const raw = JSON.parse(readFileSync(filePath, "utf-8"));
    const result = FacebookPlatformDocumentSchema.safeParse(raw);
    if (!result.success) {
      console.warn("[facebook-platform-builder] JSON mock validation failed:", result.error.flatten());
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export const loadFacebookPlatform = cache(
  async (): Promise<FacebookPlatformDocument | null> => {
    if (!STRAPI_URL) return loadFromJson();

    try {
      const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        next: { revalidate: 3600, tags: ["platform-page", "facebook-platform"] },
      });

      if (!res.ok) {
        console.error(`[facebook-platform-builder] Strapi ${res.status}: ${await res.text()}`);
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown[] };
      const raw = json.data?.[0];

      if (!raw) {
        console.warn("[facebook-platform-builder] No facebook platform-page found in Strapi");
        return loadFromJson();
      }

      const parsed = FacebookPlatformDocumentSchema.safeParse(raw);
      if (!parsed.success) {
        console.error("[facebook-platform-builder] Validation failed:", parsed.error.flatten());
        return loadFromJson();
      }

      return parsed.data;
    } catch (err) {
      console.error("[facebook-platform-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
