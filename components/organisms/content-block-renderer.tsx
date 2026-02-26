"use client";

import React from "react";

import type { ArticleContentBlock } from "@/lib/strapi/dashboard/content-library/articles/article-content";
import {
  ArchitectureDiagram,
  ArticleIcons,
  BeforeAfterComparison,
  ComparisonCards,
  CodeBlock,
  DataFlowDiagram,
  DecisionTree,
  FeatureGrid,
  FileTree,
  InfoBox,
  KeyTakeaway,
  MetricsGrid,
  NumberedList,
  ProcessFlow,
  RelatedArticles,
  SectionHeader,
  StatsTable,
  StepFlow,
  SubSectionHeader,
  VerticalFlow,
} from "@/components/molecules/article-components";

export type ContentBlock = {
  type: string;
  atomicLevel: "atom" | "molecule" | "organism";
  props?: Record<string, unknown>;
};

const BLOCK_TYPE_ALIASES: Record<string, string> = {
  "atom.paragraph": "paragraph",
  "molecule.infoBox": "info-box",
  "molecule.sectionHeader": "section-header",
  "molecule.subSectionHeader": "sub-section-header",
  "molecule.codeBlock": "code-block",
  "molecule.keyTakeaway": "key-takeaway",
  "organism.metricsGrid": "metrics-grid",
  "organism.featureGrid": "feature-grid",
  "organism.comparisonCards": "comparison-cards",
  "organism.processFlow": "process-flow",
  "organism.stepFlow": "step-flow",
  "organism.statsTable": "stats-table",
  "organism.relatedArticles": "related-articles",
  "organism.architectureDiagram": "architecture-diagram",
  "organism.fileTree": "file-tree",
  "organism.decisionTree": "decision-tree",
  "organism.dataFlowDiagram": "data-flow-diagram",
  "organism.verticalFlow": "vertical-flow",
  "organism.beforeAfterComparison": "before-after-comparison",
};

const normalizeBlockType = (type: string) => BLOCK_TYPE_ALIASES[type] ?? type;

const getString = (
  props: Record<string, unknown> | undefined,
  keys: string[],
  fallback = "",
) => {
  if (!props) return fallback;
  for (const key of keys) {
    const value = props[key];
    if (typeof value === "string") return value;
  }
  return fallback;
};

const getNumber = (
  props: Record<string, unknown> | undefined,
  keys: string[],
  fallback?: number,
) => {
  if (!props) return fallback;
  for (const key of keys) {
    const value = props[key];
    if (typeof value === "number") return value;
  }
  return fallback;
};

const getArray = <T,>(value: unknown, fallback: T[] = []): T[] =>
  Array.isArray(value) ? (value as T[]) : fallback;

const resolveArticleIcon = (icon?: string | null) => {
  if (!icon) return undefined;

  // Direct mapping of icon names to Lucide icons
  const iconMap: Record<string, React.ReactNode> = {
    zap: <ArticleIcons.Zap className="h-5 w-5" />,
    layers: <ArticleIcons.Layers className="h-5 w-5" />,
    code: <ArticleIcons.Code className="h-5 w-5" />,
    target: <ArticleIcons.Target className="h-5 w-5" />,
    check: <ArticleIcons.Check className="h-5 w-5" />,
    "check-circle": <ArticleIcons.CheckCircle className="h-5 w-5" />,
    x: <ArticleIcons.X className="h-5 w-5" />,
    "x-circle": <ArticleIcons.X className="h-5 w-5" />,
    info: <ArticleIcons.Info className="h-5 w-5" />,
    alert: <ArticleIcons.AlertTriangle className="h-5 w-5" />,
    lightbulb: <ArticleIcons.Lightbulb className="h-5 w-5" />,
    star: <ArticleIcons.Star className="h-5 w-5" />,
    folder: <ArticleIcons.Folder className="h-5 w-5" />,
    file: <ArticleIcons.File className="h-5 w-5" />,
    "file-text": <ArticleIcons.FileText className="h-5 w-5" />,
    database: <ArticleIcons.Database className="h-5 w-5" />,
    "git-branch": <ArticleIcons.GitBranch className="h-5 w-5" />,
    shield: <ArticleIcons.Shield className="h-5 w-5" />,
    clock: <ArticleIcons.Clock className="h-5 w-5" />,
    users: <ArticleIcons.Users className="h-5 w-5" />,
    user: <ArticleIcons.User className="h-5 w-5" />,
    "trending-up": <ArticleIcons.TrendingUp className="h-5 w-5" />,
    wrench: <ArticleIcons.Tool className="h-5 w-5" />,
    calendar: <ArticleIcons.Calendar className="h-5 w-5" />,
  };

  return (
    iconMap[icon.toLowerCase()] || <ArticleIcons.Code className="h-5 w-5" />
  );
};

export function ContentBlockRenderer({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const normalizedType = normalizeBlockType(block.type);
        const props = (block.props ?? {}) as Record<string, unknown>;

        switch (normalizedType) {
          case "info-box": {
            const variant = (props.variant || props.type) as
              | "info"
              | "warning"
              | "tip"
              | "important"
              | "danger"
              | undefined;
            const title = getString(props, ["title", "heading"], "");
            const content = getString(props, ["content", "body", "text"], "");
            return (
              <InfoBox key={index} type={variant} title={title || undefined}>
                {content}
              </InfoBox>
            );
          }
          case "section-header": {
            const number = props.number ?? props.step ?? "";
            const title = getString(props, ["title", "heading"], "");
            const id = getString(props, ["id", "anchorId", "anchor"], "");
            return (
              <SectionHeader
                key={index}
                number={number as string | number}
                title={title}
                id={id || undefined}
              />
            );
          }
          case "sub-section-header": {
            const title = getString(props, ["title", "heading"], "");
            const id = getString(props, ["id", "anchorId", "anchor"], "");
            return (
              <SubSectionHeader
                key={index}
                title={title}
                id={id || undefined}
              />
            );
          }
          case "paragraph": {
            const content = getString(props, ["content", "text"], "");
            return (
              <p key={index} className="text-muted-foreground mb-4">
                {content}
              </p>
            );
          }
          case "metrics-grid": {
            const metrics = getArray<{
              label: string;
              value: string;
              change?: string;
              positive?: boolean;
              description?: string;
            }>(props.metrics);
            return <MetricsGrid key={index} metrics={metrics} />;
          }
          case "feature-grid": {
            const features = getArray<Record<string, unknown>>(
              props.features,
            ).map((feature) => ({
              ...feature,
              icon:
                typeof feature.icon === "string"
                  ? resolveArticleIcon(feature.icon)
                  : feature.icon,
            })) as Array<{
              icon?: React.ReactNode;
              title: string;
              description: string;
              items?: string[];
            }>;
            const columns = getNumber(props, ["columns"], 3) as
              | 2
              | 3
              | 4
              | undefined;
            return (
              <FeatureGrid
                key={index}
                columns={columns ?? 3}
                features={features}
              />
            );
          }
          case "comparison-cards": {
            const {
              idealFor,
              notIdealFor,
              idealTitle,
              notIdealTitle,
              leftTitle,
              leftItems,
              rightTitle,
              rightItems,
              leftType,
              rightType,
            } = props as Record<string, unknown>;
            return (
              <ComparisonCards
                key={index}
                idealFor={idealFor as string[] | undefined}
                notIdealFor={notIdealFor as string[] | undefined}
                idealTitle={idealTitle as string | undefined}
                notIdealTitle={notIdealTitle as string | undefined}
                leftTitle={leftTitle as string | undefined}
                leftItems={leftItems as string[] | undefined}
                rightTitle={rightTitle as string | undefined}
                rightItems={rightItems as string[] | undefined}
                leftType={leftType as "positive" | "negative" | undefined}
                rightType={rightType as "positive" | "negative" | undefined}
              />
            );
          }
          case "code-block": {
            const filename = getString(props, ["filename", "title"], "");
            const language = getString(props, ["language"], "typescript");
            const code = getString(props, ["code"], "");
            const highlightLines = props.highlightLines as number[] | undefined;
            return (
              <CodeBlock
                key={index}
                filename={filename || undefined}
                language={language}
                code={code}
                highlightLines={highlightLines}
              />
            );
          }
          case "process-flow": {
            const title = getString(props, ["title"], "");
            const steps = getArray<{ label: string; sublabel: string }>(
              props.steps,
            );
            return (
              <ProcessFlow
                key={index}
                title={title || undefined}
                steps={steps}
              />
            );
          }
          case "stats-table": {
            const title = getString(props, ["title"], "");
            const headers = getArray<string>(props.headers);
            const rows = getArray<string[]>(props.rows);
            return (
              <StatsTable
                key={index}
                title={title || undefined}
                headers={headers}
                rows={rows}
              />
            );
          }
          case "key-takeaway": {
            const title = getString(props, ["title"], "");
            const content = getString(props, ["content", "body", "text"], "");
            const points = getArray<string>(props.points);
            return (
              <KeyTakeaway
                key={index}
                title={title || undefined}
                points={points.length > 0 ? points : undefined}
              >
                {content}
              </KeyTakeaway>
            );
          }
          case "related-articles": {
            const articles = getArray<{
              title: string;
              href?: string;
              slug?: string;
              level?: string;
            }>(props.articles);
            return <RelatedArticles key={index} articles={articles} />;
          }
          case "step-flow": {
            const title = getString(props, ["title"], "");
            const steps = getArray<{
              number: number;
              title: string;
              description: string;
            }>(props.steps);
            return (
              <StepFlow key={index} title={title || undefined} steps={steps} />
            );
          }
          case "architecture-diagram": {
            const title = getString(props, ["title"], "");
            const layers = getArray<{
              name: string;
              items: string[];
              color: string;
            }>(props.layers);
            return (
              <ArchitectureDiagram key={index} title={title} layers={layers} />
            );
          }
          case "file-tree": {
            const title = getString(props, ["title"], "");
            const items = getArray<{
              name: string;
              type: "file" | "folder";
              highlight?: boolean;
              children?: Array<{
                name: string;
                type: "file" | "folder";
                highlight?: boolean;
                description?: string;
              }>;
              description?: string;
            }>(props.items);
            return <FileTree key={index} title={title} items={items} />;
          }
          case "decision-tree": {
            const title = getString(props, ["title"], "");
            const decisions = getArray<{
              condition: string;
              result: string;
              recommended?: boolean;
            }>(props.decisions);
            return (
              <DecisionTree
                key={index}
                title={title || undefined}
                decisions={decisions}
              />
            );
          }
          case "data-flow-diagram": {
            const title = getString(props, ["title"], "");
            const nodes = getArray<Record<string, unknown>>(props.nodes).map(
              (node) => ({
                ...node,
                icon:
                  typeof node.icon === "string"
                    ? resolveArticleIcon(node.icon)
                    : node.icon,
              }),
            ) as Array<{
              id?: string;
              label: string;
              description?: string;
              icon?: React.ReactNode;
              items?: string[];
            }>;
            return (
              <DataFlowDiagram
                key={index}
                title={title || undefined}
                nodes={nodes}
              />
            );
          }
          case "vertical-flow": {
            const title = getString(props, ["title"], "");
            const steps = getArray<Record<string, unknown>>(props.steps).map(
              (step) => ({
                ...step,
                icon:
                  typeof step.icon === "string"
                    ? resolveArticleIcon(step.icon)
                    : step.icon,
              }),
            ) as Array<{
              title: string;
              description: string;
              icon?: React.ReactNode;
            }>;
            return (
              <VerticalFlow
                key={index}
                title={title || undefined}
                steps={steps}
              />
            );
          }
          case "before-after-comparison": {
            const {
              title,
              before,
              after,
              beforeTitle,
              beforeCode,
              afterTitle,
              afterCode,
              beforeItems,
              afterItems,
              improvements,
            } = props as Record<string, unknown>;
            return (
              <BeforeAfterComparison
                key={index}
                title={title as string | undefined}
                before={
                  before as
                    | {
                        title?: string;
                        label?: string;
                        items?: string[];
                        code?: string;
                      }
                    | undefined
                }
                after={
                  after as
                    | {
                        title?: string;
                        label?: string;
                        items?: string[];
                        code?: string;
                      }
                    | undefined
                }
                beforeTitle={beforeTitle as string | undefined}
                beforeCode={beforeCode as string | undefined}
                afterTitle={afterTitle as string | undefined}
                afterCode={afterCode as string | undefined}
                beforeItems={beforeItems as string[] | undefined}
                afterItems={afterItems as string[] | undefined}
                improvements={
                  improvements as
                    | { metric: string; before: string; after: string }[]
                    | undefined
                }
              />
            );
          }
          case "numbered-list": {
            const title = getString(props, ["title"], "");
            const items = getArray<
              string | { title: string; description?: string }
            >(props.items);
            return (
              <NumberedList
                key={index}
                title={title || undefined}
                items={items}
              />
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
}
