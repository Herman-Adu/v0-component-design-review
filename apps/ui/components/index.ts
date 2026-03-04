// Root barrel export for all components

export { atomsComponents } from './atoms'
export * from './atoms'

// Note: molecules are not re-exported at root due to naming conflicts with atoms
// Import molecules directly: import { BackNavigationCard } from '@/components/molecules'
export { moleculesComponents } from './molecules'

export { organismsComponents } from './organisms'
export * from './organisms'

export { templatesComponents } from './templates'
export * from './templates'

// Type-safe component registry
export const componentRegistry = {
  atoms: {
    count: 18,
    components: Object.freeze(['Callout', 'CategoryBadge', 'ChecklistRow', 'CodeBlock', 'CodeExplanation', 'DatePicker', 'FormCheckbox', 'FormInput', 'FormSelect', 'FormTextarea', 'IconContainer', 'MetricValue', 'RadioGroup', 'SectionHeading', 'SpecRow', 'Spoiler', 'StatusBadge', 'ThemeToggle']),
  },
  molecules: {
    count: 21,
    components: Object.freeze(['BackNavigationCard', 'ContentCard', 'ContentComparisonTable', 'DashboardShell', 'DocPageLayout', 'DocPage', 'DocsSidebar', 'FormNavigation', 'FormProgressIndicator', 'FormStepContainer', 'LocationMapCard', 'Navbar', 'OfficeHoursCard', 'PlatformHeader', 'QuickContactCard', 'ReportingCadenceCard', 'SidebarSkeleton', 'StepIndicator', 'StrategyPhaseCard', 'ToolCard', 'WhyPlatformCard']),
  },
  organisms: {
    count: 6,
    components: Object.freeze(['ChecklistCard', 'MetricsGrid', 'MultiStepFormWrapper', 'PlatformSpecsCard', 'StrategyFlow', 'ToolGrid']),
  },
  templates: {
    count: 5,
    components: Object.freeze(['TemplateAnalytics', 'TemplateComposer', 'TemplateDocumentation', 'TemplateEmailAdmin', 'TemplateMarketingPlatform']),
  },
}

export const totalComponents = 50
