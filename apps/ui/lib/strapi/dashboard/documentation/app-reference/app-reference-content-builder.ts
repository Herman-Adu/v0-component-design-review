import "server-only";
import {
  AppReferenceDocumentSchema,
  type AppReferenceDocument,
} from "./app-reference-schema";
import { transformStrapiContentDTO } from "@/lib/strapi/dashboard/_shared/strapi-dto-transformer";
import { dataLogger } from "@/lib/utils/arch-logger";

// ============================================================================
// Strapi fetch
// ============================================================================

const POPULATE =
  "populate[blocks][populate]=*&populate[meta]=*&populate[toc]=*";
const PAGE_SIZE = "pagination[pageSize]=100";

async function fetchAppReferencesFromStrapi(): Promise<AppReferenceDocument[]> {
  if (!process.env.STRAPI_URL) return []; // Strapi not configured (CI)
  const url = `${process.env.STRAPI_URL}/api/app-references?${POPULATE}&${PAGE_SIZE}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
    next: { revalidate: 3600, tags: ["app-reference"] },
  });

  if (!res.ok) {
    throw new Error(`Strapi app-references fetch failed: ${res.status}`);
  }

  const { data } = (await res.json()) as { data: unknown[] };

  dataLogger.loadStart("app-reference", url);

  const documents = data.map((dto, i) => {
    const transformed = transformStrapiContentDTO(dto);
    const result = AppReferenceDocumentSchema.safeParse(transformed);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError(
        "app-reference",
        String(i),
        issues.split(" | "),
      );
      throw new Error(
        `Invalid app-reference content at index ${i}: ${issues}`,
      );
    }
    return result.data as AppReferenceDocument;
  });

  dataLogger.loadComplete("app-reference", documents.length, url);
  dataLogger.validationSuccess("app-reference", documents.length);

  return documents;
}

// ============================================================================
// Public API (async — repositories and pages must await these)
// ============================================================================

export async function getAppReferenceList(): Promise<AppReferenceDocument[]> {
  return fetchAppReferencesFromStrapi();
}

export async function getAppReferenceDocument(
  slug: string,
): Promise<AppReferenceDocument | null> {
  const documents = await fetchAppReferencesFromStrapi();
  return documents.find((d) => d.meta.slug === slug) ?? null;
}

export async function getAllAppReferenceSlugs(): Promise<string[]> {
  const documents = await fetchAppReferencesFromStrapi();
  return documents.map((d) => d.meta.slug);
}

export async function getAppReferenceByAudience(
  audience: string,
): Promise<AppReferenceDocument[]> {
  const documents = await fetchAppReferencesFromStrapi();
  return documents.filter((d) => d.meta.audience === audience);
}
