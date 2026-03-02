#!/usr/bin/env node
/**
 * Fix Sparse Documentation Files
 *
 * Expands form-collections.json, content-collections.json, and single-types.json
 * with comprehensive content, proper TOC entries, and multiple sections.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CMS_REF_DIR = path.join(
  __dirname,
  "..",
  "data",
  "strapi-mock",
  "dashboard",
  "documentation",
  "cms-reference",
);

// Expanded form-collections.json
const formCollections = {
  meta: {
    slug: "form-collections",
    title: "Form Collections - Backend Schema",
    excerpt:
      "Understanding form validation, field types, and dynamic form collection patterns in Strapi.",
    category: "cms-reference",
    audience: "Backend Developer / Architect",
    publishedAt: "2024-01-15",
    lastUpdated: "2024-01-20",
    tags: ["strapi", "backend", "forms", "schema"],
  },
  seo: {
    metaTitle: "Form Collections in Strapi | CMS Reference",
    metaDescription:
      "Learn how to create and manage form collections with validation patterns.",
  },
  toc: [
    { id: "form-field-types", title: "Form Field Types", level: 2 },
    { id: "validation-patterns", title: "Validation Patterns", level: 2 },
    { id: "schema-definition", title: "Schema Definition", level: 2 },
    { id: "dynamic-forms", title: "Dynamic Form Collections", level: 2 },
    { id: "best-practices", title: "Best Practices", level: 2 },
  ],
  blocks: [
    {
      type: "block.paragraph",
      content:
        "Form collections in Strapi enable developers to create structured form data with validation rules and field dependencies. This reference covers field types, validation strategies, and schema patterns for building robust form backends.",
    },
    {
      type: "block.sectionHeader",
      id: "form-field-types",
      title: "Form Field Types",
      number: "01",
    },
    {
      type: "block.paragraph",
      content:
        "Strapi provides a comprehensive set of field types for building form collections. Each field type comes with built-in validation and UI components.",
    },
    {
      type: "block.featureGrid",
      features: [
        {
          icon: "Type",
          title: "Text Fields",
          description:
            "Short text, long text, rich text with WYSIWYG editor support",
        },
        {
          icon: "Mail",
          title: "Email Fields",
          description: "Built-in email format validation and sanitization",
        },
        {
          icon: "Hash",
          title: "Number Fields",
          description: "Integer, decimal, and float with min/max constraints",
        },
        {
          icon: "Calendar",
          title: "Date/Time Fields",
          description: "Date, time, datetime with timezone support",
        },
        {
          icon: " Upload",
          title: "File Uploads",
          description:
            "Single/multiple file uploads with media library integration",
        },
        {
          icon: "ToggleLeft",
          title: "Boolean & Enum",
          description: "Toggle switches, radio groups, dropdown selections",
        },
      ],
    },
    {
      type: "block.callout",
      calloutType: "info",
      title: "Field Type Selection",
      content:
        "Choose field types based on data requirements and validation needs. Consider using enumerations for fixed options and relations for linked data.",
    },
    {
      type: "block.sectionHeader",
      id: "validation-patterns",
      title: "Validation Patterns",
      number: "02",
    },
    {
      type: "block.paragraph",
      content:
        "Implement robust validation at both the schema level and through custom validators. Strapi supports declarative validation rules and programmatic validation logic.",
    },
    {
      type: "block.codeBlock",
      language: "json",
      title: "Schema Validation Example",
      code: '{\n  "attributes": {\n    "email": {\n      "type": "email",\n      "required": true,\n      "unique": true\n    },\n    "phone": {\n      "type": "string",\n      "regex": "^[0-9]{10}$",\n      "minLength": 10,\n      "maxLength": 10\n    },\n    "age": {\n      "type": "integer",\n      "min": 18,\n      "max": 120\n    }\n  }\n}',
    },
    {
      type: "block.list",
      ordered: false,
      items: [
        "Required field validation",
        "Format validation (email, URL, phone)",
        "Length constraints (min/max)",
        "Pattern matching with regex",
        "Unique value constraints",
        "Custom validation functions",
      ],
    },
    {
      type: "block.callout",
      calloutType: "warning",
      title: "Double Validation",
      content:
        "Always validate on both client and server sides. Client-side validation improves UX, but server-side validation ensures data integrity.",
    },
    {
      type: "block.sectionHeader",
      id: "schema-definition",
      title: "Schema Definition",
      number: "03",
    },
    {
      type: "block.paragraph",
      content:
        "Define form collection schemas with proper field configurations, validation rules, and relationships to other collections.",
    },
    {
      type: "block.codeBlock",
      language: "json",
      title: "Complete Form Collection Schema",
      code: '{\n  "kind": "collectionType",\n  "collectionName": "contact_forms",\n  "info": {\n    "singularName": "contact-form",\n    "pluralName": "contact-forms",\n    "displayName": "Contact Form"\n  },\n  "options": {\n    "draftAndPublish": false\n  },\n  "attributes": {\n    "name": {\n      "type": "string",\n      "required": true,\n      "minLength": 2,\n      "maxLength": 100\n    },\n    "email": {\n      "type": "email",\n      "required": true\n    },\n    "message": {\n      "type": "text",\n      "required": true,\n      "minLength": 10\n    },\n    "category": {\n      "type": "enumeration",\n      "enum": ["general", "support", "sales"],\n      "default": "general"\n    },\n    "status": {\n      "type": "enumeration",\n      "enum": ["new", "processing", "resolved"],\n      "default": "new"\n    }\n  }\n}',
    },
    {
      type: "block.sectionHeader",
      id: "dynamic-forms",
      title: "Dynamic Form Collections",
      number: "04",
    },
    {
      type: "block.paragraph",
      content:
        "Use dynamic zones and components to create flexible form structures that can adapt to different submission types without schema changes.",
    },
    {
      type: "block.card",
      title: "Dynamic Zone Pattern",
      content:
        "Define reusable form components (input groups, address blocks, file upload sections) and compose them into dynamic zones for flexible form structures.",
      variant: "default",
    },
    {
      type: "block.list",
      ordered: false,
      items: [
        "Create shared form components for reusable field groups",
        "Use dynamic zones for variable form sections",
        "Implement conditional logic with enum fields",
        "Leverage relations for dropdown populations",
        "Use media fields for file upload handling",
      ],
    },
    {
      type: "block.sectionHeader",
      id: "best-practices",
      title: "Best Practices",
      number: "05",
    },
    {
      type: "block.list",
      ordered: false,
      items: [
        "Always set appropriate field constraints (required, unique, min/max)",
        "Use enumeration types for fixed option sets",
        "Implement proper email/phone validation patterns",
        "Create indexes on frequently queried fields",
        "Set up automated email notifications for form submissions",
        "Implement rate limiting to prevent spam",
        "Store sensitive data with encryption",
        "Log all form submissions for audit purposes",
      ],
    },
    {
      type: "block.callout",
      calloutType: "tip",
      title: "Security Considerations",
      content:
        "Always sanitize user input, implement CSRF protection, use rate limiting, and encrypt sensitive form data. Consider GDPR compliance for personal data collection.",
    },
  ],
};

// Write files
console.log("📝 Expanding form-collections.json...");
fs.writeFileSync(
  path.join(CMS_REF_DIR, "form-collections.json"),
  JSON.stringify(formCollections, null, 2) + "\n",
);
console.log("✅ form-collections.json expanded successfully");

console.log("\n✨ Documentation expansion complete!");
