import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar, Tag, CheckCircle, BookOpen } from "lucide-react"
import { getTutorialBySlug, getAllTutorialSlugs, type Tutorial } from "@/data/content-library/tutorials"
import { Spoiler } from "@/components/atoms/spoiler"
import { CodeBlock } from "@/components/atoms/code-block"
import type { ComponentType } from "react"

// Rich content components for tutorials (article-quality)
import { DeployingNextjsVercelContent } from "@/features/dashboard/content-library/tutorials/deploying-nextjs-vercel"
import { MultiStepFormsServerActionsContent } from "@/features/dashboard/content-library/tutorials/multi-step-forms-server-actions"
import { EmailTemplatesReactEmailContent } from "@/features/dashboard/content-library/tutorials/email-templates-react-email"
import { E2ETestingPlaywrightContent } from "@/features/dashboard/content-library/tutorials/e2e-testing-playwright"
import { BuildingAtomicComponentContent } from "@/features/dashboard/content-library/tutorials/building-atomic-component"
import { ServerSideValidationContent } from "@/features/dashboard/content-library/tutorials/server-side-validation"
import { ZustandFormStoreContent } from "@/features/dashboard/content-library/tutorials/zustand-form-store"
import { RateLimitingImplementationContent } from "@/features/dashboard/content-library/tutorials/rate-limiting-implementation"
import { YourFirstNextjsAppContent } from "@/features/dashboard/content-library/tutorials/your-first-nextjs-app"
import { YourFirstStrapiCollectionContent } from "@/features/dashboard/content-library/tutorials/your-first-strapi-collection"
import { UnitTestingVitestContent } from "@/features/dashboard/content-library/tutorials/unit-testing-vitest"
import { ConnectingNextjsToStrapiContent } from "@/features/dashboard/content-library/tutorials/connecting-nextjs-to-strapi"
// Removed: UnderstandingReactHydrationContent, BuildingHydrationSafeSidebarContent
// These used broken shared molecule props. Content renders via markdown fallback path.
import { ErrorBoundariesAndLoadingStatesContent } from "@/features/dashboard/content-library/tutorials/error-boundaries-and-loading-states"

// Map slugs to rich content components
const richContentMap: Record<string, ComponentType> = {
  "deploying-nextjs-to-vercel": DeployingNextjsVercelContent,
  "building-multi-step-forms-with-server-actions": MultiStepFormsServerActionsContent,
  "building-email-templates-react-email": EmailTemplatesReactEmailContent,
  "e2e-testing-playwright-nextjs": E2ETestingPlaywrightContent,
  "building-atomic-component": BuildingAtomicComponentContent,
  "server-side-validation": ServerSideValidationContent,
  "zustand-form-store": ZustandFormStoreContent,
  "rate-limiting-implementation": RateLimitingImplementationContent,
  "your-first-nextjs-app": YourFirstNextjsAppContent,
  "your-first-strapi-collection": YourFirstStrapiCollectionContent,
  "unit-testing-vitest": UnitTestingVitestContent,
  "connecting-nextjs-to-strapi": ConnectingNextjsToStrapiContent,
  "error-boundaries-and-loading-states": ErrorBoundariesAndLoadingStatesContent,
}

export async function generateStaticParams() {
  const slugs = getAllTutorialSlugs()
  const tutorials = slugs.map(slug => getTutorialBySlug(slug)).filter(Boolean)
  return tutorials.map((tutorial) => ({
    category: tutorial!.category,
    slug: tutorial!.slug
  }))
}

function getLevelColor(level: Tutorial["level"]) {
  switch (level) {
    case "beginner":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "intermediate":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "advanced":
      return "bg-red-500/10 text-red-500 border-red-500/20"
  }
}

function getCategoryColor(category: Tutorial["category"]) {
  switch (category) {
    case "components":
      return "bg-blue-500/10 text-blue-500"
    case "forms":
      return "bg-purple-500/10 text-purple-500"
    case "security":
      return "bg-red-500/10 text-red-500"
    case "state-management":
      return "bg-green-500/10 text-green-500"
    case "performance":
      return "bg-accent/10 text-accent"
    case "getting-started":
      return "bg-teal-500/10 text-teal-500"
    case "cms":
      return "bg-emerald-500/10 text-emerald-500"
    case "testing":
      return "bg-orange-500/10 text-orange-500"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export default async function TutorialPage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { slug } = await params
  const tutorial = getTutorialBySlug(slug)

  if (!tutorial) {
    notFound()
  }

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
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getLevelColor(tutorial.level)}`}>
            {tutorial.level.charAt(0).toUpperCase() + tutorial.level.slice(1)}
          </span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(tutorial.category)}`}>
            {tutorial.category.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
          </span>
        </div>

        <h1 className="text-4xl font-bold text-foreground">{tutorial.title}</h1>
        <p className="text-xl text-muted-foreground">{tutorial.description}</p>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {tutorial.duration}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(tutorial.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tutorial.tags.map((tag) => (
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

      {/* Prerequisites & Learning Outcomes */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-accent" />
            Prerequisites
          </h3>
          <ul className="space-y-2">
            {tutorial.prerequisites.map((prereq, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-muted-foreground">-</span>
                {prereq}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            What You'll Learn
          </h3>
          <ul className="space-y-2">
            {tutorial.learningOutcomes.map((outcome, idx) => (
              <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-green-500">+</span>
                {outcome}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Rich Content or Flat Tutorial Steps */}
      {(() => {
        const RichContent = richContentMap[slug]
        if (RichContent) {
          return (
            <div className="border-t border-border pt-8">
              <RichContent />
            </div>
          )
        }
        return (
          <div className="space-y-8 border-t border-border pt-8">
            <h2 className="text-2xl font-bold text-foreground">Tutorial Steps</h2>

            {tutorial.steps.map((step, idx) => (
              <section key={idx} className="space-y-4 border-l-4 border-accent pl-6">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold">
                    {idx + 1}
                  </span>
                  <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                </div>

                <p className="text-muted-foreground">{step.content}</p>

                {step.code && (
                  <CodeBlock language="typescript" title="Challenge" code={step.code} />
                )}

                {step.hint && (
                  <Spoiler title="Hint">
                    <p className="text-sm text-muted-foreground">{step.hint}</p>
                  </Spoiler>
                )}

                {step.solution && (
                  <Spoiler title="Show Solution">
                    <CodeBlock language="typescript" code={step.solution} />
                  </Spoiler>
                )}

                {step.explanation && (
                  <Spoiler title="Explanation">
                    <p className="text-sm text-muted-foreground">{step.explanation}</p>
                  </Spoiler>
                )}
              </section>
            ))}
          </div>
        )
      })()}

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
  )
}
