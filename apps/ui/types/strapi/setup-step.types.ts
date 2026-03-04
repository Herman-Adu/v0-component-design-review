/**
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
