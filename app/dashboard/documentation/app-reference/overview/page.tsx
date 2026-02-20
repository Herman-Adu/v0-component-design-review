import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderCog, LayoutGrid, Shield, Layers, Code, Mail, ShieldCheck, Zap, ArrowRight, Lightbulb } from "lucide-react"

export default function AppReferencePage() {
  const features = [
    {
      title: "Component System",
      description:
        "Atomic design inventory: every atom, molecule, and organism with usage counts, prop interfaces, and composition patterns. The structural blueprint of the UI.",
      icon: LayoutGrid,
      href: "/dashboard/documentation/app-reference/component-system",
      role: "Developer / Architect",
      roleColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      iconColor: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Hydration & Guards",
      description:
        "Hydration mismatch solutions, the global useHydration guard pattern, useSyncExternalStore for safe browser API access, and Suspense boundary rules.",
      icon: Shield,
      href: "/dashboard/documentation/app-reference/hydration-and-guards",
      role: "Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Server vs Client",
      description:
        "Decision matrix for when to use React Server Components vs Client Components. Data flow patterns, rendering strategies, and performance tradeoffs.",
      icon: Layers,
      href: "/dashboard/documentation/app-reference/server-vs-client",
      role: "Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-purple-500/10 text-purple-400",
    },
    {
      title: "Server Actions & API",
      description:
        "Server action architecture with Zod validation, error handling patterns, type-safe action results, and the shared action types system.",
      icon: Code,
      href: "/dashboard/documentation/app-reference/server-actions-and-api",
      role: "Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-amber-500/10 text-amber-400",
    },
    {
      title: "Email System",
      description:
        "React Email template architecture, Resend delivery integration, urgency-based styling, and the complete email notification pipeline.",
      icon: Mail,
      href: "/dashboard/documentation/app-reference/email-system",
      role: "Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-cyan-500/10 text-cyan-400",
    },
    {
      title: "Security Architecture",
      description:
        "7-layer defense-in-depth: CSRF protection, rate limiting, input sanitisation, security headers, honeypot bot detection, and environment variable security.",
      icon: ShieldCheck,
      href: "/dashboard/documentation/app-reference/security-architecture",
      role: "Developer / CTO",
      roleColor: "bg-red-500/15 text-red-400 border-red-500/30",
      iconColor: "bg-red-500/10 text-red-400",
    },
    {
      title: "Performance & Caching",
      description:
        "TanStack Query caching strategies, Next.js cache configuration, image optimisation, bundle analysis, and server-side rendering performance patterns.",
      icon: Zap,
      href: "/dashboard/documentation/app-reference/performance-and-caching",
      role: "Developer / DevOps",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-amber-500/10 text-amber-400",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <FolderCog className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">App Reference</h1>
            <p className="text-muted-foreground text-pretty">
              Next.js frontend architecture, patterns, integration guides, and security implementation.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">Developer</Badge>
          <Badge className="text-xs bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/20">Architect</Badge>
        </div>
      </div>

      {/* Quick stats */}
      <div className="responsive-grid-3">
        <Card className="border-blue-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Architecture Patterns</CardDescription>
            <CardTitle className="text-2xl">7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Component system, hydration, SSR, security, and more</p>
          </CardContent>
        </Card>
        <Card className="border-red-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Security Layers</CardDescription>
            <CardTitle className="text-2xl">7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Defense-in-depth from CSRF to env security</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Reference Pages</CardDescription>
            <CardTitle className="text-2xl">7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Complete frontend documentation</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature cards */}
      <div className="responsive-grid-2">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full transition-colors hover:border-primary/30 hover:bg-muted/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-md ${feature.iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <Badge className={`text-xs ${feature.roleColor}`}>{feature.role}</Badge>
                  </div>
                  <CardTitle className="text-base">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-pretty">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Architecture callout */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Architecture Principles</CardTitle>
          </div>
          <CardDescription className="text-pretty">
            The application follows a server-first pattern: Server Components by default, Client Components only
            when interactivity is required. All client boundaries use the global hydration guard pattern. Security
            is implemented as defense-in-depth with 7 independent layers.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Link href="/dashboard/documentation/app-reference/component-system">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <LayoutGrid className="h-4 w-4" />
              Component System
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <Link href="/dashboard/documentation/app-reference/security-architecture">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <ShieldCheck className="h-4 w-4" />
              Security Architecture
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
