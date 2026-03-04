/**
 * Guides Data -- Content Library
 * ==============================
 * Promoted operational documentation that gets full Content Library treatment:
 * typed data, dedicated rich components, richContentMap in slug page, TOC,
 * and positive import validation.
 *
 * These are the highest-value ops docs promoted from standalone pages
 * under Option C (S44). They remain accessible at their original routes
 * but are ALSO available in the Learning Hub as structured guides.
 */

export type GuideLevel = "intermediate" | "advanced"
export type GuideCategory = "security" | "devops" | "testing"
export type GuideAudience = "CTO / Project Lead" | "Developer / Architect" | "DevOps / WebAdmin" | "QA / Testing"

export interface GuideSection {
  id: string
  title: string
  summary: string
}

export interface Guide {
  id: string
  slug: string
  title: string
  description: string
  level: GuideLevel
  category: GuideCategory
  audience: GuideAudience[]
  duration: string
  publishedAt: string
  lastUpdated: string
  tags: string[]
  prerequisites: string[]
  sections: GuideSection[]
}

export const guides: Guide[] = [
  {
    id: "G1",
    slug: "security-architecture",
    title: "Security Architecture: 7-Layer Defense in Depth",
    description: "Complete guide to the seven-layer defense-in-depth security architecture protecting every request from ingress to response. Built on real implementations with OWASP mapping.",
    level: "advanced",
    category: "security",
    audience: ["CTO / Project Lead", "Developer / Architect"],
    duration: "45 min",
    publishedAt: "2026-01-20",
    lastUpdated: "2026-02-10",
    tags: ["security", "OWASP", "rate-limiting", "CSRF", "input-sanitization", "zero-trust"],
    prerequisites: ["Understanding of HTTP request lifecycle", "Familiarity with Next.js Server Actions"],
    sections: [
      { id: "why-security", title: "Why This Is the Most Important Section", summary: "Attack landscape and stakeholder perspectives" },
      { id: "security-layers", title: "The 7 Security Layers", summary: "Complete walkthrough of each defense layer" },
      { id: "rate-limiting", title: "Layer 1: Rate Limiting", summary: "Token bucket algorithm, IP tracking, configurable limits" },
      { id: "csrf", title: "Layer 2: CSRF Protection", summary: "Double-submit cookie pattern with HMAC signing" },
      { id: "sanitization", title: "Layer 3: Input Sanitization", summary: "DOMPurify integration, recursive object sanitization" },
      { id: "validation", title: "Layer 4: Server Validation", summary: "Zod schemas with custom refinements per form type" },
      { id: "hydration", title: "Layer 5: Hydration Guards", summary: "Client-server mismatch detection and safe rendering" },
      { id: "environment", title: "Layer 6: Environment Validation", summary: "Runtime env var checking and startup guards" },
      { id: "error-handling", title: "Layer 7: Safe Error Handling", summary: "Never leak stack traces, structured error responses" },
      { id: "owasp-mapping", title: "OWASP Top 10 Mapping", summary: "How each layer maps to OWASP threat categories" },
    ],
  },
  {
    id: "G2",
    slug: "deployment-guide",
    title: "Production Deployment Guide",
    description: "End-to-end deployment guide covering Docker, PaaS, Strapi Cloud, Nginx reverse proxy, backup strategies, performance tuning, and monitoring setup.",
    level: "intermediate",
    category: "devops",
    audience: ["DevOps / WebAdmin", "Developer / Architect"],
    duration: "35 min",
    publishedAt: "2026-01-15",
    lastUpdated: "2026-02-10",
    tags: ["Docker", "PostgreSQL", "Nginx", "monitoring", "backups", "CI/CD"],
    prerequisites: ["Basic Docker knowledge", "Access to a VPS or PaaS provider"],
    sections: [
      { id: "deployment-options", title: "Deployment Options", summary: "PaaS vs Docker/VPS vs Strapi Cloud comparison" },
      { id: "docker-deployment", title: "Docker Deployment", summary: "Dockerfile, Docker Compose, and Nginx configuration" },
      { id: "backup-recovery", title: "Backup & Recovery", summary: "Automated scripts for database + uploads backup and restore" },
      { id: "performance-tuning", title: "Performance Tuning", summary: "Database optimization, Redis caching, CDN setup" },
      { id: "monitoring", title: "Monitoring & Alerting", summary: "Health checks, APM tools, alert thresholds" },
    ],
  },
  {
    id: "G3",
    slug: "testing-strategy",
    title: "Testing Strategy: From Unit to E2E",
    description: "Comprehensive testing strategy covering unit testing with Vitest, component testing, integration testing, and end-to-end testing with Playwright. Includes test organization, coverage goals, and CI integration.",
    level: "intermediate",
    category: "testing",
    audience: ["QA / Testing", "Developer / Architect"],
    duration: "30 min",
    publishedAt: "2026-01-15",
    lastUpdated: "2026-02-10",
    tags: ["Vitest", "Playwright", "testing", "CI/CD", "coverage", "TDD"],
    prerequisites: ["Basic testing concepts", "Familiarity with React component patterns"],
    sections: [
      { id: "testing-philosophy", title: "Testing Philosophy", summary: "The testing pyramid and where to invest effort" },
      { id: "unit-testing", title: "Unit Testing with Vitest", summary: "Setup, patterns, mocking, and coverage" },
      { id: "component-testing", title: "Component Testing", summary: "React Testing Library patterns for atomic design" },
      { id: "integration-testing", title: "Integration Testing", summary: "API route testing, form submission flows" },
      { id: "e2e-testing", title: "E2E Testing with Playwright", summary: "Browser automation, critical path testing" },
      { id: "ci-integration", title: "CI/CD Integration", summary: "GitHub Actions workflow, coverage gates" },
    ],
  },
]
