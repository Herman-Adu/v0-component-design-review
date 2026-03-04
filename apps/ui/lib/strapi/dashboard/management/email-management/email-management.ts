/**
 * Email Management — Public Facade
 *
 * Thin re-export of the repository and view model types.
 * Consumers import from this file only.
 */
export { getEmailManagement } from "./email-management-repository";
export type {
  EmailManagementVM,
  EmailManagementPageSectionVM,
  EmailManagementHighlightVM,
  EmailManagementQuickLinkVM,
} from "./email-management-view-models";
