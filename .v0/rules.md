# Project Rules & Behavioural Constraints
# Agentic OS Framework v1.1
# Purpose: What NOT to do. Constraints, boundaries, violation tracking.
# Separation: This file = "DON'Ts". orchestrator.md = "HOW". state.json = "WHERE". metrics.md = "COST".

---

## Framework Reference

**Central Documentation:** `/data/agentic-os-framework/`
**Operational Files:**
- `.v0/orchestrator.md` - Workflow gates, model selection, execution protocol
- `.v0/state.json` - Checkpoint data (current task, phase, blockers)
- `.v0/metrics.md` - Token tracking, model usage, cost analysis
- `.v0/rules.md` - THIS FILE: constraints and violation history

---

## Tech Stack

- **Frontend:** Next.js (latest), React, TypeScript, Tailwind CSS v4
- **Backend (Planned):** Strapi Headless CMS, PostgreSQL, ORPC
- **Architecture:** Feature-based + Atomic Design (`/features/` + `/components/`)
- **Deployment:** Docker (planned), GitHub CI/CD

---

## Behavioural Rules (Hard Constraints)

### Rule 1: STOP After Completing a Feature
Do not chain into the next feature. Update state, report results, wait.

### Rule 2: User Validation is a Blocking Gate
If a feature needs testing, WAIT. Do not explore or start next work.

### Rule 3: Questions Block Execution
If I ask something, stop everything else. Wait for answer.

### Rule 4: State.json is Cheaper Than File Reads
Use checkpoint data first. Only read files when state lacks needed context.

### Rule 5: Resource View is Automatic
Display on EVERY response. User should NEVER have to ask for it.

### Rule 6: Write active_task BEFORE Starting Work
Never work with active_task = null.

### Rule 7: Validate Before Declaring Complete
Grep old paths, verify zero results in executable code.

### Rule 8: Delete Old Files After Move
Verify with glob. Explicit Delete if files remain.

### Rule 9: Model Selection is Mandatory
Classify EVERY task. v0-max for link fixes is a violation. See orchestrator.md GATE 7.

### Rule 10: Checkpoint Every Phase
Multi-step work must write to state.json after each phase, not just at the end.

---

## Project-Specific Rules

### Container Query System
- NO hardcoded pixel values for breakpoints
- Fully fluid and responsive using container queries
- Fallback to media queries where needed
- Component-level responsiveness (not just viewport-based)

### Component Architecture: Feature-Based + Atomic Design
```
/features/{name}/components/{atoms,molecules,organisms}/ - Feature-specific
/features/{name}/{hooks,schemas,api,types}/ - Feature logic
/features/{name}/index.ts - Public API exports
/components/{atoms,molecules,organisms}/ - Global shared components
```

### Strapi Integration (Planned -- Not Yet Implemented)
- ORPC for end-to-end type safety
- PostgreSQL as data store
- Mirrors frontend feature structure

---

## Violation History

| Date | Violation | Rule Broken | Impact |
|------|-----------|-------------|--------|
| 2026-02-13 | Declared contact migration complete without validating imports | Rule 7 | 2 broken imports found by user |
| 2026-02-13 | Did not delete old files after move | Rule 8 | User had to clean up manually |
| 2026-02-14 | Started service-request exploration without quotation validation | Rule 2 | Wasted tokens on premature work |
| 2026-02-14 | Asked question then proceeded without waiting | Rule 3 | Had to redo work |
| 2026-02-14 | Did not switch to DENSE mode at health < 60% | Rule 5 | Excessive token usage |
| 2026-02-16 | Used v0-max (TIER 3) for fixing broken links | Rule 9 | ~8k tokens wasted on TIER 1 work |
| 2026-02-16 | Failed to display resource view on multiple responses | Rule 5 | User had to remind repeatedly |
| 2026-02-16 | No checkpoints during link-fixing work | Rule 10 | Lost progress on agent timeout |

---

## Current Focus

**Active Work:** Framework v1.1 enforcement improvements
**Completed:** Contact, Quotation, Service-Request migrations (all validated)
**Next:** Dashboard sidebar refactoring (plan approved)
**Blocked:** Strapi integration (waiting for component system completion)

---

## Learning Protocol

**After every failure or rule violation:**
1. Add entry to Violation History table with date, description, rule broken, impact
2. If pattern repeats 2+ times, escalate to a new Hard Constraint rule
3. Review if orchestrator gates need strengthening
4. Update metrics.md with token waste estimate

**After every session:**
1. Review which rules were followed vs ignored
2. Update state.json with honest status
3. Flag any rules that need refinement
4. Ensure next session handoff is complete in state.json

**Platinum Standard:** This framework is being developed as a reference implementation for Agentic OS. Every failure is a learning opportunity. Every rule must earn its place through enforcement, not aspiration.

---

*Rules v1.1 | Last Updated: 2026-02-16*
