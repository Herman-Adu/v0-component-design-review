import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react";
import type { Article } from "@/lib/strapi/dashboard/content-library/articles/article-content";
import {
  listArticles,
  getArticleRecordBySlug,
} from "@/lib/strapi/dashboard/content-library/articles/article-repository";
import { toArticleDetailViewModel } from "@/lib/strapi/dashboard/content-library/articles/article-view-models";
import { canReadArticle } from "@/lib/authorization/article-policies";
import { getContentDetailPath } from "@/lib/content-library/url-policy";
import { TableOfContents } from "@/components/molecules/article-components";
import { ContentBlockRenderer } from "@/components/organisms/content-block-renderer";

export async function generateStaticParams() {
  try {
    const articles = await listArticles();
    return articles.map((article) => ({
      category: article.category,
      slug: article.slug,
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
  const record = await getArticleRecordBySlug(slug);

  if (!record || !canReadArticle(record.article)) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalPath = getContentDetailPath(
    "articles",
    record.article.category,
    record.article.slug,
  );

  return {
    title: record.article.title,
    description: record.article.excerpt,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "article",
      title: record.article.title,
      description: record.article.excerpt,
      url: canonicalPath,
      publishedTime: record.article.publishedAt,
      tags: record.article.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: record.article.title,
      description: record.article.excerpt,
    },
  };
}

function getLevelColor(level: Article["level"]) {
  switch (level) {
    case "beginner":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

function getCategoryColor(category: Article["category"]) {
  switch (category) {
    case "architecture":
      return "bg-blue-500/10 text-blue-500";
    case "security":
      return "bg-red-500/10 text-red-500";
    case "forms":
      return "bg-purple-500/10 text-purple-500";
    case "performance":
      return "bg-green-500/10 text-green-500";
    case "best-practices":
      return "bg-accent/10 text-accent";
    case "rendering":
      return "bg-cyan-500/10 text-cyan-500";
    case "business":
      return "bg-emerald-500/10 text-emerald-500";
    case "accessibility":
      return "bg-indigo-500/10 text-indigo-500";
    case "testing":
      return "bg-orange-500/10 text-orange-500";
    case "devops":
      return "bg-pink-500/10 text-pink-500";
    case "ai-tooling":
      return "bg-violet-500/10 text-violet-500";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const record = await getArticleRecordBySlug(slug);

  if (!record) {
    notFound();
  }

  if (record.article.category !== category) {
    redirect(
      getContentDetailPath(
        "articles",
        record.article.category,
        record.article.slug,
      ),
    );
  }

  if (!canReadArticle(record.article)) {
    notFound();
  }

  const articleViewModel = toArticleDetailViewModel(record.article);
  const contentDocument = record.content;

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/dashboard/content-library/articles"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Articles
      </Link>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelColor(articleViewModel.level)}`}
          >
            {articleViewModel.level.charAt(0).toUpperCase() +
              articleViewModel.level.slice(1)}
          </span>
          <span
            className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(articleViewModel.category)}`}
          >
            {articleViewModel.category.charAt(0).toUpperCase() +
              articleViewModel.category.slice(1)}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-foreground">
          {articleViewModel.title}
        </h1>
        <p className="text-xl text-muted-foreground">
          {articleViewModel.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {articleViewModel.readTime} read
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(articleViewModel.publishedAt).toLocaleDateString(
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
          {articleViewModel.tags.map((tag) => (
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

      {/* Article Content */}
      <article className="border-t border-border pt-8">
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
      </article>

      {/* Footer Navigation */}
      <footer className="border-t border-border pt-8">
        <Link
          href="/dashboard/content-library/articles"
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          View all articles
        </Link>
      </footer>
    </div>
  );
}
