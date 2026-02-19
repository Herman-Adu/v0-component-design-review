# Operational Procedures: Day-to-Day Workflow

## Session Initialization Procedure

### Step 1: Pre-Flight Check (First Action of Session)

**Agent must execute:**
```
1. Read .v0/rules.md completely
2. Read .v0/state.json completely
3. Verify current task aligns with pending_tasks list
4. Check health_score in state.json
5. Validate session is within token budget
```

**Output to user:**
```
✅ PRE-FLIGHT CHECK COMPLETE
- Rules: Loaded [n] mandates
- State: Loaded [project_name], health [%]
- Budget: [tokens_remaining] of [limit] available
- Current Focus: [immediate_next_step]
- Model Selected: [v0-mini/pro/max]
- Ready to proceed
```

**If any check fails**: HALT and request clarification before proceeding.

---

## Standard Workflow Loop (Per-Turn Procedure)

### Turn Initiation
1. **Read incoming request**
2. **Cross-reference against state.json** - Does it align with pending tasks?
3. **Calculate task complexity** - What TIER model is needed?
4. **Emit Pulse Header** - Declare current health

```html
<!-- PULSE: [SESSION_HEALTH: 78%] | [EST_TOKENS_REMAINING: 14200] | [ACTIVE_MODEL: v0-pro] | [STATE_SYNC: YES] -->
```

### Task Execution
1. **Open necessary files** (only files in reheat_pointers.last_file_edited + direct imports)
2. **Make targeted changes** (never rewrite unnecessarily)
3. **Verify syntax** (read file back before closing)
4. **Document change** in state.json

### Task Completion
1. **Define "Immediate Next Step"** for the user
2. **Update metrics.md** with actual token usage
3. **Sync all changes** to state.json
4. **Output postamble** (2-4 sentence explanation)

---

## Model Selection Flowchart (4-TIER SYSTEM - Cost Aware)

```
START: User requests work

├─ Question 1: What's the task type?
│  ├─ "CSS/styling" → Go to COMPLEXITY_CHECK
│  ├─ "Copy/text" → Go to COMPLEXITY_CHECK
│  ├─ "Component/hook" → Go to COMPLEXITY_CHECK
│  ├─ "API/backend" → Go to COMPLEXITY_CHECK
│  ├─ "Architecture/refactor" → Go to COMPLEXITY_CHECK
│  └─ "Critical high-quality work" → TIER 4 APPROVAL REQUIRED
│
├─ COMPLEXITY_CHECK:
│  ├─ If complexity is LOW (isolated, single file, no dependencies)
│  │  └─ Use v0-mini (TIER 1) - $1/$5 most cost-efficient
│  │
│  ├─ If complexity is MEDIUM (multiple files, cross-cutting, some state involved)
│  │  └─ Use v0-pro (TIER 2) - $3/$15 standard features
│  │
│  └─ If complexity is HIGH (refactor, architecture, multi-feature coordination)
│     └─ Use v0-max (TIER 3) - $5/$25 critical architecture
│
├─ TIER 4 APPROVAL REQUIRED:
│  ├─ If user has NOT explicitly approved TIER 4
│  │  └─ ASK: "This requires TIER 4 (most expensive model). Proceed? Cost: $15/$75 per 1M tokens"
│  │
│  ├─ If user approves
│  │  └─ Use opus-4.6-fast (TIER 4) - Monitor every 3 turns, switch to lower tier ASAP
│  │
│  └─ If user declines
│     └─ Fallback to TIER 3 or explain limitations
│
├─ BUDGET_CHECK:
│  ├─ If tokens_remaining < 20%
│  │  └─ Switch to DENSE_MODE, force TIER 1 regardless of task
│  │
│  ├─ If tokens_remaining < 10%
│  │  └─ REFUSE new code, generate SNAPSHOT only
│  │
│  └─ If tokens_remaining > 20%
│     └─ Proceed with selected TIER
│
└─ EXECUTE: Use selected model
```

---

## Pre-Code Integrity Check

Before writing ANY code:

```checklist
☐ Cross-Reference: Does this code align with state.json?
☐ Import Validation: Do all new imports exist in architecture_ram.stack?
☐ Scope Check: Is this "Small Surface" (max 2 files, 50 lines)?
☐ Variable Sync: Are all new variables defined in state.json?
☐ Logic Branch: Does this advance active_logic_branch forward?

IF ANY CHECK FAILS:
  → HALT and ask user for clarification
  → DO NOT WRITE CODE
```

---

## Post-Code Validation

After code is written:

```checklist
☐ Syntax: Did I read the file back to verify syntax?
☐ Imports: Are all imports correctly spelled and available?
☐ TypeScript: No new type errors introduced?
☐ State Sync: Did I update state.json with all changes?
☐ Metrics: Did I update metrics.md with actual tokens used?
☐ Next Step: Is "immediate_next_step" clearly defined?

DELIVERABLES:
  1. Code output (if applicable)
  2. 2-4 sentence postamble explaining changes
  3. Updated state.json + metrics.md
  4. Clear "Immediate Next Step" for user
```

---

## Pressure Response Protocol

### Pressure Level: 60% Quota Consumed

**Action: Context Compaction**

1. Read .v0/scratchpad.md - what temporary notes are here?
2. Delete anything in scratchpad that's not critical
3. In state.json: Delete completed items from task_stack
4. Summarize any resolved blockers into one line
5. Output to user: "Context compacted. [N] items cleaned."

**Goal**: Free up ~10-15% of token budget

---

### Pressure Level: 85% Quota Consumed

**Action: Feature Freeze + Closure Protocol**

1. **Refuse** any new feature requests
2. **Accept** only bug fixes and urgent changes
3. Update state.json: `"strategy": "CLOSURE_PROTOCOL"`
4. Run Integrity Check on all pending tasks
5. Output to user:

```
⚠️ CLOSURE PROTOCOL ACTIVATED
- Feature Freeze: No new features will be added
- Budget: [n] tokens remaining (~[%])
- Current Focus: Stabilization only
- Next Steps: Bug fixes, testing, documentation
- When to snapshot: After this task completes
```

---

### Pressure Level: 95% Quota Consumed

**Action: Forced State Export + Snapshot**

1. **Refuse ALL new work**
2. Run Closure Sequence (see below)
3. Generate Hydration Prompt (see manifest.md)
4. Output to user:

```
🔴 EMERGENCY: SESSION SNAPSHOT REQUIRED

Copy this block to a new v0 chat window:
================================
HYDRATE_V1:
Read .v0/rules.md and .v0/state.json.
Resume from: [immediate_next_step]
Mode: DENSE | Health: [health_score]%
Confirm hydration and await command.
================================

This session is complete. Thank you.
```

---

## Closure Sequence (Before Every Session End)

**Execute in this order:**

```
1. VALIDATE PENDING TASKS
   - For each item in task_stack.pending_atomic:
     [ ] Is it started?
     [ ] Is it blocked?
     [ ] Is it complete?
   - Move completed items to resolved_blockers

2. UPDATE METRICS
   - Calculate total tokens used this session
   - Add to session ledger in metrics.md
   - Update health_score calculation

3. SYNC STATE
   - Ensure state.json reflects all code changes
   - Verify immediate_next_step is set for next session
   - Confirm active_logic_branch is accurate

4. CLEAN SCRATCHPAD
   - Delete all temporary notes from scratchpad.md
   - Keep only critical debugging findings

5. GENERATE HANDOFF SUMMARY
   - One sentence: What was accomplished?
   - One sentence: What's blocked?
   - One sentence: What's next?
   - Store in state.json.reheat_pointers.handoff_summary

6. OUTPUT CLOSURE REPORT
   - Confirm all files saved
   - Provide summary of accomplishments
   - List any unresolved blockers
   - Wish user well or indicate readiness for snapshot
```

---

## Session Handoff (Snapshot Procedure)

**Triggered when**: User types `/snapshot` or quota > 95%

**Agent executes:**

```
1. Run Closure Sequence (above)
2. Generate Hydration Prompt:

HYDRATE_V1:
"I am a v0 agent in continuous workflow.
Read .v0/rules.md for my operating constitution.
Read .v0/state.json for current architectural RAM.
Active Goal: [immediate_next_step from state.json]
Mode: [DENSE|FULL] | Efficiency: [%]
Confirm hydration and wait for command."

3. Output to user:

"State locked. Copy the HYDRATE_V1 block above.
Open a new v0 chat window and paste it.
You will resume at exactly [immediate_next_step]."
```

**User then:**
1. Opens new v0 chat window
2. Pastes HYDRATE_V1 block
3. Agent reads .v0/rules.md and .v0/state.json
4. Workflow continues as if no interruption occurred

---

## Circuit Breaker Pattern (Failure Recovery)

**If a task fails the first time:**
1. Agent attempts the fix with same model (v0-pro attempts fix with v0-pro)
2. If fix succeeds: Continue normally
3. If fix fails second time: Activate Circuit Breaker

**Circuit Breaker activation:**
1. Switch to v0-max for ONE turn
2. Prompt: "Debug the logic causing repeated failures"
3. v0-max analyzes root cause and explains issue
4. Switch back to original TIER to "Write the Fix"

**Effect**: Saves expensive max tokens by using it only for diagnosis, not implementation.

---

## Large Task Checkpoint Protocol

**Purpose:** Prevent progress loss on timeout during multi-step tasks

### When to Use Checkpoints

**Automatic Triggers:**
- Multi-file operations (>5 files)
- Sequential dependencies (Step B depends on Step A)
- Estimated >50 tool calls
- Health <60% (approaching compaction)

**Task Types:**
- Feature migrations, architectural refactors
- Bulk import updates, database migrations
- Test suite generation, documentation (>10 files)

### Implementation

**Break into 3-5 Phases with Checkpoints:**

```
PHASE 1: Analysis & Planning
  → Checkpoint: Write to state.json active_task.phases[0].status = "complete"

PHASE 2: Core Operations (file moves/creates)
  → Checkpoint: Update state.json with files_moved count, phase complete

PHASE 3: Updates (imports/references)
  → Checkpoint: Update with progress (7/10 imports updated)

PHASE 4: Validation
  → Checkpoint: Mark active_task as null (task complete)
```

**Checkpoint Data in state.json:**
```json
{
  "active_task": {
    "name": "Feature Migration",
    "current_phase": "Phase 3: Import Updates",
    "phases": [
      {"phase": 1, "status": "complete"},
      {"phase": 2, "status": "complete", "files_moved": 13},
      {"phase": 3, "status": "in_progress", "progress": {"completed": 7, "total": 10}}
    ]
  }
}
```

### Recovery Protocol

**On Session Start:**
1. Read `.v0/state.json`
2. If `active_task` exists: Display resume prompt
3. Show completed phases and remaining work
4. Ask: "Continue from Phase [N]?"

**Health-Based Urgency:**
- Health 80-100%: Checkpoint at phase boundaries
- Health 60-79%: Checkpoint every 20 tool calls
- Health 40-59%: URGENT - Checkpoint after every major operation
- Health <40%: CRITICAL - Switch to DENSE mode

### Validation Before Next Phase

```checklist
☐ Previous phase files exist/are correct
☐ Run validation (grep for expected patterns)
☐ Update state.json with checkpoint
☐ Confirm checkpoint written
☐ Proceed to next phase
```

**Full Protocol:** See `/data/agentic-os-framework/operational-procedures/CHECKPOINT-PROTOCOL.md`

---

## Atomic Task Decomposition

When user requests complex work:

**Instead of:**
```
User: "Build a complete authentication system"
Agent: *attempts entire feature*
Result: Hallucination, wasted tokens
```

**Do this:**
```
User: "Build authentication system"
Agent (v0-mini): "I've decomposed this into 5 atomic tasks:
  1. Create auth schema (models, types)
  2. Implement login endpoint
  3. Implement logout endpoint
  4. Add session middleware
  5. Test cookie persistence
Proceed with task 1?"
User: "Yes"
Agent (v0-pro): [Completes task 1 only]
```

**Effect**: Prevents scope creep hallucinations; enables clear progress tracking.

---

## Daily Standup Prompt

**Start each day with:**

```
Good morning! Let's sync.

1. Read .v0/state.json
2. Read .v0/metrics.md
3. Report:
   - What we accomplished yesterday
   - Current health score
   - Tokens remaining in weekly budget
   - Today's focus (from pending_tasks)
   - Any blockers from yesterday
4. Ask user: "Proceed with task [N/X]?"
```
