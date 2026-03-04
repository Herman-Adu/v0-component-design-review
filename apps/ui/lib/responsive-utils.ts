/**
 * Responsive Utilities for Documentation System
 * 
 * Helpers and hooks for working with the CSS variable-based responsive system.
 * All values are centralized in globals.css and respond to media queries and container queries.
 */

/**
 * Get CSS variable value
 * Useful for JavaScript that needs to read responsive values
 */
export function getCSSVariable(variableName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim()
}

/**
 * Set CSS variable value (for JavaScript-driven responsive changes like dragging)
 * Phase 4: Used for draggable sidebar width changes
 */
export function setCSSVariable(variableName: string, value: string): void {
  document.documentElement.style.setProperty(variableName, value)
}

/**
 * Watch CSS variable changes
 * Returns cleanup function to stop watching
 */
export function watchCSSVariable(
  variableName: string,
  callback: (newValue: string) => void,
  options?: MutationObserverInit
): () => void {
  const observer = new MutationObserver(() => {
    const newValue = getCSSVariable(variableName)
    callback(newValue)
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['style'],
    ...options,
  })

  return () => observer.disconnect()
}

/**
 * Get all responsive CSS variables at once
 * Useful for logging/debugging responsive state
 */
export function getResponsiveState() {
  const root = getComputedStyle(document.documentElement)
  return {
    docMaxWidth: root.getPropertyValue('--doc-max-width').trim(),
    docPaddingX: root.getPropertyValue('--doc-padding-x').trim(),
    docPaddingY: root.getPropertyValue('--doc-padding-y').trim(),
    docGap: root.getPropertyValue('--doc-gap').trim(),
    tocWidth: root.getPropertyValue('--toc-width').trim(),
    tocDisplay: root.getPropertyValue('--toc-display').trim(),
    contentWidth: root.getPropertyValue('--content-width').trim(),
    sidebarWidth: root.getPropertyValue('--sidebar-width').trim(),
    transitionBase: root.getPropertyValue('--transition-base').trim(),
  }
}

/**
 * Constrain sidebar width to min/max values
 * Phase 4: Used when dragging sidebar
 */
export function constrainSidebarWidth(
  width: number,
  options?: { min?: number; max?: number }
): number {
  const min = options?.min ?? 160 // --sidebar-width-min
  const max = options?.max ?? 400 // --sidebar-width-max
  return Math.max(min, Math.min(max, width))
}

/**
 * Convert pixel value to CSS variable format
 * Ensures consistent formatting
 */
export function toPxValue(value: number | string): string {
  if (typeof value === 'number') {
    return `${value}px`
  }
  return value.endsWith('px') ? value : `${value}px`
}

/**
 * Media query utilities for JavaScript breakpoint detection
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const

export function isBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  return window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`).matches
}

export function onBreakpoint(
  breakpoint: keyof typeof breakpoints,
  callback: (matches: boolean) => void
): () => void {
  const query = window.matchMedia(`(min-width: ${breakpoints[breakpoint]}px)`)
  const handler = (e: MediaQueryListEvent | MediaQueryList) => callback(e.matches)

  if (query.addEventListener) {
    query.addEventListener('change', handler)
    return () => query.removeEventListener('change', handler)
  }

  // Fallback for older browsers
  query.addListener(handler)
  return () => query.removeListener(handler)
}

/**
 * Debug function: Log current responsive state
 */
export function debugResponsiveState(): void {
  console.group('[Responsive System] Current State')
  console.table(getResponsiveState())
  console.table({
    'sm (640px)': isBreakpoint('sm'),
    'md (768px)': isBreakpoint('md'),
    'lg (1024px)': isBreakpoint('lg'),
    'xl (1280px)': isBreakpoint('xl'),
  })
  console.groupEnd()
}
