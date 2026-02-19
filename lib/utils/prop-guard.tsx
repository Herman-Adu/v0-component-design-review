"use client"

import React from "react"

/**
 * PropGuard -- Runtime defensive prop validation for shared components.
 *
 * PURPOSE:
 * Shared article components (DecisionTree, StepFlow, etc.) receive array props
 * from article components. If a caller passes undefined/null (wrong prop name,
 * missing data, typo), the component crashes the entire page with:
 *   "Cannot read properties of undefined (reading 'map')"
 *
 * PropGuard provides 3-layer defence:
 *   1. DEV MODE: Renders a visible yellow diagnostic card showing what failed
 *   2. CONSOLE: Logs structured [PropGuard] messages (grepable task list)
 *   3. PROD MODE: Returns null gracefully (no crash, no visible diagnostic)
 *
 * USAGE (inside shared components):
 *   const guardedDecisions = useArrayGuard(decisions, "DecisionTree", "decisions")
 *   if (!guardedDecisions) return null  // guard returned null = prop was invalid
 *   // safe to .map() on guardedDecisions
 *
 * REVIEW PROCESS:
 *   After any content creation session, check browser console for [PropGuard]
 *   messages. Each one is a bug that needs fixing in the CALLER, not the guard.
 *   Treat PropGuard warnings as HIGH severity findings in the 3-axis review.
 */

const isDev = process.env.NODE_ENV === "development"

interface PropGuardWarning {
  component: string
  prop: string
  expected: string
  received: string
  timestamp: string
}

// Registry of all warnings for dev tooling
const warnings: PropGuardWarning[] = []

/**
 * Validates an array prop and returns it if valid, or null if invalid.
 * In dev mode, logs a structured warning and renders a diagnostic.
 */
export function guardArrayProp<T>(
  value: T[] | undefined | null,
  componentName: string,
  propName: string
): T[] | null {
  if (Array.isArray(value) && value.length > 0) {
    return value
  }

  const warning: PropGuardWarning = {
    component: componentName,
    prop: propName,
    expected: "non-empty array",
    received: value === undefined ? "undefined" : value === null ? "null" : `empty array (length: 0)`,
    timestamp: new Date().toISOString(),
  }

  warnings.push(warning)

  if (isDev) {
    console.warn(
      `[PropGuard] ${componentName}.${propName}: expected non-empty array, got ${warning.received}. Fix the CALLER, not the guard.`
    )
  }

  // Empty arrays are valid but have nothing to render
  if (Array.isArray(value) && value.length === 0) {
    return value // return empty array, caller will render nothing
  }

  return null // undefined/null = invalid, caller should show diagnostic or null
}

/**
 * Dev-mode diagnostic card rendered when a prop guard catches an invalid prop.
 * In production this returns null (invisible).
 */
export function PropGuardDiagnostic({
  componentName,
  propName,
  received,
}: {
  componentName: string
  propName: string
  received: string
}) {
  if (!isDev) return null

  return (
    <div className="my-4 border-2 border-yellow-500/60 bg-yellow-500/10 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
          <span className="text-yellow-500 font-bold text-sm">!</span>
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-yellow-400 text-sm mb-1">
            PropGuard: {componentName}
          </h4>
          <p className="text-sm text-yellow-300/80 mb-2">
            Missing or invalid required prop: <code className="bg-yellow-500/20 px-1 rounded font-mono text-xs">{propName}</code>
          </p>
          <div className="text-xs text-yellow-300/60 space-y-1">
            <div>Expected: <span className="font-mono">non-empty array</span></div>
            <div>Received: <span className="font-mono">{received}</span></div>
            <div className="mt-2 text-yellow-400/80 font-medium">
              Fix the caller component, not this guard.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Get all PropGuard warnings (for dev tooling / review automation)
 */
export function getPropGuardWarnings(): PropGuardWarning[] {
  return [...warnings]
}

/**
 * Clear all PropGuard warnings (call at start of review)
 */
export function clearPropGuardWarnings(): void {
  warnings.length = 0
}
