import "server-only";

import { loadSchedulerConfig } from "./scheduler-config-content-builder";
import {
  toSchedulerConfigVM,
  type SchedulerConfigVM,
} from "./scheduler-config-view-models";

/**
 * Scheduler Config Repository
 *
 * Server-only query layer. Calls the content builder and applies view model transforms.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function getSchedulerConfig(): Promise<SchedulerConfigVM | null> {
  const doc = await loadSchedulerConfig();
  if (!doc) return null;
  return toSchedulerConfigVM(doc);
}
