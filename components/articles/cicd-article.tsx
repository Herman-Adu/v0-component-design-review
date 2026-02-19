"use client"

import {
  SectionHeader,
  InfoBox,
  FeatureGrid,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  ProcessFlow,
  ArchitectureDiagram,
  ArticleIcons,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "pipeline-overview", title: "Pipeline Overview", level: 2 },
  { id: "github-actions", title: "GitHub Actions Workflow", level: 2 },
  { id: "branch-strategy", title: "Branch Strategy", level: 2 },
  { id: "environment-management", title: "Environment Management", level: 2 },
  { id: "rollback-strategy", title: "Rollback Strategy", level: 2 },
  { id: "monitoring", title: "Deployment Monitoring", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function CICDArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="important">
          Automated deployment pipelines eliminate human error, accelerate delivery, and provide 
          confidence in every release. A well-designed CI/CD pipeline is the foundation of 
          sustainable software delivery.
        </InfoBox>

        <SectionHeader number="01" title="Pipeline Overview" id="pipeline-overview" />

        <p className="text-muted-foreground mb-6">
          Our pipeline runs automatically on every push, enforcing quality gates before any code 
          reaches production. Each stage must pass before the next begins.
        </p>

        <ProcessFlow
          title="CI/CD Pipeline Stages"
          steps={[
            { label: "Push", sublabel: "Triggers pipeline" },
            { label: "Lint", sublabel: "Code style check" },
            { label: "Type Check", sublabel: "TypeScript safety" },
            { label: "Unit Tests", sublabel: "Business logic" },
            { label: "Build", sublabel: "Artifact generation" },
            { label: "E2E Tests", sublabel: "Preview deployment" },
            { label: "Deploy", sublabel: "Production only", color: "green" },
          ]}
        />

        <MetricsGrid
          metrics={[
            { label: "Pipeline Duration", value: "< 10 min", change: "Full CI/CD cycle", positive: true },
            { label: "Deploy Frequency", value: "Daily", change: "Multiple deploys/day", positive: true },
            { label: "Lead Time", value: "< 1 hour", change: "Commit to production", positive: true },
            { label: "Rollback Time", value: "< 2 min", change: "Instant via Vercel", positive: true },
          ]}
        />

        <SectionHeader number="02" title="GitHub Actions Workflow" id="github-actions" />

        <p className="text-muted-foreground mb-4">
          Our workflow is defined in YAML and runs on GitHub-hosted runners. Jobs are parallelized 
          where possible to minimize total pipeline duration.
        </p>

        <CodeBlock
          filename=".github/workflows/ci.yml"
          code={`name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
          
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      
      - run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Type Check
        run: pnpm type-check
      
      - name: Unit Tests
        run: pnpm test:unit --coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3
        with:
          token: \${{ secrets.CODECOV_TOKEN }}

  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "pnpm"
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next

  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: .next
      
      - name: Install Playwright
        run: pnpm exec playwright install --with-deps
      
      - name: Run E2E Tests
        run: pnpm test:e2e
      
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report

  deploy:
    needs: e2e
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"`}
        />

        <InfoBox type="tip" title="Caching for Speed">
          The pnpm cache and build artifact sharing between jobs significantly reduces pipeline 
          duration. Without caching, dependency installation alone can take 2-3 minutes per job.
        </InfoBox>

        <SectionHeader number="03" title="Branch Strategy" id="branch-strategy" />

        <p className="text-muted-foreground mb-4">
          Our branching model balances simplicity with the need for staging environments and 
          emergency fixes.
        </p>

        <ArchitectureDiagram
          title="Branch Deployment Mapping"
          layers={[
            { name: "main", items: ["Production deployments", "Protected branch", "Requires PR approval"], color: "#22c55e" },
            { name: "develop", items: ["Staging environment", "Integration testing", "Pre-release validation"], color: "#f59e0b" },
            { name: "feature/*", items: ["Preview deployments", "Per-PR environments", "Isolated testing"], color: "#3b82f6" },
            { name: "hotfix/*", items: ["Emergency fixes", "Fast-track to production", "Post-merge to develop"], color: "#ef4444" },
          ]}
        />

        <StatsTable
          title="Branch Protection Rules"
          headers={["Branch", "Protections", "Deploy Target"]}
          rows={[
            ["main", "Required reviews, status checks, no force push", "Production"],
            ["develop", "Required status checks, no force push", "Staging"],
            ["feature/*", "None (developer branches)", "Preview (automatic)"],
            ["hotfix/*", "Same as feature, expedited review", "Production (after merge)"],
          ]}
        />

        <SectionHeader number="04" title="Environment Management" id="environment-management" />

        <p className="text-muted-foreground mb-4">
          Environment variables are managed securely through Vercel with different values for 
          each deployment environment.
        </p>

        <CodeBlock
          filename="Environment Validation"
          code={`// lib/env.ts
import { z } from "zod"

const envSchema = z.object({
  // Required in all environments
  DATABASE_URL: z.string().url(),
  STRAPI_URL: z.string().url(),
  STRAPI_TOKEN: z.string().min(1),
  
  // Required in production only
  SENTRY_DSN: z.string().url().optional(),
  ANALYTICS_ID: z.string().optional(),
  
  // Environment indicator
  NODE_ENV: z.enum(["development", "test", "production"]),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
})

// Validate at startup - fail fast on missing config
export const env = envSchema.parse(process.env)

// Type-safe environment access
export type Env = z.infer<typeof envSchema>`}
        />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Development",
              description: "Local databases, verbose logging, hot reload enabled",
            },
            {
              icon: <ArticleIcons.Layers className="h-5 w-5" />,
              title: "Preview",
              description: "Staging databases, moderate logging, PR-specific URLs",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Production",
              description: "Production databases, error-only logging, CDN caching",
            },
            {
              icon: <ArticleIcons.Database className="h-5 w-5" />,
              title: "Database Isolation",
              description: "Each environment has separate database instance",
            },
          ]}
        />

        <SectionHeader number="05" title="Rollback Strategy" id="rollback-strategy" />

        <p className="text-muted-foreground mb-4">
          When issues occur in production, fast rollback is critical. Our strategy provides 
          multiple rollback options depending on the severity and type of issue.
        </p>

        <StatsTable
          title="Rollback Options"
          headers={["Method", "Time", "When to Use"]}
          rows={[
            ["Vercel Instant Rollback", "< 30 seconds", "Any deployment issue, immediate relief"],
            ["Git Revert", "5-10 minutes", "Code changes that need to be undone permanently"],
            ["Feature Flag Toggle", "< 1 minute", "Disable specific features without deployment"],
            ["Database Restore", "15-30 minutes", "Data corruption or schema issues"],
          ]}
        />

        <ProcessFlow
          title="Incident Response Flow"
          steps={[
            { label: "Detect", sublabel: "Alerts trigger investigation", color: "yellow" },
            { label: "Assess", sublabel: "Determine severity and scope" },
            { label: "Rollback", sublabel: "Restore service fast", color: "green" },
            { label: "Investigate", sublabel: "Root cause analysis" },
            { label: "Fix & Deploy", sublabel: "Normal CI/CD pipeline", color: "green" },
          ]}
        />

        <InfoBox type="warning" title="Database Migrations">
          Always write migrations with rollback scripts. Forward-only migrations that cannot 
          be reversed make rollbacks impossible when they involve schema changes.
        </InfoBox>

        <SectionHeader number="06" title="Deployment Monitoring" id="monitoring" />

        <p className="text-muted-foreground mb-4">
          Deployment is not complete until we have confirmed the release is healthy. 
          Automated monitoring catches issues that tests miss.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Health Endpoints",
              description: "API health checks verify all services are responding",
            },
            {
              icon: <ArticleIcons.TrendingUp className="h-5 w-5" />,
              title: "Error Rate Monitoring",
              description: "Spike detection in Sentry error rates post-deploy",
            },
            {
              icon: <ArticleIcons.Clock className="h-5 w-5" />,
              title: "Performance Metrics",
              description: "Core Web Vitals and API response time tracking",
            },
            {
              icon: <ArticleIcons.Users className="h-5 w-5" />,
              title: "Real User Monitoring",
              description: "Synthetic and real user experience tracking",
            },
          ]}
        />

        <CodeBlock
          filename="app/api/health/route.ts"
          code={`import { NextResponse } from "next/server"

export async function GET() {
  const checks = {
    api: "ok",
    database: await checkDatabase(),
    strapi: await checkStrapi(),
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) || "local",
  }

  const allHealthy = Object.values(checks)
    .filter((v) => typeof v === "string")
    .every((v) => v === "ok")

  return NextResponse.json(checks, { 
    status: allHealthy ? 200 : 503 
  })
}

async function checkDatabase(): Promise<string> {
  try {
    // Lightweight query to verify connection
    await db.execute("SELECT 1")
    return "ok"
  } catch {
    return "error"
  }
}

async function checkStrapi(): Promise<string> {
  try {
    const res = await fetch(\`\${process.env.STRAPI_URL}/api/health\`)
    return res.ok ? "ok" : "error"
  } catch {
    return "error"
  }
}`}
        />

        <SectionHeader number="07" title="Key Takeaway" id="key-takeaway" />
        <KeyTakeaway>
          Invest in CI/CD early - the time saved compounds with every deployment. Automated 
          pipelines eliminate human error, provide confidence in releases, and enable the 
          rapid iteration that modern software development requires.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            {
              href: "/dashboard/content-library/articles/testing-strategy-modern-applications",
              title: "Testing Strategy for Modern Applications",
              level: "intermediate",
            },
            {
              href: "/dashboard/content-library/articles/security-architecture-deep-dive",
              title: "Security Architecture Deep Dive",
              level: "advanced",
            },
          ]}
        />
      </div>

      <aside className="hidden lg:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
