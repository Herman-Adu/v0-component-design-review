import "server-only";

import { cache } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import {
  RecipientGroupDocumentSchema,
  type RecipientGroupDocument,
} from "./recipient-group-schema";

/**
 * Recipient Group Content Builder
 *
 * Fetches all recipient-group records from Strapi (with emailStaff members populated).
 * Collection Type endpoint: GET /api/recipient-groups?populate[members]=*
 * JSON fallback: loads from data/strapi-mock/dashboard/admin/email-management/configuration/recipient-groups.json
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT =
  "/api/recipient-groups?populate[members]=*&pagination[pageSize]=100";

function loadFromJson(): RecipientGroupDocument[] {
  try {
    const filePath = join(
      process.cwd(),
      "data",
      "strapi-mock",
      "dashboard",
      "admin",
      "email-management",
      "configuration",
      "recipient-groups.json",
    );
    const raw = JSON.parse(readFileSync(filePath, "utf-8")) as unknown[];
    return raw.flatMap((item) => {
      const result = RecipientGroupDocumentSchema.safeParse(item);
      if (!result.success) {
        console.warn(
          "[recipient-group-builder] JSON mock item validation failed:",
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

export const loadRecipientGroups = cache(
  async (): Promise<RecipientGroupDocument[]> => {
    if (!STRAPI_URL) return loadFromJson();

    try {
      const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        next: { revalidate: 3600, tags: ["recipient-groups"] },
      });

      if (!res.ok) {
        console.error(
          `[recipient-group-builder] Strapi ${res.status}: ${await res.text()}`,
        );
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown[] };
      const data = json.data ?? [];

      return data.flatMap((item, i) => {
        const result = RecipientGroupDocumentSchema.safeParse(item);
        if (!result.success) {
          console.error(
            `[recipient-group-builder] Validation failed at index ${i}:`,
            result.error.flatten(),
          );
          return [];
        }
        return [result.data];
      });
    } catch (err) {
      console.error("[recipient-group-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
