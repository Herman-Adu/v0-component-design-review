import "server-only";
import {
  ArticleContentDocumentSchema,
  type ArticleLevel,
  type ArticleCategory,
  type ArticleContentBlock,
  type ArticleContentDocument,
} from "@/lib/strapi/dashboard/content-library/articles/article-schema";
export type { ArticleContentMeta } from "@/lib/strapi/dashboard/content-library/articles/article-schema";
import { transformStrapiContentDTO } from "@/lib/strapi/dashboard/_shared/strapi-dto-transformer";
import { dataLogger } from "@/lib/utils/arch-logger";

/**
 * Article list item generated from content metadata + blocks
 */
export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: ArticleLevel;
  category: ArticleCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
  blocks: ArticleContentBlock[];
}

// ============================================================================
// Strapi fetch
// ============================================================================

const POPULATE =
  "populate[blocks][populate]=*&populate[meta]=*&populate[toc]=*";
const PAGE_SIZE = "pagination[pageSize]=100";

async function fetchArticlesFromStrapi(): Promise<ArticleContentDocument[]> {
  const url = `${process.env.STRAPI_URL}/api/articles?${POPULATE}&${PAGE_SIZE}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
    next: { revalidate: 3600, tags: ["articles"] },
  });

  if (!res.ok) {
    throw new Error(`Strapi articles fetch failed: ${res.status}`);
  }

  const { data } = (await res.json()) as { data: unknown[] };

  dataLogger.loadStart("articles", url);

  const documents = data.map((dto, i) => {
    const transformed = transformStrapiContentDTO(dto);
    const result = ArticleContentDocumentSchema.safeParse(transformed);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError("article", String(i), issues.split(" | "));
      throw new Error(`Invalid article content at index ${i}: ${issues}`);
    }
    return result.data as ArticleContentDocument;
  });

  dataLogger.loadComplete("articles", documents.length, url);
  dataLogger.validationSuccess("articles", documents.length);

  return documents;
}

// ============================================================================
// Registry builder (keyed by slug for O(1) lookups)
// ============================================================================

async function buildArticleRegistry(): Promise<
  Record<string, ArticleContentDocument>
> {
  const documents = await fetchArticlesFromStrapi();
  return Object.fromEntries(documents.map((doc) => [doc.meta.slug, doc]));
}

// ============================================================================
// Public API (async — repositories and pages must await these)
// ============================================================================

/**
 * Get all articles as a sorted list
 */
export async function getArticleList(): Promise<Article[]> {
  const registry = await buildArticleRegistry();
  return Object.entries(registry)
    .map(([, document], index) => ({
      id: String(index + 1),
      slug: document.meta.slug,
      title: document.meta.title,
      excerpt: document.meta.excerpt,
      level: document.meta.level as ArticleLevel,
      category: document.meta.category as ArticleCategory,
      readTime: document.meta.readTime ?? "",
      publishedAt: document.meta.publishedAt,
      tags: document.meta.tags,
      blocks: document.blocks,
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

/**
 * Get article content document by slug
 */
export async function getArticleContentDocument(
  slug: string,
): Promise<ArticleContentDocument | null> {
  const registry = await buildArticleRegistry();
  return registry[slug] ?? null;
}

/**
 * Get all article slugs for static params generation
 */
export async function getAllArticleContentSlugs(): Promise<string[]> {
  const registry = await buildArticleRegistry();
  return Object.keys(registry);
}
