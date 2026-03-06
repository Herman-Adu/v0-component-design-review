/**
 * Scheduler Config — Public Facade
 *
 * Thin re-export. Consumers import from this file only.
 */
export { getSchedulerConfig } from "./scheduler-config-repository";
export type {
  SchedulerConfigVM,
  BusinessHoursVM,
} from "./scheduler-config-view-models";
