/**
 * Seed: twitter platform-page record
 *
 * docker exec v0_strapi sh -c 'export $(grep -v "^#" /app/.env | grep -v "^$" | xargs) && STRAPI_URL=http://127.0.0.1:1337 STRAPI_API_TOKEN=$SEED_TOKEN node /app/scripts/seed-platform-twitter.mjs'
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

const existing = await fetchJSON(`${STRAPI_URL}/api/platform-pages?filters[platform][$eq]=twitter`);
if (existing.data?.length > 0) { console.log("twitter platform-page already seeded — skipping."); process.exit(0); }

const payload = {
  data: {
    platform: "twitter",
    header: {
      icon: "Globe",
      title: "Twitter/X Marketing",
      description: "Tweet composer with character limits, thread builder, hashtag strategy, and real-time engagement tracking for electrical services.",
    },
    introTitle: "Twitter/X Ecosystem",
    introText: "Build your Twitter/X presence with targeted content and community engagement. From profile setup and tweet composition to trending insights and analytics, each tool helps you establish authority and reach potential clients in your local area.",
    ecosystemPhases: [
      { title: "Establish Presence", description: "Consistent, professional tweets with targeted hashtags", items: ["Profile Setup", "Tweet Composer"] },
      { title: "Build Community", description: "Foster relationships and participate in relevant conversations", items: ["Community Engagement", "Trending Insights"] },
      { title: "Amplify Reach", description: "Maximize visibility and engagement through data-driven strategies", items: ["Trending Insights", "Analytics Dashboard"] },
    ],
    tools: [
      { itemId: "profile-setup", href: "/dashboard/admin/digital-marketing/twitter/profile-setup", icon: "Building2", title: "Profile Setup", description: "Professional bio templates, header design guidelines, link optimization, and verification strategies.", status: "Active" },
      { itemId: "tweet-composer", href: "/dashboard/admin/digital-marketing/twitter/tweet-composer", icon: "PenSquare", title: "Tweet Composer", description: "Character-optimized templates, hashtag strategies, emoji usage, and thread formatting.", status: "Active" },
      { itemId: "community-engagement", href: "/dashboard/admin/digital-marketing/twitter/community-engagement", icon: "Megaphone", title: "Community Engagement", description: "Reply templates, retweet strategies, mentions management, and conversation starters.", status: "Active" },
      { itemId: "trending-insights", href: "/dashboard/admin/digital-marketing/twitter/trending-insights", icon: "FileText", title: "Trending Insights", description: "Trend monitoring, viral potential assessment, timing optimization, and audience insights.", status: "Active" },
      { itemId: "analytics", href: "/dashboard/admin/digital-marketing/twitter/analytics", icon: "LineChart", title: "Analytics Dashboard", description: "Tweet performance, follower growth, engagement rates, and audience demographics.", status: "Active" },
    ],
    publishedAt: new Date().toISOString(),
  },
};

const result = await fetchJSON(`${STRAPI_URL}/api/platform-pages`, { method: "POST", body: JSON.stringify(payload) });
console.log(`✅ twitter platform-page seeded — documentId: ${result.data?.documentId}`);
