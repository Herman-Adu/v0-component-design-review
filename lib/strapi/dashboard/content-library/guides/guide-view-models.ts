import type { Guide } from "@/lib/strapi/dashboard/content-library/guides/guide-content";

/**
 * Guide View Models
 * Transform guide domain models into UI-ready view models
 */

/**
 * Guide Detail View Model
 * Optimized for guide detail page rendering
 */
export interface GuideDetailViewModel {
  slug: string;
  title: string;
  excerpt: string;
  level: "intermediate" | "advanced";
  category: "security" | "devops" | "testing";
  readTime: string;
  publishedAt: string;
  tags: string[];
}

/**
 * Transform guide to detail view model
 */
export function toGuideDetailViewModel(guide: Guide): GuideDetailViewModel {
  return {
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.excerpt,
    level: guide.level,
    category: guide.category,
    readTime: guide.readTime,
    publishedAt: guide.publishedAt,
    tags: guide.tags,
  };
}
