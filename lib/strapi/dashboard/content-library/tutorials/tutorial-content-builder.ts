import "server-only";

import { tutorialContentDocumentSchema } from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-schema";
import { dataLogger } from "@/lib/utils/arch-logger";

// Import all tutorial JSON files
import buildingAtomicComponent from "@/data/strapi-mock/dashboard/content-library/tutorials/components/building-atomic-component.json";
import serverSideValidation from "@/data/strapi-mock/dashboard/content-library/tutorials/security/server-side-validation.json";
import zustandFormStore from "@/data/strapi-mock/dashboard/content-library/tutorials/state-management/zustand-form-store.json";
import rateLimitingImplementation from "@/data/strapi-mock/dashboard/content-library/tutorials/security/rate-limiting-implementation.json";
import yourFirstNextjsApp from "@/data/strapi-mock/dashboard/content-library/tutorials/getting-started/your-first-nextjs-app.json";
import yourFirstStrapiCollection from "@/data/strapi-mock/dashboard/content-library/tutorials/cms/your-first-strapi-collection.json";
import writingYourFirstTests from "@/data/strapi-mock/dashboard/content-library/tutorials/testing/writing-your-first-tests.json";
import connectingNextjsToStrapi from "@/data/strapi-mock/dashboard/content-library/tutorials/cms/connecting-nextjs-to-strapi.json";
import understandingReactHydration from "@/data/strapi-mock/dashboard/content-library/tutorials/getting-started/understanding-react-hydration.json";
import buildingHydrationSafeSidebar from "@/data/strapi-mock/dashboard/content-library/tutorials/components/building-hydration-safe-sidebar.json";
import errorBoundariesAndLoadingStates from "@/data/strapi-mock/dashboard/content-library/tutorials/getting-started/error-boundaries-and-loading-states.json";
import deployingNextjsToVercel from "@/data/strapi-mock/dashboard/content-library/tutorials/devops/deploying-nextjs-to-vercel.json";
import buildingMultiStepForms from "@/data/strapi-mock/dashboard/content-library/tutorials/forms/building-multi-step-forms-with-server-actions.json";
import buildingEmailTemplates from "@/data/strapi-mock/dashboard/content-library/tutorials/email/building-email-templates-react-email.json";
import e2eTestingPlaywright from "@/data/strapi-mock/dashboard/content-library/tutorials/testing/e2e-testing-playwright-nextjs.json";

export type TutorialLevel = "beginner" | "intermediate" | "advanced";
export type TutorialCategory =
  | "components"
  | "forms"
  | "security"
  | "state-management"
  | "performance"
  | "getting-started"
  | "cms"
  | "testing"
  | "devops"
  | "email";

export interface TutorialContentBlock {
  type: string;
  atomicLevel?: "atom" | "molecule" | "organism";
  props?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TutorialContentMeta {
  slug: string;
  title: string;
  excerpt: string;
  level: TutorialLevel;
  category: TutorialCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export interface TutorialContentDocument {
  meta: TutorialContentMeta;
  layout: "content-with-toc" | "content-only";
  toc?: Array<{ id: string; title: string; level: number }>;
  blocks: TutorialContentBlock[];
}

/**
 * Tutorial list item generated from content metadata + blocks
 * This replaces the old data/content-library/tutorials exports
 */
export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: TutorialLevel;
  category: TutorialCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
  blocks: TutorialContentBlock[];
}

// Tutorial content registry - maps slugs to JSON documents
const tutorialContentRegistry: Record<string, TutorialContentDocument> = {
  "building-atomic-component":
    buildingAtomicComponent as TutorialContentDocument,
  "server-side-validation": serverSideValidation as TutorialContentDocument,
  "zustand-form-store": zustandFormStore as TutorialContentDocument,
  "rate-limiting-implementation":
    rateLimitingImplementation as TutorialContentDocument,
  "your-first-nextjs-app": yourFirstNextjsApp as TutorialContentDocument,
  "your-first-strapi-collection":
    yourFirstStrapiCollection as TutorialContentDocument,
  "writing-your-first-tests": writingYourFirstTests as TutorialContentDocument,
  "connecting-nextjs-to-strapi":
    connectingNextjsToStrapi as TutorialContentDocument,
  "understanding-react-hydration":
    understandingReactHydration as TutorialContentDocument,
  "building-hydration-safe-sidebar":
    buildingHydrationSafeSidebar as TutorialContentDocument,
  "error-boundaries-and-loading-states":
    errorBoundariesAndLoadingStates as TutorialContentDocument,
  "deploying-nextjs-to-vercel":
    deployingNextjsToVercel as TutorialContentDocument,
  "building-multi-step-forms-with-server-actions":
    buildingMultiStepForms as TutorialContentDocument,
  "building-email-templates-react-email":
    buildingEmailTemplates as TutorialContentDocument,
  "e2e-testing-playwright-nextjs":
    e2eTestingPlaywright as TutorialContentDocument,
};

// Validate all tutorials on import
dataLogger.loadStart("tutorials", "data/strapi-mock/.../tutorials/*.json");
const validatedTutorialContentRegistry = Object.fromEntries(
  Object.entries(tutorialContentRegistry).map(([slug, document]) => {
    const result = tutorialContentDocumentSchema.safeParse(document);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError("tutorial", slug, issues.split(" | "));
      throw new Error(`Invalid tutorial content for "${slug}": ${issues}`);
    }
    return [slug, result.data as TutorialContentDocument];
  }),
) as Record<string, TutorialContentDocument>;
dataLogger.loadComplete(
  "tutorials",
  Object.keys(validatedTutorialContentRegistry).length,
  "data/strapi-mock/.../tutorials/*.json",
);
dataLogger.validationSuccess(
  "tutorials",
  Object.keys(validatedTutorialContentRegistry).length,
);

/**
 * Generates the tutorial list from content metadata
 * This function replaces the old hardcoded arrays in data/content-library/tutorials
 */
function generateTutorialList(): Tutorial[] {
  return Object.entries(validatedTutorialContentRegistry)
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
 * Cached tutorial list - generated once on server startup
 */
let cachedTutorialList: Tutorial[] | null = null;

/**
 * Get all tutorials
 * Replaces: import { tutorials } from "@/data/content-library/tutorials"
 */
export function getTutorialList(): Tutorial[] {
  if (!cachedTutorialList) {
    cachedTutorialList = generateTutorialList();
  }
  return cachedTutorialList;
}

/**
 * Get a tutorial content document by slug
 */
export function getTutorialContentDocument(
  slug: string,
): TutorialContentDocument | null {
  return validatedTutorialContentRegistry[slug] ?? null;
}

/**
 * Get all tutorial content slugs
 */
export function getAllTutorialContentSlugs(): string[] {
  return Object.keys(validatedTutorialContentRegistry);
}
