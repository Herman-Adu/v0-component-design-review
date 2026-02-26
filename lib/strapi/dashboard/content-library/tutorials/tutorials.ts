import "server-only";

import {
  tutorials,
  type Tutorial,
  type TutorialCategory,
  type TutorialLevel,
} from "@/data/content-library/tutorials";

export type { Tutorial, TutorialCategory, TutorialLevel };

export function getAllTutorials(): Tutorial[] {
  return tutorials;
}

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  return tutorials.find((tutorial) => tutorial.slug === slug);
}

export function getTutorialsByLevel(level: TutorialLevel): Tutorial[] {
  return tutorials.filter((tutorial) => tutorial.level === level);
}

export function getTutorialsByCategory(category: TutorialCategory): Tutorial[] {
  return tutorials.filter((tutorial) => tutorial.category === category);
}

export function getAllTutorialSlugs(): string[] {
  return tutorials.map((tutorial) => tutorial.slug);
}
