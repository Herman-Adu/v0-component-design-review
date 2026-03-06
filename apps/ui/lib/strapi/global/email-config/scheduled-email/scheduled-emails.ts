/**
 * Scheduled Emails — Public Facade
 *
 * Thin re-export. Consumers import from this file only.
 */
export {
  listScheduledEmails,
  getQueueStats,
} from "./scheduled-email-repository";
export type {
  ScheduledEmailVM,
  QueueStatsVM,
  EmailQueueStatus,
} from "./scheduled-email-view-models";
