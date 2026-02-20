"use client"

import {
  SectionHeader,
  InfoBox,
  StepFlow,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  ProcessFlow,
  ArchitectureDiagram,
  FeatureGrid,
  TableOfContents,
} from "@/components/molecules/article-components"

const tocItems = [
  { id: "rendering-pipeline", title: "The Rendering Pipeline", level: 2 },
  { id: "reconciliation", title: "React's Reconciliation Algorithm", level: 2 },
  { id: "useid-internals", title: "How useId() Generates Deterministic IDs", level: 2 },
  { id: "radix-id-problem", title: "The Radix UI ID Problem", level: 2 },
  { id: "conditional-traps", title: "Conditional Rendering Traps", level: 2 },
  { id: "debugging", title: "Debugging Hydration Mismatches", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function HydrationDeepDiveArticleContent() {
  return (
    <div className="flex gap-10">
      <div className="prose prose-invert max-w-none flex-1">
        <SectionHeader number="01" title="The Rendering Pipeline" id="rendering-pipeline" />

        <InfoBox type="info" title="Background: How React Renders">
          Before understanding hydration failures, you need a clear mental model of React&apos;s rendering pipeline. Rendering
          in React is not the same as painting pixels on screen. When React &ldquo;renders&rdquo; a component, it calls your function
          and receives a tree of JavaScript objects (the Virtual DOM). This tree describes what the UI should look like, not what
          it currently looks like. React then compares this new tree with the previous one - a process called &ldquo;reconciliation&rdquo;
          - to determine the minimum set of DOM operations needed. Only after reconciliation does React actually touch the browser&apos;s
          DOM. This distinction between rendering (producing a description) and committing (applying changes) is central to
          understanding why hydration can fail.
        </InfoBox>

        <p className="text-muted-foreground leading-relaxed">
          In a server-side rendered application, the rendering pipeline has two distinct phases that must produce identical output.
          The server phase runs your components and serialises the resulting tree to HTML. The client phase receives that HTML, parses
          it into a DOM tree, then runs your components again to produce a new Virtual DOM tree. React walks both trees simultaneously,
          checking that every element, attribute, and text node matches. This is hydration.
        </p>

        <ArchitectureDiagram
          title="SSR + Hydration Pipeline"
          layers={[
            { name: "Server Render", items: ["Components execute", "JSX becomes HTML string"], color: "#3b82f6" },
            { name: "HTML Transfer", items: ["Complete HTML sent to browser over network"], color: "#3b82f6" },
            { name: "DOM Parse", items: ["Browser parses HTML into DOM tree"], color: "#eab308" },
            { name: "Client Render", items: ["React re-executes components", "Builds Virtual DOM"], color: "#eab308" },
            { name: "Reconciliation", items: ["React compares Virtual DOM against real DOM"], color: "#22c55e" },
            { name: "Hydration Complete", items: ["Event listeners attached", "App becomes interactive"], color: "#22c55e" },
          ]}
        />

        <p className="text-muted-foreground leading-relaxed">
          The critical requirement is that step 1 (server render) and step 4 (client render) produce the same output. If they
          diverge at any point - a different className, a different text node, a different attribute value - React logs a hydration
          error. In development mode, React will attempt to patch the mismatch by adopting the client version. In production, some
          mismatches may silently break event handlers or accessibility features because React cannot safely reconcile two different trees.
        </p>

        <SectionHeader number="02" title="React's Reconciliation Algorithm" id="reconciliation" />

        <InfoBox type="info" title="Background: Tree Diffing">
          Comparing two arbitrary tree structures is an O(n^3) problem in computer science, meaning a tree with 1,000 nodes would
          require one billion comparisons. React makes this tractable through two heuristics: (1) elements of different types produce
          entirely different trees, so React replaces the entire subtree rather than comparing children; (2) the developer provides
          &ldquo;key&rdquo; props to hint which children are stable across renders. These heuristics reduce the complexity to O(n), making
          reconciliation fast enough to run on every state change.
        </InfoBox>

        <p className="text-muted-foreground leading-relaxed">
          During hydration, React performs a special variant of reconciliation. Instead of comparing two Virtual DOM trees (the
          normal update path), it compares a Virtual DOM tree against the real DOM. React walks both trees depth-first, checking each
          node. For element nodes, it checks the tag name and key attributes like id, className, and ARIA attributes. For text nodes,
          it checks the content. When React finds a mismatch, it has two options: try to patch it (development) or silently adopt the
          client version (production). Neither is safe because the event listeners React attaches expect the client-rendered structure.
        </p>

        <StepFlow
          steps={[
            { number: 1, title: "Match Type", description: "Is this a <div> on both server and client? If not, replace entire subtree." },
            { number: 2, title: "Match Key Props", description: "Do id, className, aria-* attributes match? Log warning if not." },
            { number: 3, title: "Match Children", description: "Recursively compare child nodes in order. Key props help match moves." },
            { number: 4, title: "Attach Handlers", description: "If all matches pass, attach onClick, onChange, and other event listeners." },
          ]}
        />

        <p className="text-muted-foreground leading-relaxed">
          The recursive nature is important: a mismatch at a parent node can cascade into false mismatches in all children. If a Collapsible
          component renders extra wrapper divs when open vs closed, every child element shifts position, causing React to report mismatches
          throughout the subtree even though the underlying content is identical.
        </p>

        <SectionHeader number="03" title="How useId() Generates Deterministic IDs" id="useid-internals" />

        <InfoBox type="info" title="Background: Why Components Need IDs">
          Accessible web components require unique IDs to connect related elements. A dropdown button needs aria-controls pointing to
          the dropdown panel&apos;s ID. A form label needs htmlFor pointing to the input&apos;s ID. When building reusable components, you
          cannot hardcode these IDs because multiple instances would share the same ID, breaking both accessibility and functionality.
          React&apos;s useId() hook solves this by generating a unique ID that is consistent between server and client renders.
        </InfoBox>

        <p className="text-muted-foreground leading-relaxed">
          React&apos;s useId() does not use random numbers. Instead, it encodes the component&apos;s position in the React tree as a
          base-32 string. Each component that calls useId() receives an ID based on its depth and sibling index. This makes the ID
          deterministic: the same component tree always produces the same IDs, regardless of whether it runs on a server in London
          or a browser in Tokyo. The only requirement is that the component tree structure is identical on both sides.
        </p>

        <CodeBlock
          title="How useId() generates IDs from tree position"
          code={`// Simplified view of how useId() works:
// 
// Component Tree:              useId() output:
// <App>
//   <Header>
//     <NavDropdown />          → ":R1:"
//     <UserMenu />             → ":R2:"
//   </Header>
//   <Sidebar>
//     <Collapsible />          → ":R3:"
//     <Collapsible />          → ":R4:"
//     <Collapsible />          → ":R5:"
//   </Sidebar>
// </App>
//
// IDs are based on POSITION, not randomness.
// Same tree = same IDs, every time.
//
// BUT: if the tree structure CHANGES between
// server and client, positions shift:
//
// Server tree (section closed, no children rendered):
//   <Collapsible />            → ":R3:"
//   <Collapsible />            → ":R4:"
//
// Client tree (section open, extra children rendered):
//   <Collapsible />            → ":R3:"
//     <NestedCollapsible />    → ":R4:"  ← This shifted!
//   <Collapsible />            → ":R5:"  ← This shifted too!
//
// Every ID after the first mismatch is now wrong.`}
        />

        <InfoBox type="warning" title="The Cascade Effect">
          A single component rendering differently between server and client can shift the IDs of every subsequent component
          in the tree. In a sidebar with 20+ collapsible sections, one open/closed mismatch corrupts all remaining IDs.
          This is why hydration errors tend to appear in clusters rather than isolation.
        </InfoBox>

        <SectionHeader number="04" title="The Radix UI ID Problem" id="radix-id-problem" />

        <p className="text-muted-foreground leading-relaxed">
          Radix UI is a library of accessible, unstyled UI primitives used by shadcn/ui and thousands of production applications.
          Components like Collapsible, Accordion, Dialog, and DropdownMenu each internally call useId() to generate aria-controls
          and id attributes. This is excellent for accessibility but creates a hidden coupling: the number of Radix components
          mounted during SSR must exactly match the number mounted during client hydration.
        </p>

        <CodeBlock
          title="Radix Collapsible internal ID usage"
          code={`// Inside Radix's Collapsible component (simplified):
function Collapsible({ open, children }) {
  const id = useId()  // Generates based on tree position
  const contentId = \`radix-\${id}\`

  return (
    <>
      <button
        aria-controls={contentId}   // Points to content
        aria-expanded={open}
      >
        {triggerChild}
      </button>
      {/* Content always renders in DOM for animation,
          but may have different wrapper structure
          when open vs closed */}
      <div id={contentId} hidden={!open}>
        {contentChildren}
      </div>
    </>
  )
}

// When open={true}: the content div is visible,
//   children are fully rendered (more useId calls)
// When open={false}: the content div is hidden,
//   children may be partially rendered or skipped
//
// Different children = different tree = different IDs`}
        />

        <ComparisonCards
          leftTitle="Server Render (pathname unknown)"
          leftItems={[
            "All Collapsible sections default to closed",
            "Minimal children rendered in each section",
            "useId() generates IDs: :R3:, :R4:, :R5:, :R6:...",
            "Total Radix components mounted: 15",
          ]}
          rightTitle="Client Render (pathname available)"
          rightItems={[
            "Active section opens based on current URL",
            "Open section renders full child tree",
            "useId() IDs shift: :R3:, :R4a:, :R4b:, :R5:...",
            "Total Radix components mounted: 18",
          ]}
        />

        <SectionHeader number="05" title="Conditional Rendering Traps" id="conditional-traps" />

        <p className="text-muted-foreground leading-relaxed">
          Beyond Radix IDs, several common patterns create hydration mismatches. Understanding these helps you recognise
          and avoid them before they reach production. Each of these traps shares a common root cause: the server environment
          differs from the client environment, and code that depends on the environment produces different output.
        </p>

        <FeatureGrid
          features={[
            {
              title: "Browser API Access",
              description: "window, document, localStorage, navigator, and matchMedia do not exist on the server. Any component that reads from these during render will produce different output on server (undefined/null) vs client (real values). Always gate browser API access behind a hydration check or useEffect.",
            },
            {
              title: "Non-Deterministic Values",
              description: "Math.random(), Date.now(), crypto.randomUUID(), and performance.now() produce different values on every call. If these appear in your render output (as keys, IDs, or displayed text), server and client will never match. Use React's useId() for unique identifiers or generate values in useEffect.",
            },
            {
              title: "Timezone and Locale",
              description: "Date formatting with toLocaleDateString() or toLocaleTimeString() depends on the runtime's timezone and locale settings. A server in UTC rendering '15:00' will mismatch a client in GMT+5 rendering '20:00'. Format dates in useEffect or use a library that produces timezone-independent strings.",
            },
            {
              title: "Media Query Rendering",
              description: "Rendering different components based on window.innerWidth or matchMedia during SSR is a common trap. The server has no concept of screen size. Libraries like useMediaQuery that return false during SSR then true on client cause tree structure differences. Use CSS responsive classes instead of conditional rendering for layout changes.",
            },
            {
              title: "Third-Party Script Injection",
              description: "Browser extensions (ad blockers, translation tools, accessibility overlays) can modify the DOM between server HTML arrival and React hydration. React sees elements it did not create and reports mismatches. The suppressHydrationWarning attribute can help for specific elements, but is not a general solution.",
            },
            {
              title: "Stale Cache + New Code",
              description: "When deploying new code, a cached server response might contain HTML from the old version while the client loads new JavaScript. The old HTML structure does not match the new component tree. Versioned deployments and cache invalidation strategies prevent this.",
            },
          ]}
        />

        <SectionHeader number="06" title="Debugging Hydration Mismatches" id="debugging" />

        <ProcessFlow
          title="Systematic Debugging Process"
          steps={[
            { label: "Read the Diff", sublabel: "What specifically differs between + and - lines?" },
            { label: "Find the Source", sublabel: "Which component in the call stack owns this output?" },
            { label: "Identify the Cause", sublabel: "Random ID? Browser API? Conditional render?" },
            { label: "Choose the Fix", sublabel: "useEffect guard? Skeleton? Dynamic import?" },
          ]}
        />

        <CodeBlock
          title="Reading a real hydration error"
          code={`// ACTUAL ERROR FROM OUR SIDEBAR:
//
// "A tree hydrated but some attributes of the server
//  rendered HTML didn't match the client properties."
//
// Attribute: aria-controls
// + (client): "radix-:R_259knelb_:"
// - (server): "radix-:R_8l6itplb_:"
//
// ANALYSIS:
// 1. The differing attribute is "aria-controls"
// 2. Both values start with "radix-" → Radix UI generated them
// 3. The IDs are completely different → tree structure shifted
// 4. Call stack shows SidebarMenuButton → Collapsible
//
// DIAGNOSIS: Radix Collapsible IDs diverge because the
// sidebar component tree differs between server and client
// (sections open/closed based on pathname).
//
// FIX: Guard pattern - prevent Radix components from
// existing during SSR entirely.`}
        />

        <InfoBox type="tip" title="Development vs Production Behaviour">
          React only reports hydration mismatches in development mode. In production, React silently patches mismatches by
          adopting the client version. This means production users will not see error messages, but may experience broken event
          handlers, incorrect ARIA connections, or subtle layout shifts. Always test hydration in development with the console
          open before deploying.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Hydration errors are not React bugs - they are contract violations. The SSR contract states: the server-rendered HTML
          must exactly match what the client would render on first pass. When third-party libraries generate non-deterministic
          output (random IDs, environment-dependent values), the contract is impossible to honour during SSR. The solution is
          not to patch individual mismatches but to prevent the problematic components from participating in SSR at all, using
          architectural patterns like the hydration guard that contain the non-determinism to client-only rendering.
        </KeyTakeaway>
      </div>
      <TableOfContents items={tocItems} />
    </div>
  )
}
