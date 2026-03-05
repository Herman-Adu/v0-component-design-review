/**
 * Seed Email Setting — Single Type
 *
 * Creates or updates the `email-setting` Single Type in Strapi.
 * Uses PUT (Single Types are always updated, not created).
 *
 * Usage (inside Strapi container):
 *   docker exec v0_strapi sh -c \
 *     'export $(grep -v "^#" /app/.env | grep -v "^$" | xargs) && \
 *      STRAPI_URL=http://127.0.0.1:1337 STRAPI_API_TOKEN=$SEED_TOKEN \
 *      node /app/scripts/seed-email-setting.mjs'
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

const emailSettingData = {
  fromEmail: 'noreply@acmedocs.example.com',
  contactFromEmail: 'contact@acmedocs.example.com',
  quotationFromEmail: 'quotations@acmedocs.example.com',
  replyToEmail: 'support@acmedocs.example.com',
  slaResponseHours: 24,
  slaUrgentHours: 4,
  footerDisclaimer:
    'This email and any attachments are confidential and intended solely for the named recipient. If you have received this email in error, please notify the sender immediately and delete it from your system.',
  emailSignatureTemplate: null,
};

// ─── Run ──────────────────────────────────────────────────────────────────────

async function run() {
  console.log('[seed-email-setting] Starting...');
  console.log(`[seed-email-setting] Target: ${STRAPI_URL}/api/email-setting`);

  const result = await strapiPut('/api/email-setting', emailSettingData);

  if (result.status === 200) {
    console.log('[seed-email-setting] ✅ email-setting updated successfully');
    console.log(`  fromEmail: ${result.body.data?.fromEmail}`);
  } else {
    console.error('[seed-email-setting] ❌ Failed:', result.status);
    console.error(JSON.stringify(result.body, null, 2));
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('[seed-email-setting] Fatal error:', err);
  process.exit(1);
});
