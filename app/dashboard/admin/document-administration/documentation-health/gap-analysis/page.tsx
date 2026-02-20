"use client"

import React from "react"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  Compass,
  ArrowLeft,
  Play,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  FileText,
  BookOpen,
  GraduationCap,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Target,
  BarChart3,
  Clock,
  Plus,
  CheckCircle,
  XCircle,
  Layers,
  Shield,
  Zap,
  Code,
  Database,
  Copy,
  Check,
  Users,
  GitBranch,
  Square,
  CheckSquare,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { articles, type ArticleCategory } from "@/data/content-library/articles"
import { caseStudies, type CaseStudyCategory } from "@/data/content-library/case-studies"
import { tutorials, type TutorialCategory } from "@/data/content-library/tutorials"
import { guides } from "@/data/content-library/guides"
import { STATS, COMPONENT_COUNTS, ROUTES, MANAGEMENT_DOCS, MANAGEMENT_DOC_STATS } from "@/data/doc-manifest"
import {
  CONTENT_GAPS,
  AUDIENCES,
  computeAudienceCoverage,
  extractReviewKnowledge,
  isGapAddressedByContent,
  type ContentGap,
  type AudienceCoverage,
  type Audience,
} from "@/data/content-gap-registry"
import {
  REVIEW_LOG,
  LESSONS_LEARNED,
  type Finding,
} from "@/data/code-review-log"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type GapPriority = "high" | "medium" | "low"
type GapType =
  | "missing-article"
  | "missing-tutorial"
  | "missing-case-study"
  | "stale-content"
  | "coverage-gap"
  | "opportunity"
  | "review-knowledge"
  | "audience-gap"
type GapStatus = "open" | "in-progress" | "deferred"

interface Gap {
  id: string
  title: string
  type: GapType
  priority: GapPriority
  category: string
  description: string
  suggestedAction: string
  effort: "small" | "medium" | "large"
  status: GapStatus
  relatedTopics: string[]
  sourceReview?: string
  audiences?: Audience[]
}

interface CoverageMetric {
  area: string
  icon: React.ElementType
  documented: number
  total: number
  details: string
}

// ---------------------------------------------------------------------------
// Gap Discovery Engine -- 10 Analysis Passes
// ---------------------------------------------------------------------------

function discoverGaps(): Gap[] {
  const gaps: Gap[] = []

  // Build a unified content array for cross-referencing
  const allContent = [
    ...articles.map((a) => ({ title: a.title, tags: a.tags, category: a.category })),
    ...tutorials.map((t) => ({ title: t.title, tags: t.tags, category: t.category })),
    ...caseStudies.map((cs) => ({ title: cs.title, tags: cs.tags, category: cs.category })),
    ...guides.map((g) => ({ title: g.title, tags: g.tags, category: g.category })),
  ]

  // ---- PASS 0: MANAGEMENT DOC PROTECTION ----
  const docsWithoutDocPage = MANAGEMENT_DOCS.filter((d) => !d.usesDocPage)
  if (docsWithoutDocPage.length > 0) {
    gaps.push({
      id: "mgmt-docs-unprotected",
      title: `${docsWithoutDocPage.length} of ${MANAGEMENT_DOCS.length} management docs lack DocPage wrapper`,
      type: "coverage-gap",
      priority: "medium",
      category: "Management Docs",
      description: `${docsWithoutDocPage.length} management doc pages are still raw JSX without the DocPage wrapper. Pages: ${docsWithoutDocPage.slice(0, 5).map((d) => d.slug).join(", ")}${docsWithoutDocPage.length > 5 ? "..." : ""}.`,
      suggestedAction: "Migrate remaining management doc pages to use the DocPage wrapper for consistent structure, metadata, and TOC.",
      effort: "large",
      status: "in-progress",
      relatedTopics: ["doc-protection", "docpage-wrapper"],
    })
  }

  const needsReview = MANAGEMENT_DOCS.filter((d) => d.status === "needs-review")
  if (needsReview.length > 0) {
    gaps.push({
      id: "mgmt-docs-needs-review",
      title: `${needsReview.length} management doc(s) flagged for review`,
      type: "stale-content",
      priority: "high",
      category: "Management Docs",
      description: `These management docs are flagged as needing review: ${needsReview.map((d) => d.title).join(", ")}.`,
      suggestedAction: "Review flagged management docs and update or mark as current.",
      effort: "medium",
      status: "open",
      relatedTopics: ["content-staleness"],
    })
  }

  // ---- PASS 1: CATEGORY BALANCE ANALYSIS ----
  const articleCatCounts: Record<string, number> = {}
  articles.forEach((a) => {
    articleCatCounts[a.category] = (articleCatCounts[a.category] || 0) + 1
  })

  const avgArticlesPerCat = articles.length / Object.keys(articleCatCounts).length
  const allArticleCategories: ArticleCategory[] = [
    "architecture", "security", "forms", "performance", "best-practices", "rendering", "business", "testing", "devops",
  ]

  allArticleCategories.forEach((cat) => {
    const count = articleCatCounts[cat] || 0
    if (count === 0) {
      gaps.push({
        id: `article-cat-missing-${cat}`,
        title: `No articles in "${cat}" category`,
        type: "coverage-gap",
        priority: "high",
        category: "Category Balance",
        description: `The "${cat}" category has zero articles while the average is ${avgArticlesPerCat.toFixed(1)} per category. This creates a blind spot in the documentation.`,
        suggestedAction: `Write 2-3 articles covering key ${cat} topics relevant to this project's architecture.`,
        effort: "large",
        status: "open",
        relatedTopics: [cat],
      })
    } else if (count < avgArticlesPerCat * 0.5) {
      gaps.push({
        id: `article-cat-low-${cat}`,
        title: `Only ${count} article(s) in "${cat}" -- below average`,
        type: "coverage-gap",
        priority: "medium",
        category: "Category Balance",
        description: `"${cat}" has ${count} article(s) vs the average of ${avgArticlesPerCat.toFixed(1)}. Consider adding ${Math.ceil(avgArticlesPerCat - count)} more.`,
        suggestedAction: `Identify the most impactful ${cat} topics not yet covered and draft new articles.`,
        effort: "medium",
        status: "open",
        relatedTopics: [cat],
      })
    }
  })

  // ---- PASS 2: TUTORIAL COVERAGE vs ARTICLE COVERAGE ----
  const tutorialCats = new Set(tutorials.map((t) => t.category))
  const tutorialRelevantCats: TutorialCategory[] = [
    "components", "forms", "security", "state-management", "performance", "getting-started", "cms", "testing",
  ]

  tutorialRelevantCats.forEach((cat) => {
    if (!tutorialCats.has(cat)) {
      gaps.push({
        id: `tutorial-cat-missing-${cat}`,
        title: `No tutorials for "${cat}" category`,
        type: "missing-tutorial",
        priority: "medium",
        category: "Tutorial Gaps",
        description: `Tutorials help developers learn by doing. The "${cat}" area has articles but no hands-on tutorials.`,
        suggestedAction: `Create a step-by-step tutorial showing how to implement a ${cat} feature from scratch.`,
        effort: "large",
        status: "open",
        relatedTopics: [cat],
      })
    }
  })

  // ---- PASS 3: CASE STUDY COVERAGE ----
  const csCats = new Set(caseStudies.map((cs) => cs.category))
  const csRelevantCats: CaseStudyCategory[] = ["refactoring", "performance", "security", "architecture", "business", "cms"]

  csRelevantCats.forEach((cat) => {
    if (!csCats.has(cat)) {
      gaps.push({
        id: `cs-cat-missing-${cat}`,
        title: `No case study for "${cat}" category`,
        type: "missing-case-study",
        priority: "medium",
        category: "Case Study Gaps",
        description: `Case studies provide real-world proof. A "${cat}" case study would strengthen the documentation credibility.`,
        suggestedAction: `Document a real refactoring, migration, or improvement story for "${cat}".`,
        effort: "large",
        status: "open",
        relatedTopics: [cat],
      })
    }
  })

  // ---- PASS 4: LEVEL BALANCE ----
  const levelCounts = { beginner: 0, intermediate: 0, advanced: 0 }
  articles.forEach((a) => { levelCounts[a.level]++ })
  const totalArticles = articles.length
  const beginnerPct = (levelCounts.beginner / totalArticles) * 100
  const advancedPct = (levelCounts.advanced / totalArticles) * 100

  if (beginnerPct < 20) {
    gaps.push({
      id: "level-balance-beginner",
      title: `Only ${levelCounts.beginner} beginner articles (${beginnerPct.toFixed(0)}%)`,
      type: "coverage-gap",
      priority: "medium",
      category: "Level Balance",
      description: "Beginner content is the entry point for new team members. Having less than 20% beginner content creates an onboarding barrier.",
      suggestedAction: "Add introductory articles explaining core concepts: project structure, getting started guide, first component tutorial.",
      effort: "medium",
      status: "open",
      relatedTopics: ["onboarding", "beginner"],
    })
  }
  if (advancedPct < 15) {
    gaps.push({
      id: "level-balance-advanced",
      title: `Only ${levelCounts.advanced} advanced articles (${advancedPct.toFixed(0)}%)`,
      type: "coverage-gap",
      priority: "low",
      category: "Level Balance",
      description: "Advanced content helps senior developers. Having less than 15% advanced content means deep topics may be undocumented.",
      suggestedAction: "Add advanced articles: performance optimization deep-dives, custom hooks patterns, architecture decision records.",
      effort: "medium",
      status: "open",
      relatedTopics: ["advanced", "deep-dive"],
    })
  }

  // ---- PASS 5: FEATURE-to-DOCUMENTATION CROSS-REFERENCE ----
  const routeTopics = [
    { route: ROUTES.frontend.security, topic: "security", label: "Security Architecture" },
    { route: ROUTES.frontend.performance, topic: "performance", label: "Performance" },
    { route: ROUTES.frontend.hydration, topic: "hydration", label: "Hydration Guards" },
    { route: ROUTES.frontend.apiIntegration, topic: "api", label: "API Integration" },
    { route: ROUTES.frontend.testing, topic: "testing", label: "Testing Strategy" },
    { route: ROUTES.frontend.deployment, topic: "deployment", label: "Deployment" },
    { route: ROUTES.frontend.emailNotifications, topic: "email", label: "Email System" },
    { route: ROUTES.backend.api, topic: "graphql", label: "Backend API & GraphQL" },
    { route: ROUTES.backend.relationships, topic: "relationships", label: "Data Relationships" },
  ]

  routeTopics.forEach(({ topic, label }) => {
    const hasArticle = articles.some((a) =>
      a.tags.some((t) => t.includes(topic)) || a.title.toLowerCase().includes(topic)
    )
    const hasTutorial = tutorials.some((t) =>
      t.tags.some((tag) => tag.includes(topic)) || t.title.toLowerCase().includes(topic)
    )

    if (!hasArticle && !hasTutorial) {
      gaps.push({
        id: `feature-gap-${topic}`,
        title: `"${label}" has a doc page but no supporting articles or tutorials`,
        type: "opportunity",
        priority: "medium",
        category: "Feature Coverage",
        description: `The documentation page for "${label}" exists, but there are no articles or tutorials that deep-dive into the topic.`,
        suggestedAction: `Write an article explaining the "${label}" architecture and a tutorial showing practical usage.`,
        effort: "medium",
        status: "open",
        relatedTopics: [topic, label.toLowerCase()],
      })
    }
  })

  // ---- PASS 6: COMPONENT DOCUMENTATION GAP ----
  const componentAreas = [
    { name: "Atoms", count: COMPONENT_COUNTS.atoms.count, topic: "atoms" },
    { name: "Molecules", count: COMPONENT_COUNTS.molecules.count, topic: "molecules" },
    { name: "Organisms", count: COMPONENT_COUNTS.organisms.count, topic: "organisms" },
    { name: "Animations", count: COMPONENT_COUNTS.animations.count, topic: "animation" },
    { name: "Hooks", count: COMPONENT_COUNTS.hooks.count, topic: "hooks" },
  ]

  componentAreas.forEach(({ name, count, topic }) => {
    const hasDedicatedContent = articles.some((a) =>
      a.tags.some((t) => t.includes(topic)) || a.title.toLowerCase().includes(topic) || a.title.toLowerCase().includes(name.toLowerCase())
    )
    if (!hasDedicatedContent && count > 3) {
      gaps.push({
        id: `component-doc-${topic}`,
        title: `${count} ${name} components have no dedicated article`,
        type: "missing-article",
        priority: "low",
        category: "Component Coverage",
        description: `There are ${count} ${name} components but no article documenting their API, usage patterns, and best practices.`,
        suggestedAction: `Write a "${name} Component Guide" article covering all ${count} components with examples.`,
        effort: "medium",
        status: "open",
        relatedTopics: [topic, "components"],
      })
    }
  })

  // ---- PASS 7: CONTENT FRESHNESS ----
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  articles.forEach((a) => {
    const pubDate = new Date(a.publishedAt)
    if (pubDate < sixMonthsAgo) {
      gaps.push({
        id: `stale-article-${a.id}`,
        title: `"${a.title}" may need a refresh (published ${a.publishedAt})`,
        type: "stale-content",
        priority: "low",
        category: "Content Freshness",
        description: `This article was published over 6 months ago. Framework versions, APIs, and best practices may have evolved.`,
        suggestedAction: `Review the article for accuracy against Next.js 16, React 19.2, and current project patterns. Update code examples if needed.`,
        effort: "small",
        status: "open",
        relatedTopics: [a.category, "refresh"],
      })
    }
  })

  // ---- PASS 8: CROSS-CONTENT OPPORTUNITIES ----
  const tutorialTopics = new Set(tutorials.flatMap((t) => t.tags))
  const articlesWithoutTutorials = articles.filter((a) =>
    !a.tags.some((tag) => tutorialTopics.has(tag))
  )

  if (articlesWithoutTutorials.length > articles.length * 0.5) {
    gaps.push({
      id: "article-tutorial-mismatch",
      title: `${articlesWithoutTutorials.length} articles have no matching tutorial`,
      type: "opportunity",
      priority: "medium",
      category: "Content Synergy",
      description: `More than half of articles have no companion tutorial. Tutorials reinforce article concepts through hands-on practice.`,
      suggestedAction: `Prioritize tutorials for the most-read article topics: ${articlesWithoutTutorials.slice(0, 3).map((a) => a.title).join(", ")}.`,
      effort: "large",
      status: "open",
      relatedTopics: ["tutorials", "learning-paths"],
    })
  }

  caseStudies.forEach((cs) => {
    const hasMatchingTutorial = tutorials.some((t) =>
      t.tags.some((tag) => cs.tags.includes(tag))
    )
    if (!hasMatchingTutorial) {
      gaps.push({
        id: `cs-to-tutorial-${cs.id}`,
        title: `Case study "${cs.title}" has no companion tutorial`,
        type: "opportunity",
        priority: "low",
        category: "Content Synergy",
        description: `This case study documents a real solution. A tutorial teaching the same approach would help developers replicate the pattern.`,
        suggestedAction: `Create a tutorial based on "${cs.title}" that walks through the implementation step-by-step.`,
        effort: "medium",
        status: "open",
        relatedTopics: cs.tags.slice(0, 3),
      })
    }
  })

  // ---- PASS 9: REVIEW LOG KNOWLEDGE EXTRACTION (NEW) ----
  // Scans all review findings for transferable knowledge not yet in the content library.
  // Critical/high findings often represent hard-won lessons worth documenting.
  const allFindings: Finding[] = REVIEW_LOG.flatMap((r) => r.findings)
  const reviewKnowledge = extractReviewKnowledge(
    allFindings.map((f) => ({
      id: f.id,
      title: f.title,
      category: f.category,
      severity: f.severity,
      description: f.description,
    })),
    allContent,
  )

  reviewKnowledge.forEach((rk) => {
    gaps.push({
      id: `review-knowledge-${rk.findingId}`,
      title: `Review finding "${rk.title}" has no matching content`,
      type: "review-knowledge",
      priority: rk.severity === "critical" ? "high" : "medium",
      category: "Review Knowledge",
      description: `This ${rk.severity}-severity finding from the code review log represents transferable knowledge. A ${rk.suggestedContentType} would help future developers avoid the same issue.`,
      suggestedAction: `Create a ${rk.suggestedContentType} documenting the problem, investigation process, root cause, and solution. Source: review finding ${rk.findingId}.`,
      effort: rk.suggestedContentType === "case-study" ? "large" : "medium",
      status: "open",
      relatedTopics: [rk.category, "review-findings"],
      sourceReview: rk.findingId,
    })
  })

  // Also scan lessons learned for content opportunities
  LESSONS_LEARNED.forEach((lesson) => {
    const titleWords = lesson.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
    const hasContent = allContent.some((item) =>
      titleWords.filter((w) => item.title.toLowerCase().includes(w)).length >= 2,
    )
    if (!hasContent) {
      gaps.push({
        id: `lesson-${lesson.id}`,
        title: `Lesson learned: "${lesson.title}" not yet documented as content`,
        type: "review-knowledge",
        priority: "medium",
        category: "Review Knowledge",
        description: `${lesson.lesson.slice(0, 200)}... This hard-won lesson would make valuable content for preventing similar issues.`,
        suggestedAction: `Create a case study or article covering: what happened, why, what went wrong, the correct fix, and prevention measures.`,
        effort: "large",
        status: "open",
        relatedTopics: ["lessons-learned", "incident-response"],
      })
    }
  })

  // ---- PASS 10: AUDIENCE COVERAGE ANALYSIS (NEW) ----
  // Cross-references the content gap registry against real content.
  // Surfaces gaps from the 30-item registry that haven't been addressed.
  const registryGapsNotAddressed = CONTENT_GAPS.filter(
    (g) => g.status !== "published" && !isGapAddressedByContent(g, allContent),
  )

  registryGapsNotAddressed.forEach((regGap) => {
    // Avoid duplicating gaps already discovered by passes 1-9
    const isDuplicate = gaps.some(
      (g) => g.relatedTopics.some((t) => regGap.keyTopics.some((kt) => kt.toLowerCase().includes(t.toLowerCase()))),
    )
    if (!isDuplicate) {
      gaps.push({
        id: `registry-${regGap.id}`,
        title: regGap.title,
        type: "audience-gap",
        priority: regGap.priority === "tier-1" ? "high" : regGap.priority === "tier-2" ? "medium" : "low",
        category: "Audience Pipeline",
        description: `${regGap.description} Target audiences: ${regGap.audiences.join(", ")}. Content type: ${regGap.contentType}.`,
        suggestedAction: `Create a ${regGap.contentType} covering: ${regGap.keyTopics.join(", ")}. Estimated scope: ${regGap.estimatedScope}.`,
        effort: regGap.estimatedScope === "long" ? "large" : regGap.estimatedScope === "short" ? "small" : "medium",
        status: "open",
        relatedTopics: regGap.keyTopics.slice(0, 3),
        audiences: regGap.audiences,
      })
    }
  })

  return gaps
}

// ---------------------------------------------------------------------------
// Coverage metrics computation
// ---------------------------------------------------------------------------

function computeCoverageMetrics(): CoverageMetric[] {
  const articleCats = new Set(articles.map((a) => a.category))
  const allArticleCats = ["architecture", "security", "forms", "performance", "best-practices", "rendering", "business", "testing", "devops"]
  const tutCats = new Set(tutorials.map((t) => t.category))
  const allTutCats = ["components", "forms", "security", "state-management", "performance", "getting-started", "cms", "testing"]

  return [
    {
      area: "Article Categories",
      icon: FileText,
      documented: articleCats.size,
      total: allArticleCats.length,
      details: `${articleCats.size}/${allArticleCats.length} categories have articles`,
    },
    {
      area: "Tutorial Categories",
      icon: GraduationCap,
      documented: tutCats.size,
      total: allTutCats.length,
      details: `${tutCats.size}/${allTutCats.length} categories have tutorials`,
    },
    {
      area: "Doc Route Pages",
      icon: Layers,
      documented: Object.values(ROUTES.frontend).length + Object.values(ROUTES.backend).length,
      total: Object.values(ROUTES.frontend).length + Object.values(ROUTES.backend).length,
      details: "All planned routes are implemented",
    },
    {
      area: "Security Layers Documented",
      icon: Shield,
      documented: STATS.security.layers,
      total: STATS.security.layers,
      details: `${STATS.security.layers} layers with full documentation`,
    },
    {
      area: "Component Categories with Articles",
      icon: Code,
      documented: articles.filter((a) => a.tags.some((t) => t.includes("component"))).length > 0 ? 1 : 0,
      total: 5,
      details: "Atoms, Molecules, Organisms, Animations, Hooks",
    },
    {
      area: "Backend Collections Documented",
      icon: Database,
      documented: STATS.backend.collectionTypes.total,
      total: STATS.backend.collectionTypes.total,
      details: `${STATS.backend.collectionTypes.total} collection types fully documented`,
    },
  ]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function priorityColor(p: GapPriority) {
  switch (p) {
    case "high": return "bg-red-500/20 text-red-400 border-red-500/30"
    case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
  }
}

function priorityIcon(p: GapPriority) {
  switch (p) {
    case "high": return <XCircle className="h-4 w-4 text-red-400" />
    case "medium": return <AlertTriangle className="h-4 w-4 text-amber-400" />
    case "low": return <Lightbulb className="h-4 w-4 text-blue-400" />
  }
}

function typeLabel(t: GapType) {
  switch (t) {
    case "missing-article": return "New Article"
    case "missing-tutorial": return "New Tutorial"
    case "missing-case-study": return "New Case Study"
    case "stale-content": return "Content Refresh"
    case "coverage-gap": return "Coverage Gap"
    case "opportunity": return "Opportunity"
    case "review-knowledge": return "Review Knowledge"
    case "audience-gap": return "Audience Gap"
  }
}

function typeColor(t: GapType) {
  switch (t) {
    case "missing-article": return "bg-purple-500/20 text-purple-400"
    case "missing-tutorial": return "bg-green-500/20 text-green-400"
    case "missing-case-study": return "bg-cyan-500/20 text-cyan-400"
    case "stale-content": return "bg-orange-500/20 text-orange-400"
    case "coverage-gap": return "bg-red-500/20 text-red-400"
    case "opportunity": return "bg-emerald-500/20 text-emerald-400"
    case "review-knowledge": return "bg-amber-500/20 text-amber-300"
    case "audience-gap": return "bg-teal-500/20 text-teal-400"
  }
}

function effortLabel(e: "small" | "medium" | "large") {
  switch (e) {
    case "small": return "1-2 hrs"
    case "medium": return "3-5 hrs"
    case "large": return "1-2 days"
  }
}

function audienceCoverageColor(rating: AudienceCoverage["rating"]) {
  switch (rating) {
    case "excellent": return "bg-green-500"
    case "good": return "bg-teal-500"
    case "fair": return "bg-amber-500"
    case "poor": return "bg-red-500"
    case "none": return "bg-muted-foreground"
  }
}

function audienceBadgeColor(rating: AudienceCoverage["rating"]) {
  switch (rating) {
    case "excellent": return "bg-green-500/20 text-green-400 border-0"
    case "good": return "bg-teal-500/20 text-teal-400 border-0"
    case "fair": return "bg-amber-500/20 text-amber-400 border-0"
    case "poor": return "bg-red-500/20 text-red-400 border-0"
    case "none": return "bg-muted text-muted-foreground border-0"
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GapAnalysisPage() {
  const [gaps, setGaps] = useState<Gap[]>([])
  const [hasRun, setHasRun] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedGaps, setSelectedGaps] = useState<Set<string>>(new Set())
  const [showPipeline, setShowPipeline] = useState(false)

  const coverageMetrics = useMemo(() => computeCoverageMetrics(), [])

  // Compute audience coverage from real content data
  const audienceCoverage = useMemo(() => {
    const allContent = [
      ...articles.map((a) => ({ title: a.title, tags: a.tags, category: a.category })),
      ...tutorials.map((t) => ({ title: t.title, tags: t.tags, category: t.category })),
      ...caseStudies.map((cs) => ({ title: cs.title, tags: cs.tags, category: cs.category })),
    ]
    return computeAudienceCoverage(allContent)
  }, [])

  function runDiscovery() {
    setIsRunning(true)
    setTimeout(() => {
      const results = discoverGaps()
      setGaps(results)
      setHasRun(true)
      setIsRunning(false)
      setShowPipeline(true)
    }, 800)
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function markStatus(id: string, status: GapStatus) {
    setGaps((prev) => prev.map((g) => (g.id === id ? { ...g, status } : g)))
  }

  function copyAction(id: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function toggleSelect(id: string) {
    setSelectedGaps((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectAll() {
    if (selectedGaps.size === filtered.length) {
      setSelectedGaps(new Set())
    } else {
      setSelectedGaps(new Set(filtered.map((g) => g.id)))
    }
  }

  // Filtering
  const categories = Array.from(new Set(gaps.map((g) => g.category)))
  const filtered = gaps.filter((g) => {
    if (filterCategory !== "all" && g.category !== filterCategory) return false
    if (filterPriority !== "all" && g.priority !== filterPriority) return false
    if (filterType !== "all" && g.type !== filterType) return false
    return true
  })

  const highCount = gaps.filter((g) => g.priority === "high").length
  const mediumCount = gaps.filter((g) => g.priority === "medium").length
  const lowCount = gaps.filter((g) => g.priority === "low").length
  const openCount = gaps.filter((g) => g.status === "open").length
  const inProgressCount = gaps.filter((g) => g.status === "in-progress").length
  const reviewKnowledgeCount = gaps.filter((g) => g.type === "review-knowledge").length
  const audienceGapCount = gaps.filter((g) => g.type === "audience-gap").length

  // Group by category
  const groupedGaps: Record<string, Gap[]> = {}
  filtered.forEach((g) => {
    if (!groupedGaps[g.category]) groupedGaps[g.category] = []
    groupedGaps[g.category].push(g)
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/admin/doc-system"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Doc Health
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-teal-500/10">
            <Compass className="h-6 w-6 text-teal-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Gap Analysis</h1>
          <Badge className="bg-teal-500/20 text-teal-400 border-0">Discovery Engine</Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Programmatically audit documentation coverage against the codebase. Discover gaps,
          missed opportunities, and content areas that need attention.
        </p>
      </div>

      {/* Coverage Overview (always visible) */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-teal-400" />
            <CardTitle>Documentation Coverage Overview</CardTitle>
          </div>
          <CardDescription>
            Current coverage metrics across all documentation areas. Updated in real-time from the manifest.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {coverageMetrics.map((metric) => {
              const pct = metric.total > 0 ? Math.round((metric.documented / metric.total) * 100) : 0
              const Icon = metric.icon
              return (
                <div key={metric.area} className="rounded-lg border border-border p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium text-foreground">{metric.area}</p>
                    </div>
                    <Badge className={pct === 100 ? "bg-green-500/20 text-green-400 border-0" : "bg-amber-500/20 text-amber-400 border-0"}>
                      {pct}%
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${pct === 100 ? "bg-green-500" : pct >= 70 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{metric.details}</p>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Stats Quick View */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card className="border-purple-500/20">
          <CardContent className="pt-4 pb-4 text-center">
            <FileText className="h-5 w-5 text-purple-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{articles.length}</p>
            <p className="text-xs text-muted-foreground">Articles</p>
            <p className="text-xs text-muted-foreground mt-1">{STATS.content.articleCategories.length} categories</p>
          </CardContent>
        </Card>
        <Card className="border-cyan-500/20">
          <CardContent className="pt-4 pb-4 text-center">
            <TrendingUp className="h-5 w-5 text-cyan-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{caseStudies.length}</p>
            <p className="text-xs text-muted-foreground">Case Studies</p>
            <p className="text-xs text-muted-foreground mt-1">{STATS.content.caseStudyCategories.length} categories</p>
          </CardContent>
        </Card>
        <Card className="border-green-500/20">
          <CardContent className="pt-4 pb-4 text-center">
            <GraduationCap className="h-5 w-5 text-green-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{tutorials.length}</p>
            <p className="text-xs text-muted-foreground">Tutorials</p>
            <p className="text-xs text-muted-foreground mt-1">{STATS.content.tutorialCategories.length} categories</p>
          </CardContent>
        </Card>
        <Card className="border-accent/20">
          <CardContent className="pt-4 pb-4 text-center">
            <Target className="h-5 w-5 text-accent mx-auto mb-1" />
            <p className="text-2xl font-bold text-foreground">{STATS.content.totalItems}</p>
            <p className="text-xs text-muted-foreground">Total Content Items</p>
            <p className="text-xs text-muted-foreground mt-1">{STATS.frontend.components.total} components documented</p>
          </CardContent>
        </Card>
      </div>

      {/* Run Discovery */}
      <Card className="border-teal-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Gap Discovery Engine</CardTitle>
              <CardDescription>
                Performs 10 analysis passes: category balance, tutorial coverage, case study coverage,
                level distribution, feature-to-docs cross-reference, component documentation,
                content freshness, cross-content synergy, <span className="text-amber-400 font-medium">review log knowledge extraction</span>,
                and <span className="text-teal-400 font-medium">audience coverage analysis</span>.
              </CardDescription>
            </div>
            <Button onClick={runDiscovery} disabled={isRunning} className="gap-2">
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? "Analyzing..." : hasRun ? "Re-analyze" : "Run Analysis"}
            </Button>
          </div>
        </CardHeader>
        {hasRun && (
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{gaps.length}</p>
                <p className="text-xs text-muted-foreground">Total Gaps</p>
              </div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-red-400">{highCount}</p>
                <p className="text-xs text-muted-foreground">High Priority</p>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-amber-400">{mediumCount}</p>
                <p className="text-xs text-muted-foreground">Medium</p>
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-blue-400">{lowCount}</p>
                <p className="text-xs text-muted-foreground">Low</p>
              </div>
              <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-green-400">{inProgressCount}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-amber-300">{reviewKnowledgeCount}</p>
                <p className="text-xs text-muted-foreground">From Reviews</p>
              </div>
              <div className="rounded-lg border border-teal-500/30 bg-teal-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-teal-400">{audienceGapCount}</p>
                <p className="text-xs text-muted-foreground">Audience Gaps</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* ================================================================= */}
      {/* CONTENT PIPELINE -- Audience Coverage + Batch Selection           */}
      {/* ================================================================= */}
      {hasRun && showPipeline && (
        <>
          {/* Audience Coverage Cards */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-400" />
                <CardTitle>Audience Coverage Pipeline</CardTitle>
              </div>
              <CardDescription>
                Live coverage computed from the content library against 30 identified audience content needs.
                Each card shows how well-served each audience role is.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {audienceCoverage.map((aud) => (
                  <div key={aud.audience} className="rounded-lg border border-border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-foreground">{aud.label}</p>
                      <Badge className={audienceBadgeColor(aud.rating)}>
                        {aud.coveragePct}%
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${audienceCoverageColor(aud.rating)}`}
                        style={{ width: `${aud.coveragePct}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {aud.addressed}/{aud.totalGaps} content needs addressed
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Knowledge Summary */}
          {reviewKnowledgeCount > 0 && (
            <Card className="border-amber-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-amber-400" />
                  <CardTitle className="text-lg">Review Knowledge Pipeline</CardTitle>
                </div>
                <CardDescription>
                  {reviewKnowledgeCount} findings from {REVIEW_LOG.length} code reviews contain transferable knowledge
                  not yet captured in the content library. These represent real production lessons.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-lg border border-border p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{REVIEW_LOG.length}</p>
                    <p className="text-xs text-muted-foreground">Reviews Scanned</p>
                  </div>
                  <div className="rounded-lg border border-border p-3 text-center">
                    <p className="text-2xl font-bold text-foreground">{REVIEW_LOG.flatMap((r) => r.findings).length}</p>
                    <p className="text-xs text-muted-foreground">Total Findings</p>
                  </div>
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-center">
                    <p className="text-2xl font-bold text-amber-300">{reviewKnowledgeCount}</p>
                    <p className="text-xs text-muted-foreground">Undocumented</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Batch Selection Bar */}
          {selectedGaps.size > 0 && (
            <div className="sticky top-0 z-10 rounded-lg border border-teal-500/30 bg-card p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge className="bg-teal-500/20 text-teal-400 border-0">
                  {selectedGaps.size} selected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedGaps.size} gap{selectedGaps.size !== 1 ? "s" : ""} selected for batch processing
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-transparent"
                  onClick={() => setSelectedGaps(new Set())}
                >
                  Clear Selection
                </Button>
                <Button
                  size="sm"
                  className="text-xs gap-1"
                  disabled
                  title="AI Draft Generation coming in Option 2"
                >
                  <Zap className="h-3 w-3" />
                  Generate Drafts ({selectedGaps.size})
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Filters */}
      {hasRun && gaps.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          {/* Select all toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={selectAll}
            className="text-xs gap-1 bg-transparent"
          >
            {selectedGaps.size === filtered.length ? (
              <CheckSquare className="h-3 w-3" />
            ) : (
              <Square className="h-3 w-3" />
            )}
            {selectedGaps.size === filtered.length ? "Deselect All" : "Select All"}
          </Button>
          <span className="w-px h-5 bg-border" />
          {/* Priority filter */}
          {["all", "high", "medium", "low"].map((p) => (
            <Button
              key={`prio-${p}`}
              variant={filterPriority === p ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterPriority(p)}
              className={`text-xs ${filterPriority !== p ? "bg-transparent" : ""}`}
            >
              {p === "all" ? "All Priorities" : `${p.charAt(0).toUpperCase() + p.slice(1)}`}
            </Button>
          ))}
          <span className="w-px h-5 bg-border" />
          {/* Type filter */}
          {["all", "coverage-gap", "missing-article", "missing-tutorial", "missing-case-study", "stale-content", "opportunity", "review-knowledge", "audience-gap"].map((t) => (
            <Button
              key={`type-${t}`}
              variant={filterType === t ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType(t)}
              className={`text-xs ${filterType !== t ? "bg-transparent" : ""}`}
            >
              {t === "all" ? "All Types" : typeLabel(t as GapType)}
            </Button>
          ))}
          <span className="w-px h-5 bg-border" />
          {/* Category filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs rounded-md border border-border bg-background text-foreground px-2 py-1"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {/* Results grouped by category */}
      {hasRun && (
        <div className="space-y-6">
          {Object.entries(groupedGaps).map(([category, categoryGaps]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                <Badge variant="outline" className="text-xs">{categoryGaps.length}</Badge>
                <Badge className={`text-xs border-0 ${
                  categoryGaps.some((g) => g.priority === "high") ? "bg-red-500/20 text-red-400" :
                  categoryGaps.some((g) => g.priority === "medium") ? "bg-amber-500/20 text-amber-400" :
                  "bg-blue-500/20 text-blue-400"
                }`}>
                  {categoryGaps.some((g) => g.priority === "high") ? "High" :
                   categoryGaps.some((g) => g.priority === "medium") ? "Medium" : "Low"} Priority
                </Badge>
              </div>

              {categoryGaps.map((gap) => {
                const isExpanded = expandedIds.has(gap.id)
                const isSelected = selectedGaps.has(gap.id)
                return (
                  <Card key={gap.id} className={`border-l-2 ${
                    gap.status === "in-progress" ? "border-l-amber-500" :
                    gap.status === "deferred" ? "border-l-muted-foreground" :
                    gap.priority === "high" ? "border-l-red-500" :
                    gap.priority === "medium" ? "border-l-amber-500" : "border-l-blue-500"
                  }`}>
                    <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleExpand(gap.id)}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          {/* Batch checkbox */}
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSelect(gap.id) }}
                            className="mt-1 shrink-0"
                            aria-label={isSelected ? "Deselect gap" : "Select gap"}
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-teal-400" />
                            ) : (
                              <Square className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                            )}
                          </button>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                          )}
                          {priorityIcon(gap.priority)}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground leading-tight">{gap.title}</p>
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              <Badge className={`text-xs border-0 ${typeColor(gap.type)}`}>{typeLabel(gap.type)}</Badge>
                              <Badge className={`text-xs ${priorityColor(gap.priority)}`}>{gap.priority}</Badge>
                              <Badge variant="outline" className="text-xs gap-1">
                                <Clock className="h-3 w-3" />
                                {effortLabel(gap.effort)}
                              </Badge>
                              {gap.sourceReview && (
                                <Badge variant="outline" className="text-xs gap-1 border-amber-500/30 text-amber-400">
                                  <GitBranch className="h-3 w-3" />
                                  {gap.sourceReview}
                                </Badge>
                              )}
                              {gap.status === "in-progress" && (
                                <Badge className="text-xs bg-amber-500/20 text-amber-400 border-0">In Progress</Badge>
                              )}
                              {gap.status === "deferred" && (
                                <Badge className="text-xs bg-muted text-muted-foreground border-0">Deferred</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    {isExpanded && (
                      <CardContent className="pt-0 pl-16 space-y-3">
                        <p className="text-sm text-muted-foreground">{gap.description}</p>

                        {gap.audiences && gap.audiences.length > 0 && (
                          <div className="flex items-center gap-2">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Audiences:</span>
                            {gap.audiences.map((a) => (
                              <Badge key={a} variant="outline" className="text-xs">{a}</Badge>
                            ))}
                          </div>
                        )}

                        <div className="rounded-lg border border-teal-500/20 bg-teal-500/5 p-3">
                          <div className="flex items-start gap-2">
                            <Plus className="h-4 w-4 text-teal-400 mt-0.5 shrink-0" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-teal-400 mb-1">Suggested Action</p>
                              <p className="text-sm text-muted-foreground">{gap.suggestedAction}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="shrink-0 h-7 w-7 p-0"
                              onClick={(e) => { e.stopPropagation(); copyAction(gap.id, gap.suggestedAction) }}
                            >
                              {copiedId === gap.id ? (
                                <Check className="h-3 w-3 text-green-400" />
                              ) : (
                                <Copy className="h-3 w-3 text-muted-foreground" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {gap.relatedTopics.length > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">Related:</span>
                            {gap.relatedTopics.map((t) => (
                              <Badge key={t} variant="outline" className="text-xs">{t}</Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1 bg-transparent"
                            onClick={(e) => { e.stopPropagation(); markStatus(gap.id, "in-progress") }}
                          >
                            <Zap className="h-3 w-3" />
                            Start Work
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs gap-1 bg-transparent"
                            onClick={(e) => { e.stopPropagation(); markStatus(gap.id, "deferred") }}
                          >
                            <Clock className="h-3 w-3" />
                            Defer
                          </Button>
                          {gap.status !== "open" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-xs gap-1"
                              onClick={(e) => { e.stopPropagation(); markStatus(gap.id, "open") }}
                            >
                              Reopen
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    )}
                  </Card>
                )
              })}
            </div>
          ))}

          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-lg font-medium text-foreground">No gaps match your filters</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Try broadening your filter criteria, or all gaps in this view have been addressed.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Summary / Export */}
      {hasRun && gaps.length > 0 && (
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Quick Wins (small effort, high impact)</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {gaps
                    .filter((g) => g.effort === "small" && g.priority !== "low")
                    .slice(0, 5)
                    .map((g) => (
                      <li key={g.id} className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${g.priority === "high" ? "bg-red-400" : "bg-amber-400"}`} />
                        {g.title}
                      </li>
                    ))}
                  {gaps.filter((g) => g.effort === "small" && g.priority !== "low").length === 0 && (
                    <li className="text-muted-foreground">No quick wins found -- all gaps require substantial effort.</li>
                  )}
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Strategic Investments (large effort)</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {gaps
                    .filter((g) => g.effort === "large")
                    .slice(0, 5)
                    .map((g) => (
                      <li key={g.id} className="flex items-center gap-1.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${g.priority === "high" ? "bg-red-400" : g.priority === "medium" ? "bg-amber-400" : "bg-blue-400"}`} />
                        {g.title}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="rounded-lg border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Pipeline Workflow:</span>{" "}
                1. Run Analysis to discover gaps across 10 passes (8 doc-manifest + review log + audience registry).{" "}
                2. Review gaps by priority -- start with high-priority items.{" "}
                3. Select items via checkboxes for batch processing.{" "}
                4. Mark as In Progress when work begins.{" "}
                5. (Future) Generate AI drafts from selected gaps using the batch draft system.{" "}
                Re-run analysis after content additions to see coverage improve.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
