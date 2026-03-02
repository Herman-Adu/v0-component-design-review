# New Context Restart Prompt

## Paste This Into a New Chat

You are continuing work in `c:\Users\herma\source\repository\v0-component-design-review`.

Current branch: `feature/import-refactor-2026-03-02`  
Checkpoint commit: `LATEST` (extendable URL policy + documentation in sitemap)

Primary objective:

1. **Documentation dynamic route system is complete and stable** (`/dashboard/documentation/[category]/[slug]`).
2. **Navigation links fixed** - all sidebar links now match actual JSON file slugs (single source of truth).
3. **URL policy extended** - polymorphic support for content-library AND documentation route systems.
4. **Sitemap complete** - includes all 12 documentation routes + 21 content library routes for SEO.
5. **Integration tests complete** for all 4 documentation repositories:
   - ✅ `strategic-overview` (20 tests)
   - ✅ `cms-reference` (19 tests)
   - ✅ `app-reference` (19 tests)
   - ✅ `infrastructure-ops` (19 tests)
6. **Build passes cleanly** - 77 tests passing, all routes generating correctly.

Rules for this continuation:

- Use `lib/content-library/url-policy.ts` for ALL URL generation (polymorphic support)
- Documentation system is **production-ready** and follows content library architecture patterns
- All navigation uses actual slugs from JSON files - no hardcoding, no guessing
- Sitemap automatically includes all dynamic routes from both manifests
- Integration tests cover all repository operations and content validation
- Follow established patterns: generateStaticParams, generateMetadata, URL policy
- Prefer minimal, surgical edits for any future documentation additions

## Recent Work Completed (Commit bdabd08)

**Navigation Fix - Single Source of Truth**:

- Fixed all documentation sidebar links to match actual JSON file slugs
- Removed non-existent routes (overview, getting-started, code-review-log, etc.)
- Aligned with content library architecture: data files are the authority
- Result: All 12 documentation links now work correctly

**Integration Tests Added**:

- `cms-reference-repository.test.ts` (19 tests)
- `app-reference-repository.test.ts` (19 tests)
- `infrastructure-ops-repository.test.ts` (19 tests)
- Mock data files for all three categories
- Total: 77 tests passing across 4 documentation repositories

## Current Status Snapshot

- Dynamic documentation route exists: `app/(dashboard)/dashboard/documentation/[category]/[slug]/page.tsx`
- Documentation route manifest wired for 4 categories: strategic-overview, cms-reference, app-reference, infrastructure-ops
- Repository/schema/builder/view-model stacks exist under:
  - `lib/strapi/dashboard/documentation/strategic-overview/`
  - `lib/strapi/dashboard/documentation/cms-reference/`
  - `lib/strapi/dashboard/documentation/app-reference/`
  - `lib/strapi/dashboard/documentation/infrastructure-ops/`
- Navigation links now match actual content: `data/nav-data.ts` (strategic-overview, cms-reference, app-reference, infrastructure-ops sections)
- Integration tests complete: `__tests__/integration-test/documentation/` (4 test suites, 77 tests total)
- Mock data files: `__tests__/mocks/integration/documentation/` (strategic-overview-data.ts, cms-reference-data.ts, app-reference-data.ts, infrastructure-ops-data.ts)
- Build verification: `pnpm build` passes, `pnpm vitest __tests__/integration-test/documentation --run` passes

## Actual Content Slugs (Single Source of Truth)

**Strategic Overview** (3 documents):

- `system-vision` - System Vision & Principles
- `strapi-decision` - Why Strapi CMS
- `getting-started-overview` - Getting Started Guide

**CMS Reference** (3 documents):

- `form-collections` - Form Collections Backend Schema
- `content-collections` - Content Collections Architecture
- `single-types` - Single Types Global Configuration

**App Reference** (3 documents):

- `component-system` - Component System Frontend Architecture
- `hydration-and-guards` - Hydration and Route Guards
- `server-vs-client` - Server vs Client Components

**Infrastructure Ops** (3 documents):

- `deployment-pipelines` - Deployment Pipelines and CI/CD
- `testing-strategy` - Testing Strategy Quality Gates
- `troubleshooting` - Troubleshooting Guide

## Critical Files Reference

**URL Policy (Single Source of Truth for All Routes)**:

- `lib/content-library/url-policy.ts` - Polymorphic URL generation:
  - `getContentListPath(section)` - routes like `/dashboard/content-library/articles`
  - `getContentDetailPath(section, category, slug)` - routes like `/dashboard/content-library/articles/architecture/type-safety-first`
  - `getDocumentationDetailPath(category, slug)` - routes like `/dashboard/documentation/strategic-overview/system-vision`
  - `getDetailPath(system, category, slug)` - dispatch function for both route systems
  - `toAbsoluteUrl(pathname)` - converts relative to absolute for canonical URLs

**Sitemap (SEO - All Dynamic Routes)**:

- `app/sitemap.ts` - Generates 33 total routes:
  - 5 static routes (home, contact, services, quotation, hubs)
  - 12 documentation routes (from `getDocumentationRouteManifest()`)
  - 21 content library routes (from `getContentRouteManifest()`)

**Dynamic Route (Main Entry Point)**:

- `app/(dashboard)/dashboard/documentation/[category]/[slug]/page.tsx` - Single dynamic route handling all 4 categories

**Navigation (Now Fixed)**:

- `data/nav-data.ts` - Sidebar navigation with correct slugs matching JSON files

**Repository Layer (Data Access)**:

- `lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-repository.ts`
- `lib/strapi/dashboard/documentation/cms-reference/cms-reference-repository.ts`
- `lib/strapi/dashboard/documentation/app-reference/app-reference-repository.ts`
- `lib/strapi/dashboard/documentation/infrastructure-ops/infrastructure-ops-repository.ts`

**Content Builder Layer (JSON Import)**:

- `lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-content-builder.ts` (imports 3 JSON files)
- `lib/strapi/dashboard/documentation/cms-reference/cms-reference-content-builder.ts` (imports 3 JSON files)
- `lib/strapi/dashboard/documentation/app-reference/app-reference-content-builder.ts` (imports 3 JSON files)
- `lib/strapi/dashboard/documentation/infrastructure-ops/infrastructure-ops-content-builder.ts` (imports 3 JSON files)

**Actual Content (Authority)**:

- `data/strapi-mock/dashboard/documentation/strategic-overview/*.json` (3 files)
- `data/strapi-mock/dashboard/documentation/cms-reference/*.json` (3 files)
- `data/strapi-mock/dashboard/documentation/app-reference/*.json` (3 files)
- `data/strapi-mock/dashboard/documentation/infrastructure-ops/*.json` (3 files)

**Integration Tests**:

- `__tests__/integration-test/documentation/strategic-overview-repository.test.ts` (20 tests)
- `__tests__/integration-test/documentation/cms-reference-repository.test.ts` (19 tests)
- `__tests__/integration-test/documentation/app-reference-repository.test.ts` (19 tests)
- `__tests__/integration-test/documentation/infrastructure-ops-repository.test.ts` (19 tests)

**Mock Data (Test Fixtures)**:

- `__tests__/mocks/integration/documentation/strategic-overview-data.ts`
- `__tests__/mocks/integration/documentation/cms-reference-data.ts`
- `__tests__/mocks/integration/documentation/app-reference-data.ts`
- `__tests__/mocks/integration/documentation/infrastructure-ops-data.ts`

## Validation Commands

**Build**:

```bash
pnpm build
```

**All Documentation Tests**:

```bash
pnpm vitest __tests__/integration-test/documentation --run
```

**Dev Server** (to verify navigation links):

```bash
pnpm dev
# Visit: http://localhost:3000/dashboard/documentation/strategic-overview/system-vision
```

**Quick Status Check**:

```bash
git log --oneline -5
git status
```

## Architecture Principles (Established)

1. **Single Source of Truth**: JSON files in `data/strapi-mock/` are the authority
2. **No Hardcoding**: Navigation links, manifests, and URLs all derive from actual content
3. **URL Policy Polymorphism**: `lib/content-library/url-policy.ts` handles both route systems:
   - `getContentDetailPath(section, category, slug)` for content-library routes
   - `getDocumentationDetailPath(category, slug)` for documentation routes
   - `getDetailPath(system, category, slug)` for polymorphic dispatch
   - All used by: pages, navigation, manifests, sitemap, metadata generation
4. **Type Safety**: Zod schemas validate all content at module init; route types prevent invalid combinations
5. **Repository Pattern**: Clean separation: content-builder → repository → view-model → page
6. **Test Coverage**: Integration tests verify all repository operations and content validation
7. **SEO Completeness**: Sitemap includes all dynamic routes (33 total: 12 documentation + 21 content library)

## Handoff Note

This checkpoint represents **completion of documentation system migration + URL policy extension**:

- ✅ Dynamic route architecture matching content library pattern
- ✅ All 4 documentation categories implemented with full stack
- ✅ Navigation links fixed to match actual JSON file slugs
- ✅ URL policy extended to polymorphic support for both route systems
- ✅ Sitemap includes all 12 documentation routes + 21 content library routes
- ✅ Complete integration test coverage (77 tests)
- ✅ Build and tests passing
- ✅ Ready for content additions without architectural changes

**Future Additions**: When adding new documentation categories or content sections:

1. Add JSON files to `data/strapi-mock/`
2. Create repository/schema/builder/view-model stack
3. Update navigation in `data/nav-data.ts` (uses URL policy functions)
4. Add category-specific types to `url-policy.ts` if needed
5. Sitemap and metadata generation work automatically via manifests
6. No hardcoding required
