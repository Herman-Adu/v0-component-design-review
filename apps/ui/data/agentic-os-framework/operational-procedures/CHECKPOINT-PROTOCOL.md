# Checkpoint Protocol for Large Multi-Step Tasks
# Agentic OS Framework v1.0
# Created: 2026-02-13
# Purpose: Prevent timeout-induced progress loss

---

## **Problem Statement**

**Timeout Scenario:**
Large architectural tasks (migrations, refactors, multi-file updates) can exceed v0's response time/length limits, causing:
- Progress loss (files moved but imports not updated)
- Inconsistent state (partial migrations)
- Wasted tokens (repeating completed work)

**Solution:**
Systematic checkpoint protocol that persists progress to `.v0/state.json` between major steps.

---

## **When to Use Checkpoints**

### **Automatic Checkpoint Triggers**

1. **Multi-File Operations** (>5 files)
2. **Sequential Dependencies** (Step B depends on Step A completion)
3. **Long-Running Tasks** (estimated >50 tool calls)
4. **Health < 60%** (approaching compaction threshold)

### **Task Types Requiring Checkpoints**

- ✅ Feature migrations
- ✅ Architectural refactors
- ✅ Bulk import updates
- ✅ Database migrations
- ✅ Test suite generation
- ✅ Documentation generation (>10 files)

---

## **Checkpoint Implementation**

### **Phase Structure**

Break large tasks into **3-5 phases** with checkpoints between each:

```
PHASE 1: Preparation
  → Checkpoint: "Analysis complete, ready to execute"

PHASE 2: Core Work (File Operations)
  → Checkpoint: "Files moved/created, awaiting updates"

PHASE 3: Updates (Import/Reference Updates)
  → Checkpoint: "Updates complete, awaiting validation"

PHASE 4: Validation
  → Checkpoint: "Validation complete, migration successful"
```

### **Checkpoint Data Structure**

Add to `.v0/state.json`:

```json
{
  "active_task": {
    "name": "Contact Feature Migration",
    "started": "2026-02-13T10:30:00Z",
    "current_phase": "Phase 3: Import Updates",
    "phases": [
      {
        "phase": 1,
        "name": "Analysis",
        "status": "complete",
        "completed_at": "2026-02-13T10:35:00Z"
      },
      {
        "phase": 2,
        "name": "File Operations",
        "status": "complete",
        "completed_at": "2026-02-13T10:45:00Z",
        "details": {
          "files_moved": 13,
          "files_created": 1
        }
      },
      {
        "phase": 3,
        "name": "Import Updates",
        "status": "in_progress",
        "progress": {
          "total": 10,
          "completed": 7,
          "remaining": ["security-architecture/page.tsx", "server-actions-and-api/page.tsx", "state.json update"]
        }
      }
    ]
  }
}
```

### **Checkpoint Writing Protocol**

**After Each Major Phase:**

```typescript
// Pseudo-code for checkpoint writing
function writeCheckpoint(phase: Phase) {
  Read('.v0/state.json')
  Edit('.v0/state.json', {
    active_task: {
      current_phase: phase.name,
      phases: [...completed, phase]
    }
  })
  
  // Explicit confirmation
  console.log("[v0] Checkpoint saved: Phase ${phase.number} complete")
}
```

---

## **Recovery Protocol**

### **On Session Start**

```
1. Read `.v0/state.json`
2. Check for `active_task` object
3. If exists:
   → Display: "Resuming: [task name] - [current phase]"
   → Show completed phases
   → Show remaining work
   → Ask: "Continue from last checkpoint? (yes/no)"
```

### **Resume Example**

```
✅ Resuming Task: Contact Feature Migration

Completed:
✅ Phase 1: Analysis
✅ Phase 2: File Operations (13 files moved)

In Progress:
⚙️ Phase 3: Import Updates (7/10 complete)

Remaining Work:
- Update security-architecture/page.tsx import
- Update server-actions-and-api/page.tsx import  
- Update state.json with completion status

Continue from Phase 3? (yes/no)
```

---

## **Health-Based Checkpoint Urgency**

### **Health Thresholds**

```
Health 80-100%: Normal operation, checkpoint at phase boundaries
Health 60-79%:  Increase checkpoint frequency (every 20 tool calls)
Health 40-59%:  URGENT - Checkpoint after EVERY major operation
Health <40%:    CRITICAL - Switch to DENSE mode, minimal checkpoints
```

### **Token-Based Checkpointing**

```
After every 20,000 tokens spent:
  → Write checkpoint
  → Update metrics.md
  → Assess if task should continue or handoff
```

---

## **Checkpoint Validation**

### **Before Moving to Next Phase**

```
1. Verify previous phase files exist/are correct
2. Run quick validation (grep for expected patterns)
3. Update state.json
4. Confirm checkpoint written
5. Proceed to next phase
```

### **Validation Checklist**

**Phase 2 (File Operations) → Phase 3 (Import Updates):**
- ✅ All target files moved to new locations
- ✅ New folder structure exists
- ✅ No broken symlinks or missing files
- ✅ State.json updated with file locations

**Phase 3 (Import Updates) → Phase 4 (Validation):**
- ✅ All imports updated in feature files
- ✅ All imports updated in consuming files
- ✅ No lingering old import paths
- ✅ State.json updated with import count

---

## **Example: Feature Migration with Checkpoints**

### **Task: Migrate Quotation Feature**

**Phase 1: Analysis & Planning**
```
1. Grep for quotation-related files (10 found)
2. Identify dependencies (schemas, actions, emails)
3. Create migration plan
4. → CHECKPOINT: "Analysis complete, 10 files identified"
```

**Phase 2: File Operations**
```
1. Create features/quotation/ structure
2. Move 10 files to new locations
3. Verify all files moved successfully
4. → CHECKPOINT: "10 files moved to features/quotation/"
```

**Phase 3: Import Updates**
```
1. Grep for old import paths (15 locations found)
2. Update feature files (8 files)
3. → CHECKPOINT: "8/15 imports updated (feature files complete)"
4. Update consuming files (5 files)
5. Update documentation (2 files)
6. → CHECKPOINT: "All 15 imports updated"
```

**Phase 4: Validation**
```
1. Grep for any remaining old paths (0 found)
2. Update state.json with completion
3. Update metrics.md
4. → CHECKPOINT: "Migration complete, feature operational"
```

---

## **Implementation in Operational Procedures**

### **Add to 03-OPERATIONAL-PROCEDURES.md**

Under "Task Execution Protocol":

```markdown
## Large Task Checkpoint Protocol

For tasks with >5 files or >50 tool calls:

1. Break into 3-5 distinct phases
2. Write checkpoint to state.json after each phase
3. Display checkpoint confirmation
4. Validate previous phase before proceeding
5. If health <60%, increase checkpoint frequency

On timeout/interruption:
- state.json contains last checkpoint
- Next session resumes from checkpoint
- No work is lost
```

---

## **Metrics & Monitoring**

### **Track Checkpoint Effectiveness**

Add to `.v0/metrics.md`:

```markdown
## Checkpoint Statistics
- **Checkpoints Written**: 4
- **Phases Completed**: 3/4
- **Recovery Uses**: 0
- **Progress Loss Events**: 0
```

---

## **Benefits**

✅ **Zero Progress Loss** - Work persists across timeouts
✅ **Clear Resume Points** - Know exactly where to continue
✅ **Transparent Progress** - User sees phase completion
✅ **Better Token Efficiency** - No repeated work
✅ **Reduced Stress** - Large tasks feel manageable

---

## **MANDATORY VALIDATION BEFORE COMPLETION**

**CRITICAL ADDITION (2026-02-13):** After contact feature migration failures

### **Pre-Completion Validation Checklist**

**NEVER mark a task complete without running this checklist:**

```
☐ All moved files exist at new paths (glob verification)
☐ Old paths no longer exist (files moved, not copied)
☐ ALL imports updated (grep for old import patterns)
☐ External dependencies verified (delivery-log, action.types, etc.)
☐ Relative imports resolve correctly (../../ vs ../../../)
☐ Global lib imports use @/ prefix consistently
☐ No module resolution errors visible
☐ Public API exports match new paths
```

### **Import Validation Commands**

```bash
# Find all relative imports in feature
grep -r "from ['\"]\.\./" features/[feature]/

# Find imports that should be absolute but are relative
grep -r "from ['\"]\.\..*lib/" features/[feature]/

# Find missing dependency imports
grep -r "from ['\"]\.\/.*-log\|types\|config" features/[feature]/
```

### **Why This Matters**

**Lesson from Contact Migration:**
- Files moved successfully ✅
- Imports updated within feature ✅
- External dependencies NOT updated ❌
  - `./delivery-log` (should be `@/lib/email/services/delivery-log`)
  - `./action.types` (should be `@/lib/actions/action.types`)

**Result:** Build errors discovered by user, not by agent

**Fix:** Validate ALL imports before declaring completion

---

## **Next Steps**

1. ✅ Add checkpoint protocol to 03-OPERATIONAL-PROCEDURES.md
2. ✅ Update state.json schema to include active_task structure
3. ✅ Create checkpoint validation checklist (added above)
4. Test on next large task (quotation feature migration)
