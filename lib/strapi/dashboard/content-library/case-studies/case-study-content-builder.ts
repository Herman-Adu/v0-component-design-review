import { caseStudyContentDocumentSchema } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-schema";
import { dataLogger } from "@/lib/utils/arch-logger";

// Import all case study JSON files
import clientToServerArticle from "@/data/strapi-mock/dashboard/content-library/case-studies/performance/client-to-server-components.json";
import formValidationArticle from "@/data/strapi-mock/dashboard/content-library/case-studies/security/form-validation-refactor.json";
import securityLayerCaseStudy from "@/data/strapi-mock/dashboard/content-library/case-studies/security/security-layer-implementation.json";
import securityLayerCase from "@/data/strapi-mock/dashboard/content-library/case-studies/security/security-layer.json";
import rateLimitingBypass from "@/data/strapi-mock/dashboard/content-library/case-studies/security/rate-limiting-bypass-to-production.json";
import stateManagementArticle from "@/data/strapi-mock/dashboard/content-library/case-studies/architecture/state-management-evolution.json";
import emailConsolidationCaseStudy from "@/data/strapi-mock/dashboard/content-library/case-studies/architecture/email-system-consolidation.json";
import hydrationGuardPattern from "@/data/strapi-mock/dashboard/content-library/case-studies/architecture/hydration-guard-pattern.json";
import documentationEvolution from "@/data/strapi-mock/dashboard/content-library/case-studies/architecture/documentation-evolution.json";
import multiStepFormCaseStudy from "@/data/strapi-mock/dashboard/content-library/case-studies/forms/multi-step-form-prototype-to-production.json";
import multiStepForm from "@/data/strapi-mock/dashboard/content-library/case-studies/forms/multi-step-form.json";
import edgeCacheRolloutCaseStudy from "@/data/strapi-mock/dashboard/content-library/case-studies/rendering/choosing-rendering-strategy-per-page.json";
import edgeCacheRollout from "@/data/strapi-mock/dashboard/content-library/case-studies/rendering/edge-cache-rollout.json";
import enterpriseCmsMigration from "@/data/strapi-mock/dashboard/content-library/case-studies/business/enterprise-cms-migration.json";
import costReductionArchitecture from "@/data/strapi-mock/dashboard/content-library/case-studies/business/cost-reduction-architecture.json";
import developerProductivity from "@/data/strapi-mock/dashboard/content-library/case-studies/business/developer-productivity-gains.json";
import strapiMultiSite from "@/data/strapi-mock/dashboard/content-library/case-studies/cms/strapi-multi-site-architecture.json";
import sidebarRefactor from "@/data/strapi-mock/dashboard/content-library/case-studies/refactoring/sidebar-refactor-430-lines-to-data-driven.json";
import tarballDuplicate from "@/data/strapi-mock/dashboard/content-library/case-studies/infrastructure/tarball-duplicate-entry-build-failure.json";
import emailConsolidation from "@/data/strapi-mock/dashboard/content-library/case-studies/infrastructure/email-consolidation.json";

export type CaseStudyLevel = "beginner" | "intermediate" | "advanced";
export type CaseStudyCategory =
  | "refactoring"
  | "performance"
  | "security"
  | "architecture"
  | "business"
  | "cms"
  | "infrastructure"
  | "rendering"
  | "forms";

export interface CaseStudyContentBlock {
  type: string;
  atomicLevel?: "atom" | "molecule" | "organism";
  props?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface CaseStudyContentMeta {
  slug: string;
  title: string;
  excerpt: string;
  level: CaseStudyLevel;
  category: CaseStudyCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export interface CaseStudyContentDocument {
  meta: CaseStudyContentMeta;
  layout: "content-with-toc" | "content-only";
  toc?: Array<{ id: string; title: string; level: number }>;
  blocks: CaseStudyContentBlock[];
}

/**
 * Case Study list item generated from content metadata
 */
export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: CaseStudyLevel;
  category: CaseStudyCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
  blocks: CaseStudyContentBlock[];
}

// Case study content registry - maps slugs to JSON documents
const caseStudyContentRegistry: Record<string, CaseStudyContentDocument> = {
  "client-to-server-components":
    clientToServerArticle as CaseStudyContentDocument,
  "form-validation-refactor": formValidationArticle as CaseStudyContentDocument,
  "security-layer-implementation":
    securityLayerCaseStudy as CaseStudyContentDocument,
  "security-layer": securityLayerCase as CaseStudyContentDocument,
  "rate-limiting-bypass-to-production":
    rateLimitingBypass as CaseStudyContentDocument,
  "state-management-evolution":
    stateManagementArticle as CaseStudyContentDocument,
  "email-system-consolidation":
    emailConsolidationCaseStudy as CaseStudyContentDocument,
  "hydration-guard-pattern": hydrationGuardPattern as CaseStudyContentDocument,
  "documentation-evolution": documentationEvolution as CaseStudyContentDocument,
  "multi-step-form-prototype-to-production":
    multiStepFormCaseStudy as CaseStudyContentDocument,
  "multi-step-form": multiStepForm as CaseStudyContentDocument,
  "choosing-rendering-strategy-per-page":
    edgeCacheRolloutCaseStudy as CaseStudyContentDocument,
  "edge-cache-rollout": edgeCacheRollout as CaseStudyContentDocument,
  "enterprise-cms-migration":
    enterpriseCmsMigration as CaseStudyContentDocument,
  "cost-reduction-architecture":
    costReductionArchitecture as CaseStudyContentDocument,
  "developer-productivity-gains":
    developerProductivity as CaseStudyContentDocument,
  "strapi-multi-site-architecture": strapiMultiSite as CaseStudyContentDocument,
  "sidebar-refactor-430-lines-to-data-driven":
    sidebarRefactor as CaseStudyContentDocument,
  "tarball-duplicate-entry-build-failure":
    tarballDuplicate as CaseStudyContentDocument,
  "email-consolidation": emailConsolidation as CaseStudyContentDocument,
};

// Validate all case studies on import
dataLogger.loadStart(
  "case-studies",
  "data/strapi-mock/.../case-studies/*.json",
);
const validatedCaseStudyContentRegistry = Object.fromEntries(
  Object.entries(caseStudyContentRegistry).map(([slug, document]) => {
    const result = caseStudyContentDocumentSchema.safeParse(document);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError("case-study", slug, issues.split(" | "));
      throw new Error(`Invalid case study content for "${slug}": ${issues}`);
    }
    return [slug, result.data as CaseStudyContentDocument];
  }),
) as Record<string, CaseStudyContentDocument>;
dataLogger.loadComplete(
  "case-studies",
  Object.keys(validatedCaseStudyContentRegistry).length,
  "data/strapi-mock/.../case-studies/*.json",
);
dataLogger.validationSuccess(
  "case-studies",
  Object.keys(validatedCaseStudyContentRegistry).length,
);

/**
 * Generates the case study list from content metadata
 */
function generateCaseStudyList(): CaseStudy[] {
  return Object.entries(validatedCaseStudyContentRegistry)
    .map(([slug, document], index) => ({
      id: String(index + 1),
      slug: document.meta.slug,
      title: document.meta.title,
      excerpt: document.meta.excerpt,
      level: document.meta.level,
      category: document.meta.category,
      readTime: document.meta.readTime,
      publishedAt: document.meta.publishedAt,
      tags: document.meta.tags,
      blocks: document.blocks,
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

/**
 * Cached case study list - generated once on server startup
 */
let cachedCaseStudyList: CaseStudy[] | null = null;

/**
 * Get all case studies
 */
export function getCaseStudyList(): CaseStudy[] {
  if (!cachedCaseStudyList) {
    cachedCaseStudyList = generateCaseStudyList();
  }
  return cachedCaseStudyList;
}

/**
 * Get a case study content document by slug
 */
export function getCaseStudyContentDocument(
  slug: string,
): CaseStudyContentDocument | null {
  return validatedCaseStudyContentRegistry[slug] ?? null;
}

/**
 * Get all case study content slugs
 */
export function getAllCaseStudyContentSlugs(): string[] {
  return Object.keys(validatedCaseStudyContentRegistry);
}
