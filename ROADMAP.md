# ROADMAP.md

> **Strategic Vision for Platform Evolution**  
> Future integrations, technical debt elimination, and cutting-edge features

---

## Table of Contents

1. [Current State](#current-state)
2. [Phase 1: Foundation (Complete)](#phase-1-foundation)
3. [Phase 2: Data Layer (In Progress)](#phase-2-data-layer)
4. [Phase 3: oRPC Integration](#phase-3-orpc-integration)
5. [Phase 4: Docker + Postgres](#phase-4-docker--postgres)
6. [Phase 5: MCP Servers](#phase-5-mcp-servers)
7. [Phase 6: Authentication & Authorization](#phase-6-authentication--authorization)
8. [Phase 7: Advanced Caching](#phase-7-advanced-caching)
9. [Phase 8: Testing Infrastructure](#phase-8-testing-infrastructure)
10. [Phase 9: Production Deployment](#phase-9-production-deployment)

---

## Current State

### Completed ✅

- **Content Migration** - Articles, case studies, tutorials migrated to JSON (Phase 9)
- **Repository Pattern** - Server-only data access layer established
- **View Models** - Domain → UI transformation layer
- **SSG Routes** - 160 pages prerendered at build time
- **TypeScript Strict Mode** - Full type safety across codebase
- **Component Library** - shadcn/ui + custom atomic components

### In Progress 🚧

- **DTO/Mapper/Repository Tiers** - Enterprise data layer implementation
- **Features Layer** - Component reusability across contexts
- **Error Boundaries** - Hybrid strategy (global + section + component)
- **File Reorganization** - Self-contained section structures

### Technical Debt 🔴

- Legacy `data/content-library/*.tsx` files (to be deleted after migration)
- Scattered list configs (moving into section folders)
- No end-to-end type safety (oRPC planned)
- No data persistence (Docker + Postgres planned)
- No automated testing (Playwright + Vitest planned)

---

## Phase 1: Foundation (Complete)

**Timeline**: Completed  
**Status**: ✅ Done

### Objectives

- Establish Next.js 16+ app with App Router
- Configure TypeScript strict mode
- Set up Tailwind CSS + shadcn/ui
- Create initial component structure (atomic design)
- Implement basic routing (dashboard, content library, admin)

### Deliverables

- ✅ Next.js project scaffolded
- ✅ TypeScript configuration
- ✅ Component library (atoms, molecules, organisms)
- ✅ Basic page templates
- ✅ Build pipeline functional

---

## Phase 2: Data Layer (In Progress)

**Timeline**: 2 weeks (current)  
**Status**: 🚧 In Progress  
**Priority**: 🔴 Critical

### Objectives

1. **DTO/Mapper/Repository Pattern**
   - Implement enterprise data layer architecture
   - Create DTOs for Strapi response shapes
   - Build mappers for DTO → Domain transformation
   - Establish repository interfaces (pluggable implementations)

2. **Features Layer**
   - Extract reusable components into `features/`
   - Enable cross-context component usage (SSG/SSR/ISR)
   - Document component APIs

3. **Error Boundaries**
   - Global boundary (app/error.tsx)
   - Section boundaries (per route group)
   - Component boundaries (inline fallbacks)

4. **File Reorganization**
   - Move list configs into section folders
   - Self-contained section structures
   - Clean dashboard root (~11 files)

### Deliverables

- [ ] DTO/Mapper/Repository for all content sections
- [ ] Features layer operational
- [ ] Error boundaries implemented
- [ ] Dashboard root cleaned up
- [ ] Legacy `data/content-library/` deleted
- [ ] ARCHITECTURE.md documentation complete

### Success Criteria

- TypeScript compiles with zero errors
- Build passes (all 160+ pages)
- No imports from legacy `data/content-library/`
- Repository layer easily swappable

---

## Phase 3: oRPC Integration

**Timeline**: 2-3 weeks  
**Status**: 📋 Planned  
**Priority**: 🟡 High  
**Depends On**: Phase 2 complete

### Why oRPC Over tRPC

| Feature             | tRPC       | oRPC       | Winner                         |
| ------------------- | ---------- | ---------- | ------------------------------ |
| **Type safety**     | End-to-end | End-to-end | Tie                            |
| **Chaining**        | Limited    | Advanced   | oRPC                           |
| **Modern patterns** | Good       | Better     | oRPC                           |
| **Performance**     | Fast       | Faster     | oRPC                           |
| **Community**       | Large      | Growing    | tRPC (but not deciding factor) |

**Decision**: oRPC for chaining functionality and modern patterns.

### Objectives

1. **Contract Definition**
   - Define oRPC contracts for all repositories
   - Map repository methods to oRPC procedures
   - Ensure type safety across network boundary

2. **Repository Migration**
   - Implement oRPC client in repository layer
   - Keep repository interface unchanged (no component changes)
   - Add caching layer (SWR or React Query)

3. **Server Implementation**
   - Create oRPC router (server-side)
   - Connect to Strapi API
   - Implement authentication middleware

### Implementation Plan

```typescript
// Before (JSON mock)
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const json = await import(`@/data/strapi-mock/articles/${slug}.json`);
  return mapArticleDTO(json);
}

// After (oRPC)
import { oRPCClient } from "@/lib/orpc/client";

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const dto = await oRPCClient.articles.getBySlug({ slug });
  return mapArticleDTO(dto);
}
```

**Key Point**: Components and pages don't change. Only repository implementation changes.

### Deliverables

- [ ] oRPC contracts defined
- [ ] oRPC client configured
- [ ] oRPC router implemented
- [ ] Repository layer migrated
- [ ] Type safety validated end-to-end
- [ ] Performance benchmarks (vs direct Strapi calls)

---

## Phase 4: Docker + Postgres

**Timeline**: 1 week  
**Status**: 📋 Planned  
**Priority**: 🟠 Medium  
**Depends On**: Phase 3 complete

### Problem Statement

**Pain Point**: Lost data multiple times during development/research due to:

- Browser cache clears
- JSON file overwrites
- No persistent storage for experimentation

**Solution**: Local Docker environment with Postgres database and volume mounts.

### Objectives

1. **Docker Compose Setup**
   - Postgres 16 with persistent volume
   - Next.js dev server (hot reload)
   - Strapi CMS (optional, for testing)
   - Redis (for caching)

2. **Database Schema**
   - Replicate Strapi content types in Postgres
   - Seed scripts for initial data
   - Migration scripts (up/down)

3. **Data Persistence**
   - Volume mounts for Postgres data
   - Backup/restore scripts
   - Seed data version control

### Implementation

```yaml
# docker-compose.yml
version: "3.8"

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: v0_component_design
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev
    volumes:
      - ./data/postgres:/var/lib/postgresql/data # Persists locally
      - ./data/seeds:/docker-entrypoint-initdb.d # Initial seed
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  nextjs:
    build: .
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://dev:dev@postgres:5432/v0_component_design
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis
```

### Deliverables

- [ ] Docker Compose configuration
- [ ] Postgres schema (matches Strapi)
- [ ] Seed scripts (articles, tutorials, case studies)
- [ ] Backup/restore scripts
- [ ] Development workflow documentation

### Success Criteria

- Can destroy/recreate containers without data loss
- Seed scripts restore full dataset in <30 seconds
- Development workflow unchanged (hot reload works)

---

## Phase 5: MCP Servers

**Timeline**: 2-3 weeks  
**Status**: 📋 Planned  
**Priority**: 🟢 Low (Innovation)  
**Depends On**: Phase 4 complete

### What is MCP?

**Model Context Protocol (MCP)** - Emerging standard for AI-assisted development, allowing AI models to interact with development tools through structured interfaces.

### Vision

Integrate MCP servers for:

- Code generation (components, tests, schemas)
- Database queries (natural language → SQL)
- Docker operations (container management, logs, debugging)
- Documentation generation (from code → markdown)

### Objectives

1. **MCP Server Setup**
   - Docker MCP toolkit integration
   - Local MCP server for development
   - Secure API access (no cloud leakage)

2. **Use Cases**
   - Generate Zod schemas from example data
   - Create component tests from component code
   - Query Postgres with natural language
   - Container management (start/stop/logs)

3. **AI Integration**
   - Connect Claude/GPT to MCP servers
   - Custom tools for this codebase
   - Workflow automation

### Example Workflow

```
Developer: "Create a tutorial JSON for 'Building a Search Component'"

MCP Server:
1. Reads existing tutorial JSONs (pattern recognition)
2. Generates schema-compliant JSON
3. Validates with Zod
4. Writes to correct folder
5. Updates registry
6. Runs build validation
```

### Deliverables

- [ ] MCP server configuration
- [ ] Docker MCP toolkit integration
- [ ] Custom tools for this codebase
- [ ] Workflow documentation
- [ ] Example AI prompts

### Success Criteria

- MCP server operational in Docker
- Can generate valid content JSONs via AI
- Can query database with natural language
- Container operations automated

---

## Phase 6: Authentication & Authorization

**Timeline**: 2 weeks  
**Status**: 📋 Planned  
**Priority**: 🔴 Critical (for production)  
**Depends On**: Phase 3 complete

### Objectives

1. **NextAuth.js Setup**
   - Multiple providers (email, OAuth)
   - Session management
   - JWT tokens

2. **Role-Based Access Control (RBAC)**
   - Roles: admin, editor, viewer
   - Route guards (middleware)
   - Component-level permissions

3. **Protected Routes**
   - Dashboard requires auth
   - Admin routes require admin role
   - Public routes open

### Implementation

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const session = await getServerSession();
  const path = request.nextUrl.pathname;

  if (path.startsWith("/dashboard")) {
    if (!session) return NextResponse.redirect("/login");
  }

  if (path.startsWith("/dashboard/admin")) {
    if (session?.user?.role !== "admin") {
      return NextResponse.redirect("/dashboard");
    }
  }

  return NextResponse.next();
}
```

### Deliverables

- [ ] NextAuth.js configured
- [ ] OAuth providers (Google, GitHub)
- [ ] RBAC implementation
- [ ] Route guards (middleware)
- [ ] Session management
- [ ] Login/logout flows

---

## Phase 7: Advanced Caching

**Timeline**: 1 week  
**Status**: 📋 Planned  
**Priority**: 🟠 Medium  
**Depends On**: Phase 4 complete (Redis)

### Caching Strategy

| Layer      | Technology  | TTL       | Scope             |
| ---------- | ----------- | --------- | ----------------- |
| **CDN**    | Vercel Edge | Permanent | SSG pages         |
| **ISR**    | Next.js     | 1-24h     | Dynamic pages     |
| **API**    | Redis       | 5-60m     | Strapi calls      |
| **Client** | SWR         | 30s       | User interactions |

### Objectives

1. **Redis Integration**
   - Cache Strapi API responses
   - Cache database queries
   - Session storage

2. **ISR Configuration**
   - News hub (revalidate: 3600)
   - Blog (revalidate: 1800)
   - Case studies (revalidate: 86400)

3. **Cache Invalidation**
   - Webhook from Strapi (on content update)
   - Manual revalidation endpoint
   - Time-based expiry

### Deliverables

- [ ] Redis caching layer
- [ ] ISR configuration per route type
- [ ] Cache invalidation webhooks
- [ ] Performance metrics

---

## Phase 8: Testing Infrastructure

**Timeline**: 2 weeks  
**Status**: 📋 Planned  
**Priority**: 🔴 Critical (for production)

### Testing Layers

1. **Unit Tests** (Vitest)
   - Mappers (DTO → Domain)
   - Utilities (date formatting, text truncation)
   - View models (computed properties)

2. **Component Tests** (Testing Library)
   - UI components (atoms, molecules, organisms)
   - User interactions (click, type, submit)
   - Accessibility (ARIA, keyboard navigation)

3. **Integration Tests** (Vitest + MSW)
   - Repository layer (mock API responses)
   - oRPC calls (mock network)

4. **E2E Tests** (Playwright)
   - Critical user flows (read article, filter tutorials)
   - Multi-step forms (service request)
   - Navigation (dashboard, public pages)

### Objectives

- 80%+ code coverage
- All critical paths E2E tested
- CI/CD pipeline (GitHub Actions)
- Pre-commit hooks (lint, typecheck, test)

### Deliverables

- [ ] Vitest configuration
- [ ] Testing Library setup
- [ ] Playwright configuration
- [ ] Example tests per layer
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Coverage reports

---

## Phase 9: Production Deployment

**Timeline**: 1 week  
**Status**: 📋 Planned  
**Priority**: 🔴 Critical (for production)

### Objectives

1. **Vercel Deployment**
   - Production environment
   - Preview deployments (per PR)
   - Environment variables

2. **Strapi Hosting**
   - Production Strapi instance
   - Database (managed Postgres)
   - Media storage (S3 or Cloudinary)

3. **Monitoring**
   - Error tracking (Sentry)
   - Analytics (Vercel Analytics)
   - Performance (Web Vitals)

4. **CI/CD**
   - Automated tests on PR
   - Automated deployments on merge
   - Rollback strategy

### Deliverables

- [ ] Vercel production deployment
- [ ] Strapi production instance
- [ ] Environment configuration
- [ ] Monitoring dashboards
- [ ] CI/CD pipeline complete

---

## Timeline Summary

```
Now ───────────> 6 months ───────────> 1 year
│                │                      │
│                │                      │
Phase 2          Phase 3-5              Phase 6-9
(Data Layer)     (oRPC, Docker, MCP)    (Prod Ready)
2 weeks          6-8 weeks              6-8 weeks
│                │                      │
└─ Foundation    └─ Innovation          └─ Production
```

---

## Success Metrics

### Technical

- **Type Safety**: 100% TypeScript strict mode, zero `any`
- **Performance**: Web Vitals (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- **Test Coverage**: 80%+ code coverage
- **Build Time**: < 5 minutes for full build
- **Error Rate**: < 0.1% uncaught errors in production

### Business

- **Developer Productivity**: New feature in < 1 day
- **Onboarding**: New developer productive in < 1 week
- **Maintainability**: No technical debt accumulation
- **Scalability**: Support 10x traffic with no code changes

### Portfolio

- **CTO-Level Thinking**: Documented architecture, strategic decisions
- **Modern Stack Mastery**: Next.js 16, TypeScript 5, oRPC, Docker, MCP
- **Enterprise Patterns**: DTO/Mapper/Repository, SOLID, TDD
- **30 Years Experience**: C#/.NET discipline applied to modern web

---

## Positioning Statement

This roadmap demonstrates:

✅ **Strategic thinking** - Phased approach, dependencies managed  
✅ **Technical depth** - Enterprise patterns, modern stack  
✅ **Innovation** - MCP servers, oRPC (cutting-edge)  
✅ **Operational awareness** - Docker, caching, monitoring  
✅ **Long-term vision** - Scalability, maintainability, testability

**Result**: A portfolio piece that positions you as a **CTO-level architect** with 30 years of discipline applied to modern development.
