# v0 Rules: Core Module
**Last modified:** Session 50 (2026-02-10) -- Close protocol optimized: 7 ops -> 3 ops. Handoff deferred to next session start. Combined project-state edits.
**Load:** EVERY session

---

## Session Start Protocol (MANDATORY)

1. Read `data/project-state.ts` for orientation
2. Read last entry of `data/code-review-log.ts` (offset to tail) for previous sprint context
3. **Sync Verification:** Confirm the last review-log entry ID matches the sprintHistory tail session number. If they DON'T match, the previous session failed to sync -- fix BEFORE any new work.
4. Read `data/v0-rules-index.md` to determine which modules to load
5. Run Sprint Planning Protocol (see index) -- plan BEFORE acting
6. Announce: "Session N. Task: X. Budget: Y work ops. Previous sync: VERIFIED."

## Session Budget (HARD ENFORCED)

- Maximum 15 file operations (Write + Edit + Delete) per session
- Budget split: 2 init + 10 work + 3 close = 15
- Warning at 12 ops: "12/15 -- completing current item then closing"
- At 15 ops: STOP. No exceptions.
- Maximum 2 Edit operations per individual file per session
- Always count ops: "X/15 ops used"

## File Safety Rules (HARD ENFORCED)

- **File extensions:** `.ts` for data/types/logic. `.tsx` ONLY when file contains JSX. No exceptions.
- **NEVER delete files directly.** Ask the user to delete files manually. The v0 filesystem has proven unreliable with delete operations (S41 incident: deleting a same-basename `.ts` file destroyed the `.tsx` file). User manual deletion is faster and safer.
- **NEVER create a file with the same base name** as an existing file but different extension (e.g. creating `foo.ts` when `foo.tsx` exists). This causes module resolution conflicts and potential data loss.
- **After any file rename/move:** Verify with Glob that exactly 1 file exists at the target path and 0 at the source path. Then grep for all stale references and fix them.

## Session End Protocol (NON-NEGOTIABLE) -- Optimized S50

Reserve 3 ops for close. If at 12 ops with no review-log: STOP ALL WORK.

**Step 1:** Read + Edit `data/code-review-log.ts` (2 ops: read tail + edit)
Add entry with: scope, summary, findings, metrics.

**Step 2:** Read + Single Edit `data/project-state.ts` (1 op: combined edit)
Use a SINGLE edit that captures both header AND sprintHistory tail in the old_string.
This avoids needing separate reads + edits. One read, one edit, both updated.

**Step 3:** Handoff is written at NEXT SESSION START, not at close.
The review-log + project-state are the source of truth. The handoff is derived from them.
At session start: read project-state + review-log tail -> write handoff -> begin work.
This eliminates 1-2 ops from close and moves them to init (where reads are already happening).

**Step 4:** Output Sync Receipt to user (0 ops -- chat output only):
```
SYNC RECEIPT -- Session {N}
[x/!] Review-log: entry written
[x/!] Project-state: header + sprintHistory updated (single edit)
Status: PASS | FAIL ({reason})
```

**Budget: 3 close ops (was 7). Freed 4 ops for actual work.**

## Review-Before-Continue Gate

When auto-starting a new session: check if previous session has a review-log entry. If NO, write it BEFORE doing anything else.

## Post-Edit Verification Rule (MANDATORY)

After ANY edit that triggers an autofix warning:
1. Re-read the affected lines to confirm the actual file state
2. NEVER assume autofix produced the intended result
3. If the result differs from intent, fix immediately (counts as 1 additional op)
4. If an edit FAILS (oldString not found), re-read the file BEFORE retrying or moving on

## Tarball Protection

If "Cannot open: File exists" in build logs:
1. STOP immediately
2. Do NOT delete or re-write files
3. Inform user: tarball collision, new session needed
4. Update project-state before ending

## Timeout Protection (HARD ENFORCED -- matches custom instruction panel)

- **Maximum 6 tool calls per response. After 6 calls, STOP.**
- Summarise progress, announce remaining ops, and **continue automatically in the next response**.
- **Only pause for user input when a decision is needed.** Do NOT require "continue" for routine work.
- Never try to complete a full task in one response. Split across multiple responses.
- **After every refactor batch, run 3-axis review (Code Quality, Security, Architecture) before continuing.**
- Batch parallel reads (max 4 simultaneous) -- parallel calls count as 1 toward the 6-call limit.
- Never read files over 400 lines without offset/limit.
- If editing 6+ files, split across 2-3 responses.
- Announce after every batch: "X/15 ops. Progress: [done]. Next: [next]. Calls this response: Y/6."

## Session Self-Management

- Auto-manage sessions during batch work without user intervention
- At 12/15 ops: STOP content. Use remaining 3 for close.
- Only pause for user input: ambiguous requirements, architectural decisions, blockers
- NEVER skip session close. NEVER skip session start.

## Safe Editing Rules

- **NEVER use replace_all on JSX component tag names.** Opening `<Component>` and closing `</Component>` tags must be handled separately, or rewrite the full block.
  - BAD: `replace_all "WarningBox" -> "InfoBox type=\"warning\""` (breaks closing tags)
  - GOOD: Replace opening and closing tags in separate edits, or rewrite the full JSX block via Write.
- When using replace_all, always consider: does the string appear in BOTH opening and closing positions? If yes, do NOT use replace_all.

## Architecture Rules

- Atomic Design: atoms -> molecules -> organisms -> pages
- Components: `components/{atoms,molecules,organisms}/`
- Stores: `lib/store/` (Zustand)
- Validation: `lib/validation/` (Zod)
- Navigation: `data/nav-data.ts`
- Sidebar: `components/molecules/docs-sidebar.tsx` (4 role-based sections)
