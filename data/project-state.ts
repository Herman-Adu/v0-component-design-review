/**
 * PROJECT STATE -- Session Handoff Document
 * ==========================================
 * This file provides instant orientation for any new v0 session.
 * Read this FIRST before making any changes to the codebase.
 *
 * Last updated: 2026-02-10 (Session 59 -- Dashboard navbar aligned, App Reference Getting Started created, session management architecture designed, 3-axis review process formalized.)
 * Current Conversation: 3 (started S36)
 *
 * UPDATE PROTOCOL: This file MUST be updated at the end of every session
 * that makes structural changes. Update the relevant sections and bump
 * the "Last updated" date above.
 */

// ---------------------------------------------------------------------------
// 1. Architecture Overview
// ---------------------------------------------------------------------------

export const ARCHITECTURE = {
  framework: "Next.js 16 (App Router)",
  styling: "Tailwind CSS v4 + shadcn/ui",
  stateManagement: "Zustand (form stores) + SWR (data fetching)",
  emailSystem: "React Email + Resend (SMTP)",
  designSystem: "Atomic Design (atoms -> molecules -> organisms -> pages)",
  totalFiles: 310, // +11 new content component files + data entries
  totalPages: 58,

  /** Content Library Counts (as of Session 7) */
  contentLibrary: {
    articles: 29,        // 21 original + 8 new (Batches 1-5)
    casStudies: 16,      // 11 original + 5 new (Batches 1-6)
    tutorials: 15,       // 10 original + 5 new (Batches 1-6)
    richComponentFiles: 60, // ALL content types now have dedicated .tsx component files
    flatContentRemaining: 0, // COMPLETE -- all 60 items have rich components and are registered
  },

  /** Component hierarchy follows atomic design */
  componentStructure: {
    atoms: "components/atoms/ -- form inputs, toggles, code blocks",
    molecules: "components/molecules/ -- navbar, sidebar, form navigation, cards",
    organisms: "components/organisms/ -- form containers, multi-step forms, shared steps",
    pages: "app/ -- Next.js App Router pages",
  },
} as const

// ---------------------------------------------------------------------------
// 2. Navigation Architecture (Updated Review #9)
// ---------------------------------------------------------------------------

export const NAV_ARCHITECTURE = {
  /**
   * The sidebar has 3 top-level groups:
   * 1. MANAGEMENT -- admin tools (6 sections)
   * 2. DOCUMENTATION -- technical docs (4 role-based sections)
   * 3. LEARN & GROW -- content library + learning hub
   */
  groups: {
    management: {
      sections: [
        "Admin (adminSection)",
        "Doc Health (docHealthSection)",
        "Doc QA (docQASection)",
        "Email Management (emailManagementSection) -- CONSOLIDATED: Request Handling + Configuration + Infrastructure",
      ],
    },
    documentation: {
      /**
       * IMPORTANT: Documentation was reorganised from 2 technology-layer
       * sections ("Backend & CMS", "Frontend & Integration") to 4 role-based
       * sections in Review #9. This was done so each role sees only their
       * relevant content instead of digging through all 26 pages.
       */
      sections: [
        "Strategic Overview (strategicOverviewSection) -- CTO/PL: 5 items",
        "CMS Reference (cmsReferenceSection) -- Developer/Architect: 7 items",
        "App Reference (appReferenceSection) -- Developer/Architect: 8 items",
        "Infrastructure & Ops (infrastructureOpsSection) -- DevOps/QA: 6 items",
      ],
    },
    learnAndGrow: {
      sections: [
        "Content Library (contentLibrarySection)",
        "Learning Hub (learningHubSection)",
      ],
    },
  },

  /** Key files that define the nav */
  keyFiles: [
    "data/nav-data.ts -- all section definitions and NavSection types",
    "components/molecules/docs-sidebar.tsx -- sidebar renderer using NavCollapsible",
  ],
} as const

// ---------------------------------------------------------------------------
// 3. Review History Summary
// ---------------------------------------------------------------------------

export const REVIEW_HISTORY = {
  totalReviews: 12, // Reviews 1-8, 9, 9-hotfix, 10
  lastReview: "review-010",
  lastReviewDate: "2026-02-09",
  lastContentSession: 16,
  contentConversionStatus: "ARTICLES COMPLETE. PropGuard COMPLETE. CS #12-16 components created (CS #16 unregistered). 4 tutorials remaining.",

  /** Sprint History Timeline -- one-liner per session for quick context scan */
  sprintHistory: [
    "S2-4: Created 20 new content items (8 articles, 5 CS, 5 tutorials) as flat text",
    "S5-6: Created shared component library (article-components.tsx). Began rich component conversion",
    "S7: Rules enforcement audit. Fixed 8 rule violations. Strengthened all session rules",
    "S8: Review-log backfill. Article #23 (Service Lifecycle) rich component created",
    "S9: 3-axis review PASS. Article #24 (CMS Content) rich component. All 29 articles COMPLETE",
    "S10: PropGuard utility created. 2/13 components guarded. Defensive Props Standard rule added",
    "S11: Guarded remaining 11 components. Fixed 3 broken DecisionTree callers",
    "S12: Fixed last 2 DecisionTree callers. PropGuard COMPLETE. CS conversion started",
    "S13: CS #12 (Rate Limiting) + CS #13 (Sidebar Refactor) created and registered",
    "S14: CS #14 (Tarball) created. TIMED OUT before registration. Automation rule needed",
    "S15: Automation rule added. CS #14 registered. CS #15 + #16 created. CS #16 unregistered",
    "S16: Sprint Close Protocol strengthened. Backfilled Sessions 11-15 review-log gap. Rules updated",
    "S17: Automation rule tightened. CS #16 registered. Tutorial #12 created. Tutorial slug page needs richContentMap",
    "S18: Tutorial richContentMap added to slug page. T#12 registered. T#13 created (unregistered, file edit limit)",
    "S19: TIMED OUT during init -- context pressure from long conversation",
    "S20: Modular rules (index+4 modules). Evolution playbook. Context/pattern registries. Old monolith replaced",
    "S21: T#13+T#14 registered. T#14+T#15 created. ALL content components now exist. Only T#15 registration remains",
    "S22: T#15 registered. ALL 60 CONTENT ITEMS COMPLETE. Build validation PASS. Recommend fresh chat for 3-axis review",
    "S23: FRESH CHAT. 3-axis review PASS. Zero findings. Modular rules system validated. All imports + slug maps confirmed",
    "S24: Sidebar nav consistency DONE. CS+tutorials now category-grouped like articles. 7 new categories added to categoryConfig",
    "S25: S24 review-log backfilled (gate). CodeExplanation atom created (100 lines). Import pattern confirmed: direct from atoms/",
    "S26: BATCH: T#1(182L)+T#2(192L)+T#3(206L) created with CodeExplanation. T#1+T#2 registered. T#3 mapping pending. Batch rule added",
    "S27: CRITICAL FIX: T#1-3 rewritten with valid imports. Hallucinated names found+fixed. Hallucination Registry added. T#3 mapping added",
    "S28: 3-Stage Validation Pipeline added to review rules. Exports Manifest (23+3 components with exact sigs) added to content rules. Full audit PASS",
    "S29: Fixed T#14+T#15: ComparisonTable->StatsTable, WarningBox->InfoBox. S27 review-log backfilled. Hallucination Registry expanded (9 entries). COMPREHENSIVE audit PASS",
    "S30: CONTEXT SYNC: S19+S29 review-log gaps filled. All 5 rule headers updated to current session. JSX safety rule added to core. Full audit trail now complete S11-S30",
    "S31: RULES ARCHITECTURE: Deduplicated Hallucination Registry (single source in content). Added positive import validation to review. Created v0-rules-conversation.md + conversation-handoff.md. Clean separation achieved across 6 modules",
    "S32: PROCESS HARDENING: Sprint Close 4-op fix (was 3). Review-log now Step 1. Post-edit verification rule. Sync gate. S30+S31 review-log backfilled. File ref .tsx fix. All context S11-S32 SYNCED",
    "S33: VISION+HANDOFF: Playbook Phase 5.5+6. Handoff updated for C3. Vision captured: architecture template, journey=product",
    "S34: SYNC PROOF CHAIN: Sync Receipt added to close. Sync Verification added to start + conversation open. .tsx fix in conversation module",
    "S35: HANDOFF-AS-GUARD: Handoff file now written every sprint close (rolling backup). Core Step 3 = write handoff. Conversation close simplified. contextFiles .tsx fix",
    "--- CONVERSATION 2 BOUNDARY (S23-S35) ---",
    "S36: T#4-6 BATCH: rate-limiting-implementation(295L), your-first-nextjs-app(283L), your-first-strapi-collection(247L). All registered in slug page. Stage 2 hallucination grep PASS (0 matches)",
    "S37: T#7-9 BATCH: unit-testing-vitest(265L), connecting-nextjs-to-strapi(283L), understanding-react-hydration(326L). Registered (13 total). Stage 3 verified T#4-6. Stage 2 PASS",
    "S38: T#10-11 FINAL: building-hydration-safe-sidebar(352L), error-boundaries-and-loading-states(368L). ALL 15/15 tutorials with rich content. MILESTONE COMPLETE. Stage 2 PASS",
    "S39: ROBUST VALIDATION: Positive Import Validation Protocol. Script sandbox discovery (no project files). Stage 2 rewritten as tool-based. T#10+T#11 positive validation PASS. Dead scripts removed",
    "S40: TS ERROR FIX: Removed 66 type assertions. Updated ReviewEntry interface. (PARTIAL -- review-log entry did NOT persist)",
    "S41: GHOST FILE FIX: Deleted ghost .ts file. Fixed 8 stale refs. ACCIDENTALLY DELETED code-review-log.ts (v0 treated .ts/.tsx as same module)",
    "S42: RECONSTRUCTION: code-review-log.ts rebuilt from sprintHistory+memory. 478 lines, 28 entries, types+helpers restored. LESSON: never create same-basename file in v0",
    "S43: REVIEW-VERIFY PASS: 3-axis review on code-review-log.ts. 7 internal .tsx refs fixed. File Safety Rules added to core. Positive validation audit all 15 tutorials PASS. All .tsx refs purged codebase-wide. Renamed .tsx->.ts via Move",
    "S44: OPTION C: DocPage wrapper(189L)+operations migration. MANAGEMENT_DOCS registry(26 docs) in doc-manifest. Guides data type(3 guides). Tasks 1-2 DONE, Task 3 partial",
    "S45: GUIDES COMPLETE: 3 rich components(security 306L, deployment 255L, testing 309L). Slug page+listing page. Nav integration. Task 3 DONE. Task 4 remains.",
    "S46: OPTION C COMPLETE: Admin audit tools wired. Gap-analysis: guides+MANAGEMENT_DOCS imported, Pass 0 (DocPage adoption+needs-review). Doc-system overview: guides in content stats, management coverage area. All 5 tasks DONE",
    "S47: RULES AUDIT: Deleted stale monolith v0-rules.md (100% duplicated, conflicting values). Updated index+content modules with Guides. 6 modular files confirmed clean. Timeout protection now in custom instructions + core rules",
    "S48: DOCPAGE MIGRATION: deployment(275L)+testing(306L)+troubleshooting(278L). 3-axis review: F48-1 meta format mismatch FIXED, F48-2 DocSectionHeader wrong prop FIXED (6 instances). Timeout rules synced to custom instruction. 4/26 migrated",
    "S49: DOCPAGE MIGRATION: performance(448L)+security(988L). S48 sync fixed. 3-axis CLEAN. Auto-continue+mandatory review rules working. 6/26 migrated",
    "S50: CLOSE OPTIMIZED 7->3 ops. server-vs-client(333L) migrated. 3-axis CLEAN. Handoff deferred to session start. 7/26 DocPage migrated",
    "S51: api-integration(656L)+email-notifications(597L) migrated. 3-axis CLEAN x2. Optimized 3-op close working. 9/26 DocPage migrated",
    "S52: 3 SKILLS ADAPTED from skills.sh: debugging(89L), ui-audit(99L), verification-gate(merged into review). component-system(843L)+hydration-guards(549L) migrated. 11/26 DocPage. 8 rule modules total",
    "S53: Next.js/React rules(99L)+Brainstorming protocol adapted. 9 rule modules. 5 total skills from skills.sh (obra/superpowers+vercel-labs). Security audited. 11/26 DocPage",
    "S54: single-types(600->384L)+relationships(914->697L) migrated. Skills tested in action. CMS batch 2/7. Overall 13/26 DocPage",
    "S55: getting-started(528->356L, no TOC)+shared-components(800->440L, 45% reduction, ComponentCard+MappingTable helpers). CMS 4/6. Overall 15/26 DocPage",
    "S56: CMS COMPLETE. form-collections(1099->570L)+content-collections(975->583L, FieldMappingTable helper). Import bug F56-1 fixed+verified. 17/26 DocPage. Next: Strategic Overview(5)+API/GraphQL(1)",
    "S57: MIGRATION COMPLETE. API&GraphQL(820->773L). 5 bug fixes: JSX icon props(3 pages), TOC topmost-section tracking, InfoBox danger type. Hub colors restored(3 pages). DocPage badge resilience(3 formats). 18/26 (8 excluded). Next: dashboard layout navbar width fix",
  ],

  /** Context Files Registry -- all files that carry inter-session context */
  contextFiles: {
    alwaysRead: [
      "data/project-state.ts",              // Progress, counts, sprintHistory
      "data/code-review-log.ts (last entry)", // Previous sprint context
      "data/v0-rules-index.md",              // Rule module manifest
      "data/v0-rules-core.md",               // Universal constraints
    ],
    firstChatOnly: [
      "data/v0-evolution-playbook.md",       // Working relationship, lessons, principles
    ],
    onDemand: [
      "data/v0-rules-content.md",            // Content creation patterns
      "data/v0-rules-review.md",             // Review/audit/validation
      "data/v0-rules-automation.md",         // Automated session management
    ],
    deprecated: [
      "data/v0-rules.md",                    // Old monolith -- replaced by modular system in Session 20
    ],
  },

  /** Pattern Registry -- active vs deprecated patterns */
  activePatterns: [
    "PropGuard: guardArrayProp() + PropGuardDiagnostic on all shared components",
    "richContentMap: slug-to-component mapping in all content type slug pages",
    "Sprint Context Block: 5-section format in review-log entries",
    "Modular rules: index + core + domain modules loaded on demand",
    "DecisionTree: decisions={[{condition, result, recommended}]} prop shape",
    "Tutorial components: self-contained, no props",
    "Case study components: receive {caseStudy: CaseStudy} prop",
  ],
  deprecatedPatterns: [
    "v0-rules.md monolith -- replaced by modular system (Session 20)",
    "DecisionTree nodes={[{question, options}]} -- wrong prop name/shape",
    "Flat text content in data arrays -- always use rich components",
    "Direct .map() without guardArrayProp() -- crashes on undefined",
  ],

  /**
   * Read /data/code-review-log.ts for full details. Summary of recent reviews:
   *
   * Review #8:  Email infrastructure, request management, content strategy
   *             pages created. Learning Hub & Content Library nav added.
   * Review #9:  Nav reorganised from 2 tech-layer to 4 role-based sections.
   *             3 new overview pages (cms-reference, app-reference, infrastructure).
   * Review #9-hotfix: Tarball incident -- 6 files had duplicate tar entries.
   *             See KNOWN_ISSUES below for full root cause analysis.
   * Review #10: Post-tarball cleanup. 5 deleted files restored. Stale code
   *             example in hydration page fixed.
   */

  /** Files that define review data */
  keyFiles: [
    "data/code-review-log.ts -- full review log with findings and resolutions",
  ],
} as const

// ---------------------------------------------------------------------------
// 4. Known Issues & Platform Constraints
// ---------------------------------------------------------------------------

export const KNOWN_ISSUES = {
  /**
   * TARBALL DUPLICATE ENTRY (v0 Platform)
   * ======================================
   * Root cause: The v0 preview build system packs file changes into an
   * incremental tar archive per session. Each Write/Edit/Delete appends
   * an entry. The tar does NOT deduplicate entries for the same file path.
   *
   * Trigger: When the same file path accumulates 3+ operations (e.g.
   * Write -> Edit -> Edit, or Write -> Delete -> Write) the tar contains
   * duplicate entries. On extraction, tar fails with:
   *   "Cannot open: File exists"
   *
   * CRITICAL RULES:
   * 1. NEVER try to fix this error within the same session.
   *    Every additional operation makes it worse.
   * 2. NEVER delete a file to "reset" it. The delete is another tar entry
   *    and the file may become genuinely lost from disk.
   * 3. The ONLY fix is starting a new session where the tar starts clean.
   *
   * PREVENTION:
   * - Limit sessions to ONE major refactor (10-15 files max)
   * - Track file operations mentally: yellow at 15, red at 25
   * - Never touch a file you don't need to change
   * - After completing a refactor, verify preview builds BEFORE starting
   *   the next task in the same session
   *
   * Incident history: Review #9-hotfix in code-review-log.ts
   */
  tarballDuplicateEntry: {
    severity: "critical",
    platform: "v0 preview build system",
    fix: "Start a new session -- files on disk are correct, only tar is broken",
    prevention: "One major refactor per session, max 10-15 file operations",
  },
} as const

// ---------------------------------------------------------------------------
// 5. Session Budget Guidance
// ---------------------------------------------------------------------------

export const SESSION_BUDGET = {
  /**
   * These are guidelines for scoping work within a single v0 session
   * to avoid tarball issues and maintain quality.
   */
  maxFileOperations: 15,
  maxFilesPerWrite: 1,
  maxEditsPerFile: 2,
  warningThreshold: 12,
  hardLimit: 20,

  /**
   * When approaching the warning threshold:
   * 1. Complete the current task
   * 2. Run the 3-axis review
   * 3. Verify preview builds
   * 4. Recommend starting a new session for the next task
   */

  /** Task sizing guide */
  taskSizing: {
    small: "1-5 files: bug fixes, label changes, single component updates",
    medium: "6-12 files: new feature, new page with components, nav restructure",
    large: "13-20 files: multi-page refactor, architecture change -- SPLIT across 2 sessions",
    tooLarge: "20+ files: ALWAYS split. Plan session boundaries before starting.",
  },
} as const

// ---------------------------------------------------------------------------
// 6. 3-Axis Review Checklist
// ---------------------------------------------------------------------------

export const REVIEW_CHECKLIST = {
  /**
   * Run this checklist after every major task, before marking complete.
   */
  axes: {
    codeQuality: [
      "No `any` types in new/modified files",
      "No console.log statements (except [v0] debug during active debugging)",
      "No unused imports or dead code",
      "All icon imports resolve to valid lucide-react exports",
      "TypeScript strict mode compliance (no ts-ignore, no type assertions)",
      "All shared components guard array props with guardArrayProp() -- grep .map( verify guard above",
      "Navigate to new articles in preview, check console for [PropGuard] warnings = HIGH severity",
      "All article component calls use correct prop names matching shared component interfaces",
    ],
    security: [
      "No dangerouslySetInnerHTML",
      "No eval() or new Function()",
      "No hardcoded secrets or API keys",
      "No unvalidated user input rendered directly",
      "Server actions use proper validation (Zod schemas)",
    ],
    architecture: [
      "All nav routes have corresponding on-disk page.tsx files",
      "All imports resolve (grep for import paths, verify targets exist)",
      "Labels and titles match the current nav structure (no stale names)",
      "New pages follow atomic design (atoms -> molecules -> organisms)",
      "Code examples in documentation reflect current codebase patterns",
    ],
  },

  /** Post-review build verification */
  buildVerification: [
    "Preview loads without errors",
    "No 'Cannot open: File exists' in build logs (tarball issue)",
    "Sidebar navigation renders all sections",
    "New pages are accessible via their nav links",
    "If tarball error seen: STOP, do NOT fix in-session, start new session",
  ],
} as const
