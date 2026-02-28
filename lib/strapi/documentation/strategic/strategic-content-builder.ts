import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import {
  StrategicDocumentation,
  StrategicDocumentationSchema,
} from "./strategic-schema";

/**
 * Content Builder for Strategic Documentation
 *
 * Loads all strategic documentation articles from /data/documentation-strategic/
 * at module initialization time. Validates each article against the Zod schema.
 * Fails the build if any article is invalid (strict validation).
 *
 * This ensures data integrity at build time, preventing invalid data from reaching
 * the application.
 */

const DATA_DIR = join(process.cwd(), "data", "documentation-strategic");

// Article registry loaded at module init
const articles: StrategicDocumentation[] = [];
const articlesBySlug: Map<string, StrategicDocumentation> = new Map();

/**
 * Initialize article registry at module load time
 */
function initializeArticles(): void {
  try {
    const files = readdirSync(DATA_DIR).filter((file) =>
      file.endsWith(".json"),
    );

    for (const file of files) {
      const filePath = join(DATA_DIR, file);
      const content = readFileSync(filePath, "utf-8");
      const data = JSON.parse(content);

      // Validate against schema
      const parsed = StrategicDocumentationSchema.parse(data);
      articles.push(parsed);
      articlesBySlug.set(parsed.meta.slug, parsed);
    }

    console.log(
      `✅ Loaded ${articles.length} strategic documentation articles`,
    );
  } catch (error) {
    if (error instanceof Error) {
      console.warn(
        `⚠️  Could not load articles from filesystem: ${error.message}`,
      );
      console.warn("   Article registry initialized as empty.");
    }
  }
}

// Initialize on module load
initializeArticles();

/**
 * Get all strategic documentation articles
 */
export function getStrategicArticles(): StrategicDocumentation[] {
  return articles;
}

/**
 * Get a single article by slug
 */
export function getStrategicArticleBySlug(
  slug: string,
): StrategicDocumentation | null {
  return articlesBySlug.get(slug) || null;
}

/**
 * Get all article slugs (for generateStaticParams)
 */
export function getAllStrategicArticleSlugs(): string[] {
  return Array.from(articlesBySlug.keys());
}

/**
 * Get articles by category
 */
export function getStrategicArticlesByCategory(
  category: StrategicDocumentation["meta"]["category"],
): StrategicDocumentation[] {
  return articles.filter((article) => article.meta.category === category);
}

/**
 * Get articles by level
 */
export function getStrategicArticlesByLevel(
  level: StrategicDocumentation["meta"]["level"],
): StrategicDocumentation[] {
  return articles.filter((article) => article.meta.level === level);
}

/**
 * Search articles by keyword in title, excerpt, or tags
 */
export function searchStrategicArticles(
  query: string,
): StrategicDocumentation[] {
  const lowerQuery = query.toLowerCase();
  return articles.filter((article) => {
    const searchText = [
      article.meta.title,
      article.meta.excerpt,
      article.meta.tags?.join(" ") || "",
    ]
      .join(" ")
      .toLowerCase();
    return searchText.includes(lowerQuery);
  });
}

export type { StrategicDocumentation };
