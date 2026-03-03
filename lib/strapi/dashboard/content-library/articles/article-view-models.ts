/**
 * Article View Models
 *
 * Transforms article domain models into UI-ready view models.
 * Implements content-library view model pattern with detail and list item variants.
 *
 * Authority: base-view-model.ts, ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import type { Article } from "@/lib/strapi/dashboard/content-library/articles/article-content";
import type {
  ContentLibraryDetailViewModel,
  ContentLibraryListItemViewModel,
} from "@/lib/strapi/dashboard/_shared/base-view-model";

export interface ArticleDetailViewModel extends Omit<
  ContentLibraryDetailViewModel,
  "category" | "level"
> {
  category: Article["category"];
  level: Article["level"];
}

export interface ArticleListItemViewModel extends ContentLibraryListItemViewModel {}

/**
 * Transform article to detail view model
 * Includes all fields for detail page rendering
 */
export function toArticleDetailViewModel(
  article: Article,
): ArticleDetailViewModel {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    level: article.level,
    category: article.category,
    readTime: article.readTime,
    publishedAt: article.publishedAt,
    tags: article.tags,
    blocks: article.blocks,
  };
}

/**
 * Transform article to list item view model
 * Minimal fields for list/archive rendering
 */
export function toArticleListItemViewModel(
  article: Article,
): ArticleListItemViewModel {
  return {
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    tags: article.tags,
  };
}
