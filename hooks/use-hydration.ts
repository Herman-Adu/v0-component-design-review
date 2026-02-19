/**
 * Hydration Guard Hook
 *
 * Returns `false` during SSR and on the very first client render,
 * then `true` after hydration completes.  Components can use this
 * to defer rendering of client-only UI (e.g. Radix primitives)
 * until after hydration, preventing mismatch errors.
 *
 * @example
 * const hydrated = useHydration()
 * if (!hydrated) return <Skeleton />
 * return <InteractiveComponent />
 */

"use client"

import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}
const getSnapshot = () => true
const getServerSnapshot = () => false

export function useHydration(): boolean {
  return useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot)
}
