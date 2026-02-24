/**
 * PHASE 1 SCRIPT 2: Component Audit
 * 
 * Scans the entire codebase to produce a structured inventory of:
 * 1. All page files and their hardcoded data patterns
 * 2. All existing components and their atomic classification
 * 3. Repeating UI patterns that should become shared components
 * 4. Import relationships between files
 * 
 * Usage: node scripts/phase1-audit-components.js [--verbose]
 * 
 * Outputs:
 *   - /data/phase1-component-audit.json  (machine-readable)
 *   - /data/phase1-audit-report.md       (human-readable)
 */

const fs = require('fs');
const path = require('path');

const VERBOSE = process.argv.includes('--verbose');
const ROOT_DIR = path.join(__dirname, '..');
const APP_DIR = path.join(ROOT_DIR, 'app');
const COMPONENTS_DIR = path.join(ROOT_DIR, 'components');
const FEATURES_DIR = path.join(ROOT_DIR, 'features');
const DATA_DIR = path.join(ROOT_DIR, 'data');

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function getAllFiles(dir, ext = '.tsx') {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      results.push(...getAllFiles(fullPath, ext));
    } else if (item.name.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;
  }
}

function relativePath(fullPath) {
  return path.relative(ROOT_DIR, fullPath);
}

// ============================================================
// PATTERN DETECTORS
// ============================================================

/**
 * Detect hardcoded data arrays in a file.
 * Looks for patterns like: const tools = [ ... ]
 */
function detectHardcodedArrays(content, filePath) {
  const arrays = [];
  // Match: const NAME = [ or const NAME: TYPE[] = [
  const arrayPattern = /const\s+(\w+)\s*(?::\s*[^=]+)?\s*=\s*\[/g;
  let match;
  
  while ((match = arrayPattern.exec(content)) !== null) {
    const name = match[1];
    // Skip imports and trivial arrays
    if (['children', 'className', 'items'].includes(name)) continue;
    
    // Count approximate items by counting opening braces after the match
    const afterMatch = content.substring(match.index);
    const closingBracket = findMatchingBracket(afterMatch, '[', ']');
    const itemCount = (afterMatch.substring(0, closingBracket).match(/\{/g) || []).length;
    
    arrays.push({
      name,
      itemCount,
      line: content.substring(0, match.index).split('\n').length,
    });
  }
  
  return arrays;
}

function findMatchingBracket(str, open, close) {
  let depth = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === open) depth++;
    if (str[i] === close) depth--;
    if (depth === 0) return i;
  }
  return str.length;
}

/**
 * Detect imports from a file.
 */
function detectImports(content) {
  const imports = [];
  const importPattern = /import\s+(?:(?:\{[^}]+\}|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importPattern.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

/**
 * Detect if file is a client component.
 */
function isClientComponent(content) {
  return content.trimStart().startsWith('"use client"') || content.trimStart().startsWith("'use client'");
}

/**
 * Detect exported component name.
 */
function detectExportedComponent(content) {
  const defaultExport = content.match(/export\s+default\s+function\s+(\w+)/);
  const namedExport = content.match(/export\s+function\s+(\w+)/);
  return defaultExport?.[1] || namedExport?.[1] || null;
}

/**
 * Detect TypeScript interfaces defined in the file.
 */
function detectInterfaces(content) {
  const interfaces = [];
  const pattern = /(?:export\s+)?interface\s+(\w+)/g;
  let match;
  while ((match = pattern.exec(content)) !== null) {
    interfaces.push(match[1]);
  }
  return interfaces;
}

/**
 * Detect common UI patterns in page files.
 */
function detectUIPatterns(content) {
  const patterns = [];
  
  // Header pattern: icon + title + tagline + badges
  if (content.includes('text-3xl font-bold') && content.includes('Badge')) {
    patterns.push('platform-header');
  }
  
  // Why-platform callout card
  if (content.includes('Why ') && content.includes('CardContent') && content.includes('bg-') && content.includes('/5')) {
    patterns.push('why-platform-card');
  }
  
  // Strategy flow (3-column strategy cards)
  if (content.includes('strategy') && content.includes('responsive-grid-3')) {
    patterns.push('strategy-flow');
  }
  
  // Tool grid (quick-access cards)
  if (content.includes('tools.map') || content.includes('tool.href')) {
    patterns.push('tool-grid');
  }
  
  // Platform specs table
  if (content.includes('spec') && content.includes('value') && content.includes('justify-between text-xs')) {
    patterns.push('platform-specs');
  }
  
  // Back navigation card
  if (content.includes('Back to') && content.includes('ArrowRight')) {
    patterns.push('back-navigation');
  }
  
  // Metrics grid
  if (content.includes('keyMetrics') || content.includes('MetricDefinition') || (content.includes('metric') && content.includes('target'))) {
    patterns.push('metrics-grid');
  }
  
  // Reporting cadence
  if (content.includes('reportingCadence') || content.includes('frequency')) {
    patterns.push('reporting-cadence');
  }
  
  // Content comparison table
  if (content.includes('contentComparison') || (content.includes('reach') && content.includes('engagement') && content.includes('effort'))) {
    patterns.push('content-comparison-table');
  }
  
  // Checklist
  if (content.includes('Checklist') || content.includes('checklist')) {
    patterns.push('checklist');
  }
  
  // Tip/callout
  if (content.includes('Lightbulb') && content.includes('border-accent/20')) {
    patterns.push('tip-callout');
  }
  
  // Responsive grid usage
  if (content.includes('responsive-grid-2')) patterns.push('responsive-grid-2');
  if (content.includes('responsive-grid-3')) patterns.push('responsive-grid-3');
  
  return [...new Set(patterns)];
}

/**
 * Classify a component into atomic level.
 */
function classifyComponent(filePath) {
  const rel = relativePath(filePath);
  if (rel.startsWith('components/atoms/')) return 'atom';
  if (rel.startsWith('components/molecules/')) return 'molecule';
  if (rel.startsWith('components/organisms/')) return 'organism';
  if (rel.startsWith('components/ui/')) return 'ui-primitive';
  if (rel.startsWith('components/animations/')) return 'animation';
  if (rel.startsWith('components/providers/')) return 'provider';
  if (rel.includes('page.tsx')) return 'page';
  if (rel.includes('layout.tsx')) return 'layout';
  if (rel.includes('loading.tsx')) return 'loading';
  if (rel.includes('error.tsx')) return 'error';
  return 'other';
}

/**
 * Determine the route group and section of a page.
 */
function classifyPage(filePath) {
  const rel = relativePath(filePath);
  
  if (rel.includes('digital-marketing/linkedin')) return { group: 'admin', section: 'digital-marketing', platform: 'linkedin' };
  if (rel.includes('digital-marketing/facebook')) return { group: 'admin', section: 'digital-marketing', platform: 'facebook' };
  if (rel.includes('digital-marketing/twitter')) return { group: 'admin', section: 'digital-marketing', platform: 'twitter' };
  if (rel.includes('digital-marketing/google')) return { group: 'admin', section: 'digital-marketing', platform: 'google' };
  if (rel.includes('digital-marketing')) return { group: 'admin', section: 'digital-marketing', platform: null };
  if (rel.includes('document-administration')) return { group: 'admin', section: 'document-administration', platform: null };
  if (rel.includes('email-administration')) return { group: 'admin', section: 'email-administration', platform: null };
  if (rel.includes('documentation')) return { group: 'dashboard', section: 'documentation', platform: null };
  if (rel.includes('content-library')) return { group: 'dashboard', section: 'content-library', platform: null };
  if (rel.includes('(marketing)')) return { group: 'marketing', section: 'landing', platform: null };
  if (rel.includes('(auth)')) return { group: 'auth', section: 'auth', platform: null };
  if (rel.includes('contact')) return { group: 'public', section: 'contact', platform: null };
  if (rel.includes('quotation')) return { group: 'public', section: 'quotation', platform: null };
  if (rel.includes('services')) return { group: 'public', section: 'services', platform: null };
  
  return { group: 'other', section: 'other', platform: null };
}

// ============================================================
// MAIN AUDIT
// ============================================================

function main() {
  console.log('='.repeat(60));
  console.log('  PHASE 1 SCRIPT 2: Component Audit');
  console.log('='.repeat(60));
  console.log('');
  
  const audit = {
    generatedAt: new Date().toISOString(),
    pages: [],
    components: [],
    features: [],
    patternFrequency: {},
    summary: {},
  };
  
  // ---- 1. Audit all page files ----
  console.log('--- Auditing page files ---');
  const pageFiles = getAllFiles(APP_DIR).filter(f => f.endsWith('page.tsx'));
  
  for (const file of pageFiles) {
    const content = readFile(file);
    if (!content) continue;
    
    const rel = relativePath(file);
    const classification = classifyPage(file);
    const hardcodedArrays = detectHardcodedArrays(content, file);
    const uiPatterns = detectUIPatterns(content);
    const imports = detectImports(content);
    const isClient = isClientComponent(content);
    const exportedName = detectExportedComponent(content);
    const lineCount = content.split('\n').length;
    
    // Track pattern frequency
    for (const pattern of uiPatterns) {
      audit.patternFrequency[pattern] = (audit.patternFrequency[pattern] || 0) + 1;
    }
    
    const pageEntry = {
      path: rel,
      exportedName,
      isClient,
      lineCount,
      classification,
      hardcodedArrays,
      uiPatterns,
      importCount: imports.length,
      internalImports: imports.filter(i => i.startsWith('@/') || i.startsWith('./')),
      hasHardcodedData: hardcodedArrays.length > 0,
      dataItemCount: hardcodedArrays.reduce((sum, a) => sum + a.itemCount, 0),
    };
    
    audit.pages.push(pageEntry);
    
    if (VERBOSE) {
      console.log(`  ${rel} (${lineCount} lines, ${hardcodedArrays.length} arrays, ${uiPatterns.length} patterns)`);
    }
  }
  
  console.log(`  Total pages: ${audit.pages.length}`);
  
  // ---- 2. Audit existing components ----
  console.log('\n--- Auditing components ---');
  const componentFiles = getAllFiles(COMPONENTS_DIR);
  
  for (const file of componentFiles) {
    const content = readFile(file);
    if (!content) continue;
    
    const rel = relativePath(file);
    const atomicLevel = classifyComponent(file);
    const isClient = isClientComponent(content);
    const exportedName = detectExportedComponent(content);
    const interfaces = detectInterfaces(content);
    const imports = detectImports(content);
    const lineCount = content.split('\n').length;
    
    audit.components.push({
      path: rel,
      exportedName,
      atomicLevel,
      isClient,
      lineCount,
      interfaces,
      importCount: imports.length,
      internalImports: imports.filter(i => i.startsWith('@/') || i.startsWith('./')),
    });
    
    if (VERBOSE) {
      console.log(`  [${atomicLevel}] ${rel} (${lineCount} lines)`);
    }
  }
  
  console.log(`  Total components: ${audit.components.length}`);
  
  // ---- 3. Audit features ----
  console.log('\n--- Auditing features ---');
  const featureFiles = [...getAllFiles(FEATURES_DIR, '.tsx'), ...getAllFiles(FEATURES_DIR, '.ts')];
  
  for (const file of featureFiles) {
    const content = readFile(file);
    if (!content) continue;
    
    const rel = relativePath(file);
    const lineCount = content.split('\n').length;
    
    audit.features.push({
      path: rel,
      lineCount,
    });
    
    if (VERBOSE) {
      console.log(`  ${rel} (${lineCount} lines)`);
    }
  }
  
  console.log(`  Total feature files: ${audit.features.length}`);
  
  // ---- 4. Generate summary ----
  console.log('\n--- Generating summary ---');
  
  const pagesWithData = audit.pages.filter(p => p.hasHardcodedData);
  const componentsByLevel = {};
  for (const comp of audit.components) {
    componentsByLevel[comp.atomicLevel] = (componentsByLevel[comp.atomicLevel] || 0) + 1;
  }
  
  const pagesBySection = {};
  for (const page of audit.pages) {
    const key = `${page.classification.group}/${page.classification.section}`;
    pagesBySection[key] = (pagesBySection[key] || 0) + 1;
  }
  
  const platformPages = {};
  for (const page of audit.pages) {
    if (page.classification.platform) {
      platformPages[page.classification.platform] = (platformPages[page.classification.platform] || 0) + 1;
    }
  }
  
  audit.summary = {
    totalPages: audit.pages.length,
    totalComponents: audit.components.length,
    totalFeatureFiles: audit.features.length,
    pagesWithHardcodedData: pagesWithData.length,
    totalHardcodedArrays: pagesWithData.reduce((sum, p) => sum + p.hardcodedArrays.length, 0),
    totalDataItems: pagesWithData.reduce((sum, p) => sum + p.dataItemCount, 0),
    clientComponents: audit.components.filter(c => c.isClient).length,
    serverComponents: audit.components.filter(c => !c.isClient).length,
    componentsByLevel,
    pagesBySection,
    platformPages,
    patternFrequency: audit.patternFrequency,
    averagePageLineCount: Math.round(audit.pages.reduce((sum, p) => sum + p.lineCount, 0) / audit.pages.length),
    largestPages: audit.pages
      .sort((a, b) => b.lineCount - a.lineCount)
      .slice(0, 10)
      .map(p => ({ path: p.path, lines: p.lineCount, arrays: p.hardcodedArrays.length })),
  };
  
  // ---- 5. Write JSON output ----
  console.log('\n--- Writing outputs ---');
  
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  const jsonPath = path.join(DATA_DIR, 'phase1-component-audit.json');
  fs.writeFileSync(jsonPath, JSON.stringify(audit, null, 2));
  console.log(`  Written: data/phase1-component-audit.json`);
  
  // ---- 6. Write Markdown report ----
  const report = generateMarkdownReport(audit);
  const reportPath = path.join(DATA_DIR, 'phase1-audit-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`  Written: data/phase1-audit-report.md`);
  
  // ---- Print summary ----
  console.log('\n' + '='.repeat(60));
  console.log('  AUDIT COMPLETE');
  console.log('='.repeat(60));
  console.log(`  Pages:              ${audit.summary.totalPages}`);
  console.log(`  Components:         ${audit.summary.totalComponents}`);
  console.log(`  Feature files:      ${audit.summary.totalFeatureFiles}`);
  console.log(`  Pages w/ data:      ${audit.summary.pagesWithHardcodedData}`);
  console.log(`  Hardcoded arrays:   ${audit.summary.totalHardcodedArrays}`);
  console.log(`  Data items:         ${audit.summary.totalDataItems}`);
  console.log(`  Avg page lines:     ${audit.summary.averagePageLineCount}`);
  console.log('');
  console.log('  Component breakdown:');
  for (const [level, count] of Object.entries(audit.summary.componentsByLevel)) {
    console.log(`    ${level}: ${count}`);
  }
  console.log('');
  console.log('  Pattern frequency:');
  const sortedPatterns = Object.entries(audit.summary.patternFrequency).sort((a, b) => b[1] - a[1]);
  for (const [pattern, count] of sortedPatterns) {
    console.log(`    ${pattern}: ${count}`);
  }
  console.log('');
  console.log('  Next: Review data/phase1-audit-report.md');
  console.log('  Then: Begin Phase 2 component extraction\n');
}

// ============================================================
// MARKDOWN REPORT GENERATOR
// ============================================================

function generateMarkdownReport(audit) {
  const s = audit.summary;
  
  let md = `# Phase 1: Component Audit Report

Generated: ${audit.generatedAt}

## Summary

| Metric | Count |
|--------|-------|
| Total pages | ${s.totalPages} |
| Total components | ${s.totalComponents} |
| Feature files | ${s.totalFeatureFiles} |
| Pages with hardcoded data | ${s.pagesWithHardcodedData} |
| Total hardcoded arrays | ${s.totalHardcodedArrays} |
| Total data items | ${s.totalDataItems} |
| Average page line count | ${s.averagePageLineCount} |
| Client components | ${s.clientComponents} |
| Server components | ${s.serverComponents} |

## Component Breakdown by Atomic Level

| Level | Count |
|-------|-------|
${Object.entries(s.componentsByLevel).map(([level, count]) => `| ${level} | ${count} |`).join('\n')}

## Pages by Section

| Section | Count |
|---------|-------|
${Object.entries(s.pagesBySection).sort((a, b) => b[1] - a[1]).map(([section, count]) => `| ${section} | ${count} |`).join('\n')}

## Platform Pages

| Platform | Pages |
|----------|-------|
${Object.entries(s.platformPages).sort((a, b) => b[1] - a[1]).map(([platform, count]) => `| ${platform} | ${count} |`).join('\n')}

## Repeating UI Patterns (Extraction Candidates)

These patterns appear multiple times across pages and are strong candidates for shared components:

| Pattern | Occurrences | Target Component |
|---------|-------------|------------------|
${Object.entries(s.patternFrequency).sort((a, b) => b[1] - a[1]).map(([pattern, count]) => {
    const target = patternToComponent(pattern);
    return `| ${pattern} | ${count} | ${target} |`;
  }).join('\n')}

## Largest Pages (Refactoring Priority)

These pages have the most code and should be refactored first:

| Page | Lines | Hardcoded Arrays |
|------|-------|------------------|
${s.largestPages.map(p => `| ${p.path} | ${p.lines} | ${p.arrays} |`).join('\n')}

## Existing Components Inventory

### Atoms (${(s.componentsByLevel['atom'] || 0)})

${audit.components.filter(c => c.atomicLevel === 'atom').map(c => `- \`${c.path}\` - ${c.exportedName || 'unnamed'} (${c.lineCount} lines${c.isClient ? ', client' : ''})`).join('\n')}

### Molecules (${(s.componentsByLevel['molecule'] || 0)})

${audit.components.filter(c => c.atomicLevel === 'molecule').map(c => `- \`${c.path}\` - ${c.exportedName || 'unnamed'} (${c.lineCount} lines${c.isClient ? ', client' : ''})`).join('\n')}

### Organisms (${(s.componentsByLevel['organism'] || 0)})

${audit.components.filter(c => c.atomicLevel === 'organism').map(c => `- \`${c.path}\` - ${c.exportedName || 'unnamed'} (${c.lineCount} lines${c.isClient ? ', client' : ''})`).join('\n')}

### UI Primitives (${(s.componentsByLevel['ui-primitive'] || 0)})

${audit.components.filter(c => c.atomicLevel === 'ui-primitive').map(c => `- \`${c.path}\``).join('\n')}

## Pages with Hardcoded Data

These pages contain inline data arrays that should be extracted to mock data files:

${audit.pages.filter(p => p.hasHardcodedData).map(p => {
    const arrays = p.hardcodedArrays.map(a => `\`${a.name}\` (${a.itemCount} items)`).join(', ');
    return `### ${p.path}
- Arrays: ${arrays}
- UI Patterns: ${p.uiPatterns.join(', ') || 'none detected'}
- Platform: ${p.classification.platform || 'n/a'}
- Lines: ${p.lineCount}`;
  }).join('\n\n')}

## Recommended Phase 2 Actions

1. **Extract shared components** from the top repeating patterns above
2. **Create mock data files** for each platform (LinkedIn, Google, Facebook, Twitter)
3. **Refactor largest pages first** - they yield the most line reduction
4. **Start with marketing platform template** - covers the most pages with one component
5. **Build from atoms up** - StatusBadge, IconContainer, SectionHeading first

## Files for Reference

- Machine-readable audit: \`data/phase1-component-audit.json\`
- Type definitions: \`types/strapi/*.types.ts\`
- Component prop types: \`types/components/*.types.ts\`
`;

  return md;
}

function patternToComponent(pattern) {
  const map = {
    'platform-header': 'molecules/PlatformHeader',
    'why-platform-card': 'molecules/WhyPlatformCard',
    'strategy-flow': 'organisms/StrategyFlow',
    'tool-grid': 'organisms/ToolGrid',
    'platform-specs': 'organisms/PlatformSpecsCard',
    'back-navigation': 'molecules/BackNavigationCard',
    'metrics-grid': 'organisms/MetricsGrid',
    'reporting-cadence': 'molecules/ReportingCadenceCard',
    'content-comparison-table': 'molecules/ContentComparisonTable',
    'checklist': 'organisms/ChecklistCard',
    'tip-callout': 'atoms/TipCallout',
    'responsive-grid-2': 'utility class (keep)',
    'responsive-grid-3': 'utility class (keep)',
  };
  return map[pattern] || 'TBD';
}

// Run
try {
  main();
} catch (error) {
  console.error('Error:', error.message);
  if (VERBOSE) console.error(error);
  process.exit(1);
}
