"use client";

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  StepFlow,
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
  DecisionTree,
  BeforeAfterComparison,
  ArchitectureDiagram,
  FileTree,
  type TOCItem,
} from "@/components/molecules/article-components";

const tocItems: TOCItem[] = [
  { id: "the-boundary", title: "The Server/Client Boundary", level: 2 },
  { id: "what-crosses", title: "What Can Cross", level: 2 },
  { id: "what-cannot", title: "What Cannot Cross", level: 2 },
  { id: "serialisation", title: "The Serialisation Rule", level: 2 },
  { id: "composition-patterns", title: "Composition Patterns", level: 2 },
  { id: "common-mistakes", title: "Common Mistakes", level: 2 },
  { id: "decision-framework", title: "Server or Client?", level: 2 },
  { id: "architecture", title: "Architectural Implications", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
];

export function ServerClientBoundariesArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="important">
          The server/client boundary is the most consequential architectural
          decision in Next.js. Every component is either a Server Component or a
          Client Component, and the rules for what can cross between them are
          strict, often invisible, and the source of the most confusing errors
          in modern React.
        </InfoBox>

        {/* Section 1 */}
        <SectionHeader
          number="01"
          title="The Server/Client Boundary"
          id="the-boundary"
        />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          In Next.js App Router, all components are Server Components by
          default. They execute on the server, have access to the file system,
          databases, and secrets, and send only their rendered HTML to the
          browser. Client Components are explicitly opted in with the &quot;use
          client&quot; directive and run in the browser with access to state,
          effects, and browser APIs.
        </p>

        <p className="text-muted-foreground mb-6 leading-relaxed">
          The boundary between them is not just a conceptual divide -- it is a
          serialisation barrier. Data crossing from server to client must be
          serialisable to JSON. This single constraint drives most of the
          architectural patterns and error messages in Next.js applications.
        </p>

        <ArchitectureDiagram
          title="Server/Client Boundary Architecture"
          layers={[
            {
              name: "Server Environment",
              items: [
                "Server Components",
                "Server Actions",
                "Route Handlers",
                "Middleware",
              ],
              color: "#3b82f6",
            },
            {
              name: "Serialisation Boundary",
              items: [
                "Props (JSON-serialisable only)",
                "Server Action return values",
                "RSC Payload",
              ],
              color: "#f59e0b",
            },
            {
              name: "Client Environment",
              items: [
                "Client Components",
                "Event Handlers",
                "useState/useEffect",
                "Browser APIs",
              ],
              color: "#22c55e",
            },
          ]}
        />

        {/* Section 2 */}
        <SectionHeader
          number="02"
          title="What Can Cross the Boundary"
          id="what-crosses"
        />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Only JSON-serialisable values can be passed as props from a Server
          Component to a Client Component. This is because the server renders
          the component tree, serialises it into a payload (the RSC payload),
          and streams it to the browser where React hydrates the Client
          Components.
        </p>

        <StatsTable
          title="Serialisable Types (Can Cross)"
          headers={["Type", "Example", "Notes"]}
          rows={[
            ["Strings", '"hello"', "Always safe"],
            ["Numbers", "42, 3.14, NaN, Infinity", "All number types work"],
            ["Booleans", "true, false", "Always safe"],
            ["null", "null", "Safe, but not undefined"],
            ["Arrays", "[1, 2, 3]", "Must contain serialisable items"],
            [
              "Plain Objects",
              '{ name: "John" }',
              "Keys must be strings, values serialisable",
            ],
            [
              "Dates (as strings)",
              "date.toISOString()",
              "Convert to string before passing",
            ],
            [
              "JSX Elements",
              "<Component />",
              "Server Components can pass JSX as children",
            ],
          ]}
        />

        <InfoBox type="tip">
          JSX elements (React nodes) can cross the boundary as children or
          props. This is the foundation of the composition pattern -- a Client
          Component can receive Server Component children without those children
          becoming Client Components.
        </InfoBox>

        {/* Section 3 */}
        <SectionHeader
          number="03"
          title="What Cannot Cross the Boundary"
          id="what-cannot"
        />

        <StatsTable
          title="Non-Serialisable Types (Cannot Cross)"
          headers={["Type", "Example", "Error You Will See"]}
          rows={[
            [
              "Functions",
              "onClick={() => {}}",
              "Functions cannot be passed directly to Client Components",
            ],
            [
              "Class Instances",
              "new Map(), new Set()",
              "Only plain objects can be passed",
            ],
            ["Symbols", "Symbol('id')", "Symbols are not serialisable"],
            ["undefined", "undefined", "Use null instead"],
            [
              "Circular References",
              "obj.self = obj",
              "JSON.stringify throws on circular references",
            ],
            [
              "DOM Nodes",
              "document.getElementById",
              "Browser-only, does not exist on server",
            ],
            [
              "Event Handlers",
              "onSubmit={handleSubmit}",
              "Functions -- must be defined in client",
            ],
            [
              "Zustand Stores",
              "useStore()",
              "Hooks only work in Client Components",
            ],
          ]}
        />

        <CodeBlock
          filename="common-error.tsx"
          language="typescript"
          code={`// THIS WILL ERROR:
// Server Component passing a function to Client Component

// app/page.tsx (Server Component)
import { Button } from './button' // Client Component

export default function Page() {
  // Functions are NOT serialisable
  function handleClick() {
    console.log('clicked')
  }

  return <Button onClick={handleClick} /> // ERROR!
  // Error: Functions cannot be passed directly to Client Components
  // unless you explicitly expose it by marking it with "use server"
}

// FIX: Define the handler inside the Client Component
// components/button.tsx
"use client"

export function Button() {
  // Handler defined inside Client Component -- works fine
  function handleClick() {
    console.log('clicked')
  }

  return <button onClick={handleClick}>Click me</button>
}`}
        />

        {/* Section 4 */}
        <SectionHeader
          number="04"
          title="The Serialisation Rule"
          id="serialisation"
        />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Think of the boundary as a JSON.stringify/JSON.parse gate. If you
          cannot run JSON.stringify on the value and get it back with
          JSON.parse, it cannot cross. This mental model resolves 90% of
          boundary errors.
        </p>

        <DataFlowDiagram
          title="Serialisation Flow"
          nodes={[
            {
              label: "Server Component",
              description: "Renders with full Node.js access",
            },
            {
              label: "JSON.stringify",
              description: "Props serialised to RSC payload",
            },
            { label: "Network", description: "Streamed to browser" },
            { label: "JSON.parse", description: "Props deserialised" },
            {
              label: "Client Component",
              description: "Hydrates with browser APIs",
            },
          ]}
        />

        <InfoBox type="warning">
          Date objects are a common trap. They serialise to strings, so the
          client receives a string not a Date. Always convert dates to ISO
          strings on the server and parse them on the client with new
          Date(isoString).
        </InfoBox>

        <BeforeAfterComparison
          title="Date Handling Across the Boundary"
          before={{
            label: "Broken Pattern",
            items: [
              "Pass Date object as prop: createdAt={new Date()}",
              "Client receives: '2026-02-09T00:00:00.000Z' (string)",
              "Client calls date.getFullYear() -- TypeError: not a function",
              "Confusing because it works in development sometimes",
            ],
          }}
          after={{
            label: "Correct Pattern",
            items: [
              "Server: createdAt={date.toISOString()}",
              "Client receives: '2026-02-09T00:00:00.000Z' (string, expected)",
              "Client: const date = new Date(createdAt)",
              "Explicit, predictable, always works",
            ],
          }}
        />

        {/* Section 5 */}
        <SectionHeader
          number="05"
          title="Composition Patterns"
          id="composition-patterns"
        />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          The most powerful pattern for working with the boundary is
          composition: passing Server Components as children to Client
          Components. The Client Component does not need to know its children
          are Server Components -- it just renders them.
        </p>

        <SubSectionHeader title="Pattern 1: Children Composition" />

        <CodeBlock
          filename="children-composition.tsx"
          language="typescript"
          code={`// Client Component: provides interactivity wrapper
"use client"

import { useState } from 'react'

export function Accordion({ children, title }: {
  children: React.ReactNode
  title: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>{title}</button>
      {isOpen && children} {/* Children can be Server Components! */}
    </div>
  )
}

// Server Component: fetches data, passes as children
// app/faq/page.tsx (Server Component)
import { Accordion } from './accordion'

export default async function FAQPage() {
  const faqs = await db.query('SELECT * FROM faqs')

  return (
    <div>
      {faqs.map(faq => (
        <Accordion key={faq.id} title={faq.question}>
          {/* This is a Server Component rendering inside a Client Component */}
          <FAQAnswer answer={faq.answer} />
        </Accordion>
      ))}
    </div>
  )
}`}
        />

        <SubSectionHeader title="Pattern 2: Render Props" />

        <CodeBlock
          filename="render-props.tsx"
          language="typescript"
          code={`// Pattern: Pass Server Component output as a prop
// Useful when children slot is already taken

// app/dashboard/page.tsx (Server Component)
import { InteractivePanel } from './interactive-panel'
import { UserStats } from './user-stats' // Server Component

export default async function Dashboard() {
  return (
    <InteractivePanel
      // Server Component rendered, then passed as JSX prop
      header={<UserStats />}
      // Data prop (serialisable)
      title="Dashboard"
    />
  )
}

// components/interactive-panel.tsx (Client Component)
"use client"
import { useState } from 'react'

export function InteractivePanel({ header, title }: {
  header: React.ReactNode // JSX can cross the boundary
  title: string
}) {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div>
      <h1 onClick={() => setCollapsed(!collapsed)}>{title}</h1>
      {!collapsed && header} {/* Server Component JSX rendered here */}
    </div>
  )
}`}
        />

        <SubSectionHeader title="Pattern 3: Server Action Callbacks" />

        <CodeBlock
          filename="server-action-pattern.tsx"
          language="typescript"
          code={`// Server Actions CAN cross the boundary (special exception)
// They are serialised as references, not as function bodies

// app/actions.ts
"use server"

export async function submitForm(formData: FormData) {
  const name = formData.get('name') as string
  await db.insert({ name })
  return { success: true }
}

// components/contact-form.tsx (Client Component)
"use client"

import { submitForm } from '@/app/actions'

export function ContactForm() {
  return (
    <form action={submitForm}> {/* Server Action reference -- works! */}
      <input name="name" />
      <button type="submit">Send</button>
    </form>
  )
}

// Note: Server Actions are the ONE exception to the
// "functions cannot cross" rule. They are serialised as
// endpoint references, not actual function bodies.`}
        />

        {/* Section 6 */}
        <SectionHeader
          number="06"
          title="Common Mistakes"
          id="common-mistakes"
        />

        <FeatureGrid
          columns={2}
          features={[
            {
              title: "Mistake: Making Layout a Client Component",
              description:
                "Adding 'use client' to a layout because it needs one interactive element. This forces ALL children to be Client Components, losing server rendering for the entire subtree.",
              items: [
                "Fix: Extract the interactive part into a small Client Component",
                "Keep the layout as a Server Component",
                "Pass the Client Component as a child",
              ],
            },
            {
              title: "Mistake: Importing Server-Only Code in Client",
              description:
                "Importing a database utility or API key into a Client Component. The bundler will try to include it in the client bundle, leaking secrets or crashing.",
              items: [
                "Fix: Use the 'server-only' package to mark modules",
                "Server-only imports throw at build time if used in client",
                "Always separate server utilities from shared utilities",
              ],
            },
            {
              title: "Mistake: useState for Data That Does Not Change",
              description:
                "Using useState to hold data fetched from an API, when the data is available at render time. This unnecessarily makes the component a Client Component.",
              items: [
                "Fix: Fetch in a Server Component, pass as props",
                "Only use useState for truly dynamic client state",
                "Think: does this data change after first render?",
              ],
            },
            {
              title: "Mistake: Wrapping Everything in Providers",
              description:
                "Wrapping the entire app in Context providers in the root layout. React Context requires 'use client', so this makes the root layout a Client Component.",
              items: [
                "Fix: Create a separate Providers Client Component",
                "Import it in the Server Component layout",
                "Pass children through: <Providers>{children}</Providers>",
              ],
            },
          ]}
        />

        {/* Section 7 */}
        <SectionHeader
          number="07"
          title="Server or Client? Decision Framework"
          id="decision-framework"
        />

        <DecisionTree
          title="Component Placement Decision Tree"
          decisions={[
            {
              condition: "Uses useState, useEffect, or event handlers?",
              result: "Client Component ('use client')",
              recommended: false,
            },
            {
              condition:
                "Uses browser-only APIs (window, document, localStorage)?",
              result: "Client Component ('use client')",
              recommended: false,
            },
            {
              condition: "Fetches data or accesses secrets/env variables?",
              result: "Server Component (default, no directive needed)",
              recommended: true,
            },
            {
              condition: "Purely presentational (renders props/children)?",
              result: "Server Component (smaller bundle, faster)",
              recommended: true,
            },
            {
              condition: "None of the above apply?",
              result: "Evaluate case-by-case, default to Server Component",
              recommended: false,
            },
          ]}
        />

        <StatsTable
          title="Server vs Client Component Capabilities"
          headers={["Capability", "Server Component", "Client Component"]}
          rows={[
            [
              "Fetch data",
              "Direct DB/API access",
              "Via API routes or Server Actions",
            ],
            [
              "Access secrets",
              "Yes (env variables)",
              "No (exposed to browser)",
            ],
            ["Use hooks", "No", "Yes (useState, useEffect, etc.)"],
            ["Event handlers", "No", "Yes (onClick, onChange, etc.)"],
            ["Browser APIs", "No", "Yes (window, document, etc.)"],
            [
              "Bundle size impact",
              "Zero (not sent to browser)",
              "Added to JS bundle",
            ],
            [
              "Rendering",
              "Server only",
              "Server (initial) + Client (hydration)",
            ],
            ["Caching", "Can be cached at CDN", "Re-renders on state change"],
          ]}
        />

        {/* Section 8 */}
        <SectionHeader
          number="08"
          title="Architectural Implications"
          id="architecture"
        />

        <p className="text-muted-foreground mb-6 leading-relaxed">
          Understanding the boundary changes how you architect entire
          applications. The goal is to push as much as possible to Server
          Components (zero bundle cost, direct data access) and use Client
          Components only for the interactive leaf nodes.
        </p>

        <FileTree
          title="Recommended Component Architecture"
          items={[
            {
              name: "app/",
              type: "folder",
              children: [
                {
                  name: "layout.tsx",
                  type: "file",
                  description:
                    "Server Component -- wraps Providers client component",
                },
                {
                  name: "page.tsx",
                  type: "file",
                  description:
                    "Server Component -- fetches data, passes to children",
                },
                {
                  name: "dashboard/",
                  type: "folder",
                  children: [
                    {
                      name: "page.tsx",
                      type: "file",
                      description:
                        "Server -- fetches stats, passes to client cards",
                    },
                  ],
                },
              ],
            },
            {
              name: "components/",
              type: "folder",
              children: [
                {
                  name: "providers.tsx",
                  type: "file",
                  description: "'use client' -- Theme, Auth, Store providers",
                },
                {
                  name: "atoms/",
                  type: "folder",
                  children: [
                    {
                      name: "button.tsx",
                      type: "file",
                      description: "'use client' -- needs onClick",
                    },
                    {
                      name: "badge.tsx",
                      type: "file",
                      description: "Server -- purely presentational",
                    },
                  ],
                },
                {
                  name: "organisms/",
                  type: "folder",
                  children: [
                    {
                      name: "data-table.tsx",
                      type: "file",
                      description:
                        "'use client' -- sorting, filtering, pagination state",
                    },
                    {
                      name: "stats-overview.tsx",
                      type: "file",
                      description: "Server -- renders metrics from props",
                    },
                  ],
                },
              ],
            },
          ]}
        />

        <VerticalFlow
          title="Architecture Principle: Push Down the Client Boundary"
          steps={[
            {
              title: "Start with Everything as Server Components",
              description:
                "The default is server. Only add 'use client' when you encounter a specific need (hooks, events, browser APIs). This gives you the smallest possible client bundle.",
            },
            {
              title: "Identify Interactive Leaf Nodes",
              description:
                "Find the specific elements that need interactivity: buttons, form inputs, dropdowns, modals. These are your Client Components -- keep them small and focused.",
            },
            {
              title: "Extract Client Components Down",
              description:
                "Instead of making a whole page a Client Component, extract just the interactive part. A 500-line page with one dropdown should have a 20-line Client Component for the dropdown.",
            },
            {
              title: "Use Composition to Connect Them",
              description:
                "Server Components fetch data and render structure. Client Components handle interaction. Use children/props composition to wire them together without leaking the boundary upward.",
            },
          ]}
        />

        {/* Key Takeaway */}
        <SectionHeader number="09" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          The server/client boundary is a serialisation barrier, not a
          suggestion. Design your component tree so that Server Components
          handle data and structure at the top, and Client Components handle
          interactivity at the leaves. Use composition (children, JSX props) to
          connect them. When in doubt, ask: "Can I JSON.stringify this prop?" If
          not, it cannot cross. Master this one concept and most Next.js App
          Router confusion disappears.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            {
              title: "Why React Hydration Breaks",
              href: "/dashboard/content-library/articles/architecture/why-react-hydration-breaks",
            },
            {
              title: "Server Actions Deep Dive",
              href: "/dashboard/content-library/articles/architecture/server-actions-deep-dive",
            },
            {
              title: "Guard Pattern Architecture",
              href: "/dashboard/content-library/articles/architecture/guard-pattern-architecture",
            },
          ]}
        />
      </div>

      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  );
}
