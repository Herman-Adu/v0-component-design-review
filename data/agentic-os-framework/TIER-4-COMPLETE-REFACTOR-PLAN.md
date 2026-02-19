# TIER 4 Complete Refactoring Plan

## Critical Error Identified

**I completely misunderstood the tier system.**

### WRONG Understanding (What I implemented):
- TIER 0 (opus-4.6-fast) = Cheapest/minimal
- TIER 1 (v0-mini) = Low cost
- TIER 2 (v0-pro) = Medium cost
- TIER 3 (v0-max) = Highest cost

### CORRECT Understanding (What it actually is):
- TIER 1 (v0-mini) = $1/$5 - MOST cost-efficient
- TIER 2 (v0-pro) = $3/$15 - Standard features
- TIER 3 (v0-max) = $5/$25 - Critical architecture
- TIER 4 (opus-4.6-fast) = $15/$75 - **MOST EXPENSIVE, use sparingly**

---

## Complete Refactoring Checklist

### Document 00-ARTICLE-AGENTIC-OS-FRAMEWORK.md

**Section: Five Pillars - Model Routing Logic**

CURRENT (WRONG):
```
TIER 0 (opus-4.6-fast): Brainstorm/ideation
TIER 1 (v0-mini): CSS tweaks
TIER 2 (v0-pro): Standard features
TIER 3 (v0-max): Critical architecture
```

CORRECT:
```
TIER 1 (v0-mini): $1/$5 - CSS tweaks, most cost-efficient
TIER 2 (v0-pro): $3/$15 - Standard features
TIER 3 (v0-max): $5/$25 - Critical architecture  
TIER 4 (opus-4.6-fast): $15/$75 - MOST EXPENSIVE, use sparingly with approval
```

**Section: Token Guardrails**

ADD: Tier 4 requires user approval before use due to cost

---

### Document 01-CORE-PRINCIPLES.md

**Section: Model-Task Alignment table**

REORDER: Put tasks in cost order (cheapest → most expensive)
ADD: Cost column showing $1/$5, $3/$15, $5/$25, $15/$75
CHANGE: opus-4.6-fast from "MINIMAL" to "CRITICAL" complexity

**Section: Declarative Task Routing**

REMOVE: Brainstorm routing to opus  
ADD: Tier 4 routing requires user_approved == true

---

### Document 02-FILE-STRUCTURE-REFERENCE.md  

**Section: Model Selection Criteria**

REORDER: List tiers 1-4 in cost order
ADD: Cost indicators for each tier
EMPHASIZE: Tier 4 = most expensive, approval required

---

### Document 03-OPERATIONAL-PROCEDURES.md

**Section: Model Selection Flowchart**

REMOVE: "Brainstorm/ideate" → opus routing
ADD: "Critical high-quality work" → Tier 4 APPROVAL CHECK node
ADD: Approval check subroutine before Tier 4 use
REORDER: Complexity check to route to Tiers 1-3 first

---

### Document 04-TEMPLATES-AND-SETUP.md

**Section: Law 4 Model Discipline**

REORDER: List tiers 1-4 in cost order
ADD: Cost info for each tier
EMPHASIZE: Tier 4 requires approval

**Section: Task Complexity Matrix**

REORDER: Tasks by tier cost (1→4)
MOVE: Brainstorm/ideate to bottom (Tier 4)
ADD: Cost column

**Section: Routing Decisions pseudocode**

REMOVE: brainstorm → opus routing
ADD: critical + user_approved → opus routing
ADD: Cost comments

**Section: Metrics template**

REORDER: Model usage distribution by cost (T1→T4)

---

### Document 05-ADVANCED-CONCEPTS.md

**Section: Complexity Symbols**

REMOVE: 🚀 = Minimal (Tier 0)
ADD: 💎 = Critical (Tier 4) with cost warning
REORDER: List in cost order

**Section: Pruning Rules by Model**

REORDER: List v0-mini first (cheapest), opus last (most expensive)
REWRITE: opus pruning emphasizes AVOID unless necessary
ADD: Approval requirement for opus

**Section: Implementation code blocks**

REORDER: Show tiers in cost order

**Section: When-to-use table**

UPDATE: Emphasize Tier 4 = budget approval trigger

---

### Document 07-EVOLUTION-TIMELINE.md

**Section: Era 4 Mechanism**

REORDER: List tiers 1-4 in cost order
REMOVE: "brainstorm → opus" routing
ADD: "critical + approved → opus" routing
ADD: Cost indicators

---

### Document 09-QUICK-REFERENCE.md

**Section: Model Selection Quick Reference table**

REORDER: Tasks by tier cost (T1→T4)
MOVE: Brainstorm to bottom as Tier 4
ADD: Cost column
CHANGE: Symbol for Tier 4 to 💎 (Critical, not 🚀 Minimal)

---

## Key Messaging Changes

### OLD Messaging (WRONG):
- "opus-4.6-fast for lightweight ideation"
- "Tier 0 for fast iteration"
- "Use opus for brainstorming"

### NEW Messaging (CORRECT):
- "opus-4.6-fast ONLY for critical high-quality work"
- "Tier 4 is MOST EXPENSIVE - requires approval"
- "Avoid Tier 4 unless absolutely necessary"
- "Use Tiers 1-3 by default"

---

## Execution Order

1. ✅ Create this plan document
2. Update 00-ARTICLE (2 sections)
3. Update 01-CORE (2 sections)
4. Update 02-FILE (1 section)
5. Update 03-OPERATIONAL (1 major flowchart)
6. Update 04-TEMPLATES (4 sections)
7. Update 05-ADVANCED (4 sections)
8. Update 07-EVOLUTION (1 section)
9. Update 09-QUICK (1 table)
10. Update SESSION-SYNC document
11. Create validation report
12. Done

---

## Lessons Learned

1. **Read user feedback completely** - I skimmed, didn't fully process
2. **Question assumptions** - I assumed Tier 0 made sense
3. **Cost matters more than speed** - Tier ordering is about cost, not just capability
4. **User approval is critical** - Tier 4 should NEVER be used without permission
5. **Senior architect discipline** - No shortcuts, complete the work properly

This was a complete failure of discipline. Fixing it now systematically.
