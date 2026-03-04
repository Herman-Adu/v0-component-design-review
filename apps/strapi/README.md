# Strapi CMS — @v0/strapi

Strapi 5 CMS for the Document Administration monorepo.

## Status

**Not yet initialised.** This directory is a placeholder.
Strapi will be installed here in Track 1 of the implementation roadmap.

## Initialisation (Track 1)

```bash
# From repo root — start Postgres first
docker-compose up -d

# One-time init (creates Strapi project in this directory)
docker-compose --profile cms-init run --rm strapi-init

# Start Strapi dev server
docker-compose --profile cms up -d

# OR run locally (requires Postgres running via Docker)
cd apps/strapi
npx create-strapi-app@latest . --no-run
pnpm develop
```

## Collection Types to Configure

See `STRAPI_COLLECTION_TYPE_SCHEMAS.md` at repo root for the full schema definitions.

8 collection types:
- `api::article.article`
- `api::case-study.case-study`
- `api::guide.guide`
- `api::tutorial.tutorial`
- `api::strategic-overview.strategic-overview`
- `api::cms-reference.cms-reference`
- `api::app-reference.app-reference`
- `api::infrastructure-ops.infrastructure-ops`

## Environment Variables

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=v0_component_design
DATABASE_USERNAME=dev
DATABASE_PASSWORD=dev_local_only
NODE_ENV=development
JWT_SECRET=<generate with: openssl rand -base64 32>
ADMIN_JWT_SECRET=<generate with: openssl rand -base64 32>
APP_KEYS=<four comma-separated random strings>
API_TOKEN_SALT=<generate with: openssl rand -base64 16>
```
