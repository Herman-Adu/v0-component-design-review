/**
 * CMS Reference View Models
 *
 * Transforms CMS reference documents into UI-ready view models.
 * Implements documentation view model pattern with detail and list item variants.
 *
 * Authority: base-view-model.ts, ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import type { CmsReferenceDocument } from "./cms-reference-schema";
import type {
  DocumentationDetailViewModel,
  DocumentationListItemViewModel,
} from "@/lib/strapi/dashboard/_shared/base-view-model";

export interface CmsReferenceDetailViewModel extends Omit<
  DocumentationDetailViewModel,
  "id" | "category"
> {
  category: "cms-reference";
}

export interface CmsReferenceListItemViewModel extends DocumentationListItemViewModel {}

/**
 * Transform CMS reference document to detail view model
 * Includes all fields for detail page rendering with SEO fallbacks
 */
export function toCmsReferenceDetailViewModel(
  document: CmsReferenceDocument,
): CmsReferenceDetailViewModel {
  return {
    slug: document.meta.slug,
    title: document.meta.title,
    excerpt: document.meta.excerpt,
    category: document.meta.category as "cms-reference",
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

/**
 * Transform CMS reference document to list item view model
 * Minimal fields for list/archive rendering
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
