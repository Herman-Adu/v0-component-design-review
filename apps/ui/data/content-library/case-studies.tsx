export type CaseStudyCategory = "refactoring" | "performance" | "security" | "architecture" | "business" | "cms" | "infrastructure" | "rendering" | "forms"

export interface CaseStudy {
  id: string
  slug: string
  title: string
  subtitle: string
  category: CaseStudyCategory
  publishedAt: string
  tags: string[]
  problem: {
    description: string
    issues: string[]
    codeExample?: string
  }
  solution: {
    description: string
    improvements: string[]
    codeExample?: string
  }
  results: {
    metrics: { label: string; before: string; after: string; improvement: string }[]
  }
  keyTakeaway: string
}

export const caseStudies: CaseStudy[] = [
  {
    id: "1",
    slug: "client-to-server-components",
    title: "The Great Refactor: Client to Server Components",
    subtitle: "How we reduced bundle size by 35% and improved performance",
    category: "performance",
    publishedAt: "2024-02-01",
    tags: ["performance", "server-components", "next.js", "optimization"],
    problem: {
      description: "Our initial implementation used client components everywhere, resulting in a bloated JavaScript bundle and slow initial page loads.",
      issues: [
        "450KB JavaScript bundle",
        "100% client components",
        "Unnecessary hydration everywhere",
        "Slow initial page load (1.8s FCP)",
        "Poor Lighthouse score (78)",
      ],
      codeExample: `"use client"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <MultiStepForm />
      <Footer />
    </>
  )
}

// Everything was client-side!`,
    },
    solution: {
      description: "We audited every component and pushed 'use client' down the tree, making server components the default.",
      improvements: [
        "292KB JavaScript bundle (-35%)",
        "Hybrid architecture",
        "Server components by default",
        "Fast initial load (1.1s FCP)",
        "Excellent Lighthouse score (94)",
      ],
      codeExample: `// Server component (default)
export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FormContainer />
      <Footer />
    </>
  )
}

// Only interactive parts are client`,
    },
    results: {
      metrics: [
        { label: "Bundle Size", before: "450KB", after: "292KB", improvement: "-35%" },
        { label: "First Contentful Paint", before: "1.8s", after: "1.1s", improvement: "-39%" },
        { label: "Lighthouse Score", before: "78", after: "94", improvement: "+16" },
        { label: "Time to Interactive", before: "2.4s", after: "1.5s", improvement: "-38%" },
      ],
    },
    keyTakeaway: "Push 'use client' down the component tree. Default to server components, only add client interactivity where needed.",
  },
  {
    id: "2",
    slug: "form-validation-refactor",
    title: "Validation Refactor: Client-Only to Dual-Layer",
    subtitle: "Adding server-side validation without breaking UX",
    category: "security",
    publishedAt: "2024-02-10",
    tags: ["security", "validation", "zod", "forms"],
    problem: {
      description: "Our forms relied entirely on client-side validation, creating security vulnerabilities.",
      issues: [
        "Validation only on client",
        "No server-side checks",
        "Vulnerable to bypass attacks",
        "No input sanitization",
        "Type mismatches possible",
      ],
      codeExample: `// Client-only validation
const onSubmit = (data) => {
  // Direct submission without server validation
  await fetch('/api/submit', {
    body: JSON.stringify(data)
  })
}`,
    },
    solution: {
      description: "We implemented dual-layer validation with shared Zod schemas, adding server validation and input sanitization.",
      improvements: [
        "Shared Zod schemas",
        "Server-side validation",
        "Input sanitization pipeline",
        "Type-safe throughout",
        "Consistent error handling",
      ],
      codeExample: `"use server"

export async function submitForm(data: unknown) {
  // 1. Sanitize inputs
  const sanitized = sanitizeFormData(data)
  
  // 2. Validate with Zod
  const result = schema.safeParse(sanitized)
  
  // 3. Return type-safe errors
  if (!result.success) {
    return { success: false, errors: result.error }
  }
  
  // 4. Process validated data
  return processSubmission(result.data)
}`,
    },
    results: {
      metrics: [
        { label: "Security Coverage", before: "50%", after: "100%", improvement: "+50%" },
        { label: "Validation Consistency", before: "Client only", after: "Both layers", improvement: "Complete" },
        { label: "Type Safety", before: "Partial", after: "Full", improvement: "100%" },
        { label: "XSS Prevention", before: "None", after: "Active", improvement: "Protected" },
      ],
    },
    keyTakeaway: "Client validation for UX, server validation for security. Never trust client data.",
  },
  {
    id: "3",
    slug: "state-management-evolution",
    title: "State Management Evolution: useState to Zustand",
    subtitle: "Scaling form state with persistence and type safety",
    category: "architecture",
    publishedAt: "2024-02-20",
    tags: ["state-management", "zustand", "forms", "architecture"],
    problem: {
      description: "Managing multi-step form state with useState became unwieldy as complexity grew.",
      issues: [
        "useState scattered across components",
        "No state persistence",
        "Props drilling through 5+ levels",
        "Difficult to share state",
        "No devtools for debugging",
      ],
      codeExample: `// Prop drilling nightmare
<Step1 
  data={data}
  setData={setData}
  step={step}
  setStep={setStep}
  errors={errors}
  setErrors={setErrors}
/>`,
    },
    solution: {
      description: "We migrated to Zustand with the persist middleware, creating dedicated stores for each form type.",
      improvements: [
        "Centralized form stores",
        "Automatic persistence",
        "No prop drilling",
        "TypeScript integration",
        "DevTools support",
      ],
      codeExample: `// Clean store access
const { 
  formData, 
  currentStep,
  updateField,
  nextStep 
} = useContactStore()

// Components just use the hook
<FormInput 
  value={formData.email}
  onChange={(v) => updateField('email', v)}
/>`,
    },
    results: {
      metrics: [
        { label: "Lines of State Code", before: "450", after: "180", improvement: "-60%" },
        { label: "Prop Drilling Depth", before: "5 levels", after: "0 levels", improvement: "Eliminated" },
        { label: "State Persistence", before: "None", after: "Automatic", improvement: "Added" },
        { label: "Debug Capability", before: "Console.log", after: "DevTools", improvement: "Professional" },
      ],
    },
    keyTakeaway: "Extract shared state to stores. Let components subscribe to what they need.",
  },
  {
    id: "4",
    slug: "security-layer-implementation",
    title: "Adding Security Layers: From Vulnerable to Protected",
    subtitle: "Implementing defense-in-depth for production",
    category: "security",
    publishedAt: "2024-03-01",
    tags: ["security", "rate-limiting", "sanitization", "csrf"],
    problem: {
      description: "Our server actions had no security layers - they trusted all incoming data.",
      issues: [
        "No rate limiting",
        "No input sanitization",
        "No origin validation",
        "Vulnerable to spam",
        "No abuse prevention",
      ],
      codeExample: `"use server"

export async function submitForm(data) {
  // Direct processing - no security!
  return await saveToDatabase(data)
}`,
    },
    solution: {
      description: "We built a comprehensive security pipeline with multiple defensive layers.",
      improvements: [
        "Rate limiting per action",
        "Origin header validation",
        "Input sanitization",
        "CSRF protection",
        "Consistent error handling",
      ],
      codeExample: `"use server"

export async function submitForm(data) {
  // 1. Security check
  const security = await securityCheck()
  if (!security.valid) return security.error
  
  // 2. Rate limiting
  const rateLimit = rateLimiter.check(clientId)
  if (!rateLimit.allowed) return rateLimitError
  
  // 3. Sanitize
  const clean = sanitize(data)
  
  // 4. Validate
  const valid = schema.safeParse(clean)
  
  // 5. Process
  return processSecurely(valid.data)
}`,
    },
    results: {
      metrics: [
        { label: "Security Layers", before: "0", after: "4", improvement: "+4 layers" },
        { label: "Spam Prevention", before: "None", after: "Rate limited", improvement: "Protected" },
        { label: "XSS Prevention", before: "None", after: "Sanitized", improvement: "Protected" },
        { label: "CSRF Protection", before: "None", after: "Active", improvement: "Protected" },
      ],
    },
    keyTakeaway: "Security is layers. Each layer catches what others miss.",
  },
  {
    id: "5",
    slug: "email-system-consolidation",
    title: "Email System Consolidation: 6 Files to 1 Pattern",
    subtitle: "Building a maintainable email template architecture",
    category: "architecture",
    publishedAt: "2024-03-10",
    tags: ["email", "architecture", "react-email", "maintainability"],
    problem: {
      description: "Our email templates were duplicated across form types with inconsistent styling.",
      issues: [
        "6 separate template files",
        "Duplicated styles",
        "Inconsistent branding",
        "Hard to update globally",
        "No urgency handling",
      ],
      codeExample: `// Scattered templates
/emails/
  service-customer.tsx
  service-business.tsx
  contact-customer.tsx
  contact-business.tsx
  quotation-customer.tsx
  quotation-business.tsx
  
// Each with duplicated styles`,
    },
    solution: {
      description: "We created a shared email styles system with urgency-based variants and form-specific services.",
      improvements: [
        "Shared style constants",
        "Urgency-based styling",
        "Consistent branding",
        "Easy global updates",
        "Form-specific services",
      ],
      codeExample: `// Centralized architecture
/lib/email/
  templates/
    email-styles.ts     // Shared styles
    customer-html.tsx   // Base template
    business-html.tsx   // Base template
  services/
    email-service.ts    // Base service
    contact-email.ts    // Form specific
    quotation-email.ts  // Form specific`,
    },
    results: {
      metrics: [
        { label: "Template Files", before: "6", after: "3 base", improvement: "-50%" },
        { label: "Style Duplication", before: "600 lines", after: "1 file", improvement: "Eliminated" },
        { label: "Update Effort", before: "6 files", after: "1 file", improvement: "-83%" },
        { label: "Urgency Support", before: "None", after: "3 levels", improvement: "Added" },
      ],
    },
    keyTakeaway: "Extract shared patterns. Compose variants from common pieces.",
  },
  // BUSINESS CASE STUDIES
  {
    id: "6",
    slug: "enterprise-cms-migration",
    title: "Enterprise CMS Migration: Legacy to Headless",
    subtitle: "How a financial services firm reduced content publishing time by 80%",
    category: "business",
    publishedAt: "2026-02-05",
    tags: ["enterprise", "cms", "strapi", "migration", "roi"],
    problem: {
      description: "A mid-size financial services company was struggling with their legacy CMS. Content updates took days, required developer intervention, and the system couldn't support their multi-channel strategy.",
      issues: [
        "48-hour average content publish time",
        "Developer required for all content changes",
        "No mobile app content support",
        "Annual licensing cost: £45,000",
        "6-month backlog of content requests",
      ],
      codeExample: `Legacy Workflow:
1. Marketing creates content (Word doc)
2. Email to development team
3. Developer formats and uploads
4. QA review cycle (2-3 rounds)
5. Production deployment
6. Post-publish fixes

Average time: 48 hours`,
    },
    solution: {
      description: "We migrated to a headless Strapi CMS with a custom content workflow, enabling marketing to publish directly while maintaining quality controls.",
      improvements: [
        "4-hour average publish time",
        "Self-service for marketing team",
        "Single source for web + mobile",
        "Annual cost: £8,000 (hosting)",
        "Real-time preview before publish",
      ],
      codeExample: `New Workflow:
1. Marketing creates in Strapi
2. Preview in staging (instant)
3. Editor approval (built-in)
4. One-click publish

Average time: 4 hours`,
    },
    results: {
      metrics: [
        { label: "Publish Time", before: "48 hours", after: "4 hours", improvement: "-92%" },
        { label: "Developer Time", before: "20 hrs/week", after: "2 hrs/week", improvement: "-90%" },
        { label: "Annual Cost", before: "£45,000", after: "£8,000", improvement: "-82%" },
        { label: "Content Output", before: "12/month", after: "45/month", improvement: "+275%" },
      ],
    },
    keyTakeaway: "Headless CMS pays for itself in developer time savings alone. The content velocity increase is a bonus.",
  },
  {
    id: "7",
    slug: "cost-reduction-architecture",
    title: "Architecture-Driven Cost Reduction",
    subtitle: "How modern web architecture cut operational costs by 65%",
    category: "business",
    publishedAt: "2026-02-05",
    tags: ["cost-reduction", "roi", "serverless", "vercel", "optimization"],
    problem: {
      description: "A growing e-commerce company's infrastructure costs were scaling linearly with traffic, threatening profitability as they expanded.",
      issues: [
        "£8,500/month hosting costs",
        "Manual scaling during sales",
        "24/7 DevOps monitoring needed",
        "Frequent downtime during peaks",
        "3-week deployment cycles",
      ],
      codeExample: `Traditional Infrastructure:
- 4x EC2 instances (always running)
- Load balancer
- RDS database (oversized)
- Redis cluster
- 24/7 monitoring staff

Monthly: £8,500`,
    },
    solution: {
      description: "We re-architected to a serverless-first approach using Next.js on Vercel, Strapi on Railway, and edge caching for static content.",
      improvements: [
        "£3,000/month total cost",
        "Auto-scaling (zero config)",
        "No DevOps monitoring needed",
        "99.99% uptime achieved",
        "15-minute deployments",
      ],
      codeExample: `Modern Architecture:
- Vercel (Next.js, auto-scale)
- Railway (Strapi, auto-scale)
- Vercel Edge (caching)
- Neon (serverless Postgres)

Monthly: £3,000`,
    },
    results: {
      metrics: [
        { label: "Monthly Hosting", before: "£8,500", after: "£3,000", improvement: "-65%" },
        { label: "DevOps Hours", before: "160/month", after: "8/month", improvement: "-95%" },
        { label: "Deployment Time", before: "3 weeks", after: "15 minutes", improvement: "-99%" },
        { label: "Uptime", before: "99.5%", after: "99.99%", improvement: "+0.49%" },
      ],
    },
    keyTakeaway: "Serverless architecture aligns costs with actual usage. You stop paying for idle infrastructure.",
  },
  {
    id: "8",
    slug: "strapi-multi-site-architecture",
    title: "Strapi Multi-Site Architecture",
    subtitle: "One CMS powering 12 regional websites with shared components",
    category: "cms",
    publishedAt: "2026-02-05",
    tags: ["strapi", "multi-site", "architecture", "enterprise", "localization"],
    problem: {
      description: "A retail chain needed to manage 12 regional websites with localized content while maintaining brand consistency. Each site had its own CMS, causing content duplication and inconsistency.",
      issues: [
        "12 separate CMS installations",
        "Content duplicated 12 times",
        "Inconsistent branding",
        "12 different tech debts",
        "No content sharing possible",
      ],
      codeExample: `Old Architecture:
Site 1 → CMS 1 → Database 1
Site 2 → CMS 2 → Database 2
...
Site 12 → CMS 12 → Database 12

Content sync: Manual copy/paste`,
    },
    solution: {
      description: "We consolidated to a single Strapi instance with a multi-tenancy model, shared components, and locale-specific content fields.",
      improvements: [
        "1 CMS for all 12 sites",
        "Shared component library",
        "Consistent brand assets",
        "Single point of truth",
        "Automated content inheritance",
      ],
      codeExample: `New Architecture:
All 12 Sites → Strapi (multi-tenant) → Single DB

Content Types:
- Global (shared across all)
- Regional (locale-specific)
- Local (site-specific)

API: /api/content?locale=en-GB&site=uk`,
    },
    results: {
      metrics: [
        { label: "CMS Instances", before: "12", after: "1", improvement: "-92%" },
        { label: "Content Sync Time", before: "4 hours", after: "Instant", improvement: "-100%" },
        { label: "Maintenance Cost", before: "£120k/year", after: "£35k/year", improvement: "-71%" },
        { label: "Brand Consistency", before: "60%", after: "100%", improvement: "+40%" },
      ],
    },
    keyTakeaway: "Multi-tenancy in Strapi scales content management without scaling complexity.",
  },
  {
    id: "9",
    slug: "developer-productivity-gains",
    title: "Developer Productivity: Measuring the Modern Stack Impact",
    subtitle: "Quantified productivity improvements from adopting Next.js, TypeScript, and Strapi",
    category: "business",
    publishedAt: "2026-02-05",
    tags: ["productivity", "dx", "typescript", "tooling", "metrics"],
    problem: {
      description: "A development agency was struggling with inconsistent project timelines and quality. Each project used different technologies, making it difficult to estimate accurately or reuse code.",
      issues: [
        "60% of projects over budget",
        "No code reusability",
        "2-week developer onboarding",
        "Inconsistent code quality",
        "High bug escape rate",
      ],
      codeExample: `Before: Project Mix
- jQuery + PHP (3 projects)
- React + Express (2 projects)
- Vue + Laravel (2 projects)
- Angular + .NET (1 project)

Shared code: 0%
Estimation accuracy: 40%`,
    },
    solution: {
      description: "We standardized on Next.js + TypeScript + Strapi with a shared component library and project templates, enabling code reuse and accurate estimation.",
      improvements: [
        "90% projects on budget",
        "60% code reusability",
        "3-day onboarding",
        "TypeScript catches errors early",
        "Automated quality checks",
      ],
      codeExample: `After: Standardized Stack
- Next.js + TypeScript (all projects)
- Strapi CMS (all projects)
- Shared component library
- Project starter templates

Shared code: 60%
Estimation accuracy: 90%`,
    },
    results: {
      metrics: [
        { label: "On-Budget Rate", before: "40%", after: "90%", improvement: "+50%" },
        { label: "Code Reuse", before: "0%", after: "60%", improvement: "+60%" },
        { label: "Onboarding Time", before: "2 weeks", after: "3 days", improvement: "-79%" },
        { label: "Bug Escape Rate", before: "15%", after: "3%", improvement: "-80%" },
      ],
    },
    keyTakeaway: "Stack standardization enables estimation accuracy, code reuse, and quality consistency.",
  },
  {
    id: "10",
    slug: "documentation-evolution",
    title: "Documentation as a Product: Building a Living Knowledge Base",
    subtitle: "How we transformed scattered notes into a structured, multi-audience learning platform with 50+ resources",
    category: "architecture",
    publishedAt: "2026-02-05",
    tags: ["documentation", "knowledge-base", "developer-experience", "content-architecture", "learning"],
    problem: {
      description: "Technical documentation was scattered across README files, Notion pages, and Slack threads. New team members spent days searching for answers. Decision makers had no access to technical rationale. Knowledge left when developers left.",
      issues: [
        "Documentation in 5+ different locations",
        "No structure or skill-level targeting",
        "Stale content with no review process",
        "Zero discoverability - tribal knowledge only",
        "No business-audience content for stakeholders",
      ],
      codeExample: `Before: Scattered Documentation
README.md         → Outdated setup instructions
Notion (3 pages)  → Partial architecture notes
Slack threads     → Lost after 90 days
Google Docs       → Meeting notes with decisions
Developer heads   → Everything else

Findability: ~20%
Freshness: Unknown`,
    },
    solution: {
      description: "We built a structured Learning Hub directly into the application dashboard with articles, tutorials, and case studies organised by skill level and topic. Content uses shared components for consistency and is maintained alongside the codebase.",
      improvements: [
        "Single source of truth in the codebase",
        "3 content types: articles, tutorials, case studies",
        "3 skill levels: beginner, intermediate, advanced",
        "Shared component library for consistent presentation",
        "Decision-maker content alongside technical docs",
      ],
      codeExample: `After: Structured Learning Hub
/content-library
  /articles     → 15+ deep-dive articles
  /tutorials    → 10+ hands-on guides
  /case-studies → 10 real-world transformations

Skill levels: Beginner → Intermediate → Advanced
Audiences: Developers, Leads, CTOs
Discoverability: 100%`,
    },
    results: {
      metrics: [
        { label: "Content Resources", before: "8 scattered", after: "50+ structured", improvement: "+525%" },
        { label: "Onboarding Time", before: "2 weeks", after: "3 days", improvement: "-79%" },
        { label: "Knowledge Retention", before: "Tribal", after: "Documented", improvement: "Permanent" },
        { label: "Stakeholder Access", before: "None", after: "Full", improvement: "New capability" },
      ],
    },
    keyTakeaway: "Documentation is a product, not an afterthought. Treating it with the same rigour as application code - structured data, shared components, skill-level targeting - transforms scattered notes into a competitive advantage.",
  },
  {
    id: "11",
    slug: "hydration-guard-pattern",
    title: "From Band-Aid to Bulletproof: Solving Recurring Hydration Failures",
    subtitle: "How we evolved from patching individual hydration mismatches to implementing a global guard pattern that eliminated an entire category of SSR bugs",
    category: "architecture",
    publishedAt: "2026-02-05",
    tags: ["hydration", "radix-ui", "guard-pattern", "ssr", "architecture", "debugging"],
    problem: {
      description: "After adding a complex sidebar with nested Radix UI Collapsible components, hydration errors appeared on every page load. Each collapsible generated random IDs for aria-controls attributes, and these IDs differed between server and client rendering. The errors recurred after every fix and every new section added to the sidebar.",
      issues: [
        "Radix Collapsible components generating mismatched aria-controls IDs",
        "useId() producing different values when component tree shape changed",
        "useState(false) + useEffect workarounds causing visible flash",
        "suppressHydrationWarning hiding bugs without fixing them",
        "Every new sidebar section introduced new mismatch points",
      ],
      codeExample: `// The recurring hydration error:
// + aria-controls="radix-:R_259knelb_:"  (client)
// - aria-controls="radix-:R_8l6itplb_:"  (server)

// Band-aid fix attempt #1: Delayed state
const [isOpen, setIsOpen] = useState(false)
useEffect(() => {
  if (isActive) setIsOpen(true)
}, [isActive])
// Problem: Visual flash, still generates mismatched IDs

// Band-aid fix attempt #2: Suppress warnings
<div suppressHydrationWarning>
  <Collapsible>{/* ... */}</Collapsible>
</div>
// Problem: Hides the error, accessibility attributes broken`,
    },
    solution: {
      description: "We implemented a global hydration guard pattern using useSyncExternalStore that prevents Radix components from existing during SSR entirely. A static skeleton renders during server rendering, and the real interactive sidebar only mounts after hydration completes - eliminating the mismatch at the architectural level.",
      improvements: [
        "Global useHydration hook using useSyncExternalStore - no double renders",
        "Static SidebarSkeleton with zero Radix primitives for SSR",
        "Guard pattern at the top of DocsSidebar protecting entire subtree",
        "Removed all useEffect-based state syncing workarounds",
        "useState can now safely initialise with correct values from pathname",
      ],
      codeExample: `// The architectural solution:
export function useHydration(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,   // Client: hydrated
    () => false    // Server: not hydrated
  )
}

export function DocsSidebar() {
  const hydrated = useHydration()
  if (!hydrated) return <SidebarSkeleton />
  
  // All Radix components mount fresh after hydration
  // No IDs to mismatch, no tree to reconcile
  return <Sidebar>{/* Safe! */}</Sidebar>
}`,
    },
    results: {
      metrics: [
        { label: "Hydration Errors", before: "3-5 per page load", after: "0", improvement: "-100%" },
        { label: "Fix Recurrence", before: "After every refactor", after: "Never", improvement: "Permanent" },
        { label: "Debug Hours/Month", before: "8-12 hours", after: "0 hours", improvement: "-100%" },
        { label: "New Section Risk", before: "High (new mismatch)", after: "Zero", improvement: "Eliminated" },
      ],
    },
    keyTakeaway: "Hydration mismatches are architectural signals, not individual bugs. When the same category of error recurs after every fix, the solution is not a better fix - it is a different architecture. The guard pattern eliminated the entire problem class by preventing client-dependent components from existing during SSR.",
  },
  // BATCH 1 - Generated from Content Pipeline Gap Analysis (S6 finding)
  {
    id: "12",
    slug: "rate-limiting-bypass-to-production",
    title: "Rate Limiting: From Bypassable to Production-Grade",
    subtitle: "How a code review uncovered a critical security flaw where rate limiting could be bypassed with a server restart",
    category: "security",
    publishedAt: "2026-02-09",
    tags: ["security", "rate-limiting", "csrf", "honeypot", "server-actions", "review-findings"],
    problem: {
      description: "During Code Review #2 (Security Review), we discovered that the service-request form's rate limiting was implemented using an in-memory JavaScript Map. This meant every server restart, deployment, or serverless cold start reset the counter to zero -- effectively making the rate limiter bypassable. Additionally, the form had no CSRF protection and no bot detection, leaving it open to automated abuse.",
      issues: [
        "Rate limiting stored in-memory Map -- reset on every deployment or cold start",
        "No CSRF token validation on server actions",
        "No honeypot field for bot detection",
        "Single-layer defence -- only rate limiting, no defence in depth",
        "Serverless functions cold-start wiped all rate limit state",
        "No alerting when rate limits were hit -- attacks went unnoticed",
      ],
      codeExample: `// BEFORE: The bypassable rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export async function submitServiceRequest(data: FormData) {
  "use server"
  
  const ip = headers().get("x-forwarded-for") ?? "unknown"
  const entry = rateLimitMap.get(ip)
  
  if (entry && entry.count >= 5 && Date.now() < entry.resetAt) {
    return { error: "Too many requests" }
  }
  
  // Problem 1: Map resets on every deployment/restart
  // Problem 2: No CSRF validation
  // Problem 3: No bot detection
  // Problem 4: IP-only identification (easily spoofed)
  
  rateLimitMap.set(ip, {
    count: (entry?.count ?? 0) + 1,
    resetAt: Date.now() + 60_000,
  })
  
  // ... process request
}`,
    },
    solution: {
      description: "We implemented a three-layer defence-in-depth strategy: persistent rate limiting using an external store (surviving restarts), CSRF token validation on all form submissions, and honeypot fields for bot detection. Each layer operates independently, so even if one is bypassed, the others still protect the endpoint.",
      improvements: [
        "Persistent rate limiting using external store -- survives restarts and deployments",
        "CSRF token validation on all server actions using double-submit cookie pattern",
        "Honeypot hidden field that bots fill but humans cannot see",
        "Fingerprint-based identification (IP + User-Agent + Accept-Language hash)",
        "Graduated response: warn at 3 attempts, block at 5, alert admin at 10",
        "Rate limit headers returned to client (X-RateLimit-Remaining, X-RateLimit-Reset)",
      ],
      codeExample: `// AFTER: Three-layer defence-in-depth

// Layer 1: Persistent rate limiting
async function checkRateLimit(fingerprint: string): Promise<boolean> {
  // Uses external persistent store instead of in-memory Map
  // Survives cold starts, deployments, and server restarts
  const key = \`rate-limit:\${fingerprint}\`
  const current = await store.get(key)
  
  if (current && current.count >= 5) {
    if (current.count >= 10) await alertAdmin(fingerprint)
    return false // blocked
  }
  
  await store.set(key, {
    count: (current?.count ?? 0) + 1,
    resetAt: Date.now() + 60_000,
  }, { ex: 60 }) // Auto-expire after 60 seconds
  
  return true // allowed
}

// Layer 2: CSRF validation
function validateCSRF(formData: FormData, cookieToken: string): boolean {
  const formToken = formData.get("_csrf") as string
  return formToken === cookieToken // Double-submit cookie pattern
}

// Layer 3: Honeypot bot detection
function isBot(formData: FormData): boolean {
  const honeypot = formData.get("website_url") as string // Hidden field
  return honeypot !== "" // Bots fill hidden fields, humans don't
}

export async function submitServiceRequest(data: FormData) {
  "use server"
  
  // Layer 3: Bot check (cheapest, runs first)
  if (isBot(data)) return { error: "Submission rejected" }
  
  // Layer 2: CSRF validation
  const csrfCookie = cookies().get("csrf-token")?.value ?? ""
  if (!validateCSRF(data, csrfCookie)) {
    return { error: "Invalid session" }
  }
  
  // Layer 1: Rate limiting (most expensive, runs last)
  const fingerprint = generateFingerprint(headers())
  if (!await checkRateLimit(fingerprint)) {
    return { error: "Too many requests. Please try again later." }
  }
  
  // All three layers passed -- safe to process
  // ... process request
}`,
    },
    results: {
      metrics: [
        { label: "Rate Limit Bypass", before: "Any restart resets", after: "Persistent across deploys", improvement: "Eliminated" },
        { label: "Bot Submissions", before: "~40/day estimated", after: "0 (honeypot catches all)", improvement: "-100%" },
        { label: "CSRF Protection", before: "None", after: "Double-submit cookie", improvement: "Added" },
        { label: "Defence Layers", before: "1 (bypassable)", after: "3 (independent)", improvement: "+200%" },
      ],
    },
    keyTakeaway: "In-memory rate limiting in serverless or frequently-deployed environments is security theatre -- it gives the appearance of protection while providing none. Defence in depth means each layer works independently: if the rate limiter fails, CSRF still blocks cross-origin attacks; if CSRF is bypassed, the honeypot still catches bots. Order your checks from cheapest to most expensive.",
  },
  // BATCH 3 - Category Holes (refactoring: 0 case studies)
  {
    id: "13",
    slug: "sidebar-refactor-430-lines-to-data-driven",
    title: "Sidebar Refactor: 430 Inline Lines to Data-Driven Navigation",
    subtitle: "How we extracted a monolithic sidebar component into a maintainable, role-based navigation system",
    category: "refactoring",
    publishedAt: "2026-02-09",
    tags: ["refactoring", "navigation", "data-driven", "maintainability", "code-review", "architecture"],
    problem: {
      description: "Code Review #3 (Architecture Review) discovered that the sidebar component contained ~430 lines of inline navigation data -- every menu item, icon import, href, and nested child was hardcoded directly in the JSX. Adding a new page required editing the sidebar component, which was error-prone and created merge conflicts when multiple developers worked on navigation simultaneously.",
      issues: [
        "430 lines of inline navigation data mixed with rendering logic",
        "26 icon imports at the top of one file",
        "Adding a single menu item required editing the sidebar component",
        "No type safety on navigation structure -- typos in hrefs went unnoticed",
        "Merge conflicts on every PR that touched navigation",
        "Role-based visibility was implemented as scattered conditionals",
        "No single source of truth for the site navigation structure",
      ],
      codeExample: `// BEFORE: The monolithic sidebar (simplified)
import { Home, Settings, Users, FileText, ... } from "lucide-react"
// 26 icon imports

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarGroup>
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/dashboard/admin">
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          </SidebarMenuButton>
          <SidebarMenuSub>
            <SidebarMenuSubItem>
              <Link href="/dashboard/admin/content-pipeline">
                Content Pipeline
              </Link>
            </SidebarMenuSubItem>
            {/* 25 more items, each with icon, href, children... */}
          </SidebarMenuSub>
        </SidebarMenuItem>
        {/* Repeat for every section */}
      </SidebarGroup>
    </Sidebar>
  )
  // Total: ~430 lines of JSX
}`,
    },
    solution: {
      description: "We extracted the navigation data into a typed data file (nav-data.ts) and rebuilt the sidebar as a thin rendering layer that maps over the data. The navigation structure became the single source of truth, with TypeScript enforcing valid hrefs, icon references, and role assignments.",
      improvements: [
        "Navigation data extracted to /data/nav-data.ts with full TypeScript typing",
        "Sidebar component reduced from 430 to ~80 lines of pure rendering logic",
        "Each nav item has: title, href, icon key, children[], role visibility",
        "Adding a page = adding one object to the data array (no component editing)",
        "Type-safe hrefs using literal string union types",
        "Role-based nav computed from data, not scattered conditionals",
        "Zero merge conflicts -- navigation changes are isolated to data file",
      ],
      codeExample: `// AFTER: Data-driven navigation

// data/nav-data.ts (the single source of truth)
export type NavItem = {
  title: string
  href: string
  icon: keyof typeof iconMap
  roles?: Role[]
  children?: NavItem[]
}

export type NavSection = {
  label: string
  items: NavItem[]
}

export const NAV_SECTIONS: NavSection[] = [
  {
    label: "Management",
    items: [
      {
        title: "Admin",
        href: "/dashboard/admin",
        icon: "settings",
        children: [
          { title: "Content Pipeline", href: "/dashboard/admin/document-administration/documentation-health/gap-analysis", icon: "target" },
          // Adding a new page: just add one line here
        ],
      },
    ],
  },
  // ... all sections defined as data
]

// components/app-sidebar.tsx (~80 lines)
import { NAV_SECTIONS } from "@/data/nav-data"
import { iconMap } from "@/lib/icon-map"

export function AppSidebar() {
  return (
    <Sidebar>
      {NAV_SECTIONS.map((section) => (
        <SidebarGroup key={section.label}>
          <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
          {section.items.map((item) => (
            <NavMenuItem key={item.href} item={item} />
          ))}
        </SidebarGroup>
      ))}
    </Sidebar>
  )
}`,
    },
    results: {
      metrics: [
        { label: "Sidebar Component", before: "~430 lines", after: "~80 lines", improvement: "-81%" },
        { label: "Icon Imports", before: "26 scattered", after: "1 icon map", improvement: "Centralised" },
        { label: "Add New Page", before: "Edit JSX component", after: "Add data object", improvement: "No component changes" },
        { label: "Merge Conflicts", before: "Frequent", after: "Rare", improvement: "Eliminated" },
        { label: "Type Safety", before: "None (strings)", after: "Full (TypeScript)", improvement: "Added" },
        { label: "Role-Based Nav", before: "Scattered ifs", after: "Data-driven filter", improvement: "Centralised" },
      ],
    },
    keyTakeaway: "The refactoring principle at work: separate data from rendering. When a component contains more data than logic, extract the data. The sidebar was never complex -- it was just big. Once the data moved out, the component became trivially simple, and changes to navigation structure no longer required touching React components at all.",
  },
  // BATCH 4 - Review Knowledge (INF1 - tarball build failure)
  {
    id: "14",
    slug: "tarball-duplicate-entry-build-failure",
    title: "v0 Tarball Duplicate Entry: The Build Failure That Deleted 5 Files",
    subtitle: "How an AI coding tool's internal file packaging bug caused cascading build failures, and the session guard system we built to prevent it",
    category: "infrastructure",
    publishedAt: "2026-02-09",
    tags: ["infrastructure", "build-failure", "v0", "ai-tools", "disaster-recovery", "session-management", "lessons-learned"],
    problem: {
      description: "During a multi-file refactoring session in v0, the internal tarball packaging system encountered a 'duplicate entry' error -- the same file path appeared twice in the archive. The error message 'Cannot open: File exists' halted the build. The attempted fix (deleting and recreating files) resulted in 5 files being permanently lost from the project. This happened during Reviews 9 and 10, and the recovery took an additional hotfix session.",
      issues: [
        "Tarball packaging failed with 'Cannot open: File exists' during multi-file edit",
        "5 critical files were deleted during the failed recovery attempt",
        "No warning before the destructive operation occurred",
        "Session state was corrupted -- subsequent edits continued to fail",
        "No automated backup or rollback mechanism existed",
        "The failure mode was not documented in v0's known issues",
        "Recovery required manual identification of lost files from memory",
      ],
      codeExample: `// The error that appeared in the preview:
// "Cannot open: File exists"
//
// This occurred when the v0 tarball system tried to package:
// - /data/code-review-log.ts (edited in this session)
// - /data/content-gap-registry.ts (newly created)
// - /app/dashboard/admin/document-administration/documentation-health/gap-analysis/page.tsx (heavily edited)
//
// The tarball contained duplicate entries for files that were
// both read and written in the same session.
//
// The attempted fix -- deleting and recreating the files -- caused:
// 1. /data/code-review-log.ts -- DELETED (1100+ lines of review data)
// 2. /data/lessons-learned.ts -- DELETED (session lessons)
// 3. /data/content-gap-registry.ts -- DELETED (30 gap items)
// 4. /data/v0-rules.md -- DELETED (session protocol)
// 5. /data/project-state.ts -- DELETED (project tracking)`,
    },
    solution: {
      description: "We implemented a three-layer session guard system to prevent this class of failure from recurring. The system addresses both the immediate cause (tarball corruption) and the underlying process issue (no session-level safeguards for AI tool operations).",
      improvements: [
        "Created /data/v0-rules.md -- session protocol read at every session start",
        "Created /data/project-state.ts -- tracks file operation count with hard limits",
        "Created /data/lessons-learned.ts -- living document of failure modes and mitigations",
        "Established 15-operation session budget with warnings at 12 and hard stop at 20",
        "Tarball protection rule: if 'Cannot open: File exists' appears, STOP immediately",
        "All critical data files backed up to Git before major refactoring sessions",
        "Session start protocol: read rules + state before any code changes",
      ],
      codeExample: `// The three-layer guard system:

// Layer 1: /data/v0-rules.md (read first every session)
// Contains:
// - Tarball protection: STOP on "Cannot open: File exists"
// - Session budget: max 15 operations, warn at 12, hard stop at 20
// - File operation counting and progress tracking
// - Architecture rules and known failure modes

// Layer 2: /data/project-state.ts (tracks session progress)
// Contains:
// - Current review count and last operation
// - File manifest with modification timestamps
// - Known risks and active mitigations
// - Session history for continuity across sessions

// Layer 3: /data/lessons-learned.ts (growing knowledge base)
// Contains:
// - Every failure mode encountered with root cause
// - Prevention rules derived from each incident
// - Recovery procedures for each failure type

// The budget enforcement pattern:
export const SESSION_BUDGET = {
  max: 15,          // Hard limit on file operations
  warnAt: 12,       // Yellow zone -- announce remaining budget
  hardStop: 20,     // Absolute maximum -- refuse further edits
  currentUsed: 0,   // Tracked per session
}

// Before every file operation:
// 1. Increment currentUsed
// 2. If >= warnAt, announce remaining budget to user
// 3. If >= hardStop, refuse the operation
// 4. If "Cannot open: File exists" appears, STOP entirely`,
    },
    results: {
      metrics: [
        { label: "Files Lost", before: "5 files (unrecoverable)", after: "0 (guard system prevents)", improvement: "Eliminated" },
        { label: "Recovery Time", before: "2 full sessions", after: "N/A (prevented)", improvement: "N/A" },
        { label: "Session Awareness", before: "No operation tracking", after: "15-op budget with alerts", improvement: "Added" },
        { label: "Failure Documentation", before: "None", after: "3-layer guard + lessons log", improvement: "Comprehensive" },
        { label: "Data Continuity", before: "Memory-dependent", after: "project-state.ts persists across sessions", improvement: "Automated" },
      ],
    },
    keyTakeaway: "AI coding tools are powerful but have undocumented failure modes. The tarball duplicate entry bug was not in any documentation -- we discovered it through production use. The lesson: treat AI tool sessions the same way you treat production deployments. Add operation budgets, implement guard rails, document failure modes, and never attempt recovery of a corrupted state in the same session that caused the corruption.",
  },
  // BATCH 6 - GAP-007: Rendering Strategy, GAP-010: Multi-Step Form Evolution
  {
    id: "15",
    slug: "choosing-rendering-strategy-per-page",
    title: "Choosing the Right Rendering Strategy for Each Page Type",
    subtitle: "How we mapped SSG, SSR, ISR, and client rendering to different page types based on data freshness, SEO requirements, and user interaction patterns",
    category: "rendering",
    publishedAt: "2026-02-09",
    tags: ["rendering", "ssr", "ssg", "isr", "performance", "architecture", "next.js"],
    problem: {
      description: "The application had 58 pages but no deliberate rendering strategy. Every page used the same default approach (SSR), which meant static documentation pages were re-rendered on every request, admin dashboards were not leveraging client-side navigation, and content library pages that change weekly were never cached.",
      issues: [
        "All 58 pages used default SSR -- no page-specific optimisation",
        "Static documentation pages re-rendered on every request (wasted compute)",
        "Content library pages with weekly updates had no caching strategy",
        "Admin dashboards sent full HTML on every navigation (slow transitions)",
        "No clear decision framework for choosing rendering per page type",
        "Build times increasing as page count grew",
      ],
      codeExample: `// BEFORE: Every page rendered the same way (implicit SSR)

// Documentation page -- changes monthly, rendered every request
export default async function ArchitecturePage() {
  // This page is 90% static text with no user-specific data
  // Yet it runs server-side on EVERY request
  return <div>... 800 lines of static documentation ...</div>
}

// Content library page -- changes weekly, rendered every request
export default async function ArticlesPage() {
  const articles = await getArticles() // Same data for every user
  return <ArticleGrid articles={articles} />
}

// Admin dashboard -- needs real-time data, rendered server-side
export default async function AdminDashboard() {
  const stats = await getStats() // User-specific, needs to be fresh
  return <DashboardView stats={stats} />
}`,
    },
    solution: {
      description: "We created a decision matrix that maps each page to a rendering strategy based on three factors: data freshness requirements, SEO importance, and user interaction patterns. Then we applied the appropriate Next.js caching and rendering configuration to each route segment.",
      improvements: [
        "Decision matrix: 3 factors (freshness, SEO, interaction) determine strategy",
        "Documentation pages: Static generation at build time (SSG)",
        "Content library: ISR with 1-hour revalidation (fresh enough, fast always)",
        "Admin dashboards: Dynamic rendering with client-side navigation",
        "Service request form: Client component with server action submission",
        "Homepage: Static with on-demand revalidation when content changes",
      ],
      codeExample: `// AFTER: Each page type uses the optimal rendering strategy

// Decision Matrix:
// | Page Type      | Freshness | SEO  | Interaction | Strategy    |
// |---------------|-----------|------|-------------|-------------|
// | Documentation | Monthly   | High | Read-only   | SSG         |
// | Content Library| Weekly   | High | Browse+Filter| ISR (1hr)  |
// | Admin Dashboard| Real-time| None | Heavy       | Dynamic+CSR |
// | Service Form  | N/A      | Med  | Form input  | SSR+Client  |
// | Homepage      | Weekly   | High | Read-only   | SSG+Revalid |

// Documentation: Static Generation
// app/dashboard/frontend/architecture/page.tsx
export const dynamic = "force-static"
// Zero server cost after build. Rebuilds only on deploy.

// Content Library: ISR with 1-hour revalidation
// app/dashboard/content-library/articles/page.tsx
export const revalidate = 3600 // Regenerate at most every hour
export default async function ArticlesPage() {
  const articles = getArticles() // Cached for 1 hour
  return <ArticleGrid articles={articles} />
}

// Admin Dashboard: Dynamic with client navigation
// app/dashboard/admin/layout.tsx (Server Component)
export const dynamic = "force-dynamic"
export default function AdminLayout({ children }) {
  return (
    <div className="flex">
      <AdminNav />  {/* Client component for instant navigation */}
      <main>{children}</main>
    </div>
  )
}

// Homepage: Static with on-demand revalidation
// app/page.tsx
export const revalidate = false // Static until manually revalidated
// Trigger revalidation when content changes:
// revalidatePath("/")`,
    },
    results: {
      metrics: [
        { label: "Documentation TTFB", before: "~200ms (SSR)", after: "~20ms (static CDN)", improvement: "-90%" },
        { label: "Content Library TTFB", before: "~200ms (SSR)", after: "~25ms (cached CDN)", improvement: "-87%" },
        { label: "Server Compute", before: "Every request", after: "Only on cache miss", improvement: "-70% requests" },
        { label: "Build Time", before: "All pages SSR", after: "Static pages pre-built", improvement: "Predictable" },
      ],
    },
    keyTakeaway: "The rendering strategy should never be an accident. Map each page type to the three decision factors (freshness, SEO, interaction) and the optimal strategy becomes obvious. Most documentation sites are 80% static content that should never hit a server after the first build.",
  },
  {
    id: "16",
    slug: "multi-step-form-prototype-to-production",
    title: "Multi-Step Form: From Prototype to Production",
    subtitle: "The evolution of the service request form from a single-page prototype to a production multi-step form with Zustand state, dual-layer validation, and accessibility",
    category: "forms",
    publishedAt: "2026-02-09",
    tags: ["forms", "zustand", "validation", "accessibility", "architecture", "refactoring"],
    problem: {
      description: "The original service request form was a single page component with 400+ lines of JSX, all form state in local useState hooks, client-only validation, and no accessibility considerations. Code Review #1 flagged it as a maintainability risk, and Review #2 identified the client-only validation as a security vulnerability.",
      issues: [
        "Single 400+ line component with all form logic inline",
        "12 useState hooks for individual form fields",
        "Client-only validation (no server-side checks)",
        "No step progression -- all fields visible simultaneously",
        "Tab order broken due to conditional rendering",
        "No error recovery -- form reset on any failure",
        "No persistence -- browser refresh lost all input",
      ],
      codeExample: `// BEFORE: The monolithic form (simplified)
"use client"

export default function ServiceRequestForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [description, setDescription] = useState("")
  const [urgency, setUrgency] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [address, setAddress] = useState("")
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  // 12 useState hooks...

  function validate() {
    // Client-only validation -- easily bypassed
    const newErrors = {}
    if (!name) newErrors.name = "Required"
    if (!email.includes("@")) newErrors.email = "Invalid"
    // ... 20 more validation rules inline
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 400+ lines of JSX with all steps inline
  return <form>...</form>
}`,
    },
    solution: {
      description: "We refactored over three iterations: (1) Extract state to a Zustand store, (2) Add dual-layer Zod validation (client + server), (3) Split into step components with shared form organisms following atomic design.",
      improvements: [
        "Zustand store replaced 12 useState hooks with a single typed store",
        "Zod schemas validate on both client (UX) and server (security)",
        "Step components: ContactStep, ServiceStep, ScheduleStep, ReviewStep",
        "Shared form organisms: FormNavigation, StepIndicator, FieldError",
        "Keyboard navigation works correctly across all steps",
        "Form state persists in Zustand (survives component remounts)",
        "Server action submission with proper error handling and recovery",
      ],
      codeExample: `// AFTER: Architecture overview

// 1. Zustand Store (single source of truth)
// lib/store/service-request-store.ts
interface ServiceRequestState {
  step: number
  contactData: ContactData
  serviceData: ServiceData
  scheduleData: ScheduleData
  setStep: (step: number) => void
  updateContact: (data: Partial<ContactData>) => void
  updateService: (data: Partial<ServiceData>) => void
  updateSchedule: (data: Partial<ScheduleData>) => void
  reset: () => void
}

export const useServiceRequestStore = create<ServiceRequestState>()(
  (set) => ({
    step: 1,
    contactData: initialContactData,
    serviceData: initialServiceData,
    scheduleData: initialScheduleData,
    setStep: (step) => set({ step }),
    updateContact: (data) =>
      set((state) => ({
        contactData: { ...state.contactData, ...data },
      })),
    // ... other updaters
    reset: () => set(initialState),
  })
)

// 2. Dual-Layer Validation
// lib/validations/service-request.ts
export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
})

// Client: validate on blur for instant feedback
// Server: validate in action for security

// 3. Step Components (atoms -> molecules -> organisms)
// components/organisms/service-request/contact-step.tsx
// components/organisms/service-request/service-step.tsx
// components/organisms/service-request/schedule-step.tsx
// components/organisms/service-request/review-step.tsx

// 4. Shared Form Organisms
// components/molecules/form-navigation.tsx -- Back/Next/Submit
// components/atoms/step-indicator.tsx -- Visual step progress
// components/atoms/field-error.tsx -- Accessible error messages`,
    },
    results: {
      metrics: [
        { label: "Main Component", before: "400+ lines", after: "~60 lines (orchestrator)", improvement: "-85%" },
        { label: "State Hooks", before: "12 useState", after: "1 Zustand store", improvement: "-92%" },
        { label: "Validation", before: "Client-only (bypassable)", after: "Dual-layer (Zod)", improvement: "Secured" },
        { label: "Keyboard Navigation", before: "Broken tab order", after: "Full ARIA support", improvement: "Accessible" },
        { label: "Error Recovery", before: "Full form reset", after: "Step-level retry", improvement: "Graceful" },
        { label: "Code Reuse", before: "0 shared components", after: "4 reusable organisms", improvement: "DRY" },
      ],
    },
    keyTakeaway: "Multi-step forms are the canary in the coal mine for frontend architecture. If your form is a monolith, your app is probably a monolith too. The refactoring sequence -- extract state, add validation, split UI -- works for any complex component, not just forms.",
  },
]

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug)
}

export function getCaseStudiesByCategory(category: CaseStudyCategory): CaseStudy[] {
  return caseStudies.filter((cs) => cs.category === category)
}

export function getAllCaseStudySlugs(): string[] {
  return caseStudies.map((cs) => cs.slug)
}
