import type React from "react"

/**
 * Dashboard Route Group Layout
 * This wraps all dashboard routes (/dashboard/*)
 * The actual dashboard layout with sidebar is at /dashboard/layout.tsx
 */
export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
