export const CONTENT_LIBRARY_BASE_PATH = "/dashboard/content-library";

export type ContentSection =
  | "articles"
  | "tutorials"
  | "guides"
  | "case-studies";

export function getContentListPath(section: ContentSection): string {
  return `${CONTENT_LIBRARY_BASE_PATH}/${section}`;
}

export function getContentDetailPath(
  section: ContentSection,
  category: string,
  slug: string,
): string {
  return `${getContentListPath(section)}/${category}/${slug}`;
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
