"use client"

import type { CaseStudy } from "@/data/content-library/case-studies"
import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  StatsTable,
  MetricsGrid,
  ArchitectureDiagram,
  BeforeAfterComparison,
  ComparisonCards,
  FeatureGrid,
  DataFlowDiagram,
  DecisionTree,
  VerticalFlow,
  StepFlow,
  NumberedList,
  ArticleIcons,
  type TOCItem,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "context", title: "Context & Discovery", level: 2 },
  { id: "vulnerability", title: "The Vulnerability", level: 2 },
  { id: "attack-surface", title: "Attack Surface Analysis", level: 2 },
  { id: "solution-design", title: "Solution Design", level: 2 },
  { id: "implementation", title: "Implementation", level: 2 },
  { id: "testing", title: "Testing & Validation", level: 2 },
  { id: "results", title: "Results & Metrics", level: 2 },
  { id: "takeaway", title: "Key Takeaway", level: 2 },
]

export function RateLimitingContent({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <div className="flex gap-8">
      <article className="flex-1 min-w-0">
        {/* Section 1: Context */}
        <SectionHeader number="01" title="Context & Discovery" id="context" />

        <p className="text-muted-foreground mb-6">
          During Code Review #2 (Security Review), we discovered that the service-request form&apos;s
          rate limiting was implemented using an in-memory JavaScript Map. This fundamental architectural
          flaw meant that every server restart, deployment, or serverless cold start silently reset the
          rate limiter to zero -- effectively making it decorative rather than functional.
        </p>

        <InfoBox type="warning" title="Critical Finding">
          The in-memory rate limiter had been in production for 3 weeks before the review caught it.
          During that time, 47 spam submissions reached the business inbox. The rate limiter appeared
          to work in development but was completely ineffective in production.
        </InfoBox>

        <MetricsGrid
          metrics={[
            { label: "Spam Submissions", value: "47", change: "3 weeks", positive: false },
            { label: "Script Injection Attempts", value: "3", change: "detected", positive: false },
            { label: "Rate Limiter Resets", value: "12", change: "deployments", positive: false },
            { label: "Effective Protection", value: "0%", change: "bypassed", positive: false },
          ]}
        />

        {/* Section 2: The Vulnerability */}
        <SectionHeader number="02" title="The Vulnerability" id="vulnerability" />

        <p className="text-muted-foreground mb-6">
          The core problem was a fundamental misunderstanding of serverless infrastructure.
          In traditional long-running servers, in-memory state persists between requests. In serverless
          and edge environments, each function invocation may start from a cold state -- meaning
          any in-memory store is effectively ephemeral.
        </p>

        <BeforeAfterComparison
          beforeTitle="Vulnerable Implementation"
          afterTitle="Why It Failed"
          beforeItems={[
            "Rate limits stored in JavaScript Map()",
            "Map resets on every server restart",
            "Serverless cold starts reset state",
            "No persistence layer for rate data",
            "Single-instance only (no horizontal scaling)",
          ]}
          afterItems={[
            "12 deployments = 12 rate limiter resets",
            "Attackers just wait for deploy cycle",
            "Cold starts give fresh quota every time",
            "No CSRF token validation on forms",
            "No bot detection or honeypot fields",
          ]}
        />

        <CodeBlock
          filename="VULNERABLE: server-actions/submit.ts"
          language="typescript"
          code={`// This Map resets to empty on every cold start
const rateLimitMap = new Map<string, { count: number; timestamp: number }>()

export async function submitServiceRequest(formData: FormData) {
  const ip = headers().get('x-forwarded-for') ?? 'unknown'
  const entry = rateLimitMap.get(ip)
  
  if (entry && entry.count >= 5 && Date.now() - entry.timestamp < 60000) {
    throw new Error('Too many requests')
  }
  
  // This counter resets to 0 on every deployment, restart, or cold start
  rateLimitMap.set(ip, { 
    count: (entry?.count ?? 0) + 1, 
    timestamp: Date.now() 
  })
  
  // Process submission with NO additional security...
  await saveToDatabase(formData)
}`}
        />

        {/* Section 3: Attack Surface */}
        <SectionHeader number="03" title="Attack Surface Analysis" id="attack-surface" />

        <p className="text-muted-foreground mb-6">
          Before designing the fix, we mapped every attack vector against the form submission
          flow. This threat modelling ensured we addressed all vulnerabilities, not just the
          obvious rate limiting gap.
        </p>

        <FeatureGrid
          columns={3}
          features={[
            {
              icon: <ArticleIcons.Shield />,
              title: "Rate Limit Bypass",
              description: "In-memory Map resets on cold start. Attacker gets unlimited submissions by timing requests around deployments.",
            },
            {
              icon: <ArticleIcons.Shield />,
              title: "CSRF Vulnerability",
              description: "No origin/referer validation. Cross-site forms could submit requests on behalf of victims.",
            },
            {
              icon: <ArticleIcons.Shield />,
              title: "Bot Automation",
              description: "No CAPTCHA, no honeypot, no JavaScript challenge. Trivial to automate with curl or scripts.",
            },
            {
              icon: <ArticleIcons.Shield />,
              title: "Input Injection",
              description: "Message field accepted raw HTML/script tags. 3 XSS attempts detected in review period.",
            },
            {
              icon: <ArticleIcons.Shield />,
              title: "No Logging",
              description: "No audit trail of submission attempts. Impossible to detect patterns or investigate incidents.",
            },
            {
              icon: <ArticleIcons.Shield />,
              title: "Single Point of Failure",
              description: "All security in one server action. No defence-in-depth. One bypass = full compromise.",
            },
          ]}
        />

        <DataFlowDiagram
          title="Attack Flow Before Fix"
          nodes={[
            { label: "Attacker", description: "Automated script" },
            { label: "Form Endpoint", description: "No CSRF check" },
            { label: "Rate Limiter", description: "In-memory (resets)" },
            { label: "Database", description: "Spam inserted" },
            { label: "Business Inbox", description: "Polluted" },
          ]}
        />

        {/* Section 4: Solution Design */}
        <SectionHeader number="04" title="Solution Design" id="solution-design" />

        <p className="text-muted-foreground mb-6">
          We designed a defence-in-depth architecture with 5 independent security layers.
          Each layer operates independently -- if one fails, the others still protect the system.
          This follows the security principle that no single mechanism should be the sole line of defence.
        </p>

        <ArchitectureDiagram
          title="Defence-in-Depth Architecture"
          layers={[
            { name: "Layer 1: Client Validation", items: ["Zod schema", "Field sanitisation", "Honeypot field"], color: "#3b82f6" },
            { name: "Layer 2: CSRF Protection", items: ["Origin header check", "Referer validation", "Double-submit cookie"], color: "#8b5cf6" },
            { name: "Layer 3: Rate Limiting", items: ["Redis-backed counter", "Sliding window", "IP + fingerprint key"], color: "#ef4444" },
            { name: "Layer 4: Bot Detection", items: ["Honeypot field", "Timing analysis", "JS challenge token"], color: "#f59e0b" },
            { name: "Layer 5: Input Sanitisation", items: ["HTML stripping", "Script tag removal", "Length limits"], color: "#10b981" },
          ]}
        />

        <DecisionTree
          title="Security Layer Activation Logic"
          decisions={[
            { condition: "Honeypot field filled?", result: "Reject silently (bot detected). Log attempt.", recommended: false },
            { condition: "Missing or invalid CSRF token?", result: "Return 403 Forbidden. Log origin.", recommended: false },
            { condition: "Rate limit exceeded (Redis)?", result: "Return 429 Too Many Requests. Include retry-after header.", recommended: false },
            { condition: "Input contains script/HTML tags?", result: "Strip tags, sanitise, continue processing.", recommended: true },
            { condition: "All checks pass?", result: "Process submission. Save to database. Send notification.", recommended: true },
          ]}
        />

        {/* Section 5: Implementation */}
        <SectionHeader number="05" title="Implementation" id="implementation" />

        <SubSectionHeader id="redis-rate-limiter" title="Redis-Backed Rate Limiter" />

        <p className="text-muted-foreground mb-6">
          The critical fix: replace the in-memory Map with a Redis-backed sliding window counter.
          Redis persists across restarts, deployments, and cold starts. The sliding window algorithm
          provides smooth rate limiting without the &quot;burst at window boundary&quot; problem of fixed windows.
        </p>

        <CodeBlock
          filename="lib/security/rate-limiter.ts"
          language="typescript"
          code={`import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export async function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60_000
): Promise<RateLimitResult> {
  const now = Date.now()
  const windowKey = \`rate:\${key}\`
  
  // Sliding window: remove expired entries, count remaining
  const pipeline = redis.pipeline()
  pipeline.zremrangebyscore(windowKey, 0, now - windowMs)
  pipeline.zadd(windowKey, { score: now, member: \`\${now}-\${Math.random()}\` })
  pipeline.zcard(windowKey)
  pipeline.expire(windowKey, Math.ceil(windowMs / 1000))
  
  const results = await pipeline.exec()
  const count = results[2] as number
  
  return {
    success: count <= maxRequests,
    remaining: Math.max(0, maxRequests - count),
    resetAt: now + windowMs,
  }
}`}
        />

        <SubSectionHeader id="csrf-protection" title="CSRF Protection Layer" />

        <CodeBlock
          filename="lib/security/csrf.ts"
          language="typescript"
          code={`export function validateOrigin(request: Request): boolean {
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'https://yourdomain.co.za',
  ].filter(Boolean)

  if (origin && !allowedOrigins.some(o => origin.startsWith(o!))) {
    console.warn('[Security] CSRF: Invalid origin:', origin)
    return false
  }

  if (!origin && referer) {
    const refererValid = allowedOrigins.some(o => referer.startsWith(o!))
    if (!refererValid) {
      console.warn('[Security] CSRF: Invalid referer:', referer)
      return false
    }
  }

  return true
}`}
        />

        <SubSectionHeader id="honeypot" title="Honeypot Bot Detection" />

        <StepFlow
          title="Honeypot Detection Flow"
          steps={[
            { number: 1, title: "Render Hidden Field", description: "CSS-hidden field labelled 'website' (attractive to bots)" },
            { number: 2, title: "Human Ignores", description: "Real users never see or fill the hidden field" },
            { number: 3, title: "Bot Fills Field", description: "Automated scrapers fill every visible-to-DOM field" },
            { number: 4, title: "Server Rejects", description: "If field has value, silently reject (no error message)" },
          ]}
        />

        {/* Section 6: Testing */}
        <SectionHeader number="06" title="Testing & Validation" id="testing" />

        <p className="text-muted-foreground mb-6">
          We validated each security layer independently and as a complete system. The test matrix
          covered all identified attack vectors plus edge cases discovered during implementation.
        </p>

        <StatsTable
          title="Security Test Matrix"
          headers={["Test Case", "Layer Tested", "Expected Result", "Status"]}
          rows={[
            ["5 rapid submissions from same IP", "Rate Limiter", "6th blocked (429)", "Passed"],
            ["Submit with invalid origin header", "CSRF", "Rejected (403)", "Passed"],
            ["Honeypot field filled", "Bot Detection", "Silent rejection", "Passed"],
            ["Script tag in message field", "Sanitisation", "Tags stripped, content saved", "Passed"],
            ["Cold start after deployment", "Rate Limiter", "Limits persist (Redis)", "Passed"],
            ["Concurrent requests from 10 IPs", "Rate Limiter", "Each IP tracked independently", "Passed"],
            ["Submit from valid origin", "All Layers", "Processed successfully", "Passed"],
            ["Redis connection failure", "Graceful Degradation", "Allows submission, logs warning", "Passed"],
          ]}
        />

        {/* Section 7: Results */}
        <SectionHeader number="07" title="Results & Metrics" id="results" />

        <MetricsGrid
          metrics={caseStudy.results.metrics.map(m => ({
            label: m.label,
            value: m.after,
            change: m.improvement,
            positive: true,
          }))}
        />

        <ComparisonCards
          leftTitle="Before: Decorative Security"
          rightTitle="After: Production-Grade Defence"
          leftData={caseStudy.problem.issues}
          rightData={caseStudy.solution.improvements}
        />

        <VerticalFlow
          title="Implementation Timeline"
          steps={[
            { title: "Day 1: Discovery", description: "Code Review #2 identified in-memory rate limiter vulnerability" },
            { title: "Day 1: Threat Model", description: "Mapped all attack vectors and designed defence-in-depth architecture" },
            { title: "Day 2: Redis Rate Limiter", description: "Implemented sliding window algorithm with Upstash Redis" },
            { title: "Day 2: CSRF + Honeypot", description: "Added origin validation and hidden field bot detection" },
            { title: "Day 3: Sanitisation", description: "Input stripping, length limits, and audit logging" },
            { title: "Day 3: Testing", description: "Full test matrix: 8/8 cases passed across all security layers" },
          ]}
        />

        {/* Takeaway */}
        <SectionHeader number="08" title="Key Takeaway" id="takeaway" />

        <KeyTakeaway>
          {caseStudy.keyTakeaway}
        </KeyTakeaway>

        <InfoBox type="tip" title="Rule of Thumb">
          If your security mechanism uses in-memory state (Map, Set, plain variables), it is NOT
          production security. Serverless infrastructure resets memory on every cold start. Always
          use persistent storage (Redis, database) for anything security-critical.
        </InfoBox>

        <RelatedArticles
          articles={[
            { title: "Security Layer Implementation", href: "/dashboard/content-library/case-studies/security-layer-implementation", level: "Advanced" },
            { title: "Form Validation Refactor", href: "/dashboard/content-library/case-studies/form-validation-refactor", level: "Intermediate" },
            { title: "Server/Client Component Boundaries", href: "/dashboard/content-library/articles/architecture/server-client-boundaries", level: "Intermediate" },
          ]}
        />
      </article>

      {/* TOC Sidebar */}
      <aside className="hidden xl:block w-64 flex-shrink-0">
        <div className="sticky top-24">
          <TableOfContents items={tocItems} />
        </div>
      </aside>
    </div>
  )
}
