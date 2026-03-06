import type {
  RecipientGroupDocument,
  EmailStaffDocument,
} from "./recipient-group-schema";

/**
 * Recipient Group View Models
 *
 * Transforms validated Strapi documents into UI-ready view models.
 * resolveRecipients() is the key runtime function called at email send-time.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface EmailStaffVM {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export interface RecipientGroupVM {
  id: number;
  documentId: string;
  name: string;
  description: string | null;
  templateTypes: ("service" | "contact" | "quotation")[];
  urgencyFilter: "all" | "emergency-only" | "urgent-and-emergency" | "routine-only";
  isActive: boolean;
  members: EmailStaffVM[];
}

export function toEmailStaffVM(doc: EmailStaffDocument): EmailStaffVM {
  return {
    id: doc.id,
    name: doc.name,
    email: doc.email,
    role: doc.role,
    isActive: doc.isActive,
  };
}

export function toRecipientGroupVM(doc: RecipientGroupDocument): RecipientGroupVM {
  return {
    id: doc.id,
    documentId: doc.documentId,
    name: doc.name,
    description: doc.description ?? null,
    templateTypes: doc.templateTypes,
    urgencyFilter: doc.urgencyFilter,
    isActive: doc.isActive,
    members: doc.members.map(toEmailStaffVM),
  };
}
