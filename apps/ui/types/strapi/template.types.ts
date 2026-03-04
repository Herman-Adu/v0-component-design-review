/**
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
