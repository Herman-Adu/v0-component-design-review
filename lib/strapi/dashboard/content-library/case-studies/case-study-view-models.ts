import type { CaseStudy } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content";

export interface CaseStudyDetailViewModel {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: CaseStudy["category"];
  publishedAt: string;
  tags: string[];
  blocks: CaseStudy["blocks"];
}

export function toCaseStudyDetailViewModel(
  caseStudy: CaseStudy,
): CaseStudyDetailViewModel {
  return {
    id: caseStudy.id,
    slug: caseStudy.slug,
    title: caseStudy.title,
    excerpt: caseStudy.excerpt,
    category: caseStudy.category,
    publishedAt: caseStudy.publishedAt,
    tags: caseStudy.tags,
    blocks: caseStudy.blocks,
  };
}
