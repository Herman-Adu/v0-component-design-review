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

/**
 * List case studies by audience (optional extension)
 * Provided for consistency with documentation repositories
 * Returns filtered array of case studies matching audience
 */
export function listCaseStudiesByAudience(audience: string): CaseStudy[] {
  // Content-library doesn't currently use audience field; this is a no-op stub
  return listCaseStudies();
}
