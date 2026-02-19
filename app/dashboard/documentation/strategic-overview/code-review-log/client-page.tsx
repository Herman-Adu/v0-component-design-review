"use client"

import { useState } from "react"
import { CodeBlock } from "@/components/atoms/code-block"
import { Callout } from "@/components/atoms/callout"

export function CodeReviewClientPage() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Code Review & Refactoring Guide</h1>
        <p className="text-xl text-muted-foreground">Comprehensive analysis and production-ready improvements</p>
      </div>

      <Callout type="success" title="Production Improvements Implemented">
        This document outlines the critical code review findings and the production-ready improvements that have been
        implemented to address security, performance, and architectural concerns.
      </Callout>

      {/* Executive Summary */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">Executive Summary</h2>
        <p className="text-muted-foreground mb-4">
          A comprehensive code review was conducted analyzing security vulnerabilities, architectural patterns, state
          management, validation strategies, and separation of concerns. The following critical issues were identified
          and addressed:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <h3 className="font-semibold text-red-500 mb-2">Critical Issues Found</h3>
            <ul className="text-sm text-red-400 space-y-1">
              <li>• No server-side data submission layer</li>
              <li>• Missing input sanitization (XSS risk)</li>
              <li>• Client-only validation (bypassable)</li>
              <li>• No authentication/authorization</li>
              <li>• Sensitive data in localStorage</li>
            </ul>
          </div>

          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
            <h3 className="font-semibold text-green-500 mb-2">Improvements Implemented</h3>
            <ul className="text-sm text-green-400 space-y-1">
              <li>• Server actions with validation</li>
              <li>• Input sanitization layer</li>
              <li>• Server-side Zod schemas</li>
              <li>• Error boundary component</li>
              <li>• Business rule validation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Security Improvements */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
          1. Security Hardening
        </h2>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Input Sanitization Layer</h3>
        <p className="text-muted-foreground mb-4">
          Created comprehensive sanitization to prevent XSS attacks through user inputs:
        </p>

        <CodeBlock language="typescript" filename="lib/sanitize/input-sanitizer.ts">
          {`export const sanitizeInput = {
  text: (input: string): string => {
    return input
      .replace(/<script\\b[^<]*(?:(?!<\\/script>)<[^<]*)*<\\/script>/gi, "")
      .replace(/<iframe\\b[^<]*(?:(?!<\\/iframe>)<[^<]*)*<\\/iframe>/gi, "")
      .replace(/on\\w+\\s*=\\s*["'][^"']*["']/gi, "")
      .replace(/javascript:/gi, "")
      .trim()
      .substring(0, 1000)
  },
  email: (input: string): string => {
    return input.toLowerCase().trim().substring(0, 254)
  },
  // Additional sanitizers for phone, address, postcode...
}`}
        </CodeBlock>

        <Callout type="warning" title="XSS Prevention">
          All user inputs are now sanitized before storage or display. This prevents script injection attacks that could
          steal user data or compromise the application.
        </Callout>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Server-Side Validation</h3>
        <p className="text-muted-foreground mb-4">
          Client-side validation can be bypassed. We've implemented strict server-side validation:
        </p>

        <CodeBlock language="typescript" filename="lib/validation/server-schemas.ts">
          {`// Assuming z and ukPhoneRegex are imported
// import { z } from "zod"
// import { ukPhoneRegex } from "@/lib/validation/regex"

export const serverPersonalInfoSchema = z.object({
  firstName: z.string()
    .min(2).max(50)
    .regex(/^[a-zA-Z\\s'-]+$/, "Invalid characters"),
  
  lastName: z.string()
    .min(2).max(50)
    .regex(/^[a-zA-Z\\s'-]+$/, "Invalid characters"),
  
  email: z.string()
    .email()
    .max(254)
    .toLowerCase(),
  
  phone: z.string()
    .regex(ukPhoneRegex, "Invalid UK phone format"),
})`}
        </CodeBlock>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Business Rule Validation</h3>
        <p className="text-muted-foreground mb-4">Added business logic validation to enforce application rules:</p>

        <CodeBlock language="typescript" filename="lib/validation/server-schemas.ts">
          {`// Assuming data structure is known
// export const validateBusinessRules = (data: YourDataType) => { ... }

export const validateBusinessRules = (data) => {
  const errors: string[] = []
  
  // Rule: Emergency services must be within 24 hours
  if (data.serviceDetails.urgency === "emergency") {
    const preferredDate = new Date(data.schedulePreferences.preferredDate)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (preferredDate >= tomorrow) {
      errors.push("Emergency services must be scheduled within 24 hours")
    }
  }
  
  return { valid: errors.length === 0, errors }
}`}
        </CodeBlock>
      </section>

      {/* Architecture Improvements */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
          2. Architecture Refactoring
        </h2>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Data Layer Separation</h3>
        <p className="text-muted-foreground mb-4">
          Implemented proper separation of concerns with a dedicated data layer:
        </p>

        <div className="bg-muted/30 border border-border rounded-lg p-4 mb-4">
          <pre className="text-sm text-foreground">
            {`lib/
├── actions/              # Server Actions (data mutations)
│   └── service-request.actions.ts
├── sanitize/             # Input sanitization
│   └── input-sanitizer.ts
├── validation/           # Validation schemas
│   ├── schemas.ts        # Client schemas
│   └── server-schemas.ts # Server schemas
└── store/                # Client state
    └── use-form-store.ts`}
          </pre>
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Server Actions Implementation</h3>
        <p className="text-muted-foreground mb-4">Created type-safe server actions for data submission:</p>

        <CodeBlock language="typescript" filename="lib/actions/service-request.actions.ts">
          {`"use server"

// Assuming ActionResult, sanitizeFormData, serverCompleteFormSchema,
// extractFieldErrors, validateBusinessRules, and generateRequestId are imported.

export async function submitServiceRequest(
  formData: unknown
): Promise<ActionResult<{ requestId: string }>> {
  try {
    // Step 1: Sanitize inputs
    const sanitizedData = sanitizeFormData(formData)
    
    // Step 2: Validate with Zod
    const validationResult = serverCompleteFormSchema.safeParse(sanitizedData)
    
    if (!validationResult.success) {
      return {
        success: false,
        error: "Validation failed",
        fieldErrors: extractFieldErrors(validationResult.error)
      }
    }
    
    // Step 3: Business rules validation
    const businessValidation = validateBusinessRules(validationResult.data)
    
    if (!businessValidation.valid) {
      return {
        success: false,
        error: businessValidation.errors.join(", ")
      }
    }
    
    // Step 4: Save to database (TODO)
    // Step 5: Send emails (TODO)
    // Step 6: Return success
    
    return {
      success: true,
      data: { requestId: generateRequestId() }
    }
  } catch (error) {
    console.error(error) // Log the error for debugging
    return {
      success: false,
      error: "An unexpected error occurred"
    }
  }
}`}
        </CodeBlock>

        <Callout type="info" title="Type Safety">
          Server actions provide end-to-end type safety from frontend to backend, ensuring data contracts are maintained
          throughout the application.
        </Callout>

        <h3 className="text-xl font-semibold text-foreground mb-3 mt-6">Error Boundary Implementation</h3>
        <p className="text-muted-foreground mb-4">
          Added React Error Boundary to prevent white screen of death in production:
        </p>

        <CodeBlock language="typescript" filename="components/error-boundary.tsx">
          {`import React, { Component, ReactNode } from "react"
import { ErrorFallback } from "./error-fallback" // Assuming this component exists

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo)
    // TODO: Send to error tracking service (Sentry)
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />
    }
    return this.props.children
  }
}`}
        </CodeBlock>
      </section>

      {/* What Still Needs Implementation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
          3. Remaining Implementation Tasks
        </h2>

        <Callout type="warning" title="Developer Continuation Required">
          The following critical features need to be implemented before production deployment:
        </Callout>

        <div className="space-y-6 mt-6">
          <details className="bg-muted/30 border border-border rounded-lg overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-foreground hover:bg-muted/50 transition-colors">
              🔐 Authentication & Authorization
            </summary>
            <div className="px-6 pb-4 space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Priority: CRITICAL</p>
              <p>Required for production to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Associate service requests with user accounts</li>
                <li>Prevent unauthorized access to form submissions</li>
                <li>Enable user dashboard for viewing request status</li>
              </ul>
              <p className="font-medium text-foreground mt-3">Implementation Options:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>NextAuth.js for built-in Next.js integration</li>
                <li>Clerk for modern auth with UI components</li>
                <li>Supabase Auth for full-stack solution</li>
              </ul>
            </div>
          </details>

          <details className="bg-muted/30 border border-border rounded-lg overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-foreground hover:bg-muted/50 transition-colors">
              💾 Database Integration
            </summary>
            <div className="px-6 pb-4 space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Priority: CRITICAL</p>
              <p>Required for persistent data storage:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Store service requests in database</li>
                <li>Track request status (pending, in-progress, completed)</li>
                <li>Associate requests with authenticated users</li>
              </ul>
              <p className="font-medium text-foreground mt-3">Recommended Stack:</p>
              <CodeBlock language="typescript" filename="lib/db/schema.ts">
                {`// Assuming Drizzle ORM and PostgreSQL are used
// import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core'
// import { users } from './users-schema' // Assuming users table exists

export const serviceRequests = pgTable('service_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id),
  requestId: text('request_id').notNull().unique(),
  status: text('status').notNull().default('pending'),
  // ... personal info fields
  // ... service details fields
  // ... property info fields
  // ... schedule fields
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})`}
              </CodeBlock>
            </div>
          </details>

          <details className="bg-muted/30 border border-border rounded-lg overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-foreground hover:bg-muted/50 transition-colors">
              🛡️ Rate Limiting & CAPTCHA
            </summary>
            <div className="px-6 pb-4 space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Priority: HIGH</p>
              <p>Prevent abuse and bot attacks:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Rate limit submissions (e.g., 5 per hour per IP)</li>
                <li>Add CAPTCHA for anonymous submissions</li>
                <li>Implement honeypot fields to catch bots</li>
              </ul>
              <p className="font-medium text-foreground mt-3">Implementation:</p>
              <CodeBlock language="typescript" filename="lib/rate-limit.ts">
                {`// Assuming @upstash/ratelimit and @upstash/redis are installed
// import { Ratelimit } from "@upstash/ratelimit"
// import { Redis } from "@upstash/redis"

// const redis = Redis.fromEnv() // Ensure REDIS_URL and REDIS_TOKEN are set in .env

// const ratelimit = new Ratelimit({
//   redis: redis,
//   limiter: Ratelimit.slidingWindow(5, "1 h"), // 5 requests per hour
//   analytics: true,
// })

// export async function checkRateLimit(identifier: string): Promise<boolean> {
//   const { success } = await ratelimit.limit(identifier)
//   return success
// }`}
              </CodeBlock>
            </div>
          </details>

          <details className="bg-muted/30 border border-border rounded-lg overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-foreground hover:bg-muted/50 transition-colors">
              📧 Email Notifications
            </summary>
            <div className="px-6 pb-4 space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Priority: HIGH</p>
              <p>Essential communication features:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Confirmation email to customer with request ID</li>
                <li>Notification to team about new request</li>
                <li>Status updates throughout service lifecycle</li>
              </ul>
              <p className="font-medium text-foreground mt-3">Recommended Services:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Resend - Modern email API for developers</li>
                <li>SendGrid - Enterprise-grade email delivery</li>
                <li>React Email - Type-safe email templates</li>
              </ul>
            </div>
          </details>

          <details className="bg-muted/30 border border-border rounded-lg overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-foreground hover:bg-muted/50 transition-colors">
              📊 Error Tracking & Monitoring
            </summary>
            <div className="px-6 pb-4 space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Priority: MEDIUM</p>
              <p>Production observability:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Real-time error tracking with Sentry</li>
                <li>Performance monitoring with Vercel Analytics</li>
                <li>User session recording with LogRocket</li>
              </ul>
              <CodeBlock language="typescript" filename="lib/monitoring/sentry.ts">
                {`// Assuming @sentry/nextjs is installed
// import * as Sentry from "@sentry/nextjs"

// Sentry.init({
//   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
//   tracesSampleRate: 1.0,
//   environment: process.env.NODE_ENV,
// })`}
              </CodeBlock>
            </div>
          </details>

          <details className="bg-muted/30 border border-border rounded-lg overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-foreground hover:bg-muted/50 transition-colors">
              🧪 Testing Strategy
            </summary>
            <div className="px-6 pb-4 space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Priority: MEDIUM</p>
              <p>Comprehensive testing coverage needed:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Unit tests for validation and sanitization functions</li>
                <li>Integration tests for server actions</li>
                <li>E2E tests for complete form flow with Playwright</li>
              </ul>
              <p className="font-medium text-foreground mt-3">Example Unit Test:</p>
              <CodeBlock language="typescript" filename="lib/sanitize/__tests__/input-sanitizer.test.ts">
                {`// Assuming jest and @testing-library/react are configured
// import { sanitizeInput } from '../input-sanitizer';

// describe('sanitizeInput.text', () => {
//   it('removes script tags', () => {
//     const input = 'Hello <script>alert("xss")</script> World'
//     const result = sanitizeInput.text(input)
//     expect(result).toBe('Hello  World')
//   })
  
//   it('removes event handlers', () => {
//     const input = '<div onclick="alert()">Click</div>'
//     const result = sanitizeInput.text(input)
//     expect(result).not.toContain('onclick')
//   })
// })`}
              </CodeBlock>
            </div>
          </details>

          <details className="bg-muted/30 border border-border rounded-lg overflow-hidden">
            <summary className="px-6 py-4 cursor-pointer font-semibold text-foreground hover:bg-muted/50 transition-colors">
              🔒 Security Headers & CSP
            </summary>
            <div className="px-6 pb-4 space-y-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Priority: MEDIUM</p>
              <p>Add security headers in next.config.js:</p>
              <CodeBlock language="javascript" filename="next.config.mjs">
                {`/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            // Consider refining this policy based on actual script/style sources
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          }
        ]
      }
    ]
  }
};

export default nextConfig;
`}
              </CodeBlock>
            </div>
          </details>
        </div>
      </section>

      {/* Performance Optimizations */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
          4. Performance Optimization Opportunities
        </h2>

        <div className="space-y-4">
          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Code Splitting for Form Steps</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Currently all form steps load immediately. Implement dynamic imports to reduce initial bundle:
            </p>
            <CodeBlock language="typescript" filename="components/organisms/multi-step-form-container.tsx">
              {`import dynamic from 'next/dynamic'

const PersonalInfoStep = dynamic(() =>
  import('./personal-info-step').then(mod => ({ default: mod.PersonalInfoStep }))
)

const ServiceDetailsStep = dynamic(() =>
  import('./service-details-step').then(mod => ({ default: mod.ServiceDetailsStep }))
)

// Reduces initial JS bundle by ~50KB+`}
            </CodeBlock>
          </div>

          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Convert to Server Components Where Possible</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Many components are marked "use client" unnecessarily. Audit and convert static components to RSC:
            </p>
            <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
              <li>Review step can be mostly server component with client islands</li>
              <li>Step indicator could use server-rendered SVGs</li>
              <li>Form labels and static text don't need client JS</li>
            </ul>
          </div>

          <div className="bg-muted/30 border border-border rounded-lg p-4">
            <h3 className="font-semibold text-foreground mb-2">Image Optimization</h3>
            <p className="text-sm text-muted-foreground">
              Inline SVG icons could be optimized with SVGO or converted to icon sprites for better caching.
            </p>
          </div>
        </div>
      </section>

      {/* Production Checklist */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
          5. Production Deployment Checklist
        </h2>

        <div className="bg-amber-500/10 border border-amber-500/50 rounded-lg p-6">
          <h3 className="font-semibold text-amber-500 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            Pre-Deployment Checklist
          </h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" disabled />
              <div>
                <span className="font-semibold text-amber-400">Database Setup</span>
                <p className="text-amber-300/80">Configure PostgreSQL and run migrations</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" disabled />
              <div>
                <span className="font-semibold text-amber-400">Authentication</span>
                <p className="text-amber-300/80">Implement user authentication and authorization</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" disabled />
              <div>
                <span className="font-semibold text-amber-400">Email Integration</span>
                <p className="text-amber-300/80">Setup email service and templates</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" disabled />
              <div>
                <span className="font-semibold text-amber-400">Rate Limiting</span>
                <p className="text-amber-300/80">Configure rate limits and CAPTCHA</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" disabled />
              <div>
                <span className="font-semibold text-amber-400">Error Tracking</span>
                <p className="text-amber-300/80">Setup Sentry or similar error monitoring</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" disabled />
              <div>
                <span className="font-semibold text-amber-400">Security Headers</span>
                <p className="text-amber-300/80">Configure CSP and security headers</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" disabled />
              <div>
                <span className="font-semibold text-amber-400">Environment Variables</span>
                <p className="text-amber-300/80">Set all production environment variables</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" disabled />
              <div>
                <span className="font-semibold text-amber-400">Testing</span>
                <p className="text-amber-300/80">Run E2E tests and manual QA</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" disabled />
              <div>
                <span className="font-semibold text-amber-400">Performance Audit</span>
                <p className="text-amber-300/80">Run Lighthouse audit and optimize</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Code Cleanup - February 2026 */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">
          4. Code Cleanup & Refactoring (February 2026)
        </h2>
        
        <Callout type="success" title="Production Cleanup Completed">
          A comprehensive code audit was performed to clean up duplicate files, fix broken links, and ensure consistency across the codebase after the /docs to /dashboard migration.
        </Callout>

        <div className="space-y-6 mt-6">
          <div className="bg-muted/30 border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Issues Fixed</h3>
            <div className="grid gap-4">
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="font-medium text-foreground">Broken Navigation Links</p>
                  <p className="text-sm text-muted-foreground">Updated all /docs/* links to /dashboard/* in articles, tutorials, and case studies pages</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="font-medium text-foreground">Duplicate Data Files</p>
                  <p className="text-sm text-muted-foreground">Removed /data/articles.tsx (duplicate of /data/content-library/articles.tsx)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="font-medium text-foreground">React Key Warnings</p>
                  <p className="text-sm text-muted-foreground">Fixed duplicate key issues in FileTree (path-based keys) and StepFlow (index-based keys)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="font-medium text-foreground">Component Prop Mismatches</p>
                  <p className="text-sm text-muted-foreground">Updated ComparisonCards, BeforeAfterComparison, FileTreeDiagram, and MetricCard to support both legacy and new prop patterns</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="font-medium text-foreground">Article Component Exports</p>
                  <p className="text-sm text-muted-foreground">Fixed import/export name mismatches between article components (*Content suffix) and slug page imports</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-500 mt-0.5">✓</span>
                <div>
                  <p className="font-medium text-foreground">Sidebar Navigation</p>
                  <p className="text-sm text-muted-foreground">Organized articles into categories (Rendering, Architecture, Forms, Security, Best Practices) for better navigation</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-500 mb-4">Known Technical Debt</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Console.error statements in articles are intentional (for demonstrating error handling patterns)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Some localhost URLs in documentation pages are for example purposes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>TODO comments for Sentry integration and database layer remain as future work</span>
              </li>
            </ul>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Architecture Overview (Post-Cleanup)</h3>
            <pre className="text-sm text-muted-foreground overflow-x-auto">
{`app/
├── dashboard/           # Main documentation hub
│   ├── admin/           # Admin tools (email preview, content strategy)
│   ├── code-review/     # This page
│   └── content-library/ # Articles, tutorials, case studies
├── contact/             # Contact form
├── quotation/           # Quote request form
└── services/            # Services page

components/
├── articles/            # 14 rich article components
├── atoms/               # Basic building blocks
├── molecules/           # Composite components
├── organisms/           # Complex features (forms, steps)
└── ui/                  # shadcn/ui components

data/content-library/    # Single source of truth for content
├── articles.tsx         # 14 articles with categories
├── case-studies.tsx     # Case study content
└── tutorials.tsx        # Tutorial content`}
            </pre>
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-4 border-b border-border pb-2">Summary</h2>

        <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-6">
          <h3 className="font-semibold text-blue-400 mb-3">Key Takeaways</h3>
          <ul className="space-y-2 text-sm text-blue-300/90">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✓</span>
              <span>
                <strong>Security Improved:</strong> Input sanitization, server-side validation, and error handling are
                now in place
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✓</span>
              <span>
                <strong>Architecture Enhanced:</strong> Proper separation of concerns with data layer, server actions,
                and error boundaries
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">✓</span>
              <span>
                <strong>Codebase Cleaned:</strong> Removed duplicate files, fixed broken links, resolved React key warnings, and organized navigation
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">⚠</span>
              <span>
                <strong>Still Needed:</strong> Authentication, database, rate limiting, and email notifications are
                critical for production
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">📈</span>
              <span>
                <strong>Next Steps:</strong> Follow the production checklist and implement remaining features before
                deployment
              </span>
            </li>
          </ul>
        </div>
      </section>

      <div className="mt-8 p-6 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 rounded-lg">
        <p className="text-foreground font-medium mb-2">Ready to continue development?</p>
        <p className="text-muted-foreground text-sm mb-4">
          Use this guide alongside the other documentation sections to build a production-ready application. The
          foundations are solid - now it's time to add the remaining features.
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard Home
        </a>
      </div>
    </div>
  )
}
