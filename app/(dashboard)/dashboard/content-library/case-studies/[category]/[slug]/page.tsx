import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag, TrendingUp, TrendingDown } from "lucide-react"
import { getCaseStudyBySlug, getAllCaseStudySlugs, type CaseStudy } from "@/data/content-library/case-studies"
import type { ComponentType } from "react"

// Rich content components for case studies (article-quality)
import { ClientToServerContent } from "@/features/dashboard/content-library/case-studies/client-to-server"
import { FormValidationContent } from "@/features/dashboard/content-library/case-studies/form-validation"
import { StateManagementContent } from "@/features/dashboard/content-library/case-studies/state-management"
import { SecurityLayerContent } from "@/features/dashboard/content-library/case-studies/security-layer"
import { EmailConsolidationContent } from "@/features/dashboard/content-library/case-studies/email-consolidation"
import { EnterpriseCmsContent } from "@/features/dashboard/content-library/case-studies/enterprise-cms"
import { CostReductionContent } from "@/features/dashboard/content-library/case-studies/cost-reduction"
import { MultiSiteContent } from "@/features/dashboard/content-library/case-studies/multi-site"
import { DevProductivityContent } from "@/features/dashboard/content-library/case-studies/dev-productivity"
import { DocumentationEvolutionContent } from "@/features/dashboard/content-library/case-studies/documentation-evolution"
import { HydrationGuardCaseStudyContent } from "@/features/dashboard/content-library/case-studies/hydration-guard"
import { RateLimitingContent } from "@/features/dashboard/content-library/case-studies/rate-limiting"
import { SidebarRefactorContent } from "@/features/dashboard/content-library/case-studies/sidebar-refactor"
import { TarballBuildFailureContent } from "@/features/dashboard/content-library/case-studies/tarball-build-failure"
import { RenderingStrategyContent } from "@/features/dashboard/content-library/case-studies/rendering-strategy"
import { MultiStepFormContent } from "@/features/dashboard/content-library/case-studies/multi-step-form"

// Map slugs to rich content components
const richContentMap: Record<string, ComponentType<{ caseStudy: CaseStudy }>> = {
  "client-to-server-components": ClientToServerContent,
  "form-validation-refactor": FormValidationContent,
  "state-management-evolution": StateManagementContent,
  "security-layer-implementation": SecurityLayerContent,
  "email-system-consolidation": EmailConsolidationContent,
  "enterprise-cms-migration": EnterpriseCmsContent,
  "cost-reduction-architecture": CostReductionContent,
  "strapi-multi-site-architecture": MultiSiteContent,
  "developer-productivity-gains": DevProductivityContent,
  "documentation-evolution": DocumentationEvolutionContent,
  "hydration-guard-pattern": HydrationGuardCaseStudyContent,
  // Batch 1 case studies
  "rate-limiting-bypass-to-production": RateLimitingContent,
  "sidebar-refactor-430-lines-to-data-driven": SidebarRefactorContent,
  "tarball-duplicate-entry-build-failure": TarballBuildFailureContent,
  "choosing-rendering-strategy-per-page": RenderingStrategyContent,
  "multi-step-form-prototype-to-production": MultiStepFormContent,
}

export async function generateStaticParams() {
  const slugs = getAllCaseStudySlugs()
  const caseStudies = slugs.map(slug => getCaseStudyBySlug(slug)).filter(Boolean)
  return caseStudies.map((cs) => ({
    category: cs!.category,
    slug: cs!.slug
  }))
}

function getCategoryColor(category: CaseStudy["category"]) {
  switch (category) {
    case "refactoring":
      return "bg-blue-500/10 text-blue-500"
    case "performance":
      return "bg-green-500/10 text-green-500"
    case "security":
      return "bg-red-500/10 text-red-500"
    case "architecture":
      return "bg-purple-500/10 text-purple-500"
    case "business":
      return "bg-emerald-500/10 text-emerald-500"
    case "cms":
      return "bg-orange-500/10 text-orange-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

function getCategoryLabel(category: CaseStudy["category"]) {
  switch (category) {
    case "cms":
      return "CMS"
    default:
      return category.charAt(0).toUpperCase() + category.slice(1)
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params
  const caseStudy = getCaseStudyBySlug(slug)

  if (!caseStudy) {
    notFound()
  }

  const RichContent = richContentMap[slug]

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
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(caseStudy.category)}`}>
          {getCategoryLabel(caseStudy.category)}
        </span>

        <h1 className="text-4xl font-bold text-foreground text-balance">{caseStudy.title}</h1>
        <p className="text-xl text-muted-foreground">{caseStudy.subtitle}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(caseStudy.publishedAt).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {caseStudy.tags.map((tag) => (
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

      {/* Rich Content or Fallback */}
      {RichContent ? (
        <RichContent caseStudy={caseStudy} />
      ) : (
        <FallbackContent caseStudy={caseStudy} />
      )}

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
  )
}

// Data-driven fallback for case studies without rich content
function FallbackContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <>
      {/* Before/After Comparison */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <span className="px-3 py-1 bg-red-500/10 text-red-500 text-sm font-medium rounded-full">Before</span>
            </div>
            <h3 className="font-semibold text-foreground">The Problem</h3>
            <p className="text-muted-foreground text-sm">{caseStudy.problem.description}</p>
            <ul className="space-y-2">
              {caseStudy.problem.issues.map((issue, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-red-500 shrink-0">x</span>
                  {issue}
                </li>
              ))}
            </ul>
            {caseStudy.problem.codeExample && (
              <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
                <code>{caseStudy.problem.codeExample}</code>
              </pre>
            )}
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="px-3 py-1 bg-green-500/10 text-green-500 text-sm font-medium rounded-full">After</span>
            </div>
            <h3 className="font-semibold text-foreground">The Solution</h3>
            <p className="text-muted-foreground text-sm">{caseStudy.solution.description}</p>
            <ul className="space-y-2">
              {caseStudy.solution.improvements.map((improvement, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-green-500 shrink-0">+</span>
                  {improvement}
                </li>
              ))}
            </ul>
            {caseStudy.solution.codeExample && (
              <pre className="bg-muted/50 p-4 rounded-lg text-xs overflow-x-auto">
                <code>{caseStudy.solution.codeExample}</code>
              </pre>
            )}
          </div>
        </div>
      </div>

      {/* Results Metrics */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Results</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {caseStudy.results.metrics.map((metric, idx) => (
            <div key={idx} className="bg-card border border-border rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-muted-foreground line-through">{metric.before}</span>
                <span className="text-lg font-bold text-foreground">{metric.after}</span>
              </div>
              <span className="inline-block px-2 py-0.5 text-xs font-medium bg-green-500/10 text-green-500 rounded">
                {metric.improvement}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaway */}
      <div className="bg-accent/5 border border-accent/20 rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-2">Key Takeaway</h3>
        <p className="text-foreground">{caseStudy.keyTakeaway}</p>
      </div>
    </>
  )
}
