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
export async function listInfrastructureOps(): Promise<
  InfrastructureOpsDocument[]
> {
  const result = await getInfrastructureOpsList();
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
export async function listInfrastructureOpsSlugs(): Promise<string[]> {
  const result = await getAllInfrastructureOpsSlugs();
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
export async function getInfrastructureOpsRecordBySlug(
  slug: string,
): Promise<InfrastructureOpsRecord | null> {
  repoLogger.queryStart(
    "infrastructure-ops-repository",
    "getInfrastructureOpsRecordBySlug",
    { slug },
  );

  const document = await getInfrastructureOpsDocument(slug);

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
export async function listInfrastructureOpsByAudience(
  audience: string,
): Promise<InfrastructureOpsDocument[]> {
  repoLogger.queryStart(
    "infrastructure-ops-repository",
    "listInfrastructureOpsByAudience",
    { audience },
  );
  const result = await getInfrastructureOpsByAudience(audience);
  repoLogger.queryComplete(
    "infrastructure-ops-repository",
    "listInfrastructureOpsByAudience",
    result.length,
  );
  return result;
}

/**
 * List infrastructure ops by category (stub — documentation uses audience filtering)
 */
export async function listInfrastructureOpsByCategory(
  _category: string,
): Promise<InfrastructureOpsDocument[]> {
  return listInfrastructureOps();
}

/**
 * List infrastructure ops by level (stub — documentation does not use level filtering)
 */
export async function listInfrastructureOpsByLevel(
  _level: string,
): Promise<InfrastructureOpsDocument[]> {
  return listInfrastructureOps();
}
