import type { Article } from "@/lib/strapi/dashboard/content-library/articles/articles";

export interface ArticleDetailViewModel {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: Article["level"];
  category: Article["category"];
  readTime: string;
  publishedAt: string;
  tags: string[];
  content: string;
}

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
    content: article.content,
  };
}
