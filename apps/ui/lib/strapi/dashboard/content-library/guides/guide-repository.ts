/**
 * Guide Repository
 *
 * Data access layer for guides content type with query logging.
 * Implements IBaseRepository pattern for consistent method signatures.
 *
 * Authority: ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import "server-only";
import {
  getGuideList,
  getGuideContentDocument,
  getAllGuideContentSlugs,
  type Guide,
} from "@/lib/strapi/dashboard/content-library/guides/guide-content-builder";
import type { GuideContentDocument } from "@/lib/strapi/dashboard/content-library/guides/guide-schema";
import { repoLogger } from "@/lib/utils/arch-logger";

export interface GuideRecord {
  guide: Guide;
  content: GuideContentDocument;
}

/**
 * Get all guides
 */
export async function listGuides(): Promise<Guide[]> {
  repoLogger.queryStart("guides-repository", "listGuides");
  const result = await getGuideList();
  repoLogger.queryComplete("guides-repository", "listGuides", result.length);
  return result;
}

/**
 * Get guide slugs for static generation
 */
export async function listGuideSlugs(): Promise<string[]> {
  const slugs = await getAllGuideContentSlugs();
  return slugs;
}

/**
 * Get guide by slug
 */
export async function getGuideRecordBySlug(
  slug: string,
): Promise<GuideRecord | null> {
  repoLogger.queryStart("guides-repository", "getGuideRecordBySlug", { slug });
  const guides = await getGuideList();
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) {
    repoLogger.queryComplete(
      "guides-repository",
      "getGuideRecordBySlug",
      null,
    );
    return null;
  }

  const content = await getGuideContentDocument(slug);
  if (!content) {
    repoLogger.queryComplete(
      "guides-repository",
      "getGuideRecordBySlug",
      null,
    );
    return null;
  }

  repoLogger.queryComplete("guides-repository", "getGuideRecordBySlug", 1);
  return { guide, content };
}

/**
 * Get guides by category
 */
export async function getGuidesByCategory(
  category: Guide["category"],
): Promise<Guide[]> {
  const guides = await listGuides();
  return guides.filter((guide) => guide.category === category);
}

/**
 * Get guides by level
 */
export async function getGuidesByLevel(
  level: Guide["level"],
): Promise<Guide[]> {
  const guides = await listGuides();
  return guides.filter((guide) => guide.level === level);
}

/**
 * List guides by audience (stub — content-library doesn't use audience)
 */
export async function listGuidesByAudience(_audience: string): Promise<Guide[]> {
  return listGuides();
}
