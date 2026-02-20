"use client"

import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { Zap } from "lucide-react"

const SECTIONS = [
  { id: "tanstack-query", title: "TanStack Query Integration" },
  { id: "cache-components", title: "Next.js 16 Cache Components" },
  { id: "cache-tags", title: "Cache Tags & Revalidation" },
  { id: "implementation", title: "Real Implementation Examples" },
  { id: "best-practices", title: "Caching Best Practices" },
]

export default function PerformancePage() {
  return (
    <DocPage
      title="Performance & Caching"
      description="Advanced caching strategies using TanStack Query and Next.js 16 cache features for optimal performance."
      icon={Zap}
      badges={[
        { label: "Architecture", variant: "default" },
        { label: "Next.js 16", variant: "default" },
      ]}
      tags={["caching", "TanStack Query", "use cache", "revalidation", "performance"]}
      meta={[
        { label: "Audience", value: "Developer / Architect" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* TanStack Query Section */}
      <section className="space-y-6">
        <DocSectionHeader id="tanstack-query">TanStack Query Integration</DocSectionHeader>

        <Callout type="info">
          TanStack Query (formerly React Query) provides powerful client-side caching, automatic background refetching,
          optimistic updates, and seamless integration with Next.js server components.
        </Callout>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">Installation & Setup</h3>
            <CodeBlock language="bash" code={`npm install @tanstack/react-query @tanstack/react-query-devtools`} />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">Query Provider Setup</h3>
            <p className="text-muted-foreground mb-3">Create a client-side Query Provider to wrap your application:</p>
            <CodeBlock
              language="typescript"
              code={`// components/providers/query-provider.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">Add to Layout</h3>
            <CodeBlock
              language="typescript"
              code={`// app/layout.tsx
import { ThemeProvider } from "@/components/providers/theme-provider"
import { QueryProvider } from "@/components/providers/query-provider"

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">Query Hook for Form Data</h3>
            <p className="text-muted-foreground mb-3">
              Fetch and cache user service requests with automatic refetching:
            </p>
            <CodeBlock
              language="typescript"
              code={`// hooks/use-service-requests.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useServiceRequests(userId: string) {
  return useQuery({
    queryKey: ['service-requests', userId],
    queryFn: async () => {
      const response = await fetch(\`/api/service-requests?userId=\${userId}\`)
      if (!response.ok) throw new Error('Failed to fetch')
      return response.json()
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

export function useCreateServiceRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ServiceRequestData) => {
      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error('Failed to create')
      return response.json()
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['service-requests', variables.userId] 
      })
    },
  })
}`}
            />
          </div>
        </div>
      </section>

      {/* Next.js 16 Cache Features */}
      <section className="space-y-6">
        <DocSectionHeader id="cache-components">Next.js 16 Cache Components</DocSectionHeader>

        <Callout type="warning">
          Next.js 16 introduces revolutionary caching with the &quot;use cache&quot; directive, cacheLife profiles, and new
          revalidation APIs. Enable with <code>cacheComponents: true</code> in next.config.js.
        </Callout>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">Enable Cache Components</h3>
            <CodeBlock
              language="typescript"
              code={`// next.config.mjs
const nextConfig = {
  cacheComponents: true,
}

export default nextConfig`}
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">use cache Directive</h3>
            <p className="text-muted-foreground mb-3">
              The &quot;use cache&quot; directive can be applied at file, component, or function level:
            </p>
            <CodeBlock
              language="typescript"
              code={`// File-level caching (entire route)
'use cache'

export default async function Page() {
  return <div>Cached page</div>
}

// Component-level caching
export async function UserProfile({ userId }: { userId: string }) {
  'use cache'
  const user = await fetchUser(userId)
  return <div>{user.name}</div>
}

// Function-level caching
export async function getServiceRequests(userId: string) {
  'use cache'
  const data = await fetch(\`/api/service-requests?userId=\${userId}\`)
  return data.json()
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">cacheLife Profiles</h3>
            <p className="text-muted-foreground mb-3">Use built-in profiles or create custom ones:</p>
            <CodeBlock
              language="typescript"
              code={`// Built-in profiles: 'max', 'days', 'hours', 'minutes'

// Example: Cache for maximum duration
export async function getStaticData() {
  'use cache'
  'use cacheLife: max'
  return await fetchStaticContent()
}

// Next.js config with custom profiles
const nextConfig = {
  cacheComponents: true,
  cacheLife: {
    serviceRequests: {
      revalidate: 300, // 5 minutes
      stale: 600, // 10 minutes stale time
    },
  },
}`}
            />
          </div>
        </div>
      </section>

      {/* Cache Tags & Revalidation */}
      <section className="space-y-6">
        <DocSectionHeader id="cache-tags">Cache Tags & Revalidation</DocSectionHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">Cache Tag Strategy</h3>
            <p className="text-muted-foreground mb-3">
              Organize your cache with granular tags for precise invalidation:
            </p>
            <CodeBlock
              language="typescript"
              code={`import { unstable_cacheTag as cacheTag } from 'next/cache'

export async function getServiceRequest(id: string) {
  'use cache'
  cacheTag(\`service-request-\${id}\`)
  cacheTag('service-requests-list')
  
  return await fetch(\`/api/service-requests/\${id}\`).then(r => r.json())
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">revalidateTag()</h3>
            <p className="text-muted-foreground mb-3">
              In Next.js 16, revalidateTag() requires a cacheLife profile for stale-while-revalidate:
            </p>
            <CodeBlock
              language="typescript"
              code={`'use server'

import { revalidateTag } from 'next/cache'

export async function submitServiceRequest(data: ServiceRequestData) {
  const result = await saveToDatabase(data)
  
  // Revalidate with cacheLife profile (required in Next.js 16)
  revalidateTag(\`user-\${data.userId}-requests\`, 'max')
  revalidateTag('service-requests-list', 'max')
  
  return result
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">updateTag() & refresh()</h3>
            <p className="text-muted-foreground mb-3">
              New in Next.js 16: updateTag() provides read-your-writes semantics. refresh() revalidates only uncached data.
            </p>
            <CodeBlock
              language="typescript"
              code={`'use server'

import { updateTag } from 'next/cache'

export async function updateServiceRequest(id: string, data: Partial<ServiceRequestData>) {
  const updated = await updateInDatabase(id, data)
  
  // Use updateTag for immediate visibility (no stale data served)
  updateTag(\`service-request-\${id}\`)
  updateTag(\`user-\${updated.userId}-requests\`)
  
  return updated
}

// When to use updateTag vs revalidateTag:
// - updateTag: Critical updates that MUST be visible immediately
// - revalidateTag: Updates where stale-while-revalidate is acceptable`}
            />
          </div>
        </div>
      </section>

      {/* Implementation Examples */}
      <section className="space-y-6">
        <DocSectionHeader id="implementation">Real Implementation Examples</DocSectionHeader>

        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">Complete Server Action with Caching</h3>
            <CodeBlock
              language="typescript"
              code={`'use server'

import { revalidateTag, updateTag } from 'next/cache'
import { z } from 'zod'

export async function createServiceRequest(formData: FormData) {
  const data = serviceRequestSchema.parse(Object.fromEntries(formData))
  
  const request = await db.serviceRequest.create({
    data: { ...data, status: 'pending', createdAt: new Date() },
  })
  
  revalidateTag(\`user-\${data.userId}-requests\`, 'max')
  revalidateTag('service-requests-list', 'days')
  
  return { success: true, id: request.id }
}

export async function deleteServiceRequest(id: string) {
  const deleted = await db.serviceRequest.delete({ where: { id } })
  
  updateTag(\`service-request-\${id}\`)
  revalidateTag(\`user-\${deleted.userId}-requests\`, 'max')
  
  return { success: true }
}`}
            />
          </div>

          <div>
            <h3 className="text-xl font-medium mb-3 text-foreground">Optimistic Updates with TanStack Query</h3>
            <CodeBlock
              language="typescript"
              code={`import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useUpdateServiceRequest() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ServiceRequest> }) => {
      const response = await fetch(\`/api/service-requests/\${id}\`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      })
      return response.json()
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['service-request', id] })
      const previous = queryClient.getQueryData(['service-request', id])
      queryClient.setQueryData(['service-request', id], (old: any) => ({ ...old, ...data }))
      return { previous }
    },
    onError: (err, { id }, context) => {
      queryClient.setQueryData(['service-request', id], context?.previous)
    },
    onSettled: (data, error, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['service-request', id] })
    },
  })
}`}
            />
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="space-y-6">
        <DocSectionHeader id="best-practices">Caching Best Practices</DocSectionHeader>

        <div className="space-y-4">
          <Callout type="success">
            <strong>Cache Granularity:</strong> Use specific cache tags for granular invalidation. Avoid broad
            revalidations that clear more cache than necessary.
          </Callout>

          <Callout type="success">
            <strong>Stale-While-Revalidate:</strong> Use revalidateTag() with appropriate cacheLife profiles
            to serve stale content while fresh data loads in the background.
          </Callout>

          <Callout type="info">
            <strong>Optimistic Updates:</strong> Use TanStack Query&apos;s onMutate for instant UI feedback,
            with automatic rollback on server errors.
          </Callout>

          <Callout type="warning">
            <strong>Cache Invalidation:</strong> Always invalidate related caches together. If you update a
            service request, invalidate both the individual cache and the list cache.
          </Callout>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Decision Matrix: Which Caching Strategy?</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Scenario</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">Strategy</th>
                    <th className="text-left py-2 px-3 text-muted-foreground font-medium">API</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { scenario: "Static content (rarely changes)", strategy: "Server cache", api: "use cache + cacheLife: max" },
                    { scenario: "User-specific data", strategy: "Client cache", api: "TanStack Query" },
                    { scenario: "Form submission result", strategy: "Optimistic + revalidate", api: "useMutation + revalidateTag" },
                    { scenario: "Real-time critical update", strategy: "Immediate invalidation", api: "updateTag()" },
                    { scenario: "Background data refresh", strategy: "Stale-while-revalidate", api: "revalidateTag() + cacheLife" },
                  ].map((row) => (
                    <tr key={row.scenario} className="border-b border-border/50">
                      <td className="py-2 px-3 text-foreground">{row.scenario}</td>
                      <td className="py-2 px-3 text-muted-foreground">{row.strategy}</td>
                      <td className="py-2 px-3"><code className="text-xs bg-muted px-1.5 py-0.5 rounded">{row.api}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </DocPage>
  )
}
