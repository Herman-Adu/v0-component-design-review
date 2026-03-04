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
export async function listCmsReference(): Promise<CmsReferenceDocument[]> {
  const result = await getCmsReferenceList();
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
export async function listCmsReferenceSlugs(): Promise<string[]> {
  const result = await getAllCmsReferenceSlugs();
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
export async function getCmsReferenceRecordBySlug(
  slug: string,
): Promise<CmsReferenceRecord | null> {
  repoLogger.queryStart(
    "cms-reference-repository",
    "getCmsReferenceRecordBySlug",
    { slug },
  );

  const document = await getCmsReferenceDocument(slug);

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
export async function listCmsReferenceByAudience(
  audience: string,
): Promise<CmsReferenceDocument[]> {
  repoLogger.queryStart(
    "cms-reference-repository",
    "listCmsReferenceByAudience",
    { audience },
  );
  const result = await getCmsReferenceByAudience(audience);
  repoLogger.queryComplete(
    "cms-reference-repository",
    "listCmsReferenceByAudience",
    result.length,
  );
  return result;
}

/**
 * List CMS reference by category (stub — documentation uses audience filtering)
 */
export async function listCmsReferenceByCategory(
  _category: string,
): Promise<CmsReferenceDocument[]> {
  return listCmsReference();
}

/**
 * List CMS reference by level (stub — documentation does not use level filtering)
 */
export async function listCmsReferenceByLevel(
  _level: string,
): Promise<CmsReferenceDocument[]> {
  return listCmsReference();
}
