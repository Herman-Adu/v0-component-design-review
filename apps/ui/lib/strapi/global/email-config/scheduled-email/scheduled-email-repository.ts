import "server-only";

import { loadScheduledEmails } from "./scheduled-email-content-builder";
import {
  toScheduledEmailVM,
  toQueueStatsVM,
  type ScheduledEmailVM,
  type QueueStatsVM,
  type EmailQueueStatus,
} from "./scheduled-email-view-models";

/**
 * Scheduled Email Repository
 *
 * Server-only query layer. Applies view model transforms on top of the content builder.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function listScheduledEmails(
  statusFilter?: EmailQueueStatus,
): Promise<ScheduledEmailVM[]> {
  const docs = await loadScheduledEmails(statusFilter);
  return docs.map(toScheduledEmailVM);
}

export async function getQueueStats(): Promise<QueueStatsVM> {
  const all = await listScheduledEmails();
  return toQueueStatsVM(all);
}
