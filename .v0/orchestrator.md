# Orchestrator: Operational Instructions
# Agentic OS Framework v1.1
# Purpose: Workflow gates, model selection, execution protocol
# Separation: This file = "HOW to work". rules.md = "DON'Ts". state.json = "WHERE we are". metrics.md = "COST".

---

## MODEL MATRIX (Single Source of Truth - Foundation Layer)

**CRITICAL RULE:** Model selection → metrics.md MUST update immediately. This is the guard rail preventing resource overrun.

### v0 Models: Definitions, Capabilities, Constraints

| Model | Tier | Cost/Token | Context Limit | Best For | Budget/Session | Health DENSE Budget |
|-------|------|-----------|---|---|---|---|
| **v0 Mini** | TIER 1 | Base (1x) | 50k tokens | Single-file edits, styling, copy, scripts, research | 50k tokens | 25k tokens |
| **v0 Pro** | TIER 2 | 2x cost | 100k tokens | Medium complexity, mixed workloads, balanced | 100k tokens | 50k tokens |
| **v0 Max** | TIER 3 | 3x cost | 150k tokens | Architecture, multi-file, complex debugging, orchestration | 150k tokens | 75k tokens |
| **v0 Max Fast** | TIER 4 | 2x cost, speed | 100k tokens | Time-critical complex (analysis only, NO code gen) | 100k tokens | 50k tokens |

### GATE: Model Selection → Metrics Update (Non-Negotiable)

**When any model is selected or changed during a session:**
1. ✓ Identify selected model (from decision tree below)
2. ✓ **IMMEDIATELY update `.v0/metrics.md` with that model's budget**
3. ✓ Recalculate remaining tokens against NEW model's budget
4. ✓ Adjust op budget if task exceeds new budget
5. ✓ Document model change + reason in session note

**Violation Protocol:** If model changes without metrics update = STOP + return to GATE 1 (approval).

### Health Mode Budget Per Model

| Health Status | Mode | v0 Mini Budget | v0 Pro Budget | v0 Max Budget | v0 Max Fast |
|---|---|---|---|---|---|
| ≥ 50% | FULL | 50k | 100k | 150k | 100k |
| 20-50% | DENSE | 25k | 50k | 75k | 50k |
| < 20% | RECOVERY | 15k | DEFER | DEFER | DEFER |

### Model Selection Decision Tree (Health-Aware)

```
START: What is the task?

1. Single-file edit, styling, copy, or research?
   → v0 Mini (TIER 1) - 50k budget
   
2. Complex task (architecture, multi-file, debugging)?
   → CHECK HEALTH:
      IF Health ≥ 50%:     → v0 Max (TIER 3) - 150k budget
      IF Health 20-50%:    → v0 Pro (TIER 2) - 100k budget
      IF Health < 20%:     → v0 Mini (TIER 1) - 15k budget (or DEFER)
      
3. Time-critical complex analysis (no code generation)?
   → CHECK HEALTH:
      IF Health ≥ 50%:     → v0 Max Fast (TIER 4) - 100k budget
      IF Health < 50%:     → v0 Pro (TIER 2) - 100k budget
      
4. Research or documentation?
   → v0 Mini (TIER 1) - 50k budget

5. Default (uncertain):
   → v0 Mini (TIER 1) - 50k budget

THEN: Update metrics.md with selected model's budget (CRITICAL GUARD)
```

### Example: Model Change Triggers Metrics Reset

**Scenario:**
- Session starts: Health = 78%, Task = "Review 5-file architecture"
- Decision: v0 Max (150k budget)
- metrics.md updated: `Current Model: v0 Max | Budget: 150k | Remaining: 150k`
- Work starts...
- After 60k tokens: "Actually, let's switch to v0 Pro for faster analysis"
- **GUARD RAIL TRIGGERS:**
  - Model changes: v0 Max → v0 Pro
  - metrics.md MUST update: `Current Model: v0 Pro | Budget: 100k | Remaining: 40k (recalculated)`
  - Tokens already used (60k) stay charged, but NEW budget is 100k (model switch, not violation)
  - Continue work with v0 Pro's 40k remaining budget

---

## SESSION INITIALIZATION PROTOCOL v2.0 (KING-LEVEL ORCHESTRATION)

**Purpose:** Health-first framework loading with dynamic resource allocation. Executes BEFORE any work begins.

### Step 1: HEALTH CHECK (Non-Negotiable - First)
Read: `.v0/metrics.md`
- ✓ Token budget remaining? (out of 200k)
- ✓ Health status? (FULL/DENSE/RECOVERY)
- ✓ Violation count? (triggers Rule 12)

**Decision Logic:**
```
IF Health ≥ 50%:        → FULL mode (proceed normally)
IF Health 20-50%:       → DENSE mode (30k context limit)
IF Health < 20%:        → RECOVERY mode (defer non-critical work or split across sessions)
```

### Step 2: FRAMEWORK LOAD (Auto-Load in Order)
Read (establish context foundation):
1. `.v0/state.json` → "Where are we?" (phase, task, budget)
2. `.v0/rules.md` → "What are the constraints?" (hard rules + learnings)
3. `.v0/orchestrator.md` → "How do we operate?" (THIS FILE - framework)
4. `.v0/PHASE_STATE.md` → "What's implemented?" (current state)
5. `.v0/metrics.md` → "What's the cost?" (already read in Step 1)

### Step 3: CONTEXT ANALYSIS (Third)
User's request:
- What are they asking? (feature, debug, review, etc.)
- What GATE applies? (1-7 from this file)
- Is this within op budget? (from state.json)

### Step 4: DYNAMIC MODEL SELECTION (Fourth - CTO-Level Decision)

Use MODEL MATRIX (above) decision tree to select model based on [task type + current health]:
- Single-file? → v0 Mini (always)
- Complex + Health ≥ 50%? → v0 Max (150k budget)
- Complex + Health 20-50%? → v0 Pro (100k budget)
- Complex + Health < 20%? → DEFER or v0 Mini (15k budget)
- Time-critical analysis? → v0 Max Fast (analysis only, no code generation)

**CRITICAL:** After model selection, IMMEDIATELY jump to GATE below.

### Step 5: GATE VALIDATION + METRICS UPDATE (Fifth - Guard Rails)

**Before proceeding, verify:**
- ✓ **GATE 1:** User explicitly approved this work?
- ✓ **GATE 7:** Task within scope + op budget?
- ✓ **Context Budget:** Tokens sufficient for SELECTED MODEL's budget?
- ✓ **METRICS UPDATED:** metrics.md shows correct model + budget?

**CRITICAL GUARD RAIL:** If model selection changed DURING session:
1. Do NOT proceed without updating metrics.md
2. Recalculate remaining tokens against NEW model's budget
3. Verify new budget has sufficient headroom for task
4. Document model change reason in session note
5. Resume work with NEW model's constraints

**If any gate fails:** Ask for clarification or defer work to next session.

### Step 6: SESSION ANNOUNCEMENT (Sixth - Transparency)
Display on EVERY first response:
```
**SESSION INITIALIZED**
Branch: [from GitHub context]
Phase: [from state.json]
Active Task: [from state.json]
Op Budget: 15 (or remaining)
Health: [from metrics.md] - FULL/DENSE/RECOVERY
Model Selected: [v0 Max/Mini - with reason]
Context Loaded: [5 files from .v0/]
```

Example:
```
**SESSION INITIALIZED**
Branch: v0/herman-adu-phaseN
Phase: 8 - TypeScript Types Layer
Active Task: 8A - Create strapi-mock types
Op Budget: 15
Health: 78% - FULL mode
Model Selected: v0 Mini (TIER 1) - Type definitions + page updates (GATE 7 rule)
Context Loaded: state.json, rules.md, orchestrator.md, PHASE_STATE.md, metrics.md
```

### Step 7: PROCEED WITH WORK
- Reference PHASE_STATE.md for context during execution
- Follow gates (stop after features, validate before declaring complete, etc.)
- Update state.json at CHECKPOINT (op budget 7.5/15)
- Display resource view on EVERY response
- Document violations/learnings in real-time

### Step 8: SESSION CHECKPOINT (Mid-Session - Ops 7.5/15)
- Review work completed
- Update metrics.md with token usage
- Assess if continuing or deferring remaining work
- Decide: next phase prep vs defer to next session

### Step 9: SESSION CLOSE
- Final state.json update (what's done, what's next)
- Finalize metrics.md (health score, total tokens used)
- Prepare `.v0/PHASE_STATE.md` for next session

---

## LEGACY: Session Startup Protocol (Replaced by v2.0 Above)

This section documents the protocol it supersedes. See v2.0 above for current protocol.

### OLD: 1. Read Essential Files (Every Session Start)
```
DEPRECATED - Use Step 2 of SESSION INITIALIZATION PROTOCOL v2.0 instead
```

### OLD: 2. Display Resource View (EVERY Response)
```
DEPRECATED - Resource view now part of SESSION ANNOUNCEMENT (Step 6 of v2.0)
```

### OLD: 3. Classify Task and Select Model
```
DEPRECATED - Replaced by DYNAMIC MODEL SELECTION (Step 4 of v2.0)
```

### OLD: 4. Await User Command
```
DEPRECATED - Gate validation (Step 5) now ensures this
```

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

## Phase Execution Workflow (Collaborative Cycle)

### Phase N Lifecycle

**v0's Turn: Create Phase Framework**
1. Deep analysis of codebase
2. Review user's `PHASEn-1_GENERATION_NOTES.md` (learnings from previous phase)
3. Generate `/data/PHASEn_EXECUTION_GUIDE.md` (what user does locally)
4. Generate `/data/PHASEn_SCRIPTS/` (ready-to-run scripts)
5. Update `.v0/rules.md` (phase-specific constraints)
6. Update `.v0/state.json` (current phase + op budget)
7. Update `.v0/PHASE_STATE.md` (current implementation state)
8. Push to GitHub

**User's Turn: Local Implementation**
1. `git checkout v0/herman-adu-phaseN` (pull latest)
2. Review `/data/PHASEn_EXECUTION_GUIDE.md`
3. Run `/data/PHASEn_SCRIPTS/` (ready-to-run scripts)
4. Validate: `npm run build && npm run dev`
5. Create `PHASEn_GENERATION_NOTES.md` in root (document learnings)
6. Commit & push: `git commit -m "feat: Phase N complete"`

**Feedback Loop: Framework Evolution**
1. User pushes `PHASEn_GENERATION_NOTES.md` (learnings from local implementation)
2. v0 pulls + deep reviews
3. v0 updates `.v0/rules.md` with learnings
4. v0 updates `.v0/PHASE_STATE.md` with progress
5. v0 prepares `/data/PHASEn+1_EXECUTION_GUIDE.md`
6. Next chat: auto-load `.v0/state.json` + `.v0/rules.md` + `.v0/PHASE_STATE.md` + refined framework

### File Location Strategy (Bulletproof Architecture)

| Location | File | Owner | Purpose | Auto-Load? |
|----------|------|-------|---------|-----------|
| Root | `PHASEn_GENERATION_NOTES.md` | User | Learnings after local implementation | NO |
| `/data/` | `PHASEn_EXECUTION_GUIDE.md` | v0 | What user does locally this phase | NO |
| `/data/` | `PHASEn_SCRIPTS/` | v0 | Ready-to-run scripts | NO |
| `/data/` | `PHASEn_CONTEXT.md` | v0 | Context from previous phase | NO |
| `.v0/` | `orchestrator.md` | v0 | THIS FILE - operational framework | YES |
| `.v0/` | `rules.md` | v0 | Constraints + learnings evolved per phase | YES |
| `.v0/` | `state.json` | v0 | Checkpoint (phase, task, budget, status) | YES |
| `.v0/` | `metrics.md` | v0 | Cost tracking | YES |
| `.v0/` | `PHASE_STATE.md` | v0 | Current implementation state (auto-updated) | YES |

**Principle:** Root contains only user-generated learnings. Framework lives in `.v0/` (auto-loaded). Phase guidance lives in `/data/` (pulled with phase).

### Git Workflow (Safety First)

**Before ANY Operation:**
```bash
git branch --show-current           # Where am I?
git status                          # Anything uncommitted?
```

**User Running Phase Scripts:**
```bash
1. git checkout v0/herman-adu-phaseN
2. Read /data/PHASEn_EXECUTION_GUIDE.md
3. Run /data/PHASEn_SCRIPTS/phaseN-*.js (or .ts)
4. npm run build                     # STOP if fails
5. npm run dev                       # Test locally
6. Create PHASEn_GENERATION_NOTES.md in root
7. git add .
8. git commit -m "feat: Phase N implementation complete"
9. git push origin v0/herman-adu-phaseN
```

**v0 Pulling Learnings:**
```bash
git fetch origin
git checkout v0/herman-adu-phaseN
Read PHASEn_GENERATION_NOTES.md
Update .v0/rules.md with improvements
Update .v0/PHASE_STATE.md with progress
Create /data/PHASEn+1_EXECUTION_GUIDE.md
```

### Emergency Protocol

**If Something Fails:**
1. **STOP immediately** (GATE 1 - never proceed without user confirmation)
2. **Document error** in chat (what failed, where, when)
3. **v0 analyzes + provides fix** (update state.json)
4. **User re-runs** with fixes applied
5. **Continue** from checkpoint

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

*Orchestrator v2.1 | Last Updated: 2026-02-24 | MODEL MATRIX (Foundation) + SESSION INITIALIZATION PROTOCOL v2.0 + Guard Rails*
