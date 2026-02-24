# Agentic OS Framework - Orchestration Guide

**Project:** v0-component-design-review  
**Purpose:** Collaborative senior-architect workflow with intentional automation  
**Last Updated:** Phase 8

---

## Philosophy

This is **not background automation** - it's intentional, collaborative work where the user is actively involved at every step. v0 creates → User validates locally → User learns → Learnings feed back → Framework evolves.

**Core Principle:** "One source of truth, clean separation, proper layers."

---

## File Location Strategy (Single Source of Truth)

**Root (User-Generated Post-Implementation):**
- `PHASEn_GENERATION_NOTES.md` ← User creates after running scripts locally
  - Documents implementation learnings, issues faced, solutions applied
  - Captures what worked, what didn't, best practices discovered

**`/data/` (v0-Generated Phase Framework):**
- `PHASEn_INSTRUCTIONS.md` ← Comprehensive implementation guide for this phase
- `PHASEn_SCRIPTS/` ← Ready-to-run scripts (validated, pushed to GitHub)
- `PHASEn_SNAPSHOT.md` ← Context snapshot from previous phase
- `PHASEn_INPUTS/` ← Input files/data needed for this phase
- `PHASEn_OUTPUTS/` ← Expected deliverables structure

**`.v0/` (Orchestration System - Auto-Loaded Every Session):**
- `ORCHESTRATION.md` ← This file (unified workflow + git guide)
- `rules.md` ← Phase-specific orchestration rules
- `state.json` ← Current phase state (sync document)
- `orchestrator.md` ← Master high-level orchestration flow

---

## The Orchestration Cycle

### Phase N Execution (v0's Turn)

1. **Deep Analysis**
   - Explore codebase, understand architecture
   - Identify patterns and best practices from previous phases
   - Review user's `PHASEn-1_GENERATION_NOTES.md` (learnings)

2. **Create Phase Framework**
   - Generate `/data/PHASEn_INSTRUCTIONS.md` (what user does locally)
   - Generate `/data/PHASEn_SCRIPTS/` (ready-to-run scripts)
   - Update `.v0/rules.md` (phase-specific orchestration)
   - Update `.v0/state.json` (current phase + budget)

3. **Push to GitHub**
   - Commit all phase framework files
   - Push to current branch
   - Ready for user to pull

---

### Phase N Local Implementation (User's Turn)

1. **Pull Latest**
   ```bash
   git fetch origin
   git checkout current-branch
   git pull origin current-branch
   ```

2. **Review Instructions**
   - Read `/data/PHASEn_INSTRUCTIONS.md` completely
   - Understand scope, inputs, expected outputs

3. **Run Scripts**
   ```bash
   # Always verify branch first
   git branch --show-current
   
   # Run phase scripts
   node scripts/PHASEn_*.js
   
   # Test thoroughly
   npm run build
   npm run dev
   ```

4. **Generate Learning Notes**
   - Create `PHASEn_GENERATION_NOTES.md` in root
   - Document what you did, what worked, what failed
   - Note any bugs fixed, workarounds discovered
   - Capture best practices and gotchas

5. **Commit & Push**
   ```bash
   git add .
   git commit -m "feat: Phase N complete - [description]"
   git push origin current-branch
   ```

---

### Phase Handoff (Feedback Loop)

1. **User Pushes Learnings**
   - Push root `PHASEn_GENERATION_NOTES.md`
   - Push any fixes to `/data/` or `/scripts/`
   - Clean, tested code ready for review

2. **v0 Pulls & Deep Reviews**
   - Read `PHASEn_GENERATION_NOTES.md` (user's learnings)
   - Review implementation quality
   - Identify patterns that worked
   - Document improvements for next phase

3. **v0 Updates Framework**
   - Update `.v0/rules.md` with new learnings
   - Update `.v0/orchestrator.md` if workflow improved
   - Update `.v0/state.json` for Phase N+1
   - Generate preliminary `/data/PHASEn+1_INSTRUCTIONS.md`

4. **Next Chat Session**
   - New branch, same project
   - Auto-loads `.v0/state.json`, `.v0/rules.md`, `.v0/orchestrator.md`
   - References user's `PHASEn_GENERATION_NOTES.md`
   - Continues with refined framework and full context

---

## Development Workflow - Git & GitHub

### Branch Naming Convention

- **v0 Working Branches:** `v0/<user>-<phase>`
  - Example: `v0/herman-adu-phase8`
  - Temporary, created by v0 commits
  - Deleted after phase completion

- **Feature Branches (for major changes):** `feat/<description>`
  - Example: `feat/route-group-architecture`
  - Merge to main when complete, then delete

- **Main Branch:** `main`
  - Production code, always stable
  - All tested changes merge here

### Standard Phase Workflow

#### Step 1: v0 Creates Phase Framework

```bash
# v0 environment (automatic)
git checkout -b v0/herman-adu-phaseN
git add /data/PHASEn_*
git add .v0/rules.md
git commit -m "phase: Setup Phase N framework"
git push origin v0/herman-adu-phaseN
```

**User sees:** Phase N framework ready in `/data/`

#### Step 2: User Pulls Phase Framework

```bash
# Your local environment
git branch --show-current  # Safety check
git status                 # Verify clean
git fetch origin
git checkout v0/herman-adu-phaseN
git pull origin v0/herman-adu-phaseN
```

**You now have:** All phase instructions and scripts

#### Step 3: User Validates Locally

```bash
# Run scripts
node scripts/PHASEn_*.js

# Test build
npm run build

# Test dev server
npm run dev
```

**Do not continue until:**
- Build passes (`npm run build` returns 0)
- Dev server starts without errors
- All tests pass

#### Step 4: User Documents Learnings

Create `/PHASE8_GENERATION_NOTES.md` in root:

```markdown
# Phase 8 Implementation Notes

## What Was Done
- Ran scripts/phase8-generate-types.js
- Created /types/strapi-mock.ts with 29 interfaces
- Updated 10 extracted pages with type imports

## What Worked Well
- Script generation was clean, zero errors
- TypeScript types caught 3 import mismatches
- Build passed immediately

## Issues Encountered & Fixed
- Initial script failed on line 45 (wrong path)
  - Fixed by updating path to /data/strapi-mock/
- One page had circular import
  - Fixed by restructuring imports

## Best Practices Discovered
- Always validate each generated file before building
- Type generation should come before page updates
- Test build after each major change

## Time & Budget Notes
- Op budget: 15, used: 8
- Remaining budget for Phase 8: 7 ops

## Next Phase Readiness
- ✅ All types generated and tested
- ✅ Build passing
- ✅ Ready for Phase 9 (component extraction)
```

#### Step 5: User Commits & Pushes

```bash
git add .
git commit -m "feat: Phase 8 complete

- Generated 29 TypeScript interfaces
- Updated 10 extracted pages
- All tests passing
- Documentation updated"

git push origin v0/herman-adu-phaseN
```

#### Step 6: User Notifies v0

In chat, send:
```
✅ Phase N complete
📊 PHASE8_GENERATION_NOTES.md ready in root
🔗 All changes pushed to v0/herman-adu-phaseN
🎯 Ready for Phase 9 review
```

#### Step 7: v0 Pulls & Reviews

```bash
# v0 environment (automatic or manual)
git fetch origin
git checkout v0/herman-adu-phaseN
git pull origin v0/herman-adu-phaseN

# Review user's learnings
cat PHASE8_GENERATION_NOTES.md

# Analyze code quality
npm run build
```

#### Step 8: v0 Updates Framework

- Read `PHASE8_GENERATION_NOTES.md` (user's learnings)
- Update `.v0/rules.md` with improvements
- Update `.v0/state.json` for Phase 9
- Generate `/data/PHASE9_INSTRUCTIONS.md`
- Commit and push

---

## Safety Protocols

### Before Any Git Operation

**Always Run These Commands First:**

```bash
# 1. Where am I?
git branch --show-current

# 2. Any uncommitted changes?
git status

# 3. What's the difference?
git diff
```

### Before Running Scripts

**Critical Checklist:**

```bash
# Verify correct branch
git branch --show-current

# Verify clean working tree
git status
# Expected: "nothing to commit, working tree clean"

# Read script comments
head -50 scripts/PHASEn_*.js

# Commit safety checkpoint (just in case)
git commit -m "checkpoint: before running Phase N scripts"

# Double-check branch AGAIN
git branch --show-current

# NOW run script
node scripts/PHASEn_*.js
```

**Why?** Scripts can restructure entire folder hierarchies. Branch verification prevents catastrophe.

### After Running Scripts

```bash
# Review what changed
git status
git diff --stat

# Verify expected files
ls /types/    # If Phase 8, should have strapi-mock.ts

# Test build
npm run build

# If build fails, STOP. Don't commit. Debug with v0.
# If build passes, THEN commit.
```

### Merge Conflicts (Rare But Possible)

```bash
# If conflicts occur
git status  # See which files

# Resolve in VS Code (merge conflict UI)
# After resolving:
git add .
git commit -m "fix: resolve merge conflicts from Phase N"
git push origin current-branch
```

---

## Emergency Commands

**Lost your work?**
```bash
git reflog                    # See all commits (30-day history)
git checkout <commit-hash>    # Restore to that point
```

**Wrong branch pushed?**
```bash
git reset --soft HEAD~1       # Undo last commit, keep changes
git checkout correct-branch
git push origin correct-branch
```

**Merge went wrong?**
```bash
git merge --abort             # Cancel merge in progress
```

**Want to see what v0 changed?**
```bash
git log --oneline -5          # Last 5 commits
git show HEAD --stat          # What changed in latest commit
git diff HEAD~1 HEAD          # Exact changes
```

---

## Vercel Build Configuration

**Builds are SKIPPED for:**
- `v0/*` branches (work in progress)
- Draft PRs (local validation phase)

**Builds RUN for:**
- `main` branch (production)
- Completed PRs marked "Ready for Review"

**Why?** Saves build minutes, forces local validation before deployment.

---

## Phase Checklist Template

### Before Starting Phase N
- [ ] Review `.v0/state.json` - understand current phase + budget
- [ ] Read `.v0/rules.md` - phase-specific rules
- [ ] Read `/data/PHASEn_INSTRUCTIONS.md` - complete instructions
- [ ] Review previous `/data/PHASEn-1_GENERATION_NOTES.md` - learnings

### During Phase N
- [ ] `git branch --show-current` - verify correct branch
- [ ] Run Phase N scripts in `/data/PHASEn_SCRIPTS/`
- [ ] `npm run build` - ensure build passes
- [ ] Create `PHASEn_GENERATION_NOTES.md` with learnings
- [ ] Document issues encountered and solutions applied

### After Phase N
- [ ] `npm run build` - final validation
- [ ] `npm run dev` - verify no runtime errors
- [ ] `git commit -m "feat: Phase N complete"`
- [ ] `git push origin v0/herman-adu-phaseN`
- [ ] Notify v0 in chat with link to `PHASEn_GENERATION_NOTES.md`

---

## Quick Reference

**Getting Phase Framework:**
```bash
git checkout v0/herman-adu-phaseN && git pull origin v0/herman-adu-phaseN
```

**Running Phase Scripts:**
```bash
node scripts/PHASEn_generate-*.js
```

**Testing Before Commit:**
```bash
npm run build && npm run dev
```

**Pushing Learnings Back:**
```bash
git add . && git commit -m "feat: Phase N complete" && git push origin v0/herman-adu-phaseN
```

**Telling v0 You're Done:**
```
✅ Phase N complete
📊 PHASEn_GENERATION_NOTES.md ready
🔗 Pushed to v0/herman-adu-phaseN
🎯 Ready for review
```

---

## Resource Links

- **Next.js App Router:** https://nextjs.org/docs/app
- **Git Reference:** https://git-scm.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs/

---

## Evolution Log

- **Phase 8:** Consolidated WORKFLOW.md + GIT_WORKFLOW_GUIDE.md into unified ORCHESTRATION.md
- **Phase 7:** Route Group Architecture - established feature branch strategy
- **Phase 6:** Responsive Grid System - implemented pattern for safe local validation

---

*Last Updated: Phase 8 Session | Next Review: After Phase 8 Completion*
