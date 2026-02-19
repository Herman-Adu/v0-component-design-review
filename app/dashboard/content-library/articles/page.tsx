"use client"

import { useState } from "react"
import Link from "next/link"
import { Clock, ArrowRight, Filter } from "lucide-react"
import { articles, type ArticleLevel, type ArticleCategory } from "@/data/content-library/articles"

function getLevelColor(level: ArticleLevel) {
  switch (level) {
    case "beginner":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20"
  }
}

function getCategoryColor(category: ArticleCategory) {
  switch (category) {
    case "architecture":
      return "bg-blue-500/10 text-blue-500"
    case "security":
      return "bg-red-500/10 text-red-500"
    case "forms":
      return "bg-purple-500/10 text-purple-500"
    case "performance":
      return "bg-green-500/10 text-green-500"
    case "best-practices":
      return "bg-accent/10 text-accent"
    case "rendering":
      return "bg-cyan-500/10 text-cyan-500"
    case "business":
      return "bg-emerald-500/10 text-emerald-500"
    case "testing":
      return "bg-orange-500/10 text-orange-500"
    case "devops":
      return "bg-pink-500/10 text-pink-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default function ArticlesPage() {
  const [levelFilter, setLevelFilter] = useState<ArticleLevel | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<ArticleCategory | "all">("all")

  const filteredArticles = articles.filter((article) => {
    const levelMatch = levelFilter === "all" || article.level === levelFilter
    const categoryMatch = categoryFilter === "all" || article.category === categoryFilter
    return levelMatch && categoryMatch
  })

  const beginnerArticles = filteredArticles.filter((a) => a.level === "beginner")
  const intermediateArticles = filteredArticles.filter((a) => a.level === "intermediate")
  const advancedArticles = filteredArticles.filter((a) => a.level === "advanced")

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Articles & Insights</h1>
        <p className="text-lg text-muted-foreground text-balance">
          In-depth technical articles covering architecture, security, testing, DevOps, accessibility, and business strategy.
          Content is organised by skill level so you can start where you are comfortable and progress at your own pace.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-green-500">{articles.filter((a) => a.level === "beginner").length}</p>
          <p className="text-sm text-muted-foreground">Beginner</p>
        </div>
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-yellow-500">{articles.filter((a) => a.level === "intermediate").length}</p>
          <p className="text-sm text-muted-foreground">Intermediate</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-500">{articles.filter((a) => a.level === "advanced").length}</p>
          <p className="text-sm text-muted-foreground">Advanced</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 p-4 bg-card/50 border border-border rounded-lg">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Level:</span>
          {(["all", "beginner", "intermediate", "advanced"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setLevelFilter(level)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                levelFilter === level
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {level === "all" ? "All" : level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
        <div className="h-4 w-px bg-border hidden sm:block" />
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Category:</span>
          {(["all", "architecture", "security", "forms", "performance", "best-practices", "rendering", "business", "testing", "devops"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                categoryFilter === cat
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat === "all" ? "All" : cat === "best-practices" ? "Best Practices" : cat === "devops" ? "DevOps" : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {beginnerArticles.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500" />
            Beginner
          </h2>
          <p className="text-muted-foreground">Start here if you are new to these concepts.</p>
          <div className="grid gap-4">
            {beginnerArticles.map((article) => (
              <Link
                key={article.id}
                href={`/dashboard/content-library/articles/${article.slug}`}
                className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {intermediateArticles.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500" />
            Intermediate
          </h2>
          <p className="text-muted-foreground">Ready to go deeper? These articles build on foundational knowledge.</p>
          <div className="grid gap-4">
            {intermediateArticles.map((article) => (
              <Link
                key={article.id}
                href={`/dashboard/content-library/articles/${article.slug}`}
                className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {advancedArticles.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500" />
            Advanced
          </h2>
          <p className="text-muted-foreground">Deep dives into complex topics for experienced developers.</p>
          <div className="grid gap-4">
            {advancedArticles.map((article) => (
              <Link
                key={article.id}
                href={`/dashboard/content-library/articles/${article.slug}`}
                className="group bg-card border border-border rounded-lg p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {article.readTime}
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-accent transition-colors shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles match your filters.</p>
        </div>
      )}
    </div>
  )
}
