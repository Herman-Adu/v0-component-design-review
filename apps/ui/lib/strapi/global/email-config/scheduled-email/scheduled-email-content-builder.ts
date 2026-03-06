import "server-only";

import { cache } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import {
  ScheduledEmailDocumentSchema,
  type ScheduledEmailDocument,
} from "./scheduled-email-schema";

/**
 * Scheduled Email Content Builder
 *
 * Fetches scheduled-email records from Strapi, optionally filtered by status.
 * Collection Type endpoint: GET /api/scheduled-emails?filters[status][$eq]=queued
 * JSON fallback: loads from data/strapi-mock/dashboard/admin/email-management/configuration/scheduled-emails.json
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

function buildEndpoint(status?: string): string {
  const base = "/api/scheduled-emails?sort[0]=createdAt:desc&pagination[pageSize]=100";
  if (status) return `${base}&filters[status][$eq]=${status}`;
  return base;
}

function loadFromJson(): ScheduledEmailDocument[] {
  try {
    const filePath = join(
      process.cwd(),
      "data",
      "strapi-mock",
      "dashboard",
      "admin",
      "email-management",
      "configuration",
      "scheduled-emails.json",
    );
    const raw = JSON.parse(readFileSync(filePath, "utf-8")) as unknown[];
    return raw.flatMap((item) => {
      const result = ScheduledEmailDocumentSchema.safeParse(item);
      if (!result.success) {
        console.warn(
          "[scheduled-email-builder] JSON mock item validation failed:",
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

export const loadScheduledEmails = cache(
  async (status?: string): Promise<ScheduledEmailDocument[]> => {
    if (!STRAPI_URL) {
      const all = loadFromJson();
      return status ? all.filter((e) => e.status === status) : all;
    }

    try {
      const res = await fetch(`${STRAPI_URL}${buildEndpoint(status)}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        // Short revalidation — queue data changes frequently
        next: { revalidate: 60, tags: ["scheduled-emails"] },
      });

      if (!res.ok) {
        console.error(
          `[scheduled-email-builder] Strapi ${res.status}: ${await res.text()}`,
        );
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown[] };
      const data = json.data ?? [];

      return data.flatMap((item, i) => {
        const result = ScheduledEmailDocumentSchema.safeParse(item);
        if (!result.success) {
          console.error(
            `[scheduled-email-builder] Validation failed at index ${i}:`,
            result.error.flatten(),
          );
          return [];
        }
        return [result.data];
      });
    } catch (err) {
      console.error("[scheduled-email-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
