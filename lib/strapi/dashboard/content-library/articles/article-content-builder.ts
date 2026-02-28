import { articleContentDocumentSchema } from "@/lib/strapi/dashboard/content-library/articles/article-schema";
import { dataLogger } from "@/lib/utils/arch-logger";

// Import all article JSON files
import accessibilityArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/building-accessible-web-applications.json";
import refactoringArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/refactoring-for-maintainability.json";
import documentationArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/documentation-as-architecture.json";
import guardPatternArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/guard-pattern-architecture.json";
import threeAxisReviewArticle from "@/data/strapi-mock/dashboard/content-library/articles/best-practices/three-axis-quality-review-system.json";
import atomicDesignArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/atomic-design-principles.json";
import planningArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/planning-full-stack-application.json";
import emailSystemArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/email-system-architecture.json";
import hydrationArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/why-react-hydration-breaks.json";
import hydrationMismatchesArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/hydration-mismatches-use-client-layouts.json";
import serverClientBoundariesArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/server-client-boundaries.json";
import serviceRequestLifecycleArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/service-request-lifecycle.json";
import managingContentStrapiArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/managing-content-in-strapi.json";
import duplicateProvidersArticle from "@/data/strapi-mock/dashboard/content-library/articles/architecture/duplicate-providers-architectural-cost.json";
import zodValidationArticle from "@/data/strapi-mock/dashboard/content-library/articles/forms/typescript-zod-validation.json";
import multiStepFormArticle from "@/data/strapi-mock/dashboard/content-library/articles/forms/multi-step-form-architecture.json";
import zustandArticle from "@/data/strapi-mock/dashboard/content-library/articles/forms/zustand-form-state-management.json";
import securityArticle from "@/data/strapi-mock/dashboard/content-library/articles/security/security-architecture-deep-dive.json";
import serverActionsArticle from "@/data/strapi-mock/dashboard/content-library/articles/security/server-actions-deep-dive.json";
import roiArticle from "@/data/strapi-mock/dashboard/content-library/articles/business/roi-modern-web-architecture.json";
import techStackArticle from "@/data/strapi-mock/dashboard/content-library/articles/business/tech-stack-decision-framework.json";
import testingArticle from "@/data/strapi-mock/dashboard/content-library/articles/testing/testing-strategy-modern-applications.json";
import cicdArticle from "@/data/strapi-mock/dashboard/content-library/articles/devops/cicd-deployment-pipelines.json";
import aiSessionArticle from "@/data/strapi-mock/dashboard/content-library/articles/ai-tooling/ai-session-management-quality-gates.json";
import isrArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/incremental-static-regeneration-isr.json";
import performanceBudgetsArticle from "@/data/strapi-mock/dashboard/content-library/articles/performance/performance-budgets-for-nextjs.json";
import ssgArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/static-site-generation-ssg.json";
import ssrArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/server-side-rendering-ssr.json";
import pprArticle from "@/data/strapi-mock/dashboard/content-library/articles/rendering/partial-prerendering-ppr.json";

export type ArticleLevel = "beginner" | "intermediate" | "advanced";
export type ArticleCategory =
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

export interface ArticleContentBlock {
  type: string;
  atomicLevel: "atom" | "molecule" | "organism";
  props: Record<string, unknown>;
}

export interface ArticleContentMeta {
  slug: string;
  title: string;
  excerpt: string;
  level: ArticleLevel;
  category: ArticleCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export interface ArticleContentDocument {
  meta: ArticleContentMeta;
  layout: "content-with-toc" | "content-only";
  toc?: Array<{ id: string; title: string; level: number }>;
  blocks: ArticleContentBlock[];
}

/**
 * Article list item generated from content metadata
 */
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: ArticleLevel;
  category: ArticleCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
  blocks: ArticleContentBlock[];
}

// Article content registry - maps slugs to JSON documents
const articleContentRegistry: Record<string, ArticleContentDocument> = {
  "building-accessible-web-applications":
    accessibilityArticle as ArticleContentDocument,
  "refactoring-for-maintainability":
    refactoringArticle as ArticleContentDocument,
  "documentation-as-architecture":
    documentationArticle as ArticleContentDocument,
  "guard-pattern-architecture": guardPatternArticle as ArticleContentDocument,
  "three-axis-quality-review-system":
    threeAxisReviewArticle as ArticleContentDocument,
  "atomic-design-principles": atomicDesignArticle as ArticleContentDocument,
  "planning-full-stack-application": planningArticle as ArticleContentDocument,
  "email-system-architecture": emailSystemArticle as ArticleContentDocument,
  "why-react-hydration-breaks": hydrationArticle as ArticleContentDocument,
  "hydration-mismatches-use-client-layouts":
    hydrationMismatchesArticle as ArticleContentDocument,
  "server-client-boundaries":
    serverClientBoundariesArticle as ArticleContentDocument,
  "service-request-lifecycle":
    serviceRequestLifecycleArticle as ArticleContentDocument,
  "managing-content-in-strapi":
    managingContentStrapiArticle as ArticleContentDocument,
  "duplicate-providers-architectural-cost":
    duplicateProvidersArticle as ArticleContentDocument,
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
  "ai-session-management-quality-gates":
    aiSessionArticle as ArticleContentDocument,
  "incremental-static-regeneration-isr": isrArticle as ArticleContentDocument,
  "performance-budgets-for-nextjs":
    performanceBudgetsArticle as ArticleContentDocument,
  "static-site-generation-ssg": ssgArticle as ArticleContentDocument,
  "server-side-rendering-ssr": ssrArticle as ArticleContentDocument,
  "partial-prerendering-ppr": pprArticle as ArticleContentDocument,
};

// Validate all articles on import
dataLogger.loadStart("articles", "data/strapi-mock/.../articles/*.json");
const validatedArticleContentRegistry = Object.fromEntries(
  Object.entries(articleContentRegistry).map(([slug, document]) => {
    const result = articleContentDocumentSchema.safeParse(document);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError("article", slug, issues.split(" | "));
      throw new Error(`Invalid article content for "${slug}": ${issues}`);
    }
    return [slug, result.data as ArticleContentDocument];
  }),
) as Record<string, ArticleContentDocument>;
dataLogger.loadComplete(
  "articles",
  Object.keys(validatedArticleContentRegistry).length,
  "data/strapi-mock/.../articles/*.json",
);
dataLogger.validationSuccess(
  "articles",
  Object.keys(validatedArticleContentRegistry).length,
);

/**
 * Generates the article list from content metadata
 */
function generateArticleList(): Article[] {
  return Object.entries(validatedArticleContentRegistry)
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
 * Cached article list - generated once on server startup
 */
let cachedArticleList: Article[] | null = null;

/**
 * Get all articles
 */
export function getArticleList(): Article[] {
  if (!cachedArticleList) {
    cachedArticleList = generateArticleList();
  }
  return cachedArticleList;
}

/**
 * Get an article content document by slug
 */
export function getArticleContentDocument(
  slug: string,
): ArticleContentDocument | null {
  return validatedArticleContentRegistry[slug] ?? null;
}

/**
 * Get all article content slugs
 */
export function getAllArticleContentSlugs(): string[] {
  return Object.keys(validatedArticleContentRegistry);
}
