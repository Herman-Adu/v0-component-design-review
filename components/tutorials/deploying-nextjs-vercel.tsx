"use client"

import {
  TableOfContents,
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
  VerticalFlow,
  FeatureGrid,
  MetricsGrid,
  DataFlowDiagram,
  DecisionTree,
  KeyTakeaway,
  RelatedArticles,
  StatsTable,
  NumberedList,
  FileTree,
  ProcessFlow,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { Zap, Shield, Eye, Settings, GitBranch, CheckCircle2, Globe, Lock } from "lucide-react"

const tocItems = [
  { id: "overview", title: "Overview", level: 1 },
  { id: "prerequisites", title: "Prerequisites", level: 2 },
  { id: "project-setup", title: "Project Setup", level: 1 },
  { id: "environment-variables", title: "Environment Variables", level: 1 },
  { id: "env-local", title: "Local Development (.env.local)", level: 2 },
  { id: "env-vercel", title: "Vercel Dashboard Configuration", level: 2 },
  { id: "env-scoping", title: "Environment Scoping", level: 2 },
  { id: "deployment-flow", title: "Deployment Flow", level: 1 },
  { id: "preview-deployments", title: "Preview Deployments", level: 2 },
  { id: "production-deployment", title: "Production Deployment", level: 2 },
  { id: "deployment-checks", title: "Deployment Checks", level: 1 },
  { id: "custom-domains", title: "Custom Domains", level: 1 },
  { id: "troubleshooting", title: "Troubleshooting", level: 1 },
  { id: "takeaway", title: "Key Takeaway", level: 1 },
]

export function DeployingNextjsVercelContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">

        <SectionHeader id="overview" title="Overview" />
        <p className="text-muted-foreground leading-relaxed">
          Deploying a Next.js application to Vercel is the fastest path from development to production.
          This tutorial walks through the complete process: connecting your repository, configuring
          environment variables across environments, setting up preview deployments, and adding
          production checks to ensure quality.
        </p>

        <ProcessFlow
          title="Deployment Pipeline"
          steps={[
            { label: "Push Code", sublabel: "Git commit", color: "blue" },
            { label: "Build", sublabel: "Vercel CI", color: "yellow" },
            { label: "Check", sublabel: "Tests + Lint", color: "yellow" },
            { label: "Preview", sublabel: "Branch URL", color: "blue" },
            { label: "Promote", sublabel: "Production", color: "green" },
          ]}
        />

        <SubSectionHeader id="prerequisites" title="Prerequisites" />
        <NumberedList
          items={[
            { title: "Next.js project", description: "A working Next.js app (14+ or 16) with a GitHub/GitLab/Bitbucket repository." },
            { title: "Vercel account", description: "Free tier is sufficient for most projects. Sign up at vercel.com." },
            { title: "Environment variables", description: "Know which API keys, database URLs, and secrets your app needs." },
          ]}
        />

        <SectionHeader id="project-setup" title="Project Setup" />
        <p className="text-muted-foreground leading-relaxed">
          Vercel auto-detects Next.js projects. Connect your Git repository and Vercel handles
          the build configuration automatically.
        </p>

        <StepFlow
          title="Initial Setup Steps"
          steps={[
            { number: 1, title: "Import Project", description: "Click 'Add New Project' in Vercel dashboard and select your Git repository." },
            { number: 2, title: "Configure Build", description: "Vercel auto-detects Next.js. Verify the framework preset and root directory." },
            { number: 3, title: "Add Env Vars", description: "Add required environment variables before first deployment." },
            { number: 4, title: "Deploy", description: "Click Deploy. Vercel builds and assigns a unique URL." },
          ]}
        />

        <InfoBox type="tip" title="Monorepo Support">
          If your Next.js app lives inside a monorepo, set the Root Directory in Vercel project settings
          to point to the app folder (e.g., <code>apps/web</code>). Vercel will only build when files in that
          directory change.
        </InfoBox>

        <SectionHeader id="environment-variables" title="Environment Variables" />
        <p className="text-muted-foreground leading-relaxed">
          Environment variables are the most common source of deployment issues. Vercel provides
          a structured system for managing them across development, preview, and production environments.
        </p>

        <SubSectionHeader id="env-local" title="Local Development (.env.local)" />
        <CodeBlock
          filename=".env.local"
          language="bash"
          code={`# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/mydb"

# Auth
NEXTAUTH_SECRET="local-dev-secret-change-in-production"
NEXTAUTH_URL="http://localhost:3000"

# API Keys
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."`}
        />

        <InfoBox type="warning" title="NEXT_PUBLIC_ Prefix">
          Only variables prefixed with <code>NEXT_PUBLIC_</code> are exposed to the browser bundle.
          NEVER prefix secret keys with <code>NEXT_PUBLIC_</code> -- they will be visible to anyone
          inspecting your JavaScript.
        </InfoBox>

        <SubSectionHeader id="env-vercel" title="Vercel Dashboard Configuration" />
        <VerticalFlow
          title="Adding Variables in Vercel"
          steps={[
            { title: "Navigate to Project Settings", description: "Go to your project > Settings > Environment Variables." },
            { title: "Add each variable", description: "Enter the key and value. Select which environments it applies to." },
            { title: "Choose environment scope", description: "Production, Preview, Development -- or all three." },
            { title: "Redeploy if needed", description: "Existing deployments won't pick up new variables. Trigger a redeploy." },
          ]}
        />

        <SubSectionHeader id="env-scoping" title="Environment Scoping" />
        <StatsTable
          title="Environment Variable Scoping"
          headers={["Variable", "Development", "Preview", "Production"]}
          rows={[
            ["DATABASE_URL", "localhost DB", "Staging DB", "Production DB"],
            ["NEXTAUTH_URL", "http://localhost:3000", "Auto (branch URL)", "https://yourdomain.com"],
            ["STRIPE_SECRET_KEY", "sk_test_...", "sk_test_...", "sk_live_..."],
            ["LOG_LEVEL", "debug", "debug", "warn"],
          ]}
        />

        <DecisionTree
          title="Which Scope Should I Use?"
          decisions={[
            { condition: "Same value everywhere (e.g. app name)?", result: "Select all three environments", recommended: true },
            { condition: "Different DB per environment?", result: "Add separate entries for each scope" },
            { condition: "Test keys for dev/preview, live for prod?", result: "Two entries: one for Dev+Preview, one for Production", recommended: true },
            { condition: "Only needed at build time?", result: "Any scope works -- variables are available during build regardless" },
          ]}
        />

        <SectionHeader id="deployment-flow" title="Deployment Flow" />

        <SubSectionHeader id="preview-deployments" title="Preview Deployments" />
        <p className="text-muted-foreground leading-relaxed">
          Every push to a non-production branch creates a unique preview deployment with its own URL.
          This enables team review before merging to production.
        </p>

        <DataFlowDiagram
          title="Preview Deployment Flow"
          nodes={[
            { label: "Push Branch", icon: <GitBranch className="h-4 w-4" /> },
            { label: "Vercel Build", icon: <Settings className="h-4 w-4" /> },
            { label: "Preview URL", icon: <Eye className="h-4 w-4" /> },
            { label: "Team Review", icon: <CheckCircle2 className="h-4 w-4" /> },
          ]}
        />

        <FeatureGrid
          columns={2}
          features={[
            { icon: <Eye className="h-5 w-5" />, title: "Unique URL", description: "Each branch gets a dedicated URL for testing and sharing with stakeholders." },
            { icon: <GitBranch className="h-5 w-5" />, title: "PR Comments", description: "Vercel automatically comments on PRs with the preview URL and deployment status." },
            { icon: <Shield className="h-5 w-5" />, title: "Preview Env Vars", description: "Preview deployments use Preview-scoped variables, keeping production secrets separate." },
            { icon: <Lock className="h-5 w-5" />, title: "Authentication", description: "Enable Vercel Authentication to restrict preview access to team members only." },
          ]}
        />

        <SubSectionHeader id="production-deployment" title="Production Deployment" />
        <p className="text-muted-foreground leading-relaxed">
          Merging to your production branch (usually <code>main</code>) triggers a production deployment.
          Vercel atomically swaps the new deployment at your custom domain.
        </p>

        <InfoBox type="info" title="Zero-Downtime Deployments">
          Vercel production deployments are atomic. The new version is fully built and ready before
          traffic is switched. Users never see a loading state or broken page during deployment.
        </InfoBox>

        <SectionHeader id="deployment-checks" title="Deployment Checks" />
        <p className="text-muted-foreground leading-relaxed">
          Deployment checks run after the build completes but before the deployment is promoted.
          They act as a quality gate.
        </p>

        <FeatureGrid
          columns={3}
          features={[
            { icon: <CheckCircle2 className="h-5 w-5" />, title: "Build Checks", description: "TypeScript errors, lint failures, and build warnings are caught automatically." },
            { icon: <Zap className="h-5 w-5" />, title: "Web Vitals", description: "Vercel Speed Insights tracks LCP, CLS, and INP across real user sessions." },
            { icon: <Shield className="h-5 w-5" />, title: "Integration Checks", description: "Third-party integrations (e.g. Lighthouse CI) can report pass/fail status." },
          ]}
        />

        <CodeBlock
          filename="vercel.json"
          language="json"
          code={`{
  "github": {
    "autoAlias": true,
    "silent": false
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}`}
        />

        <SectionHeader id="custom-domains" title="Custom Domains" />
        <StepFlow
          title="Domain Setup"
          steps={[
            { number: 1, title: "Add Domain", description: "In Project Settings > Domains, enter your custom domain." },
            { number: 2, title: "Configure DNS", description: "Add a CNAME record pointing to cname.vercel-dns.com." },
            { number: 3, title: "SSL Auto-Provisioned", description: "Vercel issues a free SSL certificate automatically via Let's Encrypt." },
            { number: 4, title: "Verify", description: "Wait for DNS propagation (usually minutes) and verify in the dashboard." },
          ]}
        />

        <SectionHeader id="troubleshooting" title="Troubleshooting" />
        <DecisionTree
          title="Common Deployment Issues"
          decisions={[
            { condition: "Build fails with 'module not found'?", result: "Check package.json dependencies are correct. Run npm install locally first.", recommended: true },
            { condition: "Environment variable undefined at runtime?", result: "Verify it's set for the correct scope. Redeploy after adding new vars." },
            { condition: "NEXT_PUBLIC_ var missing in browser?", result: "NEXT_PUBLIC_ vars are inlined at build time. Redeploy after changes." },
            { condition: "Preview works but production broken?", result: "Check Production-scoped env vars differ from Preview-scoped." },
            { condition: "Custom domain shows SSL error?", result: "DNS propagation can take up to 48 hours. Check CNAME record is correct." },
          ]}
        />

        <SectionHeader id="takeaway" title="Key Takeaway" />
        <KeyTakeaway>
          Vercel deployment is designed to be zero-config for Next.js. The most important thing to get
          right is environment variable scoping -- use different values for development, preview, and
          production. Let preview deployments be your quality gate: every branch gets a URL, every PR
          gets a comment, and production only receives code that has been reviewed on a live preview.
        </KeyTakeaway>

        <MetricsGrid
          metrics={[
            { label: "Build Time", value: "~30s", change: "Turbopack", positive: true },
            { label: "Deploy Time", value: "<60s", change: "Edge network", positive: true },
            { label: "SSL Setup", value: "Auto", change: "Zero config", positive: true },
            { label: "Preview URLs", value: "Unlimited", change: "Per branch", positive: true },
          ]}
        />

        <RelatedArticles
          articles={[
            { title: "ISR and On-Demand Revalidation", href: "/dashboard/content-library/articles/isr-on-demand-revalidation", level: "intermediate" },
            { title: "Performance Budgets", href: "/dashboard/content-library/articles/performance-budgets-next-js-apps", level: "intermediate" },
            { title: "Service Request Lifecycle", href: "/dashboard/content-library/articles/business/service-request-lifecycle", level: "beginner" },
          ]}
        />
      </div>

      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-8">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  )
}
