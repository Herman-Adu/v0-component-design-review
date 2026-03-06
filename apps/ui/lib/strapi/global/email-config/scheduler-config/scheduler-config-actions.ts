"use server";

import { revalidateTag } from "next/cache";
import { z } from "zod";

/**
 * Scheduler Config — Strapi Write Actions
 *
 * PUT /api/scheduler-config (Single Type) → saveSchedulerConfig
 *
 * businessHours is serialised to JSON string (Long text field in Strapi).
 * immediateCategories is a Strapi JSON field (array).
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

const BusinessHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  dayName: z.string().min(1),
  startHour: z.number().int().min(0).max(23),
  endHour: z.number().int().min(0).max(23),
  isEnabled: z.boolean(),
});

const SaveSchedulerConfigSchema = z.object({
  isEnabled: z.boolean().optional(),
  batchSize: z.number().int().min(1).max(50).optional(),
  batchIntervalMinutes: z.number().int().min(5).max(120).optional(),
  timezone: z.string().min(1).optional(),
  immediateCategories: z
    .array(z.enum(["service", "contact", "quotation"]))
    .optional(),
  businessHours: z.array(BusinessHoursSchema).length(7).optional(),
});

export type SaveSchedulerConfigInput = z.infer<typeof SaveSchedulerConfigSchema>;

function strapiHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
  };
}

export async function saveSchedulerConfig(
  input: SaveSchedulerConfigInput,
): Promise<{ success: boolean; error?: string }> {
  const STRAPI_URL = process.env.STRAPI_URL;
  if (!STRAPI_URL || !process.env.STRAPI_API_TOKEN) {
    return { success: false, error: "Strapi is not configured" };
  }

  const parsed = SaveSchedulerConfigSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().formErrors.join(", ") || "Invalid input",
    };
  }

  // Convert businessHours array to JSON string for Strapi Long text field
  const { businessHours, ...rest } = parsed.data;
  const strapiData: Record<string, unknown> = { ...rest };
  if (businessHours !== undefined) {
    strapiData.businessHoursJson = JSON.stringify(businessHours);
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/scheduler-config`, {
      method: "PUT",
      headers: strapiHeaders(),
      body: JSON.stringify({ data: strapiData }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[scheduler-config-actions] PUT failed:", res.status, text);
      return { success: false, error: `Strapi returned ${res.status}` };
    }

    revalidateTag("scheduler-config", {});
    return { success: true };
  } catch (err) {
    console.error("[scheduler-config-actions] PUT error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
