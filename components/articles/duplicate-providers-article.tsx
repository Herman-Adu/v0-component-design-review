"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  FeatureGrid,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  VerticalFlow,
  DataFlowDiagram,
  BeforeAfterComparison,
  ArchitectureDiagram,
  FileTree,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "the-problem", title: "The Problem", level: 2 },
  { id: "how-duplication-happens", title: "How Duplication Happens", level: 2 },
  { id: "symptoms", title: "Symptoms of Duplicate Providers", level: 2 },
  { id: "react-context-mechanics", title: "React Context Mechanics", level: 2 },
  { id: "one-provider-pattern", title: "One Provider Per Concern", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "audit-prevention", title: "Audit and Prevention", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function DuplicateProvidersArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="warning">
          Code Review #1 found duplicate ThemeProvider implementations in two separate layout
          files, each creating independent React Context trees. The result: inconsistent theming,
          flash of wrong theme on navigation, and subtle state bugs that only appeared in specific
          route combinations.
        </InfoBox>

        {/* Section 1 */}
        <SectionHeader number="01" title="The Problem" id="the-problem" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          During a routine code review, we discovered that the ThemeProvider component was instantiated
          in two places: the root layout and the dashboard layout. Both were wrapping their children
          with the same provider, but because React Context creates independent trees per provider
          instance, components in the dashboard saw a different theme context than components in the
          root.
        </p>

        <MetricsGrid
          metrics={[
            { label: "Duplicate Providers", value: "2", change: "ThemeProvider instances", positive: false },
            { label: "Affected Routes", value: "23", change: "Dashboard routes", positive: false },
            { label: "Bug Reports", value: "3", change: "Theme flickering reports", positive: false },
            { label: "Time to Diagnose", value: "4h", change: "Across 2 sessions", positive: false },
          ]}
        />

        {/* Section 2 */}
        <SectionHeader number="02" title="How Duplication Happens" id="how-duplication-happens" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Provider duplication rarely happens intentionally. It typically occurs through one of three
          patterns, all of which are invisible to TypeScript and ESLint.
        </p>

        <FeatureGrid
          columns={3}
          features={[
            {
              title: "Copy-Paste Layouts",
              description: "A developer creates a new layout by copying an existing one. The copied layout includes the provider wrapper, creating a second instance. Neither TypeScript nor React warns about this.",
              items: [
                "Most common cause",
                "Easy to miss in code review",
                "Silently creates separate context",
              ],
            },
            {
              title: "Library Defaults",
              description: "Some UI libraries instruct you to wrap your app in their provider. If one dev adds it to the root layout and another adds it to a feature layout, you get duplication.",
              items: [
                "Happens with theme libraries",
                "Toast/notification providers",
                "Auth providers",
              ],
            },
            {
              title: "Incremental Migration",
              description: "During a phased migration (e.g., from CSS-in-JS to Tailwind), a temporary provider is added alongside the existing one. The 'temporary' one is never removed.",
              items: [
                "Technical debt accumulation",
                "Migration cleanup missed",
                "Both providers appear to work",
              ],
            },
          ]}
        />

        {/* Section 3 */}
        <SectionHeader number="03" title="Symptoms of Duplicate Providers" id="symptoms" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Duplicate providers are a silent bug class. The application does not crash, TypeScript does
          not error, and the symptoms are often attributed to other causes. Here are the telltale signs:
        </p>

        <StatsTable
          title="Symptom Identification Guide"
          headers={["Symptom", "What You See", "Why It Happens", "Commonly Misdiagnosed As"]}
          rows={[
            [
              "Theme Flicker",
              "Brief flash of wrong theme on navigation",
              "Inner provider resets to default on mount",
              "CSS loading order issue",
            ],
            [
              "State Inconsistency",
              "Component reads stale or wrong value",
              "Reading from different provider instance",
              "Race condition or caching bug",
            ],
            [
              "Toggle Does Nothing",
              "Theme toggle works on some pages, not others",
              "Toggle updates one provider, component reads another",
              "Event handler bug",
            ],
            [
              "Hydration Mismatch",
              "Server/client theme disagreement",
              "Server renders with one default, client hydrates with another",
              "SSR/CSR mismatch",
            ],
          ]}
        />

        <InfoBox type="tip">
          Quick diagnostic: Open React DevTools, search for your provider name (e.g., &quot;ThemeProvider&quot;).
          If you see it more than once in the component tree, you have duplication. The fix is to remove
          all but the outermost instance.
        </InfoBox>

        {/* Section 4 */}
        <SectionHeader number="04" title="React Context Mechanics" id="react-context-mechanics" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          To understand why duplication is a problem, you need to understand how React Context
          resolution works. When a component calls useContext (or useTheme, useAuth, etc.), React
          walks UP the component tree until it finds the nearest provider for that context. It does
          not search globally -- it searches its ancestor chain.
        </p>

        <DataFlowDiagram
          title="Context Resolution: Single Provider (Correct)"
          nodes={[
            { label: "RootLayout", description: "ThemeProvider here" },
            { label: "DashboardLayout", description: "No provider (inherits)" },
            { label: "DashboardPage", description: "useTheme() reads root" },
            { label: "ThemeToggle", description: "Updates root provider" },
            { label: "All Components", description: "See same theme" },
          ]}
        />

        <DataFlowDiagram
          title="Context Resolution: Duplicate Provider (Broken)"
          nodes={[
            { label: "RootLayout", description: "ThemeProvider A" },
            { label: "DashboardLayout", description: "ThemeProvider B (duplicate!)" },
            { label: "DashboardPage", description: "useTheme() reads B, not A" },
            { label: "Root ThemeToggle", description: "Updates A only" },
            { label: "Dashboard", description: "Sees B's default" },
          ]}
        />

        <CodeBlock
          filename="the-bug.tsx"
          language="typescript"
          code={`// ROOT LAYOUT -- providers.tsx
"use client"
import { ThemeProvider } from 'next-themes'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      {children} {/* ThemeProvider instance A */}
    </ThemeProvider>
  )
}

// DASHBOARD LAYOUT -- dashboard/layout.tsx
// Someone copied this from the root layout...
"use client"
import { ThemeProvider } from 'next-themes'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      {/* ThemeProvider instance B -- different default! */}
      <DashboardNav />
      {children}
    </ThemeProvider>
  )
}

// RESULT:
// - Root pages use ThemeProvider A (defaultTheme: "system")
// - Dashboard pages use ThemeProvider B (defaultTheme: "light")
// - Theme toggle in header updates A, but dashboard reads B
// - Dashboard always shows light theme regardless of toggle`}
        />

        {/* Section 5 */}
        <SectionHeader number="05" title="One Provider Per Concern" id="one-provider-pattern" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          The fix is a strict architectural rule: one provider instance per concern, placed at the
          highest necessary level. &quot;Highest necessary&quot; means the nearest common ancestor of all
          components that need that context.
        </p>

        <ArchitectureDiagram
          title="One Provider Per Concern Architecture"
          layers={[
            {
              name: "Root Layout (app/layout.tsx)",
              items: ["ThemeProvider", "AuthProvider", "ToastProvider"],
              color: "#3b82f6",
            },
            {
              name: "Feature Layouts (NO providers)",
              items: ["DashboardLayout (inherits all)", "AdminLayout (inherits all)", "PublicLayout (inherits all)"],
              color: "#22c55e",
            },
            {
              name: "Components (consumers only)",
              items: ["useTheme()", "useAuth()", "useToast()"],
              color: "#f59e0b",
            },
          ]}
        />

        <ComparisonCards
          title="Provider Placement Strategies"
          items={[
            {
              title: "Root-Level Providers",
              description: "Place at the root layout for concerns needed across the entire app",
              pros: [
                "Theme, auth, and toast are always available",
                "Single instance guarantees consistency",
                "Simple mental model for developers",
              ],
              cons: [
                "Slightly larger root layout",
                "All providers initialise on first page load",
              ],
            },
            {
              title: "Feature-Level Providers",
              description: "Place at the feature layout ONLY for concerns scoped to that feature",
              pros: [
                "Providers only load when feature is accessed",
                "Keeps feature state isolated",
                "Good for feature flags, feature-specific stores",
              ],
              cons: [
                "Must ensure no duplication with parent providers",
                "Feature components cannot share context with root",
              ],
            },
          ]}
        />

        {/* Section 6 */}
        <SectionHeader number="06" title="Implementation" id="implementation" />

        <SubSectionHeader title="Step 1: Centralise All Providers" />

        <CodeBlock
          filename="components/providers.tsx"
          language="typescript"
          code={`// Single file for ALL application-wide providers
"use client"

import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/toaster'

// One file. One source of truth. No duplication.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <Toaster />
    </ThemeProvider>
  )
}`}
        />

        <SubSectionHeader title="Step 2: Use in Root Layout Only" />

        <CodeBlock
          filename="app/layout.tsx"
          language="typescript"
          code={`// Root layout -- the ONLY place Providers appears
import { Providers } from '@/components/providers'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}`}
        />

        <SubSectionHeader title="Step 3: Feature Layouts Inherit, Never Duplicate" />

        <CodeBlock
          filename="app/dashboard/layout.tsx"
          language="typescript"
          code={`// Dashboard layout -- NO providers, NO "use client"
// This is a Server Component that inherits all context from root
import { DashboardNav } from '@/components/molecules/dashboard-nav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <DashboardNav /> {/* Client Component for interactivity */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

// DashboardNav can use useTheme() because it inherits from root ThemeProvider
// No duplicate provider needed`}
        />

        <FileTree
          title="Provider Architecture (Correct)"
          items={[
            {
              name: "app/",
              type: "folder",
              children: [
                { name: "layout.tsx", type: "file", label: "Imports <Providers> -- ONLY place" },
                {
                  name: "dashboard/",
                  type: "folder",
                  children: [
                    { name: "layout.tsx", type: "file", label: "Server Component, NO providers" },
                    { name: "page.tsx", type: "file", label: "Inherits all context from root" },
                  ],
                },
                {
                  name: "admin/",
                  type: "folder",
                  children: [
                    { name: "layout.tsx", type: "file", label: "Server Component, NO providers" },
                  ],
                },
              ],
            },
            {
              name: "components/",
              type: "folder",
              children: [
                { name: "providers.tsx", type: "file", label: "'use client' -- single source of truth" },
              ],
            },
          ]}
        />

        {/* Section 7 */}
        <SectionHeader number="07" title="Audit and Prevention" id="audit-prevention" />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Add a provider audit to your code review checklist. This grep command finds every provider
          instantiation in your codebase. If any provider appears more than once, investigate.
        </p>

        <CodeBlock
          filename="audit-script.sh"
          language="bash"
          code={`# Find all provider instantiations in the codebase
# Each provider name should appear in grep results EXACTLY ONCE

grep -rn "ThemeProvider" --include="*.tsx" -l
# Expected: 1 result (components/providers.tsx)

grep -rn "<.*Provider" --include="*.tsx" \\
  --include="*.jsx" -l | grep -v node_modules
# Review each result -- every Provider should have ONE instantiation

# Automated check for CI:
PROVIDER_COUNT=$(grep -rn "<ThemeProvider" --include="*.tsx" -l | wc -l)
if [ "$PROVIDER_COUNT" -gt 1 ]; then
  echo "ERROR: ThemeProvider found in $PROVIDER_COUNT files. Expected 1."
  exit 1
fi`}
        />

        <VerticalFlow
          title="Prevention Checklist for Code Reviews"
          steps={[
            {
              title: "Check New Layouts",
              description: "Any new layout.tsx file should NOT import or instantiate providers. Layouts inherit context from parent layouts.",
            },
            {
              title: "Audit Provider Count",
              description: "Run the grep command above. Each provider type should appear in exactly one file.",
            },
            {
              title: "Review Library Setup",
              description: "When adding a new library that requires a provider, add it to the centralised providers.tsx file, not to individual layouts.",
            },
            {
              title: "Check Migration Cleanup",
              description: "After any migration (CSS library, auth provider, state management), verify the old provider was removed, not just supplemented.",
            },
          ]}
        />

        {/* Key Takeaway */}
        <SectionHeader number="08" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Duplicate providers are a silent architectural bug. React treats nested providers as
          intentional, TypeScript sees them as valid JSX, and the symptoms (inconsistent state,
          flash of wrong theme) are often attributed to other causes. The fix is organisational:
          one provider per concern, placed at the highest necessary layout level, centralised in
          a single providers.tsx file, and a grep-based audit in your code review checklist.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            {
              title: "How 'use client' Layouts Cause Hydration Mismatches",
              href: "/dashboard/content-library/articles/architecture/hydration-mismatches-use-client-layouts",
            },
            {
              title: "Server/Client Boundaries",
              href: "/dashboard/content-library/articles/architecture/server-client-boundaries",
            },
            {
              title: "Atomic Design Principles",
              href: "/dashboard/content-library/articles/architecture/atomic-design-principles",
            },
          ]}
        />
      </div>

      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
