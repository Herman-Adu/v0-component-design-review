import "server-only";

import type { TOCItem } from "@/components/molecules/article-components";
import { caseStudyContentDocumentSchema } from "@/lib/strapi/case-study-schema";
import clientToServerArticle from "@/data/strapi-mock/dashboard/case-studies/performance/client-to-server-components.json";
import formValidationArticle from "@/data/strapi-mock/dashboard/case-studies/security/form-validation-refactor.json";
import securityLayerCaseStudy from "@/data/strapi-mock/dashboard/case-studies/security/security-layer-implementation.json";
import stateManagementArticle from "@/data/strapi-mock/dashboard/case-studies/architecture/state-management-evolution.json";
import emailConsolidationCaseStudy from "@/data/strapi-mock/dashboard/case-studies/architecture/email-system-consolidation.json";
import multiStepFormCaseStudy from "@/data/strapi-mock/dashboard/case-studies/forms/multi-step-form-prototype-to-production.json";
import edgeCacheRolloutCaseStudy from "@/data/strapi-mock/dashboard/case-studies/rendering/choosing-rendering-strategy-per-page.json";
import enterpriseCmsMigration from "@/data/strapi-mock/dashboard/case-studies/business/enterprise-cms-migration.json";
import hydrationGuardPattern from "@/data/strapi-mock/dashboard/case-studies/architecture/hydration-guard-pattern.json";
import rateLimitingBypass from "@/data/strapi-mock/dashboard/case-studies/security/rate-limiting-bypass-to-production.json";

export type CaseStudyBlockType =
  | "atom.paragraph"
  | "molecule.infoBox"
  | "molecule.sectionHeader"
  | "molecule.subSectionHeader"
  | "molecule.codeBlock"
  | "molecule.keyTakeaway"
  | "organism.metricsGrid"
  | "organism.featureGrid"
  | "organism.comparisonCards"
  | "organism.processFlow"
  | "organism.stepFlow"
  | "organism.statsTable"
  | "organism.relatedArticles"
  | "organism.architectureDiagram"
  | "organism.fileTree"
  | "organism.decisionTree"
  | "organism.dataFlowDiagram"
  | "organism.verticalFlow"
  | "organism.beforeAfterComparison"
  | "paragraph"
  | "info-box"
  | "section-header"
  | "sub-section-header"
  | "code-block"
  | "key-takeaway"
  | "metrics-grid"
  | "feature-grid"
  | "comparison-cards"
  | "process-flow"
  | "step-flow"
  | "stats-table"
  | "related-articles"
  | "architecture-diagram"
  | "file-tree"
  | "decision-tree"
  | "data-flow-diagram"
  | "vertical-flow"
  | "before-after-comparison"
  | "numbered-list";

export type CaseStudyBlockLevel = "atom" | "molecule" | "organism";

export interface CaseStudyContentBlock {
  type: CaseStudyBlockType;
  atomicLevel: CaseStudyBlockLevel;
  props: Record<string, unknown>;
}

export interface CaseStudyContentMeta {
  slug: string;
  title: string;
  excerpt: string;
  level: "beginner" | "intermediate" | "advanced";
  category:
    | "refactoring"
    | "performance"
    | "security"
    | "architecture"
    | "business"
    | "cms"
    | "infrastructure"
    | "rendering"
    | "forms";
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export interface CaseStudyContentDocument {
  meta: CaseStudyContentMeta;
  layout: "content-with-toc" | "content-only";
  toc?: TOCItem[];
  blocks: CaseStudyContentBlock[];
}

const caseStudyContentRegistry: Record<string, CaseStudyContentDocument> = {
  "client-to-server-components":
    clientToServerArticle as CaseStudyContentDocument,
  "form-validation-refactor": formValidationArticle as CaseStudyContentDocument,
  "security-layer-implementation":
    securityLayerCaseStudy as CaseStudyContentDocument,
  "state-management-evolution":
    stateManagementArticle as CaseStudyContentDocument,
  "email-system-consolidation":
    emailConsolidationCaseStudy as CaseStudyContentDocument,
  "multi-step-form-prototype-to-production":
    multiStepFormCaseStudy as CaseStudyContentDocument,
  "choosing-rendering-strategy-per-page":
    edgeCacheRolloutCaseStudy as CaseStudyContentDocument,
  "enterprise-cms-migration":
    enterpriseCmsMigration as CaseStudyContentDocument,
  "hydration-guard-pattern": hydrationGuardPattern as CaseStudyContentDocument,
  "rate-limiting-bypass-to-production":
    rateLimitingBypass as CaseStudyContentDocument,
};

const validatedCaseStudyContentRegistry = Object.fromEntries(
  Object.entries(caseStudyContentRegistry).map(([slug, document]) => {
    const result = caseStudyContentDocumentSchema.safeParse(document);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      throw new Error(`Invalid case study content for "${slug}": ${issues}`);
    }
    return [slug, result.data as CaseStudyContentDocument];
  }),
) as Record<string, CaseStudyContentDocument>;

export function getCaseStudyContentDocument(
  slug: string,
): CaseStudyContentDocument | null {
  return validatedCaseStudyContentRegistry[slug] ?? null;
}
