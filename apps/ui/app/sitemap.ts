import type { MetadataRoute } from "next";
import {
  getContentListPath,
  toAbsoluteUrl,
} from "@/lib/content-library/url-policy";
import { getContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";
import { getDocumentationRouteManifest } from "@/lib/strapi/dashboard/documentation/documentation-route-manifest";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const contentManifest = await getContentRouteManifest();
  // Documentation manifest may fail if Strapi schema is incomplete (e.g. missing audience/lastUpdated fields)
  const docManifest = await getDocumentationRouteManifest().catch(() => ({
    strategicOverview: [],
    cmsReference: [],
    appReference: [],
    infrastructureOps: [],
    all: [],
  }));
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: toAbsoluteUrl("/"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: toAbsoluteUrl("/contact"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl("/services"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl("/quotation"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: toAbsoluteUrl("/dashboard/content-library"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl(getContentListPath("articles")),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl(getContentListPath("tutorials")),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl(getContentListPath("guides")),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl(getContentListPath("case-studies")),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: toAbsoluteUrl("/dashboard/documentation"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    },
  ];

  // Content Library dynamic routes (from content-route-manifest)
  const contentRoutes: MetadataRoute.Sitemap = contentManifest.all.map(
    (entry) => ({
      url: toAbsoluteUrl(entry.path),
      lastModified: new Date(entry.publishedAt),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  // Documentation dynamic routes (from documentation-route-manifest)
  const documentationRoutes: MetadataRoute.Sitemap = docManifest.all.map(
    (entry) => ({
      url: toAbsoluteUrl(entry.path),
      lastModified: new Date(entry.lastUpdated),
      changeFrequency: "monthly",
      priority: 0.7,
    }),
  );

  return [...staticRoutes, ...contentRoutes, ...documentationRoutes];
}
