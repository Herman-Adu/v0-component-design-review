# v0 Rules: Review Module
**Last modified:** Session 53 (2026-02-10) -- Added Brainstorming Protocol (adapted from obra/superpowers). Next.js/React rules now in v0-rules-nextjs.md.
**Load when:** Running 3-axis review, audit, validation, pre-implementation planning, or debugging

---

## Pre-Implementation Brainstorming Protocol

**Trigger:** Before ANY new feature (not migrations or routine tasks).

**3-Question Discovery (chat output, 0 ops):**
1. **WHAT:** What exactly are we building? State the concrete deliverable.
2. **HOW:** What are 2-3 approaches? List tradeoffs for each (complexity, performance, maintainability).
3. **WHICH:** Which approach fits best and why? Cite specific project constraints.

**Rules:**
- NEVER skip brainstorming for new features. Migrations and routine tasks are exempt.
- If the user has already specified the approach, acknowledge it and skip to implementation.
- If all approaches are roughly equal, pick the simplest one and state why.
- Brainstorming is OUTPUT ONLY (chat text). It costs 0 ops. No excuse to skip it.

---

## Verification Gate (IRON LAW)

```
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE
```

**BEFORE claiming any status ("PASS", "CLEAN", "Done", "Fixed"):**

1. **IDENTIFY:** What evidence proves this claim?
2. **GATHER:** Read the file back. Check preview debug logs. Grep for known bad patterns.
3. **READ:** Full output. Don't skim.
4. **VERIFY:** Does evidence confirm the claim?
   - If NO: State actual status with evidence
   - If YES: State claim WITH evidence
5. **ONLY THEN:** Make the claim

**Red flags -- STOP if you catch yourself:**
- Using "should", "probably", "seems to" without evidence
- Expressing satisfaction ("Done!", "Perfect!") before verification
- Trusting previous run results instead of fresh checks
- Saying "PASS" on a review axis without specific evidence

**Adapted for v0 context:**
- We can't run test commands. Verification = read file back + check preview logs + grep for anti-patterns
- "Fresh" means: in THIS response, not a previous one
- Each 3-axis review claim must cite specific evidence (file read, grep result, or preview check)

---

## 3-Axis Review Protocol

Run after every refactor batch (per timeout protection rule):

### Axis 1: Code Quality
- No `any` types, no console.log, no unused imports
- All icon imports resolve to valid lucide-react exports
- TypeScript strict compliance
- All shared components guard array props with `guardArrayProp()`
- Check console for `[PropGuard]` warnings (each = HIGH finding)
- All component calls use correct prop names matching interfaces

### Axis 2: Security
- No dangerouslySetInnerHTML, eval(), or hardcoded secrets
- Server actions use Zod validation
- No unvalidated user input rendered directly

### Axis 3: Architecture
- All nav routes have corresponding page.tsx files
- All imports resolve (grep paths, verify targets)
- Labels match current nav structure
- Code examples reflect current codebase

### Post-Review Build Check
- Preview loads without errors
- No tarball errors in logs

## 3-Stage Validation Pipeline (MANDATORY)

Run this pipeline for EVERY component creation session. No exceptions.

### STAGE 1: LINT (Before writing ANY component)
**Purpose:** Prevent errors from being written in the first place.
1. Read the Exports Manifest in v0-rules-content.md at session start (0 ops if already loaded)
2. For every component you plan to use, verify it's in the manifest
3. For every component, confirm the prop signature from the manifest
4. Draft imports mentally BEFORE writing -- never improvise
5. Check the Hallucination Registry -- if a name is on the list, DO NOT USE IT
**Rule:** If it's not in the Exports Manifest, it does not exist.

### STAGE 2: BUILD (After writing, before registering)
**Purpose:** Catch errors that slipped through Stage 1. Uses v0 Grep/Read tools (NOT scripts -- script sandbox has no access to project files).

**Step 2a: Negative Validation -- Hallucination Grep** (1 Grep call):
Grep ALL new files for ALL hallucinated names. Full pattern:
`BestPracticeCard|WarningCallout|InfoCallout|SectionAnchor|explanations=\{|ComparisonTable|WarningBox|DecisionTree.*nodes=|KeyTakeaway.*title=|KeyTakeaway.*takeaway=`
ANY match = STOP and fix before proceeding.

**Step 2b: Positive Validation -- Canonical Cross-Reference** (2-3 Grep calls):
This is the PRIMARY guard. Negative validation only catches KNOWN bad names. Positive validation catches ALL invalid imports.
1. **Get canonical exports:** `Grep pattern="^export (function|const) " path=/components/molecules/article-components.tsx` -- produces the authoritative list of what EXISTS.
2. **Get tutorial imports:** `Grep pattern="from.*article-components" path=/components/tutorials/{new-file}.tsx` -- shows what each file CLAIMS to import.
3. **Cross-reference:** Every destructured name in the import MUST appear as an export name in step 1. If ANY name appears in the import but NOT in the exports = HALLUCINATION. STOP and fix.
4. **Atom imports:** Same process for `@/components/atoms/*` -- Grep exports from each atom file, cross-reference with tutorial imports.

**Why tool-based, not script-based:** v0 script execution sandbox only contains node_modules -- no project source files. Grep/Read tools have full project access. This is documented and permanent.

**Cost:** 2-3 Grep calls (0 write ops). Factor into session budget as read ops only.

### STAGE 3: VERIFY (After registration, before close)
**Purpose:** Confirm end-to-end integrity.
1. Import count in slug page matches expected total
2. Every slug in richContentMap has a corresponding import
3. No unused imports (import exists but no slug mapping)
4. No orphan mappings (slug in map but no import)

**Note:** The Hallucination Registry (single source of truth) lives in `v0-rules-content.md`. Always reference the latest version there.

## Review Logging

After any review or significant change:
1. Add entry to `data/code-review-log.ts` following ReviewEntry type
2. Update `data/project-state.ts`
3. Announce: "Review #N complete. X/15 ops used."

## PropGuard Review Process

After any content creation:
1. Navigate to each new page in preview
2. Open console, filter for `[PropGuard]`
3. Each warning = HIGH finding (wrong prop name, missing data, shape mismatch)
4. Fix the CALLER, not the guard
5. Verify warning disappears after fix
