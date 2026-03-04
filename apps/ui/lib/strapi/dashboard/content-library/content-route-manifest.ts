import { listArticles } from "@/lib/strapi/dashboard/content-library/articles/article-repository";
import { listTutorials } from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-repository";
import { listGuides } from "@/lib/strapi/dashboard/content-library/guides/guide-repository";
import { listCaseStudies } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-repository";
import {
  getContentDetailPath,
  type ContentSection,
} from "@/lib/content-library/url-policy";

export interface ContentRouteEntry {
  section: ContentSection;
  category: string;
  slug: string;
  path: string;
  publishedAt: string;
}

export interface ContentRouteManifest {
  articles: ContentRouteEntry[];
  tutorials: ContentRouteEntry[];
  guides: ContentRouteEntry[];
  caseStudies: ContentRouteEntry[];
  all: ContentRouteEntry[];
}

function mapEntries(
  section: ContentSection,
  records: Array<{ category: string; slug: string; publishedAt: string }>,
): ContentRouteEntry[] {
  return records.map((record) => ({
    section,
    category: record.category,
    slug: record.slug,
    publishedAt: record.publishedAt,
    path: getContentDetailPath(section, record.category, record.slug),
  }));
}

export async function getContentRouteManifest(): Promise<ContentRouteManifest> {
  const articles = mapEntries("articles", listArticles());
  const tutorials = mapEntries("tutorials", listTutorials());
  const guides = mapEntries("guides", await listGuides());
  const caseStudies = mapEntries("case-studies", listCaseStudies());

  const all = [...articles, ...tutorials, ...guides, ...caseStudies].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  return {
    articles,
    tutorials,
    guides,
    caseStudies,
    all,
  };
}
