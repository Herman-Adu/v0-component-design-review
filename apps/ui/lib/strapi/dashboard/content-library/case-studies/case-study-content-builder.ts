import "server-only";
import {
  CaseStudyContentDocumentSchema,
  type CaseStudyLevel,
  type CaseStudyCategory,
  type CaseStudyContentBlock,
  type CaseStudyContentDocument,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-schema";
export type { CaseStudyContentMeta } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-schema";
import { transformStrapiContentDTO } from "@/lib/strapi/dashboard/_shared/strapi-dto-transformer";
import { dataLogger } from "@/lib/utils/arch-logger";

/**
 * Case Study list item generated from content metadata + blocks
 */
export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  level: CaseStudyLevel;
  category: CaseStudyCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
  blocks: CaseStudyContentBlock[];
}

// ============================================================================
// Strapi fetch
// ============================================================================

const POPULATE =
  "populate[blocks][populate]=*&populate[meta]=*&populate[toc]=*";
const PAGE_SIZE = "pagination[pageSize]=100";

async function fetchCaseStudiesFromStrapi(): Promise<CaseStudyContentDocument[]> {
  if (!process.env.STRAPI_URL) return []; // Strapi not configured (CI)
  const url = `${process.env.STRAPI_URL}/api/case-studies?${POPULATE}&${PAGE_SIZE}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
    next: { revalidate: 3600, tags: ["case-studies"] },
  });

  if (!res.ok) {
    throw new Error(`Strapi case-studies fetch failed: ${res.status}`);
  }

  const { data } = (await res.json()) as { data: unknown[] };

  dataLogger.loadStart("case-studies", url);

  const documents = data.map((dto, i) => {
    const transformed = transformStrapiContentDTO(dto);
    const result = CaseStudyContentDocumentSchema.safeParse(transformed);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError("case-study", String(i), issues.split(" | "));
      throw new Error(`Invalid case study content at index ${i}: ${issues}`);
    }
    return result.data as CaseStudyContentDocument;
  });

  dataLogger.loadComplete("case-studies", documents.length, url);
  dataLogger.validationSuccess("case-studies", documents.length);

  return documents;
}

// ============================================================================
// Registry builder (keyed by slug for O(1) lookups)
// ============================================================================

async function buildCaseStudyRegistry(): Promise<Record<string, CaseStudyContentDocument>> {
  const documents = await fetchCaseStudiesFromStrapi();
  return Object.fromEntries(documents.map((doc) => [doc.meta.slug, doc]));
}

// ============================================================================
// Public API (async — repositories and pages must await these)
// ============================================================================

/**
 * Get all case studies as a sorted list
 */
export async function getCaseStudyList(): Promise<CaseStudy[]> {
  const registry = await buildCaseStudyRegistry();
  return Object.entries(registry)
    .map(([, document], index) => ({
      id: String(index + 1),
      slug: document.meta.slug,
      title: document.meta.title,
      excerpt: document.meta.excerpt,
      level: document.meta.level as CaseStudyLevel,
      category: document.meta.category as CaseStudyCategory,
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
 * Get case study content document by slug
 */
export async function getCaseStudyContentDocument(
  slug: string,
): Promise<CaseStudyContentDocument | null> {
  const registry = await buildCaseStudyRegistry();
  return registry[slug] ?? null;
}

/**
 * Get all case study slugs for static params generation
 */
export async function getAllCaseStudyContentSlugs(): Promise<string[]> {
  const registry = await buildCaseStudyRegistry();
  return Object.keys(registry);
}
