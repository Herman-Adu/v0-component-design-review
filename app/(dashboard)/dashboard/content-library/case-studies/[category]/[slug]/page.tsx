import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import {
  getCaseStudyRecordBySlug,
  listCaseStudySlugs,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-repository";
import { toCaseStudyDetailViewModel } from "@/lib/strapi/dashboard/content-library/case-studies/case-study-view-models";
import { ContentBlockRenderer } from "@/components/organisms/content-block-renderer";
import type { CaseStudy } from "@/data/content-library/case-studies";

export async function generateStaticParams() {
  const slugs = listCaseStudySlugs();
  const caseStudies = slugs
    .map((slug) => {
      const record = getCaseStudyRecordBySlug(slug);
      return record
        ? { slug: record.caseStudy.slug, category: record.caseStudy.category }
        : null;
    })
    .filter(Boolean);
  return caseStudies;
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
  const { slug } = await params;
  const record = getCaseStudyRecordBySlug(slug);

  if (!record) {
    notFound();
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
        <p className="text-xl text-muted-foreground">{caseStudy.subtitle}</p>

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
