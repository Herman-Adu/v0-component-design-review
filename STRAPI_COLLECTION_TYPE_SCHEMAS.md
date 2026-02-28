# Strapi Collection Type Schemas — 4 Domains Configuration

**Status:** Collection Type Design (Feb 28, 2026)  
**Authority:** Exact Strapi admin configuration for all documentation domains  
**Purpose:** Ready to import into Strapi admin console (Phase 3)  
**Last Updated:** 2026-02-28

---

## Table of Contents

1. [Overview](#overview)
2. [Shared Components (All Domains)](#shared-components-all-domains)
3. [Collection Type: documentation-strategic](#collection-type-documentation-strategic)
4. [Collection Type: documentation-cms-reference](#collection-type-documentation-cms-reference)
5. [Collection Type: documentation-app-reference](#collection-type-documentation-app-reference)
6. [Collection Type: documentation-infrastructure](#collection-type-documentation-infrastructure)

---

## Overview

All 4 domains use **identical schema structure** with domain-specific display names and help text. This ensures:

- ✅ Consistent field structure across all documentation
- ✅ Shared SEO plugin integration (Strapi plugin-seo)
- ✅ Identical validation rules (Zod schemas in code layer)
- ✅ Single query pattern in repository layer

### Inheritance Hierarchy

```
Base Content Document (meta + seo + route + access + toc + blocks)
        ↓
Documentation-Strategic (extends base)
Documentation-CMS-Reference (extends base)
Documentation-App-Reference (extends base)
Documentation-Infrastructure (extends base)
```

### Field Structure (All Domains)

| Tier        | Field          | Type                   | Required | Purpose                                                    |
| ----------- | -------------- | ---------------------- | -------- | ---------------------------------------------------------- |
| **Meta**    | meta           | component              | YES      | Title, slug, excerpt, category, level, publishedAt         |
| **SEO**     | seo            | component              | YES      | metaTitle, metaDescription, keywords, canonicalUrl, robots |
| **Route**   | route          | component              | NO       | Dynamic route pattern + params for sitemap                 |
| **Access**  | access         | component              | NO       | Authorization (requiresAuth, roles)                        |
| **TOC**     | toc            | component (repeatable) | NO       | Table of contents (nested sections)                        |
| **Content** | blocks         | dynamiczone            | YES      | 11 core block components                                   |
| **Archive** | sourceMarkdown | richtext               | NO       | Original markdown before transformation                    |

---

## Shared Components (All Domains)

These components are reused across all 4 documentation collection types.

### Component: `documentation.meta`

```json
{
  "displayName": "Metadata",
  "singularName": "metadata",
  "pluralName": "metadatas",
  "description": "Document metadata (title, slug, excerpt, category, publication)",
  "attributes": {
    "slug": {
      "type": "string",
      "unique": true,
      "required": true,
      "pattern": "[a-z0-9-]+",
      "help": "URL-safe unique identifier (e.g., 'system-vision')"
    },
    "title": {
      "type": "string",
      "required": true,
      "maxLength": 200,
      "help": "Primary heading / H1"
    },
    "excerpt": {
      "type": "string",
      "required": true,
      "maxLength": 300,
      "help": "Summary (fallback for SEO description)"
    },
    "category": {
      "type": "string",
      "required": false,
      "help": "Section taxonomy (e.g., 'vision', 'phases', 'architecture')"
    },
    "level": {
      "type": "enumeration",
      "enum": ["beginner", "intermediate", "advanced"],
      "required": false,
      "default": "intermediate",
      "help": "Difficulty level for content filtering"
    },
    "readTime": {
      "type": "string",
      "required": false,
      "help": "Estimated read time (e.g., '25 min')"
    },
    "publishedAt": {
      "type": "datetime",
      "required": true,
      "help": "Publication date (ISO format)"
    },
    "tags": {
      "type": "string",
      "required": false,
      "help": "Comma-separated tags for search"
    }
  }
}
```

### Component: `documentation.seo`

```json
{
  "displayName": "SEO Metadata",
  "singularName": "seo-metadata",
  "pluralName": "seo-metadatas",
  "description": "SEO fields (Strapi SEO Plugin compatible)",
  "attributes": {
    "metaTitle": {
      "type": "string",
      "maxLength": 60,
      "required": false,
      "help": "Override title tag (60 chars max). Fallback: meta.title"
    },
    "metaDescription": {
      "type": "string",
      "maxLength": 160,
      "required": false,
      "help": "Meta description (160 chars max). Fallback: meta.excerpt"
    },
    "keywords": {
      "type": "string",
      "required": false,
      "help": "Comma-separated keywords for SEO"
    },
    "canonicalUrl": {
      "type": "string",
      "required": false,
      "help": "Canonical URL (root-relative: /docs/strategic/vision)"
    },
    "metaImage": {
      "type": "media",
      "required": false,
      "help": "Open Graph / Twitter image"
    },
    "metaSocial": {
      "type": "component",
      "repeatable": true,
      "component": "seo.meta-social",
      "help": "Platform-specific overrides (Facebook, Twitter)"
    },
    "robots": {
      "type": "string",
      "required": false,
      "help": "Robots meta tag (e.g., 'index, follow')"
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

### Component: `seo.meta-social`

```json
{
  "displayName": "Meta Social",
  "singularName": "meta-social",
  "pluralName": "meta-socials",
  "attributes": {
    "socialNetwork": {
      "type": "enumeration",
      "enum": ["Facebook", "Twitter"],
      "required": true
    },
    "title": {
      "type": "string",
      "maxLength": 200,
      "required": false
    },
    "description": {
      "type": "string",
      "maxLength": 300,
      "required": false
    },
    "image": {
      "type": "media",
      "required": false
    }
  }
}
```

### Component: `documentation.route`

```json
{
  "displayName": "Route",
  "singularName": "route",
  "pluralName": "routes",
  "description": "Dynamic route metadata for sitemap generation",
  "attributes": {
    "pattern": {
      "type": "string",
      "required": false,
      "help": "Route pattern (e.g., /docs/[domain]/[slug])"
    },
    "params": {
      "type": "json",
      "required": false,
      "help": "Route parameters as JSON object"
    }
  }
}
```

### Component: `documentation.access`

```json
{
  "displayName": "Access Control",
  "singularName": "access-control",
  "pluralName": "access-controls",
  "description": "Authorization and visibility rules",
  "attributes": {
    "requiresAuth": {
      "type": "boolean",
      "required": false,
      "default": false,
      "help": "Require authentication to view"
    },
    "requiredRoles": {
      "type": "string",
      "required": false,
      "help": "Comma-separated roles (admin,editor)"
    },
    "visibleToPublic": {
      "type": "boolean",
      "required": false,
      "default": true,
      "help": "Visible in public documentation"
    }
  }
}
```

### Component: `documentation.toc-item`

```json
{
  "displayName": "TOC Item",
  "singularName": "toc-item",
  "pluralName": "toc-items",
  "description": "Table of contents section",
  "attributes": {
    "level": {
      "type": "integer",
      "required": true,
      "help": "Nesting level (1-6)"
    },
    "title": {
      "type": "string",
      "required": true,
      "help": "Section title"
    },
    "anchor": {
      "type": "string",
      "required": true,
      "help": "HTML anchor ID for linking"
    }
  }
}
```

---

## Collection Type: `documentation-strategic`

**Purpose:** High-level system vision, roadmap, architecture decisions  
**Display Name:** Strategic Overview  
**Singular Name:** documentation-strategic  
**Plural Name:** documentations-strategic

```json
{
  "kind": "collectionType",
  "displayName": "Strategic Overview",
  "singularName": "documentation-strategic",
  "pluralName": "documentations-strategic",
  "description": "System vision, roadmap, and architectural decisions",
  "attributes": {
    "meta": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.meta",
      "required": true,
      "config": {
        "collapsed": false,
        "label": "Metadata (slug, title, category, date)"
      }
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.seo",
      "required": true,
      "config": {
        "collapsed": false,
        "label": "SEO & Search Engine Metadata"
      }
    },
    "route": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.route",
      "required": false,
      "config": {
        "collapsed": true,
        "label": "Route Configuration"
      }
    },
    "access": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.access",
      "required": false,
      "config": {
        "collapsed": true,
        "label": "Access Control"
      }
    },
    "toc": {
      "type": "component",
      "repeatable": true,
      "component": "documentation.toc-item",
      "required": false,
      "min": 0,
      "max": 50,
      "config": {
        "collapsed": true,
        "label": "Table of Contents"
      }
    },
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
      "max": 100,
      "config": {
        "collapsed": false,
        "label": "Content Blocks (Dynamic Zone)"
      }
    },
    "sourceMarkdown": {
      "type": "richtext",
      "required": false,
      "config": {
        "collapsed": true,
        "label": "Source Markdown (Archival)"
      }
    }
  }
}
```

---

## Collection Type: `documentation-cms-reference`

**Purpose:** Strapi schema documentation, block definitions, content governance  
**Display Name:** CMS Reference  
**Singular Name:** documentation-cms-reference  
**Plural Name:** documentations-cms-reference

```json
{
  "kind": "collectionType",
  "displayName": "CMS Reference",
  "singularName": "documentation-cms-reference",
  "pluralName": "documentations-cms-reference",
  "description": "Strapi schema documentation, block definitions, content governance",
  "attributes": {
    "meta": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.meta",
      "required": true,
      "config": {
        "collapsed": false,
        "label": "Metadata"
      }
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.seo",
      "required": true,
      "config": {
        "collapsed": false,
        "label": "SEO Metadata"
      }
    },
    "route": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.route",
      "required": false,
      "config": { "collapsed": true }
    },
    "access": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.access",
      "required": false,
      "config": { "collapsed": true }
    },
    "toc": {
      "type": "component",
      "repeatable": true,
      "component": "documentation.toc-item",
      "required": false,
      "config": { "collapsed": true }
    },
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
    "sourceMarkdown": {
      "type": "richtext",
      "required": false,
      "config": { "collapsed": true }
    }
  }
}
```

---

## Collection Type: `documentation-app-reference`

**Purpose:** Application architecture, layers, patterns, developer guides  
**Display Name:** App Reference  
**Singular Name:** documentation-app-reference  
**Plural Name:** documentations-app-reference

```json
{
  "kind": "collectionType",
  "displayName": "App Reference",
  "singularName": "documentation-app-reference",
  "pluralName": "documentations-app-reference",
  "description": "Application architecture, layers, patterns, and developer guides",
  "attributes": {
    "meta": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.meta",
      "required": true,
      "config": { "collapsed": false }
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.seo",
      "required": true,
      "config": { "collapsed": false }
    },
    "route": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.route",
      "required": false,
      "config": { "collapsed": true }
    },
    "access": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.access",
      "required": false,
      "config": { "collapsed": true }
    },
    "toc": {
      "type": "component",
      "repeatable": true,
      "component": "documentation.toc-item",
      "required": false,
      "config": { "collapsed": true }
    },
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
    "sourceMarkdown": {
      "type": "richtext",
      "required": false,
      "config": { "collapsed": true }
    }
  }
}
```

---

## Collection Type: `documentation-infrastructure`

**Purpose:** Deployment, CI/CD, monitoring, observability, operations  
**Display Name:** Infrastructure & Ops  
**Singular Name:** documentation-infrastructure  
**Plural Name:** documentations-infrastructure

```json
{
  "kind": "collectionType",
  "displayName": "Infrastructure & Ops",
  "singularName": "documentation-infrastructure",
  "pluralName": "documentations-infrastructure",
  "description": "Deployment, CI/CD, monitoring, observability, and operational guides",
  "attributes": {
    "meta": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.meta",
      "required": true,
      "config": { "collapsed": false }
    },
    "seo": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.seo",
      "required": true,
      "config": { "collapsed": false }
    },
    "route": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.route",
      "required": false,
      "config": { "collapsed": true }
    },
    "access": {
      "type": "component",
      "repeatable": false,
      "component": "documentation.access",
      "required": false,
      "config": { "collapsed": true }
    },
    "toc": {
      "type": "component",
      "repeatable": true,
      "component": "documentation.toc-item",
      "required": false,
      "config": { "collapsed": true }
    },
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
    "sourceMarkdown": {
      "type": "richtext",
      "required": false,
      "config": { "collapsed": true }
    }
  }
}
```

---

## Implementation Notes

### Database Migration Path (Phase 3)

1. **Create components** in Strapi admin:
   - `documentation.meta`
   - `documentation.seo`
   - `documentation.route`
   - `documentation.access`
   - `documentation.toc-item`
   - `seo.meta-social`
   - 11 block components (text, heading, code, etc.)

2. **Create collection types** in Strapi admin:
   - `documentation-strategic`
   - `documentation-cms-reference`
   - `documentation-app-reference`
   - `documentation-infrastructure`

3. **Populate from JSON** (Phase 4):
   - Run content builder to load all JSON files
   - Validate against Zod schemas
   - Import into Strapi via API

### SEO Plugin Configuration

Install `strapi-plugin-seo` before creating collection types:

```bash
npm install strapi-plugin-seo
# Configure in strapi admin interface
```

---

**Status:** Locked schema design. Ready for Phase 3 implementation.
