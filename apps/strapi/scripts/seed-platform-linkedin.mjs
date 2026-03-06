/**
 * Seed: linkedin platform-page record
 *
 * docker exec v0_strapi sh -c 'export $(grep -v "^#" /app/.env | grep -v "^$" | xargs) && STRAPI_URL=http://127.0.0.1:1337 STRAPI_API_TOKEN=$SEED_TOKEN node /app/scripts/seed-platform-linkedin.mjs'
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

const existing = await fetchJSON(`${STRAPI_URL}/api/platform-pages?filters[platform][$eq]=linkedin`);
if (existing.data?.length > 0) { console.log("linkedin platform-page already seeded — skipping."); process.exit(0); }

const payload = {
  data: {
    platform: "linkedin",
    header: {
      icon: "Share2",
      title: "LinkedIn Marketing",
      description: "Company page management, professional post composer, article publishing, and B2B engagement strategy for electrical services.",
    },
    introTitle: "LinkedIn Ecosystem",
    introText: "Build your professional presence on LinkedIn. From profile optimisation and thought leadership content to targeted connection growth and lead generation, each tool is designed for B2B visibility in the trades and construction sector.",
    ecosystemPhases: [
      { title: "Build Credibility", description: "Build credibility with a polished profile and thought leadership", items: ["Profile Optimization", "Content Strategy"] },
      { title: "Grow Network", description: "Expand your professional network with targeted outreach and engagement", items: ["Connection Growth", "Content Strategy"] },
      { title: "Generate Leads", description: "Convert connections into qualified business leads", items: ["Lead Generation", "Analytics Dashboard"] },
    ],
    tools: [
      { itemId: "profile-optimization", href: "/dashboard/admin/digital-marketing/linkedin/profile-optimization", icon: "Building2", title: "Profile Optimization", description: "Professional headline templates, summary writing guide, skills showcase, and recommendations strategy.", status: "Active" },
      { itemId: "content-strategy", href: "/dashboard/admin/digital-marketing/linkedin/content-strategy", icon: "PenSquare", title: "Content Strategy", description: "Post templates, industry insights, thought leadership tips, and engagement best practices.", status: "Active" },
      { itemId: "connection-growth", href: "/dashboard/admin/digital-marketing/linkedin/connection-growth", icon: "Megaphone", title: "Connection Growth", description: "Targeting strategies, outreach templates, connection request guides, and relationship management.", status: "Active" },
      { itemId: "lead-generation", href: "/dashboard/admin/digital-marketing/linkedin/lead-generation", icon: "FileText", title: "Lead Generation", description: "InMail templates, sponsored content guidelines, lead magnet strategies, and conversion tips.", status: "Active" },
      { itemId: "analytics", href: "/dashboard/admin/digital-marketing/linkedin/analytics", icon: "LineChart", title: "Analytics Dashboard", description: "Profile views, engagement metrics, follower trends, and performance analytics.", status: "Active" },
    ],
    publishedAt: new Date().toISOString(),
  },
};

const result = await fetchJSON(`${STRAPI_URL}/api/platform-pages`, { method: "POST", body: JSON.stringify(payload) });
console.log(`✅ linkedin platform-page seeded — documentId: ${result.data?.documentId}`);
