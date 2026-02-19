"use client"

import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Bug,
  Layers,
  ShieldCheck,
  Zap,
  XCircle,
} from "lucide-react"

const SECTIONS = [
  { id: "the-problem", title: "The Problem" },
  { id: "failed-approaches", title: "Failed Approaches" },
  { id: "guard-pattern", title: "The Guard Pattern Solution" },
  { id: "before-after", title: "Before & After" },
  { id: "when-to-apply", title: "When to Apply This Pattern" },
  { id: "security-implications", title: "Security Implications" },
  { id: "related-docs", title: "Related Documentation" },
]

const failedApproaches = [
  {
    title: "suppressHydrationWarning",
    problem: "Only suppresses the console warning -- does NOT prevent the mismatch. React still discards the server HTML and re-renders.",
    verdict: "Hides the symptom, not the cause",
  },
  {
    title: "Fixed id Props on Radix",
    problem: "Radix Collapsible does not accept an id prop for aria-controls. The ID is generated internally and cannot be overridden.",
    verdict: "Not supported by the API",
  },
  {
    title: "Dynamic import with ssr: false",
    problem: "Prevents SSR entirely. The sidebar renders as empty during initial page load, causing layout shift and harming SEO and CLS scores.",
    verdict: "Breaks SSR benefits entirely",
  },
]

const beforeItems = [
  "Console flooded with hydration mismatch warnings",
  "Sidebar flickers on page load as React re-renders",
  "Screen readers announce incorrect aria-controls targets",
  "CLS score degraded from sidebar layout shift",
  "First interactive delayed while React reconciles",
]

const afterItems = [
  "Zero hydration warnings in console",
  "Smooth skeleton-to-sidebar transition, no flicker",
  "Correct aria-controls IDs for screen readers",
  "CLS score maintained -- skeleton matches layout",
  "Instant interactivity after hydration completes",
]

const guardDecisionTable = [
  { scenario: "Radix Collapsible in sidebar nav", guard: true, why: "Random aria-controls IDs from useId()" },
  { scenario: "Radix Dialog / DropdownMenu", guard: true, why: "Same useId() pattern for aria attributes" },
  { scenario: "Radix Tooltip", guard: true, why: "Generates random content IDs" },
  { scenario: "Date/time display (toLocaleString)", guard: true, why: "SSR timezone may differ from client" },
  { scenario: "Static shadcn/ui Card / Badge", guard: false, why: "No dynamic IDs or client-dependent values" },
  { scenario: "Server Components", guard: false, why: "Never hydrate -- no mismatch possible" },
  { scenario: "FormInput / FormSelect (atoms)", guard: false, why: "Controlled inputs with deterministic values" },
  { scenario: "window.innerWidth checks", guard: true, why: "No window during SSR -- use useMobile hook instead" },
]

export default function HydrationGuardsPage() {
  return (
    <DocPage
      title="Hydration & Guard Architecture"
      description="How we solved the React hydration mismatch problem caused by Radix UI's random aria-controls IDs using a guard pattern that prevents mismatches entirely rather than suppressing them."
      icon={Shield}
      badges={[
        { label: "Key Pattern", color: "amber" },
        { label: "Production Critical", color: "red" },
      ]}
      tags={["useHydration Hook", "SidebarSkeleton", "Radix UI Fix", "SSR-Safe", "Zero Suppressions"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      <Callout type="warning" title="Why This Matters for Production">
        {"Hydration mismatches cause React to throw away the server-rendered HTML and re-render from scratch on the client. This means a flash of unstyled content, broken interactive elements, accessibility failures (screen readers announce wrong IDs), and degraded Core Web Vitals (CLS, LCP). In production, these errors are silent killers -- users see flickering, broken layouts, and unresponsive controls without clear error messages."}
      </Callout>

      {/* The Problem */}
      <section className="space-y-6">
        <DocSectionHeader id="the-problem">The Problem</DocSectionHeader>

        <div className="responsive-grid-3">
          <Card className="border-red-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bug className="h-5 w-5 text-red-500" />
                <CardTitle className="text-lg">The Root Cause</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {"Radix UI's "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">Collapsible</code>
                {" component generates "}
                <strong>random</strong>
                {" "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">aria-controls</code>
                {" IDs using "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"useId()"}</code>
                {". The ID generated during SSR does not match the one generated during client hydration."}
              </p>
              <CodeBlock
                language="html"
                code={`<!-- Server renders: -->
<div aria-controls="radix-:r1:">...</div>
<div id="radix-:r1:">...</div>

<!-- Client hydrates with: -->
<div aria-controls="radix-:r3:">...</div>
<div id="radix-:r3:">...</div>

<!-- MISMATCH! React throws away entire tree -->`}
              />
            </CardContent>
          </Card>

          <Card className="border-amber-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Why It Happens</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {"React's "}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{"useId()"}</code>
                {" generates IDs based on the component tree position. In our sidebar, the "}
                <strong>number of open collapsibles</strong>
                {" changes between SSR (where we compute initial state) and client hydration (where user state may differ), shifting the tree shape and generating different IDs."}
              </p>
              <div className="rounded-lg border border-border p-3 space-y-2 text-xs">
                <p className="font-medium text-foreground">Affected components:</p>
                <ul className="space-y-1 text-muted-foreground">
                  {[
                    { name: "DocsSidebar", detail: "multiple nested Collapsibles" },
                    { name: "NavCollapsible", detail: "section-level collapsibles" },
                    { name: "NavItemWithChildren", detail: "nested article categories" },
                  ].map((c) => (
                    <li key={c.name} className="flex items-center gap-2">
                      <XCircle className="h-3 w-3 text-red-500 shrink-0" />
                      <code>{c.name}</code>{" -- "}{c.detail}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Failed Approaches */}
      <section className="space-y-6">
        <DocSectionHeader id="failed-approaches">Failed Approaches</DocSectionHeader>

        <Callout type="error" title="What Does NOT Work">
          Before arriving at the guard pattern, these common approaches were tried and rejected. Understanding why they fail is as important as knowing the solution.
        </Callout>

        <div className="responsive-grid-3">
          {failedApproaches.map((approach) => (
            <Card key={approach.title} className="border-red-500/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <CardTitle className="text-base">{approach.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{approach.problem}</p>
                <p className="text-xs font-medium text-red-400">{approach.verdict}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* The Solution */}
      <section className="space-y-6">
        <DocSectionHeader id="guard-pattern">The Guard Pattern Solution</DocSectionHeader>

        <div className="responsive-grid-3 mb-6">
          {[
            {
              title: "Principle",
              text: "During SSR and before hydration completes, render a static skeleton that contains zero Radix components. Since no Collapsibles exist in the SSR output, there are no random IDs to mismatch.",
            },
            {
              title: "Mechanism",
              text: "The useHydration() hook returns false during SSR and the first client render, then true after useEffect fires. This is the hydration boundary.",
            },
            {
              title: "Result",
              text: "Zero hydration warnings. Zero suppressions. The skeleton matches SSR exactly (both render the same static HTML). After hydration, the real sidebar mounts with correct client-only Radix IDs.",
            },
          ].map((card) => (
            <Card key={card.title} className="border-green-500/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <CardTitle className="text-base">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{card.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="hook" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hook">useHydration Hook</TabsTrigger>
            <TabsTrigger value="skeleton">SidebarSkeleton</TabsTrigger>
            <TabsTrigger value="usage">Usage in DocsSidebar</TabsTrigger>
          </TabsList>

          <TabsContent value="hook" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>hooks/use-hydration.tsx</CardTitle>
                <CardDescription>{"The core guard hook -- 10 lines that prevent all Radix hydration mismatches"}</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`"use client"

import { useState, useEffect } from "react"

/**
 * Returns \`false\` during SSR and the initial client render,
 * then \`true\` once the component has hydrated.
 *
 * Use this to gate components that produce non-deterministic
 * HTML (e.g. Radix Collapsible with random aria-controls IDs).
 */
export function useHydration(): boolean {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}`}
                />
              </CardContent>
            </Card>

            <Callout type="success" title="Why useState(false) + useEffect Works">
              {"During SSR, useState(false) returns false and useEffect does not run. During the first client render (hydration pass), React reuses the SSR value (false) to match the server HTML. Only after hydration completes does useEffect fire, setting hydrated to true and triggering a second render with the real components."}
            </Callout>
          </TabsContent>

          <TabsContent value="skeleton" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>components/molecules/sidebar-skeleton.tsx</CardTitle>
                <CardDescription>{"Static skeleton that renders during SSR -- zero Radix, zero random IDs"}</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`/**
 * A pure-HTML skeleton that matches the visual layout of DocsSidebar
 * but contains NO Radix primitives (no Collapsible, no Tooltip, etc.).
 *
 * This is rendered during SSR and the first client paint. Because it
 * has no dynamic IDs, the server HTML and client HTML match exactly,
 * preventing hydration mismatches.
 */
export function SidebarSkeleton() {
  return (
    <div className="w-[var(--sidebar-width)] border-r border-border">
      {/* Header skeleton */}
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-muted animate-pulse" />
          <div className="space-y-1">
            <div className="h-3.5 w-20 rounded bg-muted animate-pulse" />
            <div className="h-2.5 w-28 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </div>

      {/* Navigation skeleton groups */}
      <div className="p-2 space-y-4">
        {["Management", "Documentation", "Learn & Grow"].map(
          (group) => (
            <div key={group} className="space-y-1">
              <div className="px-2 py-1">
                <span className="text-xs font-semibold text-muted-foreground/60 uppercase">
                  {group}
                </span>
              </div>
              <div className="space-y-0.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded-md">
                    <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                    <div
                      className="h-3 rounded bg-muted animate-pulse"
                      style={{ width: \`\${60 + Math.random() * 40}%\` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  )
}`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="usage" className="mt-6 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Guard Pattern in DocsSidebar</CardTitle>
                <CardDescription>How the hook and skeleton work together</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  language="typescript"
                  code={`export function DocsSidebar() {
  const hydrated = useHydration()
  const pathname = usePathname()

  // During SSR and before hydration, render a static skeleton.
  // This prevents ALL Radix hydration mismatches because no
  // Collapsible components (with their random aria-controls IDs)
  // exist during SSR.
  if (!hydrated) {
    return <SidebarSkeleton />
  }

  // After hydration, safe to render Radix components.
  // All Collapsible IDs are generated client-side only,
  // so there's nothing to mismatch against.
  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent>
        <NavCollapsible section={strategicOverviewSection} pathname={pathname} />
        <NavCollapsible section={cmsReferenceSection} pathname={pathname} />
        <NavCollapsible section={appReferenceSection} pathname={pathname} />
        <NavCollapsible section={infrastructureOpsSection} pathname={pathname} />
        <NavCollapsible section={learningHubSection} pathname={pathname} />
      </SidebarContent>
    </Sidebar>
  )
}`}
                />
              </CardContent>
            </Card>

            <Callout type="info" title="Safe useState Initialization">
              {"Inside NavCollapsible and NavItemWithChildren, we use useState(shouldBeOpen) to initialize collapsible state. This is safe because these components only mount after hydration (they're inside the if (!hydrated) guard). By the time they render, we're fully client-side and useState initializers are deterministic."}
            </Callout>
          </TabsContent>
        </Tabs>
      </section>

      {/* Before/After */}
      <section className="space-y-6">
        <DocSectionHeader id="before-after">{"Before & After"}</DocSectionHeader>

        <div className="responsive-grid-3">
          <Card className="border-red-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                <CardTitle className="text-lg text-red-400">Before (Broken)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {beforeItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-green-500/30">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg text-green-400">After (Guard Pattern)</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {afterItems.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* When to Apply This Pattern */}
      <section className="space-y-6">
        <DocSectionHeader id="when-to-apply">When to Apply This Pattern</DocSectionHeader>

        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Scenario</th>
                    <th className="text-left py-2 pr-4 font-semibold text-foreground">Needs Guard?</th>
                    <th className="text-left py-2 font-semibold text-foreground">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {guardDecisionTable.map((row) => (
                    <tr key={row.scenario} className="border-b border-border/50">
                      <td className="py-2 pr-4 font-medium text-foreground">{row.scenario}</td>
                      <td className="py-2 pr-4">
                        {row.guard ? (
                          <Badge className="bg-amber-500/20 text-amber-500 border-0 text-xs">Yes</Badge>
                        ) : (
                          <Badge className="bg-green-500/20 text-green-500 border-0 text-xs">No</Badge>
                        )}
                      </td>
                      <td className="py-2 text-muted-foreground">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Security Implications */}
      <section className="space-y-6">
        <DocSectionHeader id="security-implications">Security Implications</DocSectionHeader>

        <Callout type="warning" title="Hydration as a Security Concern">
          {"Hydration mismatches are not just a developer experience issue. When React discards the server HTML and re-renders, it creates a window where the DOM is in an inconsistent state. During this window, event handlers may not be attached, form validation may be bypassed, and security-critical UI elements (like CSRF tokens in hidden fields) may be missing."}
        </Callout>

        <div className="responsive-grid-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Threat: Form Bypass During Re-render
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If a form re-renders during hydration, the brief gap between server HTML and client hydration can allow submission without client-side validation. The guard pattern ensures forms are only interactive after full hydration.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Threat: Accessibility ID Spoofing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Mismatched aria-controls IDs mean screen readers point to wrong elements. In security-sensitive UIs (password managers, form labels), this can cause credential autofill into wrong fields. The guard ensures all ARIA relationships are correct.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Related Documentation */}
      <section className="space-y-6">
        <DocSectionHeader id="related-docs">Related Documentation</DocSectionHeader>
        <div className="responsive-grid-3">
          <Link href="/dashboard/documentation/app-reference/component-system" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-base group-hover:text-accent transition-colors">Component System</CardTitle>
                </div>
                <CardDescription>The full atomic design component catalog that the guard pattern protects.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/dashboard/documentation/app-reference/security-architecture" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-red-500" />
                  <CardTitle className="text-base group-hover:text-accent transition-colors">Security Architecture</CardTitle>
                </div>
                <CardDescription>The full defense-in-depth security stack including the hydration guard layer.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/dashboard/documentation/app-reference/performance-and-caching" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-base group-hover:text-accent transition-colors">Performance</CardTitle>
                </div>
                <CardDescription>How the guard pattern impacts Core Web Vitals (CLS, LCP) and page load.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>
    </DocPage>
  )
}
