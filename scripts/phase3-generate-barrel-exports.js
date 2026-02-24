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

const fs = require('fs')
const path = require('path')

// Helper to get all exported components from a directory
function getComponentsFromDir(dir) {
  if (!fs.existsSync(dir)) return []
  
  const files = fs.readdirSync(dir)
  const components = []
  
  files.forEach((file) => {
    if (file.endsWith('.tsx') && !file.startsWith('index')) {
      // Convert filename to component name
      // e.g., platform-header.tsx -> PlatformHeader
      const baseName = file.replace('.tsx', '')
      const componentName = baseName
        .split('-')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('')
      
      components.push({
        filename: file,
        name: componentName,
        exportPath: `./${baseName}`,
      })
    }
  })
  
  return components
}

// Generate barrel exports
function generateBarrelExport(components, dirName) {
  if (components.length === 0) {
    return `// ${dirName} components\n`
  }

  let content = `// Auto-generated barrel exports for ${dirName}\n\n`

  components.forEach(({ name, exportPath }) => {
    content += `export { ${name} } from '${exportPath}'\n`
  })

  content += `\n// Component list for type generation\nexport const ${dirName}Components = [\n`
  components.forEach(({ name }) => {
    content += `  ${name},\n`
  })
  content += `]\n`

  return content
}

// Scan directories
const dirs = {
  atoms: path.join(process.cwd(), 'components', 'atoms'),
  molecules: path.join(process.cwd(), 'components', 'molecules'),
  organisms: path.join(process.cwd(), 'components', 'organisms'),
  templates: path.join(process.cwd(), 'components', 'templates'),
}

const componentsByDir = {}
Object.entries(dirs).forEach(([dirName, dirPath]) => {
  componentsByDir[dirName] = getComponentsFromDir(dirPath)
})

// Create index files for each directory
Object.entries(componentsByDir).forEach(([dirName, components]) => {
  const indexPath = path.join(dirs[dirName], 'index.ts')
  const content = generateBarrelExport(components, dirName)
  fs.writeFileSync(indexPath, content, 'utf-8')
  console.log(`✓ Created components/${dirName}/index.ts (${components.length} exports)`)
})

// Create root components/index.ts
const rootBarrel = `// Root barrel export for all components

export { atomsComponents } from './atoms'
export * from './atoms'

export { moleculesComponents } from './molecules'
export * from './molecules'

export { organismsComponents } from './organisms'
export * from './organisms'

export { templatesComponents } from './templates'
export * from './templates'

// Type-safe component registry
export const componentRegistry = {
  atoms: {
    count: ${componentsByDir.atoms.length},
    components: Object.freeze([${componentsByDir.atoms.map((c) => `'${c.name}'`).join(', ')}]),
  },
  molecules: {
    count: ${componentsByDir.molecules.length},
    components: Object.freeze([${componentsByDir.molecules.map((c) => `'${c.name}'`).join(', ')}]),
  },
  organisms: {
    count: ${componentsByDir.organisms.length},
    components: Object.freeze([${componentsByDir.organisms.map((c) => `'${c.name}'`).join(', ')}]),
  },
  templates: {
    count: ${componentsByDir.templates.length},
    components: Object.freeze([${componentsByDir.templates.map((c) => `'${c.name}'`).join(', ')}]),
  },
}

export const totalComponents = ${
  Object.values(componentsByDir).reduce((sum, comps) => sum + comps.length, 0)
}
`

fs.writeFileSync(path.join(process.cwd(), 'components', 'index.ts'), rootBarrel, 'utf-8')
console.log(`✓ Created components/index.ts (root barrel export)`)

// Generate report
const report = `# Phase 3 - Barrel Exports Generated

## Summary

Generated barrel export files for component organization:

### atoms/index.ts
- ${componentsByDir.atoms.length} atomic components exported
${componentsByDir.atoms.map((c) => `  - ${c.name}`).join('\n')}

### molecules/index.ts
- ${componentsByDir.molecules.length} molecular components exported
${componentsByDir.molecules.map((c) => `  - ${c.name}`).join('\n')}

### organisms/index.ts
- ${componentsByDir.organisms.length} organism components exported
${componentsByDir.organisms.map((c) => `  - ${c.name}`).join('\n')}

### templates/index.ts
- ${componentsByDir.templates.length} template components exported
${componentsByDir.templates.map((c) => `  - ${c.name}`).join('\n')}

### components/index.ts (root barrel)
- Consolidates all component exports
- Exports componentRegistry for type-safe access
- Total components: ${Object.values(componentsByDir).reduce((sum, comps) => sum + comps.length, 0)}

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
`

fs.writeFileSync(
  path.join(process.cwd(), 'data', 'phase3-barrel-exports-generated.md'),
  report,
  'utf-8'
)

console.log(report)
console.log('Phase 3 complete: Barrel exports generated.')
