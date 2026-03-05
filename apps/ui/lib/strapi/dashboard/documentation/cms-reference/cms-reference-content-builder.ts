import "server-only";
import {
  CmsReferenceDocumentSchema,
  type CmsReferenceDocument,
} from "./cms-reference-schema";
import { transformStrapiContentDTO } from "@/lib/strapi/dashboard/_shared/strapi-dto-transformer";
import { loadJsonMockFiles, mockDataPath } from "@/lib/strapi/dashboard/_shared/json-mock-loader";
import { dataLogger } from "@/lib/utils/arch-logger";

// ============================================================================
// Strapi fetch
// ============================================================================

const POPULATE =
  "populate[blocks][populate]=*&populate[meta]=*&populate[toc]=*";
const PAGE_SIZE = "pagination[pageSize]=100";

function loadCmsReferencesFromJson(): CmsReferenceDocument[] {
  const raws = loadJsonMockFiles(mockDataPath("dashboard", "documentation", "cms-reference"));
  return raws.flatMap((raw) => {
    const result = CmsReferenceDocumentSchema.safeParse(raw);
    return result.success ? [result.data] : [];
  });
}

async function fetchCmsReferencesFromStrapi(): Promise<CmsReferenceDocument[]> {
  if (!process.env.STRAPI_URL) return loadCmsReferencesFromJson();
  const url = `${process.env.STRAPI_URL}/api/cms-references?${POPULATE}&${PAGE_SIZE}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
    next: { revalidate: 3600, tags: ["cms-reference"] },
  });

  if (!res.ok) {
    throw new Error(`Strapi cms-references fetch failed: ${res.status}`);
  }

  const { data } = (await res.json()) as { data: unknown[] };

  dataLogger.loadStart("cms-reference", url);

  const documents = data.map((dto, i) => {
    const transformed = transformStrapiContentDTO(dto);
    const result = CmsReferenceDocumentSchema.safeParse(transformed);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError(
        "cms-reference",
        String(i),
        issues.split(" | "),
      );
      throw new Error(
        `Invalid cms-reference content at index ${i}: ${issues}`,
      );
    }
    return result.data as CmsReferenceDocument;
  });

  dataLogger.loadComplete("cms-reference", documents.length, url);
  dataLogger.validationSuccess("cms-reference", documents.length);

  return documents;
}

// ============================================================================
// Public API (async — repositories and pages must await these)
// ============================================================================

export async function getCmsReferenceList(): Promise<CmsReferenceDocument[]> {
  return fetchCmsReferencesFromStrapi();
}

export async function getCmsReferenceDocument(
  slug: string,
): Promise<CmsReferenceDocument | null> {
  const documents = await fetchCmsReferencesFromStrapi();
  return documents.find((d) => d.meta.slug === slug) ?? null;
}

export async function getAllCmsReferenceSlugs(): Promise<string[]> {
  const documents = await fetchCmsReferencesFromStrapi();
  return documents.map((d) => d.meta.slug);
}

export async function getCmsReferenceByAudience(
  audience: string,
): Promise<CmsReferenceDocument[]> {
  const documents = await fetchCmsReferencesFromStrapi();
  return documents.filter((d) => d.meta.audience === audience);
}
