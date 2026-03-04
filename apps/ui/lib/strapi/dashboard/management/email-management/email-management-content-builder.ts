import "server-only";

import { EmailManagementDocumentSchema, type EmailManagementDocument } from "./email-management-schema";

/**
 * Email Management Content Builder
 *
 * Fetches the management-page record for section=email-management from Strapi.
 * CI guard: returns null when STRAPI_URL is not set (build-time, CI).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT =
  "/api/management-pages?filters[section][$eq]=email-management&populate[header]=true&populate[pageSections]=true&populate[highlights]=true&populate[quickLinks]=true";

let cached: EmailManagementDocument | null | undefined;

export async function loadEmailManagement(): Promise<EmailManagementDocument | null> {
  if (!STRAPI_URL) {
    return null;
  }

  if (cached !== undefined) return cached;

  try {
    const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      next: { revalidate: 3600, tags: ["management-page", "email-management"] },
    });

    if (!res.ok) {
      console.error(`[email-management-builder] Strapi ${res.status}: ${await res.text()}`);
      cached = null;
      return null;
    }

    const json = await res.json();
    const raw = json.data?.[0];

    if (!raw) {
      console.warn("[email-management-builder] No email-management management-page record found in Strapi");
      cached = null;
      return null;
    }

    const parsed = EmailManagementDocumentSchema.safeParse(raw);

    if (!parsed.success) {
      console.error("[email-management-builder] Validation failed:", parsed.error.flatten());
      cached = null;
      return null;
    }

    cached = parsed.data;
    return cached;
  } catch (err) {
    console.error("[email-management-builder] Fetch error:", err);
    cached = null;
    return null;
  }
}
