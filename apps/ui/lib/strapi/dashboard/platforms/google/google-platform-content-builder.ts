import "server-only";

import { cache } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import { GooglePlatformDocumentSchema, type GooglePlatformDocument } from "./google-platform-schema";

/**
 * Google Platform Content Builder
 *
 * Fetches the platform-page record for platform=google from Strapi.
 * Falls back to JSON mock when STRAPI_URL is not set (Vercel, CI, local dev without Docker).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT =
  "/api/platform-pages?filters[platform][$eq]=google&populate[header]=true&populate[ecosystemPhases]=true&populate[tools]=true";

function loadFromJson(): GooglePlatformDocument | null {
  try {
    const filePath = join(process.cwd(), "data", "strapi-mock", "dashboard", "admin", "admin", "google.json");
    const raw = JSON.parse(readFileSync(filePath, "utf-8"));
    const result = GooglePlatformDocumentSchema.safeParse(raw);
    if (!result.success) {
      console.warn("[google-platform-builder] JSON mock validation failed:", result.error.flatten());
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export const loadGooglePlatform = cache(
  async (): Promise<GooglePlatformDocument | null> => {
    if (!STRAPI_URL) return loadFromJson();

    try {
      const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        next: { revalidate: 3600, tags: ["platform-page", "google-platform"] },
      });

      if (!res.ok) {
        console.error(`[google-platform-builder] Strapi ${res.status}: ${await res.text()}`);
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown[] };
      const raw = json.data?.[0];

      if (!raw) {
        console.warn("[google-platform-builder] No google platform-page found in Strapi");
        return loadFromJson();
      }

      const parsed = GooglePlatformDocumentSchema.safeParse(raw);
      if (!parsed.success) {
        console.error("[google-platform-builder] Validation failed:", parsed.error.flatten());
        return loadFromJson();
      }

      return parsed.data;
    } catch (err) {
      console.error("[google-platform-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
