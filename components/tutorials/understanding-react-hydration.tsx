"use client"

import {
  TableOfContents,
  SectionHeader,
  StepFlow,
  InfoBox,
  KeyTakeaway,
  NumberedList,
  ProcessFlow,
  FeatureGrid,
  BeforeAfterComparison,
  DataFlowDiagram,
  CodeBlock as ArticleCodeBlock,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { CodeExplanation } from "@/components/atoms/code-explanation"

export function UnderstandingReactHydrationContent() {
  return (
    <div className="space-y-8">
      <TableOfContents
        items={[
          { id: "virtual-dom", title: "What is the Virtual DOM?" },
          { id: "ssr", title: "Server-Side Rendering Explained" },
          { id: "hydration", title: "What is Hydration?" },
          { id: "errors", title: "Why Hydration Errors Happen" },
          { id: "reading-errors", title: "Reading Error Messages" },
          { id: "fixes", title: "Basic Fixes" },
        ]}
      />

      <SectionHeader number="1" title="What is the Virtual DOM?" id="virtual-dom" />

      <p className="text-muted-foreground leading-relaxed">
        When you build a website with plain HTML, the browser creates a tree structure called the DOM
        (Document Object Model). Changing any node directly is slow because the browser has to recalculate
        layouts and repaint the screen. React solves this by keeping its own lightweight copy in memory --
        the Virtual DOM. When state changes, React updates this copy first, compares it with the previous
        version, and only updates the real DOM for the parts that actually changed.
      </p>

      <DataFlowDiagram
        nodes={[
          { id: "state", label: "State Change", description: "User clicks a button or data updates" },
          { id: "vdom", label: "Virtual DOM Update", description: "React updates its lightweight copy" },
          { id: "diff", label: "Reconciliation", description: "React compares old and new Virtual DOM" },
          { id: "patch", label: "DOM Patch", description: "Only changed elements are updated in the browser" },
        ]}
        connections={["state->vdom", "vdom->diff", "diff->patch"]}
      />

      <CodeBlock
        code={`// When you write JSX like this:
function Welcome() {
  return <h1 className="title">Hello World</h1>
}

// React creates a Virtual DOM object like this:
{
  type: 'h1',
  props: {
    className: 'title',
    children: 'Hello World'
  }
}

// This lightweight object is MUCH faster to compare
// than manipulating the actual browser DOM`}
        language="javascript"
        filename="Virtual DOM concept"
      />

      <InfoBox type="info" title="Why does this matter?">
        Think of the Virtual DOM as a blueprint. Comparing two blueprints is much cheaper than
        demolishing and rebuilding actual walls. React uses this pattern to make UI updates
        feel instantaneous.
      </InfoBox>

      <SectionHeader number="2" title="Server-Side Rendering Explained" id="ssr" />

      <BeforeAfterComparison
        before={{
          title: "Client-Side Rendering (SPA)",
          code: `<html>
  <body>
    <div id="root"></div>           <!-- Empty! -->
    <script src="bundle.js"></script> <!-- Everything here -->
  </body>
</html>
<!-- User sees blank screen until JS downloads and executes -->`,
        }}
        after={{
          title: "Server-Side Rendering (SSR)",
          code: `<html>
  <body>
    <div id="root">
      <h1>Welcome to Our App</h1>  <!-- Real content! -->
      <nav>...</nav>                 <!-- Already visible -->
      <main>...</main>               <!-- User sees this immediately -->
    </div>
    <script src="bundle.js"></script> <!-- Still needed for interactivity -->
  </body>
</html>`,
        }}
      />

      <FeatureGrid
        features={[
          {
            title: "Faster First Paint",
            description: "Users see content immediately instead of a blank screen",
          },
          {
            title: "Better SEO",
            description: "Search engines can read the fully rendered HTML directly",
          },
          {
            title: "Accessibility",
            description: "Content is available even before JavaScript loads",
          },
          {
            title: "Next.js Default",
            description: "All Next.js pages use SSR by default -- no configuration needed",
          },
        ]}
        columns={2}
      />

      <SectionHeader number="3" title="What is Hydration?" id="hydration" />

      <p className="text-muted-foreground leading-relaxed">
        SSR sends complete HTML, but that HTML is static -- buttons do not respond to clicks, forms
        cannot submit, dropdowns will not open. Hydration is the process where React &quot;wakes up&quot;
        the server-rendered HTML by attaching event listeners and connecting it to state management.
        React walks through the HTML, matches it against what it would render, and if they match,
        attaches interactivity.
      </p>

      <ProcessFlow
        steps={[
          "Server renders React components to HTML string",
          "Browser receives and displays the HTML (fast!)",
          "JavaScript bundle downloads in the background",
          "React walks the DOM, matching it to its Virtual DOM",
          "Event listeners attached -- page is now interactive",
        ]}
        title="The Hydration Process"
      />

      <CodeBlock
        code={`// Server generates this HTML:
<button class="btn">Click me (0 times)</button>

// React hydration runs on the client:
// Step 1: React renders the component in memory (Virtual DOM)
// Step 2: React compares its Virtual DOM to the actual HTML
// Step 3: If they match -> React attaches the onClick handler
// Step 4: The button is now interactive!

// But if server HTML said "Click me (0 times)"
// and client React renders "Click me (1 time)"...
// MISMATCH! React cannot safely attach interactivity`}
        language="javascript"
        filename="Hydration concept"
      />

      <InfoBox type="tip" title="The glove analogy">
        Think of hydration like a hand fitting into a glove. The glove (server HTML) must match
        the hand (client React). If the shapes are different, it will not work.
      </InfoBox>

      <SectionHeader number="4" title="Why Hydration Errors Happen" id="errors" />

      <StepFlow
        steps={[
          {
            number: "1",
            title: "Browser-Only APIs",
            description: "window, localStorage, navigator don't exist on the server",
          },
          {
            number: "2",
            title: "Random Values",
            description: "Math.random() or crypto.randomUUID() produce different results each time",
          },
          {
            number: "3",
            title: "Time-Dependent Code",
            description: "Date.now() or toLocaleTimeString() differ between server and client",
          },
          {
            number: "4",
            title: "Conditional Client State",
            description: "Rendering based on screen size before React can measure the screen",
          },
          {
            number: "5",
            title: "Third-Party Libraries",
            description: "Libraries that generate random IDs internally (e.g., Radix UI)",
          },
        ]}
      />

      <CodeBlock
        code={`// MISTAKE 1: Browser-only APIs
function UserGreeting() {
  const name = window.localStorage.getItem('name')  // window doesn't exist on server!
  return <p>Hello, {name}</p>
  // Server: <p>Hello, </p>  |  Client: <p>Hello, John</p>  =>  MISMATCH
}

// MISTAKE 2: Random values
function UniqueId() {
  const id = Math.random().toString(36)
  return <div id={id}>Content</div>
  // Server: id="abc123"  |  Client: id="xyz789"  =>  MISMATCH
}

// MISTAKE 3: Time-dependent rendering
function Clock() {
  return <span>{new Date().toLocaleTimeString()}</span>
  // Server: "10:00:01 AM"  |  Client: "10:00:02 AM"  =>  MISMATCH
}`}
        language="typescript"
        filename="Common hydration mistakes"
      />

      <SectionHeader number="5" title="Reading Error Messages" id="reading-errors" />

      <CodeBlock
        code={`// A typical hydration error in the console:
// "A tree hydrated but some attributes of the server
//  rendered HTML didn't match the client properties."
//
// + (client) aria-controls="radix-:R_259knelb_:"
// - (server) aria-controls="radix-:R_8l6itplb_:"
//
// The + line shows what the CLIENT rendered
// The - line shows what the SERVER rendered
// They are different random IDs = MISMATCH`}
        language="text"
        filename="Console output"
      />

      <CodeExplanation
        summary="How to read hydration diffs"
        terms={[
          { term: "- (minus) line", description: "What the SERVER generated -- this is the HTML already in the page" },
          { term: "+ (plus) line", description: "What the CLIENT expected -- this is what React would render fresh" },
          { term: "Component stack", description: "The tree of components leading to the mismatch -- start debugging from the deepest component" },
        ]}
      />

      <NumberedList
        items={[
          "Look at the + and - lines to see what specifically differs",
          "Check the component stack trace to find WHERE the mismatch occurs",
          "Ask: will this code produce identical output on server AND client?",
          "If it uses window, localStorage, Date, or Math.random -- that's your culprit",
        ]}
      />

      <SectionHeader number="6" title="Basic Fixes" id="fixes" />

      <CodeBlock
        code={`// FIX 1: useState + useEffect for browser-dependent values
"use client"
import { useState, useEffect } from 'react'

function UserGreeting() {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    setName(localStorage.getItem('name'))
  }, [])

  // Server: "Welcome!" | Client: "Welcome!" (same -- no mismatch!)
  // After hydration: "Welcome, John!" (safely updated)
  return <p>{name ? \`Welcome, \${name}!\` : 'Welcome!'}</p>
}

// FIX 2: Skip SSR entirely for complex client-only components
import dynamic from 'next/dynamic'

const ClientOnlyChart = dynamic(
  () => import('./Chart'),
  { ssr: false }
)

// FIX 3: Explicit client check with loading placeholder
function SafeComponent() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="h-10 bg-muted animate-pulse rounded" />
  }

  return <ComplexInteractiveWidget />
}`}
        language="typescript"
        filename="Hydration fixes"
      />

      <CodeExplanation
        summary="Fix patterns explained"
        terms={[
          { term: "useState + useEffect", description: "Start with a safe server-compatible default, update to real value after hydration completes" },
          { term: "dynamic({ ssr: false })", description: "Tells Next.js to skip server rendering entirely -- the component only renders in the browser" },
          { term: "isClient check", description: "Shows a placeholder during SSR, swaps to the real component after hydration" },
        ]}
      />

      <KeyTakeaway>
        Hydration errors happen when server and client HTML don't match. The fix is always the same
        principle: ensure identical output during the initial render, then safely update to
        client-specific values after hydration completes using useEffect.
      </KeyTakeaway>
    </div>
  )
}
