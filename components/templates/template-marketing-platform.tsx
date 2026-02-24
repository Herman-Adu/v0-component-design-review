"use client"

import type React from "react"
import type { Tool, StrategyPhase } from "@/types/strapi/marketing-platform.types"

interface TemplateMarketingPlatformProps {
  title: string
  tagline: string
  platform: string
  accentColor: string
  platformTools: Tool[]
  strategyPhases: StrategyPhase[]
  children?: React.ReactNode
}

export function TemplateMarketingPlatform({
  title,
  tagline,
  platform,
  accentColor,
  platformTools,
  strategyPhases,
  children,
}: TemplateMarketingPlatformProps) {
  return (
    <div className="w-full bg-background">
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Header Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{title}</h1>
            <p className="text-lg text-muted-foreground mt-2">{tagline}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {children}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <nav className="space-y-2">
                {platformTools.slice(0, 5).map((tool) => (
                  <a
                    key={tool.id}
                    href={tool.href}
                    className="block text-sm text-accent hover:text-accent/80 transition-colors"
                  >
                    {tool.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
