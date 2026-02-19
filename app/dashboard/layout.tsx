import type React from "react"
import { DashboardShell } from "@/components/molecules/dashboard-shell"
import { Navbar } from "@/components/molecules/navbar"

/**
 * Dashboard Layout -- Server Component
 *
 * Uses fullWidth Navbar so the nav spans edge-to-edge, matching the
 * sidebar + content area below. Marketing pages use the (marketing)
 * route group with a container-constrained Navbar instead.
 *
 * This layout is deliberately a Server Component. All client-side interactivity
 * (sidebar state, mobile detection, collapsible sections) is encapsulated in
 * the DashboardShell client component.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar fullWidth />
      <DashboardShell>{children}</DashboardShell>
    </>
  )
}
