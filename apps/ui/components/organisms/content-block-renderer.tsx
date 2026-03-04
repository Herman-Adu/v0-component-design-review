/**
 * CONTENT BLOCK RENDERER - SINGLE SOURCE OF TRUTH
 *
 * This is the UNIFIED GENERIC RENDERER for ALL block content across the application.
 * It handles block rendering for:
 * - Documentation (strategic-overview, infrastructure-ops, cms-reference, app-reference)
 * - Content Library (articles, guides, tutorials, case-studies)
 *
 * ARCHITECTURAL DECISION:
 * Block rendering is a cross-cutting concern, not domain-specific. Any changes to block
 * types, styling, or logic must be made in THIS FILE ONLY to avoid DRY violations.
 *
 * The renderer uses BLOCK_TYPE_ALIASES to normalize both documentation formats
 * (block.paragraph, block.callout) and content-library formats (atom.paragraph,
 * molecule.infoBox) to a unified set of switch cases.
 *
 * IMPORTANT:
 * - Do NOT create duplicate renderers for new page types or domains
 * - Do NOT import from documentation-block-renderer or article-block-renderer (deleted)
 * - All pages must use ContentBlockRenderer directly
 * - Content block type definitions (ArticleContentBlock, GuideContentBlock, etc.)
 *   must include [key: string]: unknown index signature for type compatibility
 *
 * @see lib/strapi/dashboard/content-library/articles/article-content-builder.ts (ArticleContentBlock type)
 * @see lib/strapi/dashboard/content-library/guides/guide-content-builder.ts (GuideContentBlock type)
 * @see lib/strapi/dashboard/content-library/tutorials/tutorial-content-builder.ts (TutorialContentBlock type)
 * @see lib/strapi/dashboard/content-library/case-studies/case-study-content-builder.ts (CaseStudyContentBlock type)
 */

"use client";

import React from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink } from "lucide-react";

import type { ContentBlock } from "@/lib/strapi/dashboard/_shared/block-schema";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  "block.paragraph": "paragraph",
  "block.sectionHeader": "section-header",
  "block.list": "list",
  "block.callout": "info-box",
  "block.codeBlock": "code-block",
  "block.featureGrid": "feature-grid",
  "block.statsTable": "stats-table",
  "block.card": "card",
  "block.collapsible": "collapsible",
  "block.linkCard": "link-card",
};

const normalizeBlockType = (type: string) => BLOCK_TYPE_ALIASES[type] ?? type;

const normalizeBlockProps = (
  block: Record<string, unknown>,
): Record<string, unknown> => {
  if (
    block.props &&
    typeof block.props === "object" &&
    !Array.isArray(block.props)
  ) {
    return block.props as Record<string, unknown>;
  }

  const { type: _type, atomicLevel: _atomicLevel, ...rest } = block;
  return rest;
};

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
        const rawBlock = block as Record<string, unknown>;
        const normalizedType = normalizeBlockType(String(rawBlock.type ?? ""));
        const props = normalizeBlockProps(rawBlock);

        switch (normalizedType) {
          case "info-box": {
            const calloutType = getString(props, ["calloutType"], "");
            const calloutToVariant: Record<
              string,
              "info" | "warning" | "tip" | "important" | "danger"
            > = {
              info: "info",
              warning: "warning",
              success: "tip",
              error: "danger",
            };
            const variant =
              calloutToVariant[calloutType] ??
              ((props.variant || props.type) as
                | "info"
                | "warning"
                | "tip"
                | "important"
                | "danger"
                | undefined);
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
            const className = getString(
              props,
              ["className"],
              "text-muted-foreground mb-4",
            );
            return (
              <p key={index} className={className}>
                {content}
              </p>
            );
          }
          case "list": {
            const ordered = Boolean(props.ordered);
            const items = getArray<string>(props.items);
            const ListTag = ordered ? "ol" : "ul";
            const listClass = ordered
              ? "list-decimal list-inside space-y-2 text-foreground"
              : "list-disc list-inside space-y-2 text-foreground";
            return (
              <ListTag key={index} className={listClass}>
                {items.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ListTag>
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
            const stats = getArray<{
              label: string;
              value: string;
              change?: string;
            }>(props.stats);
            const headers =
              stats.length > 0
                ? ["Metric", "Value", "Change"]
                : getArray<string>(props.headers);
            const rows =
              stats.length > 0
                ? stats.map((stat) => [
                    stat.label,
                    stat.value,
                    stat.change ?? "",
                  ])
                : getArray<string[]>(props.rows);
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
          case "card": {
            const variant = getString(props, ["variant"], "default");
            const variantClass =
              variant === "accent"
                ? "border-accent/30 bg-accent/5"
                : variant === "muted"
                  ? "bg-muted/50"
                  : "";
            const title = getString(props, ["title"], "");
            const description = getString(props, ["description"], "");
            const content = getString(props, ["content", "text", "body"], "");
            const icon = getString(props, ["icon"], "");
            return (
              <Card key={index} className={variantClass}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {icon ? (
                      <div className="text-accent">
                        {resolveArticleIcon(icon)}
                      </div>
                    ) : null}
                    <div className="flex-1">
                      <CardTitle>{title}</CardTitle>
                      {description ? (
                        <CardDescription>{description}</CardDescription>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {content}
                  </p>
                </CardContent>
              </Card>
            );
          }
          case "collapsible": {
            const title = getString(props, ["title"], "");
            const content = getString(props, ["content", "text", "body"], "");
            const defaultOpen = Boolean(props.defaultOpen);
            return (
              <Collapsible key={index} defaultOpen={defaultOpen}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors group">
                  <span className="font-medium text-foreground">{title}</span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-4">
                  <div className="prose prose-sm max-w-none text-foreground">
                    {content}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          }
          case "link-card": {
            const href = getString(props, ["href"], "#");
            const external = Boolean(props.external);
            const title = getString(props, ["title"], "");
            const description = getString(props, ["description"], "");
            const icon = getString(props, ["icon"], "");
            return (
              <Link
                key={index}
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="block group"
              >
                <Card className="hover:border-accent/50 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      {icon ? (
                        <div className="text-accent">
                          {resolveArticleIcon(icon)}
                        </div>
                      ) : null}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="group-hover:text-accent transition-colors">
                            {title}
                          </CardTitle>
                          {external ? (
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          ) : null}
                        </div>
                        {description ? (
                          <CardDescription>{description}</CardDescription>
                        ) : null}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          }
          default:
            return null;
        }
      })}
    </>
  );
}
