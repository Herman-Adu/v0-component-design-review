# @v0/strapi-mcp — Specification

> Platinum standard MCP server for Strapi 5 + this project's domain.
> Three-layer rollout: bschauer bridge (live) → strapi-content-mcp plugin → @v0/strapi-mcp custom.

---

## Current State — Layer 1 (Live)

`@bschauer/strapi-mcp-server@2.8.0` running as Docker service `v0_strapi_mcp`.

**Transport:** `docker exec -i v0_strapi_mcp strapi-mcp-server` (stdio, zero host surface)
**Network:** internal Docker bridge → `http://v0_strapi:1337`
**Auth:** read-only API token, injected via env var at container start
**Config:** written to container ephemeral fs from env vars, never touches git or host disk

Both Copilot and Claude Code connect identically. Each MCP session spawns an independent
process via `docker exec` — no shared state between agents.

---

## Roadmap — Layer 2

**`strapi-content-mcp`** (PaulBratslavsky) — Strapi plugin, installs inside `apps/strapi/`.
Uses Document Service API directly (no REST overhead). Enables full CRUD from AI agents.
Install when builder migration (Track 2) begins.

---

## Roadmap — Layer 3: @v0/strapi-mcp Custom Server

Built in `apps/strapi-mcp/src/`. Replaces Layer 1. Adds domain-specific tools no
existing server provides.

### Architecture

```
MCP Client (Copilot / Claude Code)
  ↓ stdio (docker exec -i v0_strapi_mcp)
@v0/strapi-mcp server
  ├── Redis cache layer  (v0_redis:6379)
  ├── Ollama router      (v0_ollama:11434)  — zero cloud tokens for cache hits
  └── Strapi REST/DS     (v0_strapi:1337)
        ↕ webhook bridge (POST /_next/revalidateTag)
      Next.js app        (apps/ui)
```

### Tools (29 total)

**Standard (from @bschauer baseline — 20 tools):**
- `strapi_list_content_types`, `strapi_get_content_type`
- `strapi_get_entries`, `strapi_get_entry`, `strapi_create_entry`
- `strapi_update_entry`, `strapi_delete_entry`
- `strapi_upload_media`, `strapi_get_media`
- `strapi_get_components`, `strapi_get_component`
- `strapi_execute_query`, `strapi_get_relations`
- `strapi_get_users`, `strapi_get_roles`
- `strapi_get_settings`, `strapi_update_settings`
- `strapi_get_plugins`, `strapi_get_webhooks`
- `strapi_get_audit_log`

**Domain extensions (9 new tools):**

| Tool | Purpose |
|------|---------|
| `strapi_list_slugs` | List all slugs for a content type — fast sitemap/route validation |
| `strapi_get_entry_by_slug` | Fetch single entry by slug (not numeric ID) |
| `strapi_validate_content` | Pre-write Zod validation against local schema — prevents invalid writes |
| `strapi_get_block_registry` | Return all 39 block type aliases from project SSOT |
| `strapi_bulk_create` | Create multiple entries in one call with rollback on failure |
| `strapi_webhook_revalidate` | Trigger Next.js `revalidateTag` after content change |
| `strapi_get_cache_stats` | Redis hit/miss ratio + estimated token savings |
| `strapi_invalidate_cache` | Force invalidate Redis cache for a content type |
| `strapi_get_seed_status` | Report seeded doc count per collection vs expected total |

### Caching Strategy

All `GET` operations cached in Redis with TTL by content type:
- Static content types (strategic-overview, cms-reference): 24h TTL
- Dynamic (articles, tutorials): 1h TTL
- Cache invalidated automatically on write operations + via `strapi_invalidate_cache`

Cache key format: `strapi:{contentType}:{operation}:{hash(params)}`

### Ollama Routing

Semantic queries routed to `v0_ollama` (llama3.2:3b) when Redis cache misses.
Cloud tokens only consumed for: complex writes, schema inspection, validation.
Tracking via `strapi_get_cache_stats`.

### Zod Validation Layer

All write operations run through local schema validation before hitting Strapi REST.
Schema source: `apps/ui/lib/strapi/dashboard/_shared/block-schema.ts` (39 block types).
Prevents: orphaned blocks, unknown block types, missing required fields.

---

## Docker Service

```yaml
strapi-mcp:
  build: ./apps/strapi-mcp
  container_name: v0_strapi_mcp
  profiles: ["cms"]
  environment:
    STRAPI_MCP_API_URL: http://v0_strapi:1337
    STRAPI_MCP_API_KEY: ${STRAPI_MCP_API_KEY}
  depends_on: [strapi]
  # No ports: — zero host surface
```

Entrypoint writes config from env vars at startup. Container kept alive with
`sleep infinity`. MCP clients connect via `docker exec -i v0_strapi_mcp strapi-mcp-server`.

---

## Security Properties

- API token: env var → ephemeral container fs → never git, never host disk
- Network: Docker bridge only — `v0_strapi:1337`, `v0_redis:6379`, `v0_ollama:11434`
- Zero host ports exposed
- Read-only token for Layer 1; scoped write token for Layer 3
- Zod validation prevents blind writes from AI agents

---

*Layer 1 live: March 4, 2026 | Layer 3 build: Phase 3 (oRPC + MCP session)*
