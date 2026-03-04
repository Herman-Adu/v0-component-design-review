/**
 * Strapi DTO Transformer
 *
 * Converts Strapi 5 REST API response DTOs to the shape expected by
 * the project's Zod schemas. Strapi 5 returns flat objects (no `attributes`
 * wrapper). This transformer is the only place that knows about Strapi's
 * wire format — schemas and view models stay clean.
 *
 * Authority: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

// ============================================================================
// Raw Strapi DTO types (as returned from the API)
// ============================================================================

interface StrapiMetaDTO {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  level?: string;
  readTime?: string;
  audience?: string;
  lastUpdated?: string;
  publishedAt: string;
  tags: string | string[]; // Strapi stores as comma-separated string; schema expects string[]
}

interface StrapiTocItemDTO {
  id: number;
  level: number;
  title: string;
  anchor: string;
}

interface StrapiBlockDTO {
  __component: string;
  id: number;
  blockType: string;
  atomicLevel: string;
  props: Record<string, unknown>;
}

interface StrapiContentDTO {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  meta: StrapiMetaDTO;
  toc: StrapiTocItemDTO[];
  blocks: StrapiBlockDTO[];
  seo?: unknown;
  [key: string]: unknown;
}

// ============================================================================
// Transformed shape (matches Zod schema expectations)
// ============================================================================

export interface TransformedContentDocument {
  meta: Omit<StrapiMetaDTO, "id">;
  layout: "content-with-toc" | "content-only";
  toc: Array<{ id: string; title: string; level: number }>;
  blocks: Array<{ type: string; atomicLevel: string; props: Record<string, unknown> }>;
}

// ============================================================================
// Transformer
// ============================================================================

/**
 * Transforms a single Strapi 5 content DTO into the shape validated by
 * GuideContentDocumentSchema (and all equivalent schemas).
 *
 * Key mappings:
 *  - block.blockType  → block.type
 *  - toc[i].anchor   → toc[i].id  (slug-safe string, matches TocItemSchema regex)
 *  - layout          → derived from toc presence
 *  - Strapi internal fields (id, documentId, etc.) → stripped
 */
export function transformStrapiContentDTO(dto: unknown): TransformedContentDocument {
  const d = dto as StrapiContentDTO;

  const { id: _metaId, tags: rawTags, audience: rawAudience, lastUpdated: rawLastUpdated, ...metaRest } = d.meta;

  // Strapi stores tags as a comma-separated string; schema expects string[]
  const tags: string[] =
    typeof rawTags === "string"
      ? rawTags.split(",").map((t) => t.trim()).filter(Boolean)
      : (rawTags as string[]) ?? [];

  // Strapi returns null for optional fields not set on content-library types;
  // Zod .optional() accepts undefined but not null — normalize here.
  const audience = rawAudience ?? undefined;
  const lastUpdated = rawLastUpdated ?? undefined;

  return {
    meta: { ...metaRest, tags, audience, lastUpdated },
    layout: d.toc && d.toc.length > 0 ? "content-with-toc" : "content-only",
    toc: (d.toc ?? []).map(({ anchor, title, level }) => ({
      id: anchor,
      title,
      level,
    })),
    blocks: (d.blocks ?? []).map(({ blockType, atomicLevel, props }) => ({
      type: blockType,
      atomicLevel,
      props,
    })),
  };
}
