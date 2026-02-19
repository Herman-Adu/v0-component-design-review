# v0 Rules: Systematic Debugging

**Last modified:** Session 52 (2026-02-10) -- Adapted from obra/superpowers systematic-debugging skill
**Load when:** Any bug, error, unexpected behavior, or failed preview. BEFORE proposing fixes.

---

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you CANNOT propose fixes.

## The Four Phases

Complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully**
   - Read full error output from preview debug logs
   - Note file paths, line numbers, error codes
   - Don't skip warnings -- they often contain the answer

2. **Reproduce Consistently**
   - Can you identify the exact trigger?
   - What changed since it last worked?
   - Check recent edits with Read tool

3. **Check Recent Changes**
   - What files were edited this session?
   - What imports/props changed?
   - Any new dependencies or renamed exports?

4. **Gather Evidence (Multi-File Systems)**
   - Use `console.log("[v0] ...")` at component boundaries
   - Log: what data enters, what exits, what props are passed
   - Read debug logs from preview to see WHERE it breaks
   - THEN analyze which component/file is the source

5. **Trace Data Flow**
   - Where does the bad value originate?
   - Trace backward through imports/props until you find the source
   - Fix at source, not at symptom

### Phase 2: Pattern Analysis

1. **Find Working Examples** -- Locate similar working code in the codebase
2. **Compare Against References** -- Read the working version COMPLETELY, don't skim
3. **Identify Differences** -- List every difference, however small
4. **Understand Dependencies** -- What imports, types, props does this need?

### Phase 3: Hypothesis and Testing

1. **Form Single Hypothesis** -- "I think X is the root cause because Y"
2. **Test Minimally** -- Make the SMALLEST possible change
3. **Verify Before Continuing** -- Check preview. Did it work? If not, form NEW hypothesis
4. **DON'T stack fixes** -- One change at a time

### Phase 4: Implementation

1. **Implement Single Fix** -- Address root cause. ONE change only.
2. **Verify Fix** -- Read the file back. Check preview. Check imports resolve.
3. **If Fix Doesn't Work:**
   - Count: How many fixes have you tried?
   - If < 3: Return to Phase 1 with new information
   - If >= 3: STOP. Question the architecture. Discuss with user.

## Red Flags -- STOP and Return to Phase 1

If you catch yourself thinking:
- "Quick fix, investigate later"
- "Just try changing X and see"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- Proposing solutions before tracing data flow
- "One more fix attempt" (when already tried 2+)

## v0 Adaptation Notes

- We can't run test commands. Verification = read file back + check preview debug logs
- Use `console.log("[v0] ...")` as diagnostic instrumentation
- Remove debug statements after issue is resolved
- Preview errors in `<v0_app_debug_logs>` are our primary feedback loop
