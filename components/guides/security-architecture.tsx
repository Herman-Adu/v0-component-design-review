"use client"

import {
  TableOfContents,
  SectionHeader,
  InfoBox,
  KeyTakeaway,
  StatsTable,
  NumberedList,
  ProcessFlow,
  FeatureGrid,
} from "@/components/molecules/article-components"
import { CodeBlock } from "@/components/atoms/code-block"
import { CodeExplanation } from "@/components/atoms/code-explanation"

const tocItems = [
  { id: "why-security", title: "Why This Is the Most Important Section" },
  { id: "security-layers", title: "The 7 Security Layers" },
  { id: "rate-limiting", title: "Layer 1: Rate Limiting" },
  { id: "csrf", title: "Layer 2: CSRF Protection" },
  { id: "sanitization", title: "Layer 3: Input Sanitization" },
  { id: "validation", title: "Layer 4: Server Validation" },
  { id: "hydration", title: "Layer 5: Hydration Guards" },
  { id: "environment", title: "Layer 6: Environment Validation" },
  { id: "error-handling", title: "Layer 7: Safe Error Handling" },
  { id: "owasp-mapping", title: "OWASP Top 10 Mapping" },
]

export function SecurityArchitectureContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0 space-y-8">
        <section>
          <SectionHeader number="01" title="Why This Is the Most Important Section" id="why-security" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Every application exposed to the internet receives automated attack traffic within
            minutes of deployment. Bots scan for unprotected forms, exposed APIs, and injection
            vulnerabilities 24/7. Security is not a feature -- it is the foundation everything
            else stands on.
          </p>
        </section>

        <InfoBox type="warning" title="The Moment You Deploy, You Are a Target">
          A single unprotected server action can lead to data exfiltration, service abuse,
          reputation damage, and regulatory penalties. This architecture ensures every request
          passes through multiple independent defense layers.
        </InfoBox>

        <FeatureGrid
          title="Stakeholder Perspectives"
          features={[
            { title: "CTOs & Business", description: "Regulatory compliance (GDPR, PECR), customer trust, liability reduction, insurance requirements" },
            { title: "Senior Engineers", description: "Defense-in-depth architecture, real code not theoretical, every layer independently effective" },
            { title: "All Developers", description: "Never trust client input, validate on server always, understand the attack surface" },
          ]}
        />

        <section>
          <SectionHeader number="02" title="The 7 Security Layers" id="security-layers" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Each layer operates independently -- if one layer is bypassed, the next catches the
            attack. This defense-in-depth approach means no single point of failure can compromise
            the entire system.
          </p>
        </section>

        <ProcessFlow
          title="Request Lifecycle Through Security Layers"
          steps={[
            { title: "Rate Limiting", description: "Token bucket per IP, configurable per-action limits" },
            { title: "CSRF Protection", description: "Double-submit cookie with HMAC signing" },
            { title: "Input Sanitization", description: "DOMPurify recursive sanitization of all fields" },
            { title: "Server Validation", description: "Zod schemas with custom refinements per form type" },
            { title: "Hydration Guards", description: "Client-server mismatch detection" },
            { title: "Environment Validation", description: "Runtime env var checking at startup" },
            { title: "Safe Error Handling", description: "Never leak stack traces to clients" },
          ]}
        />

        <section>
          <SectionHeader number="03" title="Layer 1: Rate Limiting" id="rate-limiting" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            The first line of defense. Rate limiting prevents brute-force attacks, spam
            submissions, and denial-of-service attempts by restricting how many requests
            a client can make within a sliding time window.
          </p>
        </section>

        <StatsTable
          title="Rate Limit Configuration"
          rows={[
            { label: "Contact Form", value: "5 requests / 60 seconds" },
            { label: "Quotation Form", value: "3 requests / 120 seconds" },
            { label: "Newsletter Signup", value: "2 requests / 300 seconds" },
            { label: "API Endpoints", value: "30 requests / 60 seconds" },
          ]}
        />

        <CodeBlock
          language="typescript"
          title="lib/security/rate-limiter.ts"
          code={`const RATE_LIMITS = {
  contact: { maxRequests: 5, windowMs: 60_000 },
  quotation: { maxRequests: 3, windowMs: 120_000 },
  newsletter: { maxRequests: 2, windowMs: 300_000 },
} as const

export function checkRateLimit(
  clientId: string,
  action: keyof typeof RATE_LIMITS
): { allowed: boolean; retryAfter?: number } {
  const config = RATE_LIMITS[action]
  const now = Date.now()
  const windowStart = now - config.windowMs
  // Sliding window implementation...
}`}
        />

        <section>
          <SectionHeader number="04" title="Layer 2: CSRF Protection" id="csrf" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Cross-Site Request Forgery protection ensures that form submissions originate
            from your application, not from a malicious third-party site. We use the
            double-submit cookie pattern with HMAC signing.
          </p>
        </section>

        <CodeBlock
          language="typescript"
          title="lib/security/csrf.ts"
          code={`import { cookies } from "next/headers"
import crypto from "crypto"

export function generateCsrfToken(): string {
  const token = crypto.randomBytes(32).toString("hex")
  const signature = crypto
    .createHmac("sha256", process.env.CSRF_SECRET!)
    .update(token)
    .digest("hex")
  return \`\${token}.\${signature}\`
}

export function validateCsrfToken(token: string): boolean {
  const [value, signature] = token.split(".")
  const expected = crypto
    .createHmac("sha256", process.env.CSRF_SECRET!)
    .update(value)
    .digest("hex")
  return crypto.timingSafeEqual(
    Buffer.from(signature), Buffer.from(expected)
  )
}`}
        />

        <section>
          <SectionHeader number="05" title="Layer 3: Input Sanitization" id="sanitization" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Every piece of user input is sanitized using DOMPurify before processing.
            The sanitizer recursively walks all object properties, cleaning strings
            and stripping dangerous HTML/JavaScript.
          </p>
        </section>

        <CodeBlock
          language="typescript"
          title="lib/security/sanitize.ts"
          code={`import DOMPurify from "isomorphic-dompurify"

export function sanitizeInput<T>(input: T): T {
  if (typeof input === "string") {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [], // Strip ALL HTML
      ALLOWED_ATTR: [],
    }) as T
  }
  if (typeof input === "object" && input !== null) {
    return Object.fromEntries(
      Object.entries(input).map(([k, v]) => [k, sanitizeInput(v)])
    ) as T
  }
  return input
}`}
        />

        <section>
          <SectionHeader number="06" title="Layer 4: Server Validation" id="validation" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            After sanitization, all input passes through Zod schema validation with custom
            refinements. Each form type has its own schema with specific business rules.
            Client-side validation is a convenience -- server validation is the authority.
          </p>
        </section>

        <NumberedList
          title="Validation Principles"
          items={[
            "Never trust client-side validation alone",
            "Use Zod schemas as the single source of truth for field constraints",
            "Apply custom refinements for business-specific rules (phone formats, postal codes)",
            "Return structured error objects that the client can map to form fields",
            "Log validation failures for security monitoring",
          ]}
        />

        <section>
          <SectionHeader number="07" title="Layer 5: Hydration Guards" id="hydration" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            React hydration mismatches can cause UI inconsistencies and security-relevant
            rendering differences between server and client. Hydration guards detect and
            handle these mismatches safely.
          </p>
        </section>

        <CodeExplanation
          title="Hydration Guard Pattern"
          code={`function useHydrationSafe<T>(serverValue: T, clientValue: T): T {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated ? clientValue : serverValue
}`}
          explanations={[
            { lines: "1", label: "Generic type for any value pair" },
            { lines: "2", label: "Track hydration state" },
            { lines: "3", label: "Set to true after first client render" },
            { lines: "4", label: "Return server value during SSR, client value after hydration" },
          ]}
        />

        <section>
          <SectionHeader number="08" title="Layer 6: Environment Validation" id="environment" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Missing or malformed environment variables are a common source of security
            vulnerabilities. Environment validation runs at startup and fails fast if
            required variables are missing.
          </p>
        </section>

        <InfoBox type="danger" title="Never Deploy Without Env Validation">
          A missing CSRF_SECRET or API key can silently disable entire security layers.
          Startup validation ensures the application refuses to run in an insecure state.
        </InfoBox>

        <section>
          <SectionHeader number="09" title="Layer 7: Safe Error Handling" id="error-handling" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Error responses must never leak internal details. Stack traces, database errors,
            and file paths are logged server-side but replaced with generic messages for
            the client. Structured error responses allow the UI to show helpful messages
            without exposing the attack surface.
          </p>
        </section>

        <CodeBlock
          language="typescript"
          title="lib/security/error-handler.ts"
          code={`export function safeActionResponse(error: unknown) {
  // Log the full error server-side
  console.error("[ServerAction]", error)

  // Return a safe, structured response to the client
  return {
    success: false,
    error: "Something went wrong. Please try again.",
    // Never include: error.message, error.stack, SQL details
  }
}`}
        />

        <section>
          <SectionHeader number="10" title="OWASP Top 10 Mapping" id="owasp-mapping" />
          <p className="text-muted-foreground leading-relaxed mt-4">
            Every security layer maps to one or more OWASP Top 10 threat categories,
            ensuring comprehensive coverage of the most common web application vulnerabilities.
          </p>
        </section>

        <StatsTable
          title="Layer to OWASP Mapping"
          rows={[
            { label: "Rate Limiting", value: "A05: Security Misconfiguration" },
            { label: "CSRF Protection", value: "A01: Broken Access Control" },
            { label: "Input Sanitization", value: "A03: Injection" },
            { label: "Server Validation", value: "A03: Injection, A04: Insecure Design" },
            { label: "Hydration Guards", value: "A04: Insecure Design" },
            { label: "Environment Validation", value: "A05: Security Misconfiguration" },
            { label: "Safe Error Handling", value: "A09: Security Logging Failures" },
          ]}
        />

        <KeyTakeaway
          title="Defense in Depth"
          points={[
            "No single layer is sufficient alone -- each catches what others miss",
            "Every layer operates independently with its own failure mode",
            "All code references real files in this codebase, not theoretical examples",
            "The architecture maps to OWASP Top 10 for compliance documentation",
            "Rate limits and validation rules are configurable per form/action type",
          ]}
        />
      </div>

      <TableOfContents items={tocItems} />
    </div>
  )
}
