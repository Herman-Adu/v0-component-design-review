# v0 Model Framework & Budget Planner
**Created:** S60 | **Last Updated:** S60 | **Status:** ACTIVE

## 1. Available Models

### v0 Mini
- **Strengths:** Fast responses, low cost, good for mechanical tasks
- **Best for:** Single-file edits, styling changes, copy updates, doc updates, known-pattern work
- **Weaknesses:** Poor reasoning on complex architecture, misses cross-file dependencies, prone to skipping review protocols
- **When NOT to use:** Multi-file refactors, architecture decisions, debugging unknown issues, research tasks
- **Real-world evidence:** S59 -- Used Mini for navbar padding fix (1-line change, perfect). Used Mini for Getting Started page creation (failed -- missed DocPageLayout export error, skipped 3-axis review)

### v0 Pro
- **Strengths:** Better reasoning than Mini, handles multi-file changes, good balance of speed and quality
- **Best for:** Multi-file edits with known patterns, feature implementation with clear requirements, bug fixes requiring 2-5 file changes
- **Weaknesses:** May still miss architectural implications, less thorough than Max on complex analysis
- **When NOT to use:** Full codebase architecture reviews, complex debugging with unknown root cause

### v0 Max
- **Strengths:** Deep reasoning, full codebase awareness, thorough analysis, catches edge cases
- **Best for:** Architecture planning, 3-axis reviews, multi-system refactors, complex debugging, research + synthesis, session management decisions
- **Weaknesses:** Slower, higher cost, overkill for simple edits
- **When NOT to use:** Single-file styling, copy changes, mechanical pattern repetition
- **Real-world evidence:** S58 -- Used Max-level reasoning for emergency recovery (marketing folder, Biome regression, sandbox layers). S59 -- Session management architecture design required Max reasoning.

### Opus 4.6 Fast
- **Strengths:** Speed, good for rapid iteration, strong general reasoning
- **Best for:** Quick prototyping, rapid iteration cycles, when speed matters more than deep codebase knowledge
- **Weaknesses:** Less v0-platform-aware than native v0 models, may not follow v0-specific patterns as naturally
- **When NOT to use:** v0-specific tooling issues, sandbox debugging, rule system management

---

## 2. Decision Matrix

| Task Type | Model | Why |
|-----------|-------|-----|
| Single-file edit (styling, copy, docs) | **Mini** | Mechanical, known pattern, low risk |
| Single component creation (known pattern) | **Mini** | Template work, follow existing examples |
| Multi-file feature (2-5 files, clear spec) | **Pro** | Needs cross-file awareness, moderate reasoning |
| Bug fix (known reproduction, clear scope) | **Mini** | Targeted fix, low complexity |
| Bug fix (unknown cause, needs investigation) | **Max** | Requires systematic search + reasoning |
| Architecture planning / design decisions | **Max** | Deep reasoning, tradeoff analysis |
| 3-axis code review | **Max** | Thorough analysis across code quality, security, architecture |
| Session management (close, handoff, sync) | **Mini** | Mechanical file updates, known protocol |
| Research + synthesis (new frameworks, docs) | **Max** | Complex reasoning, information synthesis |
| Rapid prototyping / quick iteration | **Opus 4.6 Fast** | Speed over depth |
| Rule system / meta-architecture | **Max** | Self-referential reasoning, high stakes |
| DocPage migration (known wrapper pattern) | **Mini** | Repetitive, template-based |
| Nav/manifest updates | **Mini** | Mechanical data entry |
| New page creation (custom content) | **Pro** | Needs content reasoning + code quality |
| Emergency recovery / debugging platform issues | **Max** | Unknown scope, layered problems |

---

## 3. Session Budget Planner

### Op Budget by Model (15 ops per session)

| Phase | Mini Allocation | Pro Allocation | Max Allocation |
|-------|----------------|----------------|----------------|
| Boot (read handoff) | 1 op | 1 op | 1 op |
| Context gathering | 1-2 ops | 2-3 ops | 2-4 ops |
| Work execution | 8-10 ops | 7-9 ops | 5-8 ops |
| 3-axis review | 1 op | 1-2 ops | 2-3 ops |
| Session close (handoff update) | 1-2 ops | 1-2 ops | 1-2 ops |
| **Buffer (safety)** | **1-3 ops** | **1-3 ops** | **1-3 ops** |

### Token Budget (Chat Window)

| Threshold | Status | Action |
|-----------|--------|--------|
| 0-20k tokens | GREEN | Full capacity, proceed normally |
| 20-40k tokens | YELLOW | Monitor, avoid unnecessary reads |
| 40-60k tokens | AMBER | Wrap up current work, plan session close |
| 60-80k tokens | RED | Complete current task ONLY, then close |
| 80k+ tokens | CRITICAL | Stop new work. Close session immediately |

### Auto-Trigger Rules

| Condition | Action |
|-----------|--------|
| Ops remaining < 3 AND work complete | Recommend session close |
| Ops remaining < 2 | FORCE session close (handoff only) |
| Chat tokens > 60k | Recommend session close |
| Chat tokens > 80k | FORCE session close after current task |
| Both ops < 3 AND tokens > 60k | FORCE immediate close, no negotiation |
| Work completed cleanly (natural stopping point) | Offer: continue or close? |

---

## 4. Mandatory Response Protocol

Every response MUST start with:

```
S[N] | ops: [used]/15 | chat: ~[X]k tokens | model: [MINI/PRO/MAX/OPUS] | Status: [STATE]
```

States:
- **FRESH** -- New session, full budget
- **ACTIVE** -- Work in progress
- **AMBER** -- Resources getting low (ops < 5 OR tokens > 40k)
- **RED** -- Must close soon (ops < 3 OR tokens > 60k)
- **CLOSING** -- Running close protocol

---

## 5. Model Switch Protocol

Before ANY work request, assess and recommend:

1. Read the task description
2. Match against Decision Matrix (Section 2)
3. State: "Recommended model: [X] because [reason]"
4. Wait for user confirmation before proceeding
5. If already on correct model, state: "Current model ([X]) is correct for this task"

**Never start work without confirming model selection.**

---

## 6. Pre-Work Checklist (Mandatory, Every Request)

- [ ] Chat window size acceptable? (Check token threshold)
- [ ] Op budget allows full work + review + close? (Min 6 ops needed)
- [ ] Correct model selected for task type?
- [ ] Can I load necessary context with remaining ops?
- [ ] If ANY check fails: Recommend session close or model switch FIRST

---

## 7. Post-Work Checklist (Mandatory, Every Deliverable)

- [ ] 3-axis review completed (Code Quality, Security, Architecture)?
- [ ] Build verification (dev server 200 status, no TypeScript errors)?
- [ ] Visual verification (page renders, no broken imports)?
- [ ] All imports verified against actual exports?
- [ ] Session state updated (ops count, token estimate)?
- [ ] Decide: Continue work OR recommend session close?

---

## 8. MCP Integration Strategy (Sketch)

### What MCPs Add
MCPs (Model Context Protocols) extend v0 with external tool access:
- **Linear**: Issue tracking, sprint management
- **Notion**: Documentation, knowledge bases
- **Sentry**: Error monitoring, debugging
- **GitHub**: PR reviews, code analysis
- **Context7**: Up-to-date library documentation

### Budget Impact
- Each MCP call = 1 op equivalent
- MCP responses consume token budget (variable, 500-2000 tokens per call)
- Factor MCP usage into session planning

### Model Pairing
| MCP | Best Model | Why |
|-----|-----------|-----|
| Linear (issue tracking) | Mini | Mechanical: create/update issues |
| Notion (docs) | Pro | Content creation needs moderate reasoning |
| Sentry (debugging) | Max | Error analysis needs deep reasoning |
| GitHub (PRs) | Max | Code review needs thorough analysis |
| Context7 (library docs) | Pro | Research + implementation |

### When to Introduce MCPs
- AFTER model framework is stable and tested (S61+)
- ONE MCP at a time (measure budget impact)
- Start with highest value: Linear or GitHub

---

## 9. Content Opportunity Tracking

This framework itself is gold-standard content:
- **Tutorial**: "From Chaos to Gold Standard: Setting Up v0 Dev for Production"
- **Guide**: "v0 Model Selection: When to Use Mini, Pro, Max, and Opus"
- **Case Study**: "How We Reduced Session Boot Cost by 85% (7 ops to 1 op)"
- **Technical**: "Managing AI Agent Sessions: Budget, Tokens, and Handoffs"

Track in handoff under CONTENT OPPORTUNITIES section.
