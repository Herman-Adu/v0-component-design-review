#!/usr/bin/env node

/**
 * Phase 3 - Generate Barrel Export Files
 * Creates index.ts files for clean component exports
 *
 * Generates:
 * 1. components/atoms/index.ts
 * 2. components/molecules/index.ts
 * 3. components/organisms/index.ts
 * 4. components/templates/index.ts
 * 5. components/index.ts (root barrel)
 */

const fs = require("fs");
const path = require("path");

// Helper to get all exported components from a directory
function getComponentsFromDir(dir) {
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir);
  const components = [];
  const wildcardExports = [];

  files.forEach((file) => {
    if (file.endsWith(".tsx") && !file.startsWith("index")) {
      const baseName = file.replace(".tsx", "");

      // Special handling for files that export multiple components
      // These should use wildcard exports instead
      if (baseName === "article-components") {
        wildcardExports.push(`./${baseName}`);
        return;
      }

      // Convert filename to component name
      // e.g., platform-header.tsx -> PlatformHeader
      const componentName = baseName
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("");

      components.push({
        filename: file,
        name: componentName,
        exportPath: `./${baseName}`,
      });
    }
  });

  return { components, wildcardExports };
}

// Generate barrel exports
function generateBarrelExport(components, wildcardExports, dirName) {
  let content = `// Auto-generated barrel exports for ${dirName}\n\n`;

  // Add wildcard exports first
  wildcardExports.forEach((exportPath) => {
    content += `export * from '${exportPath}'\n`;
  });

  if (wildcardExports.length > 0 && components.length > 0) {
    content += "\n";
  }

  // Add named exports
  components.forEach(({ name, exportPath }) => {
    content += `export { ${name} } from '${exportPath}'\n`;
  });

  // Only add component list if there are named components
  if (components.length > 0) {
    content += `\n// Component names list for type generation\nexport const ${dirName}Components = [\n`;
    components.forEach(({ name }) => {
      content += `  '${name}',\n`;
    });
    content += `] as const\n`;
  }

  return content;
}

// Scan directories
const dirs = {
  atoms: path.join(process.cwd(), "components", "atoms"),
  molecules: path.join(process.cwd(), "components", "molecules"),
  organisms: path.join(process.cwd(), "components", "organisms"),
  templates: path.join(process.cwd(), "components", "templates"),
};

const componentsByDir = {};
Object.entries(dirs).forEach(([dirName, dirPath]) => {
  componentsByDir[dirName] = getComponentsFromDir(dirPath);
});

// Create index files for each directory
Object.entries(componentsByDir).forEach(
  ([dirName, { components, wildcardExports }]) => {
    const indexPath = path.join(dirs[dirName], "index.ts");
    const content = generateBarrelExport(components, wildcardExports, dirName);
    fs.writeFileSync(indexPath, content, "utf-8");
    console.log(
      `✓ Created components/${dirName}/index.ts (${components.length} named exports, ${wildcardExports.length} wildcard exports)`,
    );
  },
);

// Create root components/index.ts
const rootBarrel = `// Root barrel export for all components

${componentsByDir.atoms.components.length > 0 ? `export { atomsComponents } from './atoms'` : ""}
export * from './atoms'

// Note: molecules are not re-exported at root due to naming conflicts with atoms
// Import molecules directly: import { BackNavigationCard } from '@/components/molecules'
${componentsByDir.molecules.components.length > 0 ? `export { moleculesComponents } from './molecules'` : ""}

${componentsByDir.organisms.components.length > 0 ? `export { organismsComponents } from './organisms'` : ""}
export * from './organisms'

${componentsByDir.templates.components.length > 0 ? `export { templatesComponents } from './templates'` : ""}
export * from './templates'

// Type-safe component registry
export const componentRegistry = {
  atoms: {
    count: ${componentsByDir.atoms.components.length},
    components: Object.freeze([${componentsByDir.atoms.components.map((c) => `'${c.name}'`).join(", ")}]),
  },
  molecules: {
    count: ${componentsByDir.molecules.components.length},
    components: Object.freeze([${componentsByDir.molecules.components.map((c) => `'${c.name}'`).join(", ")}]),
  },
  organisms: {
    count: ${componentsByDir.organisms.components.length},
    components: Object.freeze([${componentsByDir.organisms.components.map((c) => `'${c.name}'`).join(", ")}]),
  },
  templates: {
    count: ${componentsByDir.templates.components.length},
    components: Object.freeze([${componentsByDir.templates.components.map((c) => `'${c.name}'`).join(", ")}]),
  },
}

export const totalComponents = ${Object.values(componentsByDir).reduce(
  (sum, { components }) => sum + components.length,
  0,
)}
`;

fs.writeFileSync(
  path.join(process.cwd(), "components", "index.ts"),
  rootBarrel,
  "utf-8",
);
console.log(`✓ Created components/index.ts (root barrel export)`);

// Generate report
const report = `# Phase 3 - Barrel Exports Generated

## Summary

Generated barrel export files for component organization:

### atoms/index.ts
- ${componentsByDir.atoms.components.length} atomic components exported
${componentsByDir.atoms.components.map((c) => `  - ${c.name}`).join("\n")}

### molecules/index.ts
- ${componentsByDir.molecules.components.length} molecular components exported
${componentsByDir.molecules.wildcardExports.length > 0 ? "  - article-components (wildcard export)\n" : ""}${componentsByDir.molecules.components.map((c) => `  - ${c.name}`).join("\n")}

### organisms/index.ts
- ${componentsByDir.organisms.components.length} organism components exported
${componentsByDir.organisms.components.map((c) => `  - ${c.name}`).join("\n")}

### templates/index.ts
- ${componentsByDir.templates.components.length} template components exported
${componentsByDir.templates.components.map((c) => `  - ${c.name}`).join("\n")}

### components/index.ts (root barrel)
- Consolidates all component exports
- Exports componentRegistry for type-safe access
- Total components: ${Object.values(componentsByDir).reduce((sum, { components }) => sum + components.length, 0)}

## Usage

Import components cleanly:
\`\`\`typescript
// From specific layer
import { Button, Input } from '@/components/atoms'
import { Card, Badge } from '@/components/molecules'
import { Grid, Layout } from '@/components/organisms'
import { TemplateMarketing } from '@/components/templates'

// From root (all components)
import { Button, Card, Grid, TemplateMarketing } from '@/components'

// Type-safe registry
import { componentRegistry } from '@/components'
console.log(componentRegistry.atoms.count) // 7
\`\`\`

## Next Steps

1. Pages can now import components from \`@/components/\` cleanly
2. Phase 4: Refactor pages to use new components instead of hardcoded UI
3. Phase 5: Extract hardcoded data to Strapi mock JSON
`;

fs.writeFileSync(
  path.join(process.cwd(), "data", "phase3-barrel-exports-generated.md"),
  report,
  "utf-8",
);

console.log(report);
console.log("Phase 3 complete: Barrel exports generated.");
