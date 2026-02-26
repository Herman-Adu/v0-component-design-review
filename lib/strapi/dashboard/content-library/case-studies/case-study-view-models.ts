import type { CaseStudy } from "@/data/content-library/case-studies";

export interface CaseStudyDetailViewModel {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: CaseStudy["category"];
  publishedAt: string;
  tags: string[];
}

export function toCaseStudyDetailViewModel(
  caseStudy: CaseStudy,
): CaseStudyDetailViewModel {
  return {
    id: caseStudy.id,
    slug: caseStudy.slug,
    title: caseStudy.title,
    subtitle: caseStudy.subtitle,
    category: caseStudy.category,
    publishedAt: caseStudy.publishedAt,
    tags: caseStudy.tags,
  };
}
