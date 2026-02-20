import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ResponsiveGrid } from '@/components/molecules/responsive-grid'
import { LucideIcon } from 'lucide-react'

export interface Feature {
  icon?: LucideIcon
  iconColor?: string
  title: string
  description: string
  badge?: string
  link?: {
    label: string
    href: string
  }
  items?: string[]
}

interface FeatureGridProps {
  features: Feature[]
  columns?: 3 | 6
}

/**
 * FeatureGrid - Specialized grid for feature/capability/tool cards
 * Commonly used for "Key Capabilities", "Tools", "Features" sections
 * Defaults to 3-column layout with responsive-grid-3
 */
export function FeatureGrid({ features, columns }: FeatureGridProps) {
  // Auto-detect columns based on feature count if not specified
  const columnCount = columns || (features.length === 6 ? 6 : 3)

  return (
    <ResponsiveGrid columns={columnCount} items={features}>
      {(feature) => {
        const Icon = feature.icon
        return (
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-start gap-3">
                {Icon && (
                  <div className={`p-2 rounded-lg ${feature.iconColor || 'bg-primary/10 text-primary'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    {feature.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
                </div>
              </div>
            </CardHeader>
            {(feature.items || feature.link) && (
              <CardContent>
                {feature.items && (
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {feature.link && (
                  <a
                    href={feature.link.href}
                    className="text-sm text-primary hover:underline inline-flex items-center gap-1 mt-2"
                  >
                    {feature.link.label}
                    <span>→</span>
                  </a>
                )}
              </CardContent>
            )}
          </Card>
        )
      }}
    </ResponsiveGrid>
  )
}
