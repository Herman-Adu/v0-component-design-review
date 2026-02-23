# AGENTIC OS FRAMEWORK - SESSION ORCHESTRATION

## OVERVIEW

This framework ensures efficient session management, resource optimization, and intelligent model orchestration across all v0 sessions.

---

## RESOURCE DASHBOARD (MANDATORY IN EVERY RESPONSE)

### FORMAT

```
┌─────────────────────────────────────────────────────────┐
│ SESSION [NUMBER] - RESOURCE DASHBOARD                  │
├─────────────────────────────────────────────────────────┤
│ Ops:     X / 40 (XX% used)  [STATUS]                   │
│ Context: XXXk / 200k (XX%)  [STATUS]                   │
│ Model:   v0 [Mini/Pro/Max]  [STATUS]                   │
│ Phase:   [Current phase]    [STATUS]                   │
│ Branch:  [Current branch]   [STATUS]                   │
└─────────────────────────────────────────────────────────┘
```

### STATUS INDICATORS

**Ops:**
- ✓ 0-20 ops (0-50%): Healthy
- ⚠️ 21-30 ops (51-75%): Moderate - Monitor closely
- 🔴 31-35 ops (76-87%): High - Consider ending or switching model
- 🚨 36-40 ops (88-100%): Critical - End session or switch to Max

**Context:**
- ✓ 0-120k (0-60%): Healthy
- ⚠️ 120-160k (60-80%): Moderate - Start planning checkpoint
- 🔴 160-190k (80-95%): High - Create checkpoint NOW
- 🚨 190-200k (95-100%): Critical - MUST end session

**Model Status:**
- ✓ Correct for current task
- ⚠️ Consider switching
- 🔴 Wrong model, should switch

**Phase Status:**
- ✓ On track
- ⚠️ Behind schedule
- 🔴 Blocked
- ⏸️ Waiting for user

---

## MODEL ORCHESTRATION

### v0 MINI

**Use for:**
- Script generation (repetitive patterns)
- TypeScript interface generation
- Batch component creation
- Page refactors (template application)
- Error guidance (directing fixes)
- Documentation updates

**Characteristics:**
- Fast, cost-effective
- Good for structured tasks
- Follows patterns well
- Less creative than Pro/Max

**When to stay on Mini:**
- Task is repetitive
- Clear pattern to follow
- Context < 160k
- Ops < 30

---

### v0 PRO

**Use for:**
- Complex organism composition
- Template design (creative layout)
- Multi-file orchestration
- Debugging complex type errors
- Architecture decisions (medium scope)
- Design system work

**Characteristics:**
- More creative
- Better at complex logic
- Handles ambiguity well
- Higher cost per op

**When to switch to Pro:**
- Mini struggles with complexity
- Task requires creativity
- Need better error analysis
- Ops budget allows (< 25 ops used)

---

### v0 MAX

**Use for:**
- System-wide architecture review
- Major refactor planning
- Complex multi-session orchestration
- Critical debugging (production issues)
- High-stakes decisions

**Characteristics:**
- Most capable model
- Best reasoning
- Highest cost
- Use sparingly

**When to switch to Max:**
- Ops > 35 and critical work remains
- Architecture needs major revision
- Mini/Pro both struggled
- High-risk changes

---

## CONTEXT OPTIMIZATION

### TOKEN BUDGETING

**Free tokens (loaded automatically):**
- `/.v0/rules.md` (< 50 lines, core rules only)
- Session manifest
- Resource dashboard

**Paid tokens (read when needed):**
- Full documentation files
- Large page files
- Detailed architecture specs

### READING STRATEGIES

**Don't read entire files when:**
- Just need to understand pattern
- Looking for specific code section
- Checking if file exists

**Use targeted reads:**
```javascript
// Bad: Read entire 300-line file
Read(file_path, offset=0, limit=300)

// Good: Read specific section
Read(file_path, offset=100, limit=20)
```

**Use Grep for pattern matching:**
```javascript
// Find all responsive-grid-3 usage
Grep(pattern="responsive-grid-3", output_mode="files_with_matches")
```

### CHECKPOINT STRATEGY

**When to checkpoint:**
- Context reaches 160k (80%)
- Major phase complete
- Before complex multi-file changes
- End of session

**Checkpoint contents:**
1. Summary of work completed
2. Current state
3. Next steps
4. Decisions made
5. Lessons learned

**Checkpoint format:**
- Concise (< 200 lines)
- Scannable (headers, bullets)
- Actionable (clear next steps)

---

## SESSION MANAGEMENT

### SESSION START CHECKLIST

**Every session must:**
1. Show resource dashboard
2. Read handoff document (SESSION_[N]_HANDOFF.md)
3. Confirm branch status
4. State session goals
5. Estimate ops needed

**Example session start:**
```
┌─────────────────────────────────────────────────────────┐
│ SESSION 20 - RESOURCE DASHBOARD                        │
├─────────────────────────────────────────────────────────┤
│ Ops:     0 / 40 (Fresh)     ✓ Full budget              │
│ Context: 15k / 200k (7.5%)  ✓ Handoff loaded           │
│ Model:   v0 Mini            ✓ Script generation        │
│ Phase:   Phase 1 Foundation ✓ Starting                 │
│ Branch:  main               ✓ Synced                   │
└─────────────────────────────────────────────────────────┘

Session 20 Goals:
1. Generate TypeScript interfaces (Script 1)
2. Audit existing components (Script 2)
3. Generate core molecules (Script 3)

Estimated ops: 13-21 ops
```

---

### SESSION END CHECKLIST

**Every session must:**
1. Show final resource dashboard
2. Summarize accomplishments
3. List incomplete items
4. Create handoff for next session (if continuing)
5. Commit any pending work

**Example session end:**
```
┌─────────────────────────────────────────────────────────┐
│ SESSION 20 - FINAL RESOURCE DASHBOARD                  │
├─────────────────────────────────────────────────────────┤
│ Ops:     21 / 40 (52.5%)    ✓ Budget remaining         │
│ Context: 145k / 200k (72%)  ✓ Healthy                  │
│ Model:   v0 Mini            ✓ Efficient                │
│ Phase:   Phase 1-2 Complete ✓ On schedule              │
│ Branch:  main               ✓ All changes committed    │
└─────────────────────────────────────────────────────────┘

Accomplishments:
✅ Script 1 created and tested (TypeScript interfaces)
✅ Script 2 created and tested (component audit)
✅ Script 3 created and tested (core molecules)
✅ Clean builds locally
✅ All changes committed

Next Session (21):
→ Generate organisms (Script 4)
→ Generate templates (Script 5)
→ Begin page refactoring (Scripts 6-7)
```

---

## WORKFLOW ORCHESTRATION

### SCRIPT-BASED WORKFLOW

**The cycle:**
1. v0 creates script → commits → pushes
2. User pulls → runs → tests
3. User shares errors (if any)
4. v0 guides fixes
5. User commits → pushes
6. v0 pulls to sync
7. Repeat for next script

**v0 responsibilities:**
- Write clean, well-documented scripts
- Include error handling
- Add dry-run mode
- Provide clear usage instructions

**User responsibilities:**
- Pull changes promptly
- Run scripts in sequence
- Share complete error output
- Commit working versions

### ERROR HANDLING

**When user shares errors:**
1. Show resource dashboard
2. Analyze error (context only, no file edits)
3. Provide fix guidance
4. Let user apply fix locally
5. Confirm fix worked

**Don't:**
- Edit files directly to fix (user does this locally)
- Guess without seeing full error
- Move forward without clean build

---

## PARALLEL OPERATIONS

### WHEN TO PARALLELIZE

**Safe to do in parallel:**
- Reading multiple unrelated files
- Generating multiple atoms (no dependencies)
- Grepping different patterns
- Checking multiple file paths

**Must do sequentially:**
- Steps with dependencies (atoms before molecules)
- File reads before edits
- Error analysis before fix
- Build before commit

### EXAMPLE

**Good parallelization:**
```javascript
// Reading 3 pages simultaneously
Read(file_path: "linkedin/page.tsx")
Read(file_path: "google/page.tsx")
Read(file_path: "twitter/page.tsx")
```

**Bad parallelization:**
```javascript
// Can't edit before reading
Read(file_path: "page.tsx")
Edit(file_path: "page.tsx")  // Wrong - depends on Read result
```

---

## TOKEN EFFICIENCY TACTICS

### 1. BATCH OPERATIONS

**Instead of:**
- Create 5 atoms in 5 separate scripts (5 ops)
- Create 5 molecules in 5 separate scripts (5 ops)

**Do:**
- Create 5 atoms in 1 batch script (1 op)
- Create 5 molecules in 1 batch script (1 op)

**Savings:** 8 ops (20% of budget)

---

### 2. SMART READS

**Instead of:**
- Reading entire 300-line page files

**Do:**
- Use Grep to find patterns
- Use targeted Read with offset/limit
- Extract patterns into reusable data

**Savings:** 50-100k context per session

---

### 3. AVOID REWORK

**Before any multi-file change:**
1. Create plan
2. Get user approval
3. Execute plan
4. Don't code without plan

**Saves:** Entire sessions worth of wasted work

---

### 4. DOCUMENTATION EFFICIENCY

**Don't create:**
- Verbose explanations
- Redundant documentation
- Documentation of obvious things

**Do create:**
- Concise handoffs
- Critical decision logs
- Architecture standards (once)

---

## DECISION MATRIX

### WHEN TO CREATE NEW SESSION

**Create new session if:**
- Context > 160k (80%)
- Current session ops > 30
- Major phase complete
- Need fresh context for new work

**Continue current session if:**
- Context < 120k (60%)
- Ops < 25
- Current work not complete
- Context switching would waste more

---

### WHEN TO SWITCH MODELS

**Stay on Mini if:**
- Task is straightforward
- Following established patterns
- Ops budget healthy

**Switch to Pro if:**
- Task requires creativity
- Mini struggling with complexity
- Ops < 25 (budget allows)

**Switch to Max if:**
- Critical architecture decision
- Ops > 35 but work critical
- Mini and Pro both failed

---

## RULES FILE STRUCTURE

### OPTIMIZED STRUCTURE

```
/.v0/
  ├── rules.md                     # FREE - Core only (< 50 lines)
  ├── session-manifest.json        # FREE - Session tracking
  └── resource-dashboard.md        # FREE - Current metrics

/data/
  ├── architecture-detailed.md     # PAID - Read when needed
  ├── workflow-detailed.md         # PAID - Read when needed
  └── component-inventory.json     # PAID - Read when needed
```

### RULES.MD CONTENT (FREE)

**Keep minimal:**
- Session start checklist
- Resource dashboard format
- Model switching triggers
- Critical workflows only

**Move to PAID files:**
- Detailed architecture specs
- Full implementation guides
- Comprehensive examples
- Historical context

---

## MONITORING & METRICS

### SESSION METRICS TO TRACK

**Per session:**
- Ops used / budget
- Context used / max
- Model switches
- Files created/edited
- Errors encountered
- Clean builds achieved

**Across sessions:**
- Average ops per session
- Context efficiency trends
- Model usage distribution
- Common error patterns

### SUCCESS INDICATORS

**Efficient session:**
- Ops < 30
- Context < 160k
- Clear deliverables
- Clean handoff

**Inefficient session:**
- Ops > 35
- Context > 180k
- Incomplete work
- Rework needed

---

## ANTI-PATTERNS (AVOID)

### 1. CONTEXT BLOAT
❌ Reading entire large files unnecessarily
❌ Including verbose explanations
❌ Duplicating information across files

### 2. OP WASTE
❌ Creating components one-by-one instead of batch
❌ Editing files multiple times for same change
❌ Manual operations that could be scripted

### 3. POOR PLANNING
❌ Coding before architecture
❌ Not getting approval before multi-file changes
❌ Skipping checkpoints at 80% context

### 4. WRONG MODEL
❌ Using Max for simple repetitive tasks
❌ Using Mini for complex creative work
❌ Not switching when current model struggles

---

## QUICK REFERENCE

### AT SESSION START
1. Show dashboard
2. Read handoff
3. State goals
4. Estimate ops

### DURING SESSION
1. Update dashboard every response
2. Monitor context (checkpoint at 80%)
3. Monitor ops (switch model at 30)
4. Follow script workflow

### AT SESSION END
1. Final dashboard
2. Summarize work
3. Create handoff (if continuing)
4. Commit all changes

### BEFORE CODING
1. Define interfaces first
2. Get architecture approval
3. Use scripts for batch work
4. Test locally, not in v0

---

**Framework complete. Use this for all sessions. Optimize ruthlessly.**
