import {
  getTutorialList,
  getTutorialContentDocument,
  type Tutorial,
  type TutorialContentDocument,
} from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-content";
import { repoLogger } from "@/lib/utils/arch-logger";

export interface TutorialRecord {
  tutorial: Tutorial;
  content: TutorialContentDocument;
}

export function listTutorials(): Tutorial[] {
  repoLogger.queryStart("tutorial-repository", "listTutorials");
  const result = getTutorialList();
  repoLogger.queryComplete(
    "tutorial-repository",
    "listTutorials",
    result.length,
  );
  return result;
}

export function listTutorialSlugs(): string[] {
  return getTutorialList().map((tutorial) => tutorial.slug);
}

export function getTutorialRecordBySlug(slug: string): TutorialRecord | null {
  repoLogger.queryStart("tutorial-repository", "getTutorialRecordBySlug", {
    slug,
  });
  const tutorial = getTutorialList().find((item) => item.slug === slug);
  if (!tutorial) {
    repoLogger.queryComplete(
      "tutorial-repository",
      "getTutorialRecordBySlug",
      null,
    );
    return null;
  }

  const content = getTutorialContentDocument(slug);
  if (!content) {
    repoLogger.queryComplete(
      "tutorial-repository",
      "getTutorialRecordBySlug",
      null,
    );
    return null;
  }

  repoLogger.queryComplete("tutorial-repository", "getTutorialRecordBySlug", 1);
  return { tutorial, content };
}

export function getTutorialsByCategory(
  category: Tutorial["category"],
): Tutorial[] {
  return listTutorials().filter((tutorial) => tutorial.category === category);
}

export function getTutorialsByLevel(level: Tutorial["level"]): Tutorial[] {
  return listTutorials().filter((tutorial) => tutorial.level === level);
}
