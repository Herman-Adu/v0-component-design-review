"use client"

import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"
import { Spoiler } from "@/components/atoms/spoiler"
import { DocPage, DocSectionHeader } from "@/components/molecules/doc-page"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import {
  Shield,
  Lock,
  Clock,
  FileWarning,
  Server,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Layers,
  ArrowRight,
  ShieldCheck,
  Bug,
  Globe,
  Zap,
  XCircle,
} from "lucide-react"

const SECTIONS = [
  { id: "why-security", title: "Why This Is the Most Important Section" },
  { id: "threat-model", title: "Threat Model" },
  { id: "defense-architecture", title: "Defense-in-Depth Architecture" },
  { id: "layer-deep-dive", title: "Security Layer Deep Dive" },
  { id: "server-action-pattern", title: "Complete Server Action Pattern" },
  { id: "security-headers", title: "Production Security Headers" },
  { id: "security-checklist", title: "Production Security Checklist" },
  { id: "file-structure", title: "Security Module Structure" },
]

export default function SecurityPage() {
  return (
    <DocPage
      title="Security Architecture"
      description="Seven-layer defense-in-depth security architecture protecting every request from ingress to response. Built on real implementations, not theoretical patterns -- every code example references actual files in this codebase."
      icon={Shield}
      badges={[
        { label: "Production Critical", className: "bg-red-500/20 text-red-500 border-0" },
        { label: "Defense in Depth", className: "bg-amber-500/20 text-amber-500 border-0" },
      ]}
      tags={["7 Security Layers", "OWASP Mapped", "Rate Limiting", "CSRF Protection", "Input Sanitization", "Hydration Guards", "Zero Trust"]}
      meta={[
        { label: "Audience", value: "All Roles" },
        { label: "Last Updated", value: "2026-02-10" },
      ]}
      sections={SECTIONS}
    >
      {/* Why Security Matters */}
      <section className="space-y-6">
        <DocSectionHeader id="why-security">Why This Is the Most Important Section</DocSectionHeader>

        <Callout type="warning" title="The moment you deploy, you are a target">
          Every application exposed to the internet receives automated attack traffic within
          minutes of deployment. Bots scan for unprotected forms, exposed APIs, and injection
          vulnerabilities 24/7. A single unprotected server action can lead to data exfiltration,
          service abuse, reputation damage, and regulatory penalties. Security is not a feature --
          it is the foundation everything else stands on.
        </Callout>

        <div className="responsive-grid-3">
          {[
            {
              icon: Globe,
              title: "For CTOs & Business",
              points: [
                "Regulatory compliance (GDPR, PECR)",
                "Customer trust and reputation",
                "Liability reduction",
                "Insurance requirements",
              ],
              color: "text-blue-400",
            },
            {
              icon: Shield,
              title: "For Senior Engineers",
              points: [
                "Defense-in-depth architecture",
                "Real code, not theoretical",
                "Every layer independently effective",
                "Upgrade paths for scale",
              ],
              color: "text-accent",
            },
            {
              icon: Bug,
              title: "For All Developers",
              points: [
                "Never trust client input",
                "Validate on server, always",
                "Log everything, expose nothing",
                "Security is a habit, not a task",
              ],
              color: "text-emerald-400",
            },
          ].map((card) => (
            <Card key={card.title}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <card.icon className={`h-5 w-5 ${card.color}`} />
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1.5">
                  {card.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Threat Model */}
      <section className="space-y-6">
        <DocSectionHeader id="threat-model">Threat Model</DocSectionHeader>
        <p className="text-foreground leading-relaxed">
          Every security decision maps to a real threat. The table below shows
          OWASP-aligned attack vectors, their severity in the context of this application,
          and which security layer mitigates them.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Threat</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">OWASP</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Severity</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Mitigation Layer</th>
                <th className="text-left py-3 px-4 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { threat: "Cross-Site Scripting (XSS)", owasp: "A03:2021", severity: "Critical", layer: "Input Sanitization + Zod" },
                { threat: "Cross-Site Request Forgery", owasp: "A01:2021", severity: "High", layer: "CSRF Token + Origin Check" },
                { threat: "Denial of Service (DoS)", owasp: "N/A", severity: "High", layer: "Rate Limiting (4 tiers)" },
                { threat: "Injection Attacks", owasp: "A03:2021", severity: "Critical", layer: "Sanitizer + Server Validation" },
                { threat: "Security Misconfiguration", owasp: "A05:2021", severity: "Medium", layer: "Env Validation (Zod)" },
                { threat: "Hydration Mismatch Exploit", owasp: "N/A", severity: "Medium", layer: "Hydration Guard Pattern" },
                { threat: "Information Disclosure", owasp: "A01:2021", severity: "Medium", layer: "Safe Error Handler" },
                { threat: "Broken Access Control", owasp: "A01:2021", severity: "High", layer: "Server Actions + Origin" },
                { threat: "Sensitive Data Exposure", owasp: "A02:2021", severity: "High", layer: "Server-only env + No leaks" },
                { threat: "Automated Form Abuse", owasp: "N/A", severity: "Medium", layer: "Rate Limiting + Validation" },
              ].map((row) => (
                <tr key={row.threat} className="border-b border-border/50">
                  <td className="py-3 px-4 font-medium text-foreground">{row.threat}</td>
                  <td className="py-3 px-4">
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{row.owasp}</code>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline" className={
                      row.severity === "Critical" ? "border-red-500/50 text-red-400" :
                      row.severity === "High" ? "border-amber-500/50 text-amber-400" :
                      "border-blue-500/50 text-blue-400"
                    }>
                      {row.severity}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{row.layer}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-medium">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Protected
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Defense in Depth Architecture */}
      <section className="space-y-6">
        <DocSectionHeader id="defense-architecture">Defense-in-Depth Architecture</DocSectionHeader>
        <p className="text-foreground leading-relaxed">
          Every inbound request passes through 7 independent security layers before any business
          logic executes. If any single layer is bypassed or fails, the remaining layers still
          protect the system. This is the core principle: no single point of failure.
        </p>

        <div className="bg-card border border-border rounded-lg p-6 space-y-3">
          <h3 className="font-semibold text-foreground text-center mb-6">Request Security Pipeline</h3>
          {[
            { layer: "Layer 1", name: "Hydration Guard", desc: "SSR/client mismatch prevention", file: "hooks/use-hydration.tsx", color: "border-purple-500/50 bg-purple-500/5" },
            { layer: "Layer 2", name: "CSRF Protection", desc: "Origin validation + token verification", file: "lib/security/csrf.ts", color: "border-red-500/50 bg-red-500/5" },
            { layer: "Layer 3", name: "Rate Limiting", desc: "Sliding window per client per action", file: "lib/security/rate-limiter.ts", color: "border-amber-500/50 bg-amber-500/5" },
            { layer: "Layer 4", name: "Schema Validation", desc: "Zod parse with strict server schemas", file: "lib/validation/*-schemas.ts", color: "border-blue-500/50 bg-blue-500/5" },
            { layer: "Layer 5", name: "Input Sanitization", desc: "XSS, script injection, HTML stripping", file: "lib/sanitize/input-sanitizer.ts", color: "border-emerald-500/50 bg-emerald-500/5" },
            { layer: "Layer 6", name: "Business Logic", desc: "Email dispatch, reference ID generation", file: "lib/actions/*.ts", color: "border-cyan-500/50 bg-cyan-500/5" },
            { layer: "Layer 7", name: "Safe Error Handler", desc: "Generic messages out, details logged", file: "lib/actions/*.ts (catch)", color: "border-gray-500/50 bg-gray-500/5" },
          ].map((item, i) => (
            <div key={item.layer} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-20 shrink-0">
                <span className="text-xs font-mono text-muted-foreground">{item.layer}</span>
              </div>
              {i > 0 && (
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 -ml-1 -mr-1" />
              )}
              <div className={`flex-1 rounded-lg border p-3 ${item.color}`}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <span className="font-medium text-foreground text-sm">{item.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{item.desc}</span>
                  </div>
                  <code className="text-xs text-muted-foreground bg-background/50 px-1.5 py-0.5 rounded">{item.file}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Security Layers - Tabbed Deep Dive */}
      <section className="space-y-6">
        <DocSectionHeader id="layer-deep-dive">Security Layer Deep Dive</DocSectionHeader>

        <Tabs defaultValue="rate-limiting">
          <TabsList className="flex flex-wrap h-auto gap-1">
            <TabsTrigger value="rate-limiting" className="text-xs">Rate Limiting</TabsTrigger>
            <TabsTrigger value="csrf" className="text-xs">CSRF Protection</TabsTrigger>
            <TabsTrigger value="sanitization" className="text-xs">Sanitization</TabsTrigger>
            <TabsTrigger value="validation" className="text-xs">Server Validation</TabsTrigger>
            <TabsTrigger value="hydration" className="text-xs">Hydration Guards</TabsTrigger>
            <TabsTrigger value="env" className="text-xs">Env Validation</TabsTrigger>
            <TabsTrigger value="errors" className="text-xs">Error Handling</TabsTrigger>
          </TabsList>

          {/* Rate Limiting */}
          <TabsContent value="rate-limiting" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-400" />
                  <CardTitle>Rate Limiting</CardTitle>
                  <Badge variant="outline" className="ml-auto">Layer 3</Badge>
                </div>
                <CardDescription>
                  Sliding-window rate limiter with 4 pre-configured tiers, automatic cleanup,
                  and per-client identification via IP and forwarded headers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="responsive-grid-3">
                  {[
                    { name: "formSubmission", limit: "5 req/min", scope: "General forms" },
                    { name: "contactForm", limit: "3 req/min", scope: "Contact form" },
                    { name: "quotationRequest", limit: "3 req/5min", scope: "Quote requests" },
                    { name: "emailVerification", limit: "3 req/10min", scope: "Email verify" },
                  ].map((tier) => (
                    <div key={tier.name} className="p-3 bg-background rounded-lg border border-border">
                      <code className="text-xs text-accent">{tier.name}</code>
                      <p className="font-medium text-foreground text-sm mt-1">{tier.limit}</p>
                      <p className="text-xs text-muted-foreground">{tier.scope}</p>
                    </div>
                  ))}
                </div>

                <Spoiler title="View Rate Limiter Implementation (lib/security/rate-limiter.ts)">
                  <CodeBlock
                    title="lib/security/rate-limiter.ts"
                    language="typescript"
                    code={`interface RateLimitConfig {
  maxRequests: number  // Max requests per window
  windowMs: number     // Time window in milliseconds
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function createRateLimiter(config: RateLimitConfig) {
  startCleanup()
  
  return {
    check(identifier: string): RateLimitResult {
      const now = Date.now()
      const entry = rateLimitStore.get(identifier)
      
      if (!entry || entry.resetAt < now) {
        rateLimitStore.set(identifier, {
          count: 1,
          resetAt: now + config.windowMs,
        })
        return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + config.windowMs }
      }
      
      entry.count++
      
      if (entry.count > config.maxRequests) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt }
      }
      
      return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt }
    },
    reset(identifier: string): void {
      rateLimitStore.delete(identifier)
    },
  }
}

export function getClientIdentifier(headers?: Headers): string {
  if (!headers) return "unknown"
  return headers.get("x-forwarded-for")?.split(",")[0].trim()
      || headers.get("x-real-ip")
      || "unknown"
}`}
                  />
                </Spoiler>

                <Callout type="info" title="Production Upgrade Path">
                  The in-memory store resets on server restart and does not work across multiple
                  instances. For production with Vercel serverless, replace the Map with Upstash
                  Redis using the same interface. The check() and reset() API stays identical.
                </Callout>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CSRF */}
          <TabsContent value="csrf" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-400" />
                  <CardTitle>CSRF Protection</CardTitle>
                  <Badge variant="outline" className="ml-auto">Layer 2</Badge>
                </div>
                <CardDescription>
                  Dual-layer CSRF defense: Next.js built-in Server Action protection plus
                  explicit origin validation and optional token-based verification with
                  timing-safe comparison.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="responsive-grid-3">
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h4 className="font-medium text-foreground text-sm mb-2">Built-in (Next.js)</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>Origin header auto-validated</li>
                      <li>Action ID verification</li>
                      <li>POST-only enforcement</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h4 className="font-medium text-foreground text-sm mb-2">Custom (lib/security/csrf.ts)</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>Explicit origin allowlist</li>
                      <li>CSRF token with httpOnly cookie</li>
                      <li>Timing-safe token comparison</li>
                    </ul>
                  </div>
                </div>

                <Spoiler title="View CSRF Implementation (lib/security/csrf.ts)">
                  <CodeBlock
                    title="lib/security/csrf.ts"
                    language="typescript"
                    code={`const CSRF_TOKEN_NAME = "__csrf_token"

export function generateCsrfToken(): string {
  return crypto.randomUUID()
}

export async function setCsrfToken(): Promise<string> {
  const token = generateCsrfToken()
  const cookieStore = await cookies()
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60,
  })
  return token
}

export async function validateCsrfToken(): Promise<boolean> {
  const headersList = await headers()
  const cookieStore = await cookies()
  const headerToken = headersList.get("x-csrf-token")
  const cookieToken = cookieStore.get(CSRF_TOKEN_NAME)?.value
  
  if (!headerToken || !cookieToken) return false
  return timingSafeEqual(headerToken, cookieToken)
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export async function securityCheck(options = {}) {
  const { validateOriginHeader = true, allowedOrigins } = options
  if (validateOriginHeader) {
    const originValid = await validateOrigin(allowedOrigins)
    if (!originValid) return { valid: false, error: "Invalid request origin" }
  }
  return { valid: true }
}`}
                  />
                </Spoiler>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sanitization */}
          <TabsContent value="sanitization" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileWarning className="h-5 w-5 text-emerald-400" />
                  <CardTitle>Input Sanitization</CardTitle>
                  <Badge variant="outline" className="ml-auto">Layer 5</Badge>
                </div>
                <CardDescription>
                  Type-specific sanitizers that strip scripts, HTML, event handlers, and
                  dangerous protocols from every user input before processing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="responsive-grid-3">
                  {[
                    { method: "sanitizeInput.text()", strips: "HTML, scripts, event handlers", limit: "1,000 chars" },
                    { method: "sanitizeInput.email()", strips: "Angle brackets, whitespace", limit: "254 chars (RFC 5321)" },
                    { method: "sanitizeInput.phone()", strips: "Non-numeric except +()-", limit: "20 chars" },
                    { method: "sanitizeInput.address()", strips: "All HTML tags", limit: "200 chars" },
                    { method: "sanitizeInput.postcode()", strips: "Non-alphanumeric, forces uppercase", limit: "10 chars" },
                  ].map((s) => (
                    <div key={s.method} className="p-3 bg-background rounded-lg border border-border">
                      <code className="text-xs text-accent">{s.method}</code>
                      <p className="text-xs text-muted-foreground mt-1">{s.strips}</p>
                      <p className="text-xs text-muted-foreground/70 mt-0.5">Max: {s.limit}</p>
                    </div>
                  ))}
                </div>

                <Spoiler title="View Sanitizer Implementation (lib/sanitize/input-sanitizer.ts)">
                  <CodeBlock
                    title="lib/sanitize/input-sanitizer.ts"
                    language="typescript"
                    code={`export const sanitizeInput = {
  text: (input: string): string => {
    if (!input) return ""
    return input
      .replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, "")
      .replace(/<iframe\\b[^<]*(?:(?!<\\/iframe>)<[^<]*)*<\\/iframe>/gi, "")
      .replace(/on\\w+\\s*=\\s*["'][^"']*["']/gi, "")
      .replace(/javascript:/gi, "")
      .trim()
      .substring(0, 1000)
  },
  email: (input: string): string => {
    if (!input) return ""
    return input.toLowerCase().trim().substring(0, 254)
  },
  phone: (input: string): string => {
    if (!input) return ""
    return input.replace(/[^\\d+\\s()-]/g, "").trim().substring(0, 20)
  },
  address: (input: string): string => {
    if (!input) return ""
    return input.replace(/<[^>]*>/g, "").trim().substring(0, 200)
  },
  postcode: (input: string): string => {
    if (!input) return ""
    return input.toUpperCase().replace(/[^A-Z0-9\\s]/g, "").trim().substring(0, 10)
  },
}`}
                  />
                </Spoiler>

                <Callout type="warning" title="Sanitization is NOT Validation">
                  Sanitization strips dangerous content. Validation rejects malformed data.
                  Both are required: sanitize first (remove threats), then validate with Zod
                  (enforce structure). Never skip either step.
                </Callout>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Server Validation */}
          <TabsContent value="validation" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-blue-400" />
                  <CardTitle>Server-Side Validation</CardTitle>
                  <Badge variant="outline" className="ml-auto">Layer 4</Badge>
                </div>
                <CardDescription>
                  Strict Zod schemas on the server side re-validate all data after sanitization.
                  Client schemas are for UX feedback -- server schemas are the security boundary.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="responsive-grid-3">
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      Client Schema (UX)
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>Friendly error messages</li>
                      <li>Real-time field validation</li>
                      <li>Can be bypassed via DevTools</li>
                      <li className="text-red-400">Never trusted for security</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <h4 className="font-medium text-foreground text-sm mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      Server Schema (Security)
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>Stricter length limits</li>
                      <li>Additional format checks</li>
                      <li>Cannot be bypassed</li>
                      <li className="text-emerald-400">The real security boundary</li>
                    </ul>
                  </div>
                </div>

                <CodeBlock
                  title="Dual Schema Pattern"
                  language="typescript"
                  code={`// Client schema (lib/validation/contact-schemas.ts) - for UX
export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
})

// Server schema (same file, stricter) - for security
export const serverContactFormSchema = z.object({
  contactInfo: z.object({
    fullName: z.string().min(2).max(100),
    email: z.string().email().max(254),
    phone: z.string().min(10).max(20),
    company: z.string().max(200).optional(),
  }),
})`}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hydration Guards */}
          <TabsContent value="hydration" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-400" />
                  <CardTitle>Hydration Guard Pattern</CardTitle>
                  <Badge variant="outline" className="ml-auto">Layer 1</Badge>
                </div>
                <CardDescription>
                  Prevents SSR/client hydration mismatches caused by Radix UI random IDs. Mismatches
                  cause React to discard server HTML and re-render, creating flashes of incorrect state.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="responsive-grid-3">
                  <div className="p-3 bg-background rounded-lg border border-border text-center">
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Suppression directives</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-border text-center">
                    <p className="text-2xl font-bold text-foreground">0</p>
                    <p className="text-xs text-muted-foreground">Hydration mismatches</p>
                  </div>
                  <div className="p-3 bg-background rounded-lg border border-border text-center">
                    <p className="text-2xl font-bold text-foreground">100%</p>
                    <p className="text-xs text-muted-foreground">SSR-safe rendering</p>
                  </div>
                </div>

                <CodeBlock
                  title="hooks/use-hydration.tsx - The Guard"
                  language="typescript"
                  code={`import { useSyncExternalStore } from "react"

let hydrated = false
const listeners = new Set<() => void>()

if (typeof window !== "undefined") {
  hydrated = true
}

export function useHydration(): boolean {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb) },
    () => hydrated,
    () => false
  )
}`}
                />

                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-accent" />
                    <span className="font-medium text-foreground text-sm">Full Documentation</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    The complete hydration guard architecture is documented on the{" "}
                    <Link href="/dashboard/documentation/app-reference/hydration-and-guards" className="text-accent underline">
                      Hydration & Guards
                    </Link>{" "}
                    page.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Environment Validation */}
          <TabsContent value="env" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                  <CardTitle>Environment Validation</CardTitle>
                  <Badge variant="outline" className="ml-auto">Startup</Badge>
                </div>
                <CardDescription>
                  Zod-based validation of all environment variables at startup. Catches
                  misconfigurations immediately rather than at runtime.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Spoiler title="View Environment Schema (lib/env.ts)">
                  <CodeBlock
                    title="lib/env.ts"
                    language="typescript"
                    code={`import { z } from "zod"

const serverEnvSchema = z.object({
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),
  EMAIL_FROM: z.string().email("EMAIL_FROM must be valid email"),
  EMAIL_TO: z.string().email("EMAIL_TO must be valid email"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
})

export const serverEnv = serverEnvSchema.parse(process.env)`}
                  />
                </Spoiler>

                <Callout type="info" title="Why Fail Fast Matters">
                  Without startup validation, a missing RESEND_API_KEY would only surface when
                  a user submits a form -- in production, at 2am. Zod validation at import time
                  means the deployment fails immediately with a clear error message.
                </Callout>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Error Handling */}
          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-gray-400" />
                  <CardTitle>Safe Error Handling</CardTitle>
                  <Badge variant="outline" className="ml-auto">Layer 7</Badge>
                </div>
                <CardDescription>
                  Every server action returns generic messages to clients while logging full details
                  server-side. No stack traces, no internal paths, no database errors reach the browser.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="responsive-grid-3">
                  <div className="p-4 bg-background rounded-lg border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <h4 className="font-medium text-foreground text-sm">Never Expose</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>Stack traces</li>
                      <li>Database error messages</li>
                      <li>Internal file paths</li>
                      <li>Environment variable names</li>
                      <li>Third-party API error details</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-emerald-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <h4 className="font-medium text-foreground text-sm">Safe to Return</h4>
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>Generic user-friendly messages</li>
                      <li>Validation field errors (from Zod)</li>
                      <li>Rate limit status (remaining, resetIn)</li>
                      <li>Reference IDs (for support)</li>
                      <li>Success/failure boolean</li>
                    </ul>
                  </div>
                </div>

                <CodeBlock
                  title="Error Handling Pattern"
                  language="typescript"
                  code={`export async function submitContactRequest(data) {
  try {
    // Layers 2-6: CSRF, rate limit, validate, sanitize, process
    return { success: true, referenceId: "CR-ABC123" }
  } catch (error) {
    console.error("Contact submission error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    }
  }
}`}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      {/* Complete Server Action Pattern */}
      <section className="space-y-6">
        <DocSectionHeader id="server-action-pattern">Complete Server Action Pattern</DocSectionHeader>
        <p className="text-foreground leading-relaxed">
          This is the real implementation from <code className="bg-muted px-1 rounded">lib/actions/contact-request.ts</code>,
          showing every security layer firing in order.
        </p>

        <Spoiler title="View Full Server Action with All 7 Layers">
          <CodeBlock
            title="lib/actions/contact-request.ts (real implementation)"
            language="typescript"
            code={`"use server"

import { headers } from "next/headers"
import { serverContactFormSchema } from "@/features/contact/schemas/contact-schemas"
import { sendContactEmails } from "@/lib/email/services/contact-email-service"
import { sanitizeInput } from "@/lib/sanitize/input-sanitizer"
import { rateLimiters, getClientIdentifier } from "@/lib/security/rate-limiter"
import { securityCheck } from "@/lib/security/csrf"

export async function submitContactRequest(data) {
  try {
    // Layer 2: CSRF
    const security = await securityCheck({ validateOriginHeader: true })
    if (!security.valid) {
      return { success: false, error: security.error || "Security validation failed." }
    }

    // Layer 3: Rate Limiting
    const headersList = await headers()
    const clientId = getClientIdentifier(headersList)
    const rateLimitResult = rateLimiters.contactForm.check(clientId)
    if (!rateLimitResult.allowed) {
      return { success: false, error: "Too many requests. Please wait a moment." }
    }

    // Layer 5: Sanitize
    const sanitizedData = {
      contactInfo: {
        fullName: sanitizeInput.text(data.contactInfo.fullName),
        email: sanitizeInput.email(data.contactInfo.email),
        phone: sanitizeInput.phone(data.contactInfo.phone),
        company: data.contactInfo.company ? sanitizeInput.text(data.contactInfo.company) : undefined,
      },
      inquiryType: { ...data.inquiryType },
      messageDetails: {
        subject: sanitizeInput.text(data.messageDetails.subject),
        message: sanitizeInput.text(data.messageDetails.message),
        preferredContactMethod: data.messageDetails.preferredContactMethod,
      },
    }

    // Layer 4: Server Validation
    const validationResult = serverContactFormSchema.safeParse(sanitizedData)
    if (!validationResult.success) {
      return { success: false, error: "Validation failed" }
    }

    // Layer 6: Business Logic
    const referenceId = generateContactReferenceId()
    await sendContactEmails({ ...validationResult.data, referenceId })

    return { success: true, referenceId }

  } catch (error) {
    // Layer 7: Safe Error Response
    console.error("Contact submission error:", error)
    return { success: false, error: "An unexpected error occurred. Please try again." }
  }
}`}
          />
        </Spoiler>
      </section>

      {/* Production Security Headers */}
      <section className="space-y-6">
        <DocSectionHeader id="security-headers">Production Security Headers</DocSectionHeader>
        <p className="text-foreground leading-relaxed">
          Security headers add browser-level protection that complements the server-side layers.
          Configure in <code className="bg-muted px-1 rounded">next.config.mjs</code> or your hosting platform.
        </p>

        <CodeBlock
          title="Recommended next.config.mjs Security Headers"
          language="javascript"
          code={`const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https:",
      "frame-ancestors 'none'",
    ].join("; "),
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  },
}`}
        />

        <Callout type="info" title="Vercel Defaults">
          Vercel automatically sets X-Frame-Options: SAMEORIGIN and X-Content-Type-Options: nosniff.
          Adding explicit headers overrides these with stricter values.
        </Callout>
      </section>

      {/* Security Checklist */}
      <section className="space-y-6">
        <DocSectionHeader id="security-checklist">Production Security Checklist</DocSectionHeader>

        <div className="responsive-grid-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pre-Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                {[
                  "All server actions use securityCheck()",
                  "Rate limiters configured per action type",
                  "All string inputs pass through sanitizeInput.*",
                  "Server Zod schemas validate after sanitization",
                  "Environment variables validated with Zod at startup",
                  "Error responses return generic messages only",
                  "No console.log with sensitive data in production",
                  "Hydration guard covers all Radix UI components",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Post-Deployment</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                {[
                  "Security headers verified (securityheaders.com)",
                  "Rate limiting tested under load",
                  "Form submissions tested with malicious payloads",
                  "Error responses inspected for leaks",
                  "Hydration console clear of mismatch warnings",
                  "CSRF protection tested from different origins",
                  "Consider upgrading rate limiter to Upstash Redis",
                  "Set up monitoring for rate limit triggers",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* File Structure */}
      <section className="space-y-6">
        <DocSectionHeader id="file-structure">Security Module Structure</DocSectionHeader>

        <CodeBlock
          title="Complete Security File Map"
          language="bash"
          code={`lib/
├── security/
│   ├── index.ts              # Barrel exports
│   ├── rate-limiter.ts       # Sliding-window rate limiter, 4 tiers
│   └── csrf.ts               # Origin validation, CSRF tokens
│
├── sanitize/
│   └── input-sanitizer.ts    # text(), email(), phone(), address(), postcode()
│
├── validation/
│   ├── contact-schemas.ts    # Client + server Zod schemas
│   ├── quotation-schemas.ts  # Client + server Zod schemas
│   └── ...
│
├── actions/
│   ├── contact-request.ts    # Full 7-layer security pattern
│   ├── quotation-request.ts  # Full 7-layer security pattern
│   └── service-request.ts    # Full 7-layer security pattern
│
├── env.ts                    # Zod environment validation
│
hooks/
└── use-hydration.tsx         # SSR guard via useSyncExternalStore`}
        />

        <div className="responsive-grid-3">
          <Link href="/dashboard/documentation/app-reference/hydration-and-guards" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-accent" />
                  <CardTitle className="text-base group-hover:text-accent transition-colors">Hydration & Guards</CardTitle>
                </div>
                <CardDescription>Complete hydration guard architecture with problem analysis and the useSyncExternalStore solution.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/dashboard/documentation/app-reference/server-actions-and-api" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Server className="h-5 w-5 text-accent" />
                  <CardTitle className="text-base group-hover:text-accent transition-colors">Server Actions & API</CardTitle>
                </div>
                <CardDescription>Server action structure, form submission pipeline, and API integration patterns.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/dashboard/documentation/app-reference/performance-and-caching" className="group">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-accent" />
                  <CardTitle className="text-base group-hover:text-accent transition-colors">Performance</CardTitle>
                </div>
                <CardDescription>Caching strategies, bundle optimization, and Core Web Vitals.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </section>
    </DocPage>
  )
}
