/**
 * Base Repository Interface
 *
 * Establishes the repository pattern for all content types (both content-library and documentation).
 * This is the single source of truth for repository method signatures and patterns.
 * Implements server-only data access with consistent filtering and retrieval methods.
 *
 * Authority: ARCHITECTURE_ALIGNMENT_AUDIT_2026-03-03.md - Repository Method Parity Finding
 * Pattern: All repositories inherit from this interface and implement required + optional methods
 */

import "server-only";

/**
 * Base record interface for repositories
 * Ensures consistency across document/content structure
 */
export interface BaseRecord<TDocument> {
  document: TDocument;
  content: TDocument;
}

/**
 * Base Repository Interface
 * Defines all methods that content repositories should implement
 *
 * Generic Parameters:
 * - TDocument: The document type (e.g., ArticleContentDocument, StrategicOverviewDocument)
 * - TFilter: The filter criteria type (e.g., category, level, or audience)
 */
export interface IBaseRepository<TDocument, TFilter = string> {
  /**
   * List all documents
   * Returns complete array of all documents
   */
  list(): TDocument[];

  /**
   * Get all document slugs
   * Used for static generation and routing
   * Returns array of unique slug strings
   */
  listSlugs(): string[];

  /**
   * Get a document by slug
   * Primary lookup method for individual document access
   * Returns record containing both summary and full content, or null if not found
   */
  getRecordBySlug(slug: string): BaseRecord<TDocument> | null;

  /**
   * Filter documents by category (optional)
   * Content-library specific method
   * Returns filtered array of documents matching category
   */
  listByCategory?(category: TFilter): TDocument[];

  /**
   * Filter documents by level (optional)
   * Content-library specific method
   * Returns filtered array of documents matching level
   */
  listByLevel?(level: TFilter): TDocument[];

  /**
   * Filter documents by audience (optional)
   * Documentation specific method
   * Returns filtered array of documents matching audience
   */
  listByAudience?(audience: TFilter): TDocument[];

  /**
   * Search documents (optional)
   * Reserved for future implementation
   * Would support full-text or structured search
   */
  search?(query: string): TDocument[];

  /**
   * Get documents by tag (optional)
   * Reserved for future implementation
   * Would filter by semantic tags
   */
  listByTag?(tag: TFilter): TDocument[];
}

/**
 * Record Type Helper
 * Exported for convenience in repository implementations
 * Usage: type ArticleRecord = ContentRecord<ArticleContentDocument>;
 */
export type ContentRecord<T> = BaseRecord<T>;
