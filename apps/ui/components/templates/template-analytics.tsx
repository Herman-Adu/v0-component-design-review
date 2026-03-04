"use client"

import type React from "react"
import type { MetricDefinition, ReportingCadence, ContentComparison } from "@/types/strapi/analytics.types"

interface TemplateAnalyticsProps {
  title: string
  description?: string
  platform: string
  accentColor: string
  metrics: MetricDefinition[]
  reportingCadence?: ReportingCadence[]
  contentComparison?: ContentComparison[]
  children?: React.ReactNode
}

export function TemplateAnalytics({
  title,
  description,
  platform,
  accentColor,
  metrics,
  reportingCadence,
  contentComparison,
  children,
}: TemplateAnalyticsProps) {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-border pb-8">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>

        {/* Metrics Grid */}
        {metrics && metrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map((metric) => (
              <div key={metric.id} className="rounded-lg border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">{metric.title}</p>
                <p className="text-2xl font-bold text-foreground mt-2">{metric.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="space-y-8">{children}</div>
      </div>
    </div>
  )
}
