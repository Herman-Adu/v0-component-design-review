import "server-only";

import {
  getAllArticles,
  getArticleBySlug,
  type Article,
} from "@/lib/strapi/articles";
import {
  getArticleContentDocument,
  type ArticleContentDocument,
} from "@/lib/strapi/article-content";

export interface ArticleRecord {
  article: Article;
  content: ArticleContentDocument;
}

export function listArticles(): Article[] {
  return getAllArticles();
}

export function listArticleSlugs(): string[] {
  return getAllArticles().map((article) => article.slug);
}

export function getArticleRecordBySlug(slug: string): ArticleRecord | null {
  const article = getArticleBySlug(slug);
  if (!article) {
    return null;
  }

  const content = getArticleContentDocument(slug);
  if (!content) {
    return null;
  }

  return { article, content };
}
