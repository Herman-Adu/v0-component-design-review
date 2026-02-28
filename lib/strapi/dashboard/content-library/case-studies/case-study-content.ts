// Re-export everything from the content builder
export {
  getCaseStudyList,
  getCaseStudyContentDocument,
  getAllCaseStudyContentSlugs,
  type CaseStudyLevel,
  type CaseStudyCategory,
  type CaseStudy,
  type CaseStudyContentBlock,
  type CaseStudyContentMeta,
  type CaseStudyContentDocument,
} from "@/lib/strapi/dashboard/content-library/case-studies/case-study-content-builder";

export type CaseStudyBlockType =
  | "atom.paragraph"
  | "molecule.infoBox"
  | "molecule.sectionHeader"
  | "molecule.subSectionHeader"
  | "molecule.codeBlock"
  | "molecule.keyTakeaway"
  | "organism.metricsGrid"
  | "organism.featureGrid"
  | "organism.comparisonCards"
  | "organism.processFlow"
  | "organism.stepFlow"
  | "organism.statsTable"
  | "organism.relatedArticles"
  | "organism.architectureDiagram"
  | "organism.fileTree"
  | "organism.decisionTree"
  | "organism.dataFlowDiagram"
  | "organism.verticalFlow"
  | "organism.beforeAfterComparison"
  | "paragraph"
  | "info-box"
  | "section-header"
  | "sub-section-header"
  | "code-block"
  | "key-takeaway"
  | "metrics-grid"
  | "feature-grid"
  | "comparison-cards"
  | "process-flow"
  | "step-flow"
  | "stats-table"
  | "related-articles"
  | "architecture-diagram"
  | "file-tree"
  | "decision-tree"
  | "data-flow-diagram"
  | "vertical-flow"
  | "before-after-comparison"
  | "numbered-list";

export type CaseStudyBlockLevel = "atom" | "molecule" | "organism";
