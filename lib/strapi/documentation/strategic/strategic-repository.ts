import "server-only";

import {
  getStrategicArticles,
  getStrategicArticleBySlug,
  getAllStrategicArticleSlugs,
  getStrategicArticlesByCategory,
  getStrategicArticlesByLevel,
  searchStrategicArticles,
  StrategicDocumentation,
} from "./strategic-content-builder";

/**
 * Strategic Documentation Repository
 *
 * This is a server-only module (enforced by 'use server-only').
 * It provides the interface for accessing strategic documentation articles.
 *
 * The repository pattern abstracts data access:
 * - If we switch from JSON to Strapi API later, only this file changes
 * - Pages and components don't need to know where data comes from
 * - We can add caching, logging, and error handling here
 */

export interface StrategicDocumentationRepository {
  getBySlug(slug: string): Promise<StrategicDocumentation | null>;
  listAll(): Promise<StrategicDocumentation[]>;
  listByCategory(
    category: StrategicDocumentation["meta"]["category"],
  ): Promise<StrategicDocumentation[]>;
  listByLevel(
    level: StrategicDocumentation["meta"]["level"],
  ): Promise<StrategicDocumentation[]>;
  search(query: string): Promise<StrategicDocumentation[]>;
  getAllSlugs(): Promise<string[]>;
}

/**
 * Strategic Documentation Repository Implementation
 */
const repository: StrategicDocumentationRepository = {
  /**
   * Get a single article by slug
   * Used for detail pages: /documentation/strategic/[slug]
   */
  async getBySlug(slug: string): Promise<StrategicDocumentation | null> {
    // Log for observability
    console.log(`[Repository] Fetching strategic article: ${slug}`);

    const article = getStrategicArticleBySlug(slug);

    if (!article) {
      console.warn(`[Repository] Article not found: ${slug}`);
      return null;
    }

    console.log(`[Repository] Retrieved article: "${article.meta.title}"`);
    return article;
  },

  /**
   * Get all articles
   * Used for list pages: /documentation/strategic
   */
  async listAll(): Promise<StrategicDocumentation[]> {
    console.log(`[Repository] Fetching all strategic articles`);

    const articles = getStrategicArticles();
    console.log(`[Repository] Retrieved ${articles.length} articles`);

    return articles;
  },

  /**
   * Get articles by category
   * Categories: vision, decisions, patterns, roadmap, phases
   */
  async listByCategory(
    category: StrategicDocumentation["meta"]["category"],
  ): Promise<StrategicDocumentation[]> {
    console.log(
      `[Repository] Fetching strategic articles by category: ${category}`,
    );

    const articles = getStrategicArticlesByCategory(category);
    console.log(
      `[Repository] Retrieved ${articles.length} articles for category "${category}"`,
    );

    return articles;
  },

  /**
   * Get articles by level
   * Levels: beginner, intermediate, advanced
   */
  async listByLevel(
    level: StrategicDocumentation["meta"]["level"],
  ): Promise<StrategicDocumentation[]> {
    console.log(`[Repository] Fetching strategic articles by level: ${level}`);

    const articles = getStrategicArticlesByLevel(level);
    console.log(
      `[Repository] Retrieved ${articles.length} articles for level "${level}"`,
    );

    return articles;
  },

  /**
   * Search articles by keyword
   * Searches in title, excerpt, and tags
   */
  async search(query: string): Promise<StrategicDocumentation[]> {
    console.log(`[Repository] Searching for: "${query}"`);

    const results = searchStrategicArticles(query);
    console.log(`[Repository] Found ${results.length} matching articles`);

    return results;
  },

  /**
   * Get all article slugs for static generation
   * Used in generateStaticParams()
   */
  async getAllSlugs(): Promise<string[]> {
    console.log(`[Repository] Fetching all strategic article slugs`);

    const slugs = getAllStrategicArticleSlugs();
    console.log(`[Repository] Retrieved ${slugs.length} slugs`);

    return slugs;
  },
};

export default repository;
export type { StrategicDocumentation };
