"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Block } from "@/lib/strapi/dashboard/documentation/strategic-overview/strategic-overview-schema";
import {
  InfoBox,
  SectionHeader,
  CodeBlock,
  FeatureGrid,
  StatsTable,
} from "@/components/molecules/article-components";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { ArticleIcons } from "@/components/molecules/article-components";

/**
 * Documentation Block Renderer
 *
 * Renders documentation-specific block types following the strategic-overview schema.
 * Maps documentation blocks to existing content-library components where possible.
 *
 * Block Type Mapping:
 * - block.paragraph → <p>
 * - block.sectionHeader → SectionHeader (from article-components)
 * - block.list → <ul>/<ol>
 * - block.callout → InfoBox (from article-components)
 * - block.codeBlock → CodeBlock (from article-components)
 * - block.featureGrid → FeatureGrid (from article-components)
 * - block.statsTable → StatsTable (from article-components)
 * - block.card → Card (shadcn/ui)
 * - block.collapsible → Collapsible (shadcn/ui)
 * - block.linkCard → Custom Link Card component
 */

const resolveIcon = (icon?: string | null) => {
  if (!icon) return undefined;

  const iconMap: Record<string, React.ReactNode> = {
    database: <ArticleIcons.Database className="h-5 w-5" />,
    code: <ArticleIcons.Code className="h-5 w-5" />,
    shield: <ArticleIcons.Shield className="h-5 w-5" />,
    zap: <ArticleIcons.Zap className="h-5 w-5" />,
    layers: <ArticleIcons.Layers className="h-5 w-5" />,
    check: <ArticleIcons.Check className="h-5 w-5" />,
    rocket: <ArticleIcons.Zap className="h-5 w-5" />,
    lightbulb: <ArticleIcons.Lightbulb className="h-5 w-5" />,
    target: <ArticleIcons.Target className="h-5 w-5" />,
    users: <ArticleIcons.Users className="h-5 w-5" />,
    clock: <ArticleIcons.Clock className="h-5 w-5" />,
    star: <ArticleIcons.Star className="h-5 w-5" />,
  };

  const normalizedIcon = icon.toLowerCase().replace(/[-_]/g, "");
  return iconMap[normalizedIcon];
};

export function DocumentationBlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "block.paragraph": {
            return (
              <p
                key={index}
                className={
                  block.className ?? "text-base text-foreground leading-relaxed"
                }
              >
                {block.content}
              </p>
            );
          }

          case "block.sectionHeader": {
            return (
              <SectionHeader
                key={index}
                number={block.number ?? ""}
                title={block.title}
                id={block.id}
              />
            );
          }

          case "block.list": {
            const ListTag = block.ordered ? "ol" : "ul";
            const listClass = block.ordered
              ? "list-decimal list-inside space-y-2 text-foreground"
              : "list-disc list-inside space-y-2 text-foreground";

            return (
              <ListTag key={index} className={listClass}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="leading-relaxed">
                    {item}
                  </li>
                ))}
              </ListTag>
            );
          }

          case "block.callout": {
            const typeMap: Record<
              typeof block.calloutType,
              "info" | "warning" | "tip" | "important" | "danger"
            > = {
              info: "info",
              warning: "warning",
              success: "tip",
              error: "danger",
            };

            return (
              <InfoBox
                key={index}
                type={typeMap[block.calloutType]}
                title={block.title}
              >
                {block.content}
              </InfoBox>
            );
          }

          case "block.codeBlock": {
            return (
              <CodeBlock
                key={index}
                filename={block.title}
                language={block.language}
                code={block.code}
              />
            );
          }

          case "block.featureGrid": {
            const features = block.features.map((feature) => ({
              ...feature,
              icon: resolveIcon(feature.icon),
            }));

            return <FeatureGrid key={index} features={features} columns={3} />;
          }

          case "block.statsTable": {
            // StatsTable from article-components expects different format
            // Need to adapt documentation stats to article stats format
            const statsRows: string[][] = block.stats.map((stat) => [
              stat.label,
              stat.value,
              stat.change ?? "",
            ]);

            return (
              <StatsTable
                key={index}
                title={block.title}
                headers={["Metric", "Value", "Change"]}
                rows={statsRows}
              />
            );
          }

          case "block.card": {
            const variantClass =
              block.variant === "accent"
                ? "border-accent/30 bg-accent/5"
                : block.variant === "muted"
                  ? "bg-muted/50"
                  : "";

            return (
              <Card key={index} className={variantClass}>
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {block.icon && (
                      <div className="text-accent">
                        {resolveIcon(block.icon)}
                      </div>
                    )}
                    <div className="flex-1">
                      <CardTitle>{block.title}</CardTitle>
                      {block.description && (
                        <CardDescription>{block.description}</CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {block.content}
                  </p>
                </CardContent>
              </Card>
            );
          }

          case "block.collapsible": {
            return (
              <Collapsible key={index} defaultOpen={block.defaultOpen ?? false}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-muted/50 hover:bg-muted rounded-lg transition-colors group">
                  <span className="font-medium text-foreground">
                    {block.title}
                  </span>
                  <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4 px-4">
                  <div className="prose prose-sm max-w-none text-foreground">
                    {block.content}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          }

          case "block.linkCard": {
            return (
              <Link
                key={index}
                href={block.href}
                target={block.external ? "_blank" : undefined}
                rel={block.external ? "noopener noreferrer" : undefined}
                className="block group"
              >
                <Card className="hover:border-accent/50 transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      {block.icon && (
                        <div className="text-accent">
                          {resolveIcon(block.icon)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="group-hover:text-accent transition-colors">
                            {block.title}
                          </CardTitle>
                          {block.external && (
                            <ExternalLink className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <CardDescription>{block.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            );
          }

          default: {
            // Type-safe exhaustiveness check
            const _exhaustive: never = block;
            console.warn("Unknown block type:", _exhaustive);
            return null;
          }
        }
      })}
    </div>
  );
}
