import {
  getCaseStudyList,
  getCaseStudyContentDocument,
  type CaseStudy,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content";
import type { CaseStudyContentDocument } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content";
import { repoLogger } from "@/lib/utils/arch-logger";

export interface CaseStudyRecord {
  caseStudy: CaseStudy;
  content: CaseStudyContentDocument;
}

export function listCaseStudies(): CaseStudy[] {
  repoLogger.queryStart("case-study-repository", "listCaseStudies");
  const result = getCaseStudyList();
  repoLogger.queryComplete(
    "case-study-repository",
    "listCaseStudies",
    result.length,
  );
  return result;
}

export function listCaseStudySlugs(): string[] {
  return getCaseStudyList().map((cs) => cs.slug);
}

export function getCaseStudyRecordBySlug(slug: string): CaseStudyRecord | null {
  repoLogger.queryStart("case-study-repository", "getCaseStudyRecordBySlug", {
    slug,
  });
  const caseStudy = getCaseStudyList().find((cs) => cs.slug === slug);
  if (!caseStudy) {
    repoLogger.queryComplete(
      "case-study-repository",
      "getCaseStudyRecordBySlug",
      null,
    );
    return null;
  }

  const content = getCaseStudyContentDocument(slug);
  if (!content) {
    repoLogger.queryComplete(
      "case-study-repository",
      "getCaseStudyRecordBySlug",
      null,
    );
    return null;
  }

  repoLogger.queryComplete(
    "case-study-repository",
    "getCaseStudyRecordBySlug",
    1,
  );
  return { caseStudy, content };
}

export function getCaseStudiesByCategory(
  category: CaseStudy["category"],
): CaseStudy[] {
  return listCaseStudies().filter((cs) => cs.category === category);
}

export function getCaseStudiesByLevel(level: CaseStudy["level"]): CaseStudy[] {
  return listCaseStudies().filter((cs) => cs.level === level);
}
