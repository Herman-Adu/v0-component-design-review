import "server-only";

import { loadABSubjectVariants } from "./ab-subject-variant-content-builder";
import {
  toABSubjectVariantVM,
  groupVariantsByTemplate,
  type ABSubjectVariantVM,
  type TemplateSubjectsVM,
} from "./ab-subject-variant-view-models";

/**
 * A/B Subject Variant Repository
 *
 * Server-only query layer. Applies view model transforms on top of the content builder.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export async function listABSubjectVariants(): Promise<ABSubjectVariantVM[]> {
  const docs = await loadABSubjectVariants();
  return docs.map(toABSubjectVariantVM);
}

export async function listTemplateSubjects(): Promise<TemplateSubjectsVM[]> {
  const variants = await listABSubjectVariants();
  return groupVariantsByTemplate(variants);
}

export async function getTemplateSubjects(
  templateKey: string,
): Promise<TemplateSubjectsVM | null> {
  const all = await listTemplateSubjects();
  return all.find((t) => t.templateKey === templateKey) ?? null;
}
