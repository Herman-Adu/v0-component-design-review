/**
 * Tutorial Repository
 *
 * Data access layer for tutorials content type with query logging.
 * Implements IBaseRepository pattern for consistent method signatures.
 *
 * Authority: base-repository.ts, ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

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

/**
 * List tutorials by audience (optional extension)
 * Provided for consistency with documentation repositories
 * Returns filtered array of tutorials matching audience
 */
export function listTutorialsByAudience(audience: string): Tutorial[] {
  // Content-library doesn't currently use audience field; this is a no-op stub
  return listTutorials();
}
