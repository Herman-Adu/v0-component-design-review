/**
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
