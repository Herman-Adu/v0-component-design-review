import type React from "react"

/**
 * Documentation Layout
 *
 * Thin wrapper for documentation pages (/app/dashboard/documentation/*).
 *
 * Padding, max-width, and transition are now provided by the unified content
 * wrapper in DashboardShell (applies to ALL sidebar pages).
 *
 * This layout only adds the `doc-container` class which sets up a CSS
 * container query context (`container: doc-layout / inline-size`) for
 * future Phase 4 sidebar-drag responsiveness.
 */
export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full doc-container">
      {children}
    </div>
  )
}
