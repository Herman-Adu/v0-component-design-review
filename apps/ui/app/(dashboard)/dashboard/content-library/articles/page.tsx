import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";
import {
  type ArticleLevel,
  type ArticleCategory,
} from "@/lib/strapi/dashboard/content-library/articles/article-content";
import { listArticles } from "@/lib/strapi/dashboard/content-library/articles/article-repository";
import articlesListData from "@/data/strapi-mock/dashboard/content-library/articles/articles-list.json";
import type { ArticlesListContent } from "@/types/dashboard";
import { pageLogger } from "@/lib/utils/arch-logger";

const typedArticlesListData = articlesListData as ArticlesListContent;

function getLevelColor(level: ArticleLevel) {
  switch (level) {
    case "beginner":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20";
  }
}

function getCategoryColor(category: ArticleCategory) {
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

export default async function ArticlesPage() {
  pageLogger.render("/dashboard/content-library/articles");

  const articles = await listArticles();
  pageLogger.dataFetch(
    "/dashboard/content-library/articles",
    "articles",
    articles.length,
  );

  const { header, stats } = typedArticlesListData;

  const beginnerArticles = articles.filter((a) => a.level === "beginner");
  const intermediateArticles = articles.filter(
    (a) => a.level === "intermediate",
  );
  const advancedArticles = articles.filter((a) => a.level === "advanced");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {header.title}
        </h1>
        <p className="text-lg text-muted-foreground text-balance">
          {header.description}
        </p>
        <div className="mt-4">
          <Link
            href="/dashboard/content-library/articles/_harness/article-block-renderer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View content block renderer harness
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.level}
            className={`${
              stat.color === "green"
                ? "bg-green-500/5 border-green-500/20"
                : stat.color === "yellow"
                  ? "bg-yellow-500/5 border-yellow-500/20"
                  : "bg-red-500/5 border-red-500/20"
            } border rounded-lg p-4 text-center`}
          >
            <p
              className={`text-2xl font-bold ${
                stat.color === "green"
                  ? "text-green-500"
                  : stat.color === "yellow"
                    ? "text-yellow-500"
                    : "text-red-500"
              }`}
            >
              {stat.count}
            </p>
            <p className="text-sm text-muted-foreground">
              {stat.level.charAt(0).toUpperCase() + stat.level.slice(1)}
            </p>
          </div>
        ))}
      </div>

      {beginnerArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            Beginner Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {beginnerArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/dashboard/content-library/articles/${article.category}/${article.slug}`}
                className="group block p-4 bg-card border border-border rounded-lg hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-all group-hover:translate-x-1 flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span
                    className={`px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}
                  >
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {intermediateArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
            Intermediate Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intermediateArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/dashboard/content-library/articles/${article.category}/${article.slug}`}
                className="group block p-4 bg-card border border-border rounded-lg hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-all group-hover:translate-x-1 flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span
                    className={`px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}
                  >
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {advancedArticles.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Advanced Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {advancedArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/dashboard/content-library/articles/${article.category}/${article.slug}`}
                className="group block p-4 bg-card border border-border rounded-lg hover:border-accent transition-colors"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-all group-hover:translate-x-1 flex-shrink-0" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span
                    className={`px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}
                  >
                    {article.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
