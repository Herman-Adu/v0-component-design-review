import "server-only";
import {
  AppReferenceDocumentSchema,
  type AppReferenceDocument,
} from "./app-reference-schema";
import { dataLogger } from "@/lib/utils/arch-logger";

// Import all app reference JSON files
import componentSystemDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/component-system.json";
import emailSystemDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/email-system.json";
import gettingStartedDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/getting-started.json";
import hydrationAndGuardsDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/hydration-and-guards.json";
import overviewDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/overview.json";
import performanceAndCachingDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/performance-and-caching.json";
import securityArchitectureDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/security-architecture.json";
import serverActionsAndApiDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/server-actions-and-api.json";
import serverVsClientDoc from "@/data/strapi-mock/dashboard/documentation/app-reference/server-vs-client.json";

/**
 * App Reference Content Builder
 *
 * Loads app reference documentation from JSON files at module initialization.
 * This follows the content-library pattern established by article-content-builder.ts
 */

const rawDocuments = [
  componentSystemDoc,
  emailSystemDoc,
  gettingStartedDoc,
  hydrationAndGuardsDoc,
  overviewDoc,
  performanceAndCachingDoc,
  securityArchitectureDoc,
  serverActionsAndApiDoc,
  serverVsClientDoc,
] as const;

// Validate and load all app reference documents at module init
const appReferenceDocuments = ((): AppReferenceDocument[] => {
  const results: AppReferenceDocument[] = [];
  const source =
    "data/strapi-mock/dashboard/documentation/app-reference/*.json";

  dataLogger.loadStart("app-reference", source);

  for (const doc of rawDocuments) {
    const result = AppReferenceDocumentSchema.safeParse(doc);
    if (!result.success) {
      const slug = doc.meta.slug;
      const issues = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(" | ");
      dataLogger.validationError("app-reference", slug, [issues]);
      throw new Error(
        `App reference validation failed for "${slug}": ${issues}`,
      );
    }
    results.push(result.data);
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
