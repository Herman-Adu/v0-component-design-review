import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import {
  listTutorials,
  getTutorialRecordBySlug,
} from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-repository";
import { getContentDetailPath } from "@/lib/content-library/url-policy";
import { toTutorialDetailViewModel } from "@/lib/strapi/dashboard/content-library/tutorials/tutorial-view-models";
import { ContentBlockRenderer } from "@/components/organisms/content-block-renderer";

export async function generateStaticParams() {
  try {
    const tutorials = await listTutorials();
    return tutorials.map((tutorial) => ({
      category: tutorial.category,
      slug: tutorial.slug,
    }));
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
  const record = await getTutorialRecordBySlug(slug);

  if (!record) {
    return {
      title: "Tutorial Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = getContentDetailPath(
    "tutorials",
    record.tutorial.category,
    record.tutorial.slug,
  );

  return {
    title: record.tutorial.title,
    description: record.tutorial.excerpt,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title: record.tutorial.title,
      description: record.tutorial.excerpt,
      url: canonicalPath,
      publishedTime: record.tutorial.publishedAt,
      tags: record.tutorial.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: record.tutorial.title,
      description: record.tutorial.excerpt,
    },
  };
}

function getLevelColor(level: string) {
  switch (level) {
    case "beginner":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "components":
      return "bg-blue-500/10 text-blue-500";
    case "forms":
      return "bg-purple-500/10 text-purple-500";
    case "security":
      return "bg-red-500/10 text-red-500";
    case "state-management":
      return "bg-green-500/10 text-green-500";
    case "performance":
      return "bg-accent/10 text-accent";
    case "getting-started":
      return "bg-teal-500/10 text-teal-500";
    case "cms":
      return "bg-emerald-500/10 text-emerald-500";
    case "testing":
      return "bg-orange-500/10 text-orange-500";
    case "devops":
      return "bg-pink-500/10 text-pink-500";
    case "email":
      return "bg-violet-500/10 text-violet-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { slug, category } = await params;
  const record = await getTutorialRecordBySlug(slug);

  if (!record) {
    notFound();
  }

  if (record.tutorial.category !== category) {
    redirect(
      getContentDetailPath(
        "tutorials",
        record.tutorial.category,
        record.tutorial.slug,
      ),
    );
  }

  const tutorial = record.tutorial;
  const tutorialViewModel = toTutorialDetailViewModel(tutorial);
  const content = record.content;

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/content-library/tutorials"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tutorials
      </Link>

      {/* Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelColor(tutorialViewModel.level)}`}
          >
            {tutorialViewModel.level.charAt(0).toUpperCase() +
              tutorialViewModel.level.slice(1)}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(tutorialViewModel.category)}`}
          >
            {tutorialViewModel.category
              .replace("-", " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-foreground">
          {tutorialViewModel.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {tutorialViewModel.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {tutorialViewModel.readTime}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(tutorialViewModel.publishedAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tutorialViewModel.tags.map((tag) => (
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

      {/* Tutorial Content - Block-based Rendering */}
      <div className="space-y-8 border-t border-border pt-8">
        <ContentBlockRenderer blocks={content.blocks} />
      </div>

      {/* Footer Navigation */}
      <footer className="border-t border-border pt-8">
        <Link
          href="/dashboard/content-library/tutorials"
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          View all tutorials
        </Link>
      </footer>
    </div>
  );
}
