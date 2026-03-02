import "server-only";
import {
  AppReferenceDocumentSchema,
  type AppReferenceDocument,
} from "./app-reference-schema";
import { dataLogger } from "@/lib/utils/arch-logger";

// Import all app reference JSON files
import componentSystemDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/component-system.json";
import serverVsClientDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/server-vs-client.json";
import hydrationAndGuardsDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/hydration-and-guards.json";

/**
 * App Reference Content Builder
 *
 * Loads app reference documentation from JSON files at module initialization.
 * This follows the content-library pattern established by article-content-builder.ts
 */

const rawDocuments = [
  componentSystemDoc,
  serverVsClientDoc,
  hydrationAndGuardsDoc,
] as const;

// Validate and load all app reference documents at module init
const appReferenceDocuments = ((): AppReferenceDocument[] => {
  const results: AppReferenceDocument[] = [];
  const source =
    "data/strapi-mock/dashboard/documentation/app-reference/*.json";

  dataLogger.loadStart("app-reference", source);

  for (const doc of rawDocuments) {
    try {
      const validated = AppReferenceDocumentSchema.parse(doc);
      results.push(validated);
    } catch (e) {
      const errorMsg = e instanceof Error ? e.message : String(e);
      dataLogger.validationError(
        "app-reference",
        (doc as any).meta?.slug || "unknown",
        [errorMsg],
      );
      throw new Error(
        `App reference validation failed for ${(doc as any).meta?.slug}: ${errorMsg}`,
      );
    }
  }

  dataLogger.loadComplete("app-reference", results.length, source);
  dataLogger.validationSuccess("app-reference", results.length);
  return results;
})();

/**
 * Get all app reference documents
 */
export function getAppReferenceList(): AppReferenceDocument[] {
  return appReferenceDocuments;
}

/**
 * Get a single app reference document by slug
 */
export function getAppReferenceDocument(
  slug: string,
): AppReferenceDocument | null {
  return appReferenceDocuments.find((d) => d.meta.slug === slug) ?? null;
}

/**
 * Get all app reference slugs for static generation
 */
export function getAllAppReferenceSlugs(): string[] {
  return appReferenceDocuments.map((d) => d.meta.slug);
}

/**
 * Get app reference documents filtered by audience
 */
export function getAppReferenceByAudience(
  audience: string,
): AppReferenceDocument[] {
  return appReferenceDocuments.filter((d) => d.meta.audience === audience);
}
