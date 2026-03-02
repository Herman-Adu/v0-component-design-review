import type { CmsReferenceDocument } from "@/lib/strapi/dashboard/documentation/cms-reference/cms-reference-schema";

export const mockCmsReferenceDocuments: CmsReferenceDocument[] = [
  {
    meta: {
      slug: "strapi-setup",
      title: "Setting Up Strapi CMS",
      excerpt:
        "Complete guide to installing, configuring, and deploying Strapi in your environment. Covers local development, Docker setup, and production deployment.",
      category: "cms-reference",
      audience: "Backend Developer",
      publishedAt: "2026-01-10",
      lastUpdated: "2026-02-28",
      tags: ["strapi", "setup", "configuration", "deployment"],
    },
    seo: {
      metaTitle: "Strapi CMS Setup Guide - Installation & Configuration",
      metaDescription:
        "Step-by-step guide to set up Strapi CMS locally and in production with Docker and environment configuration.",
    },
    toc: [
      { id: "prerequisites", title: "Prerequisites", level: 2 },
      { id: "local-setup", title: "Local Development Setup", level: 2 },
      { id: "docker", title: "Docker Setup", level: 2 },
      { id: "production", title: "Production Deployment", level: 2 },
    ],
    blocks: [
      {
        type: "block.sectionHeader",
        id: "prerequisites",
        title: "Prerequisites",
        number: "01",
      },
      {
        type: "block.list",
        ordered: true,
        items: [
          "Node.js 18.x or higher",
          "npm or yarn package manager",
          "PostgreSQL or MySQL database",
          "Basic command-line knowledge",
        ],
      },
      {
        type: "block.sectionHeader",
        id: "local-setup",
        title: "Local Development Setup",
        number: "02",
      },
      {
        type: "block.codeBlock",
        language: "bash",
        code: "npx create-strapi-app@latest my-strapi-project\ncd my-strapi-project\nnpm run develop",
        title: "Quick Start Commands",
        showLineNumbers: true,
      },
      {
        type: "block.callout",
        calloutType: "info",
        title: "Default Admin Creation",
        content:
          "On first run, Strapi will prompt you to create an admin user. Save these credentials securely.",
      },
      {
        type: "block.sectionHeader",
        id: "docker",
        title: "Docker Setup",
        number: "03",
      },
      {
        type: "block.codeBlock",
        language: "yaml",
        code: 'version: "3.8"\nservices:\n  strapi:\n    image: strapi/base:latest\n    ports:\n      - "1337:1337"\n    environment:\n      - DATABASE_CLIENT=postgres\n      - DATABASE_HOST=db',
        title: "Docker Compose Example",
      },
    ],
  },
  {
    meta: {
      slug: "custom-fields-plugins",
      title: "Custom Fields & Plugins",
      excerpt:
        "Learn how to extend Strapi with custom fields, plugins, and middleware. Includes examples of building and publishing custom plugins.",
      category: "cms-reference",
      audience: "Backend Developer",
      publishedAt: "2026-01-25",
      lastUpdated: "2026-02-25",
      tags: ["strapi", "plugins", "custom-fields", "extensions"],
    },
    seo: {
      metaTitle: "Building Custom Strapi Plugins and Fields",
      metaDescription:
        "Complete guide to creating custom Strapi plugins, fields, and middleware to extend CMS functionality.",
    },
    toc: [
      { id: "plugin-overview", title: "Plugin Architecture", level: 2 },
      { id: "custom-fields", title: "Creating Custom Fields", level: 2 },
      { id: "middleware", title: "Middleware & Hooks", level: 2 },
    ],
    blocks: [
      {
        type: "block.sectionHeader",
        id: "plugin-overview",
        title: "Plugin Architecture",
        number: "01",
      },
      {
        type: "block.paragraph",
        content:
          "Strapi plugins extend functionality through a well-defined architecture. Each plugin can have server-side logic, admin panel UI, and configuration.",
      },
      {
        type: "block.featureGrid",
        title: "Plugin Capabilities",
        features: [
          {
            icon: "Code",
            title: "Server APIs",
            description: "Create custom REST/GraphQL endpoints",
          },
          {
            icon: "Palette",
            title: "Admin UI",
            description: "Custom admin panel components",
          },
          {
            icon: "Settings",
            title: "Configuration",
            description: "Plugin-specific settings and options",
          },
        ],
      },
      {
        type: "block.sectionHeader",
        id: "custom-fields",
        title: "Creating Custom Fields",
        number: "02",
      },
      {
        type: "block.codeBlock",
        language: "typescript",
        code: "export default {\n  strapi: {\n    register() {\n      // Register custom field type\n    },\n    bootstrap() {\n      // Initialize field\n    },\n  },\n};",
        title: "Basic Plugin Structure",
      },
    ],
  },
  {
    meta: {
      slug: "content-types-collections",
      title: "Content Types & Collection Setup",
      excerpt:
        "Detailed reference for creating and managing content types, single types, and collections. Includes best practices for schema design and relationships.",
      category: "cms-reference",
      audience: "Backend Developer",
      publishedAt: "2026-02-05",
      lastUpdated: "2026-02-28",
      tags: ["strapi", "content-types", "schema", "collections"],
    },
    seo: {
      metaTitle: "Strapi Content Types & Collections Reference",
      metaDescription:
        "Complete guide to creating Strapi content types, setting up collections, and managing relationships between content.",
    },
    blocks: [
      {
        type: "block.sectionHeader",
        id: "fundamentals",
        title: "Content Type Fundamentals",
        number: "01",
      },
      {
        type: "block.paragraph",
        content:
          "Content types in Strapi define the structure of your data. Each field can have attributes, validations, and behaviors.",
      },
      {
        type: "block.callout",
        calloutType: "warning",
        title: "Schema Immutability",
        content:
          "Changing field types after creation requires database migration. Plan your schema carefully.",
      },
    ],
  },
];

export const mockCmsReferenceDocument: CmsReferenceDocument =
  mockCmsReferenceDocuments[0];
