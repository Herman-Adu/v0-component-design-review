# Strapi Builder Pattern — Collection Types & Dynamic Zones

**Status:** Governance Pattern (Feb 28, 2026)  
**Authority:** Canonical Strapi modeling for all content domains  
**Extends:** STRAPI_DYNAMIC_ZONES_AUTHORITY.md  
**Last Updated:** 2026-02-28

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Strapi Architecture Model](#strapi-architecture-model)
3. [Collection Types (4 Domains)](#collection-types-4-domains)
4. [Dynamic Zones Mapping](#dynamic-zones-mapping)
5. [SEO Plugin Integration](#seo-plugin-integration)
6. [Relations & References](#relations--references)
7. [Validation Strategy](#validation-strategy)

---

## Executive Summary

This document defines **how to structure Strapi collection types** to align with the 6-layer architecture and canonical contract. It serves as the bridge between:

- **Abstract Governance** (STRAPI_DYNAMIC_ZONES_AUTHORITY.md defines the rules)
- **Strapi Implementation** (This document defines the Strapi models)
- **Code Migration** (EXTRACTION_FIRST_MIGRATION_PLAN.md uses these schemas)

### Key Principles

1. ✅ **One collection type per content domain** (Strategic, CMS-Reference, App-Reference, Infrastructure)
2. ✅ **Single schema field structure** mapping to canonical contract (meta → seo → route → access → toc → blocks)
3. ✅ **Dynamic zones for blocks** (11 core blocks defined in authority doc)
4. ✅ **Strapi SEO plugin fully integrated** (not optional, required from day 1)
5. ✅ **JSON field for archival** (preserve original markdown/structure before transformation)
6. ✅ **Validation rules locked** (no field mutations without governance review)

---

## Strapi Architecture Model

### High-Level Structure

```
Strapi Instance
├── admin/
│   └── SEO Plugin (strapi-plugin-seo) installed + configured
├── api/
│   ├── documentation-strategic/ (collection type)
│   ├── documentation-cms-reference/
│   ├── documentation-app-reference/
│   └── documentation-infrastructure/
└── content/ (populated by builder from JSON)
    └── {collections}
```

### Why This Model?

- **Separate collection type per domain** = isolated validation + query scoping
- **Shared schema pattern** = consistent contract across all domains
- **Strapi SEO plugin** = built-in metadata management, avoiding lock-in to any one tool
- **Dynamic zones** = extensible block rendering without schema changes
- **JSON archival field** = preserve source markdown before transformation

---

## Collection Types (4 Domains)

Each domain has an identical schema structure, customized for its content characteristics.

### Collection Type: `documentation-strategic`

**Purpose:** High-level system vision, roadmap, architecture decisions  
**Example Routes:** `/dashboard/documentation/strategic/vision`, `/dashboard/documentation/strategic/phase-1-foundation`  
**Content Characteristics:** Essays, 3000-8000 words, rarely changing, narrative-driven

#### Field Definition

```json
{
  "kind": "collectionType",
  "displayName": "Strategic Overview",
  "singularName": "documentation-strategic",
  "pluralName": "documentations-strategic",
  "description": "Strategic vision, roadmap, and architectural decisions",
  "attributes": {
    // ===== Metadata Tier =====
    "meta": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.meta",
      "required": true,
      "config": { "collapsed": false }
    },

    // ===== SEO Tier (Strapi SEO Plugin) =====
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.seo",
      "required": true,
      "config": { "collapsed": false }
    },

    // ===== Route Tier (Dynamic Routes) =====
    "route": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.route",
      "required": false,
      "config": { "collapsed": true }
    },

    // ===== Access Control Tier =====
    "access": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.access",
      "required": false,
      "config": { "collapsed": true }
    },

    // ===== Table of Contents Tier =====
    "toc": {
      "type": "component",
      "repeatable": true,
      "component": "documentation.toc-item",
      "required": false,
      "config": { "collapsed": true }
    },

    // ===== Content Blocks Tier (Dynamic Zone) =====
    "blocks": {
      "type": "dynamiczone",
      "components": [
        "blocks.text",
        "blocks.heading",
        "blocks.code",
        "blocks.image",
        "blocks.quote",
        "blocks.alert",
        "blocks.callout",
        "blocks.list",
        "blocks.table",
        "blocks.divider",
        "blocks.video"
      ],
      "required": true,
      "min": 1,
      "config": { "collapsed": false }
    },

    // ===== Archival Tier =====
    "sourceMarkdown": {
      "type": "richtext",
      "required": false,
      "config": { "collapsed": true }
    }
  }
}
```

### Collections Type: `documentation-cms-reference`

**Identical structure to Strategic**, customized field labels/help text:

```json
{
  "displayName": "CMS Reference",
  "singularName": "documentation-cms-reference",
  "description": "Strapi schema documentation, block definitions, content governance"
  // ... same attributes as documentation-strategic
}
```

### Collection Type: `documentation-app-reference`

**Identical structure to Strategic**, customized:

```json
{
  "displayName": "App Reference",
  "singularName": "documentation-app-reference",
  "description": "Application architecture, layers, patterns, and developer guides"
  // ... same attributes as documentation-strategic
}
```

### Collection Type: `documentation-infrastructure`

**Identical structure to Strategic**, customized:

```json
{
  "displayName": "Infrastructure & Ops",
  "singularName": "documentation-infrastructure",
  "description": "Deployment, CI/CD, monitoring, observability, and operational guides"
  // ... same attributes as documentation-strategic
}
```

---

## Dynamic Zones Mapping

The `blocks` field in each collection type is a **dynamic zone** containing 11 core block components.

### Block Components (Shared Across All Collections)

All blocks are defined in the `blocks` namespace:

#### `blocks.text`

```json
{
  "displayName": "Text",
  "singularName": "block-text",
  "attributes": {
    "content": {
      "type": "richtext",
      "required": true,
      "config": { "description": "Paragraph text content" }
    }
  }
}
```

#### `blocks.heading`

```json
{
  "displayName": "Heading",
  "singularName": "block-heading",
  "attributes": {
    "level": {
      "type": "enumeration",
      "enum": ["1", "2", "3", "4", "5", "6"],
      "required": true,
      "default": "2"
    },
    "content": {
      "type": "string",
      "required": true,
      "maxLength": 200
    },
    "anchorId": {
      "type": "string",
      "required": false,
      "help": "For TOC deep linking"
    }
  }
}
```

#### `blocks.code`

```json
{
  "displayName": "Code Block",
  "singularName": "block-code",
  "attributes": {
    "language": {
      "type": "enumeration",
      "enum": [
        "typescript",
        "javascript",
        "jsx",
        "python",
        "json",
        "bash",
        "sql",
        "html",
        "css",
        "yaml"
      ],
      "required": true,
      "default": "typescript"
    },
    "content": {
      "type": "text",
      "required": true
    },
    "title": {
      "type": "string",
      "required": false,
      "help": "Optional file name or code block title"
    }
  }
}
```

#### `blocks.image`

```json
{
  "displayName": "Image",
  "singularName": "block-image",
  "attributes": {
    "url": {
      "type": "string",
      "required": true
    },
    "alt": {
      "type": "string",
      "required": true,
      "help": "Accessibility-critical alt text"
    },
    "caption": {
      "type": "string",
      "required": false
    }
  }
}
```

#### `blocks.quote`

```json
{
  "displayName": "Quote",
  "singularName": "block-quote",
  "attributes": {
    "content": {
      "type": "richtext",
      "required": true
    },
    "author": {
      "type": "string",
      "required": false
    }
  }
}
```

#### `blocks.alert`

```json
{
  "displayName": "Alert",
  "singularName": "block-alert",
  "attributes": {
    "alertType": {
      "type": "enumeration",
      "enum": ["info", "warning", "error", "success"],
      "required": true,
      "default": "info"
    },
    "content": {
      "type": "richtext",
      "required": true
    }
  }
}
```

#### `blocks.callout`

```json
{
  "displayName": "Callout",
  "singularName": "block-callout",
  "attributes": {
    "type": {
      "type": "string",
      "required": true,
      "help": "Custom callout type (diagram, reference, important, etc.)"
    },
    "title": {
      "type": "string",
      "required": true
    },
    "content": {
      "type": "richtext",
      "required": true
    }
  }
}
```

#### `blocks.list`

```json
{
  "displayName": "List",
  "singularName": "block-list",
  "attributes": {
    "ordered": {
      "type": "boolean",
      "required": true,
      "default": false
    },
    "items": {
      "type": "component",
      "repeatable": true,
      "component": "blocks.list-item"
    }
  }
}
```

#### `blocks.table`

```json
{
  "displayName": "Table",
  "singularName": "block-table",
  "attributes": {
    "headers": {
      "type": "component",
      "repeatable": true,
      "component": "blocks.table-cell"
    },
    "rows": {
      "type": "component",
      "repeatable": true,
      "component": "blocks.table-row"
    }
  }
}
```

#### `blocks.divider`

```json
{
  "displayName": "Divider",
  "singularName": "block-divider",
  "attributes": {}
}
```

#### `blocks.video`

```json
{
  "displayName": "Video",
  "singularName": "block-video",
  "attributes": {
    "url": {
      "type": "string",
      "required": true
    },
    "videoType": {
      "type": "enumeration",
      "enum": ["youtube", "vimeo"],
      "required": true
    },
    "aspectRatio": {
      "type": "enumeration",
      "enum": ["16:9", "4:3"],
      "required": false,
      "default": "16:9"
    }
  }
}
```

---

## SEO Plugin Integration

### Strapi SEO Plugin Configuration

Install and configure `strapi-plugin-seo`:

```bash
npm install strapi-plugin-seo
# OR
yarn add strapi-plugin-seo
```

### SEO Component (Shared)

```json
{
  "displayName": "SEO",
  "singularName": "seo-metadata",
  "attributes": {
    "metaTitle": {
      "type": "string",
      "required": false,
      "maxLength": 60,
      "help": "Override default title tag. Fallback: meta.title"
    },
    "metaDescription": {
      "type": "string",
      "required": false,
      "maxLength": 160,
      "help": "Override meta description. Fallback: meta.excerpt"
    },
    "keywords": {
      "type": "string",
      "required": false,
      "help": "Comma-separated keywords"
    },
    "canonicalUrl": {
      "type": "string",
      "required": false,
      "help": "Canonical URL (root-relative or absolute)"
    },
    "metaImage": {
      "type": "media",
      "required": false,
      "help": "Open Graph / Twitter image"
    },
    "metaSocial": {
      "type": "component",
      "repeatable": true,
      "component": "seo.meta-social"
    },
    "robots": {
      "type": "string",
      "required": false,
      "help": "Robots meta tag. E.g., 'noindex, nofollow'"
    },
    "preventIndexing": {
      "type": "boolean",
      "required": false,
      "default": false,
      "help": "If true, sets robots to 'noindex, nofollow'"
    }
  }
}
```

### Fallback Chain (Code Implementation)

During content builder phase, implement this fallback:

```typescript
function getSeoTitle(document: StrategyDocument): string {
  return document.seo?.metaTitle || document.meta.title;
}

function getSeoDescription(document: StrategyDocument): string {
  return document.seo?.metaDescription || document.meta.excerpt;
}

function shouldIndex(document: StrategyDocument): boolean {
  if (document.seo?.preventIndexing) return false;
  return true; // Default allow indexing
}
```

---

## Relations & References

### Cross-Domain References

If documentation domains need to reference each other (e.g., CMS-Reference → App-Reference):

```json
{
  "relatedDocuments": {
    "type": "relation",
    "relation": "morphMany",
    "target": "api::documentation-*.documentation",
    "required": false,
    "unique": false
  }
}
```

### Author/Owner Attribution

```json
{
  "owner": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "plugin::users-permissions.user",
    "required": false
  },
  "reviewedBy": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "plugin::users-permissions.user",
    "required": false
  },
  "lastModifiedBy": {
    "type": "relation",
    "relation": "manyToOne",
    "target": "plugin::users-permissions.user",
    "required": false
  }
}
```

---

## Validation Strategy

### Build-Time Validation (Zod)

During content builder (`documentation-*-content-builder.ts`), validate all Strapi entries:

```typescript
import { z } from "zod";
import { BlockSchema } from "@/lib/strapi/schemas/block-schema";

const SeoComponentSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  keywords: z.string().optional(),
  canonicalUrl: z.string().url().optional(),
  robots: z.string().optional(),
  preventIndexing: z.boolean().optional(),
});

const DocumentationStrategicSchema = z.object({
  meta: z.object({
    slug: z.string(),
    title: z.string(),
    excerpt: z.string(),
    category: z.string().optional(),
    level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    publishedAt: z.string().datetime(),
  }),
  seo: SeoComponentSchema.optional(),
  blocks: z.array(BlockSchema),
});
```

### Validation Gates (5-Gate Sequence)

| Gate                | Trigger                          | Success Criteria                                            | On Failure                          |
| ------------------- | -------------------------------- | ----------------------------------------------------------- | ----------------------------------- |
| **Gate 1: Schema**  | After content extraction to JSON | All JSON validates against Zod schema, zero errors          | Block migration, create report      |
| **Gate 2: Data**    | After data layer code written    | All repository queries return valid data, no nulls          | Block routes, create report         |
| **Gate 3: Routes**  | After page.tsx files created     | All routes render without console errors, metadata complete | Block quality checks, create report |
| **Gate 4: Quality** | After QA tests run               | Accessibility, performance, security scores met             | Block merge, create report          |
| **Gate 5: Build**   | After pnpm build                 | Build succeeds with zero warnings, sitemap generated        | Block deploy, create report         |

---

## Implementation Timeline

**Phase 2 (This Session):** Design (this document)  
**Phase 3 (Next Week):** Create Strapi collection types in admin console  
**Phase 4 (2 Weeks):** Populate with extracted content  
**Phase 5 (3 Weeks):** Validate all gates, merge to main

---

## Approval Checklist

- [ ] Senior Architect: Pattern aligns with STRAPI_DYNAMIC_ZONES_AUTHORITY.md
- [ ] Backend Lead: Strapi configuration feasible with current version
- [ ] Frontend Lead: Block components support all defined attributes
- [ ] SEO: Strapi SEO plugin integration correct
- [ ] CTO: Risk assessment passed

**Approved By:** ********\_******** **Date:** ****\_****

---

**Status:** Locked. Changes require formal review.
