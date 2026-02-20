# Development Workflow

**Project:** v0-component-design-review  
**Purpose:** Clean, maintainable, scalable Next.js architecture  
**Last Updated:** Session 18

---

## Overview

This document defines the development workflow for this project, ensuring clean git history, proper validation gates, and optimized Vercel builds.

---

## Core Principles

1. **Server Components First** - Optimize for performance and bundle size
2. **Git Context Always** - Never lose connection to GitHub
3. **Validate Locally First** - Don't waste Vercel builds on broken code
4. **Isolated Changes** - One feature/refactor per branch
5. **Draft → Review → Merge** - Clear validation gates

---

## Standard Workflow

### 1. Work in v0

**Branch Naming:** `v0/<your-name>-<short-id>`

v0 automatically commits and pushes changes to this branch.

**Best Practices:**
- Keep changes focused on one feature/task
- Test in v0 preview as you go
- Use v0 Pro for architectural work, Mini for simple edits

---

### 2. Create Pull Request (When Ready)

**On GitHub:**

1. Go to repository → Pull Requests → New Pull Request
2. Set: `base: main` ← `compare: v0/your-branch`
3. **Mark as DRAFT** (prevents Vercel build)
4. Add clear description of changes

**Why Draft?**
- Vercel won't build (saves time/money)
- Signals "not ready for review"
- Allows local validation first

---

### 3. Pull & Validate Locally

**In Your IDE:**

```bash
# Fetch latest from GitHub
git fetch origin

# Switch to the branch
git checkout v0/your-branch

# Pull latest changes
git pull origin v0/your-branch

# Install dependencies (if package.json changed)
npm install

# Run any scripts (if applicable)
# Example: node scripts/restructure-route-groups.js

# Start development server
npm run dev
```

**Test Checklist:**
- [ ] All pages load without errors
- [ ] No console errors in browser
- [ ] Navigation works correctly
- [ ] Responsive design works (mobile/tablet/desktop)

**Build Validation:**

```bash
# Check for TypeScript errors
npm run build

# Fix any type errors before proceeding
```

---

### 4. Commit & Push Validated Changes

```bash
# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: your feature description

- Bullet point of what changed
- Another detail
- Testing notes"

# Push back to same branch
git push origin v0/your-branch
```

**Commit Message Format:**
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code restructure (no functionality change)
- `docs:` - Documentation only
- `style:` - Formatting, CSS changes
- `test:` - Adding tests

---

### 5. Mark PR as Ready

**On GitHub:**

1. Go to your PR
2. Click "Ready for Review"
3. This triggers Vercel build for PR preview

**Vercel Builds:**
- Vercel creates preview URL: `your-pr-name.vercel.app`
- Test the preview thoroughly
- Check Lighthouse scores, mobile experience

---

### 6. Review & Merge

**If Preview Looks Good:**

1. Request review (if needed) or self-approve
2. Merge PR to `main`
3. Vercel automatically builds production
4. Delete the `v0/` branch (cleanup)

**If Issues Found:**
- Make fixes locally
- Commit and push
- Vercel rebuilds preview automatically
- Re-test

---

### 7. Pull Back into v0

**In v0 Interface:**

1. Click Git icon in left sidebar
2. Click "Pull Changes" button
3. v0 syncs with latest `main`
4. Start new session with fresh branch

---

## Special Workflows

### Large Architectural Changes (Route Groups, Major Refactors)

**Use Clean Branch Strategy:**

```bash
# Start from main
git checkout main
git pull origin main

# Create new feature branch
git checkout -b feat/descriptive-name

# Cherry-pick specific files from v0 branch (if needed)
git checkout v0/your-branch -- path/to/file.js

# Make changes, test thoroughly
npm run dev
npm run build

# Push and create Draft PR
git add .
git commit -m "feat: descriptive commit"
git push origin feat/descriptive-name
```

**Why?**
- Isolates large changes from other work
- Keeps v0 branch for smaller iterations
- Easier to review and rollback if needed

---

### Running Scripts (Database Migrations, Restructures)

**Scripts Location:** `/scripts/`

**Before Running:**
1. Read the script comments
2. Check if there's a rollback script
3. Commit current state (safety checkpoint)

**Running:**
```bash
node scripts/your-script.js
```

**After Running:**
1. Test thoroughly
2. Check git diff to see what changed
3. Commit or rollback

---

## Vercel Build Configuration

**Build Control:** `vercel.json` + `scripts/vercel-ignore-build.js`

**Builds are SKIPPED for:**
- `v0/*` branches (work in progress)
- Draft PRs (validation in progress)

**Builds run for:**
- `main` branch (production)
- Ready PRs (validated changes)

**Why This Matters:**
- Saves Vercel build minutes
- Prevents broken code from being built
- Forces local validation before deployment

---

## Git Branch Management

### Active Branches

- `main` - Production code, always stable
- `v0/*` - Temporary work branches from v0, delete after merge
- `feat/*` - Feature branches for large changes, delete after merge

### Branch Cleanup

```bash
# Delete local branch after merge
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name
```

**Best Practice:** Delete merged branches immediately to keep repo clean.

---

## Common Issues & Solutions

### Issue: "Import path not found" after folder restructure

**Solution:**
```bash
# Check if path is correct relative to new structure
# Update import to use @/ alias if needed
import { Component } from '@/components/...'
```

### Issue: Vercel builds when it shouldn't

**Solution:**
- Check `scripts/vercel-ignore-build.js` logic
- Verify PR is marked as Draft
- Check branch name follows `v0/*` pattern

### Issue: v0 can't pull changes after merge

**Solution:**
1. In v0: Settings → disconnect GitHub
2. Reconnect GitHub
3. Select correct repository and branch
4. Pull changes

### Issue: Merge conflicts

**Solution:**
```bash
# Update your branch with latest main
git checkout your-branch
git pull origin main
# Resolve conflicts in IDE
git add .
git commit -m "fix: resolve merge conflicts"
git push origin your-branch
```

---

## Checklist: Before Creating PR

- [ ] Code works in v0 preview
- [ ] Tested locally (`npm run dev`)
- [ ] No TypeScript errors (`npm run build`)
- [ ] No console errors in browser
- [ ] Responsive design tested
- [ ] Commit messages are clear
- [ ] PR description explains what/why
- [ ] Marked as Draft (if not ready for review)

---

## Checklist: Before Merging PR

- [ ] Vercel preview deployed successfully
- [ ] Tested Vercel preview URL thoroughly
- [ ] All checks passing (builds, linting, tests)
- [ ] Code reviewed (if applicable)
- [ ] Documentation updated (if needed)
- [ ] Ready to go to production

---

## Project-Specific Notes

### Next.js App Router Patterns

- **Always Server Components by default** - Add `'use client'` only when needed
- **Route Groups** - Use `(groupname)` for layout isolation without affecting URLs
- **Loading/Error Boundaries** - Every route segment should have loading.tsx and error.tsx
- **CSS Utilities** - Use semantic classes from globals.css, avoid inline Tailwind for responsive grids

### Component Organization

```
components/
  atoms/        - Smallest reusable pieces (buttons, inputs)
  molecules/    - Small combinations (form fields, cards)
  organisms/    - Complex sections (navigation, sidebars)
```

**Client Components:**
- Live in atoms/ or molecules/
- Keep small and focused
- Use `'use client'` directive
- Pass serializable props only

---

## Resources

- **Next.js App Router:** https://nextjs.org/docs/app
- **Vercel Docs:** https://vercel.com/docs
- **Git Workflow:** https://www.atlassian.com/git/tutorials/comparing-workflows

---

## Workflow Evolution

This workflow will evolve as the project grows. Update this document when:
- New patterns are established
- Pain points are discovered
- Team size changes
- Tooling is added/changed

**Last Major Update:** Session 18 - Route Group Architecture Implementation
