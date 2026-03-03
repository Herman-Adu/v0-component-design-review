import "server-only";
import {
  StrategicOverviewDocumentSchema,
  type StrategicOverviewDocument,
} from "./strategic-overview-schema";
import { dataLogger } from "@/lib/utils/arch-logger";

// Import all strategic overview JSON files
import systemVisionDoc from "@/data/strapi-mock/dashboard/documentation/strategic-overview/system-vision.json";
import whyStrapiDoc from "@/data/strapi-mock/dashboard/documentation/strategic-overview/why-strapi.json";
import gettingStartedDoc from "@/data/strapi-mock/dashboard/documentation/strategic-overview/getting-started-overview.json";
import overviewDoc from "@/data/strapi-mock/dashboard/documentation/strategic-overview/overview.json";
import appOverviewDoc from "@/data/strapi-mock/dashboard/documentation/strategic-overview/app-overview.json";
import codeReviewLogDoc from "@/data/strapi-mock/dashboard/documentation/strategic-overview/code-review-log.json";

/**
 * Strategic Overview Content Builder
 *
 * Loads strategic overview documentation from JSON files at module initialization.
 * This follows the content-library pattern established by article-content-builder.ts
 */

// Raw JSON imports that need validation
const rawDocuments = [
  systemVisionDoc,
  whyStrapiDoc,
  gettingStartedDoc,
  overviewDoc,
  appOverviewDoc,
  codeReviewLogDoc,
] as const;

// Validate and load all strategic overview documents at module init
const strategicOverviewDocuments = ((): StrategicOverviewDocument[] => {
  const results: StrategicOverviewDocument[] = [];
  const source =
    "data/strapi-mock/dashboard/documentation/strategic-overview/*.json";

  dataLogger.loadStart("strategic-overview", source);

  for (const doc of rawDocuments) {
    const result = StrategicOverviewDocumentSchema.safeParse(doc);
    if (!result.success) {
      const slug = doc.meta.slug;
      const issues = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(" | ");
      dataLogger.validationError("strategic-overview", slug, [issues]);
      throw new Error(
        `Strategic overview validation failed for "${slug}": ${issues}`,
      );
    }
    results.push(result.data);
  }

  dataLogger.loadComplete("strategic-overview", results.length, source);
  dataLogger.validationSuccess("strategic-overview", results.length);
  return results;
})();

/**
 * Get all strategic overview documents
 */
export function getStrategicOverviewList(): StrategicOverviewDocument[] {
  return strategicOverviewDocuments;
}

/**
 * Get a single strategic overview document by slug
 */
export function getStrategicOverviewDocument(
  slug: string,
): StrategicOverviewDocument | null {
  return strategicOverviewDocuments.find((d) => d.meta.slug === slug) ?? null;
}

/**
 * Get all strategic overview slugs for static generation
 */
export function getAllStrategicOverviewSlugs(): string[] {
  return strategicOverviewDocuments.map((d) => d.meta.slug);
}

/**
 * Get strategic overview documents filtered by audience
 */
export function getStrategicOverviewByAudience(
  audience: string,
): StrategicOverviewDocument[] {
  return strategicOverviewDocuments.filter((d) => d.meta.audience === audience);
}
