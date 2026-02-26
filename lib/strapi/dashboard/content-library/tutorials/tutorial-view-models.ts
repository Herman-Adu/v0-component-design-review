import type { Tutorial } from "@/data/content-library/tutorials";

export interface TutorialDetailViewModel {
  id: string;
  slug: string;
  title: string;
  description: string;
  level: Tutorial["level"];
  category: Tutorial["category"];
  duration: string;
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
    description: tutorial.description,
    level: tutorial.level,
    category: tutorial.category,
    duration: tutorial.duration,
    publishedAt: tutorial.publishedAt,
    tags: tutorial.tags,
  };
}
