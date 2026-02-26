import "server-only";

import {
  caseStudies,
  type CaseStudy,
  type CaseStudyCategory,
} from "@/data/content-library/case-studies";

export type { CaseStudy, CaseStudyCategory };

export function getAllCaseStudies(): CaseStudy[] {
  return caseStudies;
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.slug === slug);
}

export function getCaseStudiesByCategory(
  category: CaseStudyCategory,
): CaseStudy[] {
  return caseStudies.filter((caseStudy) => caseStudy.category === category);
}

export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map((caseStudy) => caseStudy.slug);
}
