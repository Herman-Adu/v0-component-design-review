import "server-only";
import {
  getAppReferenceList,
  getAppReferenceDocument,
  getAllAppReferenceSlugs,
  getAppReferenceByAudience,
} from "./app-reference-content-builder";
import { repoLogger } from "@/lib/utils/arch-logger";
import type { AppReferenceDocument } from "./app-reference-schema";

/**
 * App Reference Repository
 *
 * Data access layer with query logging for app reference documentation.
 * Follows the repository pattern established by article-repository.ts
 */

export interface AppReferenceRecord {
  document: AppReferenceDocument;
  content: AppReferenceDocument;
}

/**
 * List all app reference documents
 */
export function listAppReference(): AppReferenceDocument[] {
  repoLogger.queryStart("app-reference-repository", "listAppReference");
  const result = getAppReferenceList();
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
export function listAppReferenceSlugs(): string[] {
  repoLogger.queryStart("app-reference-repository", "listAppReferenceSlugs");
  const result = getAllAppReferenceSlugs();
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
export function getAppReferenceRecordBySlug(
  slug: string,
): AppReferenceRecord | null {
  repoLogger.queryStart(
    "app-reference-repository",
    "getAppReferenceRecordBySlug",
    { slug },
  );

  const document = getAppReferenceDocument(slug);

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
export function listAppReferenceByAudience(
  audience: string,
): AppReferenceDocument[] {
  repoLogger.queryStart(
    "app-reference-repository",
    "listAppReferenceByAudience",
    { audience },
  );
  const result = getAppReferenceByAudience(audience);
  repoLogger.queryComplete(
    "app-reference-repository",
    "listAppReferenceByAudience",
    result.length,
  );
  return result;
}
