// ---------------------------------------------------------------------------
// Content Gap Registry -- Living gap analysis for the Learning Hub
// ---------------------------------------------------------------------------
// Generated from Reviews 1-10 and full audience coverage analysis.
// This file drives the Content Pipeline dashboard and tracks progress
// from identification through drafting to publication.
//
// Update this file whenever:
//   - New review findings create transferable knowledge
//   - Content is drafted or published (update status)
//   - New audience roles are identified
// ---------------------------------------------------------------------------

export type ContentType = "article" | "tutorial" | "case-study"
export type GapPriority = "tier-1" | "tier-2" | "tier-3"
export type GapStatus = "identified" | "outlined" | "drafted" | "in-review" | "published"

export type Audience =
  | "junior-developer"
  | "senior-developer"
  | "cto-tech-lead"
  | "devops-engineer"
  | "business-admin"
  | "web-admin"
  | "qa-engineer"

export type ContentCategory =
  | "architecture"
  | "security"
  | "forms"
  | "rendering"
  | "best-practices"
  | "business"
  | "cms"
  | "testing"
  | "devops"
  | "performance"
  | "email"
  | "accessibility"
  | "ai-tooling"
  | "deployment"
  | "getting-started"
  | "components"
  | "state-management"

export interface ContentGap {
  id: string
  title: string
  contentType: ContentType
  category: ContentCategory
  priority: GapPriority
  audiences: Audience[]
  status: GapStatus
  sourceReviews: string[]
  description: string
  keyTopics: string[]
  estimatedScope: "short" | "medium" | "long"
}

// ---------------------------------------------------------------------------
// Audience definitions for the dashboard summary
// ---------------------------------------------------------------------------

export interface AudienceProfile {
  id: Audience
  label: string
  description: string
  existingContentCount: number
  gapCount: number
  coverageRating: number
}

export const AUDIENCES: AudienceProfile[] = [
  {
    id: "junior-developer",
    label: "Junior Developer",
    description: "Learning fundamentals: forms, rendering, getting started, components",
    existingContentCount: 12,
    gapCount: 6,
    coverageRating: 65,
  },
  {
    id: "senior-developer",
    label: "Senior Developer / Architect",
    description: "Deep patterns: security, architecture, hydration, server boundaries",
    existingContentCount: 18,
    gapCount: 6,
    coverageRating: 70,
  },
  {
    id: "cto-tech-lead",
    label: "CTO / Tech Lead",
    description: "Strategy: ROI, tech decisions, team scaling, AI tooling, process",
    existingContentCount: 8,
    gapCount: 4,
    coverageRating: 55,
  },
  {
    id: "devops-engineer",
    label: "DevOps / Infra Engineer",
    description: "Operations: deployment, monitoring, security headers, CI/CD",
    existingContentCount: 1,
    gapCount: 5,
    coverageRating: 10,
  },
  {
    id: "business-admin",
    label: "Business Admin / Project Lead",
    description: "Non-technical: request lifecycle, email guides, metrics interpretation",
    existingContentCount: 0,
    gapCount: 3,
    coverageRating: 0,
  },
  {
    id: "web-admin",
    label: "Web Administrator",
    description: "CMS operations: content management, email delivery, SEO",
    existingContentCount: 0,
    gapCount: 3,
    coverageRating: 0,
  },
  {
    id: "qa-engineer",
    label: "QA / Testing Engineer",
    description: "Quality: E2E testing, test debugging, CI/CD quality gates",
    existingContentCount: 2,
    gapCount: 3,
    coverageRating: 25,
  },
]

// ---------------------------------------------------------------------------
// The Gap Registry -- 30 identified content gaps
// ---------------------------------------------------------------------------

export const CONTENT_GAPS: ContentGap[] = [
  // =========================================================================
  // TIER 1 -- Critical Gaps (directly from review findings, audiences blocked)
  // =========================================================================
  {
    id: "GAP-001",
    title: "Rate Limiting: From Bypassable to Production-Grade",
    contentType: "case-study",
    category: "security",
    priority: "tier-1",
    audiences: ["senior-developer", "cto-tech-lead"],
    status: "published",
    sourceReviews: ["review-002"],
    description:
      "Review 2 found a CRITICAL rate limiting bypass -- in-memory store with no persistence. This is a real production incident that makes a compelling case study on security architecture evolution.",
    keyTopics: [
      "In-memory vs persistent rate limiting",
      "Token bucket vs sliding window algorithms",
      "Redis/Upstash-backed rate limiting",
      "Testing rate limits under load",
    ],
    estimatedScope: "long",
  },
  {
    id: "GAP-002",
    title: "Server/Client Boundaries: What Can and Cannot Cross",
    contentType: "article",
    category: "architecture",
    priority: "tier-1",
    audiences: ["junior-developer", "senior-developer"],
    status: "published",
    sourceReviews: ["review-003", "review-004", "review-006"],
    description:
      "Reviews 3, 4, and 6 found systemic violations: 'use server' files exporting non-async values (types, interfaces). This is the most common architectural mistake in Next.js apps.",
    keyTopics: [
      "'use server' vs 'use client' directive rules",
      "What can cross the server/client boundary",
      "Type-only exports and the TypeScript compiler",
      "Module boundary patterns (server-only package)",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-003",
    title: "Building Email Templates with React Email",
    contentType: "tutorial",
    category: "email",
    priority: "tier-1",
    audiences: ["junior-developer", "senior-developer"],
    status: "identified",
    sourceReviews: ["review-002", "review-004"],
    description:
      "The email system is a major feature with zero tutorials. Advanced article and case study exist but no beginner/intermediate hands-on guide.",
    keyTopics: [
      "React Email component model",
      "Styling constraints (inline CSS, table layouts)",
      "Resend integration for delivery",
      "Testing emails with preview mode",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-004",
    title: "Working with AI Assistants: Session Management and Quality Gates",
    contentType: "article",
    category: "ai-tooling",
    priority: "tier-1",
    audiences: ["cto-tech-lead", "senior-developer"],
    status: "identified",
    sourceReviews: ["review-009-hotfix", "review-010"],
    description:
      "Unique knowledge from the tarball incident: session lifecycle management, file operation budgeting, recovery protocols, rules systems. No other content exists on this topic.",
    keyTopics: [
      "Session scope and file operation budgets",
      "Incremental build system constraints",
      "Recovery protocols for platform failures",
      "Rules and handoff documentation patterns",
      "3-axis review methodology",
    ],
    estimatedScope: "long",
  },
  {
    id: "GAP-005",
    title: "Adding Error Boundaries and Loading States",
    contentType: "tutorial",
    category: "architecture",
    priority: "tier-1",
    audiences: ["junior-developer"],
    status: "published",
    sourceReviews: ["review-001"],
    description:
      "Review 1 found missing error boundaries (A5) and loading states (A8). These are fundamental React patterns that every developer needs.",
    keyTopics: [
      "React error boundaries (class and function patterns)",
      "Next.js error.tsx and loading.tsx conventions",
      "Graceful degradation strategies",
      "User-facing error messages",
    ],
    estimatedScope: "medium",
  },

  // =========================================================================
  // TIER 2 -- High-Value Gaps (transferable knowledge exists, needs packaging)
  // =========================================================================
  {
    id: "GAP-006",
    title: "Automated Code Review: Building a 3-Axis Quality System",
    contentType: "article",
    category: "best-practices",
    priority: "tier-2",
    audiences: ["cto-tech-lead", "senior-developer"],
    status: "identified",
    sourceReviews: ["review-001", "review-002", "review-003", "review-004", "review-005", "review-006", "review-006a", "review-007", "review-008", "review-009", "review-010"],
    description:
      "10 reviews of methodology: code quality, security, architecture axes. Process evolved from ad-hoc to systematic. Includes sprint failure lesson (6a).",
    keyTopics: [
      "3-axis review model (code quality, security, architecture)",
      "Severity classification and resolution tracking",
      "Review sprint process and verification",
      "Lessons from review process failures",
    ],
    estimatedScope: "long",
  },
  {
    id: "GAP-007",
    title: "Choosing the Right Rendering Strategy: SSG vs SSR vs ISR vs PPR",
    contentType: "case-study",
    category: "rendering",
    priority: "tier-2",
    audiences: ["senior-developer", "cto-tech-lead"],
    status: "identified",
    sourceReviews: [],
    description:
      "4 rendering articles exist but no decision-making synthesis. Need a case study showing how to choose between strategies for different page types.",
    keyTopics: [
      "Decision matrix for rendering strategies",
      "Performance benchmarks per strategy",
      "Migration paths between strategies",
      "Real-world trade-offs and gotchas",
    ],
    estimatedScope: "long",
  },
  {
    id: "GAP-008",
    title: "Breaking Up Monolithic Pages: A Refactoring Playbook",
    contentType: "article",
    category: "architecture",
    priority: "tier-2",
    audiences: ["senior-developer", "junior-developer"],
    status: "published",
    sourceReviews: ["review-001"],
    description:
      "Review 1 finding A4: 6 pages over 800 lines. Common team problem with a clear refactoring methodology.",
    keyTopics: [
      "Identifying extraction boundaries",
      "Component vs hook extraction",
      "Preserving behaviour during refactoring",
      "Testing after extraction",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-009",
    title: "E2E Testing with Playwright for Next.js",
    contentType: "tutorial",
    category: "testing",
    priority: "tier-2",
    audiences: ["qa-engineer", "junior-developer"],
    status: "identified",
    sourceReviews: [],
    description:
      "Testing article mentions Playwright but no hands-on tutorial. QA audience has almost no dedicated content.",
    keyTopics: [
      "Playwright setup with Next.js",
      "Writing resilient selectors",
      "Testing server components and client interactions",
      "CI integration for E2E tests",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-010",
    title: "Multi-Step Form: From Prototype to Production",
    contentType: "case-study",
    category: "forms",
    priority: "tier-2",
    audiences: ["junior-developer", "senior-developer"],
    status: "published",
    sourceReviews: ["review-001", "review-002"],
    description:
      "3 form articles exist but zero case studies. The multi-step form is the app's signature feature -- its evolution is a natural case study.",
    keyTopics: [
      "Zustand store architecture evolution",
      "Validation layer progression (client-only to dual-layer)",
      "Accessibility in multi-step flows",
      "Performance optimisation for complex forms",
    ],
    estimatedScope: "long",
  },
  {
    id: "GAP-011",
    title: "Advanced Zustand Patterns: Middleware, Persistence, DevTools",
    contentType: "tutorial",
    category: "state-management",
    priority: "tier-2",
    audiences: ["senior-developer"],
    status: "identified",
    sourceReviews: ["review-001"],
    description:
      "Intermediate Zustand tutorial exists. No advanced tutorial covering middleware, persistence, and debugging patterns.",
    keyTopics: [
      "Zustand middleware (immer, persist, devtools)",
      "Store slicing for large applications",
      "Optimistic updates with Zustand",
      "Testing stores in isolation",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-012",
    title: "Testing Pyramid: Achieving 80% Coverage with Vitest",
    contentType: "case-study",
    category: "testing",
    priority: "tier-2",
    audiences: ["qa-engineer", "senior-developer"],
    status: "identified",
    sourceReviews: [],
    description:
      "Testing article and beginner tutorial exist but no real-world case study showing a testing strategy in action.",
    keyTopics: [
      "Unit vs integration vs E2E balance",
      "Coverage targets and diminishing returns",
      "Mocking strategies for server components",
      "CI/CD quality gate configuration",
    ],
    estimatedScope: "long",
  },

  // =========================================================================
  // TIER 3 -- Audience Gap Filling (underserved roles)
  // =========================================================================
  {
    id: "GAP-013",
    title: "Understanding the Service Request Lifecycle",
    contentType: "article",
    category: "business",
    priority: "tier-3",
    audiences: ["business-admin"],
    status: "published",
    sourceReviews: [],
    description:
      "Business Admins have zero dedicated content. The request management forms exist but no guide explains the lifecycle.",
    keyTopics: [
      "Request submission flow",
      "Status transitions and notifications",
      "Approval workflows",
      "Reporting and analytics",
    ],
    estimatedScope: "short",
  },
  {
    id: "GAP-014",
    title: "Managing Content in Strapi: Day-to-Day Operations",
    contentType: "tutorial",
    category: "cms",
    priority: "tier-3",
    audiences: ["web-admin"],
    status: "identified",
    sourceReviews: [],
    description:
      "Web Admins have zero dedicated content. Backend operations page exists but no tutorial for non-developer CMS users.",
    keyTopics: [
      "Content types and field management",
      "Media library and file uploads",
      "Publishing workflows and drafts",
      "User roles within Strapi admin",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-015",
    title: "Configuring Security Headers in Next.js",
    contentType: "article",
    category: "security",
    priority: "tier-3",
    audiences: ["devops-engineer", "senior-developer"],
    status: "identified",
    sourceReviews: ["review-001"],
    description:
      "Review 1 finding S2: no security headers in Next.js config. Common production oversight.",
    keyTopics: [
      "CSP, HSTS, X-Frame-Options, X-Content-Type-Options",
      "next.config.js headers configuration",
      "Testing headers with securityheaders.com",
      "Environment-specific header policies",
    ],
    estimatedScope: "short",
  },
  {
    id: "GAP-016",
    title: "Deploying Next.js to Vercel: Environment Variables and Checks",
    contentType: "tutorial",
    category: "deployment",
    priority: "tier-3",
    audiences: ["devops-engineer", "junior-developer"],
    status: "identified",
    sourceReviews: [],
    description:
      "Deployment page exists but no step-by-step tutorial. DevOps audience severely underserved.",
    keyTopics: [
      "Vercel project setup and linking",
      "Environment variable management (dev/staging/prod)",
      "Preview deployments and branch protection",
      "Deployment checks and rollbacks",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-017",
    title: "Email System for Non-Technical Stakeholders",
    contentType: "article",
    category: "email",
    priority: "tier-3",
    audiences: ["business-admin"],
    status: "identified",
    sourceReviews: ["review-002", "review-007"],
    description:
      "Business Admins need to understand the email system without implementation details. Plain-English explanation of delivery, templates, and troubleshooting.",
    keyTopics: [
      "How email delivery works (simplified)",
      "Template system and personalisation",
      "Delivery monitoring and bounce handling",
      "When to escalate to the dev team",
    ],
    estimatedScope: "short",
  },
  {
    id: "GAP-018",
    title: "Zero-Downtime Deployment Pipeline for Next.js + Strapi",
    contentType: "case-study",
    category: "deployment",
    priority: "tier-3",
    audiences: ["devops-engineer", "cto-tech-lead"],
    status: "identified",
    sourceReviews: [],
    description:
      "CI/CD article exists but no case study. DevOps needs real-world deployment architecture.",
    keyTopics: [
      "Blue-green deployment strategy",
      "Database migration coordination",
      "Rollback procedures",
      "Monitoring and alerting post-deploy",
    ],
    estimatedScope: "long",
  },
  {
    id: "GAP-019",
    title: "Production Monitoring: Logs, Alerts, and Error Tracking",
    contentType: "article",
    category: "devops",
    priority: "tier-3",
    audiences: ["devops-engineer"],
    status: "identified",
    sourceReviews: [],
    description:
      "Zero monitoring content exists. DevOps audience needs operational observability guidance.",
    keyTopics: [
      "Structured logging patterns",
      "Error tracking (Sentry/LogRocket)",
      "Alert thresholds and escalation",
      "Performance monitoring dashboards",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-020",
    title: "Adding ARIA and Keyboard Navigation to Components",
    contentType: "tutorial",
    category: "accessibility",
    priority: "tier-3",
    audiences: ["junior-developer"],
    status: "identified",
    sourceReviews: ["review-001"],
    description:
      "Accessibility article exists but no hands-on tutorial. Growing legal requirement makes this increasingly important.",
    keyTopics: [
      "ARIA roles, states, and properties",
      "Keyboard navigation patterns",
      "Screen reader testing workflow",
      "Common accessibility anti-patterns",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-021",
    title: "Email Delivery: SMTP, Resend, and Troubleshooting Bounces",
    contentType: "article",
    category: "email",
    priority: "tier-3",
    audiences: ["web-admin", "devops-engineer"],
    status: "identified",
    sourceReviews: ["review-002", "review-004"],
    description:
      "Email infrastructure pages exist but no operational guide for delivery troubleshooting.",
    keyTopics: [
      "SMTP vs API-based delivery",
      "SPF, DKIM, and DMARC configuration",
      "Bounce classification and handling",
      "Deliverability monitoring",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-022",
    title: "SEO Configuration: Metadata, Sitemaps, and Open Graph",
    contentType: "article",
    category: "best-practices",
    priority: "tier-3",
    audiences: ["web-admin", "junior-developer"],
    status: "identified",
    sourceReviews: [],
    description:
      "Zero SEO content exists. Web Admins need to understand metadata management.",
    keyTopics: [
      "Next.js metadata API",
      "Dynamic OG image generation",
      "Sitemap and robots.txt configuration",
      "Structured data (JSON-LD)",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-023",
    title: "Debugging Flaky Tests: Patterns and Solutions",
    contentType: "article",
    category: "testing",
    priority: "tier-3",
    audiences: ["qa-engineer"],
    status: "identified",
    sourceReviews: [],
    description:
      "QA engineers have minimal content. Flaky test debugging is a universal pain point.",
    keyTopics: [
      "Common flakiness sources (timing, state, network)",
      "Retry strategies and test isolation",
      "CI-specific debugging techniques",
      "Test stability metrics",
    ],
    estimatedScope: "short",
  },
  {
    id: "GAP-024",
    title: "Automating Quality Gates in CI/CD",
    contentType: "case-study",
    category: "testing",
    priority: "tier-3",
    audiences: ["qa-engineer", "devops-engineer"],
    status: "identified",
    sourceReviews: ["review-006a"],
    description:
      "Review 6a showed a process failure where verification wasn't run after each fix. Perfect case study for quality gate automation.",
    keyTopics: [
      "Pre-merge quality checks",
      "Automated review checklists",
      "Build verification as a gate",
      "Rollback triggers",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-025",
    title: "Measuring and Improving Core Web Vitals",
    contentType: "tutorial",
    category: "performance",
    priority: "tier-3",
    audiences: ["junior-developer", "senior-developer"],
    status: "identified",
    sourceReviews: [],
    description:
      "Performance page exists but no hands-on tutorial. Zero performance tutorials.",
    keyTopics: [
      "LCP, FID, CLS measurement",
      "Lighthouse and Web Vitals library",
      "Image optimisation with next/image",
      "Bundle analysis and code splitting",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-026",
    title: "Headless CMS Comparison: Strapi vs Contentful vs Sanity",
    contentType: "article",
    category: "cms",
    priority: "tier-3",
    audiences: ["cto-tech-lead"],
    status: "identified",
    sourceReviews: [],
    description:
      "CTO decision-making gap. Vendor comparison is high-value for technical leadership.",
    keyTopics: [
      "Feature comparison matrix",
      "Pricing and scaling models",
      "Developer experience comparison",
      "Migration complexity between platforms",
    ],
    estimatedScope: "long",
  },
  {
    id: "GAP-027",
    title: "Scaling a Development Team with Structured Documentation",
    contentType: "article",
    category: "business",
    priority: "tier-3",
    audiences: ["cto-tech-lead"],
    status: "identified",
    sourceReviews: ["review-010"],
    description:
      "Documentation case study exists but needs team scaling angle. How structured docs reduce onboarding time.",
    keyTopics: [
      "Documentation as onboarding tool",
      "Knowledge transfer patterns",
      "Measuring documentation ROI",
      "Maintaining docs at scale",
    ],
    estimatedScope: "medium",
  },
  {
    id: "GAP-028",
    title: "Managing Environment Variables Across Dev/Staging/Prod",
    contentType: "article",
    category: "deployment",
    priority: "tier-3",
    audiences: ["devops-engineer", "junior-developer"],
    status: "identified",
    sourceReviews: [],
    description:
      "Deployment page references environment management but no dedicated article.",
    keyTopics: [
      "Environment variable naming conventions",
      "Secret management best practices",
      ".env files vs platform configuration",
      "Runtime vs build-time variables in Next.js",
    ],
    estimatedScope: "short",
  },
  {
    id: "GAP-029",
    title: "Reading Development Metrics: What the Numbers Mean",
    contentType: "article",
    category: "business",
    priority: "tier-3",
    audiences: ["business-admin"],
    status: "identified",
    sourceReviews: [],
    description:
      "Code review dashboard exists but non-technical stakeholders need interpretation guidance.",
    keyTopics: [
      "Understanding severity levels",
      "Resolution rates and what they indicate",
      "Sprint velocity and technical debt",
      "When to be concerned about metrics",
    ],
    estimatedScope: "short",
  },
  {
    id: "GAP-030",
    title: "The Tarball Incident: Platform Constraints and Recovery",
    contentType: "case-study",
    category: "ai-tooling",
    priority: "tier-2",
    audiences: ["cto-tech-lead", "senior-developer"],
    status: "identified",
    sourceReviews: ["review-009-hotfix", "review-010"],
    description:
      "Unique real-world case study: how platform-level constraints (tar archive behaviour) caused cascading failures and the process improvements that followed.",
    keyTopics: [
      "Incremental build system constraints",
      "Cascading failure analysis",
      "Process improvement methodology",
      "Session handoff and rules systems",
    ],
    estimatedScope: "medium",
  },
]

// ---------------------------------------------------------------------------
// Helper utilities
// ---------------------------------------------------------------------------

export function getGapsByAudience(audience: Audience): ContentGap[] {
  return CONTENT_GAPS.filter((g) => g.audiences.includes(audience))
}

export function getGapsByPriority(priority: GapPriority): ContentGap[] {
  return CONTENT_GAPS.filter((g) => g.priority === priority)
}

export function getGapsByStatus(status: GapStatus): ContentGap[] {
  return CONTENT_GAPS.filter((g) => g.status === status)
}

export function getGapsByCategory(category: ContentCategory): ContentGap[] {
  return CONTENT_GAPS.filter((g) => g.category === category)
}

export function getGapsByContentType(type: ContentType): ContentGap[] {
  return CONTENT_GAPS.filter((g) => g.contentType === type)
}

export function getCompletionRate(): number {
  const published = CONTENT_GAPS.filter((g) => g.status === "published").length
  return CONTENT_GAPS.length > 0
    ? Math.round((published / CONTENT_GAPS.length) * 100)
    : 0
}

export function getCategoryStats(): { category: ContentCategory; total: number; published: number }[] {
  const categories = [...new Set(CONTENT_GAPS.map((g) => g.category))]
  return categories.map((cat) => ({
    category: cat,
    total: CONTENT_GAPS.filter((g) => g.category === cat).length,
    published: CONTENT_GAPS.filter((g) => g.category === cat && g.status === "published").length,
  }))
}

// ---------------------------------------------------------------------------
// Live cross-reference helpers (Phase 2)
// These functions compute gap status dynamically by comparing against the
// real content library and review log. Used by the gap-analysis pipeline.
// ---------------------------------------------------------------------------

export interface AudienceCoverage {
  audience: Audience
  label: string
  totalGaps: number
  addressed: number
  coveragePct: number
  rating: "excellent" | "good" | "fair" | "poor" | "none"
}

/**
 * Checks whether a gap has been addressed by existing content.
 * Matches on title keywords and category overlap.
 */
export function isGapAddressedByContent(
  gap: ContentGap,
  contentItems: { title: string; tags: string[]; category: string }[],
): boolean {
  const titleWords = gap.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
  return contentItems.some((item) => {
    const titleMatch = titleWords.some(
      (word) => item.title.toLowerCase().includes(word),
    )
    const tagMatch = gap.keyTopics.some((topic) =>
      item.tags.some((tag) => tag.toLowerCase().includes(topic.toLowerCase())),
    )
    const catMatch = item.category.toLowerCase().includes(gap.category.toLowerCase())
    return (titleMatch && catMatch) || (tagMatch && titleMatch) || (tagMatch && catMatch)
  })
}

/**
 * Compute live audience coverage by checking gaps against actual content.
 */
export function computeAudienceCoverage(
  contentItems: { title: string; tags: string[]; category: string }[],
): AudienceCoverage[] {
  return AUDIENCES.map((aud) => {
    const audienceGaps = CONTENT_GAPS.filter((g) => g.audiences.includes(aud.id))
    const addressed = audienceGaps.filter(
      (g) => g.status === "published" || isGapAddressedByContent(g, contentItems),
    ).length
    const pct = audienceGaps.length > 0 ? Math.round((addressed / audienceGaps.length) * 100) : 100
    const rating: AudienceCoverage["rating"] =
      pct >= 80 ? "excellent" : pct >= 60 ? "good" : pct >= 40 ? "fair" : pct > 0 ? "poor" : "none"
    return {
      audience: aud.id,
      label: aud.label,
      totalGaps: audienceGaps.length,
      addressed,
      coveragePct: pct,
      rating,
    }
  })
}

/**
 * Extract transferable knowledge from review findings.
 * Returns findings that represent knowledge worth converting to content
 * but that don't yet have matching articles/tutorials/case-studies.
 */
export function extractReviewKnowledge(
  findings: { id: string; title: string; category: string; severity: string; description: string }[],
  contentItems: { title: string; tags: string[]; category: string }[],
): { findingId: string; title: string; category: string; severity: string; suggestedContentType: ContentType }[] {
  return findings
    .filter((f) => f.severity === "critical" || f.severity === "high")
    .filter((f) => {
      const titleWords = f.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3)
      return !contentItems.some((item) =>
        titleWords.filter((word) => item.title.toLowerCase().includes(word)).length >= 2,
      )
    })
    .map((f) => ({
      findingId: f.id,
      title: f.title,
      category: f.category,
      severity: f.severity,
      suggestedContentType: f.severity === "critical" ? "case-study" as ContentType : "article" as ContentType,
    }))
}

// ---------------------------------------------------------------------------
// Option 2 -- Batch AI Draft Generation (FUTURE IMPLEMENTATION)
// ---------------------------------------------------------------------------
// Design spec for batch content generation. This is NOT yet implemented.
// The pipeline UI includes checkbox selection and a disabled "Generate Drafts"
// action bar that will be wired to this system when Option 2 is built.
//
// Batch Workflow:
//   1. User selects 1-N gap items via checkboxes in the pipeline UI
//   2. "Generate Drafts (N selected)" action bar appears
//   3. Server action processes items SEQUENTIALLY (not parallel)
//      - Sequential because items in the same category need context chaining
//        to avoid duplicated content across the batch
//      - Each AI call receives: gap metadata + key topics + source review
//        findings + relevant codebase excerpts + previous drafts in batch
//   4. Each draft outputs a pre-filled data object matching the content
//      library TypeScript interfaces (Article | Tutorial | CaseStudy)
//   5. Drafts are written to /data/content-drafts/draft-{gapId}.ts
//   6. "Draft Review" panel shows results for approve/reject/edit
//
// Session Budget Integration:
//   - Each generated draft = 1 file operation (Write)
//   - Batch of 3 tutorials = 3 ops + 1 overhead = ~4 ops
//   - UI shows remaining budget: "X/15 operations used"
//   - Batch selector caps at remaining budget automatically
//   - Formula: maxBatchSize = Math.floor((sessionBudget - usedOps - 1) / 1)
//
// Content Type Templates:
//   - Article: title, slug, category, level, readTime, description,
//     introduction, keyTakeaways[], sections[], conclusion
//   - Tutorial: title, slug, category, level, duration, prerequisites[],
//     steps[], outcome
//   - Case Study: title, slug, category, subtitle, metrics{},
//     challenge, approach, results, lessonsLearned[]
//
// Quality Controls:
//   - AI model receives the existing content library to avoid duplication
//   - Each draft is validated against the TypeScript interface before save
//   - Drafts expire after 30 days if not approved
//   - Rejected drafts can be regenerated with user-provided feedback
// ---------------------------------------------------------------------------
export type BatchRequest = {
  gapIds: string[]
  sessionBudgetRemaining: number
}

export type DraftResult = {
  gapId: string
  contentType: ContentType
  status: "success" | "error"
  draftPath?: string
  error?: string
}

export type BatchResult = {
  requested: number
  completed: number
  failed: number
  results: DraftResult[]
  operationsUsed: number
}
