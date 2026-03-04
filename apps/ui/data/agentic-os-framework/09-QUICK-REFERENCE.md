# Quick Reference Guide (One-Page Cheat Sheet)

## File Purposes at a Glance

| File | Purpose | Size | Freq Updated |
|------|---------|------|--------------|
| rules.md | Constitutional laws (immutable) | 2-3 KB | Between sessions |
| orchestrator.md | Task routing + model selection | 5-8 KB | Every 2-3 sessions |
| state.json | Project RAM (full context) | 15-20 KB | Every code output |
| metrics.md | Resource tracking + health | 3-5 KB | Every response |
| archive.md | Completed work (cold storage) | Unlimited | After each sprint |
| manifest.md | Restart template (dense encoding) | 1-2 KB | On /snapshot |
| scratchpad.md | Temp thinking space | 2-3 KB | Cleaned before closure |

---

## Session Workflow Flowchart

```
START SESSION
    ↓
PRE-FLIGHT CHECK
  ├─ Read rules.md
  ├─ Read state.json
  └─ Verify health + budget
    ↓
EMIT PULSE HEADER
  └─ Declare [Health%] [Tokens] [Model] [State: SYNC]
    ↓
REQUEST RECEIVED
    ↓
DETERMINE TIER
  ├─ Complexity LOW? → v0-mini
  ├─ Complexity MED? → v0-pro
  ├─ Complexity HIGH? → v0-max
  └─ Budget <20%? → v0-mini (override)
    ↓
PRE-CODE VALIDATION
  ├─ Align with state.json? YES
  ├─ Imports exist? YES
  ├─ Small surface (<2 files)? YES
  └─ Variables in state? YES
    ↓
EXECUTE CODE
    ↓
POST-CODE VALIDATION
  ├─ Syntax verified
  ├─ Imports correct
  ├─ state.json updated
  └─ metrics.md updated
    ↓
DECLARE NEXT STEP
  └─ immediate_next_step defined
    ↓
CHECK PRESSURE
  ├─ Health > 85%? → Continue
  ├─ Health 60-85%? → Compact context
  ├─ Health < 60%? → Dense mode
  └─ Health < 10%? → Snapshot
    ↓
RESPOND TO USER
    ↓
REPEAT or CLOSE SESSION
```

---

## Model Selection Quick Reference (4-TIER SYSTEM - Cost Order)

| Task | Complexity | Model (TIER) | Budget | Cost | Reason |
|------|-----------|--------------|--------|------|--------|
| CSS fix | ⚡ LOW | v0-mini (T1) | 200-300 | $1/$5 | Pattern work - most cost-efficient |
| Copy edit | ⚡ LOW | v0-mini (T1) | 100-200 | $1/$5 | No logic - cheapest |
| Single component | ⚙️ MED | v0-pro (T2) | 1000-1500 | $3/$15 | Mild logic - balanced |
| API endpoint | ⚙️ MED | v0-pro (T2) | 1500-2500 | $3/$15 | State involved |
| Multi-feature | 🔴 HIGH | v0-max (T3) | 3000-6000 | $5/$25 | Complex orchestration |
| Debug issue | 🔴 HIGH | v0-max (T3) | 2000-4000 | $5/$25 | Logic analysis |
| Critical quality work | 💎 CRITICAL | opus-4.6-fast (T4) | 1000-5000 | $15/$75 | ⚠️ MOST EXPENSIVE - Requires approval |

---

## Pressure Response Flowchart

```
60% Quota Hit
  └─ CONTEXT COMPACTION
     ├─ Delete scratchpad temp notes
     ├─ Archive resolved blockers (1 line)
     └─ Remove completed tasks from queue

85% Quota Hit
  └─ CLOSURE PROTOCOL
     ├─ Feature freeze engaged
     ├─ Bug fixes only
     └─ Output: "Closure protocol active"

95% Quota Hit
  └─ FORCED SNAPSHOT
     ├─ Generate Hydration Prompt
     ├─ Output copy-paste block
     └─ User opens new window + pastes
```

---

## Pre-Code Checklist

```
☐ Does this code align with state.json architecture?
☐ Do ALL imports exist in codebase?
☐ Is this "Small Surface" (max 2 files, 50 lines)?
☐ Are all new variables in state.json?
☐ Does this advance current_sprint forward?

IF ANY FAIL: HALT, ask user for clarification
```

---

## Post-Code Checklist

```
☐ Did I read the file back to verify syntax?
☐ Are all imports spelled correctly?
☐ Any new TypeScript errors?
☐ Did I update state.json with changes?
☐ Did I update metrics.md with actual tokens?
☐ Is "immediate_next_step" clearly defined?

DELIVER:
  1. Code output
  2. 2-4 sentence postamble
  3. Updated state.json + metrics.md
  4. Clear next step
```

---

## Pressure Level Reference

| Level | Health | Action | Token Limit |
|-------|--------|--------|-------------|
| 🟢 NORMAL | >85% | Full operations | Unlimited |
| 🟡 CAUTION | 60-85% | Compact context | Use carefully |
| 🔴 WARNING | 50-60% | Dense mode | Conservative |
| ⚫ CRITICAL | <50% | Snapshot prep | Snapshot only |
| ❌ EMERGENCY | <10% | Refuse code | State export |

---

## Recovery Procedures Summary

### Problem: Agent Forgets Rules
```
1. Copy-paste rules.md into chat
2. Add shadow file hack to main component
3. Verify Pulse Header next response
```

### Problem: state.json Out of Sync
```
1. Read actual code files
2. Compare to state.json
3. Rewrite state.json to match reality
4. Verify with user: "State resync complete"
```

### Problem: Token Budget Bleeding
```
1. Audit metrics.md - which turns cost most?
2. Review model selection - wrong TIER?
3. Activate Dense Mode manually
4. Reduce file reads (prune scope)
```

### Problem: Hallucinated Code
```
1. Halt immediately
2. Read what agent generated
3. Manually delete broken code
4. Activate Circuit Breaker (v0-max debugs)
```

### Problem: Session Lost
```
1. Generate new snapshot with /snapshot
2. Manually reconstruct state.json from code
3. Test restore in new window
4. Continue work
```

---

## Efficiency Targets

| Metric | Target | Warning | Crisis |
|--------|--------|---------|--------|
| Tokens/feature | <3,000 | >5,000 | >8,000 |
| Success rate | >95% | <85% | <70% |
| Model waste (using wrong tier) | 0% | >20% | >50% |
| Context sync (state vs code) | 100% | >90% | <80% |
| Budget duration | 3+ weeks | 1-2 weeks | <1 week |

---

## Hydration Prompt (Restart Template)

```
HYDRATE_V1:

I am a v0 agent in continuous workflow.
Read .v0/rules.md for my operating constitution.
Read .v0/state.json for current architectural RAM.

Active Goal: [immediate_next_step]
Health: [health_score]%
Tokens Remaining: [#]/[#]

Mode: [FULL | DENSE | EMERGENCY]
Ready to proceed.
```

---

## Weekly Maintenance

```
☐ Mon: Review metrics.md efficiency trend
☐ Tue: Audit any hallucinated patterns
☐ Wed: Update orchestrator.md based on learnings
☐ Thu: Archive completed features
☐ Fri: Test snapshot/restore cycle
☐ Sat: Update budget forecast
☐ Sun: Plan next week's scope
```

---

## Emergency Numbers (Thresholds)

```
60%: Context compaction trigger
85%: Feature freeze trigger
95%: Forced snapshot trigger
10%: Emergency mode (no code)
2 fails: Circuit breaker activates
Every 5 turns: Efficiency audit
```

---

## One-Line Summaries

- **rules.md**: "What I'm allowed to do"
- **orchestrator.md**: "Which model for which task"
- **state.json**: "Where we are now"
- **metrics.md**: "How many tokens we've spent"
- **archive.md**: "What's already done"
- **manifest.md**: "Copy-paste this to restart"
- **Pulse Header**: "My current health declaration"
- **Hydration Prompt**: "How I restart perfectly"

---

## The Three Sacred Rules

### Rule 1: State is Sacred
```
If state.json is wrong, EVERYTHING falls apart.
Keep it current. Validate it constantly.
```

### Rule 2: Budget is Real
```
When you hit 85%: Feature freeze.
When you hit 95%: Snapshot + new window.
No exceptions.
```

### Rule 3: Recovery is Possible
```
Use the documented procedures.
Don't improvise solutions.
Trust the framework.
```

---

## Symptoms → Solution Mapping

| Symptom | Solution |
|---------|----------|
| Agent forgets rules | Copy rules.md to chat |
| Code doesn't compile | Pre-code validation failed; re-read state |
| Same error twice | Activate Circuit Breaker |
| State out of sync | Manual state reconstruction |
| Token usage up 50% | Switch model or activate Dense Mode |
| Session ends unexpectedly | Use Hydration Prompt to restart |
| Agent won't make decision | Escalate to v0-max for reasoning |
| Budget crisis | Emergency mode; prepare snapshot |

---

## Success = This Feeling

✅ You know exactly what v0 will do next  
✅ Budget is predictable and manageable  
✅ Code is reliable and testable  
✅ Work never truly ends (it pauses)  
✅ Recovery is smooth and documented  
✅ Agent is a trusted partner, not a wildcard  
✅ Features complete faster than expected  
✅ Costs are lower than you budgeted  

**That's Platinum Standard.**
