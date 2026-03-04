/**
 * Case Study View Models
 *
 * Transforms case study domain models into UI-ready view models.
 * Implements content-library view model pattern with detail and list item variants.
 *
 * Authority: base-view-model.ts, ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import type { CaseStudy } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content";
import type {
  ContentLibraryDetailViewModel,
  ContentLibraryListItemViewModel,
} from "@/lib/strapi/dashboard/_shared/base-view-model";

export interface CaseStudyDetailViewModel extends Omit<
  ContentLibraryDetailViewModel,
  "category" | "level"
> {
  category: CaseStudy["category"];
  level: CaseStudy["level"];
}

export interface CaseStudyListItemViewModel extends ContentLibraryListItemViewModel {}

/**
 * Transform case study to detail view model
 * Includes all fields for detail page rendering
 */
export function toCaseStudyDetailViewModel(
  caseStudy: CaseStudy,
): CaseStudyDetailViewModel {
  return {
    id: caseStudy.id,
    slug: caseStudy.slug,
    title: caseStudy.title,
    excerpt: caseStudy.excerpt,
    category: caseStudy.category,
    level: caseStudy.level,
    readTime: caseStudy.readTime,
    publishedAt: caseStudy.publishedAt,
    tags: caseStudy.tags,
    blocks: caseStudy.blocks,
  };
}

/**
 * Transform case study to list item view model
 * Minimal fields for list/archive rendering
 */
export function toCaseStudyListItemViewModel(
  caseStudy: CaseStudy,
): CaseStudyListItemViewModel {
  return {
    slug: caseStudy.slug,
    title: caseStudy.title,
    excerpt: caseStudy.excerpt,
    tags: caseStudy.tags,
  };
}
