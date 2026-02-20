import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveGrid } from '@/components/molecules/responsive-grid'
import { LucideIcon } from 'lucide-react'

export interface Metric {
  icon?: LucideIcon
  iconColor?: string
  label: string
  value: string | number
  description?: string
  badge?: string
  trend?: {
    value: string
    direction: 'up' | 'down' | 'neutral'
  }
}

interface MetricsGridProps {
  metrics: Metric[]
  columns?: 3 | 6
}

/**
 * MetricsGrid - Specialized grid for dashboard metric cards
 * Automatically handles 6-item layouts with responsive-grid-6 (2-1-2-1 tablet pattern)
 * or 3-item layouts with responsive-grid-3 (2-1 tablet pattern)
 */
export function MetricsGrid({ metrics, columns }: MetricsGridProps) {
  // Auto-detect columns based on metric count if not specified
  const columnCount = columns || (metrics.length === 6 ? 6 : 3)

  return (
    <ResponsiveGrid columns={columnCount} items={metrics}>
      {(metric) => {
        const Icon = metric.icon
        return (
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {Icon && (
                    <div className={metric.iconColor || 'text-primary'}>
                      <Icon className="h-5 w-5" />
                    </div>
                  )}
                  {metric.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {metric.badge}
                    </span>
                  )}
                </div>
                {metric.trend && (
                  <span
                    className={`text-xs font-medium ${
                      metric.trend.direction === 'up'
                        ? 'text-green-500'
                        : metric.trend.direction === 'down'
                          ? 'text-red-500'
                          : 'text-muted-foreground'
                    }`}
                  >
                    {metric.trend.value}
                  </span>
                )}
              </div>
              <CardTitle className="text-sm font-medium text-muted-foreground mt-2">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              {metric.description && (
                <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
              )}
            </CardContent>
          </Card>
        )
      }}
    </ResponsiveGrid>
  )
}
