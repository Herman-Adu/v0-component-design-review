import "server-only";

import {
  articles,
  type Article,
  type ArticleCategory,
  type ArticleLevel,
} from "@/data/content-library/articles";

export type { Article, ArticleCategory, ArticleLevel };

export function getAllArticles(): Article[] {
  return articles;
}

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}

export function getArticlesByLevel(level: ArticleLevel): Article[] {
  return articles.filter((article) => article.level === level);
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((article) => article.category === category);
}

export function getAllArticleSlugs(): string[] {
  return articles.map((article) => article.slug);
}
