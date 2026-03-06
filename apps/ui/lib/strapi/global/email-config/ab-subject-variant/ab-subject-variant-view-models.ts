import type { ABSubjectVariantDocument } from "./ab-subject-variant-schema";

/**
 * A/B Subject Variant View Models
 *
 * Transforms validated Strapi documents into UI-ready view models.
 * Groups individual variant documents by templateKey for page consumption.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

export interface ABSubjectVariantVM {
  id: number;
  documentId: string;
  templateKey: string;
  templateLabel: string;
  pattern: string;
  description: string | null;
  weight: number;
  sends: number;
  isActive: boolean;
  abEnabled: boolean;
}

/** Variants grouped by templateKey — primary shape consumed by the A/B config page */
export interface TemplateSubjectsVM {
  templateKey: string;
  templateLabel: string;
  abEnabled: boolean;
  variants: ABSubjectVariantVM[];
}

export function toABSubjectVariantVM(
  doc: ABSubjectVariantDocument,
): ABSubjectVariantVM {
  return {
    id: doc.id,
    documentId: doc.documentId,
    templateKey: doc.templateKey,
    templateLabel: doc.templateLabel,
    pattern: doc.pattern,
    description: doc.description ?? null,
    weight: doc.weight,
    sends: doc.sends,
    isActive: doc.isActive,
    abEnabled: doc.abEnabled,
  };
}

/** Groups a flat list of variant VMs by templateKey, preserving insertion order */
export function groupVariantsByTemplate(
  variants: ABSubjectVariantVM[],
): TemplateSubjectsVM[] {
  const map = new Map<string, TemplateSubjectsVM>();
  for (const v of variants) {
    if (!map.has(v.templateKey)) {
      map.set(v.templateKey, {
        templateKey: v.templateKey,
        templateLabel: v.templateLabel,
        abEnabled: v.abEnabled,
        variants: [],
      });
    }
    map.get(v.templateKey)!.variants.push(v);
  }
  return Array.from(map.values());
}
