/**
 * Tutorial Repository
 *
 * Data access layer for tutorials content type with query logging.
 * Implements IBaseRepository pattern for consistent method signatures.
 *
 * Authority: ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import "server-only";
import {
  getTutorialList,
  getTutorialContentDocument,
  type Tutorial,
} from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-content-builder";
import type { TutorialContentDocument } from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-schema";
import { repoLogger } from "@/lib/utils/arch-logger";

export interface TutorialRecord {
  tutorial: Tutorial;
  content: TutorialContentDocument;
}

export async function listTutorials(): Promise<Tutorial[]> {
  repoLogger.queryStart("tutorial-repository", "listTutorials");
  const result = await getTutorialList();
  repoLogger.queryComplete(
    "tutorial-repository",
    "listTutorials",
    result.length,
  );
  return result;
}

export async function listTutorialSlugs(): Promise<string[]> {
  const tutorials = await getTutorialList();
  return tutorials.map((tutorial) => tutorial.slug);
}

export async function getTutorialRecordBySlug(
  slug: string,
): Promise<TutorialRecord | null> {
  repoLogger.queryStart("tutorial-repository", "getTutorialRecordBySlug", {
    slug,
  });
  const tutorials = await getTutorialList();
  const tutorial = tutorials.find((item) => item.slug === slug);
  if (!tutorial) {
    repoLogger.queryComplete(
      "tutorial-repository",
      "getTutorialRecordBySlug",
      null,
    );
    return null;
  }

  const content = await getTutorialContentDocument(slug);
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

export async function getTutorialsByCategory(
  category: Tutorial["category"],
): Promise<Tutorial[]> {
  const tutorials = await listTutorials();
  return tutorials.filter((tutorial) => tutorial.category === category);
}

export async function getTutorialsByLevel(
  level: Tutorial["level"],
): Promise<Tutorial[]> {
  const tutorials = await listTutorials();
  return tutorials.filter((tutorial) => tutorial.level === level);
}

/**
 * List tutorials by audience (stub — content-library does not use audience field)
 */
export async function listTutorialsByAudience(
  _audience: string,
): Promise<Tutorial[]> {
  return listTutorials();
}
