import type { ArticleContentBlock } from "@/lib/strapi/article-content";

export const sampleArticleBlocks: ArticleContentBlock[] = [
  {
    type: "info-box",
    atomicLevel: "molecule",
    props: {
      variant: "info",
      title: "Sample Callout",
      content:
        "This is a sample info box rendered by the block renderer component.",
    },
  },
  {
    type: "section-header",
    atomicLevel: "organism",
    props: {
      number: "01",
      title: "Overview",
      anchorId: "overview",
    },
  },
  {
    type: "paragraph",
    atomicLevel: "atom",
    props: {
      content:
        "This harness demonstrates every supported block type in a single render pass.",
    },
  },
  {
    type: "metrics-grid",
    atomicLevel: "molecule",
    props: {
      metrics: [
        {
          label: "Blocks",
          value: "20",
          change: "All supported",
          positive: true,
        },
        {
          label: "Render Mode",
          value: "Dynamic",
          change: "JSON-driven",
          positive: true,
        },
        {
          label: "Coverage",
          value: "100%",
          change: "Registry aligned",
          positive: true,
        },
      ],
    },
  },
  {
    type: "feature-grid",
    atomicLevel: "organism",
    props: {
      columns: 3,
      features: [
        {
          icon: "layers",
          title: "Atomic Composition",
          description: "Blocks map cleanly to atoms, molecules, and organisms.",
          items: ["Type-safe", "Reusable", "Composable"],
        },
        {
          icon: "shield",
          title: "Server-first",
          description: "JSON documents resolve on the server only.",
          items: ["Secure", "Deterministic", "Fast"],
        },
        {
          icon: "code",
          title: "Extensible",
          description: "Add new block types without touching routes.",
          items: ["Alias support", "Prop normalization", "Future proof"],
        },
      ],
    },
  },
  {
    type: "comparison-cards",
    atomicLevel: "molecule",
    props: {
      leftTitle: "JSON Blocks",
      leftItems: ["Single source of truth", "CMS aligned", "Composable"],
      leftType: "positive",
      rightTitle: "Hardcoded TSX",
      rightItems: ["Harder to scale", "Duplicate logic", "Manual updates"],
      rightType: "negative",
    },
  },
  {
    type: "sub-section-header",
    atomicLevel: "molecule",
    props: {
      title: "Implementation Sample",
      anchorId: "implementation-sample",
    },
  },
  {
    type: "code-block",
    atomicLevel: "molecule",
    props: {
      filename: "content-block-renderer.tsx",
      language: "typescript",
      code: "<ContentBlockRenderer blocks={document.blocks} />",
    },
  },
  {
    type: "process-flow",
    atomicLevel: "organism",
    props: {
      title: "Content Rendering Flow",
      steps: [
        { label: "Fetch", sublabel: "Get JSON document" },
        { label: "Normalize", sublabel: "Alias + props" },
        { label: "Render", sublabel: "Compose blocks" },
      ],
    },
  },
  {
    type: "stats-table",
    atomicLevel: "organism",
    props: {
      title: "Coverage",
      headers: ["Block Type", "Status", "Notes"],
      rows: [
        ["info-box", "Ready", "Variant + title supported"],
        ["data-flow-diagram", "Ready", "Icon resolution enabled"],
        ["numbered-list", "Ready", "Mixed item types"],
      ],
    },
  },
  {
    type: "key-takeaway",
    atomicLevel: "organism",
    props: {
      title: "Key Takeaway",
      content:
        "The renderer is a pure, reusable orchestrator that keeps data and presentation cleanly separated.",
    },
  },
  {
    type: "related-articles",
    atomicLevel: "organism",
    props: {
      articles: [
        {
          title: "Server/Client Boundaries",
          href: "/dashboard/content-library/articles/architecture/server-client-boundaries",
        },
        {
          title: "Architecture Principles",
          href: "/dashboard/content-library/articles/architecture/atomic-design-principles",
        },
      ],
    },
  },
  {
    type: "step-flow",
    atomicLevel: "organism",
    props: {
      title: "Adoption Steps",
      steps: [
        {
          number: 1,
          title: "Define Block",
          description: "Add JSON block definition in Strapi content.",
        },
        {
          number: 2,
          title: "Render",
          description: "Renderer maps block to UI component.",
        },
        {
          number: 3,
          title: "Validate",
          description: "Ensure block appears correctly in UI.",
        },
      ],
    },
  },
  {
    type: "architecture-diagram",
    atomicLevel: "organism",
    props: {
      title: "Rendering Architecture",
      layers: [
        {
          name: "Data",
          items: ["Strapi JSON", "Registry"],
          color: "#3b82f6",
        },
        {
          name: "Orchestration",
          items: ["Block Renderer", "Prop Normalization"],
          color: "#22c55e",
        },
        {
          name: "Presentation",
          items: ["Atoms", "Molecules", "Organisms"],
          color: "#f59e0b",
        },
      ],
    },
  },
  {
    type: "file-tree",
    atomicLevel: "organism",
    props: {
      title: "Article Structure",
      items: [
        {
          name: "data/",
          type: "folder",
          children: [
            {
              name: "strapi-mock/",
              type: "folder",
              children: [
                {
                  name: "articles/",
                  type: "folder",
                  children: [
                    { name: "architecture/", type: "folder" },
                    { name: "best-practices/", type: "folder" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    type: "decision-tree",
    atomicLevel: "organism",
    props: {
      title: "Block Decision",
      decisions: [
        {
          condition: "Need a callout?",
          result: "Use info-box",
          recommended: true,
        },
        {
          condition: "Need a comparison?",
          result: "Use comparison-cards",
        },
      ],
    },
  },
  {
    type: "data-flow-diagram",
    atomicLevel: "organism",
    props: {
      title: "Runtime Flow",
      nodes: [
        { label: "JSON", description: "Static data" },
        { label: "Renderer", description: "Maps blocks" },
        { label: "UI", description: "Components" },
      ],
    },
  },
  {
    type: "vertical-flow",
    atomicLevel: "organism",
    props: {
      title: "Governance",
      steps: [
        {
          title: "Separation of Concerns",
          description: "Data and rendering stay decoupled.",
          icon: "layers",
        },
        {
          title: "Type Safety",
          description: "Block types are enforced in the registry.",
          icon: "shield",
        },
        {
          title: "Extensibility",
          description: "New blocks added with minimal impact.",
          icon: "code",
        },
      ],
    },
  },
  {
    type: "before-after-comparison",
    atomicLevel: "organism",
    props: {
      title: "Before vs After",
      before: {
        title: "Before",
        items: ["Hardcoded TSX", "Duplicated logic"],
      },
      after: {
        title: "After",
        items: ["JSON-driven", "Single renderer"],
      },
      improvements: [
        { metric: "Scalability", before: "Low", after: "High" },
        { metric: "Maintainability", before: "Medium", after: "High" },
      ],
    },
  },
  {
    type: "numbered-list",
    atomicLevel: "molecule",
    props: {
      title: "Checklist",
      items: [
        "Define blocks in Strapi",
        "Register JSON content",
        "Render via block renderer",
      ],
    },
  },
];
