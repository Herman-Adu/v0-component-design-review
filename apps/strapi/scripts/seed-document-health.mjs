/**
 * Seed script: document-health management-page record
 *
 * Run via:
 * docker exec v0_strapi sh -c 'export $(grep -v "^#" /app/.env | xargs) && STRAPI_URL=http://127.0.0.1:1337 node /app/scripts/seed-document-health.mjs'
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;

if (!TOKEN) {
  console.error("ERROR: STRAPI_API_TOKEN not set");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${TOKEN}`,
};

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  if (!res.ok) {
    console.error(`HTTP ${res.status}: ${text}`);
    throw new Error(`Request failed: ${res.status}`);
  }
  return JSON.parse(text);
}

// Check if document-health record already exists
const existing = await fetchJSON(
  `${STRAPI_URL}/api/management-pages?filters[section][$eq]=document-health`
);

if (existing.data?.length > 0) {
  console.log("document-health management-page already seeded — skipping.");
  process.exit(0);
}

const payload = {
  data: {
    section: "document-health",
    header: {
      icon: "FileCheck",
      title: "Document Health",
      description:
        "Strategic oversight and automated quality assurance for documentation. Monitor content health, identify gaps, validate integrity, and maintain consistency at scale.",
    },
    pageSections: [
      {
        sectionId: "documentation-health",
        title: "Documentation Health",
        description:
          "Strategic oversight of documentation coverage, content planning, and gap analysis. Track what exists, identify what is missing, and plan future content using the Gap Discovery Engine.",
        icon: "HeartPulse",
        href: "/dashboard/admin/document-health/documentation-health",
        role: "Project Lead / CTO",
        pages: 2,
        color: "emerald",
      },
      {
        sectionId: "quality-engineering",
        title: "Quality Engineering",
        description:
          "Automated validation tools for route verification, count accuracy, TOC integrity, pattern compliance, and bulk fix actions. Ensures documentation stays consistent and correct at scale.",
        icon: "FlaskConical",
        href: "/dashboard/admin/document-health/quality-engineering",
        role: "Web Administrator / DevOps / QA",
        pages: 6,
        color: "violet",
      },
    ],
    highlights: [
      {
        itemId: "gap-discovery",
        icon: "Compass",
        title: "Gap Discovery Engine",
        description:
          "Automated scanning identifies undocumented routes, missing articles, and content coverage gaps.",
      },
      {
        itemId: "count-validation",
        icon: "SearchCheck",
        title: "Count Validation",
        description:
          "Verifies data array counts match documentation claims. Catches stale numbers automatically.",
      },
      {
        itemId: "route-verification",
        icon: "Link2",
        title: "Route Verification",
        description:
          "Checks every sidebar navigation link resolves to a real page. Zero broken links guaranteed.",
      },
      {
        itemId: "toc-integrity",
        icon: "ClipboardCheck",
        title: "TOC Integrity",
        description:
          "Validates table of contents anchors match section IDs. Prevents navigation errors.",
      },
      {
        itemId: "auto-remediation",
        icon: "Wrench",
        title: "Auto Remediation",
        description:
          "One-click fixes for common issues. Update counts, add missing anchors, repair cross-references.",
      },
      {
        itemId: "pattern-compliance",
        icon: "Shield",
        title: "Pattern Compliance",
        description:
          "Audits components for atomic design adherence and consistent data-driven patterns.",
      },
    ],
    quickLinks: [
      {
        linkId: "getting-started",
        icon: "Rocket",
        title: "Getting Started",
        description: "Onboarding guide for documentation administrators",
        href: "/dashboard/admin/document-health/getting-started",
      },
      {
        linkId: "metrics",
        icon: "BarChart3",
        title: "Metrics & Analytics",
        description: "Track documentation health scores and quality trends",
        href: "/dashboard/admin/document-health/metrics",
      },
    ],
    publishedAt: new Date().toISOString(),
  },
};

const result = await fetchJSON(`${STRAPI_URL}/api/management-pages`, {
  method: "POST",
  body: JSON.stringify(payload),
});

console.log(
  `✅ document-health seeded — documentId: ${result.data?.documentId}`
);
