/**
 * Patch Documentation Meta — audience + lastUpdated
 *
 * Backfills the two new meta fields on the 4 documentation collection types
 * by reading values from the mock JSON files and PATCHing existing Strapi records.
 *
 * Run AFTER:
 *   1. apps/strapi/src/components/shared/meta.json has been updated with the new fields
 *   2. Strapi has been restarted to pick up the schema change
 *
 * Usage:
 *   SEED_TOKEN=<full-access-api-token> node apps/strapi/scripts/patch-doc-meta.mjs
 *
 * Requirements: Strapi running at http://localhost:1337 (or set STRAPI_URL)
 */

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const SEED_TOKEN = process.env.SEED_TOKEN;

if (!SEED_TOKEN) {
  console.error('ERROR: SEED_TOKEN env var required. Set to a full-access Strapi API token.');
  process.exit(1);
}

const MOCK_ROOT = resolve(__dirname, '../../../apps/ui/data/strapi-mock');

const DOC_TYPES = [
  {
    name: 'strategic-overviews',
    endpoint: '/api/strategic-overviews',
    dir: 'dashboard/documentation/strategic-overview',
  },
  {
    name: 'cms-references',
    endpoint: '/api/cms-references',
    dir: 'dashboard/documentation/cms-reference',
  },
  {
    name: 'app-references',
    endpoint: '/api/app-references',
    dir: 'dashboard/documentation/app-reference',
  },
  {
    name: 'infrastructure-ops-docs',
    endpoint: '/api/infrastructure-ops-docs',
    dir: 'dashboard/documentation/infrastructure-ops',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function buildSlugToMetaMap(dir) {
  const map = {};
  const absDir = join(MOCK_ROOT, dir);
  try {
    walkDir(absDir, map);
  } catch {
    // directory may not exist — skip silently
  }
  return map;
}

function walkDir(dir, map) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      walkDir(full, map);
    } else if (entry.endsWith('.json')) {
      try {
        const json = JSON.parse(readFileSync(full, 'utf8'));
        if (json.meta?.slug) {
          map[json.meta.slug] = json.meta;
        }
      } catch {
        // skip malformed files
      }
    }
  }
}

async function strapiGet(path) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    headers: { Authorization: `Bearer ${SEED_TOKEN}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed [${res.status}]: ${text.substring(0, 200)}`);
  }
  return res.json();
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
  return { status: res.status, body: await res.json() };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function patch() {
  console.log('\n🩹 Patch Documentation Meta — audience + lastUpdated');
  console.log(`   Target: ${STRAPI_URL}\n`);

  let totalOk = 0;
  let totalSkip = 0;
  let totalFail = 0;

  for (const ct of DOC_TYPES) {
    const mockMap = buildSlugToMetaMap(ct.dir);
    console.log(`\n▶  ${ct.name} (${Object.keys(mockMap).length} mock files found)`);

    let existing;
    try {
      existing = await strapiGet(
        `${ct.endpoint}?populate[meta]=true&pagination[pageSize]=200`,
      );
    } catch (err) {
      console.error(`   ✗ Could not fetch ${ct.name}: ${err.message}`);
      totalFail++;
      continue;
    }

    const records = existing.data ?? [];
    console.log(`   Found ${records.length} records in Strapi`);

    for (const record of records) {
      const strapiId = record.id;
      const slug = record.meta?.slug;

      if (!slug) {
        console.log(`   ⚠  Record id=${strapiId} has no slug — skipping`);
        totalSkip++;
        continue;
      }

      const mockMeta = mockMap[slug];
      if (!mockMeta) {
        console.log(`   ⚠  No mock data found for slug "${slug}" — skipping`);
        totalSkip++;
        continue;
      }

      // Reconstruct the full meta payload (all existing fields + new ones)
      const patchedMeta = {
        slug: record.meta.slug,
        title: record.meta.title,
        excerpt: record.meta.excerpt,
        category: record.meta.category ?? null,
        level: record.meta.level ?? null,
        readTime: record.meta.readTime ?? null,
        publishedAt: record.meta.publishedAt ?? null,
        tags: record.meta.tags ?? '',
        audience: mockMeta.audience ?? null,
        lastUpdated: mockMeta.lastUpdated ?? null,
      };

      const { status, body } = await strapiPut(`${ct.endpoint}/${strapiId}`, {
        meta: patchedMeta,
      });

      if (status === 200 || status === 201) {
        console.log(
          `   ✓ ${slug} — audience: "${patchedMeta.audience}"  lastUpdated: "${patchedMeta.lastUpdated}"`,
        );
        totalOk++;
      } else {
        const errMsg = JSON.stringify(body?.error?.message ?? body).substring(0, 120);
        console.log(`   ✗ [${status}] ${slug}: ${errMsg}`);
        totalFail++;
      }
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`✓ Patched: ${totalOk}  ↷ Skipped: ${totalSkip}  ✗ Failed: ${totalFail}`);
  console.log(`${'─'.repeat(60)}\n`);

  if (totalFail > 0) process.exit(1);
}

patch().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
