/**
 * Email Templates — Public Facade
 *
 * Thin re-export. Consumers import from this file only.
 */
export {
  listEmailTemplates,
  getEmailTemplate,
  getTemplateKeyMap,
} from "./email-template-repository";
export type {
  EmailTemplateVM,
} from "./email-template-view-models";
export type {
  EmailTemplateCategory,
  EmailTemplateRecipientType,
} from "./email-template-schema";
