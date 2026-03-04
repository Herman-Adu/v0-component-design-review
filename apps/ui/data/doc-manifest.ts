/**
 * CENTRALIZED DOCUMENTATION MANIFEST
 * ====================================
 * Single source of truth for ALL stats, counts, and labels used across doc pages.
 *
 * WHY THIS EXISTS:
 * Before this manifest, the same numbers (e.g. "52 components", "7 security layers")
 * were hardcoded in 30+ places across 12+ files. Adding 1 article required updating
 * 10+ files. This manifest eliminates documentation drift by computing stats from
 * the actual data arrays and defining all labels/descriptions in one place.
 *
 * USAGE:
 * import { STATS, LABELS, ROUTES, ARCHITECTURE } from "@/data/doc-manifest"
 * Then use STATS.frontend.components.total instead of hardcoding "52"
 *
 * WHEN TO UPDATE THIS FILE:
 * - Adding/removing a component file in components/
 * - Adding/removing a content item in data/content-library/
 * - Adding/removing a security module in lib/security/
 * - Adding/removing a server action in lib/actions/
 * - Adding/removing a page route in app/dashboard/
 * - Changing the architecture layers or security model
 */

import { articles } from "@/data/content-library/articles";
import { caseStudies } from "@/data/content-library/case-studies";
import { tutorials } from "@/data/content-library/tutorials";

// ---------------------------------------------------------------------------
// COMPONENT COUNTS - Update when adding/removing component files
// ---------------------------------------------------------------------------
// These mirror the actual file counts from components/ directories.
// Run `find components/atoms -name "*.tsx" | wc -l` to verify.

export const COMPONENT_COUNTS = {
  atoms: {
    count: 10,
    files: [
      "callout",
      "code-block",
      "date-picker",
      "form-checkbox",
      "form-input",
      "form-select",
      "form-textarea",
      "radio-group",
      "spoiler",
      "theme-toggle",
    ],
  },
  molecules: {
    count: 14,
    files: [
      "article-components",
      "contact-success-message",
      "content-card",
      "docs-sidebar",
      "form-navigation",
      "form-progress-indicator",
      "form-step-container",
      "location-map-card",
      "navbar",
      "office-hours-card",
      "quick-contact-card",
      "quotation-success-message",
      "sidebar-skeleton",
      "step-indicator",
    ],
  },
  organisms: {
    count: 10,
    files: [
      "contact-form-container",
      "multi-step-form-container",
      "multi-step-form-wrapper",
      "personal-info-step",
      "property-info-step",
      "quotation-form-container",
      "review-step-display",
      "review-step",
      "schedule-step",
      "service-details-step",
    ],
  },
  contactSteps: {
    count: 5,
    files: [
      "contact-info-step",
      "contact-review-step",
      "inquiry-type-step",
      "message-details-step",
      "reference-linking-step",
    ],
  },
  sharedSteps: {
    count: 3,
    files: ["address-info-step", "contact-info-step", "schedule-step"],
  },
  animations: {
    count: 7,
    files: [
      "electric-border",
      "electric-current",
      "light-bulb",
      "lightning-arc",
      "power-surge",
      "pulse-circle",
      "spark-effect",
    ],
  },
  hooks: {
    count: 3,
    files: ["use-hydration", "use-mobile", "use-toast"],
  },
  articleSubComponents: {
    count: 23,
    description: "Exported from components/molecules/article-components.tsx",
  },
} as const;

// ---------------------------------------------------------------------------
// COMPUTED VALUES - Pre-computed at module load time from COMPONENT_COUNTS
// ---------------------------------------------------------------------------

const _componentsTotal =
  COMPONENT_COUNTS.atoms.count +
  COMPONENT_COUNTS.molecules.count +
  COMPONENT_COUNTS.organisms.count +
  COMPONENT_COUNTS.contactSteps.count +
  COMPONENT_COUNTS.sharedSteps.count +
  COMPONENT_COUNTS.animations.count +
  COMPONENT_COUNTS.hooks.count;

const _componentsBreakdown = `${COMPONENT_COUNTS.atoms.count} Atoms, ${COMPONENT_COUNTS.molecules.count} Molecules, ${COMPONENT_COUNTS.organisms.count} Organisms, ${COMPONENT_COUNTS.contactSteps.count + COMPONENT_COUNTS.sharedSteps.count} Steps, ${COMPONENT_COUNTS.animations.count} Animations, ${COMPONENT_COUNTS.hooks.count} Hooks`;

const _contentArticles = articles.length;
const _contentCaseStudies = caseStudies.length;
const _contentTutorials = tutorials.length;
const _contentTotal =
  _contentArticles + _contentCaseStudies + _contentTutorials;
const _articleCategories = [...new Set(articles.map((a) => a.category))].sort();
const _caseStudyCategories = [
  ...new Set(caseStudies.map((c) => c.category)),
].sort();
const _tutorialCategories = [
  ...new Set(tutorials.map((t) => t.category)),
].sort();

// ---------------------------------------------------------------------------
// STATS - The single source of truth for all numbers in the doc system
// ---------------------------------------------------------------------------

export const STATS = {
  frontend: {
    components: {
      atoms: COMPONENT_COUNTS.atoms.count,
      molecules: COMPONENT_COUNTS.molecules.count,
      organisms: COMPONENT_COUNTS.organisms.count,
      contactSteps: COMPONENT_COUNTS.contactSteps.count,
      sharedSteps: COMPONENT_COUNTS.sharedSteps.count,
      animations: COMPONENT_COUNTS.animations.count,
      hooks: COMPONENT_COUNTS.hooks.count,
      articleSubComponents: COMPONENT_COUNTS.articleSubComponents.count,
      /** Total custom components: atoms + molecules + organisms + steps + animations + hooks */
      total: _componentsTotal,
      /** Human-readable breakdown string */
      breakdown: _componentsBreakdown,
    },
    framerMotionFiles: 31,
    contentPages: {
      articles: _contentArticles,
      caseStudies: _contentCaseStudies,
      total: _contentArticles + _contentCaseStudies,
    },
  },

  backend: {
    collectionTypes: {
      form: 3,
      content: 3,
      total: 6,
      formNames: [
        "Service Request",
        "Contact Inquiry",
        "Quotation",
      ] as readonly string[],
      contentNames: ["Article", "Tutorial", "Case Study"] as readonly string[],
    },
    singleTypes: {
      count: 4,
      names: [
        "Site Settings",
        "SEO Defaults",
        "Navigation",
        "Company Profile",
      ] as readonly string[],
    },
    sharedComponents: {
      form: 8,
      content: 10,
      total: 18,
    },
    apiEndpoints: 24,
  },

  security: {
    layers: 7,
    layerNames: [
      "Rate Limiting",
      "CSRF Protection",
      "Input Sanitization",
      "Server Validation",
      "Hydration Guards",
      "Environment Validation",
      "Safe Error Handling",
    ] as readonly string[],
    owaspThreats: 10,
    securityModules: 3,
    moduleFiles: [
      "csrf.ts",
      "index.ts",
      "rate-limiter.ts",
    ] as readonly string[],
  },

  serverActions: {
    count: 4,
    files: [
      "contact-request",
      "quotation-request",
      "render-email",
      "service-request",
    ] as readonly string[],
  },

  /** Content stats are computed from the ACTUAL data arrays at import time */
  content: {
    articles: _contentArticles,
    caseStudies: _contentCaseStudies,
    tutorials: _contentTutorials,
    totalItems: _contentTotal,
    articleCategories: _articleCategories,
    caseStudyCategories: _caseStudyCategories,
    tutorialCategories: _tutorialCategories,
  },
} as const;

// ---------------------------------------------------------------------------
// LABELS - Reusable display strings to keep messaging consistent
// ---------------------------------------------------------------------------

export const LABELS = {
  frontend: {
    title: "Frontend & Integration",
    subtitle:
      "Next.js 15 App Router with Atomic Design, Hydration Guards, and 7-layer security",
    componentsStat: `${STATS.frontend.components.total} Custom Components`,
    securityStat: `${STATS.security.layers} Security Layers`,
    techStack:
      "Next.js 15 / React 19 / TypeScript / Tailwind CSS v4 / Framer Motion / Zustand / Zod",
  },
  backend: {
    title: "Backend & CMS",
    subtitle: "Strapi 5 headless CMS with PostgreSQL, REST & GraphQL APIs",
    collectionsStat: `${STATS.backend.collectionTypes.form + STATS.backend.collectionTypes.content} Collection Types`,
    componentsStat: `${STATS.backend.sharedComponents.form + STATS.backend.sharedComponents.content} Shared Components`,
  },
  content: {
    title: "Content Library",
    subtitle: "Technical articles, tutorials, and case studies",
  },
} as const;

// ---------------------------------------------------------------------------
// ROUTES - All doc system routes for navigation and validation
// ---------------------------------------------------------------------------

export const ROUTES = {
  frontend: {
    overview: "/dashboard/documentation/app-reference",
    architecture: "/dashboard/documentation/app-reference/component-system",
    hydration: "/dashboard/documentation/app-reference/hydration-and-guards",
    gettingStarted: "/dashboard/documentation/app-reference/getting-started",
    serverVsClient: "/dashboard/documentation/app-reference/server-vs-client",
    security: "/dashboard/documentation/app-reference/security-architecture",
    performance:
      "/dashboard/documentation/app-reference/performance-and-caching",
    apiIntegration:
      "/dashboard/documentation/app-reference/server-actions-and-api",
    emailNotifications: "/dashboard/documentation/app-reference/email-system",
    testing: "/dashboard/documentation/infrastructure-and-ops/testing-strategy",
    deployment: "/dashboard/documentation/infrastructure-and-ops/deployment",
    troubleshooting:
      "/dashboard/documentation/infrastructure-and-ops/troubleshooting",
    codeReview: "/dashboard/documentation/strategic-overview/code-review-log",
  },
  backend: {
    overview: "/dashboard/documentation/cms-reference/overview",
    whyStrapi: "/dashboard/documentation/strategic-overview/why-strapi",
    gettingStarted: "/dashboard/documentation/cms-reference/getting-started",
    formCollections: "/dashboard/documentation/cms-reference/form-collections",
    contentCollections:
      "/dashboard/documentation/cms-reference/content-collections",
    singleTypes: "/dashboard/documentation/cms-reference/single-types",
    sharedComponents:
      "/dashboard/documentation/cms-reference/shared-components",
    relationships: "/dashboard/documentation/cms-reference/relationships",
    api: "/dashboard/documentation/infrastructure-and-ops/api-and-graphql",
    operations:
      "/dashboard/documentation/infrastructure-and-ops/cms-operations",
  },
  strategicOverview: {
    overview: "/dashboard/documentation/strategic-overview/overview",
    whyStrapi: "/dashboard/documentation/strategic-overview/why-strapi",
    appOverview: "/dashboard/documentation/strategic-overview/app-overview",
    gettingStarted:
      "/dashboard/documentation/strategic-overview/getting-started",
    codeReviewLog:
      "/dashboard/documentation/strategic-overview/code-review-log",
  },
  admin: {
    overview: "/dashboard/admin",
    documentAdministration: "/dashboard/admin/document-administration",
    documentationHealth:
      "/dashboard/admin/document-administration/documentation-health",
    gapAnalysis:
      "/dashboard/admin/document-administration/documentation-health/gap-analysis",
    qualityEngineering:
      "/dashboard/admin/document-administration/quality-engineering",
    countValidation:
      "/dashboard/admin/document-administration/quality-engineering/count-validation",
    routeVerification:
      "/dashboard/admin/document-administration/quality-engineering/route-verification",
    tocIntegrity:
      "/dashboard/admin/document-administration/quality-engineering/toc-integrity",
    patternCompliance:
      "/dashboard/admin/document-administration/quality-engineering/pattern-compliance",
    fixActions:
      "/dashboard/admin/document-administration/quality-engineering/fix-actions",
    emailTemplates: "/dashboard/admin/email-templates",
    emailSend: "/dashboard/admin/email-send",
    emailLogs: "/dashboard/admin/email-logs",
    emailSecurity: "/dashboard/admin/email-security",
    emailVersions: "/dashboard/admin/email-versions",
    emailSubjects: "/dashboard/admin/email-subjects",
    emailRecipients: "/dashboard/admin/email-recipients",
    emailScheduling: "/dashboard/admin/email-scheduling",
  },
  contentLibrary: {
    articles: "/dashboard/content-library/articles",
    caseStudies: "/dashboard/content-library/case-studies",
    tutorials: "/dashboard/content-library/tutorials",
  },
} as const;

/** Flat list of all valid routes for route verification */
export const ALL_ROUTES = [
  ...Object.values(ROUTES.frontend),
  ...Object.values(ROUTES.backend),
  ...Object.values(ROUTES.admin),
  ...Object.values(ROUTES.contentLibrary),
] as const;

// ---------------------------------------------------------------------------
// ARCHITECTURE - Structural constants for diagrams and reference
// ---------------------------------------------------------------------------

export const ARCHITECTURE = {
  layers: [
    {
      name: "Browser",
      items: [
        "React 19 SPA",
        "Framer Motion",
        "Zustand Store",
        "Hydration Guard",
      ],
    },
    {
      name: "Next.js API Layer",
      items: [
        "App Router",
        "Server Components",
        "Server Actions",
        "Route Handlers",
      ],
    },
    { name: "Security Pipeline", items: STATS.security.layerNames },
    {
      name: "Strapi CMS",
      items: [
        `${STATS.backend.collectionTypes.form + STATS.backend.collectionTypes.content} Collection Types`,
        `${STATS.backend.singleTypes.count} Single Types`,
        `${STATS.backend.sharedComponents.total} Shared Components`,
        "Media Library",
      ],
    },
    {
      name: "PostgreSQL",
      items: [
        "Content Storage",
        "Form Submissions",
        "User Sessions",
        "Media Metadata",
      ],
    },
  ],
  atomicDesign: {
    atoms: {
      frontend: "Form inputs, buttons, labels",
      backend: "Field configurations",
    },
    molecules: {
      frontend: "Form groups, cards, navigation",
      backend: "Strapi Components",
    },
    organisms: {
      frontend: "Form containers, page sections",
      backend: "Collection Types",
    },
    templates: {
      frontend: "Page layouts, form wizards",
      backend: "Single Types",
    },
    pages: { frontend: "Next.js route pages", backend: "API Endpoints" },
  },
} as const;

// ---------------------------------------------------------------------------
// MANAGEMENT DOCS - Registry of all non-Content-Library doc pages
// ---------------------------------------------------------------------------
// Every standalone doc page outside the Content Library is registered here.
// This enables the admin audit tools to track coverage, detect missing pages,
// and report last-updated staleness.

export type DocAudience =
  | "CTO / Project Lead"
  | "Developer / Architect"
  | "DevOps / WebAdmin"
  | "DevOps / Developer"
  | "Business Admin / Office Staff"
  | "QA / Testing"
  | "All Roles";

export type DocStatus = "active" | "stub" | "deprecated" | "needs-review";

export interface ManagementDoc {
  slug: string;
  title: string;
  route: string;
  section: string;
  audience: DocAudience;
  lastUpdated: string;
  status: DocStatus;
  usesDocPage: boolean;
}

export const MANAGEMENT_DOCS: ManagementDoc[] = [
  // -- Strategic Overview --
  {
    slug: "getting-started",
    title: "Getting Started",
    route: "/dashboard/documentation/strategic-overview/getting-started",
    section: "Strategic Overview",
    audience: "All Roles",
    lastUpdated: "2026-02-11",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "overview",
    title: "Overview",
    route: "/dashboard/documentation/strategic-overview/overview",
    section: "Strategic Overview",
    audience: "All Roles",
    lastUpdated: "2026-02-11",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "why-strapi",
    title: "Why Strapi (CTO)",
    route: "/dashboard/documentation/strategic-overview/why-strapi",
    section: "Strategic Overview",
    audience: "CTO / Project Lead",
    lastUpdated: "2026-02-11",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "app-overview",
    title: "App Overview",
    route: "/dashboard/documentation/strategic-overview/app-overview",
    section: "Strategic Overview",
    audience: "CTO / Project Lead",
    lastUpdated: "2026-02-11",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "code-review-log",
    title: "Code Review Log",
    route: "/dashboard/documentation/strategic-overview/code-review-log",
    section: "Strategic Overview",
    audience: "CTO / Project Lead",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },

  // -- CMS Reference --
  {
    slug: "cms-reference-overview",
    title: "Overview",
    route: "/dashboard/documentation/cms-reference/overview",
    section: "CMS Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-11",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "cms-getting-started",
    title: "Getting Started",
    route: "/dashboard/documentation/cms-reference/getting-started",
    section: "CMS Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-11",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "form-collections",
    title: "Form Collections",
    route: "/dashboard/documentation/cms-reference/form-collections",
    section: "CMS Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "content-collections",
    title: "Content Collections",
    route: "/dashboard/documentation/cms-reference/content-collections",
    section: "CMS Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "single-types",
    title: "Single Types",
    route: "/dashboard/documentation/cms-reference/single-types",
    section: "CMS Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "shared-components",
    title: "Shared Components",
    route: "/dashboard/documentation/cms-reference/shared-components",
    section: "CMS Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "relationships",
    title: "Relationships",
    route: "/dashboard/documentation/cms-reference/relationships",
    section: "CMS Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },

  // -- App Reference --
  {
    slug: "app-reference-overview",
    title: "Overview",
    route: "/dashboard/documentation/app-reference/overview",
    section: "App Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-11",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "app-getting-started",
    title: "Getting Started",
    route: "/dashboard/documentation/app-reference/getting-started",
    section: "App Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "component-system",
    title: "Component System",
    route: "/dashboard/documentation/app-reference/component-system",
    section: "App Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "hydration-and-guards",
    title: "Hydration & Guards",
    route: "/dashboard/documentation/app-reference/hydration-and-guards",
    section: "App Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "server-vs-client",
    title: "Server vs Client",
    route: "/dashboard/documentation/app-reference/server-vs-client",
    section: "App Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "server-actions-and-api",
    title: "Server Actions & API",
    route: "/dashboard/documentation/app-reference/server-actions-and-api",
    section: "App Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "email-system",
    title: "Email System",
    route: "/dashboard/documentation/app-reference/email-system",
    section: "App Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "security-architecture",
    title: "Security Architecture",
    route: "/dashboard/documentation/app-reference/security-architecture",
    section: "App Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "performance-and-caching",
    title: "Performance & Caching",
    route: "/dashboard/documentation/app-reference/performance-and-caching",
    section: "App Reference",
    audience: "Developer / Architect",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },

  // -- Infrastructure & Ops --
  {
    slug: "infrastructure-overview",
    title: "Overview",
    route: "/dashboard/documentation/infrastructure-and-ops/overview",
    section: "Infrastructure & Ops",
    audience: "DevOps / WebAdmin",
    lastUpdated: "2026-02-11",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "infrastructure-getting-started",
    title: "Getting Started",
    route: "/dashboard/documentation/infrastructure-and-ops/getting-started",
    section: "Infrastructure & Ops",
    audience: "DevOps / WebAdmin",
    lastUpdated: "2026-02-11",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "api-and-graphql",
    title: "API & GraphQL",
    route: "/dashboard/documentation/infrastructure-and-ops/api-and-graphql",
    section: "Infrastructure & Ops",
    audience: "DevOps / Developer",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "cms-operations",
    title: "CMS Operations",
    route: "/dashboard/documentation/infrastructure-and-ops/cms-operations",
    section: "Infrastructure & Ops",
    audience: "DevOps / WebAdmin",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "testing-strategy",
    title: "Testing Strategy",
    route: "/dashboard/documentation/infrastructure-and-ops/testing-strategy",
    section: "Infrastructure & Ops",
    audience: "QA / Testing",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "deployment",
    title: "Deployment",
    route: "/dashboard/documentation/infrastructure-and-ops/deployment",
    section: "Infrastructure & Ops",
    audience: "DevOps / WebAdmin",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    route: "/dashboard/documentation/infrastructure-and-ops/troubleshooting",
    section: "Infrastructure & Ops",
    audience: "DevOps / WebAdmin",
    lastUpdated: "2026-02-10",
    status: "active",
    usesDocPage: true,
  },
];

/** Computed management doc stats */
export const MANAGEMENT_DOC_STATS = {
  total: MANAGEMENT_DOCS.length,
  bySection: MANAGEMENT_DOCS.reduce(
    (acc, doc) => {
      acc[doc.section] = (acc[doc.section] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  ),
  usingDocPage: MANAGEMENT_DOCS.filter((d) => d.usesDocPage).length,
  notUsingDocPage: MANAGEMENT_DOCS.filter((d) => !d.usesDocPage).length,
  byStatus: MANAGEMENT_DOCS.reduce(
    (acc, doc) => {
      acc[doc.status] = (acc[doc.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  ),
};

// ---------------------------------------------------------------------------
// DOC SYSTEM HEALTH - Defines what a healthy doc system looks like
// ---------------------------------------------------------------------------

export const DOC_HEALTH = {
  /** Pages that consume stats from this manifest (must be migrated to use imports) */
  consumers: [
    "app/dashboard/page.tsx",
    "app/(dashboard)/dashboard/documentation/[category]/[slug]/page.tsx",
    "app/(dashboard)/dashboard/admin/document-administration/documentation-health/page.tsx",
    "app/(dashboard)/dashboard/admin/document-administration/quality-engineering/route-verification/page.tsx",
    "app/(dashboard)/dashboard/admin/page.tsx",
  ],
  /** Change types and which manifest sections they affect */
  changeImpact: {
    "Add/remove component file": [
      "COMPONENT_COUNTS",
      "STATS.frontend.components",
    ],
    "Add/remove article data": [
      "STATS.content (auto)",
      "STATS.frontend.contentPages",
    ],
    "Add/remove case study data": [
      "STATS.content (auto)",
      "STATS.frontend.contentPages",
    ],
    "Add/remove tutorial data": ["STATS.content (auto)"],
    "Add/remove security module": ["STATS.security", "ARCHITECTURE.layers"],
    "Add/remove server action": ["STATS.serverActions"],
    "Add/remove page route": ["ROUTES", "ALL_ROUTES"],
    "Change backend schema": ["STATS.backend", "ARCHITECTURE.layers"],
  },
} as const;
