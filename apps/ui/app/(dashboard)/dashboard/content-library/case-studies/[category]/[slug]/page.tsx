import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import {
  getCaseStudyRecordBySlug,
  listCaseStudies,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-repository";
import { getContentDetailPath } from "@/lib/content-library/url-policy";
import { toCaseStudyDetailViewModel } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-view-models";
import { ContentBlockRenderer } from "@/components/organisms/content-block-renderer";
import type { CaseStudy } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content-builder";

export async function generateStaticParams() {
  try {
    const list = await listCaseStudies();
    return list.map((cs) => ({ slug: cs.slug, category: cs.category }));
  } catch {
    return []; // Strapi unavailable in CI
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const record = await getCaseStudyRecordBySlug(slug);

  if (!record) {
    return {
      title: "Case Study Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = getContentDetailPath(
    "case-studies",
    record.caseStudy.category,
    record.caseStudy.slug,
  );

  return {
    title: record.caseStudy.title,
    description: record.caseStudy.excerpt,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title: record.caseStudy.title,
      description: record.caseStudy.excerpt,
      url: canonicalPath,
      publishedTime: record.caseStudy.publishedAt,
      tags: record.caseStudy.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: record.caseStudy.title,
      description: record.caseStudy.excerpt,
    },
  };
}

function getCategoryColor(category: CaseStudy["category"]) {
  switch (category) {
    case "refactoring":
      return "bg-blue-500/10 text-blue-500";
    case "performance":
      return "bg-green-500/10 text-green-500";
    case "security":
      return "bg-red-500/10 text-red-500";
    case "architecture":
      return "bg-purple-500/10 text-purple-500";
    case "business":
      return "bg-emerald-500/10 text-emerald-500";
    case "cms":
      return "bg-orange-500/10 text-orange-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function getCategoryLabel(category: CaseStudy["category"]) {
  switch (category) {
    case "cms":
      return "CMS";
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug, category } = await params;
  const record = await getCaseStudyRecordBySlug(slug);

  if (!record) {
    notFound();
  }

  if (record.caseStudy.category !== category) {
    redirect(
      getContentDetailPath(
        "case-studies",
        record.caseStudy.category,
        record.caseStudy.slug,
      ),
    );
  }

  const { caseStudy, content } = record;
  const viewModel = toCaseStudyDetailViewModel(caseStudy);

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/content-library/case-studies"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Case Studies
      </Link>

      {/* Header */}
      <header className="space-y-4">
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(caseStudy.category)}`}
        >
          {getCategoryLabel(caseStudy.category)}
        </span>

        <h1 className="text-4xl font-bold text-foreground text-balance">
          {viewModel.title}
        </h1>
        <p className="text-xl text-muted-foreground">{caseStudy.excerpt}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(viewModel.publishedAt).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Tags */}
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
      </header>

      {/* Content Blocks */}
      <ContentBlockRenderer blocks={content.blocks} />

      {/* Footer Navigation */}
      <footer className="border-t border-border pt-8">
        <Link
          href="/dashboard/content-library/case-studies"
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          View all case studies
        </Link>
      </footer>
    </div>
  );
}
