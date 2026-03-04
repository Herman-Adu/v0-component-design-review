# Markdown Cleanup Matrix

**Status:** Governance Policy (Feb 28, 2026)  
**Authority:** Canonical keep/archive decisions for all markdown files  
**Last Updated:** 2026-02-28

---

## Executive Summary

This document defines which markdown files are **canonical and kept active**, which are **archived for historical reference**, and the process for safe deletion.

**Key Rules:**

- ✅ **No destructive deletes** without explicit checkpoint review and approval
- ✅ **Superseded files** are moved to `/backups/` with `superseded-by:` tracking
- ✅ **Canonical files** are marked locked and reviewed each session
- ✅ **Archive strategy** preserves historical context while reducing workspace noise

---

## Keep Matrix — Active Canonical Docs

These files are **actively maintained** and are the source of truth for their domains. They are reviewed/updated in each new session.

| File                                  | Purpose                                                          | Owner             | Review Cycle        | Status    |
| ------------------------------------- | ---------------------------------------------------------------- | ----------------- | ------------------- | --------- |
| **ARCHITECTURE.md**                   | System-wide patterns (N-tier, server-only, types)                | Senior Architect  | Per-phase           | 🔒 Locked |
| **CONTENT_LIBRARY_ARCHITECTURE.md**   | Production 6-layer example (content model)                       | Senior Architect  | Per-phase           | 🔒 Locked |
| **STRAPI_DYNAMIC_ZONES_AUTHORITY.md** | Governance lock for blocks + schemas                             | Senior Architect  | Per-migration-phase | 🔒 Locked |
| **INFRASTRUCTURE.md**                 | Infrastructure patterns (logging, error handling, observability) | DevOps/Architect  | Per-quarter         | ✅ Active |
| **ROADMAP.md**                        | Strategic vision (phases, integrations, technical debt)          | Product/Architect | Per-quarter         | ✅ Active |
| **PITFALLS_TROUBLESHOOTING.md**       | Lessons learned from all sessions                                | Senior Architect  | Per-session         | ✅ Active |
| **REFACTOR_IMPLEMENTATION_GUIDE.md**  | How to execute multi-phase refactors safely                      | Senior Architect  | As-needed           | ✅ Active |
| **README.md**                         | Project overview + deployment status                             | Team              | Per-deploy          | ✅ Active |

**Current Session Review:**

- ✅ ARCHITECTURE.md — No changes needed (already comprehensive)
- ✅ CONTENT_LIBRARY_ARCHITECTURE.md — No changes needed (production-ready)
- ✅ STRAPI_DYNAMIC_ZONES_AUTHORITY.md — Created this session (new lock)
- ✅ INFRASTRUCTURE.md — No changes needed (aligned with authority)
- ✅ ROADMAP.md — No changes needed (waiting on Phase 11+)
- ✅ PITFALLS_TROUBLESHOOTING.md — Will update after session completion
- ✅ README.md — No changes needed (deployment current)

---

## Archive Matrix — Superseded/Session Artifacts

These files are **no longer active** but contain valuable historical context. They will be **moved to `/backups/`** with a `superseded-by:` mapping to help future readers find the current equivalent.

### Session Handoff Files (8 files)

These are entry points from previous sessions. Once processed, they are superseded by this session's handoff.

| File                                | Created      | Supersedes                          | Superseded By                    | Archive To           |
| ----------------------------------- | ------------ | ----------------------------------- | -------------------------------- | -------------------- |
| SESSION_DYNAMIC_ZONES_HANDOFF.md    | This session | (fresh start)                       | (next session's handoff)         | `/backups/SESSION_*` |
| SESSION_FRESH_START_HANDOFF.md      | Previous     | SESSION_HANDOFF_ARCHITECTURE_FIX.md | SESSION_DYNAMIC_ZONES_HANDOFF.md | `/backups/SESSION_*` |
| SESSION_HANDOFF_ARCHITECTURE_FIX.md | Previous     | Earlier session                     | SESSION_FRESH_START_HANDOFF.md   | `/backups/SESSION_*` |
| SESSION_CONTINUATION_SUMMARY.md     | Previous     | (quick ref)                         | This session context             | `/backups/SESSION_*` |
| SESSION_CLOSURE_CHECKLIST.md        | Previous     | (checklist)                         | —                                | `/backups/SESSION_*` |
| FRESH_CHAT_HANDOFF.md               | Previous     | Old session format                  | SESSION_FRESH_START_HANDOFF.md   | `/backups/SESSION_*` |
| START_HERE_TOMORROW.md              | Previous     | (entry point)                       | SESSION_DYNAMIC_ZONES_HANDOFF.md | `/backups/SESSION_*` |
| NEXT_SESSION_ENTRY_POINT.md         | Previous     | (entry point)                       | SESSION_DYNAMIC_ZONES_HANDOFF.md | `/backups/SESSION_*` |
| FINAL_SESSION_SUMMARY.md            | Previous     | (summary)                           | PITFALLS_TROUBLESHOOTING.md      | `/backups/SESSION_*` |

**Action:** Move to `/backups/session-handoffs/` after current session ends

### Phase Reports (16 files)

Numbered phases are completed work. Keep latest for reference, archive earlier ones.

| File                                 | Phase | Status   | Superseded By              | Archive To         |
| ------------------------------------ | ----- | -------- | -------------------------- | ------------------ |
| PHASE1_CLEANUP_SUMMARY.md            | 1     | Complete | PHASE2_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE2_GENERATION_NOTES.md           | 2     | Complete | PHASE3_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE3_GENERATION_NOTES.md           | 3     | Complete | PHASE4_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE4_GENERATION_NOTES.md           | 4     | Complete | PHASE5_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE5_GENERATION_NOTES.md           | 5     | Complete | PHASE6_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE6_GENERATION_NOTES.md           | 6     | Complete | PHASE7_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE7_GENERATION_NOTES.md           | 7     | Complete | PHASE8_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE8_CHECKPOINT_RESUME_TOMORROW.md | 8     | Complete | PHASE8_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE8_FINAL_CHECKPOINT.md           | 8     | Complete | PHASE9_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE8_GENERATION_NOTES.md           | 8     | Complete | PHASE9_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE8_PATH_AUDIT_COMPLETE.md        | 8     | Complete | PHASE9_GENERATION_NOTES.md | `/backups/phases/` |
| PHASE9_COMPLETION_REPORT.md          | 9     | Complete | This session               | `/backups/phases/` |
| PHASE9_GENERATION_NOTES.md           | 9     | Complete | This session               | `/backups/phases/` |
| PHASE9_STATUS.md                     | 9     | Complete | This session               | `/backups/phases/` |
| PHASE10_EXECUTION_GUIDE.md           | 10    | Complete | ROADMAP.md                 | `/backups/phases/` |
| PHASE10_GENERATION_NOTES.md          | 10    | Complete | This session               | `/backups/phases/` |

**Action:** Move all to `/backups/phases/` after each phase ends. Keep only latest 2 phases in root.

### Checkpoint & Completion Reports (20 files)

These are batch completion artifacts from specific work sessions. Archive after their work is complete and findings are integrated into canonical docs.

| File                                  | Batch                | Status   | Integrated Into                       | Archive To              |
| ------------------------------------- | -------------------- | -------- | ------------------------------------- | ----------------------- |
| ALL_SYSTEMS_GO.md                     | Project health       | Complete | PITFALLS_TROUBLESHOOTING.md           | `/backups/checkpoints/` |
| ARCHITECTURAL_OBSERVABILITY_REPORT.md | Architecture audit   | Complete | INFRASTRUCTURE.md                     | `/backups/checkpoints/` |
| ARTICLES_REFACTOR_NOTES.md            | Articles batch       | Complete | CONTENT_LIBRARY_ARCHITECTURE.md       | `/backups/checkpoints/` |
| BATCH_A_COMPLETION_REPORT.md          | Batch A              | Complete | PHASE9_GENERATION_NOTES.md            | `/backups/checkpoints/` |
| CASE_STUDIES_BATCH1_CHECKPOINT.md     | Case Studies 1       | Complete | CONTENT_LIBRARY_ARCHITECTURE.md       | `/backups/checkpoints/` |
| CASE_STUDIES_BATCH2_CHECKPOINT.md     | Case Studies 2       | Complete | CONTENT_LIBRARY_ARCHITECTURE.md       | `/backups/checkpoints/` |
| CASE_STUDIES_COMPLETE_REPORT.md       | Case Studies all     | Complete | CONTENT_LIBRARY_ARCHITECTURE.md       | `/backups/checkpoints/` |
| CASE_STUDIES_REFACTOR_NOTES.md        | Case Studies batch   | Complete | CONTENT_LIBRARY_ARCHITECTURE.md       | `/backups/checkpoints/` |
| CHECKPOINT_MANIFEST.md                | Migration tracking   | Complete | Phase report                          | `/backups/checkpoints/` |
| COMPLETE_DELIVERY_MANIFEST.md         | Phase delivery       | Complete | ROADMAP.md                            | `/backups/checkpoints/` |
| COMPLETION_REPORT.md                  | Phase summary        | Complete | Phase report                          | `/backups/checkpoints/` |
| CONTENT_LIBRARY_3AXIS_REVIEW.md       | CL audit             | Complete | CONTENT_LIBRARY_ARCHITECTURE.md       | `/backups/checkpoints/` |
| CONTENT_LIBRARY_CONSISTENCY_FIX.md    | CL validation        | Complete | CONTENT_LIBRARY_ARCHITECTURE.md       | `/backups/checkpoints/` |
| CONTENT_LIBRARY_REFACTOR_COMPLETE.md  | CL migration         | Complete | CONTENT_LIBRARY_ARCHITECTURE.md       | `/backups/checkpoints/` |
| CONTENT_STRUCTURE_AUDIT.md            | Structure audit      | Complete | CONTENT_LIBRARY_ARCHITECTURE.md       | `/backups/checkpoints/` |
| DATA_FLOW_SINGLE_SOURCE_OF_TRUTH.md   | Data audit           | Complete | ARCHITECTURE.md                       | `/backups/checkpoints/` |
| DELIVERY_SUMMARY.md                   | Delivery report      | Complete | PHASE9_GENERATION_NOTES.md            | `/backups/checkpoints/` |
| DOCUMENTATION_INDEX.md                | Doc inventory        | Complete | This doc (MARKDOWN_CLEANUP_MATRIX.md) | `/backups/checkpoints/` |
| GUIDES_REFACTOR_NOTES.md              | Guides batch         | Complete | CONTENT_LIBRARY_ARCHITECTURE.md       | `/backups/checkpoints/` |
| IMPLEMENTATION_SUMMARY.md             | Implementation audit | Complete | ARCHITECTURE.md                       | `/backups/checkpoints/` |

**Action:** Move all to `/backups/checkpoints/` after review checkpoint approval

### Reference & Specialized Documentation (8 files)

These are reference guides and testing/quality docs. Keep if actively used, archive if superseded by canonical docs.

| File                             | Purpose               | Still Used?                               | Superseded By                    | Archive To            |
| -------------------------------- | --------------------- | ----------------------------------------- | -------------------------------- | --------------------- |
| TEST_FOLDER_STRUCTURE_HANDOFF.md | Test structure        | No (use test README.md)                   | **tests**/README.md              | `/backups/reference/` |
| TEST_STRATEGY_SUMMARY.md         | Test strategy         | No (use TESTING_GUIDE_LOGGING.md)         | TESTING_GUIDE_LOGGING.md         | `/backups/reference/` |
| TEST_SUITE_ORGANIZATION.md       | Test org              | No (use TESTING_GUIDE_LOGGING.md)         | TESTING_GUIDE_LOGGING.md         | `/backups/reference/` |
| TESTING_GUIDE_LOGGING.md         | Testing + logging     | Yes                                       | —                                | ✅ Keep               |
| UNIT_TESTS_WITH_MOCKS.md         | Unit test patterns    | Yes                                       | —                                | ✅ Keep               |
| REFACTOR_CHECKLIST.md            | Refactor checklist    | No (use REFACTOR_IMPLEMENTATION_GUIDE.md) | REFACTOR_IMPLEMENTATION_GUIDE.md | `/backups/reference/` |
| REFACTOR_DOCS_INDEX.md           | Refactor docs index   | No (use MARKDOWN_CLEANUP_MATRIX.md)       | MARKDOWN_CLEANUP_MATRIX.md       | `/backups/reference/` |
| VISUAL_ARCHITECTURE_REFERENCE.md | Architecture diagrams | Yes                                       | —                                | ✅ Keep               |

**Action:** Move superseded items to `/backups/reference/`. Keep testing + visual guides in root.

---

## Archive Structure (Proposed `/backups/`)

```
backups/
├── session-handoffs/
│   ├── SESSION_DYNAMIC_ZONES_HANDOFF.md (after processing)
│   ├── SESSION_FRESH_START_HANDOFF.md
│   ├── SESSION_HANDOFF_ARCHITECTURE_FIX.md
│   └── ... (9 files total)
├── phases/
│   ├── phase-01/
│   │   └── PHASE1_CLEANUP_SUMMARY.md
│   ├── phase-02/
│   │   └── PHASE2_GENERATION_NOTES.md
│   └── ... (up to phase-10)
├── checkpoints/
│   ├── ALL_SYSTEMS_GO.md
│   ├── ARCHITECTURAL_OBSERVABILITY_REPORT.md
│   └── ... (20 files)
├── reference/
│   ├── TEST_FOLDER_STRUCTURE_HANDOFF.md
│   ├── TEST_STRATEGY_SUMMARY.md
│   └── ... (8 files)
└── README.md (archive index)
```

---

## Cleanup Procedure (No Destructive Deletes)

### Step 1: Create Checkpoint (Approval Gate)

Before archiving ANY files, create explicit checkpoint:

```markdown
## Archive Checkpoint: <Session Date>

Reviewed by: <Senior Architect>
Date: <YYYY-MM-DD>

### Files to Archive (17 files)

- SESSION_DYNAMIC_ZONES_HANDOFF.md → /backups/session-handoffs/
- [... list all]

### Verification

- [ ] All "Keep" files remain in root
- [ ] All "Archive" files have superseded-by mappings
- [ ] /backups/ directory structure created
- [ ] Archive index created at /backups/README.md

### Sign-Off

Approved: <Senior Architect Signature>
```

### Step 2: Create Archive Index

Create `/backups/README.md` with:

- **Index of all archived files**
- **Superseded-by mappings** (where to find current equivalent)
- **Historical context** (which phase, what was accomplished)
- **Search guide** (keywords → file location)

**Example:**

```markdown
# Archive Index

## Session Handoffs

- `session-handoffs/SESSION_DYNAMIC_ZONES_HANDOFF.md` (Feb 28, 2026)
  - **Superseded by:** Next session's handoff
  - **Purpose:** Entry point for dynamic zones governance work
  - **Reference for:** Understanding Feb 28 session context

## Phase Reports

- `phases/phase-09/PHASE9_GENERATION_NOTES.md`
  - **Superseded by:** STRAPI_DYNAMIC_ZONES_AUTHORITY.md
  - **Purpose:** Phase 9 execution notes
  - **Contains:** Content library migration details
```

### Step 3: Move Files (Using Git)

Use git mv (preserves history):

```bash
# Create directory structure
mkdir -p backups/session-handoffs
mkdir -p backups/phases/phase-{01..10}
mkdir -p backups/checkpoints
mkdir -p backups/reference

# Move session handoffs
git mv SESSION_DYNAMIC_ZONES_HANDOFF.md backups/session-handoffs/
git mv SESSION_FRESH_START_HANDOFF.md backups/session-handoffs/
# ... etc

# Move phase reports
git mv PHASE1_CLEANUP_SUMMARY.md backups/phases/phase-01/
git mv PHASE2_GENERATION_NOTES.md backups/phases/phase-02/
# ... etc

# Commit
git commit -m "Chore: Archive session handoffs and phase reports to /backups/"
```

### Step 4: Update Session Notes

Add to session closure notes:

```markdown
## Markdown Cleanup (Checkpoint Approved)

✅ Archived 37 files:

- 9 session handoffs → /backups/session-handoffs/
- 16 phase reports → /backups/phases/
- 20 checkpoint artifacts → /backups/checkpoints/
- 8 reference docs → /backups/reference/

✅ Kept 8 canonical docs active in root

✅ Created /backups/README.md with superseded-by mappings

**Result:** Cleaner root directory, full historical context preserved
```

---

## Current Status & Next Actions

### Current State (Feb 28, 2026)

- ✅ 8 canonical files identified and locked
- ✅ 37 obsolete files identified for archiving
- ✅ Archive structure designed
- ✅ Cleanup procedure documented
- ⏳ Archive structure NOT yet created (no destructive action yet)

### Next Actions (Guard Against Premature Deletion)

1. **This session:** Governance lock + matrix completed (no file moves)
2. **Next session (Task 3 start):** Create archive structure + checkpoint
3. **Next session (Task 3 end):** Execute file moves via git mv after approval
4. **Post-session:** Update PITFALLS_TROUBLESHOOTING.md with lessons

### Before Any Moves Happen

- [ ] Senior architect reviews this matrix
- [ ] Team confirmation of keep/archive decisions
- [ ] Archive index created
- [ ] Checkpoint PR created for review
- [ ] Merge only after explicit approval

---

## Superseded-By Mappings (For Archive Index)

Quick reference for future readers finding old docs:

| Old File                            | Current Equivalent                                | Location |
| ----------------------------------- | ------------------------------------------------- | -------- |
| DOCUMENTATION_INDEX.md              | MARKDOWN_CLEANUP_MATRIX.md                        | root     |
| PHASE9_STATUS.md                    | SESSION_DYNAMIC_ZONES_HANDOFF.md                  | root     |
| TEST_STRATEGY_SUMMARY.md            | TESTING_GUIDE_LOGGING.md                          | root     |
| REFACTOR_DOCS_INDEX.md              | MARKDOWN_CLEANUP_MATRIX.md                        | root     |
| DATA_FLOW_SINGLE_SOURCE_OF_TRUTH.md | ARCHITECTURE.md                                   | root     |
| IMPLEMENTATION_SUMMARY.md           | ARCHITECTURE.md + CONTENT_LIBRARY_ARCHITECTURE.md | root     |
| SESSION_FRESH_START_HANDOFF.md      | SESSION_DYNAMIC_ZONES_HANDOFF.md                  | root     |
| START_HERE_TOMORROW.md              | SESSION_DYNAMIC_ZONES_HANDOFF.md                  | root     |
| NEXT_SESSION_ENTRY_POINT.md         | SESSION_DYNAMIC_ZONES_HANDOFF.md                  | root     |

---

## Definition of Terms

- **Keep:** Actively maintained, reviewed each session, single source of truth
- **Archive:** Complete work, valuable context, moved to `/backups/` with index
- **Superseded:** Replaced by newer doc with same/better coverage
- **Checkpoint:** Explicit approval gate before any files are moved
- **Approval Gate:** Senior architect review + team confirmation

---

## Related Documentation

- [Session Dynamic Zones Handoff](SESSION_DYNAMIC_ZONES_HANDOFF.md) — Previous session decisions
- [Strapi Dynamic Zones Authority](STRAPI_DYNAMIC_ZONES_AUTHORITY.md) — Governance lock (Task 1)
- [Pitfalls & Troubleshooting](PITFALLS_TROUBLESHOOTING.md) — Lessons learned from all sessions

---

**Status:** 📋 Policy Document (Ready for Approval Checkpoint)  
**Next Review:** Upon archive structure creation (Task 3)  
**Archive Execution:** Task 3, after approval  
**Questions?** See superseded-by mappings above for guidance on old docs
