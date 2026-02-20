"use client"

import type { CaseStudy } from "@/data/content-library/case-studies"
import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  StatsTable,
  MetricsGrid,
  BeforeAfterComparison,
  ComparisonCards,
  FeatureGrid,
  DataFlowDiagram,
  DecisionTree,
  VerticalFlow,
  StepFlow,
  ProcessFlow,
  NumberedList,
  ArticleIcons,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "incident", title: "The Incident", level: 2 },
  { id: "root-cause", title: "Root Cause Analysis", level: 2 },
  { id: "cascade", title: "Cascade of Errors", level: 2 },
  { id: "recovery", title: "Recovery Process", level: 2 },
  { id: "guard-system", title: "Guard System Design", level: 2 },
  { id: "prevention", title: "Prevention Protocol", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function TarballBuildFailureContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        {/* Section 1: The Incident */}
        <SectionHeader number="01" title="The Incident" id="incident" />

        <p className="text-muted-foreground mb-6">
          During Review #9 -- a multi-file navigation refactoring session -- the v0 preview
          build suddenly failed with <code className="text-accent">Cannot open: File exists</code>.
          The error appeared after ~25 file operations in a single session. The attempted recovery
          (deleting and recreating files) made things worse, ultimately resulting in 5 files being
          lost from the project.
        </p>

        <InfoBox type="warning" title="Critical Lesson">
          When you encounter &quot;Cannot open: File exists&quot; in v0, STOP IMMEDIATELY. Do not
          delete files. Do not recreate files. Do not make any more changes. Start a new session.
          The files on disk are correct -- only the tar archive is corrupted.
        </InfoBox>

        <MetricsGrid
          metrics={[
            { label: "Files Lost", value: "5", change: "permanently", positive: false },
            { label: "Session Ops", value: "25+", change: "exceeded limit", positive: false },
            { label: "Recovery Time", value: "2", change: "sessions", positive: false },
            { label: "Root Cause ID", value: "4hrs", change: "investigation", positive: false },
          ]}
        />

        {/* Section 2: Root Cause */}
        <SectionHeader number="02" title="Root Cause Analysis" id="root-cause" />

        <p className="text-muted-foreground mb-6">
          The v0 preview build system packages file changes into an incremental tar archive per
          session. Each Write, Edit, or Delete operation appends an entry to this archive. The tar
          format does NOT deduplicate entries for the same file path.
        </p>

        <DataFlowDiagram
          title="How the Tar Archive Works"
          nodes={[
            { label: "Write file.tsx", description: "Entry #1 in tar" },
            { label: "Edit file.tsx", description: "Entry #2 (same path)" },
            { label: "Edit file.tsx", description: "Entry #3 (same path)" },
            { label: "tar extract", description: "FAILS: duplicate entry" },
          ]}
        />

        <CodeBlock
          filename="Terminal output during extraction"
          language="bash"
          code={`tar: components/molecules/docs-sidebar.tsx: Cannot open: File exists
tar: components/molecules/nav-collapsible.tsx: Cannot open: File exists
tar: data/nav-data.ts: Cannot open: File exists
tar: Error is not recoverable: exiting now`}
        />

        <StatsTable
          title="Files with 3+ Operations (Triggered Error)"
          headers={["File", "Operations", "Sequence", "Result"]}
          rows={[
            ["docs-sidebar.tsx", "4", "Write -> Edit -> Edit -> Edit", "Duplicate entry"],
            ["nav-collapsible.tsx", "3", "Write -> Edit -> Edit", "Duplicate entry"],
            ["nav-data.ts", "5", "Write -> Edit -> Edit -> Edit -> Edit", "Duplicate entry"],
            ["layout.tsx", "3", "Edit -> Edit -> Edit", "Duplicate entry"],
            ["globals.css", "3", "Edit -> Edit -> Edit", "Duplicate entry"],
            ["sidebar.tsx", "3", "Delete -> Write -> Edit", "Entry lost"],
          ]}
        />

        {/* Section 3: Cascade */}
        <SectionHeader number="03" title="Cascade of Errors" id="cascade" />

        <p className="text-muted-foreground mb-6">
          The initial error was survivable -- the files on disk were correct, only the tar was
          corrupted. The catastrophic data loss came from the attempted in-session recovery.
        </p>

        <VerticalFlow
          title="Error Cascade Timeline"
          steps={[
            { title: "T+0: Build fails", description: "'Cannot open: File exists' in preview. Build halted." },
            { title: "T+5min: Wrong diagnosis", description: "Assumed file corruption. Decided to delete and recreate affected files." },
            { title: "T+10min: Delete operations", description: "Deleted 6 files to 'reset' them. Each delete adds another tar entry." },
            { title: "T+15min: Recreate fails", description: "Writing new files adds MORE duplicate entries. Tar now has 3-4 entries per file." },
            { title: "T+20min: Data loss", description: "5 files permanently lost. Tar archive too corrupted for recovery." },
            { title: "T+25min: Session abandoned", description: "Stopped all operations. Documented state for next session recovery." },
          ]}
        />

        <BeforeAfterComparison
          beforeTitle="What We Did (Wrong)"
          afterTitle="What We Should Have Done"
          beforeItems={[
            "Continued editing after error appeared",
            "Deleted files to 'fix' the tar",
            "Recreated files (adding more entries)",
            "Made 10+ more operations",
            "Lost 5 files permanently",
          ]}
          afterItems={[
            "STOP immediately on error",
            "Do NOT touch any files",
            "Document current state",
            "Start a new session (tar resets)",
            "Verify all files intact in new session",
          ]}
        />

        {/* Section 4: Recovery */}
        <SectionHeader number="04" title="Recovery Process" id="recovery" />

        <StepFlow
          title="Recovery Steps (Session 10)"
          steps={[
            { number: 1, title: "Inventory Lost Files", description: "Compared nav-data imports against on-disk files. Found 5 missing." },
            { number: 2, title: "Reconstruct from Memory", description: "Used code review log and conversation history to rebuild file contents." },
            { number: 3, title: "Write Replacements", description: "Created each lost file one at a time, verifying build after each write." },
            { number: 4, title: "Validate Navigation", description: "Confirmed all sidebar sections render. All 58 routes accessible." },
            { number: 5, title: "Document in Review Log", description: "Added full incident report to code-review-log.ts for future reference." },
          ]}
        />

        {/* Section 5: Guard System */}
        <SectionHeader number="05" title="Guard System Design" id="guard-system" />

        <p className="text-muted-foreground mb-6">
          Post-incident, we designed a three-layer guard system to prevent this class of failure
          from ever recurring. The system operates at session level, file level, and build level.
        </p>

        <FeatureGrid
          columns={3}
          features={[
            {
              icon: <ArticleIcons.Shield />,
              title: "Session Budget",
              description: "Hard limit of 15 file operations per session. Warning at 12. Automatic session close at 15.",
            },
            {
              icon: <ArticleIcons.Shield />,
              title: "File Edit Limit",
              description: "Maximum 2 Edit operations per individual file per session. Prevents tar duplicate entries.",
            },
            {
              icon: <ArticleIcons.Shield />,
              title: "State Persistence",
              description: "project-state.ts updated at session end. Review log captures all changes. No memory-dependent state.",
            },
          ]}
        />

        <ComparisonCards
          leftTitle="Rules File (v0-rules.md)"
          rightTitle="State File (project-state.ts)"
          leftItems={[
            "Session budget: max 15 ops",
            "Max 2 edits per file per session",
            "Tarball protection protocol",
            "3-axis review after major tasks",
            "Self-management between sessions",
          ]}
          rightItems={[
            "Current file counts and page counts",
            "Content conversion progress",
            "Review history summary",
            "Known issues documentation",
            "Session budget sizing guide",
          ]}
        />

        <DecisionTree
          title="Error Recovery Decision Tree"
          decisions={[
            { condition: "'Cannot open: File exists' in build?", result: "STOP. Do not touch files. Start new session.", recommended: true },
            { condition: "Wrong file edited?", result: "Revert the edit in same session. Do not cascade fixes." },
            { condition: "Build failure (code error)?", result: "Read error message. Fix the specific code issue." },
            { condition: "Build failure (platform error)?", result: "Start new session. Platform errors resolve on reset." },
            { condition: "Session timeout?", result: "Update project-state with progress. Resume in new session." },
          ]}
        />

        {/* Section 6: Prevention */}
        <SectionHeader number="06" title="Prevention Protocol" id="prevention" />

        <NumberedList
          title="Mandatory Session Discipline"
          items={[
            { title: "Count Every Operation", description: "Announce X/15 after every batch of tool calls. No exceptions." },
            { title: "One Major Refactor Per Session", description: "Split large tasks across 2-3 sessions. Never combine refactors." },
            { title: "Read Before Edit", description: "Always read the file before editing. Never guess at file contents." },
            { title: "Reserve 2 Ops for Close", description: "project-state + review-log updates are mandatory. Budget for them." },
            { title: "Never Fix Tar In-Session", description: "If 'File exists' appears, the session is over. Document and restart." },
          ]}
        />

        <ProcessFlow
          title="Session Lifecycle"
          steps={[
            { label: "Read Rules", sublabel: "v0-rules.md", color: "blue" },
            { label: "Read State", sublabel: "project-state.ts", color: "blue" },
            { label: "Announce Task", sublabel: "Est ops count" },
            { label: "Execute", sublabel: "Track ops" },
            { label: "Close Session", sublabel: "State + log", color: "green" },
          ]}
        />

        {/* Section 7: Results */}
        <SectionHeader number="07" title="Results & Metrics" id="results" />

        <MetricsGrid
          metrics={caseStudy.results.metrics.map(m => ({
            label: m.label,
            value: m.after,
            change: m.improvement,
            positive: true,
          }))}
        />

        {/* Takeaway */}
        <SectionHeader number="08" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          {caseStudy.keyTakeaway}
        </KeyTakeaway>

        <InfoBox type="tip" title="Universal Principle">
          This lesson applies beyond AI tools: never attempt recovery of a corrupted state using
          the same system that caused the corruption. Isolate, document, then fix from a clean
          starting point.
        </InfoBox>

        <RelatedArticles
          articles={[
            { title: "AI Session Management", href: "/dashboard/content-library/articles/ai-session-management", level: "Advanced" },
            { title: "Security Layer Implementation", href: "/dashboard/content-library/case-studies/security-layer-implementation", level: "Advanced" },
            { title: "Performance Budgets", href: "/dashboard/content-library/articles/performance-budgets", level: "Intermediate" },
          ]}
        />
      </article>

      {/* TOC Sidebar */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  )
}
