/**
 * Component Prop Types: Atoms
 * Smallest reusable UI building blocks
 * Source patterns: components/atoms/*.tsx
 */

import type { LucideIcon } from 'lucide-react'

export interface StatusBadgeProps {
  status: 'Active' | 'Beta' | 'Coming Soon' | 'Deprecated'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export interface CategoryBadgeProps {
  label: string
  colorClass?: string
  variant?: 'default' | 'outline' | 'accent'
  className?: string
}

export interface IconContainerProps {
  icon: LucideIcon
  colorClass?: string
  size?: 'sm' | 'md' | 'lg'
  withBorder?: boolean
  className?: string
}

export interface SectionHeadingProps {
  title: string
  description?: string
  level?: 'h1' | 'h2' | 'h3'
  className?: string
}

export interface SpecRowProps {
  spec: string
  value: string
  className?: string
}

export interface ChecklistRowProps {
  text: string
  checked?: boolean
  accentColorClass?: string
  className?: string
}

export interface MetricValueProps {
  label: string
  value: string
  className?: string
}
