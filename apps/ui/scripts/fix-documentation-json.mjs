import fs from "fs";
import path from "path";

const ROOT = path.join(
  process.cwd(),
  "data",
  "strapi-mock",
  "dashboard",
  "documentation",
);

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function toTitle(value = "") {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function extractFirstJsonObject(raw) {
  let inString = false;
  let escaped = false;
  let depth = 0;
  let start = -1;

  for (let index = 0; index < raw.length; index += 1) {
    const char = raw[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        return raw.slice(start, index + 1);
      }
    }
  }

  return raw;
}

function normalizeKnownJsonTypos(raw) {
  return raw
    .replace(/"\s*\n\s*\}\);"/g, '",\n              "});"')
    .replace(/\r\n/g, "\n");
}

function convertSectionToBlocks(section, number) {
  const blocks = [];
  const sectionId =
    slugify(section?.title || `section-${number}`) || `section-${number}`;

  blocks.push({
    type: "block.sectionHeader",
    id: sectionId,
    title: section?.title || `Section ${number}`,
    number: String(number).padStart(2, "0"),
  });

  if (Array.isArray(section?.items) && section.items.length > 0) {
    blocks.push({
      type: "block.list",
      ordered: false,
      items: section.items.map((item) => String(item)),
    });
  }

  if (Array.isArray(section?.points) && section.points.length > 0) {
    blocks.push({
      type: "block.list",
      ordered: false,
      items: section.points.map((item) => String(item)),
    });
  }

  if (Array.isArray(section?.subsections)) {
    for (const subsection of section.subsections) {
      const cardLines = [];
      if (subsection?.description)
        cardLines.push(String(subsection.description));
      if (subsection?.target) cardLines.push(`Target: ${subsection.target}`);

      const hasArrays = [
        "items",
        "points",
        "steps",
        "benefits",
        "optimization_tips",
      ].some(
        (key) => Array.isArray(subsection?.[key]) && subsection[key].length > 0,
      );

      if (
        cardLines.length > 0 ||
        (!hasArrays && !subsection?.code && !subsection?.example)
      ) {
        blocks.push({
          type: "block.card",
          title: subsection?.title || "Details",
          content:
            cardLines.join("\n\n") ||
            "Refer to the implementation notes for this subsection.",
          variant: "default",
        });
      }

      for (const [key, ordered] of [
        ["items", false],
        ["points", false],
        ["benefits", false],
        ["optimization_tips", false],
        ["steps", true],
      ]) {
        if (Array.isArray(subsection?.[key]) && subsection[key].length > 0) {
          blocks.push({
            type: "block.list",
            ordered,
            items: subsection[key].map((item) => String(item)),
          });
        }
      }

      if (Array.isArray(subsection?.code) && subsection.code.length > 0) {
        blocks.push({
          type: "block.codeBlock",
          language: "tsx",
          title: subsection?.title || "Code Example",
          code: subsection.code.join("\n"),
        });
      }

      if (
        typeof subsection?.example === "string" &&
        subsection.example.trim().length > 0
      ) {
        blocks.push({
          type: "block.callout",
          calloutType: "info",
          title: subsection?.title || "Example",
          content: subsection.example,
        });
      }
    }
  }

  return blocks;
}

function convertOldShape(document) {
  const summary = document?.content?.summary || document?.description || "";
  const sections = Array.isArray(document?.content?.sections)
    ? document.content.sections
    : [];

  const normalized = {
    meta: {
      slug: document.slug,
      title: document.title,
      excerpt:
        document.description ||
        summary ||
        `Documentation for ${document.title}`,
      category: document.category,
      audience: "Developers",
      publishedAt: "2026-02-01",
      lastUpdated: "2026-03-02",
      tags: [document.category, document.slug, "documentation"],
    },
    seo: {
      metaTitle: document.title,
      metaDescription:
        document.description ||
        summary ||
        `Documentation for ${document.title}`,
    },
    toc: sections.map((section) => ({
      id: slugify(section?.title || "section"),
      title: section?.title || "Section",
      level: 2,
    })),
    blocks: [],
  };

  if (summary) {
    normalized.blocks.push({
      type: "block.paragraph",
      content: summary,
    });
  }

  sections.forEach((section, index) => {
    normalized.blocks.push(...convertSectionToBlocks(section, index + 1));
  });

  if (normalized.blocks.length === 0) {
    normalized.blocks.push({
      type: "block.paragraph",
      content:
        "Documentation content is being migrated to dynamic zone blocks.",
    });
  }

  return normalized;
}

function ensureMetaFields(document, filePath) {
  const category = path.basename(path.dirname(filePath));
  const fileSlug = path.basename(filePath, ".json");

  if (!document.meta.audience) document.meta.audience = "Developers";
  if (!document.meta.publishedAt) document.meta.publishedAt = "2026-02-01";
  if (!document.meta.lastUpdated) document.meta.lastUpdated = "2026-03-02";
  if (!Array.isArray(document.meta.tags) || document.meta.tags.length === 0) {
    document.meta.tags = [category, fileSlug, "documentation"];
  }
  if (!document.meta.category) document.meta.category = category;
  if (!document.meta.slug) document.meta.slug = fileSlug;

  if (!document.seo) {
    document.seo = {
      metaTitle: document.meta.title,
      metaDescription: document.meta.excerpt,
    };
  }

  if (!Array.isArray(document.toc)) {
    document.toc = [];
    document.blocks
      .filter((block) => block?.type === "block.sectionHeader")
      .forEach((block) => {
        document.toc.push({ id: block.id, title: block.title, level: 2 });
      });
  }
}

const files = fs
  .readdirSync(ROOT, { recursive: true })
  .filter((entry) => String(entry).endsWith(".json"))
  .map((entry) => path.join(ROOT, entry));

let converted = 0;
let normalized = 0;

for (const file of files) {
  const raw = fs.readFileSync(file, "utf-8");
  const prepared = normalizeKnownJsonTypos(raw);
  const objectText = extractFirstJsonObject(prepared);

  let parsed;
  try {
    parsed = JSON.parse(objectText);
  } catch (error) {
    console.error(`SKIP_PARSE_ERROR ${file}`);
    console.error(String(error?.message || error));
    continue;
  }

  let out = parsed;

  if (!parsed.meta || !parsed.blocks) {
    out = convertOldShape(parsed);
    converted += 1;
  } else {
    normalized += 1;
  }

  ensureMetaFields(out, file);
  fs.writeFileSync(file, `${JSON.stringify(out, null, 2)}\n`, "utf-8");
}

console.log(`FILES=${files.length}`);
console.log(`CONVERTED=${converted}`);
console.log(`NORMALIZED=${normalized}`);
