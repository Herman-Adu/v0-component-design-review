#!/usr/bin/env node

/**
 * Phase 2: Generate Global Atom Components
 *
 * Creates reusable atom-level components extracted from repeating patterns
 * identified in the Phase 1 audit (100 pages, 229 hardcoded arrays).
 *
 * Atoms generated (sorted by audit occurrence count):
 * 1. StatusBadge      - "Active", "Beta", "Coming Soon" badges (used across all tool cards)
 * 2. CategoryBadge    - Colored category/tag labels (platform focus badges)
 * 3. IconContainer    - Icon wrapper with accent color background (57+ platform headers)
 * 4. SectionHeading   - h1/h2/h3 with optional description (every page)
 * 5. SpecRow          - Label-value row for specs (5 platform spec sections)
 * 6. ChecklistRow     - Checkmark + text item (20 checklist patterns)
 * 7. MetricValue      - Label + value display (9 metrics-grid patterns)
 *
 * Run: node scripts/phase2-generate-atoms.js
 */

const fs = require("fs");
const path = require("path");

const ATOMS_DIR = path.join(process.cwd(), "components", "atoms");

// Ensure directory exists
if (!fs.existsSync(ATOMS_DIR)) {
  fs.mkdirSync(ATOMS_DIR, { recursive: true });
}

const atoms = {
  "status-badge.tsx": `import { cn } from "@/lib/utils"

const statusStyles = {
  Active: "bg-green-500/20 text-green-400 border-green-500/30",
  Beta: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  "Coming Soon": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Deprecated: "bg-red-500/20 text-red-400 border-red-500/30",
}

const sizeStyles = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
  lg: "px-2.5 py-1 text-sm",
}

interface StatusBadgeProps {
  status: keyof typeof statusStyles
  size?: "sm" | "md" | "lg"
  className?: string
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md font-medium border-0",
        statusStyles[status],
        sizeStyles[size],
        className
      )}
    >
      {status}
    </span>
  )
}
`,

  "category-badge.tsx": `import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  label: string
  colorClass?: string
  variant?: "default" | "outline" | "accent"
  className?: string
}

const variantStyles = {
  default: "bg-muted text-muted-foreground border border-border",
  outline: "bg-transparent text-foreground border border-border",
  accent: "", // Uses colorClass directly
}

export function CategoryBadge({
  label,
  colorClass,
  variant = "default",
  className,
}: CategoryBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        variant === "accent" && colorClass ? colorClass : variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
`,

  "icon-container.tsx": `import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

const sizeStyles = {
  sm: "w-7 h-7",
  md: "w-9 h-9",
  lg: "w-10 h-10",
}

const iconSizeStyles = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
}

interface IconContainerProps {
  icon: LucideIcon
  colorClass?: string
  size?: "sm" | "md" | "lg"
  withBorder?: boolean
  className?: string
}

/**
 * Reusable icon wrapper with accent-colored background.
 * 
 * Usage:
 *   <IconContainer icon={Share2} colorClass="bg-sky-500/10 text-sky-500" />
 *   <IconContainer icon={Mail} colorClass="bg-amber-500/10 text-amber-500" size="lg" withBorder />
 */
export function IconContainer({
  icon: Icon,
  colorClass = "bg-muted text-foreground",
  size = "md",
  withBorder = false,
  className,
}: IconContainerProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg shrink-0",
        sizeStyles[size],
        colorClass,
        withBorder && "border border-current/20",
        className
      )}
    >
      <Icon className={cn(iconSizeStyles[size])} />
    </div>
  )
}
`,

  "section-heading.tsx": `import { cn } from "@/lib/utils"

interface SectionHeadingProps {
  title: string
  description?: string
  level?: "h1" | "h2" | "h3"
  className?: string
}

const levelStyles = {
  h1: "text-3xl font-bold tracking-tight",
  h2: "text-xl font-semibold",
  h3: "text-sm font-semibold",
}

/**
 * Consistent section heading with optional description.
 * 
 * Usage:
 *   <SectionHeading title="LinkedIn Marketing" description="B2B presence" level="h1" />
 *   <SectionHeading title="Pages" level="h2" />
 */
export function SectionHeading({ title, description, level = "h2", className }: SectionHeadingProps) {
  const Tag = level

  return (
    <div className={cn(className)}>
      <Tag className={cn(levelStyles[level], "text-foreground text-balance")}>
        {title}
      </Tag>
      {description && (
        <p className="text-muted-foreground text-sm mt-1">{description}</p>
      )}
    </div>
  )
}
`,

  "spec-row.tsx": `import { cn } from "@/lib/utils"

interface SpecRowProps {
  spec: string
  value: string
  className?: string
}

/**
 * Label-value row used in platform specification cards.
 * Extracted from 5+ platform spec sections across LinkedIn, Google, Facebook, Twitter pages.
 * 
 * Usage:
 *   <SpecRow spec="Post character limit" value="3,000 characters" />
 */
export function SpecRow({ spec, value, className }: SpecRowProps) {
  return (
    <div className={cn("flex items-center justify-between text-xs", className)}>
      <span className="text-muted-foreground">{spec}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  )
}
`,

  "checklist-row.tsx": `import { CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChecklistRowProps {
  text: string
  checked?: boolean
  accentColorClass?: string
  className?: string
}

/**
 * Single checklist item with accent-colored check icon.
 * Extracted from 20 checklist patterns across dashboard pages.
 * 
 * Usage:
 *   <ChecklistRow text="Company page optimised" accentColorClass="text-sky-500" />
 *   <ChecklistRow text="SEO audit complete" checked={false} />
 */
export function ChecklistRow({
  text,
  checked = true,
  accentColorClass = "text-green-500",
  className,
}: ChecklistRowProps) {
  return (
    <div className={cn("flex items-center gap-2 text-sm", className)}>
      <CheckCircle2
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          checked ? accentColorClass : "text-muted-foreground/40"
        )}
      />
      <span className={cn("text-foreground", !checked && "text-muted-foreground")}>
        {text}
      </span>
    </div>
  )
}
`,

  "metric-value.tsx": `import { cn } from "@/lib/utils"

interface MetricValueProps {
  label: string
  value: string
  className?: string
}

/**
 * Simple label + value display for metric summaries.
 * Used in metric grids and summary cards across 9+ pages.
 * 
 * Usage:
 *   <MetricValue label="Total pages" value="100" />
 */
export function MetricValue({ label, value, className }: MetricValueProps) {
  return (
    <div className={cn("text-center", className)}>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  )
}
`,
};

// Write all atom files
let created = 0;
let skipped = 0;

for (const [filename, content] of Object.entries(atoms)) {
  const filePath = path.join(ATOMS_DIR, filename);

  // Don't overwrite existing atoms (callout, code-block, spoiler, etc.)
  if (fs.existsSync(filePath)) {
    console.log(`  SKIP: ${filename} (already exists)`);
    skipped++;
    continue;
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`  CREATE: components/atoms/${filename}`);
  created++;
}

// Create barrel export
const indexContent = `// Global Atoms - Auto-generated by Phase 2
// Do not edit manually - regenerate with: node scripts/phase2-generate-atoms.js

// Existing atoms
export { Callout } from "./callout"
export { CodeBlock } from "./code-block"
export { CodeExplanation } from "./code-explanation"
export { Spoiler } from "./spoiler"

// New atoms (Phase 2)
export { StatusBadge } from "./status-badge"
export { CategoryBadge } from "./category-badge"
export { IconContainer } from "./icon-container"
export { SectionHeading } from "./section-heading"
export { SpecRow } from "./spec-row"
export { ChecklistRow } from "./checklist-row"
export { MetricValue } from "./metric-value"
`;

fs.writeFileSync(path.join(ATOMS_DIR, "index.ts"), indexContent, "utf-8");
console.log(`  CREATE: components/atoms/index.ts`);

// Report
console.log(`\n--- Phase 2: Atoms Complete ---`);
console.log(`Created: ${created} new atoms`);
console.log(`Skipped: ${skipped} existing atoms`);
console.log(`Total atoms available: ${created + skipped + 4}`); // +4 for existing callout, code-block, code-explanation, spoiler
console.log(`Barrel export: components/atoms/index.ts`);
console.log(`\nNext: node scripts/phase2-generate-molecules.js`);
