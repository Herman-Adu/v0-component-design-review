/**
 * Case Study Repository
 *
 * Data access layer for case studies content type with query logging.
 * Implements IBaseRepository pattern for consistent method signatures.
 *
 * Authority: ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import "server-only";
import {
  getCaseStudyList,
  getCaseStudyContentDocument,
  type CaseStudy,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content-builder";
import type { CaseStudyContentDocument } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-schema";
import { repoLogger } from "@/lib/utils/arch-logger";

export interface CaseStudyRecord {
  caseStudy: CaseStudy;
  content: CaseStudyContentDocument;
}

export async function listCaseStudies(): Promise<CaseStudy[]> {
  repoLogger.queryStart("case-study-repository", "listCaseStudies");
  const result = await getCaseStudyList();
  repoLogger.queryComplete(
    "case-study-repository",
    "listCaseStudies",
    result.length,
  );
  return result;
}

export async function listCaseStudySlugs(): Promise<string[]> {
  const caseStudies = await getCaseStudyList();
  return caseStudies.map((cs) => cs.slug);
}

export async function getCaseStudyRecordBySlug(
  slug: string,
): Promise<CaseStudyRecord | null> {
  repoLogger.queryStart("case-study-repository", "getCaseStudyRecordBySlug", {
    slug,
  });
  const caseStudies = await getCaseStudyList();
  const caseStudy = caseStudies.find((cs) => cs.slug === slug);
  if (!caseStudy) {
    repoLogger.queryComplete(
      "case-study-repository",
      "getCaseStudyRecordBySlug",
      null,
    );
    return null;
  }

  const content = await getCaseStudyContentDocument(slug);
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

export async function getCaseStudiesByCategory(
  category: CaseStudy["category"],
): Promise<CaseStudy[]> {
  const caseStudies = await listCaseStudies();
  return caseStudies.filter((cs) => cs.category === category);
}

export async function getCaseStudiesByLevel(
  level: CaseStudy["level"],
): Promise<CaseStudy[]> {
  const caseStudies = await listCaseStudies();
  return caseStudies.filter((cs) => cs.level === level);
}

/**
 * List case studies by audience (stub — content-library does not use audience field)
 */
export async function listCaseStudiesByAudience(
  _audience: string,
): Promise<CaseStudy[]> {
  return listCaseStudies();
}
