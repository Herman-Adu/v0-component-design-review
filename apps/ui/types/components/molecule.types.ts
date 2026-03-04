/**
 * Component Prop Types: Molecules
 * Single-purpose molecular components composed of atoms
 */

import type { LucideIcon } from "lucide-react";
import type {
  Tool,
  StrategyPhase,
} from "@/types/strapi/marketing-platform.types";
import type { Metric } from "@/types/strapi/metric.types";
import type { SetupStep } from "@/types/strapi/setup-step.types";
import type { ContentTemplate } from "@/types/strapi/template.types";

export interface ToolCardProps {
  tool: Tool;
  variant?: "compact" | "detailed";
  showStatus?: boolean;
}

export interface StrategyPhaseCardProps {
  phase: StrategyPhase;
  showNumber?: boolean;
  iconTheme?: "success" | "info" | "warning";
}

export interface MetricCardProps {
  metric: Metric;
  showValue?: boolean;
  showTarget?: boolean;
}

export interface SetupStepCardProps {
  step: SetupStep;
  showNumber?: boolean;
  onComplete?: () => void;
}

export interface TemplateCardProps {
  template: ContentTemplate;
  onUse: (template: ContentTemplate) => void;
  showTags?: boolean;
}

export interface PlatformSpecCardProps {
  platform: string;
  specs: Array<{ spec: string; value: string }>;
  variant?: "default" | "compact";
}

export interface WhyPlatformCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  accentColorClass: string;
  className?: string;
}

export interface BackNavigationCardProps {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accentColorClass?: string;
  className?: string;
}

export interface PlatformHeaderProps {
  name: string;
  tagline: string;
  icon: LucideIcon;
  accentColorClass: string;
  focusLabel: string;
  toolCount: number;
  badges?: Array<{ label: string; variant?: string; colorClass?: string }>;
  className?: string;
}

export interface ReportingCadenceCardProps {
  cadence: import("@/types/strapi/analytics.types").ReportingCadence;
  accentColorClass?: string;
  className?: string;
}

export interface ContentComparisonTableProps {
  rows: import("@/types/strapi/analytics.types").ContentComparison[];
  className?: string;
}
