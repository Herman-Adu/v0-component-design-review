import { listCmsReference } from "@/lib/strapi/dashboard/documentation/cms-reference/cms-reference-repository";
import { listAppReference } from "@/lib/strapi/dashboard/documentation/app-reference/app-reference-repository";
import { listInfrastructureOps } from "@/lib/strapi/dashboard/documentation/infrastructure-ops/infrastructure-ops-repository";
import { listStrategicOverview } from "@/lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-repository";
import { getDocumentationDetailPath } from "@/lib/content-library/url-policy";
import type { StrategicOverviewDocument } from "@/lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-schema";
import type { CmsReferenceDocument } from "@/lib/strapi/dashboard/documentation/cms-reference/cms-reference-schema";
import type { AppReferenceDocument } from "@/lib/strapi/dashboard/documentation/app-reference/app-reference-schema";
import type { InfrastructureOpsDocument } from "@/lib/strapi/dashboard/documentation/infrastructure-ops/infrastructure-ops-schema";

export interface DocumentationRouteEntry {
  category:
    | "strategic-overview"
    | "cms-reference"
    | "app-reference"
    | "infrastructure-ops";
  slug: string;
  path: string;
  audience: string;
  lastUpdated: string;
}

export interface DocumentationRouteManifest {
  strategicOverview: DocumentationRouteEntry[];
  cmsReference: DocumentationRouteEntry[];
  appReference: DocumentationRouteEntry[];
  infrastructureOps: DocumentationRouteEntry[];
  all: DocumentationRouteEntry[];
}

function mapStrategicOverview(
  records: StrategicOverviewDocument[],
): DocumentationRouteEntry[] {
  return records.map((record) => ({
    category: "strategic-overview" as const,
    slug: record.meta.slug,
    audience: record.meta.audience,
    lastUpdated: record.meta.lastUpdated,
    path: getDocumentationDetailPath("strategic-overview", record.meta.slug),
  }));
}

function mapCmsReference(
  records: CmsReferenceDocument[],
): DocumentationRouteEntry[] {
  return records.map((record) => ({
    category: "cms-reference" as const,
    slug: record.meta.slug,
    audience: record.meta.audience,
    lastUpdated: record.meta.lastUpdated,
    path: getDocumentationDetailPath("cms-reference", record.meta.slug),
  }));
}

function mapAppReference(
  records: AppReferenceDocument[],
): DocumentationRouteEntry[] {
  return records.map((record) => ({
    category: "app-reference" as const,
    slug: record.meta.slug,
    audience: record.meta.audience,
    lastUpdated: record.meta.lastUpdated,
    path: getDocumentationDetailPath("app-reference", record.meta.slug),
  }));
}

function mapInfrastructureOps(
  records: InfrastructureOpsDocument[],
): DocumentationRouteEntry[] {
  return records.map((record) => ({
    category: "infrastructure-ops" as const,
    slug: record.meta.slug,
    audience: record.meta.audience,
    lastUpdated: record.meta.lastUpdated,
    path: getDocumentationDetailPath("infrastructure-ops", record.meta.slug),
  }));
}

/**
 * Get documentation route manifest for static generation
 * Includes all 4 categories: Strategic Overview, CMS Reference, App Reference, Infrastructure Ops
 */
export async function getDocumentationRouteManifest(): Promise<DocumentationRouteManifest> {
  const [soData, cmsData, appData, opsData] = await Promise.all([
    listStrategicOverview(),
    listCmsReference(),
    listAppReference(),
    listInfrastructureOps(),
  ]);

  const strategicOverview = mapStrategicOverview(soData);
  const cmsReference = mapCmsReference(cmsData);
  const appReference = mapAppReference(appData);
  const infrastructureOps = mapInfrastructureOps(opsData);

  const all = [
    ...strategicOverview,
    ...cmsReference,
    ...appReference,
    ...infrastructureOps,
  ].sort(
    (a, b) =>
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime(),
  );

  return {
    strategicOverview,
    cmsReference,
    appReference,
    infrastructureOps,
    all,
  };
}

/**
 * Get all documentation slugs grouped by category for generateStaticParams
 */
export async function getAllDocumentationParams(): Promise<
  Array<{ category: string; slug: string }>
> {
  const manifest = await getDocumentationRouteManifest();
  return manifest.all.map((entry) => ({
    category: entry.category,
    slug: entry.slug,
  }));
}
