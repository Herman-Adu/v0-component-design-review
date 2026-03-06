import type { SchedulerConfigDocument } from "./scheduler-config-schema";

/**
 * Scheduler Config View Models
 *
 * Transforms the validated Strapi document into a UI-ready view model.
 * businessHoursJson (Long text) is parsed from JSON string to a typed array here.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface BusinessHoursVM {
  dayOfWeek: number; // 0=Sunday, 6=Saturday
  dayName: string;
  startHour: number; // 0-23
  endHour: number; // 0-23
  isEnabled: boolean;
}

export interface SchedulerConfigVM {
  isEnabled: boolean;
  batchSize: number;
  batchIntervalMinutes: number;
  timezone: string;
  immediateCategories: ("service" | "contact" | "quotation")[];
  businessHours: BusinessHoursVM[];
}

const DEFAULT_BUSINESS_HOURS: BusinessHoursVM[] = [
  { dayOfWeek: 0, dayName: "Sunday", startHour: 0, endHour: 0, isEnabled: false },
  { dayOfWeek: 1, dayName: "Monday", startHour: 8, endHour: 18, isEnabled: true },
  { dayOfWeek: 2, dayName: "Tuesday", startHour: 8, endHour: 18, isEnabled: true },
  { dayOfWeek: 3, dayName: "Wednesday", startHour: 8, endHour: 18, isEnabled: true },
  { dayOfWeek: 4, dayName: "Thursday", startHour: 8, endHour: 18, isEnabled: true },
  { dayOfWeek: 5, dayName: "Friday", startHour: 8, endHour: 17, isEnabled: true },
  { dayOfWeek: 6, dayName: "Saturday", startHour: 9, endHour: 13, isEnabled: true },
];

function parseBusinessHours(json: string | null | undefined): BusinessHoursVM[] {
  if (!json) return DEFAULT_BUSINESS_HOURS;
  try {
    const parsed = JSON.parse(json) as unknown;
    if (!Array.isArray(parsed) || parsed.length !== 7) return DEFAULT_BUSINESS_HOURS;
    return parsed as BusinessHoursVM[];
  } catch {
    return DEFAULT_BUSINESS_HOURS;
  }
}

export function toSchedulerConfigVM(doc: SchedulerConfigDocument): SchedulerConfigVM {
  return {
    isEnabled: doc.isEnabled,
    batchSize: doc.batchSize,
    batchIntervalMinutes: doc.batchIntervalMinutes,
    timezone: doc.timezone,
    immediateCategories: doc.immediateCategories,
    businessHours: parseBusinessHours(doc.businessHoursJson),
  };
}
