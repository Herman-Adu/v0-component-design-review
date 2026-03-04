import "server-only";
import {
  InfrastructureOpsDocumentSchema,
  type InfrastructureOpsDocument,
} from "./infrastructure-ops-schema";
import { transformStrapiContentDTO } from "@/lib/strapi/dashboard/_shared/strapi-dto-transformer";
import { dataLogger } from "@/lib/utils/arch-logger";

// ============================================================================
// Strapi fetch
// ============================================================================

const POPULATE =
  "populate[blocks][populate]=*&populate[meta]=*&populate[toc]=*";
const PAGE_SIZE = "pagination[pageSize]=100";

async function fetchInfrastructureOpsFromStrapi(): Promise<
  InfrastructureOpsDocument[]
> {
  const url = `${process.env.STRAPI_URL}/api/infrastructure-ops-docs?${POPULATE}&${PAGE_SIZE}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}` },
    next: { revalidate: 3600, tags: ["infrastructure-ops"] },
  });

  if (!res.ok) {
    throw new Error(
      `Strapi infrastructure-ops-docs fetch failed: ${res.status}`,
    );
  }

  const { data } = (await res.json()) as { data: unknown[] };

  dataLogger.loadStart("infrastructure-ops", url);

  const documents = data.map((dto, i) => {
    const transformed = transformStrapiContentDTO(dto);
    const result = InfrastructureOpsDocumentSchema.safeParse(transformed);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join(" | ");
      dataLogger.validationError(
        "infrastructure-ops",
        String(i),
        issues.split(" | "),
      );
      throw new Error(
        `Invalid infrastructure-ops content at index ${i}: ${issues}`,
      );
    }
    return result.data as InfrastructureOpsDocument;
  });

  dataLogger.loadComplete("infrastructure-ops", documents.length, url);
  dataLogger.validationSuccess("infrastructure-ops", documents.length);

  return documents;
}

// ============================================================================
// Public API (async — repositories and pages must await these)
// ============================================================================

export async function getInfrastructureOpsList(): Promise<
  InfrastructureOpsDocument[]
> {
  return fetchInfrastructureOpsFromStrapi();
}

export async function getInfrastructureOpsDocument(
  slug: string,
): Promise<InfrastructureOpsDocument | null> {
  const documents = await fetchInfrastructureOpsFromStrapi();
  return documents.find((d) => d.meta.slug === slug) ?? null;
}

export async function getAllInfrastructureOpsSlugs(): Promise<string[]> {
  const documents = await fetchInfrastructureOpsFromStrapi();
  return documents.map((d) => d.meta.slug);
}

export async function getInfrastructureOpsByAudience(
  audience: string,
): Promise<InfrastructureOpsDocument[]> {
  const documents = await fetchInfrastructureOpsFromStrapi();
  return documents.filter((d) => d.meta.audience === audience);
}
