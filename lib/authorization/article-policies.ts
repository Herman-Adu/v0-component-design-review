import "server-only";

import type { Article } from "@/lib/strapi/articles";

export interface ArticleAccessActor {
  id?: string;
  roles?: string[];
  permissions?: string[];
}

export interface ArticleAccessContext {
  actor?: ArticleAccessActor;
}

export function canReadArticle(
  _article: Article,
  _context?: ArticleAccessContext,
): boolean {
  return true;
}
