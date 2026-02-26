import "server-only";

import { tutorialContentDocumentSchema } from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-schema";
import buildingAtomicComponent from "@/data/strapi-mock/dashboard/content-library/tutorials/components/building-atomic-component.json";
import serverSideValidation from "@/data/strapi-mock/dashboard/content-library/tutorials/security/server-side-validation.json";
import zustandFormStore from "@/data/strapi-mock/dashboard/content-library/tutorials/state-management/zustand-form-store.json";

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

export interface TutorialContentStep {
  title: string;
  content: string;
  code?: string;
  hint?: string;
  solution?: string;
  explanation?: string;
}

export interface TutorialContentMeta {
  slug: string;
  title: string;
  description: string;
  level: TutorialLevel;
  category: TutorialCategory;
  duration: string;
  publishedAt: string;
  tags: string[];
  prerequisites: string[];
  learningOutcomes: string[];
}

export interface TutorialContentDocument {
  meta: TutorialContentMeta;
  steps: TutorialContentStep[];
}

const tutorialContentRegistry: Record<string, TutorialContentDocument> = {
  "building-atomic-component":
    buildingAtomicComponent as TutorialContentDocument,
  "server-side-validation": serverSideValidation as TutorialContentDocument,
  "zustand-form-store": zustandFormStore as TutorialContentDocument,
};

const validatedTutorialContentRegistry = Object.fromEntries(
  Object.entries(tutorialContentRegistry).map(([slug, document]) => {
    const result = tutorialContentDocumentSchema.safeParse(document);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      throw new Error(`Invalid tutorial content for "${slug}": ${issues}`);
    }
    return [slug, result.data as TutorialContentDocument];
  }),
) as Record<string, TutorialContentDocument>;

export function getTutorialContentDocument(
  slug: string,
): TutorialContentDocument | null {
  return validatedTutorialContentRegistry[slug] ?? null;
}

export function getAllTutorialContentSlugs(): string[] {
  return Object.keys(validatedTutorialContentRegistry);
}
