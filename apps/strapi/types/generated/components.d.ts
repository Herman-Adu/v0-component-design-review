import type { Schema, Struct } from '@strapi/strapi';

export interface AtomParagraph extends Struct.ComponentSchema {
  collectionName: 'components_atom_paragraphs';
  info: {
    description: 'Atom: paragraph block with text content';
    displayName: 'Paragraph';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'atom'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'atom.paragraph'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface MoleculeCodeBlock extends Struct.ComponentSchema {
  collectionName: 'components_molecule_code_blocks';
  info: {
    description: 'Molecule: syntax-highlighted code snippet';
    displayName: 'Code Block';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'molecule'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'molecule.codeBlock'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface MoleculeInfoBox extends Struct.ComponentSchema {
  collectionName: 'components_molecule_info_boxes';
  info: {
    description: 'Molecule: info/warning/tip/note callout box';
    displayName: 'Info Box';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'molecule'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'molecule.infoBox'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface MoleculeKeyTakeaway extends Struct.ComponentSchema {
  collectionName: 'components_molecule_key_takeaways';
  info: {
    description: 'Molecule: highlighted key learning point';
    displayName: 'Key Takeaway';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'molecule'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'molecule.keyTakeaway'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface MoleculeSectionHeader extends Struct.ComponentSchema {
  collectionName: 'components_molecule_section_headers';
  info: {
    description: 'Molecule: numbered section heading';
    displayName: 'Section Header';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'molecule'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'molecule.sectionHeader'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface MoleculeSubSectionHeader extends Struct.ComponentSchema {
  collectionName: 'components_molecule_sub_section_headers';
  info: {
    description: 'Molecule: sub-section heading';
    displayName: 'Sub Section Header';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'molecule'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'molecule.subSectionHeader'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismArchitectureDiagram extends Struct.ComponentSchema {
  collectionName: 'components_organism_architecture_diagrams';
  info: {
    description: 'Organism: system architecture visualization';
    displayName: 'Architecture Diagram';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.architectureDiagram'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismBeforeAfterComparison extends Struct.ComponentSchema {
  collectionName: 'components_organism_before_after_comparisons';
  info: {
    description: 'Organism: side-by-side before/after contrast';
    displayName: 'Before After Comparison';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.beforeAfterComparison'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismComparisonCards extends Struct.ComponentSchema {
  collectionName: 'components_organism_comparison_cards';
  info: {
    description: 'Organism: ideal-for vs not-ideal-for comparison';
    displayName: 'Comparison Cards';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.comparisonCards'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismDataFlowDiagram extends Struct.ComponentSchema {
  collectionName: 'components_organism_data_flow_diagrams';
  info: {
    description: 'Organism: data pipeline or flow visualization';
    displayName: 'Data Flow Diagram';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.dataFlowDiagram'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismDecisionTree extends Struct.ComponentSchema {
  collectionName: 'components_organism_decision_trees';
  info: {
    description: 'Organism: branching decision flowchart';
    displayName: 'Decision Tree';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.decisionTree'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismFeatureGrid extends Struct.ComponentSchema {
  collectionName: 'components_organism_feature_grids';
  info: {
    description: 'Organism: grid of feature cards with icons and descriptions';
    displayName: 'Feature Grid';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.featureGrid'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismFileTree extends Struct.ComponentSchema {
  collectionName: 'components_organism_file_trees';
  info: {
    description: 'Organism: directory/file structure visualization';
    displayName: 'File Tree';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.fileTree'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismMetricsGrid extends Struct.ComponentSchema {
  collectionName: 'components_organism_metrics_grids';
  info: {
    description: 'Organism: grid of KPI metrics with labels and values';
    displayName: 'Metrics Grid';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.metricsGrid'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismProcessFlow extends Struct.ComponentSchema {
  collectionName: 'components_organism_process_flows';
  info: {
    description: 'Organism: sequential process steps diagram';
    displayName: 'Process Flow';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.processFlow'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismRelatedArticles extends Struct.ComponentSchema {
  collectionName: 'components_organism_related_articles';
  info: {
    description: 'Organism: links to related content';
    displayName: 'Related Articles';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.relatedArticles'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismStatsTable extends Struct.ComponentSchema {
  collectionName: 'components_organism_stats_tables';
  info: {
    description: 'Organism: structured data table with statistics';
    displayName: 'Stats Table';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.statsTable'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismStepFlow extends Struct.ComponentSchema {
  collectionName: 'components_organism_step_flows';
  info: {
    description: 'Organism: numbered step-by-step guide';
    displayName: 'Step Flow';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.stepFlow'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface OrganismVerticalFlow extends Struct.ComponentSchema {
  collectionName: 'components_organism_vertical_flows';
  info: {
    description: 'Organism: vertical sequence of connected steps';
    displayName: 'Vertical Flow';
  };
  attributes: {
    atomicLevel: Schema.Attribute.Enumeration<
      ['atom', 'molecule', 'organism']
    > &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism'>;
    blockType: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'organism.verticalFlow'>;
    props: Schema.Attribute.JSON & Schema.Attribute.Required;
  };
}

export interface SharedAccess extends Struct.ComponentSchema {
  collectionName: 'components_shared_accesses';
  info: {
    description: 'Authorization and visibility rules';
    displayName: 'Access Control';
  };
  attributes: {
    requiredRoles: Schema.Attribute.String;
    requiresAuth: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    visibleToPublic: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<true>;
  };
}

export interface SharedMeta extends Struct.ComponentSchema {
  collectionName: 'components_shared_metas';
  info: {
    description: 'Document metadata (title, slug, excerpt, category, level, publication)';
    displayName: 'Meta';
  };
  attributes: {
    category: Schema.Attribute.String;
    excerpt: Schema.Attribute.Text & Schema.Attribute.Required;
    level: Schema.Attribute.Enumeration<
      ['beginner', 'intermediate', 'advanced']
    > &
      Schema.Attribute.DefaultTo<'intermediate'>;
    publishedAt: Schema.Attribute.DateTime;
    readTime: Schema.Attribute.String;
    slug: Schema.Attribute.String & Schema.Attribute.Required;
    tags: Schema.Attribute.Text;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface SharedRoute extends Struct.ComponentSchema {
  collectionName: 'components_shared_routes';
  info: {
    description: 'Dynamic route metadata for sitemap generation';
    displayName: 'Route';
  };
  attributes: {
    params: Schema.Attribute.JSON;
    pattern: Schema.Attribute.String;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO metadata fields';
    displayName: 'SEO';
  };
  attributes: {
    canonicalUrl: Schema.Attribute.String;
    keywords: Schema.Attribute.String;
    metaDescription: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    metaTitle: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    preventIndexing: Schema.Attribute.Boolean &
      Schema.Attribute.DefaultTo<false>;
    robots: Schema.Attribute.String;
  };
}

export interface SharedTocItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_toc_items';
  info: {
    description: 'Table of contents entry';
    displayName: 'TOC Item';
  };
  attributes: {
    anchor: Schema.Attribute.String & Schema.Attribute.Required;
    level: Schema.Attribute.Integer &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'atom.paragraph': AtomParagraph;
      'molecule.code-block': MoleculeCodeBlock;
      'molecule.info-box': MoleculeInfoBox;
      'molecule.key-takeaway': MoleculeKeyTakeaway;
      'molecule.section-header': MoleculeSectionHeader;
      'molecule.sub-section-header': MoleculeSubSectionHeader;
      'organism.architecture-diagram': OrganismArchitectureDiagram;
      'organism.before-after-comparison': OrganismBeforeAfterComparison;
      'organism.comparison-cards': OrganismComparisonCards;
      'organism.data-flow-diagram': OrganismDataFlowDiagram;
      'organism.decision-tree': OrganismDecisionTree;
      'organism.feature-grid': OrganismFeatureGrid;
      'organism.file-tree': OrganismFileTree;
      'organism.metrics-grid': OrganismMetricsGrid;
      'organism.process-flow': OrganismProcessFlow;
      'organism.related-articles': OrganismRelatedArticles;
      'organism.stats-table': OrganismStatsTable;
      'organism.step-flow': OrganismStepFlow;
      'organism.vertical-flow': OrganismVerticalFlow;
      'shared.access': SharedAccess;
      'shared.meta': SharedMeta;
      'shared.route': SharedRoute;
      'shared.seo': SharedSeo;
      'shared.toc-item': SharedTocItem;
    }
  }
}
