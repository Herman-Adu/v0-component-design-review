# MCP Server Configuration Guide

## Overview

Multi-agent setup for this project:
- **Claude Code** — primary coding agent (VS Code extension)
- **GitHub Copilot** — autocomplete (rate limited, secondary)
- **MCP Servers** — tools exposed to both agents
- **Docker MCP Toolkit** — containerised agent execution

---

## Claude Code MCP Settings

Add to `~/.claude/settings.json` (global) or `.claude/settings.json` (project-local):

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/herma/source/repository/v0-component-design-review"
      ]
    },
    "git": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-git",
        "--repository",
        "C:/Users/herma/source/repository/v0-component-design-review"
      ]
    }
  }
}
```

---

## VS Code MCP Settings (Copilot Agent Mode)

Add to `.vscode/settings.json`:

```json
{
  "github.copilot.chat.mcp.servers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/herma/source/repository/v0-component-design-review"
      ],
      "type": "stdio"
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-git", "--repository", "."],
      "type": "stdio"
    }
  }
}
```

---

## Docker MCP Toolkit

1. Open VS Code command palette → `Docker: Enable MCP Toolkit`
2. Or via Docker extension settings → MCP Servers tab
3. This lets agents manage containers (Postgres, Redis, Strapi) via tool calls

---

## MCP Servers — Install Order

### Phase 1 (Now — immediately useful)

```bash
# Filesystem access
npx -y @modelcontextprotocol/server-filesystem .

# Git context (log, diff, branch)
npx -y @modelcontextprotocol/server-git --repository .

# URL fetching (API docs, Strapi REST reference)
npx -y @modelcontextprotocol/server-fetch
```

### Phase 2 (When Strapi + Postgres are running in Docker)

```bash
# Natural language SQL against Postgres
npx -y @modelcontextprotocol/server-postgres postgresql://dev:dev@localhost:5432/v0_component_design
```

### Phase 3 (Custom Strapi MCP — when Strapi is live)

Build a custom MCP server using `@modelcontextprotocol/sdk`:

**Planned tools:**
- `generate_content_json` — generate schema-compliant JSON from a description
- `validate_content_schema` — run Zod validation on a content JSON file
- `list_slugs` — list all slugs from a collection type
- `get_block_registry` — return BLOCK_TYPE_ALIASES with descriptions
- `create_strapi_entry` — POST a new content entry to Strapi REST API

---

## Shared MCP Across Claude + Copilot

Both Claude Code and Copilot in VS Code can share the same MCP servers.
Configure in `.vscode/settings.json` with `github.copilot.chat.mcp.servers`
and in `~/.claude/settings.json` with `mcpServers`.

This means both agents can call the same tools — useful when switching between them
to manage rate limits.
