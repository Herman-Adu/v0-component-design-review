# Git Workflow Guide - Atomic Refactor Project

## Overview
This guide provides step-by-step Git commands with safety checks to prevent mistakes during the atomic refactor workflow.

**Workflow Pattern:**
```
v0 (main) → writes code → pushes to main
         ↓
You pull main → create feature branch → run scripts → test → merge back → push main
         ↓
v0 pulls main → sees clean code → continues next phase
```

---

## Phase Start - Getting v0's Changes

### Step 1: Safety Check - Verify Current Branch
```bash
# Always check where you are first
git branch --show-current
```

**Expected output:** `main` or your current feature branch

**If you're on a feature branch:** Complete and merge it first, or stash changes.

---

### Step 2: Ensure Clean Working Tree
```bash
# Check for uncommitted changes
git status
```

**Expected output:** `nothing to commit, working tree clean`

**If you have changes:**
```bash
# Option A: Commit them
git add .
git commit -m "work in progress"

# Option B: Stash them
git stash save "WIP - description"
```

---

### Step 3: Switch to Main Branch
```bash
# Only if you're not already on main
git checkout main
```

**Safety verification:**
```bash
# Confirm you're on main
git branch --show-current
```
**Must show:** `main`

---

### Step 4: Pull v0's Latest Changes
```bash
# Pull from GitHub main
git pull origin main
```

**Expected output:** Lists files changed by v0

**What you're getting:** New scripts, components, or documentation from v0's work

---

### Step 5: Review What v0 Changed
```bash
# See what changed in last commit
git log --oneline -3
git show HEAD --stat
```

**Look for:** Script files, component files, documentation that v0 added

---

## Phase Work - Creating Feature Branch

### Step 6: Create Feature Branch for This Phase
```bash
# Create and switch to feature branch
# Naming convention: feature/phase[N]-[description]
git checkout -b feature/phase1-types

# Verify you're on the new branch
git branch --show-current
```
**Must show:** `feature/phase1-types`

---

### Step 7: Run v0's Scripts
```bash
# Run Phase 1 scripts
node scripts/phase1-generate-types.js

# Check what was generated
git status
```

**Expected:** New files in `/types/` folder

---

### Step 8: Review Generated Files
```bash
# See what files were created/modified
git diff

# Or use VS Code to review changes
code .
```

**Check:**
- TypeScript files look correct
- No syntax errors
- Follows atomic design structure

---

### Step 9: Test Build
```bash
# Run build to catch errors early
npm run build
```

**If build fails:**
1. Read error messages carefully
2. Note which files have errors
3. Share errors with v0 in chat
4. v0 will guide fixes

**If build succeeds:** Continue to commit

---

## Phase End - Merging Back to Main

### Step 10: Commit Your Work
```bash
# Check what's changed
git status

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: Phase 1 complete - TypeScript interfaces generated and tested"
```

**Commit message format:**
- `feat:` for new features
- `fix:` for bug fixes
- `refactor:` for code improvements
- `docs:` for documentation

---

### Step 11: Push Feature Branch to GitHub (Optional Backup)
```bash
# Push feature branch (creates backup on GitHub)
git push origin feature/phase1-types
```

**This is optional but recommended** - creates a backup before merging to main.

---

### Step 12: Pre-Merge Safety Check
```bash
# Switch back to main (don't merge yet)
git checkout main

# Verify you're on main
git branch --show-current
```
**Must show:** `main`

```bash
# Pull latest main (in case v0 pushed more changes)
git pull origin main
```

---

### Step 13: Merge Feature Branch to Main
```bash
# Merge your feature branch into main
git merge feature/phase1-types --no-ff -m "Merge Phase 1: TypeScript interfaces"
```

**Flags explained:**
- `--no-ff`: Preserves feature branch history (no fast-forward)
- `-m`: Merge commit message

**Expected output:** `Merge made by the 'recursive' strategy`

**If merge conflicts:**
```bash
# See which files have conflicts
git status

# Manually resolve conflicts in VS Code
# After resolving:
git add .
git commit -m "Merge Phase 1: TypeScript interfaces"
```

---

### Step 14: Final Build Test on Main
```bash
# Run build one more time on main to ensure merge is clean
npm run build
```

**This is critical:** Ensures main branch has working code.

**If build fails after merge:**
```bash
# Abort the merge
git merge --abort

# Fix issues in feature branch, then re-merge
git checkout feature/phase1-types
# Fix issues...
git commit -m "fix: resolve merge issues"
git checkout main
git merge feature/phase1-types --no-ff
```

---

### Step 15: Push Main to GitHub
```bash
# Push clean, tested code to main
git push origin main
```

**This makes your work available to v0.**

---

### Step 16: Notify v0
In v0 chat, send message:
```
✅ Phase 1 complete
✅ Build passing
✅ Merged to main
🎯 Ready for Phase 2

Files created: [list key files]
Next task: [What should v0 do next]
```

---

## v0's Turn - Pulling Your Changes

v0 will then:
```bash
# In v0 environment (automatic)
git pull origin main
```

v0 sees your clean code and continues with next phase.

---

## Safety Commands Reference

### Before Any Git Operation
```bash
# Where am I?
git branch --show-current

# What changed?
git status

# Any uncommitted work?
git diff
```

### Emergency Commands
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Abort merge in progress
git merge --abort

# Discard all local changes (DANGEROUS)
git reset --hard HEAD

# See all branches
git branch -a

# Delete local feature branch (after merge)
git branch -d feature/phase1-types

# Delete remote feature branch
git push origin --delete feature/phase1-types
```

---

## Common Mistakes & Prevention

### Mistake 1: Pushed to Wrong Branch
**Prevention:**
```bash
# Always check before push
git branch --show-current
```

**If you pushed to wrong branch:** Contact v0, we'll fix via Git commands.

---

### Mistake 2: Merged Unfinished Work to Main
**Prevention:**
```bash
# Always run build before merging
npm run build
```

**If you merged broken code:**
```bash
# Revert the merge commit
git revert -m 1 HEAD
git push origin main
```

---

### Mistake 3: Lost Your Work
**Prevention:**
```bash
# Commit often
git commit -m "WIP: progress checkpoint"

# Push feature branches to GitHub as backup
git push origin feature/your-branch
```

**Recovery:**
```bash
# Git keeps history for 30 days
git reflog
git checkout <commit-hash>
```

---

## Workflow Checklist

### v0 → You (Phase Start)
- [ ] Check you're on main: `git branch --show-current`
- [ ] Working tree clean: `git status`
- [ ] Pull v0's changes: `git pull origin main`
- [ ] Review what changed: `git log -1 --stat`
- [ ] Create feature branch: `git checkout -b feature/phase1-types`
- [ ] Verify branch: `git branch --show-current`

### Your Work (Phase Execution)
- [ ] Run v0's scripts: `node scripts/phase1-*.js`
- [ ] Review generated files
- [ ] Test build: `npm run build`
- [ ] Fix any errors
- [ ] Build passes: `npm run build` ✅

### You → v0 (Phase End)
- [ ] Commit work: `git commit -m "feat: Phase 1 complete"`
- [ ] Push feature branch (backup): `git push origin feature/phase1-types`
- [ ] Switch to main: `git checkout main`
- [ ] Verify on main: `git branch --show-current`
- [ ] Pull latest main: `git pull origin main`
- [ ] Merge feature: `git merge feature/phase1-types --no-ff`
- [ ] Final build test: `npm run build` ✅
- [ ] Push main: `git push origin main`
- [ ] Notify v0 in chat

---

## Quick Reference Card

```bash
# Safety First - Always Run These
git branch --show-current          # Where am I?
git status                         # Any changes?
npm run build                      # Does it work?

# Getting v0's Work
git checkout main
git pull origin main

# Your Work
git checkout -b feature/phaseN-description
node scripts/phaseN-*.js
npm run build
git commit -m "feat: description"

# Merging Back
git checkout main
git pull origin main
git merge feature/phaseN-description --no-ff
npm run build
git push origin main

# Tell v0: "Phase N complete, ready for next"
```

---

## Support

If anything goes wrong:
1. **Don't panic** - Git preserves history
2. Run `git status` to understand current state
3. Share output with v0 in chat
4. v0 will guide exact recovery commands

**Remember:** Feature branches are your safety net. Main is protected by your testing.
