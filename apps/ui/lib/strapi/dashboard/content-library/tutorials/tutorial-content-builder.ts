import "server-only";

import {
  TutorialContentDocumentSchema,
  type TutorialLevel,
  type TutorialCategory,
  type TutorialContentBlock,
  type TutorialContentDocument,
} from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-schema";
export type { TutorialContentMeta } from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-schema";
import { transformStrapiContentDTO } from "@/lib/strapi/dashboard/_shared/strapi-dto-transformer";
import { dataLogger } from "@/lib/utils/arch-logger";

/**
 * Tutorial list item generated from content metadata + blocks
 */
export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: TutorialLevel;
  category: TutorialCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
  blocks: TutorialContentBlock[];
}

// ============================================================================
// Strapi fetch
// ============================================================================

const POPULATE =
  "populate[blocks][populate]=*&populate[meta]=*&populate[toc]=*";
const PAGE_SIZE = "pagination[pageSize]=100";

async function fetchTutorialsFromStrapi(): Promise<TutorialContentDocument[]> {
  if (!process.env.STRAPI_URL) return []; // Strapi not configured (CI)
  const url = `${process.env.STRAPI_URL}/api/tutorials?${POPULATE}&${PAGE_SIZE}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
    next: { revalidate: 3600, tags: ["tutorials"] },
  });

  if (!res.ok) {
    throw new Error(`Strapi tutorials fetch failed: ${res.status}`);
  }

  const { data } = (await res.json()) as { data: unknown[] };

  dataLogger.loadStart("tutorials", url);

  const documents = data.map((dto, i) => {
    const transformed = transformStrapiContentDTO(dto);
    const result = TutorialContentDocumentSchema.safeParse(transformed);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError("tutorial", String(i), issues.split(" | "));
      throw new Error(`Invalid tutorial content at index ${i}: ${issues}`);
    }
    return result.data as TutorialContentDocument;
  });

  dataLogger.loadComplete("tutorials", documents.length, url);
  dataLogger.validationSuccess("tutorials", documents.length);

  return documents;
}

// ============================================================================
// Registry builder (keyed by slug for O(1) lookups)
// ============================================================================

async function buildTutorialRegistry(): Promise<Record<string, TutorialContentDocument>> {
  const documents = await fetchTutorialsFromStrapi();
  return Object.fromEntries(documents.map((doc) => [doc.meta.slug, doc]));
}

// ============================================================================
// Public API (async — repositories and pages must await these)
// ============================================================================

/**
 * Get all tutorials as a sorted list
 */
export async function getTutorialList(): Promise<Tutorial[]> {
  const registry = await buildTutorialRegistry();
  return Object.entries(registry)
    .map(([, document], index) => ({
      id: String(index + 1),
      slug: document.meta.slug,
      title: document.meta.title,
      excerpt: document.meta.excerpt,
      level: document.meta.level as TutorialLevel,
      category: document.meta.category as TutorialCategory,
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
 * Get tutorial content document by slug
 */
export async function getTutorialContentDocument(
  slug: string,
): Promise<TutorialContentDocument | null> {
  const registry = await buildTutorialRegistry();
  return registry[slug] ?? null;
}

/**
 * Get all tutorial slugs for static params generation
 */
export async function getAllTutorialContentSlugs(): Promise<string[]> {
  const registry = await buildTutorialRegistry();
  return Object.keys(registry);
}
