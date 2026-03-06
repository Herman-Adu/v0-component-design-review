import type { EmailTemplateDocument, EmailTemplateCategory, EmailTemplateRecipientType } from "./email-template-schema";

/**
 * Email Template View Models
 *
 * Transforms validated Strapi documents into UI-ready view models.
 * EmailTemplateVM is the canonical shape consumed by pages and client islands.
 * It eliminates all hardcoded derive helpers (deriveCategory, deriveRecipientType,
 * TEMPLATE_KEY_LABELS) from client components.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface EmailTemplateVM {
  id: number;
  documentId: string;
  templateKey: string;
  templateLabel: string;
  category: EmailTemplateCategory;
  recipientType: EmailTemplateRecipientType;
  description: string | null;
  isActive: boolean;
  fromName: string | null;
  fromEmail: string | null;
  replyTo: string | null;
}

export function toEmailTemplateVM(doc: EmailTemplateDocument): EmailTemplateVM {
  return {
    id: doc.id,
    documentId: doc.documentId,
    templateKey: doc.templateKey,
    templateLabel: doc.templateLabel,
    category: doc.category,
    recipientType: doc.recipientType,
    description: doc.description ?? null,
    isActive: doc.isActive,
    fromName: doc.fromName ?? null,
    fromEmail: doc.fromEmail ?? null,
    replyTo: doc.replyTo ?? null,
  };
}

/** Build a lookup map: templateKey → EmailTemplateVM for O(1) client-side access */
export function buildTemplateKeyMap(
  templates: EmailTemplateVM[],
): Map<string, EmailTemplateVM> {
  return new Map(templates.map((t) => [t.templateKey, t]));
}
