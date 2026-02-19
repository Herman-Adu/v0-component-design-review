# v0 Rules Index
## Modular Rule System -- Load Only What You Need

**Last modified:** Session 53 (2026-02-10) -- Added Next.js/React module. Brainstorming added to Review. 9 modules total.
**Purpose:** Manifest of all rule modules. Read this FIRST at session start to determine which modules to load.

---

## Context Files (read project-state.ts EVERY session)

| File | Purpose | When to Read |
|------|---------|-------------|
| `data/project-state.ts` | Progress tracking, sprintHistory, counts | EVERY session (init) |
| `data/code-review-log.ts` (last entry) | Previous sprint context, pending items | EVERY session (init, offset to tail) |
| `data/v0-evolution-playbook.md` | Working relationship, lessons, principles | First session in a new chat ONLY |
| `data/conversation-handoff.md` | Handoff context from previous conversation | First session in a new chat ONLY |

## Rule Modules

### Always Load
| Module | File | Lines | Contains |
|--------|------|-------|----------|
| Core | `data/v0-rules-core.md` | ~95 | Session budget, start/end protocol, tarball protection, timeout limits, file safety, self-management |

### Load When Needed
| Module | File | Lines | Load When |
|--------|------|-------|-----------|
| Content | `data/v0-rules-content.md` | ~100 | Creating articles, case studies, tutorials, guides, or any content components |
| Review | `data/v0-rules-review.md` | ~115 | Running 3-axis review, audit, validation. Includes Verification Gate + Brainstorming |
| Debugging | `data/v0-rules-debugging.md` | ~90 | Any bug, error, or unexpected behavior. Load BEFORE proposing fixes |
| Next.js/React | `data/v0-rules-nextjs.md` | ~99 | Building or reviewing Next.js pages, components, or API routes. Always load during DocPage migration |
| UI Audit | `data/v0-rules-ui-audit.md` | ~100 | Building or reviewing UI pages. Quality gate for migration batches |
| Automation | `data/v0-rules-automation.md` | ~40 | Auto-continuing work without user intervention |
| Conversation | `data/v0-rules-conversation.md` | ~90 | First session of new chat, or when pressure signals trigger |

## Sprint Planning Protocol

At session start, AFTER reading project-state + last review-log entry:

1. **Context Review** (0 ops -- reasoning only): What did last sprint deliver? What's pending?
2. **Module Selection**: Based on the task, which rule modules do I need? Load them.
3. **Budget Calculation**: `Available = 15 - init_cost - 3 (close) = work_budget`. State it.
4. **Sprint Scope**: Exactly what this session will do, in what order, with ops per item.
5. **Risk Assessment**: What could cause timeout or violation? How to avoid it?

State the plan BEFORE any work tool call. This costs 0 ops but prevents every class of error.

## Quick Reference: Budget Formula

```
Total ops:     15
Init cost:     2   (project-state + core rules + module reads)
Close cost:    3   (review-log + project-state combined edit + receipt)
Work budget:   10
Per component: 2   (1 write + 1 registration edit)
Max new items: 5   per session (theoretical max)
Safe target:   2-3 per session (with margin for reviews)
```

## Adding New Modules

1. Create `data/v0-rules-{domain}.md`
2. Add to the "Load When Needed" table above
3. Add "Last modified: Session N" header to the new file
4. Keep each module under 60 lines -- if it grows past that, split it
