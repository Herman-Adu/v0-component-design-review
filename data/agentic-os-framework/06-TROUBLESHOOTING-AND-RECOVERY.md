# Troubleshooting & Recovery Guide

## Common Problems & Solutions

### Problem 1: Agent "Forgets" Rules Mid-Session

**Symptoms:**
- Agent violates rules.md constraints
- Agent makes changes without pre-flight check
- Agent forgets model selection logic

**Root Cause:**
- Context window is crowded
- Rules.md not re-read after pressure
- No shadow file hack to maintain visibility

**Solution:**

1. **Immediate**: Copy-paste rules.md into chat to refresh context
2. **Medium-term**: Add shadow file hack to main component
3. **Long-term**: Implement Pulse Header checking (agent must validate against rules every turn)

**Code Fix:**
```jsx
// app/layout.tsx
/*
@v0-RULES: See .v0/rules.md for my operating laws
@v0-STATE: Full context in .v0/state.json
@v0-FOCUS: Currently on {active_logic_branch}
*/

export default function RootLayout() { /* ... */ }
```

---

### Problem 2: state.json Gets Out of Sync with Code

**Symptoms:**
- Code is changed but state.json still references old structure
- Agent thinks feature is complete but tests fail
- "Immediate Next Step" doesn't match actual state

**Root Cause:**
- Agent didn't run post-code validation
- State sync step was skipped under pressure
- Multiple files changed but only one tracked

**Solution:**

1. **Immediate**: Read the actual code files vs. state.json
2. **Audit**: Check every file in architecture_ram to see if it's outdated
3. **Resync**: Rewrite state.json to match actual code
4. **Enforce**: Add integrity check: Agent must validate state sync before finishing

**Recovery Checklist:**
```
☐ Read actual code files (don't trust state.json)
☐ List all imports in each file
☐ Verify architecture_ram matches reality
☐ Update state.json with truth
☐ Verify pending_tasks match actual code status
☐ Rewrite immediate_next_step based on truth
☐ Confirm with user: "State resync complete"
```

---

### Problem 3: Token Budget Bleeding (Spending Faster Than Expected)

**Symptoms:**
- Token consumption is 2x higher than estimated
- Health score drops 10% per turn
- Snapshot forced at turn 12 instead of turn 30

**Root Cause:**
- Agent using wrong model for tasks (expensive vs. cheap)
- Large files being read repeatedly
- Dense Mode not activated when needed
- Context not being compacted

**Solution:**

1. **Immediate**: Switch to Dense Mode manually
2. **Audit metrics.md**: Which turns consumed most tokens?
3. **Review model selection**: Were the right TIERs used?
4. **Implement pruning**: Reduce file reads
5. **Enable efficiency audit**: Every 5 turns

**Prevention:**
```
Add to orchestrator.md:

If tokens_per_turn > [target]:
  1. Reduce file size (read lines 20-50 only)
  2. Switch to cheaper model
  3. Activate Dense Mode
  4. Defer non-critical tasks
```

---

### Problem 4: Session Snapshot Fails to Restore

**Symptoms:**
- User pastes Hydration Prompt in new window
- Agent says "I don't see .v0 files"
- Work doesn't resume from immediate_next_step

**Root Cause:**
- .v0 folder not accessible in new chat
- Project ID changed between windows
- state.json not actually saved before snapshot

**Solution:**

1. **Verify .v0 exists**: Check that .v0/ folder is in project root
2. **Verify state.json**: Read it directly (not from cache)
3. **Regenerate snapshot**: Agent re-reads all .v0 files and creates new manifest
4. **Use explicit paths**: Hydration prompt should include exact .v0/state.json path

**Prevention:**
```
Before snapshot:
1. Verify .v0 files are in version control
2. Verify state.json was actually written (not cached)
3. Test restoration manually in new window before relying on it
4. Include full file paths in Hydration Prompt
```

---

### Problem 5: Agent Hallucinates Code That Doesn't Fit Reality

**Symptoms:**
- Agent writes code referencing components that don't exist
- Imports point to wrong locations
- Architecture doesn't match state.json

**Root Cause:**
- architecture_ram is outdated
- Agent didn't validate imports before coding
- Pre-code validation was skipped

**Solution:**

1. **Read the actual codebase**: What components actually exist?
2. **Update architecture_ram**: List all real imports, routes, schemas
3. **Halt the hallucination**: Delete bad code, restart from truth
4. **Enforce validation**: Agent must validate every import against actual file system

**Prevention:**
```
Add mandatory pre-code check:

FOR EACH import in proposed code:
  ☐ Does this file actually exist?
  ☐ Is the path correct?
  ☐ Is it in architecture_ram.stack?
  
IF ANY import fails validation:
  HALT and ask user: "Does this file exist at this path?"
  DO NOT WRITE CODE
```

---

### Problem 6: Pressure Protocol Not Triggered (Budget Exhaustion)

**Symptoms:**
- Agent continues writing code at 90% quota
- No closure protocol activated at 85%
- Snapshot forced only when <5% remaining

**Root Cause:**
- Threshold checks not implemented in rules.md
- Agent not reading metrics.md every turn
- No enforcement mechanism

**Solution:**

1. **Add explicit rules**: Define exact thresholds
2. **Add automation**: Metrics.md updated by agent every turn
3. **Add enforcement**: Agent must check metrics before writing code

**Implementation:**

```markdown
Add to rules.md:

## Mandatory Quota Checks

BEFORE writing code:
- Read metrics.md
- Calculate current_quota_percentage
- IF current_quota_percentage > 85%:
    Enter CLOSURE_PROTOCOL immediately
    Refuse new features
    Only bug fixes allowed
- IF current_quota_percentage > 95%:
    STOP
    Generate snapshot
    Refuse ALL new code

REPORT status after every turn:
"Health: [%] | Remaining: [tokens] | Mode: [FULL|DENSE|EMERGENCY]"
```

---

## Emergency Recovery Procedures

### Recovery Procedure 1: Complete State Loss

**When to use:** If state.json is corrupted or lost

**Steps:**
```
1. STOP all work immediately
2. Use /snapshot to export current work
3. Manually reconstruct state.json by:
   - Reading actual code files
   - Recording actual imports
   - Listing actual routes
   - Capturing current schema
4. Rewrite handoff_summary based on truth
5. Test hydration in new window
```

---

### Recovery Procedure 2: Budget Overage Crisis

**When to use:** If tokens spent exceed monthly/weekly budget

**Steps:**
```
1. Stop accepting new tasks
2. Audit metrics.md:
   - Which tasks consumed most tokens?
   - Which model TIER was used?
   - Was it appropriate?
3. Document learnings:
   - Was model selection wrong?
   - Was scope too large?
   - Was code inefficient?
4. Update TIER decisions in orchestrator.md to prevent recurrence
5. Adjust next session's budget
```

---

### Recovery Procedure 3: Continuous Hallucination Loop

**When to use:** If agent keeps writing broken code despite feedback

**Steps:**
```
1. Activate Circuit Breaker (see advanced concepts)
2. Switch to v0-max for ONE turn
3. Prompt: "What's causing these hallucinations? Debug the root issue."
4. v0-max analyzes + explains
5. Implement findings with v0-pro
6. Resume normal workflow
7. Document the pattern to prevent recurrence
```

---

### Recovery Procedure 4: Lost Context Between Sessions

**When to use:** If Hydration Prompt doesn't restore context properly

**Steps:**
```
1. Manually read all .v0 files in new window
2. Copy-paste key sections into message
3. Start with: "Context restore: [full state summary]"
4. Ask agent to validate context
5. Confirm before proceeding
6. After recovery, test snapshot/restore cycle
```

---

## Prevention Checklists

### Weekly Maintenance Checklist

```
☐ Review metrics.md efficiency trend
☐ Audit any hallucinated code patterns
☐ Update orchestrator.md based on learnings
☐ Archive completed features
☐ Test snapshot/restore cycle in new window
☐ Update budget forecast for next week
☐ Document any threshold violations
☐ Validate all .v0 files are in version control
```

### Pre-Snapshot Checklist

```
☐ Read state.json - is it current?
☐ Verify all recent code changes are reflected
☐ Check metrics.md - accurate token counts?
☐ Validate immediate_next_step is precise
☐ Confirm handoff_summary is accurate
☐ Test restore in new window before relying on it
```

### Post-Restoration Checklist

```
☐ Agent successfully read rules.md?
☐ Agent successfully read state.json?
☐ immediate_next_step matches actual project state?
☐ Architecture matches reality?
☐ First code output is correct?
☐ If restored correctly, mark snapshot as "verified"
```

---

## Health Score Interpretation

| Score | Meaning | Action |
|-------|---------|--------|
| 90-100% | Excellent | Continue normal operations |
| 80-90% | Good | Monitor efficiency |
| 70-80% | Fair | Consider compaction at next opportunity |
| 60-70% | Caution | Begin context compaction |
| 50-60% | Warning | Activate Dense Mode |
| 40-50% | Critical | Prepare snapshot |
| <40% | Emergency | Force snapshot immediately |

---

## Warning Signs You Need to Intervene

| Warning Sign | What It Means | Action |
|--------------|--------------|--------|
| Agent says "I don't see state.json" | Context lost or files inaccessible | Manually provide state context |
| Agent violates rules (e.g., 3 files changed) | Rules forgotten | Re-read rules.md to agent |
| Token burn rate accelerating | Model selection wrong or scope creeping | Audit tasks, switch TIER, activate Dense |
| Consecutive hallucinations | Logic error in agent | Activate Circuit Breaker |
| Snapshot fails to restore | State corruption | Manual recovery procedure 1 |
| Health drops 10%+ per turn | Budget bleeding | Budget crisis procedure |

---

## Creating a Recovery Plan

Before disasters strike, create a recovery plan:

```markdown
# Emergency Recovery Plan

## If agent hallucinates:
1. Activate Circuit Breaker
2. Have v0-max debug the issue
3. Document pattern in orchestrator.md

## If state.json corrupts:
1. Reconstruct from actual code
2. Verify against running app
3. Test snapshot/restore

## If budget overages:
1. Audit model selection
2. Update TIER decisions
3. Adjust next session scope

## If context lost:
1. Use /snapshot
2. Manually restore state
3. Test in new window

## If hallucination loop:
1. Stop current work
2. Switch to v0-max
3. Request debugging output
4. Document root cause
```
