import { readFile } from "node:fs/promises";
import path from "node:path";
import { glob } from "glob";

const WORKSPACE_ROOT = process.cwd();
const CONTENT_ROOT = path.join(
  WORKSPACE_ROOT,
  "data",
  "strapi-mock",
  "dashboard",
  "content-library",
);

const SECTIONS = ["articles", "tutorials", "guides", "case-studies"];
const DETAIL_SEGMENT_COUNT = 3;

const ALLOWED_ROBOTS_STRING_DIRECTIVES = new Set([
  "index,follow",
  "index,nofollow",
  "noindex,follow",
  "noindex,nofollow",
  "index",
  "noindex",
  "follow",
  "nofollow",
]);

const ALLOWED_ROBOTS_OBJECT_KEYS = new Set([
  "index",
  "follow",
  "noarchive",
  "nosnippet",
  "noimageindex",
  "nocache",
  "notranslate",
  "maxSnippet",
  "maxImagePreview",
  "maxVideoPreview",
]);

const ALLOWED_SOCIAL_NETWORKS = new Set(["facebook", "twitter"]);

function normalizeMeta(json) {
  if (json?.meta?.slug && json?.meta?.category) {
    return json.meta;
  }
  if (json?.slug && json?.category) {
    return json;
  }
  return null;
}

function parseHref(href) {
  const prefix = "/dashboard/content-library/";
  if (!href.startsWith(prefix)) return null;
  const rest = href.slice(prefix.length);
  const parts = rest.split("/").filter(Boolean);

  if (parts.length <= 1)
    return {
      section: parts[0] ?? null,
      category: null,
      slug: null,
      isDetailRoute: false,
      extra: [],
    };

  if (parts.length === 2)
    return {
      section: parts[0] ?? null,
      category: null,
      slug: null,
      isDetailRoute: false,
      extra: [],
    };

  return {
    section: parts[0] ?? null,
    category: parts[1] ?? null,
    slug: parts[2] ?? null,
    isDetailRoute: true,
    extra: parts.slice(DETAIL_SEGMENT_COUNT),
  };
}

function formatSuggestion(section, category, slug) {
  if (!section || !category || !slug) return null;
  return `/dashboard/content-library/${section}/${category}/${slug}`;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidImageUrl(value) {
  if (!isNonEmptyString(value)) return false;
  return value.startsWith("/") || /^https?:\/\//i.test(value);
}

function isValidCanonicalUrl(value) {
  if (!isNonEmptyString(value)) return false;
  return value.startsWith("/") || /^https?:\/\//i.test(value);
}

function normalizeRobotsString(value) {
  return value.toLowerCase().replace(/\s+/g, "");
}

function resolveSeoComponent(json) {
  const candidates = [
    json?.seo,
    json?.meta?.seo,
    json?.metadata?.seo,
    json?.seoMeta,
  ];

  for (const candidate of candidates) {
    if (candidate != null) return candidate;
  }

  return null;
}

function getSeoEnvelope(json, meta) {
  const seo = resolveSeoComponent(json);

  const title = seo?.metaTitle ?? meta.title ?? null;
  const description =
    seo?.metaDescription ?? meta.description ?? meta.excerpt ?? null;

  const canonicalUrl = seo?.canonicalUrl ?? meta.canonical ?? null;
  const keywords = seo?.keywords ?? meta.keywords ?? null;
  const image =
    seo?.metaImage ?? meta.image ?? meta.ogImage ?? meta.openGraphImage ?? null;

  const preventIndexing =
    typeof seo?.preventIndexing === "boolean" ? seo.preventIndexing : null;

  const robots = meta.robots ?? (preventIndexing ? "noindex,nofollow" : null);

  return {
    seo,
    title,
    description,
    canonicalUrl,
    keywords,
    image,
    robots,
    preventIndexing,
    metaSocial: seo?.metaSocial ?? null,
  };
}

function validateImagePolicy(imageValue) {
  if (imageValue == null) return { valid: true };

  if (typeof imageValue === "string") {
    return {
      valid: isValidImageUrl(imageValue),
      reason:
        "Invalid image policy. image/metaImage must be root-relative ('/...') or absolute http(s) URL.",
    };
  }

  if (typeof imageValue === "object") {
    const url = imageValue.url ?? imageValue.src ?? null;
    if (!isValidImageUrl(url)) {
      return {
        valid: false,
        reason:
          "Invalid image policy. image/metaImage object requires a valid url/src using root-relative or absolute http(s) URL.",
      };
    }

    if (imageValue.alt != null && !isNonEmptyString(imageValue.alt)) {
      return {
        valid: false,
        reason:
          "Invalid image policy. image/metaImage alt must be a non-empty string when provided.",
      };
    }

    return { valid: true };
  }

  return {
    valid: false,
    reason:
      "Invalid image policy. image/metaImage must be a string URL/path or an object with url/src and optional alt.",
  };
}

function validateSocialMeta(metaSocial) {
  if (metaSocial == null) return { valid: true };

  if (!Array.isArray(metaSocial)) {
    return {
      valid: false,
      reason: "seo.metaSocial must be an array when provided.",
    };
  }

  for (const entry of metaSocial) {
    if (!entry || typeof entry !== "object") {
      return {
        valid: false,
        reason: "Each seo.metaSocial entry must be an object.",
      };
    }

    if (!isNonEmptyString(entry.socialNetwork)) {
      return {
        valid: false,
        reason: "Each seo.metaSocial entry requires a non-empty socialNetwork.",
      };
    }

    const normalizedNetwork = entry.socialNetwork.toLowerCase();
    if (!ALLOWED_SOCIAL_NETWORKS.has(normalizedNetwork)) {
      return {
        valid: false,
        reason: "seo.metaSocial socialNetwork must be 'Facebook' or 'Twitter'.",
      };
    }

    if (entry.title != null && !isNonEmptyString(entry.title)) {
      return {
        valid: false,
        reason:
          "seo.metaSocial title must be a non-empty string when provided.",
      };
    }

    if (entry.description != null && !isNonEmptyString(entry.description)) {
      return {
        valid: false,
        reason:
          "seo.metaSocial description must be a non-empty string when provided.",
      };
    }

    const imageResult = validateImagePolicy(entry.image ?? null);
    if (!imageResult.valid) {
      return {
        valid: false,
        reason: `seo.metaSocial image invalid. ${imageResult.reason}`,
      };
    }
  }

  return { valid: true };
}

function validateRobotsPolicy(robots) {
  if (robots == null) {
    return { valid: true };
  }

  if (typeof robots === "string") {
    const normalized = normalizeRobotsString(robots);
    return {
      valid: ALLOWED_ROBOTS_STRING_DIRECTIVES.has(normalized),
      reason:
        "Robots string must be one of: index,follow | index,nofollow | noindex,follow | noindex,nofollow (or single-token variants).",
    };
  }

  if (typeof robots === "object") {
    const keys = Object.keys(robots);

    if (!keys.includes("index") || !keys.includes("follow")) {
      return {
        valid: false,
        reason: "Robots object must include boolean 'index' and 'follow'.",
      };
    }

    const hasUnknownKey = keys.some(
      (key) => !ALLOWED_ROBOTS_OBJECT_KEYS.has(key),
    );
    if (hasUnknownKey) {
      return {
        valid: false,
        reason:
          "Robots object contains unsupported keys. Allowed keys: index, follow, noarchive, nosnippet, noimageindex, nocache, notranslate, maxSnippet, maxImagePreview, maxVideoPreview.",
      };
    }

    if (
      typeof robots.index !== "boolean" ||
      typeof robots.follow !== "boolean"
    ) {
      return {
        valid: false,
        reason: "Robots object fields 'index' and 'follow' must be boolean.",
      };
    }

    return { valid: true };
  }

  return {
    valid: false,
    reason: "Robots must be a string or an object with index/follow booleans.",
  };
}

function robotsHasNoIndex(robots) {
  if (robots == null) return false;

  if (typeof robots === "string") {
    return normalizeRobotsString(robots).includes("noindex");
  }

  if (typeof robots === "object") {
    return robots.index === false;
  }

  return false;
}

const slugMaps = Object.fromEntries(SECTIONS.map((s) => [s, new Map()]));
const duplicateSlugErrors = [];
const jsonFiles = await glob("**/*.json", {
  cwd: CONTENT_ROOT,
  absolute: true,
});

for (const filePath of jsonFiles) {
  const raw = await readFile(filePath, "utf-8");
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    continue;
  }

  const meta = normalizeMeta(json);
  if (!meta) continue;

  const section = SECTIONS.find((s) =>
    filePath.includes(path.join(CONTENT_ROOT, s)),
  );
  if (!section) continue;

  if (meta.slug && meta.category) {
    const existingCategory = slugMaps[section].get(meta.slug);
    if (existingCategory && existingCategory !== meta.category) {
      duplicateSlugErrors.push({
        filePath,
        slug: meta.slug,
        category: meta.category,
        existingCategory,
        section,
      });
      continue;
    }

    slugMaps[section].set(meta.slug, meta.category);
  }
}

const hrefRegex = /"href"\s*:\s*"([^"]+)"/g;
const errors = [];

for (const filePath of jsonFiles) {
  const fileName = path.basename(filePath);
  if (fileName.endsWith("-list.json")) continue;

  const raw = await readFile(filePath, "utf-8");
  let json;
  try {
    json = JSON.parse(raw);
  } catch {
    errors.push({
      filePath,
      href: "N/A",
      reason: "Invalid JSON syntax",
    });
    continue;
  }

  const meta = normalizeMeta(json);
  if (!meta) continue;

  const seoEnvelope = getSeoEnvelope(json, meta);

  if (seoEnvelope.seo != null && typeof seoEnvelope.seo !== "object") {
    errors.push({
      filePath,
      href: "seo",
      reason: "Invalid SEO component. seo must be an object when provided.",
    });
    continue;
  }

  if (!isNonEmptyString(seoEnvelope.title)) {
    errors.push({
      filePath,
      href: "seo.metaTitle|meta.title",
      reason: "Missing required SEO field: metaTitle (or fallback meta.title)",
    });
  }

  if (!isNonEmptyString(seoEnvelope.description)) {
    errors.push({
      filePath,
      href: "seo.metaDescription|meta.description|meta.excerpt",
      reason:
        "Missing required SEO field: metaDescription (or fallback description/excerpt)",
    });
  }

  if (
    seoEnvelope.canonicalUrl != null &&
    !isValidCanonicalUrl(seoEnvelope.canonicalUrl)
  ) {
    errors.push({
      filePath,
      href: "seo.canonicalUrl|meta.canonical",
      reason:
        "Invalid canonical URL policy. canonicalUrl must be root-relative ('/...') or absolute http(s) URL.",
    });
  }

  if (seoEnvelope.keywords != null && !isNonEmptyString(seoEnvelope.keywords)) {
    errors.push({
      filePath,
      href: "seo.keywords|meta.keywords",
      reason:
        "Invalid keywords policy. keywords must be a non-empty string when provided.",
    });
  }

  const imageResult = validateImagePolicy(seoEnvelope.image);
  if (!imageResult.valid) {
    errors.push({
      filePath,
      href: "seo.metaImage|meta.image",
      reason: imageResult.reason,
    });
  }

  const socialResult = validateSocialMeta(seoEnvelope.metaSocial);
  if (!socialResult.valid) {
    errors.push({
      filePath,
      href: "seo.metaSocial",
      reason: socialResult.reason,
    });
  }

  if (
    seoEnvelope.seo &&
    seoEnvelope.seo.preventIndexing != null &&
    typeof seoEnvelope.seo.preventIndexing !== "boolean"
  ) {
    errors.push({
      filePath,
      href: "seo.preventIndexing",
      reason:
        "Invalid preventIndexing policy. Value must be boolean when provided.",
    });
  }

  const robotsResult = validateRobotsPolicy(seoEnvelope.robots);
  if (!robotsResult.valid) {
    errors.push({
      filePath,
      href: "meta.robots",
      reason: robotsResult.reason,
    });
  }

  if (
    seoEnvelope.preventIndexing === true &&
    seoEnvelope.robots != null &&
    !robotsHasNoIndex(seoEnvelope.robots)
  ) {
    errors.push({
      filePath,
      href: "seo.preventIndexing|meta.robots",
      reason:
        "preventIndexing=true requires robots noindex semantics (string containing 'noindex' or object with index=false).",
    });
  }
}

for (const filePath of jsonFiles) {
  const raw = await readFile(filePath, "utf-8");
  let match;
  while ((match = hrefRegex.exec(raw)) !== null) {
    const href = match[1];
    const parsed = parseHref(href);
    if (!parsed) continue;
    if (!parsed.section || !SECTIONS.includes(parsed.section)) continue;
    if (!parsed.isDetailRoute) continue;

    const section = parsed.section;
    const slugMap = slugMaps[section];
    const expectedCategory = parsed.slug ? slugMap.get(parsed.slug) : null;

    if (parsed.extra.length > 0) {
      errors.push({
        filePath,
        href,
        reason: "Unexpected extra path segments in detail URL",
      });
      continue;
    }

    if (!parsed.category || !parsed.slug) {
      const suggestion = expectedCategory
        ? formatSuggestion(section, expectedCategory, parsed.slug ?? "")
        : null;
      errors.push({
        filePath,
        href,
        reason: "Missing category or slug segment",
        suggestion,
      });
      continue;
    }

    if (!expectedCategory) {
      errors.push({
        filePath,
        href,
        reason: "Slug not found in content registry",
      });
      continue;
    }

    if (expectedCategory !== parsed.category) {
      errors.push({
        filePath,
        href,
        reason: `Category mismatch. Expected '${expectedCategory}'.`,
        suggestion: formatSuggestion(section, expectedCategory, parsed.slug),
      });
    }
  }
}

duplicateSlugErrors.forEach((err) => {
  errors.push({
    filePath: err.filePath,
    href: `${err.section}/${err.slug}`,
    reason: `Duplicate slug across categories. Existing '${err.existingCategory}', found '${err.category}'.`,
  });
});

if (errors.length > 0) {
  console.error(
    "\n[content-links] Validation failed. Fix links before commit:\n",
  );
  errors.forEach((err, index) => {
    console.error(`${index + 1}. ${err.reason}`);
    console.error(`   File: ${path.relative(WORKSPACE_ROOT, err.filePath)}`);
    console.error(`   href: ${err.href}`);
    if (err.suggestion) {
      console.error(`   fix : ${err.suggestion}`);
    }
    console.error("");
  });
  process.exit(1);
}

console.log("[content-links] Validation passed.");
