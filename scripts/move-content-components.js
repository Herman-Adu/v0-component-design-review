const fs = require('fs');
const path = require('path');

const ROOT = '/vercel/share/v0-project';

const FILES = {
  articles: [
    'ssg-article.tsx', 'ssr-article.tsx', 'isr-article.tsx', 'ppr-article.tsx',
    'atomic-design-article.tsx', 'planning-article.tsx', 'zod-validation-article.tsx',
    'multi-step-form-article.tsx', 'zustand-article.tsx', 'security-article.tsx',
    'server-actions-article.tsx', 'email-article.tsx', 'refactoring-article.tsx',
    'documentation-article.tsx', 'accessibility-article.tsx', 'roi-article.tsx',
    'tech-stack-article.tsx', 'testing-article.tsx', 'cicd-article.tsx',
    'hydration-deep-dive-article.tsx', 'guard-pattern-article.tsx',
    'performance-budgets-article.tsx', 'server-client-boundaries-article.tsx',
    'duplicate-providers-article.tsx', 'hydration-mismatches-article.tsx',
    'ai-session-management-article.tsx',
    'three-axis-review-article.tsx', 'service-request-lifecycle-article.tsx',
    'managing-content-strapi-article.tsx',
  ],
  tutorials: [
    'deploying-nextjs-vercel.tsx', 'multi-step-forms-server-actions.tsx',
    'email-templates-react-email.tsx', 'e2e-testing-playwright.tsx',
    'building-atomic-component.tsx', 'server-side-validation.tsx',
    'zustand-form-store.tsx', 'rate-limiting-implementation.tsx',
    'your-first-nextjs-app.tsx', 'your-first-strapi-collection.tsx',
    'unit-testing-vitest.tsx', 'connecting-nextjs-to-strapi.tsx',
    'error-boundaries-and-loading-states.tsx',
    'understanding-react-hydration.tsx', 'building-hydration-safe-sidebar.tsx',
  ],
  'case-studies': [
    'client-to-server.tsx', 'form-validation.tsx', 'state-management.tsx',
    'security-layer.tsx', 'email-consolidation.tsx', 'enterprise-cms.tsx',
    'cost-reduction.tsx', 'multi-site.tsx', 'dev-productivity.tsx',
    'documentation-evolution.tsx', 'hydration-guard.tsx', 'rate-limiting.tsx',
    'sidebar-refactor.tsx', 'tarball-build-failure.tsx', 'rendering-strategy.tsx',
    'multi-step-form.tsx',
  ],
  guides: [
    'security-architecture.tsx', 'deployment-guide.tsx', 'testing-strategy.tsx',
  ],
};

let moved = 0;
let skipped = 0;
let errors = 0;

for (const type of Object.keys(FILES)) {
  const srcDir = path.join(ROOT, 'components', type);
  const destDir = path.join(ROOT, 'features', 'dashboard', 'content-library', type);

  fs.mkdirSync(destDir, { recursive: true });

  for (const file of FILES[type]) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(destDir, file);

    try {
      if (!fs.existsSync(srcPath)) {
        console.log('SKIP (not on disk): ' + type + '/' + file);
        skipped++;
        continue;
      }
      fs.copyFileSync(srcPath, destPath);
      fs.unlinkSync(srcPath);
      console.log('MOVED: ' + type + '/' + file);
      moved++;
    } catch (e) {
      console.error('ERROR: ' + type + '/' + file + ': ' + e.message);
      errors++;
    }
  }

  try {
    const remaining = fs.readdirSync(srcDir);
    if (remaining.length === 0) {
      fs.rmdirSync(srcDir);
      console.log('REMOVED empty dir: components/' + type + '/');
    } else {
      console.log('DIR NOT EMPTY: components/' + type + '/ has ' + remaining.length + ' remaining files');
    }
  } catch (e) {
    console.log('DIR note: components/' + type + '/ - ' + e.message);
  }
}

console.log('\nDone: ' + moved + ' moved, ' + skipped + ' skipped, ' + errors + ' errors');
