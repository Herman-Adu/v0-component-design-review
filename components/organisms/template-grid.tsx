import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ResponsiveGrid } from '@/components/molecules/responsive-grid'

export interface Template {
  title: string
  description: string
  badge?: string
  preview?: string
  action?: {
    label: string
    onClick: () => void
  }
  metadata?: {
    category?: string
    uses?: number
    updated?: string
  }
}

interface TemplateGridProps {
  templates: Template[]
  columns?: 3 | 6
  onTemplateSelect?: (template: Template) => void
}

/**
 * TemplateGrid - Specialized grid for template/post template cards
 * Commonly used for social media post templates, email templates, etc.
 * Defaults to 3-column layout with responsive-grid-3
 */
export function TemplateGrid({ templates, columns = 3, onTemplateSelect }: TemplateGridProps) {
  return (
    <ResponsiveGrid columns={columns} items={templates}>
      {(template) => (
        <Card className="border-border/50 flex flex-col">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-base font-semibold">{template.title}</CardTitle>
              {template.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground">
                  {template.badge}
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-sm text-muted-foreground">{template.description}</p>
            {template.preview && (
              <div className="mt-3 p-3 rounded-md bg-muted/50 text-xs text-muted-foreground italic border border-border/50">
                {template.preview}
              </div>
            )}
            {template.metadata && (
              <div className="mt-3 flex gap-3 text-xs text-muted-foreground">
                {template.metadata.category && <span>• {template.metadata.category}</span>}
                {template.metadata.uses && <span>• {template.metadata.uses} uses</span>}
                {template.metadata.updated && <span>• {template.metadata.updated}</span>}
              </div>
            )}
          </CardContent>
          {(template.action || onTemplateSelect) && (
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  if (template.action) {
                    template.action.onClick()
                  } else if (onTemplateSelect) {
                    onTemplateSelect(template)
                  }
                }}
              >
                {template.action?.label || 'Use Template'}
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </ResponsiveGrid>
  )
}
