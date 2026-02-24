#!/usr/bin/env node

/**
 * Phase 4: Extract Platform Data
 * 
 * Purpose: Extract hardcoded arrays (tools, strategy) from LinkedIn, Facebook, Twitter pages
 * Output: JSON files in data/strapi-mock/platforms/
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.join(__dirname, '..')

// Platform configuration
const platforms = ['linkedin', 'facebook', 'twitter']
const outputDir = path.join(projectRoot, 'data', 'strapi-mock', 'platforms')

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

console.log('[Phase 4] Starting platform data extraction...\n')

// Extract arrays from page.tsx files
async function extractPlatformData() {
  const results = {
    platforms: {},
    totalArraysExtracted: 0,
    filesCreated: [],
  }

  for (const platform of platforms) {
    const pagePath = path.join(
      projectRoot,
      'app',
      '(dashboard)',
      'dashboard',
      'admin',
      'digital-marketing',
      platform,
      'page.tsx'
    )

    if (!fs.existsSync(pagePath)) {
      console.warn(`[Phase 4] Warning: Page not found at ${pagePath}`)
      continue
    }

    console.log(`[Phase 4] Processing ${platform.toUpperCase()} platform...`)
    const content = fs.readFileSync(pagePath, 'utf-8')

    // Extract tools array
    const toolsMatch = content.match(/const\s+tools\s*=\s*\[([\s\S]*?)\]\s*;?/m)
    const tools = toolsMatch ? parseArray(toolsMatch[1]) : []

    // Extract strategy array
    const strategyMatch = content.match(/const\s+strategy\s*=\s*\[([\s\S]*?)\]\s*;?/m)
    const strategy = strategyMatch ? parseArray(strategyMatch[1]) : []

    // Save tools data
    if (tools.length > 0) {
      const toolsFile = path.join(outputDir, `${platform}-tools.json`)
      fs.writeFileSync(toolsFile, JSON.stringify({ tools }, null, 2))
      results.filesCreated.push(toolsFile)
      results.totalArraysExtracted++
      console.log(`  ✓ Extracted ${tools.length} tools`)
    }

    // Save strategy data
    if (strategy.length > 0) {
      const strategyFile = path.join(outputDir, `${platform}-strategy.json`)
      fs.writeFileSync(strategyFile, JSON.stringify({ strategy }, null, 2))
      results.filesCreated.push(strategyFile)
      results.totalArraysExtracted++
      console.log(`  ✓ Extracted ${strategy.length} strategy phases`)
    }

    results.platforms[platform] = {
      toolsCount: tools.length,
      strategyCount: strategy.length,
    }
  }

  return results
}

// Parse object literals from extracted strings
function parseArray(arrayContent) {
  const objects = []
  // This is a simplified parser - in production, use proper AST parsing
  // For now, we extract object literals as strings and reconstruct them
  const objectMatches = arrayContent.match(/\{[^{}]*\}/g) || []
  
  for (const objStr of objectMatches) {
    try {
      // Clean up the object string and evaluate
      const cleanStr = objStr
        .replace(/(\w+):/g, '"$1":')
        .replace(/'/g, '"')
        .replace(/,\s*}/g, '}')
      const obj = JSON.parse(cleanStr)
      objects.push(obj)
    } catch (e) {
      // Skip malformed objects
    }
  }
  
  return objects
}

// Main execution
async function main() {
  try {
    const results = await extractPlatformData()
    
    console.log(`\n[Phase 4] Extraction complete!\n`)
    console.log(`Platform Summary:`)
    for (const [platform, stats] of Object.entries(results.platforms)) {
      console.log(`  ${platform}: ${stats.toolsCount} tools, ${stats.strategyCount} strategy phases`)
    }
    
    console.log(`\nFiles created: ${results.filesCreated.length}`)
    console.log(`Total arrays extracted: ${results.totalArraysExtracted}\n`)
    
    // Create summary report
    const reportPath = path.join(projectRoot, 'data', 'phase4-extraction-report.md')
    const report = `# Phase 4: Platform Data Extraction Report

Generated: ${new Date().toISOString()}

## Summary
- Total platforms processed: ${platforms.length}
- Total arrays extracted: ${results.totalArraysExtracted}
- Files created: ${results.filesCreated.length}

## Platform Details
${Object.entries(results.platforms)
  .map(([platform, stats]) => `- **${platform.toUpperCase()}**: ${stats.toolsCount} tools, ${stats.strategyCount} strategy phases`)
  .join('\n')}

## Output Files
${results.filesCreated.map(f => `- ${path.relative(projectRoot, f)}`).join('\n')}

## Next Steps
1. Review extracted data in data/strapi-mock/platforms/
2. Run phase4-refactor-platform-pages.js to update pages
3. Test build: pnpm build
4. Verify pages still render correctly with mock data
`
    
    fs.writeFileSync(reportPath, report)
    console.log(`Report saved to data/phase4-extraction-report.md\n`)
    
    process.exit(0)
  } catch (error) {
    console.error('[Phase 4] Error during extraction:', error.message)
    process.exit(1)
  }
}

main()
