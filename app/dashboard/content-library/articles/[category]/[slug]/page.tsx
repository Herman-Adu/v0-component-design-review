import React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react"
import { getArticleBySlug, getAllArticleSlugs, type Article } from "@/data/content-library/articles"

// Import all rich article components
import { SSGArticleContent } from "@/components/articles/ssg-article"
import { SSRArticleContent } from "@/components/articles/ssr-article"
import { ISRArticleContent } from "@/components/articles/isr-article"
import { PPRArticleContent } from "@/components/articles/ppr-article"
import { AtomicDesignArticleContent } from "@/components/articles/atomic-design-article"
import { PlanningArticleContent } from "@/components/articles/planning-article"
import { ZodValidationArticleContent } from "@/components/articles/zod-validation-article"
import { MultiStepFormArticleContent } from "@/components/articles/multi-step-form-article"
import { ZustandArticleContent } from "@/components/articles/zustand-article"
import { SecurityArticleContent } from "@/components/articles/security-article"
import { ServerActionsArticleContent } from "@/components/articles/server-actions-article"
import { EmailArticleContent } from "@/components/articles/email-article"
import { RefactoringArticle } from "@/components/articles/refactoring-article"
import { DocumentationArticle } from "@/components/articles/documentation-article"
import { AccessibilityArticleContent } from "@/components/articles/accessibility-article"
import { ROIArticleContent } from "@/components/articles/roi-article"
import { TechStackArticleContent } from "@/components/articles/tech-stack-article"
import { TestingArticleContent } from "@/components/articles/testing-article"
import { CICDArticleContent } from "@/components/articles/cicd-article"
import { HydrationDeepDiveArticleContent } from "@/components/articles/hydration-deep-dive-article"
import { GuardPatternArticleContent } from "@/components/articles/guard-pattern-article"
import { PerformanceBudgetsArticleContent } from "@/components/articles/performance-budgets-article"
import { ServerClientBoundariesArticleContent } from "@/components/articles/server-client-boundaries-article"
import { DuplicateProvidersArticleContent } from "@/components/articles/duplicate-providers-article"
import { HydrationMismatchesArticleContent } from "@/components/articles/hydration-mismatches-article"
import { AISessionManagementArticleContent } from "@/components/articles/ai-session-management-article"
// Removed: ThreeAxisReviewArticleContent, ServiceRequestLifecycleArticleContent, ManagingContentStrapiArticleContent
// These used broken shared molecule props. Content renders via markdown fallback path.

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs()
  const articles = slugs.map(slug => getArticleBySlug(slug)).filter(Boolean)
  return articles.map((article) => ({
    category: article!.category,
    slug: article!.slug
  }))
}

// Map slugs to their rich content components
const richArticleComponents: Record<string, React.ComponentType> = {
  "static-site-generation-ssg": SSGArticleContent,
  "server-side-rendering-ssr": SSRArticleContent,
  "incremental-static-regeneration-isr": ISRArticleContent,
  "partial-prerendering-ppr": PPRArticleContent,
  "atomic-design-principles": AtomicDesignArticleContent,
  "planning-full-stack-application": PlanningArticleContent,
  "typescript-zod-validation": ZodValidationArticleContent,
  "multi-step-form-architecture": MultiStepFormArticleContent,
  "zustand-form-state-management": ZustandArticleContent,
  "security-architecture-deep-dive": SecurityArticleContent,
  "server-actions-deep-dive": ServerActionsArticleContent,
  "email-system-architecture": EmailArticleContent,
  "refactoring-for-maintainability": RefactoringArticle,
  "documentation-as-architecture": DocumentationArticle,
  "roi-modern-web-architecture": ROIArticleContent,
  "tech-stack-decision-framework": TechStackArticleContent,
  "building-accessible-web-applications": AccessibilityArticleContent,
  "testing-strategy-modern-applications": TestingArticleContent,
  "cicd-deployment-pipelines": CICDArticleContent,
  "why-react-hydration-breaks": HydrationDeepDiveArticleContent,
  "guard-pattern-architecture": GuardPatternArticleContent,
  "performance-budgets-for-nextjs": PerformanceBudgetsArticleContent,
  "server-client-boundaries": ServerClientBoundariesArticleContent,
  "duplicate-providers-architectural-cost": DuplicateProvidersArticleContent,
  "hydration-mismatches-use-client-layouts": HydrationMismatchesArticleContent,
  "ai-session-management-quality-gates": AISessionManagementArticleContent,
}

function formatContent(content: string): React.ReactNode {
  const lines = content.split("\n")
  const elements: React.ReactNode[] = []
  let inCodeBlock = false
  let codeContent: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeContent = []
      } else {
        inCodeBlock = false
        elements.push(
          <pre key={`code-${i}`} className="bg-muted/50 p-4 rounded-lg overflow-x-auto my-4 text-sm">
            <code className="text-foreground">{codeContent.join("\n")}</code>
          </pre>
        )
      }
      continue
    }

    if (inCodeBlock) {
      codeContent.push(line)
      continue
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2 key={i} className="text-2xl font-bold text-foreground mt-8 mb-4">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(
        <p key={i} className="font-semibold text-foreground mt-4 mb-2">
          {line.slice(2, -2)}
        </p>
      )
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={i} className="text-muted-foreground ml-4 list-disc">
          {line.slice(2)}
        </li>
      )
    } else if (line.match(/^\d+\./)) {
      elements.push(
        <li key={i} className="text-muted-foreground ml-4 list-decimal">
          {line.replace(/^\d+\.\s*/, "")}
        </li>
      )
    } else if (line.startsWith("|")) {
      elements.push(
        <p key={i} className="text-muted-foreground font-mono text-sm">
          {line}
        </p>
      )
    } else if (line.trim() === "") {
      elements.push(<div key={i} className="h-3" />)
    } else {
      elements.push(
        <p key={i} className="text-muted-foreground leading-relaxed">
          {line}
        </p>
      )
    }
  }

  return elements
}

function getLevelColor(level: Article["level"]) {
  switch (level) {
    case "beginner":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20"
  }
}

function getCategoryColor(category: Article["category"]) {
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
    case "accessibility":
      return "bg-indigo-500/10 text-indigo-500"
    case "testing":
      return "bg-orange-500/10 text-orange-500"
    case "devops":
      return "bg-pink-500/10 text-pink-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params
  const article = getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  // Check if this article has a rich content component
  const RichContentComponent = richArticleComponents[slug]

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
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelColor(article.level)}`}>
            {article.level.charAt(0).toUpperCase() + article.level.slice(1)}
          </span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(article.category)}`}>
            {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-foreground">{article.title}</h1>
        <p className="text-xl text-muted-foreground">{article.excerpt}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {article.readTime} read
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(article.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
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
        {RichContentComponent ? (
          <RichContentComponent />
        ) : (
          <div className="prose max-w-none">{formatContent(article.content)}</div>
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
  )
}
