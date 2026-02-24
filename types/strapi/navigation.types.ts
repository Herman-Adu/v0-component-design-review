/**
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
