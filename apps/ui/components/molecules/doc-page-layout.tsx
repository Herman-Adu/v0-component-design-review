import React from "react"
import { Badge } from "@/components/ui/badge"

interface DocPageBadge {
  label: string
  color?: string
}

interface DocPageLayoutProps {
  /** Page title */
  title: string
  /** Short description shown below the title */
  description?: string
  /** Badges shown above the title */
  badges?: DocPageBadge[]
  /** Additional content rendered in the header area (e.g. stat cards) */
  headerExtra?: React.ReactNode
  /** Page body */
  children: React.ReactNode
}

/**
 * Shared layout wrapper for all dashboard doc pages.
 * Provides consistent page header structure: badges, title, description,
 * optional header extras, and spacing for the children body.
 *
 * Usage:
 * ```tsx
 * <DocPageLayout
 *   title="Frontend Overview"
 *   description="A deep-dive into the frontend architecture."
 *   badges={[
 *     { label: "52 Components", color: "bg-accent/20 text-accent" },
 *   ]}
 * >
 *   {content}
 * </DocPageLayout>
 * ```
 */
export function DocPageLayout({
  title,
  description,
  badges,
  headerExtra,
  children,
}: DocPageLayoutProps) {
  return (
    <div className="space-y-12">
      {/* Page Header */}
      <div>
        {badges && badges.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {badges.map((badge) => (
              <Badge
                key={badge.label}
                className={`border-0 ${badge.color ?? "bg-accent/20 text-accent"}`}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
        <h1 className="text-4xl font-bold tracking-tight text-foreground text-balance">
          {title}
        </h1>
        {description && (
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
        {headerExtra && <div className="mt-8">{headerExtra}</div>}
      </div>

      {/* Page Body */}
      {children}
    </div>
  )
}
