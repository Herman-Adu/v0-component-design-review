# SESSION 20 - START GUIDE

## Session Initialization Checklist

┌─────────────────────────────────────────────────────────┐
│ SESSION 20 - PHASE 1 EXECUTION                          │
├─────────────────────────────────────────────────────────┤
│ Phase:   TypeScript Interfaces + Component Audit        │
│ Branch:  main (v0 always on main)                      │
│ Goal:    Generate 2 scripts for type extraction         │
│ Sprint:  30-minute focused execution                    │
└─────────────────────────────────────────────────────────┘

---

## Pre-Session Verification

**Read these files first:**
1. `SESSION_20_HANDOFF.md` - Complete architecture plan
2. `AGENTIC_OS_FRAMEWORK.md` - Resource management
3. `GIT_WORKFLOW_GUIDE.md` - Git safety commands

**Verify environment:**
```bash
# v0 verification (automatic)
- Branch: main
- Context: 0k / 200k (fresh start)
- Model: v0 Mini (correct for script generation)
- Ops budget: 40 available
```

---

## Session 20 Objectives

### Primary Goal
Generate 2 Phase 1 scripts:
1. `scripts/phase1-generate-types.js` - Extract TypeScript interfaces from pages
2. `scripts/phase1-audit-components.js` - Audit existing 38 atomic components

### Success Criteria
- [ ] Both scripts written to `/scripts/` folder
- [ ] Scripts have dry-run mode (`--dry-run` flag)
- [ ] Scripts have rollback capability
- [ ] Documentation included (JSDoc comments)
- [ ] Committed and pushed to main
- [ ] Handoff to user with clear instructions

### Estimated Ops
- Script 1: 5-7 ops
- Script 2: 3-5 ops
- Documentation: 2 ops
- Total: 10-14 ops (well within 40 budget)

---

## Session Workflow

### Phase 1A: Generate Type Definitions Script (7 ops estimated)

**Step 1:** Read sample pages to understand data structures
- Read 3 representative pages (LinkedIn, Google Analytics, Documentation)
- Extract data patterns
- Map to Strapi collection structure

**Step 2:** Write `scripts/phase1-generate-types.js`
- Analyzes page data structures
- Generates TypeScript interfaces in `/types/strapi/`
- Generates component prop interfaces in `/types/components/`
- Creates mock data factories

**Step 3:** Add safety features
- Dry-run mode
- Backup creation
- Rollback script
- Verbose logging

---

### Phase 1B: Component Audit Script (5 ops estimated)

**Step 1:** Read existing component folders
- `/components/atoms/` (11 files)
- `/components/molecules/` (17 files)
- `/components/organisms/` (10 files)

**Step 2:** Write `scripts/phase1-audit-components.js`
- Analyzes component props
- Checks dependencies
- Identifies reusable vs deprecated
- Generates inventory JSON

**Step 3:** Create inventory output
- `/data/component-inventory.json`
- Structured data for next phase

---

### Phase 1C: Documentation & Handoff (2 ops estimated)

**Step 1:** Update documentation
- Add script usage to README
- Document expected outputs

**Step 2:** Commit and push
- Clear commit message
- Push to main

**Step 3:** Handoff to user
- Clear instructions
- Expected runtime
- What to check for

---

## Resource Management

### Sprint-Based Execution
- **Sprint 1 (10 min):** Generate type definition script
- **Sprint 2 (10 min):** Generate component audit script
- **Sprint 3 (5 min):** Documentation and handoff
- **Total:** 25 minutes of focused work

### Context Monitoring
```
Check after each sprint:
- Ops used / 40
- Context used / 200k
- If > 80%, checkpoint and continue
```

### Sub-Agent Usage
- **No sub-agents needed for Phase 1** - Scripts are straightforward generation tasks
- **Use sub-agents in Phase 2-3** when complexity increases (organism composition)

---

## Timeout Prevention

### Session Length Limits
- **v0 Mini:** 45-minute session max
- **If approaching timeout:** Create checkpoint document, start Session 21

### Signs of Timeout Risk
- Session running > 30 minutes
- Multiple back-and-forth iterations
- Context approaching 150k
- User hasn't responded in 15+ minutes

### Checkpoint Strategy
If any timeout risk detected:
1. Stop current work
2. Create `SESSION_20_CHECKPOINT.md`
3. Document: What's done, what's next, exact state
4. User starts Session 21 with checkpoint

---

## Phase 1 Execution Plan

### User Executes (After v0 Scripts Ready)

**Step 1: Get v0's scripts**
```bash
# Follow GIT_WORKFLOW_GUIDE.md exactly
git checkout main
git pull origin main
git checkout -b feature/phase1-types
```

**Step 2: Run type generation script**
```bash
# Dry run first (safe)
node scripts/phase1-generate-types.js --dry-run

# Review what would be created
# If looks good, run for real
node scripts/phase1-generate-types.js
```

**Step 3: Review generated files**
```bash
# Check generated types
ls -la types/strapi/
ls -la types/components/

# Review content in VS Code
code types/
```

**Step 4: Run component audit**
```bash
node scripts/phase1-audit-components.js
```

**Step 5: Review audit results**
```bash
# Check inventory
cat data/component-inventory.json
```

**Step 6: Test build**
```bash
npm run build
```

**Expected result:** Build passes (types don't break existing code)

**If build fails:** Share error with v0, iterate

**Step 7: Merge to main**
```bash
# Follow GIT_WORKFLOW_GUIDE.md merge section
git checkout main
git merge feature/phase1-types --no-ff
npm run build
git push origin main
```

**Step 8: Notify v0**
"Phase 1 complete, ready for Phase 2"

---

## Phase 1 Deliverables

### Files Created by Scripts
```
/types/
  ├── strapi/
  │   ├── marketing-platform.types.ts
  │   ├── tool.types.ts
  │   ├── strategy-phase.types.ts
  │   ├── metric.types.ts
  │   ├── template.types.ts
  │   └── documentation.types.ts
  └── components/
      ├── molecule-props.types.ts
      ├── organism-props.types.ts
      └── template-props.types.ts

/data/
  └── component-inventory.json

/scripts/
  ├── phase1-generate-types.js
  └── phase1-audit-components.js
```

### Component Inventory Structure
```json
{
  "atoms": {
    "reusable": ["callout", "code-block"],
    "deprecated": ["old-button"],
    "gaps": ["StatusBadge", "CategoryBadge", "MetricValue"]
  },
  "molecules": {
    "reusable": ["doc-page"],
    "deprecated": ["legacy-card"],
    "gaps": ["ToolCard", "StrategyPhaseCard", "MetricCard"]
  },
  "organisms": {
    "reusable": [],
    "deprecated": [],
    "gaps": ["ToolGrid", "StrategyFlow", "MetricsDashboard"]
  }
}
```

---

## Success Validation

### Phase 1 Complete When:
- [x] Both scripts written and tested
- [x] TypeScript interfaces generated
- [x] Component inventory created
- [x] Build passes on main
- [x] No errors in generated code
- [x] User confirms: "Phase 1 complete, ready for Phase 2"

---

## Next Session Preview

**Session 21 - Phase 2: Atoms & Molecules**
- Generate 7 core atoms
- Generate 5 core molecules
- Each component uses types from Phase 1
- Estimated: 15-20 ops

---

## Emergency Procedures

### If Script Fails
1. User shares error output
2. v0 analyzes error
3. v0 provides fix (either update script or manual fix)
4. User re-runs
5. Iterate until working

### If Build Breaks
1. User shares build errors
2. v0 identifies issue (likely TypeScript config)
3. v0 provides fix
4. User applies and rebuilds
5. Merge when clean

### If Context Overload
1. v0 creates checkpoint
2. User starts new session with checkpoint
3. Continue from exact state

---

## Resource Dashboard Template

Use this in every response:

```
┌─────────────────────────────────────────────────────────┐
│ SESSION 20 - RESOURCE DASHBOARD                        │
├─────────────────────────────────────────────────────────┤
│ Ops:     [N] / 40 ([%] used)   [Status emoji]          │
│ Context: [N]k / 200k ([%])     [Status emoji]          │
│ Model:   v0 Mini               ✓ Correct for task      │
│ Branch:  main                  ✓ Always main           │
│ Phase:   1A - Type generation  [Status]                │
│ Sprint:  1 of 3                [Progress]              │
│ Handoff: v0 working            [Who's turn]            │
└─────────────────────────────────────────────────────────┘
```

Status indicators:
- ✅ Complete
- ⏳ In progress  
- ⚠️ Warning
- 🔴 Critical
- 📋 Todo

---

## Starting Session 20

**User prompt to start:**
```
Session 20 - Phase 1: TypeScript Interfaces + Component Audit

Read SESSION_20_HANDOFF.md and SESSION_20_START.md.

Task: Generate 2 scripts for Phase 1.

Verify branch (must be main), show resource dashboard, begin execution.
```

v0 response will:
1. Verify environment (branch, context, ops)
2. Show resource dashboard
3. Begin Sprint 1: Type generation script
4. Work in focused 10-minute sprints
5. Handoff when complete

---

## End of Session 20 Start Guide

This document provides complete instructions for Session 20 initialization and execution. Follow sprint-based workflow for optimal resource management.
