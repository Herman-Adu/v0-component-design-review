/**
 * Seed Management Pages — admin-overview record
 *
 * Creates the `management-page` entry for the admin overview section.
 * Data sourced from apps/ui/data/strapi-mock/dashboard/admin-overview.json.
 *
 * Usage (inside Strapi container where SEED_TOKEN is available):
 *   node apps/strapi/scripts/seed-management-pages.mjs
 *
 * Or via docker exec (token stays in container env):
 *   docker exec v0_strapi sh -c "node /app/scripts/seed-management-pages.mjs"
 */

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const SEED_TOKEN = process.env.SEED_TOKEN;

if (!SEED_TOKEN) {
  console.error('ERROR: SEED_TOKEN env var required.');
  process.exit(1);
}

async function strapiPost(path, data) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SEED_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  const json = await res.json();
  return { status: res.status, body: json };
}

async function strapiGet(path) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    headers: { Authorization: `Bearer ${SEED_TOKEN}` },
  });
  return res.json();
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const adminOverview = {
  section: 'admin',
  header: {
    icon: 'ShieldCheck',
    title: 'Admin Dashboard',
    description:
      'Centralized administration for managing documentation health, content tools, and system settings. Run health checks, validate data integrity, and maintain the documentation library at scale.',
  },
  notice: {
    icon: 'Lock',
    title: 'Authentication Required',
    description:
      'In production, all admin features will require authentication. Role-based access control (RBAC) will restrict features based on user permissions. Currently in development mode for demonstration.',
    noticeType: 'warning',
  },
  quickStats: [
    {
      statId: 'content-items',
      label: 'Content Items',
      value: 'dynamic',
      description: 'Articles, case studies, and tutorials',
      source: 'content-library',
    },
    {
      statId: 'doc-pages',
      label: 'Doc Pages',
      value: '35',
      description: 'Across 4 major sections',
    },
    {
      statId: 'admin-tools',
      label: 'Admin Tools',
      value: '9',
      description: 'Doc health, QA, and content',
    },
    {
      statId: 'health-score',
      label: 'Health Score',
      value: '98%',
      description: 'Documentation quality',
    },
  ],
  toolSections: [
    {
      sectionId: 'doc-system',
      title: 'Documentation System',
      description:
        'Health monitoring, gap analysis, quality assurance, and automated remediation tools.',
      icon: 'HeartPulse',
      tools: [
        {
          itemId: 'health-overview',
          href: '/dashboard/admin/document-administration/documentation-health',
          icon: 'Activity',
          title: 'Health Overview',
          description:
            'System-wide health dashboard with real-time stats, coverage tracking, and changelog history.',
          status: 'Available',
          badge: 'Doc Health',
          badgeColor: 'cyan',
        },
        {
          itemId: 'gap-analysis',
          href: '/dashboard/admin/document-administration/documentation-health/gap-analysis',
          icon: 'Compass',
          title: 'Gap Analysis',
          description:
            'Identify missing content areas, under-covered topics, and opportunities for new documentation.',
          status: 'Available',
          badge: 'Doc Health',
          badgeColor: 'cyan',
        },
        {
          itemId: 'doc-qa',
          href: '/dashboard/admin/document-administration/quality-engineering',
          icon: 'FlaskConical',
          title: 'Doc QA Overview',
          description:
            'Automated documentation quality assurance hub with 5 validation tools and remediation workflow.',
          status: 'Available',
          badge: 'Doc QA',
          badgeColor: 'violet',
        },
        {
          itemId: 'count-validation',
          href: '/dashboard/admin/document-administration/documentation-health/count-validation',
          icon: 'SearchCheck',
          title: 'Count Validation',
          description:
            'Validate that all overview pages, listing pages, and stat cards display accurate counts matching the data layer.',
          status: 'Available',
          badge: 'Doc QA',
          badgeColor: 'violet',
        },
        {
          itemId: 'route-verification',
          href: '/dashboard/admin/document-administration/documentation-health/route-verification',
          icon: 'Link2',
          title: 'Route Verification',
          description:
            'Verify every sidebar nav link, cross-reference href, and content slug resolves to an existing page.',
          status: 'Available',
          badge: 'Doc QA',
          badgeColor: 'violet',
        },
        {
          itemId: 'toc-integrity',
          href: '/dashboard/admin/document-administration/documentation-health/toc-integrity',
          icon: 'ClipboardCheck',
          title: 'TOC Integrity',
          description:
            'Ensure table of contents links point to valid heading anchors within each documentation page.',
          status: 'Available',
          badge: 'Doc QA',
          badgeColor: 'violet',
        },
        {
          itemId: 'auto-remediation',
          href: '/dashboard/admin/document-administration/quality-engineering/auto-remediation',
          icon: 'Wrench',
          title: 'Auto Remediation',
          description:
            'One-click fixes for common issues: stale counts, missing anchors, broken cross-references.',
          status: 'Available',
          badge: 'Doc QA',
          badgeColor: 'violet',
        },
      ],
    },
    {
      sectionId: 'content-tools',
      title: 'Content & Marketing Tools',
      description:
        'Digital marketing management, email preview, and content pipeline for scaling content production.',
      icon: 'Share2',
      tools: [
        {
          itemId: 'digital-marketing',
          href: '/dashboard/admin/digital-marketing',
          icon: 'Megaphone',
          title: 'Digital Marketing',
          description:
            'Platform marketing for Google, LinkedIn, Twitter/X, and Facebook. SEO, ads, content composers, and analytics.',
          status: 'Available',
          badge: 'Marketing',
          badgeColor: 'accent',
        },
        {
          itemId: 'email-preview',
          href: '/dashboard/admin/email-administration/configuration/email-preview',
          icon: 'MailCheck',
          title: 'Email Preview',
          description:
            'Preview and test email templates before sending to customers and business notifications.',
          status: 'Available',
          badge: 'Content',
          badgeColor: 'accent',
        },
        {
          itemId: 'content-pipeline',
          href: '/dashboard/admin/document-administration/documentation-health/gap-analysis',
          icon: 'Target',
          title: 'Content Pipeline',
          description:
            '10-pass gap analysis with review log scanning, audience coverage, and batch content pipeline.',
          status: 'Available',
          badge: 'Pipeline',
          badgeColor: 'teal',
        },
      ],
    },
  ],
  upcomingTitle: 'Upcoming Features',
  upcomingDescription: 'Planned enhancements to the admin dashboard for future releases.',
  upcomingFeatures: [
    {
      featureId: 'user-management',
      icon: 'Users',
      title: 'User Management',
      description:
        'Manage user accounts, roles, and permissions for team members and administrators.',
      status: 'Coming Soon',
    },
    {
      featureId: 'analytics',
      icon: 'BarChart3',
      title: 'Analytics Dashboard',
      description: 'Track form submissions, user engagement, and business metrics in real-time.',
      status: 'Planned',
    },
    {
      featureId: 'settings',
      icon: 'Settings',
      title: 'System Settings',
      description: 'Configure application settings, email providers, and integration options.',
      status: 'Planned',
    },
  ],
  cta: {
    title: 'Need Help?',
    description:
      'Visit the documentation section for guides on using admin tools, running health checks, and troubleshooting common issues.',
    linkText: 'View Admin Documentation',
    linkHref: '/dashboard/documentation/app-reference/admin-tools',
    linkIcon: 'ArrowRight',
  },
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱 Seed Management Pages');
  console.log(`   Target: ${STRAPI_URL}\n`);

  // Check if already exists
  const existing = await strapiGet('/api/management-pages?filters[section][$eq]=admin');
  if (existing.data?.length > 0) {
    console.log('✓ Admin overview already seeded — skipping');
    return;
  }

  const { status, body } = await strapiPost('/api/management-pages', adminOverview);

  if (status === 200 || status === 201) {
    console.log(`✓ Admin overview seeded — documentId: ${body.data?.documentId}`);
  } else {
    console.error(`✗ [${status}] Seed failed:`, JSON.stringify(body?.error ?? body, null, 2));
    process.exit(1);
  }

  console.log('\n✅ Done\n');
}

seed().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
