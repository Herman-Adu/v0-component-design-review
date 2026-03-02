import "server-only";
import {
  getInfrastructureOpsList,
  getInfrastructureOpsDocument,
  getAllInfrastructureOpsSlugs,
  getInfrastructureOpsByAudience,
} from "./infrastructure-ops-content-builder";
import { repoLogger } from "@/lib/utils/arch-logger";
import type { InfrastructureOpsDocument } from "./infrastructure-ops-schema";

/**
 * Infrastructure & Ops Repository
 *
 * Data access layer with query logging for infrastructure and operations documentation.
 * Follows the repository pattern established by article-repository.ts
 */

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
