import {
  getGuideList,
  getGuideContentDocument,
  type Guide,
  type GuideContentDocument,
} from "@/lib/strapi/dashboard/content-library/guides/guide-content";
import { repoLogger } from "@/lib/utils/arch-logger";

/**
 * Guide Repository
 * Data access layer for guides with caching and error handling
 */

export interface GuideRecord {
  guide: Guide;
  content: GuideContentDocument;
}

/**
 * Get all guides
 * Returns array of all guide records
 */
export function listGuides(): Guide[] {
  repoLogger.queryStart("guides-repository", "listGuides");
  const result = getGuideList();
  repoLogger.queryComplete("guides-repository", "listGuides", result.length);
  return result;
}

/**
 * Get guide slugs for static generation
 * Returns array of all guide slugs
 */
export function listGuideSlugs(): string[] {
  return getGuideList().map((guide) => guide.slug);
}

/**
 * Get guide by slug
 * Returns guide record or null if not found
 */
export function getGuideRecordBySlug(slug: string): GuideRecord | null {
  repoLogger.queryStart("guides-repository", "getGuideRecordBySlug", { slug });
  const guide = getGuideList().find((item) => item.slug === slug);
  if (!guide) {
    repoLogger.queryComplete("guides-repository", "getGuideRecordBySlug", null);
    return null;
  }

  const content = getGuideContentDocument(slug);
  if (!content) {
    repoLogger.queryComplete("guides-repository", "getGuideRecordBySlug", null);
    return null;
  }

  repoLogger.queryComplete("guides-repository", "getGuideRecordBySlug", 1);
  return { guide, content };
}

/**
 * Get guides by category
 * Returns filtered array of guides matching category
 */
export function getGuidesByCategory(category: Guide["category"]): Guide[] {
  return listGuides().filter((guide) => guide.category === category);
}

/**
 * Get guides by level
 * Returns filtered array of guides matching level
 */
export function getGuidesByLevel(level: Guide["level"]): Guide[] {
  return listGuides().filter((guide) => guide.level === level);
}
