import type { CmsReferenceDocument } from "./cms-reference-schema";

/**
 * CMS Reference View Models
 *
 * Transforms CMS reference documents into UI-optimized shapes.
 * Follows the pattern established by article-view-models.ts
 */

export interface CmsReferenceDetailViewModel {
  slug: string;
  title: string;
  excerpt: string;
  category: "cms-reference";
  audience: string;
  publishedAt: string;
  lastUpdated: string;
  tags: string[];
  blocks: CmsReferenceDocument["blocks"];
  toc?: CmsReferenceDocument["toc"];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
  };
}

/**
 * Transform CMS reference document to detail view model
 */
export function toCmsReferenceDetailViewModel(
  document: CmsReferenceDocument,
): CmsReferenceDetailViewModel {
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

export interface CmsReferenceListItemViewModel {
  slug: string;
  title: string;
  excerpt: string;
  audience: string;
  lastUpdated: string;
  tags: string[];
}

/**
 * Transform CMS reference document to list item view model
 */
export function toCmsReferenceListItemViewModel(
  document: CmsReferenceDocument,
): CmsReferenceListItemViewModel {
  return {
    slug: document.meta.slug,
    title: document.meta.title,
    excerpt: document.meta.excerpt,
    audience: document.meta.audience,
    lastUpdated: document.meta.lastUpdated,
    tags: document.meta.tags,
  };
}
