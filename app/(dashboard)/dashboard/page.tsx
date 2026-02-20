import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { ArrowRight, Zap, Shield, Database, BookOpen, Layers, Code, Rocket, GraduationCap, TrendingUp, LayoutGrid, Globe, Mail, TestTube, FileCheck, AlertCircle, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { STATS } from "@/data/doc-manifest"

export default function GettingStartedPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-green-500/20 text-green-500 border-0">Beginners Start Here</Badge>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Getting Started</h1>
        <p className="text-xl text-muted-foreground text-pretty">
          Welcome to the Electrical Services project documentation. This is a production-ready Next.js 15
          application featuring atomic design, guard architecture, {STATS.security.layers}-layer security, a {STATS.content.totalItems}+ item
          content library, and a comprehensive Strapi CMS backend -- all documented from overview to deployment.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Badge variant="outline">Next.js 15</Badge>
          <Badge variant="outline">TypeScript</Badge>
          <Badge variant="outline">Tailwind CSS v4</Badge>
          <Badge variant="outline">Strapi CMS</Badge>
          <Badge variant="outline">Atomic Design</Badge>
          <Badge variant="outline">Guard Architecture</Badge>
        </div>
      </div>

      <Callout type="success" title="Production-Ready Architecture">
        This project demonstrates enterprise-grade patterns: atomic design component system ({STATS.frontend.components.total} custom components),
        hydration guard architecture (preventing Radix UI mismatches), defense-in-depth security ({STATS.security.layers} layers),
        and a complete CMS backend with {STATS.backend.collectionTypes.total} collection types and {STATS.backend.sharedComponents.total} shared components.
      </Callout>

      {/* Choose Your Starting Point */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Choose Your Starting Point</h2>
        <p className="text-muted-foreground">Select documentation based on your role and what you need to accomplish.</p>

        <div className="grid gap-4 md:grid-cols-3">
          <Link           href="/dashboard/documentation/app-reference/overview" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                    <Code className="h-5 w-5 text-blue-500" />
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-400 border-0">Frontend</Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-accent transition-colors">App Overview</CardTitle>
                <CardDescription className="text-pretty">
                  Component system, hydration guards, security architecture, server actions, and performance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="text-accent">{">"}</span> {STATS.frontend.components.total} custom components</li>
                  <li className="flex items-center gap-2"><span className="text-accent">{">"}</span> Guard architecture</li>
                  <li className="flex items-center gap-2"><span className="text-accent">{">"}</span> {STATS.security.layers} security layers</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link           href="/dashboard/documentation/cms-reference/overview" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Database className="h-5 w-5 text-amber-500" />
                  </div>
                  <Badge className="bg-amber-500/20 text-amber-400 border-0">Backend</Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-accent transition-colors">CMS Overview</CardTitle>
                <CardDescription className="text-pretty">
                  Strategic overview of the Strapi headless CMS: schemas, collection types, and architecture.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
<li className="flex items-center gap-2"><span className="text-accent">{">"}</span> {STATS.backend.collectionTypes.total} collection types</li>
                        <li className="flex items-center gap-2"><span className="text-accent">{">"}</span> {STATS.backend.sharedComponents.total} shared components</li>
                  <li className="flex items-center gap-2"><span className="text-accent">{">"}</span> Copy-paste schemas</li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/content-library" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                    <BookOpen className="h-5 w-5 text-green-500" />
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-0">Learning</Badge>
                </div>
                <CardTitle className="text-lg group-hover:text-accent transition-colors">Learning Hub</CardTitle>
                <CardDescription className="text-pretty">
                  Articles, tutorials, and case studies covering architecture, security, testing, and best practices.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2"><span className="text-accent">{">"}</span> {STATS.content.articles} technical articles</li>
                  <li className="flex items-center gap-2"><span className="text-accent">{">"}</span> {STATS.content.caseStudies} case studies</li>
                  <li className="flex items-center gap-2"><span className="text-accent">{">"}</span> {STATS.content.tutorials} step-by-step tutorials</li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Tech Stack</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Code className="h-5 w-5" />
              <h3 className="font-semibold text-foreground">Frontend</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-accent font-medium">Framework</p>
                <p className="text-muted-foreground">Next.js 15, React 19, TypeScript 5</p>
              </div>
              <div>
                <p className="text-accent font-medium">UI & Styling</p>
                <p className="text-muted-foreground">Tailwind CSS v4, shadcn/ui, Framer Motion</p>
              </div>
              <div>
                <p className="text-accent font-medium">State & Validation</p>
                <p className="text-muted-foreground">Zustand, Zod, React Hook Form</p>
              </div>
              <div>
                <p className="text-accent font-medium">Architecture</p>
                <p className="text-muted-foreground">Atomic Design, Hydration Guard Pattern</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 space-y-3">
            <div className="flex items-center gap-2 text-accent">
              <Database className="h-5 w-5" />
              <h3 className="font-semibold text-foreground">Backend & Infrastructure</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-accent font-medium">CMS</p>
                <p className="text-muted-foreground">Strapi 5 (headless), REST & GraphQL APIs</p>
              </div>
              <div>
                <p className="text-accent font-medium">Database</p>
                <p className="text-muted-foreground">PostgreSQL (production), SQLite (dev)</p>
              </div>
              <div>
                <p className="text-accent font-medium">Email</p>
                <p className="text-muted-foreground">React Email, Nodemailer SMTP</p>
              </div>
              <div>
                <p className="text-accent font-medium">Deployment</p>
                <p className="text-muted-foreground">Vercel (frontend), Docker/Railway (Strapi)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Structure */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Project Structure</h2>

        <CodeBlock
          language="plaintext"
          title="Directory Structure"
          code={`app/
├── dashboard/                    # Documentation dashboard
│   ├── documentation/           # All documentation sections
│   │   ├── strategic-overview/  # App overview, why Strapi, code review
│   │   ├── app-reference/       # Components, hydration, security, email
│   │   ├── cms-reference/       # Collections, schemas, relationships
│   │   └── infrastructure-and-ops/ # Testing, deployment, troubleshooting
│   ├── content-library/         # Learning Hub (${STATS.content.totalItems}+ items)
│   └── admin/                   # Admin tools (email templates, doc system)

features/
├── contact/                     # Contact form feature
├── quotation/                   # Quotation form feature
└── service-request/             # Service request form feature

components/
├── atoms/                       # Basic building blocks
├── molecules/                   # Composite components
├── organisms/                   # Complex sections
│   └── shared-steps/           # Shared form steps
└── animations/                  # Framer Motion components

lib/
├── actions/                     # Shared server actions
├── security/                    # CSRF, rate limiting, env validation
├── sanitize/                    # Input sanitization utilities
└── email/                       # Shared email infrastructure`}
        />

        <Callout type="info" title="Atomic Design Pattern">
          The project follows <strong>Atomic Design</strong> methodology throughout. Components are organized
          from smallest (atoms) to largest (organisms), creating a predictable component hierarchy that maps
          1:1 to the Strapi CMS backend schema design.
        </Callout>
      </section>

      {/* Quick Start */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Quick Start</h2>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-sm">
              1
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-foreground">Install Dependencies</h3>
              <CodeBlock language="bash" code="npm install" />
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-sm">
              2
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-foreground">Run Development Server</h3>
              <CodeBlock language="bash" code="npm run dev" />
              <p className="text-sm text-muted-foreground">
                Open <code className="bg-muted px-1.5 py-0.5 rounded text-xs">http://localhost:3000</code> to see the application.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-sm">
              3
            </div>
            <div className="flex-1 space-y-2">
              <h3 className="font-semibold text-foreground">Explore the Documentation</h3>
              <p className="text-sm text-muted-foreground">
                Use the sidebar to navigate through Strategic Overview, CMS Reference, App Reference,
                Infrastructure & Ops, and the Learning Hub. Each section is organised by role.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Suggested Journeys */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Suggested Journeys</h2>

        <div className="space-y-4">
          {/* Beginner */}
          <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-5 w-5 text-green-500" />
              <h3 className="font-semibold text-foreground">Beginner Path</h3>
              <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">New to Project</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {[
                { label: "Getting Started", href: "/dashboard" },
                { label: "Server vs Client", href: "/dashboard/documentation/app-reference/server-vs-client" },
                { label: "Component System", href: "/dashboard/documentation/app-reference/component-system" },
                { label: "Testing", href: "/dashboard/documentation/infrastructure-and-ops/testing-strategy" },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-1">
                  <Link
                    href={step.href}
                    className="text-xs px-2.5 py-1.5 rounded-md bg-background border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
                  >
                    {step.label}
                  </Link>
                  {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* Senior */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Code className="h-5 w-5 text-amber-500" />
              <h3 className="font-semibold text-foreground">Senior Engineer Path</h3>
              <Badge className="bg-amber-500/20 text-amber-400 border-0 text-xs">Advanced</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {[
                { label: "Component System", href: "/dashboard/documentation/app-reference/component-system" },
                { label: "Hydration & Guards", href: "/dashboard/documentation/app-reference/hydration-and-guards" },
                { label: "Security Architecture", href: "/dashboard/documentation/app-reference/security-architecture" },
                { label: "Code Review Log", href: "/dashboard/documentation/strategic-overview/code-review-log" },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-1">
                  <Link
                    href={step.href}
                    className="text-xs px-2.5 py-1.5 rounded-md bg-background border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
                  >
                    {step.label}
                  </Link>
                  {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />}
                </div>
              ))}
            </div>
          </div>

          {/* CTO */}
          <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <h3 className="font-semibold text-foreground">CTO / Decision Maker Path</h3>
              <Badge className="bg-purple-500/20 text-purple-400 border-0 text-xs">Strategic</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {[
                { label: "App Overview", href: "/dashboard/documentation/strategic-overview/app-overview" },
                { label: "Security Architecture", href: "/dashboard/documentation/app-reference/security-architecture" },
                { label: "Why Strapi (CTO)", href: "/dashboard/documentation/strategic-overview/why-strapi" },
                { label: "Code Review Log", href: "/dashboard/documentation/strategic-overview/code-review-log" },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex items-center gap-1">
                  <Link
                    href={step.href}
                    className="text-xs px-2.5 py-1.5 rounded-md bg-background border border-border text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors"
                  >
                    {step.label}
                  </Link>
                  {i < arr.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground/40 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Full Documentation Map */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-foreground border-b border-border pb-2">Full Documentation Map</h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "App Overview", href: "/dashboard/documentation/strategic-overview/app-overview", icon: LayoutGrid, desc: "Architecture stats, role journeys, system diagram", badge: "Strategic" },
            { title: "CMS Overview", href: "/dashboard/documentation/cms-reference/overview", icon: Database, desc: `Strapi CMS stats, ${STATS.backend.collectionTypes.total} collection types, ${STATS.backend.sharedComponents.total} shared components`, badge: "Strategic" },
            { title: "Component System", href: "/dashboard/documentation/app-reference/component-system", icon: Layers, desc: `${STATS.frontend.components.total} components across atoms, molecules, organisms, animations`, badge: "App Ref" },
            { title: "Hydration & Guards", href: "/dashboard/documentation/app-reference/hydration-and-guards", icon: Shield, desc: "Guard pattern preventing Radix UI hydration mismatches", badge: "App Ref" },
            { title: "Security Architecture", href: "/dashboard/documentation/app-reference/security-architecture", icon: ShieldCheck, desc: "7-layer defense-in-depth with OWASP threat modeling", badge: "App Ref" },
            { title: "Server Actions & API", href: "/dashboard/documentation/app-reference/server-actions-and-api", icon: Code, desc: "Type-safe server actions and Strapi API integration", badge: "App Ref" },
            { title: "Email System", href: "/dashboard/documentation/app-reference/email-system", icon: Mail, desc: "React Email templates and SMTP delivery configuration", badge: "App Ref" },
            { title: "Performance", href: "/dashboard/documentation/app-reference/performance-and-caching", icon: Zap, desc: "Core Web Vitals, caching, bundle analysis, lazy loading", badge: "App Ref" },
            { title: "Content Collections", href: "/dashboard/documentation/cms-reference/content-collections", icon: BookOpen, desc: "Article, Tutorial, Case Study Strapi schemas", badge: "CMS Ref" },
            { title: "Relationships", href: "/dashboard/documentation/cms-reference/relationships", icon: Globe, desc: "Entity relationships, data flow, frontend-backend mapping", badge: "CMS Ref" },
            { title: "Testing Strategy", href: "/dashboard/documentation/infrastructure-and-ops/testing-strategy", icon: TestTube, desc: "Testing pyramid, unit/integration/E2E, CI/CD pipeline", badge: "Infra & Ops" },
            { title: "Deployment", href: "/dashboard/documentation/infrastructure-and-ops/deployment", icon: Rocket, desc: "Vercel deployment, environment variables, production checklist", badge: "Infra & Ops" },
          ].map((item) => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="group">
                <div className="bg-card border border-border rounded-lg p-4 h-full transition-colors hover:border-accent/50">
                  <div className="flex items-start justify-between mb-2">
                    <Icon className="h-4 w-4 text-accent" />
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{item.badge}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <Callout type="warning" title="Need Help?">
        If you encounter any issues, check the{" "}
        <Link href="/dashboard/documentation/infrastructure-and-ops/troubleshooting" className="font-semibold underline">
          Troubleshooting Guide
        </Link>{" "}
        for common solutions. For code quality standards, see the{" "}
        <Link href="/dashboard/documentation/strategic-overview/code-review-log" className="font-semibold underline">
          Code Review Guide
        </Link>.
      </Callout>
    </div>
  )
}
