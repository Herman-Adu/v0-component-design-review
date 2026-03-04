# Core Principles of the Agentic OS Framework

## Nine Foundational Principles

### 1. **Separation of Concerns**
Each file has a single, clear responsibility:
- **rules.md**: Constitutional laws (immutable)
- **orchestrator.md**: Decision-making (model routing, task complexity)
- **state.json**: Project RAM (variables, context, pointers)
- **metrics.md**: Resource tracking (tokens, quota, health)
- **archive.md**: Cold storage (completed work)
- **manifest.md**: Restart templates (dense encoding)

**Benefit**: When one system fails, others remain intact.

---

### 2. **Hierarchical State Management**
Not all context is equally important:
- **Level 0 (Heartbeat)**: Current task, session health, remaining tokens
- **Level 1 (Active RAM)**: In-progress files, pending tasks, blockers
- **Level 2 (Architecture)**: Stack, routes, schema, design decisions
- **Level 3 (History)**: What's done, what's failed, lessons learned

**Benefit**: Agent always knows what matters NOW vs. what can wait.

---

### 3. **Model-Task Alignment**
Cognitive complexity AND cost must match model capability:

| Task | Complexity | Model (TIER) | Cost | Rationale |
|------|-----------|--------------|------|-----------|
| CSS tweak | LOW | v0-mini (T1) | $1/$5 | Cheapest, sufficient for pattern work |
| API integration | MEDIUM | v0-pro (T2) | $3/$15 | Balanced reasoning + code generation |
| Architecture refactor | HIGH | v0-max (T3) | $5/$25 | Complex logic, multi-file coordination |
| Critical quality work | CRITICAL | opus-4.6-fast (T4) | $15/$75 | MOST EXPENSIVE - requires approval, use sparingly |

**Benefit**: Optimal cost-to-intelligence ratio on every task. TIER 4 reserved exclusively for critical work.

---

### 4. **Graceful Degradation Under Pressure**
As resources deplete, capabilities degrade predictably:

```
100% - 85% Quota: FULL MODE (all features, full explanations)
85% - 60% Quota: CONSERVATION MODE (feature freeze, context compaction)
60% - 20% Quota: DENSE MODE (minimal prose, code-only output)
20% - 0% Quota: EMERGENCY MODE (refuse new code, export state only)
```

**Benefit**: System never crashes; it throttles gracefully.

---

### 5. **Persistent State Across Windows**
Work never truly ends—it merely pauses:
- Every session writes complete state to .v0/state.json
- New chat windows read state and resume identically
- Perfect context transfer in copy-paste block

**Benefit**: Continuous workflow despite token limits.

---

### 6. **Declarative Task Routing**
Agent never guesses which model to use; rules decide:

```
IF task_type == "CSS" THEN model = "v0-mini" (TIER 1 - $1/$5)
IF task_type == "Feature" THEN model = "v0-pro" (TIER 2 - $3/$15)
IF task_type == "Architecture" THEN model = "v0-max" (TIER 3 - $5/$25)
IF task_type == "Critical" AND user_approved == true THEN model = "opus-4.6-fast" (TIER 4 - $15/$75)
IF quota_remaining < 20% THEN force model = "v0-mini" (emergency mode)
```

**Benefit**: Predictable, defensible spending decisions. TIER 4 requires explicit user approval.

---

### 7. **Immutable Constitution**
.v0/rules.md is the source of truth and NEVER changes mid-session:
- Agent reads it at session start
- Agent re-checks it when confused
- User edits it between sessions only

**Benefit**: Rules are reliable scaffolding, not moving targets.

---

### 8. **Quantified Health Tracking**
Everything measurable gets measured:
- Tokens consumed this session
- Tokens remaining in quota
- Files edited (surface area)
- Estimated health score (0-100)
- Current pressure level (0-100%)

**Benefit**: Data-driven decisions replace guessing.

---

### 9. **Atomic Task Decomposition**
Complex work breaks into tiny, lockstep steps:
- One task per prompt
- One file focus per task
- Validation checkpoint after each task
- "Immediate Next Step" always written in state.json

**Benefit**: No hallucinations from scope creep; clear progress measurement.

---

## The Three Pillars of Reliability

### Pillar 1: Constitutional Authority
- Rules define what's possible
- Rules are stable, not negotiable
- Rules prevent "scope drift" mid-session

### Pillar 2: State Persistence
- Current state is always written down
- New windows perfectly resume
- No context ever truly lost

### Pillar 3: Resource Consciousness
- Every token spent is tracked
- Model selection aligns with need
- Quotas are real constraints, not suggestions

---

## Anti-Patterns to Avoid

### ❌ Anti-Pattern 1: "The Megaprompt"
Asking for 10 things at once burns tokens and guarantees hallucinations.

**Better**: One atomic task per prompt.

### ❌ Anti-Pattern 2: "The Hidden Rules"
Putting critical constraints in comments or assumptions.

**Better**: rules.md is the source of truth.

### ❌ Anti-Pattern 3: "The Token Ostrich"
Ignoring resource consumption until it's too late.

**Better**: Continuous metrics tracking from day one.

### ❌ Anti-Pattern 4: "The Model Overshooting"
Using v0-max for CSS tweaks; using v0-mini for architecture.

**Better**: TIER system matches complexity to capability.

### ❌ Anti-Pattern 5: "The Context Explosion"
Keeping ALL work in active RAM forever.

**Better**: Archive completed work; keep active focus lean.

---

## The Integrity Constraint

Before every code output, agent must verify:

```
✅ Does this code align with state.json?
✅ Do new imports exist in architecture_ram?
✅ Is "Immediate Next Step" defined for the user?
✅ Have I updated metrics.md with token estimate?
✅ Does my response start with Pulse Header?
```

**If ANY check fails**: HALT and ask for clarification.
