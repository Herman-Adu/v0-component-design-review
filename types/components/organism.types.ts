/**
 * Component Prop Types: Organisms
 * Complex components composed of multiple molecules
 */

import { Tool, StrategyPhase } from "@/types/strapi/marketing-platform.types";
import { Metric } from "@/types/strapi/metric.types";
import { SetupStep } from "@/types/strapi/setup-step.types";
import {
  ContentTemplate,
  HashtagGroup,
  FormatType,
} from "@/types/strapi/template.types";

export interface ToolGridProps {
  tools: Tool[];
  variant?: "quick-access" | "detailed" | "compact";
  columns?: 2 | 3 | 6;
  title?: string;
}

export interface StrategyFlowProps {
  phases: StrategyPhase[];
  theme?: "primary" | "secondary";
  title?: string;
}

export interface MetricsDashboardProps {
  metrics: Metric[];
  layout?: "2-col" | "3-col" | "6-col";
  title?: string;
  showTargets?: boolean;
}

export interface SetupWizardProps {
  steps: SetupStep[];
  title: string;
  onComplete?: () => void;
}

export interface ContentComposerProps {
  maxChars: number;
  templates: ContentTemplate[];
  formatTypes: FormatType[];
  hashtags?: HashtagGroup[];
  platform: string;
}

export interface MetricsGridProps {
  metrics: import("@/types/strapi/analytics.types").MetricDefinition[];
  accentColorClass?: string;
  columns?: 2 | 3;
  className?: string;
}

export interface ChecklistCardProps {
  title: string;
  items: import("@/types/strapi/analytics.types").ChecklistItem[];
  accentColorClass?: string;
  icon?: import("lucide-react").LucideIcon;
  className?: string;
}
