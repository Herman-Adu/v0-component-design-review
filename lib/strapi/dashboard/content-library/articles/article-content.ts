/**
 * Article Content API
 *
 * Public facade for article content access.
 * Functions and aggregate type from builder; schema types from schema (SSOT).
 */

// Functions and aggregate list-item type (computed with id)
export {
  getArticleList,
  getArticleContentDocument,
  getAllArticleContentSlugs,
  type Article,
} from "./article-content-builder";

// Schema types — imported directly from schema (not via builder)
export type {
  ArticleLevel,
  ArticleCategory,
  ArticleContentBlock,
  ArticleContentMeta,
  ArticleContentDocument,
} from "./article-schema";
