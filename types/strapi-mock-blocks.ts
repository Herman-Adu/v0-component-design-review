/**
 * Auto-generated Block Type Definitions
 * Generated from actual JSON structure analysis
 * Extends: STRAPI_DYNAMIC_ZONES_AUTHORITY.md
 */

// Base block interface - all blocks must have type & atomicLevel
export interface BaseBlock {
  type: string;                    // Discriminator (e.g., "molecule.infoBox")
  atomicLevel?: "atom" | "molecule" | "organism";  // Atomic design level
  id?: string;                     // Optional anchor ID
}

// Specific block type definitions (discriminated union members)

export interface ArchitectureDiagram extends BaseBlock {
  type: "architecture-diagram";
  props: {
    layers?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface AtomParagraph extends BaseBlock {
  type: "atom.paragraph";
  props: {
    content?: unknown;  // Inferred from data
    text?: unknown;  // Inferred from data
  };
}

export interface BeforeAfterComparison extends BaseBlock {
  type: "before-after-comparison";
  props: {
    after?: unknown;  // Inferred from data
    before?: unknown;  // Inferred from data
  };
}

export interface CodeBlock extends BaseBlock {
  type: "code-block";
  props: {
    code?: unknown;  // Inferred from data
    filename?: unknown;  // Inferred from data
    language?: unknown;  // Inferred from data
  };
}

export interface ComparisonCards extends BaseBlock {
  type: "comparison-cards";
  props: {
    leftItems?: unknown;  // Inferred from data
    leftTitle?: unknown;  // Inferred from data
    leftType?: unknown;  // Inferred from data
    rightItems?: unknown;  // Inferred from data
    rightTitle?: unknown;  // Inferred from data
    rightType?: unknown;  // Inferred from data
  };
}

export interface DataFlowDiagram extends BaseBlock {
  type: "data-flow-diagram";
  props: {
    flow?: unknown;  // Inferred from data
    nodes?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface FeatureGrid extends BaseBlock {
  type: "feature-grid";
  props: {
    columns?: unknown;  // Inferred from data
    features?: unknown;  // Inferred from data
  };
}

export interface FileTree extends BaseBlock {
  type: "file-tree";
  props: {
    items?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface InfoBox extends BaseBlock {
  type: "info-box";
  props: {
    content?: unknown;  // Inferred from data
    variant?: unknown;  // Inferred from data
  };
}

export interface KeyTakeaway extends BaseBlock {
  type: "key-takeaway";
  props: {
    content?: unknown;  // Inferred from data
    points?: unknown;  // Inferred from data
  };
}

export interface MetricsGrid extends BaseBlock {
  type: "metrics-grid";
  props: {
    metrics?: unknown;  // Inferred from data
  };
}

export interface MoleculeCodeblock extends BaseBlock {
  type: "molecule.codeBlock";
  props: {
    code?: unknown;  // Inferred from data
    filename?: unknown;  // Inferred from data
    language?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface MoleculeInfobox extends BaseBlock {
  type: "molecule.infoBox";
  props: {
    body?: unknown;  // Inferred from data
    content?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
    type?: unknown;  // Inferred from data
    variant?: unknown;  // Inferred from data
  };
}

export interface MoleculeKeytakeaway extends BaseBlock {
  type: "molecule.keyTakeaway";
  props: {
    body?: unknown;  // Inferred from data
    content?: unknown;  // Inferred from data
    points?: unknown;  // Inferred from data
    text?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface MoleculeSectionheader extends BaseBlock {
  type: "molecule.sectionHeader";
  props: {
    id?: unknown;  // Inferred from data
    number?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface MoleculeSubsectionheader extends BaseBlock {
  type: "molecule.subSectionHeader";
  props: {
    id?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface OrganismArchitecturediagram extends BaseBlock {
  type: "organism.architectureDiagram";
  props: {
    layers?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface OrganismBeforeaftercomparison extends BaseBlock {
  type: "organism.beforeAfterComparison";
  props: {
    afterCode?: unknown;  // Inferred from data
    afterItems?: unknown;  // Inferred from data
    afterTitle?: unknown;  // Inferred from data
    beforeCode?: unknown;  // Inferred from data
    beforeItems?: unknown;  // Inferred from data
    beforeTitle?: unknown;  // Inferred from data
    improvements?: unknown;  // Inferred from data
  };
}

export interface OrganismComparisoncards extends BaseBlock {
  type: "organism.comparisonCards";
  props: {
    idealFor?: unknown;  // Inferred from data
    idealTitle?: unknown;  // Inferred from data
    leftItems?: unknown;  // Inferred from data
    leftTitle?: unknown;  // Inferred from data
    leftType?: unknown;  // Inferred from data
    notIdealFor?: unknown;  // Inferred from data
    notIdealTitle?: unknown;  // Inferred from data
    rightItems?: unknown;  // Inferred from data
    rightTitle?: unknown;  // Inferred from data
    rightType?: unknown;  // Inferred from data
  };
}

export interface OrganismDataflowdiagram extends BaseBlock {
  type: "organism.dataFlowDiagram";
  props: {
    description?: unknown;  // Inferred from data
    flow?: unknown;  // Inferred from data
    nodes?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface OrganismDecisiontree extends BaseBlock {
  type: "organism.decisionTree";
  props: {
    decisions?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface OrganismFeaturegrid extends BaseBlock {
  type: "organism.featureGrid";
  props: {
    columns?: unknown;  // Inferred from data
    features?: unknown;  // Inferred from data
    items?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface OrganismFiletree extends BaseBlock {
  type: "organism.fileTree";
  props: {
    items?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface OrganismMetricsgrid extends BaseBlock {
  type: "organism.metricsGrid";
  props: {
    metrics?: unknown;  // Inferred from data
  };
}

export interface OrganismProcessflow extends BaseBlock {
  type: "organism.processFlow";
  props: {
    steps?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface OrganismRelatedarticles extends BaseBlock {
  type: "organism.relatedArticles";
  props: {
    articles?: unknown;  // Inferred from data
  };
}

export interface OrganismStatstable extends BaseBlock {
  type: "organism.statsTable";
  props: {
    description?: unknown;  // Inferred from data
    headers?: unknown;  // Inferred from data
    rows?: unknown;  // Inferred from data
    stats?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface OrganismStepflow extends BaseBlock {
  type: "organism.stepFlow";
  props: {
    steps?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface OrganismVerticalflow extends BaseBlock {
  type: "organism.verticalFlow";
  props: {
    steps?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface Paragraph extends BaseBlock {
  type: "paragraph";
  props: {
    content?: unknown;  // Inferred from data
  };
}

export interface RelatedArticles extends BaseBlock {
  type: "related-articles";
  props: {
    articles?: unknown;  // Inferred from data
  };
}

export interface SectionHeader extends BaseBlock {
  type: "section-header";
  props: {
    anchorId?: unknown;  // Inferred from data
    number?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface StatsTable extends BaseBlock {
  type: "stats-table";
  props: {
    headers?: unknown;  // Inferred from data
    rows?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface SubSectionHeader extends BaseBlock {
  type: "sub-section-header";
  props: {
    id?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

export interface VerticalFlow extends BaseBlock {
  type: "vertical-flow";
  props: {
    steps?: unknown;  // Inferred from data
    title?: unknown;  // Inferred from data
  };
}

// Discriminated union of all block types
export type Block =
  ArchitectureDiagram
  | AtomParagraph
  | BeforeAfterComparison
  | CodeBlock
  | ComparisonCards
  | DataFlowDiagram
  | FeatureGrid
  | FileTree
  | InfoBox
  | KeyTakeaway
  | MetricsGrid
  | MoleculeCodeblock
  | MoleculeInfobox
  | MoleculeKeytakeaway
  | MoleculeSectionheader
  | MoleculeSubsectionheader
  | OrganismArchitecturediagram
  | OrganismBeforeaftercomparison
  | OrganismComparisoncards
  | OrganismDataflowdiagram
  | OrganismDecisiontree
  | OrganismFeaturegrid
  | OrganismFiletree
  | OrganismMetricsgrid
  | OrganismProcessflow
  | OrganismRelatedarticles
  | OrganismStatstable
  | OrganismStepflow
  | OrganismVerticalflow
  | Paragraph
  | RelatedArticles
  | SectionHeader
  | StatsTable
  | SubSectionHeader
  | VerticalFlow;

// Helper: Type-safe block discriminator
export function isBlockType<T extends Block>(
  block: Block,
  type: T["type"]
): block is T {
  return block.type === type;
}
