#!/usr/bin/env node

/**
 * Phase 2: Generate Global Molecule Components
 *
 * Creates reusable molecule-level components composed of atoms.
 * Sorted by audit occurrence count for maximum refactoring impact.
 *
 * Molecules generated:
 * 1. PlatformHeader          - 57 occurrences (highest impact)
 * 2. BackNavigationCard      - 29 occurrences
 * 3. WhyPlatformCard         - 13 occurrences
 * 4. StrategyPhaseCard       - 15 occurrences (used in strategy-flow)
 * 5. ToolCard                - 7 occurrences (tool-grid items)
 * 6. ReportingCadenceCard    - 8 occurrences
 * 7. ContentComparisonTable  - 4 occurrences
 *
 * Run: node scripts/phase2-generate-molecules.js
 */

const fs = require("fs");
const path = require("path");

const MOLECULES_DIR = path.join(process.cwd(), "components", "molecules");

// Ensure directory exists
if (!fs.existsSync(MOLECULES_DIR)) {
  fs.mkdirSync(MOLECULES_DIR, { recursive: true });
}

const molecules = {
  "platform-header.tsx": `import { Badge } from "@/components/ui/badge"
import { IconContainer } from "@/components/atoms/icon-container"
import { SectionHeading } from "@/components/atoms/section-heading"
import type { LucideIcon } from "lucide-react"

interface PlatformHeaderBadge {
  label: string
  colorClass?: string
  variant?: "default" | "outline"
}

interface PlatformHeaderProps {
  name: string
  tagline: string
  icon: LucideIcon
  accentColorClass: string
  badges?: PlatformHeaderBadge[]
  className?: string
}

/**
 * Page header with platform icon, title, tagline, and badges.
 * Extracted from 57 pages across digital marketing, email admin, and documentation.
 *
 * Usage:
 *   <PlatformHeader
 *     name="LinkedIn Marketing"
 *     tagline="Professional B2B presence and thought leadership"
 *     icon={Share2}
 *     accentColorClass="bg-sky-500/10 text-sky-500"
 *     badges={[
 *       { label: "5 Tools", variant: "outline" },
 *       { label: "B2B Focus", colorClass: "bg-sky-500/20 text-sky-400" },
 *     ]}
 *   />
 */
export function PlatformHeader({
  name,
  tagline,
  icon,
  accentColorClass,
  badges,
  className,
}: PlatformHeaderProps) {
  return (
    <div className={className}>
      <div className="flex items-center gap-3 mb-2">
        <IconContainer icon={icon} colorClass={accentColorClass} size="lg" withBorder />
        <SectionHeading title={name} description={tagline} level="h1" />
      </div>
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {badges.map((badge) => (
            <Badge
              key={badge.label}
              variant={badge.variant === "outline" ? "outline" : "default"}
              className={badge.colorClass ? \`\${badge.colorClass} border-0\` : undefined}
            >
              {badge.label}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
`,

  "back-navigation-card.tsx": `import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconContainer } from "@/components/atoms/icon-container"
import type { LucideIcon } from "lucide-react"

interface BackNavigationCardProps {
  label: string
  description: string
  href: string
  icon: LucideIcon
  accentColorClass?: string
  className?: string
}

/**
 * Navigation card linking back to parent section.
 * Extracted from 29 sub-pages across digital marketing platform pages.
 *
 * Usage:
 *   <BackNavigationCard
 *     label="Back to Digital Marketing"
 *     description="Explore other platforms and tools."
 *     href="/dashboard/admin/digital-marketing"
 *     icon={Megaphone}
 *     accentColorClass="bg-accent/10 text-accent"
 *   />
 */
export function BackNavigationCard({
  label,
  description,
  href,
  icon,
  accentColorClass = "bg-accent/10 text-accent",
  className,
}: BackNavigationCardProps) {
  return (
    <Card className={className ?? "border-border/50"}>
      <CardContent className="flex items-center justify-between p-5 gap-4">
        <div className="flex items-center gap-4">
          <IconContainer icon={icon} colorClass={accentColorClass} size="lg" />
          <div>
            <p className="text-sm font-medium text-foreground">{label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="bg-transparent" asChild>
          <Link href={href}>
            Overview <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
`,

  "why-platform-card.tsx": `import { Card, CardContent } from "@/components/ui/card"
import { IconContainer } from "@/components/atoms/icon-container"
import type { LucideIcon } from "lucide-react"

interface WhyPlatformCardProps {
  title: string
  description: string
  icon: LucideIcon
  accentColorClass: string
  className?: string
}

/**
 * Highlighted card explaining why a platform matters for the business.
 * Extracted from 13 platform overview pages.
 *
 * Usage:
 *   <WhyPlatformCard
 *     title="Why LinkedIn for Electrical Services?"
 *     description="LinkedIn is the primary platform for reaching commercial clients..."
 *     icon={Share2}
 *     accentColorClass="sky"
 *   />
 *
 * Note: accentColorClass should be the color name (e.g. "sky", "blue", "amber").
 * The component builds the full Tailwind classes from the color name.
 */
export function WhyPlatformCard({
  title,
  description,
  icon,
  accentColorClass,
  className,
}: WhyPlatformCardProps) {
  const borderClass = \`border-\${accentColorClass}-500/20\`
  const bgClass = \`bg-\${accentColorClass}-500/5\`
  const iconBgClass = \`bg-\${accentColorClass}-500/10\`
  const iconTextClass = \`text-\${accentColorClass}-400\`

  return (
    <Card className={className ?? \`\${borderClass} \${bgClass}\`}>
      <CardContent className="flex gap-4 p-5">
        <IconContainer
          icon={icon}
          colorClass={\`\${iconBgClass} \${iconTextClass}\`}
          size="md"
        />
        <div>
          <p className="text-sm font-medium text-foreground">{title}</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
`,

  "strategy-phase-card.tsx": `import { Card, CardContent } from "@/components/ui/card"
import { ChecklistRow } from "@/components/atoms/checklist-row"

interface StrategyPhaseCardProps {
  title: string
  description: string
  items: string[]
  accentColorClass?: string
  className?: string
}

/**
 * Strategy phase card showing phase title, description, and checklist items.
 * Extracted from 15 strategy-flow sections across platform pages.
 *
 * Usage:
 *   <StrategyPhaseCard
 *     title="Establish Authority"
 *     description="Build credibility with a polished profile"
 *     items={["Company Page", "Article Publisher"]}
 *     accentColorClass="text-sky-500"
 *   />
 */
export function StrategyPhaseCard({
  title,
  description,
  items,
  accentColorClass = "text-green-500",
  className,
}: StrategyPhaseCardProps) {
  return (
    <Card className={className ?? "border-border/50"}>
      <CardContent className="p-5">
        <p className="text-lg font-semibold text-foreground mb-1">{title}</p>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
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

  "tool-card.tsx": `import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconContainer } from "@/components/atoms/icon-container"
import { StatusBadge } from "@/components/atoms/status-badge"
import type { LucideIcon } from "lucide-react"

interface ToolCardProps {
  href: string
  icon: LucideIcon
  title: string
  description: string
  role?: string
  status?: "Active" | "Beta" | "Coming Soon"
  accentColorClass?: string
  variant?: "compact" | "detailed"
  className?: string
}

/**
 * Card for a tool/feature with navigation link.
 * Extracted from 7 tool-grid sections across platform overview pages.
 * 
 * Variants:
 * - compact: Icon + title + role + arrow (used in quick-access grids)
 * - detailed: Full card with description and status badge
 *
 * Usage:
 *   <ToolCard
 *     href="/dashboard/admin/digital-marketing/linkedin/composer"
 *     icon={PenSquare}
 *     title="Post Composer"
 *     description="Professional post composer with 3,000-character support"
 *     role="Content Creator"
 *     status="Active"
 *     variant="detailed"
 *   />
 */
export function ToolCard({
  href,
  icon,
  title,
  description,
  role,
  status = "Active",
  accentColorClass = "bg-muted text-foreground",
  variant = "detailed",
  className,
}: ToolCardProps) {
  if (variant === "compact") {
    return (
      <Card className={className ?? "border-border/50"}>
        <CardContent className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <IconContainer icon={icon} colorClass={accentColorClass} size="md" />
            <div className="min-w-0">
              <p className="font-semibold text-foreground text-sm truncate">{title}</p>
              {role && <p className="text-[10px] text-muted-foreground truncate">{role}</p>}
            </div>
          </div>
          <Button size="sm" variant="ghost" className="shrink-0 h-8 w-8 p-0" asChild>
            <Link href={href}>
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">Open {title}</span>
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className ?? "border-border/50"}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <IconContainer icon={icon} colorClass="bg-muted text-foreground" size="md" />
            <div>
              <p className="font-semibold text-foreground text-sm">{title}</p>
              {role && <p className="text-[10px] text-muted-foreground">{role}</p>}
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{description}</p>
        <Button variant="outline" size="sm" className="bg-transparent" asChild>
          <Link href={href}>
            Open <ArrowRight className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
`,

  "reporting-cadence-card.tsx": `import { Card, CardContent } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReportingCadenceCardProps {
  frequency: string
  metrics: string[]
  action: string
  accentColorClass?: string
  className?: string
}

/**
 * Reporting cadence card showing frequency, metrics to track, and recommended action.
 * Extracted from 8 analytics/reporting sections.
 *
 * Usage:
 *   <ReportingCadenceCard
 *     frequency="Weekly"
 *     metrics={["Post impressions", "Engagement rate", "New followers"]}
 *     action="Identify top-performing content of the week."
 *   />
 */
export function ReportingCadenceCard({
  frequency,
  metrics,
  action,
  accentColorClass = "text-sky-500",
  className,
}: ReportingCadenceCardProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Clock className={cn("h-4 w-4", accentColorClass)} />
          <p className="font-semibold text-foreground text-sm">{frequency}</p>
        </div>
        <div className="space-y-1 mb-3">
          {metrics.map((metric) => (
            <p key={metric} className="text-xs text-muted-foreground">
              {metric}
            </p>
          ))}
        </div>
        <p className="text-xs text-foreground font-medium border-t border-border pt-3">
          {action}
        </p>
      </CardContent>
    </Card>
  )
}
`,

  "content-comparison-table.tsx": `import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface ContentComparisonRow {
  content_type: string
  reach: "Low" | "Medium" | "High" | "Very High"
  engagement: "Low" | "Medium" | "High" | "Very High"
  effort: "Low" | "Medium" | "High"
  notes: string
}

interface ContentComparisonTableProps {
  rows: ContentComparisonRow[]
  className?: string
}

const levelColors = {
  Low: "bg-red-500/20 text-red-400",
  Medium: "bg-amber-500/20 text-amber-400",
  High: "bg-green-500/20 text-green-400",
  "Very High": "bg-emerald-500/20 text-emerald-400",
}

/**
 * Content comparison table showing reach, engagement, and effort per content type.
 * Extracted from 4 analytics sub-pages.
 *
 * Usage:
 *   <ContentComparisonTable rows={contentComparison} />
 */
export function ContentComparisonTable({ rows, className }: ContentComparisonTableProps) {
  return (
    <Card className={cn("border-border/50", className)}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 text-muted-foreground font-medium">Content Type</th>
                <th className="text-center p-3 text-muted-foreground font-medium">Reach</th>
                <th className="text-center p-3 text-muted-foreground font-medium">Engagement</th>
                <th className="text-center p-3 text-muted-foreground font-medium">Effort</th>
                <th className="text-left p-3 text-muted-foreground font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.content_type} className="border-b border-border/50 last:border-0">
                  <td className="p-3 font-medium text-foreground">{row.content_type}</td>
                  <td className="p-3 text-center">
                    <Badge className={cn("border-0 text-[10px]", levelColors[row.reach])}>
                      {row.reach}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge className={cn("border-0 text-[10px]", levelColors[row.engagement])}>
                      {row.engagement}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Badge className={cn("border-0 text-[10px]", levelColors[row.effort])}>
                      {row.effort}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
`,
};

// Write all molecule files
let created = 0;
let skipped = 0;

for (const [filename, content] of Object.entries(molecules)) {
  const filePath = path.join(MOLECULES_DIR, filename);

  // Don't overwrite existing molecules
  if (fs.existsSync(filePath)) {
    console.log(`  SKIP: ${filename} (already exists)`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`  CREATE: components/molecules/${filename}`);
  created++;
}

// Create barrel export (append to existing if present)
const existingMolecules = [
  "article-components",
  "content-card",
  "dashboard-shell",
  "doc-page-layout",
  "doc-page",
  "docs-sidebar",
  "form-navigation",
  "form-progress-indicator",
  "form-step-container",
  "location-map-card",
  "navbar",
  "office-hours-card",
  "quick-contact-card",
  "sidebar-skeleton",
  "step-indicator",
];

let indexContent = `// Global Molecules - Auto-generated by Phase 2
// Do not edit manually - regenerate with: node scripts/phase2-generate-molecules.js

// Existing molecules
`;

for (const name of existingMolecules) {
  const filePath = path.join(MOLECULES_DIR, `${name}.tsx`);
  if (fs.existsSync(filePath)) {
    // Special handling for article-components which exports multiple named exports
    if (name === "article-components") {
      indexContent += `export {
  TableOfContents,
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
  VerticalFlow,
  ComparisonCards,
  BeforeAfterComparison,
  CodeBlock,
  FileTree,
  ArchitectureDiagram,
  FeatureGrid,
  MetricsGrid,
  DataFlowDiagram,
  DecisionTree,
  KeyTakeaway,
  RelatedArticles,
  StatsTable,
  NumberedList,
  ProcessFlow,
  type TOCItem,
} from "./${name}"\n`;
    } else {
      const pascalName = name
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
      indexContent += `export { ${pascalName} } from "./${name}"\n`;
    }
  }
}

indexContent += `
// New molecules (Phase 2)
export { PlatformHeader } from "./platform-header"
export { BackNavigationCard } from "./back-navigation-card"
export { WhyPlatformCard } from "./why-platform-card"
export { StrategyPhaseCard } from "./strategy-phase-card"
export { ToolCard } from "./tool-card"
export { ReportingCadenceCard } from "./reporting-cadence-card"
export { ContentComparisonTable } from "./content-comparison-table"
`;

fs.writeFileSync(path.join(MOLECULES_DIR, "index.ts"), indexContent, "utf-8");
console.log(`  CREATE: components/molecules/index.ts`);

// Report
console.log(`\n--- Phase 2: Molecules Complete ---`);
console.log(`Created: ${created} new molecules`);
console.log(`Skipped: ${skipped} existing molecules`);
console.log(`Barrel export: components/molecules/index.ts`);
console.log(`\nNext: node scripts/phase2-generate-organisms.js`);
