"use client"

import {
  SectionHeader,
  InfoBox,
  StepFlow,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  FeatureGrid,
} from "@/components/molecules/article-components"
import { Zap, Shield, Users, RefreshCw } from "lucide-react"

export function SSRArticleContent() {
  return (
    <div className="prose prose-invert max-w-none">
      <SectionHeader number="01" title="What is Server-Side Rendering?" />

      <InfoBox type="info">
        SSR generates HTML on the server for each request, allowing you to render dynamic, personalized content while
        still providing fully formed HTML to search engines and users.
      </InfoBox>

      <p className="text-muted-foreground leading-relaxed">
        Unlike SSG where pages are built once, SSR renders pages fresh on every request. This enables real-time data,
        user authentication, personalization, and dynamic content that changes based on the request context.
      </p>

      <div className="bg-card border border-border rounded-lg p-6 my-8">
        <h4 className="font-semibold text-foreground mb-6">How SSR Works</h4>
        <StepFlow
          steps={[
            { number: 1, title: "Request", description: "User requests a page" },
            { number: 2, title: "Server Process", description: "Server fetches data and renders HTML" },
            { number: 3, title: "Response", description: "Complete HTML sent to client" },
            { number: 4, title: "Hydration", description: "React takes over for interactivity" },
          ]}
        />
      </div>

      <SectionHeader number="02" title="When to Use SSR" />

      <ComparisonCards
        idealTitle="Ideal For"
        notIdealTitle="Consider Alternatives When"
        idealFor={[
          "User dashboards and authenticated pages",
          "Personalized content (recommendations, feeds)",
          "Real-time data displays (stock prices, live scores)",
          "Search results with dynamic filtering",
          "E-commerce cart and checkout flows",
        ]}
        notIdealFor={[
          "Content rarely changes (use SSG)",
          "No personalization needed (use SSG)",
          "High traffic with identical content (use ISR)",
          "Static shell with dynamic parts (use PPR)",
          "Cost-sensitive with simple content",
        ]}
      />

      <SectionHeader number="03" title="Implementation in Next.js App Router" />

      <InfoBox type="tip">
        In Next.js App Router, SSR is triggered when you use dynamic functions like{" "}
        <code className="bg-muted px-1 rounded">cookies()</code>,{" "}
        <code className="bg-muted px-1 rounded">headers()</code>,{" "}
        <code className="bg-muted px-1 rounded">searchParams</code>, or set{" "}
        <code className="bg-muted px-1 rounded">dynamic = {"'"}force-dynamic{"'"}</code>.
      </InfoBox>

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Using Dynamic Functions</h3>
      <p className="text-muted-foreground mb-4">Access request-time data to trigger SSR:</p>

      <CodeBlock
        title="app/dashboard/page.tsx"
        code={`import { cookies, headers } from "next/headers"

export default async function DashboardPage() {
  // Using cookies() makes this page SSR
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get("session")
  
  // Using headers() also triggers SSR
  const headersList = await headers()
  const userAgent = headersList.get("user-agent")
  
  // Fetch personalized data
  const userData = await fetchUserData(sessionToken)
  
  return <Dashboard user={userData} />
}`}
      />

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Using searchParams</h3>
      <p className="text-muted-foreground mb-4">Dynamic search parameters trigger SSR:</p>

      <CodeBlock
        title="app/products/page.tsx"
        code={`interface Props {
  searchParams: Promise<{ category?: string; sort?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category, sort } = await searchParams
  
  // Fetch products based on dynamic filters
  const products = await getProducts({ category, sort })
  
  return <ProductList products={products} />
}`}
      />

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Force Dynamic Rendering</h3>
      <p className="text-muted-foreground mb-4">Explicitly opt into SSR:</p>

      <CodeBlock
        title="app/live-data/page.tsx"
        code={`// Force this page to always render dynamically
export const dynamic = "force-dynamic"

export default async function LiveDataPage() {
  // This data is always fresh
  const liveData = await fetchLiveData()
  
  return <LiveDashboard data={liveData} />
}`}
      />

      <SectionHeader number="04" title="Performance Optimization" />

      <p className="text-muted-foreground mb-6">
        SSR adds server processing time to each request. Here are strategies to optimize performance:
      </p>

      <FeatureGrid
        features={[
          {
            icon: <Zap className="h-5 w-5" />,
            title: "Parallel Data Fetching",
            description: "Use Promise.all() to fetch multiple data sources simultaneously instead of sequentially.",
          },
          {
            icon: <RefreshCw className="h-5 w-5" />,
            title: "Streaming with Suspense",
            description:
              "Wrap slow components in Suspense to stream HTML progressively and show loading states.",
          },
          {
            icon: <Shield className="h-5 w-5" />,
            title: "Cache Where Appropriate",
            description: "Use fetch caching or React cache() for data that doesn't need to be real-time.",
          },
          {
            icon: <Users className="h-5 w-5" />,
            title: "Edge Runtime",
            description: "Deploy SSR functions to edge locations to reduce latency for global users.",
          },
        ]}
      />

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Streaming Example</h3>

      <CodeBlock
        title="app/dashboard/page.tsx"
        code={`import { Suspense } from "react"

export default function DashboardPage() {
  return (
    <div>
      {/* This renders immediately */}
      <DashboardHeader />
      
      {/* These stream in as they're ready */}
      <Suspense fallback={<StatsSkeleton />}>
        <UserStats />
      </Suspense>
      
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  )
}`}
      />

      <SectionHeader number="05" title="Project Reference" />

      <p className="text-muted-foreground leading-relaxed">
        In our electrical services application, we use SSR for pages that require user-specific or real-time data:
      </p>

      <ul className="list-disc list-inside text-muted-foreground space-y-2 my-4">
        <li>
          <strong className="text-foreground">Quote form</strong> - Captures user session data for prefilling
        </li>
        <li>
          <strong className="text-foreground">Admin dashboard</strong> - Displays real-time service requests
        </li>
        <li>
          <strong className="text-foreground">Search results</strong> - Dynamic filtering based on query params
        </li>
      </ul>

      <KeyTakeaway>
        Use SSR when content must be personalized, authenticated, or real-time. Optimize with parallel fetching,
        streaming, and appropriate caching to minimize server response time.
      </KeyTakeaway>
    </div>
  )
}
