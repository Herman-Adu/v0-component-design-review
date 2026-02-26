import { z } from "zod";

const CASE_STUDY_LEVELS = ["beginner", "intermediate", "advanced"] as const;
const CASE_STUDY_CATEGORIES = [
  "refactoring",
  "performance",
  "security",
  "architecture",
  "business",
  "cms",
  "infrastructure",
  "rendering",
  "forms",
] as const;

const BLOCK_TYPE_ALIASES = [
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

const atomicLevelSchema = z.enum(["atom", "molecule", "organism"]);

const tocItemSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  level: z.number().int().positive(),
});

const blockSchema = z.object({
  type: z.string(),
  atomicLevel: atomicLevelSchema,
  props: z.record(z.unknown()).optional(),
});

export const caseStudyContentDocumentSchema = z.object({
  meta: z.object({
    slug: z.string().min(1),
    title: z.string().min(1),
    excerpt: z.string().min(1),
    level: z.enum(CASE_STUDY_LEVELS),
    category: z.enum(CASE_STUDY_CATEGORIES),
    readTime: z.string().min(1),
    publishedAt: z.string().min(1),
    tags: z.array(z.string()).min(1),
  }),
  layout: z.enum(["content-with-toc", "content-only"]),
  toc: z.array(tocItemSchema).optional(),
  blocks: z.array(blockSchema).min(1),
});
