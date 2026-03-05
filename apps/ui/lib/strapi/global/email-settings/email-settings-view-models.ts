import type { EmailSettingsDocument } from "./email-settings-schema";

/**
 * Email Settings View Models
 *
 * Transforms the validated Strapi document into a UI-ready view model.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface EmailSettingsVM {
  fromEmail: string;
  contactFromEmail: string | null;
  quotationFromEmail: string | null;
  replyToEmail: string | null;
  slaResponseHours: number;
  slaUrgentHours: number;
  footerDisclaimer: string | null;
  emailSignatureTemplate: string | null;
  urgencyColorsJson: string | null;
  slaJson: string | null;
}

export function toEmailSettingsVM(doc: EmailSettingsDocument): EmailSettingsVM {
  return {
    fromEmail: doc.fromEmail,
    contactFromEmail: doc.contactFromEmail ?? null,
    quotationFromEmail: doc.quotationFromEmail ?? null,
    replyToEmail: doc.replyToEmail ?? null,
    slaResponseHours: doc.slaResponseHours,
    slaUrgentHours: doc.slaUrgentHours,
    footerDisclaimer: doc.footerDisclaimer ?? null,
    emailSignatureTemplate: doc.emailSignatureTemplate ?? null,
    urgencyColorsJson: doc.urgencyColorsJson ?? null,
    slaJson: doc.slaJson ?? null,
  };
}
