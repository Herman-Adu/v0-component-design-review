/**
 * Seed Company Setting — Single Type
 *
 * Creates or updates the `company-setting` Single Type in Strapi.
 * Uses PUT (Single Types are always updated, not created).
 *
 * Usage (inside Strapi container):
 *   docker exec v0_strapi sh -c \
 *     'export $(grep -v "^#" /app/.env | grep -v "^$" | xargs) && \
 *      STRAPI_URL=http://127.0.0.1:1337 STRAPI_API_TOKEN=$SEED_TOKEN \
 *      node /app/scripts/seed-company-setting.mjs'
 */

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const SEED_TOKEN = process.env.SEED_TOKEN ?? process.env.STRAPI_API_TOKEN;

if (!SEED_TOKEN) {
  console.error('ERROR: SEED_TOKEN or STRAPI_API_TOKEN env var required.');
  process.exit(1);
}

async function strapiPut(path, data) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${SEED_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data }),
  });
  const json = await res.json();
  return { status: res.status, body: json };
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const companySettingData = {
  businessName: 'Acme Document Solutions Ltd',
  businessAddress: '42 Enterprise Park, Innovation Quarter, Cape Town, 8001, South Africa',
  businessPhone: '+27 21 555 0100',
  businessEmail: 'hello@acmedocs.example.com',
  logoUrl: null,
  brandPrimaryColor: '#2563EB',
  brandSecondaryColor: '#1E40AF',
  brandAccentColor: '#F59E0B',
  website: 'https://acmedocs.example.com',
  registrationNumber: '2018/123456/07',
  vatNumber: '4760123456',
};

// ─── Run ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('[seed-company-setting] Starting...');
  console.log(`[seed-company-setting] Target: ${STRAPI_URL}/api/company-setting`);

  const result = await strapiPut('/api/company-setting', companySettingData);

  if (result.status === 200) {
    console.log('[seed-company-setting] ✅ company-setting updated successfully');
    console.log(`  businessName: ${result.body.data?.businessName}`);
  } else {
    console.error('[seed-company-setting] ❌ Failed:', result.status);
    console.error(JSON.stringify(result.body, null, 2));
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('[seed-company-setting] Fatal error:', err);
  process.exit(1);
});
