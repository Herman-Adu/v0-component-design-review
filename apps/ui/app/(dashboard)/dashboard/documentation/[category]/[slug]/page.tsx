import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Users } from "lucide-react";
import { listStrategicOverview } from "@/lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-repository";
import { listCmsReference } from "@/lib/strapi/dashboard/documentation/cms-reference/cms-reference-repository";
import { listAppReference } from "@/lib/strapi/dashboard/documentation/app-reference/app-reference-repository";
import { listInfrastructureOps } from "@/lib/strapi/dashboard/documentation/infrastructure-ops/infrastructure-ops-repository";
import { TableOfContents } from "@/components/molecules/article-components";
import { ContentBlockRenderer } from "@/components/organisms/content-block-renderer";
import {
  getDocumentationViewModel,
  getCategoryColor,
  getAudienceColor,
  getCategoryLabel,
} from "@/lib/strapi/dashboard/documentation/documentation-helpers";
import {
  getDocumentationDetailPath,
  type DocumentationCategory,
} from "@/lib/content-library/url-policy";

export async function generateStaticParams() {
  try {
    const [strategicOverviewDocs, cmsReferenceDocs, appReferenceDocs, infrastructureOpsDocs] =
      await Promise.all([
        listStrategicOverview(),
        listCmsReference(),
        listAppReference(),
        listInfrastructureOps(),
      ]);

    return [
      ...strategicOverviewDocs.map((doc) => ({
        category: "strategic-overview",
        slug: doc.meta.slug,
      })),
      ...cmsReferenceDocs.map((doc) => ({
        category: "cms-reference",
        slug: doc.meta.slug,
      })),
      ...appReferenceDocs.map((doc) => ({
        category: "app-reference",
        slug: doc.meta.slug,
      })),
      ...infrastructureOpsDocs.map((doc) => ({
        category: "infrastructure-ops",
        slug: doc.meta.slug,
      })),
    ];
  } catch {
    return []; // Strapi unavailable in CI
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;

  const viewModel = await getDocumentationViewModel(category, slug).catch(
    () => null,
  );

  if (!viewModel) {
    return {
      title: "Documentation Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl =
    viewModel.seo.canonicalUrl ??
    getDocumentationDetailPath(category as DocumentationCategory, slug);

  return {
    title: viewModel.seo.metaTitle,
    description: viewModel.seo.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title: viewModel.seo.metaTitle,
      description: viewModel.seo.metaDescription,
      url: canonicalUrl,
      publishedTime: viewModel.publishedAt,
      tags: viewModel.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: viewModel.seo.metaTitle,
      description: viewModel.seo.metaDescription,
    },
  };
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  const viewModel = await getDocumentationViewModel(category, slug).catch(
    () => null,
  );

  if (!viewModel) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/documentation"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Documentation
      </Link>

      {/* Document Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${getCategoryColor(category)}`}
          >
            {getCategoryLabel(category)}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${getAudienceColor(viewModel.audience)}`}
          >
            <Users className="inline h-3 w-3 mr-1" />
            {viewModel.audience}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-foreground">
          {viewModel.title}
        </h1>
        <p className="text-xl text-muted-foreground">{viewModel.excerpt}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Published:{" "}
            {new Date(viewModel.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Updated:{" "}
            {new Date(viewModel.lastUpdated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Tags */}
        {viewModel.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {viewModel.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Document Content */}
      <article className="border-t border-border pt-8">
        {viewModel.toc && viewModel.toc.length > 0 ? (
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              <ContentBlockRenderer blocks={viewModel.blocks} />
            </div>
            <aside className="hidden lg:block w-64 shrink-0">
              <TableOfContents items={viewModel.toc} />
            </aside>
          </div>
        ) : (
          <div className="space-y-6">
            <ContentBlockRenderer blocks={viewModel.blocks} />
          </div>
        )}
      </article>

      {/* Footer Navigation */}
      <footer className="border-t border-border pt-8">
        <Link
          href="/dashboard/documentation"
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          View all documentation
        </Link>
      </footer>
    </div>
  );
}
