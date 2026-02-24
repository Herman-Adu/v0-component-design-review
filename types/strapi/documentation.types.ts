/**
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
