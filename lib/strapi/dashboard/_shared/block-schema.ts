import { z } from "zod";

/**
 * Shared Block Schema
 *
 * Single source of truth for all content block types across:
 * - Articles
 * - Case Studies
 * - Guides
 * - Tutorials
 * - Documentation
 *
 * All content types use this same discriminated union to ensure
 * data quality, consistency, and maintainability.
 */

// ============================================================================
// Block Type Aliases
// ============================================================================

export const BLOCK_TYPE_ALIASES = [
  "atom.paragraph",
  "molecule.infoBox",
  "molecule.sectionHeader",
  "molecule.subSectionHeader",
  "molecule.codeBlock",
  "molecule.keyTakeaway",
  "organism.metricsGrid",
  "organism.featureGrid",
  "organism.comparisonCards",
  "organism.processFlow",
  "organism.stepFlow",
  "organism.statsTable",
  "organism.relatedArticles",
  "organism.architectureDiagram",
  "organism.fileTree",
  "organism.decisionTree",
  "organism.dataFlowDiagram",
  "organism.verticalFlow",
  "organism.beforeAfterComparison",
  "paragraph",
  "info-box",
  "section-header",
  "sub-section-header",
  "code-block",
  "key-takeaway",
  "metrics-grid",
  "feature-grid",
  "comparison-cards",
  "process-flow",
  "step-flow",
  "stats-table",
  "related-articles",
  "architecture-diagram",
  "file-tree",
  "decision-tree",
  "data-flow-diagram",
  "vertical-flow",
  "before-after-comparison",
  "numbered-list",
] as const;

// ============================================================================
// Atomic Level Schema
// ============================================================================

export const atomicLevelSchema = z.enum(["atom", "molecule", "organism"]);

// ============================================================================
// Helper Functions
// ============================================================================

const requireAny =
  (keys: string[], message: string) =>
  (props: Record<string, unknown>, ctx: z.RefinementCtx) => {
    const hasValue = keys.some((key) => {
      const value = props[key];
      return typeof value === "string" && value.trim().length > 0;
    });
    if (!hasValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message,
      });
    }
  };

// ============================================================================
// Individual Block Schemas
// ============================================================================

const infoBoxPropsSchema = z
  .object({
    variant: z
      .enum(["info", "warning", "tip", "important", "danger", "note", "success"])
      .optional(),
    type: z.enum(["info", "warning", "tip", "important", "danger", "note", "success"]).optional(),
    title: z.string().nullable().optional(),
    heading: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
    body: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
  })
  .superRefine(
    requireAny(
      ["content", "body", "text"],
      "InfoBox requires content/body/text.",
    ),
  );

const sectionHeaderPropsSchema = z.object({
  number: z.union([z.string(), z.number()]),
  title: z.string().min(1),
  id: z.string().nullable().optional(),
  anchorId: z.string().nullable().optional(),
  anchor: z.string().nullable().optional(),
});

const subSectionHeaderPropsSchema = z.object({
  title: z.string().min(1),
  id: z.string().nullable().optional(),
  anchorId: z.string().nullable().optional(),
  anchor: z.string().nullable().optional(),
});

const paragraphPropsSchema = z
  .object({
    content: z.string().optional(),
    text: z.string().optional(),
  })
  .superRefine(
    requireAny(["content", "text"], "Paragraph requires content/text."),
  );

const metricsGridPropsSchema = z.object({
  metrics: z
    .array(
      z.object({
        label: z.string().min(1),
        value: z.string().min(1),
        change: z.string().optional(),
        positive: z.boolean().optional(),
        description: z.string().optional(),
      }),
    )
    .min(1),
});

const featureGridItemSchema = z.object({
  icon: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  items: z.array(z.string()).optional(),
});

const featureGridPropsSchema = z.object({
  title: z.string().optional(),
  columns: z
    .union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)])
    .optional(),
  features: z.array(featureGridItemSchema).min(1).optional(),
  items: z.array(featureGridItemSchema).min(1).optional(),
}).superRefine((data, ctx) => {
  if (!data.features?.length && !data.items?.length) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "featureGrid requires either features or items array",
    });
  }
});

const comparisonCardsPropsSchema = z
  .object({
    idealFor: z.array(z.string()).optional(),
    notIdealFor: z.array(z.string()).optional(),
    idealTitle: z.string().optional(),
    notIdealTitle: z.string().optional(),
    leftTitle: z.string().optional(),
    leftItems: z.array(z.string()).optional(),
    rightTitle: z.string().optional(),
    rightItems: z.array(z.string()).optional(),
    leftType: z.enum(["positive", "negative"]).optional(),
    rightType: z.enum(["positive", "negative"]).optional(),
  })
  .superRefine((props, ctx) => {
    const hasLeft =
      (props.leftItems && props.leftItems.length > 0) ||
      (props.idealFor && props.idealFor.length > 0);
    const hasRight =
      (props.rightItems && props.rightItems.length > 0) ||
      (props.notIdealFor && props.notIdealFor.length > 0);
    if (!hasLeft || !hasRight) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "ComparisonCards requires both left and right items.",
      });
    }
  });

const processFlowPropsSchema = z.object({
  title: z.string().nullable().optional(),
  steps: z
    .array(
      z.union([
        z.object({
          label: z.string().min(1),
          sublabel: z.string().min(1),
          color: z.string().optional(),
        }),
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          duration: z.string().optional(),
        }),
      ]),
    )
    .min(1),
});

const stepFlowPropsSchema = z.object({
  title: z.string().nullable().optional(),
  steps: z
    .array(
      z.object({
        number: z
          .union([z.number().int().positive(), z.string().min(1)])
          .optional(),
        title: z.string().min(1).optional(),
        label: z.string().min(1).optional(),
        description: z.string().min(1),
      }),
    )
    .min(1),
});

const statsTablePropsSchema = z.union([
  z.object({
    title: z.string().nullable().optional(),
    headers: z.array(z.string().min(1)).min(1),
    rows: z.array(z.array(z.string().min(1))).min(1),
  }),
  z.object({
    title: z.string().nullable().optional(),
    description: z.string().optional(),
    stats: z
      .array(
        z.object({
          metric: z.string().min(1),
          value: z.string().min(1),
          context: z.string().optional(),
        }),
      )
      .min(1),
  }),
]);

const relatedArticlesPropsSchema = z
  .object({
    title: z.string().optional(),
    articles: z
      .array(
        z.object({
          title: z.string().min(1),
          href: z.string().optional(),
          slug: z.string().optional(),
          level: z.string().optional(),
        }),
      )
      .optional(),
    links: z
      .array(
        z.object({
          title: z.string().min(1),
          href: z.string().optional(),
          slug: z.string().optional(),
          level: z.string().optional(),
          description: z.string().optional(),
          icon: z.string().optional(),
        }),
      )
      .optional(),
  })
  .superRefine((props, ctx) => {
    const hasArticles = props.articles && props.articles.length > 0;
    const hasLinks = props.links && props.links.length > 0;
    if (!hasArticles && !hasLinks) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "RelatedArticles requires articles or links array.",
      });
    }
  });

const architectureDiagramPropsSchema = z.object({
  title: z.string().nullable().optional(),
  layers: z
    .array(
      z.object({
        name: z.string().min(1),
        items: z.array(z.string().min(1)).min(1),
        color: z.string().min(1),
      }),
    )
    .min(1),
});

const fileTreeItemSchema: z.ZodType<{
  name: string;
  type: "file" | "folder";
  highlight?: boolean;
  description?: string;
  children?: unknown;
}> = z.lazy(() =>
  z.object({
    name: z.string().min(1),
    type: z.enum(["file", "folder"]),
    highlight: z.boolean().optional(),
    description: z.string().optional(),
    children: z.array(fileTreeItemSchema).optional(),
  }),
);

const fileTreePropsSchema = z.object({
  title: z.string().nullable().optional(),
  items: z.array(fileTreeItemSchema).min(1),
});

const decisionTreePropsSchema = z.object({
  title: z.string().nullable().optional(),
  decisions: z
    .array(
      z.object({
        condition: z.string().min(1),
        result: z.string().min(1),
        recommended: z.boolean().optional(),
      }),
    )
    .min(1),
});

const dataFlowDiagramPropsSchema = z.union([
  z.object({
    title: z.string().nullable().optional(),
    flow: z.enum(["horizontal", "vertical"]).optional(),
    nodes: z
      .array(
        z.object({
          id: z.string().optional(),
          label: z.string().min(1),
          description: z.string().optional(),
          icon: z.string().optional(),
          items: z.array(z.string()).optional(),
        }),
      )
      .min(1),
  }),
  z.object({
    title: z.string().nullable().optional(),
    description: z.string().optional(),
    flow: z
      .array(
        z.object({
          stage: z.string().min(1),
          status: z.string().optional(),
          detail: z.string().optional(),
        }),
      )
      .min(1),
  }),
]);

const verticalFlowPropsSchema = z.object({
  title: z.string().nullable().optional(),
  steps: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        icon: z.string().optional(),
        number: z.union([z.string(), z.number()]).optional(),
      }),
    )
    .min(1),
});

const beforeAfterComparisonPropsSchema = z.object({
  title: z.string().nullable().optional(),
  before: z
    .object({
      title: z.string().nullable().optional(),
      label: z.string().nullable().optional(),
      items: z.array(z.string()).optional(),
      code: z.string().optional(),
    })
    .optional(),
  after: z
    .object({
      title: z.string().nullable().optional(),
      label: z.string().nullable().optional(),
      items: z.array(z.string()).optional(),
      code: z.string().optional(),
    })
    .optional(),
  beforeTitle: z.string().nullable().optional(),
  beforeCode: z.string().optional(),
  afterTitle: z.string().nullable().optional(),
  afterCode: z.string().optional(),
  beforeItems: z.array(z.string()).optional(),
  afterItems: z.array(z.string()).optional(),
  improvements: z
    .array(
      z.object({
        metric: z.string().min(1),
        before: z.string().min(1),
        after: z.string().min(1),
      }),
    )
    .optional(),
});

const numberedListPropsSchema = z.object({
  title: z.string().nullable().optional(),
  items: z
    .array(
      z.union([
        z.string().min(1),
        z.object({
          title: z.string().min(1),
          description: z.string().optional(),
        }),
      ]),
    )
    .min(1),
});

const codeBlockPropsSchema = z.object({
  code: z.string().min(1),
  language: z.string().optional(),
  filename: z.string().nullable().optional(),
  title: z.string().nullable().optional(),
  highlightLines: z.array(z.number().int().positive()).optional(),
});

const keyTakeawayPropsSchema = z
  .object({
    title: z.string().nullable().optional(),
    content: z.string().optional(),
    body: z.string().optional(),
    text: z.string().optional(),
    points: z.array(z.string()).optional(),
  })
  .superRefine((props, ctx) => {
    const hasText =
      (props.content && props.content.length > 0) ||
      (props.body && props.body.length > 0) ||
      (props.text && props.text.length > 0);
    const hasPoints = props.points && props.points.length > 0;
    if (!hasText && !hasPoints) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "KeyTakeaway requires content/body/text or points.",
      });
    }
  });

// ============================================================================
// Discriminated Union of All Block Types
// ============================================================================

export const blockSchema = z.union([
  z.object({
    type: z.union([z.literal("molecule.infoBox"), z.literal("info-box")]),
    atomicLevel: atomicLevelSchema,
    props: infoBoxPropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("molecule.sectionHeader"),
      z.literal("section-header"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: sectionHeaderPropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("molecule.subSectionHeader"),
      z.literal("sub-section-header"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: subSectionHeaderPropsSchema,
  }),
  z.object({
    type: z.union([z.literal("atom.paragraph"), z.literal("paragraph")]),
    atomicLevel: atomicLevelSchema,
    props: paragraphPropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("organism.metricsGrid"),
      z.literal("metrics-grid"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: metricsGridPropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("organism.featureGrid"),
      z.literal("feature-grid"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: featureGridPropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("organism.comparisonCards"),
      z.literal("comparison-cards"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: comparisonCardsPropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("organism.processFlow"),
      z.literal("process-flow"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: processFlowPropsSchema,
  }),
  z.object({
    type: z.union([z.literal("organism.stepFlow"), z.literal("step-flow")]),
    atomicLevel: atomicLevelSchema,
    props: stepFlowPropsSchema,
  }),
  z.object({
    type: z.union([z.literal("organism.statsTable"), z.literal("stats-table")]),
    atomicLevel: atomicLevelSchema,
    props: statsTablePropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("organism.relatedArticles"),
      z.literal("related-articles"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: relatedArticlesPropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("organism.architectureDiagram"),
      z.literal("architecture-diagram"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: architectureDiagramPropsSchema,
  }),
  z.object({
    type: z.union([z.literal("organism.fileTree"), z.literal("file-tree")]),
    atomicLevel: atomicLevelSchema,
    props: fileTreePropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("organism.decisionTree"),
      z.literal("decision-tree"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: decisionTreePropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("organism.dataFlowDiagram"),
      z.literal("data-flow-diagram"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: dataFlowDiagramPropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("organism.verticalFlow"),
      z.literal("vertical-flow"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: verticalFlowPropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("organism.beforeAfterComparison"),
      z.literal("before-after-comparison"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: beforeAfterComparisonPropsSchema,
  }),
  z.object({
    type: z.literal("numbered-list"),
    atomicLevel: atomicLevelSchema,
    props: numberedListPropsSchema,
  }),
  z.object({
    type: z.union([z.literal("molecule.codeBlock"), z.literal("code-block")]),
    atomicLevel: atomicLevelSchema,
    props: codeBlockPropsSchema,
  }),
  z.object({
    type: z.union([
      z.literal("molecule.keyTakeaway"),
      z.literal("key-takeaway"),
    ]),
    atomicLevel: atomicLevelSchema,
    props: keyTakeawayPropsSchema,
  }),
]);

export type Block = z.infer<typeof blockSchema>;

/**
 * ContentBlock — renderer-compatible block type used in view models and ContentBlockRenderer.
 * Permissive shape with index signature for dynamic property access at render time.
 * All validated Block values are assignable to this type.
 */
export type ContentBlock = {
  type: string;
  atomicLevel?: "atom" | "molecule" | "organism";
  props?: Record<string, unknown>;
  [key: string]: unknown;
};
