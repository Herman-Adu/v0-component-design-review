"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
  FeatureGrid,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  VerticalFlow,
  DataFlowDiagram,
  DecisionTree,
  BeforeAfterComparison,
  NumberedList,
  type TOCItem,
  ArticleIcons,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "why-session-management", title: "Why Session Management Matters", level: 2 },
  { id: "session-lifecycle", title: "The Session Lifecycle", level: 2 },
  { id: "operation-budget", title: "The Operation Budget System", level: 2 },
  { id: "rules-file-pattern", title: "The Rules File Pattern", level: 2 },
  { id: "project-state-pattern", title: "The Project State Pattern", level: 2 },
  { id: "recovery-protocols", title: "Recovery Protocols", level: 2 },
  { id: "metrics-from-12-sessions", title: "Metrics from 12 Sessions", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function AISessionManagementArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="important">
          Over 12 sessions building this documentation system with v0, we learned that AI coding
          assistants are powerful but require deliberate session management. Without it, you get
          cascading failures, lost files, and wasted hours. With it, you get predictable,
          high-quality output session after session.
        </InfoBox>

        {/* Section 1: Why Session Management */}
        <SectionHeader number="01" title="Why Session Management Matters" id="why-session-management" />

        <p className="text-muted-foreground mb-6">
          AI coding assistants operate in a fundamentally different environment to human developers.
          They lack persistent memory between sessions, have platform-imposed constraints on file
          operations, and can cascade errors if not properly constrained. Session management
          transforms unpredictable AI interactions into repeatable engineering processes.
        </p>

        <ComparisonCards
          leftTitle="Without Session Management"
          leftItems={[
            "No context from previous sessions -- duplicate work",
            "No operation budget -- platform corruption risk",
            "No recovery procedures -- hours lost to preventable failures",
            "No handoff notes -- next session starts blind",
            "Inconsistent architecture -- each session invents new patterns",
          ]}
          rightTitle="With Session Management"
          rightItems={[
            "Project state file provides instant orientation",
            "15-operation budget prevents platform failures",
            "Documented recovery protocols for every failure mode",
            "Handoff notes ensure continuity across sessions",
            "Rules file enforces consistent architectural decisions",
          ]}
          leftType="negative"
          rightType="positive"
        />

        <MetricsGrid metrics={[
          { label: "Total Sessions", value: "12", description: "Building this documentation system" },
          { label: "Platform Failures", value: "2", description: "Both from exceeding operation budgets" },
          { label: "Files Recovered", value: "5", description: "After tarball corruption incident" },
          { label: "Avg. Ops/Session", value: "11", description: "Well within the 15-op budget" },
        ]} />

        {/* Section 2: Session Lifecycle */}
        <SectionHeader number="02" title="The Session Lifecycle" id="session-lifecycle" />

        <p className="text-muted-foreground mb-6">
          Every AI coding session follows a four-phase lifecycle. Skipping any phase leads to
          predictable failure modes -- orientation prevents duplicate work, scoping prevents
          budget overruns, execution tracking prevents corruption, and handoff prevents knowledge loss.
        </p>

        <StepFlow steps={[
          {
            title: "Orientation",
            description: "Read project state + rules. Understand what exists before changing anything. Cost: 2 operations.",
          },
          {
            title: "Scoping",
            description: "Estimate operations needed. If task exceeds budget, split into multiple sessions BEFORE starting.",
          },
          {
            title: "Execution",
            description: "Track every file operation. Announce at warning threshold (12 ops). Hard stop at 15.",
          },
          {
            title: "Handoff",
            description: "Update project state. Summarise what was done and what comes next. Cost: 2 operations.",
          },
        ]} />

        <InfoBox type="warning">
          The most expensive mistake is skipping Orientation. Without reading the project state,
          Session 5 might redo work from Session 3, or worse, overwrite critical changes from
          Session 4. The 2-operation cost pays for itself immediately.
        </InfoBox>

        <DataFlowDiagram
          title="Session Data Flow"
          nodes={[
            { id: "rules", label: "Rules File", description: "Static constraints" },
            { id: "state", label: "Project State", description: "Dynamic orientation" },
            { id: "session", label: "AI Session", description: "Scoped work unit" },
            { id: "output", label: "Code Changes", description: "Files modified" },
            { id: "handoff", label: "Updated State", description: "Next session input" },
          ]}
          flow="horizontal"
        />

        {/* Section 3: Operation Budget */}
        <SectionHeader number="03" title="The Operation Budget System" id="operation-budget" />

        <p className="text-muted-foreground mb-6">
          AI coding platforms use internal packaging systems (tar archives, incremental builds)
          that can corrupt when too many operations target the same files. We discovered this the
          hard way when a session with 25+ operations caused a tarball duplicate entry error that
          deleted 5 files.
        </p>

        <StatsTable
          headers={["Operations", "Risk Level", "Action Required"]}
          rows={[
            ["1-12", "Safe", "Continue working normally"],
            ["12-15", "Warning", "Complete current task, prepare to stop"],
            ["15-20", "High", "Emergency only, run review before stopping"],
            ["20+", "Critical", "STOP. Platform corruption risk. New session required."],
          ]}
        />

        <SubSectionHeader title="What Counts as an Operation" />

        <FeatureGrid columns={3} features={[
          {
            icon: <ArticleIcons.Code className="h-5 w-5" />,
            title: "Write",
            description: "Creating a new file. Always costs 1 operation regardless of file size.",
          },
          {
            icon: <ArticleIcons.Settings className="h-5 w-5" />,
            title: "Edit",
            description: "Modifying an existing file. Max 2 edits per file per session to avoid tar conflicts.",
          },
          {
            icon: <ArticleIcons.AlertTriangle className="h-5 w-5" />,
            title: "Delete",
            description: "Removing a file. The most dangerous operation -- adds a tar entry AND removes the file.",
          },
        ]} />

        <InfoBox type="tip">
          Read operations are FREE. Always read before editing. The cost of reading 10 files to
          understand context is zero operations. The cost of editing the wrong file because you
          didn't read first is catastrophic.
        </InfoBox>

        <CodeBlock
          filename="session-budget-tracking.ts"
          language="typescript"
          code={`const SESSION_BUDGET = {
  max: 15,        // File operations (Write + Edit + Delete)
  warnAt: 12,     // Announce remaining budget to user
  hardStop: 20,   // Refuse further operations

  // Per-file limits:
  maxEditsPerFile: 2,  // More than 2 edits = tar conflict risk
  maxWritesPerFile: 1, // Only write a file once per session
}

// Task sizing guide:
// Small (1-5 ops):  Bug fix, label change, single component
// Medium (6-12 ops): New page, feature addition, nav restructure
// Large (13-20 ops): Multi-page refactor -- consider splitting
// Too Large (20+):   ALWAYS split across sessions`}
        />

        {/* Section 4: Rules File Pattern */}
        <SectionHeader number="04" title="The Rules File Pattern" id="rules-file-pattern" />

        <p className="text-muted-foreground mb-6">
          The rules file is institutional memory that persists across sessions. It contains static
          constraints that never change: architecture decisions, naming conventions, platform
          limitations, and quality standards. Every session reads it first, ensuring consistency.
        </p>

        <BeforeAfterComparison
          before={{
            title: "Without Rules File",
            items: [
              "Session 3: Uses PascalCase for files",
              "Session 5: Switches to kebab-case",
              "Session 7: Mixes both conventions",
              "Session 9: Introduces a third pattern",
              "Result: Inconsistent codebase requiring cleanup",
            ],
          }}
          after={{
            title: "With Rules File",
            items: [
              "Rule: 'All component files use PascalCase'",
              "Session 3: Reads rule, uses PascalCase",
              "Session 5: Reads rule, uses PascalCase",
              "Session 9: Reads rule, uses PascalCase",
              "Result: Consistent codebase from day one",
            ],
          }}
        />

        <SubSectionHeader title="Essential Rules Categories" />

        <VerticalFlow steps={[
          {
            title: "Architecture Rules",
            description: "Atomic Design hierarchy, state management patterns, component locations, navigation structure. These define HOW code is organised.",
          },
          {
            title: "Platform Constraints",
            description: "Operation budgets, tarball protection protocols, file limits. These define WHAT the platform can safely handle.",
          },
          {
            title: "Quality Standards",
            description: "Content quality rules, shared component requirements, TOC requirements. These define the MINIMUM acceptable output.",
          },
          {
            title: "Recovery Procedures",
            description: "What to do when things go wrong -- tarball errors, build failures, wrong file edited. These prevent panic decisions.",
          },
        ]} />

        <CodeBlock
          filename="data/v0-rules.md (excerpt)"
          language="markdown"
          code={`## Architecture Rules
- Atomic Design: atoms -> molecules -> organisms -> pages
- All forms use Zustand stores in lib/store/
- Validation uses Zod schemas in lib/validation/
- Navigation defined in data/nav-data.ts

## Content Quality Standard (CRITICAL)
1. Dedicated component file using shared component library
2. Standard layout: content left, TableOfContents right
3. ALWAYS include: TOC, SectionHeader, InfoBox, CodeBlock, KeyTakeaway
4. Use diagrams/flows where applicable
5. NEVER store long content as flat text in data arrays

## Tarball Protection (CRITICAL)
If "Cannot open: File exists" appears: STOP IMMEDIATELY.
Do NOT delete or rewrite files. Start a new session.`}
        />

        {/* Section 5: Project State Pattern */}
        <SectionHeader number="05" title="The Project State Pattern" id="project-state-pattern" />

        <p className="text-muted-foreground mb-6">
          Unlike rules (static constraints), the project state file captures dynamic information
          that changes every session: file counts, review history, known issues, architecture
          summaries. It gives each new session instant orientation.
        </p>

        <FeatureGrid columns={2} features={[
          {
            icon: <ArticleIcons.FileText className="h-5 w-5" />,
            title: "Architecture Overview",
            description: "Framework, total files, total pages, component hierarchy. Instant understanding of project scale.",
          },
          {
            icon: <ArticleIcons.Layout className="h-5 w-5" />,
            title: "Navigation Architecture",
            description: "Sidebar groups, section counts, key files. Know where everything lives without searching.",
          },
          {
            icon: <ArticleIcons.CheckCircle className="h-5 w-5" />,
            title: "Review History",
            description: "Total reviews, last review ID, date. Understand quality trajectory and recent changes.",
          },
          {
            icon: <ArticleIcons.AlertTriangle className="h-5 w-5" />,
            title: "Known Issues",
            description: "Platform constraints, unresolved bugs, workarounds. Prevent repeating past mistakes.",
          },
        ]} />

        <CodeBlock
          filename="data/project-state.ts (structure)"
          language="typescript"
          code={`export const ARCHITECTURE = {
  framework: "Next.js 16 (App Router)",
  totalFiles: 299,
  totalPages: 58,
  componentStructure: {
    atoms: "components/atoms/",
    molecules: "components/molecules/",
    organisms: "components/organisms/",
    pages: "app/",
  },
}

export const REVIEW_HISTORY = {
  totalReviews: 12,
  lastReview: "review-010",
  lastReviewDate: "2026-02-09",
}

export const KNOWN_ISSUES = {
  tarballDuplicateEntry: {
    severity: "critical",
    fix: "Start new session",
    prevention: "Max 15 file operations per session",
  },
}`}
        />

        {/* Section 6: Recovery Protocols */}
        <SectionHeader number="06" title="Recovery Protocols" id="recovery-protocols" />

        <p className="text-muted-foreground mb-6">
          When things go wrong (and they will), having documented recovery procedures saves hours.
          The critical principle: never attempt to fix platform-level errors within the session
          that caused them. Every additional operation makes it worse.
        </p>

        <DecisionTree
          title="Error Recovery Decision Tree"
          decisions={[
            { condition: "Tarball: 'Cannot open: File exists'", result: "STOP immediately. Do not touch files. Start new session.", recommended: true },
            { condition: "Wrong file edited", result: "Revert the edit in same session. Do not cascade fixes." },
            { condition: "Build failure (code error)", result: "Read error message. Fix the specific code issue." },
            { condition: "Build failure (platform error)", result: "Start new session. Platform errors resolve on session reset." },
            { condition: "Session timeout", result: "Update project-state with progress so far. Resume in new session." },
          ]}
        />

        <StatsTable
          headers={["Incident", "Root Cause", "Recovery Time", "Prevention"]}
          rows={[
            ["Tarball corruption (Review #9)", "25+ operations in one session", "1 session (restore 5 files)", "15-op budget enforced"],
            ["Wrong nav labels (Review #6)", "No rules file yet", "2 sessions to audit + fix", "Architecture rules added"],
            ["Stale code examples (Review #10)", "No content review process", "1 session to update", "3-axis review adopted"],
          ]}
        />

        {/* Section 7: Metrics */}
        <SectionHeader number="07" title="Metrics from 12 Sessions" id="metrics-from-12-sessions" />

        <MetricsGrid metrics={[
          { label: "Total Operations", value: "~135", description: "Across 12 sessions (avg 11/session)" },
          { label: "Files Created", value: "85+", description: "Components, pages, data files" },
          { label: "Platform Incidents", value: "2", description: "Both from exceeding operation budgets" },
          { label: "Recovery Time", value: "1 session", description: "Each incident resolved in next session" },
        ]} />

        <StatsTable
          headers={["Session", "Operations", "Focus Area", "Outcome"]}
          rows={[
            ["Sessions 1-3", "~40 ops", "Core pages, navigation, forms", "Foundation built"],
            ["Sessions 4-5", "~25 ops", "Content library, articles, tutorials", "Content system created"],
            ["Session 6", "~15 ops", "Nav reorganisation (role-based)", "4 audience sections"],
            ["Session 7", "25+ ops", "Large refactor attempt", "Tarball incident -- 5 files lost"],
            ["Session 8", "~12 ops", "Recovery + file restoration", "All files restored"],
            ["Sessions 9-12", "~43 ops", "Content creation, reviews, hardening", "Production-ready"],
          ]}
        />

        <InfoBox type="info">
          The tarball incident in Session 7 was the turning point. Before it, we had no operation
          budget. After it, we implemented the 15-operation limit and never had another platform
          failure. The cost of the incident (1 recovery session) paid for the prevention system
          many times over.
        </InfoBox>

        {/* Key Takeaway */}
        <SectionHeader number="08" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway
          points={[
            "AI assistants are deterministic tools operating in non-deterministic environments",
            "Session management patterns (budgets, rules, state, recovery) transform unpredictable sessions into repeatable processes",
            "The overhead is minimal (4 operations per session for orientation and handoff) but the reliability improvement is dramatic",
            "Always read before writing, always scope before starting, always hand off before stopping",
            "Document every failure mode -- the recovery protocol you write today saves hours tomorrow",
          ]}
        />

        <RelatedArticles articles={[
          { title: "Automated Code Review: Building a 3-Axis Quality System", slug: "three-axis-quality-review-system" },
          { title: "The Tarball Incident: When AI Tools Fail Silently", slug: "tarball-incident-ai-tool-failure" },
          { title: "Documentation as Architecture", slug: "documentation-as-architecture" },
          { title: "Refactoring for Maintainability", slug: "refactoring-for-maintainability" },
        ]} />
      </div>

      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
