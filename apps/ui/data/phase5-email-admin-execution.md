# Phase 5: Email Administration Data Extraction - Execution Instructions

Generated: 2026-02-24

## Overview
Phase 5 extracts hardcoded data arrays from 16 Email Administration pages into JSON mock files, following the Phase 4 pattern.

## Target Pages (16 total)
- **Overview** - email-administration/page.tsx
- **Request Management** - email-administration/request-management/page.tsx
- **Configuration** - email-administration/configuration/page.tsx
- **Infrastructure** - email-administration/infrastructure/page.tsx
- **Getting Started** - email-administration/getting-started/page.tsx
- Plus 11 additional sub-pages (templates, automation, integrations, etc.)

## Execution Workflow

### Step 1: Extract Data from Pages
**Command:**
```bash
node scripts/phase5-extract-email-admin-data.js
```

**What it does:**
- Scans all email-administration pages
- Identifies hardcoded arrays (sections, features, capabilities, journeys, etc.)
- Extracts and validates data structure
- Generates phase5-extraction-report.md with detailed findings

**Expected output:**
- Console shows: Total pages scanned, arrays found, data extracted
- Creates: data/phase5-extraction-report.md with extraction results

---

### Step 2: Refactor Pages to Use JSON Imports
**Command (run AFTER Step 1 is complete):**
```bash
node scripts/phase5-refactor-email-admin-pages.js
```

**What it does:**
- Updates all email-administration pages
- Replaces hardcoded arrays with imports from JSON mock files
- Maintains component structure and functionality
- Updates import statements to use: `import data from '@/data/strapi-mock/email-administration/...'`

**Expected output:**
- Console shows: Pages refactored, imports updated
- Creates: phase5-refactor-report.md with list of updated files

---

### Step 3: Verify Build
**Command (run AFTER Step 2 is complete):**
```bash
pnpm build
```

**What it does:**
- Validates TypeScript compilation
- Checks all pages still render
- Verifies no import errors

**Expected output:**
- Build succeeds with no errors
- All 160 static pages compile correctly

---

## Data Structure

JSON mock files are organized in: `/data/strapi-mock/email-administration/`

### Email Administration Overview
```
email-administration/overview/
├── sections.json        (main content sections)
└── highlights.json      (key highlights)
```

### Request Management
```
email-administration/request-management/
├── features.json        (management features)
└── capabilities.json    (system capabilities)
```

### Configuration
```
email-administration/configuration/
├── features.json        (config features)
├── email-types.json     (email type definitions)
└── config-highlights.json (configuration highlights)
```

### Infrastructure
```
email-administration/infrastructure/
├── features.json        (infrastructure features)
└── system-checks.json   (system health checks)
```

### Getting Started
```
email-administration/getting-started/
└── journeys.json        (user journey paths)
```

---

## Validation Checklist

After running the scripts:

- [ ] Step 1: Extraction report shows all arrays found and extracted
- [ ] Step 2: Refactor report shows all 16 pages updated
- [ ] Step 3: Build completes with zero errors
- [ ] Verify pages load in preview
- [ ] Git shows changes to: pages (imports updated) + new JSON files in data/strapi-mock/

---

## Next Steps After Successful Execution

1. Review phase5-extraction-report.md
2. Review phase5-refactor-report.md
3. Commit all changes to v0-component-debug branch
4. Push to GitHub
5. Create new chat to proceed with Phase 5 validation/next phase

---

## Script Files Location
- Extraction: `scripts/phase5-extract-email-admin-data.js`
- Refactoring: `scripts/phase5-refactor-email-admin-pages.js`

## Troubleshooting

**If extraction script fails:**
- Verify all email-administration pages exist
- Check file paths in script match actual page locations
- Run with `node --trace-uncaught scripts/phase5-extract-email-admin-data.js` for details

**If refactor script fails:**
- Ensure extraction report exists
- Check that JSON mock files were created successfully
- Verify page imports match export statements in JSON files

**If build fails:**
- Check console for specific TypeScript errors
- Verify all import paths are correct
- Ensure JSON files are valid JSON
