import "server-only";

import { cache } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import { DigitalMarketingDocumentSchema, type DigitalMarketingDocument } from "./digital-marketing-schema";

/**
 * Digital Marketing Content Builder
 *
 * Fetches the management-page record for section=digital-marketing from Strapi.
 * Falls back to JSON mock when STRAPI_URL is not set (Vercel, CI, local dev without Docker).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT =
  "/api/management-pages?filters[section][$eq]=digital-marketing&populate[header]=true&populate[notice]=true&populate[quickStats]=true&populate[quickLinks]=true&populate[platforms][populate][pageItems]=true";

function loadFromJson(): DigitalMarketingDocument | null {
  try {
    const filePath = join(process.cwd(), "data", "strapi-mock", "dashboard", "admin", "admin", "digital-marketing.json");
    const raw = JSON.parse(readFileSync(filePath, "utf-8"));
    const result = DigitalMarketingDocumentSchema.safeParse(raw);
    if (!result.success) {
      console.warn("[digital-marketing-builder] JSON mock validation failed:", result.error.flatten());
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export const loadDigitalMarketing = cache(
  async (): Promise<DigitalMarketingDocument | null> => {
    if (!STRAPI_URL) return loadFromJson();

    try {
      const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        next: { revalidate: 3600, tags: ["management-page", "digital-marketing"] },
      });

      if (!res.ok) {
        console.error(`[digital-marketing-builder] Strapi ${res.status}: ${await res.text()}`);
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown[] };
      const raw = json.data?.[0];

      if (!raw) {
        console.warn("[digital-marketing-builder] No digital-marketing management-page found in Strapi");
        return loadFromJson();
      }

      const parsed = DigitalMarketingDocumentSchema.safeParse(raw);
      if (!parsed.success) {
        console.error("[digital-marketing-builder] Validation failed:", parsed.error.flatten());
        return loadFromJson();
      }

      return parsed.data;
    } catch (err) {
      console.error("[digital-marketing-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
