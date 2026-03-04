/**
 * Tutorial View Models
 *
 * Transforms tutorial domain models into UI-ready view models.
 * Implements content-library view model pattern with detail and list item variants.
 *
 * Authority: base-view-model.ts, ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import type { Tutorial } from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-content";
import type {
  ContentLibraryDetailViewModel,
  ContentLibraryListItemViewModel,
} from "@/lib/strapi/dashboard/_shared/base-view-model";

export interface TutorialDetailViewModel extends Omit<
  ContentLibraryDetailViewModel,
  "category"
> {
  category: Tutorial["category"];
}

export interface TutorialListItemViewModel extends ContentLibraryListItemViewModel {}

/**
 * Transform tutorial to detail view model
 * Includes all fields for detail page rendering
 */
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
    blocks: tutorial.blocks,
  };
}

/**
 * Transform tutorial to list item view model
 * Minimal fields for list/archive rendering
 */
export function toTutorialListItemViewModel(
  tutorial: Tutorial,
): TutorialListItemViewModel {
  return {
    slug: tutorial.slug,
    title: tutorial.title,
    excerpt: tutorial.excerpt,
    tags: tutorial.tags,
  };
}
