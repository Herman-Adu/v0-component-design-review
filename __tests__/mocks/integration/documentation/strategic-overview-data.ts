import type { StrategicOverviewDocument } from "@/lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-schema";

export const mockStrategicDocuments: StrategicOverviewDocument[] = [
  {
    meta: {
      slug: "system-vision",
      title: "System Vision & Principles",
      excerpt:
        "Core architectural principles and design philosophy guiding this application. Understanding the 'why' behind technical decisions.",
      category: "strategic-overview",
      audience: "CTO / Project Lead",
      publishedAt: "2026-01-15",
      lastUpdated: "2026-03-01",
      tags: ["architecture", "strategy", "principles"],
    },
    seo: {
      metaTitle: "System Vision & Architectural Principles",
      metaDescription:
        "Learn the core principles and architectural decisions that shape this modern web application.",
    },
    toc: [
      { id: "vision", title: "Vision", level: 2 },
      { id: "principles", title: "Core Principles", level: 2 },
      { id: "decisions", title: "Key Decisions", level: 2 },
    ],
    blocks: [
      {
        type: "block.sectionHeader",
        id: "vision",
        title: "Vision",
        number: "01",
      },
      {
        type: "block.paragraph",
        content:
          "This application demonstrates modern web development best practices with a focus on maintainability, performance, and developer experience.",
      },
      {
        type: "block.sectionHeader",
        id: "principles",
        title: "Core Principles",
        number: "02",
      },
      {
        type: "block.list",
        ordered: false,
        items: [
          "Server-first architecture with minimal client JavaScript",
          "Atomic design for component reusability",
          "Type safety from API to UI",
          "Content as data with dynamic zones",
        ],
      },
      {
        type: "block.callout",
        calloutType: "info",
        title: "Architecture Philosophy",
        content:
          "Every technical decision prioritizes long-term maintainability over short-term convenience.",
      },
    ],
  },
  {
    meta: {
      slug: "strapi-decision",
      title: "Why Strapi CMS",
      excerpt:
        "Technical and business rationale for choosing Strapi as the headless CMS. ROI analysis and comparison with alternatives.",
      category: "strategic-overview",
      audience: "CTO / Project Lead",
      publishedAt: "2026-01-20",
      lastUpdated: "2026-02-28",
      tags: ["strapi", "cms", "technology-selection"],
    },
    seo: {
      metaTitle: "Why We Chose Strapi CMS - Technical Decision Record",
      metaDescription:
        "Comprehensive analysis of why Strapi was selected as our headless CMS over alternatives like Contentful and Sanity.",
    },
    toc: [
      { id: "context", title: "Decision Context", level: 2 },
      { id: "evaluation", title: "Evaluation Criteria", level: 2 },
      { id: "comparison", title: "Comparison", level: 2 },
      { id: "conclusion", title: "Conclusion", level: 2 },
    ],
    blocks: [
      {
        type: "block.sectionHeader",
        id: "context",
        title: "Decision Context",
        number: "01",
      },
      {
        type: "block.paragraph",
        content:
          "We needed a headless CMS that could handle both form submissions and content library requirements while maintaining type safety.",
      },
      {
        type: "block.sectionHeader",
        id: "evaluation",
        title: "Evaluation Criteria",
        number: "02",
      },
      {
        type: "block.featureGrid",
        title: "Key Requirements",
        features: [
          {
            icon: "Database",
            title: "Self-hosted Option",
            description: "Full control over data and deployment",
          },
          {
            icon: "Code",
            title: "TypeScript Support",
            description: "End-to-end type safety from CMS to frontend",
          },
          {
            icon: "DollarSign",
            title: "Cost Effective",
            description: "No per-seat or API call pricing",
          },
        ],
      },
    ],
  },
  {
    meta: {
      slug: "getting-started-overview",
      title: "Getting Started Guide",
      excerpt:
        "New to the documentation? Start here to understand the structure and navigate to the sections most relevant to your role.",
      category: "strategic-overview",
      audience: "Developer / Architect",
      publishedAt: "2026-02-01",
      lastUpdated: "2026-03-01",
      tags: ["getting-started", "onboarding", "guide"],
    },
    seo: {
      metaTitle: "Getting Started with the Documentation",
      metaDescription:
        "Complete guide to navigating documentation based on your role as developer, architect, or CTO.",
    },
    blocks: [
      {
        type: "block.paragraph",
        content:
          "This documentation is organized into strategic, CMS, app, and infrastructure sections. Each serves a different audience and purpose.",
      },
      {
        type: "block.callout",
        calloutType: "success",
        title: "Role-Based Navigation",
        content:
          "Jump directly to the section most relevant to your role: CMS Reference for backend developers, App Reference for frontend developers, Infrastructure for DevOps.",
      },
    ],
  },
];

export const mockStrategicDocument: StrategicOverviewDocument =
  mockStrategicDocuments[0];
