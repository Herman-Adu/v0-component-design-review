import "server-only";

import { cache } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import {
  ABSubjectVariantDocumentSchema,
  type ABSubjectVariantDocument,
} from "./ab-subject-variant-schema";

/**
 * A/B Subject Variant Content Builder
 *
 * Fetches all ab-subject-variant records from Strapi.
 * Collection Type endpoint: GET /api/ab-subject-variants (returns array under `data`)
 * JSON fallback: loads from data/strapi-mock/dashboard/admin/email-management/configuration/ab-subject-variants.json
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT = "/api/ab-subject-variants?pagination[pageSize]=100";

function loadFromJson(): ABSubjectVariantDocument[] {
  try {
    const filePath = join(
      process.cwd(),
      "data",
      "strapi-mock",
      "dashboard",
      "admin",
      "email-management",
      "configuration",
      "ab-subject-variants.json",
    );
    const raw = JSON.parse(readFileSync(filePath, "utf-8")) as unknown[];
    return raw.flatMap((item) => {
      const result = ABSubjectVariantDocumentSchema.safeParse(item);
      if (!result.success) {
        console.warn(
          "[ab-subject-variant-builder] JSON mock item validation failed:",
          result.error.flatten(),
        );
        return [];
      }
      return [result.data];
    });
  } catch {
    return [];
  }
}

export const loadABSubjectVariants = cache(
  async (): Promise<ABSubjectVariantDocument[]> => {
    if (!STRAPI_URL) return loadFromJson();

    try {
      const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        next: { revalidate: 3600, tags: ["ab-subject-variants"] },
      });

      if (!res.ok) {
        console.error(
          `[ab-subject-variant-builder] Strapi ${res.status}: ${await res.text()}`,
        );
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown[] };
      const data = json.data ?? [];

      return data.flatMap((item, i) => {
        const result = ABSubjectVariantDocumentSchema.safeParse(item);
        if (!result.success) {
          console.error(
            `[ab-subject-variant-builder] Validation failed at index ${i}:`,
            result.error.flatten(),
          );
          return [];
        }
        return [result.data];
      });
    } catch (err) {
      console.error("[ab-subject-variant-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
