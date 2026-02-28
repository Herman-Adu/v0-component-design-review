import type { Tutorial } from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-content";

export interface TutorialDetailViewModel {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: Tutorial["level"];
  category: Tutorial["category"];
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export function toTutorialDetailViewModel(
  tutorial: Tutorial,
): TutorialDetailViewModel {
  return {
    id: tutorial.id,
    slug: tutorial.slug,
    title: tutorial.title,
    excerpt: tutorial.excerpt,
    level: tutorial.level,
    category: tutorial.category,
    readTime: tutorial.readTime,
    publishedAt: tutorial.publishedAt,
    tags: tutorial.tags,
  };
}
