import "server-only";

import { tutorials, type Tutorial } from "@/data/content-library/tutorials";
import {
  getTutorialContentDocument,
  type TutorialContentDocument,
} from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-content";

export interface TutorialRecord {
  tutorial: Tutorial;
  content: TutorialContentDocument;
}

export function listTutorials(): Tutorial[] {
  return tutorials;
}

export function listTutorialSlugs(): string[] {
  return tutorials.map((tutorial) => tutorial.slug);
}

export function getTutorialRecordBySlug(slug: string): TutorialRecord | null {
  const tutorial = tutorials.find((item) => item.slug === slug);
  if (!tutorial) {
    return null;
  }

  const content = getTutorialContentDocument(slug);
  if (!content) {
    return null;
  }

  return { tutorial, content };
}
