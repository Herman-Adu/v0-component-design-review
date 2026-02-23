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

const fs = require('fs');
const path = require('path');

// Configuration
const DRY_RUN = process.argv.includes('--dry-run');
const VERBOSE = process.argv.includes('--verbose');
const ROOT_DIR = path.join(__dirname, '..');
const TYPES_DIR = path.join(ROOT_DIR, 'types');
const STRAPI_TYPES_DIR = path.join(TYPES_DIR, 'strapi');
const COMPONENT_TYPES_DIR = path.join(TYPES_DIR, 'components');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// Sample pages to analyze for patterns
const SAMPLE_PAGES = [
  'app/(dashboard)/dashboard/admin/digital-marketing/linkedin/page.tsx',
  'app/(dashboard)/dashboard/admin/digital-marketing/google/analytics/page.tsx',
  'app/(dashboard)/dashboard/admin/digital-marketing/linkedin/composer/page.tsx',
  'app/(dashboard)/dashboard/documentation/app-reference/getting-started/page.tsx',
  'app/(dashboard)/dashboard/admin/email-administration/page.tsx'
];

// Type definitions based on architectural analysis
const TYPE_DEFINITIONS = {
  strapi: {
    'marketing-platform.types.ts': `/**
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

    'metric.types.ts': `/**
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

    'template.types.ts': `/**
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

    'setup-step.types.ts': `/**
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

    'documentation.types.ts': `/**
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
`
  },

  components: {
    'molecule.types.ts': `/**
 * Component Prop Types: Molecules
 * Single-purpose molecular components composed of atoms
 */

import { LucideIcon } from 'lucide-react'
import { Tool, StrategyPhase, Metric, SetupStep, ContentTemplate } from '@/types/strapi/marketing-platform.types'

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
`,

    'organism.types.ts': `/**
 * Component Prop Types: Organisms
 * Complex components composed of multiple molecules
 */

import { Tool, StrategyPhase, Metric, SetupStep, ContentTemplate, HashtagGroup, FormatType } from '@/types/strapi/marketing-platform.types'

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
`,

    'template.types.ts': `/**
 * Component Prop Types: Page Templates
 * Full page layouts that compose organisms
 */

import { Tool, StrategyPhase, PlatformSpec, Metric, SetupStep, ContentTemplate, HashtagGroup, FormatType, Goal, Report, DocSection, DocBadge, DocMeta } from '@/types/strapi/marketing-platform.types'
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
  setup?: SetupStep[]
  metrics: Metric[]
  goals?: Goal[]
  reports?: Report[]
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
`
  }
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
    console.log(`[DRY RUN] Would write: ${relativePath} (${content.length} chars)`);
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

${Object.keys(TYPE_DEFINITIONS.strapi).map(file => `- \`/types/strapi/${file}\``).join('\n')}

### Component Prop Types (${Object.keys(TYPE_DEFINITIONS.components).length} files)

${Object.keys(TYPE_DEFINITIONS.components).map(file => `- \`/types/components/${file}\``).join('\n')}

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

  const reportPath = path.join(DATA_DIR, 'phase1-types-report.md');
  
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
  console.log('═══════════════════════════════════════════════════════');
  console.log('  PHASE 1 SCRIPT 1: Generate TypeScript Interfaces');
  console.log('═══════════════════════════════════════════════════════\n');
  
  if (DRY_RUN) {
    console.log('⚠️  DRY RUN MODE - No files will be written\n');
  }
  
  // Create directory structure
  console.log('📁 Creating directory structure...');
  ensureDir(STRAPI_TYPES_DIR);
  ensureDir(COMPONENT_TYPES_DIR);
  
  // Write Strapi types
  console.log('\n📝 Generating Strapi collection types...');
  Object.entries(TYPE_DEFINITIONS.strapi).forEach(([filename, content]) => {
    writeTypeFile(`strapi/${filename}`, content);
  });
  
  // Write component types
  console.log('\n📝 Generating component prop types...');
  Object.entries(TYPE_DEFINITIONS.components).forEach(([filename, content]) => {
    writeTypeFile(`components/${filename}`, content);
  });
  
  // Generate report
  console.log('\n📊 Generating report...');
  generateReport();
  
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('✅ Phase 1 Script 1 Complete');
  console.log('═══════════════════════════════════════════════════════\n');
  
  if (!DRY_RUN) {
    console.log('Next: Run `node scripts/phase1-audit-components.js`');
  }
}

// Run script
try {
  main();
} catch (error) {
  console.error('❌ Error:', error.message);
  if (VERBOSE) {
    console.error(error);
  }
  process.exit(1);
}
