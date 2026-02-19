"use client"

import {
  SectionHeader,
  InfoBox,
  StepFlow,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  ProcessFlow,
} from "@/components/molecules/article-components"

export function ISRArticleContent() {
  return (
    <div className="prose prose-invert max-w-none">
      <SectionHeader number="01" title="What is Incremental Static Regeneration?" />

      <InfoBox type="info">
        ISR allows you to create or update static pages after build time without rebuilding your entire site. Pages are
        regenerated in the background while serving stale content to users.
      </InfoBox>

      <p className="text-muted-foreground leading-relaxed">
        ISR combines the benefits of static generation (instant loads, CDN caching) with the ability to update content
        periodically. When a page is requested after the revalidation period, the cached version is served immediately
        while a new version is generated in the background.
      </p>

      <div className="bg-card border border-border rounded-lg p-6 my-8">
        <h4 className="font-semibold text-foreground mb-6">How ISR Works (Stale-While-Revalidate)</h4>
        <StepFlow
          steps={[
            { number: 1, title: "Initial Build", description: "Page is statically generated" },
            { number: 2, title: "Serve Cached", description: "Requests get cached HTML instantly" },
            { number: 3, title: "Revalidation", description: "After timeout, regenerate in background" },
            { number: 4, title: "Update Cache", description: "New version replaces old cache" },
          ]}
        />
      </div>

      <ProcessFlow
        title="The Stale-While-Revalidate Pattern"
        steps={[
          { label: "Fresh Period", sublabel: "Serve cached, no revalidation", color: "green" },
          { label: "Stale Period", sublabel: "Serve cached + revalidate in background", color: "yellow" },
          { label: "Fresh Again", sublabel: "New cache, cycle repeats", color: "green" },
        ]}
      />

      <SectionHeader number="02" title="When to Use ISR" />

      <ComparisonCards
        idealTitle="Ideal For"
        notIdealTitle="Not Ideal For"
        idealFor={[
          "E-commerce product pages (price/stock updates)",
          "News sites with periodic updates",
          "Blog posts with view counts or comments",
          "Marketing pages with A/B tested content",
          "Documentation with CMS-managed content",
        ]}
        notIdealFor={[
          "Real-time data (use SSR or client-side)",
          "User-specific content (use SSR)",
          "Content that must be immediately consistent",
          "Authenticated/personalized pages",
          "Content that never changes (use pure SSG)",
        ]}
      />

      <SectionHeader number="03" title="Implementation in Next.js App Router" />

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Time-Based Revalidation</h3>
      <p className="text-muted-foreground mb-4">Set a revalidation period in seconds:</p>

      <CodeBlock
        title="app/products/[id]/page.tsx"
        code={`// Revalidate this page every 60 seconds
export const revalidate = 60

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: \${product.price}</p>
      <p>Stock: {product.stock} available</p>
    </div>
  )
}`}
      />

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Fetch-Level Revalidation</h3>
      <p className="text-muted-foreground mb-4">Control caching at the fetch level:</p>

      <CodeBlock
        title="app/news/page.tsx"
        code={`export default async function NewsPage() {
  // This fetch revalidates every 5 minutes
  const news = await fetch('https://api.example.com/news', {
    next: { revalidate: 300 }
  })
  
  // This fetch revalidates every hour
  const featured = await fetch('https://api.example.com/featured', {
    next: { revalidate: 3600 }
  })
  
  return <NewsList news={news} featured={featured} />
}`}
      />

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">On-Demand Revalidation</h3>
      <p className="text-muted-foreground mb-4">Trigger revalidation programmatically when content changes:</p>

      <CodeBlock
        title="app/api/revalidate/route.ts"
        code={`import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { path, tag, secret } = await request.json()
  
  // Verify webhook secret
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  
  // Revalidate by path
  if (path) {
    revalidatePath(path)
  }
  
  // Or revalidate by tag (more granular)
  if (tag) {
    revalidateTag(tag)
  }
  
  return NextResponse.json({ revalidated: true, now: Date.now() })
}`}
      />

      <h3 className="text-xl font-semibold text-foreground mt-8 mb-4">Using Tags for Granular Control</h3>

      <CodeBlock
        title="app/products/[id]/page.tsx"
        code={`export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // Tag this fetch so it can be revalidated independently
  const product = await fetch(\`https://api.example.com/products/\${id}\`, {
    next: { tags: ['products', \`product-\${id}\`] }
  })
  
  return <ProductDisplay product={product} />
}

// In your CMS webhook handler:
// revalidateTag('products') - revalidates ALL products
// revalidateTag('product-123') - revalidates only product 123`}
      />

      <SectionHeader number="04" title="Choosing Revalidation Times" />

      <InfoBox type="warning">
        Choose revalidation times based on how frequently your content changes and how critical freshness is. Too short
        increases server load; too long serves stale content.
      </InfoBox>

      <div className="bg-card border border-border rounded-lg p-6 my-6">
        <h4 className="font-semibold text-foreground mb-4">Recommended Revalidation Times</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Product prices</span>
            <span className="text-accent font-mono">60 seconds</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">News articles</span>
            <span className="text-accent font-mono">5-15 minutes</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Blog posts</span>
            <span className="text-accent font-mono">1 hour</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-muted-foreground">Documentation</span>
            <span className="text-accent font-mono">On-demand only</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-muted-foreground">Marketing pages</span>
            <span className="text-accent font-mono">On-demand only</span>
          </div>
        </div>
      </div>

      <SectionHeader number="05" title="Project Reference" />

      <p className="text-muted-foreground leading-relaxed">
        In our electrical services documentation, ISR would be ideal for:
      </p>

      <ul className="list-disc list-inside text-muted-foreground space-y-2 my-4">
        <li>
          <strong className="text-foreground">Service pricing pages</strong> - Update prices without full redeploy
        </li>
        <li>
          <strong className="text-foreground">Team/staff pages</strong> - CMS-managed with on-demand revalidation
        </li>
        <li>
          <strong className="text-foreground">Blog/news section</strong> - Periodic updates with reasonable freshness
        </li>
      </ul>

      <KeyTakeaway>
        ISR gives you the performance benefits of static generation with the freshness of dynamic content. Use
        time-based revalidation for periodic updates and on-demand revalidation for immediate changes from your CMS.
      </KeyTakeaway>
    </div>
  )
}
