# Claude Code Skills & Sub-Agents

## Recommended Custom Skills for This Project

Skills live in `~/.claude/skills/` and are invoked with `/skill-name`.

---

### `/architecture-review`

**Trigger:** After implementing any schema, repository, view model, or content builder file.
**Purpose:** Validate code against this project's governance rules.

Checks:
- Schema export is PascalCase
- `import "server-only"` present on builders/repositories
- No inline MetaSchema or TocItemSchema (must import from `_shared/`)
- Type exports complete: Document, Meta, Block, TocItem, Level, Category
- Authority reference header present
- No `props: z.record(z.unknown())` (must use strict shared blockSchema)
- No drift from sibling content types

---

### `/strapi-block`

**Trigger:** When asked to create a new content block type.
**Purpose:** Enforce the block proposal process from `STRAPI_DYNAMIC_ZONES_AUTHORITY.md`.

Checks:
- Reuse-first checklist (can existing block + CSS solve this?)
- If new block justified: generates JSON shape, Zod schema, React component sketch
- Adds to BLOCK_TYPE_ALIASES in `_shared/block-schema.ts`
- Updates `BLOCK_PROPOSAL_<NAME>.md`

---

### `/view-model`

**Trigger:** When creating or reviewing a view model file.
**Purpose:** Enforce the standard view model pattern.

Generates:
- `DetailViewModel` extending `BaseDetailViewModel` from `_shared/base-view-model.ts`
- `ListItemViewModel` (summary-only, no blocks)
- `toDetailViewModel(source)` transformation function
- `toListItemViewModel(source)` function
- SEO fallback chain in detail view model

---

### `/content-layer`

**Trigger:** When adding a new content type or module.
**Purpose:** Scaffold the full 6-layer architecture for a new type.

Generates (in order):
1. `[type]-schema.ts` with PascalCase export + shared imports + authority header
2. `[type]-content-builder.ts` with server-only + static load pattern
3. `[type]-repository.ts` with server-only + repoLogger + standard methods
4. `[type]-view-models.ts` with Detail + ListItem view models
5. Integration test file in `__tests__/integration-test/[module]/`
6. Mock data file in `__tests__/mocks/integration/[module]/`

---

### `/drift-check`

**Trigger:** Before committing or at end of session.
**Purpose:** Detect drift between the 8 content types.

Compares:
- Schema export naming (all PascalCase?)
- Type exports (all have same set?)
- Repository methods (content-library has getByCategory + getByLevel?)
- Builder patterns (all use server-only?)
- Meta schema (all import from `_shared/content-meta-schema.ts`?)

---

## Installing Skills in Claude Code

Skills are markdown files in `~/.claude/skills/[skill-name].md`.

```bash
# On Windows
mkdir %USERPROFILE%\.claude\skills

# Create a skill file
# ~/.claude/skills/architecture-review.md
```

**Skill file format:**
```markdown
# Architecture Review

When invoked, review the provided code file(s) against this project's governance rules...

[detailed instructions here]
```

---

## Sub-Agent Patterns

For complex tasks, Claude Code can spawn sub-agents:

### Code Review Sub-Agent
Spawn with `code-reviewer` type for:
- Post-implementation review against SOLID principles
- Schema consistency audit across multiple files
- View model standardization verification

### Explore Sub-Agent
Spawn with `Explore` type for:
- Finding all files that need updating for a refactor
- Searching for drift patterns across content types
- Understanding an unfamiliar part of the codebase

### Plan Sub-Agent
Spawn with `Plan` type before:
- Multi-file refactors (e.g. standardizing all 8 schemas)
- New module implementation
- Any change touching more than 3 files

---

## Copilot Skills (Instructions Files)

Copilot reads `.github/copilot-instructions.md` for project-wide context.
The postman instruction files in root (`postman-*.instructions.md`) are Copilot skill files.

Create `.github/copilot-instructions.md` with a summary of:
- 6-layer architecture pattern
- Naming conventions
- What NOT to generate (no inline MetaSchema, no camelCase schema exports)
