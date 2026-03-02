import "server-only";
import {
  CmsReferenceDocumentSchema,
  type CmsReferenceDocument,
} from "./cms-reference-schema";
import { dataLogger } from "@/lib/utils/arch-logger";

// Import all CMS reference JSON files
import contentCollectionsDoc from "@/data/strapi-mock/dashboard/documentation/cms-reference/content-collections.json";
import formCollectionsDoc from "@/data/strapi-mock/dashboard/documentation/cms-reference/form-collections.json";
import singleTypesDoc from "@/data/strapi-mock/dashboard/documentation/cms-reference/single-types.json";

/**
 * CMS Reference Content Builder
 *
 * Loads CMS reference documentation from JSON files at module initialization.
 * This follows the content-library pattern established by article-content-builder.ts
 */

const rawDocuments = [
  contentCollectionsDoc,
  formCollectionsDoc,
  singleTypesDoc,
] as const;

// Validate and load all CMS reference documents at module init
const cmsReferenceDocuments = ((): CmsReferenceDocument[] => {
  const results: CmsReferenceDocument[] = [];
  const source =
    "data/strapi-mock/dashboard/documentation/cms-reference/*.json";

  dataLogger.loadStart("cms-reference", source);

  for (const doc of rawDocuments) {
    try {
      const validated = CmsReferenceDocumentSchema.parse(doc);
      results.push(validated);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      dataLogger.validationError(
        "cms-reference",
        (doc as any).meta?.slug || "unknown",
        [errorMsg],
      );
      throw new Error(
        `CMS reference validation failed for ${(doc as any).meta?.slug}: ${errorMsg}`,
      );
    }
  }

  dataLogger.loadComplete("cms-reference", results.length, source);
  dataLogger.validationSuccess("cms-reference", results.length);
  return results;
})();

/**
 * Get all CMS reference documents
 */
export function getCmsReferenceList(): CmsReferenceDocument[] {
  return cmsReferenceDocuments;
}

/**
 * Get a single CMS reference document by slug
 */
export function getCmsReferenceDocument(
  slug: string,
): CmsReferenceDocument | null {
  return cmsReferenceDocuments.find((d) => d.meta.slug === slug) ?? null;
}

/**
 * Get all CMS reference slugs for static generation
 */
export function getAllCmsReferenceSlugs(): string[] {
  return cmsReferenceDocuments.map((d) => d.meta.slug);
}

/**
 * Get CMS reference documents filtered by audience
 */
export function getCmsReferenceByAudience(
  audience: string,
): CmsReferenceDocument[] {
  return cmsReferenceDocuments.filter((d) => d.meta.audience === audience);
}
