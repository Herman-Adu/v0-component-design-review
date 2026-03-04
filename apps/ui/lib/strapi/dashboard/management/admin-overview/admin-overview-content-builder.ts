import "server-only";

import { AdminOverviewDocumentSchema, type AdminOverviewDocument } from "./admin-overview-schema";

/**
 * Admin Overview Content Builder
 *
 * Fetches the management-page record for section=admin from Strapi.
 * CI guard: returns null when STRAPI_URL is not set (build-time, CI).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT =
  "/api/management-pages?filters[section][$eq]=admin&populate[header]=true&populate[notice]=true&populate[quickStats]=true&populate[toolSections][populate][tools]=true&populate[upcomingFeatures]=true&populate[cta]=true";

let cached: AdminOverviewDocument | null | undefined;

export async function loadAdminOverview(): Promise<AdminOverviewDocument | null> {
  // CI guard — no Strapi in CI or when URL not configured
  if (!STRAPI_URL) {
    return null;
  }

  if (cached !== undefined) return cached;

  try {
    const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      next: { revalidate: 3600, tags: ["management-page", "admin-overview"] },
    });

    if (!res.ok) {
      console.error(`[admin-overview-builder] Strapi ${res.status}: ${await res.text()}`);
      cached = null;
      return null;
    }

    const json = await res.json();
    const raw = json.data?.[0];

    if (!raw) {
      console.warn("[admin-overview-builder] No admin management-page record found in Strapi");
      cached = null;
      return null;
    }

    // Strapi 5 returns flat objects (no attributes wrapper)
    const parsed = AdminOverviewDocumentSchema.safeParse(raw);

    if (!parsed.success) {
      console.error("[admin-overview-builder] Validation failed:", parsed.error.flatten());
      cached = null;
      return null;
    }

    cached = parsed.data;
    return cached;
  } catch (err) {
    console.error("[admin-overview-builder] Fetch error:", err);
    cached = null;
    return null;
  }
}
