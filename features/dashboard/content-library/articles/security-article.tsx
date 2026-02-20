"use client"

import {
  SectionHeader,
  SubSectionHeader,
  InfoBox,
  VerticalFlow,
  DataFlowDiagram,
  FeatureGrid,
  ComparisonCards,
  CodeBlock,
  KeyTakeaway,
  RelatedArticles,
  TableOfContents,
  MetricsGrid,
  StatsTable,
  type TOCItem,
  ArticleIcons,
  ArchitectureDiagram,
} from "@/components/molecules/article-components"

const tocItems: TOCItem[] = [
  { id: "defense-in-depth", title: "Defense in Depth", level: 2 },
  { id: "layer-1-origin", title: "Layer 1: Origin Validation", level: 2 },
  { id: "layer-2-rate-limit", title: "Layer 2: Rate Limiting", level: 2 },
  { id: "layer-3-sanitization", title: "Layer 3: Input Sanitization", level: 2 },
  { id: "layer-4-validation", title: "Layer 4: Schema Validation", level: 2 },
  { id: "security-pipeline", title: "The Security Pipeline", level: 2 },
  { id: "attack-prevention", title: "Attack Prevention", level: 2 },
  { id: "key-takeaway", title: "Key Takeaway", level: 2 },
]

export function SecurityArticleContent() {
  return (
    <div className="flex gap-8">
      <div className="flex-1 min-w-0">
        <InfoBox type="important">
          Security is not a feature - it is a requirement. Our approach implements defense in depth: 
          multiple layers that each catch different threats. If one layer fails, others still protect the system.
        </InfoBox>

        <SectionHeader number="01" title="Defense in Depth" id="defense-in-depth" />

        <p className="text-muted-foreground mb-6">
          No single security measure is foolproof. We implement four distinct layers, each targeting 
          different attack vectors. An attacker must bypass ALL layers to succeed.
        </p>

        <ArchitectureDiagram
          title="Security Layer Architecture"
          layers={[
            { name: "Layer 1: Origin Validation", items: ["CSRF Protection", "Referrer Check", "Origin Header"], color: "#ef4444" },
            { name: "Layer 2: Rate Limiting", items: ["IP Tracking", "Time Windows", "Request Counting"], color: "#f59e0b" },
            { name: "Layer 3: Input Sanitization", items: ["XSS Prevention", "HTML Encoding", "Script Removal"], color: "#22c55e" },
            { name: "Layer 4: Schema Validation", items: ["Type Safety", "Constraints", "Business Rules"], color: "#3b82f6" },
          ]}
        />

        <MetricsGrid
          metrics={[
            { label: "Security Layers", value: "4", change: "Defense in Depth", positive: true },
            { label: "Attack Vectors Covered", value: "6+", change: "CSRF, XSS, DDoS...", positive: true },
            { label: "Rate Limit Windows", value: "3", change: "Per action type", positive: true },
            { label: "Validation Rules", value: "25+", change: "Type + Business", positive: true },
          ]}
        />

        <SectionHeader number="02" title="Layer 1: Origin Validation" id="layer-1-origin" />

        <p className="text-muted-foreground mb-4">
          Every Server Action first validates that the request comes from our application. 
          This prevents Cross-Site Request Forgery (CSRF) attacks where malicious sites trick 
          users into submitting forms to our server.
        </p>

        <CodeBlock
          filename="lib/security/csrf.ts"
          code={`import { headers } from "next/headers"

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,
  "http://localhost:3000",
]

export async function validateOrigin(): Promise<boolean> {
  const headersList = await headers()
  const origin = headersList.get("origin")
  const referer = headersList.get("referer")
  
  // Check origin header first (preferred)
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    return true
  }
  
  // Fall back to referer header
  if (referer) {
    const refererOrigin = new URL(referer).origin
    return ALLOWED_ORIGINS.includes(refererOrigin)
  }
  
  // No valid origin found - reject request
  return false
}

// Usage in Server Action
export async function submitForm(data: FormData) {
  if (!await validateOrigin()) {
    return { success: false, error: "Invalid request origin" }
  }
  // ... continue processing
}`}
        />

        <InfoBox type="tip" title="Why Both Headers?">
          Some browsers do not send the Origin header for same-origin requests. We check both Origin 
          and Referer headers to ensure legitimate requests are not blocked while still preventing CSRF.
        </InfoBox>

        <SectionHeader number="03" title="Layer 2: Rate Limiting" id="layer-2-rate-limit" />

        <p className="text-muted-foreground mb-4">
          Rate limiting prevents abuse by restricting how many requests a client can make. 
          Each form type has different limits based on expected legitimate usage patterns.
        </p>

        <StatsTable
          title="Rate Limit Configuration"
          headers={["Form Type", "Max Requests", "Time Window", "Reasoning"]}
          rows={[
            ["Service Request", "5", "15 minutes", "Normal usage: 1-2 attempts"],
            ["Contact Form", "5", "15 minutes", "Allow retries for errors"],
            ["Quotation", "3", "30 minutes", "Complex form, fewer attempts expected"],
          ]}
        />

        <CodeBlock
          filename="lib/security/rate-limiter.ts"
          code={`interface RateLimiterOptions {
  maxRequests: number
  windowMs: number
}

export class RateLimiter {
  private requests: Map<string, { count: number; resetTime: number }> = new Map()
  
  constructor(private options: RateLimiterOptions) {}
  
  check(identifier: string): RateLimitResult {
    const now = Date.now()
    const record = this.requests.get(identifier)
    
    // Clean up expired entries
    if (record && now > record.resetTime) {
      this.requests.delete(identifier)
    }
    
    const current = this.requests.get(identifier)
    
    if (!current) {
      // First request - allow and start tracking
      this.requests.set(identifier, {
        count: 1,
        resetTime: now + this.options.windowMs,
      })
      return { allowed: true, remaining: this.options.maxRequests - 1 }
    }
    
    if (current.count >= this.options.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((current.resetTime - now) / 1000),
      }
    }
    
    // Increment counter
    current.count++
    return { allowed: true, remaining: this.options.maxRequests - current.count }
  }
}

// Pre-configured limiters for each form
export const rateLimiters = {
  serviceRequest: new RateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000 }),
  contactForm: new RateLimiter({ maxRequests: 5, windowMs: 15 * 60 * 1000 }),
  quotation: new RateLimiter({ maxRequests: 3, windowMs: 30 * 60 * 1000 }),
}`}
        />

        <SectionHeader number="04" title="Layer 3: Input Sanitization" id="layer-3-sanitization" />

        <p className="text-muted-foreground mb-4">
          All string inputs are sanitized before processing. This prevents Cross-Site Scripting (XSS) 
          attacks where malicious scripts are injected through form fields.
        </p>

        <DataFlowDiagram
          title="Sanitization Pipeline"
          nodes={[
            { label: "Raw Input", description: "User-provided string", icon: <ArticleIcons.AlertTriangle className="h-4 w-4" /> },
            { label: "HTML Encode", description: "< > & \" '", icon: <ArticleIcons.Shield className="h-4 w-4" /> },
            { label: "Trim & Normalize", description: "Whitespace handling", icon: <ArticleIcons.Code className="h-4 w-4" /> },
            { label: "Safe Output", description: "Ready for storage", icon: <ArticleIcons.Check className="h-4 w-4" /> },
          ]}
        />

        <CodeBlock
          filename="lib/sanitize/input-sanitizer.ts"
          code={`// Characters that can be used in XSS attacks
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
}

// Alias export for backward compatibility


export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return ""
  
  return input
    // Replace dangerous characters with HTML entities
    .replace(/[&<>"'/]/g, (char) => HTML_ENTITIES[char] || char)
    // Normalize whitespace
    .trim()
    .replace(/\\s+/g, " ")
}

// Recursively sanitize all strings in an object
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj }
  
  for (const key in result) {
    const value = result[key]
    if (typeof value === "string") {
      result[key] = sanitizeInput(value) as T[typeof key]
    } else if (typeof value === "object" && value !== null) {
      result[key] = sanitizeObject(value as Record<string, unknown>) as T[typeof key]
    }
  }
  
  return result
}`}
        />

        <InfoBox type="warning" title="Sanitize on Server, Not Just Client">
          Client-side sanitization can be bypassed. Always sanitize on the server before storing 
          or using data. Client-side sanitization is only for immediate display feedback.
        </InfoBox>

        <SectionHeader number="05" title="Layer 4: Schema Validation" id="layer-4-validation" />

        <p className="text-muted-foreground mb-4">
          After sanitization, Zod schemas validate data structure, types, and business rules. 
          This catches malformed data that passed previous layers.
        </p>

        <FeatureGrid
          columns={2}
          features={[
            {
              icon: <ArticleIcons.Code className="h-5 w-5" />,
              title: "Type Validation",
              description: "Ensures strings, numbers, booleans, and enums match expected types.",
            },
            {
              icon: <ArticleIcons.Shield className="h-5 w-5" />,
              title: "Constraint Checking",
              description: "Length limits, format patterns (email, phone), and range boundaries.",
            },
            {
              icon: <ArticleIcons.Target className="h-5 w-5" />,
              title: "Business Rules",
              description: "Custom validation like 'emergency requires phone' or 'date must be future'.",
            },
            {
              icon: <ArticleIcons.Zap className="h-5 w-5" />,
              title: "Structured Errors",
              description: "Field-level error messages that map directly to form UI.",
            },
          ]}
        />

        <SectionHeader number="06" title="The Security Pipeline" id="security-pipeline" />

        <p className="text-muted-foreground mb-4">
          Every Server Action runs through this complete pipeline. The securityCheck function 
          wraps all checks into a single reusable utility.
        </p>

        <VerticalFlow
          title="Request Processing Pipeline"
          steps={[
            { title: "Origin Validation", description: "Reject requests from untrusted sources", icon: <ArticleIcons.Shield className="h-4 w-4" /> },
            { title: "Rate Limit Check", description: "Enforce request quotas per client", icon: <ArticleIcons.Clock className="h-4 w-4" /> },
            { title: "Input Sanitization", description: "Neutralize potentially malicious content", icon: <ArticleIcons.Code className="h-4 w-4" /> },
            { title: "Schema Validation", description: "Verify data structure and business rules", icon: <ArticleIcons.Check className="h-4 w-4" /> },
            { title: "Business Logic", description: "Process the validated, safe data", icon: <ArticleIcons.Zap className="h-4 w-4" /> },
          ]}
        />

        <CodeBlock
          filename="lib/security/index.ts (Security Check Utility)"
          code={`export async function securityCheck(
  limiter: RateLimiter
): Promise<SecurityCheckResult> {
  // Step 1: Validate request origin
  const originValid = await validateOrigin()
  if (!originValid) {
    return { passed: false, error: "Invalid request origin" }
  }
  
  // Step 2: Check rate limit
  const clientId = await getClientIdentifier()
  const rateResult = limiter.check(clientId)
  
  if (!rateResult.allowed) {
    return {
      passed: false,
      error: \`Rate limit exceeded. Try again in \${rateResult.retryAfter}s\`,
    }
  }
  
  // All checks passed
  return { passed: true }
}

// Usage in Server Action
export async function submitServiceRequest(data: FormData) {
  const security = await securityCheck(rateLimiters.serviceRequest)
  if (!security.passed) {
    return { success: false, error: security.error }
  }
  
  // Sanitize all input
  const sanitizedData = sanitizeObject(data)
  
  // Validate with Zod
  const validated = serverFormSchema.safeParse(sanitizedData)
  if (!validated.success) {
    return { success: false, errors: validated.error.flatten() }
  }
  
  // Safe to process
  // ...
}`}
        />

        <SectionHeader number="07" title="Attack Prevention" id="attack-prevention" />

        <ComparisonCards
          idealTitle="Attacks We Prevent"
          notIdealTitle="Additional Measures for Production"
          idealFor={[
            "CSRF (Cross-Site Request Forgery) via origin validation",
            "XSS (Cross-Site Scripting) via input sanitization",
            "DDoS/Brute Force via rate limiting",
            "Injection attacks via schema validation",
            "Type confusion via TypeScript + Zod",
          ]}
          notIdealFor={[
            "SQL Injection - add parameterized queries with database",
            "Session hijacking - implement secure session management",
            "Man-in-the-middle - ensure HTTPS everywhere",
            "Password attacks - add bcrypt hashing for auth",
          ]}
        />

        <SectionHeader number="08" title="Key Takeaway" id="key-takeaway" />

        <KeyTakeaway>
          Each security layer catches what others miss. Origin validation stops CSRF, rate limiting 
          prevents abuse, sanitization neutralizes XSS, and schema validation enforces data integrity. 
          Defense in depth is not paranoia - it is engineering discipline. When you add authentication 
          and database access, you will add more layers to this foundation.
        </KeyTakeaway>

        <RelatedArticles
          articles={[
            { title: "Server Actions: Beyond the Basics", href: "/dashboard/content-library/articles/server-actions-deep-dive", level: "intermediate" },
            { title: "Type-Safe Validation with Zod", href: "/dashboard/content-library/articles/typescript-zod-validation", level: "beginner" },
            { title: "Building a Production Email System", href: "/dashboard/content-library/articles/email-system-architecture", level: "advanced" },
          ]}
        />
      </div>

      <aside className="hidden xl:block w-64 flex-shrink-0">
        <TableOfContents items={tocItems} />
      </aside>
    </div>
  )
}
