/**
 * Infrastructure & Ops Repository
 *
 * Data access layer with query logging for infrastructure and operations documentation.
 * Implements IBaseRepository pattern for consistent method signatures.
 *
 * Authority: ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import "server-only";
import {
  getInfrastructureOpsList,
  getInfrastructureOpsDocument,
  getAllInfrastructureOpsSlugs,
  getInfrastructureOpsByAudience,
} from "./infrastructure-ops-content-builder";
import { repoLogger } from "@/lib/utils/arch-logger";
import type { InfrastructureOpsDocument } from "./infrastructure-ops-schema";

export interface InfrastructureOpsRecord {
  document: InfrastructureOpsDocument;
  content: InfrastructureOpsDocument;
}

/**
 * List all infrastructure ops documents
 */
export function listInfrastructureOps(): InfrastructureOpsDocument[] {
  repoLogger.queryStart(
    "infrastructure-ops-repository",
    "listInfrastructureOps",
  );
  const result = getInfrastructureOpsList();
  repoLogger.queryComplete(
    "infrastructure-ops-repository",
    "listInfrastructureOps",
    result.length,
  );
  return result;
}

/**
 * Get all infrastructure ops slugs for static generation
 */
export function listInfrastructureOpsSlugs(): string[] {
  repoLogger.queryStart(
    "infrastructure-ops-repository",
    "listInfrastructureOpsSlugs",
  );
  const result = getAllInfrastructureOpsSlugs();
  repoLogger.queryComplete(
    "infrastructure-ops-repository",
    "listInfrastructureOpsSlugs",
    result.length,
  );
  return result;
}

/**
 * Get an infrastructure ops document by slug
 * Returns null if not found
 */
export function getInfrastructureOpsRecordBySlug(
  slug: string,
): InfrastructureOpsRecord | null {
  repoLogger.queryStart(
    "infrastructure-ops-repository",
    "getInfrastructureOpsRecordBySlug",
    { slug },
  );

  const document = getInfrastructureOpsDocument(slug);

  if (!document) {
    repoLogger.queryComplete(
      "infrastructure-ops-repository",
      "getInfrastructureOpsRecordBySlug",
      0,
    );
    return null;
  }

  repoLogger.queryComplete(
    "infrastructure-ops-repository",
    "getInfrastructureOpsRecordBySlug",
    1,
  );

  return {
    document,
    content: document,
  };
}

/**
 * Filter infrastructure ops documents by audience
 */
export function listInfrastructureOpsByAudience(
  audience: string,
): InfrastructureOpsDocument[] {
  repoLogger.queryStart(
    "infrastructure-ops-repository",
    "listInfrastructureOpsByAudience",
    { audience },
  );
  const result = getInfrastructureOpsByAudience(audience);
  repoLogger.queryComplete(
    "infrastructure-ops-repository",
    "listInfrastructureOpsByAudience",
    result.length,
  );
  return result;
}

/**
 * List infrastructure ops by category (optional extension)
 * Provided for consistency with content-library repositories
 * Returns filtered array of infrastructure ops matching category
 */
export function listInfrastructureOpsByCategory(
  category: string,
): InfrastructureOpsDocument[] {
  // Documentation uses audience filtering; category is a no-op stub
  return listInfrastructureOps();
}

/**
 * List infrastructure ops by level (optional extension)
 * Provided for consistency with content-library repositories
 * Returns filtered array of infrastructure ops matching level
 */
export function listInfrastructureOpsByLevel(
  level: string,
): InfrastructureOpsDocument[] {
  // Documentation doesn't use level filtering; this is a no-op stub
  return listInfrastructureOps();
}
