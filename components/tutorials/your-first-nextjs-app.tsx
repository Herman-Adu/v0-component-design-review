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
  FileTreeDiagram,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { CodeExplanation } from "@/components/atoms/code-explanation"

const tocItems = [
  { id: "overview", title: "What We Are Building" },
  { id: "setup", title: "Project Setup" },
  { id: "file-structure", title: "Understanding File Structure" },
  { id: "first-page", title: "Your First Page" },
  { id: "server-action", title: "Adding a Server Action" },
  { id: "running", title: "Running Your App" },
  { id: "takeaways", title: "Key Takeaways" },
]

export function YourFirstNextjsAppContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">
        {/* Overview */}
        <section>
          <SectionHeader number="01" title="What We Are Building" id="overview" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            In this tutorial, you will create a complete contact form application from scratch
            using Next.js 16 and the App Router. By the end, you will understand project setup,
            file-based routing, Tailwind CSS styling, and server actions.
          </p>
        </section>

        <FeatureGrid
          title="What You Will Learn"
          features={[
            { title: "Project Setup", description: "Create and configure a new Next.js 16 project with TypeScript and Tailwind" },
            { title: "App Router", description: "Understand file-based routing with layouts and pages" },
            { title: "Tailwind CSS", description: "Style your application using utility-first CSS classes" },
            { title: "Server Actions", description: "Handle form submissions securely on the server" },
          ]}
        />

        <InfoBox type="info" title="Prerequisites">
          Make sure you have Node.js 18 or later installed. Check your version by running
          node --version in your terminal. You will also need a code editor like VS Code.
        </InfoBox>

        {/* Setup */}
        <section>
          <SectionHeader number="02" title="Project Setup" id="setup" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Next.js provides a CLI tool that scaffolds a complete project with all the
            configuration you need. Run the following command in your terminal.
          </p>
        </section>

        <CodeBlock
          language="bash"
          title="Create Your Project"
          code={`npx create-next-app@latest my-first-app

# When prompted, select:
#   TypeScript:    Yes
#   ESLint:        Yes
#   Tailwind CSS:  Yes
#   src/ directory: No
#   App Router:    Yes
#   Import alias:  @/*

cd my-first-app`}
        />

        <StepFlow
          title="Setup Steps"
          steps={[
            { number: 1, title: "Run create-next-app", description: "The CLI scaffolds a complete project with TypeScript, ESLint, and Tailwind pre-configured" },
            { number: 2, title: "Select options", description: "Choose Yes for TypeScript, Tailwind, and App Router. These are the modern defaults." },
            { number: 3, title: "Enter the directory", description: "cd into your new project folder to start working" },
          ]}
        />

        {/* File Structure */}
        <section>
          <SectionHeader number="03" title="Understanding File Structure" id="file-structure" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            The App Router uses a file-based routing system. Every folder inside the app
            directory becomes a URL route, and page.tsx files define what renders at that route.
          </p>
        </section>

        <FileTreeDiagram
          title="Project Structure"
          items={[
            { name: "app/", type: "folder", children: [
              { name: "layout.tsx", type: "file", description: "Root layout wrapping all pages" },
              { name: "page.tsx", type: "file", description: "Homepage rendered at /" },
              { name: "globals.css", type: "file", description: "Global styles and Tailwind imports" },
            ]},
            { name: "public/", type: "folder", children: [
              { name: "images/", type: "folder", description: "Static assets served at /images/*" },
            ]},
            { name: "next.config.mjs", type: "file", description: "Next.js configuration" },
            { name: "package.json", type: "file", description: "Dependencies and scripts" },
            { name: "tsconfig.json", type: "file", description: "TypeScript configuration" },
          ]}
        />

        <CodeExplanation
          summary="The App Router maps filesystem structure directly to URL routes."
          terms={[
            { term: "layout.tsx", description: "Wraps all child pages. Persists across navigation so shared UI like headers stays mounted." },
            { term: "page.tsx", description: "The leaf component that renders at a route. Every route needs one." },
            { term: "globals.css", description: "Imported in the root layout. Contains Tailwind directives and global styles." },
          ]}
        />

        {/* First Page */}
        <section>
          <SectionHeader number="04" title="Your First Page" id="first-page" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Replace the default homepage with a contact form. This page uses Tailwind CSS
            classes for styling -- no separate CSS files needed.
          </p>
        </section>

        <CodeBlock
          language="tsx"
          filename="app/page.tsx"
          title="Contact Form Page"
          code={`export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Contact Us
        </h1>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Your name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="you@example.com"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
          >
            Send Message
          </button>
        </form>
      </div>
    </main>
  )
}`}
        />

        <InfoBox type="tip" title="Tailwind Tip">
          Tailwind classes like flex, items-center, and rounded-lg apply CSS properties
          directly in your markup. Hover your cursor over any class in VS Code to see
          the CSS it generates.
        </InfoBox>

        {/* Server Action */}
        <section>
          <SectionHeader number="05" title="Adding a Server Action" id="server-action" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Server Actions run exclusively on the server, keeping your data handling secure.
            The "use server" directive at the top of a file marks all exports as server-only.
          </p>
        </section>

        <CodeBlock
          language="typescript"
          filename="app/actions.ts"
          title="Server Action"
          code={`"use server"

export async function submitContact(formData: FormData) {
  const name = formData.get("name") as string
  const email = formData.get("email") as string

  if (!name || !email) {
    return { success: false, error: "All fields are required" }
  }

  // In production, save to a database here
  console.log("Contact submission:", { name, email })

  return { success: true, message: "Thanks for reaching out!" }
}`}
        />

        <ProcessFlow
          title="Server Action Flow"
          steps={[
            "User fills in the form and clicks submit",
            "Browser sends FormData to the server action",
            "Server validates the input",
            "Server processes the data (save to DB, send email, etc)",
            "Server returns a result object to the client",
          ]}
        />

        {/* Running */}
        <section>
          <SectionHeader number="06" title="Running Your App" id="running" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Start the development server to see your application. Next.js supports hot
            module replacement so changes appear instantly without a full page reload.
          </p>
        </section>

        <CodeBlock
          language="bash"
          title="Start Development Server"
          code={`npm run dev

# Open http://localhost:3000 in your browser`}
        />

        <NumberedList
          items={[
            "Run npm run dev in your terminal",
            "Open http://localhost:3000 in your browser",
            "You should see your contact form",
            "Try editing app/page.tsx and watch the browser update instantly",
          ]}
        />

        {/* Takeaways */}
        <section>
          <SectionHeader number="07" title="Key Takeaways" id="takeaways" />
        </section>

        <KeyTakeaway>
          You have built a complete Next.js 16 application with a styled contact form and
          a server action to handle submissions. The App Router uses file-based routing where
          folders become URLs and page.tsx files define content. Server actions with the
          "use server" directive keep your data handling secure and server-only.
        </KeyTakeaway>
      </div>

      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-8">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  )
}
