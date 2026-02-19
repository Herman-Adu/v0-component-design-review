import { FileText, GraduationCap, TrendingUp, BookOpen, Users, Briefcase, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"
import { articles } from "@/data/content-library/articles"
import { tutorials } from "@/data/content-library/tutorials"
import { caseStudies } from "@/data/content-library/case-studies"

export default function ContentOverviewPage() {
  // Get counts dynamically
  const articleCount = articles.length
  const tutorialCount = tutorials.length
  const caseStudyCount = caseStudies.length
  const totalContent = articleCount + tutorialCount + caseStudyCount

  // Get counts by audience level
  const beginnerContent = articles.filter(a => a.level === "beginner").length + 
    tutorials.filter(t => t.level === "beginner").length
  const intermediateContent = articles.filter(a => a.level === "intermediate").length +
    tutorials.filter(t => t.level === "intermediate").length
  const advancedContent = articles.filter(a => a.level === "advanced").length +
    tutorials.filter(t => t.level === "advanced").length

  // Get unique categories
  const articleCategories = new Set(articles.map(a => a.category)).size
  const tutorialCategories = new Set(tutorials.map(t => t.category)).size

  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">Learning Hub</h1>
        <p className="text-lg text-muted-foreground text-balance">
          A comprehensive collection of articles, tutorials, and case studies designed for all skill levels - 
          from developers just starting out to CTOs making technology decisions.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{totalContent}</p>
          <p className="text-xs text-muted-foreground">Total Resources</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-foreground">3</p>
          <p className="text-xs text-muted-foreground">Skill Levels</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{articleCategories + tutorialCategories}</p>
          <p className="text-xs text-muted-foreground">Topic Areas</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-3xl font-bold text-foreground">{caseStudyCount}</p>
          <p className="text-xs text-muted-foreground">Real-World Cases</p>
        </div>
      </div>

      {/* Content Type Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Link
          href="/dashboard/content-library/articles"
          className="group rounded-lg border border-border bg-card p-6 hover:border-accent/50 hover:bg-accent/5 transition-all"
        >
          <FileText className="h-8 w-8 text-accent mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
            Articles & Insights
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            In-depth technical articles covering architecture, security, testing, DevOps, and business strategy.
          </p>
          <span className="flex items-center gap-1 text-sm text-accent font-medium">
            {articleCount} Articles <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          href="/dashboard/content-library/tutorials"
          className="group rounded-lg border border-border bg-card p-6 hover:border-accent/50 hover:bg-accent/5 transition-all"
        >
          <GraduationCap className="h-8 w-8 text-accent mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
            Tutorials
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Step-by-step guides with hands-on exercises covering Next.js, Strapi, testing, and integrations.
          </p>
          <span className="flex items-center gap-1 text-sm text-accent font-medium">
            {tutorialCount} Tutorials <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>

        <Link
          href="/dashboard/content-library/case-studies"
          className="group rounded-lg border border-border bg-card p-6 hover:border-accent/50 hover:bg-accent/5 transition-all"
        >
          <TrendingUp className="h-8 w-8 text-accent mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
            Case Studies
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Real-world examples with before/after comparisons, metrics, and actionable takeaways.
          </p>
          <span className="flex items-center gap-1 text-sm text-accent font-medium">
            {caseStudyCount} Case Studies <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </Link>
      </div>

      {/* Recommended Starting Points */}
      <div className="rounded-lg border border-border bg-card p-8 mb-8">
        <div className="flex items-start gap-4">
          <Sparkles className="h-6 w-6 text-accent shrink-0 mt-1" />
          <div className="w-full">
            <h3 className="text-xl font-semibold text-foreground mb-3">Recommended Starting Points</h3>
            <p className="text-muted-foreground mb-4">
              New here? These resources are the best place to begin, regardless of your experience level.
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/dashboard/content-library/articles/architecture/atomic-design-principles"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group"
              >
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-500">Beginner</span>
                <span className="text-sm text-foreground group-hover:text-accent transition-colors">Atomic Design Principles</span>
                <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground group-hover:text-accent shrink-0" />
              </Link>
              <Link
                href="/dashboard/content-library/tutorials/your-first-nextjs-app"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group"
              >
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-500">Beginner</span>
                <span className="text-sm text-foreground group-hover:text-accent transition-colors">Your First Next.js App</span>
                <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground group-hover:text-accent shrink-0" />
              </Link>
              <Link
                href="/dashboard/content-library/tutorials/getting-started/understanding-react-hydration"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group"
              >
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-500">Beginner</span>
                <span className="text-sm text-foreground group-hover:text-accent transition-colors">Understanding React Hydration</span>
                <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground group-hover:text-accent shrink-0" />
              </Link>
              <Link
                href="/dashboard/content-library/case-studies/client-to-server-components"
                className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-accent/50 hover:bg-accent/5 transition-all group"
              >
                <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-500/10 text-blue-500">Case Study</span>
                <span className="text-sm text-foreground group-hover:text-accent transition-colors">Client to Server Components</span>
                <ArrowRight className="h-3 w-3 ml-auto text-muted-foreground group-hover:text-accent shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Audience Level Section */}
      <div className="rounded-lg border border-border bg-card p-8 mb-8">
        <div className="flex items-start gap-4">
          <Users className="h-6 w-6 text-accent shrink-0 mt-1" />
          <div className="w-full">
            <h3 className="text-xl font-semibold text-foreground mb-3">Content by Skill Level</h3>
            <p className="text-muted-foreground mb-6">
              Our content is organized by skill level to help you find the right starting point.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <span className="font-semibold text-foreground">Beginner</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Getting started guides, first app tutorials</p>
                <span className="text-sm font-medium text-green-600">{beginnerContent} items</span>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-amber-600" />
                  <span className="font-semibold text-foreground">Intermediate</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Architecture patterns, advanced techniques</p>
                <span className="text-sm font-medium text-amber-600">{intermediateContent} items</span>
              </div>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="h-4 w-4 text-red-600" />
                  <span className="font-semibold text-foreground">Advanced</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Performance, security, enterprise patterns</p>
                <span className="text-sm font-medium text-red-600">{advancedContent} items</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Journeys */}
      <div className="rounded-lg border border-border bg-card p-8 mb-8">
        <div className="flex items-start gap-4">
          <Sparkles className="h-6 w-6 text-accent shrink-0 mt-1" />
          <div className="w-full">
            <h3 className="text-xl font-semibold text-foreground mb-2">Learning Journeys</h3>
            <p className="text-muted-foreground mb-6">
              Structured paths that take you from understanding a concept to applying it in production.
              Each journey combines tutorials, articles, and case studies so you build knowledge progressively.
            </p>

            {/* Hydration & SSR Journey */}
            <div className="rounded-lg border border-border p-6 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold">1</span>
                <div>
                  <h4 className="font-semibold text-foreground">React Hydration & SSR Mastery</h4>
                  <p className="text-xs text-muted-foreground">5 resources across all skill levels</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                From understanding what the Virtual DOM is, through debugging real hydration errors, to implementing
                production-grade guard patterns that prevent an entire category of SSR bugs.
              </p>
              <div className="grid gap-2">
                <Link
                  href="/dashboard/content-library/tutorials/getting-started/understanding-react-hydration"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500 text-xs font-bold shrink-0">1</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-500 shrink-0">Beginner</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Understanding React Hydration</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Tutorial</span>
                </Link>
                <Link
                  href="/dashboard/content-library/tutorials/components/building-hydration-safe-sidebar"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold shrink-0">2</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-yellow-500/10 text-yellow-500 shrink-0">Intermediate</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Building a Hydration-Safe Sidebar</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Tutorial</span>
                </Link>
                <Link
                  href="/dashboard/content-library/articles/architecture/why-react-hydration-breaks"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold shrink-0">3</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-yellow-500/10 text-yellow-500 shrink-0">Intermediate</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Why React Hydration Breaks: IDs, State & the Rendering Pipeline</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Article</span>
                </Link>
                <Link
                  href="/dashboard/content-library/articles/architecture/guard-pattern-architecture"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-500 text-xs font-bold shrink-0">4</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-500/10 text-red-500 shrink-0">Advanced</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Guard Pattern Architecture</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Article</span>
                </Link>
                <Link
                  href="/dashboard/content-library/case-studies/hydration-guard-pattern"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold shrink-0">5</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-500/10 text-blue-500 shrink-0">All Levels</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Case Study: From Band-Aid to Bulletproof</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Case Study</span>
                </Link>
              </div>
            </div>

            {/* Architecture & Patterns Journey */}
            <div className="rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent text-sm font-bold">2</span>
                <div>
                  <h4 className="font-semibold text-foreground">Architecture & Design Patterns</h4>
                  <p className="text-xs text-muted-foreground">6 resources from fundamentals to leadership</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Learn how architectural decisions compound over time - from atomic design fundamentals through
                refactoring strategies to enterprise CMS architecture and cost analysis.
              </p>
              <div className="grid gap-2">
                <Link
                  href="/dashboard/content-library/articles/architecture/atomic-design-principles"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500 text-xs font-bold shrink-0">1</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-500 shrink-0">Beginner</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Atomic Design Principles</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Article</span>
                </Link>
                <Link
                  href="/dashboard/content-library/articles/architecture/planning-full-stack-application"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 text-green-500 text-xs font-bold shrink-0">2</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-green-500/10 text-green-500 shrink-0">Beginner</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Planning a Full Stack Application</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Article</span>
                </Link>
                <Link
                  href="/dashboard/content-library/articles/architecture/refactoring-for-maintainability"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold shrink-0">3</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-yellow-500/10 text-yellow-500 shrink-0">Intermediate</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Refactoring for Maintainability</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Article</span>
                </Link>
                <Link
                  href="/dashboard/content-library/case-studies/enterprise-cms-migration"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold shrink-0">4</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-500/10 text-blue-500 shrink-0">All Levels</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Case Study: Enterprise CMS Migration</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Case Study</span>
                </Link>
                <Link
                  href="/dashboard/content-library/articles/business/tech-stack-decision-framework"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 text-red-500 text-xs font-bold shrink-0">5</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-red-500/10 text-red-500 shrink-0">Advanced</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Technology Stack Decision Framework</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Article</span>
                </Link>
                <Link
                  href="/dashboard/content-library/case-studies/cost-reduction-architecture"
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent/5 transition-all group"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-blue-500 text-xs font-bold shrink-0">6</span>
                  <span className="px-2 py-0.5 text-xs font-medium rounded bg-blue-500/10 text-blue-500 shrink-0">All Levels</span>
                  <span className="text-sm text-foreground group-hover:text-accent transition-colors">Case Study: Architecture-Driven Cost Reduction</span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">Case Study</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Business/CTO Section */}
      <div className="rounded-lg border border-border bg-card p-8">
        <div className="flex items-start gap-4">
          <Briefcase className="h-6 w-6 text-accent shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-3">For Decision Makers</h3>
            <p className="text-muted-foreground mb-4">
              Technical leaders and business stakeholders can find ROI analysis, cost comparisons, and strategic 
              guidance in our business-focused content.
            </p>
            <div className="grid gap-3 text-sm">
              <Link href="/dashboard/documentation/strategic-overview/why-strapi" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors group">
                <ArrowRight className="h-3 w-3 text-accent shrink-0" />
                <span>Why Strapi - ROI and Cost Analysis</span>
              </Link>
              <Link href="/dashboard/content-library/articles/business/roi-modern-web-architecture" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors group">
                <ArrowRight className="h-3 w-3 text-accent shrink-0" />
                <span>ROI of Modern Web Architecture</span>
              </Link>
              <Link href="/dashboard/content-library/articles/business/tech-stack-decision-framework" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors group">
                <ArrowRight className="h-3 w-3 text-accent shrink-0" />
                <span>Technology Stack Decision Framework</span>
              </Link>
              <Link href="/dashboard/content-library/articles/architecture/guard-pattern-architecture" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors group">
                <ArrowRight className="h-3 w-3 text-accent shrink-0" />
                <span>Guard Pattern Architecture - Cost/Benefit Analysis</span>
              </Link>
              <Link href="/dashboard/content-library/case-studies/cost-reduction-architecture" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors group">
                <ArrowRight className="h-3 w-3 text-accent shrink-0" />
                <span>Case Study: Architecture-Driven Cost Reduction</span>
              </Link>
              <Link href="/dashboard/content-library/case-studies/hydration-guard-pattern" className="flex items-center gap-2 text-foreground hover:text-accent transition-colors group">
                <ArrowRight className="h-3 w-3 text-accent shrink-0" />
                <span>Case Study: From Band-Aid to Bulletproof</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
