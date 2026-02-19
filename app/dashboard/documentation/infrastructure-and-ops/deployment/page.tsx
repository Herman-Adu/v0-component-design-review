"use client"

import { Rocket, Cloud, Server, HardDrive, GitBranch, Zap, Shield, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { Spoiler } from "@/components/atoms/spoiler"
import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"

const SECTIONS = [
  { id: "architecture", title: "Deployment Architecture" },
  { id: "frontend-deploy", title: "Deploy Frontend to Vercel" },
  { id: "backend-deploy", title: "Deploy Backend (Strapi)" },
  { id: "cicd", title: "CI/CD with GitHub Actions" },
  { id: "performance", title: "Performance Optimization" },
  { id: "security-checklist", title: "Security Checklist" },
  { id: "monitoring", title: "Monitoring & Analytics" },
]

export default function DeploymentPage() {
  return (
    <DocPage
      title="Deployment Guide"
      description="Production deployment strategies for Next.js frontend and Strapi backend."
      icon={Rocket}
      badges={[{ label: "Infrastructure", className: "bg-blue-500/20 text-blue-400 border-0" }]}
      tags={["Vercel", "Railway", "Docker", "CI/CD", "PostgreSQL"]}
      meta={[
        { label: "Audience", value: "DevOps / Backend Engineers" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* Deployment Architecture */}
      <section className="space-y-6">
        <DocSectionHeader id="architecture">Deployment Architecture</DocSectionHeader>
        <p className="text-muted-foreground">
          Deploy frontend and backend separately for better scalability and independent updates.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <Cloud className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Frontend (Next.js)</CardTitle>
              <CardDescription>Deploy to Vercel for optimal performance</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>Automatic deployments from Git</li>
                <li>Edge functions and middleware</li>
                <li>Image optimization</li>
                <li>Analytics and monitoring</li>
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Server className="h-8 w-8 text-accent mb-2" />
              <CardTitle>Backend (Strapi)</CardTitle>
              <CardDescription>Deploy to Railway, Render, or DigitalOcean</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="space-y-1">
                <li>PostgreSQL database</li>
                <li>File storage (S3, Cloudinary)</li>
                <li>Auto-scaling</li>
                <li>Backup and recovery</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Frontend Deploy */}
      <section className="space-y-6">
        <DocSectionHeader id="frontend-deploy">Deploy Frontend to Vercel</DocSectionHeader>

        <Spoiler title="Step 1: Prepare for Deployment">
          <CodeBlock language="bash" code={`# Install Vercel CLI (optional)
npm i -g vercel

# Build locally to check for errors
npm run build

# Test production build
npm run start`} />
        </Spoiler>

        <Spoiler title="Step 2: Connect to Vercel">
          <ol className="list-decimal list-inside text-sm space-y-2">
            <li>Push your code to GitHub, GitLab, or Bitbucket</li>
            <li>Go to vercel.com and sign in</li>
            <li>{"Click \"Add New Project\""}</li>
            <li>Import your repository</li>
            <li>Vercel auto-detects Next.js settings</li>
            <li>Add environment variables</li>
            <li>{"Click \"Deploy\""}</li>
          </ol>
        </Spoiler>

        <Spoiler title="Step 3: Environment Variables">
          <p className="text-sm text-muted-foreground mb-2">
            {"Add these in Vercel Dashboard > Settings > Environment Variables"}
          </p>
          <CodeBlock language="bash" code={`STRAPI_API_URL=https://your-strapi-backend.com
STRAPI_API_TOKEN=your_production_token
NEXT_PUBLIC_SITE_URL=https://your-domain.com`} />
        </Spoiler>
      </section>

      {/* Backend Deploy */}
      <section className="space-y-6">
        <DocSectionHeader id="backend-deploy">Deploy Backend (Strapi)</DocSectionHeader>

        <Spoiler title="Option 1: Railway">
          <ol className="list-decimal list-inside text-sm space-y-2 mb-4">
            <li>Go to railway.app and create account</li>
            <li>Create new project from GitHub repo</li>
            <li>Add PostgreSQL service</li>
            <li>Set environment variables</li>
            <li>Deploy</li>
          </ol>
          <CodeBlock language="bash" code={`# Railway environment variables
DATABASE_URL=\${POSTGRES_URL}
NODE_ENV=production
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=random_string
ADMIN_JWT_SECRET=random_string
JWT_SECRET=random_string`} />
        </Spoiler>

        <Spoiler title="Option 2: Render">
          <ol className="list-decimal list-inside text-sm space-y-2 mb-4">
            <li>Create account at render.com</li>
            <li>{"New > Web Service"}</li>
            <li>Connect GitHub repository</li>
            <li>Add PostgreSQL database</li>
            <li>Configure build and start commands</li>
          </ol>
          <CodeBlock language="bash" code={`# Build Command
npm install && npm run build

# Start Command
npm run start`} />
        </Spoiler>

        <Spoiler title="Database Configuration">
          <CodeBlock language="javascript" code={`// backend/config/database.js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: env.bool('DATABASE_SSL', false) && {
        rejectUnauthorized: env.bool('DATABASE_SSL_REJECT_UNAUTHORIZED', false)
      }
    },
    pool: { min: 0, max: 10 }
  },
});`} />
        </Spoiler>
      </section>

      {/* CI/CD */}
      <section className="space-y-6">
        <DocSectionHeader id="cicd">CI/CD with GitHub Actions</DocSectionHeader>

        <Spoiler title="Automated Testing and Deployment">
          <CodeBlock language="yaml" code={`# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npx playwright install && npm run test:e2e
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'`} />
        </Spoiler>
      </section>

      {/* Performance */}
      <section className="space-y-6">
        <DocSectionHeader id="performance">Performance Optimization</DocSectionHeader>
        <div className="space-y-3">
          <Callout type="info" title="Image Optimization">
            Use Next.js Image component for automatic optimization and lazy loading.
          </Callout>
          <Callout type="info" title="Code Splitting">
            Use dynamic imports for heavy components to reduce initial bundle size.
          </Callout>
          <Callout type="info" title="Caching Strategy">
            Implement SWR for data fetching with automatic caching and revalidation.
          </Callout>
          <Callout type="info" title="CDN for Static Assets">
            {"Use Vercel's edge network or Cloudflare for faster global content delivery."}
          </Callout>
        </div>
      </section>

      {/* Security Checklist */}
      <section className="space-y-6">
        <DocSectionHeader id="security-checklist">Security Checklist</DocSectionHeader>
        <div className="space-y-2">
          {[
            { title: "Environment Variables Secured", desc: "Never commit .env files to Git" },
            { title: "HTTPS Enabled", desc: "Enforce HTTPS for all connections" },
            { title: "CORS Configured", desc: "Only allow requests from your frontend domain" },
            { title: "Rate Limiting Enabled", desc: "Prevent API abuse with rate limiting" },
            { title: "Input Validation", desc: "Validate all user inputs on frontend and backend" },
            { title: "Database Backups", desc: "Automated daily backups configured" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-3 border border-border rounded-lg">
              <Shield className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <div>
                <h4 className="font-semibold text-sm">{item.title}</h4>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Monitoring */}
      <section className="space-y-6">
        <DocSectionHeader id="monitoring">Monitoring & Analytics</DocSectionHeader>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: Activity, title: "Vercel Analytics", desc: "Real-time web analytics and Web Vitals monitoring built into Vercel" },
            { icon: Shield, title: "Error Tracking", desc: "Use Sentry for error tracking and performance monitoring" },
            { icon: Activity, title: "Uptime Monitoring", desc: "Use UptimeRobot or Better Uptime to monitor service availability" },
            { icon: HardDrive, title: "Log Management", desc: "Centralized logging with LogRocket or Datadog for debugging" },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader>
                <item.icon className="h-6 w-6 text-accent mb-1" />
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{item.desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>
    </DocPage>
  )
}
