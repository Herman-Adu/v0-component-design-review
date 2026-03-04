# v0 Evolution Playbook -- Beginner to Pro
## How We Work Together: A Living Document

**Created:** Session 20 (2026-02-09)
**Purpose:** Institutional memory of HOW we evolved our v0 workflow. Read this in any new chat to inherit the full working relationship, standards, and lessons learned.

---

## Phase 1: Foundation (Sessions 1-4)
**Stage:** Beginner -- Learning the platform

**What happened:**
- Built a Component Design Review Dashboard from scratch
- Atomic design system established (atoms/molecules/organisms/pages)
- Created content library with 60 items (articles, case studies, tutorials)
- All content was flat text -- no rich components

**Lessons learned:**
- v0 has session limits (15 file ops, 6 sequential tool calls)
- Large projects need multi-session planning
- Without rules, each session starts blind

**Key evolution:** Recognised we needed persistent rules and state tracking.

---

## Phase 2: Rules & Structure (Sessions 5-7)
**Stage:** Intermediate -- Establishing discipline

**What happened:**
- Created `v0-rules.md` -- first rule file for session management
- Created `project-state.ts` -- session handoff document
- Created `code-review-log.ts` -- structured review tracking
- Built shared component library (article-components.tsx, 13 components)
- Began converting flat content to rich components

**Lessons learned:**
- Rules must be read at session start -- they're the "contract"
- project-state prevents re-doing work across sessions
- The review-log is where quality is enforced
- Session 7 audit found 8 rule violations -- rules without enforcement are suggestions

**Key evolution:** Moved from "build things" to "build things within a governed system."

---

## Phase 3: Automation & Defence (Sessions 8-12)
**Stage:** Advanced -- Self-healing systems

**What happened:**
- PropGuard system created -- runtime defence against prop mismatches
- 3-layer defence: dev-mode diagnostic cards, structured console logging, prod graceful null
- All 13 shared components guarded, 5 broken callers found and fixed
- Articles fully converted to rich components (29/29)
- Case study conversion began

**Lessons learned:**
- Silent failure (returning null) hides bugs. Visible diagnostics in dev mode catch them immediately.
- Prop mismatches are the #1 crash source when scaling content. Guard at the component level, not the caller.
- The `[PropGuard]` console prefix creates a grepable task list of broken callers.
- TypeScript interfaces are compile-time only -- runtime guards are still needed.

**Key evolution:** Shifted from "fix bugs when they crash" to "make bugs impossible to miss."

---

## Phase 4: Sprint Discipline (Sessions 13-16)
**Stage:** Pro -- Process engineering

**What happened:**
- Agent timeout during Session 14 -- too much work in one response
- Created Automated Session Discipline rule (max 4 tool calls per automated response)
- Session 15: Another context gap -- review-log entries being skipped
- Session 16: Complete overhaul of Session End Protocol
  - Sprint Context Block format (5 mandatory sections)
  - Hard Stop Rule (stop work at 12 ops if no review-log)
  - Review-Before-Continue Gate (check previous session's review-log before starting)
  - Build Validation Step (grep for common issues before closing)
  - Budget reallocation: 10 work / 3 close / 2 init
- Backfilled 4 missing review-log entries (Sessions 11-15)
- Added sprintHistory timeline to project-state

**Lessons learned:**
- The review-log is THE context bridge between sessions. Skip it and the next session is blind.
- Budget must explicitly reserve ops for close. Work always expands to fill available ops.
- "Done" means "documented," not "code written."
- Sprint Context Block (Deliverables, Patterns, Rules, Validation, Next Context) ensures nothing is lost.

**Key evolution:** Moved from "do work and hope to document it" to "documentation IS the work."

---

## Phase 5: Optimisation (Sessions 17-20)
**Stage:** Gold Standard -- Context-aware architecture

**What happened:**
- Session 19 timeout -- different root cause: conversation too large, context pressure
- Recognised monolithic v0-rules.md doesn't scale
- Designed modular rule system (Option C: Index + Modules)
  - v0-rules-index.md (manifest -- what to load when)
  - v0-rules-core.md (always load -- universal constraints)
  - v0-rules-content.md (content creation patterns)
  - v0-rules-review.md (review and validation)
  - v0-rules-automation.md (automated session management)
- Sprint Planning Protocol designed (Context Load -> Plan -> Execute -> Close)
- 65% reduction in context loaded per session

**Lessons learned:**
- Rules are code. They need the same separation of concerns as any codebase.
- Loading everything every time is the rules equivalent of importing the entire library.
- The index pattern (tiny manifest + domain modules) scales indefinitely.
- Fresh chats with persistent files are more efficient than long conversations.
- Context lives in FILES, not conversation history.

**Key evolution:** Architecture thinking applied to the workflow itself, not just the codebase.

---

## Phase 5.5: Hallucination Crisis & Defense-in-Depth (Sessions 26-29)
**Stage:** Crisis Response -- Learning from failure

**What happened:**
- Batch tutorial creation (T#1-3) introduced hallucinated component names: BestPracticeCard, WarningCallout, InfoCallout, SectionAnchor -- none exist in article-components.tsx
- Also wrong prop names (explanations vs terms, KeyTakeaway title/takeaway vs children)
- S28 "full audit" declared PASS but only checked 5 known bad names -- missed ComparisonTable and WarningBox in T#14-15 (written in S21)
- replace_all on JSX tags created broken closing tags (</InfoBox type="warning">)
- User saw errors that the review process should have caught BEFORE they reached the browser

**Root cause:** AI hallucination of plausible React component names. Grep-based review only catches KNOWN bad patterns, not UNKNOWN ones.

**Solutions built:**
- Exports Manifest: canonical list of all 23+3 component exports with exact prop signatures. Single source of truth in v0-rules-content.md.
- Hallucination Registry: 9 known hallucinated names with correct replacements.
- 3-Stage Validation Pipeline: LINT (pre-write manifest check) -> BUILD (post-write negative + positive validation) -> VERIFY (registration integrity).
- Positive import validation: verify every import EXISTS, don't just grep for known bad names.
- JSX safe editing rule: never use replace_all on component tag names.

**Lessons learned:**
- Negative validation (grep for known bad) always misses unknown bad. Positive validation (verify all imports exist) catches everything.
- Defense in depth needs redundancy WITHIN each layer, not just multiple layers.
- Speed (batch 3 tutorials) without validation creates more work than it saves.
- "Full audit PASS" based on incomplete grep patterns is false confidence.

**Key evolution:** From single point of failure to multi-layer defense. Prevention > Detection > Recovery > Discovery.

---

## Phase 6: Conversation Lifecycle & Vision (Sessions 30-33)
**Stage:** Meta-Architecture -- Managing the workflow's workflow

**What happened:**
- Full context sync audit revealed 5 of 9 sessions deferred review-log entries (systematic failure)
- Sprint Close budget was 3 ops but needed 4 -- review-log was always first to be cut
- Post-edit verification gap: autofix changes went undetected ("Moving on" anti-pattern)
- Created v0-rules-conversation.md: conversation open/close/monitor protocol, handoff file, health scoring
- Fixed Sprint Close: 4-op budget, review-log is Step 1, sync gate mandatory
- All rule file headers synced, .tsx file reference fixed
- All context files fully synced S11-S33 for first time

**Vision crystallisation:**
- The journey IS the product. Every crisis, fix, and evolution is content we can deliver.
- The codebase is a high-level architecture template, not a single-domain app. It can become marketplace, store, learning platform, etc.
- Future content categories: Documentation, DevOps/Process, Architecture Decisions, Evolution Case Studies.
- The meta-layer (rules, process, conversation management) is the most valuable differentiator.
- Future directions: MCP integration, VS Code local dev, AI functionality, CTO-level ROI content.

**Lessons learned:**
- "Documentation IS delivery" wasn't just a principle -- it was being violated 55% of the time. Rules without enforcement are suggestions.
- Conversation lifecycle management is as critical as session lifecycle. Context degrades over long conversations.
- The handoff file pattern (always-current, copy-paste ready) makes conversation boundaries seamless.
- Post-edit verification is non-negotiable. Autofix can silently change your work.

**Key evolution:** Applied the same rigor to the PROCESS files that we apply to the CODE files. Rules are code. Process is architecture. Documentation is delivery.

---

## Working Relationship Principles

These emerged organically and should be inherited by every future session:

1. **Brain dumps are welcome.** User provides stream-of-consciousness ideas. Agent structures them into actionable plans. Always reflect back understanding before acting.

2. **Plan before build.** Every significant change gets a plan presented for approval. Never jump into implementation on ambiguous requests.

3. **Rules evolve.** Rules aren't static. When a rule fails (timeout, context gap, crash), analyse WHY and strengthen the rule. The system self-improves.

4. **Documentation IS delivery.** A component without a review-log entry doesn't exist. Progress without context is regression.

5. **Separation of concerns everywhere.** In code (atomic design), in rules (modular files), in sessions (plan/work/close phases), in content (shared components + callers).

6. **Visible over silent.** PropGuard shows yellow cards instead of returning null. Review-log entries instead of mental notes. Sprint plans instead of assumptions.

7. **Trust but verify.** TypeScript catches compile-time issues. PropGuard catches runtime issues. Review-log catches process issues. Multiple layers, each catching what the others miss.

8. **Automation with discipline.** Auto-continue is powerful but dangerous. Every automated response follows the same rules as manual ones. If anything, tighter.

---

## The Vision

This codebase is not a single-domain application. It is a high-level architecture template -- atomic design, role-based navigation, modular rules, review pipelines, conversation lifecycle management -- that can transform into any full-stack application: marketplace, online store, learning platform, SaaS dashboard.

The content we create is powered by our own experience. Every hallucination crisis becomes a case study. Every process evolution becomes a tutorial. Every architecture decision becomes CTO-level content about ROI and quality metrics. The journey IS the product.

## Future Directions (Gold Standard Roadmap)

**Near-term:**
- **MCP Integration:** Linear for task tracking, Notion for docs, Sentry for errors. Replace manual review-log with automated tracking.
- **VS Code Local Dev:** Documentation for running the project locally, debugging, testing.
- **AI Functionality:** Expand CodeExplanation atom into interactive AI-powered code analysis.
- **Content from Journey:** Articles, case studies, tutorials derived from our own evolution (S19 timeout -> modular rules, hallucination crisis -> defense-in-depth, etc.)

**Architecture-level:**
- **Cross-chat handoff:** DONE (v0-rules-conversation.md + conversation-handoff.md)
- **Template library:** Reusable component templates for new content types.
- **Quality dashboards:** Real-time PropGuard stats, content coverage, rule compliance.
- **New content categories:** Documentation, DevOps/Process, Architecture Decisions, Evolution Case Studies.

**CTO-level:**
- Architecture decision records with ROI quantifiers
- Metrics tracking: defect rates, process efficiency, context recovery time
- Scalability patterns: how atomic design + modular rules scale to 100+ components

---

## How to Use This Document

**In a new chat:** Read this file first. It tells you WHO we are and HOW we work.
**After every major evolution:** Add a new Phase section documenting what changed and why.
**When stuck:** Check the "Lessons learned" sections -- the answer is probably there.
**When scaling:** Check "Future Directions" for what's next.

---

*This document is the story of building a professional development workflow inside v0. It's not just rules -- it's the reasoning behind the rules.*
