/**
 * Seed script: email-management management-page record
 *
 * Run via:
 * docker exec v0_strapi sh -c 'export $(grep -v "^#" /app/.env | grep -v "^$" | xargs) && STRAPI_URL=http://127.0.0.1:1337 STRAPI_API_TOKEN=$SEED_TOKEN node /app/scripts/seed-email-management.mjs'
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

const existing = await fetchJSON(
  `${STRAPI_URL}/api/management-pages?filters[section][$eq]=email-management`
);

if (existing.data?.length > 0) {
  console.log("email-management management-page already seeded — skipping.");
  process.exit(0);
}

const payload = {
  data: {
    section: "email-management",
    header: {
      icon: "Mail",
      title: "Email Management",
      description:
        "Unified hub for request handling, email configuration, and infrastructure. Manage client communications, template branding, and technical monitoring from a centralized dashboard.",
    },
    pageSections: [
      {
        sectionId: "request-management",
        title: "Request Management",
        description:
          "Day-to-day handling of client requests. Job tracking, status pipeline, branded correspondence, team assignment, and bulk operations across all form submission types.",
        icon: "Briefcase",
        href: "/dashboard/admin/email-management/request-management",
        role: "Business Administrator / Office Staff",
        pages: 3,
        color: "amber",
      },
      {
        sectionId: "configuration",
        title: "Configuration",
        description:
          "Brand identity, templates, preview, A/B subject lines, recipient groups, and scheduling. Control how emails look and behave without touching code.",
        icon: "Palette",
        href: "/dashboard/admin/email-management/configuration",
        role: "Business Admin / Project Lead",
        pages: 6,
        color: "blue",
      },
      {
        sectionId: "infrastructure",
        title: "Infrastructure",
        description:
          "Technical monitoring and operational tools. API health, delivery logs, configuration versioning, and a comprehensive 21-check security audit.",
        icon: "HardDrive",
        href: "/dashboard/admin/email-management/infrastructure",
        role: "Web Administrator / DevOps / CTO",
        pages: 5,
        color: "red",
      },
    ],
    highlights: [
      {
        itemId: "branded-correspondence",
        icon: "MessageSquare",
        title: "Branded Correspondence",
        description:
          "Send professional reply emails with configurable sections, presets, and live preview.",
      },
      {
        itemId: "security",
        icon: "Shield",
        title: "7-Layer Security",
        description:
          "Rate limiting, CSRF, honeypot, XSS sanitization, Zod validation, API key masking, and env security.",
      },
      {
        itemId: "sla-tracking",
        icon: "Clock",
        title: "SLA Tracking",
        description:
          "Priority-based response times with urgency-specific styling and team routing.",
      },
      {
        itemId: "resend-integration",
        icon: "Server",
        title: "Resend Integration",
        description:
          "Production-ready email delivery via Resend API with full delivery pipeline observability.",
      },
      {
        itemId: "role-based-access",
        icon: "Users",
        title: "Role-Based Access",
        description:
          "Sections organized by role: Office Staff, Business Admins, Project Leads, and DevOps.",
      },
      {
        itemId: "config-driven",
        icon: "Palette",
        title: "Config-Driven Templates",
        description:
          "All brand colors, company details, and SLA settings driven from a single config file, Strapi-ready.",
      },
    ],
    quickLinks: [
      {
        linkId: "getting-started",
        icon: "Rocket",
        title: "Getting Started",
        description: "Role-based onboarding for email administrators",
        href: "/dashboard/admin/email-management/getting-started",
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
  `✅ email-management seeded — documentId: ${result.data?.documentId}`
);
