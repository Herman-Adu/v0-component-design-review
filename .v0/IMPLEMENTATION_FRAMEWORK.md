# COMPREHENSIVE IMPLEMENTATION FRAMEWORK DOCUMENT
## Operational Guide for Platinum Standard v0 Workflows

**Last Updated:** 2/12/2026  
**Version:** 1.0  
**Purpose:** Step-by-step implementation of Agentic OS framework

---

## PART 1: SETUP PHASE (Initial Configuration)

### 1.1 Directory Structure

Create this structure in your project root:

```
project-root/
├── .v0/
│   ├── rules.md                 # Constitution (Permanent laws)
│   ├── orchestrator.md          # CPU (Decision logic)
│   ├── state.json               # RAM (Current project state)
│   ├── metrics.md               # Dashboard (Resource tracking)
│   ├── context.md               # Knowledge base (Immutable constraints)
│   ├── archive.md               # Cold storage (Completed features)
│   ├── scratchpad.md            # Thinking space (Work notes)
│   └── examples/                # Reference library
│       ├── components.tsx
│       ├── api-routes.ts
│       └── styling-patterns.md
├── src/
└── [rest of project]
```

### 1.2 File Creation Checklist

**Turn Zero Task:** Initialize all .v0 files with templates below

#### [ ] `.v0/rules.md` - THE CONSTITUTION

```markdown
# PROJECT OPERATING RULES

## 1. MODEL SELECTION (Task Routing)

### TIER 1: v0-Mini (Fast, Cheap)
- CSS tweaks, styling refinements
- Copy/content updates
- Simple component boilerplate
- State/metrics file updates
- Code reviews, linting
**Budget:** ~500 tokens | **Use when:** Simple, single-file changes

### TIER 2: v0-Pro (Balanced)
- Standard feature development (1-2 days of work)
- API integrations
- Complex React hooks
- Multi-file coordinated changes
- Database migrations
**Budget:** ~2000 tokens | **Use when:** Medium complexity

### TIER 3: v0-Max (Expensive)
- Architectural refactors
- Multi-file cascading changes
- Debugging logic errors
- Initial project scaffolding
**Budget:** ~5000+ tokens | **Use when:** Complexity > Pro capacity

## 2. TOKEN GUARDRAILS (Non-Negotiable)

| Threshold | Status | Action |
|-----------|--------|--------|
| 0-60% | NORMAL | Standard workflow |
| 60-85% | CAUTION | Begin context compaction |
| 85-95% | CRITICAL | Closure protocol, dense mode only |
| 95%+ | FORCED EXIT | Generate snapshot, end session |

## 3. INTEGRITY REQUIREMENTS

### Pre-Code (Before Writing)
- [ ] Read .v0/state.json
- [ ] Verify task in pending_atomic
- [ ] Check for architecture conflicts
- [ ] Confirm model selection

### Post-Code (After Writing)
- [ ] Verify output ≤ 2 files / 50 lines
- [ ] Confirm all imports exist
- [ ] Update state.json with changes
- [ ] Update metrics.md with token estimate

### Validation Failures
- If pre-code check fails → **HALT and ASK for clarification**
- If post-code check fails → **REVERT and FIX in same response**
- Never proceed with validation errors

## 4. HEARTBEAT PROTOCOL

Every response must start with:
```
<!-- PULSE: [SESSION_HEALTH: XX%] | [EST_TOKENS_REMAINING: YYYY] | [ACTIVE_MODEL: v0-Mini/Pro/Max] | [STATE_SYNC: YES/NO] -->
```

## 5. DENSE MODE ACTIVATION

When SESSION_HEALTH < 20%:
- Omit explanations already in state.json
- Use logic shorthand (see orchestrator.md)
- Code-first, minimal prose
- Skip boilerplate verification

## 6. EMERGENCY HALT CONDITIONS

**STOP immediately if:**
- Hallucinating file paths that don't exist
- Referencing incomplete work as complete
- Ignoring integrity checks
- Token estimate exceeded by >20%

**Action:** Revert to last known good state and ask for clarification.
```

#### [ ] `.v0/orchestrator.md` - THE CPU

```markdown
# ORCHESTRATION & DECISION LOGIC

## CORE SKILLS

### Skill: [Pre-Flight_Check]
**Trigger:** Start of every task
**Steps:**
1. Read .v0/state.json completely
2. Verify task in pending_atomic list
3. Check active_logic_branch for conflicts
4. Cross-reference with architecture_ram
5. If conflict found → HALT and ask for clarification

**Outcome:** GREEN ✓ (proceed) or RED ✗ (stop, clarify)

### Skill: [Integrity_Check]
**Trigger:** After code is written, before response
**Pre-Code Steps:**
1. Confirm request matches state.json.pending_atomic
2. Verify all files exist in project
3. Check imports against architecture_ram.stack

**Post-Code Steps:**
1. Verify output file count ≤ 2
2. Verify line additions ≤ 50 (unless justified)
3. Confirm all new imports/exports exist
4. Check that no files were hallucinated

**Completion:**
1. Update state.json with files edited
2. Update metrics.md with token estimate
3. Mark task complete or escalate to pending

### Skill: [Closure_Sequence]
**Trigger:** When pressure > 85% or user types /snapshot
**Steps:**
1. Read all .v0 files
2. "Zip" current context into dense format
3. Generate Hydration Manifest
4. Provide handoff summary
5. Offer copy-paste block for new session

**Output:** Hydration_Manifest (see Section 5)

### Skill: [Context_Reheat]
**Trigger:** User starts new session with /HYDRATE or REHEAT prompt
**Steps:**
1. Ignore previous chat history completely
2. Read .v0/rules.md
3. Read .v0/state.json
4. Assume identity based on project_meta
5. Resume from immediate_next_step in state.json

**Validation:** Ask user to confirm project name and last file edited

### Skill: [Session_Handoff]
**Trigger:** Detected pressure warning or /snapshot command
**Steps:**
1. Consolidate all .v0 files
2. Compress chat history into restart_template.md
3. Provide copy-paste Hydration block
4. Confirm with user: "State locked. Ready for new window?"

---

## MODEL ROUTING DECISION TREE

```
START: New task arrives

Is it a single-file CSS/UI change?
  → YES: v0-Mini
  → NO: Continue

Is it copy/content update or boilerplate?
  → YES: v0-Mini
  → NO: Continue

Does it require 1-2 files with single-branch logic?
  → YES: v0-Pro
  → NO: Continue

Does it require 3+ files or cascading changes?
  → YES: v0-Pro (unless logic is broken)
  → NO: Continue

Is this a refactor, architectural change, or logic bug?
  → YES: v0-Max
  → NO: Unclear - default to v0-Pro

END: Route to selected model
```

---

## DENSE MODE SHORTHAND DICTIONARY

**When SESSION_HEALTH < 20%, use:**

### Technology Stack
- `Nx` = Next.js
- `Luc` = Lucia Auth
- `Drz` = Drizzle ORM
- `Shd` = Shadcn UI
- `Zod` = Zod validation

### Operations
- `→` = Implement/create
- `✓` = Completed/verified
- `✗` = Failed/broken
- `Δ` = Changed/modified
- `Σ` = Summary/status
- `λ` = Logic/behavior

### Locations
- `P` = Page
- `C` = Component
- `A` = API route
- `M` = Middleware
- `H` = Hook
- `U` = Utility

### Example Dense Output
Instead of:
```
I will create a new API route at /api/auth that handles 
JWT token refresh. It will verify the current token, 
generate a new one, and return it with proper headers.
```

Use:
```
→ A/auth.ts | JWT refresh logic | Verify current token ✓ | Gen new token ✓ | Headers set ✓
```

---

## CONTEXT PRUNING RULES

**For v0-Mini/Pro:** Read only files listed in state.json.reheat_pointers.last_file_edited and direct imports

**For v0-Max:** Can read full project, but prioritize logic structure over boilerplate

**Never:** Generate imports for components that exist in components/ui folder; reference from architecture_ram.stack instead

**Diff-Only Mode:** When health_score < 50, output only diff blocks rather than full file rewrites

---

## EMERGENCY CIRCUIT BREAKER

**IF** agent fails the same task twice:
1. Auto-escalate to v0-Max for one turn
2. Run debug-only dry-run (no file writes)
3. Isolate root cause
4. Drop back to v0-Mini/Pro for actual implementation
5. Log failure in state.json for retrospective

**Benefit:** Prevents burning Max tokens on implementation when logic is wrong
```

#### [ ] `.v0/state.json` - THE RAM

```json
{
  "project_meta": {
    "id": "YOUR_PROJECT_ID",
    "version": "1.0.0",
    "last_model": "v0-pro",
    "health_score": 100,
    "created_at": "2026-02-12",
    "last_updated": "2026-02-12"
  },

  "architecture_ram": {
    "stack": [
      "Next.js 16",
      "React 19",
      "Tailwind CSS v4",
      "Shadcn/ui",
      "TypeScript"
    ],
    "active_routes": [
      "/dashboard",
      "/documentation"
    ],
    "db_schema_snapshot": {
      "description": "Brief description of main tables",
      "tables": ["users", "posts", "comments"]
    },
    "design_tokens": {
      "primary_color": "#[hex]",
      "spacing_unit": "0.25rem"
    }
  },

  "task_stack": {
    "current_sprint": "DESCRIBE_CURRENT_WORK",
    "pending_atomic": [
      "Task 1: Specific, 1-2 hour work",
      "Task 2: Specific, 1-2 hour work"
    ],
    "in_progress": [
      "CURRENT_FILE.tsx: Description of what needs to happen"
    ],
    "resolved_blockers": [
      "RESOLVED_ISSUE: How it was fixed"
    ]
  },

  "token_metrics": {
    "consumed_total": 0,
    "session_start_quota": 200000,
    "session_limit": 60000,
    "current_session_used": 0,
    "strategy": "STANDARD",
    "efficiency_target": 1500
  },

  "reheat_pointers": {
    "last_file_edited": "src/components/Example.tsx",
    "active_logic_branch": "Feature/ExampleFeature",
    "immediate_next_step": "Add validation to form component",
    "handoff_summary": "Form component structure complete. Next: Add Zod validation to input fields."
  }
}
```

#### [ ] `.v0/metrics.md` - THE DASHBOARD

```markdown
# RESOURCE METRICS DASHBOARD

## SESSION STATUS
- **Session Start Time:** [timestamp]
- **Session Health:** [0-100%]
- **Current Pressure Level:** [Low/Medium/High/Critical]
- **Time Elapsed:** [duration]

## TOKEN ACCOUNTING
| Metric | Value |
|--------|-------|
| Total Quota | 200,000 |
| Consumed This Session | 0 |
| Remaining | 200,000 |
| Remaining % | 100% |
| Estimated End Time | [based on burn rate] |

## MODEL ALLOCATION
| Model | Assigned | Used | Remaining |
|-------|----------|------|-----------|
| v0-Mini | 50% | 0 | Full |
| v0-Pro | 40% | 0 | Full |
| v0-Max | 10% | 0 | Full |

## EFFICIENCY TRACKING
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Tokens/Task | 1500 | TBD | ⏳ |
| Tasks/Session | 5 | 0 | ⏳ |
| Error Rate | <5% | 0% | ✓ |
| Hallucination Rate | 0% | 0% | ✓ |

## COMPRESSION TRIGGERS
- [ ] 60% used → Begin context compaction
- [ ] 85% used → Activate closure protocol
- [ ] 95% used → Force snapshot and new session

## LAST UPDATED
- **Time:** [timestamp]
- **Updated By:** [v0-Mini/Pro/Max]
- **Action:** [Task description]
```

#### [ ] `.v0/context.md` - KNOWLEDGE BASE

```markdown
# PROJECT CONTEXT & IMMUTABLE CONSTRAINTS

## PROJECT OVERVIEW
- **Name:** [Project Name]
- **Purpose:** [What this project does]
- **Tech Stack:** [Main technologies]

## DIRECTORY STRUCTURE
```
src/
├── app/                    # Next.js 16 App Router
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                # Shadcn components
│   └── [domain]/          # Feature components
├── lib/                   # Utilities and helpers
├── api/                   # API routes
└── styles/                # Global styles
```

## DESIGN SYSTEM TOKENS

### Colors
- **Primary:** [hex]
- **Secondary:** [hex]
- **Neutral:** [hex]
- **Error:** [hex]

### Typography
- **Font Family:** [font]
- **Line Height:** [value]
- **Letter Spacing:** [value]

### Spacing Scale
- **Base Unit:** 0.25rem (4px)
- **sm:** 0.5rem (8px)
- **md:** 1rem (16px)
- **lg:** 1.5rem (24px)
- **xl:** 2rem (32px)

## COMPONENT LIBRARY LOCATION
- **Path:** `src/components/ui/`
- **Source:** Shadcn/ui
- **Naming:** Always import from components/ui, never recreate
- **Customization:** Use design tokens, not inline colors

## API ENDPOINTS
| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/... | GET | ... |
| /api/... | POST | ... |

## DATABASE SCHEMA
**Users Table:**
- id (primary key)
- [other fields]

**[Other Tables]:**
- id (primary key)
- [other fields]

## CRITICAL RULES
1. Always use existing components from src/components/ui
2. Never add dependencies without explicit approval
3. All styling uses Tailwind CSS v4
4. All forms use React Hook Form + Zod validation
5. Database queries use [ORM/tool]

## NO-GO AREAS
- ❌ Direct style imports for Shadcn components
- ❌ Inline CSS or style attributes
- ❌ Creating custom versions of Shadcn components
- ❌ Modifying core layouts without review
```

#### [ ] `.v0/archive.md` - COLD STORAGE

```markdown
# ARCHIVED FEATURES (100% Complete)

## Feature: [Feature Name]
**Date Completed:** [date]
**Status:** ✓ Tested and deployed
**Files:** [list of files]
**Summary:** [Brief description]

### Implementation Details
[Brief notes on how it was done - for future reference only]

### Tests
- ✓ Unit tests passing
- ✓ Integration tests passing
- ✓ Manual testing complete

---

## [Future completed features go here]
```

### 1.3 Initialization Task

**First v0 Prompt - "INITIALIZE PROJECT":**

```
INITIALIZE_PROJECT:

1. Create .v0/state.json with project_meta, architecture_ram, and task_stack filled in
2. Create .v0/metrics.md with starting values (0 tokens used)
3. Update .v0/context.md with our actual project structure and design tokens
4. Create .v0/scratchpad.md (empty, ready for working notes)

Before proceeding with any feature work, confirm all .v0 files are populated and valid.
```

---

## PART 2: OPERATIONAL PHASE (Day-to-Day Workflow)

### 2.1 Start of Session

**Every new chat, user says:**
```
START_SESSION

Read .v0/rules.md and .v0/state.json.
Confirm you understand the operating constraints.
Ready for task.
```

**Agent responds:**
```
<!-- PULSE: [SESSION_HEALTH: 100%] | [EST_TOKENS_REMAINING: 200000] | [ACTIVE_MODEL: TBD] | [STATE_SYNC: YES] -->

v0 Agent Initialized ✓
- Rules loaded ✓
- Project state: [project_name]
- Last work: [reheat_pointers.immediate_next_step]
- Ready for task ✓

Awaiting command.
```

### 2.2 Task Execution Loop

**For each task:**

1. **PRE-FLIGHT** (Skill: Pre-Flight_Check)
   - Agent reads state.json
   - Verifies task in pending_atomic
   - Selects optimal model tier
   - Confirms with user if tier > Pro

2. **PLANNING** (Skill depends on complexity)
   - If Tier 1: Skip planning, proceed to code
   - If Tier 2: Brief 1-line plan
   - If Tier 3: Detailed plan, wait for approval

3. **EXECUTION**
   - Agent maintains Heartbeat header
   - Makes changes following integrity rules
   - Posts responses with dense output if pressure > 80%

4. **VALIDATION** (Skill: Integrity_Check)
   - Pre-code checks
   - Post-code checks
   - Update state.json and metrics.md

5. **COMPLETION**
   - Update pending_atomic (move to resolved or next item)
   - Report token cost
   - Await next task

### 2.3 Pressure Management

**When SESSION_HEALTH reaches 60%:**
```
Context Compaction Initiated

Actions taken:
- Removed completed features from state.json → archive.md
- Compressed explanation text
- Activated "need-to-know" principle
- Recommend /snapshot for new session within 5 tasks
```

**When SESSION_HEALTH reaches 85%:**
```
<!-- PULSE: [SESSION_HEALTH: 85%] | [EST_TOKENS_REMAINING: 30000] | [ACTIVE_MODEL: v0-Pro] | [STATE_SYNC: YES] -->

🔴 CRITICAL PRESSURE - Closure Protocol Activated

Remaining actions: Bug fixes and critical path only.
New features: BLOCKED until next session.
Mode: DENSE

Next task must fit in ~30,000 tokens.
After this task, recommend /snapshot for new session.
```

**When SESSION_HEALTH reaches 95%:**
```
<!-- PULSE: [SESSION_HEALTH: 95%] | [EST_TOKENS_REMAINING: 10000] | [ACTIVE_MODEL: v0-Mini] | [STATE_SYNC: YES] -->

🛑 FORCED EXIT IMMINENT

No new work accepted. Generating Hydration Snapshot.

Type /snapshot to receive handoff package.
```

### 2.4 The /snapshot Command

**User types:** `/snapshot`

**Agent generates:**

```
HYDRATION_SNAPSHOT_READY

Copy the block below and paste it into a new v0 chat window.

---BEGIN HYDRATION MANIFEST---

HYDRATE_V1:
I am a v0 agent in continuous workflow for [PROJECT_NAME].

1️⃣ Read these files:
   - .v0/rules.md (Operating Constitution)
   - .v0/state.json (Project State)

2️⃣ Current Status:
   - Last Work: [reheat_pointers.last_file_edited]
   - Next Step: [reheat_pointers.immediate_next_step]
   - Sprint: [task_stack.current_sprint]
   - Health: Ready for cold start

3️⃣ Architecture:
   Stack: [architecture_ram.stack joined]
   DB: [db_schema_snapshot brief]
   Routes: [active_routes list]

4️⃣ Immediate Actions:
   - Verify project matches above
   - Confirm last file: [last_file]
   - Resume from: [immediate_next_step]

Mode: EFFICIENT | Ready: /START

---END HYDRATION MANIFEST---

Paste this block into new window. Session will resume seamlessly.
```

### 2.5 Cold Start (Resuming in New Window)

**New chat window - user pastes Hydration Manifest and says:**
```
/RESUME
```

**Agent action:**
1. Parse Hydration Manifest
2. Read .v0/rules.md
3. Read .v0/state.json
4. Verify project match
5. Resume from immediate_next_step
6. Continue work without context loss

---

## PART 3: MAINTENANCE & MONITORING

### 3.1 Weekly Metrics Review

**Every 5-7 sessions, run:**
```
METRICS_AUDIT

Analyze:
- Average tokens/task (target: 1500)
- Error rate (target: <5%)
- Hallucination incidents (target: 0)
- Model selection accuracy
- Compression trigger effectiveness
- Archive growth (should reduce active state)

If any metric out of bounds:
- Adjust model routing logic
- Tighten integrity checks
- Update context.md if needed
```

### 3.2 State.json Updates

**After every 3-5 tasks:**
- Review pending_atomic completion rate
- Move finished work to archive.md
- Update reheat_pointers
- Update metrics with burndown

### 3.3 Rules Evolution

**Quarterly:**
- Review rules.md for outdated constraints
- Update model routing if needed
- Document new emergency halt conditions
- Share lessons learned with team

---

## PART 4: TROUBLESHOOTING

### Issue: Agent Hallucinating File Paths

**Root Cause:** Integrity check not performed

**Fix:**
1. Require agent to list all files before writing
2. Cross-check against project structure
3. If hallucination detected, revert and ask for clarification

### Issue: Token Overrun (Exceeded estimate by >20%)

**Root Cause:** Insufficient pre-planning or scope creep

**Fix:**
1. Require Budget-First workflow for next task
2. Split task into smaller atomic pieces
3. Escalate to v0-Max for complex tasks

### Issue: Context Drift (Agent forgets previous decisions)

**Root Cause:** State.json not updated or not read

**Fix:**
1. At session start, ask agent to read state.json out loud
2. Add "Shadow File" comment block to main layout/page file
3. Increase frequency of state.json verification

### Issue: Session Timeout Before Snapshot

**Root Cause:** Didn't monitor health score

**Fix:**
1. Set calendar reminder at 80% threshold
2. Automate metric alerts
3. Require explicit /snapshot before hitting 95%

---

## PART 5: TEMPLATES & CHECKLISTS

### Pre-Feature Development Checklist

- [ ] Is task in pending_atomic?
- [ ] Does task align with current_sprint?
- [ ] Have all dependencies been resolved?
- [ ] Is architecture_ram up to date?
- [ ] Have design tokens been verified?
- [ ] Is context.md current?
- [ ] Do we have budget for this tier of work?

### Post-Task Completion Checklist

- [ ] Code follows component library standards
- [ ] All imports verified to exist
- [ ] Tailwind classes match design tokens
- [ ] No hallucinated files in output
- [ ] state.json updated
- [ ] metrics.md updated with token cost
- [ ] Task moved from pending_atomic
- [ ] Handoff summary written if needed

### End-of-Session Checkpoint

- [ ] metrics.md reflects actual token usage
- [ ] state.json synchronized
- [ ] Archive.md updated if features completed
- [ ] Next immediate_next_step clearly defined
- [ ] Health score above 20% before stopping

---

## CONCLUSION

This framework transforms v0 from a responsive code generator into a **self-aware, resource-conscious autonomous agent** that:

✓ Monitors its own resource usage  
✓ Routes work to optimal models  
✓ Validates its own output  
✓ Maintains continuity across sessions  
✓ Gracefully degrades under pressure  
✓ Prevents hallucinations through structure  

**Result:** Predictable, efficient, expert-level collaboration at enterprise scale.
