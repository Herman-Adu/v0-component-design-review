#!/usr/bin/env node

/**
 * Phase 2: Generate Global Organism Components
 *
 * Creates reusable organism-level components that compose molecules/atoms into
 * section-level blocks. These are the largest repeating UI patterns from the audit.
 *
 * Organisms generated (sorted by audit occurrence count):
 * 1. ToolGrid             - 7 occurrences (grid of ToolCards)
 * 2. StrategyFlow         - 15 occurrences (row of StrategyPhaseCards)
 * 3. MetricsGrid          - 9 occurrences (metric definition cards in grid)
 * 4. ChecklistCard        - 20 occurrences (titled card with checklist items)
 * 5. PlatformSpecsCard    - 5 occurrences (spec rows in a card)
 *
 * Run: node scripts/phase2-generate-organisms.js
 */

const fs = require("fs");
const path = require("path");

const ORGANISMS_DIR = path.join(process.cwd(), "components", "organisms");

// Ensure directory exists
if (!fs.existsSync(ORGANISMS_DIR)) {
  fs.mkdirSync(ORGANISMS_DIR, { recursive: true });
}

const organisms = {
  "tool-grid.tsx": `import { ToolCard } from "@/components/molecules/tool-card"
import { SectionHeading } from "@/components/atoms/section-heading"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ToolItem {
  href: string
  icon: LucideIcon
  title: string
  description: string
  role?: string
  status?: "Active" | "Beta" | "Coming Soon"
}

interface ToolGridProps {
  title?: string
  tools: ToolItem[]
  accentColorClass?: string
  variant?: "compact" | "detailed"
  columns?: 2 | 3
  className?: string
}

/**
 * Grid of ToolCards with optional section heading.
 * Extracted from 7 platform overview pages (LinkedIn, Google, Facebook, Twitter, Admin).
 *
 * Usage:
 *   <ToolGrid
 *     title="Pages"
 *     tools={tools}
 *     accentColorClass="bg-sky-500/10 text-sky-500"
 *     variant="detailed"
 *     columns={2}
 *   />
 */
export function ToolGrid({
  title,
  tools,
  accentColorClass,
  variant = "detailed",
  columns = 2,
  className,
}: ToolGridProps) {
  const gridClass = variant === "compact"
    ? "grid gap-3 grid-cols-2 lg:grid-cols-3"
    : cn(
        "grid gap-4",
        columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
      )

  return (
    <div className={className}>
      {title && <SectionHeading title={title} level="h2" className="mb-4" />}
      <div className={gridClass}>
        {tools.map((tool) => (
          <ToolCard
            key={tool.href}
            {...tool}
            accentColorClass={accentColorClass}
            variant={variant}
          />
        ))}
      </div>
    </div>
  )
}
`,

  "strategy-flow.tsx": `import { StrategyPhaseCard } from "@/components/molecules/strategy-phase-card"
import { SectionHeading } from "@/components/atoms/section-heading"
import { cn } from "@/lib/utils"

interface StrategyPhase {
  title: string
  description: string
  items: string[]
}

interface StrategyFlowProps {
  title?: string
  phases: StrategyPhase[]
  accentColorClass?: string
  className?: string
}

/**
 * Row of strategy phase cards showing a multi-step process flow.
 * Extracted from 15 pages across all platform overviews.
 *
 * Usage:
 *   <StrategyFlow
 *     phases={strategy}
 *     accentColorClass="text-sky-500"
 *   />
 */
export function StrategyFlow({
  title,
  phases,
  accentColorClass,
  className,
}: StrategyFlowProps) {
  return (
    <div className={className}>
      {title && <SectionHeading title={title} level="h2" className="mb-4" />}
      <div className="responsive-grid-3">
        {phases.map((phase) => (
          <StrategyPhaseCard
            key={phase.title}
            {...phase}
            accentColorClass={accentColorClass}
          />
        ))}
      </div>
    </div>
  )
}
`,

  "metrics-grid.tsx": `import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SectionHeading } from "@/components/atoms/section-heading"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface MetricDefinition {
  title: string
  description: string
  target: string
  icon: LucideIcon
  category: string
}

interface MetricsGridProps {
  title?: string
  metrics: MetricDefinition[]
  accentColorClass?: string
  columns?: 2 | 3
  className?: string
}

const categoryColors: Record<string, string> = {
  Awareness: "bg-blue-500/20 text-blue-400",
  Reach: "bg-purple-500/20 text-purple-400",
  Engagement: "bg-green-500/20 text-green-400",
  Conversion: "bg-amber-500/20 text-amber-400",
  Targeting: "bg-sky-500/20 text-sky-400",
}

/**
 * Grid of metric definition cards with category badges.
 * Extracted from 9 analytics pages (LinkedIn, Google, Facebook, Twitter analytics).
 *
 * Usage:
 *   <MetricsGrid title="Key Metrics" metrics={keyMetrics} columns={3} />
 */
export function MetricsGrid({
  title,
  metrics,
  accentColorClass,
  columns = 3,
  className,
}: MetricsGridProps) {
  const gridClass = cn(
    "grid gap-4",
    columns === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2"
  )

  return (
    <div className={className}>
      {title && <SectionHeading title={title} level="h2" className="mb-4" />}
      <div className={gridClass}>
        {metrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title} className="border-border/50">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-4 w-4", accentColorClass ?? "text-foreground")} />
                    <p className="font-semibold text-foreground text-sm">{metric.title}</p>
                  </div>
                  <Badge
                    className={cn(
                      "border-0 text-[10px]",
                      categoryColors[metric.category] ?? "bg-muted text-muted-foreground"
                    )}
                  >
                    {metric.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  {metric.description}
                </p>
                <p className="text-xs text-foreground font-medium border-t border-border pt-3">
                  Target: {metric.target}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
`,

  "checklist-card.tsx": `import { Card, CardContent } from "@/components/ui/card"
import { ChecklistRow } from "@/components/atoms/checklist-row"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface ChecklistCardProps {
  title: string
  items: string[]
  accentColorClass?: string
  icon?: LucideIcon
  className?: string
}

/**
 * Card containing a titled checklist of items.
 * Extracted from 20 checklist patterns across platform pages.
 *
 * Usage:
 *   <ChecklistCard
 *     title="Profile Optimisation Checklist"
 *     items={["Professional headshot", "Keyword-rich headline"]}
 *     accentColorClass="text-sky-500"
 *   />
 */
export function ChecklistCard({
  title,
  items,
  accentColorClass = "text-green-500",
  icon: Icon,
  className,
}: ChecklistCardProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className={cn("h-4 w-4", accentColorClass)} />}
          <p className="font-semibold text-foreground text-sm">{title}</p>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <ChecklistRow key={item} text={item} accentColorClass={accentColorClass} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
`,

  "platform-specs-card.tsx": `import { Card, CardContent } from "@/components/ui/card"
import { SpecRow } from "@/components/atoms/spec-row"
import { cn } from "@/lib/utils"

interface Spec {
  spec: string
  value: string
}

interface PlatformSpecsCardProps {
  title?: string
  specs: Spec[]
  className?: string
}

/**
 * Card showing platform specifications as label-value pairs.
 * Extracted from 5 platform overview pages (LinkedIn, Google, Facebook, Twitter + content-strategy).
 *
 * Usage:
 *   <PlatformSpecsCard
 *     title="LinkedIn Platform Specifications"
 *     specs={[
 *       { spec: "Post character limit", value: "3,000 characters" },
 *       { spec: "Best posting times", value: "Tuesday-Thursday, 8-10am" },
 *     ]}
 *   />
 */
export function PlatformSpecsCard({ title, specs, className }: PlatformSpecsCardProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-5">
        {title && (
          <h3 className="text-sm font-semibold text-foreground mb-3">{title}</h3>
        )}
        <div className="space-y-2">
          {specs.map((item) => (
            <SpecRow key={item.spec} spec={item.spec} value={item.value} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
`,
};

// Write all organism files
let created = 0;
let skipped = 0;

for (const [filename, content] of Object.entries(organisms)) {
  const filePath = path.join(ORGANISMS_DIR, filename);

  // Don't overwrite existing organisms
  if (fs.existsSync(filePath)) {
    console.log(`  SKIP: ${filename} (already exists)`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`  CREATE: components/organisms/${filename}`);
  created++;
}

// Create barrel export
const existingOrganisms = ["multi-step-form-wrapper"];

let indexContent = `// Global Organisms - Auto-generated by Phase 2
// Do not edit manually - regenerate with: node scripts/phase2-generate-organisms.js

// Existing organisms
`;

for (const name of existingOrganisms) {
  const pascalName = name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  const filePath = path.join(ORGANISMS_DIR, `${name}.tsx`);
  if (fs.existsSync(filePath)) {
    indexContent += `export { ${pascalName} } from "./${name}"\n`;
  }
}

indexContent += `
// New organisms (Phase 2)
export { ToolGrid } from "./tool-grid"
export { StrategyFlow } from "./strategy-flow"
export { MetricsGrid } from "./metrics-grid"
export { ChecklistCard } from "./checklist-card"
export { PlatformSpecsCard } from "./platform-specs-card"
`;

fs.writeFileSync(path.join(ORGANISMS_DIR, "index.ts"), indexContent, "utf-8");
console.log(`  CREATE: components/organisms/index.ts`);

// Final summary report
console.log(`\n--- Phase 2: Organisms Complete ---`);
console.log(`Created: ${created} new organisms`);
console.log(`Skipped: ${skipped} existing organisms`);
console.log(`Barrel export: components/organisms/index.ts`);
console.log(`\n=== PHASE 2 SUMMARY ===`);
console.log(`Run all 3 scripts in order:`);
console.log(`  1. node scripts/phase2-generate-atoms.js`);
console.log(`  2. node scripts/phase2-generate-molecules.js`);
console.log(`  3. node scripts/phase2-generate-organisms.js`);
console.log(`\nTotal new components generated:`);
console.log(
  `  Atoms:     7  (StatusBadge, CategoryBadge, IconContainer, SectionHeading, SpecRow, ChecklistRow, MetricValue)`,
);
console.log(
  `  Molecules: 7  (PlatformHeader, BackNavigationCard, WhyPlatformCard, StrategyPhaseCard, ToolCard, ReportingCadenceCard, ContentComparisonTable)`,
);
console.log(
  `  Organisms: 5  (ToolGrid, StrategyFlow, MetricsGrid, ChecklistCard, PlatformSpecsCard)`,
);
console.log(`  TOTAL:    19  new shared components`);
console.log(
  `\nThese 19 components cover the top 13 repeating UI patterns from the audit:`,
);
console.log(`  platform-header (57), back-navigation (29), checklist (20),`);
console.log(`  tip-callout (16), strategy-flow (15), why-platform-card (13),`);
console.log(`  metrics-grid (9), reporting-cadence (8), tool-grid (7),`);
console.log(`  platform-specs (5), content-comparison-table (4)`);
console.log(`\nNext Phase: Phase 3 - Refactor pages to use these components`);
