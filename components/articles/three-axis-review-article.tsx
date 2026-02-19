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
  BeforeAfterComparison,
  ArchitectureDiagram,
  NumberedList,
  type TOCItem,
  ArticleIcons,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "evolution", title: "Evolution from Ad-Hoc to Systematic", level: 2 },
  { id: "three-axes", title: "The Three Axes", level: 2 },
  { id: "axis-1-code-quality", title: "Axis 1: Code Quality", level: 3 },
  { id: "axis-2-security", title: "Axis 2: Security", level: 3 },
  { id: "axis-3-architecture", title: "Axis 3: Architecture", level: 3 },
  { id: "severity-classification", title: "Severity Classification", level: 2 },
  { id: "review-process", title: "The Review Process", level: 2 },
  { id: "evolution-over-10-reviews", title: "Evolution Over 10 Reviews", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function ThreeAxisReviewArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="info">
          After 10 code reviews of this project, we refined our review process from &quot;check
          everything and hope for the best&quot; to a structured 3-axis system. Each axis targets
          a different risk category, uses different tools, and catches different classes of defects.
        </InfoBox>

        {/* Section 1: Evolution */}
        <SectionHeader number="01" title="Evolution from Ad-Hoc to Systematic" id="evolution" />

        <p className="text-muted-foreground mb-6">
          Our first reviews were unstructured -- we checked whatever came to mind, missed patterns,
          and frequently re-discovered the same issues in later sessions. The 3-axis model emerged
          from categorising every finding we had made and realising they fell into exactly three
          buckets: code quality, security, and architecture.
        </p>

        <BeforeAfterComparison
          before={{
            title: "Ad-Hoc Review (Reviews 1-5)",
            items: [
              "No checklist -- different things checked each time",
              "Findings not categorised by severity",
              "Same issues rediscovered across sessions",
              "No clear 'done' criteria for a review",
              "Review coverage varied wildly (20-80%)",
            ],
          }}
          after={{
            title: "3-Axis Review (Reviews 6-10)",
            items: [
              "Structured checklist per axis with clear criteria",
              "4-tier severity classification (Critical/High/Medium/Low)",
              "Findings logged with IDs for tracking",
              "Clear completion criteria: all 3 axes checked",
              "Consistent coverage (90%+) every review",
            ],
          }}
        />

        <MetricsGrid metrics={[
          { label: "Reviews Conducted", value: "10", description: "Across 12 AI coding sessions" },
          { label: "Total Findings", value: "67", description: "Across all reviews combined" },
          { label: "Critical Findings", value: "4", description: "Security + platform issues" },
          { label: "Resolution Rate", value: "94%", description: "63 of 67 findings resolved" },
        ]} />

        {/* Section 2: The Three Axes */}
        <SectionHeader number="02" title="The Three Axes" id="three-axes" />

        <ArchitectureDiagram
          title="3-Axis Review Model"
          layers={[
            {
              name: "Axis 1: Code Quality",
              items: ["TypeScript strictness", "Dead code removal", "Import hygiene", "Naming conventions", "File size limits"],
              color: "#3b82f6",
            },
            {
              name: "Axis 2: Security",
              items: ["XSS prevention", "Input validation", "Secret management", "Server action safety", "Rate limiting"],
              color: "#ef4444",
            },
            {
              name: "Axis 3: Architecture",
              items: ["Nav-route alignment", "Import resolution", "Label accuracy", "Atomic design compliance", "Code example currency"],
              color: "#22c55e",
            },
          ]}
        />

        <p className="text-muted-foreground mb-6">
          Each axis is independently valuable and independently runnable. A small CSS change only
          needs Axis 1. A new server action needs Axes 1 and 2. A new page needs all three.
          Match the review depth to the change scope.
        </p>

        {/* Axis 1 Detail */}
        <SubSectionHeader title="Axis 1: Code Quality" id="axis-1-code-quality" />

        <p className="text-muted-foreground mb-4">
          Code quality catches technical debt, readability issues, type safety violations, and
          dead code. These are the easiest to automate and the most common findings.
        </p>

        <CodeBlock
          filename="review-checklists/axis-1-code-quality.ts"
          language="typescript"
          code={`const CODE_QUALITY_CHECKS = [
  "No \`any\` types in new/modified files",
  "No console.log statements (except active [v0] debugging)",
  "No unused imports or dead code",
  "All icon imports resolve to valid lucide-react exports",
  "TypeScript strict mode compliance (no ts-ignore)",
  "Consistent naming: PascalCase components, camelCase functions",
  "No functions over 50 lines (extract or refactor)",
  "No files over 400 lines (split into components)",
]

// Automated detection:
// grep -r "any" --include="*.tsx" -l
// grep -r "console.log" --include="*.tsx" -l
// grep -r "ts-ignore" --include="*.ts" -l`}
        />

        <StatsTable
          headers={["Check", "Automated?", "Tool", "Findings (10 reviews)"]}
          rows={[
            ["any types", "Yes", "grep + TypeScript strict", "12 instances"],
            ["console.log", "Yes", "grep", "8 instances"],
            ["Unused imports", "Yes", "Biome / ESLint", "15 instances"],
            ["Invalid icon imports", "Yes", "grep + lucide manifest", "3 instances"],
            ["File size > 400 lines", "Yes", "wc -l", "6 files"],
            ["Naming conventions", "Partial", "grep + manual review", "4 instances"],
          ]}
        />

        {/* Axis 2 Detail */}
        <SubSectionHeader title="Axis 2: Security" id="axis-2-security" />

        <p className="text-muted-foreground mb-4">
          Security catches XSS vectors, injection points, missing validation, and exposed secrets.
          These findings are rarer but far more dangerous -- a single security issue can compromise
          the entire application.
        </p>

        <CodeBlock
          filename="review-checklists/axis-2-security.ts"
          language="typescript"
          code={`const SECURITY_CHECKS = [
  "No dangerouslySetInnerHTML without sanitisation",
  "No eval() or new Function()",
  "No hardcoded secrets or API keys",
  "No unvalidated user input rendered directly",
  "Server actions use Zod validation on ALL inputs",
  "Rate limiting on public-facing endpoints",
  "CSRF protection on form submissions",
  "Security headers configured (CSP, HSTS, X-Frame)",
]

// Critical finding example from Review #6:
// Server action accepted raw formData without validation
// Fix: Added Zod schema validation to all server actions
// Impact: Prevented potential injection attacks`}
        />

        <InfoBox type="warning">
          Security findings are always treated as Critical or High severity. Unlike code quality
          issues that degrade gradually, a single security vulnerability can be exploited immediately.
          Never defer security findings to &quot;when convenient.&quot;
        </InfoBox>

        {/* Axis 3 Detail */}
        <SubSectionHeader title="Axis 3: Architecture" id="axis-3-architecture" />

        <p className="text-muted-foreground mb-4">
          Architecture catches structural issues: broken navigation, stale labels, import resolution
          failures, and convention violations. These are the hardest to automate but catch the most
          impactful issues -- a broken nav link means an entire page is unreachable.
        </p>

        <CodeBlock
          filename="review-checklists/axis-3-architecture.ts"
          language="typescript"
          code={`const ARCHITECTURE_CHECKS = [
  "All nav routes have corresponding page.tsx files",
  "All imports resolve (grep paths, verify targets exist)",
  "Labels match current nav structure (no stale names)",
  "New pages follow atomic design hierarchy",
  "Code examples in docs reflect current codebase",
  "No circular dependencies between modules",
  "'use server' files only export async functions",
  "Layouts are Server Components unless absolutely necessary",
]

// Cross-reference approach:
// 1. Extract all href values from nav-data.ts
// 2. For each href, verify page.tsx exists at that path
// 3. For each page.tsx, verify it's reachable from nav
// 4. Flag orphaned pages and dead nav links`}
        />

        <DataFlowDiagram
          title="Architecture Verification Flow"
          nodes={[
            { id: "nav", label: "nav-data.ts", description: "Route definitions" },
            { id: "cross", label: "Cross-Reference", description: "Match routes to files" },
            { id: "pages", label: "page.tsx files", description: "On-disk pages" },
            { id: "report", label: "Findings Report", description: "Orphans + dead links" },
          ]}
          flow="horizontal"
        />

        {/* Section 3: Severity Classification */}
        <SectionHeader number="03" title="Severity Classification" id="severity-classification" />

        <p className="text-muted-foreground mb-6">
          Every finding gets a severity level that determines the response. This prevents the common
          anti-pattern of treating all findings equally and either fixing everything (burnout) or
          fixing nothing (accumulating debt).
        </p>

        <StatsTable
          headers={["Severity", "Criteria", "Response", "Example"]}
          rows={[
            ["Critical", "Security vulnerability or data loss", "Fix same session", "Rate limiting bypass, exposed API keys"],
            ["High", "Architecture violation causing systemic issues", "Fix next session", "'use server' exporting non-async values"],
            ["Medium", "Code quality affecting maintainability", "Fix within 2 sessions", "File over 800 lines, unused imports"],
            ["Low", "Style or convention inconsistency", "Fix when convenient", "Naming convention deviation"],
          ]}
        />

        <FeatureGrid columns={2} features={[
          {
            icon: <ArticleIcons.AlertTriangle className="h-5 w-5" />,
            title: "Critical + High = 25%",
            description: "Only 17 of 67 findings were Critical or High. But these 17 findings represented 80% of the risk.",
          },
          {
            icon: <ArticleIcons.CheckCircle className="h-5 w-5" />,
            title: "Medium + Low = 75%",
            description: "50 findings were Medium or Low. These were batched into maintenance sprints without urgency.",
          },
        ]} />

        {/* Section 4: Review Process */}
        <SectionHeader number="04" title="The Review Process" id="review-process" />

        <VerticalFlow steps={[
          {
            title: "Step 1: Automated Scanning",
            description: "Run grep-based checks for all three axes in parallel. Catches 60-70% of findings in minutes. Each axis has a defined set of grep patterns and cross-reference queries.",
          },
          {
            title: "Step 2: Manual Deep Review",
            description: "Focus on areas automated scanning cannot cover: business logic correctness, component composition patterns, error handling completeness, performance implications.",
          },
          {
            title: "Step 3: Finding Documentation",
            description: "Log every finding with: unique ID, severity, description, file location, and resolution status. This creates a searchable history for pattern detection.",
          },
          {
            title: "Step 4: Resolution Sprint",
            description: "Fix findings in severity order (Critical first). Verify EACH fix individually before moving to the next. Never batch fixes without per-fix verification.",
          },
        ]} />

        <InfoBox type="important">
          Lesson from Review 6a: We once tried to fix all findings in a single sprint without
          verifying between fixes. Three fixes introduced new bugs that were not caught until the
          next review. Now we verify after every individual fix -- the extra time is negligible
          compared to the cost of cascading errors.
        </InfoBox>

        {/* Section 5: Evolution */}
        <SectionHeader number="05" title="Evolution Over 10 Reviews" id="evolution-over-10-reviews" />

        <StatsTable
          headers={["Review", "Focus", "Key Finding", "Process Improvement"]}
          rows={[
            ["#1", "Code Quality", "6 pages over 800 lines", "Added file size threshold check"],
            ["#2", "Security", "Rate limiting bypass discovered", "Added Security axis to reviews"],
            ["#3", "Architecture", "'use server' export violations", "Added server file export audit"],
            ["#4", "Architecture", "Client layouts causing hydration errors", "Added layout Server Component audit"],
            ["#5", "Code Quality", "Duplicate provider instances in tree", "Added provider composition grep"],
            ["#6", "All 3 Axes", "Systemic boundary violations", "Formalised 3-axis model"],
            ["#6a", "Process", "Batch fix sprint introduced 3 new bugs", "Added per-fix verification rule"],
            ["#7-8", "Content", "Missing documentation coverage", "Added content gap tracking system"],
            ["#9", "Architecture", "Nav reorganisation needed (2 to 4 sections)", "Added nav-route cross-reference"],
            ["#10", "Recovery", "Tarball incident cleanup + restoration", "Added platform constraint checks"],
          ]}
        />

        <p className="text-muted-foreground mb-6">
          Each review made the process better. The system is self-improving: every new finding
          type gets added to the checklist, every new failure mode gets a recovery protocol,
          and every process mistake gets a prevention rule.
        </p>

        <DataFlowDiagram
          title="Review System Evolution"
          nodes={[
            { id: "finding", label: "New Finding Type", description: "Discovered in review" },
            { id: "checklist", label: "Checklist Updated", description: "Added to axis checks" },
            { id: "automation", label: "Automated Detection", description: "Grep pattern added" },
            { id: "prevention", label: "Future Prevention", description: "Caught automatically" },
          ]}
          flow="horizontal"
        />

        {/* Key Takeaway */}
        <SectionHeader number="06" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway
          points={[
            "The 3-axis model works because each axis is independently valuable and independently runnable",
            "Match review depth to change scope: CSS change = Axis 1 only, server action = Axes 1+2, new page = all 3",
            "Severity classification prevents both over-reaction (fixing everything) and under-reaction (fixing nothing)",
            "Always verify fixes individually -- never batch without per-fix verification",
            "The review system is self-improving: every finding type gets added to the checklist for future detection",
          ]}
        />

        <RelatedArticles articles={[
          { title: "Working with AI Assistants: Session Management and Quality Gates", slug: "ai-session-management-quality-gates" },
          { title: "The Tarball Incident: When AI Tools Fail Silently", slug: "tarball-incident-ai-tool-failure" },
          { title: "Testing Strategy for Modern Applications", slug: "testing-strategy-modern-applications" },
          { title: "CI/CD and Deployment Pipelines", slug: "cicd-deployment-pipelines" },
        ]} />
      </div>

      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
