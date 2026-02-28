// Re-export everything from the content builder
export {
  getArticleList,
  getArticleContentDocument,
  getAllArticleContentSlugs,
  type ArticleLevel,
  type ArticleCategory,
  type Article,
  type ArticleContentBlock,
  type ArticleContentMeta,
  type ArticleContentDocument,
} from "@/lib/strapi/dashboard/content-library/articles/article-content-builder";

export type ArticleBlockType =
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

export type ArticleBlockLevel = "atom" | "molecule" | "organism";
