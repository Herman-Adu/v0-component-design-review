import type { InfrastructureOpsDocument } from "./infrastructure-ops-schema";

/**
 * Infrastructure & Ops View Models
 *
 * Transforms infrastructure ops documents into UI-optimized shapes.
 * Follows the pattern established by article-view-models.ts
 */

export interface InfrastructureOpsDetailViewModel {
  slug: string;
  title: string;
  excerpt: string;
  category: "infrastructure-ops";
  audience: string;
  publishedAt: string;
  lastUpdated: string;
  tags: string[];
  blocks: InfrastructureOpsDocument["blocks"];
  toc?: InfrastructureOpsDocument["toc"];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
  };
}

/**
 * Transform infrastructure ops document to detail view model
 */
export function toInfrastructureOpsDetailViewModel(
  document: InfrastructureOpsDocument,
): InfrastructureOpsDetailViewModel {
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

export interface InfrastructureOpsListItemViewModel {
  slug: string;
  title: string;
  excerpt: string;
  audience: string;
  lastUpdated: string;
  tags: string[];
}

/**
 * Transform infrastructure ops document to list item view model
 */
export function toInfrastructureOpsListItemViewModel(
  document: InfrastructureOpsDocument,
): InfrastructureOpsListItemViewModel {
  return {
    slug: document.meta.slug,
    title: document.meta.title,
    excerpt: document.meta.excerpt,
    audience: document.meta.audience,
    lastUpdated: document.meta.lastUpdated,
    tags: document.meta.tags,
  };
}
