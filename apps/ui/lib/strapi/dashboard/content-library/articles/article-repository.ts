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

export async function listArticles(): Promise<Article[]> {
  repoLogger.queryStart("article-repository", "listArticles");
  const result = await getArticleList();
  repoLogger.queryComplete("article-repository", "listArticles", result.length);
  return result;
}

export async function listArticleSlugs(): Promise<string[]> {
  const articles = await getArticleList();
  return articles.map((article) => article.slug);
}

export async function getArticleRecordBySlug(
  slug: string,
): Promise<ArticleRecord | null> {
  repoLogger.queryStart("article-repository", "getArticleRecordBySlug", {
    slug,
  });
  const articles = await getArticleList();
  const article = articles.find((a) => a.slug === slug);
  if (!article) {
    repoLogger.queryComplete(
      "article-repository",
      "getArticleRecordBySlug",
      null,
    );
    return null;
  }

  const content = await getArticleContentDocument(slug);
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

export async function getArticlesByCategory(
  category: Article["category"],
): Promise<Article[]> {
  const articles = await listArticles();
  return articles.filter((article) => article.category === category);
}

export async function getArticlesByLevel(
  level: Article["level"],
): Promise<Article[]> {
  const articles = await listArticles();
  return articles.filter((article) => article.level === level);
}

/**
 * List articles by audience (stub — content-library does not use audience field)
 */
export async function listArticlesByAudience(
  _audience: string,
): Promise<Article[]> {
  return listArticles();
}
