import "server-only";

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

let cached: GooglePlatformDocument | null | undefined;

function loadFromJson(): GooglePlatformDocument | null {
  try {
    const filePath = join(process.cwd(), "data", "strapi-mock", "dashboard", "platforms", "google.json");
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

export async function loadGooglePlatform(): Promise<GooglePlatformDocument | null> {
  if (!STRAPI_URL) return loadFromJson();

  if (process.env.NODE_ENV === "development") cached = undefined;
  if (cached !== undefined) return cached;

  try {
    const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      next: { revalidate: 3600, tags: ["platform-page", "google-platform"] },
    });

    if (!res.ok) {
      console.error(`[google-platform-builder] Strapi ${res.status}: ${await res.text()}`);
      cached = null;
      return null;
    }

    const json = await res.json();
    const raw = json.data?.[0];

    if (!raw) {
      console.warn("[google-platform-builder] No google platform-page found in Strapi");
      cached = null;
      return null;
    }

    const parsed = GooglePlatformDocumentSchema.safeParse(raw);
    if (!parsed.success) {
      console.error("[google-platform-builder] Validation failed:", parsed.error.flatten());
      cached = null;
      return null;
    }

    cached = parsed.data;
    return cached;
  } catch (err) {
    console.error("[google-platform-builder] Fetch error:", err);
    cached = null;
    return null;
  }
}
