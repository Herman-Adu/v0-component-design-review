import "server-only";

import { readFileSync } from "fs";
import { join } from "path";
import { EmailSettingsDocumentSchema, type EmailSettingsDocument } from "./email-settings-schema";

/**
 * Email Settings Content Builder
 *
 * Fetches the email-setting Single Type from Strapi.
 * Single Type endpoint: GET /api/email-setting (returns flat object under `data`)
 * JSON fallback: loads from data/strapi-mock/global/email-setting.json when STRAPI_URL is not set.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT = "/api/email-setting";

let cached: EmailSettingsDocument | null | undefined;

function loadEmailSettingsFromJson(): EmailSettingsDocument | null {
  try {
    const filePath = join(process.cwd(), "data", "strapi-mock", "global", "email-setting.json");
    const raw = JSON.parse(readFileSync(filePath, "utf-8"));
    const result = EmailSettingsDocumentSchema.safeParse(raw);
    if (!result.success) {
      console.warn("[email-settings-builder] JSON mock validation failed:", result.error.flatten());
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export async function loadEmailSettings(): Promise<EmailSettingsDocument | null> {
  if (!STRAPI_URL) return loadEmailSettingsFromJson();

  if (process.env.NODE_ENV === "development") cached = undefined;
  if (cached !== undefined) return cached;

  try {
    const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
      next: { revalidate: 3600, tags: ["email-setting"] },
    });

    if (!res.ok) {
      console.error(`[email-settings-builder] Strapi ${res.status}: ${await res.text()}`);
      cached = null;
      return null;
    }

    const json = await res.json();
    // Single Type: Strapi 5 returns { data: { ...fields } }
    const raw = json.data;

    if (!raw) {
      console.warn("[email-settings-builder] No email-setting record found in Strapi");
      cached = null;
      return null;
    }

    const parsed = EmailSettingsDocumentSchema.safeParse(raw);

    if (!parsed.success) {
      console.error("[email-settings-builder] Validation failed:", parsed.error.flatten());
      cached = null;
      return null;
    }

    cached = parsed.data;
    return cached;
  } catch (err) {
    console.error("[email-settings-builder] Fetch error:", err);
    cached = null;
    return null;
  }
}
