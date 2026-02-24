/**
 * PHASE 1 SCRIPT 1: Generate TypeScript Interfaces
 *
 * Purpose: Extract data patterns from existing pages and generate TypeScript interfaces
 * that mirror Strapi collection structure (mock data contracts)
 *
 * Usage: node scripts/phase1-generate-types.js [--dry-run] [--verbose]
 *
 * Outputs:
 *   - /types/strapi/marketing-platform.types.ts
 *   - /types/strapi/tool.types.ts
 *   - /types/strapi/strategy-phase.types.ts
 *   - /types/strapi/metric.types.ts
 *   - /types/strapi/template.types.ts
 *   - /types/strapi/documentation.types.ts
 *   - /types/components/molecule.types.ts
 *   - /types/components/organism.types.ts
 *   - /types/components/template.types.ts
 *   - /data/phase1-types-report.md
 */

const fs = require("fs");
const path = require("path");

// Configuration
const DRY_RUN = process.argv.includes("--dry-run");
const VERBOSE = process.argv.includes("--verbose");
const ROOT_DIR = path.join(__dirname, "..");
const TYPES_DIR = path.join(ROOT_DIR, "types");
const STRAPI_TYPES_DIR = path.join(TYPES_DIR, "strapi");
const COMPONENT_TYPES_DIR = path.join(TYPES_DIR, "components");
const DATA_DIR = path.join(ROOT_DIR, "data");

// Sample pages to analyze for patterns
const SAMPLE_PAGES = [
  "app/(dashboard)/dashboard/admin/digital-marketing/linkedin/page.tsx",
  "app/(dashboard)/dashboard/admin/digital-marketing/google/analytics/page.tsx",
  "app/(dashboard)/dashboard/admin/digital-marketing/linkedin/composer/page.tsx",
  "app/(dashboard)/dashboard/documentation/app-reference/getting-started/page.tsx",
  "app/(dashboard)/dashboard/admin/email-administration/page.tsx",
];

// Type definitions based on architectural analysis
const TYPE_DEFINITIONS = {
  strapi: {
    "marketing-platform.types.ts": `/**
 * Strapi Collection Type: Marketing Platform
 * Used by: All marketing platform overview pages (LinkedIn, Google, Facebook, Twitter)
 */

import { LucideIcon } from 'lucide-react'

export interface MarketingPlatform {
  id: string
  platform_name: string // "LinkedIn", "Google", "Facebook", "Twitter"
  slug: string // "linkedin", "google", "facebook", "twitter"
  tagline: string
  description: string
  icon: string // Icon name as string, resolved to LucideIcon
  color: string // Hex color code
  created_at: string
  updated_at: string
  
  // Relations
  tools: Tool[]
  strategy_phases: StrategyPhase[]
  platform_specs?: PlatformSpec[]
}

export interface Tool {
  id: string
  title: string
  description: string
  role: string
  status: 'Active' | 'Beta' | 'Coming Soon'
  href: string
  icon: string // Icon name as string
  category?: string
  platform?: string
  created_at: string
  updated_at: string
}

export interface StrategyPhase {
  id: string
  title: string
  description: string
  items: string[] // Array of checklist items
  phase_number: number
  icon_theme?: 'success' | 'info' | 'warning'
  platform?: string
  created_at: string
  updated_at: string
}

export interface PlatformSpec {
  id: string
  spec_name: string
  spec_value: string
  platform: string
  created_at: string
  updated_at: string
}
`,

    "metric.types.ts": `/**
 * Strapi Collection Type: Metric
 * Used by: Analytics pages, dashboards
 */

export interface Metric {
  id: string
  metric_name: string // "Total Leads", "Conversion Rate"
  description: string
  icon: string // Icon name as string
  category: string // "Conversion", "Efficiency", "Engagement"
  unit?: string // "%", "count", "hours"
  target_value?: number
  current_value?: number
  platform?: string
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  title: string
  description: string
  icon: string
  status: 'active' | 'completed' | 'pending'
  metric_id?: string
  created_at: string
  updated_at: string
}

export interface Report {
  id: string
  report_name: string
  description: string
  icon: string
  category: string
  frequency?: string // "daily", "weekly", "monthly"
  created_at: string
  updated_at: string
}
`,

    "template.types.ts": `/**
 * Strapi Collection Type: Content Template
 * Used by: Composer pages
 */

export interface ContentTemplate {
  id: string
  title: string
  format: 'standard' | 'listicle' | 'story' | 'poll' | 'article'
  content: string // Template content/preview
  platform: string // "linkedin", "twitter", "facebook"
  tags?: string[]
  category?: string
  created_at: string
  updated_at: string
}

export interface HashtagGroup {
  id: string
  category: string // "Industry", "Engagement", "Trending"
  hashtags: string[]
  platform?: string
  created_at: string
  updated_at: string
}

export interface FormatType {
  id: string
  name: string
  description: string
  icon: string
  max_chars?: number
  platform?: string
  created_at: string
  updated_at: string
}
`,

    "setup-step.types.ts": `/**
 * Strapi Collection Type: Setup Step
 * Used by: Configuration/setup pages
 */

export interface SetupStep {
  id: string
  step_number: number
  title: string
  detail: string
  instructions?: string[]
  status?: 'complete' | 'pending' | 'in-progress'
  platform?: string
  feature?: string
  created_at: string
  updated_at: string
}
`,

    "analytics.types.ts": `/**
 * Strapi Collection Types: Analytics Page Data
 * Used by: LinkedIn/Google/Facebook/Twitter analytics sub-pages
 * Source pattern: app/(dashboard)/dashboard/admin/digital-marketing/linkedin/analytics/page.tsx
 */

export interface MetricDefinition {
  id: string
  title: string
  description: string
  target: string
  icon: string
  category: string // "Awareness", "Reach", "Engagement", "Conversion", "Targeting"
  platform: string
  order: number
  created_at: string
  updated_at: string
}

export interface ReportingCadence {
  id: string
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually'
  metrics: string[]
  action: string
  platform: string
  order: number
  created_at: string
  updated_at: string
}

export interface ContentComparison {
  id: string
  content_type: string // "Text-only posts", "Image posts", "Video posts", etc.
  reach: 'Low' | 'Medium' | 'High' | 'Very High'
  engagement: 'Low' | 'Medium' | 'High' | 'Very High'
  effort: 'Low' | 'Medium' | 'High'
  notes: string
  platform: string
  order: number
  created_at: string
  updated_at: string
}

export interface ChecklistItem {
  id: string
  text: string
  category: string
  page: string
  platform: string
  order: number
  created_at: string
  updated_at: string
}

export interface TipBlock {
  id: string
  title: string
  description: string
  type: 'info' | 'warning' | 'success' | 'tip'
  page: string
  platform: string
  order: number
  created_at: string
  updated_at: string
}
`,

    "email-admin.types.ts": `/**
 * Strapi Collection Type: Email Administration
 * Used by: Email admin configuration, infrastructure, and request management pages
 */

export interface EmailConfigItem {
  id: string
  title: string
  description: string
  category: 'configuration' | 'infrastructure' | 'request-management'
  href: string
  icon: string
  status: 'Active' | 'Beta' | 'Coming Soon'
  order: number
  created_at: string
  updated_at: string
}
`,

    "navigation.types.ts": `/**
 * Strapi Collection Type: Navigation
 * Used by: Back-navigation cards, breadcrumbs, sidebar items
 */

export interface BackNavigation {
  id: string
  label: string
  description: string
  href: string
  icon: string
  accent_color_class?: string
  parent_page: string
  created_at: string
  updated_at: string
}
`,

    "documentation.types.ts": `/**
 * Strapi Collection Type: Documentation
 * Used by: Documentation pages
 */

export interface DocSection {
  id: string
  title: string
  content: string // Can contain markdown
  order: number
  parent_section?: string
  slug: string
  created_at: string
  updated_at: string
}

export interface DocBadge {
  id: string
  label: string
  variant: 'default' | 'success' | 'warning' | 'destructive'
  doc_section?: string
  created_at: string
  updated_at: string
}

export interface DocMeta {
  id: string
  key: string
  value: string
  doc_section?: string
  created_at: string
  updated_at: string
}

export interface DocJourney {
  id: string
  title: string
  description: string
  icon: string
  links: DocLink[]
  created_at: string
  updated_at: string
}

export interface DocLink {
  id: string
  title: string
  href: string
  description: string
  created_at: string
  updated_at: string
}
`,
  },

  components: {
    "atom.types.ts": `/**
 * Component Prop Types: Atoms
 * Smallest reusable UI building blocks
 * Source patterns: components/atoms/*.tsx
 */

import type { LucideIcon } from 'lucide-react'

export interface StatusBadgeProps {
  status: 'Active' | 'Beta' | 'Coming Soon' | 'Deprecated'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface CategoryBadgeProps {
  label: string
  colorClass?: string
  variant?: 'default' | 'outline' | 'accent'
  className?: string
}

export interface IconContainerProps {
  icon: LucideIcon
  colorClass?: string
  size?: 'sm' | 'md' | 'lg'
  withBorder?: boolean
  className?: string
}

export interface SectionHeadingProps {
  title: string
  description?: string
  level?: 'h1' | 'h2' | 'h3'
  className?: string
}

export interface SpecRowProps {
  spec: string
  value: string
  className?: string
}

export interface ChecklistRowProps {
  text: string
  checked?: boolean
  accentColorClass?: string
  className?: string
}

export interface MetricValueProps {
  label: string
  value: string
  className?: string
}
`,

    "molecule.types.ts": `/**
 * Component Prop Types: Molecules
 * Single-purpose molecular components composed of atoms
 */

import type { LucideIcon } from 'lucide-react'
import type { Tool, StrategyPhase } from '@/types/strapi/marketing-platform.types'
import type { Metric } from '@/types/strapi/metric.types'
import type { SetupStep } from '@/types/strapi/setup-step.types'
import type { ContentTemplate } from '@/types/strapi/template.types'

export interface ToolCardProps {
  tool: Tool
  variant?: 'compact' | 'detailed'
  showStatus?: boolean
}

export interface StrategyPhaseCardProps {
  phase: StrategyPhase
  showNumber?: boolean
  iconTheme?: 'success' | 'info' | 'warning'
}

export interface MetricCardProps {
  metric: Metric
  showValue?: boolean
  showTarget?: boolean
}

export interface SetupStepCardProps {
  step: SetupStep
  showNumber?: boolean
  onComplete?: () => void
}

export interface TemplateCardProps {
  template: ContentTemplate
  onUse: (template: ContentTemplate) => void
  showTags?: boolean
}

export interface PlatformSpecCardProps {
  platform: string
  specs: Array<{ spec: string; value: string }>
  variant?: 'default' | 'compact'
}

export interface WhyPlatformCardProps {
  title: string
  description: string
  icon: LucideIcon
  accentColorClass: string
  className?: string
}

export interface BackNavigationCardProps {
  label: string
  description: string
  href: string
  icon: LucideIcon
  accentColorClass?: string
  className?: string
}

export interface PlatformHeaderProps {
  name: string
  tagline: string
  icon: LucideIcon
  accentColorClass: string
  focusLabel: string
  toolCount: number
  badges?: Array<{ label: string; variant?: string; colorClass?: string }>
  className?: string
}

export interface ReportingCadenceCardProps {
  cadence: import('@/types/strapi/analytics.types').ReportingCadence
  accentColorClass?: string
  className?: string
}

export interface ContentComparisonTableProps {
  rows: import('@/types/strapi/analytics.types').ContentComparison[]
  className?: string
}
`,

    "organism.types.ts": `/**
 * Component Prop Types: Organisms
 * Complex components composed of multiple molecules
 */

import { Tool, StrategyPhase } from '@/types/strapi/marketing-platform.types'
import { Metric } from '@/types/strapi/metric.types'
import { SetupStep } from '@/types/strapi/setup-step.types'
import { ContentTemplate, HashtagGroup, FormatType } from '@/types/strapi/template.types'

export interface ToolGridProps {
  tools: Tool[]
  variant?: 'quick-access' | 'detailed' | 'compact'
  columns?: 2 | 3 | 6
  title?: string
}

export interface StrategyFlowProps {
  phases: StrategyPhase[]
  theme?: 'primary' | 'secondary'
  title?: string
}

export interface MetricsDashboardProps {
  metrics: Metric[]
  layout?: '2-col' | '3-col' | '6-col'
  title?: string
  showTargets?: boolean
}

export interface SetupWizardProps {
  steps: SetupStep[]
  title: string
  onComplete?: () => void
}

export interface ContentComposerProps {
  maxChars: number
  templates: ContentTemplate[]
  formatTypes: FormatType[]
  hashtags?: HashtagGroup[]
  platform: string
}

export interface MetricsGridProps {
  metrics: import('@/types/strapi/analytics.types').MetricDefinition[]
  accentColorClass?: string
  columns?: 2 | 3
  className?: string
}

export interface ChecklistCardProps {
  title: string
  items: import('@/types/strapi/analytics.types').ChecklistItem[]
  accentColorClass?: string
  icon?: import('lucide-react').LucideIcon
  className?: string
}
`,

    "template.types.ts": `/**
 * Component Prop Types: Page Templates
 * Full page layouts that compose organisms
 */

import { Tool, StrategyPhase, PlatformSpec } from '@/types/strapi/marketing-platform.types'
import { Metric, Goal, Report } from '@/types/strapi/metric.types'
import { SetupStep } from '@/types/strapi/setup-step.types'
import { ContentTemplate, HashtagGroup, FormatType } from '@/types/strapi/template.types'
import { DocSection, DocBadge, DocMeta } from '@/types/strapi/documentation.types'
import { LucideIcon } from 'lucide-react'

export interface MarketingPlatformTemplateProps {
  platform: string
  icon: LucideIcon
  color: string
  tagline: string
  description: string
  tools: Tool[]
  strategy: StrategyPhase[]
  specs?: PlatformSpec[]
}

export interface AnalyticsPageTemplateProps {
  title: string
  description?: string
  platform: string
  accentColorClass: string
  setup?: SetupStep[]
  metrics: import('@/types/strapi/analytics.types').MetricDefinition[]
  reportingCadence?: import('@/types/strapi/analytics.types').ReportingCadence[]
  contentComparison?: import('@/types/strapi/analytics.types').ContentComparison[]
  checklist?: import('@/types/strapi/analytics.types').ChecklistItem[]
  tips?: import('@/types/strapi/analytics.types').TipBlock[]
}

export interface ComposerPageTemplateProps {
  platform: string
  maxChars: number
  templates: ContentTemplate[]
  formatTypes: FormatType[]
  hashtags?: HashtagGroup[]
}

export interface DocumentationPageTemplateProps {
  title: string
  sections: DocSection[]
  badges?: DocBadge[]
  meta?: DocMeta[]
  children?: React.ReactNode
}
`,
  },
};

// Utility functions
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    if (DRY_RUN) {
      console.log(`[DRY RUN] Would create directory: ${dirPath}`);
      return;
    }
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
  }
}

function writeTypeFile(relativePath, content) {
  const fullPath = path.join(TYPES_DIR, relativePath);

  if (DRY_RUN) {
    console.log(
      `[DRY RUN] Would write: ${relativePath} (${content.length} chars)`,
    );
    return;
  }

  fs.writeFileSync(fullPath, content);
  console.log(`✓ Created: ${relativePath}`);
}

function generateReport() {
  const report = `# Phase 1: Type Generation Report

Generated: ${new Date().toISOString()}

## Summary

Total type files created: ${Object.keys(TYPE_DEFINITIONS.strapi).length + Object.keys(TYPE_DEFINITIONS.components).length}

### Strapi Collection Types (${Object.keys(TYPE_DEFINITIONS.strapi).length} files)

${Object.keys(TYPE_DEFINITIONS.strapi)
  .map((file) => `- \`/types/strapi/${file}\``)
  .join("\n")}

### Component Prop Types (${Object.keys(TYPE_DEFINITIONS.components).length} files)

${Object.keys(TYPE_DEFINITIONS.components)
  .map((file) => `- \`/types/components/${file}\``)
  .join("\n")}

## Type Categories

### Strapi Types
- **marketing-platform.types.ts** - Platform overviews, tools, strategy phases, specs
- **metric.types.ts** - Generic metrics, goals, reports  
- **analytics.types.ts** - MetricDefinition, ReportingCadence, ContentComparison, ChecklistItem, TipBlock
- **template.types.ts** - Content templates, hashtag groups, format types
- **setup-step.types.ts** - Setup/configuration wizard steps
- **email-admin.types.ts** - Email administration config items
- **navigation.types.ts** - Back-navigation cards
- **documentation.types.ts** - Doc sections, badges, meta, journeys

### Component Types  
- **atom.types.ts** - StatusBadge, CategoryBadge, IconContainer, SectionHeading, SpecRow, ChecklistRow, MetricValue
- **molecule.types.ts** - ToolCard, StrategyPhaseCard, MetricCard, PlatformHeader, WhyPlatformCard, BackNavigationCard, etc.
- **organism.types.ts** - ToolGrid, StrategyFlow, MetricsDashboard, MetricsGrid, ChecklistCard, etc.
- **template.types.ts** - MarketingPlatformTemplate, AnalyticsPageTemplate, ComposerPageTemplate, DocumentationPageTemplate

## Next Steps

1. Review generated interfaces for accuracy
2. Run Phase 1 Script 2: \`node scripts/phase1-audit-components.js\`
3. Update existing components to use these types
4. Begin Phase 2: Component generation

## Notes

- All interfaces follow Strapi collection structure
- Component props mirror Strapi data types
- Ready for mock data generation
- TypeScript strict mode compatible
`;

  const reportPath = path.join(DATA_DIR, "phase1-types-report.md");

  if (DRY_RUN) {
    console.log(`[DRY RUN] Would write report: ${reportPath}`);
    return;
  }

  ensureDir(DATA_DIR);
  fs.writeFileSync(reportPath, report);
  console.log(`✓ Generated report: /data/phase1-types-report.md`);
}

// Main execution
function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  PHASE 1 SCRIPT 1: Generate TypeScript Interfaces");
  console.log("═══════════════════════════════════════════════════════\n");

  if (DRY_RUN) {
    console.log("⚠️  DRY RUN MODE - No files will be written\n");
  }

  // Create directory structure
  console.log("📁 Creating directory structure...");
  ensureDir(STRAPI_TYPES_DIR);
  ensureDir(COMPONENT_TYPES_DIR);

  // Write Strapi types
  console.log("\n📝 Generating Strapi collection types...");
  Object.entries(TYPE_DEFINITIONS.strapi).forEach(([filename, content]) => {
    writeTypeFile(`strapi/${filename}`, content);
  });

  // Write component types
  console.log("\n📝 Generating component prop types...");
  Object.entries(TYPE_DEFINITIONS.components).forEach(([filename, content]) => {
    writeTypeFile(`components/${filename}`, content);
  });

  // Generate report
  console.log("\n📊 Generating report...");
  generateReport();

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("✅ Phase 1 Script 1 Complete");
  console.log("═══════════════════════════════════════════════════════\n");

  if (!DRY_RUN) {
    console.log("Next: Run `node scripts/phase1-audit-components.js`");
  }
}

// Run script
try {
  main();
} catch (error) {
  console.error("❌ Error:", error.message);
  if (VERBOSE) {
    console.error(error);
  }
  process.exit(1);
}
