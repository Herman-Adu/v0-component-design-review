# Phase 3 Session 3 Drift Analysis & Remediation

**Date:** February 28, 2026  
**Status:** 🚨 ARCHITECTURAL DRIFT IDENTIFIED - CORRECTIVE ACTION IN PROGRESS  
**Severity:** Medium (fixable before proceeding to Gates)

---

## Executive Summary

During Task 3.3 implementation (Data Layer), we **drifted from established governance** in three areas:

1. **Test Organization** — Unit tests placed in `lib/strapi/documentation/strategic/__tests__/` instead of root `__tests__/` structure
2. **Root Folder Bloat** — 60+ markdown files created over 10 phases, many redundant or outdated
3. **Architectural Clarity** — ARCHITECTURE.md not updated to reflect current reality (lib/strapi/documentation exists, governance locked, test strategy defined)

**Root Cause:** First implementation of new module (documentation) didn't follow content-library pattern precisely. Tests created locally then partially reorganized.

**Impact:**

- ✅ Code is _functionally_ correct (5 data layer files, 30+ unit tests, 60+ integration tests work)
- ❌ Structure violates "consistency" principle (why content-library and documentation don't match)
- ❌ Confusion about where tests should live going forward
- ❌ Root folder confuses new team members about what's current vs historical

**Timeline Until Fix:** 90 minutes  
**Blockers to Continued Execution:** NONE (can fix and continue, tests already written)

---

## Part 1: Architectural Decisions (From Governance)

### What Governance Says About Testing

From **STRAPI_DYNAMIC_ZONES_AUTHORITY.md** (locked, immutable):

> "Strict 6-layer architecture applied consistently (schema → builder → repository → viewmodels → facade → manifest)"  
> "Build-time validation gates that prevent migration/deployment without schema + data + route + quality + build gates passing"

**What this means for tests:**

- Tests validate each layer independently and in combination
- Tests are _part of the 6-layer architecture_, not separate
- Testing strategy must be consistent across all domains (content-library, documentation, future modules)

### What Governance Says About Content Modules

**STRAPI_BUILDER_PATTERN.md** (the pattern we locked):

```
Strapi Collection → Extraction → Content Folder → Data Layer → Route → Feature

Data Layer = {
  schema.ts (Zod)
    ↓
  content-builder.ts (Load + validate)
    ↓
  repository.ts (Server-only queries)
    ↓
  view-models.ts (Domain → UI)
    ↓
  index.ts (Facade)
}
```

**No mention of where documentation lives.** This was assumed implicitly.

### Implicit Architectural Decision (Not Locked, Should Be)

**Current Implementation Assumes:**

```
lib/strapi/
├── dashboard/                    (Content Library - Multiple domains)
│   └── content-library/
│       ├── articles/
│       ├── tutorials/
│       ├── case-studies/
│       └── guides/
│
└── documentation/                (Documentation - Multiple domains)
    └── strategic/                (First domain being extracted)
        ├── schema.ts
        ├── content-builder.ts
        ├── repository.ts
        ├── view-models.ts
        ├── index.ts
        └── __tests__/
            └── repository.test.ts (UNIT TESTS - SHOULD BE IN ROOT)
```

**This structure is GOOD, but tests are in wrong location.**

---

## Part 2: Test Organization (Current vs. Target)

### Current State (WRONG)

```
lib/strapi/documentation/strategic/
├── schema.ts
├── content-builder.ts
├── repository.ts
├── view-models.ts
├── index.ts
└── __tests__/
    └── repository.test.ts          ❌ UNIT TESTS (30+ tests)

__tests__/
└── integration-test/documentation/
    └── strategic-repository.test.ts ✅ INTEGRATION TESTS (60+ tests)
```

**Problem:** Unit tests with code doesn't match content-library pattern.

### Target State (CORRECT)

```
lib/strapi/documentation/strategic/
├── schema.ts
├── content-builder.ts
├── repository.ts
├── view-models.ts
└── index.ts
(NO __tests__ folder here)

__tests__/
├── unit/
│   └── documentation/
│       └── strategic-repository.test.ts ✅ UNIT TESTS (30+ tests - MOVED HERE)
│
├── integration-test/documentation/
│   └── strategic-repository.test.ts     ✅ INTEGRATION TESTS (60+ tests - ALREADY HERE)
│
└── e2e/documentation/
    └── strategic.spec.ts                (TO BE CREATED - Phase 3.5)
```

**Alignment with Content Library:**

```
lib/strapi/dashboard/content-library/articles/
(NO __tests__ here either - should validate)

__tests__/
├── unit/content-library/                (NEW PATTERN - not current structure)
│   └── article-repository.test.ts
│
├── integration-test/content-library/    (CURRENT - matches target)
│   ├── article-repository.test.ts
│   ├── case-study-repository.test.ts
│   ├── guide-repository.test.ts
│   └── tutorial-repository.test.ts
│
└── e2e/content-library/                 (CURRENT - matches target)
    └── [route].spec.ts
```

**Key Finding:** Content-library integration tests are in `__tests__/integration-test/`, but unit tests aren't organized in a dedicated `__tests__/unit/` folder. They might be colocated or missing.

### Best Practice (Going Forward, All Modules)

| Test Type       | Location                                        | Rationale                                                                   |
| --------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| **Unit**        | `__tests__/unit/[module]/[feature]`             | All units organized in one place, easy to run `pnpm test -- __tests__/unit` |
| **Integration** | `__tests__/integration-test/[module]/[feature]` | Cross-layer, cross-module validation                                        |
| **E2E**         | `__tests__/e2e/[module]/[feature]`              | Route-level user journeys with Playwright                                   |

---

## Part 3: Root Folder Bloat (Drift from Governance)

### What We Meant to Say (from sessions 1-2)

From **CHECKPOINT_MANIFEST.md** (governance reference):

> "All governance documents in root directory"

**We have ~12 governance documents:**

- STRAPI_DYNAMIC_ZONES_AUTHORITY.md
- STRAPI_COLLECTION_TYPE_SCHEMAS.md
- STRAPI_BUILDER_PATTERN.md
- ARCHITECTURE.md
- ROADMAP.md
- etc.

**What we DIDN'T mean:** Keep every checkpoint, note, and intermediate document forever.

### Current Root Folder Analysis

**Real Governance Documents (Keep):** ~12

```
ARCHITECTURE.md
ROADMAP.md
STRAPI_DYNAMIC_ZONES_AUTHORITY.md
STRAPI_COLLECTION_TYPE_SCHEMAS.md
STRAPI_BUILDER_PATTERN.md
CONTENT_LIBRARY_ARCHITECTURE.md
TESTING_ARCHITECTURE.md
TEST_ORGANIZATION_FINAL.md
REFACTOR_IMPLEMENTATION_GUIDE.md
README.md
DOCUMENTATION_INDEX.md
INFRASTRUCTURE.md
```

**Phase/Session Checkpoints (Archive):** ~35

```
PHASE_3_EXECUTION_PLAN.md
PHASE_3_READY_TO_EXECUTE.md
PHASE_3_EXTRACTION_AUDIT.md
PHASE_3_GATE1_VALIDATION_REPORT.md
PHASE_3_SESSION3_CHECKPOINT.md
SESSION_1_END_CHECKPOINT.md
SESSION_2_COMPLETION_CHECKPOINT.md
[11 more PHASE*/SESSION* files]
```

**Refactor/Audit Notes (Archive):** ~15

```
ARTICLES_REFACTOR_NOTES.md
CASE_STUDIES_REFACTOR_NOTES.md
GUIDES_REFACTOR_NOTES.md
[12 more refactor/audit files]
```

**Delivery/Completion Reports (Archive):** ~8

```
COMPLETION_REPORT.md
CASE_STUDIES_COMPLETE_REPORT.md
DELIVERY_SUMMARY.md
[5 more completion files]
```

**Handoff/Entry Point Docs (Archive):** ~5

```
SESSION_FRESH_START_HANDOFF.md
FRESH_CHAT_HANDOFF.md
NEXT_SESSION_ENTRY_POINT.md
[2 more handoff files]
```

**Other (Unclear Purpose):** ~5

```
PITFALLS_TROUBLESHOOTING.md
MARKDOWN_CLEANUP_MATRIX.md
SPRINT_PLAN.md
[2 more]
```

**Total:** ~60 markdown files

### Problem with Current Structure

1. **New team members don't know which docs are "real"** (governance) vs. "historical" (checkpoint)
2. **ARCHITECTURE.md is the source of truth, but not updated** with Phase 3 decisions
3. **No single index** that says "here's what's locked, here's what's historical"
4. **Discipline drift:** Files created for each phase/checkpoint but never cleaned up

---

## Part 4: ARCHITECTURE.md Status

### Current State (Last Updated: Before Session 3)

**What it covers:**

- ✅ System overview
- ✅ Data layer N-tier pattern
- ✅ Features layer architecture
- ✅ Rendering strategy
- ✅ Error handling
- ✅ Type safety
- ✅ Testing strategy

**What it DOESN'T cover:**

- ❌ Test folder organization (**tests**/unit vs integration vs e2e)
- ❌ Where lib/strapi/documentation module lives
- ❌ How batches are organized (strategic, cms-ref, app-ref, infrastructure)
- ❌ Governance locks (12 immutable decisions)
- ❌ Content Library pattern as reference (only mentions it historically)

### Required Updates to ARCHITECTURE.md

1. **Add Section: Module Architecture (lib/strapi structure)**

   ```
   lib/strapi/
   ├── dashboard/           (Content Library - 4 domains)
   │   └── content-library/
   │       ├── articles/
   │       ├── tutorials/
   │       ├── case-studies/
   │       └── guides/
   │
   └── documentation/       (Documentation - 4 future domains)
       ├── strategic/       (Phase 3 - DONE)
       ├── cms-reference/   (Phase 3 Batch 2 - FUTURE)
       ├── app-reference/   (Phase 3 Batch 3 - FUTURE)
       └── infrastructure/  (Phase 3 Batch 4 - FUTURE)
   ```

2. **Add Section: Test Folder Organization (with commands)**

   ```
   __tests__/
   ├── unit/[module]/[feature]/           (UNIT - isolated, with code)
   ├── integration-test/[module]/[feature] (INTEGRATION - cross-layer)
   ├── e2e/[module]/[feature].spec.ts     (E2E - routes, Playwright)
   └── mocks/                              (Shared fixtures)

   Commands:
   pnpm test -- __tests__/unit
   pnpm test -- __tests__/integration-test
   pnpm test:e2e
   ```

3. **Add Section: Governance Reference (12 locked decisions)**
   - Link to STRAPI_DYNAMIC_ZONES_AUTHORITY.md
   - List the 8 + 4 decisions locked in Sessions 1-2
   - Note: "Cannot change without formal review process"

4. **Add Section: Content Module Pattern (6-layer example)**
   - Show strategic module as first complete example
   - Explain each layer (schema → builder → repo → viewmodels → facade)
   - Show unit + integration test pattern

5. **Update: "Adding New Sections"**
   - Replace with "Adding New Documentation Module"
   - Reference Batch 2-4 pattern
   - Clarify test organization for new modules

---

## Part 5: Remediation Plan

### Step 1: Move Unit Tests to Root (Keep Tests Consistent)

**From:** `lib/strapi/documentation/strategic/__tests__/repository.test.ts`  
**To:** `__tests__/unit/documentation/strategic-repository.test.ts`

**Why:**

- Consistency with integration test pattern (both in root)
- Aligns with "separation of concerns" (tests away from code)
- Easier to run all unit tests: `pnpm test -- __tests__/unit`
- Matches "professional" test organization (pytest, Jest, etc.)

**Files Affected:**

- Delete: `lib/strapi/documentation/strategic/__tests__/`
- Create: `__tests__/unit/documentation/`
- Move & rename: `repository.test.ts` → `strategic-repository.test.ts`

### Step 2: Update Test Commands in package.json

**Current (assumed):**

```json
"test": "vitest",
"test:unit": "vitest --run",
"test:e2e": "playwright test"
```

**New (better organization):**

```json
"test": "vitest",
"test:unit": "vitest __tests__/unit",
"test:integration": "vitest __tests__/integration-test",
"test:e2e": "playwright test __tests__/e2e"
```

### Step 3: Create Root Folder Index

**New File:** `DOCUMENTATION_GOVERNANCE_INDEX.md`

This file will serve as the "source of truth" about what's locked governance vs. historical.

```
# Governance & Architecture Index

## 🔒 Locked Governance (Immutable - Sessions 1-2)

Core Documents (Cannot Change):
- [STRAPI_DYNAMIC_ZONES_AUTHORITY.md](STRAPI_DYNAMIC_ZONES_AUTHORITY.md) - Block architecture, 11 core types, reuse-first
- [STRAPI_COLLECTION_TYPE_SCHEMAS.md](STRAPI_COLLECTION_TYPE_SCHEMAS.md) - Strapi schema designs for 4 domains
- [STRAPI_BUILDER_PATTERN.md](STRAPI_BUILDER_PATTERN.md) - 6-layer data flow pattern
- [ARCHITECTURE.md](ARCHITECTURE.md) - System architecture, testing strategy, module structure

## 🔨 Implementation & Reference

- [TESTING_ARCHITECTURE.md](TESTING_ARCHITECTURE.md) - Test organization & best practices
- [CONTENT_LIBRARY_ARCHITECTURE.md](CONTENT_LIBRARY_ARCHITECTURE.md) - Content Library reference pattern
- [ROADMAP.md](ROADMAP.md) - 4-phase extraction + batch roadmap
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Documentation guide

## 📋 Historical (Reference Only - Do Not Edit)

- PHASE_3_EXECUTION_PLAN.md - Planning document, now superseded by ARCHITECTURE.md
- PHASE_3_READY_TO_EXECUTE.md - Pre-execution checklist
- SESSION_*_CHECKPOINT.md - Session-by-session progress (archived)
- *_REFACTOR_NOTES.md - Old refactor tracking (archived)
- *_COMPLETION_REPORT.md - Phase completion summaries (archived)

Use these for reference only. They represent work already completed.

## 📍 Where to Start

1. **Understanding the system:** Read [ARCHITECTURE.md](ARCHITECTURE.md)
2. **Understanding governance:** Read [STRAPI_DYNAMIC_ZONES_AUTHORITY.md](STRAPI_DYNAMIC_ZONES_AUTHORITY.md)
3. **Adding new content:** Follow [CONTENT_LIBRARY_ARCHITECTURE.md](CONTENT_LIBRARY_ARCHITECTURE.md) pattern
4. **Writing tests:** Read [TESTING_ARCHITECTURE.md](TESTING_ARCHITECTURE.md)

## ⚡ Current Phase

Phase 3: Content Extraction & Migration
- Session 3: Strategic documentation extraction (ACTIVE)
- Next: Batch 2-4 parallel extraction (Sessions 4-6)
```

### Step 4: Update ARCHITECTURE.md

Add 4 new sections covering:

1. **Module Structure** (where code lives)
2. **Test Organization** (where tests live + commands)
3. **Governance Reference** (locked decisions)
4. **Data Module Pattern** (6-layer example with strategic module)

### Step 5: Create Cleanup Log

**New File:** `CLEANUP_SESSION3_LOG.md`

Document exactly what was moved/deleted and why:

```
# Session 3 Cleanup Log

Date: February 28, 2026

## Files Moved (Reorganization)

### Unit Tests Relocated to Root

- [x] `lib/strapi/documentation/strategic/__tests__/repository.test.ts`
  - Moved to: `__tests__/unit/documentation/strategic-repository.test.ts`
  - Reason: Consistency with root test organization + integration tests in root
  - Git: mv lib/strapi/documentation/strategic/__tests__/repository.test.ts __tests__/unit/documentation/strategic-repository.test.ts
  - Files Updated: package.json (test commands), ARCHITECTURE.md (test section)

## Directories Deleted

- [x] `lib/strapi/documentation/strategic/__tests__/`
  - Reason: No longer in use (unit tests moved to root)
  - Contents: Only repository.test.ts (now in root __tests__/unit/)

## Files Created (Organization)

- [x] `DOCUMENTATION_GOVERNANCE_INDEX.md` - Root folder guide
- [x] `CLEANUP_SESSION3_LOG.md` - This file
- [x] Updated `ARCHITECTURE.md` - Sections 8, 9, 10, 11

## Test Organization Compliance

Before cleanup:
- Unit tests: `lib/strapi/documentation/strategic/__tests__/` ❌
- Integration tests: `__tests__/integration-test/documentation/` ✅
- E2E tests: Not yet created ⏳

After cleanup:
- Unit tests: `__tests__/unit/documentation/` ✅
- Integration tests: `__tests__/integration-test/documentation/` ✅
- E2E tests: To be created in Phase 3.5 ⏳

## Consistency Check

Content Library Pattern (Reference):
```

lib/strapi/dashboard/content-library/articles/ (NO **tests**)
**tests**/
├── unit/content-library/ (if they exist... need to verify)
├── integration-test/content-library/ ✅
└── e2e/content-library/ ✅

```

Documentation Pattern (New, Now Matching):
```

lib/strapi/documentation/strategic/ (NO **tests**)
**tests**/
├── unit/documentation/ ✅
├── integration-test/documentation/ ✅
└── e2e/documentation/ ⏳

```

✅ **Patterns now identical**

## Status: COMPLETE

All drift corrected. Architecture is now consistent.
Next: Gate 2 Testing (verify >90% coverage)
```

---

## Part 6: Why This Happened (Root Cause Analysis)

### The Drift Pattern

1. **First Implementation Cognitive Load**
   - Domain layer was NEW (documentation vs. existing content-library)
   - Test organization wasn't _explicitly_ pre-planned for new modules
   - Default behavior: "put tests with code" (common pattern in unit testing)
   - **Mistake:** Didn't check content-library pattern first

2. **Lack of Pre-Flight Checklist**
   - No explicit verification step: "Are unit tests in root or with code?"
   - Assumption error: "Tests are typically colocated, especially for data layer"
   - **Should've done:** Review content-library structure before adding documentation

3. **Partial Correction**
   - Integration tests were created in root correctly
   - Unit tests stayed with code (partial pattern)
   - **Should've done:** Complete the pattern immediately

4. **Root Folder Bloat Historical**
   - Not caused by Session 3 (pre-existing issue)
   - Checkpoint/status files created for each phase (common in documentation)
   - **Should've done:** Establish "archive cleanup" discipline earlier

---

## Part 7: Prevention (Going Forward)

### Pre-Flight Checklist for New Modules (Batch 2-4)

Before writing ANY code for a new documentation domain, verify:

- [ ] **Module location:** `lib/strapi/documentation/[domain]/`
- [ ] **Data layer structure:**
  - `schema.ts` (Zod validation)
  - `content-builder.ts` (load + validate JSON)
  - `repository.ts` (server-only queries)
  - `view-models.ts` (UI transforms)
  - `index.ts` (public facade)
- [ ] **Unit test location:** `__tests__/unit/documentation/[domain]-repository.test.ts`
- [ ] **Integration test location:** `__tests__/integration-test/documentation/[domain]-repository.test.ts`
- [ ] **Data location:** `data/documentation-[domain]/` (JSON articles)
- [ ] **Test structure matches:** integration-test/content-library pattern exactly

### Root Folder Hygiene

After each phase, archive old checkpoint files to `/docs/history/`:

```
docs/
├── history/
│   ├── phase-1-10/
│   │   ├── PHASE_1_EXECUTION_PLAN.md
│   │   ├── PHASE_1_COMPLETION_REPORT.md
│   │   └── SESSION_CHECKPOINTS/ (archived sessions)
│   └── phase-3-sessions/
│       ├── SESSION_1_END_CHECKPOINT.md
│       ├── SESSION_2_COMPLETION_CHECKPOINT.md
│       └── SESSION_3_CLEANUP_LOG.md
└── current/
    ├── ARCHITECTURE.md (ALWAYS CURRENT)
    ├── ROADMAP.md (ALWAYS CURRENT)
    └── TESTING_ARCHITECTURE.md (ALWAYS CURRENT)
```

**Rule:** Root folder contains ONLY:

- Locked governance docs
- Current architecture/roadmap
- Entry point documentation (README.md, DOCUMENTATION_INDEX.md)

---

## Summary of Changes

| What                          | Current                                      | Target                                    | Status            |
| ----------------------------- | -------------------------------------------- | ----------------------------------------- | ----------------- |
| **Unit test location**        | lib/strapi/documentation/strategic/**tests** | **tests**/unit/documentation/             | 🔴 Needs moving   |
| **Integration test location** | **tests**/integration-test/documentation/    | **tests**/integration-test/documentation/ | ✅ Correct        |
| **E2E test location**         | (N/A yet)                                    | **tests**/e2e/documentation/              | ⏳ Phase 3.5      |
| **Data layer location**       | lib/strapi/documentation/strategic/          | lib/strapi/documentation/strategic/       | ✅ Correct        |
| **JSON data location**        | data/documentation-strategic/                | data/documentation-strategic/             | ✅ Correct        |
| **ARCHITECTURE.md**           | Missing test org + module structure sections | Updated with 4 new sections               | 🔴 Needs update   |
| **Root folder index**         | (N/A)                                        | DOCUMENTATION_GOVERNANCE_INDEX.md         | 🔴 Needs creation |
| **Test commands**             | (assumed default)                            | Updated in package.json                   | 🔴 Needs update   |

**Status: Ready for remediation (90 minutes)**
