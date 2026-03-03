/**
 * CMS Reference Repository
 *
 * Data access layer with query logging for CMS reference documentation.
 * Implements IBaseRepository pattern for consistent method signatures.
 *
 * Authority: ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import "server-only";
import {
  getCmsReferenceList,
  getCmsReferenceDocument,
  getAllCmsReferenceSlugs,
  getCmsReferenceByAudience,
} from "./cms-reference-content-builder";
import { repoLogger } from "@/lib/utils/arch-logger";
import type { CmsReferenceDocument } from "./cms-reference-schema";

export interface CmsReferenceRecord {
  document: CmsReferenceDocument;
  content: CmsReferenceDocument;
}

/**
 * List all CMS reference documents
 */
export function listCmsReference(): CmsReferenceDocument[] {
  repoLogger.queryStart("cms-reference-repository", "listCmsReference");
  const result = getCmsReferenceList();
  repoLogger.queryComplete(
    "cms-reference-repository",
    "listCmsReference",
    result.length,
  );
  return result;
}

/**
 * Get all CMS reference slugs for static generation
 */
export function listCmsReferenceSlugs(): string[] {
  repoLogger.queryStart("cms-reference-repository", "listCmsReferenceSlugs");
  const result = getAllCmsReferenceSlugs();
  repoLogger.queryComplete(
    "cms-reference-repository",
    "listCmsReferenceSlugs",
    result.length,
  );
  return result;
}

/**
 * Get a CMS reference document by slug
 * Returns null if not found
 */
export function getCmsReferenceRecordBySlug(
  slug: string,
): CmsReferenceRecord | null {
  repoLogger.queryStart(
    "cms-reference-repository",
    "getCmsReferenceRecordBySlug",
    { slug },
  );

  const document = getCmsReferenceDocument(slug);

  if (!document) {
    repoLogger.queryComplete(
      "cms-reference-repository",
      "getCmsReferenceRecordBySlug",
      0,
    );
    return null;
  }

  repoLogger.queryComplete(
    "cms-reference-repository",
    "getCmsReferenceRecordBySlug",
    1,
  );

  return {
    document,
    content: document,
  };
}

/**
 * Filter CMS reference documents by audience
 */
export function listCmsReferenceByAudience(
  audience: string,
): CmsReferenceDocument[] {
  repoLogger.queryStart(
    "cms-reference-repository",
    "listCmsReferenceByAudience",
    { audience },
  );
  const result = getCmsReferenceByAudience(audience);
  repoLogger.queryComplete(
    "cms-reference-repository",
    "listCmsReferenceByAudience",
    result.length,
  );
  return result;
}

/**
 * List CMS reference by category (optional extension)
 * Provided for consistency with content-library repositories
 * Returns filtered array of CMS reference matching category
 */
export function listCmsReferenceByCategory(
  category: string,
): CmsReferenceDocument[] {
  // Documentation uses audience filtering; category is a no-op stub
  return listCmsReference();
}

/**
 * List CMS reference by level (optional extension)
 * Provided for consistency with content-library repositories
 * Returns filtered array of CMS reference matching level
 */
export function listCmsReferenceByLevel(level: string): CmsReferenceDocument[] {
  // Documentation doesn't use level filtering; this is a no-op stub
  return listCmsReference();
}
