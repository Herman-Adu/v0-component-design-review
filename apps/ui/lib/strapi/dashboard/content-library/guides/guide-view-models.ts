/**
 * Guide View Models
 *
 * Transforms guide domain models into UI-ready view models.
 * Implements content-library view model pattern with detail and list item variants.
 *
 * Authority: base-view-model.ts, ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import type { Guide } from "@/lib/strapi/dashboard/content-library/guides/guide-content";
import type {
  ContentLibraryDetailViewModel,
  ContentLibraryListItemViewModel,
} from "@/lib/strapi/dashboard/_shared/base-view-model";

export interface GuideDetailViewModel extends Omit<
  ContentLibraryDetailViewModel,
  "category" | "level"
> {
  category: Guide["category"];
  level: Guide["level"];
}

export interface GuideListItemViewModel extends ContentLibraryListItemViewModel {}

/**
 * Transform guide to detail view model
 * Includes all fields for detail page rendering
 */
export function toGuideDetailViewModel(guide: Guide): GuideDetailViewModel {
  return {
    id: guide.id,
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.excerpt,
    level: guide.level,
    category: guide.category,
    readTime: guide.readTime,
    publishedAt: guide.publishedAt,
    tags: guide.tags,
    blocks: guide.blocks,
  };
}

/**
 * Transform guide to list item view model
 * Minimal fields for list/archive rendering
 */
export function toGuideListItemViewModel(guide: Guide): GuideListItemViewModel {
  return {
    slug: guide.slug,
    title: guide.title,
    excerpt: guide.excerpt,
    tags: guide.tags,
  };
}
