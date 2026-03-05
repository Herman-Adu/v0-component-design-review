import {
  BarChart3,
  Database,
  FileCheck,
  Home,
  LayoutGrid,
  Rocket,
  TrendingUp,
} from "lucide-react";

import type { NavSection } from "../types";

export const strategicOverviewSection: NavSection = {
  title: "Strategic Overview",
  icon: BarChart3,
  items: [
    { href: "/dashboard/documentation/strategic-overview/overview", label: "Overview", icon: Home },
    { href: "/dashboard/documentation/strategic-overview/system-vision", label: "System Vision", icon: Database },
    { href: "/dashboard/documentation/strategic-overview/why-strapi", label: "Why Strapi (CTO)", icon: TrendingUp },
    { href: "/dashboard/documentation/strategic-overview/getting-started-overview", label: "Getting Started", icon: Rocket },
    { href: "/dashboard/documentation/strategic-overview/app-overview", label: "App Overview", icon: LayoutGrid },
    { href: "/dashboard/documentation/strategic-overview/code-review-log", label: "Code Review Log", icon: FileCheck },
  ],
};
