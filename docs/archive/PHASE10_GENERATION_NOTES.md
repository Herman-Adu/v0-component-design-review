# PHASE 10: Platinum Standard Architecture - DTO/Mapper/Repository Pattern

**Date:** 2026-02-26  
**Status:** In Progress - Foundation  
**Focus:** Enterprise-grade architecture with DTO/Mapper/Repository tiers, Features layer, oRPC readiness

---

## Executive Summary

Phase 10 represents a **paradigm shift** from content migration to **platinum standard architecture**. We're implementing enterprise patterns from C#/.NET (DTO/Mapper/Repository) in the TypeScript/Next.js stack, creating a foundation that supports:

- Clean separation of concerns (data layer → domain → presentation)
- Backend-agnostic frontend (easy Strapi → oRPC migration)
- Component reusability across contexts (SSG/SSR/ISR)
- Type-safe contracts at every boundary
- Graceful error handling with hybrid boundary strategy

This phase transforms the codebase into a **CTO-level portfolio piece** demonstrating 30 years of engineering discipline applied to modern web development.

---

## Architectural Vision

### Data Layer (C# Enterprise Pattern Applied)

```
┌─────────────────────────────────────────────────────────┐
│ Strapi API / Mock JSON                                  │
│  (External data source - could be anything)             │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│ DTOs (Data Transfer Objects)                            │
│  - Exact shape of API response                          │
│  - No business logic                                    │
│  - Validated with Zod at build time                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Mappers                                                  │
│  - Transform DTO → Domain Model                         │
│  - Enrichment, normalization, defaults                  │
│  - Contract boundary (isolated, testable)               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Repository (Data Access Layer)                          │
│  - Interface-based (pluggable implementations)          │
│  - Methods: getBySlug, list, listByCategory, etc.      │
│  - Server-only (import "server-only")                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│ View Models                                              │
│  - Domain → UI-specific shape                           │
│  - Computed properties, formatting, filtering           │
│  - Props for components                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│ Pages (SSG/SSR/ISR)                                     │
│  - Call repository methods                              │
│  - Pass view models to components                       │
│  - No data logic, orchestration only                    │
└─────────────────────────────────────────────────────────┘
```

### Features Layer (Component Reusability)

```
features/
├── content-library/           # Reusable content components
│   ├── components/
│   │   ├── article-card.tsx
│   │   ├── tutorial-detail.tsx
│   │   └── case-study-grid.tsx
│   ├── hooks/
│   │   └── use-content-filter.ts
│   └── types.ts
│
├── news-hub/                  # Public news aggregation
│   ├── components/
│   │   ├── featured-grid.tsx
│   │   └── latest-updates.tsx
│   └── view-models/
│       └── news-hub-vm.ts     # Aggregates multiple repositories
│
└── admin/                     # Gated admin features
    ├── components/
    └── view-models/
```

### Error Boundary Strategy (Hybrid)

```
Global (app/error.tsx)
├─ Catches: Catastrophic failures, unhandled errors
├─ Shows: Generic fallback, contact support
└─ Logs: Error to monitoring (Sentry/LogRocket)

Section-level (app/(dashboard)/dashboard/content-library/error.tsx)
├─ Catches: Section-specific failures
├─ Shows: Contextual fallback ("Tutorials unavailable")
└─ Allows: Navigation to other sections

Component-level (ErrorBoundary wrapper per component)
├─ Catches: Individual component failures
├─ Shows: Inline fallback (skeleton, empty state)
└─ Preserves: Rest of page functionality
```

---

## Phase 10 Objectives

### 1. Foundation Architecture

- [x] Document platinum standard (ARCHITECTURE.md)
- [x] Document future roadmap (ROADMAP.md)
- [x] Document infrastructure vision (INFRASTRUCTURE.md)
- [ ] Restructure file organization (list configs into section folders)
- [ ] Implement DTO/Mapper/Repository tiers (tutorials first)
- [ ] Create features layer structure
- [ ] Implement error boundary hierarchy

### 2. Content Library Refactor (Platinum Pattern)

- [ ] **Tutorials**
  - [ ] Move tutorials-list.json → tutorials/tutorials-list.json
  - [ ] Implement DTO/Mapper/Repository
  - [ ] Delete data/content-library/tutorials.tsx usage
  - [ ] Update all imports
  - [ ] Validate build

- [ ] **Articles**
  - [ ] Move articles-list.json → articles/articles-list.json
  - [ ] Implement DTO/Mapper/Repository
  - [ ] Delete data/content-library/articles.tsx usage
  - [ ] Validate build

- [ ] **Case Studies**
  - [ ] Move case-studies-list.json → case-studies/case-studies-list.json
  - [ ] Implement DTO/Mapper/Repository
  - [ ] Delete data/content-library/case-studies.tsx usage
  - [ ] Validate build

- [ ] **Guides**
  - [ ] Move guides-list.json → guides/guides-list.json
  - [ ] Implement DTO/Mapper/Repository
  - [ ] Validate build

### 3. Features Layer Implementation

- [ ] Create features/content-library/ (shared components)
- [ ] Migrate components from pages to features
- [ ] Create features/news-hub/ (public aggregation)
- [ ] Update pages to import from features
- [ ] Document component APIs

### 4. Public Pages (Content Reuse)

- [ ] /news (ISR, aggregates articles + tutorials)
- [ ] /case-studies (ISR, showcases projects)
- [ ] /blog (ISR, latest articles)
- [ ] Create view-models that pull from multiple repositories

### 5. Dashboard Cleanup

- [ ] Clean dashboard root (only ~11 files)
- [ ] Move scattered files into organized folders
- [ ] Update routes and imports

---

## Current Progress

### Completed ✅

- Strategic planning and architectural alignment
- Decision matrix documented
- Error boundary strategy defined
- Validation strategy confirmed (strict build, graceful runtime)
- oRPC contract structure planned

### In Progress 🚧

- Creating foundation documentation (ARCHITECTURE.md, ROADMAP.md, INFRASTRUCTURE.md)
- File reorganization (list configs into section folders)

### Queued 📋

- DTO/Mapper/Repository implementation (tutorials first)
- Features layer scaffolding
- Error boundary implementation

---

## Key Decisions

| Decision                           | Outcome                                        | Rationale                                     |
| ---------------------------------- | ---------------------------------------------- | --------------------------------------------- |
| **data/content-library/ deletion** | Keep until fully migrated                      | Document in MIGRATION_CHECKLIST.md            |
| **Repository location**            | `lib/strapi/` with DTO/Mapper/Repository tiers | Mirrors C# enterprise architecture            |
| **Features layer**                 | YES, implement from day 1                      | Prevents component duplication, enables reuse |
| **SSG vs SSR**                     | Per-page decision matrix                       | Different contexts need different rendering   |
| **Validation**                     | Strict at build, graceful at runtime           | Fails fast in dev, fails safe in prod         |
| **Data fetching**                  | oRPC (not tRPC)                                | Better chaining, type safety, modern patterns |
| **Error boundaries**               | Global + Section + Component (hybrid)          | Graceful degradation, separation of concerns  |
| **List configs**                   | Move into section folders                      | Self-contained sections, easier cleanup       |

---

## Future Roadmap Integration

### Docker + Postgres (Documented in INFRASTRUCTURE.md)

- Local development environment with Docker Compose
- Postgres with volume mounts (data persistence across restarts)
- Seed scripts for data restoration
- **Pain point solved**: No more data loss during research

### MCP Servers (Documented in ROADMAP.md)

- Model Context Protocol integration
- Docker MCP toolkit for containerized requests
- **Positioning**: 30 years experience + cutting-edge tooling

### oRPC Migration (Documented in ROADMAP.md)

- End-to-end type safety
- Chaining functionality
- Contract-based repository interfaces
- **Preparation**: Repository abstraction survives the switch

---

## Validation Strategy

### Build-time (Strict)

```bash
pnpm exec tsc --noEmit  # TypeScript compilation
# → Fails if any type errors
# → Fails if Zod validation fails on JSON import

pnpm run build          # Next.js build
# → Fails if any route errors
# → Fails if generateStaticParams invalid
# → Validates all SSG pages
```

### Runtime (Graceful)

```typescript
// Component-level error boundary
try {
  const tutorial = await getTutorialBySlug(slug);
  return <TutorialView tutorial={tutorial} />;
} catch (error) {
  return <TutorialErrorFallback slug={slug} />; // Graceful
}
```

---

## Success Criteria

- ✅ All content sections use DTO/Mapper/Repository pattern
- ✅ All list configs moved into section folders
- ✅ Features layer operational, components reused
- ✅ Error boundaries at all levels (global + section + component)
- ✅ Build passes with strict validation
- ✅ No usage of legacy data/content-library/\*.tsx files
- ✅ Documentation complete (ARCHITECTURE.md, ROADMAP.md, INFRASTRUCTURE.md)
- ✅ Dashboard root cleaned up (~11 files)

---

## Next Steps

1. Create ARCHITECTURE.md (platinum standard documentation)
2. Create ROADMAP.md (Docker, Postgres, MCP, oRPC vision)
3. Create INFRASTRUCTURE.md (DevOps and deployment strategy)
4. Move tutorials-list.json → tutorials/ and update imports
5. Implement DTO/Mapper/Repository for tutorials
6. Repeat for articles, case-studies, guides
7. Create features layer and migrate components
8. Implement error boundary hierarchy
9. Clean up dashboard root

---

**Estimated Timeline**: 2 weeks (foundation + content library + features + cleanup)

**Portfolio Impact**: CTO-level demonstration of enterprise architecture in modern stack

**Technical Debt Eliminated**: Legacy patterns, scattered files, inconsistent data access
