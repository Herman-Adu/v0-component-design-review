import { guideSchema } from "@/lib/strapi/dashboard/content-library/guides/guide-schema";
import { dataLogger } from "@/lib/utils/arch-logger";

// Import all guide JSON files
import securityArchitectureData from "@/data/strapi-mock/dashboard/content-library/guides/security-architecture.json";
import deploymentGuideData from "@/data/strapi-mock/dashboard/content-library/guides/deployment-guide.json";
import testingStrategyData from "@/data/strapi-mock/dashboard/content-library/guides/testing-strategy.json";

export type GuideLevel = "intermediate" | "advanced";
export type GuideCategory = "security" | "devops" | "testing";

export interface GuideContentBlock {
  type: string;
  atomicLevel: "atom" | "molecule" | "organism";
  props: Record<string, unknown>;
}

export interface GuideContentMeta {
  slug: string;
  title: string;
  excerpt: string;
  level: GuideLevel;
  category: GuideCategory;
  readTime: string;
  publishedAt: string;
  tags: string[];
}

export interface GuideContentDocument {
  meta: GuideContentMeta;
  layout: "content-with-toc" | "content-only";
  toc?: Array<{ id: string; title: string; level: number }>;
  blocks: GuideContentBlock[];
}

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

// Guide content registry - maps slugs to JSON documents
const guideContentRegistry: Record<string, GuideContentDocument> = {
  "security-architecture": securityArchitectureData as GuideContentDocument,
  "deployment-guide": deploymentGuideData as GuideContentDocument,
  "testing-strategy": testingStrategyData as GuideContentDocument,
};

// Validate all guides on import
dataLogger.loadStart("guides", "data/strapi-mock/.../guides/*.json");
const validatedGuideContentRegistry = Object.fromEntries(
  Object.entries(guideContentRegistry).map(([slug, document]) => {
    const result = guideSchema.safeParse(document);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError("guide", slug, issues.split(" | "));
      throw new Error(`Invalid guide content for "${slug}": ${issues}`);
    }
    return [slug, result.data as GuideContentDocument];
  }),
) as Record<string, GuideContentDocument>;
dataLogger.loadComplete(
  "guides",
  Object.keys(validatedGuideContentRegistry).length,
  "data/strapi-mock/.../guides/*.json",
);
dataLogger.validationSuccess(
  "guides",
  Object.keys(validatedGuideContentRegistry).length,
);

/**
 * Generates the guide list from content metadata
 */
function generateGuideList(): Guide[] {
  return Object.entries(validatedGuideContentRegistry)
    .map(([slug, document], index) => ({
      id: String(index + 1),
      slug: document.meta.slug,
      title: document.meta.title,
      excerpt: document.meta.excerpt,
      level: document.meta.level,
      category: document.meta.category,
      readTime: document.meta.readTime,
      publishedAt: document.meta.publishedAt,
      tags: document.meta.tags,
      blocks: document.blocks,
    }))
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

// Cache the guide list
let guideListCache: Guide[] | null = null;

/**
 * Get all guides
 * Returns array of all guide items
 */
export function getGuideList(): Guide[] {
  if (guideListCache === null) {
    guideListCache = generateGuideList();
  }
  return guideListCache;
}

/**
 * Get guide content document by slug
 * Returns complete guide document with all blocks, TOC, etc.
 */
export function getGuideContentDocument(
  slug: string,
): GuideContentDocument | null {
  return validatedGuideContentRegistry[slug] || null;
}

/**
 * Get all guide slugs
 * Returns array of all guide slugs
 */
export function getAllGuideContentSlugs(): string[] {
  return Object.keys(validatedGuideContentRegistry);
}
