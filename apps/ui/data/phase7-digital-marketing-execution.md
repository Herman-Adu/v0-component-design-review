# Phase 7: Digital Marketing Data Extraction — Execution Guide

## Overview
Phase 7 extracts hardcoded data from the **Digital Marketing** section (28 pages) into Strapi-style JSON mocks.

**Scope:** 4 pages with extractable arrays  
**Data Files:** 8 JSON files  
**Location:** `/data/strapi-mock/digital-marketing/` and `/data/strapi-mock/platforms/`

---

## Execution Steps

### Step 1: Run Extraction Script
Scans pages and identifies hardcoded arrays:

```bash
node scripts/phase7-extract-digital-marketing-data.js
```

**Expected Output:**
- List of pages scanned
- Count of arrays found
- Report saved to `data/phase7-extraction-report.md`

**Troubleshooting:**
- If script fails, ensure Node.js is installed: `node --version`
- If file not found errors, verify you're in the project root directory

---

### Step 2: Run Refactoring Script
Replaces hardcoded arrays with JSON imports:

```bash
node scripts/phase7-refactor-digital-marketing-pages.js
```

**Expected Output:**
- Confirmation of files refactored
- Import statements added
- Arrays replaced with JSON data access
- Report saved to `data/phase7-refactor-report.md`

**What This Does:**
- Adds import statements for JSON data files
- Replaces `const arrays = [...]` with `const arrays = dataFile.key || []`
- Maintains all functionality without changing component behavior

**Troubleshooting:**
- If "file not found" errors, verify page structure matches config
- If imports don't appear, check file permissions: `ls -la app/(dashboard)/dashboard/admin/digital-marketing/`

---

### Step 3: Verify Build
Compile and validate all pages work correctly:

```bash
pnpm build
```

**Expected Output:**
- Build succeeds with 0 errors
- All 160+ static pages compile
- No TypeScript errors

**Common Issues & Fixes:**

| Issue | Fix |
|-------|-----|
| `Cannot find module @/data/strapi-mock` | Verify JSON files exist in `/data/strapi-mock/` |
| `icon property is not defined` | Verify icon strings match iconMap keys in page |
| `Type error: X is not assignable` | Check JSON structure matches expected interface |

---

## Files Created

### Scripts (in `/scripts/`)
- `phase7-extract-digital-marketing-data.js` — Extraction discovery
- `phase7-refactor-digital-marketing-pages.js` — Refactoring automation

### JSON Data Files (in `/data/strapi-mock/`)
```
platforms/
  ├── google-tools.json (6 tools)
  └── google-ecosystem.json (3 ecosystem phases)

digital-marketing/
  ├── getting-started/
  │   ├── journeys.json (3 journeys)
  │   └── quick-checklist.json (6 items)
  └── content-strategy/
      ├── content-calendar.json (4 weeks)
      ├── distribution-channels.json (4 channels)
      ├── content-metrics.json (4 metrics)
      └── editorial-guidelines.json (4 guidelines)
```

### Reports (in `/data/`)
- `phase7-extraction-report.md` — Details of what was found
- `phase7-refactor-report.md` — Details of what was changed

---

## Validation Checklist

After running all scripts and build:

- [ ] Both scripts run without errors
- [ ] `pnpm build` passes with 0 errors
- [ ] All 4 refactored pages still render correctly
- [ ] No missing icon warnings in console
- [ ] No TypeScript errors
- [ ] Data displays correctly in UI (Google tools show 6 items, etc.)

---

## Rollback (If Needed)

If something goes wrong, you can revert:

```bash
git checkout app/(dashboard)/dashboard/admin/digital-marketing/
```

This restores pages to their original hardcoded state. Then run scripts again.

---

## Next Steps After Validation

1. Review both `.md` reports for any warnings or notes
2. Commit and push to GitHub:
   ```bash
   git add scripts/ data/strapi-mock/ data/phase7-*.md
   git commit -m "phase-7: extract digital-marketing data"
   git push origin v0-component-debug
   ```
3. Create comprehensive `PHASE7_GENERATION_NOTES.md` in root with learnings
4. Return to v0 for Phase 7 review and planning for next phase

---

## Support

If you encounter issues:
1. Check the extraction/refactor reports (they contain detailed logs)
2. Review the error message and consult the "Common Issues" table above
3. Verify JSON file structure matches expected keys
