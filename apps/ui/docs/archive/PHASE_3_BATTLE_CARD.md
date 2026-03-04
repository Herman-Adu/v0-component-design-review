# PHASE 3 QUICK REFERENCE — Battle Card for Session 3 Execution

**Print this. Reference constantly.**

---

## 60-Second Status Check (Use Hourly)

```
What time is it? ____________
Tokens used so far? _____ / 128K
On task? YES / NO
Blockers? List: _________________
Confidence level? 1-10: ___

If confidence <5 or tokens >75%:
  → STOP, create checkpoint, escalate
```

---

## The Three Gates (Must Pass All)

### Gate 1: Schema Validation (After 3.1 + 3.2)

```
GATE 1: Schema Validation ✓ PASS / ✗ FAIL

Criteria checklist:
☐ All JSON files created (8-10)
☐ All files parse (no syntax errors)
☐ All validate against Zod schema
☐ Zero validation errors
☐ All block types recognized
☐ All required fields filled
☐ Validation report created
☐ Architect approved

If ANY unchecked: FIX BEFORE PROCEEDING
```

### Gate 2: Data Integrity (After 3.3 + 3.4)

```
GATE 2: Data Integrity ✓ PASS / ✗ FAIL

Criteria checklist:
☐ All unit tests pass (100%)
☐ Coverage >90%
☐ No null returns on valid queries
☐ Repository queries accurate
☐ View models transform correctly
☐ Facade exports accessible
☐ No TypeScript errors
☐ Integrity report created
☐ Architect approved

If ANY unchecked: FIX BEFORE PROCEEDING
```

### Gate 3: Routes & Metadata (After 3.5 — STRETCH ONLY)

```
GATE 3: Routes & Metadata (IF ATTEMPTED)

☐ Routes render without errors
☐ generateStaticParams() works
☐ generateMetadata() complete
☐ Sitemap includes routes

DEFER IF TOKENS <50%
```

---

## Task Timing (vs Actual)

| Task               | Estimate    | Actual       | Notes |
| ------------------ | ----------- | ------------ | ----- |
| 3.1.1 (Audit)      | 45 min      | \_\_ min     |       |
| 3.1.2 (Extract)    | 60 min      | \_\_ min     |       |
| 3.1.3 (JSON)       | 30 min      | \_\_ min     |       |
| 3.2.1 (Validate)   | 30 min      | \_\_ min     |       |
| 3.2.2 (Report)     | 15 min      | \_\_ min     |       |
| 3.3.1 (Schema)     | 45 min      | \_\_ min     |       |
| 3.3.2 (Builder)    | 60 min      | \_\_ min     |       |
| 3.3.3 (Repo)       | 60 min      | \_\_ min     |       |
| 3.3.4 (VMs)        | 45 min      | \_\_ min     |       |
| 3.3.5 (Facade)     | 15 min      | \_\_ min     |       |
| 3.3.6 (Tests)      | 45 min      | \_\_ min     |       |
| 3.4.1 (Run Tests)  | 30 min      | \_\_ min     |       |
| 3.4.2 (Spot Check) | 20 min      | \_\_ min     |       |
| 3.4.3 (Report)     | 10 min      | \_\_ min     |       |
| **TOTAL**          | **7.5 hrs** | **\_\_ hrs** |       |

---

## Decision Tree: Am I Blocked?

```
Is my code compiling?
  NO  → Fix TypeScript errors, then ask again
  YES → Continue

Is Gate 1 passing?
  NO  → Fix JSON/schema, revalidate, ask again
  YES → Go to Gate 2

Is Gate 2 passing?
  NO  → Fix tests/code, rerun, ask again
  YES → Consider stretching to Gate 3 IF tokens >50%

Do I have >50% tokens remaining?
  NO  → STOP, create checkpoint, defer to Session 4
  YES → Consider Gate 3 (routes)

Ready to proceed?
  YES → Continue
  NO  → Document blocker, escalate
```

---

## Commands You'll Run (Copy-Paste Ready)

```bash
# Validate JSON schema
node scripts/validate-documentation-schema.mjs --domain strategic

# Type check
pnpm run type-check

# Run tests
pnpm run test -- documentation-strategic

# Run tests with coverage
pnpm run test -- --coverage documentation-strategic

# Check specific file
pnpm exec tsc lib/strapi/documentation/strategic/*.ts --noEmit
```

---

## What "PASS" Looks Like

### Gate 1 PASS Output

```
✅ Validation Results
━━━━━━━━━━━━━━━━━━━━━
Files Validated: 8
Files Passed: 8
Validation Errors: 0
________________

Status: ✅ PASSED
```

### Gate 2 PASS Output

```
✅ Test Results
━━━━━━━━━━━━━━━━━━━━━
Tests: 18 passed
Coverage: 94%
Failed: 0
________________

Status: ✅ PASSED
```

---

## What "FAIL" Looks Like (& How to Fix)

### Schema Validation Failed

```
ERROR: JSON validation failed
File: system-vision-and-principles.json
Reason: meta.publishedAt must be ISO string

FIX:
1. Open the JSON file
2. Find publishedAt field
3. Change to "2026-02-15T00:00:00Z" format
4. Revalidate
5. Retry Gate 1
```

### Test Coverage Failed

```
ERROR: Coverage below 90%
Current: 87%
Need: 3% more

FIX:
1. Run: pnpm run test -- --coverage
2. Find uncovered lines
3. Add test case for that code path
4. Rerun tests
5. Retry Gate 2
```

### TypeScript Error

```
ERROR: Type 'string | undefined' is not assignable to type 'string'

FIX:
1. Find the problematic line
2. Add null check or type guard
3. Run type-check again
4. Continue
```

---

## Learning Capture (During Execution)

**Every 2 hours, fill this in:**

```
Time: ___________
Tasks completed: ___________

What went smoother than expected?
  _________________________________

What took longer?
  _________________________________

Any surprises?
  _________________________________

Adjustment for next batch?
  _________________________________
```

---

## Token Budget Watch

```
Start:    128K
Halfway (3.5 hrs):  Should be at ~65K (50% used)
3/4 way (5.5 hrs):  Should be at ~95K (74% used)
---
If >75% at 5.5 hrs: DEFER STRETCH TASKS
If >85% at 7 hrs:   STOP, create checkpoint
```

---

## Files to Have Open

1. **PHASE_3_EXECUTION_PLAN.md** — This detailed guide
2. **ARCHITECTURE_IMPLEMENTATION_CHECKLIST.md** — Gate definitions
3. **STRAPI_COLLECTION_TYPE_SCHEMAS.md** — JSON structure template
4. **ROADMAP.md** + **ARCHITECTURE.md** — Content to extract
5. **STRAPI_SAMPLE_DOCUMENT.json** — Example of final JSON

---

## Escalation Protocol

**If you hit any of these, STOP and escalate:**

- ❌ Governance decision conflicts with code reality
  → Escalate to Senior Architect
- ❌ Gate validation fails and you can't fix it quickly
  → Document issue, escalate
- ❌ Tokens exceed 85% with major work remaining
  → Create checkpoint, recommend Session 3.5 continuation
- ❌ You're unsure about any design decision
  → Check STRAPI_DYNAMIC_ZONES_AUTHORITY.md and docs
  → If still unclear, don't guess — escalate

---

## Success Celebration Criteria

At end of Session 3, you will have:

✅ Extracted 8-10 strategic articles to JSON  
✅ Validated all JSON against schema (Gate 1 PASS)  
✅ Created complete 6-layer data layer  
✅ Written comprehensive unit tests  
✅ All tests passing with >90% coverage (Gate 2 PASS)  
✅ Documented lessons learned  
✅ Ready to proceed to routes (Session 4)

**If all are ✅:** You crushed Phase 3.

---

## Final Reminder

> **Move fast. Learn constantly. Adjust next sprint. Don't force bad decisions.**

If something feels wrong, stop and ask. The governance is solid. The path is clear.

Execute with confidence.

🚀

---

**Print Date:** Feb 28, 2026  
**Session:** 3  
**Status:** Ready to execute
