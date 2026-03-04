/**
 * Seed: digital-marketing management-page record
 *
 * docker exec v0_strapi sh -c 'export $(grep -v "^#" /app/.env | grep -v "^$" | xargs) && STRAPI_URL=http://127.0.0.1:1337 STRAPI_API_TOKEN=$SEED_TOKEN node /app/scripts/seed-digital-marketing.mjs'
 */

const STRAPI_URL = process.env.STRAPI_URL || "http://127.0.0.1:1337";
const TOKEN = process.env.STRAPI_API_TOKEN;
if (!TOKEN) { console.error("ERROR: STRAPI_API_TOKEN not set"); process.exit(1); }

const headers = { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` };

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  if (!res.ok) { console.error(`HTTP ${res.status}: ${text}`); throw new Error(`Failed: ${res.status}`); }
  return JSON.parse(text);
}

const existing = await fetchJSON(`${STRAPI_URL}/api/management-pages?filters[section][$eq]=digital-marketing`);
if (existing.data?.length > 0) { console.log("digital-marketing already seeded — skipping."); process.exit(0); }

const payload = {
  data: {
    section: "digital-marketing",
    header: {
      icon: "Megaphone",
      title: "Digital Marketing",
      description: "Centralized platform marketing for your electrical services business. Manage your presence on Google, LinkedIn, Twitter/X, and Facebook with professional tools for content creation, SEO, advertising, and analytics.",
    },
    notice: {
      icon: "Lock",
      title: "Authentication Required",
      description: "In production, Digital Marketing tools require authentication. Role-based access control will restrict platform management based on user permissions. Currently in development mode for demonstration.",
      noticeType: "warning",
    },
    quickStats: [
      { statId: "platforms", label: "Platforms", value: "4", description: "Google, LinkedIn, Twitter, Facebook" },
      { statId: "active-tools", label: "Active Tools", value: "7", description: "Google platform suite" },
      { statId: "total-pages", label: "Total Pages", value: "13", description: "Across all platforms" },
      { statId: "status", label: "Status", value: "Active", description: "Google platform live" },
    ],
    quickLinks: [
      { linkId: "getting-started", icon: "Rocket", title: "Getting Started", description: "Role-based onboarding guide for the Digital Marketing section", href: "/dashboard/admin/digital-marketing/getting-started" },
      { linkId: "content-strategy", icon: "TrendingUp", title: "Content Strategy", description: "Editorial calendar, distribution channels, and content pipeline", href: "/dashboard/admin/digital-marketing/content-strategy" },
    ],
    platforms: [
      {
        platformId: "google",
        title: "Google",
        description: "Business Profile, SEO, Tag Manager, Ads & Campaigns, Analytics, and Content Composer. Full ecosystem management.",
        icon: "Search",
        href: "/dashboard/admin/digital-marketing/google",
        status: "Active",
        badge: "7 Tools",
        badgeColor: "blue",
        iconColor: "blue",
        pageItems: [
          { itemLabel: "Business Profile & FAQs", icon: "Building2" },
          { itemLabel: "SEO & Site Optimization", icon: "Search" },
          { itemLabel: "Tag Manager", icon: "Tag" },
          { itemLabel: "Ads & Campaigns", icon: "DollarSign" },
          { itemLabel: "Analytics & Reporting", icon: "LineChart" },
          { itemLabel: "Content Composer", icon: "PenSquare" },
        ],
      },
      {
        platformId: "linkedin",
        title: "LinkedIn",
        description: "Company page management, professional post composer, article publishing, and B2B engagement strategy.",
        icon: "Share2",
        href: "/dashboard/admin/digital-marketing/linkedin",
        status: "Coming Soon",
        badge: "B2B Focus",
        badgeColor: "sky",
        iconColor: "sky",
        pageItems: [],
      },
      {
        platformId: "twitter",
        title: "Twitter/X",
        description: "Tweet composer with character limits, thread builder, hashtag strategy, and real-time engagement tracking.",
        icon: "Globe",
        href: "/dashboard/admin/digital-marketing/twitter",
        status: "Coming Soon",
        badge: "Quick Updates",
        badgeColor: "neutral",
        iconColor: "neutral",
        pageItems: [],
      },
      {
        platformId: "facebook",
        title: "Facebook",
        description: "Business page management, post composer, event creation, community engagement, and Messenger configuration.",
        icon: "Users",
        href: "/dashboard/admin/digital-marketing/facebook",
        status: "Coming Soon",
        badge: "Community",
        badgeColor: "indigo",
        iconColor: "indigo",
        pageItems: [],
      },
    ],
    publishedAt: new Date().toISOString(),
  },
};

const result = await fetchJSON(`${STRAPI_URL}/api/management-pages`, { method: "POST", body: JSON.stringify(payload) });
console.log(`✅ digital-marketing seeded — documentId: ${result.data?.documentId}`);
