import type { Schema, Struct } from '@strapi/strapi';

export interface AdminCtaBlock extends Struct.ComponentSchema {
  collectionName: 'components_admin_cta_blocks';
  info: {
    description: 'Call-to-action card with a single navigation link';
    displayName: 'CTA Block';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    linkHref: Schema.Attribute.String & Schema.Attribute.Required;
    linkIcon: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'ArrowRight'>;
    linkText: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdminEcosystemPhase extends Struct.ComponentSchema {
  collectionName: 'components_admin_ecosystem_phases';
  info: {
    description: 'A marketing funnel phase (Attract / Convert / Measure)';
    displayName: 'Ecosystem Phase';
  };
  attributes: {
    description: Schema.Attribute.String & Schema.Attribute.Required;
    items: Schema.Attribute.JSON;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdminEmailStaff extends Struct.ComponentSchema {
  collectionName: 'components_admin_email_staffs';
  info: {
    description: 'Staff member who receives email notifications for a recipient group';
    displayName: 'Email Staff';
    icon: 'user';
  };
  attributes: {
    email: Schema.Attribute.Email & Schema.Attribute.Required;
    isActive: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    role: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdminHighlightItem extends Struct.ComponentSchema {
  collectionName: 'components_admin_highlight_items';
  info: {
    description: 'A key capability or highlight item for management overview pages';
    displayName: 'Highlight Item';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    itemId: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdminNoticeBlock extends Struct.ComponentSchema {
  collectionName: 'components_admin_notice_blocks';
  info: {
    description: 'Callout-style notice: warning, info, success, error';
    displayName: 'Notice Block';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String;
    noticeType: Schema.Attribute.Enumeration<
      ['warning', 'info', 'success', 'error']
    > &
      Schema.Attribute.DefaultTo<'info'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdminPageSection extends Struct.ComponentSchema {
  collectionName: 'components_admin_page_sections';
  info: {
    description: 'A navigable section card for management overview pages';
    displayName: 'Page Section';
  };
  attributes: {
    color: Schema.Attribute.Enumeration<
      [
        'emerald',
        'violet',
        'amber',
        'blue',
        'red',
        'green',
        'indigo',
        'orange',
        'pink',
        'slate',
      ]
    > &
      Schema.Attribute.DefaultTo<'slate'>;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    pages: Schema.Attribute.Integer;
    role: Schema.Attribute.String;
    sectionId: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdminPlatformCard extends Struct.ComponentSchema {
  collectionName: 'components_admin_platform_cards';
  info: {
    description: 'A marketing platform card (Google, LinkedIn, Twitter, Facebook)';
    displayName: 'Platform Card';
  };
  attributes: {
    badge: Schema.Attribute.String;
    badgeColor: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    iconColor: Schema.Attribute.String;
    pageItems: Schema.Attribute.Component<'admin.platform-page-item', true>;
    platformId: Schema.Attribute.String & Schema.Attribute.Required;
    status: Schema.Attribute.Enumeration<['Active', 'Coming Soon', 'Beta']> &
      Schema.Attribute.DefaultTo<'Coming Soon'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdminPlatformPageItem extends Struct.ComponentSchema {
  collectionName: 'components_admin_platform_page_items';
  info: {
    description: 'A page label inside a platform card';
    displayName: 'Platform Page Item';
  };
  attributes: {
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    itemLabel: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdminQuickLink extends Struct.ComponentSchema {
  collectionName: 'components_admin_quick_links';
  info: {
    description: 'A quick navigation link for management overview pages';
    displayName: 'Quick Link';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    linkId: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdminQuickStat extends Struct.ComponentSchema {
  collectionName: 'components_admin_quick_stats';
  info: {
    description: "Dashboard stat card. Use source='content-library' for runtime-computed values.";
    displayName: 'Quick Stat';
  };
  attributes: {
    description: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    source: Schema.Attribute.String;
    statId: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.DefaultTo<'dynamic'>;
  };
}

export interface AdminSectionHeader extends Struct.ComponentSchema {
  collectionName: 'components_admin_section_headers';
  info: {
    description: 'Page header: icon name (Lucide), title, description';
    displayName: 'Section Header';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 200;
      }>;
  };
}

export interface AdminToolItem extends Struct.ComponentSchema {
  collectionName: 'components_admin_tool_items';
  info: {
    description: 'Link card to a tool or feature page within an admin section';
    displayName: 'Tool Item';
  };
  attributes: {
    badge: Schema.Attribute.String;
    badgeColor: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    href: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    itemId: Schema.Attribute.String & Schema.Attribute.Required;
    status: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Available'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface AdminToolSection extends Struct.ComponentSchema {
  collectionName: 'components_admin_tool_sections';
  info: {
    description: 'Grouped set of tool link cards with a section header';
    displayName: 'Tool Section';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    sectionId: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    tools: Schema.Attribute.Component<'admin.tool-item', true>;
  };
}

export interface AdminUpcomingFeature extends Struct.ComponentSchema {
  collectionName: 'components_admin_upcoming_features';
  info: {
    description: 'Dimmed feature preview card shown in the upcoming features section';
    displayName: 'Upcoming Feature';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    featureId: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.String & Schema.Attribute.Required;
    status: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Coming Soon'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

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
    audience: Schema.Attribute.String;
    category: Schema.Attribute.String;
    excerpt: Schema.Attribute.Text & Schema.Attribute.Required;
    lastUpdated: Schema.Attribute.DateTime;
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
      'admin.cta-block': AdminCtaBlock;
      'admin.ecosystem-phase': AdminEcosystemPhase;
      'admin.email-staff': AdminEmailStaff;
      'admin.highlight-item': AdminHighlightItem;
      'admin.notice-block': AdminNoticeBlock;
      'admin.page-section': AdminPageSection;
      'admin.platform-card': AdminPlatformCard;
      'admin.platform-page-item': AdminPlatformPageItem;
      'admin.quick-link': AdminQuickLink;
      'admin.quick-stat': AdminQuickStat;
      'admin.section-header': AdminSectionHeader;
      'admin.tool-item': AdminToolItem;
      'admin.tool-section': AdminToolSection;
      'admin.upcoming-feature': AdminUpcomingFeature;
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
