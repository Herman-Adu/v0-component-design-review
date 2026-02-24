"use client"

import type React from "react"
import type { ContentTemplate } from "@/types/strapi/marketing-platform.types"

interface TemplateComposerProps {
  platform: string
  maxCharacters: number
  templates: ContentTemplate[]
  onCompose?: (content: string) => void
  children?: React.ReactNode
}

export function TemplateComposer({
  platform,
  maxCharacters,
  templates,
  onCompose,
  children,
}: TemplateComposerProps) {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Composer Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Content Composer</h1>
            <p className="text-muted-foreground">
              Create optimized content for {platform} ({maxCharacters} characters max)
            </p>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">{children}</div>

            {/* Templates Sidebar */}
            <aside className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold text-foreground mb-4">Templates</h3>
                <div className="space-y-2">
                  {templates.slice(0, 5).map((template) => (
                    <button
                      key={template.id}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm border border-border hover:bg-accent/10 transition-colors"
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
