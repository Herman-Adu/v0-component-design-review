import { useSyncExternalStore } from "react"

/**
 * Hydration-safe mobile detection hook.
 *
 * Uses useSyncExternalStore (same pattern as useHydration) so server and
 * client agree on the initial value. Server snapshot always returns false
 * (assume desktop) which matches the client's first synchronous read of
 * matchMedia before any layout effects fire.
 *
 * This avoids the classic useState(undefined) + useEffect(matchMedia) pattern
 * which causes hydration mismatches because the server renders with
 * isMobile=false but the client's first paint may differ after the effect.
 */

const MOBILE_BREAKPOINT = 768
const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY)
  mql.addEventListener("change", callback)
  return () => mql.removeEventListener("change", callback)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
