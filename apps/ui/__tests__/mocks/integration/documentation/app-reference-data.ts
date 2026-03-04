import type { AppReferenceDocument } from "@/lib/strapi/dashboard/documentation/app-reference/app-reference-schema";

export const mockAppReferenceDocuments: AppReferenceDocument[] = [
  {
    meta: {
      slug: "component-architecture",
      title: "Component Architecture & Atomic Design",
      excerpt:
        "Guide to the component library structure following atomic design principles. Includes atoms, molecules, organisms, and how to compose them effectively.",
      category: "app-reference",
      audience: "Frontend Developer",
      publishedAt: "2026-01-12",
      lastUpdated: "2026-02-27",
      tags: ["components", "atomic-design", "architecture", "react"],
    },
    seo: {
      metaTitle: "Frontend Component Architecture - Atomic Design Guide",
      metaDescription:
        "Learn the component hierarchy, Atomic Design principles, and best practices for building reusable UI components.",
    },
    toc: [
      { id: "atomic-design", title: "Atomic Design Principles", level: 2 },
      { id: "directory-structure", title: "Directory Organization", level: 2 },
      {
        id: "component-composition",
        title: "Component Composition Patterns",
        level: 2,
      },
      { id: "styling", title: "Styling & Theming", level: 2 },
    ],
    blocks: [
      {
        type: "molecule.sectionHeader",
        atomicLevel: "molecule",
        props: {
          id: "atomic-design",
          title: "Atomic Design Principles",
          number: "01",
        },
      },
      {
        type: "atom.paragraph",
        atomicLevel: "atom",
        props: {
          content:
            "Atomic Design is a methodology for creating design systems by breaking down interfaces into fundamental building blocks.",
        },
      },
      {
        type: "organism.featureGrid",
        atomicLevel: "organism",
        props: {
          title: "Design System Hierarchy",
          features: [
            {
              icon: "Zap",
              title: "Atoms",
              description: "Basic UI elements: buttons, inputs, labels",
            },
            {
              icon: "Package",
              title: "Molecules",
              description: "Groups of atoms: form fields, cards",
            },
            {
              icon: "Grid",
              title: "Organisms",
              description: "Complex components: forms, layouts",
            },
          ],
        },
      },
      {
        type: "molecule.sectionHeader",
        atomicLevel: "molecule",
        props: {
          id: "directory-structure",
          title: "Directory Organization",
          number: "02",
        },
      },
      {
        type: "molecule.codeBlock",
        atomicLevel: "molecule",
        props: {
          language: "bash",
          code: "components/\n├── atoms/\n│   ├── Button.tsx\n│   ├── Input.tsx\n│   └── Badge.tsx\n├── molecules/\n│   ├── FormField.tsx\n│   └── Card.tsx\n└── organisms/\n    └── DocumentationLayout.tsx",
          title: "Component Directory Structure",
        },
      },
      {
        type: "molecule.infoBox",
        atomicLevel: "molecule",
        props: {
          type: "success",
          title: "Naming Convention",
          content:
            "Use descriptive names that reflect the component's purpose, not its appearance. Prefer ButtonPrimary over ButtonBlue.",
        },
      },
    ],
  },
  {
    meta: {
      slug: "routing-navigation",
      title: "Routing & Navigation System",
      excerpt:
        "Reference for Next.js App Router implementation, dynamic routes, layout patterns, and navigation strategies. Covers both client and server-side routing.",
      category: "app-reference",
      audience: "Frontend Developer",
      publishedAt: "2026-01-28",
      lastUpdated: "2026-02-26",
      tags: ["routing", "next-js", "navigation", "layouts"],
    },
    seo: {
      metaTitle: "Next.js App Router & Navigation Guide",
      metaDescription:
        "Use Next.js 13+ App Router, dynamic routes, nested layouts, and navigation patterns for building scalable applications.",
    },
    toc: [
      { id: "app-router-basics", title: "App Router Basics", level: 2 },
      { id: "dynamic-routes", title: "Dynamic Routes", level: 2 },
      { id: "layouts", title: "Layout Architecture", level: 2 },
    ],
    blocks: [
      {
        type: "molecule.sectionHeader",
        atomicLevel: "molecule",
        props: {
          id: "app-router-basics",
          title: "App Router Basics",
          number: "01",
        },
      },
      {
        type: "atom.paragraph",
        atomicLevel: "atom",
        props: {
          content:
            "The Next.js App Router uses the file system to define routes. Each folder in app/ corresponds to a route segment.",
        },
      },
      {
        type: "molecule.sectionHeader",
        atomicLevel: "molecule",
        props: {
          id: "dynamic-routes",
          title: "Dynamic Routes",
          number: "02",
        },
      },
      {
        type: "molecule.codeBlock",
        atomicLevel: "molecule",
        props: {
          language: "typescript",
          code: "// app/documentation/[category]/[slug]/page.tsx\nexport default function Page({ params }) {\n  const { category, slug } = params;\n  return <DocumentationPage category={category} slug={slug} />;\n}",
          title: "Dynamic Route Example",
        },
      },
      {
        type: "molecule.infoBox",
        atomicLevel: "molecule",
        props: {
          type: "info",
          title: "Route Groups",
          content:
            "Use parentheses in folder names to create route groups that don't affect the URL structure.",
        },
      },
    ],
  },
  {
    meta: {
      slug: "state-management",
      title: "State Management & Data Flow",
      excerpt:
        "Strategy for managing application state using React hooks, Context API, and server state management patterns. Covers data fetching and caching.",
      category: "app-reference",
      audience: "Frontend Developer",
      publishedAt: "2026-02-08",
      lastUpdated: "2026-02-27",
      tags: ["state-management", "react", "hooks", "data-flow"],
    },
    seo: {
      metaTitle: "Frontend State Management & Data Flow Architecture",
      metaDescription:
        "Guide to managing component state, global state, and server state in React applications with hooks and Suspense.",
    },
    blocks: [
      {
        type: "molecule.sectionHeader",
        atomicLevel: "molecule",
        props: {
          id: "fundamentals",
          title: "State Management Fundamentals",
          number: "01",
        },
      },
      {
        type: "molecule.keyTakeaway",
        atomicLevel: "molecule",
        props: {
          points: [
            "Component state with useState for local UI state",
            "Context API for shared application state",
            "Server components for server state",
            "React Query for data synchronization",
          ],
        },
      },
      {
        type: "atom.paragraph",
        atomicLevel: "atom",
        props: {
          content:
            "Prefer keeping state as close to where it is used as possible. Only elevate state when multiple components need access.",
        },
      },
    ],
  },
];

export const mockAppReferenceDocument: AppReferenceDocument =
  mockAppReferenceDocuments[0];
