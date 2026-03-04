export type ArticleLevel = "beginner" | "intermediate" | "advanced"
export type ArticleCategory = "architecture" | "security" | "forms" | "performance" | "best-practices" | "rendering" | "business" | "accessibility" | "testing" | "devops" | "ai-tooling"

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  level: ArticleLevel
  category: ArticleCategory
  readTime: string
  publishedAt: string
  tags: string[]
  content: string
  // If true, this article has a dedicated rich component page
  hasRichContent?: boolean
}

export const articles: Article[] = [
  // BEGINNER LEVEL
  {
    id: "1",
    slug: "atomic-design-principles",
    title: "Atomic Design: From Theory to Production",
    excerpt: "How we structured our component library using atomic design principles for maximum reusability",
    level: "beginner",
    category: "architecture",
    readTime: "8 min",
    publishedAt: "2024-01-15",
    tags: ["architecture", "components", "atomic-design"],
    hasRichContent: true,
    content: `When building our electrical service platform, we needed a component architecture that would scale. Our solution: Atomic Design with a twist.

## Our Component Inventory (52 Components)

**Atoms (10 components)** - The building blocks
- FormInput, FormSelect, FormTextarea, FormCheckbox
- DatePicker, CodeBlock, Callout, Spoiler
- ThemeToggle, RadioGroup

**Molecules (12 components)** - Composite units
- FormNavigation, FormStepContainer, FormProgressIndicator
- StepIndicator, ContentCard, OfficeHoursCard
- QuickContactCard, LocationMapCard, Navbar, DocsSidebar

**Organisms (23 components)** - Complete features
- 3 Form Containers (Service, Contact, Quotation)
- 7 Shared Steps, 5 Contact Steps, 5 Quotation Steps

## Why This Works

1. **Reusability** - FormInput used in 15+ locations
2. **Consistency** - One change updates everywhere
3. **Testability** - Each level can be tested independently
4. **Onboarding** - New devs understand structure immediately

## Key Takeaway

Start with atoms, compose upward. The structure scales.`,
  },
  {
    id: "2",
    slug: "planning-full-stack-application",
    title: "Planning a Full-Stack Application: Week Zero",
    excerpt: "The foundation work that saved us weeks of refactoring later",
    level: "beginner",
    category: "best-practices",
    readTime: "10 min",
    publishedAt: "2024-01-20",
    tags: ["planning", "architecture", "best-practices"],
    hasRichContent: true,
    content: `Before writing any code, we spent time planning. This investment paid dividends.

## What We Defined Upfront

**1. Three Core User Flows**
- Service Request (5 steps)
- Contact Form (5 steps with reference linking)
- Quotation Request (7 steps with budget/timeline)

**2. Shared vs Specific Components**
Shared steps are reused across all forms while specific steps handle unique requirements.

**3. Final Tech Stack**
- Next.js 16 (App Router + Server Actions)
- TypeScript (strict mode)
- Tailwind CSS v4 + shadcn/ui
- Zod (dual client/server validation)
- Zustand (persistent form state)
- React Email + Resend

## Time Investment

| Activity | Time | Value |
|----------|------|-------|
| User flow mapping | 2 hours | Prevented 3 major rewrites |
| Schema design | 3 hours | Zero breaking changes |
| Component planning | 2 hours | 40% code reuse |

## Key Takeaway

Plan the architecture. Map the data. Then build.`,
  },
  {
    id: "3",
    slug: "typescript-zod-validation",
    title: "Type-Safe Validation with TypeScript and Zod",
    excerpt: "Building bulletproof forms with end-to-end type safety",
    level: "beginner",
    category: "forms",
    readTime: "12 min",
    publishedAt: "2024-01-25",
    tags: ["typescript", "zod", "validation", "forms"],
    hasRichContent: true,
    content: `Our forms handle sensitive customer data. Validation isn't optional - it's critical.

## The Problem

Traditional validation leaves gaps between frontend and backend. Types can drift, validation rules differ, and bugs slip through.

## Our Solution: Single Source of Truth

We define schemas once with Zod, then derive everything:

- TypeScript types (automatic inference)
- Client validation (React Hook Form integration)
- Server validation (Server Actions)
- API documentation (schema inspection)

## Key Benefits

1. **Type Safety** - Compiler catches mismatches
2. **Single Definition** - Update once, applies everywhere
3. **Runtime Validation** - Catches invalid data at boundaries
4. **Developer Experience** - Autocomplete and error messages

## Key Takeaway

Define schemas as the source of truth. Let tools derive the rest.`,
  },
  // INTERMEDIATE LEVEL
  {
    id: "4",
    slug: "multi-step-form-architecture",
    title: "Multi-Step Form Architecture That Scales",
    excerpt: "How we built a form system that handles 3 different flows with shared components",
    level: "intermediate",
    category: "forms",
    readTime: "15 min",
    publishedAt: "2024-02-01",
    tags: ["forms", "architecture", "zustand", "state-management"],
    hasRichContent: true,
    content: `Building one multi-step form is straightforward. Building three that share code while maintaining flexibility? That requires architecture.

## The Challenge

- Service Request: 5 steps, basic flow
- Contact Form: 5 steps with reference linking
- Quotation: 7 steps with budget/timeline complexity

## Our Solution: Shared Steps Pattern

We identified common steps across all forms:
- Contact Information
- Address Details
- Schedule Preferences

These became shared components that accept different store hooks.

## State Management with Zustand

Each form has its own store with:
- Step navigation (next, previous, goTo)
- Form data persistence
- Validation state
- Reset functionality

## Key Takeaway

Identify shared patterns, extract them, and compose unique flows from common pieces.`,
  },
  {
    id: "5",
    slug: "server-actions-deep-dive",
    title: "Server Actions: Beyond the Basics",
    excerpt: "Production patterns for secure, type-safe server actions",
    level: "intermediate",
    category: "security",
    readTime: "18 min",
    publishedAt: "2024-02-10",
    tags: ["server-actions", "security", "next.js", "typescript"],
    hasRichContent: true,
    content: `Server Actions simplified our API layer. But production use requires more than the basics.

## Our Server Action Pipeline

Every action follows this pattern:

1. **Security Check** - Origin validation, CSRF protection
2. **Rate Limiting** - Prevent abuse
3. **Input Sanitization** - XSS prevention
4. **Schema Validation** - Type-safe parsing
5. **Business Logic** - Actual processing
6. **Error Handling** - Consistent responses

## Security Layers

We implemented defense-in-depth:
- Origin header validation
- Rate limiting per IP/action
- Input sanitization (HTML encoding)
- Zod schema validation
- Parameterized queries (future database)

## Key Takeaway

Server Actions are powerful but need security layers. Build a pipeline pattern.`,
  },
  {
    id: "6",
    slug: "zustand-form-state-management",
    title: "Zustand for Complex Form State",
    excerpt: "Patterns for managing multi-step form state with persistence",
    level: "intermediate",
    category: "forms",
    readTime: "14 min",
    publishedAt: "2024-02-15",
    tags: ["zustand", "state-management", "forms", "persistence"],
    hasRichContent: true,
    content: `React Hook Form handles field-level state. But multi-step forms need more: step tracking, cross-step data, persistence.

## Why Zustand?

- Simple API (no boilerplate)
- TypeScript native
- Middleware support (persist, devtools)
- Small bundle size

## Our Store Pattern

Each form store provides:
- currentStep / totalSteps
- Form data object
- Navigation methods
- Update methods
- Reset functionality

## Persistence Strategy

We use Zustand's persist middleware with localStorage. Users can refresh without losing progress.

## Key Takeaway

Separate form field state (React Hook Form) from form flow state (Zustand).`,
  },
  // ADVANCED LEVEL
  {
    id: "7",
    slug: "security-architecture-deep-dive",
    title: "Security Architecture: Defense in Depth",
    excerpt: "Building multiple security layers for production applications",
    level: "advanced",
    category: "security",
    readTime: "20 min",
    publishedAt: "2024-02-20",
    tags: ["security", "architecture", "rate-limiting", "sanitization"],
    hasRichContent: true,
    content: `Security isn't a feature - it's a requirement. Our approach: multiple layers that each catch different threats.

## Layer 1: Origin Validation

Server Actions only accept requests from allowed origins. This prevents CSRF attacks.

## Layer 2: Rate Limiting

In-memory rate limiter with configurable windows:
- Contact form: 5 requests per 15 minutes
- Quotation: 3 requests per 30 minutes

## Layer 3: Input Sanitization

All string inputs are sanitized:
- HTML entities encoded
- Script tags neutralized
- Whitespace normalized

## Layer 4: Schema Validation

Zod schemas validate:
- Field types and formats
- Length constraints
- Business rules

## Key Takeaway

Each layer catches what others miss. Defense in depth is not paranoia - it's engineering.`,
  },
  {
    id: "8",
    slug: "email-system-architecture",
    title: "Building a Production Email System",
    excerpt: "React Email + Resend for beautiful, reliable transactional emails",
    level: "advanced",
    category: "architecture",
    readTime: "16 min",
    publishedAt: "2024-02-25",
    tags: ["email", "react-email", "resend", "architecture"],
    hasRichContent: true,
    content: `Email seems simple until you need: HTML/text variants, urgency levels, customer/business templates, and reliable delivery.

## Our Architecture

**Template Layer** (React Email)
- Shared styles and components
- Urgency-based styling (routine/urgent/emergency)
- Customer and business variants

**Service Layer**
- Email service abstraction
- Form-specific email services
- Error handling and logging

**Delivery Layer** (Resend)
- API integration
- Delivery tracking
- Fallback handling

## Dual Email Pattern

Every form submission sends two emails:
1. Customer confirmation
2. Business notification

Different content, same data source.

## Key Takeaway

Abstract email into layers. Templates, services, and delivery are separate concerns.`,
  },
  {
    id: "9",
    slug: "refactoring-for-maintainability",
    title: "Refactoring for Maintainability: A Case Study",
    excerpt: "How we improved code quality through systematic refactoring",
    level: "advanced",
    category: "best-practices",
    readTime: "18 min",
    publishedAt: "2024-03-01",
    tags: ["refactoring", "code-quality", "best-practices", "maintainability"],
    hasRichContent: true,
    content: `Code reviews revealed issues. Rather than patch, we refactored systematically.

## Issues Identified

1. Debug logs in production code
2. Duplicate sanitization logic
3. Magic numbers scattered throughout
4. Inconsistent error handling
5. Missing rate limiting

## Refactoring Approach

**Phase 1: Extract Utilities**
- Created shared sanitizer
- Centralized constants
- Built error handler

**Phase 2: Add Security**
- Implemented rate limiter
- Added CSRF protection
- Created security pipeline

**Phase 3: Clean Up**
- Removed debug logs
- Deleted duplicate files
- Updated documentation

## Results

- 30% reduction in code duplication
- Consistent error responses
- Security coverage for all actions

## Key Takeaway

Refactor systematically. Extract, secure, then clean.`,
  },
  {
    id: "10",
    slug: "documentation-as-architecture",
    title: "Documentation as Architecture: Living Docs",
    excerpt: "Building documentation that evolves with your codebase",
    level: "advanced",
    category: "best-practices",
    readTime: "12 min",
    publishedAt: "2024-03-05",
    tags: ["documentation", "architecture", "best-practices", "maintenance"],
    hasRichContent: true,
    content: `Documentation that doesn't update becomes lies. We built docs that track the codebase.

## Our Documentation Architecture

**Technical Docs**
- Component inventories (auto-counted)
- API references (from actual code)
- Security documentation

**Content Library**
- Articles (beginner to advanced)
- Case studies (before/after)
- Tutorials (interactive)

**Admin Tools**
- Documentation health dashboard
- Coverage tracking
- Update changelog

## Documentation Health Page

We track:
- Last review date per section
- Coverage percentage
- Planned documentation
- Update triggers

## Key Takeaway

Documentation is code. Track it, version it, maintain it.`,
  },
  // RENDERING STRATEGIES (Intermediate Level)
  {
    id: "11",
    slug: "static-site-generation-ssg",
    title: "Static Site Generation (SSG) in Next.js",
    excerpt: "Build blazing-fast pages at build time for optimal performance and SEO",
    level: "intermediate",
    category: "rendering",
    readTime: "12 min",
    publishedAt: "2024-03-10",
    tags: ["ssg", "next.js", "rendering", "performance"],
    hasRichContent: true,
    content: `Static Site Generation pre-renders pages at build time, serving them as static HTML for maximum performance.

## When to Use SSG

- Marketing pages and landing pages
- Blog posts and documentation
- Product catalogs that update infrequently
- Any content that's the same for all users

## Implementation

In Next.js App Router, pages are statically generated by default when they don't use dynamic functions.

## Benefits

1. **Performance** - Pre-built HTML served from CDN
2. **SEO** - Full content available for crawlers
3. **Cost** - No server compute per request
4. **Reliability** - Static files rarely fail

## Key Takeaway

Use SSG for content that doesn't change per-request. It's the fastest rendering strategy.`,
  },
  {
    id: "12",
    slug: "server-side-rendering-ssr",
    title: "Server-Side Rendering (SSR) Deep Dive",
    excerpt: "Dynamic, request-time rendering for personalized and real-time content",
    level: "intermediate",
    category: "rendering",
    readTime: "15 min",
    publishedAt: "2024-03-12",
    tags: ["ssr", "next.js", "rendering", "dynamic"],
    hasRichContent: true,
    content: `Server-Side Rendering generates HTML on the server for each request, enabling dynamic, personalized content.

## When to Use SSR

- User dashboards and authenticated pages
- Personalized content (recommendations, feeds)
- Real-time data displays
- Search results with dynamic filtering

## Triggering SSR in Next.js

Use dynamic functions to opt into SSR:
- cookies() or headers()
- searchParams
- export const dynamic = "force-dynamic"

## Performance Considerations

SSR adds server processing time. Optimize with:
- Parallel data fetching (Promise.all)
- Streaming with Suspense
- Caching where appropriate

## Key Takeaway

Use SSR when content must be personalized or real-time. Optimize for speed.`,
  },
  {
    id: "13",
    slug: "incremental-static-regeneration-isr",
    title: "Incremental Static Regeneration (ISR) Explained",
    excerpt: "The best of both worlds - static performance with dynamic updates",
    level: "intermediate",
    category: "rendering",
    readTime: "14 min",
    publishedAt: "2024-03-14",
    tags: ["isr", "next.js", "rendering", "caching"],
    hasRichContent: true,
    content: `ISR combines static generation with the ability to update pages after deployment without rebuilding.

## How ISR Works

1. Page is statically generated at build time
2. Page is served from cache for configured time
3. After revalidation period, next request triggers regeneration
4. New version replaces old in cache

## Configuration

Set revalidation time in your page or fetch:
- export const revalidate = 60 (seconds)
- fetch with next: { revalidate: 60 }

## On-Demand Revalidation

Trigger updates programmatically:
- revalidatePath('/products')
- revalidateTag('products')

## Use Cases

- E-commerce product pages
- News articles
- Social media feeds
- Any content that updates but doesn't need real-time accuracy

## Key Takeaway

ISR gives you static performance with controlled freshness. Set revalidation based on content change frequency.`,
  },
  {
    id: "14",
    slug: "partial-prerendering-ppr",
    title: "Partial Prerendering (PPR): The Future of Rendering",
    excerpt: "Combine static shells with dynamic content for optimal user experience",
    level: "advanced",
    category: "rendering",
    readTime: "16 min",
    publishedAt: "2024-03-16",
    tags: ["ppr", "next.js", "rendering", "streaming"],
    hasRichContent: true,
    content: `Partial Prerendering is Next.js's newest rendering strategy, combining static shells with streamed dynamic content.

## The Problem PPR Solves

Traditional approaches force a choice:
- SSG: Fast but can't have dynamic content
- SSR: Dynamic but slower initial load

PPR: Static shell loads instantly, dynamic parts stream in.

## How PPR Works

1. Static shell (header, nav, layout) pre-rendered
2. Dynamic holes marked with Suspense boundaries
3. Shell served immediately from CDN
4. Dynamic content streams in as ready

## Implementation

Wrap dynamic content in Suspense:

<Suspense fallback={<Skeleton />}>
  <DynamicUserData />
</Suspense>

## Benefits

1. **Instant Load** - Static shell appears immediately
2. **Progressive Enhancement** - Content streams in
3. **Best UX** - Users see structure, then data
4. **Optimal Performance** - CDN for static, server for dynamic

## Key Takeaway

PPR represents the future of web rendering. Use it when you have static layouts with dynamic content sections.`,
  },
  // BUSINESS / CTO LEVEL
  {
    id: "15",
    slug: "roi-modern-web-architecture",
    title: "ROI of Modern Web Architecture: A CTO's Guide",
    excerpt: "Hard numbers on development velocity, maintenance costs, and business value of headless CMS architecture",
    level: "beginner",
    category: "business",
    readTime: "12 min",
    publishedAt: "2026-02-05",
    tags: ["business", "roi", "cto", "architecture", "headless-cms"],
    hasRichContent: true,
    content: `Making the case for modern web architecture requires hard data. Here's what the numbers tell us.

## The Cost of Technical Debt

**Traditional Monolithic Approach:**
- Average maintenance: 60-70% of developer time
- Feature velocity: 2-3 features per sprint
- Bug regression rate: 15-20% per release
- Onboarding time: 4-6 weeks

**Modern Headless Architecture:**
- Maintenance overhead: 20-30% of developer time
- Feature velocity: 5-8 features per sprint
- Bug regression rate: 3-5% per release
- Onboarding time: 1-2 weeks

## Real Cost Comparison (5-Year TCO)

| Factor | Traditional | Headless | Savings |
|--------|-------------|----------|---------|
| Initial Build | £80,000 | £100,000 | -£20,000 |
| Annual Maintenance | £40,000 | £15,000 | £25,000/yr |
| Feature Development | £60,000/yr | £35,000/yr | £25,000/yr |
| Infrastructure | £12,000/yr | £6,000/yr | £6,000/yr |
| **5-Year Total** | **£360,000** | **£210,000** | **£150,000** |

## Key Business Metrics

**Time to Market:**
- 40% faster feature deployment
- 60% reduction in QA cycles
- 80% fewer production incidents

**Developer Productivity:**
- 3x code reusability
- 50% less boilerplate
- 70% faster onboarding

## When to Invest

**Ideal Candidates:**
- Companies with 3+ digital touchpoints
- Teams spending >50% time on maintenance
- Businesses planning significant growth
- Organizations with content-heavy operations

## Key Takeaway

The upfront investment pays for itself within 18 months through reduced maintenance and increased velocity.`,
  },
  {
    id: "16",
    slug: "tech-stack-decision-framework",
    title: "Technology Stack Decision Framework",
    excerpt: "A structured approach to evaluating and selecting technology stacks for enterprise applications",
    level: "intermediate",
    category: "business",
    readTime: "15 min",
    publishedAt: "2026-02-05",
    tags: ["business", "decision-making", "technology", "enterprise", "strategy"],
    hasRichContent: true,
    content: `Choosing the right technology stack is one of the most consequential decisions in software development. Here's our framework.

## The Decision Matrix

We evaluate every technology choice against five dimensions:

**1. Team Capability (Weight: 25%)**
- Current team expertise
- Learning curve assessment
- Hiring market availability
- Training requirements

**2. Business Alignment (Weight: 25%)**
- Time-to-market requirements
- Scalability needs
- Integration requirements
- Compliance constraints

**3. Technical Merit (Weight: 20%)**
- Performance characteristics
- Security posture
- Maintainability
- Testing capabilities

**4. Ecosystem Health (Weight: 15%)**
- Community size and activity
- Package ecosystem maturity
- Documentation quality
- Long-term viability

**5. Total Cost of Ownership (Weight: 15%)**
- Licensing costs
- Infrastructure requirements
- Operational complexity
- Vendor lock-in risk

## Our Stack Choices Explained

**Frontend: Next.js + React**
- Team Capability: 9/10 (industry standard)
- Business Alignment: 9/10 (fast iteration)
- Technical Merit: 9/10 (performance, SEO)
- Ecosystem: 10/10 (massive community)
- TCO: 8/10 (Vercel costs at scale)

**Backend: Strapi CMS**
- Team Capability: 7/10 (moderate learning)
- Business Alignment: 10/10 (flexible content)
- Technical Merit: 8/10 (extensible)
- Ecosystem: 7/10 (growing community)
- TCO: 9/10 (self-hosted option)

**Validation: Zod + React Hook Form**
- Team Capability: 8/10 (TypeScript native)
- Business Alignment: 9/10 (data integrity)
- Technical Merit: 10/10 (type safety)
- Ecosystem: 8/10 (well maintained)
- TCO: 10/10 (open source)

## Red Flags to Watch

- Single maintainer projects
- Declining GitHub activity
- No clear governance model
- Excessive breaking changes
- Poor TypeScript support

## Key Takeaway

Technology decisions should be business decisions first. Use a structured framework to remove emotion and bias from the process.`,
  },
  {
    id: "17",
    slug: "building-accessible-web-applications",
    title: "Building Accessible Web Applications",
    excerpt: "Practical guide to implementing WCAG 2.1 AA compliance in modern React applications",
    level: "intermediate",
    category: "best-practices",
    readTime: "14 min",
    publishedAt: "2026-02-05",
    tags: ["accessibility", "wcag", "a11y", "react", "inclusive-design"],
    hasRichContent: true,
    content: `Accessibility isn't optional - it's a legal requirement and a business imperative. Here's how we approach it.

## The Business Case

- 15% of global population has some form of disability
- Accessible sites have 50% better SEO performance
- Legal compliance (UK Equality Act, ADA, EAA)
- Improved UX for all users (curb-cut effect)

## Our Accessibility Checklist

**Semantic HTML (Foundation)**
\`\`\`tsx
// Bad
<div onClick={handleSubmit}>Submit</div>

// Good
<button type="submit" onClick={handleSubmit}>
  Submit Form
</button>
\`\`\`

**Focus Management**
\`\`\`tsx
// Multi-step form focus handling
useEffect(() => {
  if (stepRef.current) {
    stepRef.current.focus()
  }
}, [currentStep])
\`\`\`

**ARIA Labels**
\`\`\`tsx
<input
  id="email"
  type="email"
  aria-label="Email address"
  aria-describedby="email-error"
  aria-invalid={!!errors.email}
/>
{errors.email && (
  <span id="email-error" role="alert">
    {errors.email.message}
  </span>
)}
\`\`\`

**Color Contrast**
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text (18px+)
- Don't rely on color alone

**Keyboard Navigation**
- All interactive elements focusable
- Logical tab order
- Visible focus indicators
- Escape key closes modals

## Testing Approach

1. **Automated**: axe-core, Lighthouse
2. **Manual**: Keyboard-only navigation
3. **Screen Reader**: VoiceOver, NVDA
4. **User Testing**: Include disabled users

## Key Takeaway

Build accessibility in from the start. Retrofitting is expensive and incomplete.`,
  },
  {
    id: "18",
    slug: "testing-strategy-modern-applications",
    title: "Testing Strategy for Modern Web Applications",
    excerpt: "A comprehensive testing pyramid approach for Next.js applications with practical examples",
    level: "intermediate",
    category: "testing",
    readTime: "16 min",
    publishedAt: "2026-02-05",
    tags: ["testing", "jest", "playwright", "rtl", "tdd", "quality"],
    hasRichContent: true,
    content: `A robust testing strategy is non-negotiable for production applications. Here's our approach.

## The Testing Pyramid

**Unit Tests (70%)**
- Fast, isolated, numerous
- Test pure functions, utilities
- Mock external dependencies
- Target: <1ms per test

**Integration Tests (20%)**
- Component interactions
- API route handlers
- Database operations
- Target: <100ms per test

**E2E Tests (10%)**
- Critical user journeys
- Cross-browser verification
- Real environment testing
- Target: <10s per test

## Unit Testing with Vitest

\`\`\`typescript
// lib/validation.test.ts
import { describe, it, expect } from 'vitest'
import { validateEmail, sanitizeInput } from './validation'

describe('validateEmail', () => {
  it('accepts valid emails', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('name+tag@domain.co.uk')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(validateEmail('invalid')).toBe(false)
    expect(validateEmail('@nodomain.com')).toBe(false)
  })
})

describe('sanitizeInput', () => {
  it('removes XSS vectors', () => {
    expect(sanitizeInput('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert("xss")&lt;/script&gt;')
  })
})
\`\`\`

## Integration Testing with RTL

\`\`\`typescript
// components/contact-form.test.tsx
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ContactForm } from './contact-form'

describe('ContactForm', () => {
  it('submits valid form data', async () => {
    const onSubmit = vi.fn()
    render(<ContactForm onSubmit={onSubmit} />)

    await userEvent.type(
      screen.getByLabelText(/email/i),
      'test@example.com'
    )
    await userEvent.type(
      screen.getByLabelText(/message/i),
      'Hello world'
    )
    await userEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        message: 'Hello world'
      })
    })
  })
})
\`\`\`

## E2E Testing with Playwright

\`\`\`typescript
// e2e/contact-flow.spec.ts
import { test, expect } from '@playwright/test'

test('complete contact form submission', async ({ page }) => {
  await page.goto('/contact')
  
  // Step 1: Contact Type
  await page.getByRole('button', { name: /general enquiry/i }).click()
  await page.getByRole('button', { name: /next/i }).click()
  
  // Step 2: Contact Information
  await page.getByLabel(/first name/i).fill('John')
  await page.getByLabel(/last name/i).fill('Doe')
  await page.getByLabel(/email/i).fill('john@example.com')
  await page.getByRole('button', { name: /next/i }).click()
  
  // Continue through steps...
  
  // Verify submission
  await expect(page.getByText(/thank you/i)).toBeVisible()
})
\`\`\`

## Coverage Targets

| Area | Target | Critical |
|------|--------|----------|
| Utilities | 95% | Yes |
| Components | 80% | Yes |
| Pages | 70% | No |
| E2E Flows | 100% | Yes |

## Key Takeaway

Test behavior, not implementation. Focus on what users experience, not internal details.`,
  },
  {
    id: "19",
    slug: "cicd-deployment-pipelines",
    title: "CI/CD Deployment Pipelines for Next.js",
    excerpt: "Setting up robust continuous integration and deployment workflows with GitHub Actions and Vercel",
    level: "advanced",
    category: "devops",
    readTime: "13 min",
    publishedAt: "2026-02-05",
    tags: ["devops", "cicd", "github-actions", "vercel", "automation"],
    hasRichContent: true,
    content: `Automated deployment pipelines eliminate human error and accelerate delivery. Here's our setup.

## Pipeline Overview

\`\`\`
Push → Lint → Type Check → Unit Tests → Build → E2E Tests → Deploy
\`\`\`

## GitHub Actions Workflow

\`\`\`yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Type Check
        run: pnpm type-check
      
      - name: Unit Tests
        run: pnpm test:unit --coverage
      
      - name: Upload Coverage
        uses: codecov/codecov-action@v3

  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      
      - uses: actions/upload-artifact@v3
        with:
          name: build
          path: .next

  e2e:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/download-artifact@v3
        with:
          name: build
          path: .next
      
      - name: Install Playwright
        run: pnpm exec playwright install --with-deps
      
      - name: Run E2E Tests
        run: pnpm test:e2e
      
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report

  deploy:
    needs: e2e
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: \${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: \${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: \${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
\`\`\`

## Branch Strategy

- **main**: Production deployments
- **develop**: Staging environment
- **feature/***: Preview deployments
- **hotfix/***: Emergency fixes

## Environment Management

\`\`\`typescript
// Environment validation
const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  STRAPI_URL: z.string().url(),
  STRAPI_TOKEN: z.string().min(1),
})

// Fail fast on missing env vars
envSchema.parse(process.env)
\`\`\`

## Rollback Strategy

1. Vercel instant rollback via dashboard
2. Git revert for code changes
3. Database migrations with down scripts
4. Feature flags for gradual rollout

## Key Takeaway

Invest in CI/CD early. The time saved compounds with every deployment.`,
  },
  {
    id: "20",
    slug: "why-react-hydration-breaks",
    title: "Why React Hydration Breaks: IDs, State, and the Rendering Pipeline",
    excerpt: "A deep technical exploration of React's hydration mechanism - how useId() generates deterministic IDs, why Radix UI components are especially vulnerable to mismatches, and how the Virtual DOM reconciliation process connects server HTML to client interactivity.",
    level: "intermediate",
    readTime: "18 min",
    category: "architecture",
    publishedAt: "2026-02-05",
    tags: ["react", "hydration", "radix-ui", "useId", "ssr", "virtual-dom"],
    content: `## Understanding React Hydration at the Engine Level

This article examines the internal mechanics of React's hydration process - the critical phase where server-rendered HTML is "adopted" by the client-side React runtime. Understanding these internals is essential for debugging the hydration mismatches that plague complex SSR applications.

## The Virtual DOM and Reconciliation

The Virtual DOM is React's in-memory representation of the UI. When you write JSX, React creates a tree of lightweight JavaScript objects (called "fibres" internally) that mirror the structure of the actual DOM. Reconciliation is the algorithm React uses to compare two versions of this tree and determine the minimal set of DOM mutations needed to update the UI.

During a normal client-side update, reconciliation compares the previous Virtual DOM with the new one. During hydration, reconciliation compares the server-rendered HTML (the actual DOM) with what the client-side React would render (the Virtual DOM). Any difference between these two is a hydration mismatch.

## How React useId() Works Internally

React 18 introduced useId() as a hook for generating unique, deterministic IDs. Unlike Math.random() or crypto.randomUUID(), useId() generates IDs based on the component's position in the React component tree. This means:

- The same component in the same position always gets the same ID
- IDs are generated in a depth-first traversal order
- Adding or removing components earlier in the tree shifts all subsequent IDs

This is why Radix UI is vulnerable: if a Collapsible component's open state differs between server and client, the component tree structure changes, and every subsequent useId() call generates a different value.

\`\`\`typescript
// useId generates based on tree position:
// Component A -> ID: :r0:
//   Component B -> ID: :r1:
//   Component C -> ID: :r2: (open=true, renders children)
//     Component D -> ID: :r3:
//   Component E -> ID: :r4:

// If Component C is closed on server (no children rendered):
// Component A -> ID: :r0:
//   Component B -> ID: :r1:
//   Component C -> ID: :r2: (open=false, no children)
//   Component E -> ID: :r3:  // SHIFTED! Was :r4:
// All IDs after C are now different -> hydration mismatch
\`\`\`

## Radix UI's Internal ID Generation

Radix UI primitives (Collapsible, Accordion, Dialog, Popover) use React's useId() to connect trigger elements to their content panels via ARIA attributes. Each Collapsible generates a pair:

\`\`\`html
<button aria-controls="radix-:r2:">Toggle</button>
<div id="radix-:r2:">Content</div>
\`\`\`

In a sidebar with 20+ nested Collapsible components, there are 20+ pairs of IDs that must match perfectly between server and client. If even one collapsible section has a different open/closed state, the entire ID sequence shifts.

## The Hydration Pipeline

React's hydration proceeds in these phases:

1. **Server Render**: React runs components on the server, generating an HTML string
2. **HTML Delivery**: The browser receives and displays the HTML immediately
3. **Bundle Download**: JavaScript downloads in parallel
4. **Hydration Start**: React creates its Virtual DOM by running components client-side
5. **Tree Comparison**: React walks the actual DOM and Virtual DOM simultaneously
6. **Mismatch Detection**: Any attribute or content difference triggers a warning
7. **Event Attachment**: If matched, React attaches event listeners to existing DOM nodes

The critical insight: steps 1 and 4 must produce identical output. Any dependency on client-only values (window, pathname, screen size) creates a divergence.

## Common Mismatch Patterns

**Pattern 1: Conditional Tree Structure**
\`\`\`typescript
// The tree structure differs based on a client-only value
function Sidebar() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  if (isMobile) return <MobileSheet />  // Different component tree!
  return <DesktopSidebar />
}
\`\`\`

**Pattern 2: ID-Generating Libraries**
\`\`\`typescript
// Radix generates internal IDs using useId()
// Each Collapsible shifts the ID counter
<Collapsible open={isOpen}> {/* open state differs server/client */}
  <CollapsibleContent>
    <NestedCollapsible /> {/* IDs shift from here down */}
  </CollapsibleContent>
</Collapsible>
\`\`\`

**Pattern 3: State Initialisation from Browser APIs**
\`\`\`typescript
// Server has no access to localStorage
const [theme, setTheme] = useState(
  typeof window !== "undefined"
    ? localStorage.getItem("theme") ?? "light"
    : "light" // These may differ
)
\`\`\`

## Why suppressHydrationWarning Is Not a Solution

React provides suppressHydrationWarning as an escape hatch for intentionally different content (like timestamps). However, it only suppresses the console warning - it does not fix the underlying issue. React still attempts to reconcile the mismatched DOM, which can lead to stale event handlers, broken accessibility attributes, and unpredictable UI state.

## Key Takeaway

Hydration mismatches are not bugs to suppress - they are architectural signals. When the server and client cannot agree on what to render, the solution is to restructure the rendering boundary so that client-dependent components never exist during SSR. The guard pattern (rendering a static skeleton during SSR and swapping to the real component after hydration) addresses this at the architectural level rather than patching individual symptoms.`,
  },
  {
    id: "21",
    slug: "guard-pattern-architecture",
    title: "Guard Pattern Architecture: Protecting Your App from SSR/Client Mismatches at Scale",
    excerpt: "An advanced exploration of the guard pattern as a defensive architecture strategy - how to design hydration boundaries, build reusable guard components, implement skeleton-first rendering, and establish team-wide patterns that eliminate an entire category of SSR bugs.",
    level: "advanced",
    readTime: "22 min",
    category: "best-practices",
    publishedAt: "2026-02-05",
    tags: ["architecture", "guard-pattern", "hydration", "ssr", "defensive-programming", "team-patterns"],
    content: `## Guard Pattern Architecture

The guard pattern is a defensive programming strategy borrowed from security engineering and applied to React's server/client rendering boundary. Rather than fixing individual hydration mismatches as they arise, the guard pattern prevents an entire category of bugs by controlling when and where client-dependent components can exist.

## Defensive Programming: From Security to Rendering

Defensive programming is a design philosophy where code anticipates and handles failure conditions proactively rather than reactively. In security, this manifests as input validation, authentication guards, and access control layers. In rendering, the equivalent is controlling component lifecycle boundaries.

The principle: rather than trusting that every component will produce identical output on server and client, we establish explicit boundaries where client-only components are permitted to exist.

## Understanding Rendering Boundaries

A rendering boundary is the conceptual line between server-safe code and client-dependent code. In Next.js, the "use client" directive marks where server components end and client components begin. The guard pattern adds a second boundary within client components: the hydration boundary.

\`\`\`typescript
// Layer 1: Server/Client Boundary (Next.js)
// Server Component -> "use client" -> Client Component

// Layer 2: Hydration Boundary (Guard Pattern)
// Client Component -> useHydration() -> Guarded Component

// The guard pattern adds a checkpoint WITHIN client components
// that prevents Radix/browser-dependent code from running
// until hydration is safely complete.
\`\`\`

## useSyncExternalStore: The Right Primitive

React's useSyncExternalStore was designed for exactly this use case: values that must differ between server and client snapshots. Unlike useState + useEffect (which causes two renders), useSyncExternalStore provides separate server and client snapshots in a single synchronous pass.

\`\`\`typescript
import { useSyncExternalStore } from "react"

const emptySubscribe = () => () => {}

export function useHydration(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,   // Client: hydrated
    () => false    // Server: not hydrated
  )
}
\`\`\`

## Strategic Guard Placement

Not every component needs a guard. The key is identifying which components contain client-dependent rendering:

**Guard Required:**
- Components using Radix UI primitives (Collapsible, Accordion, Dialog)
- Components depending on window, matchMedia, or IntersectionObserver
- Components using libraries that generate random IDs
- Components with state initialised from browser APIs

**Guard Not Required:**
- Pure server components
- Client components that only use onClick, onChange, etc.
- Components with no conditional rendering based on browser state

\`\`\`typescript
// Strategic placement: guard the sidebar, not the entire layout
export function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <HydrationGuard fallback={<SidebarSkeleton />}>
        <InteractiveSidebar />
      </HydrationGuard>
      <main>{children}</main>  {/* No guard needed */}
    </div>
  )
}
\`\`\`

## Skeleton-First Rendering

The skeleton serves dual purposes: it prevents hydration mismatches AND improves perceived performance. A well-designed skeleton:

1. Uses zero client-dependent libraries (no Radix, no random IDs)
2. Visually resembles the real component (matching dimensions and layout)
3. Uses CSS animations (animate-pulse) rather than JavaScript animations
4. Is deterministic (same output every render, no dynamic keys)

## Building a Reusable HydrationGuard Component

\`\`\`typescript
"use client"
import { useHydration } from "@/hooks/use-hydration"
import type { ReactNode } from "react"

interface HydrationGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function HydrationGuard({ children, fallback }: HydrationGuardProps) {
  const hydrated = useHydration()
  if (!hydrated) return fallback ?? null
  return children
}
\`\`\`

## Cost-Benefit Analysis for Technical Leads

**Cost of the guard pattern:**
- One additional render cycle on initial page load (skeleton -> real component)
- Skeleton components must be maintained alongside real components
- Team must understand which components need guards

**Cost of NOT using the guard pattern:**
- Recurring hydration bugs after every refactor
- Developer time spent diagnosing unpredictable failures
- Broken accessibility attributes (mismatched aria-controls)
- User-visible layout shifts when React attempts recovery

**ROI calculation:**
If your team spends 2+ hours per month debugging hydration issues, the guard pattern pays for itself within the first sprint.

## Team-Wide Adoption Patterns

For technical leads implementing this across a team:

1. **Create a shared hook** (use-hydration.ts) - single source of truth
2. **Document guard placement criteria** - clear rules for when guards are needed
3. **Code review checklist** - check for Radix/browser APIs in client components
4. **Skeleton component library** - pre-built skeletons for common patterns
5. **Linting rules** - warn when Radix components lack hydration guards

## Key Takeaway

The guard pattern transforms hydration from a recurring debugging burden into a solved architectural concern. By establishing clear rendering boundaries and providing reusable primitives, teams can scale their SSR applications without accumulating hydration debt.`,
  },
  // BATCH 1 - Generated from Content Pipeline Gap Analysis
  {
    id: "22",
    slug: "server-client-boundaries",
    title: "Server/Client Boundaries: What Can and Cannot Cross",
    excerpt: "The most common architectural mistake in Next.js apps: exporting non-async values from 'use server' files. Learn the rules, the TypeScript compiler behaviour, and the module boundary patterns that prevent systemic violations.",
    level: "intermediate",
    category: "architecture",
    readTime: "12 min",
    publishedAt: "2026-02-09",
    tags: ["architecture", "server-components", "use-server", "use-client", "typescript", "next.js", "module-boundaries"],
    hasRichContent: true,
    content: `Our code reviews (Reviews 3, 4, and 6) uncovered a systemic pattern: six separate 'use server' files were exporting TypeScript interfaces, type aliases, and constants alongside server actions. This is the most common architectural mistake in Next.js applications, and it silently breaks the server/client contract.

## The Problem: What 'use server' Actually Means

When you add "use server" to a file, you are telling Next.js: "Every export from this file is a server action -- an async function that runs on the server and is callable from the client via an RPC mechanism."

The critical rule: **every export from a 'use server' file MUST be an async function.** Nothing else -- not types, not interfaces, not constants, not synchronous functions.

\`\`\`typescript
// BAD: This file violates the server/client contract
"use server"

// These exports are NOT async functions
export interface EmailConfig {    // Interface export
  from: string
  replyTo: string
}

export const MAX_RETRIES = 3      // Constant export

export type Status = "pending" | "sent"  // Type export

// Only THIS is valid in a 'use server' file
export async function sendEmail(data: FormData) {
  // ... server action
}
\`\`\`

## Why TypeScript Doesn't Catch This

TypeScript's type system operates at compile time and has no awareness of Next.js directives. The TypeScript compiler sees a perfectly valid file with valid exports. The \`"use server"\` string is just a directive that TypeScript ignores -- it does not enforce the async-function-only constraint.

This means you will NOT get a TypeScript error. The violation only manifests at runtime or during the Next.js build step, making it particularly dangerous.

## The Six Files We Found

During Reviews 3, 4, and 6, we discovered this pattern in six files:
1. \`continuation-email-service.ts\` -- exported interfaces alongside actions
2. \`email-actions.ts\` -- exported type aliases
3. \`service-request-actions.ts\` -- exported validation schemas
4. \`contact-actions.ts\` -- exported constants
5. \`quotation-actions.ts\` -- exported helper types
6. \`admin-actions.ts\` -- exported configuration objects

This was systemic -- not a one-off mistake but a pattern that had propagated across the codebase.

## The Solution: Module Boundary Patterns

### Pattern 1: Separate Types into Shared Files

\`\`\`typescript
// types/email.ts (no directive -- importable anywhere)
export interface EmailConfig {
  from: string
  replyTo: string
}

export type Status = "pending" | "sent"

// actions/email-actions.ts
"use server"

import type { EmailConfig } from "@/types/email"

export async function sendEmail(config: EmailConfig, data: FormData) {
  // Server action -- this is the only valid export pattern
}
\`\`\`

### Pattern 2: Use the server-only Package

\`\`\`typescript
// lib/email-config.ts
import "server-only"  // Throws build error if imported from client

export const emailConfig: EmailConfig = {
  from: "noreply@example.com",
  replyTo: "support@example.com",
}

// This file can export anything -- constants, classes, functions
// The "server-only" package prevents client import at build time
// But it does NOT make exports into server actions
\`\`\`

### Pattern 3: Inline 'use server' Per Function

\`\`\`typescript
// lib/email-service.ts (no file-level directive)
import type { EmailConfig } from "@/types/email"

// Helper function -- NOT a server action, NOT exported to client
function buildTemplate(config: EmailConfig) {
  return \`...\`
}

// Only this function is a server action
export async function sendEmail(data: FormData) {
  "use server"  // Inline directive -- only this function crosses the boundary
  const template = buildTemplate(defaultConfig)
  // ...
}
\`\`\`

## The Decision Framework

| What you are exporting | Where to put it |
|----------------------|-----------------|
| Async function (server action) | \`"use server"\` file or inline directive |
| TypeScript type/interface | \`types/\` directory (no directive) |
| Constants/configuration | \`lib/\` with \`server-only\` if server-specific |
| Validation schemas (Zod) | \`lib/validations/\` (shared between client and server) |
| Utility functions | \`lib/\` or \`utils/\` (no directive needed) |

## Prevention: Code Review Checklist

For technical leads, add these checks to your review process:

1. **Audit 'use server' files** -- every export must be an async function
2. **Search for \`export interface\` and \`export type\` in 'use server' files** -- these are always violations
3. **Search for \`export const\` in 'use server' files** -- constants should be in separate modules
4. **Use \`server-only\` package** for server-specific utilities that are NOT server actions
5. **Prefer inline \`"use server"\` directives** when only some functions in a file need to be actions

## Key Takeaway

The 'use server' directive is not a security boundary or an organisational label -- it is an RPC contract. Every export becomes a network-callable endpoint. Treat it with the same rigour you would apply to a public API: only expose what the client needs to call, and keep everything else in separate modules.`,
  },
  // BATCH 2 - Zero Coverage Audiences (Business Admin 0%, Web Admin 0%)
  {
    id: "23",
    slug: "service-request-lifecycle",
    title: "Understanding the Service Request Lifecycle",
    excerpt: "A non-technical guide to how service requests flow through the system -- from the customer submitting a form to the electrician receiving a job sheet. Written for business administrators and project leads who manage the process without touching code.",
    level: "beginner",
    category: "architecture",
    readTime: "8 min",
    publishedAt: "2026-02-09",
    tags: ["service-requests", "business-process", "workflow", "non-technical", "operations"],
    hasRichContent: true,
    content: `This guide explains how a customer service request moves through your system. No code knowledge is required -- this is written for the people who manage the business process.

## The Five Stages

Every service request passes through five stages. Understanding these stages helps you identify bottlenecks, answer customer queries, and know exactly where a request is at any time.

### Stage 1: Submission

The customer fills out the service request form on your website. They provide:
- Their name and contact details
- The type of electrical service needed (emergency, installation, maintenance, inspection)
- A description of the problem or requirement
- Their preferred date and time
- Their address

**What happens behind the scenes:** The system validates the form (checks all required fields are filled, email format is correct), applies rate limiting (prevents spam), and stores the request in the database with a status of "pending".

**What you see:** A new entry appears in the Admin Dashboard under Service Requests with a yellow "Pending" badge.

### Stage 2: Triage

This is where you come in. As a business administrator, you review incoming requests and decide:
- **Priority:** Is this an emergency (customer has no power) or a routine request (wants a new socket installed)?
- **Assignment:** Which electrician or team is best suited for this job?
- **Schedule:** Does the customer's preferred time work with your team's availability?

**Your action:** Open the request in the dashboard, review the details, set the priority level, and assign it to a team member.

### Stage 3: Quotation

For non-emergency work, the assigned electrician reviews the request and prepares a quotation. This includes:
- Labour costs (estimated hours at the agreed rate)
- Material costs (cables, sockets, circuit breakers, etc.)
- Any special requirements (scaffolding, permits, additional inspections)

**What happens:** The quotation is created in the system and sent to the customer via email. The request status changes to "Quoted".

**What you see:** The request badge changes to blue "Quoted" and the quotation amount is visible in the request details.

### Stage 4: Execution

Once the customer approves the quotation:
- The job is scheduled on the team calendar
- The electrician receives a job sheet with all the details
- The request status changes to "In Progress"
- Upon completion, the electrician marks the job as done and notes any follow-up needed

**What you see:** The badge changes to orange "In Progress", then green "Completed".

### Stage 5: Follow-up

After completion:
- An invoice is generated based on actual work performed
- A satisfaction survey is sent to the customer
- If warranty work is applicable, the warranty period begins
- The request is archived but remains searchable

## Where Requests Get Stuck

Common bottlenecks and how to resolve them:

| Stuck At | Typical Cause | Your Action |
|----------|--------------|-------------|
| Pending (2+ days) | Nobody triaged it | Check the dashboard daily; set up email notifications |
| Quoted (5+ days) | Customer hasn't responded | Send a follow-up email; call the customer |
| In Progress (past due date) | Job took longer than expected | Contact the assigned electrician for an update |

## Key Numbers to Watch

As a business administrator, these metrics tell you how healthy your service pipeline is:
- **Average triage time:** How long from submission to assignment (target: under 4 hours for emergencies, under 24 hours for routine)
- **Quote acceptance rate:** What percentage of quotations are approved (target: above 60%)
- **Completion rate:** Jobs completed on or before the scheduled date (target: above 85%)
- **Customer satisfaction:** Average survey score (target: above 4/5)

## Summary

You don't need to understand the code to manage this process effectively. The dashboard gives you visibility into every stage, and the status badges tell you at a glance where each request sits. Your role is to keep requests moving through the pipeline -- triaging promptly, chasing stalled quotations, and monitoring the health metrics.`,
  },
  {
    id: "24",
    slug: "managing-content-in-strapi",
    title: "Managing Content in Strapi: Day-to-Day Operations",
    excerpt: "A practical guide for web administrators who manage content through Strapi CMS. Covers creating, editing, and publishing content without developer assistance.",
    level: "beginner",
    category: "architecture",
    readTime: "10 min",
    publishedAt: "2026-02-09",
    tags: ["strapi", "cms", "content-management", "non-technical", "web-admin"],
    hasRichContent: true,
    content: `This guide is for web administrators who manage the website content through Strapi. You don't need coding skills -- just a browser and your Strapi login credentials.

## Accessing Strapi

1. Open your browser and navigate to your Strapi admin URL (typically yoursite.com/admin)
2. Log in with your administrator credentials
3. You'll see the Strapi dashboard with the Content Manager in the left sidebar

## Content Types You Manage

Your Strapi instance has several content types. Here's what each one does:

| Content Type | What It Is | Where It Appears |
|-------------|-----------|-----------------|
| **Pages** | Static pages (About, Terms, Privacy) | Main website navigation |
| **Services** | Electrical service offerings | Services page and homepage |
| **Blog Posts** | News articles and updates | Blog section |
| **Testimonials** | Customer reviews | Homepage and testimonials page |
| **Team Members** | Staff profiles and qualifications | About page |
| **FAQs** | Frequently asked questions | FAQ page and service pages |

## Creating New Content

### Step 1: Choose the Content Type
Click "Content Manager" in the left sidebar, then select the type of content you want to create (e.g., "Blog Posts").

### Step 2: Click "Create New Entry"
The blue button in the top right opens a new content form.

### Step 3: Fill In the Fields
Each content type has specific fields. Common fields include:
- **Title:** The headline (appears on the page and in search results)
- **Slug:** The URL-friendly version of the title (auto-generated, but you can edit it)
- **Content:** The main body text (use the rich text editor for formatting)
- **Featured Image:** Upload an image (recommended size: 1200x630px for social sharing)
- **SEO Description:** A 150-160 character summary for search engines

### Step 4: Save as Draft or Publish
- **Save:** Saves your work without making it live
- **Publish:** Makes the content visible on the website

**Important:** Always preview your content before publishing. Use the "Save" button first, then check the website preview.

## Editing Existing Content

1. Navigate to the content type in Content Manager
2. Click on the entry you want to edit
3. Make your changes
4. Click "Save" to update the draft, or "Publish" to push changes live

**Warning about unpublishing:** If you unpublish content that has been live, any links to that page will break (show 404 errors). If you need to take content offline temporarily, consider editing it with a "Coming Soon" message instead.

## Managing Images

### Uploading Images
- Use the Media Library (accessible from the left sidebar or within any image field)
- Supported formats: JPG, PNG, WebP, SVG
- Maximum file size: Check with your developer (typically 5-10MB)

### Image Best Practices
- **Naming:** Use descriptive file names (e.g., "emergency-electrical-repair.jpg" not "IMG_3847.jpg")
- **Size:** Resize images before uploading -- 1920px wide is sufficient for full-width images
- **Alt Text:** Always fill in the alt text field (describes the image for accessibility and SEO)

## Common Tasks

### Updating the Homepage Banner
1. Go to Content Manager > Pages > Homepage
2. Scroll to the "Hero Section" component
3. Update the headline, description, or image
4. Click Publish

### Adding a New Service
1. Go to Content Manager > Services
2. Click "Create New Entry"
3. Fill in: Service Name, Description, Price Range, Duration, Category
4. Add a representative image
5. Publish when ready

### Responding to Content Requests
When the team asks you to update content:
1. Check if the content type exists in Strapi
2. If yes, make the update directly
3. If the request requires a new field or content type, escalate to the development team

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Changes not appearing on website | Clear your browser cache; changes may take 1-5 minutes to propagate |
| Image upload fails | Check file size (reduce if over 5MB) and format (use JPG/PNG) |
| Can't find a content type | Check with your developer -- it may need to be created |
| Accidentally published draft content | Unpublish immediately, but note any shared links will break |
| Rich text formatting looks wrong | Use the editor's built-in formatting buttons rather than pasting from Word |

## Weekly Maintenance Checklist

- [ ] Review and triage any pending blog post drafts
- [ ] Check for outdated service descriptions (pricing, availability)
- [ ] Review testimonials awaiting moderation
- [ ] Verify all published pages load correctly (spot-check 3-4 pages)
- [ ] Clear the Strapi media library of any unused uploads (monthly)`,
  },
  // BATCH 3 - Category Holes (performance: 0 articles)
  {
    id: "25",
    slug: "performance-budgets-for-nextjs",
    title: "Performance Budgets for Next.js: What to Measure and Why",
    excerpt: "Establish performance budgets for your Next.js application. Learn which metrics matter, how to measure them, and how to prevent performance regressions as your codebase grows.",
    level: "intermediate",
    category: "performance",
    readTime: "14 min",
    publishedAt: "2026-02-09",
    tags: ["performance", "web-vitals", "lighthouse", "bundle-size", "next.js", "monitoring"],
    hasRichContent: true,
    content: `Performance is not something you fix once -- it is something you budget for. Like a financial budget, a performance budget sets limits on metrics that matter, and alerts you when a change would exceed those limits.

## Why Performance Budgets Matter for Electrical Services

Your customers are often searching on mobile devices, sometimes in poorly-connected areas (basements, construction sites, rural properties). A 3-second delay in page load means:
- 53% of mobile users abandon the site (Google research)
- Lower search ranking (Core Web Vitals are a ranking factor)
- Fewer service request submissions (every second of delay reduces conversions by 7%)

## The Four Metrics That Matter

### 1. Largest Contentful Paint (LCP) -- Target: under 2.5s

LCP measures when the largest visible content element finishes rendering. For your site, this is typically the hero image or the main heading on the services page.

\`\`\`typescript
// Measuring LCP in Next.js
// app/layout.tsx -- Using the built-in web-vitals reporting
export function reportWebVitals(metric: {
  id: string
  name: string
  value: number
}) {
  if (metric.name === "LCP") {
    // Send to your analytics
    console.log("LCP:", metric.value, "ms")
    // Budget: alert if over 2500ms
    if (metric.value > 2500) {
      console.warn("LCP budget exceeded:", metric.value)
    }
  }
}

// Common LCP killers in Next.js:
// 1. Unoptimized hero images (use next/image with priority)
// 2. Render-blocking CSS (Tailwind purges unused styles automatically)
// 3. Slow server response (check your database queries)
// 4. Client-side rendering of above-the-fold content (use Server Components)
\`\`\`

### 2. First Input Delay (FID) / Interaction to Next Paint (INP) -- Target: under 200ms

INP measures how quickly your site responds to user interactions. For service request forms, this means: when the customer clicks "Submit", how fast does the UI acknowledge the action?

\`\`\`typescript
// The biggest INP killer: hydration of large client components
// Solution: Keep 'use client' components small and leaf-level

// BAD: Entire page is a client component (slow INP)
"use client"
export default function ServicesPage() {
  // 50KB of JavaScript must load and execute before ANY interaction works
  return <div>...</div>
}

// GOOD: Only interactive elements are client components
export default function ServicesPage() {
  // Server Component: renders instantly, zero JS
  return (
    <div>
      <h1>Our Services</h1>          {/* Static: no JS needed */}
      <ServicesList />                {/* Server Component: no JS */}
      <ServiceRequestForm />          {/* Client Component: only this hydrates */}
    </div>
  )
}
\`\`\`

### 3. Cumulative Layout Shift (CLS) -- Target: under 0.1

CLS measures visual stability. When elements shift on screen while the user is trying to interact, it creates a frustrating experience. The most common cause: images without explicit dimensions.

\`\`\`typescript
// BAD: Image without dimensions causes layout shift
<img src="/hero.jpg" alt="Electrical services" />

// GOOD: next/image handles dimensions automatically
import Image from "next/image"
<Image
  src="/hero.jpg"
  alt="Electrical services"
  width={1200}
  height={630}
  priority  // Preloads for LCP
/>

// Other CLS causes:
// - Dynamic content inserted above existing content
// - Fonts loading and changing text size (use next/font)
// - Ads or embeds without reserved space
\`\`\`

### 4. Bundle Size -- Target: under 200KB (compressed, first load)

Every kilobyte of JavaScript must be downloaded, parsed, and executed before your page is interactive.

\`\`\`bash
# Check your bundle size after build
next build

# Next.js outputs a summary:
# Route (app)                   Size     First Load JS
# /                             5.2 kB   89 kB
# /services                     3.1 kB   87 kB
# /dashboard/admin              12.4 kB  156 kB  <- Watch this
# /dashboard/admin/doc-system   28.7 kB  182 kB  <- Close to budget

# First Load JS includes the shared framework chunks
# Your page-specific JS is the "Size" column
\`\`\`

## Setting Up a Performance Budget

Create a performance budget file that your CI/CD pipeline can check:

\`\`\`typescript
// performance-budget.ts
export const PERFORMANCE_BUDGET = {
  // Core Web Vitals
  lcp: 2500,     // milliseconds
  inp: 200,      // milliseconds
  cls: 0.1,      // score (unitless)
  
  // Bundle budgets
  firstLoadJs: 200_000,  // bytes (compressed)
  pageSpecificJs: 50_000, // bytes per route
  
  // Network
  totalRequests: 30,      // max HTTP requests on first load
  totalTransfer: 500_000, // bytes total transfer
  
  // Images
  heroImageSize: 150_000, // bytes (compressed)
  thumbnailSize: 30_000,  // bytes each
}
\`\`\`

## Prevention: The Performance Review Checklist

Add these checks to every code review:

1. **New dependency?** Check its bundle impact: \`npx bundlephobia [package-name]\`
2. **New 'use client' component?** Does it need to be client-side, or can it be a Server Component?
3. **New image?** Is it using next/image with explicit dimensions?
4. **New font?** Is it using next/font with subsetting?
5. **Run \`next build\`** and check the route size table -- did any route exceed the budget?

## Key Takeaway

Performance budgets turn a vague goal ("make it fast") into a measurable constraint ("first load JS must be under 200KB"). Set the budget, automate the checks, and treat violations the same way you treat failing tests -- fix them before merging.`,
  },
  // BATCH 4 - High-severity Review Knowledge (Q1, A6)
  {
    id: "26",
    slug: "duplicate-providers-architectural-cost",
    title: "The Architectural Cost of Duplicate Providers",
    excerpt: "Code Review #1 found duplicate ThemeProvider implementations causing conflicting theme contexts. This article explains how provider duplication happens, why it silently breaks your app, and the one-provider-per-concern pattern that prevents it.",
    level: "intermediate",
    category: "architecture",
    readTime: "10 min",
    publishedAt: "2026-02-09",
    tags: ["architecture", "react-context", "providers", "theme", "code-review", "debugging"],
    hasRichContent: true,
    content: `Code Review #1 (Quality Review) uncovered a subtle but damaging problem: the application had two separate ThemeProvider implementations wrapping different parts of the component tree. This caused theme changes in one area to not propagate to another, creating an inconsistent user experience where parts of the dashboard used the dark theme while other parts stayed light.

## How Duplicate Providers Happen

It starts innocently. Developer A adds a ThemeProvider in the root layout:

\`\`\`typescript
// app/layout.tsx
import { ThemeProvider } from "next-themes"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
\`\`\`

Weeks later, Developer B is building the dashboard and wants theme support. They don't check the root layout (it's in a different file, maybe they didn't even know it existed). They add their own:

\`\`\`typescript
// app/dashboard/layout.tsx
import { ThemeProvider } from "next-themes"

export default function DashboardLayout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system">
      <Sidebar />
      <main>{children}</main>
    </ThemeProvider>
  )
}
\`\`\`

Now the dashboard has TWO ThemeProviders. The inner one creates a new context boundary, so \`useTheme()\` inside the dashboard reads from the inner provider (defaultTheme: "system"), while components outside the dashboard read from the outer provider (defaultTheme: "dark").

## Why React Doesn't Warn You

React's Context API is designed to allow nested providers -- it's a feature, not a bug. The closest provider wins. React has no way to know that two ThemeProviders with different defaults is unintentional.

TypeScript also won't catch this because both providers are valid JSX elements with valid props.

## The Symptoms

- Theme toggle works in the sidebar but not in the main content (or vice versa)
- Page flashes between themes on navigation
- \`useTheme()\` returns different values in different components
- Dark mode CSS applies inconsistently
- User's theme preference doesn't persist across all areas

## The One-Provider-Per-Concern Pattern

\`\`\`typescript
// RULE: Each context concern has exactly ONE provider,
// placed at the HIGHEST layout level that needs it.

// app/layout.tsx (root) -- This is the ONLY ThemeProvider
import { ThemeProvider } from "next-themes"

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// app/dashboard/layout.tsx -- NO ThemeProvider here
// Just use useTheme() to consume the context
export default function DashboardLayout({ children }) {
  return (
    <>
      <Sidebar />
      <main>{children}</main>
    </>
  )
}
\`\`\`

## The Provider Audit Checklist

Run these searches in your codebase to detect duplicate providers:

\`\`\`bash
# Find all provider instances
grep -r "Provider" app/ --include="*.tsx" -l

# Specifically check for common duplicates
grep -r "ThemeProvider" app/ --include="*.tsx" -l
grep -r "SessionProvider" app/ --include="*.tsx" -l
grep -r "QueryClientProvider" app/ --include="*.tsx" -l
\`\`\`

If any provider name appears in more than one layout file, you likely have a duplication problem.

## Key Takeaway

Duplicate providers are a silent architectural bug. React treats nested providers as intentional, TypeScript sees them as valid JSX, and the symptoms (inconsistent state, flash of wrong theme) are often attributed to other causes. The fix is organisational: one provider per concern, placed at the highest necessary layout level, and a grep-based audit in your code review checklist.`,
  },
  {
    id: "27",
    slug: "hydration-mismatches-use-client-layouts",
    title: "How 'use client' Layouts Cause Systemic Hydration Mismatches",
    excerpt: "Code Review #4 found all 3 dashboard layouts were marked 'use client', causing the entire dashboard to hydrate as a client-side application. This article explains the cascade effect and why layouts should almost always be Server Components.",
    level: "advanced",
    category: "architecture",
    readTime: "12 min",
    publishedAt: "2026-02-09",
    tags: ["architecture", "hydration", "server-components", "use-client", "performance", "next.js", "code-review"],
    hasRichContent: true,
    content: `Code Review #4 (Architecture Review) made a discovery that explained months of intermittent hydration warnings: all three dashboard layouts (root dashboard, admin, and doc-system) were marked with "use client". This meant every single page under /dashboard was being hydrated as a client-side React application, negating the performance benefits of Server Components entirely.

## The Cascade Effect

In Next.js, layouts wrap their child segments. When a layout is a Client Component, every component it renders also becomes part of the client bundle -- even if those components don't use "use client" themselves.

\`\`\`
app/dashboard/layout.tsx        "use client" <-- Infection point
  app/dashboard/admin/layout.tsx    "use client"
    app/dashboard/admin/page.tsx       Forced to client bundle
    app/dashboard/admin/document-administration/documentation-health/page.tsx  "use client"
      app/dashboard/admin/document-administration/documentation-health/gap-analysis/page.tsx  Forced to client bundle
      // EVERY page under /dashboard is now client-rendered
\`\`\`

This creates three problems:
1. **Bundle size explosion:** Server Components have zero JavaScript cost. Forcing them to the client bundle means their code ships to the browser unnecessarily.
2. **Hydration mismatches:** Client Components must produce identical HTML on server and client. Any time-dependent, random, or browser-specific value causes a mismatch warning.
3. **No streaming:** Server Components can stream their content progressively. Client Components must wait for the full JavaScript bundle before rendering anything.

## Why Developers Add 'use client' to Layouts

The most common reason: the layout uses a hook. Often it's just \`usePathname()\` for highlighting the active navigation item:

\`\`\`typescript
// BEFORE: Layout forced to client for one hook
"use client"

import { usePathname } from "next/navigation"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  
  return (
    <div className="flex">
      <nav>
        {/* Uses pathname to highlight active item */}
        <NavLink href="/dashboard" active={pathname === "/dashboard"}>
          Overview
        </NavLink>
      </nav>
      <main>{children}</main>
    </div>
  )
}
\`\`\`

The entire layout -- including the \`<main>\` wrapper and everything it renders -- is now a Client Component because of one \`usePathname()\` call.

## The Fix: Push Client Boundaries Down

Extract only the interactive parts into small Client Components. The layout itself stays as a Server Component:

\`\`\`typescript
// AFTER: Layout is a Server Component
// app/dashboard/layout.tsx (NO "use client")

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      <DashboardNav />  {/* Client Component -- only this hydrates */}
      <main>{children}</main>  {/* Server Component territory */}
    </div>
  )
}

// components/dashboard-nav.tsx
"use client"

import { usePathname } from "next/navigation"

export function DashboardNav() {
  const pathname = usePathname()
  
  return (
    <nav>
      <NavLink href="/dashboard" active={pathname === "/dashboard"}>
        Overview
      </NavLink>
    </nav>
  )
}
\`\`\`

Now only the \`<DashboardNav />\` component ships JavaScript to the client. The layout, \`<main>\`, and all child pages remain Server Components with zero client-side cost.

## The Impact: Before and After

| Metric | Before (client layouts) | After (server layouts) |
|--------|------------------------|----------------------|
| Dashboard JS bundle | 156 KB | 42 KB |
| Hydration warnings | 12-15 per page load | 0 |
| Time to Interactive | 2.8s | 1.1s |
| Streaming support | Disabled | Enabled |

## The Rule

**Layouts should be Server Components unless every single element in the layout requires client-side interactivity.** In practice, this almost never happens. Extract the interactive pieces into child Client Components and keep the layout as a thin Server Component wrapper.

Run this audit:
\`\`\`bash
# Find all client layouts -- each one is a potential cascade infection
grep -r "use client" app/ --include="layout.tsx" -l
\`\`\`

If this returns any results, investigate whether the layout truly needs to be a Client Component or whether the interactive parts can be extracted.`,
  },
  // BATCH 5 - GAP-004: AI Session Management, GAP-006: 3-Axis Review System
  {
    id: "28",
    slug: "ai-session-management-quality-gates",
    title: "Working with AI Assistants: Session Management and Quality Gates",
    excerpt: "Lessons from 12 AI-assisted code review sessions: how to scope work, manage file operation budgets, recover from platform failures, and build quality gate systems that persist across sessions.",
    level: "advanced",
    category: "ai-tooling",
    readTime: "15 min",
    publishedAt: "2026-02-09",
    tags: ["ai-tooling", "session-management", "quality-gates", "code-review", "process", "v0", "lessons-learned"],
    hasRichContent: true,
    content: `Over 12 sessions building this documentation system with v0, we learned that AI coding assistants are powerful but require deliberate session management. Without it, you get cascading failures, lost files, and wasted hours. With it, you get predictable, high-quality output session after session.

## The Session Lifecycle

Every AI coding session has four phases:

### 1. Orientation (First 2 operations)
Read the project state and rules before touching any code. This sounds obvious but skipping it leads to duplicate work, wrong file edits, and architecture violations.

\`\`\`typescript
// Always start with:
// 1. Read /data/v0-rules.md (session protocol)
// 2. Read /data/project-state.ts (project orientation)
// Only THEN discuss the task with the user
\`\`\`

### 2. Scoping (Before any edits)
Estimate the file operations required. Compare against the session budget. If the task exceeds the budget, split it into multiple sessions BEFORE starting.

\`\`\`typescript
const SESSION_BUDGET = {
  max: 15,        // File operations (Write + Edit + Delete)
  warnAt: 12,     // Announce remaining budget
  hardStop: 20,   // Refuse further operations
}

// Task sizing guide:
// Small (1-5 ops):  Bug fix, label change, single component
// Medium (6-12 ops): New page, feature addition, nav restructure
// Large (13-20 ops): Multi-page refactor -- consider splitting
// Too Large (20+):   ALWAYS split across sessions
\`\`\`

### 3. Execution (Tracked operations)
Every file operation counts. Read operations are free but writes, edits, and deletes consume budget. Track mentally and announce at warning threshold.

### 4. Handoff (Last 2 operations)
Update the project state file and summarise what was done and what comes next. This is what makes the NEXT session productive -- without it, the next session starts blind.

## The File Operation Budget

Why budget at all? Because AI coding platforms have internal packaging systems (tar archives, incremental builds) that can corrupt when too many operations target the same files. We learned this the hard way when a session with 25+ operations caused a tarball duplicate entry error that deleted 5 files.

The budget is not about AI capability -- it's about platform reliability:

| Operations | Risk Level | Action |
|-----------|-----------|--------|
| 1-12 | Safe | Continue working |
| 12-15 | Warning | Complete current task, prepare to stop |
| 15-20 | High | Emergency only, run review before stopping |
| 20+ | Critical | STOP. Platform corruption risk. New session. |

## The Rules File Pattern

Store session-persistent rules in a file the AI reads at session start:

\`\`\`markdown
# /data/v0-rules.md

## Session Start Protocol
1. Read project-state.ts for orientation
2. Read code-review-log.ts for recent history
3. Confirm task with user
4. Estimate operations and confirm budget fit

## Architecture Rules
- Atomic Design: atoms > molecules > organisms > pages
- All forms use Zustand stores
- Validation uses Zod schemas
- Navigation defined in data/nav-data.ts

## Tarball Protection (CRITICAL)
If "Cannot open: File exists" appears: STOP IMMEDIATELY.
Do NOT delete or rewrite files. Start a new session.
\`\`\`

This file acts as institutional memory. Every session starts with the same knowledge, preventing the "I didn't know about that constraint" class of errors.

## The Project State Pattern

Unlike rules (which are static), the project state file captures dynamic information:

\`\`\`typescript
// /data/project-state.ts
export const ARCHITECTURE = {
  totalFiles: 299,
  totalPages: 58,
  framework: "Next.js 16",
}

export const REVIEW_HISTORY = {
  totalReviews: 12,
  lastReview: "review-010",
}
\`\`\`

This gives each session instant orientation: "This is a 299-file Next.js 16 project with 58 pages, 12 reviews completed, and these known issues."

## Recovery Protocols

When things go wrong (and they will), having documented recovery procedures saves hours:

1. **Tarball corruption:** Stop immediately. Don't touch files. New session resolves it.
2. **Wrong file edited:** Revert the edit in the same session. Don't cascade fixes.
3. **Session timeout:** Update project-state with progress so far. Resume in new session.
4. **Build failure:** Check error message. If it's a code error, fix it. If it's a platform error, new session.

## Key Takeaway

AI assistants are deterministic tools operating in non-deterministic environments. The session management patterns -- budgets, rules files, state files, recovery protocols -- transform unpredictable AI sessions into repeatable engineering processes. The overhead is minimal (4 operations per session for orientation and handoff) but the reliability improvement is dramatic.`,
  },
  {
    id: "29",
    slug: "three-axis-quality-review-system",
    title: "Automated Code Review: Building a 3-Axis Quality System",
    excerpt: "How we evolved from ad-hoc code review to a systematic 3-axis model covering code quality, security, and architecture. Includes the full checklist, severity classification, and lessons from 10 reviews.",
    level: "advanced",
    category: "best-practices",
    readTime: "16 min",
    publishedAt: "2026-02-09",
    tags: ["code-review", "quality", "security", "architecture", "process", "best-practices", "methodology"],
    hasRichContent: true,
    content: `After 10 code reviews of this project, we refined our review process from "check everything and hope for the best" to a structured 3-axis system. Each axis targets a different risk category, uses different tools, and catches different classes of defects.

## The 3-Axis Model

### Axis 1: Code Quality
**What it catches:** Technical debt, readability issues, type safety violations, dead code.

\`\`\`typescript
// Code Quality Checklist:
const CODE_QUALITY_CHECKS = [
  "No \`any\` types in new/modified files",
  "No console.log statements (except active debugging)",
  "No unused imports or dead code",
  "All icon imports resolve to valid lucide-react exports",
  "TypeScript strict mode compliance (no ts-ignore)",
  "Consistent naming conventions (camelCase, PascalCase)",
  "No functions over 50 lines (extract or refactor)",
  "No files over 400 lines (split into components)",
]
\`\`\`

**How we run it:** grep for \`any\`, \`console.log\`, unused imports. Check TypeScript strict mode. Review file sizes.

### Axis 2: Security
**What it catches:** XSS vectors, injection points, missing validation, exposed secrets.

\`\`\`typescript
const SECURITY_CHECKS = [
  "No dangerouslySetInnerHTML without sanitisation",
  "No eval() or new Function()",
  "No hardcoded secrets or API keys",
  "No unvalidated user input rendered directly",
  "Server actions use Zod validation",
  "Rate limiting on public endpoints",
  "CSRF protection on form submissions",
  "Security headers configured (CSP, HSTS, etc.)",
]
\`\`\`

**How we run it:** grep for dangerous patterns, audit server actions, check middleware configuration.

### Axis 3: Architecture
**What it catches:** Broken navigation, import resolution failures, stale labels, convention violations.

\`\`\`typescript
const ARCHITECTURE_CHECKS = [
  "All nav routes have corresponding page.tsx files",
  "All imports resolve (grep paths, verify targets exist)",
  "Labels match current nav structure (no stale names)",
  "New pages follow atomic design hierarchy",
  "Code examples in docs reflect current codebase",
  "No circular dependencies between modules",
  "'use server' files only export async functions",
  "Layouts are Server Components unless absolutely necessary",
]
\`\`\`

**How we run it:** cross-reference nav-data.ts with file system, verify import paths, audit 'use server' files.

## Severity Classification

Every finding gets a severity level that determines the response:

| Severity | Criteria | Response Time | Example |
|---------|---------|--------------|---------|
| Critical | Security vulnerability or data loss risk | Same session | Rate limiting bypass, exposed API keys |
| High | Architecture violation causing systemic issues | Next session | 'use server' exporting non-async values |
| Medium | Code quality issue affecting maintainability | Within 2 sessions | File over 800 lines, unused imports |
| Low | Style or convention inconsistency | When convenient | Naming convention deviation |

## The Review Process

### Step 1: Automated Scanning
Run grep-based checks for all three axes in parallel. This catches 60-70% of findings in minutes:

\`\`\`bash
# Axis 1: Code Quality
grep -r "any" --include="*.ts" --include="*.tsx" -l
grep -r "console.log" --include="*.ts" --include="*.tsx" -l

# Axis 2: Security
grep -r "dangerouslySetInnerHTML" --include="*.tsx" -l
grep -r "eval(" --include="*.ts" -l

# Axis 3: Architecture
# Cross-reference nav entries against file system
# Check 'use server' files for non-async exports
\`\`\`

### Step 2: Manual Deep Review
Focus on areas that automated scanning can't cover:
- Business logic correctness
- Component composition patterns
- Error handling completeness
- Performance implications of architectural choices

### Step 3: Finding Documentation
Every finding gets logged with: ID, severity, description, file location, and resolution status.

### Step 4: Resolution Sprint
Fix findings in severity order (critical first). Verify each fix individually -- never batch fixes without verification.

**Lesson from Review 6a:** We once tried to fix all findings in a single sprint without verifying between fixes. Three fixes introduced new bugs that weren't caught until the next review. Now we verify after every fix.

## Evolution Over 10 Reviews

| Review # | Focus | Key Finding | Process Change |
|----------|-------|-------------|---------------|
| 1 | Quality | 6 pages over 800 lines | Added file size check |
| 2 | Security | Rate limiting bypass | Added security axis |
| 3 | Architecture | 'use server' violations | Added export audit |
| 4 | Architecture | Client layouts causing hydration | Added layout audit |
| 5 | Quality | Duplicate provider instances | Added provider grep |
| 6 | All axes | Systemic boundary violations | Combined 3-axis model |
| 6a | Process | Sprint failure (unverified fixes) | Added per-fix verification |
| 7-8 | Content | Missing docs coverage | Added content gap tracking |
| 9 | Architecture | Nav reorganisation needed | Added nav-route cross-reference |
| 10 | Recovery | Tarball incident cleanup | Added platform constraint checks |

## Key Takeaway

The 3-axis model works because each axis is independently valuable and independently runnable. You don't need all three every time -- a small CSS change only needs Axis 1. A new server action needs Axes 1 and 2. A new page needs all three. Match the review depth to the change scope, and always verify fixes individually.`,
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug)
}

export function getArticlesByLevel(level: ArticleLevel): Article[] {
  return articles.filter((article) => article.level === level)
}

export function getArticlesByCategory(category: ArticleCategory): Article[] {
  return articles.filter((article) => article.category === category)
}

export function getAllArticleSlugs(): string[] {
  return articles.map((article) => article.slug)
}
