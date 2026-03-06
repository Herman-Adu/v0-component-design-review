import "server-only";

import { cache } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import { LinkedInPlatformDocumentSchema, type LinkedInPlatformDocument } from "./linkedin-platform-schema";

/**
 * LinkedIn Platform Content Builder
 *
 * Fetches the platform-page record for platform=linkedin from Strapi.
 * Falls back to JSON mock when STRAPI_URL is not set (Vercel, CI, local dev without Docker).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT =
  "/api/platform-pages?filters[platform][$eq]=linkedin&populate[header]=true&populate[ecosystemPhases]=true&populate[tools]=true";

function loadFromJson(): LinkedInPlatformDocument | null {
  try {
    const filePath = join(process.cwd(), "data", "strapi-mock", "dashboard", "admin", "admin", "linkedin.json");
    const raw = JSON.parse(readFileSync(filePath, "utf-8"));
    const result = LinkedInPlatformDocumentSchema.safeParse(raw);
    if (!result.success) {
      console.warn("[linkedin-platform-builder] JSON mock validation failed:", result.error.flatten());
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export const loadLinkedInPlatform = cache(
  async (): Promise<LinkedInPlatformDocument | null> => {
    if (!STRAPI_URL) return loadFromJson();

    try {
      const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        next: { revalidate: 3600, tags: ["platform-page", "linkedin-platform"] },
      });

      if (!res.ok) {
        console.error(`[linkedin-platform-builder] Strapi ${res.status}: ${await res.text()}`);
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown[] };
      const raw = json.data?.[0];

      if (!raw) {
        console.warn("[linkedin-platform-builder] No linkedin platform-page found in Strapi");
        return loadFromJson();
      }

      const parsed = LinkedInPlatformDocumentSchema.safeParse(raw);
      if (!parsed.success) {
        console.error("[linkedin-platform-builder] Validation failed:", parsed.error.flatten());
        return loadFromJson();
      }

      return parsed.data;
    } catch (err) {
      console.error("[linkedin-platform-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
