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
export async function listStrategicOverview(): Promise<
  StrategicOverviewDocument[]
> {
  const result = await getStrategicOverviewList();
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
export async function listStrategicOverviewSlugs(): Promise<string[]> {
  const result = await getAllStrategicOverviewSlugs();
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
export async function getStrategicOverviewRecordBySlug(
  slug: string,
): Promise<StrategicOverviewRecord | null> {
  repoLogger.queryStart(
    "StrategicOverviewRepository",
    "getStrategicOverviewRecordBySlug",
    { slug },
  );

  const document = await getStrategicOverviewDocument(slug);

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
export async function listStrategicOverviewByAudience(
  audience: string,
): Promise<StrategicOverviewDocument[]> {
  repoLogger.queryStart(
    "StrategicOverviewRepository",
    "listStrategicOverviewByAudience",
    { audience },
  );
  const result = await getStrategicOverviewByAudience(audience);
  repoLogger.queryComplete(
    "StrategicOverviewRepository",
    "listStrategicOverviewByAudience",
    result.length,
  );
  return result;
}

/**
 * List strategic overview by category (stub — documentation uses audience filtering)
 */
export async function listStrategicOverviewByCategory(
  _category: string,
): Promise<StrategicOverviewDocument[]> {
  return listStrategicOverview();
}

/**
 * List strategic overview by level (stub — documentation does not use level filtering)
 */
export async function listStrategicOverviewByLevel(
  _level: string,
): Promise<StrategicOverviewDocument[]> {
  return listStrategicOverview();
}
