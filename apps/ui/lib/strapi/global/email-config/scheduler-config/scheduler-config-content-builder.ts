import "server-only";

import { cache } from "react";
import { readFileSync } from "fs";
import { join } from "path";
import {
  SchedulerConfigDocumentSchema,
  type SchedulerConfigDocument,
} from "./scheduler-config-schema";

/**
 * Scheduler Config Content Builder
 *
 * Fetches the scheduler-config Single Type from Strapi.
 * Single Type endpoint: GET /api/scheduler-config (returns flat object under `data`)
 * JSON fallback: loads from data/strapi-mock/dashboard/admin/email-management/configuration/scheduler-config.json
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

const ENDPOINT = "/api/scheduler-config";

function loadFromJson(): SchedulerConfigDocument | null {
  try {
    const filePath = join(
      process.cwd(),
      "data",
      "strapi-mock",
      "dashboard",
      "admin",
      "email-management",
      "configuration",
      "scheduler-config.json",
    );
    const raw = JSON.parse(readFileSync(filePath, "utf-8"));
    const result = SchedulerConfigDocumentSchema.safeParse(raw);
    if (!result.success) {
      console.warn(
        "[scheduler-config-builder] JSON mock validation failed:",
        result.error.flatten(),
      );
      return null;
    }
    return result.data;
  } catch {
    return null;
  }
}

export const loadSchedulerConfig = cache(
  async (): Promise<SchedulerConfigDocument | null> => {
    if (!STRAPI_URL) return loadFromJson();

    try {
      const res = await fetch(`${STRAPI_URL}${ENDPOINT}`, {
        headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
        next: { revalidate: 3600, tags: ["scheduler-config"] },
      });

      if (!res.ok) {
        console.error(
          `[scheduler-config-builder] Strapi ${res.status}: ${await res.text()}`,
        );
        return loadFromJson();
      }

      const json = (await res.json()) as { data: unknown };
      const raw = json.data;

      if (!raw) {
        console.warn(
          "[scheduler-config-builder] No scheduler-config record found in Strapi",
        );
        return loadFromJson();
      }

      const parsed = SchedulerConfigDocumentSchema.safeParse(raw);
      if (!parsed.success) {
        console.error(
          "[scheduler-config-builder] Validation failed:",
          parsed.error.flatten(),
        );
        return loadFromJson();
      }

      return parsed.data;
    } catch (err) {
      console.error("[scheduler-config-builder] Fetch error:", err);
      return loadFromJson();
    }
  },
);
