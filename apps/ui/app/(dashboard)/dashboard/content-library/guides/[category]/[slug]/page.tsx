import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import {
  getGuideRecordBySlug,
  listGuides,
} from "@/lib/strapi/dashboard/content-library/guides/guide-repository";
import { getContentDetailPath } from "@/lib/content-library/url-policy";
import { toGuideDetailViewModel } from "@/lib/strapi/dashboard/content-library/guides/guide-view-models";
import type { Guide } from "@/lib/strapi/dashboard/content-library/guides/guide-content";
import { TableOfContents } from "@/components/molecules/article-components";
import { ContentBlockRenderer } from "@/components/organisms/content-block-renderer";

export async function generateStaticParams() {
  const guides = listGuides();
  return guides.map((guide) => {
    return {
      category: guide.category,
      slug: guide.slug,
    };
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = getGuideRecordBySlug(slug);

  if (!record) {
    return {
      title: "Guide Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = getContentDetailPath(
    "guides",
    record.guide.category,
    record.guide.slug,
  );

  return {
    title: record.guide.title,
    description: record.guide.excerpt,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title: record.guide.title,
      description: record.guide.excerpt,
      url: canonicalPath,
      publishedTime: record.guide.publishedAt,
      tags: record.guide.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: record.guide.title,
      description: record.guide.excerpt,
    },
  };
}

function getLevelColor(level: Guide["level"]) {
  switch (level) {
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

function getCategoryColor(category: Guide["category"]) {
  switch (category) {
    case "security":
      return "bg-red-500/10 text-red-500";
    case "devops":
      return "bg-blue-500/10 text-blue-500";
    case "testing":
      return "bg-orange-500/10 text-orange-500";
  }
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug, category } = await params;
  const guideRecord = getGuideRecordBySlug(slug);

  if (!guideRecord) {
    notFound();
  }

  if (guideRecord.guide.category !== category) {
    redirect(
      getContentDetailPath(
        "guides",
        guideRecord.guide.category,
        guideRecord.guide.slug,
      ),
    );
  }

  const guideViewModel = toGuideDetailViewModel(guideRecord.guide);
  const contentDocument = guideRecord.content;

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/content-library/guides"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Guides
      </Link>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelColor(guideViewModel.level)}`}
          >
            {guideViewModel.level.charAt(0).toUpperCase() +
              guideViewModel.level.slice(1)}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(guideViewModel.category)}`}
          >
            {guideViewModel.category.charAt(0).toUpperCase() +
              guideViewModel.category.slice(1)}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-foreground text-balance">
          {guideViewModel.title}
        </h1>
        <p className="text-xl text-muted-foreground text-pretty">
          {guideViewModel.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {guideViewModel.readTime}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(guideViewModel.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {guideViewModel.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-muted rounded-md text-muted-foreground"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Guide Content - Block-based Rendering */}
      <div className="border-t border-border pt-8">
        {contentDocument.layout === "content-with-toc" ? (
          <div className="flex gap-8">
            <div className="flex-1 min-w-0">
              <ContentBlockRenderer blocks={contentDocument.blocks} />
            </div>
            <aside className="hidden lg:block w-64 shrink-0">
              <TableOfContents items={contentDocument.toc ?? []} />
            </aside>
          </div>
        ) : (
          <div className="space-y-6">
            <ContentBlockRenderer blocks={contentDocument.blocks} />
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <footer className="border-t border-border pt-8">
        <Link
          href="/dashboard/content-library/guides"
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          View all guides
        </Link>
      </footer>
    </div>
  );
}
