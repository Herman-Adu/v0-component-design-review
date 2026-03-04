"use client"

import { useSyncExternalStore } from "react"

/**
 * Global hydration state tracker.
 *
 * This uses `useSyncExternalStore` which is the React-recommended way to
 * subscribe to external state. The key insight:
 *
 * - `getServerSnapshot` returns `false` (server is never hydrated)
 * - `getClientSnapshot` returns the current hydration state
 * - Once hydrated, the value flips to `true` and never changes back
 *
 * This avoids the classic `useState(false) + useEffect(() => setState(true))`
 * pattern which causes a flash/layout shift. `useSyncExternalStore` integrates
 * directly with React's rendering pipeline.
 *
 * Usage:
 *   const hydrated = useHydration()
 *   if (!hydrated) return <Skeleton />
 *   return <InteractiveComponent />
 */

// Module-level singleton - shared across all hook consumers
let hydrated = false

const listeners = new Set<() => void>()

function subscribe(callback: () => void) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function getClientSnapshot() {
  return hydrated
}

function getServerSnapshot() {
  return false
}

// Mark as hydrated on first client-side module evaluation
// This runs once when the module is first imported on the client
if (typeof window !== "undefined") {
  hydrated = true
}

export function useHydration(): boolean {
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
}
