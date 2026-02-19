# v0 Rules: Conversation Lifecycle Module
**Last modified:** Session 34 (2026-02-09) -- Sync verification added to open. File ref .tsx fix.
**Load when:** First session of a new chat, OR when conversation pressure signals trigger

---

## Conversation Numbering

Track in `project-state.ts` field: `currentConversation: number`
Format sessions as: C{conv}-S{session} (e.g., C2-S15 = Conversation 2, Session 15)

## Conversation Open Protocol (First Session of New Chat)

1. Read `/data/conversation-handoff.md` if it exists (previous conversation's handoff)
2. Read `/data/v0-evolution-playbook.md` (relationship context, principles)
3. Read `/data/v0-rules-index.md` (determine which modules to load)
4. Read `/data/project-state.ts` (progress, sprintHistory, counts)
5. Read last entry of `/data/code-review-log.ts` (previous sprint context)
6. **Sync Verification:** Confirm the last review-log entry session number matches the last sprintHistory session number. If they don't match, the previous conversation did NOT sync properly -- fix BEFORE any new work.
7. Announce: "Conversation N, Session X -- Init complete. Previous sync: VERIFIED. Resuming from: [last sprint summary]"

## Conversation Pressure Signals

Check at EVERY Sprint Close. Score 1 point per signal:

| Signal | How to Detect |
|---|---|
| Session count >= 8 in this conversation | Count from sprintHistory since last CONVERSATION BOUNDARY |
| "Content redacted" on files < 200 lines | Observe during reads |
| Init cost > 3 ops | Count ops spent before first work item |
| 2+ consecutive error-fix sessions | Check sprintHistory for back-to-back fix sessions |
| Read failures or truncation on key files | project-state, review-log, rules files returning partial content |

**Score 2+ signals: RECOMMEND** new conversation in Sprint Close summary.
**Score 3+ signals: REQUIRE** new conversation. Run Conversation Close Protocol immediately.

## Handoff File Template (used by Sprint Close Step 3)

The handoff file `/data/conversation-handoff.md` is written at EVERY sprint close (rolling backup).
It uses this standard format. Overwrite the entire file each time (Write, no Read needed):

```markdown
# Conversation Handoff -- Rolling Backup
**Last Session:** S{N}
**Last Sync:** PASS | FAIL
**Conversation:** {C} (S{start}-S{N})
**Date:** YYYY-MM-DD
**Rule versions:** index:S{x}, core:S{x}, content:S{x}, review:S{x}, automation:S{x}, conversation:S{x}

## Quick Recovery
Paste into new v0 chat:
> I'm continuing work on the Component Design Review Dashboard.
> Read /data/conversation-handoff.md for full context, then
> /data/v0-rules-index.md to load the rule system.
> Start with Session {N+1}.

## Last Sprint Summary
{1-2 lines: what was done this session}

## Active Work
{Current task state: what's in progress, what's next, blockers}

## Key Context
{Major rules/patterns established recently that a new session must know}
```

## Conversation Close Protocol

When pressure threshold reached OR user requests handoff:

1. Complete current Sprint Close normally (review-log + project-state + handoff -- all 3 are already written every close)
2. The handoff file is ALREADY current from Step 3 of Sprint Close -- no extra work needed
3. Add "CONVERSATION BOUNDARY: C{N} ended S{X}-S{Y}" to sprintHistory
4. Inform user: "Start a new chat and paste the opening message from the handoff file."

## Emergency Handoff

If a session times out (like S19):
- The NEXT session in ANY conversation should detect incomplete state from:
  - project-state header showing stale session
  - review-log missing entry for last sprintHistory session
- Self-heal: write the missing review-log entry, then continue normally.
- The Review-Before-Continue Gate in core rules already handles this.

## Conversation Health Score

Compute at Sprint Close and log in review-log summary:
- **5/5 (Healthy):** 0 pressure signals, init < 2 ops, no errors
- **4/5 (Good):** 1 signal, minor issues
- **3/5 (Watch):** 2 signals -- recommend new conversation soon
- **2/5 (Pressure):** 3 signals -- require new conversation after current task
- **1/5 (Critical):** Timeouts, repeated redaction, cannot complete init
