/**
 * Seed: facebook platform-page record
 *
 * docker exec v0_strapi sh -c 'export $(grep -v "^#" /app/.env | grep -v "^$" | xargs) && STRAPI_URL=http://127.0.0.1:1337 STRAPI_API_TOKEN=$SEED_TOKEN node /app/scripts/seed-platform-facebook.mjs'
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

const existing = await fetchJSON(`${STRAPI_URL}/api/platform-pages?filters[platform][$eq]=facebook`);
if (existing.data?.length > 0) { console.log("facebook platform-page already seeded — skipping."); process.exit(0); }

const payload = {
  data: {
    platform: "facebook",
    header: {
      icon: "Users",
      title: "Facebook Marketing",
      description: "Business page management, post composer, event creation, community engagement, and Messenger configuration for electrical services.",
    },
    introTitle: "Facebook Ecosystem",
    introText: "Manage your Facebook Business presence end-to-end. From page setup and post composition to event promotion and Messenger auto-replies, each tool is designed to build community engagement and convert interest into bookings.",
    ecosystemPhases: [
      { title: "Build Community", description: "Professional page with consistent, engaging local content", items: ["Page Management", "Post Composer"] },
      { title: "Drive Action", description: "Convert interest into bookings through events and instant replies", items: ["Events & Promotions", "Messenger Templates"] },
      { title: "Measure & Grow", description: "Track what resonates and optimise your community strategy", items: ["Analytics Dashboard"] },
    ],
    tools: [
      { itemId: "page-management", href: "/dashboard/admin/digital-marketing/facebook/page-management", icon: "Building2", title: "Page Management", description: "Set up and maintain your Facebook Business page with consistent branding, service listings, reviews management, and contact info.", status: "Active" },
      { itemId: "composer", href: "/dashboard/admin/digital-marketing/facebook/composer", icon: "PenSquare", title: "Post Composer", description: "Compose Facebook posts with image sizing, link preview optimisation, audience targeting tips, and copy-to-clipboard.", status: "Active" },
      { itemId: "events", href: "/dashboard/admin/digital-marketing/facebook/events", icon: "Megaphone", title: "Events & Promotions", description: "Create and promote events: open days, seasonal offers, community workshops. Event templates with RSVP best practices.", status: "Active" },
      { itemId: "messenger", href: "/dashboard/admin/digital-marketing/facebook/messenger", icon: "FileText", title: "Messenger Templates", description: "Auto-reply templates for common enquiries, business hours messages, quick-reply buttons, and conversation flows.", status: "Active" },
      { itemId: "analytics", href: "/dashboard/admin/digital-marketing/facebook/analytics", icon: "LineChart", title: "Analytics Dashboard", description: "Track page likes, post reach, engagement rate, Messenger response times, and review sentiment.", status: "Active" },
    ],
    publishedAt: new Date().toISOString(),
  },
};

const result = await fetchJSON(`${STRAPI_URL}/api/platform-pages`, { method: "POST", body: JSON.stringify(payload) });
console.log(`✅ facebook platform-page seeded — documentId: ${result.data?.documentId}`);
