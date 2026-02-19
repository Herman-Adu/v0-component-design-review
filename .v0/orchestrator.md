# Orchestrator: Operational Instructions
# Agentic OS Framework v1.1
# Purpose: Workflow gates, model selection, execution protocol
# Separation: This file = "HOW to work". rules.md = "DON'Ts". state.json = "WHERE we are". metrics.md = "COST".

---

## Session Startup Protocol

### 1. Read Essential Files (Every Session Start)
```
PRIORITY 1: Read immediately
- .v0/state.json (checkpoint: current task, phase, blockers)
- .v0/rules.md (constraints and violation history)
- .v0/metrics.md (health score, token budget, model usage)
```

### 2. Display Resource View (EVERY Response -- Non-Negotiable)
```
RESOURCE VIEW
Health: [score]% | Used: ~[n]k / 200k | Model: [name] (TIER [n]) | Mode: [FULL/DENSE]
Task: [from state.json active_work.current_task]
```

### 3. Classify Task and Select Model (BEFORE any work)
See GATE 7 below.

### 4. Await User Command
- Do not assume next task
- Read active_work.current_task from state.json
- Ask for clarification if needed

---

## HARD ENFORCEMENT GATES (NON-NEGOTIABLE)

Violating any gate is a framework failure. Each gate is a blocking rule.

### GATE 1: Never Proceed Without User Confirmation
```
IF user says "test first" or feature awaits validation:
  STOP. Update state.json. Wait for user response.
  DO NOT explore, map, or begin next feature.
  DO NOT run parallel searches for future work.
```

### GATE 2: One Feature Per Response
```
IF current feature is complete:
  1. Update state.json with completion
  2. Run validation checklist
  3. Report results to user with RESOURCE VIEW
  4. STOP. Do not start next feature in same response.
  Wait for explicit user instruction to proceed.
```

### GATE 3: Write Checkpoint BEFORE Starting Work
```
IF starting a multi-step task:
  1. Write active_task to state.json FIRST
  2. THEN begin work
  Never start work with active_task = null
```

### GATE 4: State is Source of Truth
```
IF state.json says "blocked" or "awaiting_validation":
  DO NOT proceed past that gate.
  DO NOT start exploring next task.
  Report status and WAIT.
```

### GATE 5: Resource Management is Automatic
```
EVERY response must:
  1. Start with RESOURCE VIEW (health, model, mode)
  2. Read state.json checkpoint INSTEAD of re-reading files when possible
  3. Track token usage silently
  User should NEVER have to remind about resource management.
```

### GATE 6: Questions Require Answers
```
IF I ask the user a question:
  STOP all other work.
  DO NOT proceed in parallel.
  DO NOT assume an answer.
  Wait for explicit response.
```

### GATE 7: Model Selection is Mandatory (NEW)
```
BEFORE every task:
  1. Classify the task using the Model Selection Matrix below
  2. Select the appropriate TIER
  3. Declare the model in the RESOURCE VIEW
  4. If health < 20%, force TIER 1 regardless of task

This is NOT optional. Every task must have a declared model tier.
Choosing v0-max for a TIER 1 task is a framework violation.
```

---

## Model Selection Matrix (ENFORCED)

### Classification Rules

| Task Type | TIER | Model | Cost | Examples |
|-----------|------|-------|------|----------|
| Simple edits | 1 | v0-mini | $1/$5 | Fix links, update text, simple CSS, string replacements, rename variables |
| Standard work | 2 | v0-pro | $3/$15 | Import updates, component edits, API routes, pattern-based refactoring |
| Architecture | 3 | v0-max | $5/$25 | Multi-file refactors, new feature design, complex migrations, system design |
| Critical/Complex | 4 | opus-4.6-fast | $15/$75 | Production debugging, security audits, framework redesign (USER APPROVAL REQUIRED) |

### Decision Flowchart
```
1. Is this a string replacement, link fix, copy change, or simple edit?
   YES -> TIER 1 (v0-mini)

2. Is this a standard feature, import update, or single-component change?
   YES -> TIER 2 (v0-pro)

3. Does this require architectural decisions, multi-file coordination, or new patterns?
   YES -> TIER 3 (v0-max)

4. Is this critical production work or framework-level redesign?
   YES -> Request TIER 4 approval from user

5. Override: Health < 20% -> Force TIER 1 regardless
6. Override: Health < 10% -> REFUSE new work, generate snapshot
```

### Target Distribution
```
TIER 1 (v0-mini):  40% of tasks  -- mechanical, repetitive, simple
TIER 2 (v0-pro):   30% of tasks  -- standard development work
TIER 3 (v0-max):   25% of tasks  -- architecture, complex features
TIER 4 (opus):      5% of tasks  -- critical only, user-approved
```

### TIER 4 Approval Template
```
TIER 4 REQUEST
Task: [description]
Reason: [why lower tiers insufficient]
Estimated tokens: [range]
Proceed? (yes/no)
```

---

## Task Execution Protocol

### Before Every Task
1. Display RESOURCE VIEW
2. Classify task (GATE 7)
3. Read state.json checkpoint
4. Write active_task to state.json (GATE 3)

### During Task
1. Use targeted edits (Edit tool, not full rewrites)
2. Focus on changed files only
3. Checkpoint after each phase for multi-step work

### After Task
1. Update state.json (active_work, active_task)
2. Update metrics.md (token usage, model used)
3. Display RESOURCE VIEW with results
4. STOP (GATE 2) -- do not chain to next task

---

## Health Monitoring (Automatic)

```
100-80% = FULL mode (normal operation)
 79-60% = FULL mode (begin considering compaction)
 59-40% = DENSE mode (shorter responses, fewer parallel searches)
 39-20% = DENSE mode (strict checkpoint-driven, minimal reads)
 19-10% = CRITICAL (refuse new features, closure protocol)
  <10%  = EXHAUSTED (force state export, handoff template)
```

### Mode Behaviours
- **FULL:** Normal verbosity, parallel searches OK, full exploration
- **DENSE:** Short responses, checkpoint-first, minimal file reads, no unnecessary exploration

---

## Handoff Template (Health < 20%)
```
HYDRATE_V1:
Read .v0/rules.md, .v0/state.json, .v0/metrics.md
Resume from: [immediate_next_step]
Mode: DENSE | Health: [score]%
Confirm hydration and await command.
```

---

*Orchestrator v1.1 | Last Updated: 2026-02-16*
