import { Settings, User } from "lucide-react"

/**
 * SidebarSkeleton - A static, non-interactive sidebar placeholder.
 *
 * This renders during SSR and before hydration completes. It uses NO Radix
 * primitives, NO Collapsible, NO random IDs - just plain HTML divs styled
 * to match the real sidebar's visual appearance.
 *
 * This prevents all hydration mismatches because:
 * 1. No Radix components = no generated aria-controls IDs
 * 2. No client-dependent state (usePathname, useState, etc.)
 * 3. Identical output on server and client
 */
export function SidebarSkeleton() {
  return (
    <div
      className="hidden md:block"
      style={{ width: "16rem" }}
    >
      <div
        className="fixed inset-y-0 left-0 z-10 flex h-svh flex-col border-r border-border bg-sidebar text-sidebar-foreground"
        style={{ width: "16rem" }}
      >
        {/* Header - matches real sidebar header */}
        <div className="flex flex-col gap-2 p-2 border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-accent" />
            <div>
              <div className="font-semibold text-foreground text-sm">Dashboard</div>
              <div className="text-xs text-muted-foreground">Manage your project</div>
            </div>
          </div>
        </div>

        {/* Content area with skeleton groups */}
        <div className="flex-1 overflow-hidden p-2">
          {/* Management */}
          <SkeletonGroup label="Management" items={1} />
          <SkeletonSeparator />
          {/* Backend & CMS */}
          <SkeletonGroup label="Backend & CMS" items={1} />
          <SkeletonSeparator />
          {/* Frontend & Integration */}
          <SkeletonGroup label="Frontend & Integration" items={1} />
          <SkeletonSeparator />
          {/* Learn & Grow */}
          <SkeletonGroup label="Learn & Grow" items={1} />
        </div>

        {/* Footer - matches real sidebar footer */}
        <div className="border-t border-border p-2">
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 border border-accent/30">
              <User className="h-4 w-4 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">Guest User</div>
              <div className="text-xs text-muted-foreground">Sign in for more</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonGroup({ label, items }: { label: string; items: number }) {
  return (
    <div className="flex w-full min-w-0 flex-col p-2">
      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 h-8 flex items-center">
        {label}
      </div>
      <div className="flex flex-col gap-1 mt-1">
        {Array.from({ length: items }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-2 h-8 px-2 rounded-md"
          >
            <div className="h-4 w-4 rounded bg-muted animate-pulse" />
            <div className="h-3 flex-1 rounded bg-muted animate-pulse" style={{ maxWidth: "70%" }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function SkeletonSeparator() {
  return <div className="mx-2 my-2 h-px bg-sidebar-border" />
}
