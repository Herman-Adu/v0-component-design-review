import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Cog,
  Code,
  Settings,
  TestTube,
  Rocket,
  AlertCircle,
  ArrowRight,
  Server,
  Database,
  Shield,
} from "lucide-react"

export default function InfrastructureOpsPage() {
  const features = [
    {
      title: "API & GraphQL",
      description:
        "Strapi REST and GraphQL endpoint reference. Authentication headers, pagination, filtering, error response formats, and rate limit configuration.",
      icon: Code,
      href: "/dashboard/documentation/infrastructure-and-ops/api-and-graphql",
      role: "DevOps / Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-amber-500/10 text-amber-400",
    },
    {
      title: "CMS Operations",
      description:
        "Docker container deployment, PostgreSQL backup strategies, monitoring setup, performance tuning, and Strapi production configuration.",
      icon: Settings,
      href: "/dashboard/documentation/infrastructure-and-ops/cms-operations",
      role: "DevOps / WebAdmin",
      roleColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      iconColor: "bg-blue-500/10 text-blue-400",
    },
    {
      title: "Testing Strategy",
      description:
        "Testing pyramid implementation: unit tests for utilities, integration tests for server actions, and E2E tests for critical user flows. Coverage targets and CI integration.",
      icon: TestTube,
      href: "/dashboard/documentation/infrastructure-and-ops/testing-strategy",
      role: "QA / DevOps",
      roleColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      iconColor: "bg-purple-500/10 text-purple-400",
    },
    {
      title: "Deployment",
      description:
        "Production deployment guide: Vercel for the Next.js frontend, Railway for Strapi CMS. Environment variable management, domain configuration, and CI/CD pipeline setup.",
      icon: Rocket,
      href: "/dashboard/documentation/infrastructure-and-ops/deployment",
      role: "DevOps / WebAdmin",
      roleColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
      iconColor: "bg-emerald-500/10 text-emerald-400",
    },
    {
      title: "Troubleshooting",
      description:
        "Common issues and fixes for form submissions, hydration errors, API connectivity, email delivery failures, and build problems. Searchable solutions database.",
      icon: AlertCircle,
      href: "/dashboard/documentation/infrastructure-and-ops/troubleshooting",
      role: "DevOps / Developer",
      roleColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      iconColor: "bg-red-500/10 text-red-400",
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Cog className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">Infrastructure & Ops</h1>
            <p className="text-muted-foreground text-pretty">
              Deployment, monitoring, testing, and troubleshooting for DevOps and WebAdmin teams.
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge className="text-xs bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20">DevOps</Badge>
          <Badge className="text-xs bg-blue-500/15 text-blue-400 border-blue-500/30 hover:bg-blue-500/20">WebAdmin</Badge>
          <Badge className="text-xs bg-gray-500/15 text-gray-400 border-gray-500/30 hover:bg-gray-500/20">QA</Badge>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-emerald-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Operational Areas</CardDescription>
            <CardTitle className="text-2xl">5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">API, CMS ops, testing, deployment, troubleshooting</p>
          </CardContent>
        </Card>
        <Card className="border-blue-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Deployment Targets</CardDescription>
            <CardTitle className="text-2xl">2</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Vercel (frontend) + Railway (CMS)</p>
          </CardContent>
        </Card>
        <Card className="border-purple-500/20">
          <CardHeader className="pb-2">
            <CardDescription>Test Levels</CardDescription>
            <CardTitle className="text-2xl">3</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Unit, integration, and E2E coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Operations callout */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">Production Stack</CardTitle>
          </div>
          <CardDescription className="text-pretty">
            The production environment runs Next.js on Vercel (edge network, serverless functions) and
            Strapi CMS on Railway (Docker containers, managed PostgreSQL). Both platforms support
            preview deployments, environment variable management, and CI/CD via GitHub Actions.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
            <Link href="/dashboard/documentation/infrastructure-and-ops/deployment">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Rocket className="h-4 w-4" />
              Deployment Guide
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
          <Link href="/dashboard/documentation/infrastructure-and-ops/cms-operations">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Database className="h-4 w-4" />
              CMS Operations
              <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
