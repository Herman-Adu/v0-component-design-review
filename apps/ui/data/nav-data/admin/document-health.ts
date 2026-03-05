import {
  ClipboardCheck,
  Compass,
  FileCheck,
  FlaskConical,
  HeartPulse,
  Link2,
  Rocket,
  SearchCheck,
  Wrench,
} from "lucide-react";

import type { NavItem, NavSection } from "../types";

const DA = "/dashboard/admin/document-health";

export const docAdminHealth: NavItem[] = [
  { href: `${DA}/documentation-health`, label: "Overview", icon: HeartPulse },
  { href: `${DA}/documentation-health/gap-analysis`, label: "Gap Discovery Engine", icon: Compass },
];

export const docAdminQualityEngineering: NavItem[] = [
  { href: `${DA}/quality-engineering`, label: "Overview", icon: FlaskConical },
  { href: `${DA}/quality-engineering/count-validation`, label: "Count Validation", icon: SearchCheck },
  { href: `${DA}/quality-engineering/route-verification`, label: "Route Verification", icon: Link2 },
  { href: `${DA}/quality-engineering/toc-integrity`, label: "TOC Integrity", icon: ClipboardCheck },
  { href: `${DA}/quality-engineering/pattern-compliance`, label: "Pattern Compliance", icon: FileCheck },
  { href: `${DA}/quality-engineering/fix-actions`, label: "Fix Actions", icon: Wrench },
];

export const documentAdministrationSection: NavSection = {
  title: "Document Health",
  icon: HeartPulse,
  items: [
    { href: DA, label: "Overview", icon: HeartPulse },
    { href: `${DA}/getting-started`, label: "Getting Started", icon: Rocket },
    {
      href: `${DA}/documentation-health`,
      label: "Documentation Health",
      icon: HeartPulse,
      children: docAdminHealth,
    },
    {
      href: `${DA}/quality-engineering`,
      label: "Quality Engineering",
      icon: FlaskConical,
      children: docAdminQualityEngineering,
    },
  ],
};

// Legacy aliases for backward compatibility
export const docHealthSection = documentAdministrationSection;
export const docQASection = documentAdministrationSection;
