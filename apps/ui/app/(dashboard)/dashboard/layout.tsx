import type React from "react"
import { DashboardShell } from "@/components/molecules/dashboard-shell"
import { Navbar } from "@/components/molecules/navbar"
import { getContentRouteManifest } from "@/lib/strapi/dashboard/content-library/content-route-manifest"

/**
 * Dashboard Layout -- Server Component
 *
 * Fetches the content route manifest server-side and builds the dynamic
 * Learning Hub nav section before passing it down to the client sidebar.
 * When Strapi goes live, admin and documentation nav sections follow the
 * same pattern — fetch here, pass as props, zero changes to the sidebar.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const manifest = await getContentRouteManifest()

  return (
    <>
      <Navbar fullWidth />
      <DashboardShell manifest={manifest}>{children}</DashboardShell>
    </>
  )
}
