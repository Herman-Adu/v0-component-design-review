/**
 * Code Review Log
 * ===============
 * Living record of all code reviews, findings, and remediations.
 * Used for developer training, onboarding, and audit trail.
 * Reconstructed in Session 42 after accidental deletion in S41.
 * SprintHistory in project-state.ts served as the recovery source.
 */

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

export type Severity = "critical" | "high" | "medium" | "low";
export type FindingStatus = "resolved" | "open" | "deferred" | "wont-fix";
export type ReviewCategory = "code-quality" | "security" | "architecture" | "infrastructure";

export interface Finding {
  id: string;
  category: ReviewCategory;
  severity: Severity;
  title: string;
  description: string;
  location: string[];
  status: FindingStatus;
  resolvedIn?: string;
  resolution?: string;
}

export interface ReviewEntry {
  id: string;
  date: string;
  reviewer?: string;
  scope: string;
  sessionRange?: string;
  summary: string;
  findings: Finding[];
  metrics: {
    filesScanned: number;
    criticalFindings: number;
    highFindings: number;
    mediumFindings: number;
    lowFindings: number;
    resolved: number;
    open: number;
  };
}

// ---------------------------------------------------------------------------
// Review Log Data
// ---------------------------------------------------------------------------

export const REVIEW_LOG: ReviewEntry[] = [
  // =========================================================================
  // Conversation 1 Reviews (S2-S22)
  // =========================================================================
  {
    id: "review-001",
    date: "2026-02-08",
    reviewer: "v0",
    scope: "Initial 3-axis review of component library and content system.",
    summary: "First comprehensive review across architecture, security, and code quality axes. Established baseline for all subsequent reviews. 52 components, 7 security layers audited.",
    findings: [],
    metrics: { filesScanned: 52, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "review-007-rules-enforcement",
    date: "2026-02-08",
    scope: "S7: Rules enforcement audit. Fixed 8 rule violations.",
    sessionRange: "Session 7",
    summary: "Audit found 8 rule violations across session management, content conversion, and review processes. All fixed. Rules strengthened.",
    findings: [
      {
        id: "R7-001",
        category: "code-quality",
        severity: "high",
        title: "8 rule violations found across session management",
        description: "Various rule violations in session ops counting, content conversion processes, and review steps.",
        location: ["data/v0-rules.md"],
        status: "resolved",
        resolution: "All 8 violations fixed. Rules strengthened to prevent recurrence.",
      },
    ],
    metrics: { filesScanned: 15, criticalFindings: 0, highFindings: 1, mediumFindings: 0, lowFindings: 0, resolved: 1, open: 0 },
  },
  {
    id: "review-009-3axis",
    date: "2026-02-08",
    reviewer: "v0",
    scope: "S9: 3-axis review PASS. All 29 articles COMPLETE.",
    sessionRange: "Session 9",
    summary: "Full 3-axis review (architecture, security, code quality). Article #24 (CMS Content) rich component created. All 29 articles confirmed complete with rich components.",
    findings: [],
    metrics: { filesScanned: 29, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "review-009-hotfix",
    date: "2026-02-08",
    scope: "S9-hotfix: Emergency fix for broken DecisionTree callers.",
    sessionRange: "Session 9",
    summary: "Hotfix for DecisionTree component callers that broke after PropGuard was applied. 3 callers fixed.",
    findings: [
      {
        id: "R9H-001",
        category: "code-quality",
        severity: "critical",
        title: "DecisionTree callers broken after PropGuard",
        description: "PropGuard changed DecisionTree's API surface, breaking 3 existing callers.",
        location: ["components/"],
        status: "resolved",
        resolution: "All 3 broken callers updated to match new PropGuard-protected API.",
      },
    ],
    metrics: { filesScanned: 5, criticalFindings: 1, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 1, open: 0 },
  },
  {
    id: "review-010-propguard",
    date: "2026-02-08",
    scope: "S10-11: PropGuard utility created. All 13 components guarded.",
    sessionRange: "Sessions 10-11",
    summary: "PropGuard defensive props system created and applied to all 13 article-components. Remaining 2 DecisionTree callers fixed in S12. Defensive Props Standard rule added.",
    findings: [],
    metrics: { filesScanned: 13, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },

  // =========================================================================
  // Content Conversion Sessions (S13-S18)
  // =========================================================================
  {
    id: "session-13-15-case-studies",
    date: "2026-02-08",
    scope: "S13-15: CS #12-16 created. CS #14 registration delayed by timeout.",
    sessionRange: "Sessions 13-15",
    summary: "Case studies #12 (Rate Limiting), #13 (Sidebar Refactor), #14 (Tarball Build Failure), #15 and #16 created. CS #14 timed out before registration -- led to automation rule creation in S15.",
    findings: [
      {
        id: "S14-001",
        category: "architecture",
        severity: "medium",
        title: "CS #14 created but not registered due to timeout",
        description: "Session timed out before slug page registration could be completed.",
        location: ["components/case-studies/tarball-build-failure.tsx"],
        status: "resolved",
        resolvedIn: "Session 15",
        resolution: "Registered in S15. Automation rule added to prevent future registration gaps.",
      },
    ],
    metrics: { filesScanned: 10, criticalFindings: 0, highFindings: 0, mediumFindings: 1, lowFindings: 0, resolved: 1, open: 0 },
  },
  {
    id: "session-16-backfill",
    date: "2026-02-09",
    scope: "Session 16: Sprint Close Protocol strengthened. Backfilled S11-S15 review-log gap.",
    sessionRange: "Session 16",
    summary: "Sprint Close Protocol strengthened after discovering review-log entries were being skipped. Backfilled all missing entries for sessions 11-15. Rules updated to make review-log Step 1 of close.",
    findings: [
      {
        id: "S16-001",
        category: "architecture",
        severity: "high",
        title: "Review-log entries skipped for S11-S15",
        description: "5 sessions of review-log entries were missing. Sprint Close was not enforcing review-log writes.",
        location: ["data/code-review-log.ts"],
        status: "resolved",
        resolution: "All 5 sessions backfilled. Sprint Close Protocol updated: review-log is now Step 1.",
      },
    ],
    metrics: { filesScanned: 6, criticalFindings: 0, highFindings: 1, mediumFindings: 0, lowFindings: 0, resolved: 1, open: 0 },
  },
  {
    id: "session-17-18-tutorials",
    date: "2026-02-09",
    scope: "S17-18: Tutorial conversion. T#12 created+registered. T#13 created. richContentMap added.",
    sessionRange: "Sessions 17-18",
    summary: "Tutorial rich content conversion started. richContentMap pattern added to slug page. T#12 (deploying-nextjs-vercel) created and registered. T#13 created but unregistered due to file edit limit.",
    findings: [],
    metrics: { filesScanned: 4, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-19-timeout",
    date: "2026-02-09",
    scope: "Session 19: TIMED OUT during init -- context pressure from long conversation.",
    sessionRange: "Session 19",
    summary: "No deliverables. Session timed out during init due to accumulated context in Conversation 1. This was the trigger event that led to modular rules (S20) and fresh chat protocol (S22-S23). Backfilled in S30 for complete audit trail.",
    findings: [],
    metrics: { filesScanned: 0, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-20-modular-rules",
    date: "2026-02-09",
    scope: "Session 20: Modular rules system created. Evolution playbook. Old monolith replaced.",
    sessionRange: "Session 20",
    summary: "Created modular rule system: v0-rules-index.md + 4 modules (core, content, review, automation). Created v0-evolution-playbook.md for working relationship continuity. Context/pattern registries created. Old monolith v0-rules.md replaced.",
    findings: [],
    metrics: { filesScanned: 8, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-21-22-tutorials-complete",
    date: "2026-02-09",
    scope: "S21-22: T#13-15 registered. ALL 60 content items complete.",
    sessionRange: "Sessions 21-22",
    summary: "T#13+T#14 registered. T#14+T#15 created. T#15 registered in S22. ALL 60 CONTENT ITEMS (29 articles, 16 case studies, 15 tutorials) now have components. Build validation PASS.",
    findings: [],
    metrics: { filesScanned: 60, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },

  // =========================================================================
  // Conversation 2 Reviews (S23-S35)
  // =========================================================================
  {
    id: "session-23-fresh-chat-review",
    date: "2026-02-09",
    scope: "S23: Fresh chat 3-axis review PASS. Zero findings. Modular rules validated.",
    sessionRange: "Session 23",
    summary: "First session of Conversation 2. Full 3-axis review with fresh context. Zero findings. All imports and slug maps confirmed. Modular rules system validated in production.",
    findings: [],
    metrics: { filesScanned: 60, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-24-sidebar-nav",
    date: "2026-02-09",
    scope: "S24: Sidebar nav consistency. CS+tutorials category-grouped. 7 new categories.",
    sessionRange: "Session 24",
    summary: "Sidebar navigation made consistent across all content types. Case studies and tutorials now use category-grouped navigation like articles. 7 new categories added to categoryConfig.",
    findings: [],
    metrics: { filesScanned: 5, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-25-code-explanation",
    date: "2026-02-09",
    scope: "S25: S24 review-log backfilled. CodeExplanation atom created (100 lines).",
    sessionRange: "Session 25",
    summary: "S24 review-log gap backfilled (gate satisfied). CodeExplanation atom component created (100 lines). Import pattern confirmed: direct from atoms/ path, not article-components.",
    findings: [],
    metrics: { filesScanned: 3, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-26-batch-t1-t3",
    date: "2026-02-09",
    scope: "S26: BATCH T#1(182L)+T#2(192L)+T#3(206L) created. T#1+T#2 registered.",
    sessionRange: "Session 26",
    summary: "First batch tutorial creation with CodeExplanation atom. T#1 (building-atomic-component, 182L), T#2 (server-side-validation, 192L), T#3 (zustand-form-store, 206L) created. T#1+T#2 registered in slug page. T#3 mapping deferred. Batch creation rule added.",
    findings: [],
    metrics: { filesScanned: 6, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-27-hallucination-fix",
    date: "2026-02-09",
    scope: "S27: CRITICAL FIX: T#1-3 rewritten. Hallucinated component names found+fixed.",
    sessionRange: "Session 27",
    summary: "T#1-3 imported BestPracticeCard, WarningCallout, InfoCallout, SectionAnchor -- none exist in article-components.tsx. Also wrong prop names on CodeExplanation and KeyTakeaway. All 3 files rewritten with ONLY valid imports from the canonical export list. T#3 slug mapping added. Hallucination Registry created and added to review rules.",
    findings: [
      {
        id: "S27-001",
        category: "code-quality",
        severity: "critical",
        title: "Hallucinated component imports in T#1-3",
        description: "T#1-3 imported BestPracticeCard, WarningCallout, InfoCallout, SectionAnchor -- none exist in article-components.tsx. Also wrong prop names on CodeExplanation and KeyTakeaway.",
        location: ["components/tutorials/building-atomic-component.tsx", "components/tutorials/server-side-validation.tsx", "components/tutorials/zustand-form-store.tsx"],
        status: "resolved",
        resolution: "All 3 files rewritten with valid imports. Hallucination Registry added to review rules.",
      },
    ],
    metrics: { filesScanned: 8, criticalFindings: 1, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 1, open: 0 },
  },
  {
    id: "session-28-validation-pipeline",
    date: "2026-02-09",
    scope: "Session 28: 3-Stage Validation Pipeline + Exports Manifest. Full codebase audit PASS.",
    sessionRange: "Session 28",
    summary: "Added Exports Manifest to v0-rules-content.md: 23 article-components exports + 3 atom exports with EXACT prop signatures, verified by grep. Restructured v0-rules-review.md: replaced ad-hoc Build Validation with formal 3-Stage Validation Pipeline (LINT->BUILD->VERIFY). Full codebase audit: grepped ALL 60+ component files for hallucinated names. ZERO matches. Codebase is clean.",
    findings: [],
    metrics: { filesScanned: 60, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-29-t14-t15-fix",
    date: "2026-02-09",
    scope: "S29: Fixed T#14+T#15 hallucinated names. Hallucination Registry expanded.",
    sessionRange: "Session 29",
    summary: "Fixed T#14+T#15: ComparisonTable->StatsTable, WarningBox->InfoBox. Hallucination Registry expanded to 9 entries. S27 review-log backfilled. Comprehensive audit PASS.",
    findings: [
      {
        id: "S29-001",
        category: "code-quality",
        severity: "high",
        title: "T#14+T#15 contained hallucinated component names",
        description: "ComparisonTable and WarningBox do not exist. Should be StatsTable and InfoBox.",
        location: ["components/tutorials/e2e-testing-playwright.tsx", "components/tutorials/multi-step-forms-server-actions.tsx"],
        status: "resolved",
        resolution: "Fixed to use canonical names. Registry expanded with new entries.",
      },
    ],
    metrics: { filesScanned: 15, criticalFindings: 0, highFindings: 1, mediumFindings: 0, lowFindings: 0, resolved: 1, open: 0 },
  },
  {
    id: "session-30-context-sync",
    date: "2026-02-09",
    scope: "S30: Context sync. S19+S29 gaps filled. All 5 rule headers updated. JSX safety rule.",
    sessionRange: "Session 30",
    summary: "Full context synchronization. S19 and S29 review-log gaps filled. All 5 rule module headers updated to current session. JSX safety rule added to core rules. Complete audit trail S11-S30 achieved.",
    findings: [],
    metrics: { filesScanned: 8, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-31-rules-architecture",
    date: "2026-02-09",
    scope: "S31: Rules architecture dedup. Conversation module created. Clean 6-module separation.",
    sessionRange: "Session 31",
    summary: "Deduplicated Hallucination Registry (single source in content module). Added positive import validation to review rules. Created v0-rules-conversation.md and conversation-handoff.md. Clean separation achieved across 6 modules.",
    findings: [],
    metrics: { filesScanned: 6, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-32-process-hardening",
    date: "2026-02-09",
    scope: "S32: Sprint Close 4-op fix. Review-log Step 1. Sync gate. S30+S31 backfilled.",
    sessionRange: "Session 32",
    summary: "Sprint Close expanded from 3 to 4 ops. Review-log made Step 1 (was unordered). Post-edit verification rule added. Sync gate: if any context file missing, sprint is INCOMPLETE. S30+S31 review entries backfilled. File ref .tsx fix. All context S11-S32 SYNCED.",
    findings: [],
    metrics: { filesScanned: 6, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-33-vision-handoff",
    date: "2026-02-09",
    scope: "S33: Playbook Phase 5.5+6. Handoff updated for C3.",
    sessionRange: "Session 33",
    summary: "Playbook expanded with Phase 5.5 (architecture template vision) and Phase 6 (journey=product). Handoff file updated for Conversation 3 transition. Vision captured.",
    findings: [],
    metrics: { filesScanned: 3, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-34-sync-proof",
    date: "2026-02-09",
    scope: "S34: Sync Proof Chain. Sync Receipt + Sync Verification added to protocol.",
    sessionRange: "Session 34",
    summary: "Sync Receipt added to Sprint Close (visible proof of sync). Sync Verification added to Sprint Start and Conversation Open. .tsx fix in conversation module. SYNC PROOF CHAIN complete.",
    findings: [],
    metrics: { filesScanned: 4, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-35-handoff-guard",
    date: "2026-02-09",
    scope: "S35: Handoff-as-guard. Rolling backup on every sprint close.",
    sessionRange: "Session 35",
    summary: "Handoff file now written at EVERY sprint close (rolling backup), not just conversation boundaries. Core Step 3 = write handoff. Conversation close simplified. The handoff IS the sync gate.",
    findings: [],
    metrics: { filesScanned: 5, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },

  // =========================================================================
  // Conversation 3 Reviews (S36+)
  // =========================================================================
  {
    id: "session-36-t4-t6-batch",
    date: "2026-02-09",
    scope: "S36 (C3-S1): T#4-6 batch created. First batch with full defense-in-depth pipeline.",
    sessionRange: "Session 36",
    summary: "T#4: rate-limiting-implementation.tsx (295L). T#5: your-first-nextjs-app.tsx (283L). T#6: your-first-strapi-collection.tsx (247L). All registered in slug page. Stage 2 hallucination grep: ZERO matches. PASS.",
    findings: [],
    metrics: { filesScanned: 4, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-37-t7-t9-batch",
    date: "2026-02-09",
    scope: "S37 (C3-S2): Stage 3 verified T#4-6. T#7-9 batch created.",
    sessionRange: "Session 37",
    summary: "Stage 3 VERIFIED T#4-6: 10 imports, 10 richContentMap entries, all matched. T#7: unit-testing-vitest.tsx (265L). T#8: connecting-nextjs-to-strapi.tsx (283L). T#9: understanding-react-hydration.tsx (326L). All registered (13 total). Stage 2 PASS.",
    findings: [],
    metrics: { filesScanned: 6, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-38-t10-t11-final",
    date: "2026-02-09",
    scope: "S38 (C3-S3): T#10-11 final batch. ALL 15 tutorials with rich content. MILESTONE.",
    sessionRange: "Session 38",
    summary: "T#10: building-hydration-safe-sidebar.tsx (352L). T#11: error-boundaries-and-loading-states.tsx (368L). ALL 15/15 tutorials with rich content. MILESTONE COMPLETE. Stage 2 PASS.",
    findings: [],
    metrics: { filesScanned: 5, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-39-robust-validation",
    date: "2026-02-09",
    scope: "S39 (C3-S4): Robust validation guard. Script sandbox discovery. Positive Import Protocol.",
    sessionRange: "Session 39",
    summary: "DISCOVERY: v0 script sandbox has NO project source files. Script-based validation impossible. Built Positive Import Validation Protocol using Grep/Read tools. Updated v0-rules-review.md Stage 2 BUILD with robust tool-based protocol.",
    findings: [
      {
        id: "S39-001",
        category: "architecture",
        severity: "high",
        title: "Script sandbox has no project files -- validation must be tool-based",
        description: "v0 script execution environment only contains node_modules and package.json. All validation must use Grep/Read tools.",
        location: ["scripts/"],
        status: "resolved",
        resolution: "Documented in review rules. Stage 2 rewritten as tool-based protocol. Dead scripts removed.",
      },
    ],
    metrics: { filesScanned: 8, criticalFindings: 0, highFindings: 1, mediumFindings: 0, lowFindings: 0, resolved: 1, open: 0 },
  },
  {
    id: "session-40-41-ts-error-fix",
    date: "2026-02-09",
    scope: "S40-41: Fixed TS errors. Ghost .ts file deleted. 8 stale refs fixed. ACCIDENTAL DELETION of review log.",
    sessionRange: "Sessions 40-41",
    summary: "S40: Removed 66 unnecessary type assertions. Updated ReviewEntry interface (sessionRange added, reviewer optional). S41: Discovered ghost code-review-log.ts causing TS resolution conflict. Attempted delete of ghost file ACCIDENTALLY DELETED code-review-log.ts. Fixed 8 stale .ts refs across 6 files. Review log reconstructed in S42.",
    findings: [
      {
        id: "S41-001",
        category: "infrastructure",
        severity: "critical",
        title: "code-review-log.ts accidentally deleted during ghost file cleanup",
        description: "Writing then deleting code-review-log.ts caused the v0 filesystem to also remove code-review-log.ts. 2000+ line file lost. Reconstructed from sprintHistory and session memory in S42.",
        location: ["data/code-review-log.ts"],
        status: "resolved",
        resolution: "File reconstructed in S42. Lesson: NEVER create a file with the same base name as an existing file in v0. The filesystem may treat .ts and .tsx as the same module.",
      },
    ],
    metrics: { filesScanned: 8, criticalFindings: 1, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 1, open: 0 },
  },
  {
    id: "session-42-reconstruction",
    date: "2026-02-09",
    scope: "S42 (C3-S7): Reconstructed code-review-log.ts from sprintHistory + session memory.",
    sessionRange: "Session 42",
    summary: "Full reconstruction of code-review-log.ts after accidental deletion. Types, interfaces, 28 entries, and helper functions restored. SprintHistory proved its value as disaster recovery source. All entries condensed from detailed session summaries.",
    findings: [],
    metrics: { filesScanned: 4, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-43-review-verify",
    date: "2026-02-10",
    scope: "S43 (C3-S8): Review-Build-Fix-Verify on code-review-log.ts. Full sync. File renamed .tsx->.ts.",
    sessionRange: "Session 43",
    summary: "3-axis review of code-review-log.ts: Code Quality PASS, Security PASS, Architecture 1 fix (7 internal .tsx refs updated to .ts). File Safety Rules added to v0-rules-core.md (S42 continuation). Positive validation audit: all 15 tutorials PASS. hasRichContent flag confirmed non-existent (richContentMap IS the mechanism). Codebase-wide .tsx ref check: 0 stale refs in editable files.",
    findings: [],
    metrics: { filesScanned: 6, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-44-docpage-wrapper",
    date: "2026-02-10",
    scope: "S44 (C3-S9): Option C doc protection -- DocPage wrapper, management doc registry, guides data type.",
    sessionRange: "Session 44",
    summary: "Task 1: Built DocPage wrapper (molecules/doc-page.tsx 189L) with typed header, auto-scroll TOC, DocSectionHeader. Migrated operations page as PoC. Task 2: Added MANAGEMENT_DOCS registry (26 docs, 4 sections) to doc-manifest.ts with ManagementDoc interface, computed stats, usesDocPage tracking. Task 3 (partial): Created guides.ts data file (110L, 3 guides: Security, Deployment, Testing). Slug page + rich components deferred to S45.",
    findings: [],
    metrics: { filesScanned: 12, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-45-guides-content-type",
    date: "2026-02-10",
    scope: "S45 (C3-S10): Guides content type complete. 3 rich components, slug page, listing page, nav integration.",
    sessionRange: "Session 45",
    summary: "Task 3 DONE: Built 3 guide rich components (security-architecture 306L, deployment-guide 255L, testing-strategy 309L) using article-components atoms. Guides slug page (167L) with richContentMap + notFound + generateStaticParams. Guides listing page (105L) with category stats. Nav integration: guides import, guideChildren array, Learning Hub Ops Guides entry with BookOpen icon. Total: 7 new files, 3 nav edits.",
    findings: [],
    metrics: { filesScanned: 10, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-46-audit-tools-wired",
    date: "2026-02-10",
    scope: "S46 (C3-S11): Task 5 DONE. Management docs wired into admin audit tools. Option C COMPLETE.",
    sessionRange: "Session 46",
    summary: "Wired MANAGEMENT_DOCS + guides into gap-analysis (new Pass 0: DocPage adoption + needs-review detection) and doc-system overview (guides in content stats, management doc coverage area, DocPage adoption metrics). All 5 Option C tasks DONE: DocPage wrapper, management registry (26 docs), guides data type, guides slug+listing+3 rich components+nav, admin audit wiring.",
    findings: [],
    metrics: { filesScanned: 8, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-47-rules-audit",
    date: "2026-02-10",
    scope: "S47 (C3-S12): Full audit of all v0-rules files. Deleted stale monolith. Updated modular files.",
    sessionRange: "Session 47",
    summary: "Audited all 7 rule files. Found v0-rules.md (monolith) was 100% duplicated by modular system with stale/conflicting values (budget numbers, timeout rules). User deleted monolith. Updated v0-rules-index.md (header, line counts, Guides in descriptions) and v0-rules-content.md (header, Guides in file locations table). 6 modular files confirmed clean and well-bounded. Timeout protection rule now enforced via custom instruction + core rules.",
    findings: [
      { id: "F47-1", category: "architecture", severity: "high", title: "Stale monolith v0-rules.md deleted", description: "165-line monolith was 100% duplicated by modular system with conflicting budget numbers and stale timeout rules. Deleted by user.", location: ["data/v0-rules.md"], status: "resolved", resolvedIn: "S47", resolution: "File deleted. All content lives in modular files." },
    ],
    metrics: { filesScanned: 7, criticalFindings: 0, highFindings: 1, mediumFindings: 0, lowFindings: 0, resolved: 1, open: 0 },
  },
  {
    id: "session-48-docpage-migration-infra",
    date: "2026-02-10",
    scope: "S48 (C3-S13): DocPage migration -- Infrastructure & Ops section. 3-axis review with fixes. Timeout rules synced.",
    sessionRange: "Session 48",
    summary: "Migrated deployment (275L), testing (306L), troubleshooting (278L) to DocPage wrapper. Infrastructure-overview excluded (nav hub). 3-axis review caught 2 findings: F48-1 troubleshooting meta format mismatch (fixed to array), F48-2 DocSectionHeader using title prop instead of children (6 instances fixed). v0-rules-core.md timeout protection synced with updated custom instruction (auto-continue, mandatory 3-axis review). Score: 4/26 pages migrated.",
    findings: [
      { id: "F48-1", category: "code-quality", severity: "medium", title: "Troubleshooting meta format mismatch", description: "DocPage meta typed as array but troubleshooting passed object. Would cause render failure.", location: ["app/dashboard/troubleshooting/page.tsx"], status: "resolved", resolvedIn: "S48", resolution: "Fixed to array format." },
      { id: "F48-2", category: "code-quality", severity: "medium", title: "DocSectionHeader wrong prop pattern", description: "6 instances used title prop instead of children. Headers would not render.", location: ["app/dashboard/troubleshooting/page.tsx"], status: "resolved", resolvedIn: "S48", resolution: "All 6 converted to children pattern." },
    ],
    metrics: { filesScanned: 10, criticalFindings: 0, highFindings: 0, mediumFindings: 2, lowFindings: 0, resolved: 2, open: 0 },
  },
  {
    id: "session-49-docpage-migration-app-ref",
    date: "2026-02-10",
    scope: "S49 (C3-S14): DocPage migration -- Performance + Security. S48 sync fixed. 3-axis review CLEAN.",
    sessionRange: "Session 49",
    summary: "Fixed deferred S48 sync (project-state + handoff). Migrated performance (448L, consolidated from 773L) and security (988L, from 1061L -- largest page in system). Both preserve all content with DocPage wrapper, TOC sections, correct meta/DocSectionHeader patterns. 3-axis review: CLEAN, zero findings. F48 lessons applied (array meta format, children pattern). Score: 6/26 pages migrated. Remaining: 1 infra (api-graphql 820L), 5 app-ref, 6 CMS-ref, 5 strategic.",
    findings: [],
    metrics: { filesScanned: 8, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-50-close-optimized",
    date: "2026-02-10",
    scope: "S50 (C3-S15): Close protocol optimized (7->3 ops). Server-vs-client migrated. Handoff deferred to session start.",
    sessionRange: "Session 50",
    summary: "Optimized close protocol: combined project-state edits, deferred handoff to next session start. Freed 4 ops per session for actual work. Migrated server-vs-client (333L, 8 TOC sections). 3-axis review CLEAN. Score: 7/26 pages migrated. Next: api-integration (814L), then remaining App Reference pages.",
    findings: [],
    metrics: { filesScanned: 6, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-51-app-ref-batch",
    date: "2026-02-10",
    scope: "S51 (C3-S16): DocPage migration -- api-integration(656L) + email-notifications(597L). First session using optimized 3-op close.",
    sessionRange: "Session 51",
    summary: "Migrated 2 App Reference pages: api-integration (814->656L, 6 TOC sections, 3-tab Spoiler preserved) and email-notifications (707->597L, 8 TOC sections, urgency cards + error items to .map()). Both 3-axis reviews CLEAN. Registry flags updated. Score: 9/26 migrated. Next: component-system (862L, complex 7-tab catalog), hydration-guards, then CMS Reference batch.",
    findings: [],
    metrics: { filesScanned: 8, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-52-skills-adaptation",
    date: "2026-02-10",
    scope: "S52 (C3-S17): 3 skills adapted from skills.sh. component-system + hydration-guards migrated. DocPage 11/26.",
    sessionRange: "Session 52",
    summary: "Fetched and security-audited 3 skills from skills.sh (obra/superpowers + vercel-labs). Created v0-rules-debugging.md (89L, 4-phase systematic debugging), v0-rules-ui-audit.md (99L, 100+ UI rules from Web Interface Guidelines). Merged Verification Gate into v0-rules-review.md (iron law: no claims without evidence). Updated v0-rules-index.md with 2 new modules + corrected budget formula. Also migrated component-system (862->843L) and hydration-guards (603->549L) to DocPage wrapper. Score: 11/26 DocPage migrated.",
    findings: [],
    metrics: { filesScanned: 12, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-53-nextjs-brainstorming-skills",
    date: "2026-02-10",
    scope: "S53 (C3-S18): Next.js/React rules + Brainstorming protocol adapted. 9 rule modules total.",
    sessionRange: "Session 53",
    summary: "Security-audited and adapted 2 more skills: vercel-labs Next.js Best Practices (9.1K) + React Best Practices (115K) combined into v0-rules-nextjs.md (99L, CRITICAL/HIGH/MEDIUM tiers covering RSC boundaries, data fetching, hydration, performance, caching, security, TypeScript). obra/superpowers Brainstorming protocol merged into v0-rules-review.md as Pre-Implementation phase (3-question discovery). Rules index updated to 9 modules. Total adapted skills: 5 from 3 sources.",
    findings: [],
    metrics: { filesScanned: 6, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-54-cms-batch-1",
    date: "2026-02-10",
    scope: "S54 (C3-S19): single-types+relationships migrated. Next.js rules + skills tested in action. 13/26 DocPage.",
    sessionRange: "Session 54",
    summary: "Migrated 2 CMS Reference pages to DocPage wrapper. single-types (600L->384L, 4 tabbed schemas + companion components + best practices section added). relationships (914L->697L, 24% reduction, 7 sections with SECTIONS array, filterable entity relationship tabs, 5-layer architecture diagram, data flow timeline, frontend-backend mapping cards, component reuse matrix, atomic design mapping, developer quick reference). Also created v0-rules-nextjs.md in S53 -- first session using all 5 adapted skills. CMS Reference: 2/7 migrated (excl hub page). Overall: 13/26.",
    findings: [],
    metrics: { filesScanned: 10, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-55-cms-batch-2",
    date: "2026-02-10",
    scope: "S55 (C3-S20): getting-started(no TOC)+shared-components migrated. CMS batch: 4/6 done. 15/26 DocPage.",
    sessionRange: "Session 55",
    summary: "Migrated 2 CMS Reference pages. getting-started (528->356L, 33% reduction) wrapped in DocPage header/meta only, no SECTIONS/TOC per user instruction. shared-components (~800->440L, 45% reduction) with 5 SECTIONS, extracted ComponentCard+MappingTable helpers, all 18 component cards, 10 JSON schemas in 3-tab browser, mapping tables, creation order diagram, best practices added. CMS remaining: form-collections + content-collections. Overall: 15/26.",
    findings: [],
    metrics: { filesScanned: 8, criticalFindings: 0, highFindings: 0, mediumFindings: 0, lowFindings: 0, resolved: 0, open: 0 },
  },
  {
    id: "session-56-cms-complete",
    date: "2026-02-10",
    scope: "S56 (C3-S21): CMS Reference COMPLETE. form-collections+content-collections migrated. Import bug fix verified. 17/26 DocPage.",
    sessionRange: "Session 56",
    summary: "Fixed default import bug (DocPage, { DocSectionHeader } -> { DocPage, DocSectionHeader }) on shared-components + getting-started. Ran full Verification Gate on all 16 migrated pages: 0 broken default imports, 0 dangerouslySetInnerHTML, all atom imports correct. Migrated form-collections (1099L->570L) and content-collections (975L->583L, 40% reduction, extracted FieldMappingTable helper). CMS Reference section now COMPLETE (6/6 content pages). Overall: 17/26. Remaining: 5 Strategic Overview + 1 API/GraphQL + 3 hub pages (excluded).",
    findings: [
      { id: "F56-1", category: "code-quality", severity: "high", title: "Default import bug on DocPage", description: "2 pages used 'import DocPage,' (default) instead of 'import { DocPage }' (named). Caused build error.", location: ["app/dashboard/backend/shared-components/page.tsx", "app/dashboard/backend/getting-started/page.tsx"], status: "resolved", resolvedIn: "S56", resolution: "Fixed both to named import. Full grep verification: 0 broken imports across all 17 migrated pages." },
    ],
    metrics: { filesScanned: 17, criticalFindings: 0, highFindings: 1, mediumFindings: 0, lowFindings: 0, resolved: 1, open: 0 },
  },
  {
    id: "session-57-migration-complete",
    date: "2026-02-10",
    scope: "S57 (C3-S22): DocPage migration COMPLETE. 18/26 migrated. Bug fixes + hub color restoration + layout analysis.",
    sessionRange: "Session 57",
    summary: "API & GraphQL migrated (820->773L, final migration). Fixed 3 JSX icon prop bugs (server-vs-client, relationships, single-types). Fixed DocPage badge rendering for 3 formats (objects, strings, JSX). Fixed TOC IntersectionObserver topmost-section tracking. Added 'danger' type + fallback to InfoBox. Restored explicit colors on 3 hub pages (CMS Ref, App Ref, Infrastructure). Layout width mismatch identified: navbar constrained to container while sidebar is full-width. Strategic Overview pages skipped per user. 18/26 DocPage (8 intentionally excluded). Next: dashboard layout navbar width fix.",
    findings: [
      { id: "F57-1", category: "code-quality", severity: "high", title: "JSX icon prop crash on 3 pages", description: "icon={<Component />} passed instead of icon={Component}. DocPage renders <Icon /> internally.", location: ["app/dashboard/server-vs-client/page.tsx", "app/dashboard/backend/relationships/page.tsx", "app/dashboard/backend/single-types/page.tsx"], status: "resolved", resolvedIn: "S57", resolution: "Changed all 3 to component references. Grep verified 0 remaining JSX icon props." },
      { id: "F57-2", category: "code-quality", severity: "medium", title: "TOC highlights wrong section on load", description: "IntersectionObserver set activeId to last-processed entry instead of topmost visible.", location: ["components/molecules/doc-page.tsx"], status: "resolved", resolvedIn: "S57", resolution: "Track visible IDs in Set, pick first in sections array order. Default activeId to first section." },
      { id: "F57-3", category: "code-quality", severity: "medium", title: "InfoBox crash on unknown type 'danger'", description: "styles map missing 'danger' key, causing undefined.bg read.", location: ["components/molecules/article-components.tsx"], status: "resolved", resolvedIn: "S57", resolution: "Added 'danger' type (red styling) + fallback to 'info' for any unknown types." },
      { id: "F57-4", category: "code-quality", severity: "medium", title: "Hub pages lost colors (monochrome badges/icons)", description: "CMS Ref, App Ref, Infrastructure used generic primary/10 and variant=outline/secondary.", location: ["app/dashboard/cms-reference/page.tsx", "app/dashboard/app-reference/page.tsx", "app/dashboard/infrastructure/page.tsx"], status: "resolved", resolvedIn: "S57", resolution: "Added explicit roleColor/iconColor per feature card. Colored stat card borders. Colored header badges." },
      { id: "F57-5", category: "architecture", severity: "low", title: "Navbar width mismatch with dashboard layout", description: "Navbar uses container mx-auto (~1280px). Sidebar+content spans full viewport. Visual offset.", location: ["components/molecules/navbar.tsx", "app/dashboard/layout.tsx"], status: "open", resolution: "Planned: conditional full-width navbar on /dashboard routes. Approach A approved by user." },
    ],
    metrics: { filesScanned: 12, criticalFindings: 0, highFindings: 1, mediumFindings: 3, lowFindings: 1, resolved: 4, open: 1 },
  },
  {
    id: "session-58-emergency-recovery",
    date: "2026-02-10",
    scope: "S58: Emergency recovery from (marketing) route group + Biome autofix regression. Build stabilisation.",
    sessionRange: "Session 58",
    summary: "Recovered from S57 layout refactor that introduced app/(marketing) route group without approval, causing duplicate route conflicts on /services, /contact, /quotation. Deleted (marketing) folder via terminal rm -rf (v0 file tools cannot handle parenthesized paths). Fixed Biome autofix regression: Biome converts 'import { DocPage, DocSectionHeader }' to 'import DocPage, { DocSectionHeader }' (default import syntax). Applied 3 fixes: (1) added Navbar import+render to services, quotation, contact pages, (2) aliased DocPage as DocPageLayout in shared-components to prevent Biome reversion, (3) added export default DocPage to doc-page.tsx as safety net. Discovered v0 sandbox has layered filesystem -- Edit tool, terminal, and Turbopack can read different layers. Sandbox restart required to sync layers. All routes verified clean.",
    findings: [
      { id: "F58-1", category: "architecture", severity: "critical", title: "Unauthorized (marketing) route group caused duplicate routes", description: "app/(marketing)/ folder created without user approval. Duplicated /contact, /services, /quotation routes. v0 file tools cannot read/delete parenthesized paths.", location: ["app/(marketing)/"], status: "resolved", resolvedIn: "S58", resolution: "Deleted via terminal rm -rf. New rule: NEVER create route groups without explicit user approval." },
      { id: "F58-2", category: "code-quality", severity: "high", title: "Biome autofix reverts named imports to default import syntax", description: "Biome auto-formatter converts 'import { DocPage, DocSectionHeader }' to 'import DocPage, { DocSectionHeader }'. This regressed the S56 fix (F56-1). dangerously_disable_autofix does not persist.", location: ["app/dashboard/backend/shared-components/page.tsx"], status: "resolved", resolvedIn: "S58", resolution: "Used import alias: 'import { DocPage as DocPageLayout }'. Biome cannot revert aliased named imports. Also added export default DocPage to doc-page.tsx as belt-and-braces." },
      { id: "F58-3", category: "code-quality", severity: "high", title: "Navbar missing on 3 marketing pages after (marketing) deletion", description: "Services, quotation, contact pages had no <Navbar /> because it was previously provided by the (marketing) layout.", location: ["app/services/page.tsx", "app/quotation/page.tsx", "app/contact/page.tsx"], status: "resolved", resolvedIn: "S58", resolution: "Added Navbar import and <Navbar /> render to all 3 pages, matching homepage pattern." },
      { id: "F58-4", category: "architecture", severity: "medium", title: "v0 sandbox layered filesystem causes stale cache", description: "Edit tool writes to one layer, terminal operates on another, Turbopack reads from a third. Turbopack SST cache can become corrupted. .next deletion causes 'Unable to write SST file' errors.", location: ["v0-sandbox-infrastructure"], status: "resolved", resolvedIn: "S58", resolution: "Full sandbox restart (not just dev server restart) syncs all layers. Document in KNOWN_ISSUES." },
      { id: "F58-5", category: "architecture", severity: "low", title: "F57-5 navbar width mismatch still open", description: "Carried forward from S57. Navbar uses container mx-auto while sidebar is full-width.", location: ["components/molecules/navbar.tsx", "app/dashboard/layout.tsx"], status: "open", resolution: "Deferred. Do NOT attempt via route groups. Simple conditional approach only, with user approval." },
    ],
    metrics: { filesScanned: 8, criticalFindings: 1, highFindings: 2, mediumFindings: 1, lowFindings: 1, resolved: 4, open: 1 },
  },
]

// ---------------------------------------------------------------------------
// Helper utilities for consuming review data
// ---------------------------------------------------------------------------

/** Lessons extracted from review findings for training/onboarding */
export const LESSONS_LEARNED = REVIEW_LOG
  .flatMap((entry) => entry.findings)
  .filter((f) => f.status === "resolved" && f.resolution)
  .map((f) => ({
    id: f.id,
    title: f.title,
    lesson: f.resolution!,
    category: f.category,
    severity: f.severity,
  }))

/** Get the latest review entry */
export function getLatestReview(): ReviewEntry | undefined {
  return REVIEW_LOG[REVIEW_LOG.length - 1]
}

/** Get all open findings across all reviews */
export function getOpenFindings(): Finding[] {
  return REVIEW_LOG.flatMap((entry) => entry.findings).filter(
    (f) => f.status === "open"
  )
}

/** Get findings by severity */
export function getFindingsBySeverity(severity: Severity): Finding[] {
  return REVIEW_LOG.flatMap((entry) => entry.findings).filter(
    (f) => f.severity === severity
  )
}

/** Summary stats for dashboard display */
export function getReviewStats() {
  const allFindings = REVIEW_LOG.flatMap((entry) => entry.findings)
  return {
    totalReviews: REVIEW_LOG.length,
    totalFindings: allFindings.length,
    openFindings: allFindings.filter((f) => f.status === "open").length,
    resolvedFindings: allFindings.filter((f) => f.status === "resolved").length,
    criticalFindings: allFindings.filter((f) => f.severity === "critical").length,
    highFindings: allFindings.filter((f) => f.severity === "high").length,
  }
}
