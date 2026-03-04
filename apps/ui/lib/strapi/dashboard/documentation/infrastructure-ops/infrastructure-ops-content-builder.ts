import "server-only";
import {
  InfrastructureOpsDocumentSchema,
  type InfrastructureOpsDocument,
} from "./infrastructure-ops-schema";
import { dataLogger } from "@/lib/utils/arch-logger";

// Import all infrastructure ops JSON files
import apiAndGraphqlDoc from "@/data/strapi-mock/dashboard/documentation/infrastructure-ops/api-and-graphql.json";
import cmsOperationsDoc from "@/data/strapi-mock/dashboard/documentation/infrastructure-ops/cms-operations.json";
import deploymentPipelinesDoc from "@/data/strapi-mock/dashboard/documentation/infrastructure-ops/deployment-pipelines.json";
import gettingStartedDoc from "@/data/strapi-mock/dashboard/documentation/infrastructure-ops/getting-started.json";
import overviewDoc from "@/data/strapi-mock/dashboard/documentation/infrastructure-ops/overview.json";
import testingStrategyDoc from "@/data/strapi-mock/dashboard/documentation/infrastructure-ops/testing-strategy.json";
import troubleshootingDoc from "@/data/strapi-mock/dashboard/documentation/infrastructure-ops/troubleshooting.json";

/**
 * Infrastructure & Ops Content Builder
 *
 * Loads infrastructure and operations documentation from JSON files at module initialization.
 * This follows the content-library pattern established by article-content-builder.ts
 */

const rawDocuments = [
  apiAndGraphqlDoc,
  cmsOperationsDoc,
  deploymentPipelinesDoc,
  gettingStartedDoc,
  overviewDoc,
  testingStrategyDoc,
  troubleshootingDoc,
] as const;

// Validate and load all infrastructure ops documents at module init
const infrastructureOpsDocuments = ((): InfrastructureOpsDocument[] => {
  const results: InfrastructureOpsDocument[] = [];
  const source =
    "data/strapi-mock/dashboard/documentation/infrastructure-ops/*.json";

  dataLogger.loadStart("infrastructure-ops", source);

  for (const doc of rawDocuments) {
    const result = InfrastructureOpsDocumentSchema.safeParse(doc);
    if (!result.success) {
      const slug = doc.meta.slug;
      const issues = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(" | ");
      dataLogger.validationError("infrastructure-ops", slug, [issues]);
      throw new Error(
        `Infrastructure ops validation failed for "${slug}": ${issues}`,
      );
    }
    results.push(result.data);
  }

  dataLogger.loadComplete("infrastructure-ops", results.length, source);
  dataLogger.validationSuccess("infrastructure-ops", results.length);
  return results;
})();

/**
 * Get all infrastructure ops documents
 */
export function getInfrastructureOpsList(): InfrastructureOpsDocument[] {
  return infrastructureOpsDocuments;
}

/**
 * Get a single infrastructure ops document by slug
 */
export function getInfrastructureOpsDocument(
  slug: string,
): InfrastructureOpsDocument | null {
  return infrastructureOpsDocuments.find((d) => d.meta.slug === slug) ?? null;
}

/**
 * Get all infrastructure ops slugs for static generation
 */
export function getAllInfrastructureOpsSlugs(): string[] {
  return infrastructureOpsDocuments.map((d) => d.meta.slug);
}

/**
 * Get infrastructure ops documents filtered by audience
 */
export function getInfrastructureOpsByAudience(
  audience: string,
): InfrastructureOpsDocument[] {
  return infrastructureOpsDocuments.filter((d) => d.meta.audience === audience);
}
