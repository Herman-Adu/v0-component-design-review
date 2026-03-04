/**
 * Strapi Seed Script
 * Seeds all 8 content types from JSON mock data into Strapi via REST API.
 *
 * Usage:
 *   SEED_TOKEN=<full-access-api-token> node apps/strapi/scripts/seed.mjs
 *
 * Requirements: Strapi running at http://localhost:1337
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

// ─── Block type → Strapi __component mapping ────────────────────────────────

const TYPE_TO_COMPONENT = {
  // Canonical atomic names
  'atom.paragraph':                'atom.paragraph',
  'molecule.infoBox':              'molecule.info-box',
  'molecule.sectionHeader':        'molecule.section-header',
  'molecule.subSectionHeader':     'molecule.sub-section-header',
  'molecule.codeBlock':            'molecule.code-block',
  'molecule.keyTakeaway':          'molecule.key-takeaway',
  'organism.metricsGrid':          'organism.metrics-grid',
  'organism.featureGrid':          'organism.feature-grid',
  'organism.comparisonCards':      'organism.comparison-cards',
  'organism.processFlow':          'organism.process-flow',
  'organism.stepFlow':             'organism.step-flow',
  'organism.statsTable':           'organism.stats-table',
  'organism.relatedArticles':      'organism.related-articles',
  'organism.architectureDiagram':  'organism.architecture-diagram',
  'organism.fileTree':             'organism.file-tree',
  'organism.decisionTree':         'organism.decision-tree',
  'organism.dataFlowDiagram':      'organism.data-flow-diagram',
  'organism.verticalFlow':         'organism.vertical-flow',
  'organism.beforeAfterComparison':'organism.before-after-comparison',
  // Legacy aliases
  'paragraph':              'atom.paragraph',
  'info-box':               'molecule.info-box',
  'section-header':         'molecule.section-header',
  'sub-section-header':     'molecule.sub-section-header',
  'code-block':             'molecule.code-block',
  'key-takeaway':           'molecule.key-takeaway',
  'metrics-grid':           'organism.metrics-grid',
  'feature-grid':           'organism.feature-grid',
  'comparison-cards':       'organism.comparison-cards',
  'process-flow':           'organism.process-flow',
  'step-flow':              'organism.step-flow',
  'stats-table':            'organism.stats-table',
  'related-articles':       'organism.related-articles',
  'architecture-diagram':   'organism.architecture-diagram',
  'file-tree':              'organism.file-tree',
  'decision-tree':          'organism.decision-tree',
  'data-flow-diagram':      'organism.data-flow-diagram',
  'vertical-flow':          'organism.vertical-flow',
  'before-after-comparison':'organism.before-after-comparison',
  'numbered-list':          'atom.paragraph', // fallback — no Strapi component yet
};

// ─── Content type → API endpoint map ────────────────────────────────────────

const CONTENT_TYPES = [
  {
    name: 'articles',
    endpoint: '/api/articles',
    dirs: ['dashboard/content-library/articles'],
    excludeNames: ['articles-list.json'],
  },
  {
    name: 'case-studies',
    endpoint: '/api/case-studies',
    dirs: ['dashboard/content-library/case-studies'],
    excludeNames: ['case-studies-list.json'],
  },
  {
    name: 'guides',
    endpoint: '/api/guides',
    dirs: ['dashboard/content-library/guides'],
    excludeNames: ['guides-list.json'],
  },
  {
    name: 'tutorials',
    endpoint: '/api/tutorials',
    dirs: ['dashboard/content-library/tutorials'],
    excludeNames: ['tutorials-list.json'],
  },
  {
    name: 'strategic-overviews',
    endpoint: '/api/strategic-overviews',
    dirs: ['dashboard/documentation/strategic-overview'],
    excludeNames: [],
  },
  {
    name: 'cms-references',
    endpoint: '/api/cms-references',
    dirs: ['dashboard/documentation/cms-reference'],
    excludeNames: [],
  },
  {
    name: 'app-references',
    endpoint: '/api/app-references',
    dirs: ['dashboard/documentation/app-reference'],
    excludeNames: [],
  },
  {
    name: 'infrastructure-ops-docs',
    endpoint: '/api/infrastructure-ops-docs',
    dirs: ['dashboard/documentation/infrastructure-ops'],
    excludeNames: [],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const MOCK_ROOT = resolve(__dirname, '../../../apps/ui/data/strapi-mock');

function collectJsonFiles(relDirs, excludeNames) {
  const files = [];
  for (const relDir of relDirs) {
    const absDir = join(MOCK_ROOT, relDir);
    walkDir(absDir, files, excludeNames);
  }
  return files;
}

function walkDir(dir, files, excludeNames) {
  try {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walkDir(full, files, excludeNames);
      } else if (entry.endsWith('.json') && !excludeNames.includes(entry)) {
        files.push(full);
      }
    }
  } catch {
    // directory may not exist — skip silently
  }
}

function transformBlock(block) {
  const component = TYPE_TO_COMPONENT[block.type];
  if (!component) {
    console.warn(`  ⚠  Unknown block type "${block.type}" — skipping block`);
    return null;
  }
  return {
    __component: component,
    blockType: block.type,
    atomicLevel: block.atomicLevel ?? component.split('.')[0],
    props: block.props ?? {},
  };
}

function transformDoc(json) {
  const { meta, seo, toc, blocks, route, access } = json;

  // Whitelist only the fields defined in shared.meta Strapi schema
  const strapiMeta = meta ? {
    slug: meta.slug,
    title: meta.title,
    excerpt: meta.excerpt,
    category: meta.category ?? null,
    level: meta.level ?? null,
    readTime: meta.readTime ?? null,
    publishedAt: meta.publishedAt ?? null,
    tags: Array.isArray(meta.tags) ? meta.tags.join(', ') : (meta.tags ?? ''),
  } : undefined;

  const strapiToc = Array.isArray(toc)
    ? toc.map(item => ({
        level: item.level ?? 2,
        title: item.title ?? '',
        anchor: item.anchor ?? item.id ?? '',
      }))
    : [];

  const strapiBlocks = Array.isArray(blocks)
    ? blocks.map(transformBlock).filter(Boolean)
    : [];

  const data = {
    ...(strapiMeta && { meta: strapiMeta }),
    ...(seo && { seo }),
    ...(strapiToc.length > 0 && { toc: strapiToc }),
    ...(strapiBlocks.length > 0 && { blocks: strapiBlocks }),
    ...(route && { route }),
    ...(access && { access }),
  };

  return data;
}

async function strapiGet(path) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    headers: { Authorization: `Bearer ${SEED_TOKEN}` },
  });
  return res.json();
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
  return { status: res.status, body: await res.json() };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`\n🌱 Strapi Seed Script`);
  console.log(`   Target: ${STRAPI_URL}\n`);

  let totalOk = 0;
  let totalSkip = 0;
  let totalFail = 0;

  for (const ct of CONTENT_TYPES) {
    const files = collectJsonFiles(ct.dirs, ct.excludeNames);
    console.log(`\n▶  ${ct.name} (${files.length} files)`);

    // Fetch existing slugs to avoid duplicates
    const existing = await strapiGet(`${ct.endpoint}?populate[meta]=true&pagination[pageSize]=200`);
    const existingSlugs = new Set(
      (existing.data ?? []).map(d => d.meta?.slug).filter(Boolean)
    );

    for (const filePath of files) {
      let json;
      try {
        json = JSON.parse(readFileSync(filePath, 'utf8'));
      } catch {
        console.log(`   ✗ Parse error: ${filePath}`);
        totalFail++;
        continue;
      }

      const slug = json.meta?.slug;
      if (!slug) {
        console.log(`   ⚠ No slug in ${filePath} — skipping`);
        totalSkip++;
        continue;
      }

      if (existingSlugs.has(slug)) {
        console.log(`   ↷  Skip (exists): ${slug}`);
        totalSkip++;
        continue;
      }

      let data;
      try {
        data = transformDoc(json);
      } catch (err) {
        console.log(`   ✗ Transform error [${slug}]: ${err.message}`);
        totalFail++;
        continue;
      }

      const { status, body } = await strapiPost(ct.endpoint, data);
      if (status === 200 || status === 201) {
        console.log(`   ✓ ${slug}`);
        totalOk++;
      } else {
        console.log(`   ✗ [${status}] ${slug}: ${JSON.stringify(body?.error?.message ?? body).substring(0, 120)}`);
        totalFail++;
      }
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`✓ Seeded: ${totalOk}  ↷ Skipped: ${totalSkip}  ✗ Failed: ${totalFail}`);
  console.log(`${'─'.repeat(50)}\n`);

  if (totalFail > 0) process.exit(1);
}

seed().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
