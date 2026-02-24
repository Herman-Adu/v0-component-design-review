# Phase 5: Email Administration Data Extraction & Refactoring

**Session:** 21 (Resumed Post-Recovery)  
**Status:** Scripts & Mock Data Created  
**Next Action:** Execute refactoring + build verification

---

## OVERVIEW

Phase 5 extracts hardcoded data arrays from 14 email-administration pages and migrates them to Strapi-ready JSON mock data files.

**Scope:**
- 14 Email Administration pages with hardcoded arrays
- Extract: sections, features, capabilities, emailTypes, highlights, journeys, etc.
- Create: 10+ JSON mock data files in `data/strapi-mock/email-administration/`
- Refactor: Pages to import from JSON instead of hardcoded arrays
- Validate: Build succeeds, pages render with external data

---

## ASSETS CREATED

### Scripts (2 files)

**`scripts/phase5-extract-email-admin-data.js`** (212 lines)
- Identifies all hardcoded arrays in email pages
- Generates extraction report
- Validates file existence and structure

**`scripts/phase5-refactor-email-admin-pages.js`** (252 lines)
- Replaces hardcoded arrays with JSON imports
- Adds proper import statements
- Validates syntax integrity

### Mock Data Files (10 files)

**Overview Section:**
- `data/strapi-mock/email-administration/overview/sections.json` (3 sections)
- `data/strapi-mock/email-administration/overview/highlights.json` (6 highlights)

**Request Management:**
- `data/strapi-mock/email-administration/request-management/features.json` (2 features)
- `data/strapi-mock/email-administration/request-management/capabilities.json` (6 capabilities)

**Configuration:**
- `data/strapi-mock/email-administration/configuration/features.json` (5 features)
- `data/strapi-mock/email-administration/configuration/email-types.json` (3 types)
- `data/strapi-mock/email-administration/configuration/config-highlights.json` (4 highlights)

**Infrastructure:**
- `data/strapi-mock/email-administration/infrastructure/features.json` (4 features)
- `data/strapi-mock/email-administration/infrastructure/system-checks.json` (6 checks)

**Getting Started:**
- `data/strapi-mock/email-administration/getting-started/journeys.json` (3 journeys + checklist)

---

## DATA STRUCTURE REFERENCE

### Sections (Overview)
```json
{
  "title": "string",
  "description": "string",
  "icon": "string (icon name)",
  "href": "string (URL path)",
  "role": "string (role description)",
  "pages": number,
  "color": "string (Tailwind classes)"
}
```

### Features
```json
{
  "title": "string",
  "description": "string",
  "icon": "string (icon name)",
  "href": "string (URL path)",
  "role": "string (role description)"
}
```

### Capabilities / Highlights
```json
{
  "icon": "string (icon name)",
  "title": "string",
  "description": "string"
}
```

### Email Types
```json
{
  "type": "string",
  "templates": ["array of template names"],
  "trigger": "string",
  "icon": "string (icon name)",
  "urgency": boolean
}
```

### Journeys (Getting Started)
```json
{
  "title": "string (role name)",
  "description": "string",
  "icon": "string (icon name)",
  "color": "string (Tailwind classes)",
  "steps": [
    {
      "title": "string",
      "href": "string",
      "desc": "string"
    }
  ]
}
```

---

## EXECUTION STEPS

### Step 1: Run Extraction Script
```bash
cd /vercel/share/v0-project
node scripts/phase5-extract-email-admin-data.js
```

**Expected Output:**
```
[Phase 5] Email Administration Data Extraction
============================================================
[Phase 5] Processing: Email Administration Overview
  ✓ Found array: sections
  ✓ Found array: highlights
[Phase 5] Processing: Request Management Overview
  ✓ Found array: features
  ✓ Found array: capabilities
...
[Phase 5] Extraction Summary
============================================================
Pages processed: 4/4
Arrays found: 16
Files created: 0

✓ Report written: data/phase5-extraction-report.md
```

### Step 2: Run Refactoring Script
```bash
node scripts/phase5-refactor-email-admin-pages.js
```

**Expected Output:**
```
[Phase 5] Email Administration Page Refactoring
============================================================
[Phase 5] Refactoring: Email Administration Overview
  ℹ Adding JSON imports...
  ✓ Added 2 JSON imports
  ✓ Replaced array: sections
  ✓ Replaced array: highlights
  ✓ Refactoring complete
...
[Phase 5] Refactoring Summary
============================================================
Pages refactored: 4/4
JSON imports added: 16
Icon mappings prepared: 0

✓ Report written: data/phase5-refactor-report.md
```

### Step 3: Build Verification
```bash
pnpm build
```

**Expected:**
- ✅ 160+ static pages generated
- ✅ Zero TypeScript errors
- ✅ All email-administration pages compile
- ✅ Build time: ~25-30 seconds

### Step 4: Preview Verification
- Check all 14 email-administration pages load correctly
- Verify data displays (sections, features, capabilities)
- Confirm no console errors
- Test navigation between pages

---

## PAGES BEING REFACTORED

| Page | Path | Arrays Extracted | Status |
|------|------|------------------|--------|
| Email Administration Overview | `email-administration/page.tsx` | sections, highlights | ✅ Ready |
| Request Management Overview | `request-management/page.tsx` | features, capabilities | ✅ Ready |
| Configuration Overview | `configuration/page.tsx` | features, emailTypes, configHighlights | ✅ Ready |
| Infrastructure Overview | `infrastructure/page.tsx` | features, systemChecks | ✅ Ready |
| Getting Started | `getting-started/page.tsx` | journeys, quickChecklist | ✅ Ready |
| Category Pages (5 pages) | Various subdirs | Data loaded from JSON | ✅ Ready |
| Feature Pages (8 pages) | Various subdirs | Currently static | ⏳ Phase 6 |

---

## KNOWN CONSIDERATIONS

### Icon Mapping (Phase 4 Pattern)
- Icon names stored as **strings** in JSON (e.g., `"Briefcase"`, `"Palette"`)
- Pages include icon mapping objects to resolve strings → React components
- Example:
  ```typescript
  const iconMap = {
    Briefcase,
    Palette,
    HardDrive,
    // ... etc
  }
  const Icon = iconMap[feature.icon as keyof typeof iconMap]
  ```

### Data Import Pattern
- Imports use static `import ... from '@/path/file.json'` (NOT `await import()`)
- Follows TypeScript module constraints (static imports compile-time)
- Array access: `const sections = sectionsData.sections || []`

### Missing Refinements (Future)
- Icon mapping not auto-injected by script (manual addition possible Phase 6)
- Detailed feature/guide pages (8 pages) still have static content
- No Strapi backend yet (JSON mocks are placeholder)

---

## VALIDATION CHECKLIST

After running both scripts and building:

- [ ] `pnpm build` completes with 0 errors
- [ ] All 4 overview pages render correctly in preview
- [ ] Section/feature data displays from JSON
- [ ] No console errors in browser
- [ ] Sidebar navigation works (no broken links)
- [ ] Icon rendering works (icons display correctly)
- [ ] Getting Started journey page loads all 3 roles
- [ ] All hardcoded array declarations removed from pages
- [ ] Type safety maintained (TypeScript clean)
- [ ] JSON imports successfully resolve

---

## ROLLBACK PLAN (If Issues Arise)

If the refactoring breaks the build:

1. **Check imports** - Verify JSON file paths are correct in imports
2. **Check file encoding** - Ensure JSON files have no BOM or special characters
3. **Check array structure** - Verify data structure matches expected shape
4. **Revert pages** - If needed, revert to hardcoded arrays (git reset)
5. **Debug script** - Check script output reports for specific errors

---

## NEXT PHASE (Phase 6)

After Phase 5 validation:

- Extract remaining feature pages (8 pages)
- Extract documentation pages (29 pages)
- Extract content library pages (10 pages)
- Extract remaining admin pages (13 pages)
- Total: 78+ hardcoded arrays → Strapi-ready JSON files

---

## DOCUMENTATION

**Reports Generated:**
- `data/phase5-extraction-report.md` - Arrays found, files processed
- `data/phase5-refactor-report.md` - Import replacements, changes made
- `PHASE5_GENERATION_NOTES.md` - Comprehensive execution details

---

**Status:** Ready for execution  
**Estimated Time:** 5-10 mins (scripts + build)  
**Token Cost:** ~3-4 ops  
**Owner:** Phase 5 Implementation
