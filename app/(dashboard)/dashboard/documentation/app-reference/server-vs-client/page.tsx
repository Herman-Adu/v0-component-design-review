"use client"

import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { Callout } from "@/components/atoms/callout"
import { CodeBlock } from "@/components/atoms/code-block"
import { GitCompareArrows } from "lucide-react"

const SECTIONS = [
  { id: "golden-rule", title: "The Golden Rule" },
  { id: "decision-matrix", title: "Decision Matrix" },
  { id: "refactoring-examples", title: "Real Refactoring Examples" },
  { id: "client-boundary", title: "Understanding the Client Boundary" },
  { id: "performance-impact", title: "Performance Impact" },
  { id: "migration-checklist", title: "Migration Checklist" },
  { id: "pitfalls", title: "Common Pitfalls" },
  { id: "best-practices", title: "Best Practices" },
]

export default function ServerVsClientPage() {
  return (
    <DocPage
      title="Server vs Client Components"
      description="Understanding the difference and making the right choice for performance"
      icon={GitCompareArrows}
      badges={["Next.js 16", "RSC", "Performance"]}
      tags={["server-components", "client-components", "bundle-size", "optimization"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* The Golden Rule */}
      <section className="space-y-4">
        <DocSectionHeader id="golden-rule">The Golden Rule</DocSectionHeader>
        <Callout type="tip" title="Default to Server Components">
          In Next.js 16, all components are Server Components by default. Only add "use client" when you absolutely need
          client-side interactivity.
        </Callout>
        <p className="text-foreground leading-relaxed">
          Server Components are rendered on the server and sent as HTML to the browser. They have zero JavaScript bundle
          impact, can directly access backend resources, and improve initial page load performance.
        </p>
      </section>

      {/* Decision Matrix */}
      <section className="space-y-6">
        <DocSectionHeader id="decision-matrix">Decision Matrix</DocSectionHeader>
        <div className="responsive-grid-2 mb-6">
          <div className="border border-green-500/30 bg-green-500/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-3">Use Server Components For:</h3>
            <ul className="space-y-2 text-sm">
              <li>Static content (headings, paragraphs, lists)</li>
              <li>Data fetching from databases or APIs</li>
              <li>Layouts and page structure</li>
              <li>SEO-critical content</li>
              <li>Heavy data processing</li>
              <li>Accessing backend resources</li>
              <li>Display-only components</li>
            </ul>
          </div>
          <div className="border border-accent/30 bg-accent/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-accent mb-3">Use Client Components For:</h3>
            <ul className="space-y-2 text-sm">
              <li>Event handlers (onClick, onChange, etc.)</li>
              <li>React hooks (useState, useEffect, etc.)</li>
              <li>Browser APIs (localStorage, navigator)</li>
              <li>Animations and transitions</li>
              <li>Form inputs and validation</li>
              <li>Third-party libraries requiring client code</li>
              <li>Interactive UI components</li>
            </ul>
          </div>
        </div>
        <Callout type="warning" title="The Bundle Size Impact">
          {'Every "use client" directive adds JavaScript to the client bundle. A 50KB client component could be a 0KB server component if it doesn\'t need interactivity.'}
        </Callout>
      </section>

      {/* Real Refactoring Examples */}
      <section className="space-y-6">
        <DocSectionHeader id="refactoring-examples">Real Refactoring Examples</DocSectionHeader>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Example 1: Review Step - Hybrid Approach</h3>
          <div className="mb-4">
            <h4 className="text-lg font-medium mb-2 text-red-400">Before: Entirely Client Component</h4>
            <CodeBlock
              language="tsx"
              code={`"use client"

export function ReviewStep() {
  const { data, goToStep } = useFormStore()
  
  return (
    <div>
      {/* Static display of data - doesn't need client JS */}
      <div className="bg-muted/30 border rounded-lg p-6">
        <h3>Personal Information</h3>
        <dl>
          <dt>Name</dt>
          <dd>{data.personalInfo.firstName}</dd>
        </dl>
        <button onClick={() => goToStep(1)}>Edit</button>
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
// Problem: The entire component is client-side`}
            />
          </div>
          <div>
            <h4 className="text-lg font-medium mb-2 text-green-400">After: Hybrid with Client Islands</h4>
            <CodeBlock
              language="tsx"
              code={`// Server Component (no "use client")
export function ReviewStepDisplay({ data, onEdit }) {
  return (
    <div className="bg-muted/30 border rounded-lg p-6">
      <h3>Personal Information</h3>
      <dl><dt>Name</dt><dd>{data.personalInfo.firstName}</dd></dl>
      <button onClick={() => onEdit(1)}>Edit</button>
    </div>
  )
}

// Client Component (only interactive parts)
"use client"
export function ReviewStep() {
  const { data, goToStep, handleSubmit } = useFormStore()
  return (
    <div>
      <ReviewStepDisplay data={data} onEdit={goToStep} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  )
}
// Result: Data display is server-rendered, only interactive elements have client JS`}
            />
          </div>
          <Callout type="success" title="Performance Improvement">
            Bundle size reduced by ~15KB by moving static content to server component. Initial page load is faster because HTML arrives pre-rendered.
          </Callout>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Example 2: Step Indicator - Must Stay Client</h3>
          <CodeBlock
            language="tsx"
            code={`"use client"  // Required because:

import { motion } from "framer-motion"  // 1. Framer Motion needs client
import { useState } from "react"         // 2. Animation state

export function StepIndicator({ steps, currentStep }) {
  // Cannot remove "use client" because:
  // - Framer Motion requires browser APIs
  // - Complex animations need client-side execution
  return (
    <motion.div animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* ... animated SVGs ... */}
    </motion.div>
  )
}
// Analysis: Genuinely needs "use client"`}
          />
          <Callout type="info" title="When Client Components Are Justified">
            {'StepIndicator uses Framer Motion for complex animations. While CSS animations could make it a server component, Framer Motion provides significantly better DX for complex animation sequences.'}
          </Callout>
        </div>
      </section>

      {/* Client Boundary */}
      <section className="space-y-4">
        <DocSectionHeader id="client-boundary">Understanding the Client Boundary</DocSectionHeader>
        <p className="text-foreground leading-relaxed">
          {'When you add "use client" to a component, all components imported by it become client components too. This is called the "client boundary".'}
        </p>
        <CodeBlock
          language="tsx"
          code={`// Bad: ServerComponent becomes a client component
"use client"
import { ServerComponent } from "./server-component"  // Now client!
export function ClientComponent() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <ServerComponent />  {/* Gets converted to client component */}
    </div>
  )
}

// Good: Keep server components on server via composition
"use client"
export function ClientComponent({ children }) {
  const [count, setCount] = useState(0)
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      {children}  {/* Can pass server components as children */}
    </div>
  )
}

// In parent (server component):
<ClientComponent>
  <ServerComponent />  {/* Stays as server component */}
</ClientComponent>`}
        />
        <Callout type="tip" title="Composition Pattern">
          Use the composition pattern (children props) to pass server components into client components without turning them into client components.
        </Callout>
      </section>

      {/* Performance Impact */}
      <section className="space-y-4">
        <DocSectionHeader id="performance-impact">Performance Impact</DocSectionHeader>
        <div className="bg-muted/30 border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Bundle Size Comparison</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2">Component</th>
                <th className="text-right py-2">Before (Client)</th>
                <th className="text-right py-2">After (Server/Hybrid)</th>
                <th className="text-right py-2">Savings</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-2">Review Display</td>
                <td className="text-right font-mono">~18KB</td>
                <td className="text-right font-mono">~3KB</td>
                <td className="text-right text-green-400 font-semibold">-15KB (83%)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-2">Step Indicator</td>
                <td className="text-right font-mono">~45KB</td>
                <td className="text-right font-mono">~45KB</td>
                <td className="text-right text-muted-foreground">No change (needs client)</td>
              </tr>
              <tr>
                <td className="py-2 font-semibold">Total Reduction</td>
                <td className="text-right font-mono" />
                <td className="text-right font-mono" />
                <td className="text-right text-green-400 font-bold">~15KB</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout type="success" title="Real-World Impact">
          15KB may not sound like much, but on slower connections or mobile devices, this translates to 100-300ms faster Time to Interactive (TTI). For every component you convert, these savings compound.
        </Callout>
      </section>

      {/* Migration Checklist */}
      <section className="space-y-4">
        <DocSectionHeader id="migration-checklist">Migration Checklist</DocSectionHeader>
        <div className="bg-accent/5 border border-accent/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">How to Audit Your Components</h3>
          <ol className="space-y-3 text-sm list-decimal list-inside">
            <li>
              <strong>Find all client components:</strong>
              <CodeBlock language="bash" code={'grep -r "use client" components/'} />
            </li>
            <li>
              <strong>For each component, ask:</strong>
              <ul className="ml-6 mt-2 space-y-1 list-disc list-inside">
                <li>Does it use useState, useEffect, or other React hooks?</li>
                <li>Does it have event handlers (onClick, onChange)?</li>
                <li>Does it use browser APIs (window, localStorage)?</li>
                <li>Does it use third-party libraries requiring client code?</li>
              </ul>
            </li>
            <li><strong>If NO to all above:</strong> Remove "use client" and test</li>
            <li><strong>If YES to some:</strong> Consider splitting into server display + client interactivity</li>
            <li><strong>Test thoroughly:</strong> Ensure no runtime errors after conversion</li>
          </ol>
        </div>
      </section>

      {/* Common Pitfalls */}
      <section className="space-y-4">
        <DocSectionHeader id="pitfalls">Common Pitfalls</DocSectionHeader>
        <div className="space-y-4">
          <Callout type="error" title="Pitfall 1: Using useEffect for data fetching">
            {"Don't use useEffect to fetch data in client components when you can fetch directly in server components. Server components can async/await directly."}
          </Callout>
          <Callout type="error" title="Pitfall 2: Premature optimization">
            {"Don't spend hours converting a 2KB component. Focus on the largest client components first for maximum impact."}
          </Callout>
          <Callout type="error" title="Pitfall 3: Breaking third-party libraries">
            {'Some libraries explicitly require "use client". Always check library documentation before removing it.'}
          </Callout>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-4">
        <DocSectionHeader id="best-practices">Best Practices</DocSectionHeader>
        <div className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">1. Start Server, Add Client When Needed</h3>
            <p className="text-sm text-muted-foreground">
              {'Build components as server components first. Only add "use client" when you encounter an error that requires it.'}
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">2. Push Client Boundary Down</h3>
            <p className="text-sm text-muted-foreground">
              {'"use client" as deep in the component tree as possible. Don\'t make a whole page client when only a button needs interactivity.'}
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">3. Use Composition for Server/Client Mix</h3>
            <p className="text-sm text-muted-foreground">
              Pass server components as children to client components instead of importing them directly.
            </p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold mb-2">4. Measure the Impact</h3>
            <p className="text-sm text-muted-foreground">
              Use Next.js build output and Lighthouse to measure bundle size improvements after refactoring.
            </p>
          </div>
        </div>
      </section>
    </DocPage>
  )
}
