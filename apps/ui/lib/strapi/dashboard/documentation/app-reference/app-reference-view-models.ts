/**
 * App Reference View Models
 *
 * Transforms app reference documents into UI-ready view models.
 * Implements documentation view model pattern with detail and list item variants.
 *
 * Authority: base-view-model.ts, ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md
 */

import type { AppReferenceDocument } from "./app-reference-schema";
import type {
  DocumentationDetailViewModel,
  DocumentationListItemViewModel,
} from "@/lib/strapi/dashboard/_shared/base-view-model";

export interface AppReferenceDetailViewModel extends Omit<
  DocumentationDetailViewModel,
  "id" | "category"
> {
  category: "app-reference";
}

export interface AppReferenceListItemViewModel extends DocumentationListItemViewModel {}

/**
 * Transform app reference document to detail view model
 * Includes all fields for detail page rendering with SEO fallbacks
 */
export function toAppReferenceDetailViewModel(
  document: AppReferenceDocument,
): AppReferenceDetailViewModel {
  return {
    slug: document.meta.slug,
    title: document.meta.title,
    excerpt: document.meta.excerpt,
    category: document.meta.category as "app-reference",
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
 * Transform app reference document to list item view model
 * Minimal fields for list/archive rendering
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
