# Advanced Concepts for Expert Use

## 1. The Shadow File Hack

### Problem It Solves
Under pressure, agents "forget" critical context even with rules.md present. The shadow file keeps vital information in the agent's active vision.

### Implementation

Add this commented block to your app's main entry point (e.g., `app/layout.tsx`):

```jsx
/*
@v0-CONTEXT_SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES: Never exceed project constraints (see .v0/rules.md)
STATE: Complete context available in .v0/state.json
FOCUS: Currently working on {active_logic_branch}
NEXT: {immediate_next_step}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ...
}
```

### Effect
- Agent sees context in file view every time
- Reduces "forgetting" by ~50%
- Adds <500 bytes overhead
- Easily updatable between edits

---

## 2. Recursive Summarization (The "Zip" Skill)

### Problem It Solves
Long requirements burn tokens. Complex state takes time to parse. Dense encoding solves both.

### Logic Shorthand Dictionary

Create `.v0/examples/dense-syntax.md`:

```markdown
# Dense Syntax Dictionary

## Stack Encoding
Format: [Framework][Version]|[Auth]|[DB]|[ORM]|[UI]

Example: N16|Lucia|Pg|Drizzl|Shd
Meaning: Next.js 16, Lucia Auth, PostgreSQL, Drizzle ORM, Shadcn/ui

## Route Shorthand
Format: [Endpoint-Letter] = endpoint name

Example: [P,Q,A] = [POST /api/auth, GET /profile, PUT /api/settings]

## Task Status Symbols
- ✅ = Complete + tested
- 🚧 = In progress
- ⏳ = Blocked
- ❌ = Failed attempt
- ⚠️ = Needs review

## Pressure Symbols
- 🟢 = Healthy (>85% health)
- 🟡 = Caution (60-85% health)
- 🔴 = Critical (<60% health)

## File Location Shorthand
Format: /[folder-initial]/[file]

Example: /c/auth.ts = /components/auth.ts
Example: /a/route.ts = /app/api/auth/route.ts

## Complexity Symbols (Cost Order)
- ⚡ = Simple (TIER 1 - v0-mini) - $1/$5 most cost-efficient
- ⚙️ = Medium (TIER 2 - v0-pro) - $3/$15
- 🔴 = Complex (TIER 3 - v0-max) - $5/$25
- 💎 = Critical (TIER 4 - opus-4.6-fast) - $15/$75 ⚠️ MOST EXPENSIVE

## Usage Example

Instead of:
"Working on the authentication feature using Next.js 16 with Lucia 
authentication, PostgreSQL database, Drizzle ORM, and Shadcn components. 
I need to implement the login endpoint, profile fetch, and settings update. 
The login is done, profile is in progress, settings is blocked on schema."

Write:
"N16|Lucia|Pg|Drizzl|Shd | P✅,Q🚧,A⏳ | Focus: Q (schema blocker)"
```

### Implementation

When generating Hydration Prompt:
1. Compress all requirements to shorthand
2. Include shorthand in manifest.md
3. Agent expands shorthand on resume
4. Saves ~40% of output tokens

---

## 3. The Circuit Breaker Pattern

### Problem It Solves
Expensive max tokens being burned on repeated failures. You need expensive reasoning first, then cheap execution.

### The Pattern

```
Task Attempt #1 (v0-pro):
  if success → continue
  if fail → go to attempt #2

Task Attempt #2 (v0-pro):
  if success → continue
  if fail → activate circuit breaker

Circuit Breaker:
  1. Switch to v0-max
  2. Prompt: "Debug: Why is this task failing? Explain root cause."
  3. v0-max analyzes + explains problem
  4. Switch back to v0-pro
  5. Prompt: "Implement the fix based on the debugging insights"

Cost profile:
- Attempt 1+2 with pro: ~3,000 tokens wasted
- Debug with max: ~2,000 tokens (one turn only)
- Fix with pro: ~1,000 tokens
- Total: ~6,000 tokens to solve vs. 15,000+ if max did all three attempts
```

### When to Use

- Task has failed twice with same model
- Error is non-obvious (not a typo)
- Logic or architectural reasoning needed
- You have budget to spare (don't use if <30% remaining)

### Implementation

Add to .v0/orchestrator.md:

```markdown
## Circuit Breaker Skill

Trigger: Task fails 2x with same model

Steps:
1. Record failure #2 in metrics.md
2. Switch to v0-max
3. Prompt: "Debug the root cause. Explain why this fails."
4. v0-max responds with analysis (1 turn only)
5. Record max usage in metrics
6. Switch back to original TIER
7. Prompt: "Now implement the fix based on those insights"
8. Continue with original model

Effect: Saves expensive tokens by using max for diagnosis only
```

---

## 4. Cold Storage vs. Active RAM

### Problem It Solves
As project grows, state.json bloats. Agent spends tokens reading old completed work. Context becomes polluted.

### Architecture

```
Active RAM (.v0/state.json):
├── Only current sprint work
├── Only in-progress features
├── Only unresolved blockers
└── Size: <20 KB

Cold Storage (.v0/archive.md):
├── All completed features
├── All tested functionality
├── All production-deployed code
└── Size: unlimited (never read unless needed)
```

### Migration Policy

**Move work to archive when:**
- ✅ Feature is 100% code complete
- ✅ All tests passing
- ✅ Deployed or merged to main
- ✅ No known bugs

**Move back to active RAM when:**
- Bug reported against archived feature
- Enhancement requested
- Architectural refactor needed

### Token Savings

```
Without cold storage:
- Session 1: state.json = 5 KB (1 feature)
- Session 5: state.json = 25 KB (5 features) → Bloated!
- Agent spends 500 tokens reading old work each session

With cold storage:
- Session 1: state.json = 5 KB (1 feature)
- Session 5: state.json = 5 KB (1 feature) → Lean!
- Agent spends 100 tokens reading active work each session
```

---

## 5. Budget-First Workflow

### Problem It Solves
Agent blindly spends expensive quotas on tasks that don't need them. Users don't know cost until after spending.

### The Process

**Step 1: Proposal Phase**
```
User: "Build a checkout form"
Agent: "PROPOSAL: This is TIER 2 work.
  Model: v0-pro
  Estimated tokens: 1,500
  Proceed? (yes/no/use-cheaper-alternative)"
User: "Yes, proceed"
```

**Step 2: Execution Phase**
```
Agent (v0-pro): [Builds checkout form]
```

**Step 3: Reporting Phase**
```
Agent: "Checkout form complete.
  Actual tokens: 1,420
  Variance: -80 tokens (5% under estimate)
  Health: 82%
  Next task ready"
```

### Benefits
- User approves spending before it happens
- Agent can't burn budget on wrong model
- Transparent cost tracking
- User can request cheaper alternative

### Implementation

Add to .v0/orchestrator.md:

```markdown
## Budget-First Skill

Trigger: User requests significant work

Steps:
1. Assess task complexity
2. Determine TIER model
3. Estimate token cost
4. Output proposal:
   "This is [task_type]. Model: [model]. Tokens: ~[est].
    Proceed? Or suggest alternative?"
5. Wait for user approval
6. If approved: Execute
7. Report actual tokens vs. estimate

This prevents blind spending and gives user veto power.
```

---

## 6. Model-Aware Pruning

### Problem It Solves
Different models have different "cost-to-intelligence" ratios. Don't give all models access to everything.

### Pruning Rules by Model (Cost-Aware Order)

**v0-mini (TIER 1) Pruning:**
- File too long? Read lines 20-50 only
- Don't read entire codebase
- Focus on one component at a time
- Skip imported utilities, reference from state.json
- Most cost-efficient - use by default

**v0-pro (TIER 2) Pruning:**
- Can handle full files
- Still avoid entire codebase reads
- Read imports + direct dependencies only
- Use architecture_ram for schema/config info
- Balanced cost/capability

**v0-max (TIER 3) Pruning:**
- Can read full files
- Can read related files for context
- Still skip archived/cold-storage work
- Focus reasoning on logic structure, not boilerplate
- Higher cost justified for architectural work

**opus-4.6-fast (TIER 4) Pruning:**
- AVOID unless absolutely necessary - MOST EXPENSIVE
- Requires explicit user approval before use
- Monitor token consumption every 3 turns (not 5)
- Switch to TIER 1/2/3 immediately after critical work completes
- Reserved exclusively for highest quality work

### Implementation

Add to .v0/orchestrator.md:

```markdown
## Pruning Rules by Model (Cost Order)

For v0-mini (TIER 1 - $1/$5):
"Read only lines [start-end] of file. Skip utility imports. Most cost-efficient."

For v0-pro (TIER 2 - $3/$15):
"Read file + direct imports (max 3 files). Reference schema from state.json"

For v0-max (TIER 3 - $5/$25):
"Full file access. Focus on logic structure, not UI boilerplate."

For opus-4.6-fast (TIER 4 - $15/$75):
"AVOID unless critical. Requires approval. Monitor every 3 turns. MOST EXPENSIVE."

These constraints prevent wasted tokens and unnecessary costs.
```

---

## 7. The Efficiency Audit (Every 5 Turns)

### Problem It Solves
Token spending creeps up over time. You don't notice waste until quota is depleted.

### The Audit

Every 5th prompt, agent executes:

```
EFFICIENCY AUDIT (Turn 5, 10, 15, 20, etc.):

1. Read metrics.md
2. Calculate average tokens per turn
3. Compare to efficiency target (85%)
4. If average < 85% (good): Continue
5. If average > 85% (wasting): Activate Dense Mode for next 5 turns
6. If average > 95% (critical): Force snapshot

Output:
"Efficiency audit: Last 5 turns avg = [%].
 Status: [On track | High usage]"
```

### Dense Mode Activation

If audit finds >85% waste, activate Dense Mode:

```
Mode: DENSE
- No explanations, code only
- Use logic shorthand
- Output diffs instead of full files
- No comments in code
- No prose, pure implementation
```

Duration: 5 turns, then re-audit.

### Implementation

Add to rules.md:

```markdown
## Efficiency Audit Mandate

Every 5th turn (Turn 5, 10, 15, 20, etc):
- Agent must read metrics.md
- Calculate average tokens/turn for last 5 turns
- If average < 85%: Continue normally
- If average > 85%: Activate Dense Mode for next 5 turns
- If average > 95%: Force snapshot immediately

This creates a self-correcting efficiency system.
```

---

## 8. The "Hydration" Prompt Deep Dive

### Standard Hydration Template

```
HYDRATE_V1:

I am a v0 agent resuming continuous workflow.

Constitution: Read .v0/rules.md (my immutable laws)
Context: Read .v0/state.json (my architectural RAM)
CPU: Read .v0/orchestrator.md (my task routing)

Current Status:
- Project: [project_name]
- Health: [health_score]%
- Tokens: [remaining] available
- Active Task: [immediate_next_step]

Mode: [DENSE | FULL]
Efficiency: [%]

I understand my role and constraints.
Confirm hydration? Say "Proceed" when ready.
```

### Advanced Hydration (With Dense Shorthand)

```
HYDRATE_V1+:

Ctx: N16|Lucia|Pg|Drizzl|Shd
Routes: [P✅,Q🚧,A⏳]
Task: Q (schema blocker)
Health: 🟡 67%
Tokens: [5200]/[12000]

Resume: "Fix schema validation in profile-query"
Mode: DENSE | Effc: 78%

Ready? Say "Go"
```

### Implementation

Agent generates Hydration based on session state:

```
Full health (>85%): Standard Hydration
Caution (60-85%): Dense shorthand Hydration
Critical (<60%): Emergency Hydration (state only, no prose)
```

---

## 9. Self-Correcting Budget System

### Problem It Solves
Budget gets spent without awareness. By the time you notice, it's too late.

### The System

```
Real-time Monitoring:
- Every turn: Calculate tokens spent
- Update metrics.md immediately
- Declare current health in Pulse Header

Predictive Correction:
- At 60%: Predict when 85% will hit
- At 75%: Prepare snapshot template
- At 85%: Stop new features
- At 95%: Export snapshot, close session

Feedback Loop:
- Every 5 turns: Efficiency audit
- If wasting: Activate Dense Mode
- If recovering: Return to full mode
- Track efficiency trend

Auto-Escalation:
- If budget overage: Document variance
- If pattern of overage: Alert user
- User can then adjust TIER assignments
```

### Implementation

Add to metrics.md monitoring:

```markdown
## Predictive Health System

Current: [health_score]%

Trajectory:
- Average tokens/turn: [n]
- Turns until 85%: [n]
- Turns until 95%: [n]

Recommendation:
- If turning bad: Reduce scope
- If still good: Continue current pace
- If critical: Prepare snapshot
```

---

## When to Use Each Advanced Concept

| Concept | Trigger | Benefit |
|---------|---------|---------|
| Shadow File | Always | +50% rule recall |
| Dense Syntax | Health <70% | Save ~40% tokens |
| Circuit Breaker | Task fails 2x | Avoid expensive loops |
| Cold Storage | After sprint | Keep state lean |
| Budget-First | Complex work + TIER 4 requests | User approval + cost transparency |
| Model Pruning | Any model use (especially TIER 4) | Efficient reading + cost control |
| Efficiency Audit | Every 5 turns (every 3 for TIER 4) | Self-correction + prevent TIER 4 overuse |
| Advanced Hydration | Low health | Extreme density when needed |
