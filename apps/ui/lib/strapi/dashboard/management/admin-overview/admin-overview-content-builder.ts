import "server-only";

import { cache } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import { AdminOverviewDocumentSchema, type AdminOverviewDocument } from "./admin-overview-schema";

/**
 * Admin Overview Content Builder
 *
 * Fetches the management-page record for section=admin from Strapi.
 * Falls back to JSON mock when STRAPI_URL is not set (Vercel, CI, local dev without Docker).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT =
  "/api/management-pages?filters[section][$eq]=admin&populate[header]=true&populate[notice]=true&populate[quickStats]=true&populate[toolSections][populate][tools]=true&populate[upcomingFeatures]=true&populate[cta]=true";

function loadFromJson(): AdminOverviewDocument | null {
  try {
    const filePath = join(process.cwd(), "data", "strapi-mock", "dashboard", "admin", "admin", "admin-overview.json");
    const raw = JSON.parse(readFileSync(filePath, "utf-8"));
    const result = AdminOverviewDocumentSchema.safeParse(raw);
    if (!result.success) {
      console.warn("[admin-overview-builder] JSON mock validation failed:", result.error.flatten());
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export const loadAdminOverview = cache(
  async (): Promise<AdminOverviewDocument | null> => {
    if (!STRAPI_URL) return loadFromJson();

    try {
      const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        next: { revalidate: 3600, tags: ["management-page", "admin-overview"] },
      });

      if (!res.ok) {
        console.error(`[admin-overview-builder] Strapi ${res.status}: ${await res.text()}`);
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown[] };
      const raw = json.data?.[0];

      if (!raw) {
        console.warn("[admin-overview-builder] No admin management-page record found in Strapi");
        return loadFromJson();
      }

      // Strapi 5 returns flat objects (no attributes wrapper)
      const parsed = AdminOverviewDocumentSchema.safeParse(raw);

      if (!parsed.success) {
        console.error("[admin-overview-builder] Validation failed:", parsed.error.flatten());
        return loadFromJson();
      }

      return parsed.data;
    } catch (err) {
      console.error("[admin-overview-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
