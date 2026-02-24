#!/usr/bin/env node

/**
 * Phase 3 - Generate Template Components
 * Creates 5 template/layout components that compose organisms
 * Templates are page-level wrappers that manage layout and data flow
 * 
 * Files to generate:
 * 1. components/templates/template-marketing-platform.tsx
 * 2. components/templates/template-analytics.tsx
 * 3. components/templates/template-composer.tsx
 * 4. components/templates/template-documentation.tsx
 * 5. components/templates/template-email-admin.tsx
 */

const fs = require('fs')
const path = require('path')

const OUTPUT_DIR = path.join(process.cwd(), 'components', 'templates')

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const templates = {
  'template-marketing-platform.tsx': `"use client"

import type React from "react"
import type { Tool, StrategyPhase } from "@/types/strapi/marketing-platform.types"

interface TemplateMarketingPlatformProps {
  title: string
  tagline: string
  platform: string
  accentColor: string
  platformTools: Tool[]
  strategyPhases: StrategyPhase[]
  children?: React.ReactNode
}

export function TemplateMarketingPlatform({
  title,
  tagline,
  platform,
  accentColor,
  platformTools,
  strategyPhases,
  children,
}: TemplateMarketingPlatformProps) {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{title}</h1>
            <p className="text-lg text-muted-foreground mt-2">{tagline}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {children}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <nav className="space-y-2">
                {platformTools.slice(0, 5).map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.href}
                    className="block text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    {tool.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}`,

  'template-analytics.tsx': `"use client"

import type React from "react"
import type { MetricDefinition, ReportingCadence, ContentComparison } from "@/types/strapi/analytics.types"

interface TemplateAnalyticsProps {
  title: string
  description?: string
  platform: string
  accentColor: string
  metrics: MetricDefinition[]
  reportingCadence?: ReportingCadence[]
  contentComparison?: ContentComparison[]
  children?: React.ReactNode
}

export function TemplateAnalytics({
  title,
  description,
  platform,
  accentColor,
  metrics,
  reportingCadence,
  contentComparison,
  children,
}: TemplateAnalyticsProps) {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>

        {/* Metrics Grid */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{metric.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  )
}`,

  'template-composer.tsx': `"use client"

import type React from "react"
import type { ContentTemplate } from "@/types/strapi/marketing-platform.types"

interface TemplateComposerProps {
  platform: string
  maxCharacters: number
  templates: ContentTemplate[]
  onCompose?: (content: string) => void
  children?: React.ReactNode
}

export function TemplateComposer({
  platform,
  maxCharacters,
  templates,
  onCompose,
  children,
}: TemplateComposerProps) {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Composer Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Content Composer</h1>
            <p className="text-muted-foreground">
              Create optimized content for {platform} ({maxCharacters} characters max)
            </p>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">{children}</div>

            {/* Templates Sidebar */}
            <aside className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold text-foreground mb-4">Templates</h3>
                <div className="space-y-2">
                  {templates.slice(0, 5).map((template) => (
                    <button
                      key={template.id}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm border border-border hover:bg-accent/10 transition-colors"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}`,

  'template-documentation.tsx': `"use client"

import type React from "react"
import type { DocumentationSection } from "@/types/strapi/documentation.types"

interface TemplateDocumentationProps {
  title: string
  breadcrumbs?: Array<{ label: string; href: string }>
  sections: DocumentationSection[]
  tableOfContents?: boolean
  children?: React.ReactNode
}

export function TemplateDocumentation({
  title,
  breadcrumbs,
  sections,
  tableOfContents = true,
  children,
}: TemplateDocumentationProps) {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 mb-8 text-sm text-muted-foreground">
            {breadcrumbs.map((crumb, idx) => (
              <div key={crumb.href} className="flex items-center gap-2">
                <a href={crumb.href} className="hover:text-foreground transition-colors">
                  {crumb.label}
                </a>
                {idx < breadcrumbs.length - 1 && <span>/</span>}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* TOC */}
          {tableOfContents && sections.length > 0 && (
            <aside className="lg:col-span-1">
              <nav className="sticky top-4 rounded-lg border border-border bg-card p-4 space-y-2">
                <h3 className="font-semibold text-sm text-foreground mb-4">On this page</h3>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>
          )}

          {/* Main Content */}
          <main className="lg:col-span-3">
            <article className="prose prose-sm dark:prose-invert max-w-none">
              <h1 className="text-4xl font-bold text-foreground mb-8">{title}</h1>
              {children}
            </article>
          </main>
        </div>
      </div>
    </div>
  )
}`,

  'template-email-admin.tsx': `"use client"

import type React from "react"
import type { EmailConfigItem } from "@/types/strapi/email-admin.types"

interface TemplateEmailAdminProps {
  title: string
  description?: string
  configItems: EmailConfigItem[]
  children?: React.ReactNode
}

export function TemplateEmailAdmin({
  title,
  description,
  configItems,
  children,
}: TemplateEmailAdminProps) {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2 border-b border-border pb-8">
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>

          {/* Config Items Grid */}
          {configItems && configItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {configItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="rounded-lg border border-border bg-card p-6 hover:border-accent/50 transition-all group"
                >
                  <p className="text-sm text-muted-foreground group-hover:text-accent transition-colors">
                    {item.category}
                  </p>
                  <h3 className="font-semibold text-foreground mt-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
                </a>
              ))}
            </div>
          )}

          {/* Main Content */}
          {children && <div className="space-y-8">{children}</div>}
        </div>
      </div>
    </div>
  )
}
`,
}

// Write templates
Object.entries(templates).forEach(([filename, content]) => {
  const filepath = path.join(OUTPUT_DIR, filename)
  fs.writeFileSync(filepath, content, 'utf-8')
  console.log(`✓ Created ${filename}`)
})

// Generate summary
const summary = `
## Phase 3 - Template Generation Complete

Generated 5 template components in \`components/templates/\`:

1. **TemplateMarketingPlatform** - Platform overview layout with tools sidebar
2. **TemplateAnalytics** - Analytics page layout with metrics grid
3. **TemplateComposer** - Content composer layout with templates panel
4. **TemplateDocumentation** - Documentation layout with TOC sidebar
5. **TemplateEmailAdmin** - Email admin configuration grid layout

All templates:
- Use TypeScript with proper prop interfaces
- Import from correct paths (@/types/strapi/*)
- Support composition with children
- Include responsive grid layouts
- Use semantic design tokens (bg-background, text-foreground, etc.)
- Follow Tailwind best practices (no arbitrary values, use spacing scale)

Next: Run phase3-generate-barrel-exports.js to consolidate component exports.
`

fs.writeFileSync(
  path.join(process.cwd(), 'data', 'phase3-templates-generated.md'),
  summary,
  'utf-8'
)

console.log(summary)
console.log('Phase 3 Part 1 complete: Templates generated.')
