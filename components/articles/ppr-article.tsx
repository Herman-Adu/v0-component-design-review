"use client"

import {
  SectionHeader,
  InfoBox,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  SideBySideComparison,
  FeatureGrid,
} from "@/components/molecules/article-components"
import { Zap, Eye, TrendingUp, Search } from "lucide-react"

export function PPRArticleContent() {
  return (
    <div className="prose prose-invert max-w-none">
      <SectionHeader number="01" title="What is Partial Pre-Rendering?" />

      <InfoBox type="info">
        PPR is a Next.js rendering strategy that pre-renders a static shell of your page at build time, with dynamic
        placeholders that are filled in at request time. This gives you instant static loading with streaming dynamic
        content.
      </InfoBox>

      <p className="text-muted-foreground leading-relaxed">
        PPR represents a paradigm shift in how we think about rendering. Instead of choosing between static OR dynamic
        for an entire page, PPR lets you have both simultaneously. The static parts load instantly while dynamic parts
        stream in as they become ready.
      </p>

      <div className="bg-card border border-border rounded-lg p-6 my-8">
        <h4 className="font-semibold text-foreground mb-6">How PPR Works</h4>
        <SideBySideComparison
          leftTitle="Build Time"
          rightTitle="Request Time"
          leftItems={[
            { label: "Header (Static)", type: "static" },
            { label: "Navigation (Static)", type: "static" },
            { label: "User Profile (Placeholder)", type: "placeholder" },
            { label: "Main Content (Static)", type: "static" },
            { label: "Recommendations (Placeholder)", type: "placeholder" },
            { label: "Footer (Static)", type: "static" },
          ]}
          rightItems={[
            { label: "Header (Instant)", type: "instant" },
            { label: "Navigation (Instant)", type: "instant" },
            { label: "User Profile (Streamed)", type: "streamed" },
            { label: "Main Content (Instant)", type: "instant" },
            { label: "Recommendations (Streamed)", type: "streamed" },
            { label: "Footer (Instant)", type: "instant" },
          ]}
        />
      </div>

      <SectionHeader number="02" title="When to Use PPR" />

      <ComparisonCards
        idealTitle="Perfect For"
        notIdealTitle="Key Benefits"
        idealFor={[
          "E-commerce pages (static product + dynamic cart/price)",
          "Dashboards (static layout + dynamic data)",
          "Social feeds (static shell + personalized content)",
          "News sites (static article + dynamic comments)",
          "SaaS apps (static UI + user-specific data)",
        ]}
        notIdealFor={[
          "Instant initial page load (static shell)",
          "Personalized content without sacrificing speed",
          "Excellent Core Web Vitals scores",
          "SEO-friendly (static content is crawlable)",
          "Progressive enhancement built-in",
        ]}
      />

      <SectionHeader number="03" title="Implementation in Next.js" />

      <InfoBox type="warning">
        PPR is available in Next.js 14+ and became stable in Next.js 15. Enable it in your{" "}
        <code className="bg-muted px-1 rounded">next.config.js</code> to use this feature.
      </InfoBox>

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Enable PPR</h3>

      <CodeBlock
        title="next.config.js"
        code={`/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: true,
  },
}

module.exports = nextConfig`}
      />

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Create Static Shell with Dynamic Holes</h3>
      <p className="text-muted-foreground mb-4">
        Use Suspense boundaries to mark dynamic content that should stream in:
      </p>

      <CodeBlock
        title="app/dashboard/page.tsx"
        code={`import { Suspense } from "react"

// These components are async and will stream in
async function UserGreeting() {
  const user = await getUser() // Dynamic - needs auth
  return <h2>Welcome back, {user.name}!</h2>
}

async function RecentActivity() {
  const activity = await getUserActivity() // Dynamic - personalized
  return <ActivityList items={activity} />
}

// Static shell renders immediately
export default function DashboardPage() {
  return (
    <div>
      {/* Static - renders at build time */}
      <header>
        <Logo />
        <Navigation />
      </header>
      
      <main>
        {/* Dynamic - streams in */}
        <Suspense fallback={<GreetingSkeleton />}>
          <UserGreeting />
        </Suspense>
        
        {/* Static - renders at build time */}
        <QuickActions />
        
        {/* Dynamic - streams in */}
        <Suspense fallback={<ActivitySkeleton />}>
          <RecentActivity />
        </Suspense>
      </main>
      
      {/* Static - renders at build time */}
      <Footer />
    </div>
  )
}`}
      />

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">E-commerce Example</h3>

      <CodeBlock
        title="app/products/[id]/page.tsx"
        code={`import { Suspense } from "react"

// Static - same for all users
async function ProductInfo({ id }: { id: string }) {
  const product = await getProduct(id)
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <img src={product.image || "/placeholder.svg"} alt={product.name} />
    </div>
  )
}

// Dynamic - user-specific
async function PriceAndStock({ id }: { id: string }) {
  const { price, stock } = await getProductPricing(id)
  const userDiscount = await getUserDiscount()
  
  return (
    <div>
      <p>Price: \${price * (1 - userDiscount)}</p>
      <p>{stock > 0 ? \`\${stock} in stock\` : "Out of stock"}</p>
      <AddToCartButton />
    </div>
  )
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Static shell - instant */}
      <ProductInfo id={id} />
      
      {/* Dynamic - streams in */}
      <Suspense fallback={<PricingSkeleton />}>
        <PriceAndStock id={id} />
      </Suspense>
    </div>
  )
}`}
      />

      <SectionHeader number="04" title="Benefits of PPR" />

      <FeatureGrid
        features={[
          {
            icon: <Zap className="h-5 w-5" />,
            title: "Instant Initial Load",
            description:
              "Static shell is served from CDN edge, giving users immediate visual feedback while dynamic content loads.",
          },
          {
            icon: <Eye className="h-5 w-5" />,
            title: "Progressive Enhancement",
            description:
              "Users see the page structure immediately, then watch content stream in. Better perceived performance.",
          },
          {
            icon: <TrendingUp className="h-5 w-5" />,
            title: "Optimal Core Web Vitals",
            description:
              "Fast LCP from static content, good INP from hydrated interactivity, minimal CLS with proper skeletons.",
          },
          {
            icon: <Search className="h-5 w-5" />,
            title: "SEO Friendly",
            description:
              "Search engines can crawl the static shell immediately. Most important content should be static for best SEO.",
          },
        ]}
      />

      <SectionHeader number="05" title="Best Practices" />

      <div className="space-y-4 my-6">
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">1. Design Good Skeletons</h4>
          <p className="text-sm text-muted-foreground">
            Skeleton loaders should match the final content{"'"}s dimensions to prevent layout shift (CLS). Use CSS
            animations to indicate loading state.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">2. Prioritize Critical Content</h4>
          <p className="text-sm text-muted-foreground">
            Make your most important content static. Put personalization and user-specific data in Suspense boundaries.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">3. Group Related Dynamic Content</h4>
          <p className="text-sm text-muted-foreground">
            Use a single Suspense boundary for related dynamic content to reduce the number of streaming chunks.
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <h4 className="font-semibold text-foreground mb-2">4. Consider Nested Suspense</h4>
          <p className="text-sm text-muted-foreground">
            For complex pages, nest Suspense boundaries to show progressive loading states as data becomes available.
          </p>
        </div>
      </div>

      <SectionHeader number="06" title="Project Reference" />

      <p className="text-muted-foreground leading-relaxed">
        PPR would be excellent for our electrical services platform in scenarios like:
      </p>

      <ul className="list-disc list-inside text-muted-foreground space-y-2 my-4">
        <li>
          <strong className="text-foreground">Quote form</strong> - Static form shell with dynamic pricing estimates
        </li>
        <li>
          <strong className="text-foreground">Service pages</strong> - Static service info with dynamic availability
        </li>
        <li>
          <strong className="text-foreground">Dashboard</strong> - Static layout with personalized service history
        </li>
      </ul>

      <KeyTakeaway>
        PPR represents the future of web rendering in Next.js. Use it when you have pages with a mix of static content
        and dynamic, personalized data. The static shell gives instant loads while Suspense boundaries stream in
        user-specific content.
      </KeyTakeaway>
    </div>
  )
}
