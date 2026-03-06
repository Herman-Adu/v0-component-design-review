/**
 * Recipient Groups — Public Facade
 *
 * Thin re-export. Consumers import from this file only.
 */
export {
  listRecipientGroups,
  resolveRecipients,
} from "./recipient-group-repository";
export type {
  RecipientGroupVM,
  EmailStaffVM,
} from "./recipient-group-view-models";
