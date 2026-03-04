/**
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
