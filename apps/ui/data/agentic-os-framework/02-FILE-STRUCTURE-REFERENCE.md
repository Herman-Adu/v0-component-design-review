# .v0 Folder Structure Reference Guide

## Complete Directory Map

```
.v0/
├── rules.md                    # Constitutional Laws
├── orchestrator.md             # CPU (Task Routing & Model Selection)
├── state.json                  # RAM (Current Project Variables)
├── metrics.md                  # Dashboard (Resource Tracking)
├── archive.md                  # Cold Storage (Completed Work)
├── manifest.md                 # Dense Restart Template
├── scratchpad.md               # Temporary Thinking Space
└── examples/
    ├── dense-syntax.md         # Logic Shorthand Dictionary
    └── hydration-prompts.md    # Restart Template Examples
```

---

## File Specifications

### 1. rules.md (The Constitution)

**Purpose**: Immutable operational law

**Contents**:
```markdown
# v0 Operating Constitution

## Core Mandates
- [List absolute rules that NEVER change]
- [Constraints on what agent can/cannot do]
- [Default behaviors]

## Model Selection Criteria (Cost Order)
- TIER 1 (v0-mini): [Decision rules] - $1/$5 most cost-efficient
- TIER 2 (v0-pro): [Decision rules] - $3/$15 standard features
- TIER 3 (v0-max): [Decision rules] - $5/$25 critical architecture
- TIER 4 (opus-4.6-fast): [Decision rules] - $15/$75 ⚠️ MOST EXPENSIVE, requires approval

## Token Threshold Actions
- 60% quota: [Action]
- 85% quota: [Action]
- 95% quota: [Action]

## Operational Disciplines
- Pre-Flight Check: [Requirements]
- Integrity Check: [Post-code validation]
- Closure Sequence: [Before session end]
```

**Max Size**: 2-3 KB (kept lean for perfect recall)

**Update Frequency**: Between sessions only (user edits)

---

### 2. orchestrator.md (The CPU)

**Purpose**: Task routing, model selection, workflow orchestration

**Contents**:
```markdown
# v0 Orchestrator

## Task Complexity Matrix
| Task Type | Complexity | Model | Tokens | Notes |
|-----------|-----------|-------|--------|-------|
| [Task] | [Low/Med/High] | [Model] | [Est] | [Rationale] |

## Model-Aware Decision Trees
```
IF task == "CSS" THEN model = mini
IF task == "Feature" && complexity < 3 THEN model = pro
...
```

## Operational Skills
- Skill: [Skill_Name]
  - Trigger: [When to activate]
  - Steps: [1. 2. 3.]
  - Output: [What results]

## Context Pruning Rules
- Scope Gate: [What to read]
- No Boilerplate: [What to skip]
- Diff-Only: [When to output diffs vs full files]

## Pressure Response Flowchart
- If health < 50: [Action]
- If tokens < 20%: [Action]
- If task fails 2x: [Action]
```

**Max Size**: 5-8 KB

**Update Frequency**: Every 2-3 sessions (refine based on learnings)

---

### 3. state.json (The RAM)

**Purpose**: Complete project context snapshot

**Structure**:
```json
{
  "project_meta": {
    "id": "unique-session-id",
    "version": "1.0.0",
    "last_model": "v0-pro",
    "health_score": 88,
    "last_updated": "2024-02-12T14:30:00Z"
  },
  "architecture_ram": {
    "stack": ["Next.js 16", "Lucia", "Drizzle", "Shadcn"],
    "active_routes": ["/dashboard", "/api/auth"],
    "db_schema_snapshot": "Users(id, email), Posts(id, authorId)",
    "design_tokens": {
      "primary_color": "#007bff",
      "spacing_unit": "0.25rem"
    }
  },
  "task_stack": {
    "current_sprint": "Auth-Implementation",
    "pending_atomic": [
      "Add Zod validation to login-form.tsx",
      "Test JWT cookie rotation"
    ],
    "resolved_blockers": [
      "Fixed CORS issue in /api/proxy"
    ]
  },
  "token_metrics": {
    "consumed_total": 45200,
    "session_limit": 60000,
    "strategy": "DENSE_MODE_ACTIVE"
  },
  "reheat_pointers": {
    "last_file_edited": "src/components/auth/login-form.tsx",
    "active_logic_branch": "Feature/Lucia-Auth-Setup",
    "immediate_next_step": "Implement server-side cookie verification in middleware.ts",
    "handoff_summary": "Logic defined; session-syncing failed @ line 42"
  }
}
```

**Max Size**: 15-20 KB (keeps everything in one file)

**Update Frequency**: After every significant action

**Read By**: Agent at session start and after every Integrity Check

---

### 4. metrics.md (The Dashboard)

**Purpose**: Resource tracking and health monitoring

**Structure**:
```markdown
# Resource Metrics

## Session Health
- Session Start: [Timestamp]
- Current Health Score: [0-100]
- Tokens Consumed This Session: [#]
- Tokens Remaining in Budget: [#/%]
- Efficiency Target: [80%]

## Token Ledger
| Turn | Task | Model | Estimated | Actual | ∆ | Efficiency |
|------|------|-------|-----------|--------|---|-----------|
| 1 | Setup | mini | 500 | 520 | +20 | 96% |
| 2 | Feature | pro | 2000 | 1850 | -150 | 93% |

## Model Usage Distribution
- v0-mini: [count] turns, [%] of budget
- v0-pro: [count] turns, [%] of budget
- v0-max: [count] turns, [%] of budget

## Pressure Indicators
- Current Pressure Level: [0-100%]
- Last Threshold Crossed: 60% quota @ turn 8
- Recommended Action: [Compact context | Switch to Dense Mode | Prepare for snapshot]

## Efficiency Trend
- Last 5 turns avg: [%]
- Target: [%]
- Status: [On track | Trending high | Critical]
```

**Max Size**: 3-5 KB

**Update Frequency**: After every turn (auto-updated by agent)

---

### 5. archive.md (Cold Storage)

**Purpose**: Completed, tested, stable work (not needed in active context)

**Structure**:
```markdown
# Archive: Completed Features

## Feature: User Authentication (COMPLETE ✅)
- Status: Tested, deployed to production
- Implementation: Lucia + JWT in cookies
- Test Coverage: 92%
- Files: src/lib/auth.ts, src/api/auth/route.ts
- When to revisit: Only if bugs reported
- Related tickets: #AUTH-001, #AUTH-002

## Feature: Email Templates (COMPLETE ✅)
- Status: Delivered, no known issues
- Stack: React Email, SendGrid integration
- Files: src/emails/*, src/api/send-email/route.ts
- Archive reason: Stable, unlikely to change this sprint
```

**Max Size**: Unlimited (grows over time)

**Read By**: Agent only when debugging or hunting for context

**Move From active RAM to archive when**: Task is 100% done + tested + deployed

---

### 6. manifest.md (Restart Template)

**Purpose**: Dense encoding of ALL state for session restart

**Structure**:
```markdown
# REHEAT_SNAPSHOT_V1

## LEVEL_ZERO (Copy to New Chat)
```
HYDRATE_V1: Read /rules.md & /state.json. 
Resume from: [immediate_next_step from state.json]
Mode: DENSE | Health: [health_score]% | Tokens: [remaining]
Confirm hydration and await command.
```

## LOGIC_SHORTHAND
Stack: N15+L:Auth+D:Orzl+U:Shd | Routes: [P,Q,A]
DB: U(id,em),P(id,aId,sts) | UI_Idx: /dash

## PRESSURE_STATE
[Lvl]: [0-5] | [Δ]: src/app/api/auth.ts | [∆_Status]: Incomplete
Last failure: JWT rotation @ line 42 in middleware

## FILE_FOCUS
Current: src/components/auth/login-form.tsx
Imports: [lib/auth, api/validate]
Next file: src/middleware.ts (to implement cookie check)

## ATOMIC_QUEUE
- [ ] Finalise JWT refresh interceptor
- [ ] Test logout + login cycle
- [ ] Deploy to staging
```

**Max Size**: 1-2 KB (extremely dense)

**Generated By**: Agent when /snapshot typed or pressure hits 95%

**Pasted Into**: New chat window to restart seamlessly

---

### 7. scratchpad.md (Thinking Space)

**Purpose**: Temporary notes, half-finished thoughts, debugging traces

**Structure**:
```markdown
# Scratchpad (Temporary)

## Current Debugging Session
- Problem: JWT not persisting in cookie
- Hypothesis: Middleware not reading cookie correctly
- Test steps: [1. 2. 3.]
- Result: [Will update after testing]

## Refactoring Notes
- Considering: Should DB schema be normalized?
- Current: Users table has denormalized 'profile_json'
- Trade-off: Storage vs. query speed
- Decision: Defer until post-launch optimization

## Questions for User
- [ ] Should email verification be async?
- [ ] Max sessions per user: 1 or unlimited?
```

**Max Size**: 2-3 KB (cleaned out between sessions)

**Cleaned By**: Agent during Closure Sequence to avoid bloating context

---

## File Update Triggers

| File | Trigger | Who | Frequency |
|------|---------|-----|-----------|
| rules.md | User edits between sessions | User | As needed |
| orchestrator.md | Lessons learned, TIER adjustments | User | Every 2-3 sessions |
| state.json | After every code action | Agent | Every turn |
| metrics.md | After every code action | Agent | Every turn |
| archive.md | When task marked COMPLETE | Agent | Every sprint |
| manifest.md | When /snapshot called or pressure > 95% | Agent | On demand |
| scratchpad.md | During active debugging | Agent | Cleaned before closure |

---

## File Size Targets

| File | Target | Hard Limit | Why |
|------|--------|-----------|-----|
| rules.md | 2 KB | 5 KB | Must be re-readable every turn |
| orchestrator.md | 5 KB | 10 KB | Decision logic shouldn't be complex |
| state.json | 15 KB | 30 KB | Complete snapshot must fit in context |
| metrics.md | 3 KB | 8 KB | Dashboard, not history |
| archive.md | Unlimited | Unlimited | Old work; referenced rarely |
| manifest.md | 1 KB | 2 KB | Must be copy-pasteable easily |
