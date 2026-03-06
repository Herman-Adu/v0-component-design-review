import "server-only";

import { loadEmailTemplates } from "./email-template-content-builder";
import {
  toEmailTemplateVM,
  buildTemplateKeyMap,
  type EmailTemplateVM,
} from "./email-template-view-models";

/**
 * Email Template Repository
 *
 * Server-only query layer. Applies view model transforms on top of the content builder.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function listEmailTemplates(): Promise<EmailTemplateVM[]> {
  const docs = await loadEmailTemplates();
  return docs.map(toEmailTemplateVM);
}

export async function getEmailTemplate(
  templateKey: string,
): Promise<EmailTemplateVM | null> {
  const all = await listEmailTemplates();
  return all.find((t) => t.templateKey === templateKey) ?? null;
}

export async function getTemplateKeyMap(): Promise<Map<string, EmailTemplateVM>> {
  const all = await listEmailTemplates();
  return buildTemplateKeyMap(all);
}
