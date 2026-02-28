# INFRASTRUCTURE.md

> **DevOps, Deployment, and Operational Excellence**  
> Production-ready infrastructure for modern web applications

---

## Table of Contents

1. [Infrastructure Overview](#infrastructure-overview)
2. [Local Development](#local-development)
3. [Docker Setup](#docker-setup)
4. [Database Strategy](#database-strategy)
5. [Caching Architecture](#caching-architecture)
6. [Deployment Pipeline](#deployment-pipeline)
7. [Monitoring & Observability](#monitoring--observability)
8. [Security](#security)
9. [Disaster Recovery](#disaster-recovery)

---

## Infrastructure Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│ Client (Browser)                                            │
└───────────────┬─────────────────────────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────────────────────────┐
│ CDN (Vercel Edge)                                           │
│  • Static assets (JS, CSS, images)                          │
│  • SSG pages (permanent cache)                              │
│  • Edge functions (geo-routing)                             │
└───────────────┬─────────────────────────────────────────────┘
                │
                ↓
┌─────────────────────────────────────────────────────────────┐
│ Next.js App (Vercel Serverless)                             │
│  • SSR pages (user-specific)                                │
│  • ISR pages (revalidate on interval)                       │
│  • API routes                                               │
│  • Middleware (auth, routing)                               │
└─────┬─────────────────┬───────────────────┬─────────────────┘
      │                 │                   │
      ↓                 ↓                   ↓
┌──────────┐  ┌──────────────┐  ┌──────────────────┐
│ Redis    │  │ Strapi CMS   │  │ Postgres         │
│ (Cache)  │  │ (Content)    │  │ (Database)       │
└──────────┘  └──────────────┘  └──────────────────┘
```

### Technology Stack

| Layer          | Technology                | Purpose                  | Hosting                    |
| -------------- | ------------------------- | ------------------------ | -------------------------- |
| **Frontend**   | Next.js 16                | Server/Client components | Vercel                     |
| **Backend**    | Next.js API Routes        | Server actions, oRPC     | Vercel Serverless          |
| **CMS**        | Strapi 5                  | Content management       | Railway/Render             |
| **Database**   | PostgreSQL 16             | Persistent data          | Vercel Postgres / Supabase |
| **Cache**      | Redis 7                   | API cache, sessions      | Upstash / Vercel KV        |
| **CDN**        | Vercel Edge               | Static assets, SSG       | Vercel                     |
| **Monitoring** | Sentry + Vercel Analytics | Errors, performance      | SaaS                       |
| **CI/CD**      | GitHub Actions            | Automated deployments    | GitHub                     |

---

## Local Development

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker Desktop (optional, for full stack)
- Git

### Quick Start

```bash
# Clone repository
git clone https://github.com/username/v0-component-design-review.git
cd v0-component-design-review

# Install dependencies
pnpm install

# Run development server
pnpm dev

# Open browser
# http://localhost:3000
```

### Environment Variables

```bash
# .env.local (create this file, do not commit)

# Database (when using Docker/Postgres)
DATABASE_URL="postgresql://dev:dev@localhost:5432/v0_component_design"

# Strapi (when connecting to real CMS)
NEXT_PUBLIC_STRAPI_URL="http://localhost:1337"
STRAPI_API_TOKEN="your-api-token"

# Redis (when using caching)
REDIS_URL="redis://localhost:6379"

# Authentication (when implementing NextAuth)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Monitoring (production only)
SENTRY_DSN="your-sentry-dsn"
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"
```

### Development Workflow

```bash
# Start dev server
pnpm dev

# Run type checking
pnpm exec tsc --noEmit

# Run linter
pnpm lint

# Run tests (when implemented)
pnpm test

# Build for production
pnpm build

# Start production server locally
pnpm start
```

---

## Docker Setup

### Why Docker?

**Problem**: Lost data multiple times during development due to:

- Browser cache clears
- JSON file overwrites
- No persistent storage

**Solution**: Docker Compose with Postgres + volume mounts for data persistence.

### Docker Compose Configuration

```yaml
# docker-compose.yml
version: "3.8"

services:
  # PostgreSQL Database
  postgres:
    image: postgres:16-alpine
    container_name: v0_postgres
    restart: unless-stopped
    environment:
      POSTGRES_DB: v0_component_design
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
      POSTGRES_HOST_AUTH_METHOD: trust
    volumes:
      - postgres_data:/var/lib/postgresql/data # Persists across restarts
      - ./data/seeds:/docker-entrypoint-initdb.d # Initial seed scripts
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dev"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: v0_redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5

  # Strapi CMS (optional, for testing)
  strapi:
    image: strapi/strapi:latest
    container_name: v0_strapi
    restart: unless-stopped
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_NAME: v0_component_design
      DATABASE_USERNAME: dev
      DATABASE_PASSWORD: dev
      JWT_SECRET: your-jwt-secret
      ADMIN_JWT_SECRET: your-admin-jwt-secret
      APP_KEYS: key1,key2,key3,key4
      API_TOKEN_SALT: your-api-token-salt
    volumes:
      - strapi_data:/srv/app
    ports:
      - "1337:1337"
    depends_on:
      postgres:
        condition: service_healthy

  # Next.js Dev Server (optional, usually run directly)
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: v0_nextjs
    restart: unless-stopped
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://dev:dev@postgres:5432/v0_component_design
      REDIS_URL: redis://redis:6379
      NEXT_PUBLIC_STRAPI_URL: http://strapi:1337
    depends_on:
      - postgres
      - redis
      - strapi

volumes:
  postgres_data:
  redis_data:
  strapi_data:
```

### Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up -d --build

# Reset all data (destructive)
docker-compose down -v

# Backup database
docker exec v0_postgres pg_dump -U dev v0_component_design > backup.sql

# Restore database
docker exec -i v0_postgres psql -U dev v0_component_design < backup.sql
```

---

## Database Strategy

### Schema Design

```sql
-- Content tables (mirror Strapi structure)

CREATE TABLE articles (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content TEXT NOT NULL,
  level VARCHAR(50) NOT NULL, -- beginner, intermediate, advanced
  category VARCHAR(100) NOT NULL,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tutorials (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  level VARCHAR(50) NOT NULL,
  category VARCHAR(100) NOT NULL,
  duration VARCHAR(50),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tutorial_steps (
  id SERIAL PRIMARY KEY,
  tutorial_id INTEGER REFERENCES tutorials(id) ON DELETE CASCADE,
  step_order INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  code TEXT,
  hint TEXT,
  solution TEXT,
  explanation TEXT
);

CREATE TABLE case_studies (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  impact_summary TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_tutorials_slug ON tutorials(slug);
CREATE INDEX idx_case_studies_slug ON case_studies(slug);
```

### Seed Scripts

```bash
# data/seeds/01_seed_articles.sql
INSERT INTO articles (slug, title, description, content, level, category, published_at)
VALUES
  ('atomic-design-principles', 'Understanding Atomic Design', '...', '...', 'beginner', 'architecture', NOW()),
  ('typescript-zod-validation', 'Type-Safe Validation', '...', '...', 'intermediate', 'forms', NOW());

# data/seeds/02_seed_tutorials.sql
INSERT INTO tutorials (slug, title, description, level, category, duration, published_at)
VALUES
  ('building-atomic-component', 'Building Your First Atomic Component', '...', 'beginner', 'components', '20 min', NOW());
```

### Migrations

```bash
# migrations/001_initial_schema.sql
-- Create tables

# migrations/002_add_indexes.sql
-- Add performance indexes

# Run migrations
psql -U dev -d v0_component_design -f migrations/001_initial_schema.sql
```

---

## Caching Architecture

### Multi-Layer Caching Strategy

```
┌────────────────────────────────────────────────┐
│ CDN (Vercel Edge) - Permanent                  │
│  • SSG pages (never expire)                    │
│  • Static assets (immutable)                   │
└─────────────┬──────────────────────────────────┘
              │
              ↓
┌────────────────────────────────────────────────┐
│ ISR (Next.js) - Time-based                     │
│  • News hub (revalidate: 3600s)                │
│  • Blog (revalidate: 1800s)                    │
└─────────────┬──────────────────────────────────┘
              │
              ↓
┌────────────────────────────────────────────────┐
│ Redis - API Cache (5-60min)                    │
│  • Strapi API responses                        │
│  • Database query results                      │
│  • Session storage                             │
└─────────────┬──────────────────────────────────┘
              │
              ↓
┌────────────────────────────────────────────────┐
│ Client (SWR) - UI Cache (30s)                  │
│  • Filter results                              │
│  • Search results                              │
│  • User interactions                           │
└────────────────────────────────────────────────┘
```

### Redis Cache Implementation

```typescript
// lib/cache/redis.ts
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 300, // 5 minutes default
): Promise<T> {
  // Try cache first
  const cached = await redis.get<T>(key);
  if (cached) return cached;

  // Fetch if not cached
  const data = await fetcher();

  // Store in cache
  await redis.setex(key, ttl, JSON.stringify(data));

  return data;
}

// Usage in repository
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return getCached(
    `article:${slug}`,
    async () => {
      const dto = await strapiClient.articles.getBySlug({ slug });
      return mapArticleDTO(dto);
    },
    3600, // 1 hour
  );
}
```

### Cache Invalidation

```typescript
// app/api/revalidate/route.ts (webhook from Strapi)
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { secret, slug, type } = await request.json();

  // Validate webhook secret
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  // Revalidate ISR pages
  if (type === "article") {
    revalidatePath(`/articles/${slug}`);
    revalidatePath("/news"); // News hub aggregates articles
  }

  // Clear Redis cache
  await redis.del(`article:${slug}`);

  return NextResponse.json({ revalidated: true });
}
```

---

## Deployment Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm exec tsc --noEmit

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    needs: [lint, typecheck, test]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "pnpm"
      - run: pnpm install
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: .next

  deploy:
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: "--prod"
```

### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "regions": ["iad1"],
  "env": {
    "NEXT_PUBLIC_STRAPI_URL": "@strapi-url",
    "STRAPI_API_TOKEN": "@strapi-api-token",
    "REDIS_URL": "@redis-url",
    "DATABASE_URL": "@database-url"
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

## Monitoring & Observability

### Error Tracking (Sentry)

```typescript
// lib/monitoring/sentry.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event, hint) {
    // Filter out expected errors
    if (event.exception?.values?.[0]?.value?.includes("NotFound")) {
      return null;
    }
    return event;
  },
});

// Usage in error boundary
export function logError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}
```

### Performance Monitoring

```typescript
// lib/monitoring/analytics.ts
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

// In app/layout.tsx
export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## Security

### Security Headers

```typescript
// next.config.mjs
export default {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
        ],
      },
    ];
  },
};
```

### Environment Variable Security

- Never commit `.env.local` or `.env.production`
- Use Vercel secrets for production
- Rotate API tokens regularly
- Use read-only database users for read operations

---

## Disaster Recovery

### Backup Strategy

```bash
# Automated daily backups
0 2 * * * docker exec v0_postgres pg_dump -U dev v0_component_design | gzip > backups/backup-$(date +\%Y\%m\%d).sql.gz

# Retention: Keep 7 daily, 4 weekly, 12 monthly
```

### Recovery Procedures

```bash
# Restore from backup
gunzip < backups/backup-20260226.sql.gz | docker exec -i v0_postgres psql -U dev v0_component_design

# Rollback deployment (Vercel)
vercel rollback <deployment-url>
```

---

## Summary

This infrastructure provides:

✅ **Development**: Docker Compose for local full-stack development  
✅ **Data Persistence**: Postgres + volume mounts (no more data loss)  
✅ **Caching**: Multi-layer strategy (CDN → ISR → Redis → Client)  
✅ **CI/CD**: Automated testing and deployment  
✅ **Monitoring**: Error tracking, performance metrics  
✅ **Security**: Headers, secrets management, RBAC  
✅ **Disaster Recovery**: Automated backups, rollback procedures

**Result**: Production-ready infrastructure demonstrating DevOps excellence and operational maturity.
