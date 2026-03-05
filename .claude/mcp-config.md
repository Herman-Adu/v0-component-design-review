# MCP Server Configuration Guide

## Overview

Multi-agent setup for this project:
- **Claude Code** — primary coding agent (VS Code extension)
- **GitHub Copilot** — autocomplete (rate limited, secondary)
- **MCP Servers** — tools exposed to Claude Code
- **Docker MCP Toolkit** — containerised agent execution (GitHub, Docker, browser tools)

> **Repo is PUBLIC** — GitHub MCP tools (issues, PRs, branches, code search) are fully available.

---

## Active MCP Servers (Docker MCP Toolkit)

The Docker MCP Toolkit is enabled in VS Code and provides the following tools via the `mcp__MCP_DOCKER__*` namespace:

| Tool group | Key tools |
|------------|-----------|
| **GitHub** | `list_pull_requests`, `create_pull_request`, `merge_pull_request`, `list_issues`, `search_code`, `get_file_contents`, `create_branch` |
| **Browser** | `browser_navigate`, `browser_screenshot`, `browser_click`, `browser_fill_form` |
| **Web** | `get_article`, `search_wikipedia`, `summarize_article_for_query` |

Use `ToolSearch` to load deferred Docker MCP tools before calling them.

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
3. This gives Claude Code access to GitHub, browser automation, and Docker container management

**First use in a session:** Load deferred tools with `ToolSearch` before calling:
```
ToolSearch query: "github pull request"   → loads mcp__MCP_DOCKER__create_pull_request etc.
ToolSearch query: "select:mcp__MCP_DOCKER__get_me"   → loads a specific tool
```

---

## Additional MCP Servers (Phase-gated)

### Phase 2 (Strapi + Postgres in Docker — active locally)

```bash
# Natural language SQL against Postgres
npx -y @modelcontextprotocol/server-postgres postgresql://dev:dev@localhost:5432/v0_component_design
```

### Phase 3 (Custom Strapi MCP — planned)

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

---

*Last updated: March 5, 2026*
