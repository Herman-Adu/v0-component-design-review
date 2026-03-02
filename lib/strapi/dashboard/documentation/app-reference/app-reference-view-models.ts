import type { AppReferenceDocument } from "./app-reference-schema";

/**
 * App Reference View Models
 *
 * Transforms app reference documents into UI-optimized shapes.
 * Follows the pattern established by article-view-models.ts
 */

export interface AppReferenceDetailViewModel {
  slug: string;
  title: string;
  excerpt: string;
  category: "app-reference";
  audience: string;
  publishedAt: string;
  lastUpdated: string;
  tags: string[];
  blocks: AppReferenceDocument["blocks"];
  toc?: AppReferenceDocument["toc"];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
  };
}

/**
 * Transform app reference document to detail view model
 */
export function toAppReferenceDetailViewModel(
  document: AppReferenceDocument,
): AppReferenceDetailViewModel {
  return {
    slug: document.meta.slug,
    title: document.meta.title,
    excerpt: document.meta.excerpt,
    category: document.meta.category,
    audience: document.meta.audience,
    publishedAt: document.meta.publishedAt,
    lastUpdated: document.meta.lastUpdated,
    tags: document.meta.tags,
    blocks: document.blocks,
    toc: document.toc,
    seo: {
      metaTitle: document.seo?.metaTitle ?? document.meta.title,
      metaDescription: document.seo?.metaDescription ?? document.meta.excerpt,
      canonicalUrl: document.seo?.canonicalUrl,
    },
  };
}

export interface AppReferenceListItemViewModel {
  slug: string;
  title: string;
  excerpt: string;
  audience: string;
  lastUpdated: string;
  tags: string[];
}

/**
 * Transform app reference document to list item view model
 */
export function toAppReferenceListItemViewModel(
  document: AppReferenceDocument,
): AppReferenceListItemViewModel {
  return {
    slug: document.meta.slug,
    title: document.meta.title,
    excerpt: document.meta.excerpt,
    audience: document.meta.audience,
    lastUpdated: document.meta.lastUpdated,
    tags: document.meta.tags,
  };
}
