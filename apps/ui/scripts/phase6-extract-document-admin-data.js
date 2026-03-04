#!/usr/bin/env node
/**
 * PHASE 6: Document Administration Data Extraction
 * 
 * Purpose: Scan all 10 document-administration pages, identify hardcoded arrays,
 * and generate an extraction report showing what data should be externalized.
 * 
 * Output: data/phase6-extraction-report.md
 */

const fs = require('fs');
const path = require('path');

const ADMIN_PATH = 'app/(dashboard)/dashboard/admin/document-administration';

// All 10 pages to scan
const pages = [
  'page.tsx',
  'getting-started/page.tsx',
  'documentation-health/page.tsx',
  'documentation-health/gap-analysis/page.tsx',
  'quality-engineering/page.tsx',
  'quality-engineering/count-validation/page.tsx',
  'quality-engineering/route-verification/page.tsx',
  'quality-engineering/toc-integrity/page.tsx',
  'quality-engineering/pattern-compliance/page.tsx',
  'quality-engineering/fix-actions/page.tsx',
];

// Regex patterns to find hardcoded data
const patterns = {
  sections: /const\s+sections\s*=\s*\[/,
  highlights: /const\s+highlights\s*=\s*\[/,
  journeys: /const\s+journeys\s*=\s*\[/,
  qaTools: /const\s+qaTools\s*=\s*\[/,
  healthChecks: /const\s+healthChecks\s*=\s*\[/,
  quickChecklist: /const\s+quickChecklist\s*=\s*\[/,
};

let extractedPages = [];
let totalArrays = 0;

console.log('\n📊 PHASE 6: Document Administration Extraction\n');
console.log('═'.repeat(60));

pages.forEach((page) => {
  const filePath = path.join(ADMIN_PATH, page);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  ${page} NOT FOUND`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const found = [];

    Object.entries(patterns).forEach(([key, pattern]) => {
      if (pattern.test(content)) {
        found.push(key);
        totalArrays++;
      }
    });

    if (found.length > 0) {
      extractedPages.push({
        page,
        arrays: found,
        count: found.length,
      });
      console.log(`✅ ${page}`);
      found.forEach(arr => console.log(`   └─ ${arr}`));
    }
  } catch (error) {
    console.error(`❌ Error reading ${page}: ${error.message}`);
  }
});

console.log('\n' + '═'.repeat(60));
console.log(`\n📈 EXTRACTION SUMMARY`);
console.log(`   Pages scanned: ${pages.length}`);
console.log(`   Pages with data: ${extractedPages.length}`);
console.log(`   Total arrays found: ${totalArrays}`);

// Generate report
const reportContent = `# PHASE 6: Document Administration Data Extraction Report

## Executive Summary
- **Pages Scanned:** ${pages.length}
- **Pages with Hardcoded Data:** ${extractedPages.length}
- **Total Arrays to Extract:** ${totalArrays}

## Extraction Details

${extractedPages
  .map(
    (item) => `### ${item.page}
**Arrays found:** ${item.count}
\`\`\`
${item.arrays.map((arr) => `- ${arr}`).join('\n')}
\`\`\`
`
  )
  .join('\n')}

## Next Steps
1. Create JSON mock files in \`data/strapi-mock/document-administration/\`
2. Update pages to import from JSON files
3. Validate build with \`pnpm build\`
4. Run Phase 6 refactor script
5. Commit and push to GitHub

---
Generated: ${new Date().toISOString()}
`;

fs.writeFileSync('data/phase6-extraction-report.md', reportContent);
console.log(`\n✅ Report written to: data/phase6-extraction-report.md`);
console.log('\n' + '═'.repeat(60) + '\n');
