import "server-only";

import {
  caseStudies,
  type CaseStudy,
} from "@/data/content-library/case-studies";
import {
  getCaseStudyContentDocument,
  type CaseStudyContentDocument,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content";

export interface CaseStudyRecord {
  caseStudy: CaseStudy;
  content: CaseStudyContentDocument;
}

export function listCaseStudies(): CaseStudy[] {
  return caseStudies;
}

export function listCaseStudySlugs(): string[] {
  return caseStudies.map((cs) => cs.slug);
}

export function getCaseStudyRecordBySlug(slug: string): CaseStudyRecord | null {
  const caseStudy = caseStudies.find((cs) => cs.slug === slug);
  if (!caseStudy) {
    return null;
  }

  const content = getCaseStudyContentDocument(slug);
  if (!content) {
    return null;
  }

  return { caseStudy, content };
}
