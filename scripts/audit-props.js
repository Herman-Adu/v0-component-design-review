// Audit script: Checks every consumer of article-components.tsx for prop mismatches
// against the known interfaces.

const { readFileSync, existsSync } = require('fs');
const { execSync } = require('child_process');
const { join, relative } = require('path');

const ROOT = '/vercel/share/v0-project';

// Definitive interface catalog from article-components.tsx
const COMPONENT_PROPS = {
  TableOfContents: { required: ['items'], optional: [] },
  SectionHeader: { required: ['number', 'title'], optional: ['id'] },
  SubSectionHeader: { required: ['title'], optional: ['id'] },
  InfoBox: { required: ['children'], optional: ['type', 'title'] },
  StepFlow: { required: ['steps'], optional: ['title'] },
  VerticalFlow: { required: ['steps'], optional: ['title'] },
  ComparisonCards: {
    required: [],
    optional: ['idealFor', 'notIdealFor', 'idealTitle', 'notIdealTitle', 'leftTitle', 'leftItems', 'rightTitle', 'rightItems', 'leftType', 'rightType']
  },
  BeforeAfterComparison: {
    required: [],
    optional: ['before', 'after', 'beforeTitle', 'beforeCode', 'afterTitle', 'afterCode', 'improvements']
  },
  CodeBlock: { required: ['code'], optional: ['language', 'filename', 'title', 'highlightLines'] },
  FileTree: { required: ['items'], optional: ['title'] },
  ArchitectureDiagram: { required: ['layers'], optional: ['title', 'connections', 'flow'] },
  FeatureGrid: { required: ['features'], optional: ['columns'] },
  MetricsGrid: { required: ['metrics'], optional: [] },
  DataFlowDiagram: { required: ['nodes'], optional: ['title', 'connections', 'flow'] },
  DecisionTree: { required: ['decisions'], optional: ['title'] },
  KeyTakeaway: { required: [], optional: ['children', 'title', 'points'] },
  RelatedArticles: { required: ['articles'], optional: [] },
  StatsTable: { required: ['headers', 'rows'], optional: ['title'] },
  NumberedList: { required: ['items'], optional: ['title'] },
  ProcessFlow: { required: ['steps'], optional: ['title'] },
  SideBySideComparison: { required: ['leftTitle', 'rightTitle', 'leftItems', 'rightItems'], optional: [] },
  FileTreeDiagram: { required: [], optional: ['items', 'files', 'title'] },
  MetricCard: { required: ['title', 'value'], optional: ['description', 'trend', 'change', 'icon'] },
  ArticleIcons: null, // Not a component, it's an object export
};

// InfoBox valid types
const INFOBOX_TYPES = ['info', 'warning', 'tip', 'important', 'danger'];

// Known sub-prop shapes for items within arrays
const STEP_FLOW_STEP_PROPS = ['number', 'title', 'description'];
const VERTICAL_FLOW_STEP_PROPS = ['title', 'description', 'icon'];
const FEATURE_GRID_FEATURE_PROPS = ['icon', 'title', 'description', 'items'];
const METRICS_GRID_METRIC_PROPS = ['label', 'value', 'change', 'positive', 'description'];
const DECISION_TREE_DECISION_PROPS = ['condition', 'result', 'recommended'];
const FILE_TREE_ITEM_PROPS = ['name', 'type', 'children', 'highlight', 'indent', 'description'];
const RELATED_ARTICLE_PROPS = ['title', 'href', 'slug', 'level'];
const DATA_FLOW_NODE_PROPS = ['id', 'label', 'description', 'icon', 'items'];
const IMPROVEMENT_PROPS = ['metric', 'before', 'after'];
const ARCHITECTURE_LAYER_PROPS = ['name', 'items', 'color'];
const PROCESS_FLOW_STEP_PROPS = ['label', 'sublabel', 'color'];
const SIDE_BY_SIDE_LEFT_ITEM_PROPS = ['label', 'type'];
const SIDE_BY_SIDE_RIGHT_ITEM_PROPS = ['label', 'type'];
const NUMBERED_LIST_ITEM_PROPS = ['title', 'description'];

// Hardcoded list of known consumer files from grep output
// (readdirSync and execSync don't work in this sandbox environment)
const KNOWN_CONSUMERS = [
  'components/tutorials/zustand-form-store.tsx',
  'components/tutorials/your-first-strapi-collection.tsx',
  'components/tutorials/your-first-nextjs-app.tsx',
  'components/tutorials/unit-testing-vitest.tsx',
  'components/tutorials/understanding-react-hydration.tsx',
  'components/tutorials/server-side-validation.tsx',
  'components/tutorials/rate-limiting-implementation.tsx',
  'components/tutorials/multi-step-forms-server-actions.tsx',
  'components/tutorials/error-boundaries-and-loading-states.tsx',
  'components/tutorials/email-templates-react-email.tsx',
  'components/tutorials/e2e-testing-playwright.tsx',
  'components/tutorials/deploying-nextjs-vercel.tsx',
  'components/tutorials/connecting-nextjs-to-strapi.tsx',
  'components/tutorials/building-hydration-safe-sidebar.tsx',
  'components/tutorials/building-atomic-component.tsx',
  'components/articles/zustand-article.tsx',
  'components/articles/zod-validation-article.tsx',
  'components/articles/three-axis-review-article.tsx',
  'components/articles/testing-article.tsx',
  'components/articles/tech-stack-article.tsx',
  'components/articles/ssr-article.tsx',
  'components/articles/ssg-article.tsx',
  'components/articles/service-request-lifecycle-article.tsx',
  'components/articles/server-client-boundaries-article.tsx',
  'components/articles/server-actions-article.tsx',
  'components/articles/security-article.tsx',
  'components/articles/roi-article.tsx',
  'components/articles/refactoring-article.tsx',
  'components/articles/ppr-article.tsx',
  'components/articles/planning-article.tsx',
  'components/articles/performance-budgets-article.tsx',
  'components/articles/multi-step-form-article.tsx',
  'components/articles/managing-content-strapi-article.tsx',
  'components/articles/isr-article.tsx',
  'components/articles/hydration-mismatches-article.tsx',
  'components/articles/hydration-deep-dive-article.tsx',
  'components/articles/guard-pattern-article.tsx',
  'components/articles/email-article.tsx',
  'components/articles/duplicate-providers-article.tsx',
  'components/articles/documentation-article.tsx',
  'components/articles/cicd-article.tsx',
  'components/articles/atomic-design-article.tsx',
  'components/articles/ai-session-management-article.tsx',
  'components/articles/accessibility-article.tsx',
  'components/case-studies/tarball-build-failure.tsx',
  'components/case-studies/state-management.tsx',
  'components/case-studies/sidebar-refactor.tsx',
  'components/case-studies/security-layer.tsx',
  'components/case-studies/rendering-strategy.tsx',
  'components/case-studies/rate-limiting.tsx',
  'components/case-studies/multi-step-form.tsx',
  'components/case-studies/multi-site.tsx',
  'components/case-studies/hydration-guard.tsx',
  'components/case-studies/form-validation.tsx',
  'components/case-studies/enterprise-cms.tsx',
  'components/case-studies/email-consolidation.tsx',
  'components/case-studies/documentation-evolution.tsx',
  'components/case-studies/dev-productivity.tsx',
  'components/case-studies/cost-reduction.tsx',
  'components/case-studies/client-to-server.tsx',
  'components/guides/testing-strategy.tsx',
  'components/guides/security-architecture.tsx',
  'components/guides/deployment-guide.tsx',
  'data/code-review-log.tsx',
];

const consumerFiles = KNOWN_CONSUMERS.map(f => join(ROOT, f));

console.log(`Found ${consumerFiles.length} consumer files to audit\n`);

const issues = [];

for (const filePath of consumerFiles) {
  const content = readFileSync(filePath, 'utf-8');
  const relPath = relative(ROOT, filePath);
  
  // Check if file actually imports from article-components
  if (!content.includes('article-components')) continue;
  
  // Extract what's imported
  const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*["']@\/components\/molecules\/article-components["']/);
  if (!importMatch) continue;
  
  const imports = importMatch[1].split(',').map(s => s.trim()).filter(Boolean);
  
  // For each imported component, find its JSX usage and check props
  for (const componentName of imports) {
    if (componentName === 'ArticleIcons') continue;
    
    const schema = COMPONENT_PROPS[componentName];
    if (!schema) {
      issues.push({ file: relPath, component: componentName, issue: `Unknown component "${componentName}" imported` });
      continue;
    }
    
    // Find all JSX usages of this component: <ComponentName ...props... />  or <ComponentName ...props...>
    // Simple regex to extract prop names from JSX
    const jsxRegex = new RegExp(`<${componentName}\\b([^>]*(?:\\{[^}]*\\}[^>]*)*)(?:>|\\/>)`, 'gs');
    let match;
    while ((match = jsxRegex.exec(content)) !== null) {
      const propsStr = match[1];
      
      // Extract prop names (handle both prop="value" and prop={value} patterns)
      const propNames = [];
      const propRegex = /(\w+)\s*=/g;
      let propMatch;
      while ((propMatch = propRegex.exec(propsStr)) !== null) {
        propNames.push(propMatch[1]);
      }
      
      // Check for unknown props
      const allValidProps = [...schema.required, ...schema.optional];
      for (const prop of propNames) {
        if (!allValidProps.includes(prop)) {
          issues.push({ 
            file: relPath, 
            component: componentName, 
            issue: `Unknown prop "${prop}" passed to <${componentName}>. Valid: [${allValidProps.join(', ')}]` 
          });
        }
      }
      
      // Check InfoBox type values
      if (componentName === 'InfoBox') {
        const typeMatch = propsStr.match(/type=["'](\w+)["']/);
        if (typeMatch && !INFOBOX_TYPES.includes(typeMatch[1])) {
          issues.push({
            file: relPath,
            component: 'InfoBox',
            issue: `Invalid type="${typeMatch[1]}". Valid: [${INFOBOX_TYPES.join(', ')}]`
          });
        }
      }
    }
  }
  
  // --- Deep audit: check object literal shapes inside arrays passed as props ---
  // This catches things like { label: "..." } in a FileTree items array where it should be { description: "..." }
  
  // Check for "label:" inside FileTree items arrays (should be "description:")
  // This is approximate -- we look for the pattern near FileTree usage
  if (content.includes('FileTree') || content.includes('FileTreeDiagram')) {
    // Look for "label:" near file tree contexts (this was a known S13 issue)
    const ftMatches = [...content.matchAll(/\blabel\s*:\s*["']/g)];
    if (ftMatches.length > 0) {
      // Check if these are in FileTree item context
      for (const m of ftMatches) {
        const contextStart = Math.max(0, m.index - 200);
        const contextEnd = Math.min(content.length, m.index + 200);
        const context = content.slice(contextStart, contextEnd);
        if (context.includes('FileTree') || context.includes('name:')) {
          issues.push({
            file: relPath,
            component: 'FileTree',
            issue: `Possible "label:" in FileTree items -- should be "description:". Context: ...${content.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\n/g, ' ')}...`
          });
        }
      }
    }
  }
}

console.log('=== AUDIT RESULTS ===\n');

if (issues.length === 0) {
  console.log('NO PROP MISMATCHES FOUND in consumer files.');
  console.log('\nAll consumer JSX props match the article-components.tsx interfaces.');
  console.log('The build error may be caused by something ELSE -- check:');
  console.log('  1. Missing module imports (already fixed in S13?)');
  console.log('  2. Type errors inside article-components.tsx itself');
  console.log('  3. Type errors in non-article-component files');
  console.log('  4. Object literal shapes inside arrays (sub-prop mismatches)');
} else {
  console.log(`Found ${issues.length} potential issue(s):\n`);
  for (const issue of issues) {
    console.log(`[${issue.file}] <${issue.component}>: ${issue.issue}`);
  }
}
