/**
 * Complete Document Type Definitions
 * Includes: Meta, SEO, Route, Access, TOC, Blocks
 * Aligned with: STRAPI_DYNAMIC_ZONES_AUTHORITY.md canonical contract
 */

import * as Blocks from './strapi-mock-blocks';

export interface DocumentMeta {
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
  readTime?: string;
  publishedAt: string;
  tags?: string[];
}

export interface DocumentSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  canonicalUrl?: string;
  metaImage?: string | { url: string; alt?: string };
  metaSocial?: Array<{
    socialNetwork: "Facebook" | "Twitter";
    title?: string;
    description?: string;
    image?: string | { url: string; alt?: string };
  }>;
  robots?: string | { index?: boolean; follow?: boolean };
  preventIndexing?: boolean;
}

export interface DocumentRoute {
  pattern: string;
  params: Record<string, string>;
}

export interface DocumentAccess {
  requiresAuth?: boolean;
  requiredRoles?: string[];
  visibleToPublic?: boolean;
}

export interface DocumentTOCItem {
  id?: string;
  title: string;
  level: number;
  children?: DocumentTOCItem[];
}

export interface ContentDocument {
  meta: DocumentMeta;
  seo?: DocumentSEO;
  route?: DocumentRoute;
  access?: DocumentAccess;
  toc?: DocumentTOCItem[];
  blocks: Blocks.Block[];
  [key: string]: unknown;  // Allow additional domain-specific fields
}
