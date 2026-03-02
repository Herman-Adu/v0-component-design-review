/**
 * URL Policy - Single Source of Truth for Route Generation
 *
 * Authority for all URL structure across content-library and documentation systems.
 * Prevents hardcoding, ensures consistency, and enables SEO/sitemap generation.
 *
 * Used by:
 * - generateMetadata() in all page components
 * - Sitemap generation (app/sitemap.ts)
 * - Navigation links (data/nav-data.ts)
 * - Route manifests (content-route-manifest, documentation-route-manifest)
 */

export const CONTENT_LIBRARY_BASE_PATH = "/dashboard/content-library";
export const DOCUMENTATION_BASE_PATH = "/dashboard/documentation";

export type ContentSection =
  | "articles"
  | "tutorials"
  | "guides"
  | "case-studies";

export type DocumentationCategory =
  | "strategic-overview"
  | "cms-reference"
  | "app-reference"
  | "infrastructure-ops";

export type RouteSystem = "content-library" | "documentation";

/**
 * Get list path for content-library sections
 * @param section Content section type
 * @returns Path like /dashboard/content-library/articles
 */
export function getContentListPath(section: ContentSection): string {
  return `${CONTENT_LIBRARY_BASE_PATH}/${section}`;
}

/**
 * Get detail path for content-library articles, tutorials, guides, case-studies
 * @param section Content section (articles, tutorials, guides, case-studies)
 * @param category Content category (e.g., "architecture", "security")
 * @param slug Content slug (e.g., "type-safety-first")
 * @returns Path like /dashboard/content-library/articles/architecture/type-safety-first
 */
export function getContentDetailPath(
  section: ContentSection,
  category: string,
  slug: string,
): string {
  return `${getContentListPath(section)}/${category}/${slug}`;
}

/**
 * Get detail path for documentation pages
 * @param category Documentation category (strategic-overview, cms-reference, app-reference, infrastructure-ops)
 * @param slug Documentation slug (e.g., "system-vision")
 * @returns Path like /dashboard/documentation/strategic-overview/system-vision
 */
export function getDocumentationDetailPath(
  category: DocumentationCategory,
  slug: string,
): string {
  return `${DOCUMENTATION_BASE_PATH}/${category}/${slug}`;
}

/**
 * Polymorphic path getter - dispatch based on route system
 * @param system Route system (content-library or documentation)
 * @param categoryOrSection Category/section identifier
 * @param slug Content slug
 * @returns Appropriate detail path for the system
 */
export function getDetailPath(
  system: RouteSystem,
  categoryOrSection: string,
  slug: string,
): string {
  switch (system) {
    case "content-library":
      // For content-library, categoryOrSection is the section
      return getContentDetailPath(
        categoryOrSection as ContentSection,
        categoryOrSection,
        slug,
      );
    case "documentation":
      // For documentation, categoryOrSection is the category
      return getDocumentationDetailPath(
        categoryOrSection as DocumentationCategory,
        slug,
      );
    default:
      throw new Error(`Unknown route system: ${system}`);
  }
}

export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  const vercel = process.env.VERCEL_URL;
  if (vercel) {
    return `https://${vercel.replace(/\/$/, "")}`;
  }

  return "https://electrical-services.vercel.app";
}

export function toAbsoluteUrl(pathname: string): string {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${getSiteOrigin()}${normalizedPath}`;
}
