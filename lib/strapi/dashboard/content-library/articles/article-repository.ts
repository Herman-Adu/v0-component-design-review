/**
 * Article Repository
 *
 * Data access layer for articles content type with query logging.
 * Implements IBaseRepository pattern for consistent method signatures.
 *
 * Authority: ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import "server-only";
import {
  getArticleList,
  getArticleContentDocument,
  type Article,
} from "@/lib/strapi/dashboard/content-library/articles/article-content-builder";
import type { ArticleContentDocument } from "@/lib/strapi/dashboard/content-library/articles/article-schema";
import { repoLogger } from "@/lib/utils/arch-logger";

export interface ArticleRecord {
  article: Article;
  content: ArticleContentDocument;
}

export function listArticles(): Article[] {
  repoLogger.queryStart("article-repository", "listArticles");
  const result = getArticleList();
  repoLogger.queryComplete("article-repository", "listArticles", result.length);
  return result;
}

export function listArticleSlugs(): string[] {
  return getArticleList().map((article) => article.slug);
}

export function getArticleRecordBySlug(slug: string): ArticleRecord | null {
  repoLogger.queryStart("article-repository", "getArticleRecordBySlug", {
    slug,
  });
  const article = getArticleList().find((a) => a.slug === slug);
  if (!article) {
    repoLogger.queryComplete(
      "article-repository",
      "getArticleRecordBySlug",
      null,
    );
    return null;
  }

  const content = getArticleContentDocument(slug);
  if (!content) {
    repoLogger.queryComplete(
      "article-repository",
      "getArticleRecordBySlug",
      null,
    );
    return null;
  }

  repoLogger.queryComplete("article-repository", "getArticleRecordBySlug", 1);
  return { article, content };
}

export function getArticlesByCategory(
  category: Article["category"],
): Article[] {
  return listArticles().filter((article) => article.category === category);
}

export function getArticlesByLevel(level: Article["level"]): Article[] {
  return listArticles().filter((article) => article.level === level);
}

/**
 * List articles by audience (optional extension)
 * Provided for consistency with documentation repositories
 * Returns filtered array of articles matching audience
 */
export function listArticlesByAudience(audience: string): Article[] {
  // Content-library doesn't currently use audience field; this is a no-op stub
  return listArticles();
}
