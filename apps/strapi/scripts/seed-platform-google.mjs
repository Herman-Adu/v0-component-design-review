/**
 * Seed: google platform-page record
 *
 * docker exec v0_strapi sh -c 'export $(grep -v "^#" /app/.env | grep -v "^$" | xargs) && STRAPI_URL=http://127.0.0.1:1337 STRAPI_API_TOKEN=$SEED_TOKEN node /app/scripts/seed-platform-google.mjs'
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

const existing = await fetchJSON(`${STRAPI_URL}/api/platform-pages?filters[platform][$eq]=google`);
if (existing.data?.length > 0) { console.log("google platform-page already seeded — skipping."); process.exit(0); }

const payload = {
  data: {
    platform: "google",
    header: {
      icon: "Search",
      title: "Google Marketing",
      description: "Full-stack Google presence management for electrical services",
    },
    introTitle: "Google Ecosystem",
    introText: "This section covers the full Google marketing stack: from establishing your Business Profile and optimising for search, to running ads, tracking conversions, and composing Google Business posts. Each tool is designed specifically for electrical service businesses.",
    ecosystemPhases: [
      { title: "Attract", description: "Drive qualified traffic to your site", items: ["SEO & Site Optimization", "Google Ads & Campaigns"] },
      { title: "Convert", description: "Turn visitors into leads and customers", items: ["Business Profile & FAQs", "Content Composer"] },
      { title: "Measure", description: "Track performance and optimise spend", items: ["Tag Manager", "Analytics & Reporting"] },
    ],
    tools: [
      { itemId: "business-profile", href: "/dashboard/admin/digital-marketing/google/business-profile", icon: "Building2", title: "Business Profile & FAQs", description: "Google Business Profile setup, NAP consistency, FAQ management, review response templates, and local SEO signals.", badge: "Business Owner / Marketing Lead", status: "Available" },
      { itemId: "seo", href: "/dashboard/admin/digital-marketing/google/seo", icon: "Search", title: "SEO & Site Optimization", description: "On-page SEO audit checklists, structured data markup, XML sitemap, Core Web Vitals, and keyword strategy for electrical services.", badge: "Developer / Marketing Lead", status: "Available" },
      { itemId: "tag-manager", href: "/dashboard/admin/digital-marketing/google/tag-manager", icon: "Tag", title: "Tag Manager", description: "GTM container setup, event tracking tags, conversion tracking for Google Ads and GA4, custom events, and trigger management.", badge: "Developer / Technical Admin", status: "Available" },
      { itemId: "ads-campaigns", href: "/dashboard/admin/digital-marketing/google/ads-campaigns", icon: "DollarSign", title: "Ads & Campaigns", description: "Campaign structure for search, display, and local services ads. Budget allocation, bidding strategy, ad copy templates, and negative keywords.", badge: "Business Owner / Marketing Lead", status: "Available" },
      { itemId: "analytics", href: "/dashboard/admin/digital-marketing/google/analytics", icon: "LineChart", title: "Analytics & Reporting", description: "GA4 setup, key metrics dashboard, goal configuration, custom report templates, and attribution model guidance.", badge: "All Roles", status: "Available" },
      { itemId: "composer", href: "/dashboard/admin/digital-marketing/google/composer", icon: "PenSquare", title: "Content Composer", description: "Compose Google Business posts with character limits, post type selection, image sizing, CTA buttons, and live preview.", badge: "Content Creator / Marketing Lead", status: "Available" },
    ],
    publishedAt: new Date().toISOString(),
  },
};

const result = await fetchJSON(`${STRAPI_URL}/api/platform-pages`, { method: "POST", body: JSON.stringify(payload) });
console.log(`✅ google platform-page seeded — documentId: ${result.data?.documentId}`);
