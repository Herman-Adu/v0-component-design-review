import type { MetadataRoute } from "next";
import {
  getContentListPath,
  toAbsoluteUrl,
} from "@/lib/content-library/url-policy";
import { getContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest";

export default function sitemap(): MetadataRoute.Sitemap {
  const manifest = getContentRouteManifest();
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
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = manifest.all.map((entry) => ({
    url: toAbsoluteUrl(entry.path),
    lastModified: new Date(entry.publishedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
