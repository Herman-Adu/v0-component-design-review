/**
 * App Reference Repository
 *
 * Data access layer with query logging for app reference documentation.
 * Implements IBaseRepository pattern for consistent method signatures.
 *
 * Authority: ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import "server-only";
import {
  getAppReferenceList,
  getAppReferenceDocument,
  getAllAppReferenceSlugs,
  getAppReferenceByAudience,
} from "./app-reference-content-builder";
import { repoLogger } from "@/lib/utils/arch-logger";
import type { AppReferenceDocument } from "./app-reference-schema";

export interface AppReferenceRecord {
  document: AppReferenceDocument;
  content: AppReferenceDocument;
}

/**
 * List all app reference documents
 */
export async function listAppReference(): Promise<AppReferenceDocument[]> {
  const result = await getAppReferenceList();
  repoLogger.queryComplete(
    "app-reference-repository",
    "listAppReference",
    result.length,
  );
  return result;
}

/**
 * Get all app reference slugs for static generation
 */
export async function listAppReferenceSlugs(): Promise<string[]> {
  const result = await getAllAppReferenceSlugs();
  repoLogger.queryComplete(
    "app-reference-repository",
    "listAppReferenceSlugs",
    result.length,
  );
  return result;
}

/**
 * Get an app reference document by slug
 * Returns null if not found
 */
export async function getAppReferenceRecordBySlug(
  slug: string,
): Promise<AppReferenceRecord | null> {
  repoLogger.queryStart(
    "app-reference-repository",
    "getAppReferenceRecordBySlug",
    { slug },
  );

  const document = await getAppReferenceDocument(slug);

  if (!document) {
    repoLogger.queryComplete(
      "app-reference-repository",
      "getAppReferenceRecordBySlug",
      0,
    );
    return null;
  }

  repoLogger.queryComplete(
    "app-reference-repository",
    "getAppReferenceRecordBySlug",
    1,
  );

  return {
    document,
    content: document,
  };
}

/**
 * Filter app reference documents by audience
 */
export async function listAppReferenceByAudience(
  audience: string,
): Promise<AppReferenceDocument[]> {
  repoLogger.queryStart(
    "app-reference-repository",
    "listAppReferenceByAudience",
    { audience },
  );
  const result = await getAppReferenceByAudience(audience);
  repoLogger.queryComplete(
    "app-reference-repository",
    "listAppReferenceByAudience",
    result.length,
  );
  return result;
}

/**
 * List app reference by category (stub — documentation uses audience filtering)
 */
export async function listAppReferenceByCategory(
  _category: string,
): Promise<AppReferenceDocument[]> {
  return listAppReference();
}

/**
 * List app reference by level (stub — documentation does not use level filtering)
 */
export async function listAppReferenceByLevel(
  _level: string,
): Promise<AppReferenceDocument[]> {
  return listAppReference();
}
