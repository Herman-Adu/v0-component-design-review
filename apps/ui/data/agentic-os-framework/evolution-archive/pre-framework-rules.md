# v0 Rules -- Consolidated (Single Source of Truth)
# Last modified: Session 58 (2026-02-10) -- Consolidated from 10 data/v0-rules-*.md files + .v0/rules.md
# Framework Initialized: 2026-02-13 -- Agentic OS Framework v1.0 Active
# This file AUTO-LOADS every session. No Read ops needed.

---

## SECTION 0: AGENTIC OS FRAMEWORK (NEW)

### Framework Status
✅ **ACTIVE** - Agentic OS Framework v1.0 initialized 2026-02-13

**Central Documentation:** `/data/agentic-os-framework/`
- 01-CORE-PRINCIPLES.md - Foundation principles (10 core principles)
- 03-OPERATIONAL-PROCEDURES.md - Step-by-step workflows
- 04-TEMPLATES-AND-SETUP.md - Template files
- 09-QUICK-REFERENCE.md - Quick lookup tables

### 4-TIER Model Selection System
Integrated with existing model selection procedures:

**TIER 1 (v0-mini): $1/$5** - CSS, copy, metrics, session close ops
**TIER 2 (v0-pro): $3/$15** - Standard features, APIs, hooks (2-5 files)
**TIER 3 (v0-max): $5/$25** - Architecture, refactors, reviews, rule/meta work
**TIER 4 (opus-4.6-fast): $15/$75** - Critical quality work (REQUIRES USER APPROVAL)

**TIER 4 Approval Protocol:**
```
⚠️ TIER 4 REQUEST
This task requires opus-4.6-fast (most expensive model).
Cost: $15/$75 per 1M tokens
Reason: [explain why TIER 4 needed]
Proceed with TIER 4? (yes/no)
```

### Health Monitoring (Integrated with Session Management)
- Visual health score display every response
- Token tracking in `.v0/metrics.md`
- Automatic mode switching based on health thresholds
- Handoff templates for session continuity

### Operational Files
- `.v0/state.json` - Current project state, architecture, active work
- `.v0/metrics.md` - Token usage, model distribution, health tracking
- `.v0/orchestrator.md` - My operational instructions and protocols

**Read Priority:**
1. `.v0/state.json` (every session start)
2. `.v0/rules.md` (this file - auto-loaded)
3. Framework docs (when needed for specific scenarios)

---

## SECTION 1: SESSION MANAGEMENT

### Session Start (MANDATORY)
1. Read `/data/conversation-handoff.md` for context
2. Announce: "Session N. Task: X. Budget: 15 ops (2 init + 10 work + 3 close)."

### RULE 1: Response Prefix (ENFORCED -- every single response)
Every response MUST start with:
`S[N] | ops: [remaining]/15 | chat: ~[X]k tokens | model: [MINI/PRO/MAX/OPUS] | Status: [STATE]`
States: FRESH, ACTIVE, YELLOW, AMBER, RED, CLOSING
If previous response SKIPPED the prefix:
- Start with: "RULE VIOLATION: Previous response skipped prefix. Correcting now."
- Log as self-compliance failure in session metrics

### RULE 2: Close Reserve Floor (NEVER BREACHED)
- **3 ops** ALWAYS reserved for session close. Work budget = 12 ops max.
- **15k tokens** buffer before context limit for close protocol.
- At 12 ops used: STOP work. Close session. No exceptions.
- At AMBER (40k+ tokens): Wrap current task, close session.
- At RED (60k+ tokens): Stop immediately, close session.
- Close protocol: Read handoff (1) + Edit handoff (1) + Edit review-log/project-state (1)

### RULE 4: STOP, VALIDATE, SYNC Workflow (NON-NEGOTIABLE -- Master Discipline Rule)
**This rule supersedes all other priorities. CANNOT be skipped, shortened, or compromised.**

Every implementation batch (feature, refactor, migration) MUST follow this exact workflow:

1. **STOP** - Halt work on current batch after code changes applied
2. **VALIDATE** - Run 3-axis review (Code Quality, Security, Architecture)
3. **SYNC** - Update project state, handoff, review-log with batch results

**CRITICAL ENFORCEMENT:**
- Do NOT proceed to next batch until current batch is STOP, VALIDATED, SYNCED
- Do NOT skip validation to "save time" (creates cascading bugs)
- Do NOT mark batch complete without validation evidence
- Do NOT continue work after SYNC without explicit user confirmation

**Validation Evidence REQUIRED:**
- Build check: No errors, all imports resolve
- Visual verification: Screenshots or live preview confirmation at 2+ breakpoints
- Code review: No console.log, no unused imports, no `any` types
- Architecture check: New code follows established patterns

**Batch State Machine:**
```
ACTIVE (work in progress)
  ↓
STOP (halt changes)
  ↓
VALIDATE (3-axis review + evidence)
  ↓ Pass: VALIDATED
  ↓ Fail: Fix issues, re-validate
  ↓
SYNC (update project state)
  ↓
BLOCKED (waiting for user confirmation before next batch)
```

**If validation reveals issues:**
- Document exact issues found
- Propose fixes
- Re-run validation
- Do NOT proceed to next batch until PASS

**Session state at batch completion:**
- Announce: "[BATCH N COMPLETE - VALIDATED]"
- Show validation evidence
- Update handoff with exact state
- STOP and wait for user before next batch

**User can override ONLY if:**
- User explicitly says "skip validation on batch N"
- User takes responsibility for quality
- Still document this decision in review-log

**This is the difference between professional-grade work and breakage cascades.**
After EVERY code change, BEFORE saying "done":
1. Verify imports exist in target module (Read export lines)
2. Check for TypeScript errors (Read the file back)
3. If error found: fix it in SAME response, not next
4. Only THEN respond to user with results
Skipping this = the S59 DocPageLayout failure. Never again.

---

## SECTION 2: RESPONSIVE GRID STRATEGY FOR DOCUMENTATION PAGES

### Grid Utility Selection (CRITICAL DISCIPLINE)

**Foundation Principle:** Desktop design is preserved. We work backward from desktop to mobile. We do NOT reshape components.

**Original Responsive Grid Utilities (Pre-existing):**
- `.responsive-grid-3`: 3 columns at desktop → 2 columns at tablet → 1 column at mobile
- `.responsive-grid-2`: 2 columns at desktop → 2 columns at tablet → 1 column at mobile
- `.responsive-grid-4`: 4 columns at desktop (various responsive breakdowns)

These utilities work perfectly at **full-width** (Overview, Getting Started pages).

**Container Query Grid Utility (New - For TOC Constraint):**
- `.responsive-grid-3-cq`: Same as `.responsive-grid-3` BUT detects TOC sidebar constraint
  - When TOC sidebar present (lg+ breakpoints): Constrains to 2 columns instead of 3
  - When TOC hidden (mobile): Behaves identically to `.responsive-grid-3`
  - Container query fallback: @supports check with viewport-based fallback

**When to Apply Each Utility:**
1. **Non-TOC pages (Overview, Getting Started):** Use `.responsive-grid-3` (full-width benefit)
2. **TOC pages - full-width 3-column components:** Audit desktop layout
   - If grid component displays 3 cards in single row at desktop: Use `.responsive-grid-3-cq`
   - If grid component displays 2 cards: Use `.responsive-grid-2` (no TOC constraint issue)
   - If grid component displays 4+ cards: Audit specific layout structure
3. **TOC pages - 2-column components:** Use `.responsive-grid-2` (no container query needed)

**Selection Process (MANDATORY BEFORE APPLYING UTILITY):**
1. Open page at desktop (full width, no TOC constraint)
2. Identify each grid component
3. Count cards in single row at desktop
4. If 3 cards in row: Apply `.responsive-grid-3-cq` for TOC pages
5. If 2 cards in row: Apply `.responsive-grid-2`
6. VALIDATE at desktop WITH TOC, then tablet, then mobile
7. Only then move to next grid component

**AUDIT DISCIPLINE:**
Do NOT apply container query universally. Audit each component. Only apply where TOC bleed occurs. Surgical fixes only.

### Supporting Rules (Reference -- not primary enforcement)

**Session Budget:** 15 ops total. Split: 2 init + 10 work + 3 close.
**Timeout Protection:** Max 6 tool calls per response. Batch parallel reads (max 4).
**Model Selection:** Assess BEFORE every task. State recommendation. Wait for user confirmation.
- v0 Mini: Single-file edits, styling, copy, docs, session close ops
- v0 Pro: Multi-file features (2-5 files), new pages, moderate bugs
- v0 Max: Architecture, reviews, multi-system refactors, research, rule/meta work
- Opus 4.6 Fast: Rapid prototyping, speed over platform awareness
**Chat Window:** GREEN (0-20k) | YELLOW (20-40k) | AMBER (40-60k) | RED (60-80k) | CRITICAL (80k+)
**Post-Edit Verification:** After autofix warning, re-read affected lines. Never assume autofix worked.
**Micro-Sprints:** Work in 2-4 op sprints. After each: announce state, verify, decide continue or close.
**Session Close:** Read+Edit handoff, Edit review-log/project-state. Output SYNC RECEIPT.

### PROCEDURE 1: Model Change (MANDATORY STOP)
When recommending a model switch:
1. State: "I recommend switching to [MODEL] because [reason]. STOPPING NOW."
2. Wait for user to change model in v0 UI and confirm
3. Reset session metrics FOR THAT MODEL (different token economics)
   - Mini: 15+ ops possible per session, more efficient with tokens
   - Max: 8-10 ops per session, uses tokens faster, better reasoning
4. Resume work with correct budget assumptions
NEVER continue work without explicit model confirmation from user.

### PROCEDURE 2: Todo List Persistence (AT SESSION CLOSE)
When closing a session:
1. DO NOT mark todo list "all done" 
2. DOCUMENT FULL todo state in handoff:
   - Completed tasks: list with details of what was done
   - In-progress tasks: list with EXACT stopping point (line numbers, what's next)
   - Todo tasks: list with prerequisites
3. INCLUDE todo state in recovery prompt for next session
4. STOP and wait for user to open new chat
NEVER continue work after closing -- the todo list IS the state transfer.

### PROCEDURE 3: Session Close Output (FINAL FORM)
When closing a session, output EXACTLY:
```
**SESSION [N] CLOSED**

[Stats: ops used, tokens, model, errors]

**Todo List State:**
- Task 1: [status] [detail]
- Task 2: [status] [detail]

**To start S[N+1], open a new chat and paste:**
> [Recovery prompt with full handoff reference]

STOPPING. Ready for S[N+1] when you open new chat.
```
Do NOT continue working after this output.

---

**Session Metrics (captured in handoff at close):**
- Ops used: X/15 | Chat peak: ~Xk | Model: X | Errors caught in review: X | Errors caught by user: X
- Self-compliance failures: X | Resource efficiency: GREEN/YELLOW/RED

---

## SECTION 2: FILE SAFETY

### File Rules
- `.ts` for data/types/logic. `.tsx` ONLY when file contains JSX.
- NEVER delete files directly -- ask user to delete manually (S41 incident).
- NEVER create same base name with different extension (module resolution conflicts).
- After file rename/move: Glob verify + grep stale references.

### Tarball Protection
If "Cannot open: File exists": STOP. Do NOT delete/rewrite files. Inform user. New session needed.

### Safe Editing
- NEVER use replace_all on JSX component tag names (breaks closing tags).
- `dangerously_disable_autofix: true` for ALL import-only edits (Biome regression S58).
- NEVER create route groups `(folder)` without explicit user approval (S58 incident).

---

## SECTION 3: ARCHITECTURE

### Atomic Design
- atoms -> molecules -> organisms -> pages
- Components: `components/{atoms,molecules,organisms}/`
- Stores: `lib/store/` (Zustand)
- Validation: `lib/validation/` (Zod)
- Navigation: `data/nav-data.ts`
- Sidebar: `components/molecules/docs-sidebar.tsx` (4 role-based sections)

### Server/Client Boundaries (Next.js 16)
- Components are Server Components by default. Only add "use client" for hooks/events/browser APIs.
- NEVER pass functions as props from Server to Client Components.
- NEVER import server-only code in Client Components.
- `params`, `searchParams`, `headers`, `cookies` MUST be awaited.

### Performance
- Parallel data fetching with `Promise.all()`.
- `next/dynamic` for heavy client components.
- `next/image` for all images. `next/font` for fonts.
- `useMemo` for expensive computations. `useCallback` for functions as props.
- NEVER fetch inside `useEffect`. Use RSC data passing or SWR.

### Caching (Next.js 16)
- `"use cache"` directive for cacheable pages/components/functions.
- `cacheLife` profiles (`'max'`, `'days'`, `'hours'`).
- `revalidateTag(tag, cacheLifeProfile)` for targeted invalidation.

---

## SECTION 4: DOCUMENTATION SYSTEM

### Rule 1: Centralized Manifest
All stats, counts, labels MUST come from `data/doc-manifest.ts`. NEVER hardcode numbers.
```tsx
import { STATS, LABELS, ROUTES } from "@/data/doc-manifest"
```

### Rule 2: After Feature Change, Update Manifest
When adding/removing components, routes, security modules, backend schema -- update `data/doc-manifest.ts`.

### Rule 3: Route Validation
All internal hrefs MUST use `ROUTES` constants from manifest.

### Rule 4: Health Check After Major Changes
1. Does `data/doc-manifest.ts` reflect the new state?
2. Are all pages importing counts from manifest?
3. Do all new routes have `ROUTES` entries?
4. Are cross-references still valid?

### Rule 5: Page Creation Pattern
```tsx
import { STATS, LABELS, ROUTES } from "@/data/doc-manifest"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Callout } from "@/components/atoms/callout"
import { CodeBlock } from "@/components/atoms/code-block"
import { Spoiler } from "@/components/atoms/spoiler"
```

### Rule 6: Architecture Constants
Use `ARCHITECTURE` from manifest for layer diagrams.

### Rule 7: Content Data is Auto-Computed
`STATS.content.articles`, `.caseStudies`, `.tutorials` auto-count from arrays. Never manual update.

### Rule 8: File Size Limits
- Page files: Max 500 lines. Components: Max 300 lines. Data/config: Max 400 lines.

---

## SECTION 5: REVIEW PROTOCOL

### 3-Axis Review (run after every refactor batch)

**Axis 1: Code Quality**
- No `any` types, no console.log, no unused imports
- All icon imports resolve to valid lucide-react exports
- All shared components guard array props with `guardArrayProp()`
- Check console for `[PropGuard]` warnings (each = HIGH finding)

**Axis 2: Security**
- No dangerouslySetInnerHTML, eval(), or hardcoded secrets
- Server actions use Zod validation
- No unvalidated user input rendered directly

**Axis 3: Architecture**
- All nav routes have corresponding page.tsx files
- All imports resolve (grep paths, verify targets)
- Labels match current nav structure
- Code examples reflect current codebase

### Post-Refactor Workflow (MANDATORY after every refactor -- S58 rule)
1. 3-axis review -> fix findings
2. Build verify (dev server 200 status on all routes, no errors in logs)
3. Fix any build errors
4. Visual verify (navigate routes, confirm rendering)
5. No GitHub commits until clean

### Verification Gate (IRON LAW)
NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE.
Before claiming "PASS", "CLEAN", "Done", "Fixed":
1. IDENTIFY: What evidence proves this claim?
2. GATHER: Read file back. Check preview logs. Grep for bad patterns.
3. VERIFY: Does evidence confirm? If NO: state actual status.

### Pre-Implementation Brainstorming
Before ANY new feature (not migrations/routine):
1. WHAT: Concrete deliverable
2. HOW: 2-3 approaches with tradeoffs
3. WHICH: Best approach and why

---

## SECTION 6: SYSTEMATIC DEBUGGING

### Iron Law: NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST

**Phase 1: Root Cause Investigation**
1. Read full error output from preview debug logs
2. What changed since it last worked?
3. Trace data flow backward to source
4. Use `console.log("[v0] ...")` at component boundaries

**Phase 2: Pattern Analysis**
Find working examples. Compare. Identify differences.

**Phase 3: Hypothesis and Testing**
Single hypothesis. Minimal change. Verify. DON'T stack fixes.

**Phase 4: Implementation**
One fix. Verify. If 3+ attempts fail: STOP, question architecture, discuss with user.

---

## SECTION 7: CONTENT CREATION

### Content Quality Standard (ZERO TOLERANCE)
All articles, tutorials, case studies MUST:
1. Have dedicated component file using shared library from `article-components.tsx`
2. Standard layout: content left (`flex-1 min-w-0`), TableOfContents right
3. ALWAYS include: TableOfContents, SectionHeader, InfoBox, CodeBlock, KeyTakeaway, RelatedArticles
4. Register in slug page's richContentMap. Set `hasRichContent: true`.

### Exports Manifest (SINGLE SOURCE OF TRUTH)
If it's NOT on this list, it DOES NOT EXIST.

**article-components.tsx (23 exports):**
TableOfContents, SectionHeader, SubSectionHeader, InfoBox, StepFlow, VerticalFlow, ComparisonCards, BeforeAfterComparison, CodeBlock, FileTree, ArchitectureDiagram, FeatureGrid, MetricsGrid, DataFlowDiagram, DecisionTree, KeyTakeaway, RelatedArticles, StatsTable, NumberedList, ProcessFlow, SideBySideComparison, FileTreeDiagram, MetricCard

**Atom Components:**
CodeExplanation (from @/components/atoms/code-explanation), CodeBlock (from @/components/atoms/code-block), Spoiler (from @/components/atoms/spoiler)

### Hallucination Registry (NEVER use these):
BestPracticeCard -> InfoBox type="tip"
WarningCallout -> InfoBox type="warning"
InfoCallout -> InfoBox type="info"
SectionAnchor -> SectionHeader
ComparisonTable -> StatsTable
WarningBox -> InfoBox type="warning"

### Defensive Props Standard
ALL shared components accepting array props MUST use `guardArrayProp()` before `.map()`.

---

## SECTION 8: AUTOMATION

### Automated Session Discipline
1. Each response: ONE unit of work (1 write OR 1-2 edits, never both)
2. Max 4 tool calls per automated response (tighter than manual)
3. Plan before acting: "This response: [X]. Next: [Y]."
4. NEVER combine component creation + registration in one response

### Batch Operations
- Max 3 components per session (3 writes + registrations)
- ALWAYS include BOTH import AND slug mapping in same edit
- Budget: 1 init + 1 data read + 3 writes + 1 slug read + 2 slug edits + 3 close = 12/15

---

## SECTION 9: UI AUDIT CHECKLIST

### Accessibility
- Icon-only buttons: `aria-label`. Form controls: `<label>`. Semantic HTML first.
- Keyboard accessible. Headings hierarchical h1-h6.

### Forms
- Inputs: `autocomplete`, correct `type`, `name`. Labels clickable. Never block paste.
- Errors inline. Focus first error on submit.

### Performance
- Large lists (>50): virtualize. No layout reads in render.
- `text-wrap: balance` on headings. `tabular-nums` for number columns.

### Anti-patterns (flag immediately)
- `user-scalable=no`, `transition: all`, `outline-none` without focus-visible
- `<div onClick>` (should be `<button>`), images without dimensions, `.map()` without guard

---

## SECTION 10: CONVERSATION LIFECYCLE

### Conversation Open (First Session of New Chat)
1. Read `/data/conversation-handoff.md`
2. Read `/data/v0-evolution-playbook.md`
3. Read `/data/project-state.ts`
4. Sync verify: review-log matches sprintHistory
5. Announce: "Conversation N, Session X -- Init complete."

### Pressure Signals (check at every close, 1 point each)
- Session count >= 8 in conversation
- "Content redacted" on files < 200 lines
- Init cost > 3 ops
- 2+ consecutive error-fix sessions
- Read failures/truncation on key files
Score 2+: RECOMMEND new conversation. Score 3+: REQUIRE.

### Emergency Handoff
If session times out: next session detects from stale project-state + missing review-log entry. Self-heal, then continue.

---

## SECTION 11: KNOWN ISSUES (Updated S58)

- **Biome autofix** converts `import { X, Y }` to `import X, { Y }`. Fix: use aliases or `dangerously_disable_autofix: true`.
- **v0 file tools CANNOT handle parenthesized paths** `app/(folder)/`.
- **v0 sandbox layered filesystem**: Edit tool, terminal, Turbopack can read different layers. Full sandbox restart syncs.
- **`pnpm build` cannot run in sandbox** (symlink error). Verify via dev server 200 + visual checks.
- **Move tool leaves originals**: `Move(operation="move")` copies to destination but does NOT delete source. User must manually delete originals.
- **Delete tool reports "does not exist"** for files visible in tree. Stale file tree display -- collapse/expand or browser refresh to sync.
- **F57-5 OPEN**: Navbar width mismatch on dashboard. Do NOT fix via route groups.

---

## SECTION 12: GAP ANALYSIS

After major updates (5+ files, new routes, schema changes):
1. Navigate to `/dashboard/admin/document-administration/documentation-health/gap-analysis`
2. Run all 8 discovery passes
3. Review high-priority gaps
4. Record in code-review-log

### The 8 Passes:
Category Balance, Tutorial Coverage, Case Study Coverage, Level Distribution, Feature-to-Docs Cross-Reference, Component Documentation, Content Freshness, Cross-Content Synergy
