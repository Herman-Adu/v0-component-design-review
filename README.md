# Document Administration Portal

Enterprise-grade document and content administration platform built on Next.js 16 (App Router) with a Strapi 5 CMS backend.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/hermanadus-projects/v0-component-design-review)
[![CI](https://github.com/Herman-Adu/v0-component-design-review/actions/workflows/ci.yml/badge.svg)](https://github.com/Herman-Adu/v0-component-design-review/actions/workflows/ci.yml)

## Stack

- **Frontend:** Next.js 16 (App Router) · TypeScript strict · Tailwind CSS · shadcn/ui
- **CMS:** Strapi 5 (Docker locally; JSON fallback on Vercel)
- **Validation:** Zod · 6-layer data architecture
- **Testing:** Vitest (148 tests) · Playwright (E2E)
- **Deploy:** Vercel (production) · GitHub Actions CI

## Architecture

All data flows through a strict 6-layer pattern:

```
Schema → Content Builder → Repository → View Models → Facade → Routes/Pages
```

Full details: [`ARCHITECTURE.md`](ARCHITECTURE.md) · [`STRAPI_DYNAMIC_ZONES_AUTHORITY.md`](STRAPI_DYNAMIC_ZONES_AUTHORITY.md)

## Development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # Full build + content validation
pnpm test         # 148 integration tests
```

**With Strapi (full stack):**
```bash
docker compose --env-file .env.docker --profile cms up -d
# Strapi admin: http://localhost:1337/admin
```

## AI Assistant Context

See [`CLAUDE.md`](CLAUDE.md) for Claude Code session context, architecture rules, and coding standards.
