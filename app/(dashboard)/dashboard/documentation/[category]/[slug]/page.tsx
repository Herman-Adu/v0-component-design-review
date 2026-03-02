import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Tag, Users } from "lucide-react";
import {
  listStrategicOverview,
  getStrategicOverviewRecordBySlug,
} from "@/lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-repository";
import { toStrategicOverviewDetailViewModel } from "@/lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-view-models";
import {
  listCmsReference,
  getCmsReferenceRecordBySlug,
} from "@/lib/strapi/dashboard/documentation/cms-reference/cms-reference-repository";
import { toCmsReferenceDetailViewModel } from "@/lib/strapi/dashboard/documentation/cms-reference/cms-reference-view-models";
import {
  listAppReference,
  getAppReferenceRecordBySlug,
} from "@/lib/strapi/dashboard/documentation/app-reference/app-reference-repository";
import { toAppReferenceDetailViewModel } from "@/lib/strapi/dashboard/documentation/app-reference/app-reference-view-models";
import {
  listInfrastructureOps,
  getInfrastructureOpsRecordBySlug,
} from "@/lib/strapi/dashboard/documentation/infrastructure-ops/infrastructure-ops-repository";
import { toInfrastructureOpsDetailViewModel } from "@/lib/strapi/dashboard/documentation/infrastructure-ops/infrastructure-ops-view-models";
import { TableOfContents } from "@/components/molecules/article-components";
import { DocumentationBlockRenderer } from "@/components/organisms/documentation-block-renderer";

export async function generateStaticParams() {
  const strategicOverviewParams = listStrategicOverview().map((doc) => ({
    category: "strategic-overview",
    slug: doc.meta.slug,
  }));

  const cmsReferenceParams = listCmsReference().map((doc) => ({
    category: "cms-reference",
    slug: doc.meta.slug,
  }));

  const appReferenceParams = listAppReference().map((doc) => ({
    category: "app-reference",
    slug: doc.meta.slug,
  }));

  const infrastructureOpsParams = listInfrastructureOps().map((doc) => ({
    category: "infrastructure-ops",
    slug: doc.meta.slug,
  }));

  return [
    ...strategicOverviewParams,
    ...cmsReferenceParams,
    ...appReferenceParams,
    ...infrastructureOpsParams,
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;

  let viewModel;

  switch (category) {
    case "strategic-overview": {
      const record = getStrategicOverviewRecordBySlug(slug);
      if (!record) {
        return {
          title: "Documentation Not Found",
          robots: { index: false, follow: false },
        };
      }
      viewModel = toStrategicOverviewDetailViewModel(record.document);
      break;
    }
    case "cms-reference": {
      const record = getCmsReferenceRecordBySlug(slug);
      if (!record) {
        return {
          title: "Documentation Not Found",
          robots: { index: false, follow: false },
        };
      }
      viewModel = toCmsReferenceDetailViewModel(record.document);
      break;
    }
    case "app-reference": {
      const record = getAppReferenceRecordBySlug(slug);
      if (!record) {
        return {
          title: "Documentation Not Found",
          robots: { index: false, follow: false },
        };
      }
      viewModel = toAppReferenceDetailViewModel(record.document);
      break;
    }
    case "infrastructure-ops": {
      const record = getInfrastructureOpsRecordBySlug(slug);
      if (!record) {
        return {
          title: "Documentation Not Found",
          robots: { index: false, follow: false },
        };
      }
      viewModel = toInfrastructureOpsDetailViewModel(record.document);
      break;
    }
    default:
      return {
        title: "Documentation Not Found",
        robots: { index: false, follow: false },
      };
  }

  return {
    title: viewModel.seo.metaTitle,
    description: viewModel.seo.metaDescription,
    alternates: {
      canonical:
        viewModel.seo.canonicalUrl ??
        `/dashboard/documentation/${category}/${slug}`,
    },
    openGraph: {
      type: "article",
      title: viewModel.seo.metaTitle,
      description: viewModel.seo.metaDescription,
      url: `/dashboard/documentation/${category}/${slug}`,
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

function getAudienceColor(audience: string) {
  if (audience.includes("CTO") || audience.includes("Project Lead")) {
    return "bg-purple-500/10 text-purple-500 border-purple-500/20";
  }
  if (
    audience.includes("Developer") ||
    audience.includes("Architect") ||
    audience.includes("Engineer")
  ) {
    return "bg-blue-500/10 text-blue-500 border-blue-500/20";
  }
  if (audience.includes("DevOps") || audience.includes("Infrastructure")) {
    return "bg-green-500/10 text-green-500 border-green-500/20";
  }
  if (audience.includes("Designer")) {
    return "bg-pink-500/10 text-pink-500 border-pink-500/20";
  }
  if (audience.includes("QA")) {
    return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  }
  return "bg-muted text-muted-foreground border-border";
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case "strategic-overview":
      return "Strategic Overview";
    case "cms-reference":
      return "CMS Reference";
    case "app-reference":
      return "App Reference";
    case "infrastructure-ops":
      return "Infrastructure & Ops";
    default:
      return category;
  }
}

function getCategoryColor(category: string): string {
  switch (category) {
    case "strategic-overview":
      return "bg-accent/10 text-accent border-accent/20";
    case "cms-reference":
      return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "app-reference":
      return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
    case "infrastructure-ops":
      return "bg-teal-500/10 text-teal-500 border-teal-500/20";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export default async function DocumentationPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  let viewModel;

  switch (category) {
    case "strategic-overview": {
      const record = getStrategicOverviewRecordBySlug(slug);
      if (!record) notFound();
      viewModel = toStrategicOverviewDetailViewModel(record.document);
      break;
    }
    case "cms-reference": {
      const record = getCmsReferenceRecordBySlug(slug);
      if (!record) notFound();
      viewModel = toCmsReferenceDetailViewModel(record.document);
      break;
    }
    case "app-reference": {
      const record = getAppReferenceRecordBySlug(slug);
      if (!record) notFound();
      viewModel = toAppReferenceDetailViewModel(record.document);
      break;
    }
    case "infrastructure-ops": {
      const record = getInfrastructureOpsRecordBySlug(slug);
      if (!record) notFound();
      viewModel = toInfrastructureOpsDetailViewModel(record.document);
      break;
    }
    default:
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
              <DocumentationBlockRenderer blocks={viewModel.blocks} />
            </div>
            <aside className="hidden lg:block w-64 shrink-0">
              <TableOfContents items={viewModel.toc} />
            </aside>
          </div>
        ) : (
          <div className="space-y-6">
            <DocumentationBlockRenderer blocks={viewModel.blocks} />
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
