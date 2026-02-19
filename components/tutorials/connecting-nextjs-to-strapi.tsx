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
  StatsTable,
  CodeBlock as ArticleCodeBlock,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { CodeExplanation } from "@/components/atoms/code-explanation"

export function ConnectingNextjsToStrapiContent() {
  return (
    <div className="space-y-8">
      <TableOfContents
        items={[
          { id: "overview", title: "Architecture Overview" },
          { id: "env-setup", title: "Environment Variables" },
          { id: "api-client", title: "Creating a Type-Safe API Client" },
          { id: "server-components", title: "Fetching in Server Components" },
          { id: "error-handling", title: "Error Handling" },
        ]}
      />

      <SectionHeader number="1" title="Architecture Overview" id="overview" />

      <p className="text-muted-foreground leading-relaxed">
        Connecting Next.js to Strapi follows a clean frontend-backend architecture. Strapi serves
        as your headless CMS providing a REST API, while Next.js consumes that API using Server
        Components for optimal performance and SEO.
      </p>

      <ProcessFlow
        steps={[
          "Strapi creates and manages content via the admin panel",
          "Strapi exposes content through its REST API",
          "Next.js Server Components fetch data at request time",
          "Next.js renders HTML server-side and sends to browser",
        ]}
        title="Data Flow"
      />

      <FeatureGrid
        features={[
          {
            title: "Type Safety",
            description: "TypeScript interfaces ensure your frontend matches your API schema",
          },
          {
            title: "Server-Side Fetching",
            description: "Data is fetched on the server -- no API keys exposed to the browser",
          },
          {
            title: "ISR Caching",
            description: "Incremental Static Regeneration keeps pages fast with fresh data",
          },
          {
            title: "Error Boundaries",
            description: "Next.js error.tsx files handle API failures gracefully",
          },
        ]}
        columns={2}
      />

      <SectionHeader number="2" title="Environment Variables" id="env-setup" />

      <StepFlow
        steps={[
          {
            number: "1",
            title: "Generate API Token in Strapi",
            description: "Settings > API Tokens > Create new token with 'Full access' type",
          },
          {
            number: "2",
            title: "Create .env.local",
            description: "Add STRAPI_URL and STRAPI_TOKEN to your Next.js project root",
          },
          {
            number: "3",
            title: "Add to .gitignore",
            description: "Ensure .env.local is not committed to version control",
          },
        ]}
      />

      <CodeBlock
        code={`# .env.local
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=your-api-token-here`}
        language="bash"
        filename=".env.local"
      />

      <InfoBox type="warning" title="Security">
        Never commit API tokens to git. Server-side environment variables (without NEXT_PUBLIC_ prefix)
        are only available on the server, keeping your Strapi token safe from the browser.
      </InfoBox>

      <SectionHeader number="3" title="Creating a Type-Safe API Client" id="api-client" />

      <CodeBlock
        code={`// lib/strapi.ts
interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

interface ContactRequest {
  id: number
  attributes: {
    firstName: string
    lastName: string
    email: string
    message: string
    status: 'pending' | 'reviewed' | 'resolved'
    createdAt: string
  }
}

const STRAPI_URL = process.env.STRAPI_URL
const STRAPI_TOKEN = process.env.STRAPI_TOKEN

async function fetchStrapi<T>(endpoint: string): Promise<T> {
  const response = await fetch(\`\${STRAPI_URL}/api/\${endpoint}\`, {
    headers: {
      Authorization: \`Bearer \${STRAPI_TOKEN}\`,
    },
    next: { revalidate: 60 },
  })

  if (!response.ok) {
    throw new Error(\`Strapi API error: \${response.status} \${response.statusText}\`)
  }

  const json: StrapiResponse<T> = await response.json()
  return json.data
}

export async function getContactRequests(): Promise<ContactRequest[]> {
  return fetchStrapi<ContactRequest[]>('contact-requests')
}

export async function getContactRequest(id: number): Promise<ContactRequest> {
  return fetchStrapi<ContactRequest>(\`contact-requests/\${id}\`)
}`}
        language="typescript"
        filename="lib/strapi.ts"
      />

      <CodeExplanation
        summary="API client design explained"
        terms={[
          { term: "StrapiResponse<T>", description: "Generic interface that models Strapi's standard response shape with typed data and pagination metadata" },
          { term: "fetchStrapi<T>()", description: "Reusable generic function so every endpoint gets type safety, auth headers, and error handling for free" },
          { term: "next: { revalidate: 60 }", description: "Tells Next.js to cache this response for 60 seconds, then re-fetch in the background (ISR)" },
        ]}
      />

      <StatsTable
        headers={["Pattern", "Purpose", "Example"]}
        rows={[
          ["Generic types", "Reuse fetch logic for any data shape", "fetchStrapi<ContactRequest[]>()"],
          ["Error throwing", "Let Next.js error boundaries handle failures", "throw new Error(...)"],
          ["ISR caching", "Balance freshness with performance", "revalidate: 60"],
          ["Header injection", "Authenticate every request automatically", "Authorization: Bearer ..."],
        ]}
      />

      <SectionHeader number="4" title="Fetching in Server Components" id="server-components" />

      <CodeBlock
        code={`// app/contacts/page.tsx
import { getContactRequests } from '@/lib/strapi'

export default async function ContactsPage() {
  const contacts = await getContactRequests()

  return (
    <main className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Contact Requests</h1>

      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.id}
            className="p-4 border rounded-lg bg-card shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold">
                  {contact.attributes.firstName} {contact.attributes.lastName}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {contact.attributes.email}
                </p>
              </div>
              <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
                {contact.attributes.status}
              </span>
            </div>
            <p className="mt-2 text-muted-foreground">
              {contact.attributes.message}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}`}
        language="typescript"
        filename="app/contacts/page.tsx"
      />

      <InfoBox type="tip" title="No useEffect needed">
        Server Components can directly <code>await</code> async functions. No <code>useState</code>,
        no <code>useEffect</code>, no loading spinners. The data is ready before the HTML reaches the browser.
      </InfoBox>

      <SectionHeader number="5" title="Error Handling" id="error-handling" />

      <CodeBlock
        code={`// app/contacts/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div className="max-w-4xl mx-auto p-8 text-center">
      <h2 className="text-xl font-semibold text-destructive mb-4">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground mb-4">{error.message}</p>
      <button
        onClick={reset}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90"
      >
        Try again
      </button>
    </div>
  )
}`}
        language="typescript"
        filename="app/contacts/error.tsx"
      />

      <NumberedList
        items={[
          "Create error.tsx as a sibling to page.tsx in the same route directory",
          "Error boundaries must be client components ('use client' directive required)",
          "The reset function lets users retry without a full page reload",
          "Error boundaries catch errors from all child components in that route segment",
          "Add loading.tsx for a Suspense fallback while data is being fetched",
        ]}
      />

      <KeyTakeaway>
        A clean API client with TypeScript generics, server-side fetching in Server Components,
        and proper error boundaries gives you a production-ready Strapi integration. The pattern
        scales to any number of content types with minimal code duplication.
      </KeyTakeaway>
    </div>
  )
}
