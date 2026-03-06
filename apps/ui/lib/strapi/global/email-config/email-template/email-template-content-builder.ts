import "server-only";

import { cache } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import {
  EmailTemplateDocumentSchema,
  type EmailTemplateDocument,
} from "./email-template-schema";

/**
 * Email Template Content Builder
 *
 * Fetches all email-template records from Strapi.
 * Collection Type endpoint: GET /api/email-templates (returns array under `data`)
 * JSON fallback: loads from data/strapi-mock/dashboard/admin/email-management/configuration/email-templates.json
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT = "/api/email-templates?pagination[pageSize]=100&sort=category:asc,recipientType:asc";

function loadFromJson(): EmailTemplateDocument[] {
  try {
    const filePath = join(
      process.cwd(),
      "data",
      "strapi-mock",
      "dashboard",
      "admin",
      "email-management",
      "configuration",
      "email-templates.json",
    );
    const raw = JSON.parse(readFileSync(filePath, "utf-8")) as unknown[];
    return raw.flatMap((item) => {
      const result = EmailTemplateDocumentSchema.safeParse(item);
      if (!result.success) {
        console.warn(
          "[email-template-builder] JSON mock item validation failed:",
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

export const loadEmailTemplates = cache(
  async (): Promise<EmailTemplateDocument[]> => {
    if (!STRAPI_URL) return loadFromJson();

    try {
      const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        next: { revalidate: 3600, tags: ["email-templates"] },
      });

      if (!res.ok) {
        console.error(
          `[email-template-builder] Strapi ${res.status}: ${await res.text()}`,
        );
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown[] };
      const data = json.data ?? [];

      return data.flatMap((item, i) => {
        const result = EmailTemplateDocumentSchema.safeParse(item);
        if (!result.success) {
          console.error(
            `[email-template-builder] Validation failed at index ${i}:`,
            result.error.flatten(),
          );
          return [];
        }
        return [result.data];
      });
    } catch (err) {
      console.error("[email-template-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
