#!/usr/bin/env node
/**
 * Documentation Format Final Fix Script
 *
 * Ensures ALL documentation blocks are in atomic format with proper variant values
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsPath = path.join(
  __dirname,
  "../data/strapi-mock/dashboard/documentation",
);

// Valid variant values for infoBox
const VALID_INFO_BOX_VARIANTS = ["info", "warning", "important"];

// Block type transformation
const blockTypeMapping = {
  "block.paragraph": "atom.paragraph",
  "block.sectionHeader": "molecule.sectionHeader",
  "block.callout": "molecule.infoBox",
  "block.codeBlock": "molecule.codeBlock",
  "block.featureGrid": "organism.featureGrid",
  "block.statsTable": "organism.statsTable",
  "block.list": "molecule.infoBox",
  "block.card": "organism.relatedArticles",
  "block.collapsible": "molecule.infoBox",
  "block.linkCard": "organism.relatedArticles",
};

// Transform any old-format block to new atomic format
function transformBlock(block) {
  if (!block || typeof block !== "object") return block;

  // Already in atomic format
  if (
    block.type &&
    (block.type.startsWith("atom.") ||
      block.type.startsWith("molecule.") ||
      block.type.startsWith("organism."))
  ) {
    // Fix variant values in infoBox
    if (
      block.type === "molecule.infoBox" &&
      block.props?.variant &&
      !VALID_INFO_BOX_VARIANTS.includes(block.props.variant)
    ) {
      // Map old variants to new ones
      const variantMap = {
        success: "info",
        error: "warning",
        default: "info",
      };
      block.props.variant = variantMap[block.props.variant] || "info";
    }

    // Ensure atomicLevel is set
    if (!block.atomicLevel) {
      block.atomicLevel = block.type.split(".")[0];
    }

    return block;
  }

  // Old block.* format - transform it
  const oldType = block.type;
  const newType = blockTypeMapping[oldType];

  if (!newType) {
    console.warn(`⚠️  Unknown block type: ${oldType}, keeping as-is...`);
    return block;
  }

  const atomicLevel = newType.split(".")[0];

  // Handle specific transformations based on old type
  switch (oldType) {
    case "block.paragraph":
      return {
        type: newType,
        atomicLevel: atomicLevel,
        props: {
          text: block.content || block.text || "",
        },
      };

    case "block.sectionHeader":
      return {
        type: newType,
        atomicLevel: atomicLevel,
        props: {
          number: block.number || "",
          title: block.title || "",
          id: block.id || "",
        },
      };

    case "block.callout":
      return {
        type: "molecule.infoBox",
        atomicLevel: "molecule",
        props: {
          variant: block.calloutType || "info",
          title: block.title || null,
          body: block.content || "",
        },
      };

    case "block.codeBlock":
      return {
        type: newType,
        atomicLevel: atomicLevel,
        props: {
          language: block.language || "typescript",
          code: block.code || "",
          title: block.title || null,
          showLineNumbers: block.showLineNumbers || false,
        },
      };

    case "block.featureGrid":
      return {
        type: newType,
        atomicLevel: atomicLevel,
        props: {
          columns: block.columns || 2,
          features: block.features || [],
        },
      };

    case "block.statsTable":
      return {
        type: newType,
        atomicLevel: atomicLevel,
        props: {
          headers:
            block.headers || block.stats?.length > 0 ? ["Label", "Value"] : [],
          rows: block.stats || block.rows || [],
        },
      };

    case "block.list":
      const items = block.items || [];
      return {
        type: "molecule.infoBox",
        atomicLevel: "molecule",
        props: {
          variant: "info",
          title: block.title || null,
          body: items.join("\n• ") || "",
        },
      };

    case "block.card":
      return {
        type: "organism.relatedArticles",
        atomicLevel: "organism",
        props: {
          title: block.title || null,
          links: [
            {
              href: block.href || "#",
              title: block.title || "Link",
              description: block.description || block.content || "",
              icon: block.icon || "",
            },
          ],
        },
      };

    case "block.collapsible":
      return {
        type: "molecule.infoBox",
        atomicLevel: "molecule",
        props: {
          variant: "info",
          title: block.title || null,
          body: block.content || "",
        },
      };

    case "block.linkCard":
      return {
        type: "organism.relatedArticles",
        atomicLevel: "organism",
        props: {
          title: block.title || null,
          links: [
            {
              href: block.href || "#",
              title: block.title || "Link",
              description: block.description || "",
              icon: block.icon || "",
            },
          ],
        },
      };

    default:
      console.warn(`⚠️  No transformation for: ${oldType}`);
      return block;
  }
}

// Process all documentation files
function processAllDocs() {
  const categories = fs.readdirSync(docsPath);
  let totalFixed = 0;
  const results = {};

  for (const category of categories) {
    const categoryPath = path.join(docsPath, category);
    if (!fs.statSync(categoryPath).isDirectory()) continue;

    results[category] = { fixed: 0, files: [] };

    const files = fs
      .readdirSync(categoryPath)
      .filter((f) => f.endsWith(".json"));

    for (const file of files) {
      const filePath = path.join(categoryPath, file);
      const content = fs.readFileSync(filePath, "utf-8");
      let data = JSON.parse(content);

      // Transform all blocks
      if (data.blocks && Array.isArray(data.blocks)) {
        let hasChanges = false;
        const transformedBlocks = [];

        for (const block of data.blocks) {
          const transformed = transformBlock(block);

          // Check if transformation happened
          if (JSON.stringify(transformed) !== JSON.stringify(block)) {
            hasChanges = true;
          }

          transformedBlocks.push(transformed);
        }

        if (hasChanges) {
          data.blocks = transformedBlocks;
          fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
          results[category].files.push(file);
          results[category].fixed++;
          totalFixed++;
          console.log(`✅ Fixed: ${category}/${file}`);
        }
      }
    }
  }

  // Summary
  console.log("\n🔧 DOCUMENTATION FIX COMPLETE\n");
  let grandTotal = 0;
  for (const [cat, info] of Object.entries(results)) {
    if (info.fixed > 0) {
      console.log(`${cat}: ${info.fixed} files fixed`);
      grandTotal += info.fixed;
    }
  }
  console.log(`\nTotal files fixed: ${grandTotal}`);
}

processAllDocs();
