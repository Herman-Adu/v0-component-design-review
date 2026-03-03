/**
 * Strategic Overview Repository
 *
 * Data access layer with query logging for strategic overview documentation.
 * Implements IBaseRepository pattern for consistent method signatures.
 *
 * Authority: ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import "server-only";
import {
  getStrategicOverviewList,
  getStrategicOverviewDocument,
  getAllStrategicOverviewSlugs,
  getStrategicOverviewByAudience,
} from "./strategic-overview-content-builder";
import { repoLogger } from "@/lib/utils/arch-logger";
import type { StrategicOverviewDocument } from "./strategic-overview-schema";

export interface StrategicOverviewRecord {
  document: StrategicOverviewDocument;
  content: StrategicOverviewDocument; // Full content document with blocks
}

/**
 * List all strategic overview documents
 */
export function listStrategicOverview(): StrategicOverviewDocument[] {
  const result = getStrategicOverviewList();
  repoLogger.queryComplete(
    "StrategicOverviewRepository",
    "listStrategicOverview",
    result.length,
  );
  return result;
}

/**
 * Get all strategic overview slugs for static generation
 */
export function listStrategicOverviewSlugs(): string[] {
  const result = getAllStrategicOverviewSlugs();
  repoLogger.queryComplete(
    "StrategicOverviewRepository",
    "listStrategicOverviewSlugs",
    result.length,
  );
  return result;
}

/**
 * Get a strategic overview document by slug
 * Returns null if not found
 */
export function getStrategicOverviewRecordBySlug(
  slug: string,
): StrategicOverviewRecord | null {
  repoLogger.queryStart(
    "StrategicOverviewRepository",
    "getStrategicOverviewRecordBySlug",
    { slug },
  );

  const document = getStrategicOverviewDocument(slug);

  if (!document) {
    repoLogger.queryComplete(
      "StrategicOverviewRepository",
      "getStrategicOverviewRecordBySlug",
      null,
    );
    return null;
  }

  repoLogger.queryComplete(
    "StrategicOverviewRepository",
    "getStrategicOverviewRecordBySlug",
    1,
  );
  return {
    document,
    content: document,
  };
}

/**
 * Filter strategic overview documents by audience
 */
export function listStrategicOverviewByAudience(
  audience: string,
): StrategicOverviewDocument[] {
  repoLogger.queryStart(
    "StrategicOverviewRepository",
    "listStrategicOverviewByAudience",
    { audience },
  );
  const result = getStrategicOverviewByAudience(audience);
  repoLogger.queryComplete(
    "StrategicOverviewRepository",
    "listStrategicOverviewByAudience",
    result.length,
  );
  return result;
}

/**
 * List strategic overview by category (optional extension)
 * Provided for consistency with content-library repositories
 * Returns filtered array of strategic overview matching category
 */
export function listStrategicOverviewByCategory(
  category: string,
): StrategicOverviewDocument[] {
  // Documentation uses audience filtering; category is a no-op stub
  return listStrategicOverview();
}

/**
 * List strategic overview by level (optional extension)
 * Provided for consistency with content-library repositories
 * Returns filtered array of strategic overview matching level
 */
export function listStrategicOverviewByLevel(
  level: string,
): StrategicOverviewDocument[] {
  // Documentation doesn't use level filtering; this is a no-op stub
  return listStrategicOverview();
}
