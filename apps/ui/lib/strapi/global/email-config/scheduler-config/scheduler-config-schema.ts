import { z } from "zod";

/**
 * Scheduler Config Schema
 *
 * Validates the scheduler-config Single Type response from Strapi.
 * Single Type — endpoint: GET /api/scheduler-config
 *
 * immediateCategories: Strapi JSON field (returns native array).
 * businessHoursJson: Strapi Long text field storing a JSON-serialised BusinessHours[].
 *   The view model layer is responsible for parsing it.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export const SchedulerConfigDocumentSchema = z.object({
  isEnabled: z.boolean().default(true),
  batchSize: z.number().int().min(1).max(50).default(10),
  batchIntervalMinutes: z.number().int().min(5).max(120).default(15),
  timezone: z.string().min(1).default("Europe/London"),
  immediateCategories: z
    .array(z.enum(["service", "contact", "quotation"]))
    .default(["service"]),
  businessHoursJson: z.string().nullish(),
});

export type SchedulerConfigDocument = z.infer<typeof SchedulerConfigDocumentSchema>;
