"use client"

import type React from "react"
import { Suspense } from "react"
import { DocsSidebar } from "@/components/molecules/docs-sidebar"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"

/**
 * DashboardShell -- the sole client boundary for the dashboard layout.
 *
 * This component exists so that `dashboard/layout.tsx` can remain a Server
 * Component. Only the sidebar chrome (SidebarProvider, SidebarTrigger,
 * SidebarInset) requires client-side state. The `{children}` passed in are
 * Server Components that stream through untouched.
 *
 * Hydration safety:
 * - {children} is wrapped in an explicit <Suspense> boundary. Next.js inserts
 *   an implicit Suspense around Server Component children passed through a
 *   Client Component boundary for streaming. Without a matching explicit
 *   <Suspense> here, the server HTML contains <Suspense> where the client
 *   expects <div>, causing a hydration mismatch (see hydration-patterns.ts
 *   Rule 5: "Wrap RSC children in explicit <Suspense>").
 * - DocsSidebar already uses `useHydration()` guard (renders SidebarSkeleton on SSR)
 * - SidebarProvider reads a cookie but the value is deterministic (server and
 *   client agree on defaultOpen because the cookie hasn't changed mid-request)
 * - No Date.now(), Math.random(), or locale-dependent formatting here
 * - No nested <main> tags -- SidebarInset renders <main>, we use <div> inside it
 */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <DocsSidebar />
      <SidebarInset>
        <header className="sticky top-16 z-40 flex h-12 items-center gap-2 border-b border-border bg-background/95 backdrop-blur-sm px-4">
          <SidebarTrigger className="-ml-1" />
          <span className="text-sm font-medium text-muted-foreground md:hidden">Documentation</span>
        </header>
        <div className="flex-1 bg-background">
          <Suspense>
            {children}
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
