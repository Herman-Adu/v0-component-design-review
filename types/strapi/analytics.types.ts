/**
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
