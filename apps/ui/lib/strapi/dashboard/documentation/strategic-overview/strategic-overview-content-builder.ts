import "server-only";
import {
  StrategicOverviewDocumentSchema,
  type StrategicOverviewDocument,
} from "./strategic-overview-schema";
import { transformStrapiContentDTO } from "@/lib/strapi/dashboard/_shared/strapi-dto-transformer";
import { loadJsonMockFiles, mockDataPath } from "@/lib/strapi/dashboard/_shared/json-mock-loader";
import { dataLogger } from "@/lib/utils/arch-logger";

// ============================================================================
// Strapi fetch
// ============================================================================

const POPULATE =
  "populate[blocks][populate]=*&populate[meta]=*&populate[toc]=*";
const PAGE_SIZE = "pagination[pageSize]=100";

function loadStrategicOverviewsFromJson(): StrategicOverviewDocument[] {
  const raws = loadJsonMockFiles(mockDataPath("dashboard", "documentation", "strategic-overview"));
  return raws.flatMap((raw) => {
    const result = StrategicOverviewDocumentSchema.safeParse(raw);
    return result.success ? [result.data] : [];
  });
}

async function fetchStrategicOverviewsFromStrapi(): Promise<
  StrategicOverviewDocument[]
> {
  if (!process.env.STRAPI_URL) return loadStrategicOverviewsFromJson();
  const url = `${process.env.STRAPI_URL}/api/strategic-overviews?${POPULATE}&${PAGE_SIZE}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
    next: { revalidate: 3600, tags: ["strategic-overview"] },
  });

  if (!res.ok) {
    throw new Error(`Strapi strategic-overviews fetch failed: ${res.status}`);
  }

  const { data } = (await res.json()) as { data: unknown[] };

  dataLogger.loadStart("strategic-overview", url);

  const documents = data.map((dto, i) => {
    const transformed = transformStrapiContentDTO(dto);
    const result = StrategicOverviewDocumentSchema.safeParse(transformed);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError(
        "strategic-overview",
        String(i),
        issues.split(" | "),
      );
      throw new Error(
        `Invalid strategic-overview content at index ${i}: ${issues}`,
      );
    }
    return result.data as StrategicOverviewDocument;
  });

  dataLogger.loadComplete("strategic-overview", documents.length, url);
  dataLogger.validationSuccess("strategic-overview", documents.length);

  return documents;
}

// ============================================================================
// Public API (async — repositories and pages must await these)
// ============================================================================

export async function getStrategicOverviewList(): Promise<
  StrategicOverviewDocument[]
> {
  return fetchStrategicOverviewsFromStrapi();
}

export async function getStrategicOverviewDocument(
  slug: string,
): Promise<StrategicOverviewDocument | null> {
  const documents = await fetchStrategicOverviewsFromStrapi();
  return documents.find((d) => d.meta.slug === slug) ?? null;
}

export async function getAllStrategicOverviewSlugs(): Promise<string[]> {
  const documents = await fetchStrategicOverviewsFromStrapi();
  return documents.map((d) => d.meta.slug);
}

export async function getStrategicOverviewByAudience(
  audience: string,
): Promise<StrategicOverviewDocument[]> {
  const documents = await fetchStrategicOverviewsFromStrapi();
  return documents.filter((d) => d.meta.audience === audience);
}
