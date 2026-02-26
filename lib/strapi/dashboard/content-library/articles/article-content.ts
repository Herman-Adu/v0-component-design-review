import "server-only";

import type { TOCItem } from "@/components/molecules/article-components";
import { articleContentDocumentSchema } from "@/lib/strapi/dashboard/content-library/articles/article-schema";
import accessibilityArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/building-accessible-web-applications.json";
import refactoringArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/refactoring-for-maintainability.json";
import documentationArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/documentation-as-architecture.json";
import atomicDesignArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/atomic-design-principles.json";
import planningArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/planning-full-stack-application.json";
import emailSystemArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/email-system-architecture.json";
import zodValidationArticle from "@/data/strapi-mock/dashboard/content-library/articles/forms/typescript-zod-validation.json";
import multiStepFormArticle from "@/data/strapi-mock/dashboard/content-library/articles/forms/multi-step-form-architecture.json";
import zustandArticle from "@/data/strapi-mock/dashboard/content-library/articles/forms/zustand-form-state-management.json";
import securityArticle from "@/data/strapi-mock/dashboard/content-library/articles/security/security-architecture-deep-dive.json";
import serverActionsArticle from "@/data/strapi-mock/dashboard/content-library/articles/security/server-actions-deep-dive.json";
import roiArticle from "@/data/strapi-mock/dashboard/content-library/articles/business/roi-modern-web-architecture.json";
import techStackArticle from "@/data/strapi-mock/dashboard/content-library/articles/business/tech-stack-decision-framework.json";
import testingArticle from "@/data/strapi-mock/dashboard/content-library/articles/testing/testing-strategy-modern-applications.json";
import cicdArticle from "@/data/strapi-mock/dashboard/content-library/articles/devops/cicd-deployment-pipelines.json";
import guardPatternArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/guard-pattern-architecture.json";
import hydrationArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/why-react-hydration-breaks.json";
import aiSessionArticle from "@/data/strapi-mock/dashboard/content-library/articles/ai-tooling/ai-session-management-quality-gates.json";
import hydrationMismatchesArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/hydration-mismatches-use-client-layouts.json";
import isrArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/incremental-static-regeneration-isr.json";
import performanceBudgetsArticle from "@/data/strapi-mock/dashboard/content-library/articles/performance/performance-budgets-for-nextjs.json";
import ssgArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/static-site-generation-ssg.json";
import ssrArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/server-side-rendering-ssr.json";
import pprArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/partial-prerendering-ppr.json";
import serverClientBoundariesArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/server-client-boundaries.json";
import serviceRequestLifecycleArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/service-request-lifecycle.json";
import managingContentStrapiArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/managing-content-in-strapi.json";
import duplicateProvidersArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/duplicate-providers-architectural-cost.json";
import threeAxisReviewArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/three-axis-quality-review-system.json";

export type ArticleBlockType =
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

export type ArticleBlockLevel = "atom" | "molecule" | "organism";

export interface ArticleContentBlock {
  type: ArticleBlockType;
  atomicLevel: ArticleBlockLevel;
  props: Record<string, unknown>;
}

export interface ArticleContentMeta {
  slug: string;
  title: string;
  excerpt: string;
  level: "beginner" | "intermediate" | "advanced";
  category:
    | "architecture"
    | "security"
    | "forms"
    | "performance"
    | "best-practices"
    | "rendering"
    | "business"
    | "accessibility"
    | "testing"
    | "devops"
    | "ai-tooling";
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export interface ArticleContentDocument {
  meta: ArticleContentMeta;
  layout: "content-with-toc" | "content-only";
  toc?: TOCItem[];
  blocks: ArticleContentBlock[];
}

const articleContentRegistry: Record<string, ArticleContentDocument> = {
  "building-accessible-web-applications":
    accessibilityArticle as ArticleContentDocument,
  "refactoring-for-maintainability":
    refactoringArticle as ArticleContentDocument,
  "documentation-as-architecture":
    documentationArticle as ArticleContentDocument,
  "atomic-design-principles": atomicDesignArticle as ArticleContentDocument,
  "planning-full-stack-application": planningArticle as ArticleContentDocument,
  "email-system-architecture": emailSystemArticle as ArticleContentDocument,
  "typescript-zod-validation": zodValidationArticle as ArticleContentDocument,
  "multi-step-form-architecture":
    multiStepFormArticle as ArticleContentDocument,
  "zustand-form-state-management": zustandArticle as ArticleContentDocument,
  "security-architecture-deep-dive": securityArticle as ArticleContentDocument,
  "server-actions-deep-dive": serverActionsArticle as ArticleContentDocument,
  "roi-modern-web-architecture": roiArticle as ArticleContentDocument,
  "tech-stack-decision-framework": techStackArticle as ArticleContentDocument,
  "testing-strategy-modern-applications":
    testingArticle as ArticleContentDocument,
  "cicd-deployment-pipelines": cicdArticle as ArticleContentDocument,
  "guard-pattern-architecture": guardPatternArticle as ArticleContentDocument,
  "why-react-hydration-breaks": hydrationArticle as ArticleContentDocument,
  "ai-session-management-quality-gates":
    aiSessionArticle as ArticleContentDocument,
  "hydration-mismatches-use-client-layouts":
    hydrationMismatchesArticle as ArticleContentDocument,
  "incremental-static-regeneration-isr": isrArticle as ArticleContentDocument,
  "performance-budgets-for-nextjs":
    performanceBudgetsArticle as ArticleContentDocument,
  "static-site-generation-ssg": ssgArticle as ArticleContentDocument,
  "server-side-rendering-ssr": ssrArticle as ArticleContentDocument,
  "partial-prerendering-ppr": pprArticle as ArticleContentDocument,
  "server-client-boundaries":
    serverClientBoundariesArticle as ArticleContentDocument,
  "service-request-lifecycle":
    serviceRequestLifecycleArticle as ArticleContentDocument,
  "managing-content-in-strapi":
    managingContentStrapiArticle as ArticleContentDocument,
  "duplicate-providers-architectural-cost":
    duplicateProvidersArticle as ArticleContentDocument,
  "three-axis-quality-review-system":
    threeAxisReviewArticle as ArticleContentDocument,
};

const validatedArticleContentRegistry = Object.fromEntries(
  Object.entries(articleContentRegistry).map(([slug, document]) => {
    const result = articleContentDocumentSchema.safeParse(document);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      throw new Error(`Invalid article content for "${slug}": ${issues}`);
    }
    return [slug, result.data as ArticleContentDocument];
  }),
) as Record<string, ArticleContentDocument>;

export function getArticleContentDocument(
  slug: string,
): ArticleContentDocument | null {
  return validatedArticleContentRegistry[slug] ?? null;
}
