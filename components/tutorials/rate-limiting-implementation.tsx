"use client"

import {
  TableOfContents,
  SectionHeader,
  StepFlow,
  InfoBox,
  KeyTakeaway,
  StatsTable,
  NumberedList,
  ProcessFlow,
  FeatureGrid,
  DecisionTree,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { CodeExplanation } from "@/components/atoms/code-explanation"

const tocItems = [
  { id: "overview", title: "Rate Limiting Overview" },
  { id: "sliding-window", title: "Sliding Window Algorithm" },
  { id: "implementation", title: "Building the Rate Limiter" },
  { id: "client-id", title: "Client Identification" },
  { id: "integration", title: "Server Action Integration" },
  { id: "strategies", title: "Rate Limiting Strategies" },
  { id: "takeaways", title: "Key Takeaways" },
]

export function RateLimitingImplementationContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">
        {/* Overview */}
        <section>
          <SectionHeader number="01" title="Rate Limiting Overview" id="overview" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Rate limiting prevents abuse by restricting how many requests a client can make
            within a time window. Without it, your server actions are vulnerable to brute-force
            attacks, spam submissions, and denial-of-service attempts.
          </p>
        </section>

        <InfoBox type="warning" title="Production Warning">
          In-memory rate limiting only works for single-server deployments.
          For distributed systems, use Redis-backed solutions like Upstash Ratelimit.
        </InfoBox>

        <FeatureGrid
          title="What You Will Build"
          features={[
            { title: "Sliding Window", description: "Time-based request tracking with automatic cleanup" },
            { title: "Client Identification", description: "IP extraction from request headers" },
            { title: "Server Action Guard", description: "Drop-in rate limiting for any server action" },
            { title: "Configurable Limits", description: "Adjustable max requests and time windows" },
          ]}
        />

        {/* Sliding Window Algorithm */}
        <section>
          <SectionHeader number="02" title="Sliding Window Algorithm" id="sliding-window" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            The sliding window algorithm tracks requests per client within a rolling time window.
            When the window expires, the counter resets.
          </p>
        </section>

        <ProcessFlow
          title="Request Flow"
          steps={[
            "Request arrives with client identifier",
            "Check if client has an existing window",
            "If expired or missing, create new window",
            "If within window, increment counter",
            "If counter exceeds max, reject request",
          ]}
        />

        <StatsTable
          headers={["Algorithm", "Accuracy", "Memory", "Complexity"]}
          rows={[
            ["Fixed Window", "Low (burst at boundaries)", "Low", "Simple"],
            ["Sliding Window", "Medium (good balance)", "Low", "Medium"],
            ["Token Bucket", "High (smooth rate)", "Medium", "Complex"],
            ["Leaky Bucket", "High (constant rate)", "Medium", "Complex"],
          ]}
        />

        {/* Implementation */}
        <section>
          <SectionHeader number="03" title="Building the Rate Limiter" id="implementation" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            The rate limiter uses a Map to track per-client request counts with automatic
            expiration.
          </p>
        </section>

        <CodeBlock
          language="typescript"
          filename="lib/rate-limiter.ts"
          title="Rate Limiter Implementation"
          code={`interface RateLimitEntry {
  count: number
  resetTime: number
}

export function createRateLimiter(
  maxRequests: number,
  windowMs: number
) {
  const requests = new Map<string, RateLimitEntry>()

  // Periodic cleanup to prevent memory leaks
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of requests) {
      if (now > entry.resetTime) {
        requests.delete(key)
      }
    }
  }, windowMs)

  return {
    check(identifier: string) {
      const now = Date.now()
      const entry = requests.get(identifier)

      // Clean expired entry
      if (entry && now > entry.resetTime) {
        requests.delete(identifier)
      }

      const current = requests.get(identifier)

      if (!current) {
        requests.set(identifier, {
          count: 1,
          resetTime: now + windowMs,
        })
        return { allowed: true, remaining: maxRequests - 1 }
      }

      if (current.count >= maxRequests) {
        return { allowed: false, remaining: 0 }
      }

      current.count++
      return {
        allowed: true,
        remaining: maxRequests - current.count,
      }
    },
  }
}`}
        />

        <CodeExplanation
          summary="The rate limiter creates a closure over a Map that tracks per-client request counts."
          terms={[
            { term: "Map<string, RateLimitEntry>", description: "Stores client ID to request count mappings with expiration timestamps" },
            { term: "setInterval cleanup", description: "Prevents memory leaks by periodically removing expired entries" },
            { term: "Closure pattern", description: "createRateLimiter returns an object with a check method that has access to the internal Map" },
          ]}
        />

        {/* Client Identification */}
        <section>
          <SectionHeader number="04" title="Client Identification" id="client-id" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Extracting a reliable client identifier from request headers is critical.
            The x-forwarded-for header contains the original client IP when behind a proxy.
          </p>
        </section>

        <CodeBlock
          language="typescript"
          filename="lib/get-client-id.ts"
          title="Client IP Extraction"
          code={`import { headers } from 'next/headers'

export async function getClientIdentifier(): Promise<string> {
  const headersList = await headers()

  return (
    headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headersList.get('x-real-ip') ||
    'unknown'
  )
}`}
        />

        <InfoBox type="tip" title="Vercel Deployments">
          On Vercel, x-forwarded-for is automatically set. For other platforms,
          check your reverse proxy configuration to ensure client IPs are forwarded correctly.
        </InfoBox>

        {/* Integration */}
        <section>
          <SectionHeader number="05" title="Server Action Integration" id="integration" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Wrap your server actions with the rate limiter to protect them from abuse.
            Create the limiter at module scope so it persists across requests.
          </p>
        </section>

        <CodeBlock
          language="typescript"
          filename="app/actions.ts"
          title="Protected Server Action"
          code={`"use server"

import { createRateLimiter } from '@/lib/rate-limiter'
import { getClientIdentifier } from '@/lib/get-client-id'

// Module-level: persists across requests
const limiter = createRateLimiter(5, 15 * 60 * 1000) // 5 per 15min

export async function submitForm(data: FormData) {
  const clientId = await getClientIdentifier()
  const { allowed, remaining } = limiter.check(clientId)

  if (!allowed) {
    return {
      success: false,
      error: 'Too many requests. Please try again later.',
    }
  }

  // Proceed with validation and processing
  const name = data.get('name') as string
  const email = data.get('email') as string

  if (!name || !email) {
    return { success: false, error: 'All fields required' }
  }

  // Save to database...
  return { success: true, remaining }
}`}
        />

        <StepFlow
          title="Integration Steps"
          steps={[
            { number: 1, title: "Create limiter at module scope", description: "Ensures the Map persists across requests in the same server instance" },
            { number: 2, title: "Extract client ID", description: "Get the client IP from request headers before checking the limit" },
            { number: 3, title: "Check the limit", description: "Call limiter.check() and handle the rejected case before any processing" },
            { number: 4, title: "Return remaining count", description: "Include the remaining request count so the client can show feedback" },
          ]}
        />

        {/* Strategies */}
        <section>
          <SectionHeader number="06" title="Rate Limiting Strategies" id="strategies" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Different endpoints need different limits. A login form needs strict limits,
            while a search endpoint can be more permissive.
          </p>
        </section>

        <DecisionTree
          decisions={[
            { condition: "Login / authentication endpoint", result: "5 requests per 15 minutes", recommended: true },
            { condition: "Contact form / email submission", result: "3 requests per hour" },
            { condition: "Search / read-heavy endpoint", result: "30 requests per minute" },
            { condition: "API endpoint (authenticated)", result: "100 requests per minute" },
            { condition: "Webhook receiver", result: "No rate limit (verify signatures instead)" },
          ]}
        />

        <InfoBox type="important" title="Production Scaling">
          For multi-server deployments, replace the in-memory Map with a Redis-backed
          solution. Upstash Ratelimit provides a drop-in replacement with the same API pattern.
        </InfoBox>

        {/* Takeaways */}
        <section>
          <SectionHeader number="07" title="Key Takeaways" id="takeaways" />
        </section>

        <KeyTakeaway>
          Rate limiting is a critical security layer for server actions. Start with in-memory
          sliding window for development, then upgrade to Redis for production. Always identify
          clients by IP, configure different limits per endpoint sensitivity, and return
          remaining counts so clients can provide user feedback.
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
