import "server-only";
import {
  GuideContentDocumentSchema,
  type GuideLevel,
  type GuideCategory,
  type GuideContentBlock,
  type GuideContentDocument,
} from "@/lib/strapi/dashboard/content-library/guides/guide-schema";
export type { GuideContentMeta } from "@/lib/strapi/dashboard/content-library/guides/guide-schema";
import { transformStrapiContentDTO } from "@/lib/strapi/dashboard/_shared/strapi-dto-transformer";
import { dataLogger } from "@/lib/utils/arch-logger";

/**
 * Guide list item generated from content metadata + blocks
 */
export interface Guide {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: GuideLevel;
  category: GuideCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
  blocks: GuideContentBlock[];
}

// ============================================================================
// Strapi fetch
// ============================================================================

const POPULATE =
  "populate[blocks][populate]=*&populate[meta]=*&populate[toc]=*";
const PAGE_SIZE = "pagination[pageSize]=100";

async function fetchGuidesFromStrapi(): Promise<GuideContentDocument[]> {
  const url = `${process.env.STRAPI_URL}/api/guides?${POPULATE}&${PAGE_SIZE}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
    next: { revalidate: 3600, tags: ["guides"] },
  });

  if (!res.ok) {
    throw new Error(`Strapi guides fetch failed: ${res.status}`);
  }

  const { data } = (await res.json()) as { data: unknown[] };

  dataLogger.loadStart("guides", url);

  const documents = data.map((dto, i) => {
    const transformed = transformStrapiContentDTO(dto);
    const result = GuideContentDocumentSchema.safeParse(transformed);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError("guide", String(i), issues.split(" | "));
      throw new Error(`Invalid guide content at index ${i}: ${issues}`);
    }
    return result.data as GuideContentDocument;
  });

  dataLogger.loadComplete("guides", documents.length, url);
  dataLogger.validationSuccess("guides", documents.length);

  return documents;
}

// ============================================================================
// Registry builder (keyed by slug for O(1) lookups)
// ============================================================================

async function buildGuideRegistry(): Promise<Record<string, GuideContentDocument>> {
  const documents = await fetchGuidesFromStrapi();
  return Object.fromEntries(documents.map((doc) => [doc.meta.slug, doc]));
}

// ============================================================================
// Public API (async — repositories and pages must await these)
// ============================================================================

/**
 * Get all guides as a sorted list
 */
export async function getGuideList(): Promise<Guide[]> {
  const registry = await buildGuideRegistry();
  return Object.entries(registry)
    .map(([, document], index) => ({
      id: String(index + 1),
      slug: document.meta.slug,
      title: document.meta.title,
      excerpt: document.meta.excerpt,
      level: document.meta.level as GuideLevel,
      category: document.meta.category as GuideCategory,
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
 * Get guide content document by slug
 */
export async function getGuideContentDocument(
  slug: string,
): Promise<GuideContentDocument | null> {
  const registry = await buildGuideRegistry();
  return registry[slug] ?? null;
}

/**
 * Get all guide slugs for static params generation
 */
export async function getAllGuideContentSlugs(): Promise<string[]> {
  const registry = await buildGuideRegistry();
  return Object.keys(registry);
}
