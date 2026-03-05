import "server-only";

import { readFileSync } from "fs";
import { join } from "path";
import { CompanySettingsDocumentSchema, type CompanySettingsDocument } from "./company-settings-schema";

/**
 * Company Settings Content Builder
 *
 * Fetches the company-setting Single Type from Strapi.
 * Single Type endpoint: GET /api/company-setting (returns flat object under `data`)
 * JSON fallback: loads from data/strapi-mock/global/company-setting.json when STRAPI_URL is not set.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT = "/api/company-setting";

let cached: CompanySettingsDocument | null | undefined;

function loadCompanySettingsFromJson(): CompanySettingsDocument | null {
  try {
    const filePath = join(process.cwd(), "data", "strapi-mock", "global", "company-setting.json");
    const raw = JSON.parse(readFileSync(filePath, "utf-8"));
    const result = CompanySettingsDocumentSchema.safeParse(raw);
    if (!result.success) {
      console.warn("[company-settings-builder] JSON mock validation failed:", result.error.flatten());
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export async function loadCompanySettings(): Promise<CompanySettingsDocument | null> {
  if (!STRAPI_URL) return loadCompanySettingsFromJson();

  if (cached !== undefined) return cached;

  try {
    const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      next: { revalidate: 3600, tags: ["company-setting"] },
    });

    if (!res.ok) {
      console.error(`[company-settings-builder] Strapi ${res.status}: ${await res.text()}`);
      cached = null;
      return null;
    }

    const json = await res.json();
    // Single Type: Strapi 5 returns { data: { ...fields } }
    const raw = json.data;

    if (!raw) {
      console.warn("[company-settings-builder] No company-setting record found in Strapi");
      cached = null;
      return null;
    }

    const parsed = CompanySettingsDocumentSchema.safeParse(raw);

    if (!parsed.success) {
      console.error("[company-settings-builder] Validation failed:", parsed.error.flatten());
      cached = null;
      return null;
    }

    cached = parsed.data;
    return cached;
  } catch (err) {
    console.error("[company-settings-builder] Fetch error:", err);
    cached = null;
    return null;
  }
}
