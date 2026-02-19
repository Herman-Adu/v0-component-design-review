import type React from "react"

/**
 * Documentation Layout
 * 
 * Centralized layout for all documentation pages (/app/dashboard/documentation/*)
 * Uses CSS variables for fully responsive, dynamic behavior:
 * - --doc-max-width: Scales from 100% (mobile) to 90rem (ultra-wide)
 * - --doc-padding-x/y: Responsive padding that adapts to viewport
 * - Container queries: Foundation for future draggable sidebar (Phase 4)
 * 
 * All values are defined in globals.css and respond to media queries.
 * No hardcoded breakpoints here - all breakpoints are centralized.
 * Supports smooth transitions when sidebar is dragged (Phase 4).
 */
export default function DocumentationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-background doc-container">
      <div className="mx-auto w-full px-dynamic py-dynamic transition-layout" style={{ maxWidth: 'var(--doc-max-width)' }}>
        {children}
      </div>
    </div>
  )
}
