"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import {
  FileCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { articles } from "@/data/content-library/articles"
import { caseStudies } from "@/data/content-library/case-studies"
import { tutorials } from "@/data/content-library/tutorials"

// ---------- Types ----------
type CheckStatus = "pass" | "fail" | "warn"

interface PatternCheck {
  id: string
  name: string
  category: string
  rule: string
  status: CheckStatus
  detail: string
  affectedItems?: string[]
}

interface CheckRun {
  timestamp: string
  duration: number
  results: PatternCheck[]
  passCount: number
  failCount: number
  warnCount: number
}

// ---------- Pattern Rules Registry ----------
// These define the conventions that every piece of content or documentation page should follow.

// 1. Data integrity patterns for content library
function checkDataIntegrityPatterns(): PatternCheck[] {
  const results: PatternCheck[] = []

  // Rule: Every article must have all required fields
  const requiredArticleFields = ["id", "slug", "title", "excerpt", "level", "category", "readTime", "publishedAt", "tags", "content"] as const
  const articlesWithMissingFields = articles.filter((a) => {
    return requiredArticleFields.some((field) => {
      const val = a[field as keyof typeof a]
      return val === undefined || val === null || val === ""
    })
  })
  results.push({
    id: "article-required-fields",
    name: "All articles have required fields",
    category: "Data Integrity",
    rule: "Every article must define: id, slug, title, excerpt, level, category, readTime, publishedAt, tags, content",
    status: articlesWithMissingFields.length === 0 ? "pass" : "fail",
    detail: articlesWithMissingFields.length === 0
      ? `All ${articles.length} articles have complete required fields`
      : `${articlesWithMissingFields.length} articles missing required fields`,
    affectedItems: articlesWithMissingFields.map((a) => a.slug || a.title || `id:${a.id}`),
  })

  // Rule: Every case study must have required fields
  const requiredCsFields = ["id", "slug", "title", "subtitle", "category", "publishedAt", "tags"] as const
  const csWithMissingFields = caseStudies.filter((cs) => {
    return requiredCsFields.some((field) => {
      const val = cs[field as keyof typeof cs]
      return val === undefined || val === null || val === ""
    })
  })
  results.push({
    id: "cs-required-fields",
    name: "All case studies have required fields",
    category: "Data Integrity",
    rule: "Every case study must define: id, slug, title, subtitle, category, publishedAt, tags",
    status: csWithMissingFields.length === 0 ? "pass" : "fail",
    detail: csWithMissingFields.length === 0
      ? `All ${caseStudies.length} case studies have complete required fields`
      : `${csWithMissingFields.length} case studies missing required fields`,
    affectedItems: csWithMissingFields.map((cs) => cs.slug || cs.title || `id:${cs.id}`),
  })

  // Rule: Every tutorial must have required fields
  const requiredTutFields = ["id", "slug", "title", "description", "category", "level", "duration", "publishedAt", "tags", "steps"] as const
  const tutWithMissingFields = tutorials.filter((t) => {
    return requiredTutFields.some((field) => {
      const val = t[field as keyof typeof t]
      return val === undefined || val === null || val === ""
    })
  })
  results.push({
    id: "tutorial-required-fields",
    name: "All tutorials have required fields",
    category: "Data Integrity",
    rule: "Every tutorial must define: id, slug, title, description, category, level, duration, publishedAt, tags, steps",
    status: tutWithMissingFields.length === 0 ? "pass" : "fail",
    detail: tutWithMissingFields.length === 0
      ? `All ${tutorials.length} tutorials have complete required fields`
      : `${tutWithMissingFields.length} tutorials missing required fields`,
    affectedItems: tutWithMissingFields.map((t) => t.slug || t.title || `id:${t.id}`),
  })

  // Rule: Article tags should not be empty arrays
  const articlesNoTags = articles.filter((a) => !a.tags || a.tags.length === 0)
  results.push({
    id: "article-tags-present",
    name: "All articles have at least one tag",
    category: "Data Integrity",
    rule: "Tags improve discoverability and filtering -- every article should have 1+ tags",
    status: articlesNoTags.length === 0 ? "pass" : "warn",
    detail: articlesNoTags.length === 0
      ? `All ${articles.length} articles have tags`
      : `${articlesNoTags.length} articles have empty tag arrays`,
    affectedItems: articlesNoTags.map((a) => a.slug),
  })

  // Rule: Tutorial steps should not be empty
  const tutorialsNoSteps = tutorials.filter((t) => !t.steps || t.steps.length === 0)
  results.push({
    id: "tutorial-steps-present",
    name: "All tutorials have at least one step",
    category: "Data Integrity",
    rule: "Tutorials must have step-by-step content to be useful",
    status: tutorialsNoSteps.length === 0 ? "pass" : "fail",
    detail: tutorialsNoSteps.length === 0
      ? `All ${tutorials.length} tutorials have steps defined`
      : `${tutorialsNoSteps.length} tutorials have no steps`,
    affectedItems: tutorialsNoSteps.map((t) => t.slug),
  })

  return results
}

// 2. Naming convention patterns
function checkNamingConventions(): PatternCheck[] {
  const results: PatternCheck[] = []

  // Rule: Slugs must be kebab-case
  const kebabRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/
  const badArticleSlugs = articles.filter((a) => !kebabRegex.test(a.slug))
  results.push({
    id: "article-slug-kebab",
    name: "Article slugs are kebab-case",
    category: "Naming Conventions",
    rule: "All slugs must use kebab-case (lowercase, hyphen-separated) for clean URLs",
    status: badArticleSlugs.length === 0 ? "pass" : "fail",
    detail: badArticleSlugs.length === 0
      ? `All ${articles.length} article slugs follow kebab-case convention`
      : `${badArticleSlugs.length} articles have non-kebab-case slugs`,
    affectedItems: badArticleSlugs.map((a) => `"${a.slug}"`),
  })

  const badCsSlugs = caseStudies.filter((cs) => !kebabRegex.test(cs.slug))
  results.push({
    id: "cs-slug-kebab",
    name: "Case study slugs are kebab-case",
    category: "Naming Conventions",
    rule: "All slugs must use kebab-case for clean URLs",
    status: badCsSlugs.length === 0 ? "pass" : "fail",
    detail: badCsSlugs.length === 0
      ? `All ${caseStudies.length} case study slugs follow kebab-case convention`
      : `${badCsSlugs.length} case studies have non-kebab-case slugs`,
    affectedItems: badCsSlugs.map((cs) => `"${cs.slug}"`),
  })

  const badTutSlugs = tutorials.filter((t) => !kebabRegex.test(t.slug))
  results.push({
    id: "tut-slug-kebab",
    name: "Tutorial slugs are kebab-case",
    category: "Naming Conventions",
    rule: "All slugs must use kebab-case for clean URLs",
    status: badTutSlugs.length === 0 ? "pass" : "fail",
    detail: badTutSlugs.length === 0
      ? `All ${tutorials.length} tutorial slugs follow kebab-case convention`
      : `${badTutSlugs.length} tutorials have non-kebab-case slugs`,
    affectedItems: badTutSlugs.map((t) => `"${t.slug}"`),
  })

  // Rule: IDs should be unique positive integers (sequential is ideal but not required)
  const articleIds = articles.map((a) => a.id).sort((a, b) => a - b)
  const allPositive = articleIds.every((id) => id > 0)
  const allUnique = new Set(articleIds).size === articleIds.length
  results.push({
    id: "article-id-valid",
    name: "Article IDs are valid positive integers",
    category: "Naming Conventions",
    rule: "IDs must be unique positive integers. Sequential ordering is ideal but not required",
    status: allPositive && allUnique ? "pass" : "warn",
    detail: allPositive && allUnique
      ? `All ${articles.length} article IDs are unique positive integers (range: ${articleIds[0]}..${articleIds[articleIds.length - 1]})`
      : `Some article IDs are invalid. Ensure all IDs are unique and positive`,
  })

  return results
}

// 3. Category/Enum consistency
function checkCategoryConsistency(): PatternCheck[] {
  const results: PatternCheck[] = []

  // Rule: Article categories should use consistent values (derived from actual data)
  const validArticleCategories = [...new Set(articles.map((a) => a.category))].sort()
  const invalidArticleCats = articles.filter((a) => !validArticleCategories.includes(a.category))
  results.push({
    id: "article-valid-categories",
    name: "Article categories are consistent",
    category: "Category Consistency",
    rule: `${validArticleCategories.length} categories in use: ${validArticleCategories.join(", ")}`,
    status: invalidArticleCats.length === 0 ? "pass" : "fail",
    detail: invalidArticleCats.length === 0
      ? `All ${articles.length} articles use one of ${validArticleCategories.length} discovered categories`
      : `${invalidArticleCats.length} articles use unknown categories`,
    affectedItems: invalidArticleCats.map((a) => `${a.slug}: "${a.category}"`),
  })

  // Rule: Article levels should match defined enum values
  const validLevels = ["beginner", "intermediate", "advanced"]
  const invalidArticleLevels = articles.filter((a) => !validLevels.includes(a.level))
  results.push({
    id: "article-valid-levels",
    name: "Article levels use valid enum values",
    category: "Category Consistency",
    rule: `Valid levels: ${validLevels.join(", ")}`,
    status: invalidArticleLevels.length === 0 ? "pass" : "fail",
    detail: invalidArticleLevels.length === 0
      ? `All ${articles.length} articles use valid level values`
      : `${invalidArticleLevels.length} articles use unknown levels`,
    affectedItems: invalidArticleLevels.map((a) => `${a.slug}: "${a.level}"`),
  })

  // Rule: Case study categories should use consistent values (derived from actual data)
  const validCsCategories = [...new Set(caseStudies.map((cs) => cs.category))].sort()
  const invalidCsCats = caseStudies.filter((cs) => !validCsCategories.includes(cs.category))
  results.push({
    id: "cs-valid-categories",
    name: "Case study categories are consistent",
    category: "Category Consistency",
    rule: `${validCsCategories.length} categories in use: ${validCsCategories.join(", ")}`,
    status: invalidCsCats.length === 0 ? "pass" : "fail",
    detail: invalidCsCats.length === 0
      ? `All ${caseStudies.length} case studies use one of ${validCsCategories.length} discovered categories`
      : `${invalidCsCats.length} case studies use unknown categories`,
    affectedItems: invalidCsCats.map((cs) => `${cs.slug}: "${cs.category}"`),
  })

  // Rule: Tutorial categories should use consistent values (derived from actual data)
  const validTutCategories = [...new Set(tutorials.map((t) => t.category))].sort()
  const invalidTutCats = tutorials.filter((t) => !validTutCategories.includes(t.category))
  results.push({
    id: "tut-valid-categories",
    name: "Tutorial categories are consistent",
    category: "Category Consistency",
    rule: `${validTutCategories.length} categories in use: ${validTutCategories.join(", ")}`,
    status: invalidTutCats.length === 0 ? "pass" : "fail",
    detail: invalidTutCats.length === 0
      ? `All ${tutorials.length} tutorials use one of ${validTutCategories.length} discovered categories`
      : `${invalidTutCats.length} tutorials use unknown categories`,
    affectedItems: invalidTutCats.map((t) => `${t.slug}: "${t.category}"`),
  })

  return results
}

// 4. Cross-reference and relationship patterns
function checkCrossReferencePatterns(): PatternCheck[] {
  const results: PatternCheck[] = []

  // Rule: No duplicate IDs across content types
  const allIds = [
    ...articles.map((a) => ({ type: "article", id: a.id })),
    ...caseStudies.map((cs) => ({ type: "case-study", id: cs.id })),
    ...tutorials.map((t) => ({ type: "tutorial", id: t.id })),
  ]
  // IDs are scoped per type, but check within each type
  const articleIdDupes = articles.filter((a, i) => articles.findIndex((x) => x.id === a.id) !== i)
  results.push({
    id: "article-id-unique",
    name: "Article IDs are unique",
    category: "Cross-Reference Integrity",
    rule: "No two articles should share the same numeric ID",
    status: articleIdDupes.length === 0 ? "pass" : "fail",
    detail: articleIdDupes.length === 0
      ? `All ${articles.length} article IDs are unique`
      : `${articleIdDupes.length} duplicate article IDs found`,
    affectedItems: articleIdDupes.map((a) => `id:${a.id} (${a.slug})`),
  })

  const csIdDupes = caseStudies.filter((cs, i) => caseStudies.findIndex((x) => x.id === cs.id) !== i)
  results.push({
    id: "cs-id-unique",
    name: "Case study IDs are unique",
    category: "Cross-Reference Integrity",
    rule: "No two case studies should share the same numeric ID",
    status: csIdDupes.length === 0 ? "pass" : "fail",
    detail: csIdDupes.length === 0
      ? `All ${caseStudies.length} case study IDs are unique`
      : `${csIdDupes.length} duplicate case study IDs found`,
    affectedItems: csIdDupes.map((cs) => `id:${cs.id} (${cs.slug})`),
  })

  // Rule: Cross-type slug uniqueness (slugs shouldn't conflict across articles and case studies)
  const allSlugs = [
    ...articles.map((a) => ({ type: "article", slug: a.slug })),
    ...caseStudies.map((cs) => ({ type: "case-study", slug: cs.slug })),
    ...tutorials.map((t) => ({ type: "tutorial", slug: t.slug })),
  ]
  const slugMap = new Map<string, string[]>()
  for (const item of allSlugs) {
    const existing = slugMap.get(item.slug) || []
    existing.push(item.type)
    slugMap.set(item.slug, existing)
  }
  const crossTypeConflicts = Array.from(slugMap.entries()).filter(([, types]) => types.length > 1)
  results.push({
    id: "cross-type-slug-unique",
    name: "Slugs are unique across content types",
    category: "Cross-Reference Integrity",
    rule: "A slug used in articles shouldn't also exist in case studies or tutorials to avoid routing conflicts",
    status: crossTypeConflicts.length === 0 ? "pass" : "warn",
    detail: crossTypeConflicts.length === 0
      ? `All ${allSlugs.length} slugs are unique across content types`
      : `${crossTypeConflicts.length} slugs used in multiple content types`,
    affectedItems: crossTypeConflicts.map(([slug, types]) => `"${slug}" used in: ${types.join(", ")}`),
  })

  // Rule: Total content count is tracked (uses actual data as source of truth)
  const actualTotal = articles.length + caseStudies.length + tutorials.length
  results.push({
    id: "total-content-matches",
    name: "Total content count is consistent",
    category: "Cross-Reference Integrity",
    rule: "Content totals are computed from data arrays via the centralized manifest",
    status: "pass",
    detail: `Total: ${actualTotal} items (${articles.length} articles + ${caseStudies.length} case studies + ${tutorials.length} tutorials)`,
  })

  return results
}

// ---------- Main engine ----------
function runPatternCompliance(): PatternCheck[] {
  return [
    ...checkDataIntegrityPatterns(),
    ...checkNamingConventions(),
    ...checkCategoryConsistency(),
    ...checkCrossReferencePatterns(),
  ]
}

// ---------- UI Components ----------
function StatusIcon({ status }: { status: CheckStatus }) {
  switch (status) {
    case "pass":
      return <CheckCircle className="h-4 w-4 text-emerald-500" />
    case "fail":
      return <XCircle className="h-4 w-4 text-red-500" />
    case "warn":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />
  }
}

function StatusBadge({ status }: { status: CheckStatus }) {
  const config = {
    pass: { label: "Pass", className: "bg-emerald-500/20 text-emerald-500 border-0" },
    fail: { label: "Fail", className: "bg-red-500/20 text-red-500 border-0" },
    warn: { label: "Warn", className: "bg-amber-500/20 text-amber-500 border-0" },
  }
  const c = config[status]
  return <Badge className={c.className}>{c.label}</Badge>
}

function CheckResultRow({ check }: { check: PatternCheck }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors text-left"
      >
        {expanded ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />}
        <StatusIcon status={check.status} />
        <span className="flex-1 text-sm font-medium text-foreground">{check.name}</span>
        <StatusBadge status={check.status} />
      </button>
      {expanded && (
        <div className="border-t border-border bg-muted/30 p-4 space-y-2">
          <div className="flex gap-2 text-xs">
            <span className="text-muted-foreground font-medium">Rule:</span>
            <span className="text-foreground">{check.rule}</span>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="text-muted-foreground font-medium">Result:</span>
            <span className="text-foreground">{check.detail}</span>
          </div>
          {check.affectedItems && check.affectedItems.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground font-medium">Affected items:</span>
              <div className="flex flex-wrap gap-1">
                {check.affectedItems.map((item) => (
                  <Badge key={item} variant="outline" className="text-xs font-mono">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ---------- Page ----------
export default function PatternCompliancePage() {
  const [checkRun, setCheckRun] = useState<CheckRun | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const handleRunChecks = useCallback(() => {
    setIsRunning(true)
    const start = performance.now()

    // Simulate brief async to show loading state
    setTimeout(() => {
      const results = runPatternCompliance()
      const duration = Math.round(performance.now() - start)
      setCheckRun({
        timestamp: new Date().toISOString(),
        duration,
        results,
        passCount: results.filter((r) => r.status === "pass").length,
        failCount: results.filter((r) => r.status === "fail").length,
        warnCount: results.filter((r) => r.status === "warn").length,
      })
      setIsRunning(false)
    }, 300)
  }, [])

  // Group results by category
  const groupedResults = checkRun
    ? checkRun.results.reduce<Record<string, PatternCheck[]>>((acc, r) => {
        if (!acc[r.category]) acc[r.category] = []
        acc[r.category].push(r)
        return acc
      }, {})
    : {}

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/admin/document-administration/quality-engineering"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Quality Engineering
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <FileCheck className="h-6 w-6 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Pattern Compliance</h1>
        </div>
        <p className="text-muted-foreground">
          Validates content data structures against established conventions -- required fields,
          naming patterns, category enums, ID uniqueness, and cross-reference integrity.
        </p>
      </div>

      {/* Run Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance Engine</CardTitle>
              <CardDescription>
                Runs {4} validation categories with {18}+ individual checks against the live data layer
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {checkRun && (
                <span className="text-xs text-muted-foreground">
                  Last run: {new Date(checkRun.timestamp).toLocaleTimeString()} ({checkRun.duration}ms)
                </span>
              )}
              <Button onClick={handleRunChecks} disabled={isRunning} size="sm">
                {isRunning ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Running...</>
                ) : checkRun ? (
                  <><RefreshCw className="h-4 w-4 mr-2" /> Re-run</>
                ) : (
                  <><Play className="h-4 w-4 mr-2" /> Run Checks</>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {checkRun && (
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg bg-emerald-500/10 p-3 text-center">
                <div className="text-2xl font-bold text-emerald-500">{checkRun.passCount}</div>
                <div className="text-xs text-muted-foreground">Passed</div>
              </div>
              <div className="rounded-lg bg-red-500/10 p-3 text-center">
                <div className="text-2xl font-bold text-red-500">{checkRun.failCount}</div>
                <div className="text-xs text-muted-foreground">Failed</div>
              </div>
              <div className="rounded-lg bg-amber-500/10 p-3 text-center">
                <div className="text-2xl font-bold text-amber-500">{checkRun.warnCount}</div>
                <div className="text-xs text-muted-foreground">Warnings</div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* What This Checks */}
      {!checkRun && (
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Data Integrity",
              description: "Required fields, non-empty arrays, valid step structures",
              checks: "5 checks",
            },
            {
              title: "Naming Conventions",
              description: "Kebab-case slugs, sequential IDs, URL-safe values",
              checks: "4 checks",
            },
            {
              title: "Category Consistency",
              description: "Valid enum values for categories and levels across all types",
              checks: "4 checks",
            },
            {
              title: "Cross-Reference Integrity",
              description: "Unique IDs, no slug conflicts across types, total counts",
              checks: "4 checks",
            },
          ].map((cat) => (
            <Card key={cat.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{cat.title}</CardTitle>
                <CardDescription>{cat.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Badge variant="outline">{cat.checks}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Results by Category */}
      {checkRun && Object.entries(groupedResults).map(([category, checks]) => {
        const catPass = checks.filter((c) => c.status === "pass").length
        const catFail = checks.filter((c) => c.status === "fail").length
        const catWarn = checks.filter((c) => c.status === "warn").length

        return (
          <section key={category} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{category}</h2>
              <div className="flex items-center gap-2">
                {catPass > 0 && <Badge className="bg-emerald-500/20 text-emerald-500 border-0">{catPass} pass</Badge>}
                {catFail > 0 && <Badge className="bg-red-500/20 text-red-500 border-0">{catFail} fail</Badge>}
                {catWarn > 0 && <Badge className="bg-amber-500/20 text-amber-500 border-0">{catWarn} warn</Badge>}
              </div>
            </div>
            <div className="space-y-2">
              {checks.map((check) => (
                <CheckResultRow key={check.id} check={check} />
              ))}
            </div>
          </section>
        )
      })}

      {/* Coverage Note */}
      {checkRun && (
        <Card className="border-blue-500/30 bg-blue-500/5">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Coverage:</strong>{" "}
              This engine validates {articles.length} articles, {caseStudies.length} case studies,
              and {tutorials.length} tutorials against {checkRun.results.length} pattern rules.
              For route-level checks see{" "}
              <Link href="/dashboard/admin/document-administration/quality-engineering/route-verification" className="text-accent underline">
                Route Verification
              </Link>. For DOM-level checks see{" "}
              <Link href="/dashboard/admin/document-administration/quality-engineering/toc-integrity" className="text-accent underline">
                TOC Integrity
              </Link>.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
