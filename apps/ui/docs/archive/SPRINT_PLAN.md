# SPRINT PLAN — Architecture Governance Lock + Strapi Builder Integration

**Created:** February 28, 2026  
**Status:** Phase 1 (Governance) Complete, Planning Phase 2-5  
**Token Budget:** Context window 128K (72% used this session)  
**Owner:** Senior Architect (you)  
**Next Session Date:** TBD (recommended within 24-48 hours)

---

## Executive Summary

This document tracks **5 phases of governance lock + implementation** in sprints, with explicit:

- ✅ Completed tasks
- 📋 Tasks for THIS session
- 🔄 Tasks for NEXT session
- 📊 Resource estimates (tokens, effort hours)
- ⚠️ Blocking dependencies
- 🎯 Success criteria per sprint

---

## Session 1 (THIS SESSION) — Governance Lock — COMPLETION PHASE

**Started:** February 28, 2026  
**Status:** 72% token capacity used  
**Completion Target:** This session (next 30 minutes max)  
**Resource Budget:** ~35K tokens remaining

### Completed Tasks ✅

| Task                                           | Owner    | Status | Tokens | Hours |
| ---------------------------------------------- | -------- | ------ | ------ | ----- |
| Read SESSION_DYNAMIC_ZONES_HANDOFF.md          | You + Me | ✅     | 2K     | 0.25  |
| Confirm 8 locked decisions                     | You      | ✅     | -      | 0.25  |
| Create STRAPI_DYNAMIC_ZONES_AUTHORITY.md       | Me       | ✅     | 8K     | 1     |
| SEO-first governance update (seo required now) | Me       | ✅     | 3K     | 0.5   |
| Create MARKDOWN_CLEANUP_MATRIX.md              | Me       | ✅     | 6K     | 1     |
| Create EXTRACTION_FIRST_MIGRATION_PLAN.md      | Me       | ✅     | 8K     | 1     |
| Create SESSION_CHECKPOINT_GOVERNANCE_LOCK.md   | Me       | ✅     | 4K     | 0.5   |
| Create NEXT_SESSION_ENTRY_POINT.md             | Me       | ✅     | 4K     | 0.5   |
| Identify postman files (6 files)               | You + Me | ✅     | 3K     | 0.25  |
| Review postman files purpose                   | Me       | ✅     | 2K     | 0.25  |

**Total Tokens This Session (So Far):** ~40K (used) + 52K (tool results/system) = 92K  
**Remaining Budget This Session:** ~36K tokens

### Remaining Tasks THIS SESSION (Final 30 min)

**High Priority (MUST complete):**

| #   | Task                                                    | Owner | Estimate | Blocker?      |
| --- | ------------------------------------------------------- | ----- | -------- | ------------- |
| 1   | Create SPRINT_PLAN.md (this file)                       | Me    | 3K       | No            |
| 2   | Create STRAPI_BUILDER_PATTERN.md (core Strapi contract) | Me    | 8K       | Yes (Phase 2) |
| 3   | Move postman files to /docs/postman-api-testing/        | Me    | 1K       | No            |
| 4   | Create SESSION_END_CHECKPOINT.md (handoff for next)     | Me    | 3K       | No            |

**Stretch (if tokens allow):**

| #   | Task                                                           | Owner | Estimate | Blocker? |
| --- | -------------------------------------------------------------- | ----- | -------- | -------- |
| 5   | Create REUSABLE_COMPONENT_INVENTORY.md (component governance)  | Me    | 7K       | No       |
| 6   | Create ARCHITECTURE_IMPLEMENTATION_CHECKLIST.md (phase gates)  | Me    | 5K       | No       |
| 7   | Align EXTRACTION_FIRST_MIGRATION_PLAN.md (Strapi builder refs) | Me    | 2K       | No       |

**Recommendation:** Focus on tasks 1-4. Stretch if tokens allow. Don't force 5-7 if we run low.

---

## Session 2 (NEXT SESSION) — Strapi Schema Design + Component Governance

**Scheduled:** Within 24-48 hours (recommended Thu-Fri)  
**Duration:** ~4 hours  
**Token Budget:** 128K (fresh)  
**Owner:** You + Me + Tech Lead (review)

### Objectives

1. ✅ Review governance lock from Session 1
2. ✅ Complete missing governance docs (STRAPI_BUILDER_PATTERN.md, COMPONENT_INVENTORY.md, CHECKLIST.md)
3. ✅ Tech lead approval on all docs
4. ✅ Plan Strapi collection types (design, not implementation)
5. ✅ Create sample Strapi schema (conceptual, JSON)

### Sprint 2 Tasks

#### 2.1: Governance Review & Approval (30 min)

| #     | Task                                          | Owner             | Estimate          | Success Criteria                         |
| ----- | --------------------------------------------- | ----------------- | ----------------- | ---------------------------------------- |
| 2.1.1 | Read all Session 1 governance docs            | Tech Lead         | 1K tokens, 30 min | Understands 6-layer + SEO-first + blocks |
| 2.1.2 | Sign-off on STRAPI_DYNAMIC_ZONES_AUTHORITY.md | Senior Arch + CTO | -                 | Signature + date in doc                  |
| 2.1.3 | Sign-off on SEO policy requirements           | Senior Arch       | -                 | Signature confirming SEO is first-class  |
| 2.1.4 | Confirm postman files moved to /docs/         | You               | 5 min             | Files out of root, organized             |

**Blocking Issue:** Don't proceed to 2.2 until 2.1 complete

---

#### 2.2: Complete Governance Docs (2 hours)

| #     | Task                                                        | Owner | Estimate   | Deliverable                                                          |
| ----- | ----------------------------------------------------------- | ----- | ---------- | -------------------------------------------------------------------- |
| 2.2.1 | Create STRAPI_BUILDER_PATTERN.md                            | Me    | 8K, 45 min | Strapi collection types, dynamic zones, relations, SEO fields mapped |
| 2.2.2 | Create REUSABLE_COMPONENT_INVENTORY.md                      | Me    | 7K, 45 min | All atoms/molecules/organisms/blocks cataloged with reuse rules      |
| 2.2.3 | Create ARCHITECTURE_IMPLEMENTATION_CHECKLIST.md             | Me    | 5K, 30 min | Phase gates (1-5) with explicit success criteria per phase           |
| 2.2.4 | Update EXTRACTION_FIRST_MIGRATION_PLAN.md (align to Strapi) | Me    | 2K, 15 min | Add Strapi schema references, collection type mappings               |

**Outputs:** 4 new governance docs, fully aligned

---

#### 2.3: Strapi Schema Design (1 hour 30 min)

| #     | Task                                                                              | Owner    | Estimate   | Deliverable                              |
| ----- | --------------------------------------------------------------------------------- | -------- | ---------- | ---------------------------------------- |
| 2.3.1 | Design Strapi collection types (1 per domain: Strategic, CMS-Ref, App-Ref, Infra) | You + Me | 3K, 30 min | JSON schema for each collection type     |
| 2.3.2 | Map Strapi dynamic zones to core blocks                                           | Me       | 2K, 20 min | Strapi component definitions (11 blocks) |
| 2.3.3 | Map Strapi SEO plugin fields to metadata generation rules                         | Me       | 2K, 20 min | Field mapping + fallback chain           |
| 2.3.4 | Create sample Strapi JSON (1 article in Strategic domain)                         | You      | 2K, 20 min | Proof-of-concept example                 |

**Outputs:** Strapi schema ready for Phase 3

---

#### 2.4: Tech Lead Review & Sign-Off (30 min)

| #     | Task                                                    | Owner     | Estimate     | Success Criteria                 |
| ----- | ------------------------------------------------------- | --------- | ------------ | -------------------------------- |
| 2.4.1 | Tech lead reviews all 4 governance docs + Strapi schema | Tech Lead | 1.5K, 30 min | No blocking issues, sign-off     |
| 2.4.2 | Create SESSION_2_CHECKPOINT.md (completion summary)     | Me        | 2K, 15 min   | Clear what's locked, what's next |

**Gate:** All governance locked. Phase 3 ready to start.

---

## Session 3 (THIRD SESSION) — Batch 1 Extraction + Data Layer

**Scheduled:** 1 week after Session 2  
**Duration:** 8 hours (full day sprint)  
**Token Budget:** 128K (fresh)  
**Owner:** You + Frontend Dev + Me (architect oversight)

### Objectives

1. Extract documentation from markdown → JSON (Strategic domain)
2. Validate JSON against schema
3. Implement data layer (builder, repository, viewmodels, facade)
4. Pass validation gates 1-2 (schema + data)

### Sprint 3 Tasks (Batch 1: Strategic Overview Domain)

#### 3.1: Content Extraction (2 hours)

| #     | Task                                                     | Owner        | Estimate   | Deliverable                                  |
| ----- | -------------------------------------------------------- | ------------ | ---------- | -------------------------------------------- |
| 3.1.1 | Audit ROADMAP.md + ARCHITECTURE.md for strategic content | You          | 4K, 45 min | Content inventory (8-10 articles identified) |
| 3.1.2 | Extract content to temp markdown, break into blocks      | Frontend Dev | 4K, 60 min | 8-10 block-structured markdown files         |
| 3.1.3 | Create JSON files from extracted blocks                  | You          | 3K, 30 min | 8-10 JSON files (raw, not yet validated)     |

**Gate 1 Prep:** All JSON files created

---

#### 3.2: Schema Validation (Gate 1) (1 hour)

| #     | Task                                                                  | Owner | Estimate   | Success Criteria                               |
| ----- | --------------------------------------------------------------------- | ----- | ---------- | ---------------------------------------------- |
| 3.2.1 | Validate all extracted JSON against documentation-schema-strategic.ts | Me    | 2K, 30 min | All JSON validates, zero warnings, zero errors |
| 3.2.2 | Create BATCH_1_SCHEMA_VALIDATION_REPORT.md                            | Me    | 1K, 15 min | Signed-off validation report                   |
| 3.2.3 | Architect review + approval                                           | You   | -          | Gate 1 marked PASS                             |

**Gate 1:** ✅ Schema Validation PASS → Proceed to data layer

---

#### 3.3: Data Layer Implementation (4 hours)

| #     | Task                                                                   | Owner        | Estimate   | Deliverable                                    |
| ----- | ---------------------------------------------------------------------- | ------------ | ---------- | ---------------------------------------------- |
| 3.3.1 | Create documentation-schema-strategic.ts (based on canonical contract) | Frontend Dev | 2K, 45 min | Zod schema, fully typed                        |
| 3.3.2 | Create documentation-strategic-content-builder.ts                      | Frontend Dev | 3K, 60 min | Load + validate + register all JSON files      |
| 3.3.3 | Create documentation-strategic-repository.ts                           | Frontend Dev | 3K, 60 min | Server-only queries (list, getBySlug, filters) |
| 3.3.4 | Create documentation-strategic-view-models.ts                          | Frontend Dev | 2K, 45 min | Format dates, add computed properties          |
| 3.3.5 | Create documentation-strategic.ts (facade)                             | Frontend Dev | 1K, 15 min | Public API re-exports                          |
| 3.3.6 | Write data layer tests (vitest)                                        | Frontend Dev | 2K, 45 min | Unit tests for all layers                      |

**Gate 2 Prep:** All data layer code + tests ready

---

#### 3.4: Data Integrity (Gate 2) (1 hour)

| #     | Task                                      | Owner        | Estimate     | Success Criteria                      |
| ----- | ----------------------------------------- | ------------ | ------------ | ------------------------------------- |
| 3.4.1 | Run data layer tests (pnpm run test:data) | Frontend Dev | 1.5K, 30 min | All tests pass, >90% coverage         |
| 3.4.2 | Verify all queries return correct data    | Frontend Dev | 1K, 20 min   | Repository queries accurate, no nulls |
| 3.4.3 | Create BATCH_1_DATA_INTEGRITY_REPORT.md   | Me           | 1K, 10 min   | Signed-off test report                |

**Gate 2:** ✅ Data Integrity PASS → Proceed to routes

---

### Session 3 Stretch (if tokens allow, 1-2 hours)

| #     | Task                                                                    | Owner        | Estimate     | Can Defer To Session 4? |
| ----- | ----------------------------------------------------------------------- | ------------ | ------------ | ----------------------- |
| 3.5.1 | Create /app/documentation/strategic/page.tsx (list)                     | Frontend Dev | 1.5K, 30 min | Yes                     |
| 3.5.2 | Create /app/documentation/strategic/[slug]/page.tsx (detail + metadata) | Frontend Dev | 2K, 45 min   | Yes                     |
| 3.5.3 | Implement generateStaticParams() + generateMetadata()                   | Frontend Dev | 1.5K, 30 min | Yes                     |
| 3.5.4 | Add to content-route-manifest.ts                                        | Frontend Dev | 0.5K, 15 min | Yes                     |

**Recommendation:** If tokens <50% by end of 3.4, defer 3.5 to Session 4.

---

## Session 4 (FOURTH SESSION) — Batch 1 Route Migration + Gate 3-5

**Scheduled:** 2-3 days after Session 3  
**Duration:** 4 hours  
**Token Budget:** 128K (fresh)  
**Owner:** Frontend Dev + Me (arch oversight)

### Objectives

1. Complete route migration from Session 3.5
2. Pass validation gates 3-5 (routes + quality + build)
3. Merge Batch 1 to main

### Sprint 4 Tasks

#### 4.1: Route & Metadata (Gate 3) (1 hour)

| #     | Task                                              | Owner        | Estimate     | Success Criteria                                        |
| ----- | ------------------------------------------------- | ------------ | ------------ | ------------------------------------------------------- |
| 4.1.1 | Create routes (list + detail pages)               | Frontend Dev | 2K, 30 min   | Pages render without errors                             |
| 4.1.2 | Test generateStaticParams() returns all slugs     | Frontend Dev | 1K, 20 min   | All slug combinations generated                         |
| 4.1.3 | Test generateMetadata() returns complete metadata | Frontend Dev | 1K, 20 min   | Metadata includes title, description, canonical, robots |
| 4.1.4 | Verify sitemap includes all routes                | Frontend Dev | 0.5K, 10 min | Routes appear in sitemap.xml                            |

**Gate 3:** ✅ Routes & Metadata PASS

---

#### 4.2: Quality & Accessibility (Gate 4) (45 min)

| #     | Task                                              | Owner        | Estimate     | Success Criteria           |
| ----- | ------------------------------------------------- | ------------ | ------------ | -------------------------- |
| 4.2.1 | Visual inspection (no broken layouts)             | Frontend Dev | 1.5K, 20 min | Pages render correctly     |
| 4.2.2 | A11y check (semantic HTML, ARIA, images have alt) | Frontend Dev | 1K, 15 min   | Zero a11y violations       |
| 4.2.3 | Test TOC navigation (if present)                  | Frontend Dev | 0.5K, 10 min | Links work, anchors scroll |

**Gate 4:** ✅ Quality & Accessibility PASS

---

#### 4.3: Build & Production (Gate 5) (45 min)

| #     | Task                                            | Owner        | Estimate     | Success Criteria            |
| ----- | ----------------------------------------------- | ------------ | ------------ | --------------------------- |
| 4.3.1 | TypeScript compilation (pnpm exec tsc --noEmit) | Frontend Dev | 1.5K, 20 min | Zero type errors            |
| 4.3.2 | Next.js build (pnpm run build)                  | Frontend Dev | 1.5K, 20 min | Build succeeds, no warnings |
| 4.3.3 | Run all tests (pnpm run test)                   | Frontend Dev | 1K, 15 min   | All tests pass              |

**Gate 5:** ✅ Build & Production PASS

---

#### 4.4: Merge & Documentation (30 min)

| #     | Task                                           | Owner | Estimate   | Deliverable                          |
| ----- | ---------------------------------------------- | ----- | ---------- | ------------------------------------ |
| 4.4.1 | Create BATCH_1_COMPLETION_REPORT.md            | Me    | 2K, 20 min | What was done, gates passed, metrics |
| 4.4.2 | Merge to main branch                           | You   | -          | Batch 1 live                         |
| 4.4.3 | Create SESSION_4_CHECKPOINT.md (status + next) | Me    | 1K, 10 min | Clear what's next (Batch 2)          |

**Merge Gate:** All 5 validation gates PASS + approvals ✅

---

## Sessions 5-7 (WEEKS 2-3) — Batches 2-4

**Pattern:** Repeat Sessions 3-4 for each domain

| Batch   | Domain               | Effort   | Sessions    | Status                       |
| ------- | -------------------- | -------- | ----------- | ---------------------------- |
| Batch 1 | Strategic Overview   | 10 hours | 3-4         | 📅 Planned                   |
| Batch 2 | CMS Reference        | 15 hours | 5-6         | 📅 Queued (after 1 approved) |
| Batch 3 | App Reference        | 18 hours | (split 6-7) | 📅 Queued                    |
| Batch 4 | Infrastructure & Ops | 12 hours | 7-8         | 📅 Queued                    |

---

## Session 8 (WEEK 4) — Archive Cleanup + Strapi Schema Prep

**Duration:** 2 hours  
**Owner:** You + Architect

### Tasks

| #   | Task                                                       | Owner     | Estimate     | Deliverable                               |
| --- | ---------------------------------------------------------- | --------- | ------------ | ----------------------------------------- |
| 8.1 | Execute archive procedure (move 37 files, create index)    | You       | 1.5K, 1 hour | `/backups/` clean structure               |
| 8.2 | Root directory cleanup (verify only canonical docs remain) | You       | 0.5K, 30 min | Clean root, noise gone                    |
| 8.3 | Create Strapi collection types in test environment         | Architect | 2K, 45 min   | Strapi instance with Strategic collection |
| 8.4 | Test JSON import from extracted content                    | Architect | 1K, 30 min   | Proof: extracted JSON → Strapi            |

---

## Session 9+ (PHASE 4+) — Live Strapi + Real-Time Updates

**Future:** After Phase 3 (extraction) validated  
**Scope:** Migrate to live Strapi, webhook ISR, real-time content updates

---

## Resource Budget Summary

### Token Usage Estimate (By Session)

| Session      | Focus                               | Tokens Used  | % of Budget | State            |
| ------------ | ----------------------------------- | ------------ | ----------- | ---------------- |
| Session 1    | Governance lock                     | 92K / 128K   | 72%         | ✅ This session  |
| Session 2    | Governance complete + Strapi schema | ~110K / 128K | 86%         | 📅 Next (24-48h) |
| Session 3    | Batch 1 extraction + data layer     | ~100K / 128K | 78%         | 📅 Week 1        |
| Session 4    | Batch 1 routes + gates              | ~80K / 128K  | 62%         | 📅 Week 1        |
| Sessions 5-7 | Batches 2-4 (repeat pattern)        | ~100K each   | 78% each    | 📅 Weeks 2-3     |
| Session 8    | Cleanup + Strapi prep               | ~40K / 128K  | 31%         | 📅 Week 4        |

**Total Token Budget (All Sessions):** ~700K tokens (across 8 sessions)  
**Recommendation:** Each session ~100-110K tokens = solid progress without bottleneck

---

## Resource & Capacity Monitoring

### Context Window Health Checks

Add this to EVERY session start:

```
Session N Start:
- [ ] Check token usage at session start
- [ ] If >75%, plan to defer non-critical tasks
- [ ] If >85%, recommend new session + clear handoff
- [ ] If <50%, can stretch into stretch tasks
```

### Variables to Track

| Metric                  | Target           | Current   |
| ----------------------- | ---------------- | --------- |
| Tokens per session      | 100-110K         | 92K (S1)  |
| Completion % per sprint | 100% before gate | 100% (S1) |
| Governance docs locked  | 8 by S2          | 3 (S1)    |
| Data layer tests        | >90% coverage    | (TBD S3)  |
| Validation gates passed | 5/5 per batch    | (TBD S3)  |

---

## Blocking Dependencies

### Critical Path

```
Session 1: Governance Lock ✅
    ↓
Session 2: Strapi Schema Design (BLOCKED until 1 complete)
    ↓
Session 3: Batch 1 Extraction (BLOCKED until 2 approved)
    ↓
Session 4: Batch 1 Routes (BLOCKED until 3 gates 1-2 pass)
    ↓
Sessions 5-7: Batches 2-4 (PARALLELIZABLE after 4)
    ↓
Session 8: Archive + Strapi Live (BLOCKED until batches 1-4 merged)
```

---

## Success Criteria (Full Victory)

| Phase                   | Success =                                               | Verification                                                    |
| ----------------------- | ------------------------------------------------------- | --------------------------------------------------------------- |
| Phase 1 (Governance) ✅ | 8 locked governance docs + tech lead sign-off           | STRAPI_DYNAMIC_ZONES_AUTHORITY.md + signatures                  |
| Phase 2                 | 4 additional docs + Strapi schema approved              | Complete docs + sign-off on checklist.md                        |
| Phase 3                 | All 4 batches extracted + data layers 100% gates 1-2    | 4 schema, 4 builders, 4 repositories, 4 repositories tests pass |
| Phase 4                 | All 4 batches routed + gates 3-5 pass                   | All routes render, sitemap works, build passes, merged to main  |
| Phase 5                 | Root cleaned, postman files organized, ready for Strapi | Archives created, backups indexed, root <50 files               |
| Phase 6                 | Live Strapi integrated, real-time updates working       | Webhook ISR passes, content syncs live                          |

---

## Handoff & Continuation Protocol

### At End of EVERY Session

**Create:** `SESSION_N_CHECKPOINT.md` containing:

- ✅ Completed tasks + tokens used
- 📋 Incomplete tasks (why deferred)
- 📊 Resource state (tokens remaining, capacity)
- 🔄 Next session entry point (what to read first)
- ⚠️ Blockers or risks to know about
- 🎯 Clear "start here" for next session

### Example (Session 1 → Session 2 Handoff)

```
SESSION_1_CHECKPOINT.md (Created end of this session)

## Completed
- ✅ Governance lock (3 docs)
- ✅ SEO-first policy
- ✅ Identified postman files

## Incomplete
- 📋 STRAPI_BUILDER_PATTERN.md (deferred to Session 2, 8K tokens)
- 📋 REUSABLE_COMPONENT_INVENTORY.md (deferred to Session 2, 7K tokens)
- 📋 ARCHITECTURE_IMPLEMENTATION_CHECKLIST.md (deferred to Session 2, 5K tokens)
- 📋 Move postman files (1K tokens, 10 min)

## Resources
- Tokens used: 92K / 128K (72%)
- Tokens remaining: 36K (can finish key docs if stretched)
- Capacity: YELLOW (close to limit, recommend fresh session for Phase 2)

## For Next Session
1. Read: SESSION_CHECKPOINT_GOVERNANCE_LOCK.md (context)
2. Confirm: Tech lead approval on STRAPI_DYNAMIC_ZONES_AUTHORITY.md
3. Action: Create 3 docs (STRAPI_BUILDER_PATTERN, COMPONENT_INVENTORY, CHECKLIST)
4. Gate: Tech lead sign-off on all docs before Phase 2 extraction starts

## Risks
- Postman files still in root (naming noise, not critical)
- No Strapi schema design yet (blocks Phase 3)
```

---

## Recommended Next Actions (Session 2 Start)

```
SESSION 2 — Recommended First 10 Minutes

1. Open SESSION_1_CHECKPOINT.md (this file)
2. Review what's locked vs. deferred
3. Check token budget (should be ~128K fresh)
4. Read STRAPI_DYNAMIC_ZONES_AUTHORITY.md (5 min review)
5. Confirm with tech lead: "Ready to lock Phase 2?"
6. Begin with STRAPI_BUILDER_PATTERN.md creation (8K, 45 min)

Entry Point: SESSION_CHECKPOINT_GOVERNANCE_LOCK.md + this file
```

---

## Final Notes

### Why This Structure Works

- **Trackable:** Each task has owner, estimate, success criteria
- **Resource-Aware:** Token budgets prevent overruns
- **Parallelizable:** Batches 2-4 can run in parallel after batch 1 approved
- **Fault-Tolerant:** If a session overruns, next session has clear handoff
- **Maintainable:** Future readers know exactly what was planned vs. executed

### Why We Freeze Before Implementation

- Governance lock = no architecture changes mid-implementation
- All data structure decisions locked = code follows proven pattern
- All validation gates explicit = no surprises at merge
- All resources budgeted = no scope creep

This is **how professional teams execute platinum-standard architecture at scale** without chaos.

---

**Status:** 📋 SPRINT PLAN COMPLETE  
**Token Used:** ~15K (this file)  
**Remaining This Session:** ~21K (enough to create SESSION_END_CHECKPOINT.md)  
**Recommendation:** Close this session now, start fresh Session 2 with clean 128K budget  
**Confidence:** 🟢 HIGH — All work is trackable, resourced, and sequenced correctly
