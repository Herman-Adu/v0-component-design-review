# ARCHITECTURE.md

> **Platinum Standard Architecture Documentation**  
> Enterprise-grade patterns for modern TypeScript/Next.js development

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Module Structure](#module-structure)
3. [Data Layer Architecture](#data-layer-architecture)
4. [Features Layer](#features-layer)
5. [Rendering Strategy](#rendering-strategy)
6. [Error Handling](#error-handling)
7. [Type Safety](#type-safety)
8. [Testing Strategy](#testing-strategy)
9. [Governance Locks](#governance-locks)
10. [Adding New Modules](#adding-new-modules)

---

## System Overview

This application implements **enterprise-grade architectural patterns** derived from C#/.NET best practices (TDD, SOLID, MVVM, Domain-Driven Design) adapted for the TypeScript/Next.js ecosystem.

### Core Principles

1. **Separation of Concerns** - Data layer → Domain layer → Presentation layer
2. **Backend Agnostic** - Repository abstraction allows easy backend swap (Strapi → oRPC → GraphQL)
3. **Type Safety** - Contracts at every boundary, validated at build time
4. **Graceful Degradation** - Errors isolated to smallest blast radius
5. **Component Reusability** - Features layer enables cross-context usage

### Tech Stack

- **Framework:** Next.js 16+ (App Router, React Server Components)
- **Language:** TypeScript 5+ (strict mode)
- **Validation:** Zod (runtime schema validation)
- **Styling:** Tailwind CSS + shadcn/ui
- **CMS (Future):** Strapi 5+ (currently mocked with JSON)
- **Data Fetching (Future):** oRPC (end-to-end type safety with chaining)

---

## Module Structure

### Codebase Organization

```
lib/strapi/
├── dashboard/                    (Content Library Module)
│   └── content-library/
│       ├── articles/
│       │   ├── article-repository.ts
│       │   ├── article-content.ts
│       │   └── view-models.ts
│       │
│       ├── tutorials/
│       ├── case-studies/
│       └── guides/
│
└── documentation/                (Documentation Module - Phase 3+)
    ├── strategic/                (Phase 3 - Extracted)
    │   ├── schema.ts             (Zod validation)
    │   ├── content-builder.ts    (Load + validate JSON)
    │   ├── repository.ts         (Server-only queries)
    │   ├── view-models.ts        (Transform to UI shape)
    │   └── index.ts              (Public facade)
    │
    ├── cms-reference/            (Phase 3 Batch 2)
    ├── app-reference/            (Phase 3 Batch 3)
    └── infrastructure/           (Phase 3 Batch 4)

data/
├── documentation-strategic/      (JSON content for strategic module)
├── documentation-cms-reference/  (future)
├── documentation-app-reference/  (future)
├── documentation-infrastructure/ (future)
│
└── dashboard/content-library/    (existing content for library)
    ├── articles/
    ├── tutorials/
    ├── case-studies/
    └── guides/
```

### Module Anatomy (Content Library as Reference)

Each module follows the **6-layer data architecture**:

```
JSON Data
   ↓
Content Builder (Load + Validate with Zod)
   ↓
Repository (Server-only queries)
   ↓
View Models (Transform to UI shape)
   ↓
Facade Interface (Public API)
   ↓
Routes/Components (Consume data)
```

**Every module in lib/strapi/** implements this pattern. No exceptions.

---

## Data Layer Architecture

### The N-Tier Pattern

```
┌────────────────────────────────────────────────────────┐
│ External Data Source                                   │
│ (Strapi API, Database, Third-party API)                │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────────────────┐
│ DTOs (Data Transfer Objects)                           │
│  • Exact shape of API response                         │
│  • No business logic                                   │
│  • Validated with Zod at import time                   │
│                                                         │
│  Example: ArticleDTO (from Strapi)                     │
│  {                                                      │
│    id: string                                           │
│    attributes: {                                        │
│      title: string                                      │
│      slug: string                                       │
│      content: RichText                                  │
│      publishedAt: string                                │
│    }                                                    │
│  }                                                      │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────────────────┐
│ Mappers                                                 │
│  • Transform DTO → Domain Model                        │
│  • Flatten nested structures                           │
│  • Apply defaults, enrichment                          │
│  • Contract boundary (easy to test)                    │
│                                                         │
│  Example: mapArticleDTO()                              │
│  Input:  ArticleDTO                                    │
│  Output: Article (flat, enriched)                      │
│  {                                                      │
│    id: string                                           │
│    title: string                                        │
│    slug: string                                         │
│    excerpt: string // ← Computed from content          │
│    readTime: string // ← Computed from content length  │
│    publishedAt: Date // ← Parsed from string           │
│  }                                                      │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────────────────┐
│ Repository (Data Access Layer)                         │
│  • Interface-based (pluggable implementations)         │
│  • Server-only (import "server-only")                  │
│  • Methods: getBySlug, list, listByCategory, etc.     │
│  • Abstracts data source (JSON now, API later)        │
│                                                         │
│  Example: ArticleRepository                            │
│  interface ArticleRepository {                         │
│    getBySlug(slug: string): Promise<Article | null>   │
│    listAll(): Promise<Article[]>                       │
│    listByCategory(cat: string): Promise<Article[]>    │
│  }                                                      │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────────────────┐
│ View Models                                             │
│  • Domain → UI-specific transformation                 │
│  • Computed properties for display                     │
│  • Formatting (dates, numbers, text)                   │
│  • Props for React components                          │
│                                                         │
│  Example: ArticleDetailViewModel                       │
│  {                                                      │
│    ...article,                                          │
│    formattedDate: "February 26, 2026"                  │
│    readTimeLabel: "8 min read"                         │
│    relatedArticles: Article[] // ← Fetched separately │
│  }                                                      │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ↓
┌────────────────────────────────────────────────────────┐
│ Pages (Server Components)                              │
│  • Call repository methods                             │
│  • Transform to view models                            │
│  • Pass props to UI components                         │
│  • SSG/SSR/ISR decision made here                      │
│                                                         │
│  Example: app/articles/[slug]/page.tsx                 │
│  export default async function ArticlePage({ params }) │
│    const article = await articleRepo.getBySlug(slug)  │
│    const vm = toArticleDetailViewModel(article)        │
│    return <ArticleView {...vm} />                      │
│  }                                                      │
└────────────────────────────────────────────────────────┘
```

### File Structure

```
lib/strapi/
├── shared/
│   ├── types.ts              # Base interfaces, error types
│   └── validation.ts         # Shared Zod schemas
│
├── dashboard/
│   └── content-library/
│       ├── articles/
│       │   ├── dto/
│       │   │   ├── article.dto.ts       # Strapi response shape
│       │   │   └── article-list.dto.ts  # List endpoint shape
│       │   ├── mappers/
│       │   │   └── article.mapper.ts    # DTO → Domain
│       │   ├── schemas/
│       │   │   └── article-schema.ts    # Zod validation
│       │   ├── repository.ts            # Data access interface
│       │   └── view-models.ts           # Domain → View
│       │
│       ├── tutorials/         # Same structure
│       ├── case-studies/      # Same structure
│       └── guides/            # Same structure
│
└── public/
    └── news/                  # Public-facing aggregated content
        ├── dto/
        ├── mappers/
        ├── repository.ts
        └── view-models.ts
```

### Why This Pattern?

| Concern                | Solution                | Benefit                                       |
| ---------------------- | ----------------------- | --------------------------------------------- |
| **Backend changes**    | Repository abstraction  | Swap Strapi → oRPC with no component changes  |
| **Data shape changes** | Mapper layer            | Adjust mapping, domain stays stable           |
| **UI changes**         | View models             | Change presentation, domain logic untouched   |
| **Testing**            | Isolated layers         | Mock repositories, test mappers independently |
| **Type safety**        | Contracts at boundaries | TypeScript validates every transform          |

---

## Features Layer

### Purpose

Prevent component duplication by extracting **reusable UI components** into feature modules. Components are consumed by multiple pages with different rendering strategies (SSG, SSR, ISR).

### Structure

```
features/
├── content-library/           # Content components (articles, tutorials, etc.)
│   ├── components/
│   │   ├── article-card.tsx       # Reusable card (list pages)
│   │   ├── article-detail.tsx     # Detail view
│   │   ├── tutorial-steps.tsx     # Step-by-step renderer
│   │   └── content-filter.tsx     # Filter UI (client component)
│   ├── hooks/
│   │   └── use-content-filter.ts  # Filter state management
│   └── types.ts                   # Feature-specific types
│
├── news-hub/                  # Public news aggregation
│   ├── components/
│   │   ├── featured-grid.tsx      # Featured articles + tutorials
│   │   ├── latest-card.tsx        # Latest content card
│   │   └── category-filter.tsx    # Public filter UI
│   └── view-models/
│       └── news-hub-vm.ts         # Aggregates multiple repositories
│
└── admin/                     # Admin dashboard features
    ├── components/
    │   ├── admin-sidebar.tsx
    │   └── stats-card.tsx
    └── hooks/
        └── use-admin-permissions.ts
```

### Usage Example

```typescript
// app/(dashboard)/dashboard/content-library/articles/page.tsx (SSG)
import { ArticleList } from "@/features/content-library/components/article-list"
import { articleRepository } from "@/lib/strapi/dashboard/content-library/articles/repository"

export default async function ArticlesPage() {
  const articles = await articleRepository.listAll()
  return <ArticleList articles={articles} />
}

// app/(public)/news/page.tsx (ISR, revalidate: 3600)
import { FeaturedGrid } from "@/features/news-hub/components/featured-grid"
import { getNewsHubData } from "@/lib/strapi/public/news/repository"

export const revalidate = 3600

export default async function NewsPage() {
  const data = await getNewsHubData() // Aggregates articles + tutorials
  return <FeaturedGrid data={data} />
}
```

### Component Ownership

| Feature              | Owner                       | Consumers                               |
| -------------------- | --------------------------- | --------------------------------------- |
| `article-card.tsx`   | `features/content-library/` | Articles list, news hub, search results |
| `tutorial-steps.tsx` | `features/content-library/` | Tutorial detail, learning paths         |
| `featured-grid.tsx`  | `features/news-hub/`        | Public news page, homepage              |
| `admin-sidebar.tsx`  | `features/admin/`           | All admin pages                         |

---

## Rendering Strategy

### Decision Matrix

| Context                | Route Example        | Strategy | Rationale                                       |
| ---------------------- | -------------------- | -------- | ----------------------------------------------- |
| **Static content**     | `/articles/[slug]`   | SSG      | Content rarely changes, fast CDN delivery       |
| **Static content**     | `/tutorials/[slug]`  | SSG      | Same as articles                                |
| **Aggregated content** | `/news`              | ISR (1h) | Aggregates multiple sources, occasional updates |
| **User-specific**      | `/dashboard/admin/*` | SSR      | Requires auth, permissions, user context        |
| **Search results**     | `/search?q=...`      | SSR      | Dynamic query, personalized ranking             |

### Implementation Examples

```typescript
// SSG: Generate all article pages at build time
export async function generateStaticParams() {
  const articles = await articleRepository.listAll()
  return articles.map((article) => ({ slug: article.slug }))
}

// ISR: Revalidate every hour
export const revalidate = 3600

// SSR: Fetch on every request (requires auth)
export default async function AdminDashboard() {
  const session = await getServerSession()
  if (!session) redirect("/login")
  const data = await getAdminData(session.user.id)
  return <DashboardView data={data} />
}
```

---

## Error Handling

### Hybrid Boundary Strategy

Three layers of error isolation for graceful degradation:

```
┌─────────────────────────────────────────────────────┐
│ Global Error Boundary (app/error.tsx)              │
│  ├─ Catches: Unhandled errors, layout crashes      │
│  ├─ Shows: Generic fallback, contact support       │
│  └─ Logs: Error to monitoring (Sentry/LogRocket)   │
└────────────────────┬────────────────────────────────┘
                     │
                     ↓
     ┌───────────────────────────────────┐
     │ Section Boundary                  │
     │ (dashboard/content-library/       │
     │  error.tsx)                       │
     │  ├─ Catches: Section failures     │
     │  ├─ Shows: Contextual fallback    │
     │  │   ("Tutorials unavailable")    │
     │  └─ Preserves: Rest of dashboard  │
     └────────────┬──────────────────────┘
                  │
                  ↓
      ┌──────────────────────────┐
      │ Component Boundary       │
      │ (ErrorBoundary wrapper)  │
      │  ├─ Catches: Component   │
      │  │   failures             │
      │  ├─ Shows: Inline         │
      │  │   fallback (skeleton)  │
      │  └─ Preserves: Rest of    │
      │     page                  │
      └──────────────────────────┘
```

### Implementation

```typescript
// app/error.tsx (Global)
"use client"
export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log to monitoring service
    logErrorToSentry(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="error-container">
          <h1>Something went wrong</h1>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  )
}

// app/(dashboard)/dashboard/content-library/error.tsx (Section)
"use client"
export default function ContentLibraryError({ error, reset }: ErrorProps) {
  return (
    <div className="section-error">
      <h2>Content Library Unavailable</h2>
      <p>We're having trouble loading the content library.</p>
      <button onClick={reset}>Retry</button>
      <Link href="/dashboard">Return to Dashboard</Link>
    </div>
  )
}

// Component-level (inline)
export default async function ArticleDetail({ slug }: Props) {
  try {
    const article = await articleRepository.getBySlug(slug)
    if (!article) return <ArticleNotFound slug={slug} />
    return <ArticleView article={article} />
  } catch (error) {
    return <ArticleErrorFallback error={error} slug={slug} />
  }
}
```

---

## Type Safety

### Contracts at Every Boundary

1. **API → DTO**: Zod schema validates incoming data
2. **DTO → Domain**: Mapper enforces transformation contract
3. **Repository → Page**: Interface ensures method signatures
4. **Page → Component**: TypeScript props validation

### Example: Article Flow

```typescript
// 1. DTO (external data shape)
const ArticleDTOSchema = z.object({
  id: z.string(),
  attributes: z.object({
    title: z.string(),
    slug: z.string(),
    content: z.string(),
    publishedAt: z.string(),
  }),
});

// 2. Domain Model (internal shape)
interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string; // Computed
  readTime: string; // Computed
  publishedAt: Date; // Parsed
}

// 3. Repository Contract (data access)
interface ArticleRepository {
  getBySlug(slug: string): Promise<Article | null>;
  listAll(): Promise<Article[]>;
}

// 4. View Model (UI props)
interface ArticleDetailViewModel extends Article {
  formattedDate: string;
  readTimeLabel: string;
  relatedArticles: Article[];
}
```

---

## Testing Strategy

### Overview: Test Pyramid & Folder Organization

```
                  /\
                 /  \
                / E2E \              (~10 tests per module)
               /______\             Playwr ight browser tests
              /          \           __tests__/e2e/[module]/
             / Integration\          (~50 tests per module)
            /_______________\        Full data flow validation
           /                  \      __tests__/integration-test/[module]/
          /    Unit Tests      \     (~30 tests per module)
         /________________________\   Individual functions
                                     lib/strapi/ (colocated in future)
```

### Test Categories & Storage

| Layer                            | Type        | Location                               | Focus                             | Tools             |
| -------------------------------- | ----------- | -------------------------------------- | --------------------------------- | ----------------- |
| **Mapper functions**             | Unit        | `lib/strapi/.../__tests__/` (future)   | Transform DTO → Domain            | Vitest            |
| **Repository + Content Builder** | Integration | `__tests__/integration-test/[module]/` | Full data flow (JSON → repo → VM) | Vitest + fixtures |
| **View Model transformers**      | Unit        | `lib/strapi/.../__tests__/` (future)   | Computed properties, formatting   | Vitest            |
| **Components**                   | Component   | `__tests__/` (future)                  | UI rendering, interaction         | Testing Library   |
| **Pages & Routes**               | E2E         | `__tests__/e2e/[module]/`              | Full user journeys                | Playwright        |

### Critical Rule: Repository Tests Are INTEGRATION Tests

Repository tests (which test the data layer: Content Builder + Repository + View Models together) are **always** integration tests, regardless of what layer they're testing.

**Why?** They validate multiple layers working together:

- ✅ Content Builder loads JSON from filesystem
- ✅ Repository queries the loaded data with business logic
- ✅ View Models transform to UI shape
- ✅ Full pipeline is tested end-to-end

**Location:** `__tests__/integration-test/[module]/[domain]-repository.test.ts`

**Example:**

- Content Library: `__tests__/integration-test/content-library/article-repository.test.ts` ← INTEGRATION
- Documentation: `__tests__/integration-test/documentation/strategic-repository.test.ts` ← INTEGRATION (same pattern)

### Folder Structure by Module

#### Content Library (Reference Pattern)

```
lib/strapi/dashboard/content-library/
├── articles/
│   ├── article-repository.ts
│   ├── article-content.ts
│   └── (NO __tests__ folder)
├── tutorials/
│   └── ... (same structure)
├── case-studies/
│   └── ... (same structure)
└── guides/
    └── ... (same structure)

__tests__/
├── integration-test/content-library/     ← Repository tests
│   ├── article-repository.test.ts
│   ├── tutorial-repository.test.ts
│   ├── case-study-repository.test.ts
│   └── guide-repository.test.ts
│
└── e2e/content-library/                  ← Route tests
    ├── articles.spec.ts
    ├── tutorials.spec.ts
    ├── case-studies.spec.ts
    └── guides.spec.ts
```

#### Documentation (New Module - Same Pattern)

```
lib/strapi/documentation/
├── strategic/
│   ├── repository.ts
│   ├── content-builder.ts
│   ├── view-models.ts
│   └── (NO __tests__ folder)
├── cms-reference/
│   └── ... (same structure)
├── app-reference/
│   └── ... (same structure)
└── infrastructure/
    └── ... (same structure)

__tests__/
├── integration-test/documentation/       ← Repository tests
│   ├── strategic-repository.test.ts
│   ├── cms-reference-repository.test.ts  (future)
│   ├── app-reference-repository.test.ts  (future)
│   └── infrastructure-repository.test.ts (future)
│
└── e2e/documentation/                    ← Route tests
    ├── strategic.spec.ts
    ├── cms-reference.spec.ts             (future)
    ├── app-reference.spec.ts             (future)
    └── infrastructure.spec.ts            (future)
```

### Test Commands

```bash
# Run all tests
pnpm test

# Run integration tests only
pnpm test -- __tests__/integration-test

# Run E2E tests (Playwright)
pnpm test:e2e

# Run integration tests for specific module
pnpm test -- __tests__/integration-test/documentation

# Run with coverage
pnpm test -- --coverage
```

### Layers to Test

| Layer            | Test Type   | Focus                | Tools             | Location                               |
| ---------------- | ----------- | -------------------- | ----------------- | -------------------------------------- |
| **Mappers**      | Unit        | Transformation logic | Vitest            | (future: `lib/strapi/.../__tests__/`)  |
| **Repositories** | Integration | Full data flow       | Vitest + fixtures | `__tests__/integration-test/[module]/` |
| **View Models**  | Unit        | Computed properties  | Vitest            | (future: `lib/strapi/.../__tests__/`)  |
| **Components**   | Component   | UI behavior          | Testing Library   | (future: `__tests__/`)                 |
| **Pages/Routes** | E2E         | Full user flows      | Playwright        | `__tests__/e2e/[module]/`              |

### Example: Mapper Test

```typescript
// lib/strapi/dashboard/content-library/articles/mappers/article.mapper.test.ts
import { describe, it, expect } from "vitest";
import { mapArticleDTO } from "./article.mapper";

describe("mapArticleDTO", () => {
  it("should flatten nested structure", () => {
    const dto = {
      id: "1",
      attributes: {
        title: "Test Article",
        slug: "test-article",
        content: "Lorem ipsum...",
        publishedAt: "2026-02-26T10:00:00Z",
      },
    };

    const result = mapArticleDTO(dto);

    expect(result.id).toBe("1");
    expect(result.title).toBe("Test Article");
    expect(result.publishedAt).toBeInstanceOf(Date);
  });

  it("should compute excerpt from content", () => {
    const dto = { /* ... */ content: "A".repeat(500) };
    const result = mapArticleDTO(dto);
    expect(result.excerpt).toHaveLength(150);
  });
});
```

---

## Adding New Sections

### Step-by-Step Guide

1. **Create section structure**

   ```bash
   mkdir -p lib/strapi/dashboard/content-library/new-section/{dto,mappers,schemas}
   ```

2. **Define DTO** (`dto/new-section.dto.ts`)

   ```typescript
   export interface NewSectionDTO {
     id: string;
     attributes: {
       // Match Strapi response shape
     };
   }
   ```

3. **Create Zod schema** (`schemas/new-section-schema.ts`)

   ```typescript
   import { z } from "zod";
   export const NewSectionSchema = z.object({
     // Validation rules
   });
   ```

4. **Implement mapper** (`mappers/new-section.mapper.ts`)

   ```typescript
   export function mapNewSectionDTO(dto: NewSectionDTO): NewSection {
     // Transform logic
   }
   ```

5. **Create repository** (`repository.ts`)

   ```typescript
   export interface NewSectionRepository {
     getBySlug(slug: string): Promise<NewSection | null>;
     listAll(): Promise<NewSection[]>;
   }
   ```

6. **Implement view models** (`view-models.ts`)

   ```typescript
   export function toNewSectionDetailViewModel(item: NewSection) {
     // UI transformation
   }
   ```

7. **Create page** (`app/new-section/[slug]/page.tsx`)

   ```typescript
   export default async function NewSectionPage({ params }) {
     const item = await repository.getBySlug(params.slug)
     const vm = toViewModel(item)
     return <NewSectionView {...vm} />
   }
   ```

8. **Validate**
   ```bash
   pnpm exec tsc --noEmit  # TypeScript
   pnpm run build          # Next.js build
   ```

---

## Summary

This architecture provides:

✅ **Clean separation** - Data, domain, presentation isolated  
✅ **Type safety** - Contracts validated at every boundary  
✅ **Testability** - Each layer tested independently  
✅ **Flexibility** - Easy backend swap, rendering strategy changes  
✅ **Resilience** - Errors isolated to smallest scope  
✅ **Maintainability** - Patterns documented, repeatable

**Result**: CTO-level demonstration of enterprise architecture in modern web development.
