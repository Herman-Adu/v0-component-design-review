/**
 * Strapi Collection Type: Marketing Platform
 * Used by: All marketing platform overview pages (LinkedIn, Google, Facebook, Twitter)
 */

import { LucideIcon } from "lucide-react";

export interface MarketingPlatform {
  id: string;
  platform_name: string; // "LinkedIn", "Google", "Facebook", "Twitter"
  slug: string; // "linkedin", "google", "facebook", "twitter"
  tagline: string;
  description: string;
  icon: string; // Icon name as string, resolved to LucideIcon
  color: string; // Hex color code
  created_at: string;
  updated_at: string;

  // Relations
  tools: Tool[];
  strategy_phases: StrategyPhase[];
  platform_specs?: PlatformSpec[];
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  role: string;
  status: "Active" | "Beta" | "Coming Soon";
  href: string;
  icon: string; // Icon name as string
  category?: string;
  platform?: string;
  created_at: string;
  updated_at: string;
}

export interface StrategyPhase {
  id: string;
  title: string;
  description: string;
  items: string[]; // Array of checklist items
  phase_number: number;
  icon_theme?: "success" | "info" | "warning";
  platform?: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformSpec {
  id: string;
  spec_name: string;
  spec_value: string;
  platform: string;
  created_at: string;
  updated_at: string;
}

export interface ContentTemplate {
  id: string;
  name: string;
  description?: string;
  content: string;
  platform?: string;
  category?: string;
  created_at: string;
  updated_at: string;
}
