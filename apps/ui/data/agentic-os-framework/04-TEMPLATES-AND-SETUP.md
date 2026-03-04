# Templates & Setup Guides

## Template 1: rules.md (Starting Point)

```markdown
# v0 Operating Constitution

## SECTION 1: CORE MANDATES

### Law 1: Single Responsibility Per Response
- One atomic task per prompt response
- One file focus per task
- Complete full validation before declaring task "done"

### Law 2: State Integrity
- Every code output must sync state.json
- Never write code without pre-flight check
- Always begin response with Pulse Header

### Law 3: Token Consciousness
- Track token consumption in every response
- Never exceed budget without user approval
- Trigger closure protocol at 85% quota

### Law 4: Model Discipline (Cost-Aware Selection)
- TIER 1 (v0-mini): CSS tweaks, copy, metrics - $1/$5 (MOST COST-EFFICIENT)
- TIER 2 (v0-pro): Standard features, API, hooks - $3/$15
- TIER 3 (v0-max): Architecture refactors, debugging - $5/$25
- TIER 4 (opus-4.6-fast): Critical quality work ONLY - $15/$75 (MOST EXPENSIVE) ⚠️ Requires approval

### Law 5: Escalation on Pressure
- At 60%: Context compaction
- At 85%: Feature freeze
- At 95%: Force snapshot

---

## SECTION 2: OPERATIONAL DISCIPLINES

### Discipline 1: Pre-Flight Check
Before writing code:
- [ ] Read .v0/rules.md
- [ ] Read .v0/state.json
- [ ] Verify task aligns with pending_tasks
- [ ] Confirm health_score and budget

### Discipline 2: Pre-Code Validation
Before writing code:
- [ ] Cross-reference against state.json - does it align?
- [ ] Import validation - do all new imports exist?
- [ ] Scope check - is this small surface (2 files max)?
- [ ] Variable sync - all new variables in state.json?

### Discipline 3: Post-Code Validation
After writing code:
- [ ] Syntax verified by reading file back
- [ ] All imports correct and available
- [ ] No new TypeScript errors
- [ ] state.json and metrics.md updated
- [ ] "Immediate Next Step" clearly defined

### Discipline 4: Closure Sequence
Before session ends:
1. Validate all pending tasks (started/blocked/complete)
2. Update metrics.md with actual token usage
3. Sync state.json with all changes
4. Clean scratchpad.md of temporary notes
5. Generate handoff summary

---

## SECTION 3: SPECIAL MODES

### Dense Mode (Activated when health < 50%)
- Minimal prose, code-only explanations
- Use logic shorthand instead of full explanations
- Output diffs instead of full file rewrites
- No unnecessary comments in code

Example:
```
Instead of:
"I've updated the login component to add error handling
with a try-catch block that displays user-friendly messages..."

Write:
"Added error handling (try-catch) to LoginForm.tsx"
```

### Emergency Mode (Activated when tokens < 10%)
- Refuse new code
- Output state snapshot only
- Direct user to new chat window with Hydration Prompt

---

## SECTION 4: PROJECT-SPECIFIC NOTES

[To be filled by project owner]

- Project Stack: [Next.js, Lucia, Drizzle, etc.]
- Design System: [Shadcn, Tailwind, custom]
- Database Schema: [Brief summary]
- API Pattern: [RESTful, tRPC, etc.]
- Critical Constraints: [Any hard rules]
```

---

## Template 2: state.json (Starting Point)

```json
{
  "project_meta": {
    "id": "your-project-name-20240212",
    "version": "1.0.0",
    "last_model": "v0-pro",
    "health_score": 100,
    "last_updated": "2024-02-12T09:00:00Z"
  },
  "architecture_ram": {
    "stack": [
      "Next.js 16",
      "Lucia Auth",
      "Drizzle ORM",
      "Shadcn/ui",
      "Tailwind CSS"
    ],
    "active_routes": [
      "/dashboard",
      "/api/auth"
    ],
    "db_schema_snapshot": "Users(id, email, password_hash), Posts(id, authorId, title, content, status)",
    "design_tokens": {
      "primary": "#007bff",
      "secondary": "#6c757d",
      "spacing_unit": "0.25rem",
      "font_family": "Inter"
    }
  },
  "task_stack": {
    "current_sprint": "Initial Setup",
    "pending_atomic": [
      "Create project structure",
      "Setup authentication scaffolding",
      "Build login form UI"
    ],
    "resolved_blockers": []
  },
  "token_metrics": {
    "consumed_total": 0,
    "session_limit": 60000,
    "strategy": "FULL_MODE"
  },
  "reheat_pointers": {
    "last_file_edited": "app/page.tsx",
    "active_logic_branch": "Feature/Initial-Setup",
    "immediate_next_step": "Create authentication schema with Drizzle",
    "handoff_summary": "Project initialized; ready to begin development"
  }
}
```

---

## Template 3: metrics.md (Starting Point)

```markdown
# Resource Metrics

## Session Health
- Session Start: 2024-02-12 09:00:00
- Current Health Score: 100/100
- Tokens Consumed This Session: 0
- Tokens Remaining: 60,000 / 60,000 (100%)
- Efficiency Target: 85%

## Token Ledger
| Turn | Task | Model | Estimated | Actual | Variance | Efficiency |
|------|------|-------|-----------|--------|----------|------------|
| -    | -    | -     | -         | -      | -        | -          |

## Model Usage Distribution (Cost Order)
- v0-mini (TIER 1): 0 turns, 0% of budget - $1/$5 (Most cost-efficient)
- v0-pro (TIER 2): 0 turns, 0% of budget - $3/$15
- v0-max (TIER 3): 0 turns, 0% of budget - $5/$25
- opus-4.6-fast (TIER 4): 0 turns, 0% of budget - $15/$75 ⚠️ MOST EXPENSIVE

## Pressure Indicators
- Current Pressure Level: 0%
- Last Threshold Crossed: None
- Recommended Action: Proceed normally

## Efficiency Trend
- Last 5 turns average: N/A
- Target: 85%
- Status: Not started
```

---

## Template 4: orchestrator.md (Starting Point)

```markdown
# v0 Orchestrator

## Task Complexity Matrix

| Task Type | Complexity | Model (TIER) | Est. Tokens | Cost | Notes |
|-----------|-----------|--------------|-------------|------|-------|
| CSS/Styling | LOW | v0-mini (T1) | 200-500 | $1/$5 | Most cost-efficient |
| Copy/Text Updates | LOW | v0-mini (T1) | 100-300 | $1/$5 | No dependencies |
| Component Creation | MEDIUM | v0-pro (T2) | 1000-2500 | $3/$15 | Logic + styling |
| API Integration | MEDIUM | v0-pro (T2) | 1500-3000 | $3/$15 | State coordination |
| Multi-file Refactor | HIGH | v0-max (T3) | 3000-6000 | $5/$25 | Architectural reasoning |
| Bug Investigation | HIGH | v0-max (T3) | 2000-4000 | $5/$25 | Deep logic analysis |
| Critical Quality Work | CRITICAL | opus-4.6-fast (T4) | 1000-5000 | $15/$75 | ⚠️ MOST EXPENSIVE - Requires approval |

## Routing Decisions

```
IF task == "styling" OR task == "copy"
  model = v0-mini (TIER 1)
  reason: Low cognitive load, most cost-efficient
  cost: $1/$5

ELSE IF task == "component" AND dependencies < 3
  model = v0-pro (TIER 2)
  reason: Medium complexity
  cost: $3/$15

ELSE IF task == "api" OR task == "integration"
  model = v0-pro (TIER 2)
  reason: Cross-cutting, needs testing
  cost: $3/$15

ELSE IF task == "refactor" OR dependencies > 5
  model = v0-max (TIER 3)
  reason: High complexity, architectural
  cost: $5/$25

ELSE IF task == "critical" AND user_approved == true
  model = opus-4.6-fast (TIER 4)
  reason: Highest quality required
  cost: $15/$75 (MOST EXPENSIVE)
  warning: Monitor every 3 turns, switch to lower tier ASAP

IF tokens_remaining < 20%
  override to v0-mini (TIER 1)
  reason: Budget conservation

IF tokens_remaining < 10%
  refuse new code
  reason: Emergency mode
```

## Operational Skills

### Skill: Pre-Flight Check
- **Trigger**: Start of every session
- **Steps**:
  1. Read .v0/rules.md
  2. Read .v0/state.json
  3. Validate task aligns with pending_tasks
  4. Check health_score and budget
- **Output**: "✅ Pre-Flight Check Complete"

### Skill: Context Compaction
- **Trigger**: Tokens consumed > 60%
- **Steps**:
  1. Delete completed items from task_stack
  2. Summarize resolved_blockers to one line
  3. Clean scratchpad.md
  4. Verify state.json is current
- **Output**: "Context compacted, [N] items cleaned"

### Skill: Generate Snapshot
- **Trigger**: Tokens > 95% or user types /snapshot
- **Steps**:
  1. Run Closure Sequence
  2. Generate Hydration Prompt
  3. Output copy-paste block
- **Output**: HYDRATE_V1 block for new chat window

## Context Pruning Rules

- **Scope Gate**: Only read files in `reheat_pointers.last_file_edited` + direct imports
- **No Boilerplate**: If component exists in components/ui, reference from architecture_ram.stack
- **Diff-Only**: When health < 50%, output diffs instead of full rewrites
- **Variable Scope**: Only track variables in state.json, don't read entire codebase

```

---

## Template 5: archive.md (Starting Point)

```markdown
# Archive: Completed Work

[Empty at project start - grows as features complete]

---

## How to Move Work from Active to Archive:

When a feature is:
- ✅ Code complete
- ✅ Testing passed
- ✅ Deployed or merged

Move from state.json.task_stack.pending_atomic to archive.md:

## Feature: [Feature Name] (COMPLETE ✅)
- Status: [Deployed to production | Merged to main]
- Files: [List of files involved]
- Test Coverage: [%]
- Related Tickets: [#TICKET-001, etc]
- When to revisit: Only if bugs reported or enhancement needed
- Learnings: [Any insights from implementation]
```

---

## Setup Checklist

### Day 0: Initialize Agentic OS

```
☐ Create .v0/ folder in project root
☐ Create .v0/rules.md (copy Template 1 above)
☐ Create .v0/state.json (copy Template 2 above)
☐ Create .v0/metrics.md (copy Template 3 above)
☐ Create .v0/orchestrator.md (copy Template 4 above)
☐ Create .v0/archive.md (copy Template 5 above)
☐ Create .v0/scratchpad.md (empty file, ready for use)
☐ Create .v0/manifest.md (see procedures for content)
☐ Commit .v0/ folder to git

☐ Edit rules.md with project-specific constraints
☐ Edit state.json with actual stack and routes
☐ Edit orchestrator.md with actual task matrix

☐ Start first session with "HYDRATE" prompt (see procedures)
```

### First Session

```
☐ User pastes /snapshot content from setup
☐ Agent reads rules.md and state.json
☐ Agent confirms understanding in output
☐ User confirms workflow is active
☐ First task begins with Pre-Flight Check
```

### Ongoing

```
- Every session: Agent reads .v0/rules.md first
- Every response: Pulse Header is emitted
- Every code change: state.json is updated
- Every 5 turns: Agent performs metrics audit
- At 60% quota: Context compaction triggered
- At 85% quota: Feature freeze + closure protocol
- At 95% quota: Forced snapshot + new window
```
