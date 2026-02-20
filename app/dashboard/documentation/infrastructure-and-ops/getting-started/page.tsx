"use client"

import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Server,
  CheckCircle,
  ArrowRight,
  Shield,
  Database,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const steps = [
  { number: 1, title: "Environment Setup", description: "Configure Node.js and dependencies", time: "3 min" },
  { number: 2, title: "API Configuration", description: "Set up REST API with validation", time: "5 min" },
  { number: 3, title: "Database Setup", description: "Initialize PostgreSQL connection", time: "3 min" },
  { number: 4, title: "Security Hardening", description: "Configure CSRF, rate limiting, headers", time: "5 min" },
  { number: 5, title: "Deployment Preparation", description: "Environment variables and build", time: "3 min" },
]

const SECTIONS = [
  { id: "what-you-will-build", title: "What You Will Build" },
  { id: "prerequisites", title: "Prerequisites" },
  { id: "environment-setup", title: "Environment Setup" },
  { id: "api-configuration", title: "API Setup with Validation" },
  { id: "database-setup", title: "Database Connection" },
  { id: "security-hardening", title: "Security Implementation" },
  { id: "deployment-preparation", title: "Deployment Preparation" },
  { id: "next-steps", title: "Next Steps" },
]

export default function InfrastructureGettingStartedPage() {
  return (
    <DocPage
      title="Getting Started"
      description="Set up the infrastructure layer for a production-ready Next.js application. This guide covers environment configuration, API setup, database connection, and security implementation in about 20 minutes."
      icon={Server}
      badges={[
        <Badge key="level" className="bg-blue-500/20 text-blue-400 border-0">DevOps / Architect</Badge>,
      ]}
      tags={["getting-started", "infrastructure", "setup", "devops"]}
      meta={[
        { label: "Audience", value: "DevOps Engineer / Architect" },
        { label: "Time", value: "~20 minutes" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* Progress Overview */}
      <DocSectionHeader id="what-you-will-build">What You Will Build</DocSectionHeader>
        <div className="flex flex-wrap gap-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center gap-3">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                {step.number}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.time}</p>
              </div>
              {index < steps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground ml-2" />}
            </div>
          ))}
        </div>

      {/* Prerequisites */}
      <DocSectionHeader id="prerequisites">Prerequisites</DocSectionHeader>
        <div className="responsive-grid-3">
          {[
            { icon: Server, title: "Node.js 20+", desc: "Runtime. Check with node -v" },
            { icon: Database, title: "PostgreSQL 14+", desc: "Production database. Recommended." },
            { icon: Zap, title: "npm/pnpm", desc: "Package manager for dependencies." },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>


      {/* Step 1: Environment Setup */}
      <DocSectionHeader id="environment-setup">Environment Setup</DocSectionHeader>
        <Callout type="info" title="Project Configuration">
          Initialize a Next.js project with all necessary infrastructure dependencies. This creates the foundation for API routes, database connections, and security layers.
        </Callout>
        <Spoiler title="Installation & Setup" defaultOpen>
          <CodeBlock
            title="Terminal"
            language="bash"
            code={`# Create Next.js project
npx create-next-app@latest my-app --typescript --tailwind
cd my-app

# Install infrastructure dependencies
npm install @aws-sdk/client-dynamodb dotenv zod bcryptjs

# Recommended dev dependencies
npm install -D @types/bcryptjs

# Check Node version
node -v  # Should be 20.0.0 or higher`}
          />
        </Spoiler>
        <Spoiler title="Environment Variables Template">
          <CodeBlock
            title=".env.local"
            language="bash"
            code={`# Database
DATABASE_URL=postgresql://user:password@localhost:5432/mydb
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=mydb
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password

# API Security
CSRF_SECRET=your_csrf_secret_key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Authentication
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret

# Environment
NODE_ENV=development
APP_URL=http://localhost:3000`}
          />
        </Spoiler>


      {/* Step 2: API Configuration */}
      <DocSectionHeader id="api-configuration">API Setup with Validation</DocSectionHeader>
        <p className="text-muted-foreground">Set up API routes with Zod validation and error handling.</p>
        <Spoiler title="API Route Handler Pattern" defaultOpen>
          <CodeBlock
            title="app/api/actions/submit-request/route.ts"
            language="typescript"
            code={`import { z } from 'zod';

const submitRequestSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^[0-9+\\-\\s()]+$/),
  message: z.string().min(10),
});

type SubmitRequest = z.infer<typeof submitRequestSchema>;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validData = submitRequestSchema.parse(body);
    
    // Process validated data
    console.log('Validated:', validData);
    
    return Response.json({ 
      success: true, 
      referenceId: 'SR-' + Date.now() 
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ 
        error: 'Validation failed', 
        details: error.errors 
      }, { status: 400 });
    }
    
    return Response.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}`}
          />
        </Spoiler>
        <Callout type="success" title="Type Safety">
          Using Zod ensures both request validation and TypeScript type inference from the same schema.
        </Callout>


      {/* Step 3: Database Setup */}
      <DocSectionHeader id="database-setup">Database Connection</DocSectionHeader>
        <p className="text-muted-foreground">Initialize PostgreSQL with connection pooling for production reliability.</p>
        <Spoiler title="PostgreSQL Setup" defaultOpen>
          <CodeBlock
            title="Terminal"
            language="bash"
            code={`# Install PostgreSQL client
npm install pg

# Test local connection
psql -U postgres -d postgres

# Inside psql shell
CREATE DATABASE mydb;
CREATE USER myuser WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE mydb TO myuser;
\\q`}
          />
        </Spoiler>
        <Spoiler title="Database Connection Client">
          <CodeBlock
            title="lib/db.ts"
            language="typescript"
            code={`import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export async function query(sql: string, params: any[] = []) {
  const start = Date.now();
  try {
    const result = await pool.query(sql, params);
    console.log('[DB]', sql, 'took', Date.now() - start, 'ms');
    return result.rows;
  } catch (error) {
    console.error('[DB ERROR]', sql, error);
    throw error;
  }
}

export async function getClient() {
  return pool.connect();
}`}
          />
        </Spoiler>


      {/* Step 4: Security Hardening */}
      <DocSectionHeader id="security-hardening">Security Implementation</DocSectionHeader>
        <p className="text-muted-foreground">Configure CSRF protection, rate limiting, and security headers.</p>
        <Spoiler title="CSRF Protection Middleware" defaultOpen>
          <CodeBlock
            title="lib/middleware/csrf.ts"
            language="typescript"
            code={`import { crypto } from 'node:crypto';

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function verifyCSRFToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false;
  
  // Use constant-time comparison to prevent timing attacks
  const tokenBuffer = Buffer.from(token);
  const sessionBuffer = Buffer.from(sessionToken);
  
  return crypto.timingSafeEqual(tokenBuffer, sessionBuffer);
}`}
          />
        </Spoiler>
        <Spoiler title="Rate Limiting">
          <CodeBlock
            title="lib/middleware/rate-limit.ts"
            language="typescript"
            code={`const requests = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(ip: string, maxRequests = 100, windowMs = 900000): boolean {
  const now = Date.now();
  const record = requests.get(ip);
  
  if (!record || now > record.resetTime) {
    requests.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}`}
          />
        </Spoiler>
        <Callout type="warning" title="Production Security">
          Use external rate limiting (Redis) in production. In-memory storage is for development only.
        </Callout>


      {/* Step 5: Deployment Preparation */}
      <DocSectionHeader id="deployment-preparation">Deployment Preparation</DocSectionHeader>
        <p className="text-muted-foreground">Configure environment variables and build configuration for production.</p>
        <Spoiler title="Production Build Config" defaultOpen>
          <CodeBlock
            title="next.config.mjs"
            language="javascript"
            code={`/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compress: true,
  minify: true,
  productionBrowserSourceMaps: false,
  swcMinify: true,
  
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      ],
    },
  ],
  
  redirects: async () => [
    {
      source: '/api/v1/:path*',
      destination: '/api/:path*',
      permanent: true,
    },
  ],
};

export default nextConfig;`}
          />
        </Spoiler>
        <Spoiler title="Production Environment Variables">
          <CodeBlock
            title=".env.production"
            language="bash"
            code={`# Database - Use managed service (RDS, Neon, etc.)
DATABASE_URL=postgresql://prod_user:prod_password@db.example.com:5432/prod_db

# Security - Use strong secrets
CSRF_SECRET=<generate with: openssl rand -base64 32>
JWT_SECRET=<generate with: openssl rand -base64 32>
SESSION_SECRET=<generate with: openssl rand -base64 32>

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# Environment
NODE_ENV=production
APP_URL=https://yourdomain.com
LOG_LEVEL=info`}
          />
        </Spoiler>
        <Callout type="success" title="Ready to Deploy!">
          Your infrastructure is now configured for production. See the Deployment section for platform-specific guidance.
        </Callout>


      {/* Next Steps */}
      <DocSectionHeader id="next-steps">Next Steps</DocSectionHeader>
        <div className="responsive-grid-3">
          {[
            { title: "API & GraphQL", href: "/dashboard/documentation/infrastructure-and-ops/api-and-graphql", desc: "REST and GraphQL patterns" },
            { title: "Testing Strategy", href: "/dashboard/documentation/infrastructure-and-ops/testing-strategy", desc: "Unit, integration, e2e tests" },
            { title: "Deployment", href: "/dashboard/documentation/infrastructure-and-ops/deployment", desc: "Vercel, Docker, production" },
          ].map((link) => (
            <Card key={link.title} className="hover:border-accent/50 transition-colors">
              <Link href={link.href} className="block p-4">
                <h3 className="font-semibold text-foreground mb-1">{link.title}</h3>
                <p className="text-sm text-muted-foreground">{link.desc}</p>
              </Link>
            </Card>
          ))}
        </div>

    </DocPage>
  )
}
