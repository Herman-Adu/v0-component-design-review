"use client"

import type { CaseStudy } from "@/data/content-library/case-studies"
import {
  SectionHeader,
  InfoBox,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  StatsTable,
  ProcessFlow,
  ArchitectureDiagram,
  BeforeAfterComparison,
  ComparisonCards,
  FeatureGrid,
  ArticleIcons,
  VerticalFlow,
  NumberedList,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "context", title: "Context", level: 2 },
  { id: "threat-model", title: "Threat Model", level: 2 },
  { id: "defence-layers", title: "Defence-in-Depth", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "rate-limiting", title: "Rate Limiting", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function SecurityLayerContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        <SectionHeader number="01" title="Context" id="context" />

        <p className="text-muted-foreground mb-6">
          Our Next.js server actions were processing form submissions with no security measures.
          Any request that reached the server action was processed immediately - no rate limiting,
          no origin validation, no abuse prevention. For a production electrical services business
          receiving genuine customer enquiries, this was a serious operational risk.
        </p>

        <InfoBox type="important" title="Production Reality">
          Within the first week of deployment, we received 47 spam submissions and detected 3 attempts
          to inject script tags through the message field. Without security layers, every one of these
          reached the business owner&apos;s inbox and polluted the database.
        </InfoBox>

        <SectionHeader number="02" title="Threat Model" id="threat-model" />

        <p className="text-muted-foreground mb-6">
          Before writing any security code, we mapped the threat landscape for a public-facing form
          application. Understanding the specific threats informed which layers we needed to build.
        </p>

        <ComparisonCards
          leftTitle="Threats Identified"
          leftItems={[
            "Automated spam bots submitting thousands of fake enquiries",
            "XSS payloads in free-text fields targeting admin dashboard",
            "CSRF attacks forging submissions from other sites",
            "Denial of service through rapid-fire form submissions",
            "Data exfiltration attempts via crafted error responses",
          ]}
          rightTitle="Business Impact"
          rightItems={[
            "Legitimate enquiries buried under spam noise",
            "Admin dashboard potentially compromised",
            "Fake submissions wasting business owner time",
            "Server resources consumed by malicious traffic",
            "Customer trust damaged by compromised data",
          ]}
          leftType="negative"
          rightType="negative"
        />

        <SectionHeader number="03" title="Defence-in-Depth Architecture" id="defence-layers" />

        <p className="text-muted-foreground mb-6">
          We implemented four distinct security layers, each catching threats that might bypass the others.
          This defence-in-depth approach ensures that no single point of failure can compromise the system.
        </p>

        <ArchitectureDiagram
          title="Security Layer Stack"
          layers={[
            { name: "Layer 1: Origin Validation", items: ["Referer header check", "Host header validation", "Reject cross-origin requests"], color: "#ef4444" },
            { name: "Layer 2: Rate Limiting", items: ["Per-IP throttling", "Sliding window", "Configurable per-action limits"], color: "#f59e0b" },
            { name: "Layer 3: Input Sanitisation", items: ["HTML entity encoding", "Script tag removal", "Length enforcement"], color: "#3b82f6" },
            { name: "Layer 4: Schema Validation", items: ["Zod schema parsing", "Type enforcement", "Format validation"], color: "#22c55e" },
          ]}
        />

        <ProcessFlow
          title="Request Processing Pipeline"
          steps={[
            { label: "Request In", sublabel: "Incoming submission" },
            { label: "Origin Check", sublabel: "Validate referer", color: "yellow" },
            { label: "Rate Limit", sublabel: "Check throttle", color: "yellow" },
            { label: "Sanitise", sublabel: "Clean inputs", color: "blue" },
            { label: "Validate", sublabel: "Schema check", color: "blue" },
            { label: "Process", sublabel: "Business logic", color: "green" },
          ]}
        />

        <SectionHeader number="04" title="Implementation" id="implementation" />

        <BeforeAfterComparison
          beforeTitle="Before: Zero Security"
          beforeCode={`"use server"

export async function submitContactForm(data: any) {
  // No validation, no sanitisation, no protection
  await db.insert("enquiries", data)
  await sendEmail(data.email, data.message)
  return { success: true }
}`}
          afterTitle="After: Defence-in-Depth"
          afterCode={`"use server"

import { securityCheck } from "@/lib/security"
import { rateLimiter } from "@/lib/rate-limit"
import { sanitiseFormData } from "@/lib/sanitise"
import { contactSchema } from "@/lib/validation"

export async function submitContactForm(rawData: unknown) {
  // Layer 1: Origin validation
  const origin = await securityCheck()
  if (!origin.valid) {
    return { success: false, error: "Invalid request" }
  }
  
  // Layer 2: Rate limiting
  const limit = await rateLimiter.check("contact", origin.ip)
  if (!limit.allowed) {
    return { success: false, error: "Too many requests" }
  }
  
  // Layer 3: Sanitise all inputs
  const sanitised = sanitiseFormData(rawData)
  
  // Layer 4: Validate against schema
  const result = contactSchema.safeParse(sanitised)
  if (!result.success) {
    return { success: false, errors: result.error }
  }
  
  // Only clean, validated data proceeds
  await db.insert("enquiries", result.data)
  await sendEmail(result.data)
  return { success: true }
}`}
          improvements={[
            { metric: "Security layers", before: "0", after: "4" },
            { metric: "Lines of security code", before: "0", after: "~150" },
            { metric: "Attack surface", before: "Wide open", after: "Hardened" },
          ]}
        />

        <SectionHeader number="05" title="Rate Limiting in Detail" id="rate-limiting" />

        <p className="text-muted-foreground mb-6">
          Rate limiting was the most impactful single layer. We implemented a sliding window algorithm
          that tracks submissions per IP address with configurable limits per action type.
        </p>

        <CodeBlock
          filename="lib/security/rate-limiter.ts"
          language="typescript"
          code={`// Sliding window rate limiter
interface RateLimitConfig {
  windowMs: number    // Time window in milliseconds
  maxRequests: number // Maximum requests per window
}

const LIMITS: Record<string, RateLimitConfig> = {
  contact:   { windowMs: 60_000, maxRequests: 3 },   // 3 per minute
  quotation: { windowMs: 60_000, maxRequests: 2 },   // 2 per minute
  service:   { windowMs: 60_000, maxRequests: 2 },   // 2 per minute
}

// In-memory store (upgrade to Redis for multi-instance)
const submissions = new Map<string, number[]>()

export function checkRateLimit(
  action: string, 
  identifier: string
): { allowed: boolean; retryAfter?: number } {
  const config = LIMITS[action]
  const key = \`\${action}:\${identifier}\`
  const now = Date.now()
  
  const timestamps = (submissions.get(key) || [])
    .filter(ts => ts > now - config.windowMs)
  
  if (timestamps.length >= config.maxRequests) {
    const retryAfter = timestamps[0] + config.windowMs - now
    return { allowed: false, retryAfter }
  }
  
  timestamps.push(now)
  submissions.set(key, timestamps)
  return { allowed: true }
}`}
        />

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Origin Validation",
              description: "Checks Referer and Host headers to reject cross-origin requests, preventing CSRF attacks without requiring tokens for server actions.",
            },
            {
              icon: <ArticleIcons.Clock className="h-5 w-5" />,
              title: "Sliding Window",
              description: "Unlike fixed windows, sliding windows prevent burst attacks at window boundaries. Timestamps are cleaned on every check for memory efficiency.",
            },
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Configurable Limits",
              description: "Each form action has independent rate limits. Contact forms allow 3/minute while quotation requests are limited to 2/minute.",
            },
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Graceful Degradation",
              description: "Rate-limited responses include retry-after timing, allowing the client to show users exactly when they can try again.",
            },
          ]}
        />

        <SectionHeader number="06" title="Results & Metrics" id="results" />

        <StatsTable
          title="Security Implementation Results"
          headers={["Metric", "Before", "After", "Improvement"]}
          rows={caseStudy.results.metrics.map((m) => [m.label, m.before, m.after, m.improvement])}
        />

        <InfoBox type="tip" title="For Decision Makers">
          The entire security implementation took approximately 8 hours of development time. 
          In the first month alone, it blocked 312 spam submissions and 14 potential XSS attempts.
          The ROI is immediate: reduced manual spam filtering by the business owner, protected customer
          data integrity, and maintained the professional reputation of the business.
        </InfoBox>

        <SectionHeader number="07" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          Security is layers. Each layer catches what others miss. Origin validation stops cross-site
          attacks, rate limiting stops automated abuse, sanitisation stops content-based attacks, and
          schema validation stops malformed data. Together, they create a robust defence that protects
          both the business and its customers - and the implementation cost is measured in hours, not weeks.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { href: "/dashboard/content-library/case-studies/form-validation-refactor", title: "Form Validation Refactor", level: "intermediate" },
            { href: "/dashboard/content-library/articles/refactoring-for-maintainability", title: "Refactoring for Maintainability", level: "intermediate" },
          ]}
        />
      </article>

      <aside className="hidden xl:block w-64 shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
