/**
 * Base Content View Models
 *
 * Establishes the view model pattern for all content types (both content-library and documentation).
 * This is the single source of truth for view model structures and transformation patterns.
 *
 * Authority: ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md - View Model Standardization Finding
 * Pattern: All view models follow DetailViewModel and ListItemViewModel structure with consistent fields
 */

import type { ContentBlock } from "./block-schema";

/**
 * Common fields for all detail view models
 * Provides single source of truth for document → UI transformation
 */
export interface BaseDetailViewModel {
  /**
   * Unique identifier for the content
   * Used for cache keys, analytics event tracking, and form submission
   */
  id: string;

  /**
   * URL-safe slug for routing
   * Content-library format: /dashboard/content-library/{category}/{slug}
   * Documentation format: /dashboard/documentation/{category}/{slug}
   */
  slug: string;

  /**
   * Display title for UI rendering
   */
  title: string;

  /**
   * Short excerpt for previews and meta descriptions
   */
  excerpt: string;

  /**
   * Category for classification and filtering
   * Content-library: article | case-study | guide | tutorial subcategories
   * Documentation: strategic-overview | cms-reference | app-reference | infrastructure-ops
   */
  category: string;

  /**
   * ISO timestamp for publication
   */
  publishedAt: string;

  /**
   * Semantic tags for filtering and organization
   * Shared across both sections
   */
  tags: string[];

  /**
   * Content blocks (atoms/molecules/organisms) for rendering
   * All content types use atomic design blocks
   */
  blocks: ContentBlock[];
}

/**
 * Common fields for all list item view models
 * Used in collections, archives, and search results
 */
export interface BaseListItemViewModel {
  /**
   * URL-safe slug for routing
   */
  slug: string;

  /**
   * Display title for list rendering
   */
  title: string;

  /**
   * Short excerpt for preview cards
   */
  excerpt: string;

  /**
   * Semantic tags for filtering
   */
  tags: string[];
}

/**
 * Content-Library Specific Extensions
 * Additional fields relevant only to content-library items
 */
export interface ContentLibraryDetailViewModelExtension {
  /**
   * Difficulty level for tutorials, guides, articles
   * Format: "beginner" | "intermediate" | "advanced"
   */
  level: string;

  /**
   * Estimated reading time with unit
   * Format: "5 min read", "15 min read"
   */
  readTime: string;
}

/**
 * Documentation Specific Extensions
 * Additional fields relevant only to documentation items
 */
export interface DocumentationDetailViewModelExtension {
  /**
   * Target audience for the documentation
   * Format: "developers" | "architects" | "devops" | "all"
   */
  audience: string;

  /**
   * ISO timestamp of last update
   * Used to indicate freshness and maintenance status
   */
  lastUpdated: string;

  /**
   * Optional table of contents for navigation
   * Extracted from blocks for quick navigation
   */
  toc?: Array<{
    level: number;
    title: string;
    id: string;
  }>;

  /**
   * SEO metadata with fallback chain
   * Fallbacks: explicit seo → meta fields → generated
   */
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalUrl?: string;
  };
}

/**
 * Composed View Model Types
 * Exported for reference in implementation
 */

export type ContentLibraryDetailViewModel = BaseDetailViewModel &
  ContentLibraryDetailViewModelExtension;

export type ContentLibraryListItemViewModel = BaseListItemViewModel;

export type DocumentationDetailViewModel = BaseDetailViewModel &
  DocumentationDetailViewModelExtension;

export type DocumentationListItemViewModel = BaseListItemViewModel &
  Pick<DocumentationDetailViewModelExtension, "audience" | "lastUpdated">;

/**
 * View Model Transformation Factory
 * Provides type-safe factory methods for creating view models
 */
export interface IViewModelFactory<
  TSource,
  TDetailViewModel,
  TListItemViewModel,
> {
  toDetailViewModel(source: TSource): TDetailViewModel;
  toListItemViewModel(source: TSource): TListItemViewModel;
}
