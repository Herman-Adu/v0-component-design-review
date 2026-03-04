# v0 Rules: Automation Module
**Last modified:** Session 30 (2026-02-09) -- Batch Protocol added S26, headers synced S30
**Load when:** Auto-continuing work without user intervention

---

## Automated Session Discipline (PREVENTS TIMEOUT)

When auto-continuing without user intervention:
1. Each response does ONE unit of work: 1 component write OR 1-2 registration edits -- NEVER both
2. Max 4 tool calls per automated response (not 6) -- tighter limits
3. Summarise after each response, continue in the NEXT response
4. Plan BEFORE acting: "This response: [action]. Next response: [action]."
5. If unsure whether a task fits in one response, split it
6. Large writes (300+ lines) count as 2 tool calls of processing time
7. NEVER combine component creation + registration in one response

## Automation Response Pattern

Follow this cycle:
- **Response A:** Create component file (1 write)
- **Response B:** Register it (1 read + 1-2 edits)
- **Response C:** Sprint Close OR next component

## Sprint Close During Automation

- Follows the SAME Sprint Close Protocol from core rules
- Sprint Context Block in review-log is NON-NEGOTIABLE
- If budget is tight, drop the next component -- NEVER drop the review-log
- The review-log is the context bridge. Without it the next session is blind.

## Batch Operations Protocol

When doing repetitive identical work (same pattern, different data):
1. Read source data in ranges (not individual greps) to plan 3 items at once
2. Write up to 3 components per session (3 writes)
3. Register ALL items in each slug page edit: combine imports + mappings in a single edit
4. CRITICAL: When batching registrations, ALWAYS include BOTH the import AND the slug mapping in the same edit. Never split import from mapping across edits.
5. Budget per batch session: 1 init + 1 data read + 3 writes + 1 slug read + 2 slug edits + 3 close = 12/15
6. Max batch size: 3 items per session (2 in first edit, 1 in second edit)

## Context Pressure
See `v0-rules-conversation.md` for conversation lifecycle management, handoff protocol, and context pressure monitoring.
