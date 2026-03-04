#!/usr/bin/env node
/**
 * Documentation Content Enrichment Script
 *
 * Audits documentation JSON files and identifies opportunities to:
 * 1. Remove unnecessary TOC entries
 * 2. Replace simple blocks with richer atomic components
 * 3. Add visual elements (metrics, grids, diagrams, flows)
 * 4. Modernize structure to match content-library quality
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsPath = path.join(
  __dirname,
  "../data/strapi-mock/dashboard/documentation",
);

// Available rich block types
const richBlockTypes = {
  "atom.paragraph": "Body text, descriptions",
  "molecule.sectionHeader": "Section headings with numbering",
  "molecule.subSectionHeader": "Subsection headings",
  "molecule.infoBox": "Important info boxes (info/warning/important)",
  "molecule.codeBlock": "Code examples",
  "molecule.keyTakeaway": "Key learnings",
  "organism.featureGrid": "Feature grids (2-4 columns)",
  "organism.metricsGrid": "Metrics and statistics",
  "organism.statsTable": "Data tables",
  "organism.architectureDiagram": "Architecture diagrams",
  "organism.dataFlowDiagram": "Data flow visualizations",
  "organism.verticalFlow": "Vertical processes",
  "organism.stepFlow": "Step-by-step processes",
  "organism.processFlow": "Process workflows",
  "organism.beforeAfterComparison": "Before/after comparisons",
  "organism.comparisonCards": "Comparison cards",
  "organism.decisionTree": "Decision trees",
  "organism.fileTree": "File structures",
  "organism.relatedArticles": "Related content links",
};

// Walk through all JSON files
function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.endsWith(".json")) {
      callback(fullPath);
    }
  });
}

// Analyze a document
function analyzeDoc(filePath) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const analysis = {
      filePath,
      slug: content.meta?.slug,
      title: content.meta?.title,
      hasToC: !!content.toc && content.toc.length > 0,
      tocCount: content.toc?.length || 0,
      blockCount: content.blocks?.length || 0,
      blockTypes: {},
      simpleBlocks: 0,
      richBlocks: 0,
      recommendations: [],
    };

    if (content.blocks) {
      content.blocks.forEach((block) => {
        const blockType = block.type || "unknown";
        analysis.blockTypes[blockType] =
          (analysis.blockTypes[blockType] || 0) + 1;

        // Count simple vs. rich
        if (blockType.startsWith("block.")) {
          analysis.simpleBlocks++;
        } else if (
          blockType.startsWith("molecule.") ||
          blockType.startsWith("organism.") ||
          blockType.startsWith("atom.")
        ) {
          analysis.richBlocks++;
        }
      });
    }

    // Generate recommendations
    if (analysis.hasToC && analysis.blockCount < 5) {
      analysis.recommendations.push(
        "❌ TOC present but minimal content - remove TOC",
      );
    }

    if (analysis.simpleBlocks > 0) {
      analysis.recommendations.push(
        `📝 ${analysis.simpleBlocks} simple blocks - upgrade to rich atomic components`,
      );
    }

    if (analysis.blockCount < 8) {
      analysis.recommendations.push(
        "✨ Content is minimal - expand with feature grids, metrics, info boxes",
      );
    }

    return analysis;
  } catch (error) {
    return { filePath, error: error.message };
  }
}

// Main execution
console.log("\n🔍 DOCUMENTATION CONTENT AUDIT\n");
console.log(
  "Analyzing documentation structure and enrichment opportunities...\n",
);

const analyses = [];
walkDir(docsPath, (filePath) => {
  const analysis = analyzeDoc(filePath);
  analyses.push(analysis);
});

// Sort by enrichment opportunity
analyses
  .filter((a) => !a.error)
  .sort((a, b) => b.blockCount - a.blockCount)
  .forEach((analysis) => {
    const richPercentage =
      analysis.blockCount > 0
        ? ((analysis.richBlocks / analysis.blockCount) * 100).toFixed(0)
        : 0;
    const status =
      analysis.richBlocks === 0
        ? "❌ NEEDS WORK"
        : analysis.richBlocks === analysis.blockCount
          ? "✅ GOOD"
          : "🟡 PARTIAL";

    console.log(`${status} ${analysis.title}`);
    console.log(`  Slug: ${analysis.slug}`);
    console.log(
      `  Blocks: ${analysis.blockCount} (${analysis.richBlocks} rich / ${analysis.simpleBlocks} simple) - ${richPercentage}% rich`,
    );
    if (analysis.hasToC) console.log(`  TOC: ${analysis.tocCount} items`);

    if (analysis.recommendations.length > 0) {
      console.log("  Recommendations:");
      analysis.recommendations.forEach((rec) => console.log(`    ${rec}`));
    }
    console.log();
  });

// Summary statistics
const totalDocs = analyses.filter((a) => !a.error).length;
const needsWork = analyses.filter((a) => !a.error && a.richBlocks === 0).length;
const hasToC = analyses.filter((a) => !a.error && a.hasToC).length;
const avgBlocks = (
  analyses.filter((a) => !a.error).reduce((sum, a) => sum + a.blockCount, 0) /
  totalDocs
).toFixed(1);

console.log("=" + "=".repeat(60));
console.log("\n📊 SUMMARY\n");
console.log(`  Total docs:        ${totalDocs}`);
console.log(
  `  Needs enrichment:  ${needsWork} (${((needsWork / totalDocs) * 100).toFixed(0)}%)`,
);
console.log(`  Has TOC:           ${hasToC}`);
console.log(`  Avg blocks/doc:    ${avgBlocks}\n`);

console.log("🎯 Available Rich Components to Use:");
console.log("  Layouts: featureGrid, metricsGrid, statsTable");
console.log("  Flows: verticalFlow, stepFlow, processFlow");
console.log(
  "  Diagrams: architectureDiagram, dataFlowDiagram, decisionTree, fileTree",
);
console.log("  Callouts: infoBox (info/warning/important), keyTakeaway");
console.log("  Comparisons: beforeAfterComparison, comparisonCards\n");

console.log("📝 Next Steps:");
console.log(
  "  1. Update strategic-overview/*.json to remove TOC and add rich blocks",
);
console.log("  2. Use featureGrid for listing components, architectures");
console.log("  3. Use metricsGrid for statistics and key numbers");
console.log("  4. Use infoBox for important notes and callouts");
console.log("  5. Use architectureDiagram or dataFlowDiagram for system flows");
console.log("  6. Use beforeAfterComparison for changes/improvements\n");
