import "server-only";

import { loadRecipientGroups } from "./recipient-group-content-builder";
import {
  toRecipientGroupVM,
  type RecipientGroupVM,
} from "./recipient-group-view-models";

/**
 * Recipient Group Repository
 *
 * Server-only query layer. Applies view model transforms on top of the content builder.
 * resolveRecipients() is called at email send-time to build the BCC list.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function listRecipientGroups(): Promise<RecipientGroupVM[]> {
  const docs = await loadRecipientGroups();
  return docs.map(toRecipientGroupVM);
}

/**
 * Resolve unique active staff email addresses for a given template type and urgency.
 * Used at send-time by continuation-email-service.ts to populate the BCC field.
 * Rule: Always BCC — never CC or TO. Never expose internal staff emails to customers.
 */
export async function resolveRecipients(
  templateType: "service" | "contact" | "quotation",
  urgency: "routine" | "urgent" | "emergency" = "routine",
): Promise<string[]> {
  const groups = await listRecipientGroups();

  const matching = groups.filter((g) => {
    if (!g.isActive) return false;
    if (!g.templateTypes.includes(templateType)) return false;

    switch (g.urgencyFilter) {
      case "all":
        return true;
      case "emergency-only":
        return urgency === "emergency";
      case "urgent-and-emergency":
        return urgency === "urgent" || urgency === "emergency";
      case "routine-only":
        return urgency === "routine";
      default:
        return true;
    }
  });

  const emails = new Set<string>();
  for (const g of matching) {
    for (const m of g.members) {
      if (m.isActive) emails.add(m.email);
    }
  }
  return Array.from(emails);
}
