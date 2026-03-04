# PHASE 3 EXECUTION PLAN — Batch 1 Strategic Domain Extraction + Data Layer

**Status:** Active Execution Plan (Feb 28, 2026)  
**Owner:** Senior Architect + Frontend Dev  
**Focus:** Extract Strategic domain + Build data layer with learning capture  
**Duration:** 8 hours (Session 3 focused execution)  
**Token Budget:** 128K fresh (target: 100-110K)  
**Next Session:** Session 4 (routes + gates 3-5)

---

## Table of Contents

1. [Executive Summary & Senior Mindset](#executive-summary--senior-mindset)
2. [What Success Looks Like](#what-success-looks-like)
3. [Phase 3 Execution Workflow](#phase-3-execution-workflow)
4. [Batch 1: Strategic Domain Specification](#batch-1-strategic-domain-specification)
5. [Learning Capture Framework](#learning-capture-framework)
6. [Session 3 Task Checklist](#session-3-task-checklist)
7. [Gate Validation Standards](#gate-validation-standards)
8. [Session 3 Checkpoint Template](#session-3-checkpoint-template)

---

## Executive Summary & Senior Mindset

### Why This Phase Matters

We're transitioning from **governance (theory) to execution (reality)**. This phase will reveal:

- Whether our schemas actually fit the content
- Whether our 6-layer architecture works in practice
- Where assumptions break down
- What patterns emerge that we can generalize

**Senior Approach:** Treat this as a **learning lab**, not just a task completion exercise. Every decision should be documented with:

- ✅ What we did
- ✅ Why we did it that way
- ✅ What we learned
- ✅ What we'd do differently next time

### Core Principle: Fail Forward Fast

If something doesn't work:

1. **Stop immediately** (don't force it)
2. **Document the issue** (what went wrong, why)
3. **Adjust the approach** (fix in code or governance)
4. **Continue** (don't dwell on it)

This means token efficiency matters. We move fast, we learn, we refine.

---

## What Success Looks Like

### Session 3 Complete Success Criteria

```
EXTRACTION (3.1): ✅
  - 8-10 strategic articles identified
  - All extracted to block-structured markdown
  - All converted to JSON
  - Zero schema validation errors

SCHEMA VALIDATION (3.2 — Gate 1): ✅
  - All JSON validates against Zod schema
  - Zero warnings, zero critical errors
  - Signed-off validation report created

DATA LAYER (3.3): ✅
  - Schema file created
  - Content builder loads all JSON without errors
  - Repository queries work (list, getBySlug)
  - View models format data correctly
  - Facade exports work
  - Unit tests written and passing (>90% coverage)

DATA INTEGRITY (3.4 — Gate 2): ✅
  - All tests pass
  - No null returns on valid slugs
  - Repository queries accurate
  - Signed-off integrity report created

BONUS (3.5 — Stretch, if tokens allow):
  - Routes created (list + detail pages)
  - Static params generated
  - Metadata complete

LEARNING CAPTURED:
  - Lessons learned document created
  - Issues found and solutions recorded
  - Patterns identified for next batch
  - Adjustments to task estimates documented
```

### What Passes vs. What Stops

**PASSES:**

- Logic issues (we fix them)
- Schema adjustments (we update and revalidate)
- Performance tweaks (we optimize)
- Test failures (we debug and fix)

**STOPS:**

- Token budget exceeded (we document and defer)
- Governance assumptions wrong (we pause, escalate, restart)
- Database schema broken (we document, don't force)
- Gate validation fails (we don't proceed to next gate)

---

## Phase 3 Execution Workflow

### High-Level Flow

```
START SESSION 3
    ↓
3.1: EXTRACT Strategic Content
     (8-10 articles from ROADMAP.md + ARCHITECTURE.md)
     ↓
3.2: SCHEMA VALIDATION (Gate 1)
     - Zod validate all JSON
     - Create validation report
     - Architect sign-off
     ↓ (GATE 1 PASS - cannot proceed without this)
3.3: DATA LAYER IMPLEMENTATION
     - Create schema.ts (Zod)
     - Create content-builder.ts (load + validate)
     - Create repository.ts (server-only queries)
     - Create view-models.ts (format for UI)
     - Create facade.ts (public API)
     - Write unit tests
     ↓
3.4: DATA INTEGRITY (Gate 2)
     - Run unit tests (>90% coverage)
     - Spot check queries
     - Create integrity report
     - Architect sign-off
     ↓ (GATE 2 PASS - cannot proceed without this)
3.5 (STRETCH): ROUTE CREATION
     - If tokens >50% remaining
     - Create list + detail pages
     - Implement generateStaticParams()
     ↓
CREATE SESSION 3 CHECKPOINT
    ↓
END SESSION 3
```

### Decision Points (Stop/Go Gates)

| Decision Point   | Criteria            | GO             | STOP                    |
| ---------------- | ------------------- | -------------- | ----------------------- |
| **After 3.1**    | JSON files created? | Proceed to 3.2 | Document issue, pause   |
| **After Gate 1** | All JSON validates? | Proceed to 3.3 | Fix validation, retry   |
| **After 3.3**    | All code compiles?  | Proceed to 3.4 | Fix TypeScript, retry   |
| **After Gate 2** | Tests >90% pass?    | Proceed to 3.5 | Improve coverage, retry |
| **After 3.5**    | Tokens <30%?        | Defer to S4    | Continue S4 planning    |

---

## Batch 1: Strategic Domain Specification

### What We're Extracting

**Source Files:**

- `ROADMAP.md` — phases, technical debt, vision
- `ARCHITECTURE.md` — principles, patterns, decisions

**Target Articles (8-10):**

| #   | Title                          | Source                       | Content Type        | Est. Words |
| --- | ------------------------------ | ---------------------------- | ------------------- | ---------- |
| 1   | System Vision & Principles     | ARCHITECTURE.md              | Vision + principles | 2,500      |
| 2   | Platform Roadmap 2026          | ROADMAP.md                   | Roadmap + phases    | 3,000      |
| 3   | Phase 1: Foundation (Complete) | ROADMAP.md                   | Phase summary       | 1,500      |
| 4   | Phase 2: Governance + Strapi   | ROADMAP.md                   | Phase summary       | 2,000      |
| 5   | Phase 3-4: Content Migration   | ROADMAP.md                   | Phase summary       | 2,000      |
| 6   | Technical Decision Records     | ARCHITECTURE.md + ROADMAP.md | TDRs                | 2,000      |
| 7   | Architecture Evolution         | ARCHITECTURE.md              | History + rationale | 1,800      |
| 8   | Team Roles & Responsibilities  | ARCHITECTURE.md              | Organization        | 1,200      |
| 9   | Long-Term Technical Debt       | ROADMAP.md                   | Debt + mitigation   | 1,500      |
| 10  | Performance & Quality Budgets  | INFRASTRUCTURE.md            | Standards           | 1,200      |

**Total Content:** ~20,000 words across 10 articles  
**Extraction Effort:** ~10-12 hours (4 hours audit + 6-8 hours extraction + block conversion)

### Content Structure Template

Every extracted article MUST have this structure (see STRAPI_COLLECTION_TYPE_SCHEMAS.md):

```json
{
  "meta": {
    "slug": "unique-slug",
    "title": "Article Title",
    "excerpt": "Summary (fallback for SEO)",
    "category": "vision|phases|decisions|architecture|team|debt|budgets",
    "level": "beginner|intermediate|advanced",
    "publishedAt": "2026-02-15T00:00:00Z",
    "tags": ["tag1", "tag2"]
  },
  "seo": {
    "metaTitle": "Overridden title (optional)",
    "metaDescription": "Overridden description (optional)"
    // ... other SEO fields (optional but recommended)
  },
  "toc": [{ "level": 2, "title": "Section", "anchor": "section" }],
  "blocks": [
    { "type": "text", "content": "..." }
    // ... all content as blocks (text, heading, code, etc.)
  ]
}
```

### Block Mapping Rules (For Extraction)

| Markdown Element     | Maps To Block                | Rules                          |
| -------------------- | ---------------------------- | ------------------------------ |
| `# Heading 1`        | Do NOT use (only meta.title) | Use h2 or lower in content     |
| `## Heading 2+`      | `heading` block              | Include level number (2-6)     |
| Paragraph text       | `text` block                 | Keep formatting (bold, italic) |
| `\`\`\`code\`\`\``   | `code` block                 | Include language enum          |
| `> Quote`            | `quote` block                | Preserve attribution           |
| Line break (`---`)   | `divider` block              | Clear visual separation        |
| Bullet/numbered list | `list` block                 | ordered: true/false            |
| Table                | `table` block                | Preserve headers and rows      |
| Callout/alert box    | `alert` or `callout`         | Map to appropriate type        |
| Image/diagram        | `image` block or `callout`   | Include alt text (A11y)        |

---

## Learning Capture Framework

### Why Capture Lessons?

Each execution phase teaches us:

- **What works:** Patterns to repeat, generalize, automate
- **What breaks:** Assumptions to revisit, governance to adjust
- **Issues found:** Bugs in process, tasks mier-estimated, dependencies missed
- **Improvements:** Faster ways to do next batch, automation opportunities

### Lessons Learned Template (Fill During Execution)

```markdown
## What We Learned This Session

### Extraction Process (3.1)

- [ ] How long did extraction actually take? (vs. 4 hour estimate)
- [ ] Were there blocking dependencies? (vs. assumed easily available)
- [ ] Did source markdown have unexpected structure?
- [ ] What % of content was reusable vs. required rewrites?
- [ ] Any content conflicts (duplicate info in multiple files)?

### Schema Validation (3.2 — Gate 1)

- [ ] Did JSON validate on first try? (or required iterations?)
- [ ] What validation errors came up most?
- [ ] Did block type enum values need adjustment?
- [ ] Were required fields actually required?
- [ ] How accurate was our Zod schema?

### Data Layer Implementation (3.3)

- [ ] What code patterns worked best?
- [ ] Were there TypeScript surprises?
- [ ] Did file I/O work as expected?
- [ ] How long actually for each file?
- [ ] Any missing helper functions?

### Testing & Validation (3.4 — Gate 2)

- [ ] How long to reach >90% coverage?
- [ ] What edge cases came up?
- [ ] Were tests meaningful or just counting lines?
- [ ] Any null/undefined surprises?
- [ ] Repository query performance OK?

### Token Efficiency

- [ ] Tokens used vs. budget (actual vs. estimate)?
- [ ] Where were we efficient?
- [ ] Where did we waste tokens?
- [ ] Can next batch be tighter?

### Adjustment for Next Batch (Batch 2)

- [ ] Specific task time adjustments?
- [ ] Process changes?
- [ ] Skill gaps to address?
- [ ] Tool improvements needed?
- [ ] Governance tweaks?
```

### Repository for Lessons (Create This Structure)

```
/docs/phase-execution/
├── PHASE_3_LESSONS_LEARNED.md (fill during S3)
├── BATCH_1_METRICS.json (token usage, timing, errors)
├── BATCH_1_ADJUSTMENTS.md (what to fix for Batch 2)
├── SESSION_3_RETROSPECTIVE.md (team reflection)
└── refinements/
    ├── schema-refinements.md (Zod adjustments)
    ├── extraction-improvements.md (faster extraction)
    ├── data-layer-patterns.md (code reusability)
    └── gate-adjustments.md (validation changes)
```

---

## Session 3 Task Checklist

### Pre-Session 3 (Before You Start)

- [ ] Read EXTRACTION_FIRST_MIGRATION_PLAN.md (Domain 1: Strategic section)
- [ ] Read ARCHITECTURE_IMPLEMENTATION_CHECKLIST.md (Gate 1 & 2 sections)
- [ ] Have tech lead approval on governance docs (from Session 2)
- [ ] Prepare list of 8-10 strategic articles to extract
- [ ] Verify ROADMAP.md and ARCHITECTURE.md are in good state

### Task 3.1: Content Extraction (4 hours)

**3.1.1: Content Audit** (45 minutes)

```bash
# Read ROADMAP.md and ARCHITECTURE.md
# Identify natural article boundaries
# Create extraction plan document

# Document: PHASE_3_EXTRACTION_PLAN.md
# Contents:
# - List of 8-10 articles to extract
# - Source sections for each article
# - Estimated word count per article
# - Block structure outline
```

**Success Criteria:**

- [ ] 8-10 articles identified
- [ ] Source sections documented
- [ ] Content boundaries clear
- [ ] Extraction plan approved by architect

**3.1.2: Extract to Markdown** (60 minutes)

```bash
# For each article:
# 1. Copy source sections into temp file
# 2. Clean up markdown (remove cross-file references, fix links)
# 3. Identify blocks (headings, paragraphs, code, etc.)
# 4. Add anchor IDs for TOC linking

# Output: /temp/extraction/[article-slug].md (block-structured)
```

**Success Criteria:**

- [ ] 8-10 markdown files created
- [ ] Content is block-structured (headings, paragraphs separated)
- [ ] No cross-reference links (remove or note them)
- [ ] Anchor IDs included for TOC items

**3.1.3: Convert to JSON** (30 minutes)

```bash
# For each markdown file:
# 1. Parse blocks (heading → heading block, paragraph → text block, etc.)
# 2. Build JSON structure matching STRAPI_COLLECTION_TYPE_SCHEMAS.md
# 3. Add required fields (meta.slug, meta.title, meta.excerpt, meta.publishedAt)
# 4. Add SEO fields (leave as optional for now, can fallback)
# 5. Build toc array from headings

# Output: /data/documentation-strategic/[article-slug].json
```

**Success Criteria:**

- [ ] 8-10 JSON files created
- [ ] All required fields present
- [ ] All block types recognized
- [ ] No syntax errors in JSON (test with json -c)

### Task 3.2: Schema Validation (Gate 1) — 1 hour

**3.2.1: Run Zod Validation** (30 minutes)

```bash
# Create Zod schema file if not exists:
# lib/strapi/schemas/documentation-schema-strategic.ts

# Test validation:
node scripts/validate-documentation-schema.mjs --domain strategic

# Expected output:
# ✅ 8 files validated
# ✅ Zero errors
# ✅ Ready for data layer
```

**Success Criteria:**

- [ ] Schema file exists and is valid TypeScript
- [ ] All 8-10 JSON files validate
- [ ] Zero validation errors (warnings OK, will fix)
- [ ] Can proceed to data layer

**3.2.2: Create Validation Report** (15 minutes)

```markdown
# BATCH_1_SCHEMA_VALIDATION_REPORT.md

## Results

- Files Validated: 8
- Files Passed: 8
- Files Failed: 0
- Errors: 0
- Warnings: 0 (or documented)

## Blocks Used

- Type distribution (text: 50%, heading: 15%, code: 10%, etc.)
- All required block types present
- No unexpected block types

## Schema Adjustments Made

- Any schema changes? Document here

## Sign-Off

Architect Review: PASS ✅
Date: 2026-03-XX
```

**Success Criteria:**

- [ ] Report created
- [ ] All metrics documented
- [ ] Architect has reviewed
- [ ] Gate 1 PASS marked

### Task 3.3: Data Layer Implementation — 4 hours

**3.3.1: Schema File** (45 minutes)

```bash
# Create: lib/strapi/documentation/strategic/documentation-schema-strategic.ts

# Must include:
# - Import Zod
# - Define all block types (union type)
# - Define meta, seo, route, access, toc, blocks
# - Export type for TypeScript

# Validation:
# pnpm run type-check
# Should have ZERO errors
```

**Success Criteria:**

- [ ] File created at correct path
- [ ] All imports correct
- [ ] All block types defined
- [ ] No TypeScript errors
- [ ] Can export and reuse in other files

**3.3.2: Content Builder** (60 minutes)

```bash
# Create: lib/strapi/documentation/strategic/documentation-strategic-content-builder.ts

# Must do:
# - Import 'server-only'
# - Load all JSON from /data/documentation-strategic/
# - Validate each with schema
# - Export registry functions:
#   - getStrategicDocList(): Doc[]
#   - getStrategicDocBySlug(slug): Doc | null
#   - getAllStrategicDocSlugs(): string[]

# Validation:
# - No runtime errors loading files
# - All JSON parse without issues
# - Can call functions and get data back
```

**Success Criteria:**

- [ ] File created at correct path
- [ ] All JSON files load
- [ ] All functions work
- [ ] No console errors
- [ ] Can use in repository

**3.3.3: Repository** (60 minutes)

```bash
# Create: lib/strapi/documentation/strategic/documentation-strategic-repository.ts

# Must do:
# - Import 'server-only'
# - Import from content-builder
# - Export query functions:
#   - listStrategicDocs(): Doc[]
#   - getStrategicDocBySlug(slug): Doc | null
#   - getStrategicDocsByCategory(cat): Doc[]
# - Add logging (optional but good)

# Validation:
# - All functions return correct types
# - No null on valid queries
# - Queries are fast (<1ms)
```

**Success Criteria:**

- [ ] File created at correct path
- [ ] All query functions work
- [ ] Return types correct
- [ ] No null surprises
- [ ] Logging in place

**3.3.4: View Models** (45 minutes)

```bash
# Create: lib/strapi/documentation/strategic/documentation-strategic-view-models.ts

# Must do:
# - Transform Doc → ViewModel
# - Add computed fields (formattedDate, readTimeLabel, etc.)
# - Format blocks for rendering
# - Add related docs (if relevant)

# Example computed fields:
# - publishedAt: "Feb 15, 2026"
# - readTime: "8 min"
# - wordCount: 2500
# - blockCount: 25

# Validation:
# - Transform works
# - All fields accessible
# - No null values in output
```

**Success Criteria:**

- [ ] File created and exported
- [ ] Transform function works
- [ ] Computed fields calculated
- [ ] No null surprises

**3.3.5: Facade** (15 minutes)

```bash
# Create: lib/strapi/documentation/strategic/documentation-strategic.ts

# Must do:
# - Export from repository + view-models
# - Re-export types
# - Single import point for pages

# Validation:
# - Can import from facade
# - All functions accessible
# - Types correct
```

**Success Criteria:**

- [ ] File created
- [ ] All exports available
- [ ] Single import path works
- [ ] Can use in routes later

**3.3.6: Unit Tests** (45 minutes)

```bash
# Create: lib/strapi/documentation/strategic/__tests__/
#   ├── documentation-strategic-content-builder.test.ts
#   ├── documentation-strategic-repository.test.ts
#   └── documentation-strategic-view-models.test.ts

# Must test:
# - Builder loads files
# - Queries return correct data
# - No null on valid inputs
# - View model transform works
# - Coverage >90%

# Run:
# pnpm run test -- documentation-strategic
# Result: All tests pass
```

**Success Criteria:**

- [ ] All test files created
- [ ] Tests are meaningful (not just "does it exist")
- [ ] > 90% coverage
- [ ] All tests passing
- [ ] No console warnings

### Task 3.4: Data Integrity (Gate 2) — 1 hour

**3.4.1: Run Unit Tests** (30 minutes)

```bash
pnpm run test -- documentation-strategic

# Expected:
# ✅ 15-20 tests
# ✅ All passing
# ✅ >90% coverage
# ✅ No console warnings
```

**Success Criteria:**

- [ ] All tests pass
- [ ] Coverage >90%
- [ ] No warnings
- [ ] Can show results to architect

**3.4.2: Spot Check Queries** (20 minutes)

```bash
# Manual verification:
node -e "
const { listStrategicDocs, getStrategicDocBySlug } = require('./lib/...');
console.log('Total docs:', listStrategicDocs().length);
console.log('Sample doc:', getStrategicDocBySlug('system-vision-and-principles'));
"

# Expected:
# - No errors
# - Data structure correct
# - No null returns on valid slugs
```

**Success Criteria:**

- [ ] Manual queries work
- [ ] Data is correct
- [ ] No console errors
- [ ] Performance acceptable

**3.4.3: Create Integrity Report** (10 minutes)

```markdown
# BATCH_1_DATA_INTEGRITY_REPORT.md

## Test Results

- Tests Run: 18
- Tests Passed: 18
- Tests Failed: 0
- Coverage: 94%

## Query Verification

- Total Documents: 8
- Queries Tested: 4 (list, getBySlug, filter, etc.)
- Null Returns: 0
- Performance: All <5ms

## Data Structure

- All documents have required fields
- Block types all recognized
- No undefined values

## Sign-Off

Architect Review: PASS ✅
Date: 2026-03-XX
```

**Success Criteria:**

- [ ] Report complete
- [ ] All metrics documented
- [ ] Architect has reviewed
- [ ] Gate 2 PASS marked

### Task 3.5: Route Creation (Stretch, if tokens available)

**IF tokens >50% remaining after 3.4**, proceed:

```bash
# Create: app/(dashboard)/dashboard/documentation/strategic/page.tsx
# Create: app/(dashboard)/dashboard/documentation/strategic/[slug]/page.tsx
# Implement: generateStaticParams(), generateMetadata()
# Update: lib/strapi/content-route-manifest.ts (add strategic routes)

# Success:
# - Pages render without errors
# - generateStaticParams returns all slugs
# - generateMetadata includes SEO fields
```

**Success Criteria:**

- [ ] Routes created and render
- [ ] Static params generated
- [ ] Metadata complete
- [ ] Sitemap includes routes

---

## Gate Validation Standards

### Gate 1: Schema Validation

**PASS Criteria (ALL must be true):**

✅ All JSON files parse without syntax errors  
✅ All files validate against Zod schema  
✅ Zero validation errors (exact match required)  
✅ Warnings documented (but don't block pass)  
✅ All block types recognized (from core registry)  
✅ All required fields populated  
✅ Validation report created  
✅ Architect has reviewed and signed off

**If ANY criterion fails:**

- Document the failure
- Fix the issue
- Revalidate
- Don't proceed to Gate 2 until passing

### Gate 2: Data Integrity

**PASS Criteria (ALL must be true):**

✅ All unit tests pass (100% passing)  
✅ Code coverage >90%  
✅ No null returns on valid queries  
✅ Repository queries are accurate  
✅ View model transforms work  
✅ Facade exports are accessible  
✅ No TypeScript errors  
✅ Integrity report created  
✅ Architect has reviewed and signed off

**If ANY criterion fails:**

- Identify the failing test/query
- Debug the issue
- Fix the code
- Rerun tests
- Don't proceed to Gate 3 (routes) until passing

---

## Session 3 Checkpoint Template

Create this at end of Session 3:

```markdown
# SESSION_3_CHECKPOINT.md

**Date:** 2026-03-XX  
**Duration:** 8 hours  
**Tokens Used:** XX / 128K (YY%)  
**Status:** ✅ BATCH 1 EXTRACTION + DATA LAYER COMPLETE

## What Was Accomplished

### Extraction (3.1)

- Articles Extracted: 8 / 10 required
- Content State: All in JSON format
- Status: ✅ COMPLETE

### Schema Validation (3.2 — Gate 1)

- Files Validated: 8
- Validation Result: ✅ PASS
- Date Signed Off: 2026-03-XX

### Data Layer (3.3)

- Files Created: 5 (schema, builder, repository, viewmodels, facade)
- Code State: All compiling, no TypeScript errors
- Status: ✅ COMPLETE

### Testing (3.4 — Gate 2)

- Tests Created: 18
- Test Result: ✅ PASS (18/18)
- Coverage: 94%
- Status: ✅ COMPLETE

### Stretch (3.5)

- Status: [Deferred to Session 4 / COMPLETE]
- Reason: [Token budget / Completed ahead of schedule]

## Lessons Learned

See PHASE_3_LESSONS_LEARNED.md for detailed analysis.

### Key Learnings

1. Extraction took X hours (vs Y estimated)
2. Validation was smooth / had issues with:
3. Data layer assembly: [pattern(s) that worked well]
4. Testing: [coverage was easy / hard to achieve]

### Adjustments for Batch 2

1. Extraction time: adjust from Y to X hours
2. Schema: [any changes needed?]
3. Data layer: [any improvements?]
4. Testing: [any easier ways?]

## Metrics

| Metric          | Value   | Target   | Status   |
| --------------- | ------- | -------- | -------- |
| Tokens Used     | XX      | <110K    | ✅/⚠️/❌ |
| Extraction Time | X hours | 4 hours  | ✅/⚠️/❌ |
| Test Coverage   | XX%     | >90%     | ✅       |
| Gate 1          | PASS    | Required | ✅       |
| Gate 2          | PASS    | Required | ✅       |

## Ready for Session 4?

✅ YES — All gates passed, data layer complete, ready for route migration.

## Next Steps (Session 4)

1. Create routes (list + detail pages)
2. Run gates 3-5 (routes, quality, build)
3. Sign-off and merge to main

## Issues & Blockers

[List any issues found, how resolved, or deferred]

## Token Efficiency

- Start: 128K
- Used: XX K
- Remaining: YY K
- Efficiency: ZZ% (excellent/good/needs improvement)
```

---

## Confidence Briefing

You have:

✅ **Locked governance** — Architecture won't change mid-execution  
✅ **Clear extraction targets** — 8-10 articles identified  
✅ **Validated schema** — Zod schemas proven in Session 2 with sample JSON  
✅ **Detailed execution checklist** — Copy-paste ready, step-by-step  
✅ **Learning capture framework** — Document as you go  
✅ **Gate validation standards** — Clear pass/fail criteria  
✅ **Token budget discipline** — Stretch tasks are deferrable

**Execution Mindset:** Move fast, fail small, learn constantly, adjust next batch.

If something breaks, stop, document, fix, continue. Don't force bad decisions.

---

**Status:** Ready to execute Phase 3 with senior discipline and learning focus.
