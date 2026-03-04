# v0 Session Rules

Copy this entire block into the v0 sidebar Rules panel.
These rules persist across ALL sessions automatically.

---

## Session Start Protocol (MANDATORY -- NO EXCEPTIONS)

At the start of EVERY session, before making any changes:

1. Read `/data/project-state.ts` for full project orientation
2. Read `/data/code-review-log.ts` (last 2 entries) for recent history
3. Announce the task and estimated operation count (format: "Task: X. Est: Y/15 ops.")
4. If auto-managing (no user prompt), state what was completed last session and what this session will do
5. NEVER skip steps 1-2. NEVER proceed to edits without completing orientation.

## Architecture Rules

- This project uses Atomic Design: atoms -> molecules -> organisms -> pages
- Components live in `components/{atoms,molecules,organisms}/`
- All forms use Zustand stores in `lib/store/`
- Email templates use React Email in `lib/email/templates/`
- Validation uses Zod schemas in `lib/validation/`
- Navigation is defined in `data/nav-data.ts`, rendered by `components/molecules/docs-sidebar.tsx`
- Documentation sidebar has 4 role-based sections: Strategic Overview, CMS Reference, App Reference, Infrastructure & Ops

## Session Budget (CRITICAL -- HARD ENFORCED)

- Maximum 15 file operations (Write + Edit + Delete combined) per session
- Reserve 2 ops for session start (reads) + 3 ops for session close (project-state + review-log + validation) = 10 ops for actual work
- Warning at 12 operations: announce "12/15 -- completing current item then stopping"
- At 15 operations: STOP. No exceptions. Summarise and start new session.
- NEVER exceed 15. NEVER say "one more edit". STOP.
- Never touch a file you do not need to change
- Maximum 2 Edit operations per individual file in a single session
- Per session realistic output: 1-2 rich article components (not 3-4)
- Always count ops in announcements: "X/15 ops used"

## Tarball Protection (CRITICAL)

If you see "Cannot open: File exists" in preview build logs:
1. STOP IMMEDIATELY -- do not make any more file changes
2. Do NOT delete files to "fix" the tar -- this causes data loss
3. Do NOT re-write files to "reset" them -- this adds more tar entries
4. Inform the user: "The preview has a tarball collision. All files on disk are correct. Starting a new session will resolve this -- the tar archive resets per session."
5. Before ending session, update `/data/project-state.ts` with current state

## 3-Axis Review Protocol

Run after every major task (any task touching 5+ files):

### Axis 1: Code Quality
- No `any` types, no console.log, no unused imports
- All icon imports resolve to valid lucide-react exports
- TypeScript strict compliance
- All shared components guard array props with `guardArrayProp()` (grep for `.map(` -- verify guard exists above it)
- Navigate to each new article in preview -- check console for `[PropGuard]` warnings (each = HIGH finding)
- All article component calls use correct prop names matching shared component interfaces

### Axis 2: Security
- No dangerouslySetInnerHTML, eval(), or hardcoded secrets
- Server actions use Zod validation
- No unvalidated user input rendered directly

### Axis 3: Architecture
- All nav routes have corresponding on-disk page.tsx files
- All imports resolve (grep import paths, verify targets exist)
- Labels match current nav structure (no stale "Backend & CMS" or "Frontend & Integration")
- Code examples in docs reflect current codebase

### Post-Review Build Check
- Preview loads without errors
- No "Cannot open: File exists" in logs
- If tarball error: STOP, inform user, do not attempt in-session fix

## Review Logging

After completing any review or significant change:
1. Add entry to `/data/code-review-log.ts` following the ReviewEntry type
2. Update `/data/project-state.ts` with new state (review count, date, any structural changes)
3. Announce to user: "Review #N complete. Session has used X/15 file operations."

## Automated Session Discipline (CRITICAL -- PREVENTS AGENT TIMEOUT DURING AUTOMATION)

When auto-continuing without user intervention:
1. Each response does ONE unit of work only: either 1 component write OR 1-2 registration edits -- NEVER both
2. Max 4 tool calls per automated response (not 6) -- automation has tighter limits
3. After each response, summarise and continue in the NEXT response
4. Plan BEFORE acting: state "This response: [specific action]. Next response: [next action]."
5. If unsure whether a task will fit in one response, split it. Smaller is always safer.
6. A Write of a large component (300+ lines) counts as 2 tool calls worth of processing time
7. NEVER combine component creation + slug registration in one response during automation

### Automation Response Pattern (follow every time):
- Response A: Create component file (1 write)
- Response B: Register it (1 read + 1-2 edits)
- Response C: Session close (MUST follow full Sprint Close Protocol below) OR next component
- Session close during automation follows the SAME Sprint Close Protocol as manual sessions
- The Sprint Context Block in the review-log is NON-NEGOTIABLE even during automation
- If budget is tight, drop the next component -- NEVER drop the review-log entry

## Timeout Protection (HARD ENFORCED -- PREVENTS AGENT TIMEOUT)

- Max 6 sequential tool calls per response -- then STOP, summarise progress, continue in next response
- NEVER chain 7+ tool calls. This causes agent timeout and wastes the user's money.
- Batch parallel reads (max 4 simultaneous) -- use parallel calls for independent reads
- For large tasks, break into multiple responses -- pause and summarise progress between batches
- Never read files over 400 lines in full -- use offset/limit
- If a task requires editing 6+ files, split across 2-3 responses
- Prefer parallel tool calls over sequential whenever there are no dependencies between them
- After every 4-5 tool calls, announce: "X/15 ops. Progress: [what's done]. Next: [what's next]."

## Defensive Props Standard (CRITICAL -- PREVENTS PAGE CRASHES)

ALL shared components in `components/molecules/article-components.tsx` that accept array props MUST:
1. Import and use `guardArrayProp` + `PropGuardDiagnostic` from `@/lib/utils/prop-guard`
2. Guard EVERY array prop BEFORE calling `.map()`: `const guarded = guardArrayProp(prop, "ComponentName", "propName")`
3. Return `<PropGuardDiagnostic />` if guard returns null (dev mode shows yellow diagnostic card)
4. NEVER call `.map()` directly on an unguarded prop -- this is a page-crashing bug
5. In 3-axis review, check browser console for `[PropGuard]` warnings -- each one is a HIGH severity caller bug
6. PropGuard warnings mean the CALLER is broken, not the guard. Fix the article component, not article-components.tsx
7. When writing new article components, verify every shared component call has correct prop names and shapes

### Review Process for PropGuard
- After any content creation, navigate to each new article in preview
- Open browser console, filter for `[PropGuard]`
- Each warning = HIGH finding: wrong prop name, missing data, or shape mismatch
- Fix the caller, then verify warning disappears

## Content Quality Standard (CRITICAL -- ZERO TOLERANCE)

All new articles, tutorials, and case studies MUST:
1. Have a dedicated component file in `components/articles/` or `components/case-studies/` using the full shared component library from `components/molecules/article-components.tsx`
2. Use the standard layout template: content left (`flex-1 min-w-0`), TableOfContents right (`aside hidden xl:block w-64 flex-shrink-0`)
3. ALWAYS include: TableOfContents, SectionHeader, InfoBox, CodeBlock, KeyTakeaway, RelatedArticles
4. Use diagrams/flows (StepFlow, VerticalFlow, DataFlowDiagram, ArchitectureDiagram, ProcessFlow, DecisionTree) where applicable
5. Use data visualisation (MetricsGrid, StatsTable, ComparisonCards, BeforeAfterComparison, FeatureGrid) where applicable
6. Use structural components (FileTree, NumberedList, SubSectionHeader) where applicable
7. NEVER store long content as flat text strings in data arrays -- data entries hold metadata + brief excerpt only
8. Register the component in the slug page's `richArticleComponents` map (or equivalent for case studies/tutorials)
9. Set `hasRichContent: true` in the data entry
10. Content must be comprehensive, technically sound, and professionally presented

## Session Self-Management (MANDATORY)

- v0 auto-manages sessions without user intervention during batch content work
- At 13/15 ops: STOP making content. Use remaining 2 ops for session close (project-state + review-log)
- Announce: "Session N complete. X items done. Y remaining. Starting Session N+1."
- Then immediately: re-read rules + project-state (new session start protocol)
- Only pause for user input when: (a) ambiguous requirements, (b) architectural decisions, (c) blocker/error
- NEVER skip session close. NEVER skip session start. These are non-negotiable.
- Track and announce after every tool call batch: "X/15 ops. Done: [items]. Next: [item]."

## Session End Protocol (MANDATORY -- EVERY SESSION -- NON-NEGOTIABLE)

Reserve 3 ops minimum for session close. Budget: 10 ops for work, 3 ops for close, 2 for init.

### Sprint Close Steps (ALL required, in order):

**Step 1: Update `/data/project-state.ts`** (1 op)
- Current counts, session number, status
- Add one-liner to `sprintHistory` array: "S{N}: {what was done}"

**Step 2: Write Sprint Context Block to `/data/code-review-log.ts`** (1-2 ops)
Every review-log entry MUST include these 5 sections in the summary or findings:
- **Deliverables:** Exact files created, edited, registered (with line counts)
- **Patterns Learned:** Architecture discoveries, template patterns, gotchas found
- **Rules Changed:** Any new/modified rules added this session and why
- **Validation Status:** What renders correctly vs what needs checking
- **Next Sprint Context:** Exact state inherited -- pending items, watch-outs, priorities

**Step 3: Summarise to user** in this format:
- **Session N complete. X/15 ops used.**
- **Done this session:** [list]
- **Total progress:** [running totals]
- **Next session:** [what comes next]

### Hard Stop Rule:
If you reach 12/15 ops and NO review-log entry exists for this session: STOP ALL WORK. Use remaining 3 ops for close protocol. NEVER start a new session without a review-log entry for the current one.

### Review-Before-Continue Gate:
When auto-starting a new session, check: does the previous session have a review-log entry? If NO, write it BEFORE doing anything else. Context gaps cascade -- one missing entry makes all future sessions partially blind.

### Build Validation Step (part of close, before writing review-log):
Run quick validation greps:
- Missing imports: component file exists but no import in slug page
- Prop mismatches: grep for known bad patterns (e.g. `nodes={` on DecisionTree)
- Unregistered components: file in components/ with no slug mapping
Log findings in the review-log Validation Status section.
