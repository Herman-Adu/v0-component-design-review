import type { StrategicOverviewDocument } from "./strategic-overview-schema";

/**
 * Strategic Overview View Models
 *
 * Transforms strategic overview documents into UI-optimized shapes.
 * Follows the pattern established by article-view-models.ts
 */

export interface StrategicOverviewDetailViewModel {
  slug: string;
  title: string;
  excerpt: string;
  category: "strategic-overview";
  audience: string;
  publishedAt: string;
  lastUpdated: string;
  tags: string[];
  blocks: StrategicOverviewDocument["blocks"];
  toc?: StrategicOverviewDocument["toc"];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
  };
}

/**
 * Transform strategic overview document to detail view model
 */
export function toStrategicOverviewDetailViewModel(
  document: StrategicOverviewDocument,
): StrategicOverviewDetailViewModel {
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

export interface StrategicOverviewListItemViewModel {
  slug: string;
  title: string;
  excerpt: string;
  audience: string;
  lastUpdated: string;
  tags: string[];
}

/**
 * Transform strategic overview document to list item view model
 */
export function toStrategicOverviewListItemViewModel(
  document: StrategicOverviewDocument,
): StrategicOverviewListItemViewModel {
  return {
    slug: document.meta.slug,
    title: document.meta.title,
    excerpt: document.meta.excerpt,
    audience: document.meta.audience,
    lastUpdated: document.meta.lastUpdated,
    tags: document.meta.tags,
  };
}
