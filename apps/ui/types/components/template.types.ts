/**
 * Component Prop Types: Page Templates
 * Full page layouts that compose organisms
 */

import {
  Tool,
  StrategyPhase,
  PlatformSpec,
} from "@/types/strapi/marketing-platform.types";
import { Metric, Goal, Report } from "@/types/strapi/metric.types";
import { SetupStep } from "@/types/strapi/setup-step.types";
import {
  ContentTemplate,
  HashtagGroup,
  FormatType,
} from "@/types/strapi/template.types";
import {
  DocSection,
  DocBadge,
  DocMeta,
} from "@/types/strapi/documentation.types";
import { LucideIcon } from "lucide-react";

export interface MarketingPlatformTemplateProps {
  platform: string;
  icon: LucideIcon;
  color: string;
  tagline: string;
  description: string;
  tools: Tool[];
  strategy: StrategyPhase[];
  specs?: PlatformSpec[];
}

export interface AnalyticsPageTemplateProps {
  title: string;
  description?: string;
  platform: string;
  accentColorClass: string;
  setup?: SetupStep[];
  metrics: import("@/types/strapi/analytics.types").MetricDefinition[];
  reportingCadence?: import("@/types/strapi/analytics.types").ReportingCadence[];
  contentComparison?: import("@/types/strapi/analytics.types").ContentComparison[];
  checklist?: import("@/types/strapi/analytics.types").ChecklistItem[];
  tips?: import("@/types/strapi/analytics.types").TipBlock[];
}

export interface ComposerPageTemplateProps {
  platform: string;
  maxChars: number;
  templates: ContentTemplate[];
  formatTypes: FormatType[];
  hashtags?: HashtagGroup[];
}

export interface DocumentationPageTemplateProps {
  title: string;
  sections: DocSection[];
  badges?: DocBadge[];
  meta?: DocMeta[];
  children?: React.ReactNode;
}
