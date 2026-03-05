"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Wrench,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Play,
  ArrowLeft,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { articles } from "@/data/content-library/articles"
import { caseStudies } from "@/data/content-library/case-studies"
import { tutorials } from "@/data/content-library/tutorials"

// ---------- Types ----------
type Severity = "critical" | "warning" | "info"
type FixStatus = "pending" | "applied" | "skipped"

interface FixAction {
  id: string
  title: string
  severity: Severity
  category: string
  description: string
  affectedFiles: string[]
  suggestedFix: string
  status: FixStatus
}

// ---------- Fix Discovery Engine ----------
function discoverFixes(): FixAction[] {
  const fixes: FixAction[] = []

  // 1. Check for missing required fields in content data
  articles.forEach((a) => {
    if (!a.slug || a.slug.trim() === "") {
      fixes.push({
        id: `article-slug-${a.id}`,
        title: `Article "${a.title}" has empty slug`,
        severity: "critical",
        category: "Data Integrity",
        description: "Empty slugs will cause 404 errors and broken routing.",
        affectedFiles: ["data/content-library/articles.tsx"],
        suggestedFix: `Set slug to "${a.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}"`,
        status: "pending",
      })
    }
    if (!a.excerpt || a.excerpt.length < 20) {
      fixes.push({
        id: `article-excerpt-${a.id}`,
        title: `Article "${a.title}" has short/missing excerpt`,
        severity: "warning",
        category: "SEO Quality",
        description: "Excerpts under 20 characters hurt SEO and card display quality.",
        affectedFiles: ["data/content-library/articles.tsx"],
        suggestedFix: "Add a descriptive excerpt of 50-160 characters summarizing the article content.",
        status: "pending",
      })
    }
    if (!a.tags || a.tags.length === 0) {
      fixes.push({
        id: `article-tags-${a.id}`,
        title: `Article "${a.title}" has no tags`,
        severity: "warning",
        category: "Discoverability",
        description: "Articles without tags are harder to find through filtering and search.",
        affectedFiles: ["data/content-library/articles.tsx"],
        suggestedFix: "Add 2-5 relevant tags based on the article topic and category.",
        status: "pending",
      })
    }
  })

  caseStudies.forEach((cs) => {
    if (!cs.slug || cs.slug.trim() === "") {
      fixes.push({
        id: `casestudy-slug-${cs.id}`,
        title: `Case Study "${cs.title}" has empty slug`,
        severity: "critical",
        category: "Data Integrity",
        description: "Empty slugs will cause 404 errors and broken routing.",
        affectedFiles: ["data/content-library/case-studies.tsx"],
        suggestedFix: `Set slug to "${cs.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}"`,
        status: "pending",
      })
    }
    if (!cs.tags || cs.tags.length === 0) {
      fixes.push({
        id: `casestudy-tags-${cs.id}`,
        title: `Case Study "${cs.title}" has no tags`,
        severity: "warning",
        category: "Discoverability",
        description: "Case studies without tags won't appear in tag-based filtering.",
        affectedFiles: ["data/content-library/case-studies.tsx"],
        suggestedFix: "Add 2-5 relevant tags based on the case study topic.",
        status: "pending",
      })
    }
  })

  tutorials.forEach((t) => {
    if (!t.slug || t.slug.trim() === "") {
      fixes.push({
        id: `tutorial-slug-${t.id}`,
        title: `Tutorial "${t.title}" has empty slug`,
        severity: "critical",
        category: "Data Integrity",
        description: "Empty slugs will cause 404 errors and broken routing.",
        affectedFiles: ["data/content-library/tutorials.tsx"],
        suggestedFix: `Set slug to "${t.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}"`,
        status: "pending",
      })
    }
    if (!t.steps || t.steps.length === 0) {
      fixes.push({
        id: `tutorial-steps-${t.id}`,
        title: `Tutorial "${t.title}" has no steps`,
        severity: "critical",
        category: "Content Completeness",
        description: "Tutorials without steps provide no value to learners.",
        affectedFiles: ["data/content-library/tutorials.tsx"],
        suggestedFix: "Add at least 3 tutorial steps with clear instructions and code examples.",
        status: "pending",
      })
    }
    if (!t.prerequisites || t.prerequisites.length === 0) {
      fixes.push({
        id: `tutorial-prereqs-${t.id}`,
        title: `Tutorial "${t.title}" has no prerequisites`,
        severity: "info",
        category: "Content Quality",
        description: "Missing prerequisites may confuse beginners who lack context.",
        affectedFiles: ["data/content-library/tutorials.tsx"],
        suggestedFix: "Add prerequisite knowledge items such as 'Basic React knowledge' or 'Node.js installed'.",
        status: "pending",
      })
    }
  })

  // 2. Consistency checks between content counts and claimed counts
  const articleCount = articles.length
  const caseStudyCount = caseStudies.length
  const tutorialCount = tutorials.length

  if (articleCount < 15) {
    fixes.push({
      id: "article-count-low",
      title: `Only ${articleCount} articles -- target is 15+`,
      severity: "info",
      category: "Content Coverage",
      description: "The content library targets 15+ articles for comprehensive topic coverage.",
      affectedFiles: ["data/content-library/articles.tsx"],
      suggestedFix: `Add ${15 - articleCount} more articles to reach the target of 15.`,
      status: "pending",
    })
  }

  if (tutorialCount < 8) {
    fixes.push({
      id: "tutorial-count-low",
      title: `Only ${tutorialCount} tutorials -- target is 8+`,
      severity: "info",
      category: "Content Coverage",
      description: "The content library targets 8+ tutorials for complete learning paths.",
      affectedFiles: ["data/content-library/tutorials.tsx"],
      suggestedFix: `Add ${8 - tutorialCount} more tutorials to reach the target of 8.`,
      status: "pending",
    })
  }

  return fixes
}

// ---------- Severity helpers ----------
function severityColor(s: Severity) {
  switch (s) {
    case "critical": return "bg-red-500/20 text-red-400 border-red-500/30"
    case "warning": return "bg-amber-500/20 text-amber-400 border-amber-500/30"
    case "info": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
  }
}

function severityIcon(s: Severity) {
  switch (s) {
    case "critical": return <XCircle className="h-4 w-4 text-red-400" />
    case "warning": return <AlertTriangle className="h-4 w-4 text-amber-400" />
    case "info": return <CheckCircle className="h-4 w-4 text-blue-400" />
  }
}

// ---------- Component ----------
export default function FixActionsPage() {
  const [fixes, setFixes] = useState<FixAction[]>([])
  const [hasRun, setHasRun] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterSeverity, setFilterSeverity] = useState<string>("all")

  function runDiscovery() {
    setIsRunning(true)
    setTimeout(() => {
      const results = discoverFixes()
      setFixes(results)
      setHasRun(true)
      setIsRunning(false)
    }, 600)
  }

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function markStatus(id: string, status: FixStatus) {
    setFixes((prev) => prev.map((f) => (f.id === id ? { ...f, status } : f)))
  }

  function copyFix(id: string, text: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Filtering
  const categories = Array.from(new Set(fixes.map((f) => f.category)))
  const filtered = fixes.filter((f) => {
    if (filterCategory !== "all" && f.category !== filterCategory) return false
    if (filterSeverity !== "all" && f.severity !== filterSeverity) return false
    return true
  })

  const criticalCount = fixes.filter((f) => f.severity === "critical").length
  const warningCount = fixes.filter((f) => f.severity === "warning").length
  const infoCount = fixes.filter((f) => f.severity === "info").length
  const appliedCount = fixes.filter((f) => f.status === "applied").length
  const skippedCount = fixes.filter((f) => f.status === "skipped").length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/admin/document-health/quality-engineering"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quality Engineering
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Wrench className="h-6 w-6 text-orange-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Fix Actions</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Discover issues across content data and documentation, review suggested fixes,
          and track resolution progress.
        </p>
      </div>

      {/* Run Discovery */}
      <Card className="border-orange-500/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Issue Discovery Engine</CardTitle>
              <CardDescription>
                Scans all content data for missing fields, quality issues, and consistency problems.
              </CardDescription>
            </div>
            <Button
              onClick={runDiscovery}
              disabled={isRunning}
              className="gap-2"
            >
              {isRunning ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isRunning ? "Scanning..." : hasRun ? "Re-scan" : "Run Discovery"}
            </Button>
          </div>
        </CardHeader>
        {hasRun && (
          <CardContent>
            <div className="responsive-grid-5">
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{fixes.length}</p>
                <p className="text-xs text-muted-foreground">Total Issues</p>
              </div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-red-400">{criticalCount}</p>
                <p className="text-xs text-muted-foreground">Critical</p>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-amber-400">{warningCount}</p>
                <p className="text-xs text-muted-foreground">Warnings</p>
              </div>
              <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-center">
                <p className="text-2xl font-bold text-green-400">{appliedCount}</p>
                <p className="text-xs text-muted-foreground">Applied</p>
              </div>
              <div className="rounded-lg border border-border p-3 text-center">
                <p className="text-2xl font-bold text-muted-foreground">{skippedCount}</p>
                <p className="text-xs text-muted-foreground">Skipped</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Filters */}
      {hasRun && fixes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={filterSeverity === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterSeverity("all")}
          >
            All Severity ({fixes.length})
          </Badge>
          <Badge
            variant={filterSeverity === "critical" ? "default" : "outline"}
            className={`cursor-pointer ${filterSeverity === "critical" ? "" : "bg-transparent"}`}
            onClick={() => setFilterSeverity(filterSeverity === "critical" ? "all" : "critical")}
          >
            Critical ({criticalCount})
          </Badge>
          <Badge
            variant={filterSeverity === "warning" ? "default" : "outline"}
            className={`cursor-pointer ${filterSeverity === "warning" ? "" : "bg-transparent"}`}
            onClick={() => setFilterSeverity(filterSeverity === "warning" ? "all" : "warning")}
          >
            Warning ({warningCount})
          </Badge>
          <Badge
            variant={filterSeverity === "info" ? "default" : "outline"}
            className={`cursor-pointer ${filterSeverity === "info" ? "" : "bg-transparent"}`}
            onClick={() => setFilterSeverity(filterSeverity === "info" ? "all" : "info")}
          >
            Info ({infoCount})
          </Badge>
          <span className="mx-2 border-l border-border" />
          <Badge
            variant={filterCategory === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterCategory("all")}
          >
            All Categories
          </Badge>
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={filterCategory === cat ? "default" : "outline"}
              className={`cursor-pointer ${filterCategory === cat ? "" : "bg-transparent"}`}
              onClick={() => setFilterCategory(filterCategory === cat ? "all" : cat)}
            >
              {cat}
            </Badge>
          ))}
        </div>
      )}

      {/* Fix List */}
      {hasRun && (
        <div className="space-y-3">
          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-3" />
                <p className="text-lg font-medium text-foreground">
                  {fixes.length === 0 ? "No issues found" : "No issues match filters"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {fixes.length === 0
                    ? "All content data passes validation checks."
                    : "Adjust filters to see other issues."}
                </p>
              </CardContent>
            </Card>
          )}

          {filtered.map((fix) => {
            const isExpanded = expandedIds.has(fix.id)
            return (
              <Card
                key={fix.id}
                className={`transition-colors ${
                  fix.status === "applied"
                    ? "border-green-500/30 opacity-60"
                    : fix.status === "skipped"
                      ? "border-border opacity-40"
                      : "border-border"
                }`}
              >
                <CardHeader className="pb-2 cursor-pointer" onClick={() => toggleExpand(fix.id)}>
                  <div className="flex items-start gap-3">
                    {severityIcon(fix.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-sm font-medium">
                          {fix.status === "applied" ? <s>{fix.title}</s> : fix.title}
                        </CardTitle>
                        <Badge className={severityColor(fix.severity)} variant="outline">
                          {fix.severity}
                        </Badge>
                        <Badge variant="outline" className="bg-transparent text-xs">
                          {fix.category}
                        </Badge>
                        {fix.status !== "pending" && (
                          <Badge
                            className={
                              fix.status === "applied"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-muted text-muted-foreground"
                            }
                            variant="outline"
                          >
                            {fix.status}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="mt-1">{fix.description}</CardDescription>
                    </div>
                    <div className="shrink-0">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    {/* Affected files */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Affected Files</p>
                      <div className="flex flex-wrap gap-1">
                        {fix.affectedFiles.map((f) => (
                          <code
                            key={f}
                            className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                          >
                            {f}
                          </code>
                        ))}
                      </div>
                    </div>

                    {/* Suggested fix */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Suggested Fix</p>
                      <div className="relative rounded-lg bg-muted/50 border border-border p-3">
                        <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                          {fix.suggestedFix}
                        </pre>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            copyFix(fix.id, fix.suggestedFix)
                          }}
                          className="absolute top-2 right-2 p-1 rounded hover:bg-muted"
                        >
                          {copiedId === fix.id ? (
                            <Check className="h-3.5 w-3.5 text-green-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {fix.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 bg-transparent text-green-400 border-green-500/30 hover:bg-green-500/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            markStatus(fix.id, "applied")
                          }}
                        >
                          <CheckCircle className="h-3.5 w-3.5" />
                          Mark Applied
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            markStatus(fix.id, "skipped")
                          }}
                        >
                          Skip
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}

      {/* Empty state */}
      {!hasRun && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <Wrench className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-lg font-medium text-muted-foreground mb-2">
              Ready to scan for issues
            </p>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              The discovery engine checks all content data files for missing fields, quality issues,
              and consistency problems, then provides actionable fixes you can copy and apply.
            </p>
            <Button onClick={runDiscovery} className="gap-2">
              <Play className="h-4 w-4" />
              Run Discovery
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Related tools */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
          Related Health Checks
        </h2>
        <div className="responsive-grid-2">
          {[
            { href: "/dashboard/admin/document-health/quality-engineering/count-validation", label: "Count Validation", desc: "Verify data array counts match documentation claims" },
            { href: "/dashboard/admin/document-health/quality-engineering/route-verification", label: "Route Verification", desc: "Check all sidebar nav links resolve to real pages" },
            { href: "/dashboard/admin/document-health/quality-engineering/toc-integrity", label: "TOC Integrity", desc: "Validate table-of-contents anchor IDs exist on page" },
            { href: "/dashboard/admin/document-health/quality-engineering/pattern-compliance", label: "Pattern Compliance", desc: "Check content follows naming, tagging, and structure conventions" },
          ].map((tool) => (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="h-full transition-colors hover:border-accent/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm group-hover:text-accent transition-colors flex items-center gap-2">
                    {tool.label}
                    <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </CardTitle>
                  <CardDescription className="text-xs">{tool.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
